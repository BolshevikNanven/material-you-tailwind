'use client'

import * as React from 'react'
import type { Matcher } from 'react-day-picker'

import {
    Calendar,
    CalendarCancelButton,
    CalendarClearButton,
    CalendarCompactPicker,
    CalendarConfirmButton,
    CalendarFooter,
    CalendarHeader,
} from '@/components/ui/calendar'

export function CalendarDemo() {
    const [date, setDate] = React.useState<Date | undefined>(new Date(2025, 7, 17))
    const disabledDays: Matcher[] = [
        { before: new Date(2025, 7, 4) },
        new Date(2025, 7, 12),
        new Date(2025, 7, 13),
        new Date(2025, 7, 20),
    ]

    return (
        <Calendar disabled={disabledDays} mode='single' selected={date} onSelect={value => setDate(value as Date | undefined)}>
            <CalendarHeader />
            <CalendarCompactPicker />
            <CalendarFooter>
                <CalendarClearButton>Clear</CalendarClearButton>
                <CalendarCancelButton>Cancel</CalendarCancelButton>
                <CalendarConfirmButton>OK</CalendarConfirmButton>
            </CalendarFooter>
        </Calendar>
    )
}
