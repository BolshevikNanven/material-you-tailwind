'use client'

import * as React from 'react'
import {
    List,
    ListItem,
    ListItemContent,
    ListItemDragHandle,
    ListItemLabel,
    ListItemLeading,
    ListItemSupportingText,
    ListItemTrailing,
} from '@/components/ui/list'

const initial = [
    {
        id: 'groceries',
        icon: 'icon-[material-symbols--shopping-cart-outline-rounded]',
        label: 'Groceries',
        text: 'Milk, eggs, bread',
    },
    { id: 'gym', icon: 'icon-[material-symbols--exercise-outline]', label: 'Gym', text: 'Leg day at 7 pm' },
    { id: 'call', icon: 'icon-[material-symbols--call-outline-rounded]', label: 'Call mom', text: 'Before the weekend' },
    { id: 'taxes', icon: 'icon-[material-symbols--receipt-long-outline-rounded]', label: 'File taxes', text: 'Due next month' },
    {
        id: 'plants',
        icon: 'icon-[material-symbols--potted-plant-outline-rounded]',
        label: 'Water plants',
        text: 'Every three days',
    },
]

export function ListReorderDemo() {
    const [items, setItems] = React.useState(initial)

    return (
        <div className='w-full max-w-90 rounded-3xl bg-surface-container p-3'>
            <List
                variant='segmented'
                onReorder={(from, to) =>
                    setItems(current => {
                        const next = [...current]
                        const [moved] = next.splice(from, 1)
                        next.splice(to, 0, moved)
                        return next
                    })
                }
            >
                {items.map(item => (
                    <ListItem key={item.id}>
                        <ListItemLeading>
                            <i className={item.icon} />
                        </ListItemLeading>
                        <ListItemContent>
                            <ListItemLabel>{item.label}</ListItemLabel>
                            <ListItemSupportingText>{item.text}</ListItemSupportingText>
                        </ListItemContent>
                        <ListItemTrailing>
                            <ListItemDragHandle label={`Reorder ${item.label}`} />
                        </ListItemTrailing>
                    </ListItem>
                ))}
            </List>
        </div>
    )
}
