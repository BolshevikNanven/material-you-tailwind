import { Slider } from '@/components/ui/slider'

export function SliderDisabledDemo() {
    return (
        <div className='grid w-full max-w-md gap-5'>
            <Slider defaultValue={[60]} disabled />
            <Slider defaultValue={[25, 75]} disabled size='medium' />
        </div>
    )
}
