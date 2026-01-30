'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { Button } from './ui/button'

import { highlight } from '@/lib/highlight'

import components from '../../components'
import { useTheme } from '@/context/theme'

interface ComponentSourceViewerProps {
    title?: string
    code: string
}
export function ComponentSourceViewer({ title, code }: ComponentSourceViewerProps) {
    const { theme } = useTheme()

    const [isOpen, setIsOpen] = React.useState(false)
    const [highlightedCode, setHighlightedCode] = React.useState('')

    const highlightCode = React.useCallback(() => {
        highlight(code, theme).then(setHighlightedCode)
    }, [code, theme])

    React.useEffect(() => {
        highlightCode()
    }, [code, theme, highlightCode])

    return (
        <div className='relative flex h-full flex-col overflow-hidden rounded-2xl bg-surface-container-high'>
            <div className='flex items-center gap-2 px-3 py-1.5'>
                <h3 className='mr-auto pl-1 text-sm'>{title}</h3>
                <Button onClick={() => setIsOpen(!isOpen)} size='sm' variant='text'>
                    <i
                        className={cn(
                            'text-lg',
                            isOpen ? 'icon-[material-symbols--code-off]' : 'icon-[material-symbols--code]',
                        )}
                    />
                    {isOpen ? 'Collapse Code' : 'Expand Code'}
                </Button>
                <Button size='sm' variant='text' icon>
                    <i className='icon-[material-symbols--content-copy-outline-rounded]' />
                </Button>
            </div>

            <div
                className={cn(
                    'relative h-full max-h-130 overflow-auto rounded-t-xl rounded-b-3xl bg-surface-container-low',
                    isOpen ? 'h-full' : 'h-20 overflow-hidden',
                )}
            >
                <div className='[&_pre]:my-0! [&_pre]:bg-transparent! [&_pre]:p-4 [&_pre]:font-mono [&_pre]:text-sm [&_pre]:leading-relaxed'>
                    {highlightedCode ? (
                        <div dangerouslySetInnerHTML={{ __html: highlightedCode }} />
                    ) : (
                        <components.pre>
                            <components.code>{code}</components.code>
                        </components.pre>
                    )}
                </div>
                {!isOpen && (
                    <div
                        className='absolute bottom-0 left-0 z-10 h-full w-full'
                        style={{
                            background:
                                'linear-gradient(to top, color-mix(in oklab, var(--surface) 80%, transparent), transparent)',
                        }}
                    />
                )}
            </div>
        </div>
    )
}
