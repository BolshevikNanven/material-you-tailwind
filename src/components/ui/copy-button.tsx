'use client'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useRef, useState } from 'react'
import { toast } from '@/components/ui/snakebar'

export function CopyButton({
    className,
    text: contentToCopy,
    ...props
}: React.ComponentProps<typeof Button> & { text?: string }) {
    const buttonRef = useRef<HTMLButtonElement>(null)
    const [isCopied, setIsCopied] = useState(false)

    const handleCopy = async () => {
        const text = contentToCopy || buttonRef.current?.parentElement?.innerText

        if (!text) return

        try {
            await navigator.clipboard.writeText(text)
            setIsCopied(true)
            toast({ message: 'Copied to clipboard' })
            setTimeout(() => setIsCopied(false), 2000)
        } catch {
            toast({ message: 'Failed to copy' })
        }
    }

    return (
        <Button
            ref={buttonRef}
            onClick={handleCopy}
            className={cn('bg-surface-container', className)}
            variant={'text'}
            size={'sm'}
            icon
            {...props}
        >
            {isCopied ? (
                <i className='icon-[material-symbols--check-rounded]' />
            ) : (
                <i className='icon-[material-symbols--content-copy-outline-rounded]' />
            )}
        </Button>
    )
}
