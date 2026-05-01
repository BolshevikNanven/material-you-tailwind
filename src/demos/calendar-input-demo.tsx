'use client'

import * as React from 'react'

import {
    Calendar,
    CalendarCancelButton,
    CalendarClearButton,
    CalendarConfirmButton,
    CalendarFooter,
    CalendarHeader,
    CalendarInputPicker,
} from '@/components/ui/calendar'

export function CalendarInputDemo() {
    const [date, setDate] = React.useState<Date | undefined>(new Date(2025, 7, 17))

    return (
        <Calendar mode='single' selected={date} onSelect={value => setDate(value as Date | undefined)}>
            <CalendarHeader />
            <CalendarInputPicker />
            <CalendarFooter>
                <CalendarClearButton>Clear</CalendarClearButton>
                <CalendarCancelButton>Cancel</CalendarCancelButton>
                <CalendarConfirmButton>OK</CalendarConfirmButton>
            </CalendarFooter>
        </Calendar>
    )
}
