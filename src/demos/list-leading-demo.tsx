'use client'

import * as React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Checkbox } from '@/components/ui/checkbox'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Switch } from '@/components/ui/switch'
import { List, ListItem, ListItemContent, ListItemLabel, ListItemLeading, ListItemSupportingText } from '@/components/ui/list'

export function ListLeadingDemo() {
    const [checked, setChecked] = React.useState(true)
    const [radio, setRadio] = React.useState(true)
    const [on, setOn] = React.useState(true)

    return (
        <div className='w-full max-w-90'>
            <List variant='segmented'>
                <ListItem onClick={() => {}}>
                    <ListItemLeading>
                        <i className='icon-[material-symbols--folder-outline-rounded]' />
                    </ListItemLeading>
                    <ListItemContent>
                        <ListItemLabel>Icon</ListItemLabel>
                    </ListItemContent>
                </ListItem>
                <ListItem onClick={() => {}}>
                    <ListItemLeading>
                        <Avatar>
                            <AvatarFallback>A</AvatarFallback>
                        </Avatar>
                    </ListItemLeading>
                    <ListItemContent>
                        <ListItemLabel>Avatar</ListItemLabel>
                        <ListItemSupportingText>Monogram</ListItemSupportingText>
                    </ListItemContent>
                </ListItem>
                <ListItem onClick={() => {}}>
                    <ListItemLeading>
                        <Avatar>
                            <AvatarImage src='/carousel/santorini.jpg' alt='' className='object-cover' />
                        </Avatar>
                    </ListItemLeading>
                    <ListItemContent>
                        <ListItemLabel>Avatar</ListItemLabel>
                        <ListItemSupportingText>Image</ListItemSupportingText>
                    </ListItemContent>
                </ListItem>
                <ListItem onClick={() => {}}>
                    <ListItemLeading>
                        <img src='/carousel/cabin.jpg' alt='' className='size-14 rounded-lg object-cover' />
                    </ListItemLeading>
                    <ListItemContent>
                        <ListItemLabel>Image</ListItemLabel>
                        <ListItemSupportingText>56 × 56</ListItemSupportingText>
                    </ListItemContent>
                </ListItem>
                <ListItem onClick={() => {}}>
                    <ListItemLeading>
                        <img src='/carousel/waterfall.jpg' alt='' className='h-14 w-25 rounded-lg object-cover' />
                        <i className='absolute icon-[material-symbols--play-arrow-rounded] size-6 text-white' />
                    </ListItemLeading>
                    <ListItemContent>
                        <ListItemLabel>Video</ListItemLabel>
                        <ListItemSupportingText>100 × 56</ListItemSupportingText>
                    </ListItemContent>
                </ListItem>
                <ListItem selectable selected={checked} onSelectedChange={setChecked}>
                    <ListItemLeading className='size-6'>
                        <Checkbox checked={checked} />
                    </ListItemLeading>
                    <ListItemContent>
                        <ListItemLabel>Checkbox</ListItemLabel>
                    </ListItemContent>
                </ListItem>
                <ListItem selectable selected={radio} onSelectedChange={setRadio}>
                    <ListItemLeading className='size-6'>
                        <RadioGroup value={radio ? 'on' : ''}>
                            <RadioGroupItem value='on' />
                        </RadioGroup>
                    </ListItemLeading>
                    <ListItemContent>
                        <ListItemLabel>Radio button</ListItemLabel>
                    </ListItemContent>
                </ListItem>
                <ListItem selectable selected={on} onSelectedChange={setOn}>
                    <ListItemLeading>
                        <Switch checked={on} />
                    </ListItemLeading>
                    <ListItemContent>
                        <ListItemLabel>Switch</ListItemLabel>
                    </ListItemContent>
                </ListItem>
            </List>
        </div>
    )
}
