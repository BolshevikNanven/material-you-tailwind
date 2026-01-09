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
import { DialogDemo } from './demos/dialog-demo'
import { ButtonGroupDemo } from './demos/button-group-demo'

export default function App() {
    return (
        <div className='flex h-screen w-full flex-col overflow-hidden'>
            <header className='flex h-18 items-center p-4'>
                <h3 className='text-xl text-secondary'>Material You Tailwind</h3>
            </header>
            <div className='m-4 mt-0 flex h-full flex-col gap-2 overflow-auto rounded-3xl bg-surface p-6'>
                <ButtonDemo />
                <ToggleDemo />
                <ButtonGroupDemo />
                <div className='flex w-full gap-12'>
                    <CheckboxDemo />
                    <SwitchDemo />
                    <BadgeDemo />
                    <TextFieldDemo />
                </div>
                <div className='flex gap-12'>
                    <RadioGroupDemo />
                    <SliderDemo />
                    <ContextMenuDemo />
                    <DropdownMenuDemo />
                    <DialogDemo />
                </div>
                <CardDemo />
                <div className='flex gap-12'></div>
            </div>
        </div>
    )
}
