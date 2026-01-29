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

export function ContextMenuDemo() {
    return (
        <div className='flex flex-wrap items-center gap-4'>
            <ContextMenu>
                <ContextMenuTrigger className='flex h-37.5 w-100 items-center justify-center rounded-md border border-dashed text-sm'>
                    Right click here
                </ContextMenuTrigger>
                <ContextMenuContent className='w-52'>
                    <ContextMenuGroup>
                        <ContextMenuItem>
                            <i className='icon-[material-symbols--undo-rounded]' />
                            Back
                            <ContextMenuShortcut>⌘[</ContextMenuShortcut>
                        </ContextMenuItem>
                        <ContextMenuItem disabled>
                            <i className='icon-[material-symbols--redo-rounded]' />
                            Forward
                            <ContextMenuShortcut>⌘]</ContextMenuShortcut>
                        </ContextMenuItem>
                        <ContextMenuItem>
                            <i className='icon-[material-symbols--refresh-rounded]' />
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
    )
}
