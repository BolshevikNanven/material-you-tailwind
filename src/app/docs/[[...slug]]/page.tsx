import { docsSource } from '@/lib/source'
import { notFound } from 'next/navigation'

export default async function DocsPage(props: { params: Promise<{ slug?: string[] }> }) {
    const params = await props.params
    const page = docsSource.getPage(params.slug)
    if (!page) notFound()

    const MDX = page.data.body

    return (
        <div className='flex h-screen flex-1 flex-col overflow-hidden'>
            <div className='flex h-full w-full flex-col gap-2 overflow-auto rounded-l-3xl bg-surface p-6'>
                <h1>{page.data.title}</h1>
                <p>{page.data.description}</p>
                <MDX />
            </div>
        </div>
    )
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
