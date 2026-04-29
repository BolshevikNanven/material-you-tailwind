'use client'

import * as React from 'react'
import * as ContextMenuPrimitive from '@radix-ui/react-context-menu'

import { cn } from '@/lib/utils'
import { Ripple } from './ripple'

const ContextMenuCompactContext = React.createContext(false)

type ContextMenuContentProps = React.ComponentProps<typeof ContextMenuPrimitive.Content> & {
    compact?: boolean
}

function ContextMenu({ ...props }: React.ComponentProps<typeof ContextMenuPrimitive.Root>) {
    return <ContextMenuPrimitive.Root data-slot='context-menu' {...props} />
}

function ContextMenuTrigger({ ...props }: React.ComponentProps<typeof ContextMenuPrimitive.Trigger>) {
    return <ContextMenuPrimitive.Trigger data-slot='context-menu-trigger' {...props} />
}

function ContextMenuPortal({ ...props }: React.ComponentProps<typeof ContextMenuPrimitive.Portal>) {
    return <ContextMenuPrimitive.Portal data-slot='context-menu-portal' {...props} />
}

function ContextMenuSub({ ...props }: React.ComponentProps<typeof ContextMenuPrimitive.Sub>) {
    return <ContextMenuPrimitive.Sub data-slot='context-menu-sub' {...props} />
}

function ContextMenuRadioGroup({ className, ...props }: React.ComponentProps<typeof ContextMenuPrimitive.RadioGroup>) {
    const compact = React.useContext(ContextMenuCompactContext)

    return (
        <ContextMenuPrimitive.RadioGroup
            data-slot='context-menu-radio-group'
            data-compact={compact ? '' : undefined}
            className={cn('flex flex-col gap-0.5', compact && 'gap-px', className)}
            {...props}
        />
    )
}

function ContextMenuSubTrigger({
    className,
    inset,
    children,
    ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.SubTrigger> & {
    inset?: boolean
}) {
    const compact = React.useContext(ContextMenuCompactContext)

    return (
        <ContextMenuPrimitive.SubTrigger
            data-slot='context-menu-sub-trigger'
            data-inset={inset}
            data-compact={compact ? '' : undefined}
            className={cn(
                "[&_i:not([class*='text-'])]:text-on-surface-variant flex h-11 cursor-default items-center rounded-sm px-3 text-sm outline-hidden select-none hover:bg-on-surface/8 focus:bg-on-surface/8 data-[inset]:pl-10 data-[state=open]:bg-on-surface/8 [&_i]:pointer-events-none [&_i]:shrink-0 [&_i:not([class*='size-'])]:size-5",
                compact && "h-9 px-2 data-[inset]:pl-8 [&_i:not([class*='size-'])]:size-4",
                className,
            )}
            {...props}
        >
            {children}
            <i className='ml-auto icon-[material-symbols--chevron-right-rounded]' />
        </ContextMenuPrimitive.SubTrigger>
    )
}

function ContextMenuGroup({ className, children, ...props }: React.ComponentProps<typeof ContextMenuPrimitive.Group>) {
    const compact = React.useContext(ContextMenuCompactContext)

    return (
        <ContextMenuPrimitive.Group
            data-slot='context-menu-group'
            data-compact={compact ? '' : undefined}
            className={cn(
                'first:rounded-t-2xl last:rounded-b-2xl first:[&>div>*:first-child]:rounded-t-xl last:[&>div>*:last-child]:rounded-b-xl',
                'w-full overflow-hidden overflow-y-auto rounded-lg bg-surface-container-low p-1 shadow-elevation-3',
                compact &&
                    'rounded-md p-0.5 first:rounded-t-xl last:rounded-b-2xl first:[&>div>*:first-child]:rounded-t-lg last:[&>div>*:last-child]:rounded-b-lg',
                className,
            )}
            {...props}
        >
            <div className={cn('flex w-full flex-col gap-0.5 overflow-hidden rounded-sm', compact && 'gap-px')}>
                {children}
            </div>
        </ContextMenuPrimitive.Group>
    )
}
function ContextMenuSubContent({ className, ...props }: React.ComponentProps<typeof ContextMenuPrimitive.SubContent>) {
    const compact = React.useContext(ContextMenuCompactContext)

    return (
        <ContextMenuPrimitive.SubContent
            data-slot='context-menu-sub-content'
            data-compact={compact ? '' : undefined}
            className={cn(
                'z-50 flex min-w-32 origin-(--radix-context-menu-content-transform-origin) flex-col gap-0.5 rounded-2xl data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95',
                compact && 'min-w-28 gap-px rounded-xl',
                className,
            )}
            {...props}
        />
    )
}

function ContextMenuContent({ className, compact = false, ...props }: ContextMenuContentProps) {
    return (
        <ContextMenuPrimitive.Portal>
            <ContextMenuCompactContext.Provider value={compact}>
                <ContextMenuPrimitive.Content
                    data-slot='context-menu-content'
                    data-compact={compact ? '' : undefined}
                    className={cn(
                        'z-50 flex max-h-(--radix-context-menu-content-available-height) min-w-32 origin-(--radix-context-menu-content-transform-origin) flex-col gap-0.5 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95',
                        compact && 'min-w-28 gap-px',
                        className,
                    )}
                    {...props}
                />
            </ContextMenuCompactContext.Provider>
        </ContextMenuPrimitive.Portal>
    )
}

function ContextMenuItem({
    className,
    inset,
    children,
    ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Item> & {
    inset?: boolean
}) {
    const compact = React.useContext(ContextMenuCompactContext)

    return (
        <ContextMenuPrimitive.Item
            data-slot='context-menu-item'
            data-inset={inset}
            data-compact={compact ? '' : undefined}
            className={cn(
                "relative flex h-11 cursor-default items-center gap-2 overflow-hidden rounded-sm px-3 text-sm outline-hidden transition-colors select-none hover:bg-on-surface/8 focus:bg-on-surface/8 data-disabled:pointer-events-none data-disabled:opacity-50 data-inset:pl-10 [&_i]:pointer-events-none [&_i]:shrink-0 [&_i]:text-on-surface-variant [&_i:not([class*='size-'])]:size-5",
                compact && "h-9 gap-1.5 px-2 data-inset:pl-8 [&_i:not([class*='size-'])]:size-4",
                className,
            )}
            {...props}
        >
            <Ripple className='rounded-sm' />
            {children}
        </ContextMenuPrimitive.Item>
    )
}

function ContextMenuCheckboxItem({
    className,
    children,
    checked,
    ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.CheckboxItem>) {
    const compact = React.useContext(ContextMenuCompactContext)

    return (
        <ContextMenuPrimitive.CheckboxItem
            data-slot='context-menu-checkbox-item'
            data-compact={compact ? '' : undefined}
            className={cn(
                "relative flex h-11 cursor-default items-center gap-2 overflow-hidden rounded-sm px-3 pl-10 text-sm outline-hidden transition-colors select-none hover:bg-on-surface/8 focus:bg-on-surface/8 data-disabled:pointer-events-none data-disabled:opacity-50 [&_i]:pointer-events-none [&_i]:shrink-0 [&_i]:text-on-surface-variant [&_i:not([class*='size-'])]:size-5",
                'data-[state=checked]:rounded-lg data-[state=checked]:bg-tertiary-container data-[state=checked]:text-on-tertiary-container',
                compact && "h-9 gap-1.5 px-2 pl-8 data-[state=checked]:rounded-md [&_i:not([class*='size-'])]:size-4",
                className,
            )}
            checked={checked}
            {...props}
        >
            <span
                className={cn(
                    'pointer-events-none absolute left-3 flex size-5 items-center justify-center',
                    compact && 'left-2 size-4',
                )}
            >
                <ContextMenuPrimitive.ItemIndicator asChild>
                    <i className={cn('size-5 icon-[material-symbols--check-rounded]', compact && 'size-3.5')} />
                </ContextMenuPrimitive.ItemIndicator>
            </span>
            <Ripple className='rounded-sm' />
            {children}
        </ContextMenuPrimitive.CheckboxItem>
    )
}

function ContextMenuRadioItem({ className, children, ...props }: React.ComponentProps<typeof ContextMenuPrimitive.RadioItem>) {
    const compact = React.useContext(ContextMenuCompactContext)

    return (
        <ContextMenuPrimitive.RadioItem
            data-slot='context-menu-radio-item'
            data-compact={compact ? '' : undefined}
            className={cn(
                "relative flex h-11 cursor-default items-center gap-2 overflow-hidden rounded-sm px-3 pl-10 text-sm outline-hidden transition-colors select-none hover:bg-on-surface/8 focus:bg-on-surface/8 data-disabled:pointer-events-none data-disabled:opacity-50 [&_i]:pointer-events-none [&_i]:shrink-0 [&_i]:text-on-surface-variant [&_i:not([class*='size-'])]:size-5",
                'data-[state=checked]:rounded-lg data-[state=checked]:bg-tertiary-container data-[state=checked]:text-on-tertiary-container',
                compact && "h-9 gap-1.5 px-2 pl-8 data-[state=checked]:rounded-md [&_i:not([class*='size-'])]:size-4",
                className,
            )}
            {...props}
        >
            <span
                className={cn(
                    'pointer-events-none absolute left-3 flex size-5 items-center justify-center',
                    compact && 'left-2 size-4',
                )}
            >
                <ContextMenuPrimitive.ItemIndicator asChild>
                    <i className='size-2 icon-[material-symbols--circle]' />
                </ContextMenuPrimitive.ItemIndicator>
            </span>
            <Ripple className='rounded-sm' />
            {children}
        </ContextMenuPrimitive.RadioItem>
    )
}

function ContextMenuLabel({
    className,
    inset,
    ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Label> & {
    inset?: boolean
}) {
    const compact = React.useContext(ContextMenuCompactContext)

    return (
        <ContextMenuPrimitive.Label
            data-slot='context-menu-label'
            data-inset={inset}
            data-compact={compact ? '' : undefined}
            className={cn(
                'flex h-8 items-end px-4 pb-1 text-sm font-medium text-on-surface-variant data-inset:pl-10',
                compact && 'h-7 px-3 text-xs data-inset:pl-8',
                className,
            )}
            {...props}
        />
    )
}

function ContextMenuSeparator({ className, ...props }: React.ComponentProps<typeof ContextMenuPrimitive.Separator>) {
    const compact = React.useContext(ContextMenuCompactContext)

    return (
        <ContextMenuPrimitive.Separator
            data-slot='context-menu-separator'
            data-compact={compact ? '' : undefined}
            className={cn('mx-2 my-1 h-[0.5px] bg-outline-variant', compact && 'mx-1.5 my-0.5', className)}
            {...props}
        />
    )
}

function ContextMenuShortcut({ className, ...props }: React.ComponentProps<'span'>) {
    const compact = React.useContext(ContextMenuCompactContext)

    return (
        <span
            data-slot='context-menu-shortcut'
            data-compact={compact ? '' : undefined}
            className={cn('ml-auto text-xs tracking-widest text-on-surface-variant', compact && 'text-[0.6875rem]', className)}
            {...props}
        />
    )
}

export {
    ContextMenu,
    ContextMenuTrigger,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuCheckboxItem,
    ContextMenuRadioItem,
    ContextMenuLabel,
    ContextMenuSeparator,
    ContextMenuShortcut,
    ContextMenuGroup,
    ContextMenuPortal,
    ContextMenuSub,
    ContextMenuSubContent,
    ContextMenuSubTrigger,
    ContextMenuRadioGroup,
}
