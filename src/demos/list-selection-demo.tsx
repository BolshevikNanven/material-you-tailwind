'use client'

import * as React from 'react'
import {
    List,
    ListItem,
    ListItemContent,
    ListItemLabel,
    ListItemLeading,
    ListItemSupportingText,
    ListItemTrailing,
} from '@/components/ui/list'

const items = [
    { id: 'wifi', icon: 'icon-[material-symbols--wifi-rounded]', label: 'Wi-Fi', text: 'Home network' },
    { id: 'bluetooth', icon: 'icon-[material-symbols--bluetooth-rounded]', label: 'Bluetooth', text: 'Headphones connected' },
    {
        id: 'location',
        icon: 'icon-[material-symbols--location-on-outline-rounded]',
        label: 'Location',
        text: 'Apps can use location',
    },
    {
        id: 'hotspot',
        icon: 'icon-[material-symbols--wifi-tethering-rounded]',
        label: 'Hotspot',
        text: 'Not available',
        disabled: true,
    },
    {
        id: 'nfc',
        icon: 'icon-[material-symbols--nfc-rounded]',
        label: 'NFC',
        text: 'Managed by your organization',
        disabled: true,
    },
]

export function ListSelectionDemo() {
    const [selected, setSelected] = React.useState<string[]>(['wifi', 'nfc'])

    return (
        <div className='w-full max-w-90 rounded-3xl bg-surface-container p-3'>
            <List variant='segmented'>
                {items.map(item => {
                    const isSelected = selected.includes(item.id)
                    return (
                        <ListItem
                            key={item.id}
                            selectable
                            selected={isSelected}
                            disabled={item.disabled}
                            onSelectedChange={next =>
                                setSelected(current => (next ? [...current, item.id] : current.filter(id => id !== item.id)))
                            }
                        >
                            <ListItemLeading>
                                <i className={item.icon} />
                            </ListItemLeading>
                            <ListItemContent>
                                <ListItemLabel>{item.label}</ListItemLabel>
                                <ListItemSupportingText>{item.text}</ListItemSupportingText>
                            </ListItemContent>
                            <ListItemTrailing>
                                {isSelected && <i className='icon-[material-symbols--check-rounded]' />}
                            </ListItemTrailing>
                        </ListItem>
                    )
                })}
            </List>
        </div>
    )
}
