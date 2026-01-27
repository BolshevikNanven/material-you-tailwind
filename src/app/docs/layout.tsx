import Overview from '@/components/overview'
import { docsSource } from '@/lib/source'

export default async function ComponentLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    const pages = docsSource.getPages()

    return (
        <div className='flex h-full w-full rounded-l-3xl bg-surface'>
            <div className='flex h-full w-60 flex-col overflow-y-auto p-2'>
                <Overview data={pages.map(page => ({ title: page.data.title, href: page.url }))} />
            </div>
            {children}
        </div>
    )
}
