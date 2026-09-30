import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'
import { Ripple } from './ripple'

const toolbarItemStyles = [
    '[&_[data-slot=toolbar-item]>*]:relative [&_[data-slot=toolbar-item]>*]:inline-flex [&_[data-slot=toolbar-item]>*]:h-10 [&_[data-slot=toolbar-item]>*]:shrink-0 [&_[data-slot=toolbar-item]>*]:items-center [&_[data-slot=toolbar-item]>*]:justify-center [&_[data-slot=toolbar-item]>*]:rounded-full [&_[data-slot=toolbar-item]>*]:border-0 [&_[data-slot=toolbar-item]>*]:py-0 [&_[data-slot=toolbar-item]>*]:shadow-none',
    '[&_[data-slot=toolbar-item]>[data-icon=true]]:w-10 [&_[data-slot=toolbar-item]>[data-icon=true]]:min-w-10 [&_[data-slot=toolbar-item]>[data-icon=true]]:px-0 [&_[data-slot=toolbar-item]>[data-slot=toolbar-button]]:w-10 [&_[data-slot=toolbar-item]>[data-slot=toolbar-button]]:min-w-10 [&_[data-slot=toolbar-item]>[data-slot=toolbar-button]]:px-0',
    '[&_[data-slot=toolbar-item]>*>i]:pointer-events-none [&_[data-slot=toolbar-item]>*>i]:size-6! [&_[data-slot=toolbar-item]>*>i]:shrink-0 [&_[data-slot=toolbar-item]>*>svg]:pointer-events-none [&_[data-slot=toolbar-item]>*>svg]:size-6! [&_[data-slot=toolbar-item]>*>svg]:shrink-0',
    '[&_[data-slot=toolbar-item]>*:not(:disabled)]:bg-transparent [&_[data-slot=toolbar-item]>*:not(:disabled)]:text-[var(--toolbar-foreground,var(--on-surface-variant))]',
    '[&_[data-slot=toolbar-item]>[data-slot=button][data-variant=default]:not(:disabled)]:bg-primary [&_[data-slot=toolbar-item]>[data-slot=button][data-variant=default]:not(:disabled)]:text-on-primary',
    '[&_[data-slot=toolbar-item]>[data-slot=button][data-variant=tonal]:not(:disabled)]:bg-[var(--toolbar-selected,var(--secondary-container))] [&_[data-slot=toolbar-item]>[data-slot=button][data-variant=tonal]:not(:disabled)]:text-[var(--toolbar-on-selected,var(--on-secondary-container))]',
    '[&_[data-slot=toolbar-item]>[data-slot=toggle][data-state=on]:not(:disabled)]:bg-[var(--toolbar-selected,var(--secondary-container))] [&_[data-slot=toolbar-item]>[data-slot=toggle][data-state=on]:not(:disabled)]:text-[var(--toolbar-on-selected,var(--on-secondary-container))]',
    '[&_[data-slot=toolbar-item]>[data-slot]:disabled]:bg-on-surface/10 [&_[data-slot=toolbar-item]>[data-slot]:disabled]:text-on-surface/38',
    '[&_[data-slot=toolbar-item]>*:focus-visible]:outline-2 [&_[data-slot=toolbar-item]>*:focus-visible]:outline-offset-2 [&_[data-slot=toolbar-item]>*:focus-visible]:outline-primary',
    // State layers follow the adapted foreground, including selected toggles.
    '[&_[data-slot=toolbar-item]>*>[data-slot$=-layer]]:pointer-events-none [&_[data-slot=toolbar-item]>*>[data-slot$=-layer]]:bg-current! [&_[data-slot=toolbar-item]>*>[data-slot$=-layer]]:opacity-0',
    '[&_[data-slot=toolbar-item]>*:active:not(:disabled)>[data-slot$=-layer]]:opacity-10 [&_[data-slot=toolbar-item]>*:hover:not(:active):not(:disabled)>[data-slot$=-layer]]:opacity-8',
]

const toolbarVariants = cva(['inline-flex shrink-0 items-center', toolbarItemStyles], {
    variants: {
        variant: {
            docked: 'h-16 w-full justify-between px-4',
            float: 'w-fit gap-1 rounded-full p-2 shadow-elevation-3',
        },
        color: {
            standard:
                'bg-surface-container [--toolbar-foreground:var(--on-surface-variant)] [--toolbar-on-selected:var(--on-secondary-container)] [--toolbar-selected:var(--secondary-container)]',
            vibrant:
                'bg-primary-container [--toolbar-foreground:var(--on-primary-container)] [--toolbar-on-selected:var(--on-surface)] [--toolbar-selected:var(--surface-container)]',
        },
        orientation: {
            horizontal: '',
            vertical: '',
        },
        compact: {
            true: '[&_[data-slot=toolbar-item]]:h-10 [&_[data-slot=toolbar-item]]:min-w-10 [&_[data-slot=toolbar-item]]:p-0',
            false: '',
        },
    },
    compoundVariants: [
        { variant: 'float', orientation: 'horizontal', className: 'h-16 flex-row' },
        { variant: 'float', orientation: 'vertical', className: 'h-fit min-h-16 w-16 flex-col' },
        {
            variant: 'float',
            orientation: 'horizontal',
            compact: true,
            className: 'h-14 gap-1 p-2',
        },
        {
            variant: 'float',
            orientation: 'vertical',
            compact: true,
            className: 'min-h-14 w-14 gap-1 p-2',
        },
        { variant: 'docked', compact: true, className: 'h-14 px-2' },
    ],
    defaultVariants: {
        variant: 'float',
        color: 'standard',
        orientation: 'horizontal',
        compact: false,
    },
})

function Toolbar({
    className,
    variant = 'float',
    color = 'standard',
    orientation = 'horizontal',
    compact = false,
    ...props
}: Omit<React.ComponentProps<'div'>, 'color'> & VariantProps<typeof toolbarVariants>) {
    const resolvedOrientation = variant === 'docked' ? 'horizontal' : orientation

    return (
        <div
            role='group'
            data-slot='toolbar'
            data-variant={variant}
            data-color={color}
            data-orientation={resolvedOrientation}
            data-compact={compact}
            className={cn(toolbarVariants({ variant, color, orientation: resolvedOrientation, compact }), className)}
            {...props}
        />
    )
}

function ToolbarItem({
    className,
    asChild = false,
    children,
    ...props
}: React.ComponentProps<'button'> & { asChild?: boolean }) {
    const Comp = asChild ? Slot : 'button'

    return (
        <div
            data-slot='toolbar-item'
            className='inline-flex h-12 min-w-12 shrink-0 items-center justify-center p-1'
        >
            <Comp
                {...(!asChild ? { type: 'button' as const, 'data-slot': 'toolbar-button' } : {})}
                className={cn(
                    'cursor-pointer text-sm font-medium whitespace-nowrap transition-all outline-none disabled:pointer-events-none disabled:bg-on-surface/10 disabled:text-on-surface/38',
                    className,
                )}
                {...props}
            >
                {asChild ? (
                    children
                ) : (
                    <>
                        {children}
                        <span data-slot='toolbar-button-layer' className='absolute inset-0 rounded-[inherit] transition-all' />
                        <Ripple disabled={props.disabled} />
                    </>
                )}
            </Comp>
        </div>
    )
}

export { Toolbar, ToolbarItem }
