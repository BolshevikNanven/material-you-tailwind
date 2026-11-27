'use client'

import * as React from 'react'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { ListItemContent, ListItemLabel, ListItemLeading, ListItemSupportingText } from '@/components/ui/list'
import { Search, SearchInput, SearchList, SearchListItem, SearchTrigger } from '@/components/ui/search'

const results = [
    {
        title: 'Label text',
        supporting: 'Supporting line text, lorem ipsum dolor',
        icon: 'icon-[material-symbols--category-rounded]',
    },
    {
        title: 'Label text',
        supporting: 'Supporting line text, lorem ipsum dolor',
        icon: 'icon-[material-symbols--category-rounded]',
    },
    {
        title: 'Label text',
        supporting: 'Supporting line text, lorem ipsum dolor',
        icon: 'icon-[material-symbols--category-rounded]',
    },
]

function SearchResults() {
    return (
        <>
            {results.map((result, index) => (
                <SearchListItem key={index}>
                    <ListItemLeading>
                        <Avatar className='size-10 bg-surface-container-high'>
                            <AvatarFallback className='text-on-surface-variant/35'>
                                <i className={result.icon} />
                            </AvatarFallback>
                        </Avatar>
                    </ListItemLeading>
                    <ListItemContent>
                        <ListItemLabel>{result.title}</ListItemLabel>
                        <ListItemSupportingText>{result.supporting}</ListItemSupportingText>
                    </ListItemContent>
                </SearchListItem>
            ))}
        </>
    )
}

export function SearchDemo() {
    const [fullscreenOpen, setFullscreenOpen] = React.useState(false)

    return (
        <div className='flex w-full flex-col items-center gap-8'>
            <Search className='w-[360px]' variant='docked'>
                <SearchTrigger>
                    <button data-slot='search-button' type='button' aria-label='Open navigation'>
                        <i className='icon-[material-symbols--menu-rounded]' />
                    </button>
                    <SearchInput />
                    <button data-slot='search-button' type='button' aria-label='Voice search'>
                        <i className='icon-[material-symbols--mic-rounded]' />
                    </button>
                </SearchTrigger>
                <SearchList>
                    <SearchResults />
                </SearchList>
            </Search>

            <Search className='w-[412px]' open={fullscreenOpen} onOpenChange={setFullscreenOpen} variant='fullscreen'>
                <SearchTrigger>
                    <button data-slot='search-button' type='button' data-search-open aria-label='Open search'>
                        <i className='icon-[material-symbols--search-rounded]' />
                    </button>
                    <SearchInput className='pl-0' />
                </SearchTrigger>
                <SearchList>
                    <SearchResults />
                </SearchList>
            </Search>
        </div>
    )
}
