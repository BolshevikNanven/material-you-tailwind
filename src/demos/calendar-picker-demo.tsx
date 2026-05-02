'use client'

import * as React from 'react'

import { Button } from '@/components/ui/button'
import {
    Calendar,
    CalendarCancelButton,
    CalendarCompactPicker,
    CalendarConfirmButton,
    CalendarFooter,
    CalendarHeader,
    CalendarPicker,
    CalendarTodayButton,
} from '@/components/ui/calendar'
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { TextField } from '@/components/ui/text-field'

const dateFormatter = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
})

function formatDate(date: Date | undefined) {
    return date ? dateFormatter.format(date) : ''
}

export function CalendarPickerDemo() {
    return (
        <div className='flex flex-wrap items-start justify-center gap-6'>
            <CalendarPopoverPickerDemo />
            <CalendarDialogCompactPickerDemo />
        </div>
    )
}

export function CalendarPopoverPickerDemo() {
    const [open, setOpen] = React.useState(false)
    const [date, setDate] = React.useState<Date | undefined>(new Date(2025, 7, 17))

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <TextField
                    className='w-75'
                    label='Date'
                    type='text'
                    value={formatDate(date)}
                    readOnly
                    endIcon={
                        <button
                            type='button'
                            aria-label='Open calendar'
                            className='flex h-10 w-10 items-center justify-center rounded-full outline-none transition-colors hover:bg-on-surface-variant/8 focus-visible:ring-2 focus-visible:ring-primary [&_i]:size-5'
                            onClick={event => {
                                event.preventDefault()
                                setOpen(true)
                            }}
                        >
                            <i className='icon-[material-symbols--calendar-month-rounded]' />
                        </button>
                    }
                />
            </PopoverTrigger>
            <PopoverContent align='start' className='w-auto p-0'>
                <Calendar
                    className='rounded-2xl'
                    mode='single'
                    selected={date}
                    onSelect={value => setDate(value as Date | undefined)}
                >
                    <CalendarPicker />
                    <CalendarFooter>
                        <CalendarTodayButton>Today</CalendarTodayButton>
                        <CalendarCancelButton onCancel={() => setOpen(false)}>Cancel</CalendarCancelButton>
                        <CalendarConfirmButton onConfirm={() => setOpen(false)}>OK</CalendarConfirmButton>
                    </CalendarFooter>
                </Calendar>
            </PopoverContent>
        </Popover>
    )
}

export function CalendarDialogCompactPickerDemo() {
    const [open, setOpen] = React.useState(false)
    const [date, setDate] = React.useState<Date | undefined>(new Date(2025, 7, 17))

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant='tonal' size='md'>
                    <i className='icon-[material-symbols--event-available-rounded]' />
                    Open compact picker
                </Button>
            </DialogTrigger>
            <DialogContent className='w-auto gap-0 p-0 sm:max-w-none' aria-describedby={undefined}>
                <DialogTitle className='sr-only'>Select date</DialogTitle>
                <Calendar mode='single' selected={date} onSelect={value => setDate(value as Date | undefined)}>
                    <CalendarHeader />
                    <CalendarCompactPicker />
                    <CalendarFooter>
                        <CalendarCancelButton onCancel={() => setOpen(false)}>Cancel</CalendarCancelButton>
                        <CalendarConfirmButton onConfirm={() => setOpen(false)}>OK</CalendarConfirmButton>
                    </CalendarFooter>
                </Calendar>
            </DialogContent>
        </Dialog>
    )
}
