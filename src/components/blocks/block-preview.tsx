'use client'

import { Snakebar } from '@/components/ui/snakebar'
import { ThemeProvider, useTheme } from '@/context/theme'
import { useEffect, type ReactNode } from 'react'

export const BLOCK_THEME_MESSAGE = 'block-preview:theme'
export const BLOCK_PREVIEW_READY_MESSAGE = 'block-preview:ready'

// Keeps the iframe theme in sync with the parent page, which posts the theme on every change.
// The initial theme comes from the `?theme=` query (applied before paint by an inline script).
function ThemeSync() {
    const { setTheme } = useTheme()

    useEffect(() => {
        setTheme(new URLSearchParams(window.location.search).get('theme') === 'dark' ? 'dark' : 'light')

        const onMessage = (event: MessageEvent) => {
            if (event.origin !== window.location.origin || event.source !== window.parent) return
            if (event.data?.type !== BLOCK_THEME_MESSAGE) return
            setTheme(event.data.theme === 'dark' ? 'dark' : 'light')
        }
        window.addEventListener('message', onMessage)
        if (window.parent !== window) {
            window.parent.postMessage({ type: BLOCK_PREVIEW_READY_MESSAGE }, window.location.origin)
        }
        return () => window.removeEventListener('message', onMessage)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return null
}

export default function BlockPreview({ children }: { children: ReactNode }) {
    return (
        <ThemeProvider>
            {/* Set the iframe's initial theme before the preview is painted. */}
            <script
                dangerouslySetInnerHTML={{
                    __html: "if(new URLSearchParams(location.search).get('theme')==='dark')document.body.classList.add('dark')",
                }}
            />
            <ThemeSync />
            <Snakebar />
            {children}
        </ThemeProvider>
    )
}
