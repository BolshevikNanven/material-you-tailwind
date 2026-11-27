'use client'

import * as React from 'react'
import { ScrollField, ScrollFieldGroup, ScrollFieldSeparator } from '@/components/ui/scroll-field'

export function ScrollFieldTimeDemo() {
    const [hour, setHour] = React.useState(12)
    const [minute, setMinute] = React.useState(30)

    return (
        <div className='flex flex-col items-center gap-4'>
            <ScrollFieldGroup aria-label='Select time'>
                <ScrollField
                    aria-label='Select hour'
                    min={0}
                    max={23}
                    value={hour}
                    onValueChange={value => setHour(value as number)}
                />
                <ScrollFieldSeparator />
                <ScrollField
                    aria-label='Select minute'
                    min={0}
                    max={59}
                    value={minute}
                    onValueChange={value => setMinute(value as number)}
                />
            </ScrollFieldGroup>
            <p className='text-sm text-on-surface-variant'>
                {String(hour).padStart(2, '0')}:{String(minute).padStart(2, '0')}
            </p>
        </div>
    )
}
