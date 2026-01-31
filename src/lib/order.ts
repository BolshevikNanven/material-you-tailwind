export /* eslint-disable @typescript-eslint/no-explicit-any */ interface Page {
    url: string
    data: {
        title: string
        description?: string
        image?: string
        toc: any[]
        body: any
    }
}

export const DOCS_ORDER = ['Introduction', 'Installation', 'Colors', 'Icons']

export function sortDocsPages(pages: Page[]): Page[] {
    return [...pages].sort((a, b) => {
        const indexA = DOCS_ORDER.indexOf(a.data.title)
        const indexB = DOCS_ORDER.indexOf(b.data.title)
        if (indexA === -1) return 1
        if (indexB === -1) return -1
        return indexA - indexB
    })
}
