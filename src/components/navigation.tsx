'use client'
import {
    NavigationRail,
    NavigationRailContent,
    NavigationRailItem,
    NavigationRailMenu,
    NavigationRailTrigger,
} from '@/components/ui/navigation-rail'
import { Button } from '@/components/ui/button'
import { usePathname } from 'next/navigation'
import Link from 'next/link'

export default function Navigation() {
    const pathname = usePathname()

    return (
        <NavigationRail>
            <NavigationRailContent>
                <NavigationRailMenu className='mb-2'>
                    <NavigationRailTrigger />
                </NavigationRailMenu>
                <NavigationRailItem
                    asChild
                    icon={<i className='icon-[material-symbols--home-rounded]' />}
                    active={pathname === '/'}
                >
                    <Link href={'/'}>Home</Link>
                </NavigationRailItem>
                <NavigationRailItem icon={<i className='icon-[material-symbols--apps]' />} active={pathname === '/docs'}>
                    Docs
                </NavigationRailItem>
                <NavigationRailItem
                    icon={<i className='icon-[material-symbols--add-circle-outline-rounded]' />}
                    active={pathname === '/components'}
                >
                    <Link href={'/components'}>components</Link>
                </NavigationRailItem>
                <div className='mt-auto flex flex-wrap p-4'>
                    <Button variant='outline' icon className='size-14 rounded-full'>
                        <i className='icon-[material-symbols--nightlight-outline-rounded] size-6' />
                    </Button>
                </div>
            </NavigationRailContent>
        </NavigationRail>
    )
}
