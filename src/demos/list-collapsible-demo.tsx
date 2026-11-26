'use client'

import {
    List,
    ListCollapsible,
    ListCollapsibleContent,
    ListCollapsibleIndicator,
    ListCollapsibleTrigger,
    ListItem,
    ListItemContent,
    ListItemLabel,
    ListItemLeading,
    ListItemSupportingText,
    ListItemTrailing,
    ListItemTrailingText,
} from '@/components/ui/list'

const files = [
    { name: 'Roadmap.pdf', size: '2.4 MB' },
    { name: 'Budget.xlsx', size: '840 KB' },
    { name: 'Brand guide.fig', size: '18 MB' },
]

export function ListCollapsibleDemo() {
    return (
        <div className='w-full max-w-90 rounded-3xl bg-surface-container p-3'>
            <List variant='segmented'>
                <ListCollapsible defaultOpen>
                    <ListCollapsibleTrigger>
                        <ListItem>
                            <ListItemLeading>
                                <i className='icon-[material-symbols--folder-outline-rounded]' />
                            </ListItemLeading>
                            <ListItemContent>
                                <ListItemLabel>Projects</ListItemLabel>
                                <ListItemSupportingText>3 files</ListItemSupportingText>
                            </ListItemContent>
                            <ListItemTrailing>
                                <ListCollapsibleIndicator />
                            </ListItemTrailing>
                        </ListItem>
                    </ListCollapsibleTrigger>
                    <ListCollapsibleContent>
                        {files.map(file => (
                            <ListItem key={file.name} onClick={() => {}}>
                                <ListItemLeading>
                                    <i className='icon-[material-symbols--description-outline-rounded]' />
                                </ListItemLeading>
                                <ListItemContent>
                                    <ListItemLabel>{file.name}</ListItemLabel>
                                </ListItemContent>
                                <ListItemTrailing>
                                    <ListItemTrailingText>{file.size}</ListItemTrailingText>
                                </ListItemTrailing>
                            </ListItem>
                        ))}
                    </ListCollapsibleContent>
                </ListCollapsible>
                <ListCollapsible>
                    <ListCollapsibleTrigger>
                        <ListItem>
                            <ListItemLeading>
                                <i className='icon-[material-symbols--folder-outline-rounded]' />
                            </ListItemLeading>
                            <ListItemContent>
                                <ListItemLabel>Archive</ListItemLabel>
                                <ListItemSupportingText>2 files</ListItemSupportingText>
                            </ListItemContent>
                            <ListItemTrailing>
                                <ListCollapsibleIndicator />
                            </ListItemTrailing>
                        </ListItem>
                    </ListCollapsibleTrigger>
                    <ListCollapsibleContent>
                        {['Notes 2025.txt', 'Old logo.svg'].map(name => (
                            <ListItem key={name} onClick={() => {}}>
                                <ListItemLeading>
                                    <i className='icon-[material-symbols--description-outline-rounded]' />
                                </ListItemLeading>
                                <ListItemContent>
                                    <ListItemLabel>{name}</ListItemLabel>
                                </ListItemContent>
                            </ListItem>
                        ))}
                    </ListCollapsibleContent>
                </ListCollapsible>
            </List>
        </div>
    )
}
