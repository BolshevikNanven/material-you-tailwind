import { Card, CardContent, CardFooter, CardImage } from '../components/ui/card'
import { Button } from '../components/ui/button'
import pic2 from '@/assets/pic2.png'

export function CardDemo() {
    return (
        <div className='flex flex-col gap-4'>
            <h3>Card</h3>
            <div className='mb-6 flex flex-wrap gap-4'>
                <Card variant='elevated' className='w-100'>
                    <CardImage>
                        <img src={pic2} className='h-48 w-full bg-cover' />
                    </CardImage>
                    <CardContent>
                        <h3 className='text-xl'>Glass Souls' World Tour</h3>
                        <p className='text-sm text-on-surface-variant'>From your recent favorites</p>
                    </CardContent>
                    <CardFooter>
                        <Button>Buy tickets</Button>
                    </CardFooter>
                </Card>
                <Card variant='outlined' actionable className='w-100'>
                    <CardImage>
                        <img src={pic2} className='h-48 w-full bg-cover' />
                    </CardImage>
                    <CardContent>
                        <h3 className='text-xl'>Glass Souls' World Tour</h3>
                        <p className='text-sm text-on-surface-variant'>From your recent favorites</p>
                    </CardContent>
                    <CardFooter>
                        <Button>Buy tickets</Button>
                    </CardFooter>
                </Card>
                <Card variant='filled' actionable className='w-100'>
                    <CardImage>
                        <img src={pic2} className='h-48 w-full bg-cover' />
                    </CardImage>
                    <CardContent>
                        <h3 className='text-xl'>Glass Souls' World Tour</h3>
                        <p className='text-sm text-on-surface-variant'>From your recent favorites</p>
                    </CardContent>
                    <CardFooter>
                        <Button>Buy tickets</Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    )
}