'use client'

import * as React from 'react'

import { Button } from '@/components/ui/button'
import {
    Calendar,
    CalendarCancelButton,
    CalendarClearButton,
    CalendarCompactPicker,
    CalendarConfirmButton,
    CalendarFooter,
    CalendarHeader,
    CalendarTodayButton,
} from '@/components/ui/calendar'

export function CalendarButtonDemo() {
    const [date, setDate] = React.useState<Date | undefined>(new Date(2025, 7, 17))

    return (
        <Calendar mode='single' selected={date} onSelect={value => setDate(value as Date | undefined)}>
            <CalendarHeader />
            <CalendarCompactPicker />
            <CalendarFooter>
                <div className='mr-auto flex gap-2'>
                    <CalendarClearButton asChild className='mr-0'>
                        <Button variant='outline' size='sm'>
                            Clear
                        </Button>
                    </CalendarClearButton>
                    <CalendarTodayButton asChild className='mr-0'>
                        <Button variant='tonal' size='sm'>
                            Today
                        </Button>
                    </CalendarTodayButton>
                </div>
                <CalendarCancelButton asChild>
                    <Button variant='text' size='sm'>
                        Cancel
                    </Button>
                </CalendarCancelButton>
                <CalendarConfirmButton asChild>
                    <Button size='sm'>OK</Button>
                </CalendarConfirmButton>
            </CalendarFooter>
        </Calendar>
    )
}
