import { Toggle } from '../components/ui/toggle'

export function ToggleDemo() {
    return (
        <div className='flex flex-col gap-4'>
            <h3>Toggle</h3>
            <div className='mb-6 flex flex-wrap items-center gap-4'>
                <Toggle size='lg' square>
                    <i className='icon-[material-symbols--stars-outline-rounded]' />
                    Label
                </Toggle>
                <Toggle>
                    <i className='icon-[material-symbols--stars-outline-rounded]' />
                    Label
                </Toggle>
                <Toggle size='sm'>
                    <i className='icon-[material-symbols--stars-outline-rounded]' />
                    Label
                </Toggle>
                <Toggle variant='tonal'>
                    <i className='icon-[material-symbols--stars-outline-rounded]' />
                    Label
                </Toggle>
                <Toggle variant='outline'>
                    <i className='icon-[material-symbols--stars-outline-rounded]' />
                    Label
                </Toggle>
                <Toggle variant='elevated'>
                    <i className='icon-[material-symbols--stars-outline-rounded]' />
                    Label
                </Toggle>
                <Toggle icon>
                    <i className='icon-[material-symbols--stars-outline-rounded]' />
                </Toggle>
            </div>
        </div>
    )
}
