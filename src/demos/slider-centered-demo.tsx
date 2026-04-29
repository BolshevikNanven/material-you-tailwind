import { Slider } from '@/components/ui/slider'

export function SliderCenteredDemo() {
    return (
        <div className='grid w-full max-w-md gap-5'>
            <Slider defaultValue={[-40]} min={-100} max={100} size='medium' variant='centered' />
            <Slider defaultValue={[35]} min={-100} max={100} size='medium' variant='centered' />
        </div>
    )
}
