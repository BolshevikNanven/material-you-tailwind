import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'
import { Ripple } from './ripple'

const buttonVariants = cva(
    "group aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive relative inline-flex shrink-0 cursor-pointer items-center justify-center text-sm font-medium whitespace-nowrap transition-all outline-none disabled:pointer-events-none disabled:bg-on-surface/10 disabled:text-on-surface/38 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
    {
        variants: {
            variant: {
                default: 'bg-primary text-on-primary',
                tonal: 'bg-secondary-container text-on-secondary-container',
                outline: 'border border-outline-variant bg-transparent text-on-surface-variant',
                elevated: 'bg-surface-container-low text-primary',
                text: 'bg-transparent text-primary',
            },
            size: {
                sm: 'h-10 gap-2 px-4',
                md: 'h-12 gap-2 px-6',
                lg: 'h-14 gap-2 px-6',
            },
            square: {
                true: 'rounded-xl',
                false: 'rounded-full',
            },
        },
        compoundVariants: [
            {
                variant: 'elevated',
                size: 'sm',
                className: 'shadow-elevation-1',
            },
            {
                variant: 'elevated',
                size: 'md',
                className: 'shadow-elevation-1',
            },
            {
                variant: 'elevated',
                size: 'lg',
                className: 'shadow-elevation-2',
            },
            {
                square: true,
                size: 'lg',
                className: 'rounded-2xl',
            },
        ],
        defaultVariants: {
            variant: 'default',
            size: 'md',
            square: false,
        },
    },
)

const layerVariants = cva('absolute inset-0 transition-all', {
    variants: {
        variant: {
            default: 'group-hover:bg-on-primary/8 group-active:bg-on-primary/10',
            tonal: 'group-hover:bg-on-secondary-container/8 group-active:bg-on-secondary-container/10',
            outline: 'group-hover:bg-on-surface-variant/8 group-active:bg-on-surface-variant/10',
            elevated: 'group-hover:bg-primary/8 group-active:bg-primary/10',
            text: 'group-hover:bg-primary/8 group-active:bg-primary/10',
        },
        square: {
            true: 'rounded-xl',
            false: 'rounded-full',
        },
        size: {
            sm: '',
            md: '',
            lg: '',
        },
    },
    compoundVariants: [
        {
            square: true,
            size: 'lg',
            className: 'rounded-2xl',
        },
    ],
    defaultVariants: {
        variant: 'default',
        size: 'md',
        square: false,
    },
})

function Button({
    className,
    variant = 'default',
    size = 'md',
    square = false,
    asChild = false,
    children,
    ...props
}: React.ComponentProps<'button'> &
    VariantProps<typeof buttonVariants> & {
        asChild?: boolean
    }) {
    if (asChild) {
        return <Slot data-slot='button' data-variant={variant} data-size={size} children={children} {...props} />
    }

    return (
        <button
            data-slot='button'
            data-variant={variant}
            data-size={size}
            className={cn(buttonVariants({ variant, size, square, className }))}
            {...props}
        >
            <div className={cn(layerVariants({ variant, size, square }))} />
            <Ripple
                className={cn({
                    'rounded-full': !square,
                    'rounded-xl': square && (size === 'sm' || size === 'md'),
                    'rounded-2xl': square && size === 'lg',
                })}
            />
            {children}
        </button>
    )
}

export { Button }
