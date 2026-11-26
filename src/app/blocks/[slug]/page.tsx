import { blocks, getBlock } from '@/blocks'
import BlockViewer from '@/components/blocks/block-viewer'
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { notFound } from 'next/navigation'

export default async function BlockPage(props: { params: Promise<{ slug: string }> }) {
    const { slug } = await props.params
    const block = getBlock(slug)
    if (!block) notFound()

    const code = await readFile(path.join(process.cwd(), block.file), 'utf8')

    return <BlockViewer slug={block.slug} code={code} />
}

export function generateStaticParams() {
    return blocks.map(block => ({ slug: block.slug }))
}

export async function generateMetadata(props: { params: Promise<{ slug: string }> }) {
    const { slug } = await props.params
    const block = getBlock(slug)
    if (!block) notFound()

    return { title: block.title, description: block.description }
}
