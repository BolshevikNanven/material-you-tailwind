import React from 'react'
import { cn } from '@/lib/utils'

import ComponentSource from './component-source'

export default async function ComponentPreview({ children, className }: { children: React.ReactElement; className?: string }) {
    return (
        <div className={cn('mt-8 flex flex-col overflow-hidden rounded-3xl border border-outline-variant', className)}>
            <div className='flex min-h-38 shrink-0 items-center justify-center rounded-3xl p-8'>{children}</div>
            <ComponentSource>{children}</ComponentSource>
        </div>
    )
}
