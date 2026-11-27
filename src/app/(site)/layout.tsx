import Navigation from '@/components/navigation'
import { Snakebar } from '@/components/ui/snakebar'
import { ThemeProvider } from '@/context/theme'

export default function SiteLayout({ children }: { children: React.ReactNode }) {
    return (
        <ThemeProvider>
            <Snakebar />
            <Navigation />
            {children}
        </ThemeProvider>
    )
}
