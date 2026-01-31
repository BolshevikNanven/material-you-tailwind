import { componentsSource } from '@/lib/source'
import { notFound } from 'next/navigation'
import components from '../../../../components'
import DocOverview from '@/components/doc-overview'

export default async function ComponentsPage(props: { params: Promise<{ slug: string[] }> }) {
    const params = await props.params
    const page = componentsSource.getPage(params.slug)
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
