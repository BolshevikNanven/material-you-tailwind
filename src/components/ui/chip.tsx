'use client'

import { cn } from '@/lib/utils'
import { cva, VariantProps } from 'class-variance-authority'
import React from 'react'
import { Ripple } from './ripple'
import { Check, X } from 'lucide-react'

const assitVariants = cva(
    'group relative inline-flex h-8 cursor-pointer items-center justify-center gap-2 rounded-lg px-4 text-sm text-on-surface *:data-[slot=avatar]:size-6 [&>svg]:size-4.5 [&>svg]:text-primary',
    {
        variants: {
            variant: {
                assist: '',
                filter: '',
                input: '',
                suggestion: '',
            },
            elevated: {
                false: 'border border-outline-variant',
                true: 'bg-surface-container-low shadow-elevation-1',
            },
            selected: {
                true: 'bg-secondary-container text-on-secondary-container',
            },
        },
        defaultVariants: {
            variant: 'assist',
            elevated: false,
            selected: false,
        },
    },
)
function Chip({
    variant,
    elevated,
    selected,
    leadingIcon,
    trailingIcon,
    className,
    children,
    ...props
}: React.ComponentProps<'span'> &
    VariantProps<typeof assitVariants> & { leadingIcon?: React.ReactNode; trailingIcon?: React.ReactNode }) {
    variant = variant || 'assist'

    const startIcon = leadingIcon ? leadingIcon : selected ? <Check /> : null
    const endIcon = trailingIcon ? trailingIcon : variant === 'input' ? <X /> : null

    return (
        <span
            data-slot={`${variant}-chip`}
            className={cn(
                assitVariants({ variant, elevated, selected, className }),
                startIcon && 'pl-2',
                endIcon && 'pr-2',
                className,
            )}
            {...props}
        >
            <span
                className={cn(
                    'absolute inset-0 rounded-[inherit] transition-all',
                    selected
                        ? 'group-hover:bg-on-secondary-container/8 group-active:bg-on-secondary-container/10'
                        : 'group-hover:bg-on-surface/8 group-active:bg-on-surface-variant/10',
                )}
            />
            <Ripple />
            {startIcon}
            {children}
            {endIcon}
        </span>
    )
}

export { Chip }
