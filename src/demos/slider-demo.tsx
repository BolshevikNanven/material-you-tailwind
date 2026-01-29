import { Slider } from '@/components/ui/slider'

export function SliderDemo() {
    return (
        <div className='flex flex-wrap items-center gap-4'>
            <Slider className='w-48' defaultValue={[0.5]} />
        </div>
    )
}
