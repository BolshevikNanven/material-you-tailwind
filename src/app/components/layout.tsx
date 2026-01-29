import DocContainer from '@/components/doc-container'
import { componentsSource } from '@/lib/source'

export default function ComponentsLayout({ children }: { children: React.ReactNode }) {
    const pages = componentsSource.getPages()

    return (
        <DocContainer
            data={[
                { title: 'Overview', href: '/components' },
                ...pages.map(page => ({ title: page.data.title, href: page.url })),
            ]}
        >
            {children}
        </DocContainer>
    )
}
