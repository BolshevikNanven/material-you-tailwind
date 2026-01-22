'use client'

import ChatExample from '@/components/examples/chat'
import { ButtonGroup } from '@/components/ui/button-group'
import { Toggle } from '@/components/ui/toggle'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import AuthExample from '../examples/auth'

export default function Examples() {
    const [example, setExample] = useState('chat')

    return (
        <div className='mx-auto flex w-[80%] flex-col items-center gap-4'>
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
                    <Button size={'sm'} variant='tonal'>
                        <i className='icon-[material-symbols--content-copy-outline-rounded]' />
                        Theme
                    </Button>
                    <Button size={'sm'} variant='tonal' className='px-2'>
                        <i className='icon-[material-symbols--arrow-drop-down-rounded]' />
                    </Button>
                </ButtonGroup>
            </div>
            <div className='h-[80vh] w-full overflow-hidden rounded-3xl border-4'>
                {example === 'chat' && <ChatExample />}
                {example === 'auth' && <AuthExample />}
            </div>
        </div>
    )
}
