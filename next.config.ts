import type { NextConfig } from 'next'
import { createMDX } from 'fumadocs-mdx/next'
import path from 'path'

const nextConfig: NextConfig = {
    reactCompiler: true,
    turbopack: {
        rules: {
            '**/components.tsx': {
                loaders: [path.resolve('plugins/component-loader.js')],
                as: '*.tsx',
            },
        },
    },
}

const withMDX = createMDX({})

export default withMDX(nextConfig)
