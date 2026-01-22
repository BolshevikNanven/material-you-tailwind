'use client'

import { LogosGoogle } from '@/components/logos/google'
import { LogosGoogleCalendar } from '@/components/logos/google-calendar'
import { LogosGoogleDrive } from '@/components/logos/google-drive'
import { LogosGoogleMaps } from '@/components/logos/google-maps'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Divider } from '@/components/ui/divider'
import {
    NavigationRail,
    NavigationRailContent,
    NavigationRailItem,
    NavigationRailMenu,
    NavigationRailTrigger,
} from '@/components/ui/navigation-rail'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'

export default function ChatExample() {
    const listData = [
        {
            title: 'Chats',
            items: ['Zita Di Marco', 'In Yeong-hui', 'Renee Claes', 'Odette d Ambricourt'],
        },
        {
            title: 'Spaces',
            items: ['Adoption volunteering', 'Museum field trip', 'Annual spring hike', 'Cool flea market', 'Lesson planning'],
        },
    ] as const

    return (
        <div className='relative flex h-full w-full overflow-hidden bg-surface-container-highest'>
            <NavigationRail variant='modal' contained>
                <NavigationRailContent className='pt-2'>
                    <NavigationRailMenu>
                        <NavigationRailTrigger />
                    </NavigationRailMenu>
                    <NavigationRailItem icon={<i className='icon-[material-symbols--mail-outline-rounded]' />}>
                        Mail
                    </NavigationRailItem>
                    <NavigationRailItem icon={<i className='icon-[material-symbols--chat-bubble-outline-rounded]' />}>
                        Chat
                    </NavigationRailItem>
                    <NavigationRailItem active icon={<i className='icon-[material-symbols--groups-outline-rounded]' />}>
                        Spaces
                    </NavigationRailItem>
                    <NavigationRailItem icon={<i className='icon-[material-symbols--videocam-outline-rounded]' />}>
                        Meet
                    </NavigationRailItem>
                </NavigationRailContent>
            </NavigationRail>
            <div className='flex h-full w-full rounded-l-3xl bg-surface-container py-2 pl-5'>
                <div className='mr-8 flex flex-col'>
                    <header className='mb-2 flex h-14 items-center'>
                        <h3 className='text-xl'>Chat</h3>
                    </header>
                    <Button square className='self-baseline'>
                        <i className='icon-[material-symbols--group-add-outline-rounded]' />
                        New space
                    </Button>
                    {listData.map(data => (
                        <div key={data.title} className='mt-8 flex flex-col gap-0.5 text-sm'>
                            <div className='mb-2 flex items-center gap-1 px-4'>
                                <p className='font-bold'>{data.title}</p>
                                <span className='text-xs text-on-surface-variant'>(28)</span>
                                <i className='ml-auto icon-[material-symbols--unfold-less-rounded] size-5 text-on-surface-variant' />
                            </div>
                            {data.items.map(item => (
                                <div
                                    key={item}
                                    className={cn(
                                        'flex cursor-pointer items-center gap-2 rounded-lg px-4 py-1 text-on-surface-variant transition-colors select-none hover:bg-secondary-container',
                                        item === 'Adoption volunteering' && 'bg-secondary-container font-bold text-on-surface',
                                    )}
                                >
                                    <Avatar className={cn('size-6', data.title === 'Spaces' && 'rounded-lg')}>
                                        {item === 'Adoption volunteering' && (
                                            <AvatarImage src={'https://github.com/bolsheviknanven.png'} alt='avatar' />
                                        )}
                                        <AvatarFallback className='text-xs'>{item.at(0)}</AvatarFallback>
                                    </Avatar>
                                    <p className='text-sm'>{item}</p>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
                <div className='mb-2 flex flex-1 flex-col'>
                    <header className='mb-2 flex h-14 items-center pr-2'>
                        <div className='mr-auto flex h-12 w-1/2 cursor-pointer items-center rounded-full bg-surface-container-lowest px-4'>
                            <i className='icon-[material-symbols--search-rounded] size-5' />
                            <p className='ml-4 text-sm text-outline'>Search chat and spaces</p>
                            <i className='ml-auto icon-[material-symbols--arrow-drop-down-rounded] size-5' />
                        </div>
                        <Button variant='text' className='text-on-surface-variant' icon>
                            <i className='icon-[material-symbols--help-outline-rounded]' />
                        </Button>
                        <Button variant='text' className='text-on-surface-variant' icon>
                            <i className='icon-[material-symbols--settings-outline-rounded]' />
                        </Button>
                        <Button variant='text' className='text-on-surface-variant' icon>
                            <i className='icon-[material-symbols--apps]' />
                        </Button>
                        <div className='ml-1 flex h-12 items-center gap-2 rounded-full bg-surface-container-low p-2'>
                            <LogosGoogle className='ml-1 w-14' />
                            <Avatar className='size-8'>
                                <AvatarImage src={'https://github.com/bolsheviknanven.png'} alt='avatar' />
                                <AvatarFallback className='text-xs'>A</AvatarFallback>
                            </Avatar>
                        </div>
                    </header>
                    <main className='flex flex-1'>
                        <div className='flex flex-1 flex-col rounded-3xl bg-surface'>
                            <div className='flex gap-5 pl-5'>
                                <Avatar className='mt-5'>
                                    <AvatarImage src={'https://github.com/bolsheviknanven.png'} alt='avatar' />
                                    <AvatarFallback className='text-xs'>A</AvatarFallback>
                                </Avatar>
                                <div className='mt-5'>
                                    <h4 className='flex text-xl leading-6'>
                                        Adoption volunteering
                                        <i className='my-auto ml-auto icon-[material-symbols--arrow-drop-down-rounded]' />
                                    </h4>
                                    <span className='text-xs text-on-surface-variant'>22 members</span>
                                </div>
                                <Button variant='text' className='mt-1 mr-1 ml-auto text-on-surface-variant' icon>
                                    <i className='icon-[material-symbols--close-fullscreen-rounded]' />
                                </Button>
                            </div>
                            <Tabs defaultValue='Chat' className='w-full'>
                                <TabsList className='h-9'>
                                    <TabsTrigger className='ml-12 w-24' value='Chat'>
                                        Chat
                                    </TabsTrigger>
                                    <TabsTrigger className='w-24' value='Files'>
                                        Files
                                    </TabsTrigger>
                                    <TabsTrigger className='w-24' value='Tasks'>
                                        Tasks
                                    </TabsTrigger>
                                </TabsList>
                            </Tabs>
                            <div className='flex flex-1 flex-col'></div>
                            <div className='flex gap-1 p-5'>
                                <Button variant='text' className='text-on-surface-variant' icon>
                                    <i className='icon-[material-symbols--add-circle-outline-rounded]' />
                                </Button>
                                <div className='flex h-12 flex-1 rounded-full border border-outline pr-2'>
                                    <input
                                        type='text'
                                        defaultValue='History is on'
                                        className='w-full pl-4 text-sm outline-none'
                                    />
                                    <Button variant='text' square className='h-full px-2 text-on-surface-variant'>
                                        <i className='icon-[material-symbols--mood-outline-rounded]' />
                                    </Button>
                                    <Button variant='text' square className='h-full px-2 text-on-surface-variant'>
                                        <i className='icon-[material-symbols--gif-box-outline-rounded]' />
                                    </Button>
                                    <Button variant='text' square className='h-full px-2 text-on-surface-variant'>
                                        <i className='icon-[material-symbols--upload-rounded]' />
                                    </Button>
                                </div>
                                <Button variant='text' className='text-on-surface-variant' icon>
                                    <i className='icon-[material-symbols--send-outline] size-6' />
                                </Button>
                            </div>
                        </div>
                        <div className='mx-2 flex w-12 flex-col gap-3'>
                            <Button variant='text' icon>
                                <LogosGoogleCalendar className='size-4.5' />
                            </Button>
                            <Button variant='text' icon>
                                <LogosGoogleDrive className='size-4.5' />
                            </Button>
                            <Button variant='text' icon>
                                <LogosGoogleMaps className='size-4.5' />
                            </Button>
                            <Divider />
                            <Button variant='text' className='text-on-surface-variant' icon>
                                <i className='icon-[material-symbols--add-rounded]' />
                            </Button>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    )
}
