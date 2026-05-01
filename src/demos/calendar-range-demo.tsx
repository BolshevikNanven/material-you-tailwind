'use client'

import * as React from 'react'
import type { DateRange } from 'react-day-picker'

import {
    Calendar,
    CalendarCancelButton,
    CalendarClearButton,
    CalendarConfirmButton,
    CalendarFooter,
    CalendarHeader,
    CalendarRangePicker,
    CalendarTodayButton,
} from '@/components/ui/calendar'

export function CalendarRangeDemo() {
    const [range, setRange] = React.useState<DateRange | undefined>({
        from: new Date(2025, 7, 17),
        to: new Date(2025, 7, 23),
    })

    return (
        <Calendar mode='range' selected={range} onSelect={value => setRange(value as DateRange | undefined)}>
            <CalendarHeader />
            <CalendarRangePicker />
            <CalendarFooter>
                <div className='mr-auto flex gap-2'>
                    <CalendarClearButton className='mr-0'>Clear</CalendarClearButton>
                    <CalendarTodayButton className='mr-0'>Today</CalendarTodayButton>
                </div>
                <CalendarCancelButton>Cancel</CalendarCancelButton>
                <CalendarConfirmButton>OK</CalendarConfirmButton>
            </CalendarFooter>
        </Calendar>
    )
}
