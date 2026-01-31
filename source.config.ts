import { defineDocs, defineConfig, frontmatterSchema } from 'fumadocs-mdx/config'

import { z } from 'zod'

export const docs = defineDocs({
    dir: 'src/content/docs',
    docs: {
        schema: frontmatterSchema.extend({
            image: z.string().optional(),
        }),
    },
})

export const components = defineDocs({
    dir: 'src/content/components',
})

export default defineConfig()
