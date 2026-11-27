'use client'

import { getBlock, type BlockSlug } from '@/blocks'
import DashboardBlock from '@/blocks/dashboard'
import SupportInboxBlock from '@/blocks/support-inbox'
import { CodeViewer } from '@/components/code-viewer'
import { Button } from '@/components/ui/button'
import { ButtonGroup } from '@/components/ui/button-group'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Toggle } from '@/components/ui/toggle'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { useState, type ComponentType } from 'react'

const blockDemos = {
    dashboard: DashboardBlock,
    'support-inbox': SupportInboxBlock,
} satisfies Record<BlockSlug, ComponentType>

const viewports = [
    { key: 'desktop', label: 'Desktop', width: '100%', icon: 'icon-[material-symbols--desktop-windows-outline-rounded]' },
    { key: 'tablet', label: 'Tablet', width: '820px', icon: 'icon-[material-symbols--tablet-android-outline-rounded]' },
    { key: 'mobile', label: 'Mobile', width: '412px', icon: 'icon-[material-symbols--phone-android-outline-rounded]' },
] as const

export default function BlockViewer({ slug, code }: { slug: string; code: string }) {
    const block = getBlock(slug)
    const [tab, setTab] = useState('preview')
    const [viewport, setViewport] = useState<(typeof viewports)[number]['key']>('desktop')

    if (!block) return null
    const Component = blockDemos[block.slug]
    const width = viewports.find(v => v.key === viewport)!.width
    const isMobile = viewport === 'mobile'

    return (
        <div className='flex h-full w-full flex-col overflow-hidden rounded-l-3xl bg-surface px-8'>
            <header className='flex shrink-0 items-center gap-3 pt-6 pb-4'>
                <Button variant='text' icon asChild className='text-on-surface-variant'>
                    <Link href='/blocks' aria-label='Back to blocks'>
                        <i className='icon-[material-symbols--arrow-back-rounded] size-6' />
                    </Link>
                </Button>
                <h1 className='text-2xl'>{block.title}</h1>
            </header>

            <Tabs value={tab} onValueChange={setTab} className='flex min-h-0 flex-1 flex-col'>
                <div className='flex shrink-0 items-center gap-4'>
                    <TabsList variant='secondary' className='mr-auto border-none'>
                        <TabsTrigger value='preview' className='w-24'>
                            Preview
                        </TabsTrigger>
                        <TabsTrigger value='code' className='w-24'>
                            Code
                        </TabsTrigger>
                    </TabsList>
                    {tab === 'preview' && (
                        <ButtonGroup variant='connected'>
                            {viewports.map(v => (
                                <Toggle
                                    key={v.key}
                                    size='sm'
                                    variant='tonal'
                                    title={v.label}
                                    aria-label={v.label}
                                    pressed={viewport === v.key}
                                    onPressedChange={() => setViewport(v.key)}
                                >
                                    <i className={v.icon} />
                                    {v.label}
                                </Toggle>
                            ))}
                        </ButtonGroup>
                    )}
                </div>
                <TabsContent value='preview' className='flex min-h-0 justify-center pt-4 pb-6'>
                    <div
                        className={cn(
                            'h-full max-w-full overflow-hidden rounded-3xl border border-outline-variant transition-[width] duration-300',
                            isMobile && 'max-h-[880px]',
                        )}
                        style={{ width }}
                    >
                        <Component />
                    </div>
                </TabsContent>
                <TabsContent value='code' className='flex min-h-0 flex-col pt-4 pb-6'>
                    <CodeViewer fill className='min-h-0 flex-1' title={block.file.split('/').pop()} code={code} />
                </TabsContent>
            </Tabs>
        </div>
    )
}
