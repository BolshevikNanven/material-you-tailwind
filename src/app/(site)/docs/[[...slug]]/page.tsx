import { docsSource } from '@/lib/source'
import { notFound } from 'next/navigation'
import { DocPage } from '@/components/doc-page'

import { sortDocsPages } from '@/lib/order'

export default async function DocsPage(props: { params: Promise<{ slug?: string[] }> }) {
    const params = await props.params
    const page = docsSource.getPage(params.slug)
    if (!page) notFound()

    const pages = docsSource.getPages()
    const sortedPages = sortDocsPages(pages)

    return <DocPage page={page} source={docsSource} pages={sortedPages} />
}

export async function generateStaticParams() {
    return docsSource.generateParams()
}

export async function generateMetadata(props: { params: Promise<{ slug?: string[] }> }) {
    const params = await props.params
    const page = docsSource.getPage(params.slug)

    if (!page) notFound()

    return {
        title: page.data.title,
        description: page.data.description,
    }
}
