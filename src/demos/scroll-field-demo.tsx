import { ScrollField } from '@/components/ui/scroll-field'

export function ScrollFieldDemo() {
    return (
        <div className='flex flex-wrap items-center justify-center gap-4'>
            <ScrollField aria-label='Select minutes' size='small' min={0} max={59} defaultValue={30} />
            <ScrollField aria-label='Select weight in pounds' size='medium' min={50} max={400} defaultValue={165} />
            <ScrollField aria-label='Select year' size='large' min={1900} max={2100} defaultValue={2026} />
        </div>
    )
}
