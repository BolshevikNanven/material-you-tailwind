'use client'

import { Button } from '@/components/ui/button'
import {
    Sheet,
    SheetBody,
    SheetCloseButton,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet'

export function SheetDetachedDemo() {
    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant='tonal'>Open detached sheet</Button>
            </SheetTrigger>
            <SheetContent side='right' detached>
                <SheetHeader>
                    <Button variant='text' icon aria-label='Back' className='text-on-surface-variant'>
                        <i className='icon-[material-symbols--arrow-back-rounded] size-6' />
                    </Button>
                    <SheetTitle>Details</SheetTitle>
                    <SheetCloseButton />
                </SheetHeader>
                <SheetBody>
                    <SheetDescription>
                        Detached sheets float 16dp from the edge of the window, with every corner rounded.
                    </SheetDescription>
                </SheetBody>
            </SheetContent>
        </Sheet>
    )
}
