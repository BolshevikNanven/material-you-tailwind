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
import { TextFieldDemo } from '@/demos/text-field-demo'
import { DialogDemo } from '@/demos/dialog-demo'
import { ButtonGroupDemo } from '@/demos/button-group-demo'
import { DividerDemo } from '@/demos/divider-demo'
import { TooltipDemo } from '@/demos/tooltip-demo'
import { TabsDemo } from '@/demos/tabs-demo'
import { SnakebarDemo } from '@/demos/snakebar-demo'
import { LoadingDemo } from '@/demos/loading-demo'
import { ProgressDemo } from '@/demos/progress-demo'
import { ChipDemo } from '@/demos/chip-demo'
import { AvatarDemo } from '@/demos/avatar-demo'
import { NavigationDemo } from '@/demos/navigation-demo'

export default async function Components() {
    return (
        <div className='flex h-screen w-full flex-col overflow-hidden'>
            <div className='flex h-full flex-col gap-2 overflow-auto rounded-l-3xl bg-surface p-6'>
                <ButtonDemo />
                <ToggleDemo />
                <ButtonGroupDemo />
                <div className='flex w-full gap-12'>
                    <CheckboxDemo />
                    <SwitchDemo />
                    <BadgeDemo />
                    <TooltipDemo />
                    <SnakebarDemo />
                </div>
                <TextFieldDemo />
                <DividerDemo />
                <div className='flex gap-12'>
                    <RadioGroupDemo />
                    <SliderDemo />
                    <ContextMenuDemo />
                    <DropdownMenuDemo />
                    <DialogDemo />
                </div>
                <div className='flex gap-12'>
                    <ChipDemo />
                    <AvatarDemo />
                </div>
                <CardDemo />
                <TabsDemo />
                <LoadingDemo />
                <ProgressDemo />
                <NavigationDemo />
            </div>
        </div>
    )
}
