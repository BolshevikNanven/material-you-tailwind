import { componentsSource } from '@/lib/source'
import { notFound } from 'next/navigation'
import { DocPage } from '@/components/doc-page'

export default async function ComponentsPage(props: { params: Promise<{ slug: string[] }> }) {
    const params = await props.params
    const page = componentsSource.getPage(params.slug)
    if (!page) notFound()

    return <DocPage page={page} source={componentsSource} />
}

export async function generateStaticParams() {
    return componentsSource.generateParams()
}

export async function generateMetadata(props: { params: Promise<{ slug: string[] }> }) {
    const params = await props.params
    const page = componentsSource.getPage(params.slug)

    if (!page) notFound()

    return {
        title: page.data.title,
        description: page.data.description,
    }
}
