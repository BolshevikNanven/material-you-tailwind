import { existsSync, readdirSync, readFileSync } from 'fs'
import { join, relative, dirname, resolve } from 'path'

export default function componentLoader(source) {
    try {
        // Find 'dirs' config from source directly (avoids executing JSX or TS in loader)
        const match = source.match(/export\s+const\s+dirs\s*=\s*\[([\s\S]*?)\]/)
        if (!match) {
            return source
        }

        const rootDir = this.rootContext || process.cwd()
        const dirs = match[1]
            .split(',')
            .map(d => d.trim().replace(/['"`]/g, ''))
            .filter(d => d.length > 0)
            .map(d => resolve(rootDir, d))

        const injections = []
        const registryEntries = []
        const sourceMap = {}
        const assignments = []
        let uniqueId = 0

        dirs.forEach(dir => {
            if (!existsSync(dir)) return
            this.addContextDependency(dir)

            const files = readdirSync(dir).filter(f => f.endsWith('.tsx') && !f.startsWith('index'))
            files.forEach(file => {
                const fullPath = join(dir, file)
                const content = readFileSync(fullPath, 'utf-8')
                const names = []

                // Extract names
                let m
                const exportRegex = /export\s+\{([^}]+)\}/g
                while ((m = exportRegex.exec(content)) !== null) {
                    m[1].split(',').forEach(e => {
                        const trimmed = e.trim()
                        if (!trimmed) return
                        const asMatch = trimmed.match(/(\w+)\s+as\s+(\w+)/)
                        names.push(asMatch ? asMatch[2] : trimmed)
                    })
                }
                const declRegex = /export\s+(?:function|const|class)\s+(\w+)/g
                while ((m = declRegex.exec(content)) !== null) {
                    names.push(m[1])
                }

                if (names.length > 0) {
                    const request = relative(dirname(this.resourcePath), fullPath)
                        .replace(/\\/g, '/')
                        .replace(/\.tsx$/, '')
                    const importPath = request.startsWith('.') ? request : './' + request

                    const imports = names.map(name => {
                        uniqueId++
                        const aliasedName = `${name}_${uniqueId}`
                        // Return object to easily pass both names
                        return { original: name, aliased: aliasedName }
                    })

                    // import { Button as Button_1 } from ...
                    const importClause = imports.map(i => `${i.original} as ${i.aliased}`).join(', ')
                    injections.push(`import { ${importClause} } from '${importPath}';`)

                    imports.forEach(({ original, aliased }) => {
                        // Assign source code and displayName directly to the component object
                        assignments.push(`try { ${aliased}.displayName = "${original}"; } catch(e) {}`)
                        assignments.push(`try { ${aliased}.__source = componentSources["${original}"]; } catch(e) {}`)

                        // Add to registry: Button: Button_1
                        registryEntries.push(`${original}: ${aliased}`)

                        // Map names to content
                        sourceMap[original] = content
                    })
                }
            })
        })

        // Create source code map export
        const sourceEntries = Object.entries(sourceMap).map(([name, src]) => {
            const escaped = src.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$\{/g, '\\${')
            return `${name}: \`${escaped}\``
        })

        // Export componentSources
        const sourceExport = `export const componentSources = {\n${sourceEntries.join(',\n')}\n};`
        const registryExport = `export const componentRegistry = {\n${registryEntries.join(',\n')}\n};`

        // Assignments must come AFTER componentSources is defined
        const assignmentsCode = assignments.join('\n')
        let newSource = `${injections.join('\n')}\n${sourceExport}\n${assignmentsCode}\n${registryExport}\n${source}`

        if (registryEntries.length > 0) {
            const exportDefaultRegex = /export\s+default\s+([\w\d_]+)/
            const matchDefault = newSource.match(exportDefaultRegex)

            if (matchDefault) {
                const varName = matchDefault[1]
                newSource = newSource.replace(
                    exportDefaultRegex,
                    `export default { ...${varName}, ${registryEntries.join(', ')} }`,
                )
            } else {
                newSource = newSource.replace(/export\s+default\s+\{/, `export default { ${registryEntries.join(', ')}, `)
            }
        }

        return newSource
    } catch (e) {
        console.error('Component Loader Error:', e)
        return source
    }
}
