'use client'

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'

export function DropdownMenuCompactDemo() {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant='outline'>Compact</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent compact className='w-40' align='start'>
                <DropdownMenuGroup>
                    <DropdownMenuItem>
                        <i className='icon-[material-symbols--edit-rounded]' />
                        Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <i className='icon-[material-symbols--content-copy-rounded]' />
                        Duplicate
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <i className='icon-[material-symbols--archive-rounded]' />
                        Archive
                    </DropdownMenuItem>
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
