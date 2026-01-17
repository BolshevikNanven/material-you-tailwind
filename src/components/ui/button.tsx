import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'
import { Ripple } from './ripple'

const buttonVariants = cva(
    "group relative inline-flex shrink-0 cursor-pointer items-center justify-center text-sm font-medium whitespace-nowrap transition-all outline-none disabled:pointer-events-none disabled:bg-on-surface/10 disabled:text-on-surface/38 [&_i]:pointer-events-none [&_i]:shrink-0 [&_i:not([class*='size-'])]:size-5",
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
                lg: 'h-14 gap-2 px-6 [&_i:not([class*=size-])]:size-6',
            },
            square: {
                true: 'rounded-xl',
                false: '',
            },
            icon: {
                true: 'aspect-square px-0',
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
            {
                square: false,
                size: 'sm',
                className: 'rounded-[20px]',
            },
            {
                square: false,
                size: 'md',
                className: 'rounded-[24px]',
            },
            {
                square: false,
                size: 'lg',
                className: 'rounded-[28px]',
            },
        ],
        defaultVariants: {
            variant: 'default',
            size: 'md',
            square: false,
            icon: false,
        },
    },
)

const layerVariants = cva('absolute inset-0 rounded-[inherit] transition-all', {
    variants: {
        variant: {
            default: 'group-hover:bg-on-primary/8 group-active:bg-on-primary/10',
            tonal: 'group-hover:bg-on-secondary-container/8 group-active:bg-on-secondary-container/10',
            outline: 'group-hover:bg-on-surface-variant/8 group-active:bg-on-surface-variant/10',
            elevated: 'group-hover:bg-primary/8 group-active:bg-primary/10',
            text: 'group-hover:bg-primary/8 group-active:bg-primary/10',
        },
    },
    defaultVariants: {
        variant: 'default',
    },
})

function Button({
    className,
    variant = 'default',
    size = 'md',
    square = false,
    icon = false,
    children,
    ...props
}: React.ComponentProps<'button'> & VariantProps<typeof buttonVariants>) {
    return (
        <button
            data-slot='button'
            data-variant={variant}
            data-square={!!square}
            data-size={size}
            className={cn(buttonVariants({ variant, size, square, icon, className }))}
            {...props}
        >
            <div className={cn(layerVariants({ variant }))} />
            <Ripple />
            {children}
        </button>
    )
}

export { Button }
