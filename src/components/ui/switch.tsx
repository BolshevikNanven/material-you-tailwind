'use client'

import * as React from 'react'
import * as SwitchPrimitive from '@radix-ui/react-switch'

import { cn } from '@/lib/utils'
import { Ripple } from './ripple'

type SwitchProps = React.ComponentProps<typeof SwitchPrimitive.Root> & {
    icon?: boolean
}

function Switch({ className, icon = false, disabled, ...props }: SwitchProps) {
    return (
        <SwitchPrimitive.Root
            data-slot='switch'
            className={cn(
                [
                    'peer group relative inline-flex h-8 w-13 shrink-0 cursor-pointer items-center rounded-full border-2',
                    'transition-colors outline-none',
                    'disabled:pointer-events-none disabled:cursor-not-allowed',
                ],
                [
                    'data-[state=checked]:border-transparent',
                    'data-[state=checked]:bg-primary',
                    'disabled:data-[state=checked]:bg-on-surface/10',
                ],
                [
                    'data-[state=unchecked]:border-outline',
                    'data-[state=unchecked]:bg-surface-container-highest',
                    'disabled:data-[state=unchecked]:border-on-surface/12',
                ],
                className,
            )}
            disabled={disabled}
            {...props}
        >
            <span
                data-slot='switch-state-layer'
                className={cn(
                    [
                        'absolute top-1/2 -left-1.5 z-0 grid size-10 -translate-y-1/2 place-items-center rounded-full',
                        'text-on-surface transition-[left,background-color,color] duration-200 ease-out',
                        'group-disabled:hidden',
                    ],
                    [
                        'group-data-[state=checked]:left-3.5',
                        'group-data-[state=checked]:text-primary',
                        'group-data-[state=checked]:group-hover:bg-primary/8',
                        'group-data-[state=checked]:group-focus-visible:bg-primary/10',
                        'group-data-[state=checked]:group-active:bg-primary/10',
                    ],
                    [
                        'group-data-[state=unchecked]:group-hover:bg-on-surface/8',
                        'group-data-[state=unchecked]:group-focus-visible:bg-on-surface/10',
                        'group-data-[state=unchecked]:group-active:bg-on-surface/10',
                    ],
                )}
            >
                <Ripple opacity={0.12} />
            </span>
            <SwitchPrimitive.Thumb
                data-slot='switch-thumb'
                className={cn(
                    [
                        icon ? 'left-0.5 size-6':'left-1.5 size-4',
                        'pointer-events-none absolute top-1/2 z-10 grid -translate-y-1/2 place-items-center rounded-full',
                        'bg-outline text-surface-container-highest',
                        'transition-[left,width,height,background-color,color] duration-200 ease-out',
                    ],
                    [
                        'data-[state=checked]:left-5.5',
                        'data-[state=checked]:size-6',
                        'data-[state=checked]:bg-on-primary',
                        'data-[state=checked]:text-primary',
                        'data-[state=checked]:group-hover:bg-primary-container',
                        'data-[state=checked]:group-focus-visible:bg-primary-container',
                        'data-[state=checked]:group-active:left-[20px]',
                        'data-[state=checked]:group-active:size-7',
                        'data-[state=checked]:group-active:bg-primary-container',
                        'data-[state=checked]:group-disabled:bg-surface',
                        'data-[state=checked]:group-disabled:text-on-surface/38',
                    ],
                    [
                        'data-[state=unchecked]:group-hover:bg-on-surface-variant',
                        'data-[state=unchecked]:group-focus-visible:bg-on-surface-variant',
                        'data-[state=unchecked]:group-active:left-0',
                        'data-[state=unchecked]:group-active:size-7',
                        'data-[state=unchecked]:group-active:bg-on-surface-variant',
                        'data-[state=unchecked]:group-disabled:bg-on-surface/38',
                        'data-[state=unchecked]:group-disabled:text-surface-container-highest',
                    ],
                )}
            >
                {icon && (
                    <>
                        <i
                            className={cn(
                                ['hidden size-4'],
                                'icon-[material-symbols--check-rounded] group-data-[state=checked]:block',
                            )}
                        />
                        <i
                            className={cn(
                                ['hidden size-4'],
                                'icon-[material-symbols--close-rounded] group-data-[state=unchecked]:block',
                            )}
                        />
                    </>
                )}
            </SwitchPrimitive.Thumb>
        </SwitchPrimitive.Root>
    )
}

export { Switch }
