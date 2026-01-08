import { ButtonDemo } from '@/demos/button-demo'
import { ToggleDemo } from '@/demos/toggle-demo'
import { CheckboxDemo } from '@/demos/checkbox-demo'
import { SwitchDemo } from '@/demos/switch-demo'
import { RadioGroupDemo } from '@/demos/radio-group-demo'
import { SliderDemo } from '@/demos/slider-demo'
import { BadgeDemo } from '@/demos/badge-demo'
import { CardDemo } from '@/demos/card-demo'
import { ContextMenuDemo } from '@/demos/context-menu-demo'
import { DropdownMenuDemo } from '@/demos/dropdown-menu-demo'
import { TextFieldDemo } from './demos/text-field-demo'

export default function App() {
    return (
        <div className='h-screen overflow-hidden p-4'>
            <div className='flex h-full flex-col gap-2 overflow-auto rounded-3xl bg-surface p-6'>
                <ButtonDemo />
                <ToggleDemo />
                <CheckboxDemo />
                <SwitchDemo />
                <RadioGroupDemo />
                <SliderDemo />
                <TextFieldDemo />
                <BadgeDemo />
                <CardDemo />
                <ContextMenuDemo />
                <DropdownMenuDemo />
            </div>
        </div>
    )
}
