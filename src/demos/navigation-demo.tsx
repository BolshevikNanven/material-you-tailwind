'use client'

import { NavigationBar, NavigationItem } from '@/components/ui/navigation'

export function NavigationDemo() {
    return (
        <div className='flex flex-col gap-4'>
            <h3>Badge</h3>
            <div className='mb-6 flex flex-col gap-4'>
                <NavigationBar className='w-[412px]'>
                    <NavigationItem active icon={<i className='icon-[material-symbols--home-outline-rounded]' />}>
                        Label
                    </NavigationItem>
                    <NavigationItem icon={<i className='icon-[material-symbols--home-outline-rounded]' />}>
                        Label
                    </NavigationItem>
                    <NavigationItem icon={<i className='icon-[material-symbols--home-outline-rounded]' />}>
                        Label
                    </NavigationItem>
                </NavigationBar>
                <NavigationBar wide className='w-[800px]'>
                    <NavigationItem active icon={<i className='icon-[material-symbols--home-outline-rounded]' />}>
                        Label
                    </NavigationItem>
                    <NavigationItem icon={<i className='icon-[material-symbols--home-outline-rounded]' />}>
                        Label
                    </NavigationItem>
                    <NavigationItem icon={<i className='icon-[material-symbols--home-outline-rounded]' />}>
                        Label
                    </NavigationItem>
                </NavigationBar>
            </div>
        </div>
    )
}
