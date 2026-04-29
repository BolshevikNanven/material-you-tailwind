import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuGroup,
    ContextMenuItem,
    ContextMenuTrigger,
} from '@/components/ui/context-menu'

export function ContextMenuCompactDemo() {
    return (
        <ContextMenu>
            <ContextMenuTrigger className='flex h-32 w-80 items-center justify-center rounded-md border border-dashed text-sm'>
                Right click here
            </ContextMenuTrigger>
            <ContextMenuContent compact className='w-44'>
                <ContextMenuGroup>
                    <ContextMenuItem>
                        <i className='icon-[material-symbols--content-copy-rounded]' />
                        Copy
                    </ContextMenuItem>
                    <ContextMenuItem>
                        <i className='icon-[material-symbols--drive-file-rename-outline-rounded]' />
                        Rename
                    </ContextMenuItem>
                    <ContextMenuItem>
                        <i className='icon-[material-symbols--delete-rounded]' />
                        Delete
                    </ContextMenuItem>
                </ContextMenuGroup>
            </ContextMenuContent>
        </ContextMenu>
    )
}
