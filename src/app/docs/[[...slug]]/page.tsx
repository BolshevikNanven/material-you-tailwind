import { docsSource } from '@/lib/source'
import { notFound } from 'next/navigation'
import components from '../../../../components'
import DocOverview from '@/components/doc-overview'
import Image from 'next/image'

export default async function DocsPage(props: { params: Promise<{ slug?: string[] }> }) {
    const params = await props.params
    const page = docsSource.getPage(params.slug)
    if (!page) notFound()

    const MDX = page.data.body

    return (
        <>
            <div className='mx-auto flex h-fit w-full max-w-221 flex-col px-8 pb-20'>
                <header className='mt-28'>
                    <h3 className='text-6xl'>{page.data.title}</h3>
                    <div className='mt-4 flex'>
                        <p className='mr-10 text-xl text-on-surface-variant'>{page.data.description}</p>
                    </div>
                    {page.data.image && (
                        <div className='relative mt-8 aspect-video w-full overflow-hidden rounded-3xl'>
                            <Image src={page.data.image} alt={page.data.title} fill className='object-cover' />
                        </div>
                    )}
                </header>
                <main>
                    <MDX components={components} />
                </main>
            </div>
            <DocOverview toc={page.data.toc} />
        </>
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
