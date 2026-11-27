import {
    TimePicker,
    TimePickerActions,
    TimePickerCancelButton,
    TimePickerConfirmButton,
    TimePickerContent,
    TimePickerModeToggle,
} from '@/components/ui/time-picker'

export function TimePickerScrollDemo() {
    return (
        <TimePicker aria-label='Select time' defaultMode='scroll' defaultValue={{ hour: 6, minute: 30 }}>
            <TimePickerContent />
            <TimePickerActions>
                <TimePickerModeToggle />
                <TimePickerCancelButton>Cancel</TimePickerCancelButton>
                <TimePickerConfirmButton>OK</TimePickerConfirmButton>
            </TimePickerActions>
        </TimePicker>
    )
}
