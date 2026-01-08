import { Stars } from 'lucide-react'
import { Toggle } from '../components/ui/toggle'

export function ToggleDemo() {
    return (
        <>
            <h3>Toggle</h3>
            <div className='mb-6 flex flex-wrap items-center gap-4'>
                <Toggle size='lg'>
                    <Stars />
                    Label
                </Toggle>
                <Toggle>
                    <Stars />
                    Label
                </Toggle>
                <Toggle size='sm'>
                    <Stars />
                    Label
                </Toggle>
                <Toggle variant='tonal'>
                    <Stars />
                    Label
                </Toggle>
                <Toggle variant='outline'>
                    <Stars />
                    Label
                </Toggle>
                <Toggle variant='elevated'>
                    <Stars />
                    Label
                </Toggle>
            </div>
        </>
    )
}