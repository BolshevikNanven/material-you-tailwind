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
import { useTheme } from '@/context/theme'

export default function Navigation() {
    const [theme, setTheme] = useTheme()
    const pathname = usePathname()

    const handleChangeMode = () => {
        setTheme(theme === 'light' ? 'dark' : 'light')
    }

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
                    asChild
                    icon={<i className='icon-[material-symbols--add-circle-outline-rounded]' />}
                    active={pathname === '/components'}
                >
                    <Link href={'/components'}>components</Link>
                </NavigationRailItem>
                <div className='mt-auto flex flex-wrap p-4'>
                    <Button variant='outline' icon className='size-14 rounded-full' onClick={handleChangeMode}>
                        {theme === 'dark' ? (
                            <i className='icon-[material-symbols--sunny-outline-rounded] size-6' />
                        ) : (
                            <i className='icon-[material-symbols--nightlight-outline-rounded] size-6' />
                        )}
                    </Button>
                </div>
            </NavigationRailContent>
        </NavigationRail>
    )
}
