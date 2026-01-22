import type { Metadata } from 'next'
import './globals.css'
import { Snakebar } from '@/components/ui/snakebar'
import Navigation from '@/components/navigation'
import { Suspense } from 'react'
import RootLoading from './loading'

export const metadata: Metadata = {
    title: 'Material You Tailwind',
    description: 'Material Design 3 Expressive in Tailwind CSS',
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang='en'>
            <body className='flex h-screen w-screen overflow-hidden'>
                <Snakebar />
                <Navigation />
                {children}
            </body>
        </html>
    )
}
