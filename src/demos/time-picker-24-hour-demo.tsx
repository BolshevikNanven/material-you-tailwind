import { TimePicker, TimePickerClock } from '@/components/ui/time-picker'

export function TimePicker24HourDemo() {
    return (
        <TimePicker aria-label='Select time' is24Hour defaultValue={{ hour: 17, minute: 30 }}>
            <TimePickerClock />
        </TimePicker>
    )
}
