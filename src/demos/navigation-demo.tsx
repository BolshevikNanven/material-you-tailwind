'use client'

import { Button } from '@/components/ui/button'
import { ButtonGroup } from '@/components/ui/button-group'
import { NavigationBar, NavigationBarItem } from '@/components/ui/navigation-bar'
import {
    NavigationMode,
    NavigationRail,
    NavigationRailContent,
    NavigationRailItem,
    NavigationRailTrigger,
} from '@/components/ui/navigation-rail'
import { Switch } from '@/components/ui/switch'
import { Toggle } from '@/components/ui/toggle'
import { useState } from 'react'

export function NavigationDemo() {
    const [mode, setMode] = useState<NavigationMode>('persistent')
    const [contained, setContained] = useState(false)

    return (
        <div className='flex flex-col gap-4'>
            <h3>NavigationBar</h3>
            <div className='mb-6 flex gap-6'>
                <div className='flex h-[720px] w-[380px] shrink-0 flex-col overflow-hidden rounded-2xl border-4 bg-surface-container'>
                    <div className='flex-1 rounded-2xl bg-surface'></div>
                    <NavigationBar>
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

                <div className='flex h-[720px] w-full flex-col overflow-hidden rounded-2xl border-4 bg-surface-container'>
                    <div className='flex-1 rounded-2xl bg-surface'></div>
                    <NavigationBar wide>
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
            </div>
            <h3>NavigationRail</h3>
            <div className='mb-6 flex flex-col gap-4'>
                <div className='relative flex h-[720px] w-full shrink-0 overflow-hidden rounded-2xl border-4'>
                    <NavigationRail mode={mode} contained={contained}>
                        {mode === 'hidden' && (
                            <NavigationRailTrigger asChild>
                                <Button icon className='mt-4 ml-4'>
                                    <i className='icon-[material-symbols--menu-rounded]' />
                                </Button>
                            </NavigationRailTrigger>
                        )}
                        <NavigationRailContent
                            className='bg-surface-container'
                            fab={
                                <Button square size='lg'>
                                    <i className='icon-[material-symbols--search-rounded]' />
                                </Button>
                            }
                        >
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
                    <div className='flex flex-col gap-4 p-4'>
                        <ButtonGroup variant='connected'>
                            <Toggle
                                size='sm'
                                variant='tonal'
                                pressed={mode === 'persistent'}
                                onClick={() => setMode('persistent')}
                            >
                                {mode === 'persistent' && <i className='icon-[material-symbols--check-rounded]' />}
                                Persistent
                            </Toggle>
                            <Toggle size='sm' variant='tonal' pressed={mode === 'modal'} onClick={() => setMode('modal')}>
                                {mode === 'modal' && <i className='icon-[material-symbols--check-rounded]' />}
                                Modal
                            </Toggle>
                            <Toggle size='sm' variant='tonal' pressed={mode === 'hidden'} onClick={() => setMode('hidden')}>
                                {mode === 'hidden' && <i className='icon-[material-symbols--check-rounded]' />}
                                Hidden
                            </Toggle>
                        </ButtonGroup>
                        <div className='flex items-center gap-4'>
                            <Switch checked={contained} onCheckedChange={v => setContained(v)} />
                            Contained
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
