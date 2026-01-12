import type { Metadata } from 'next'
import './globals.css'
import { Snakebar } from '@/components/ui/snakebar'

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
            <body>
                <Snakebar />
                {children}
            </body>
        </html>
    )
}
