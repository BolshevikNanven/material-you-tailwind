import { Carousel, CarouselItem, CarouselItemLabel } from '@/components/ui/carousel'

// Widths range from 9:16 to 16:9 for a 184px tall item
const photos = [
    { label: 'Mountains', width: 327 },
    { label: 'Waterfall', width: 104 },
    { label: 'Santorini', width: 184 },
    { label: 'Canals', width: 138 },
    { label: 'Sunset', width: 327 },
    { label: 'Coastline', width: 184 },
    { label: 'Streets', width: 245 },
    { label: 'Cabin', width: 104 },
]

export function CarouselMultiAspectDemo() {
    return (
        <div className='w-full max-w-xl'>
            <Carousel layout='uncontained'>
                {photos.map(({ label, width }) => (
                    <CarouselItem key={label} width={width}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={`/carousel/${label.toLowerCase()}.jpg`} alt={label} className='size-full object-cover' />
                        <CarouselItemLabel className='text-white [text-shadow:0_1px_4px_rgb(0_0_0/0.6)]'>{label}</CarouselItemLabel>
                    </CarouselItem>
                ))}
            </Carousel>
        </div>
    )
}
