import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuGroup,
    ContextMenuItem,
    ContextMenuLabel,
    ContextMenuTrigger,
} from '@/components/ui/context-menu'

export function ContextMenuInsetDemo() {
    return (
        <ContextMenu>
            <ContextMenuTrigger className='flex h-32 w-80 items-center justify-center rounded-md border border-dashed text-sm'>
                Right click here
            </ContextMenuTrigger>
            <ContextMenuContent className='w-52'>
                <ContextMenuGroup>
                    <ContextMenuLabel inset>Clipboard</ContextMenuLabel>
                    <ContextMenuItem inset>Cut</ContextMenuItem>
                    <ContextMenuItem inset>Copy</ContextMenuItem>
                    <ContextMenuItem inset>Paste</ContextMenuItem>
                </ContextMenuGroup>
            </ContextMenuContent>
        </ContextMenu>
    )
}
