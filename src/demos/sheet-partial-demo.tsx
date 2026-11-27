'use client'

import { Button } from '@/components/ui/button'
import { List, ListItem, ListItemContent, ListItemLabel, ListItemSupportingText } from '@/components/ui/list'
import { Sheet, SheetBody, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'

const places = Array.from({ length: 24 }, (_, index) => ({
    name: `Place ${index + 1}`,
    distance: `${(index * 0.4 + 0.3).toFixed(1)} km away`,
}))

export function SheetPartialDemo() {
    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant='tonal'>Open tall sheet</Button>
            </SheetTrigger>
            <SheetContent aria-describedby={undefined}>
                <SheetHeader>
                    <SheetTitle>Nearby</SheetTitle>
                </SheetHeader>
                <SheetBody className='px-0'>
                    <List className='bg-transparent'>
                        {places.map(place => (
                            <ListItem key={place.name} className='bg-transparent'>
                                <ListItemContent>
                                    <ListItemLabel>{place.name}</ListItemLabel>
                                    <ListItemSupportingText>{place.distance}</ListItemSupportingText>
                                </ListItemContent>
                            </ListItem>
                        ))}
                    </List>
                </SheetBody>
            </SheetContent>
        </Sheet>
    )
}
