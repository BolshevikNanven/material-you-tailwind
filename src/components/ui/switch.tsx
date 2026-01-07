'use client'

import * as React from 'react'
import * as SwitchPrimitive from '@radix-ui/react-switch'

import { cn } from '@/lib/utils'

function Switch({ className, ...props }: React.ComponentProps<typeof SwitchPrimitive.Root>) {
    return (
        <SwitchPrimitive.Root
            data-slot='switch'
            className={cn(
                'peer group inline-flex h-8 w-13 shrink-0 cursor-pointer items-center rounded-full border-2 border-outline transition-all outline-none disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:border-transparent data-[state=checked]:bg-primary data-[state=unchecked]:bg-surface-container-highest',
                className,
            )}
            {...props}
        >
            <SwitchPrimitive.Thumb
                data-slot='switch-thumb'
                className={cn(
                    'pointer-events-none relative block size-4 translate-x-1.5 rounded-full bg-outline transition-all group-hover:bg-on-surface-variant data-[state=checked]:size-6 data-[state=checked]:translate-x-[calc(100%-2px)] data-[state=checked]:bg-on-primary data-[state=checked]:group-hover:bg-primary-container',
                )}
            >
                <span className='absolute top-1/2 left-1/2 block h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full transition-colors group-hover:bg-on-surface/8 group-active:bg-on-surface/10' />
            </SwitchPrimitive.Thumb>
        </SwitchPrimitive.Root>
    )
}

export { Switch }
