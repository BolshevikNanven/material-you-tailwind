import DocContainer from '@/components/doc-container'
import { docsSource } from '@/lib/source'
import { sortDocsPages } from '@/lib/order'

export default async function ComponentLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    const pages = docsSource.getPages()
    const sortedPages = sortDocsPages(pages)

    return <DocContainer data={sortedPages.map(page => ({ title: page.data.title, href: page.url }))}>{children}</DocContainer>
}
