'use client'

import { Button } from '@/components/ui/button'
import { toast } from '@/components/ui/snakebar'

export function SnakebarDemo() {
    return (
        <div className='flex flex-wrap items-center gap-4'>
            <Button onClick={() => toast({ message: 'Single-line snackbar with icon', closable: true })}>Click me</Button>
            <Button
                variant={'tonal'}
                onClick={() => toast({ message: 'Single-line snackbar with icon', action: { label: 'undo', onClick() {} } })}
            >
                Click me
            </Button>
        </div>
    )
}
