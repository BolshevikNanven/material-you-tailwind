import { Stars } from 'lucide-react'
import { Button } from './components/ui/button'
import { Toggle } from './components/ui/toggle'
import { Checkbox } from './components/ui/checkbox'
import { Badge } from './components/ui/badge'
import { Card, CardContent, CardFooter, CardImage } from './components/ui/card'

import pic2 from '@/assets/pic2.png'
import { Slider } from './components/ui/slider'
import { Switch } from './components/ui/switch'
import { RadioGroup, RadioGroupItem } from './components/ui/radio-group'

export default function App() {
    return (
        <div className='h-screen overflow-hidden p-4'>
            <div className='flex h-full flex-col gap-2 overflow-auto rounded-3xl bg-surface p-6'>
                <h3>Button</h3>
                <div className='mb-6 flex flex-wrap items-center gap-4'>
                    <Button size='lg' square>
                        <Stars />
                        Label
                    </Button>
                    <Button>
                        <Stars />
                        Label
                    </Button>
                    <Button size='sm'>
                        <Stars />
                        Label
                    </Button>
                    <Button size='lg' variant='tonal'>
                        <Stars />
                        Label
                    </Button>
                    <Button variant='tonal'>
                        <Stars />
                        Label
                    </Button>
                    <Button size='sm' variant='tonal'>
                        <Stars />
                        Label
                    </Button>
                    <Button size='lg' variant='outline'>
                        <Stars />
                        Label
                    </Button>
                    <Button variant='outline'>
                        <Stars />
                        Label
                    </Button>
                    <Button size='sm' variant='outline'>
                        <Stars />
                        Label
                    </Button>
                    <Button size='lg' variant='elevated'>
                        <Stars />
                        Label
                    </Button>
                    <Button variant='elevated'>
                        <Stars />
                        Label
                    </Button>
                    <Button size='sm' variant='elevated'>
                        <Stars />
                        Label
                    </Button>
                    <Button size='lg' variant='text'>
                        <Stars />
                        Label
                    </Button>
                    <Button variant='text'>
                        <Stars />
                        Label
                    </Button>
                    <Button size='sm' variant='text'>
                        <Stars />
                        Label
                    </Button>
                    <Button disabled>
                        <Stars />
                        Label
                    </Button>
                </div>
                <h3>Toggle</h3>
                <div className='mb-6 flex flex-wrap items-center gap-4'>
                    <Toggle size='lg'>
                        <Stars />
                        Label
                    </Toggle>
                    <Toggle>
                        <Stars />
                        Label
                    </Toggle>
                    <Toggle size='sm'>
                        <Stars />
                        Label
                    </Toggle>
                    <Toggle size='lg' variant='tonal'>
                        <Stars />
                        Label
                    </Toggle>
                    <Toggle variant='tonal'>
                        <Stars />
                        Label
                    </Toggle>
                    <Toggle size='sm' variant='tonal'>
                        <Stars />
                        Label
                    </Toggle>
                    <Toggle size='lg' variant='outline'>
                        <Stars />
                        Label
                    </Toggle>
                    <Toggle variant='outline'>
                        <Stars />
                        Label
                    </Toggle>
                    <Toggle size='sm' variant='outline'>
                        <Stars />
                        Label
                    </Toggle>
                    <Toggle size='lg' variant='elevated'>
                        <Stars />
                        Label
                    </Toggle>
                    <Toggle variant='elevated'>
                        <Stars />
                        Label
                    </Toggle>
                    <Toggle size='sm' variant='elevated'>
                        <Stars />
                        Label
                    </Toggle>
                </div>
                <h3>Checkbox</h3>
                <div className='mb-6 flex flex-wrap items-center gap-4'>
                    <div className='flex items-center'>
                        <div className='flex items-center gap-3'>
                            <Checkbox id='terms' />
                            <label htmlFor='terms'>Accept terms and conditions</label>
                        </div>
                    </div>
                </div>
                <h3>Switch</h3>
                <div className='mb-6 flex flex-wrap items-center gap-4'>
                    <Switch />
                </div>
                <h3>Radio Group</h3>
                <div className='mb-6 flex flex-wrap items-center gap-4'>
                    <RadioGroup defaultValue='comfortable'>
                        <div className='flex items-center gap-3'>
                            <RadioGroupItem value='default' id='r1' />
                            <label htmlFor='r1'>Default</label>
                        </div>
                        <div className='flex items-center gap-3'>
                            <RadioGroupItem value='comfortable' id='r2' />
                            <label htmlFor='r2'>Comfortable</label>
                        </div>
                        <div className='flex items-center gap-3'>
                            <RadioGroupItem value='compact' id='r3' />
                            <label htmlFor='r3'>Compact</label>
                        </div>
                    </RadioGroup>
                </div>
                <h3>Slider</h3>
                <div className='mb-6 flex flex-wrap items-center gap-4'>
                    <Slider className='w-48' />
                    <Slider orientation='vertical' />
                </div>
                <h3>Badge</h3>
                <div className='mb-6 flex flex-wrap items-center gap-4'>
                    <Badge>334324</Badge>
                    <Badge size='sm' />
                </div>
                <h3>Card</h3>
                <div className='mb-6 flex flex-wrap gap-4'>
                    <Card variant='elevated' actionable className='flex-1'>
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
                    <Card variant='outlined' actionable className='flex-1'>
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
                    <Card variant='filled' actionable className='flex-1'>
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
        </div>
    )
}
