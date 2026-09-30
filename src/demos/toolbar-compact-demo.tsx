import { ToolbarCallDemo, ToolbarFormattingDemo } from './toolbar-demo'

export function ToolbarCompactDemo() {
    return (
        <div className='flex w-full flex-col gap-8 overflow-x-auto p-3'>
            <div className='flex flex-wrap items-center justify-center gap-6'>
                <ToolbarFormattingDemo />
                <ToolbarFormattingDemo compact />
            </div>
            <div className='flex flex-wrap items-center justify-center gap-6'>
                <ToolbarCallDemo />
                <ToolbarCallDemo compact />
            </div>
        </div>
    )
}
