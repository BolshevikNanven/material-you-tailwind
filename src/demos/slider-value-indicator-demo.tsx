'use client'

import { Slider } from '@/components/ui/slider'

export function SliderValueIndicatorDemo() {
    return (
        <div className='w-full max-w-md'>
            <Slider defaultValue={[50]} formatValue={value => `${Math.round(value)}%`} showValueIndicator size='medium' />
        </div>
    )
}
