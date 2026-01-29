import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

export function TooltipDemo() {
    return (
        <div className='flex flex-wrap items-center gap-4'>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button size={'sm'} variant='outline'>
                        Hover Me
                    </Button>
                </TooltipTrigger>
                <TooltipContent>
                    <p>Add to library</p>
                </TooltipContent>
            </Tooltip>
        </div>
    )
}
