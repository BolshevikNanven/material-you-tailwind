import { Slider } from '@/components/ui/slider'

export function SliderRangeDemo() {
    return (
        <div className='grid w-full max-w-md gap-5'>
            <Slider defaultValue={[25, 75]} minStepsBetweenThumbs={1} size='medium' />
            <Slider defaultValue={[30, 70]} minStepsBetweenThumbs={1} showStops size='small' step={10} />
        </div>
    )
}
