import { ScrollField, ScrollFieldGroup } from '@/components/ui/scroll-field'

export function ScrollFieldUnitDemo() {
    return (
        <ScrollFieldGroup aria-label='Select amount'>
            <ScrollField aria-label='Select amount' className='w-[120px]' min={0.1} max={10} step={0.1} defaultValue={2.7} />
            <ScrollField aria-label='Select unit' className='w-[120px]' options={['oz', 'L']} defaultValue='L' loop={false} />
        </ScrollFieldGroup>
    )
}
