'use client'

import ChatExample from '@/components/examples/chat'
import { ButtonGroup } from '@/components/ui/button-group'
import { Toggle } from '@/components/ui/toggle'
import { useLayoutEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import AuthExample from '../examples/auth'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogTitle, DialogTrigger } from '../ui/dialog'
import { TextField } from '../ui/text-field'
import { generateColors } from '@/lib/utils'
import { useTheme } from '@/context/theme'
import { Chip } from '../ui/chip'
import { toast } from '../ui/snakebar'

export default function Examples() {
    const [example, setExample] = useState('chat')
    const [color, setColor] = useState('#7B9168')
    const [theme] = useTheme()

    const containerRef = useRef<HTMLDivElement>(null)

    const handleApplyTheme = () => {
        if (!containerRef.current) {
            return
        }
        const t = generateColors(color)

        if (theme === 'light') {
            t.light.forEach((v, k) => containerRef.current?.style.setProperty(k, v))
        } else {
            t.dark.forEach((v, k) => containerRef.current?.style.setProperty(k, v))
        }
    }

    const handleCopyTheme = async () => {
        const t = generateColors(color)

        const cssContent = `:root {
    ${Array.from(t.light, ([k, v]) => `${k}:${v}`).join(';')}
}

.dark {
    ${Array.from(t.dark, ([k, v]) => `${k}:${v}`).join(';')}
}`
        try {
            await navigator.clipboard.writeText(cssContent)

            toast({ message: 'Copied to clipboard' })
        } catch (err) {
            toast({ message: 'Failed to copied' })
        }
    }

    useLayoutEffect(() => {
        handleApplyTheme()
    }, [theme])

    return (
        <div ref={containerRef} className='mx-auto flex w-[80%] flex-col items-center gap-4'>
            <div className='flex w-full'>
                <ButtonGroup>
                    <Toggle pressed={example === 'chat'} onClick={() => setExample('chat')} square size={'sm'}>
                        ChatApp
                    </Toggle>
                    <Toggle pressed={example === 'auth'} onClick={() => setExample('auth')} square size={'sm'}>
                        Authentication
                    </Toggle>
                </ButtonGroup>
                <ButtonGroup variant='connected' className='ml-auto'>
                    <Button onClick={handleCopyTheme} size={'sm'} variant='tonal'>
                        <i className='icon-[material-symbols--content-copy-outline-rounded]' />
                        Theme
                    </Button>
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button size={'sm'} variant='tonal' className='px-2'>
                                <i className='icon-[material-symbols--arrow-drop-down-rounded]' />
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogTitle>Change Theme</DialogTitle>
                            <DialogDescription>
                                Select a theme color. The system will automatically generate a matching color scheme based on
                                your choice.
                            </DialogDescription>
                            <TextField
                                startIcon={
                                    <div className='relative size-6 overflow-hidden rounded-xl' style={{ background: color }}>
                                        <input
                                            type='color'
                                            value={color}
                                            onChange={e => setColor(e.target.value)}
                                            className='absolute inset-0 h-full w-full cursor-pointer opacity-0'
                                        />
                                    </div>
                                }
                                value={color}
                                onChange={e => setColor(e.target.value)}
                                label='Theme color'
                            />
                            <div className='flex gap-2'>
                                <Chip className='pl-2' onClick={() => setColor('#B33B15')}>
                                    <span className='size-4 rounded-full bg-[#B33B15]' />
                                    Red
                                </Chip>
                                <Chip className='pl-2' onClick={() => setColor('#63A002')}>
                                    <span className='size-4 rounded-full bg-[#63A002]' />
                                    Green
                                </Chip>
                                <Chip className='pl-2' onClick={() => setColor('#769CDF')}>
                                    <span className='size-4 rounded-full bg-[#769CDF]' />
                                    Blue
                                </Chip>
                                <Chip className='pl-2' onClick={() => setColor('#FFDE3F')}>
                                    <span className='size-4 rounded-full bg-[#FFDE3F]' />
                                    Yellow
                                </Chip>
                            </div>
                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button onClick={handleApplyTheme}>Apply</Button>
                                </DialogClose>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </ButtonGroup>
            </div>
            <div className='h-[80vh] w-full overflow-hidden rounded-3xl border-4'>
                {example === 'chat' && <ChatExample />}
                {example === 'auth' && <AuthExample />}
            </div>
        </div>
    )
}
