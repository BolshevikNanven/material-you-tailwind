'use client'

import { Button } from '@/components/ui/button'
import { Carousel, CarouselItem, CarouselItemLabel } from '@/components/ui/carousel'

const photos = ['Mountains', 'Waterfall', 'Santorini', 'Canals', 'Sunset', 'Coastline', 'Streets', 'Cabin']

export function CarouselDemo() {
    return (
        <div className='flex w-full max-w-xl flex-col'>
            <Carousel>
                {photos.map(photo => (
                    <CarouselItem key={photo} onClick={() => {}}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={`/carousel/${photo.toLowerCase()}.jpg`} alt={photo} className='size-full object-cover' />
                        <CarouselItemLabel className='text-white [text-shadow:0_1px_4px_rgb(0_0_0/0.6)]'>{photo}</CarouselItemLabel>
                    </CarouselItem>
                ))}
            </Carousel>
            <Button variant='text' size='sm' className='mr-2 self-end'>
                Show all
            </Button>
        </div>
    )
}
