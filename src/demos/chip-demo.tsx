'use client'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Chip } from '@/components/ui/chip'
import { useState } from 'react'

export function ChipDemo() {
    const [selected, setSelected] = useState(true)

    return (
        <div className='flex flex-col gap-4'>
            <h3>Chip</h3>
            <div className='mb-6 flex flex-wrap items-center gap-4'>
                <Chip variant='assist' leadingIcon={<i className='icon-[material-symbols--favorite-outline-rounded]' />}>
                    Assist Chip
                </Chip>
                <Chip
                    variant='assist'
                    leadingIcon={<i className='icon-[material-symbols--favorite-outline-rounded]' />}
                    elevated
                >
                    Assist Chip
                </Chip>
                <Chip variant='filter' selected={selected} onClick={() => setSelected(prev => !prev)}>
                    Filter chip
                </Chip>
                <Chip variant='input'>Input chip</Chip>
                <Chip
                    variant='input'
                    leadingIcon={
                        <Avatar>
                            <AvatarFallback>A</AvatarFallback>
                        </Avatar>
                    }
                >
                    Input chip
                </Chip>
                <Chip variant='suggestion'>Suggestion chip</Chip>
            </div>
        </div>
    )
}
