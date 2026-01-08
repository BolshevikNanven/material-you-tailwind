import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group'

export function RadioGroupDemo() {
    return (
        <>
            <h3>Radio Group</h3>
            <div className='mb-6 flex flex-wrap items-center gap-4'>
                <RadioGroup defaultValue='comfortable'>
                    <div className='flex items-center gap-3'>
                        <RadioGroupItem value='default' id='r1' />
                        <label htmlFor='r1'>Default</label>
                    </div>
                    <div className='flex items-center gap-3'>
                        <RadioGroupItem value='comfortable' id='r2' />
                        <label htmlFor='r2'>Comfortable</label>
                    </div>
                    <div className='flex items-center gap-3'>
                        <RadioGroupItem value='compact' id='r3' />
                        <label htmlFor='r3'>Compact</label>
                    </div>
                </RadioGroup>
            </div>
        </>
    )
}