import React from 'react'
// @ts-expect-error - componentSources is injected by component-loader
import { componentSources, componentRegistry } from '../../components'

import { CodeViewer } from './code-viewer'
import { cn } from '@/lib/utils'

export default async function ComponentSource({
    children,
    title,
    className,
}: {
    children: React.ReactElement
    title?: string
    className?: string
}) {
    let code = ''

    if (children?.type) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const type = children.type as any
        if (!title) {
            title = type.displayName || ''
        }

        // 1. Try to get source directly from component (injected by loader)
        if (type.__source) {
            code = type.__source
        }

        // 2. Fallback: Try to get the name from component properties or registry
        if (!code) {
            let name = type.displayName || type.name

            if (!name) {
                for (const [key, value] of Object.entries(componentRegistry)) {
                    if (value === type) {
                        name = key
                        break
                    }
                }
            }

            if (name && componentSources[name]) {
                code = componentSources[name]
            }
        }
    }

    return <CodeViewer className={cn('border-none', className)} title={title} code={code} />
}
