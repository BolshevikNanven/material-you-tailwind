'use client'

import * as React from 'react'
import * as CheckboxPrimitive from '@radix-ui/react-checkbox'

import { cn } from '@/lib/utils'
import { Ripple } from './ripple'

function Checkbox({ className, ...props }: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
    return (
        <CheckboxPrimitive.Root
            data-slot='checkbox'
            className={cn(
                'group relative flex size-4 shrink-0 cursor-pointer items-center justify-center rounded-xs border-2 border-on-surface-variant transition-all outline-none group-data-[state=checked]:border-0 hover:bg-primary/8 active:bg-primary/10 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:border-primary',
                className,
            )}
            {...props}
        >
            <span className='absolute top-1/2 left-1/2 block h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full transition-colors group-hover:bg-on-surface/8 group-active:bg-on-surface/10'>
                <Ripple />
            </span>
            <CheckboxPrimitive.Indicator
                data-slot='checkbox-indicator'
                className='grid size-4 place-content-center rounded-xs bg-primary text-current transition-none'
            >
                <i className='icon-[material-symbols--check-rounded] text-on-primary' />
            </CheckboxPrimitive.Indicator>
        </CheckboxPrimitive.Root>
    )
}

export { Checkbox }
