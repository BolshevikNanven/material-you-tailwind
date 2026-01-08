'use client'

import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const containerVariants = cva('group relative flex w-full flex-col gap-1', {
    variants: {
        variant: {
            filled: 'rounded-t-sm bg-surface-container-highest transition-colors',
            outlined: 'bg-transparent',
        },
        error: {
            true: '',
            false: '',
        },
    },
    defaultVariants: {
        variant: 'outlined',
    },
})

const inputVariants = cva(
    'peer flex h-14 w-full bg-transparent px-4 py-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50',
    {
        variants: {
            variant: {
                filled: [
                    'rounded-t-sm border-b border-outline pt-6 pb-2',
                    'focus:border-b-3 focus:border-primary focus:pb-1.5',
                ],
                outlined: ['rounded-sm border border-outline py-2', 'focus:border-3 focus:border-primary'],
            },
            error: {
                true: 'border-error focus:border-error',
            },
        },
        compoundVariants: [
            {
                variant: 'filled',
                error: true,
                class: 'border-error',
            },
        ],
        defaultVariants: {
            variant: 'outlined',
        },
    },
)

const labelVariants = cva(
    'pointer-events-none absolute top-0 left-0 flex h-full w-fit items-center truncate text-on-surface-variant transition-all duration-200 ease-out select-none peer-focus:text-primary',
    {
        variants: {
            variant: {
                filled: [
                    'left-4 origin-left',
                    'peer-focus:-translate-y-3 peer-focus:text-xs',
                    'peer-[:not(:placeholder-shown)]:-translate-y-3 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:leading-tight',
                ],
                outlined: [
                    'left-4 origin-left',
                    'peer-focus:h-4 peer-focus:-translate-x-1 peer-focus:-translate-y-2 peer-focus:bg-background peer-focus:px-1 peer-focus:text-xs peer-focus:text-primary',
                    'peer-[:not(:placeholder-shown)]:h-4 peer-[:not(:placeholder-shown)]:-translate-x-1 peer-[:not(:placeholder-shown)]:-translate-y-2 peer-[:not(:placeholder-shown)]:bg-background peer-[:not(:placeholder-shown)]:px-1 peer-[:not(:placeholder-shown)]:text-xs',
                ],
            },
            error: {
                true: 'text-error peer-focus:text-error',
            },
        },
        defaultVariants: {
            variant: 'outlined',
        },
    },
)

type TextFieldProps = React.ComponentProps<'input'> &
    VariantProps<typeof inputVariants> & {
        label?: string
        helperText?: string
        errorText?: string
        startIcon?: React.ReactNode
        endIcon?: React.ReactNode
    }

const TextField = React.forwardRef<HTMLInputElement, TextFieldProps>(
    (
        { className, variant = 'outlined', type, label, helperText, errorText, startIcon, endIcon, placeholder, id, ...props },
        ref,
    ) => {
        const generatedId = React.useId()
        const inputId = id || generatedId
        const isError = !!errorText

        placeholder = ''

        return (
            <div className={cn('flex flex-col gap-1.5', className)}>
                <div className={cn(containerVariants({ variant, error: isError }))}>
                    {startIcon && (
                        <div className='absolute top-1/2 left-3 -translate-y-1/2 text-on-surface-variant [&_svg:not([class*=size-])]:size-5'>
                            {startIcon}
                        </div>
                    )}

                    <input
                        id={inputId}
                        type={type}
                        className={cn(
                            inputVariants({ variant, error: isError }),
                            startIcon && 'pl-12',
                            startIcon && variant === 'outlined' && 'focus:pl-[46px]',
                            endIcon && 'pr-12',
                        )}
                        placeholder={placeholder}
                        ref={ref}
                        {...props}
                    />

                    {label && (
                        <label
                            htmlFor={inputId}
                            className={cn(labelVariants({ variant, error: isError }), startIcon && 'left-12')}
                        >
                            {label}
                        </label>
                    )}

                    {endIcon && (
                        <div className='absolute top-1/2 right-3 -translate-y-1/2 text-on-surface-variant [&_svg:not([class*=size-])]:size-5'>
                            {endIcon}
                        </div>
                    )}
                </div>
                {(helperText || errorText) && (
                    <p className={cn('px-4 text-xs', isError ? 'text-error' : 'text-on-surface-variant')}>
                        {errorText || helperText}
                    </p>
                )}
            </div>
        )
    },
)
TextField.displayName = 'TextField'

export { TextField }
