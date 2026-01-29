import { Button } from '@/components/ui/button'

export function ButtonDemo() {
    return (
        <div className='flex flex-wrap items-center gap-4'>
            <Button size='lg' square>
                <i className='icon-[material-symbols--stars-outline-rounded]' />
                Label
            </Button>
            <Button variant='tonal'>
                <i className='icon-[material-symbols--stars-outline-rounded]' />
                Label
            </Button>
            <Button variant='outline'>
                <i className='icon-[material-symbols--stars-outline-rounded]' />
                Label
            </Button>
            <Button variant='elevated'>
                <i className='icon-[material-symbols--stars-outline-rounded]' />
                Label
            </Button>
            <Button variant='text'>
                <i className='icon-[material-symbols--stars-outline-rounded]' />
                Label
            </Button>
            <Button disabled>
                <i className='icon-[material-symbols--stars-outline-rounded]' />
                Label
            </Button>
        </div>
    )
}
