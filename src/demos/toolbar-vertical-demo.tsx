import { Toggle } from '@/components/ui/toggle'
import { Toolbar, ToolbarItem } from '@/components/ui/toolbar'

export function ToolbarVerticalDemo() {
    return (
        <div className='flex max-w-full flex-wrap items-start justify-center gap-8'>
            {(['vertical', 'horizontal'] as const).map(orientation => (
                <Toolbar key={orientation} orientation={orientation}>
                    <ToolbarItem asChild>
                        <Toggle icon variant='tonal' defaultPressed>
                            <i className='icon-[material-symbols--format-bold-rounded]' />
                        </Toggle>
                    </ToolbarItem>
                    <ToolbarItem asChild>
                        <Toggle icon variant='tonal'>
                            <i className='icon-[material-symbols--format-italic-rounded]' />
                        </Toggle>
                    </ToolbarItem>
                    <ToolbarItem asChild>
                        <Toggle icon variant='tonal'>
                            <i className='icon-[material-symbols--format-underlined-rounded]' />
                        </Toggle>
                    </ToolbarItem>
                    <ToolbarItem>
                        <i className='icon-[material-symbols--format-color-text-rounded]' />
                    </ToolbarItem>
                    <ToolbarItem>
                        <i className='icon-[material-symbols--format-color-fill-rounded]' />
                    </ToolbarItem>
                </Toolbar>
            ))}
        </div>
    )
}
