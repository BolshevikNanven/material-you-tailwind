import { cn } from '@/lib/utils'

export const dirs = ['./src/components/ui']

const components = {
    h1: ({ className, ...props }: React.ComponentProps<'h1'>) => (
        <h1 className={cn('my-4 text-5xl text-on-surface', className)} {...props} />
    ),
    h2: ({ className, ...props }: React.ComponentProps<'h2'>) => (
        <h2 className={cn('my-4 text-4xl text-on-surface', className)} {...props} />
    ),
    h3: ({ className, ...props }: React.ComponentProps<'h3'>) => (
        <h3 className={cn('my-4 text-3xl text-on-surface', className)} {...props} />
    ),
    h4: ({ className, ...props }: React.ComponentProps<'h4'>) => (
        <h4 className={cn('my-4 text-2xl text-on-surface', className)} {...props} />
    ),
    h5: ({ className, ...props }: React.ComponentProps<'h5'>) => (
        <h5 className={cn('my-2 text-xl text-on-surface', className)} {...props} />
    ),
    h6: ({ className, ...props }: React.ComponentProps<'h6'>) => (
        <h6 className={cn('my-2 text-lg text-on-surface', className)} {...props} />
    ),
    a: ({ className, ...props }: React.ComponentProps<'a'>) => (
        <a
            className={cn('font-medium text-primary underline underline-offset-4 hover:text-primary/80', className)}
            {...props}
        />
    ),
    p: ({ className, ...props }: React.ComponentProps<'p'>) => (
        <p className={cn('leading-7 text-on-surface-variant not-first:mt-6', className)} {...props} />
    ),
    ul: ({ className, ...props }: React.ComponentProps<'ul'>) => (
        <ul className={cn('my-6 ml-6 list-disc text-on-surface-variant [&>li]:mt-2', className)} {...props} />
    ),
    ol: ({ className, ...props }: React.ComponentProps<'ol'>) => (
        <ol className={cn('my-6 ml-6 list-decimal text-on-surface-variant [&>li]:mt-2', className)} {...props} />
    ),
    li: ({ className, ...props }: React.ComponentProps<'li'>) => (
        <li className={cn('text-on-surface-variant', className)} {...props} />
    ),
    blockquote: ({ className, ...props }: React.ComponentProps<'blockquote'>) => (
        <blockquote
            className={cn(
                'mt-6 rounded-r-xl border-l-4 border-primary bg-surface-container-low py-3 pr-4 pl-6 text-on-surface-variant italic',
                className,
            )}
            {...props}
        />
    ),
    img: ({ className, alt, ...props }: React.ComponentProps<'img'>) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img className={cn('rounded-2xl border border-outline-variant bg-surface-variant', className)} alt={alt} {...props} />
    ),
    hr: ({ ...props }: React.ComponentProps<'hr'>) => <hr className='my-4 border-outline-variant md:my-8' {...props} />,
    table: ({ className, ...props }: React.ComponentProps<'table'>) => (
        <div className='my-6 w-full overflow-y-auto rounded-xl border border-outline-variant'>
            <table className={cn('w-full caption-bottom text-sm', className)} {...props} />
        </div>
    ),
    tr: ({ className, ...props }: React.ComponentProps<'tr'>) => (
        <tr
            className={cn(
                'border-b border-outline-variant transition-colors hover:bg-surface-container-high/50 data-[state=selected]:bg-surface-container-highest',
                className,
            )}
            {...props}
        />
    ),
    th: ({ className, ...props }: React.ComponentProps<'th'>) => (
        <th
            className={cn(
                'h-12 bg-surface-container px-4 text-left align-middle font-medium text-on-surface-variant [&:has([role=checkbox])]:pr-0',
                className,
            )}
            {...props}
        />
    ),
    td: ({ className, ...props }: React.ComponentProps<'td'>) => (
        <td className={cn('p-4 align-middle text-on-surface [&:has([role=checkbox])]:pr-0', className)} {...props} />
    ),
    pre: ({ className, ...props }: React.ComponentProps<'pre'>) => (
        <pre
            className={cn(
                'mt-6 mb-4 overflow-x-auto rounded-xl bg-inverse-surface px-4 py-4 text-inverse-on-surface',
                className,
            )}
            {...props}
        />
    ),
    code: ({ className, ...props }: React.ComponentProps<'code'>) => (
        <code
            className={cn(
                'relative rounded-md bg-surface-variant px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold text-on-surface-variant',
                className,
            )}
            {...props}
        />
    ),
}

export default components
