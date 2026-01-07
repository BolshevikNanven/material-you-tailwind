'use client'

import * as React from 'react'
import * as RadioGroupPrimitive from '@radix-ui/react-radio-group'

import { cn } from '@/lib/utils'
import { Ripple } from './ripple'

function RadioGroup({ className, ...props }: React.ComponentProps<typeof RadioGroupPrimitive.Root>) {
    return <RadioGroupPrimitive.Root data-slot='radio-group' className={cn('grid gap-3', className)} {...props} />
}

function RadioGroupItem({ className, ...props }: React.ComponentProps<typeof RadioGroupPrimitive.Item>) {
    return (
        <RadioGroupPrimitive.Item
            data-slot='radio-group-item'
            className={cn(
                'group relative size-5 cursor-pointer rounded-full border-2 border-on-surface-variant text-primary transition-[color,box-shadow] outline-none disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:border-primary',
                className,
            )}
            {...props}
        >
            <span className='absolute top-1/2 left-1/2 block h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full transition-colors group-hover:bg-on-surface/8 group-active:bg-on-surface/10'>
                <Ripple />
            </span>
            <RadioGroupPrimitive.Indicator
                data-slot='radio-group-indicator'
                className='flex h-4 w-4 items-center justify-center'
            >
                <span className='block size-3 rounded-full bg-primary' />
            </RadioGroupPrimitive.Indicator>
        </RadioGroupPrimitive.Item>
    )
}

export { RadioGroup, RadioGroupItem }
