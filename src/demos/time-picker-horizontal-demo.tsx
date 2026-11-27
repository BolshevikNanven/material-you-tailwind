import {
    TimePicker,
    TimePickerActions,
    TimePickerCancelButton,
    TimePickerConfirmButton,
    TimePickerContent,
    TimePickerModeToggle,
} from '@/components/ui/time-picker'

export function TimePickerHorizontalDemo() {
    return (
        <div className='max-w-full overflow-x-auto'>
            <TimePicker aria-label='Select time' orientation='horizontal' defaultValue={{ hour: 9, minute: 45 }}>
                <TimePickerContent />
                <TimePickerActions>
                    <TimePickerModeToggle />
                    <TimePickerCancelButton>Cancel</TimePickerCancelButton>
                    <TimePickerConfirmButton>OK</TimePickerConfirmButton>
                </TimePickerActions>
            </TimePicker>
        </div>
    )
}
