import {
    ContextMenu,
    ContextMenuCheckboxItem,
    ContextMenuContent,
    ContextMenuGroup,
    ContextMenuItem,
    ContextMenuLabel,
    ContextMenuRadioGroup,
    ContextMenuRadioItem,
    ContextMenuSeparator,
    ContextMenuSub,
    ContextMenuSubContent,
    ContextMenuSubTrigger,
    ContextMenuTrigger,
    ContextMenuShortcut,
} from '@/components/ui/context-menu'
import { Undo2, Redo2, RefreshCcw } from 'lucide-react'
import React from 'react'

export function ContextMenuDemo() {
    return (
        <>
            <h3>Context Menu</h3>
            <div className='mb-6 flex flex-wrap items-center gap-4'>
                <ContextMenu>
                    <ContextMenuTrigger className='flex h-37.5 w-1/3 items-center justify-center rounded-md border border-dashed text-sm'>
                        Right click here
                    </ContextMenuTrigger>
                    <ContextMenuContent className='w-52'>
                        <ContextMenuGroup>
                            <ContextMenuItem>
                                <Undo2 />
                                Back
                                <ContextMenuShortcut>⌘[</ContextMenuShortcut>
                            </ContextMenuItem>
                            <ContextMenuItem disabled>
                                <Redo2 />
                                Forward
                                <ContextMenuShortcut>⌘]</ContextMenuShortcut>
                            </ContextMenuItem>
                            <ContextMenuItem>
                                <RefreshCcw />
                                Reload
                                <ContextMenuShortcut>⌘R</ContextMenuShortcut>
                            </ContextMenuItem>
                            <ContextMenuSub>
                                <ContextMenuSubTrigger inset>More Tools</ContextMenuSubTrigger>
                                <ContextMenuSubContent className='w-44'>
                                    <ContextMenuGroup>
                                        <ContextMenuItem>Save Page...</ContextMenuItem>
                                        <ContextMenuItem>Create Shortcut...</ContextMenuItem>
                                        <ContextMenuItem>Name Window...</ContextMenuItem>
                                        <ContextMenuItem>Developer Tools</ContextMenuItem>
                                    </ContextMenuGroup>
                                    <ContextMenuGroup>
                                        <ContextMenuItem>Delete</ContextMenuItem>
                                    </ContextMenuGroup>
                                </ContextMenuSubContent>
                            </ContextMenuSub>
                        </ContextMenuGroup>
                        <ContextMenuGroup>
                            <ContextMenuCheckboxItem checked>Show Bookmarks</ContextMenuCheckboxItem>
                            <ContextMenuCheckboxItem>Show Full URLs</ContextMenuCheckboxItem>
                            <ContextMenuSeparator />
                            <ContextMenuRadioGroup value='pedro'>
                                <ContextMenuLabel inset>People</ContextMenuLabel>
                                <ContextMenuRadioItem value='pedro'>Pedro Duarte</ContextMenuRadioItem>
                                <ContextMenuRadioItem value='colm'>Colm Tuite</ContextMenuRadioItem>
                            </ContextMenuRadioGroup>
                        </ContextMenuGroup>
                    </ContextMenuContent>
                </ContextMenu>
            </div>
        </>
    )
}