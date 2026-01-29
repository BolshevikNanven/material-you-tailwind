import DocContainer from '@/components/doc-container'
import { docsSource } from '@/lib/source'

export default async function ComponentLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    const pages = docsSource.getPages()

    return <DocContainer data={pages.map(page => ({ title: page.data.title, href: page.url }))}>{children}</DocContainer>
}
