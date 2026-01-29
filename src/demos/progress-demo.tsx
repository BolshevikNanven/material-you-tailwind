'use client'

import { Progress } from '@/components/ui/progress'
import { useEffect, useState } from 'react'

export function ProgressDemo() {
    const [value, setValue] = useState(90)

    useEffect(() => {
        setInterval(() => {
            setValue(prev => (prev + 0.5) % 100)
        }, 200)
    }, [])

    return (
        <div className='flex w-full flex-wrap items-center gap-8'>
            <div className='flex gap-8'>
                <Progress wave variant='circle' value={value} stroke={6} />
                <Progress variant='circle' value={value} />
            </div>
            <Progress wave value={value} stroke={6} />
            <Progress value={value} stroke={6} />
        </div>
    )
}
