'use client'

import { cn } from '@/lib/utils'
import { cva, VariantProps } from 'class-variance-authority'
import React from 'react'
import { Ripple } from './ripple'
import { Slot } from '@radix-ui/react-slot'

const assitVariants = cva(
    'group relative inline-flex h-8 cursor-pointer items-center justify-center gap-2 rounded-lg px-4 text-sm text-on-surface *:data-[slot=avatar]:size-6 [&>i]:size-4.5 [&>i]:text-primary',
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
    asChild,
    children,
    ...props
}: React.ComponentProps<'span'> &
    VariantProps<typeof assitVariants> & { leadingIcon?: React.ReactNode; trailingIcon?: React.ReactNode; asChild?: boolean }) {
    variant = variant || 'assist'

    const startIcon = leadingIcon ? leadingIcon : selected ? <i className='icon-[material-symbols--check-rounded]' /> : null
    const endIcon = trailingIcon ? (
        trailingIcon
    ) : variant === 'input' ? (
        <i className='icon-[material-symbols--close-rounded]' />
    ) : null

    const Comp = asChild ? Slot : 'span'

    const Adornments = (
        <>
            <span
                className={cn(
                    'absolute inset-0 rounded-[inherit] transition-all',
                    selected
                        ? 'group-hover:bg-on-secondary-container/8 group-active:bg-on-secondary-container/10'
                        : 'group-hover:bg-on-surface/8 group-active:bg-on-surface-variant/10',
                )}
            />
            <Ripple />
        </>
    )

    return (
        <Comp
            data-slot={`${variant}-chip`}
            className={cn(
                assitVariants({ variant, elevated, selected, className }),
                startIcon && 'pl-2',
                endIcon && 'pr-2',
                className,
            )}
            {...props}
        >
            {asChild && React.isValidElement(children) ? (
                React.cloneElement(children as React.ReactElement<React.PropsWithChildren>, {
                    children: (
                        <>
                            {Adornments}
                            {startIcon}
                            {(children as React.ReactElement<React.PropsWithChildren>).props.children}
                            {endIcon}
                        </>
                    ),
                })
            ) : (
                <>
                    {Adornments}
                    {startIcon}
                    {children}
                    {endIcon}
                </>
            )}
        </Comp>
    )
}

export { Chip }
