import { blocks, getBlock, type BlockSlug } from '@/blocks'
import DashboardBlock from '@/blocks/dashboard'
import MusicPlayerBlock from '@/blocks/music-player'
import SupportInboxBlock from '@/blocks/support-inbox'
import BlockPreview from '@/components/blocks/block-preview'
import { notFound } from 'next/navigation'
import type { ComponentType } from 'react'

const blockDemos = {
    dashboard: DashboardBlock,
    'support-inbox': SupportInboxBlock,
    'music-player': MusicPlayerBlock,
} satisfies Record<BlockSlug, ComponentType>

export function generateStaticParams() {
    return blocks.map(block => ({ slug: block.slug }))
}

export default async function BlockPreviewPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params
    const block = getBlock(slug)
    if (!block) notFound()

    const Demo = blockDemos[block.slug]

    return (
        <BlockPreview>
            <Demo />
        </BlockPreview>
    )
}
