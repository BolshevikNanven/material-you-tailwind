import { Loading } from '@/components/ui/loading'

export function LoadingDemo() {
    return (
        <div className='flex flex-col gap-4'>
            <h3>Loading</h3>
            <div className='mb-6 flex flex-wrap items-center gap-4'>
                <Loading className='size-16' />
                <Loading className='size-16' contained/>
            </div>
        </div>
    )
}
