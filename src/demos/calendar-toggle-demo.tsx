'use client'

import * as React from 'react'

import {
    Calendar,
    CalendarCancelButton,
    CalendarClearButton,
    CalendarCompactPicker,
    CalendarConfirmButton,
    CalendarFooter,
    CalendarHeader,
    CalendarInputPicker,
} from '@/components/ui/calendar'

export function CalendarToggleDemo() {
    const [date, setDate] = React.useState<Date | undefined>(new Date(2025, 7, 17))
    const [isInputPicker, setIsInputPicker] = React.useState(false)

    return (
        <Calendar mode='single' selected={date} onSelect={value => setDate(value as Date | undefined)}>
            <CalendarHeader showVariantToggle onVariantToggle={() => setIsInputPicker(prev => !prev)} />
            {isInputPicker ? <CalendarInputPicker /> : <CalendarCompactPicker />}
            <CalendarFooter>
                <CalendarClearButton>Clear</CalendarClearButton>
                <CalendarCancelButton>Cancel</CalendarCancelButton>
                <CalendarConfirmButton>OK</CalendarConfirmButton>
            </CalendarFooter>
        </Calendar>
    )
}
