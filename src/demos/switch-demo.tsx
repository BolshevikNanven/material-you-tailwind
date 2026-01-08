import { Switch } from '../components/ui/switch'

export function SwitchDemo() {
    return (
        <div className='flex flex-col gap-4'>
            <h3>Switch</h3>
            <div className='mb-6 flex flex-wrap items-center gap-4'>
                <Switch />
            </div>
        </div>
    )
}