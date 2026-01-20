import { cn } from '@/lib/utils'
import { cva } from 'class-variance-authority'

function NavigationBarItem({
    active,
    icon,
    className,
    children,
}: React.ComponentProps<'div'> & { icon: React.ReactNode; active?: boolean }) {
    return (
        <div
            data-slot='nav-bar-item'
            data-active={!!active}
            className={cn(
                'relative flex cursor-pointer items-center justify-center gap-1 text-xs text-on-surface-variant transition-colors select-none',
                className,
            )}
        >
            <span
                data-slot='nav-bar-item-layer'
                className={cn(
                    'absolute rounded-full bg-secondary-container transition-all',
                    active ? 'scale-x-100' : 'scale-x-0',
                )}
            />
            <span
                data-slot='nav-bar-item-icon'
                className={cn('flex items-center justify-center text-on-secondary-container transition-colors *:[i]:size-6')}
            >
                {icon}
            </span>
            <div className='z-10'>{children}</div>
        </div>
    )
}

const contentVariants = cva('flex h-full items-center justify-center', {
    variants: {
        horizon: {
            true: [
                'mx-auto w-fit',
                '**:data-[slot=nav-bar-item]:mx-5 **:data-[slot=nav-bar-item]:h-10 **:data-[slot=nav-bar-item]:rounded-full **:data-[slot=nav-bar-item]:px-4',
                '**:data-[slot=nav-bar-item]:hover:bg-on-secondary-container/8 **:data-[slot=nav-bar-item]:active:bg-on-secondary-container/10',
                '**:data-[slot=nav-bar-item-layer]:inset-0',
            ],
            false: [
                'w-full',
                '**:data-[slot=nav-bar-item]:h-full **:data-[slot=nav-bar-item]:w-full **:data-[slot=nav-bar-item]:flex-col',
                '**:data-[slot=nav-bar-item-icon]:h-8 **:data-[slot=nav-bar-item-icon]:w-14 **:data-[slot=nav-bar-item-icon]:rounded-2xl',
                '**:data-[slot=nav-bar-item-layer]:top-0 **:data-[slot=nav-bar-item-layer]:h-8 **:data-[slot=nav-bar-item-layer]:w-14',
                '**:data-[slot=nav-bar-item]:hover:*:data-[slot=nav-bar-item-icon]:bg-on-secondary-container/8 **:data-[slot=nav-bar-item]:active:*:data-[slot=nav-bar-item-icon]:bg-on-secondary-container/10',
            ],
        },
    },
    defaultVariants: {
        horizon: false,
    },
})
function NavigationBar({ wide, className, children }: React.ComponentProps<'div'> & { wide?: boolean }) {
    return (
        <div data-slot='navigation-bar' data-state={!!wide} className={cn('h-16 bg-surface-container py-1.5', className)}>
            <div className={cn(contentVariants({ horizon: !!wide, className }))}>{children}</div>
        </div>
    )
}

export { NavigationBar, NavigationBarItem }
