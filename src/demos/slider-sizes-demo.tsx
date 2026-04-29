import { Slider } from '@/components/ui/slider'

export function SliderSizesDemo() {
    return (
        <div className='grid w-full max-w-md gap-5'>
            <Slider defaultValue={[50]} size='xsmall' />
            <Slider defaultValue={[50]} size='small' />
            <Slider defaultValue={[50]} size='medium' />
            <Slider defaultValue={[50]} size='large' />
            <Slider defaultValue={[50]} size='xlarge' />
        </div>
    )
}
