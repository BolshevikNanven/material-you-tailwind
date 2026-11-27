import {
    TimePicker,
    TimePickerActions,
    TimePickerCancelButton,
    TimePickerConfirmButton,
    TimePickerContent,
    TimePickerModeToggle,
} from '@/components/ui/time-picker'

export function TimePickerInputDemo() {
    return (
        <TimePicker aria-label='Enter time' defaultMode='input' defaultValue={{ hour: 20, minute: 15 }}>
            <TimePickerContent />
            <TimePickerActions>
                <TimePickerModeToggle />
                <TimePickerCancelButton>Cancel</TimePickerCancelButton>
                <TimePickerConfirmButton>OK</TimePickerConfirmButton>
            </TimePickerActions>
        </TimePicker>
    )
}
