import { Carousel, CarouselItem, CarouselItemLabel } from '@/components/ui/carousel'

const photos = ['Mountains', 'Waterfall', 'Santorini', 'Canals', 'Sunset', 'Coastline', 'Streets', 'Cabin']

export function CarouselFullScreenDemo() {
    return (
        <div className='w-full max-w-xs'>
            <Carousel layout='full-screen'>
                {photos.map(photo => (
                    <CarouselItem key={photo}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={`/carousel/${photo.toLowerCase()}.jpg`} alt={photo} className='size-full object-cover' />
                        <CarouselItemLabel className='text-white [text-shadow:0_1px_4px_rgb(0_0_0/0.6)]'>{photo}</CarouselItemLabel>
                    </CarouselItem>
                ))}
            </Carousel>
        </div>
    )
}
