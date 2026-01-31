import DocContainer from '@/components/doc-container'
import { docsSource } from '@/lib/source'

export default async function ComponentLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    const pages = docsSource.getPages()
    const ORDER = ['Introduction', 'Installation', 'Colors', 'Icons']

    const sortedPages = pages.sort((a, b) => {
        const indexA = ORDER.indexOf(a.data.title)
        const indexB = ORDER.indexOf(b.data.title)
        if (indexA === -1) return 1
        if (indexB === -1) return -1
        return indexA - indexB
    })

    return <DocContainer data={sortedPages.map(page => ({ title: page.data.title, href: page.url }))}>{children}</DocContainer>
}
