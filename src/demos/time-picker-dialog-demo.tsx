'use client'

import * as React from 'react'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import {
    TimePicker,
    TimePickerActions,
    TimePickerCancelButton,
    TimePickerConfirmButton,
    TimePickerContent,
    TimePickerModeToggle,
    type TimePickerValue,
} from '@/components/ui/time-picker'

function format({ hour, minute }: TimePickerValue) {
    const period = hour >= 12 ? 'PM' : 'AM'
    return `${hour % 12 === 0 ? 12 : hour % 12}:${String(minute).padStart(2, '0')} ${period}`
}

export function TimePickerDialogDemo() {
    const [open, setOpen] = React.useState(false)
    const [time, setTime] = React.useState<TimePickerValue>({ hour: 8, minute: 30 })

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant='tonal'>
                    <i className='icon-[material-symbols--schedule-outline-rounded]' />
                    {format(time)}
                </Button>
            </DialogTrigger>
            <DialogContent aria-describedby={undefined} className='w-auto max-w-none gap-0 bg-transparent p-0 sm:max-w-none'>
                <DialogTitle className='sr-only'>Select time</DialogTitle>
                {/* Remount on open so unconfirmed changes are dropped. */}
                <TimePicker key={String(open)} defaultValue={time}>
                    <TimePickerContent />
                    <TimePickerActions>
                        <TimePickerModeToggle />
                        <TimePickerCancelButton onCancel={() => setOpen(false)}>Cancel</TimePickerCancelButton>
                        <TimePickerConfirmButton
                            onConfirm={value => {
                                setTime(value)
                                setOpen(false)
                            }}
                        >
                            OK
                        </TimePickerConfirmButton>
                    </TimePickerActions>
                </TimePicker>
            </DialogContent>
        </Dialog>
    )
}
