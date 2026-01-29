import { Loading } from '@/components/ui/loading'

export function LoadingDemo() {
    return (
        <div className='flex flex-wrap items-center gap-4'>
            <Loading className='size-16' />
            <Loading className='size-16' contained />
        </div>
    )
}
