import { NavigationBar, NavigationBarItem } from '@/components/ui/navigation-bar'

export function NavigationBarDemo() {
    return (
        <div className='mb-6 flex w-full flex-col items-center gap-6'>
            <NavigationBar className='w-[340px]'>
                <NavigationBarItem active icon={<i className='icon-[material-symbols--home-outline-rounded]' />}>
                    Label
                </NavigationBarItem>
                <NavigationBarItem icon={<i className='icon-[material-symbols--home-outline-rounded]' />}>
                    Label
                </NavigationBarItem>
                <NavigationBarItem icon={<i className='icon-[material-symbols--home-outline-rounded]' />}>
                    Label
                </NavigationBarItem>
            </NavigationBar>

            <NavigationBar wide className='w-full'>
                <NavigationBarItem active icon={<i className='icon-[material-symbols--home-outline-rounded]' />}>
                    Label
                </NavigationBarItem>
                <NavigationBarItem icon={<i className='icon-[material-symbols--home-outline-rounded]' />}>
                    Label
                </NavigationBarItem>
                <NavigationBarItem icon={<i className='icon-[material-symbols--home-outline-rounded]' />}>
                    Label
                </NavigationBarItem>
            </NavigationBar>
        </div>
    )
}
