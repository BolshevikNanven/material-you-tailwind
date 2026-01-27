import { defineDocs, defineConfig } from 'fumadocs-mdx/config'

export const docs = defineDocs({
    dir: 'src/content/docs',
})

export const components = defineDocs({
    dir: 'src/content/components',
})

export default defineConfig()
