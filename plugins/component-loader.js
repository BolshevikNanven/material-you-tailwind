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
        const exportList = []
        const sourceMap = {}

        const assignments = []

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
                    injections.push(`import { ${names.join(', ')} } from '${importPath}';`)

                    names.forEach(name => {
                        // Assign source code and displayName directly to the component object
                        // This fixes issues where displayName is lost in production builds
                        assignments.push(`try { ${name}.displayName = "${name}"; } catch(e) {}`)
                        assignments.push(`try { ${name}.__source = componentSources["${name}"]; } catch(e) {}`)
                    })

                    exportList.push(...names)

                    // Map names to content
                    names.forEach(name => {
                        sourceMap[name] = content
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
        const registryExport = `export const componentRegistry = {\n${exportList.join(',\n')}\n};`

        // Assignments must come AFTER componentSources is defined
        const assignmentsCode = assignments.join('\n')
        let newSource = `${injections.join('\n')}\n${sourceExport}\n${assignmentsCode}\n${registryExport}\n${source}`

        if (exportList.length > 0) {
            const exportDefaultRegex = /export\s+default\s+([\w\d_]+)/
            const matchDefault = newSource.match(exportDefaultRegex)

            if (matchDefault) {
                const varName = matchDefault[1]
                newSource = newSource.replace(exportDefaultRegex, `export default { ...${varName}, ${exportList.join(', ')} }`)
            } else {
                newSource = newSource.replace(/export\s+default\s+\{/, `export default { ${exportList.join(', ')}, `)
            }
        }

        return newSource
    } catch (e) {
        console.error('Component Loader Error:', e)
        return source
    }
}
