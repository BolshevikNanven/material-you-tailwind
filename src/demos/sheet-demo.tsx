'use client'

import { Button } from '@/components/ui/button'
import { Divider } from '@/components/ui/divider'
import {
    List,
    ListItem,
    ListItemContent,
    ListItemLabel,
    ListItemLeading,
    ListItemSupportingText,
    ListItemTrailing,
} from '@/components/ui/list'
import {
    Sheet,
    SheetBody,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet'
import { Switch } from '@/components/ui/switch'

const actions = [
    { icon: 'icon-[material-symbols--share-outline]', label: 'Share', supporting: 'Send to people or apps' },
    { icon: 'icon-[material-symbols--link-rounded]', label: 'Get link', supporting: 'Anyone with the link can view' },
    { icon: 'icon-[material-symbols--edit-outline-rounded]', label: 'Edit name', supporting: 'Summer 2026' },
    { icon: 'icon-[material-symbols--download-rounded]', label: 'Download', supporting: '128 photos, 412 MB' },
]

export function SheetDemo() {
    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant='tonal'>Open bottom sheet</Button>
            </SheetTrigger>
            <SheetContent skipPartiallyExpanded>
                <SheetHeader className='flex-col items-start justify-center gap-1'>
                    <SheetTitle className='flex-none'>Summer 2026</SheetTitle>
                    <SheetDescription>128 photos · Shared with 4 people</SheetDescription>
                </SheetHeader>
                <SheetBody className='px-0'>
                    <List>
                        {actions.map(action => (
                            <SheetClose key={action.label} asChild>
                                <ListItem className='bg-transparent px-6'>
                                    <ListItemLeading>
                                        <i className={action.icon} />
                                    </ListItemLeading>
                                    <ListItemContent>
                                        <ListItemLabel>{action.label}</ListItemLabel>
                                        <ListItemSupportingText>{action.supporting}</ListItemSupportingText>
                                    </ListItemContent>
                                </ListItem>
                            </SheetClose>
                        ))}
                    </List>
                    <Divider className='my-2' />
                    <List>
                        <ListItem className='bg-transparent px-6'>
                            <ListItemLeading>
                                <i className='icon-[material-symbols--group-outline-rounded]' />
                            </ListItemLeading>
                            <ListItemContent>
                                <ListItemLabel>Allow others to add photos</ListItemLabel>
                            </ListItemContent>
                            <ListItemTrailing>
                                <Switch defaultChecked aria-label='Allow others to add photos' />
                            </ListItemTrailing>
                        </ListItem>
                        <SheetClose asChild>
                            <ListItem className='bg-transparent px-6 [--list-item-content:var(--error)] [--list-item-variant:var(--error)]'>
                                <ListItemLeading>
                                    <i className='icon-[material-symbols--delete-outline-rounded]' />
                                </ListItemLeading>
                                <ListItemContent>
                                    <ListItemLabel>Delete collection</ListItemLabel>
                                </ListItemContent>
                            </ListItem>
                        </SheetClose>
                    </List>
                </SheetBody>
            </SheetContent>
        </Sheet>
    )
}
