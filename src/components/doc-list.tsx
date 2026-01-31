'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

export default function DocList({ data }: { data: { title: string; href: string }[] }) {
    const pathname = usePathname()

    return (
        <div className='flex w-full flex-col gap-1'>
            {data.map(item => {
                const isActive = pathname === item.href
                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                            'flex w-full items-center gap-2 rounded-full px-5 py-3 text-sm transition-all',
                            isActive
                                ? 'bg-secondary-container font-semibold text-on-secondary-container'
                                : 'text-on-surface hover:bg-surface-container-high',
                        )}
                    >
                        <span>{item.title}</span>
                    </Link>
                )
            })}
        </div>
    )
}
