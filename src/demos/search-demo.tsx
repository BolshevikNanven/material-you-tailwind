'use client'

import * as React from 'react'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Search, SearchInput, SearchList, SearchListItem, SearchTrigger } from '@/components/ui/search'
import { Button } from '@/components/ui/button'

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
                    <span data-slot='search-list-item-leading'>
                        <Avatar className='size-10 bg-surface-container-high'>
                            <AvatarFallback className='text-on-surface-variant/35'>
                                <i className={result.icon} />
                            </AvatarFallback>
                        </Avatar>
                    </span>
                    <span data-slot='search-list-item-content'>
                        <span data-slot='search-list-item-title'>{result.title}</span>
                        <span data-slot='search-list-item-supporting'>{result.supporting}</span>
                    </span>
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
                    <Button icon>
                        <i className='icon-[material-symbols--menu-rounded]' />
                    </Button>
                    <SearchInput />
                    <button data-slot='search-trailing' type='button' aria-label='Voice search'>
                        <i className='icon-[material-symbols--mic-rounded]' />
                    </button>
                </SearchTrigger>
                <SearchList>
                    <SearchResults />
                </SearchList>
            </Search>

            <Search className='w-[412px]' open={fullscreenOpen} onOpenChange={setFullscreenOpen} variant='fullscreen'>
                <SearchTrigger>
                    <button data-slot='search-leading' type='button' data-search-open>
                            <i className='icon-[material-symbols--search-rounded]' />
                        </button>
                    <SearchInput className='pl-0'/>
                </SearchTrigger>
                <SearchList>
                    <SearchResults />
                </SearchList>
            </Search>
        </div>
    )
}
