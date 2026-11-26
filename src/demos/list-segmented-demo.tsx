'use client'

import {
    List,
    ListItem,
    ListItemContent,
    ListItemLabel,
    ListItemLeading,
    ListItemSupportingText,
    ListItemTrailing,
    ListItemTrailingText,
} from '@/components/ui/list'

const items = [
    {
        icon: 'icon-[material-symbols--inbox-outline-rounded]',
        label: 'Inbox',
        text: 'Messages from people you know',
        count: '24',
    },
    { icon: 'icon-[material-symbols--star-outline-rounded]', label: 'Starred', text: 'Conversations you marked', count: '8' },
    {
        icon: 'icon-[material-symbols--schedule-outline-rounded]',
        label: 'Snoozed',
        text: 'Back in your inbox later',
        count: '3',
    },
    { icon: 'icon-[material-symbols--send-outline-rounded]', label: 'Sent', text: 'Everything you have sent', count: '112' },
    { icon: 'icon-[material-symbols--draft-outline-rounded]', label: 'Drafts', text: 'Unfinished messages', count: '2' },
]

export function ListSegmentedDemo() {
    return (
        <div className='w-full max-w-90 rounded-3xl bg-surface-container p-3'>
            <List variant='segmented'>
                {items.map(item => (
                    <ListItem key={item.label} onClick={() => {}}>
                        <ListItemLeading>
                            <i className={item.icon} />
                        </ListItemLeading>
                        <ListItemContent>
                            <ListItemLabel>{item.label}</ListItemLabel>
                            <ListItemSupportingText>{item.text}</ListItemSupportingText>
                        </ListItemContent>
                        <ListItemTrailing>
                            <ListItemTrailingText>{item.count}</ListItemTrailingText>
                            <i className='icon-[material-symbols--arrow-right-rounded]' />
                        </ListItemTrailing>
                    </ListItem>
                ))}
            </List>
        </div>
    )
}
