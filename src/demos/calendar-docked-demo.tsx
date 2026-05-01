'use client'

import * as React from 'react'

import {
    Calendar,
    CalendarCancelButton,
    CalendarConfirmButton,
    CalendarFooter,
    CalendarPicker,
    CalendarTodayButton,
} from '@/components/ui/calendar'

export function CalendarDockedDemo() {
    const [date, setDate] = React.useState<Date | undefined>(new Date(2025, 7, 17))

    return (
        <Calendar
            className='rounded-2xl'
            mode='single'
            selected={date}
            onSelect={value => setDate(value as Date | undefined)}
        >
            <CalendarPicker />
            <CalendarFooter>
                <CalendarTodayButton>Today</CalendarTodayButton>
                <CalendarCancelButton>Cancel</CalendarCancelButton>
                <CalendarConfirmButton>OK</CalendarConfirmButton>
            </CalendarFooter>
        </Calendar>
    )
}
