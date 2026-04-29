import { Slider } from '@/components/ui/slider'

export function SliderDiscreteDemo() {
    return (
        <div className='w-full max-w-md'>
            <Slider defaultValue={[40]} showStops size='small' step={10} />
        </div>
    )
}
