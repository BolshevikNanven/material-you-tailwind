import { Slider } from '../components/ui/slider'

export function SliderDemo() {
    return (
        <>
            <h3>Slider</h3>
            <div className='mb-6 flex flex-wrap items-center gap-4'>
                <Slider className='w-48' />
                <Slider orientation='vertical' />
            </div>
        </>
    )
}