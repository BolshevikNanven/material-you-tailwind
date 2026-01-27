import Overview from '@/components/overview'
import { componentsSource } from '@/lib/source'

export default function ComponentsLayout({ children }: { children: React.ReactNode }) {
    const pages = componentsSource.getPages()

    return (
        <div className='flex h-full w-full rounded-l-3xl bg-surface'>
            <div className='flex h-full w-60 shrink-0 flex-col overflow-y-auto p-2'>
                <Overview
                    data={[
                        { title: 'Overview', href: '/components' },
                        ...pages.map(page => ({ title: page.data.title, href: page.url })),
                    ]}
                />
            </div>
            <div className='flex-1 overflow-auto'>{children}</div>
        </div>
    )
}
