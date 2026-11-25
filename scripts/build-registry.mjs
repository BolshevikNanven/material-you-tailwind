// Generates registry.json from the component sources, docs and globals.css.
// `shadcn build` then inlines file contents and writes public/r.
import { readFile, readdir, rm, writeFile } from 'node:fs/promises'
import postcss from 'postcss'
import ts from 'typescript'

const namespace = '@material-you'
const docsDir = 'src/content/components'
const names = (await readdir(docsDir))
    .filter(file => file.endsWith('.mdx'))
    .map(file => file.slice(0, -4))
    .sort()
const pkg = JSON.parse(await readFile('package.json', 'utf8'))
const versions = { ...pkg.dependencies, ...pkg.devDependencies }

function versioned(name) {
    if (!versions[name]) throw new Error(`Missing package version for ${name}`)
    return `${name}@${versions[name]}`
}

async function themeItem() {
    const css = postcss.parse(await readFile('src/app/globals.css', 'utf8'))
    function variables(block) {
        if (!block) throw new Error('Missing Material theme block in globals.css')
        return Object.fromEntries(
            block.nodes
                .filter(node => node.type === 'decl')
                .map(node => [node.prop.slice(2), node.value.replace(/\s+/g, ' ')]),
        )
    }
    return {
        name: 'material-theme',
        type: 'registry:theme',
        title: 'Material You theme',
        description: 'Material color roles, elevation shadows, icons and animations for Tailwind CSS v4.',
        dependencies: ['tw-animate-css', '@iconify/tailwind4', '@iconify-json/material-symbols'].map(versioned),
        cssVars: {
            theme: variables(
                css.nodes.find(node => node.type === 'atrule' && node.name === 'theme' && node.params === 'inline'),
            ),
            light: variables(css.nodes.find(node => node.selector === ':root')),
            dark: variables(css.nodes.find(node => node.selector === '.dark')),
        },
        css: {
            '@import "tw-animate-css"': {},
            '@plugin "@iconify/tailwind4"': {},
        },
    }
}

async function componentItem(name) {
    const path = `src/components/ui/${name}.tsx`
    const content = await readFile(path, 'utf8')
    const doc = await readFile(`${docsDir}/${name}.mdx`, 'utf8')
    const source = ts.createSourceFile(path, content, ts.ScriptTarget.Latest)
    const dependencies = new Set()
    const registryDependencies = new Set([`${namespace}/material-theme`])
    for (const statement of source.statements.filter(ts.isImportDeclaration)) {
        const specifier = statement.moduleSpecifier.text
        if (specifier === 'react' || specifier === '@/lib/utils') continue
        if (specifier.startsWith('./')) {
            const sibling = specifier.slice(2)
            if (!names.includes(sibling)) throw new Error(`Unknown registry import ${specifier} in ${path}`)
            registryDependencies.add(`${namespace}/${sibling}`)
        } else if (specifier.startsWith('@/')) {
            throw new Error(`Unsupported alias import ${specifier} in ${path}, use a relative import`)
        } else {
            dependencies.add(specifier)
        }
    }
    return {
        name,
        type: 'registry:ui',
        title: doc.match(/^title: (.+)$/m)[1],
        description: doc.match(/^description: (.+)$/m)[1].replace(/^(['"])(.*)\1$/, '$2'),
        dependencies: [...dependencies].map(versioned),
        ...(dependencies.has('flubber') && { devDependencies: [versioned('@types/flubber')] }),
        registryDependencies: [...registryDependencies],
        files: [{ path, type: 'registry:ui' }],
    }
}

const registry = {
    $schema: 'https://ui.shadcn.com/schema/registry.json',
    name: 'material-you',
    homepage: 'https://material.nanven.cn',
    items: [await themeItem(), ...(await Promise.all(names.map(componentItem)))],
}
await writeFile('registry.json', JSON.stringify(registry, null, 2) + '\n')
// shadcn build does not remove items that no longer exist
await rm('public/r', { recursive: true, force: true })
