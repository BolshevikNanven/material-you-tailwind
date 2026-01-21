import { Button } from '@/components/ui/button'

export default function Home() {
    return (
        <div className='flex h-screen w-full flex-col overflow-hidden rounded-l-3xl bg-surface'>
            <div className='flex flex-col items-center gap-2 py-8 md:py-16 lg:gap-4 lg:py-20'>
                <h1 className='text-5xl font-bold'>Material You Tailwind</h1>
                <p className='text-center text-xl'>A set of Material Designed 3 Expressive components. Open Source.</p>
                <div className='flex gap-2'>
                    <Button>Get Started</Button>
                    <Button variant='outline'>View Components</Button>
                </div>
            </div>
            <div className='flex flex-col'>

                <div className=''></div>
            </div>
        </div>
    )
}
