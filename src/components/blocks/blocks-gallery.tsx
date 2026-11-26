'use client'

import { blocks, categories, type Block } from '@/blocks'
import BlockThumbnail from '@/components/blocks/block-thumbnail'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Search, SearchInput, SearchTrigger } from '@/components/ui/search'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { useState } from 'react'

const DISCOVER = 'Discover'

function BlockCard({ block }: { block: Block }) {
    return (
        <Card variant='filled' actionable asChild className='rounded-3xl bg-surface-container-low'>
            <Link href={`/blocks/${block.slug}`} className='flex flex-col p-4'>
                <BlockThumbnail slug={block.slug} />
                <p className='mt-4 truncate text-base font-medium'>{block.title}</p>
                <p className='mt-1 text-sm text-on-surface-variant'>
                    {block.category} · {block.components.length} components
                </p>
                <p className='mt-2 line-clamp-2 text-sm text-on-surface-variant'>{block.description}</p>
            </Link>
        </Card>
    )
}

function SectionHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: React.ReactNode }) {
    return (
        <div className='mb-6 flex items-end gap-4'>
            <div className='mr-auto'>
                <h2 className='text-[28px] leading-9'>{title}</h2>
                {subtitle && <p className='mt-1 text-sm text-on-surface-variant'>{subtitle}</p>}
            </div>
            {action}
        </div>
    )
}

function FeaturedBanner({ block }: { block: Block }) {
    return (
        <section className='relative flex min-h-80 overflow-hidden rounded-[28px] bg-primary-container text-on-primary-container'>
            <div className='relative z-10 flex w-full flex-col justify-center gap-4 p-10 md:w-[45%] md:pr-0'>
                <p className='text-sm font-medium'>Featured block</p>
                <h2 className='text-[45px] leading-[52px]'>{block.title}</h2>
                <p className='text-base opacity-80'>{block.description}</p>
                <div className='mt-2 flex gap-2'>
                    <Button asChild>
                        <Link href={`/blocks/${block.slug}`}>Open block</Link>
                    </Button>
                    <Button variant='text' asChild className='text-on-primary-container'>
                        <Link href='/components'>Browse components</Link>
                    </Button>
                </div>
            </div>
            <div className='absolute top-10 -right-16 hidden w-[58%] overflow-hidden rounded-3xl shadow-elevation-3 md:block'>
                <BlockThumbnail slug={block.slug} />
            </div>
        </section>
    )
}

export default function BlocksGallery() {
    const [tab, setTab] = useState<string>(DISCOVER)
    const [query, setQuery] = useState('')

    const q = query.trim().toLowerCase()
    const filtered = blocks.filter(
        b =>
            (tab === DISCOVER || b.category === tab) &&
            (!q || [b.title, b.description, b.category, ...b.components].some(v => v.toLowerCase().includes(q))),
    )
    const browsing = tab === DISCOVER && !q

    return (
        <div className='flex h-full w-full flex-col overflow-y-auto rounded-l-3xl bg-surface'>
            <header className='sticky top-0 z-30 shrink-0 bg-surface'>
                {/* Title row: compact title on the left, search on the right */}
                <div className='flex h-18 items-center gap-6 px-6'>
                    <div className='mr-auto min-w-0'>
                        <h1 className='text-[22px] leading-7'>Blocks</h1>
                        <p className='truncate text-sm text-on-surface-variant'>
                            Screens and patterns composed from the components
                        </p>
                    </div>
                    <Search variant='docked' className='w-full max-w-md'>
                        <SearchTrigger className='h-12'>
                            <span data-slot='search-icon'>
                                <i className='icon-[material-symbols--search-rounded]' />
                            </span>
                            <SearchInput className='pl-0' placeholder='Search blocks' value={query} onValueChange={setQuery} />
                        </SearchTrigger>
                    </Search>
                </div>
                <Tabs value={tab} onValueChange={setTab} className='px-6'>
                    <TabsList variant='secondary' className='border-none'>
                        {[DISCOVER, ...categories.map(c => c.name)].map(name => (
                            <TabsTrigger key={name} value={name} className='w-auto px-4!'>
                                {name}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                </Tabs>
            </header>

            <div className='mx-auto flex w-full max-w-[1120px] flex-col gap-14 px-8 pt-8 pb-16'>
                {browsing ? (
                    <>
                        <FeaturedBanner block={blocks[0]} />

                        <section>
                            <SectionHeader title='Categories' />
                            <div className='grid grid-cols-2 gap-4 lg:grid-cols-4'>
                                {categories.map(c => (
                                    <Card key={c.name} actionable asChild className={cn('rounded-2xl', c.container)}>
                                        <button
                                            type='button'
                                            onClick={() => setTab(c.name)}
                                            className='flex h-20 items-center justify-between gap-3 px-4 text-left'
                                        >
                                            <span className='text-base font-medium'>{c.name}</span>
                                            <span
                                                className={cn(
                                                    'flex size-12 items-center justify-center rounded-full',
                                                    c.accent,
                                                )}
                                            >
                                                <i className={cn(c.icon, 'size-6')} />
                                            </span>
                                        </button>
                                    </Card>
                                ))}
                            </div>
                        </section>

                        <section>
                            <SectionHeader
                                title='All blocks'
                                subtitle='Open one to interact with it at desktop, tablet and mobile sizes'
                            />
                            <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4'>
                                {blocks.map(block => (
                                    <BlockCard key={block.slug} block={block} />
                                ))}
                            </div>
                        </section>
                    </>
                ) : (
                    <section>
                        <SectionHeader
                            title={q ? `Results for “${query.trim()}”` : tab}
                            subtitle={`${filtered.length} ${filtered.length === 1 ? 'block' : 'blocks'}`}
                        />
                        {filtered.length > 0 ? (
                            <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4'>
                                {filtered.map(block => (
                                    <BlockCard key={block.slug} block={block} />
                                ))}
                            </div>
                        ) : (
                            <div className='flex flex-col items-center gap-3 rounded-3xl bg-surface-container-low py-16 text-center'>
                                <i className='icon-[material-symbols--widgets-outline-rounded] size-12 text-on-surface-variant' />
                                <p className='text-base'>No blocks here yet</p>
                                <p className='text-sm text-on-surface-variant'>More blocks are on the way.</p>
                                <Button variant='text' size='sm' onClick={() => (setTab(DISCOVER), setQuery(''))}>
                                    Back to Discover
                                </Button>
                            </div>
                        )}
                    </section>
                )}
            </div>
        </div>
    )
}
