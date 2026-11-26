'use client'

import { getBlock } from '@/blocks'
import { useLayoutEffect, useRef, useState } from 'react'

const BASE_WIDTH = 1280
const BASE_HEIGHT = 800

/** Renders a block at desktop size and scales it down to fit the card. */
export default function BlockThumbnail({ slug }: { slug: string }) {
    const containerRef = useRef<HTMLDivElement>(null)
    const [scale, setScale] = useState(0)
    const Component = getBlock(slug)?.component

    useLayoutEffect(() => {
        const el = containerRef.current
        if (!el) return
        const observer = new ResizeObserver(([entry]) => setScale(entry.contentRect.width / BASE_WIDTH))
        observer.observe(el)
        return () => observer.disconnect()
    }, [])

    return (
        <div
            ref={containerRef}
            className='relative w-full overflow-hidden rounded-xl bg-surface-container'
            style={{ aspectRatio: `${BASE_WIDTH} / ${BASE_HEIGHT}` }}
        >
            {Component && scale > 0 && (
                <div
                    inert
                    aria-hidden
                    className='pointer-events-none absolute top-0 left-0 origin-top-left select-none'
                    style={{ width: BASE_WIDTH, height: BASE_HEIGHT, transform: `scale(${scale})` }}
                >
                    <Component />
                </div>
            )}
        </div>
    )
}
