import { Toggle } from '@/components/ui/toggle'
import { ButtonGroup } from '@/components/ui/button-group'
import { Button } from '@/components/ui/button'

export function ButtonGroupDemo() {
    return (
        <div className='flex flex-wrap items-center gap-8'>
            <ButtonGroup>
                <Toggle>
                    <i className='icon-[material-symbols--android-wifi-3-bar-rounded]' />
                </Toggle>
                <Toggle>
                    <i className='icon-[material-symbols--bluetooth-rounded]' />
                </Toggle>
                <Toggle>
                    <i className='icon-[material-symbols--alarm-outline-rounded]' />
                </Toggle>
                <Toggle>
                    <i className='icon-[material-symbols--link-rounded]' />
                </Toggle>
            </ButtonGroup>
            <ButtonGroup>
                <Button size='sm'>
                    <i className='icon-[material-symbols--skip-previous-rounded]' />
                </Button>
                <Button size='sm'>
                    <i className='icon-[material-symbols--play-arrow-rounded]' />
                    Play
                </Button>
                <Button size='sm'>
                    <i className='icon-[material-symbols--skip-next-rounded]' />
                </Button>
            </ButtonGroup>
            <ButtonGroup variant='connected'>
                <Toggle variant='tonal'>
                    <i className='icon-[material-symbols--android-wifi-3-bar-rounded]' />
                    WLan
                </Toggle>
                <Toggle variant='tonal'>
                    <i className='icon-[material-symbols--bluetooth-rounded]' />
                    Bluetooth
                </Toggle>
                <Toggle variant='tonal'>
                    <i className='icon-[material-symbols--alarm-outline-rounded]' />
                    Alarm
                </Toggle>
                <Toggle variant='tonal'>
                    <i className='icon-[material-symbols--link-rounded]' />
                    Link
                </Toggle>
            </ButtonGroup>
        </div>
    )
}
