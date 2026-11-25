// Some shells prepend the same preload on every startup. Next 16.1.1 joins
// those paths into a single filename when passing NODE_OPTIONS to its workers.
if (process.env.NODE_OPTIONS) {
    process.env.NODE_OPTIONS = process.env.NODE_OPTIONS.replace(/^(--require [^"\s]+)(?: \1)+(?= |$)/, '$1')
}

await import('next/dist/bin/next')
