import { Slider } from '@/components/ui/slider'

export function SliderVerticalDemo() {
    return (
        <div className='flex h-64 items-center gap-6'>
            <Slider className='h-56' defaultValue={[50]} orientation='vertical' size='small' />
            <Slider className='h-56' defaultValue={[30, 75]} orientation='vertical' showStops size='medium' />
            <Slider
                className='h-56'
                defaultValue={[-30]}
                min={-100}
                max={100}
                orientation='vertical'
                size='large'
                variant='centered'
            />
        </div>
    )
}
