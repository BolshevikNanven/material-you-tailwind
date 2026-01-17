'use client'

import * as React from 'react'
import * as ContextMenuPrimitive from '@radix-ui/react-context-menu'

import { cn } from '@/lib/utils'
import { Ripple } from './ripple'

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
    return (
        <ContextMenuPrimitive.RadioGroup
            data-slot='context-menu-radio-group'
            className={cn('flex flex-col gap-0.5', className)}
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
    return (
        <ContextMenuPrimitive.SubTrigger
            data-slot='context-menu-sub-trigger'
            data-inset={inset}
            className={cn(
                "[&_i:not([class*='text-'])]:text-on-surface-variant flex h-11 cursor-default items-center rounded-sm px-3 text-sm outline-hidden select-none hover:bg-on-surface/8 focus:bg-on-surface/8 data-[inset]:pl-10 data-[state=open]:bg-on-surface/8 [&_i]:pointer-events-none [&_i]:shrink-0 [&_i:not([class*='size-'])]:size-5",
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
    return (
        <ContextMenuPrimitive.Group
            data-slot='context-menu-group'
            className={cn(
                'first:rounded-t-2xl last:rounded-b-2xl first:[&>*:first-child]:rounded-t-xl last:[&>*:last-child]:rounded-b-xl',
                'w-full overflow-hidden overflow-y-auto rounded-lg bg-surface-container-low p-1 shadow-elevation-3',
                className,
            )}
            {...props}
        >
            <div className='flex w-full flex-col gap-0.5 overflow-hidden rounded-sm'>{children}</div>
        </ContextMenuPrimitive.Group>
    )
}
function ContextMenuSubContent({ className, ...props }: React.ComponentProps<typeof ContextMenuPrimitive.SubContent>) {
    return (
        <ContextMenuPrimitive.SubContent
            data-slot='context-menu-sub-content'
            className={cn(
                'z-50 flex min-w-32 origin-(--radix-context-menu-content-transform-origin) flex-col gap-0.5 rounded-2xl data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95',
                className,
            )}
            {...props}
        />
    )
}

function ContextMenuContent({ className, ...props }: React.ComponentProps<typeof ContextMenuPrimitive.Content>) {
    return (
        <ContextMenuPrimitive.Portal>
            <ContextMenuPrimitive.Content
                data-slot='context-menu-content'
                className={cn(
                    'z-50 flex max-h-(--radix-context-menu-content-available-height) min-w-32 origin-(--radix-context-menu-content-transform-origin) flex-col gap-0.5 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95',
                    className,
                )}
                {...props}
            />
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
    return (
        <ContextMenuPrimitive.Item
            data-slot='context-menu-item'
            data-inset={inset}
            className={cn(
                "relative flex h-11 cursor-default items-center gap-2 overflow-hidden rounded-sm px-3 text-sm outline-hidden transition-colors select-none hover:bg-on-surface/8 focus:bg-on-surface/8 data-disabled:pointer-events-none data-disabled:opacity-50 data-inset:pl-10 [&_i]:pointer-events-none [&_i]:shrink-0 [&_i]:text-on-surface-variant [&_i:not([class*='size-'])]:mx-0.5 [&_i:not([class*='size-'])]:size-5",
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
    return (
        <ContextMenuPrimitive.CheckboxItem
            data-slot='context-menu-checkbox-item'
            className={cn(
                "relative flex h-11 cursor-default items-center gap-2 overflow-hidden rounded-sm px-3 pl-10 text-sm outline-hidden transition-colors select-none hover:bg-on-surface/8 focus:bg-on-surface/8 data-disabled:pointer-events-none data-disabled:opacity-50 [&_i]:pointer-events-none [&_i]:shrink-0 [&_i]:text-on-surface-variant [&_i:not([class*='size-'])]:size-5",
                'data-[state=checked]:rounded-lg data-[state=checked]:bg-tertiary-container data-[state=checked]:text-on-tertiary-container',
                className,
            )}
            checked={checked}
            {...props}
        >
            <span className='pointer-events-none absolute left-3 flex size-5 items-center justify-center'>
                <ContextMenuPrimitive.ItemIndicator asChild>
                    <i className='size-5 icon-[material-symbols--check-rounded]' />
                </ContextMenuPrimitive.ItemIndicator>
            </span>
            <Ripple className='rounded-sm' />
            {children}
        </ContextMenuPrimitive.CheckboxItem>
    )
}

function ContextMenuRadioItem({ className, children, ...props }: React.ComponentProps<typeof ContextMenuPrimitive.RadioItem>) {
    return (
        <ContextMenuPrimitive.RadioItem
            data-slot='context-menu-radio-item'
            className={cn(
                "relative flex h-11 cursor-default items-center gap-2 overflow-hidden rounded-sm px-3 pl-10 text-sm outline-hidden transition-colors select-none hover:bg-on-surface/8 focus:bg-on-surface/8 data-disabled:pointer-events-none data-disabled:opacity-50 [&_i]:pointer-events-none [&_i]:shrink-0 [&_i]:text-on-surface-variant [&_i:not([class*='size-'])]:size-5",
                'data-[state=checked]:rounded-lg data-[state=checked]:bg-tertiary-container data-[state=checked]:text-on-tertiary-container',
                className,
            )}
            {...props}
        >
            <span className='pointer-events-none absolute left-3 flex size-5 items-center justify-center'>
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
    return (
        <ContextMenuPrimitive.Label
            data-slot='context-menu-label'
            data-inset={inset}
            className={cn(
                'flex h-8 items-end px-4 pb-1 text-sm font-medium text-on-surface-variant data-inset:pl-10',
                className,
            )}
            {...props}
        />
    )
}

function ContextMenuSeparator({ className, ...props }: React.ComponentProps<typeof ContextMenuPrimitive.Separator>) {
    return (
        <ContextMenuPrimitive.Separator
            data-slot='context-menu-separator'
            className={cn('mx-2 my-1 h-[0.5px] bg-outline-variant', className)}
            {...props}
        />
    )
}

function ContextMenuShortcut({ className, ...props }: React.ComponentProps<'span'>) {
    return (
        <span
            data-slot='context-menu-shortcut'
            className={cn('ml-auto text-xs tracking-widest text-on-surface-variant', className)}
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
