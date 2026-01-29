import { Checkbox } from '@/components/ui/checkbox'

export function CheckboxDemo() {
    return (
        <div className='flex flex-wrap items-center gap-4'>
            <div className='flex items-center'>
                <div className='flex items-center gap-3'>
                    <Checkbox id='terms' />
                    <label htmlFor='terms'>Accept terms and conditions</label>
                </div>
            </div>
        </div>
    )
}
