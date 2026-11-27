'use client'

import * as React from 'react'

import { Button } from '@/components/ui/button'
import {
    Sheet,
    SheetBody,
    SheetCloseButton,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet'

export function SheetStandardDemo() {
    const [open, setOpen] = React.useState(false)

    return (
        <Sheet open={open} onOpenChange={setOpen} modal={false}>
            <Button variant='tonal' onClick={() => setOpen(!open)}>
                {open ? 'Hide' : 'Show'} standard sheet
            </Button>
            <SheetContent side='right' onOpenAutoFocus={event => event.preventDefault()}>
                <SheetHeader>
                    <SheetTitle>Standard sheet</SheetTitle>
                    <SheetCloseButton />
                </SheetHeader>
                <SheetBody>
                    <SheetDescription>
                        Standard sheets sit alongside the page without a scrim, so the rest of the page stays interactive.
                    </SheetDescription>
                </SheetBody>
            </SheetContent>
        </Sheet>
    )
}
