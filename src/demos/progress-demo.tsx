import { Progress } from '@/components/ui/progress'
import { useEffect, useState } from 'react'

export function ProgressDemo() {
    const [value, setValue] = useState(90)

    useEffect(() => {
        setInterval(() => {
            setValue(prev => (prev + 0.5) % 101)
        }, 200)
    }, [])

    return (
        <div className='flex flex-col gap-4'>
            <h3>Progress</h3>
            <div className='mb-6 flex flex-wrap items-center gap-8'>
                <div className='flex gap-8'>
                    <Progress wave variant='circle' value={value} />
                    <Progress variant='circle' value={value} />
                </div>
                <Progress wave value={value} />
                <Progress value={value} />
            </div>
        </div>
    )
}
