import { Switch } from '@/components/ui/switch'

export function SwitchDemo() {
    return (
        <div className='flex flex-wrap items-center gap-4'>
            <Switch />
            <Switch defaultChecked />
            <Switch icon />
            <Switch icon defaultChecked />
            <Switch disabled />
            <Switch disabled defaultChecked icon />
        </div>
    )
}
