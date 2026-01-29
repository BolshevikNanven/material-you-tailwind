import React from 'react'
import { cn } from '@/lib/utils'
// @ts-expect-error - componentSources is injected by component-loader
import { componentSources, componentRegistry } from '../../components'

import { ComponentSourceViewer } from './component-source-viewer'

export default async function ComponentPreview({ children, className }: { children: React.ReactElement; className?: string }) {
    let code = ''

    if (children?.type) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const type = children.type as any
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

    return (
        <div className={cn('mt-8 flex flex-col rounded-3xl border border-outline-variant', className)}>
            <div className='flex min-h-38 shrink-0 items-center justify-center rounded-3xl p-8'>{children}</div>
            {code && <ComponentSourceViewer code={code} />}
        </div>
    )
}
