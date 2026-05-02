import { Button } from '@/components/ui/button'
import {
    Popover,
    PopoverContent,
    PopoverDescription,
    PopoverHeader,
    PopoverTitle,
    PopoverTrigger,
} from '@/components/ui/popover'

export function PopoverDemo() {
    return (
        <div className='flex flex-wrap items-center gap-4'>
            <Popover>
                <PopoverTrigger asChild>
                    <Button size='sm' variant='outline'>
                        Open Popover
                    </Button>
                </PopoverTrigger>
                <PopoverContent align='start'>
                    <PopoverHeader>
                        <PopoverTitle>Notifications</PopoverTitle>
                        <PopoverDescription>Manage how you receive activity updates.</PopoverDescription>
                    </PopoverHeader>
                </PopoverContent>
            </Popover>
        </div>
    )
}
