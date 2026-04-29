import { Slider } from '@/components/ui/slider'

export function SliderIconDemo() {
    return (
        <div className='w-full max-w-md'>
            <Slider
                defaultValue={[55]}
                icon={<i className='icon-[material-symbols--volume-up-outline-rounded] size-full' />}
                size='xlarge'
            />
        </div>
    )
}
