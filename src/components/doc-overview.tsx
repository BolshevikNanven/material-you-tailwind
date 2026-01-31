'use client'

import { cn } from '@/lib/utils'
import { useEffect, useRef, useState } from 'react'

interface TOCItem {
    title: React.ReactNode
    url: string
    depth: number
}

export default function DocOverview({ toc }: { toc: TOCItem[] }) {
    const [activeId, setActiveId] = useState<string>('')
    const containerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const parent = containerRef.current?.parentElement
        if (!parent) return

        const handleScroll = () => {
            const headings = parent.querySelectorAll<HTMLElement>('[data-slot="heading"]')
            const topOffset = window.innerHeight - 80
            let newActiveId = ''

            for (const heading of headings) {
                const rect = heading.getBoundingClientRect()
                if (rect.top <= topOffset) {
                    newActiveId = heading.id
                } else {
                    break
                }
            }
            setActiveId(newActiveId)
        }

        parent.addEventListener('scroll', handleScroll)
        handleScroll()

        return () => {
            parent.removeEventListener('scroll', handleScroll)
        }
    }, [])

    return (
        <div ref={containerRef} className='shrink-0overflow-y-auto sticky top-0 flex h-screen items-center pr-8'>
            <div className='flex flex-col'>
                <h3 className='mb-2 pl-4 text-xs font-semibold text-on-surface-variant'>On This Page</h3>
                <ul className='flex flex-col'>
                    {toc.map(item => (
                        <a
                            key={item.url}
                            href={item.url}
                            data-depth={item.depth}
                            className={cn(
                                'cursor-pointer rounded-full px-4 py-2 text-sm transition-colors data-[depth=3]:pl-6 data-[depth=4]:pl-8',
                                activeId === item.url.slice(1)
                                    ? 'bg-secondary-container text-on-surface'
                                    : 'text-on-surface-variant hover:bg-surface-container',
                            )}
                        >
                            {item.title}
                        </a>
                    ))}
                </ul>
            </div>
        </div>
    )
}
