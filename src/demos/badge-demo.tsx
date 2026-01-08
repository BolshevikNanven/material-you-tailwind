import { Badge } from '../components/ui/badge'

export function BadgeDemo() {
    return (
        <>
            <h3>Badge</h3>
            <div className='mb-6 flex flex-wrap items-center gap-4'>
                <Badge>334324</Badge>
                <Badge size='sm' />
            </div>
        </>
    )
}