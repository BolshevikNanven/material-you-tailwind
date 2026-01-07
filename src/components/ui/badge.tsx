import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const badgeVariants = cva(
    'inline-flex w-fit shrink-0 cursor-default items-center justify-center overflow-hidden rounded-full bg-error text-xs font-medium whitespace-nowrap text-on-error [&>svg]:pointer-events-none [&>svg]:size-3',
    {
        variants: {
            size: {
                lg: 'h-4 min-w-4 px-1',
                sm: 'h-1.5 w-1.5',
            },
        },
        defaultVariants: {
            size: 'lg',
        },
    },
)

function Badge({
    className,
    size,
    asChild = false,
    children,
    ...props
}: React.ComponentProps<'span'> & VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
    const Comp = asChild ? Slot : 'span'

    if (size === 'sm') {
        return <span data-slot='badge' className={cn(badgeVariants({ size }), className)} {...props} />
    }

    return <Comp data-slot='badge' className={cn(badgeVariants({ size }), className)} children={children} {...props} />
}

export { Badge }
