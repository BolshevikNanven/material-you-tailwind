'use client'

import { useTheme } from '@/context/theme'
import Image from 'next/image'

export default function BlockThumbnail({ slug, loading }: { slug: string; loading?: 'eager' | 'lazy' }) {
    const { theme } = useTheme()

    return (
        <Image
            src={`/blocks/previews/${slug}-${theme}.webp`}
            alt=''
            width={1280}
            height={800}
            loading={loading}
            unoptimized
            className='h-auto w-full rounded-xl bg-surface-container'
        />
    )
}
