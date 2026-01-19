'use client'

import * as React from 'react'
import * as TogglePrimitive from '@radix-ui/react-toggle'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'
import { Ripple } from './ripple'

const toggleVariants = cva(
    "group relative inline-flex shrink-0 cursor-pointer items-center justify-center text-sm font-medium whitespace-nowrap transition-all outline-none disabled:pointer-events-none disabled:bg-on-surface/10 disabled:text-on-surface/38 [&_i]:pointer-events-none [&_i]:shrink-0 [&_i:not([class*='size-'])]:size-5",
    {
        variants: {
            variant: {
                default:
                    'bg-surface-container text-on-surface-variant data-[state=on]:bg-primary data-[state=on]:text-on-primary',
                tonal: 'bg-secondary-container text-on-secondary-container data-[state=on]:bg-secondary data-[state=on]:text-on-secondary',
                outline:
                    'border border-outline-variant bg-transparent text-on-surface-variant data-[state=on]:bg-inverse-surface data-[state=on]:text-inverse-on-surface',
                elevated: 'bg-surface-container-low text-primary data-[state=on]:bg-primary data-[state=on]:text-on-primary',
            },
            size: {
                sm: 'h-10 gap-2 px-4',
                md: 'h-12 gap-2 px-4',
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
        },
    },
)

const layerVariants = cva('absolute inset-0 rounded-[inherit] transition-all', {
    variants: {
        variant: {
            default: 'group-hover:bg-on-surface-variant/8 group-active:bg-on-surface-variant/10',
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

function Toggle({
    className,
    variant,
    square,
    icon,
    size,
    children,
    ...props
}: React.ComponentProps<typeof TogglePrimitive.Root> & VariantProps<typeof toggleVariants>) {
    return (
        <TogglePrimitive.Root
            data-slot='toggle'
            data-square={!!square}
            className={cn(toggleVariants({ variant, size, icon, square, className }))}
            {...props}
        >
            <div className={cn(layerVariants({ variant }))} />
            <Ripple />
            {children}
        </TogglePrimitive.Root>
    )
}

export { Toggle }
