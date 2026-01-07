'use client'

import * as React from 'react'
import * as SliderPrimitive from '@radix-ui/react-slider'

import { cn } from '@/lib/utils'

function Slider({
    className,
    defaultValue,
    value,
    min = 0,
    max = 100,
    orientation = 'horizontal',
    ...props
}: React.ComponentProps<typeof SliderPrimitive.Root>) {
    const _values = React.useMemo(
        () => (Array.isArray(value) ? value : Array.isArray(defaultValue) ? defaultValue : [min, max]),
        [value, defaultValue, min, max],
    )

    return (
        <SliderPrimitive.Root
            data-slot='slider'
            defaultValue={defaultValue}
            value={value}
            min={min}
            max={max}
            className={cn(
                'relative flex w-full touch-none items-center select-none data-[disabled]:opacity-50',
                {
                    'w-full': orientation === 'horizontal',
                    'h-full min-h-44 w-auto flex-col': orientation === 'vertical',
                },
                className,
            )}
            orientation={orientation}
            {...props}
        >
            <SliderPrimitive.Track
                data-slot='slider-track'
                className={cn('relative grow overflow-hidden rounded-full bg-secondary-container', {
                    'h-3 w-full': orientation === 'horizontal',
                    'h-full w-3': orientation === 'vertical',
                })}
            >
                <SliderPrimitive.Range
                    data-slot='slider-range'
                    className={cn('absolute bg-primary', {
                        'h-full': orientation === 'horizontal',
                        'w-full': orientation === 'vertical',
                    })}
                />
            </SliderPrimitive.Track>
            {Array.from({ length: _values.length }, (_, index) => (
                <SliderPrimitive.Thumb
                    data-slot='slider-thumb'
                    key={index}
                    className={cn(
                        'group flex shrink-0 cursor-pointer bg-surface outline-0 disabled:pointer-events-none disabled:opacity-50',
                        {
                            'h-9 w-3': orientation === 'horizontal',
                            'h-3 w-9': orientation === 'vertical',
                        },
                    )}
                >
                    <span
                        className={cn('block rounded-full bg-primary', {
                            'mx-auto h-full w-1 group-active:w-0.5': orientation === 'horizontal',
                            'my-auto h-1 w-full group-active:h-0.5': orientation === 'vertical',
                        })}
                    />
                </SliderPrimitive.Thumb>
            ))}
        </SliderPrimitive.Root>
    )
}

export { Slider }
