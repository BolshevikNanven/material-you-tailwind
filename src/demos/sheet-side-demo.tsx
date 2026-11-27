'use client'

import { Button } from '@/components/ui/button'
import {
    Sheet,
    SheetBody,
    SheetClose,
    SheetCloseButton,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
    type SheetSide,
} from '@/components/ui/sheet'
import { TextField } from '@/components/ui/text-field'

function SideSheet({ side }: { side: SheetSide }) {
    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant='tonal' className='capitalize'>
                    {side}
                </Button>
            </SheetTrigger>
            <SheetContent side={side}>
                <SheetHeader>
                    <SheetTitle>Filters</SheetTitle>
                    <SheetCloseButton />
                </SheetHeader>
                <SheetBody className='flex flex-col gap-6'>
                    <SheetDescription>Narrow the results by name and price.</SheetDescription>
                    <TextField className='w-full' label='Name' />
                    <TextField className='w-full' label='Min price' />
                    <TextField className='w-full' label='Max price' />
                </SheetBody>
                <SheetFooter>
                    <SheetClose asChild>
                        <Button size='sm'>Save</Button>
                    </SheetClose>
                    <SheetClose asChild>
                        <Button size='sm' variant='outline'>
                            Cancel
                        </Button>
                    </SheetClose>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    )
}

export function SheetSideDemo() {
    return (
        <div className='flex flex-wrap items-center gap-4'>
            <SideSheet side='left' />
            <SideSheet side='right' />
        </div>
    )
}
