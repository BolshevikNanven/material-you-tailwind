import { Ripple } from '@/components/ui/ripple'

export function RippleDemo() {
    return (
        <div className='flex gap-4'>
            <div className='relative flex h-32 w-full items-center justify-center overflow-hidden rounded-2xl bg-surface-container p-6 hover:cursor-pointer'>
                <p className='text-on-surface'>Click or Touch Me</p>
                <Ripple />
            </div>
            <div className='relative flex h-32 w-full items-center justify-center overflow-hidden rounded-2xl bg-primary p-6 text-on-primary hover:cursor-pointer'>
                <p>Primary Color</p>
                <Ripple className='text-on-primary' opacity={0.24} />
            </div>
        </div>
    )
}
