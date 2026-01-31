import { createHighlighterCore } from 'shiki/core'
import { createOnigurumaEngine } from 'shiki/engine/oniguruma'

let highlighterPromise: ReturnType<typeof createHighlighterCore> | null = null

async function getHighlighter() {
    if (!highlighterPromise) {
        highlighterPromise = createHighlighterCore({
            themes: [import('@shikijs/themes/github-light'), import('@shikijs/themes/github-dark')],
            langs: [import('@shikijs/langs/tsx'), import('@shikijs/langs/typescript'), import('@shikijs/langs/css')],
            engine: createOnigurumaEngine(import('shiki/wasm')),
        })
    }
    return highlighterPromise
}

export async function highlight(code: string, theme: 'light' | 'dark' = 'light') {
    const highlighter = await getHighlighter()
    return highlighter.codeToHtml(code, {
        lang: 'tsx',
        theme: theme === 'light' ? 'github-light' : 'github-dark',
    })
}
