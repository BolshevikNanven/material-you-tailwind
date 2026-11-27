'use client'

import * as React from 'react'
import { Checkbox } from '@/components/ui/checkbox'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Switch } from '@/components/ui/switch'
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

const options = [
    { id: 'light', label: 'Light' },
    { id: 'dark', label: 'Dark' },
    { id: 'system', label: 'System default' },
]

export function ListTrailingDemo() {
    const [sync, setSync] = React.useState(true)
    const [backup, setBackup] = React.useState(false)
    const [theme, setTheme] = React.useState('system')

    return (
        <div className='flex w-full max-w-90 flex-col gap-4'>
            <List variant='segmented'>
                <ListItem onClick={() => {}}>
                    <ListItemLeading>
                        <i className='icon-[material-symbols--language]' />
                    </ListItemLeading>
                    <ListItemContent>
                        <ListItemLabel>Language</ListItemLabel>
                        <ListItemSupportingText>English (United States)</ListItemSupportingText>
                    </ListItemContent>
                    <ListItemTrailing>
                        <i className='icon-[material-symbols--arrow-right-rounded]' />
                    </ListItemTrailing>
                </ListItem>
                <ListItem selectable selected={sync} onSelectedChange={setSync}>
                    <ListItemLeading>
                        <i className='icon-[material-symbols--sync-rounded]' />
                    </ListItemLeading>
                    <ListItemContent>
                        <ListItemLabel>Auto sync</ListItemLabel>
                        <ListItemSupportingText>Keep data up to date</ListItemSupportingText>
                    </ListItemContent>
                    <ListItemTrailing>
                        <Switch checked={sync} />
                    </ListItemTrailing>
                </ListItem>
                <ListItem selectable selected={backup} onSelectedChange={setBackup}>
                    <ListItemLeading>
                        <i className='icon-[material-symbols--backup-outline-rounded]' />
                    </ListItemLeading>
                    <ListItemContent>
                        <ListItemLabel>Back up photos</ListItemLabel>
                        <ListItemSupportingText>Only on Wi-Fi</ListItemSupportingText>
                    </ListItemContent>
                    <ListItemTrailing className='size-6'>
                        <Checkbox checked={backup} />
                    </ListItemTrailing>
                </ListItem>
                <ListItem onClick={() => {}}>
                    <ListItemLeading>
                        <i className='icon-[material-symbols--storage-rounded]' />
                    </ListItemLeading>
                    <ListItemContent>
                        <ListItemLabel>Storage</ListItemLabel>
                    </ListItemContent>
                    <ListItemTrailing>
                        <ListItemTrailingText>64%</ListItemTrailingText>
                    </ListItemTrailing>
                </ListItem>
            </List>
            <List variant='segmented'>
                {options.map(option => (
                    <ListItem
                        key={option.id}
                        selectable
                        selected={theme === option.id}
                        onSelectedChange={() => setTheme(option.id)}
                    >
                        <ListItemContent>
                            <ListItemLabel>{option.label}</ListItemLabel>
                        </ListItemContent>
                        <ListItemTrailing className='size-6'>
                            <RadioGroup value={theme}>
                                <RadioGroupItem value={option.id} />
                            </RadioGroup>
                        </ListItemTrailing>
                    </ListItem>
                ))}
            </List>
        </div>
    )
}
