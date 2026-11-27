import type { Metadata } from 'next'
import './globals.css'

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
            <body suppressHydrationWarning className='flex h-screen w-screen overflow-hidden'>{children}</body>
        </html>
    )
}
