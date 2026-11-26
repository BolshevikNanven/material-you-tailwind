'use client'

import {
    List,
    ListItem,
    ListItemContent,
    ListItemLabel,
    ListItemLeading,
    ListItemTrailing,
    ListItemTrailingText,
} from '@/components/ui/list'

const items = [
    { icon: 'icon-[material-symbols--content-cut]', label: 'Cut', shortcut: '⌘X' },
    { icon: 'icon-[material-symbols--content-copy-outline-rounded]', label: 'Copy', shortcut: '⌘C' },
    { icon: 'icon-[material-symbols--content-paste-rounded]', label: 'Paste', shortcut: '⌘V' },
    { icon: 'icon-[material-symbols--select-all-rounded]', label: 'Select all', shortcut: '⌘A' },
    { icon: 'icon-[material-symbols--undo-rounded]', label: 'Undo', shortcut: '⌘Z' },
    { icon: 'icon-[material-symbols--redo-rounded]', label: 'Redo', shortcut: '⇧⌘Z' },
]

export function ListDemo() {
    return (
        <List className='w-full max-w-90'>
            {items.map(item => (
                <ListItem key={item.label} onClick={() => {}}>
                    <ListItemLeading>
                        <i className={item.icon} />
                    </ListItemLeading>
                    <ListItemContent>
                        <ListItemLabel>{item.label}</ListItemLabel>
                    </ListItemContent>
                    <ListItemTrailing>
                        <ListItemTrailingText>{item.shortcut}</ListItemTrailingText>
                        <i className='icon-[material-symbols--arrow-right-rounded]' />
                    </ListItemTrailing>
                </ListItem>
            ))}
        </List>
    )
}
