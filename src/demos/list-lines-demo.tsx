'use client'

import {
    List,
    ListItem,
    ListItemContent,
    ListItemLabel,
    ListItemLeading,
    ListItemOverline,
    ListItemSupportingText,
    ListItemTrailing,
    ListItemTrailingText,
} from '@/components/ui/list'

export function ListLinesDemo() {
    return (
        <div className='w-full max-w-90 rounded-3xl bg-surface-container p-3'>
            <List variant='segmented'>
                <ListItem onClick={() => {}}>
                    <ListItemLeading>
                        <i className='icon-[material-symbols--person-outline-rounded]' />
                    </ListItemLeading>
                    <ListItemContent>
                        <ListItemLabel>One line</ListItemLabel>
                    </ListItemContent>
                    <ListItemTrailing>
                        <ListItemTrailingText>⌘C</ListItemTrailingText>
                    </ListItemTrailing>
                </ListItem>
                <ListItem onClick={() => {}}>
                    <ListItemLeading>
                        <i className='icon-[material-symbols--person-outline-rounded]' />
                    </ListItemLeading>
                    <ListItemContent>
                        <ListItemLabel>Two lines</ListItemLabel>
                        <ListItemSupportingText>Supporting line text</ListItemSupportingText>
                    </ListItemContent>
                    <ListItemTrailing>
                        <ListItemTrailingText>⌘C</ListItemTrailingText>
                    </ListItemTrailing>
                </ListItem>
                <ListItem onClick={() => {}}>
                    <ListItemLeading>
                        <i className='icon-[material-symbols--person-outline-rounded]' />
                    </ListItemLeading>
                    <ListItemContent>
                        <ListItemOverline>Overline</ListItemOverline>
                        <ListItemLabel>Two lines with overline</ListItemLabel>
                        <ListItemSupportingText>Supporting line text</ListItemSupportingText>
                    </ListItemContent>
                    <ListItemTrailing>
                        <ListItemTrailingText>⌘C</ListItemTrailingText>
                    </ListItemTrailing>
                </ListItem>
                <ListItem onClick={() => {}}>
                    <ListItemLeading>
                        <i className='icon-[material-symbols--person-outline-rounded]' />
                    </ListItemLeading>
                    <ListItemContent>
                        <ListItemOverline>Overline</ListItemOverline>
                        <ListItemLabel>Three lines</ListItemLabel>
                        <ListItemSupportingText lines={2}>
                            Supporting line text that wraps onto a second line, lorem ipsum dolor sit amet
                        </ListItemSupportingText>
                    </ListItemContent>
                    <ListItemTrailing>
                        <ListItemTrailingText>⌘C</ListItemTrailingText>
                    </ListItemTrailing>
                </ListItem>
            </List>
        </div>
    )
}
