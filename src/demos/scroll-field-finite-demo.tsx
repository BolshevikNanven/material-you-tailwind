'use client'

import { ScrollField } from '@/components/ui/scroll-field'

export function ScrollFieldFiniteDemo() {
    return (
        <div className='flex flex-wrap items-center justify-center gap-4'>
            <ScrollField aria-label='Select floor, 1 to 20' min={1} max={20} defaultValue={1} loop={false} />
            <ScrollField
                aria-label='Select temperature between 60 and 90 degrees'
                min={60}
                max={90}
                defaultValue={72}
                loop={false}
                formatValue={value => `${value}°`}
                className='w-[120px]'
            />
        </div>
    )
}
