'use client'

import * as React from 'react'
import {
    List,
    ListItem,
    ListItemContent,
    ListItemLabel,
    ListItemLeading,
    ListItemReveal,
    ListItemRevealAction,
    ListItemRevealTrigger,
    ListItemSupportingText,
    ListItemTrailing,
    ListItemTrailingText,
} from '@/components/ui/list'

const initial = [
    { id: 'design', label: 'Design review', text: 'Notes from Tuesday', time: '9:41' },
    { id: 'trip', label: 'Trip itinerary', text: 'Flights and hotels', time: '8:12' },
    { id: 'recipes', label: 'Recipes', text: 'Weeknight dinners', time: 'Mon' },
    { id: 'reading', label: 'Reading list', text: 'Books to pick up', time: 'Sun' },
]

export function ListRevealDemo() {
    const [items, setItems] = React.useState(initial)
    const [open, setOpen] = React.useState<string | null>('trip')

    return (
        <div className='w-full max-w-90'>
            <List variant='segmented'>
                {items.map(item => (
                    <ListItemReveal
                        key={item.id}
                        open={open === item.id}
                        onOpenChange={next => setOpen(next ? item.id : null)}
                        actions={
                            <>
                                <ListItemRevealAction label='Star'>
                                    <i className='icon-[material-symbols--star-outline-rounded]' />
                                </ListItemRevealAction>
                                <ListItemRevealAction label='Archive'>
                                    <i className='icon-[material-symbols--archive-outline-rounded]' />
                                </ListItemRevealAction>
                                <ListItemRevealAction
                                    variant='filled'
                                    label='Delete'
                                    onClick={() => setItems(current => current.filter(entry => entry.id !== item.id))}
                                >
                                    <i className='icon-[material-symbols--delete-outline-rounded]' />
                                </ListItemRevealAction>
                            </>
                        }
                    >
                        <ListItem onClick={() => {}}>
                            <ListItemLeading>
                                <i className='icon-[material-symbols--description-outline-rounded]' />
                            </ListItemLeading>
                            <ListItemContent>
                                <ListItemLabel>{item.label}</ListItemLabel>
                                <ListItemSupportingText>{item.text}</ListItemSupportingText>
                            </ListItemContent>
                            <ListItemTrailing>
                                <ListItemTrailingText>{item.time}</ListItemTrailingText>
                                <ListItemRevealTrigger label={`More actions for ${item.label}`} />
                            </ListItemTrailing>
                        </ListItem>
                    </ListItemReveal>
                ))}
            </List>
        </div>
    )
}
