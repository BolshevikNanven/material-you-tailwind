import { Button } from '../components/ui/button'

export function ButtonDemo() {
    return (
        <div className='flex flex-col gap-4'>
            <h3>Button</h3>
            <div className='mb-6 flex flex-wrap items-center gap-4'>
                <Button size='lg' square>
                    <i className='icon-[material-symbols--stars-outline-rounded]' />
                    Label
                </Button>
                <Button size='lg'>
                    <i className='icon-[material-symbols--stars-outline-rounded]' />
                </Button>
                <Button size='sm'>
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
                <Button variant='outline' icon>
                    <i className='icon-[material-symbols--stars-outline-rounded]' />
                </Button>
                <Button variant='elevated'>
                    <i className='icon-[material-symbols--stars-outline-rounded]' />
                    Label
                </Button>
                <Button size='sm' icon variant='elevated'>
                    <i className='icon-[material-symbols--stars-outline-rounded]' />
                </Button>
                <Button variant='text'>
                    <i className='icon-[material-symbols--stars-outline-rounded]' />
                    Label
                </Button>
                <Button size='sm' variant='text' icon>
                    <i className='icon-[material-symbols--more-vert]' />
                </Button>
                <Button disabled>
                    <i className='icon-[material-symbols--stars-outline-rounded]' />
                    Label
                </Button>
            </div>
        </div>
    )
}
