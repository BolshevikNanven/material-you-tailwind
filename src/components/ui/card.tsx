import * as React from 'react'
import { cn } from '@/lib/utils'
import { cva, type VariantProps } from 'class-variance-authority'

const cardVariants = cva('group relative rounded-xl transition-shadow', {
    variants: {
        variant: {
            elevated: 'bg-surface-container-low shadow-elevation-1',
            filled: 'bg-surface-container-highest',
            outlined: 'border border-outline-variant bg-surface',
        },
        actionable: {
            true: 'cursor-pointer hover:shadow-elevation-1',
            false: '',
        },
    },
    compoundVariants: [
        {
            variant: 'elevated',
            actionable: true,
            className: 'hover:shadow-elevation-2 active:shadow-elevation-1',
        },
        {
            variant: 'filled',
            actionable: true,
            className: 'active:shadow-none',
        },
        {
            variant: 'outlined',
            actionable: true,
            className: 'active:shadow-none',
        },
    ],
    defaultVariants: {
        variant: 'filled',
        actionable: false,
    },
})

function Card({
    variant,
    actionable,
    className,
    children,
    ...props
}: React.ComponentProps<'div'> & VariantProps<typeof cardVariants>) {
    return (
        <div data-slot='card' className={cn(cardVariants({ variant, actionable, className }))} {...props}>
            {actionable && (
                <div
                    className={cn(
                        'absolute inset-0 rounded-xl transition-colors group-hover:bg-on-surface/8 group-active:bg-on-surface/10',
                    )}
                />
            )}
            {children}
        </div>
    )
}
function CardContent({ className, ...props }: React.ComponentProps<'div'>) {
    return <div data-slot='card-content' className={cn('p-4', className)} {...props} />
}
function CardImage({ className, ...props }: React.ComponentProps<'div'>) {
    return <div data-slot='card-image' className={cn('rounded-xl *:rounded-xl', className)} {...props} />
}
function CardFooter({ className, ...props }: React.ComponentProps<'div'>) {
    return <div data-slot='card-footer' className={cn('flex items-center p-4 pt-0 [.border-t]:pt-4', className)} {...props} />
}

export { Card, CardContent, CardImage, CardFooter }
