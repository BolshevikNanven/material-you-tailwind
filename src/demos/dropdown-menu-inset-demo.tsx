'use client'

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'

export function DropdownMenuInsetDemo() {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant='outline'>Inset</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className='w-48' align='start'>
                <DropdownMenuGroup>
                    <DropdownMenuLabel inset>Workspace</DropdownMenuLabel>
                    <DropdownMenuItem inset>Overview</DropdownMenuItem>
                    <DropdownMenuItem inset>Projects</DropdownMenuItem>
                    <DropdownMenuItem inset>Members</DropdownMenuItem>
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
