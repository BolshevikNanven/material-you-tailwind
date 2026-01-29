'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import components from '../../components'
import { Button } from './ui/button'

interface ComponentSourceViewerProps {
    code: string
}
export function ComponentSourceViewer({ code }: ComponentSourceViewerProps) {
    const [isOpen, setIsOpen] = React.useState(false)

    return (
        <div className='relative flex h-full flex-col overflow-hidden'>
            <div className='flex justify-end p-3'>
                <Button onClick={() => setIsOpen(!isOpen)} size='sm'>
                    <i
                        className={cn(
                            'text-lg',
                            isOpen ? 'icon-[material-symbols--code-off]' : 'icon-[material-symbols--code]',
                        )}
                    />
                    {isOpen ? 'Hide Code' : 'View Code'}
                </Button>
            </div>

            {isOpen && (
                <div className='h-full max-h-125 overflow-auto rounded-b-3xl border-t border-outline-variant bg-surface-container'>
                    <components.pre className='my-0 rounded-none border-none bg-transparent'>
                        <components.code>{code}</components.code>
                    </components.pre>
                </div>
            )}
        </div>
    )
}
