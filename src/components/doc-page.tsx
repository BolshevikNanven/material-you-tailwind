/* eslint-disable @typescript-eslint/no-explicit-any */

import Image from 'next/image'
import Link from 'next/link'
import components from '../../components'
import DocOverview from '@/components/doc-overview'
import { Button } from '@/components/ui/button'

import { Page } from '@/lib/order'

interface DocPageProps {
    page: Page
    source: any
    pages?: Page[]
}

export function DocPage({ page, source, pages = source.getPages() as Page[] }: DocPageProps) {
    const MDX = page.data.body as React.ComponentType<{ components: any }>

    const index = pages.findIndex(p => p.url === page.url)
    const prev = index > 0 ? pages[index - 1] : null
    const next = index < pages.length - 1 ? pages[index + 1] : null

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
                <div className='mt-10 grid grid-cols-2 gap-4'>
                    {prev ? (
                        <Button variant='tonal' className='h-fit flex-col items-start gap-1 p-5' asChild>
                            <Link href={prev.url}>
                                <span className='flex text-on-surface-variant'>
                                    <i className='icon-[material-symbols--arrow-left-alt-rounded]' />
                                    Previous
                                </span>
                                <span className='text-xl text-on-surface'>{prev.data.title}</span>
                            </Link>
                        </Button>
                    ) : (
                        <div />
                    )}
                    {next && (
                        <Button variant='tonal' className='h-fit flex-col items-end gap-1 p-5 text-right' asChild>
                            <Link href={next.url}>
                                <span className='flex text-on-surface-variant'>
                                    Next
                                    <i className='icon-[material-symbols--arrow-right-alt-rounded]' />
                                </span>
                                <span className='text-xl text-on-surface'>{next.data.title}</span>
                            </Link>
                        </Button>
                    )}
                </div>
            </div>
            <DocOverview toc={page.data.toc} />
        </>
    )
}
