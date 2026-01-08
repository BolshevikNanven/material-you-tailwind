import { Stars, MoreVertical } from 'lucide-react'
import { Button } from '../components/ui/button'

export function ButtonDemo() {
    return (
        <div className='flex flex-col gap-4'>
            <h3>Button</h3>
            <div className='mb-6 flex flex-wrap items-center gap-4'>
                <Button size='lg' square>
                    <Stars />
                    Label
                </Button>
                <Button>
                    <Stars />
                    Label
                </Button>
                <Button size='sm'>
                    <Stars />
                    Label
                </Button>
                <Button variant='tonal'>
                    <Stars />
                    Label
                </Button>
                <Button variant='outline'>
                    <Stars />
                    Label
                </Button>
                <Button variant='outline' icon>
                    <Stars />
                </Button>
                <Button variant='elevated'>
                    <Stars />
                    Label
                </Button>
                <Button size='sm' icon variant='elevated'>
                    <Stars />
                </Button>
                <Button variant='text'>
                    <Stars />
                    Label
                </Button>
                <Button size='sm' variant='text' icon>
                    <MoreVertical />
                </Button>
                <Button disabled>
                    <Stars />
                    Label
                </Button>
            </div>
        </div>
    )
}