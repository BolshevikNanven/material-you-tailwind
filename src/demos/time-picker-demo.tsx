'use client'

import * as React from 'react'

import {
    TimePicker,
    TimePickerActions,
    TimePickerCancelButton,
    TimePickerConfirmButton,
    TimePickerContent,
    TimePickerModeToggle,
    type TimePickerValue,
} from '@/components/ui/time-picker'

export function TimePickerDemo() {
    const [time, setTime] = React.useState<TimePickerValue>({ hour: 7, minute: 0 })

    return (
        <TimePicker aria-label='Select time' value={time} onValueChange={setTime}>
            <TimePickerContent />
            <TimePickerActions>
                <TimePickerModeToggle />
                <TimePickerCancelButton>Cancel</TimePickerCancelButton>
                <TimePickerConfirmButton>OK</TimePickerConfirmButton>
            </TimePickerActions>
        </TimePicker>
    )
}
