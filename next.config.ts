import type { NextConfig } from 'next'
import { createMDX } from 'fumadocs-mdx/next'

const nextConfig: NextConfig = {
    /* config options here */
    reactCompiler: true,
}

const withMDX = createMDX({
    // customise the config file path
    // configPath: "source.config.ts"
})
export default withMDX(nextConfig)
