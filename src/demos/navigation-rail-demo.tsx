'use client'

import {
    NavigationRail,
    NavigationRailContent,
    NavigationRailItem,
    NavigationRailMenu,
    NavigationRailTrigger,
} from '@/components/ui/navigation-rail'

export function NavigationRailDemo() {
    return (
        <div className='flex w-full flex-col gap-4'>
            <div className='relative flex w-full shrink-0 overflow-hidden rounded-3xl border-4'>
                <NavigationRail contained variant='modal'>
                    <NavigationRailContent className='bg-surface-container pb-32'>
                        <NavigationRailMenu>
                            <NavigationRailTrigger />
                        </NavigationRailMenu>
                        <NavigationRailItem active icon={<i className='icon-[material-symbols--home-rounded]' />}>
                            Label
                        </NavigationRailItem>
                        <NavigationRailItem icon={<i className='icon-[material-symbols--home-outline-rounded]' />}>
                            Label
                        </NavigationRailItem>
                        <NavigationRailItem icon={<i className='icon-[material-symbols--home-outline-rounded]' />}>
                            Label
                        </NavigationRailItem>
                    </NavigationRailContent>
                </NavigationRail>
            </div>
        </div>
    )
}
