import Examples from '@/components/home/examples'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default async function Home() {
    return (
        <div className='flex h-screen w-full flex-col overflow-auto rounded-l-3xl bg-surface pb-12'>
            <div className='flex flex-col items-center gap-2 py-8 md:py-16 lg:gap-4 lg:py-20'>
                <h1 className='text-5xl font-bold'>Material You Tailwind</h1>
                <p className='text-center text-xl'>A set of Material Designed 3 Expressive components and Color System. Open Source.</p>
                <div className='flex gap-2'>
                    <Button>Get Started</Button>
                    <Button variant='text' asChild>
                        <Link href={'/components'}>View Component</Link>
                    </Button>
                </div>
            </div>
            <Examples />
        </div>
    )
}
