'use client'

import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const containerVariants = cva(
    'group relative flex h-14 w-full items-center gap-1 transition-shadow disabled:cursor-not-allowed disabled:opacity-50',
    {
        variants: {
            variant: {
                filled: 'rounded-t-sm bg-surface-container-highest [box-shadow:inset_0_-1px_0_0_theme(colors.outline)] transition-colors focus-within:[box-shadow:inset_0_-2px_0_0_theme(colors.primary)]',
                outlined:
                    'rounded-sm bg-transparent [box-shadow:inset_0_0_0_1px_theme(colors.outline)] transition-colors focus-within:[box-shadow:inset_0_0_0_2px_theme(colors.primary)]',
            },
            error: {
                true: '',
            },
        },
        compoundVariants: [
            {
                variant: 'filled',
                error: true,
                className:
                    '[box-shadow:inset_0_-2px_0_0_theme(colors.error)] focus-within:[box-shadow:inset_0_-2px_0_0_theme(colors.error)]',
            },
            {
                variant: 'outlined',
                error: true,
                className:
                    '[box-shadow:inset_0_0_0_1px_theme(colors.error)] focus-within:[box-shadow:inset_0_0_0_2px_theme(colors.error)]',
            },
        ],
        defaultVariants: {
            variant: 'outlined',
            error: false,
        },
    },
)

const inputVariants = cva(
    'peer flex h-full w-full items-center placeholder:text-transparent focus:outline-none focus:placeholder:text-on-surface-variant',
    {
        variants: {
            variant: {
                filled: 'pt-4',
                outlined: '',
            },
        },
        compoundVariants: [],
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
                    'origin-left',
                    'peer-focus:-translate-y-3 peer-focus:text-xs',
                    'peer-[:not(:placeholder-shown)]:-translate-y-3 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:leading-tight',
                ],
                outlined: [
                    'origin-left',
                    'peer-focus:h-4 peer-focus:-translate-y-2 peer-focus:bg-background peer-focus:px-1 peer-focus:text-xs peer-focus:text-primary',
                    'peer-[:not(:placeholder-shown)]:h-4 peer-[:not(:placeholder-shown)]:-translate-y-2 peer-[:not(:placeholder-shown)]:bg-background peer-[:not(:placeholder-shown)]:px-1 peer-[:not(:placeholder-shown)]:text-xs',
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
    VariantProps<typeof containerVariants> & {
        label?: string
        helperText?: string
        startIcon?: React.ReactNode
        endIcon?: React.ReactNode
    }

const TextField = React.forwardRef<HTMLInputElement, TextFieldProps>(
    (
        { className, variant = 'outlined', type, label, helperText, error, startIcon, endIcon, placeholder, id, ...props },
        ref,
    ) => {
        const generatedId = React.useId()
        const inputId = id || generatedId
        const isError = error

        placeholder = placeholder || ' '

        return (
            <div data-slot='input-container' className={cn('flex flex-col gap-1.5', className)}>
                <div className={cn(containerVariants({ variant, error: isError }), !startIcon && 'pl-4', !endIcon && 'pr-4')}>
                    {startIcon && (
                        <div className='flex h-12 w-12 shrink-0 items-center justify-center text-on-surface-variant [&_svg:not([class*=size-])]:size-5'>
                            {startIcon}
                        </div>
                    )}

                    <div className='relative h-full w-full'>
                        <input
                            id={inputId}
                            type={type}
                            className={cn(inputVariants({ variant }))}
                            placeholder={placeholder}
                            ref={ref}
                            {...props}
                        />

                        {label && (
                            <label
                                htmlFor={inputId}
                                className={cn(
                                    labelVariants({ variant, error: isError }),
                                    startIcon &&
                                        variant === 'outlined' &&
                                        'peer-focus:-translate-x-9 peer-[:not(:placeholder-shown)]:-translate-x-9',
                                )}
                            >
                                {label}
                            </label>
                        )}
                    </div>

                    {endIcon && (
                        <div className='flex h-12 w-12 shrink-0 items-center justify-center text-on-surface-variant [&_svg:not([class*=size-])]:size-5'>
                            {endIcon}
                        </div>
                    )}
                </div>
                {helperText && (
                    <p className={cn('px-4 text-xs', isError ? 'text-error' : 'text-on-surface-variant')}>{helperText}</p>
                )}
            </div>
        )
    },
)
TextField.displayName = 'TextField'

export { TextField }
