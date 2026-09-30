'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Toggle } from '@/components/ui/toggle'
import { Toolbar, ToolbarItem } from '@/components/ui/toolbar'

export function ToolbarDemo() {
    return (
        <div className='flex w-full flex-wrap items-center justify-center gap-x-8 gap-y-10 overflow-x-auto p-3'>
            <ToolbarNavigationDemo />
            <ToolbarLabelDemo />
            <ToolbarFormattingDemo />
            <ToolbarCallDemo />
            <div className='w-full max-w-sm'>
                <ToolbarDockedDemo />
            </div>
        </div>
    )
}

export function ToolbarNavigationDemo() {
    return (
        <Toolbar>
            <ToolbarItem>
                <i className='icon-[material-symbols--arrow-back-rounded]' />
            </ToolbarItem>
            <ToolbarItem>
                <i className='icon-[material-symbols--arrow-forward-rounded]' />
            </ToolbarItem>
            <ToolbarItem asChild>
                <Button>
                    <i className='icon-[material-symbols--add-rounded]' />
                </Button>
            </ToolbarItem>
            <ToolbarItem>
                <i className='icon-[material-symbols--picture-in-picture-rounded]' />
            </ToolbarItem>
            <ToolbarItem>
                <i className='icon-[material-symbols--more-vert]' />
            </ToolbarItem>
        </Toolbar>
    )
}

export function ToolbarLabelDemo({ compact = false }: { compact?: boolean }) {
    const [view, setView] = useState('photos')

    return (
        <Toolbar compact={compact}>
            <ToolbarItem asChild>
                <Toggle variant='tonal' pressed={view === 'photos'} onPressedChange={() => setView('photos')}>
                    <i className='icon-[material-symbols--image-rounded]' />
                    Photos
                </Toggle>
            </ToolbarItem>
            <ToolbarItem asChild>
                <Toggle variant='tonal' pressed={view === 'memories'} onPressedChange={() => setView('memories')}>
                    Memories
                </Toggle>
            </ToolbarItem>
            <ToolbarItem asChild>
                <Toggle variant='tonal' pressed={view === 'library'} onPressedChange={() => setView('library')}>
                    Library
                </Toggle>
            </ToolbarItem>
        </Toolbar>
    )
}

export function ToolbarFormattingDemo({ compact = false }: { compact?: boolean }) {
    return (
        <Toolbar color='vibrant' compact={compact}>
            <ToolbarItem asChild>
                <Toggle icon variant='tonal' defaultPressed>
                    <i className='icon-[material-symbols--format-bold-rounded]' />
                </Toggle>
            </ToolbarItem>
            <ToolbarItem asChild>
                <Toggle icon variant='tonal'>
                    <i className='icon-[material-symbols--format-italic-rounded]' />
                </Toggle>
            </ToolbarItem>
            <ToolbarItem asChild>
                <Toggle icon variant='tonal'>
                    <i className='icon-[material-symbols--format-underlined-rounded]' />
                </Toggle>
            </ToolbarItem>
            <ToolbarItem>
                <i className='icon-[material-symbols--format-color-text-rounded]' />
            </ToolbarItem>
            <ToolbarItem>
                <i className='icon-[material-symbols--format-color-fill-rounded]' />
            </ToolbarItem>
        </Toolbar>
    )
}

export function ToolbarCallDemo({ compact = false }: { compact?: boolean }) {
    const [inCall, setInCall] = useState(true)
    const [cameraOn, setCameraOn] = useState(false)
    const [muted, setMuted] = useState(false)

    return (
        <div className='flex shrink-0 items-center gap-2'>
            <Toolbar compact={compact}>
                <ToolbarItem asChild>
                    <Toggle icon variant='tonal' pressed={cameraOn} onPressedChange={setCameraOn} disabled={!inCall}>
                        <i
                            className={
                                cameraOn
                                    ? 'icon-[material-symbols--videocam-rounded]'
                                    : 'icon-[material-symbols--videocam-off-rounded]'
                            }
                        />
                    </Toggle>
                </ToolbarItem>
                <ToolbarItem asChild>
                    <Toggle icon variant='tonal' pressed={muted} onPressedChange={setMuted} disabled={!inCall}>
                        <i
                            className={
                                muted ? 'icon-[material-symbols--mic-off-rounded]' : 'icon-[material-symbols--mic-rounded]'
                            }
                        />
                    </Toggle>
                </ToolbarItem>
                <ToolbarItem asChild>
                    <Toggle icon variant='tonal' defaultPressed disabled={!inCall}>
                        <i className='icon-[material-symbols--front-hand-rounded]' />
                    </Toggle>
                </ToolbarItem>
                <ToolbarItem disabled={!inCall}>
                    <i className='icon-[material-symbols--more-vert]' />
                </ToolbarItem>
            </Toolbar>
            <Button
                type='button'
                icon
                square
                size='lg'
                className='bg-error text-on-error shadow-elevation-3'
                onClick={() => setInCall(!inCall)}
            >
                <i className={inCall ? 'icon-[material-symbols--call-end]' : 'icon-[material-symbols--call]'} />
            </Button>
        </div>
    )
}

export function ToolbarDockedDemo() {
    return (
        <Toolbar variant='docked'>
            <ToolbarItem>
                <i className='icon-[material-symbols--archive-rounded]' />
            </ToolbarItem>
            <ToolbarItem>
                <i className='icon-[material-symbols--delete-outline-rounded]' />
            </ToolbarItem>
            <ToolbarItem>
                <i className='icon-[material-symbols--mark-email-unread-outline-rounded]' />
            </ToolbarItem>
            <ToolbarItem>
                <i className='icon-[material-symbols--snooze-rounded]' />
            </ToolbarItem>
            <ToolbarItem>
                <i className='icon-[material-symbols--star-outline-rounded]' />
            </ToolbarItem>
        </Toolbar>
    )
}
