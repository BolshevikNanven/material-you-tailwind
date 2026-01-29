'use client'

import React from 'react'
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuPortal,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import type { DropdownMenuCheckboxItemProps } from '@radix-ui/react-dropdown-menu'

function DropdownMenuRadioGroupDemo() {
    const [position, setPosition] = React.useState('bottom')
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button>RadioGroup</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className='w-56'>
                <DropdownMenuGroup>
                    <DropdownMenuRadioGroup value={position} onValueChange={setPosition}>
                        <DropdownMenuRadioItem value='top'>Top</DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value='bottom'>Bottom</DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value='right'>Right</DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

type Checked = DropdownMenuCheckboxItemProps['checked']
function DropdownMenuCheckboxes() {
    const [showStatusBar, setShowStatusBar] = React.useState<Checked>(true)
    const [showActivityBar, setShowActivityBar] = React.useState<Checked>(false)
    const [showPanel, setShowPanel] = React.useState<Checked>(false)
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant='outline'>Checkboxes</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className='w-56'>
                <DropdownMenuGroup>
                    <DropdownMenuLabel inset>Appearance</DropdownMenuLabel>
                    <DropdownMenuCheckboxItem checked={showStatusBar} onCheckedChange={setShowStatusBar}>
                        Status Bar
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem checked={showActivityBar} onCheckedChange={setShowActivityBar} disabled>
                        Activity Bar
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem checked={showPanel} onCheckedChange={setShowPanel}>
                        Panel
                    </DropdownMenuCheckboxItem>
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export function DropdownMenuDemo() {
    return (
        <div className='flex flex-wrap items-center gap-4'>
            <DropdownMenuRadioGroupDemo />
            <DropdownMenuCheckboxes />
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant='outline'>Open</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className='w-56' align='start'>
                    <DropdownMenuGroup>
                        <DropdownMenuItem>
                            Profile
                            <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            Billing
                            <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            Settings
                            <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            Keyboard shortcuts
                            <DropdownMenuShortcut>⌘K</DropdownMenuShortcut>
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuGroup>
                        <DropdownMenuItem>Team</DropdownMenuItem>
                        <DropdownMenuSub>
                            <DropdownMenuSubTrigger>Invite users</DropdownMenuSubTrigger>
                            <DropdownMenuPortal>
                                <DropdownMenuSubContent>
                                    <DropdownMenuGroup>
                                        <DropdownMenuItem>Email</DropdownMenuItem>
                                        <DropdownMenuItem>Message</DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem>More...</DropdownMenuItem>
                                    </DropdownMenuGroup>
                                </DropdownMenuSubContent>
                            </DropdownMenuPortal>
                        </DropdownMenuSub>
                        <DropdownMenuItem>
                            New Team
                            <DropdownMenuShortcut>⌘+T</DropdownMenuShortcut>
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuGroup>
                        <DropdownMenuItem>GitHub</DropdownMenuItem>
                        <DropdownMenuItem>Support</DropdownMenuItem>
                        <DropdownMenuItem disabled>API</DropdownMenuItem>
                        <DropdownMenuItem>
                            Log out
                            <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}
