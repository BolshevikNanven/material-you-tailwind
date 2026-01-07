'use client'

import * as React from 'react'
import * as TogglePrimitive from '@radix-ui/react-toggle'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const toggleVariants = cva(
    "group relative inline-flex shrink-0 cursor-default items-center justify-center text-sm font-medium whitespace-nowrap transition-all outline-none disabled:pointer-events-none disabled:bg-on-surface/10 disabled:text-on-surface/38 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
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

function Toggle({
    className,
    variant,
    size,
    ...props
}: React.ComponentProps<typeof TogglePrimitive.Root> & VariantProps<typeof toggleVariants>) {
    return <TogglePrimitive.Root data-slot='toggle' className={cn(toggleVariants({ variant, size, className }))} {...props} />
}

export { Toggle }
