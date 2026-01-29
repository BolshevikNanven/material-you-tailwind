import { componentsSource } from '@/lib/source'
import { notFound } from 'next/navigation'
import components from '../../../../components'

export default async function ComponentsPage(props: { params: Promise<{ slug: string[] }> }) {
    const params = await props.params
    const page = componentsSource.getPage(params.slug)
    if (!page) notFound()

    const MDX = page.data.body

    return (
        <div className='mx-auto flex h-full w-full max-w-221 flex-col px-8'>
            <header className='mt-28'>
                <h3 className='text-6xl'>{page.data.title}</h3>
                <div className='mt-4 flex'>
                    <p className='mr-10 text-xl text-on-surface-variant'>{page.data.description}</p>
                </div>
            </header>
            <MDX components={components} />
        </div>
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
