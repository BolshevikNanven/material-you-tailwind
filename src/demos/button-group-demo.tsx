import { AlarmClock, Bluetooth, Link2, Play, StepBack, StepForward, Wifi } from 'lucide-react'
import { Toggle } from '../components/ui/toggle'
import { ButtonGroup } from '@/components/ui/button-group'
import { Button } from '@/components/ui/button'

export function ButtonGroupDemo() {
    return (
        <div className='flex flex-col gap-4'>
            <h3>ButtonGroup</h3>
            <div className='mb-6 flex flex-wrap items-center gap-8'>
                <ButtonGroup>
                    <Toggle>
                        <Wifi />
                    </Toggle>
                    <Toggle>
                        <Bluetooth />
                    </Toggle>
                    <Toggle>
                        <AlarmClock />
                    </Toggle>
                    <Toggle>
                        <Link2 />
                    </Toggle>
                </ButtonGroup>
                <ButtonGroup>
                    <Button size='sm'>
                        <StepBack />
                    </Button>
                    <Button size='sm'>
                        <Play />
                        Play
                    </Button>
                    <Button size='sm'>
                        <StepForward />
                    </Button>
                </ButtonGroup>
                <ButtonGroup variant='connected'>
                    <Toggle variant='tonal'>
                        <Wifi />
                        WLan
                    </Toggle>
                    <Toggle variant='tonal'>
                        <Bluetooth />
                        Bluetooth
                    </Toggle>
                    <Toggle variant='tonal'>
                        <AlarmClock />
                        Alarm
                    </Toggle>
                    <Toggle variant='tonal'>
                        <Link2 />
                        Link
                    </Toggle>
                </ButtonGroup>
            </div>
        </div>
    )
}
