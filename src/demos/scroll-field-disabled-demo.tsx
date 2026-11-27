import { ScrollField } from '@/components/ui/scroll-field'

export function ScrollFieldDisabledDemo() {
    return <ScrollField aria-label='Select minutes' min={0} max={59} defaultValue={15} disabled />
}
