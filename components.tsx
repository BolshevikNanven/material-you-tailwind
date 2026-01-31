import ComponentPreview from '@/components/component-preview'
import { CodeViewer } from '@/components/code-viewer'
import { cn } from '@/lib/utils'
import ComponentSource from '@/components/component-source'
import { CopyButton } from '@/components/ui/copy-button'

export const dirs = ['./src/components/ui', './src/demos']

const components = {
    h1: ({ className, ...props }: React.ComponentProps<'h1'>) => (
        <h1 data-slot='heading' className={cn('mt-10 mb-6 text-4xl font-medium text-on-surface', className)} {...props} />
    ),
    h2: ({ className, ...props }: React.ComponentProps<'h2'>) => (
        <h2 data-slot='heading' className={cn('mt-10 mb-6 text-3xl font-medium text-on-surface', className)} {...props} />
    ),
    h3: ({ className, ...props }: React.ComponentProps<'h3'>) => (
        <h3 data-slot='heading' className={cn('mt-10 mb-6 text-2xl font-medium text-on-surface', className)} {...props} />
    ),
    h4: ({ className, ...props }: React.ComponentProps<'h4'>) => (
        <h4 data-slot='heading' className={cn('my-4 text-xl text-on-surface', className)} {...props} />
    ),
    h5: ({ className, ...props }: React.ComponentProps<'h5'>) => (
        <h5 data-slot='heading' className={cn('my-2 text-lg text-on-surface', className)} {...props} />
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
        <div className='my-6 w-full overflow-y-auto rounded-3xl border border-outline-variant'>
            <table className={cn('w-full caption-bottom text-sm', className)} {...props} />
        </div>
    ),
    thead: ({ className, ...props }: React.ComponentProps<'thead'>) => (
        <thead className={cn('border-b bg-surface-variant font-semibold', className)} {...props} />
    ),
    tr: ({ className, ...props }: React.ComponentProps<'tr'>) => (
        <tr className={cn('border-outline-variant not-last:border-b', className)} {...props} />
    ),
    th: ({ className, ...props }: React.ComponentProps<'th'>) => (
        <th
            className={cn('h-12 px-4 text-left align-middle text-on-surface-variant [&:has([role=checkbox])]:pr-0', className)}
            {...props}
        />
    ),
    td: ({ className, ...props }: React.ComponentProps<'td'>) => (
        <td className={cn('p-4 align-middle text-on-surface [&:has([role=checkbox])]:pr-0', className)} {...props} />
    ),
    pre: ({ className, children, ...props }: React.ComponentProps<'pre'>) => (
        <div className='relative'>
            <pre
                className={cn(
                    'relative my-4 overflow-auto rounded-xl bg-surface-container px-4 py-4 text-on-surface',
                    '**:[code]:bg-transparent **:[code]:p-0 **:[code]:text-on-surface',
                    className,
                )}
                {...props}
            >
                {children}
            </pre>
            <CopyButton className='absolute top-2 right-3' />
        </div>
    ),
    code: ({ className, ...props }: React.ComponentProps<'code'>) => (
        <code
            className={cn(
                'relative rounded-md bg-surface-variant px-[0.3rem] py-[0.2rem] font-mono text-sm **:[span]:text-(--shiki-light) dark:**:[span]:text-(--shiki-dark)',
                className,
            )}
            {...props}
        />
    ),
    ComponentPreview,
    ComponentSource,
    CodeViewer,
}

export default components
