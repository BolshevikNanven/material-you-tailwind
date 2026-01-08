import { Slider } from '../components/ui/slider'

export function SliderDemo() {
    return (
        <div className='flex flex-col gap-4'>
            <h3>Slider</h3>
            <div className='mb-6 flex flex-wrap items-center gap-4'>
                <Slider className='w-48' defaultValue={[0.5]} />
                <Slider orientation='vertical' />
            </div>
        </div>
    )
}