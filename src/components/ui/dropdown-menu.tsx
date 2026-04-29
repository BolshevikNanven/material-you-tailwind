'use client'

import * as React from 'react'
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu'

import { cn } from '@/lib/utils'
import { Ripple } from './ripple'

const DropdownMenuCompactContext = React.createContext(false)

type DropdownMenuContentProps = React.ComponentProps<typeof DropdownMenuPrimitive.Content> & {
    compact?: boolean
}

function DropdownMenu({ ...props }: React.ComponentProps<typeof DropdownMenuPrimitive.Root>) {
    return <DropdownMenuPrimitive.Root data-slot='dropdown-menu' {...props} />
}

function DropdownMenuPortal({ ...props }: React.ComponentProps<typeof DropdownMenuPrimitive.Portal>) {
    return <DropdownMenuPrimitive.Portal data-slot='dropdown-menu-portal' {...props} />
}

function DropdownMenuTrigger({ ...props }: React.ComponentProps<typeof DropdownMenuPrimitive.Trigger>) {
    return <DropdownMenuPrimitive.Trigger data-slot='dropdown-menu-trigger' {...props} />
}

function DropdownMenuContent({
    className,
    compact = false,
    sideOffset = 4,
    ...props
}: DropdownMenuContentProps) {
    return (
        <DropdownMenuPrimitive.Portal>
            <DropdownMenuCompactContext.Provider value={compact}>
                <DropdownMenuPrimitive.Content
                    data-slot='dropdown-menu-content'
                    data-compact={compact ? '' : undefined}
                    sideOffset={sideOffset}
                    className={cn(
                        'z-50 flex max-h-(--radix-dropdown-menu-content-available-height) min-w-32 origin-(--radix-dropdown-menu-content-transform-origin) flex-col gap-0.5 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95',
                        compact && 'min-w-28 gap-px',
                        className,
                    )}
                    {...props}
                />
            </DropdownMenuCompactContext.Provider>
        </DropdownMenuPrimitive.Portal>
    )
}

function DropdownMenuGroup({ className, children, ...props }: React.ComponentProps<typeof DropdownMenuPrimitive.Group>) {
    const compact = React.useContext(DropdownMenuCompactContext)

    return (
        <DropdownMenuPrimitive.Group
            data-slot='dropdown-menu-group'
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
        </DropdownMenuPrimitive.Group>
    )
}

function DropdownMenuItem({
    className,
    inset,
    children,
    ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Item> & {
    inset?: boolean
}) {
    const compact = React.useContext(DropdownMenuCompactContext)

    return (
        <DropdownMenuPrimitive.Item
            data-slot='dropdown-menu-item'
            data-inset={inset}
            data-compact={compact ? '' : undefined}
            className={cn(
                "relative flex h-11 cursor-default items-center gap-2 overflow-hidden rounded-sm px-3 text-sm outline-hidden transition-colors select-none hover:bg-on-surface/8 focus:bg-on-surface/8 data-disabled:pointer-events-none data-disabled:opacity-50 data-inset:pl-10 [&_i]:pointer-events-none [&_i]:shrink-0 [&_i:not([class*='size-'])]:mx-0.5 [&_i:not([class*='size-'])]:size-4",
                compact && 'h-9 gap-1.5 px-2 data-inset:pl-8',
                className,
            )}
            {...props}
        >
            <Ripple className='rounded-sm' />
            {children}
        </DropdownMenuPrimitive.Item>
    )
}

function DropdownMenuCheckboxItem({
    className,
    children,
    checked,
    ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.CheckboxItem>) {
    const compact = React.useContext(DropdownMenuCompactContext)

    return (
        <DropdownMenuPrimitive.CheckboxItem
            data-slot='dropdown-menu-checkbox-item'
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
                <DropdownMenuPrimitive.ItemIndicator asChild>
                    <i className={cn('icon-[material-symbols--check-rounded] size-4', compact && 'size-3.5')} />
                </DropdownMenuPrimitive.ItemIndicator>
            </span>
            <Ripple className='rounded-sm' />
            {children}
        </DropdownMenuPrimitive.CheckboxItem>
    )
}

function DropdownMenuRadioGroup({ className, ...props }: React.ComponentProps<typeof DropdownMenuPrimitive.RadioGroup>) {
    const compact = React.useContext(DropdownMenuCompactContext)

    return (
        <DropdownMenuPrimitive.RadioGroup
            data-slot='dropdown-menu-radio-group'
            data-compact={compact ? '' : undefined}
            className={cn('flex flex-col gap-0.5', compact && 'gap-px', className)}
            {...props}
        />
    )
}

function DropdownMenuRadioItem({
    className,
    children,
    ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.RadioItem>) {
    const compact = React.useContext(DropdownMenuCompactContext)

    return (
        <DropdownMenuPrimitive.RadioItem
            data-slot='dropdown-menu-radio-item'
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
                <DropdownMenuPrimitive.ItemIndicator asChild>
                    <i className='icon-[material-symbols--circle] size-2' />
                </DropdownMenuPrimitive.ItemIndicator>
            </span>
            <Ripple className='rounded-sm' />
            {children}
        </DropdownMenuPrimitive.RadioItem>
    )
}

function DropdownMenuLabel({
    className,
    inset,
    ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Label> & {
    inset?: boolean
}) {
    const compact = React.useContext(DropdownMenuCompactContext)

    return (
        <DropdownMenuPrimitive.Label
            data-slot='dropdown-menu-label'
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

function DropdownMenuSeparator({ className, ...props }: React.ComponentProps<typeof DropdownMenuPrimitive.Separator>) {
    const compact = React.useContext(DropdownMenuCompactContext)

    return (
        <DropdownMenuPrimitive.Separator
            data-slot='dropdown-menu-separator'
            data-compact={compact ? '' : undefined}
            className={cn('mx-2 my-1 h-[0.5px] bg-outline-variant', compact && 'mx-1.5 my-0.5', className)}
            {...props}
        />
    )
}

function DropdownMenuShortcut({ className, ...props }: React.ComponentProps<'span'>) {
    const compact = React.useContext(DropdownMenuCompactContext)

    return (
        <span
            data-slot='dropdown-menu-shortcut'
            data-compact={compact ? '' : undefined}
            className={cn('ml-auto text-xs tracking-widest text-on-surface-variant', compact && 'text-[0.6875rem]', className)}
            {...props}
        />
    )
}

function DropdownMenuSub({ ...props }: React.ComponentProps<typeof DropdownMenuPrimitive.Sub>) {
    return <DropdownMenuPrimitive.Sub data-slot='dropdown-menu-sub' {...props} />
}

function DropdownMenuSubTrigger({
    className,
    inset,
    children,
    ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.SubTrigger> & {
    inset?: boolean
}) {
    const compact = React.useContext(DropdownMenuCompactContext)

    return (
        <DropdownMenuPrimitive.SubTrigger
            data-slot='dropdown-menu-sub-trigger'
            data-inset={inset}
            data-compact={compact ? '' : undefined}
            className={cn(
                "flex h-11 cursor-default items-center rounded-sm px-3 text-sm outline-hidden select-none hover:bg-on-surface/8 focus:bg-on-surface/8 data-[inset]:pl-10 data-[state=open]:bg-on-surface/8 [&_i]:pointer-events-none [&_i]:shrink-0 [&_i:not([class*='size-'])]:size-4 [&_i:not([class*='text-'])]:text-on-surface-variant",
                compact && 'h-9 px-2 data-[inset]:pl-8',
                className,
            )}
            {...props}
        >
            {children}
            <i className='ml-auto icon-[material-symbols--chevron-right-rounded]' />
        </DropdownMenuPrimitive.SubTrigger>
    )
}

function DropdownMenuSubContent({ className, ...props }: React.ComponentProps<typeof DropdownMenuPrimitive.SubContent>) {
    const compact = React.useContext(DropdownMenuCompactContext)

    return (
        <DropdownMenuPrimitive.SubContent
            data-slot='dropdown-menu-sub-content'
            data-compact={compact ? '' : undefined}
            className={cn(
                'z-50 min-w-32 origin-(--radix-dropdown-menu-content-transform-origin) flex-col gap-0.5 rounded-2xl data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95',
                compact && 'min-w-28 gap-px rounded-xl',
                className,
            )}
            {...props}
        />
    )
}

export {
    DropdownMenu,
    DropdownMenuPortal,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuLabel,
    DropdownMenuItem,
    DropdownMenuCheckboxItem,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuSub,
    DropdownMenuSubTrigger,
    DropdownMenuSubContent,
}
