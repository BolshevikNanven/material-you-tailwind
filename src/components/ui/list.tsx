'use client'

import * as React from 'react'
import { flushSync } from 'react-dom'
import { Slot, Slottable } from '@radix-ui/react-slot'

import { cn } from '@/lib/utils'
import { Ripple } from './ripple'

type ListVariant = 'standard' | 'segmented'

type ListContextValue = {
    variant: ListVariant
    startDrag: ((event: React.PointerEvent<HTMLElement>, onEnd: () => void) => void) | null
    moveBy: ((element: HTMLElement, delta: number) => void) | null
}

const ListContext = React.createContext<ListContextValue>({ variant: 'standard', startDrag: null, moveBy: null })

type ListItemContextValue = { setDragging: (dragging: boolean) => void; selectable: boolean }

const ListItemContext = React.createContext<ListItemContextValue | null>(null)

// Items inside a wrapper that already is the list item (such as ListItemReveal) drop their own role.
const ListItemWrappedContext = React.createContext(false)

function rowOf(root: HTMLElement, element: HTMLElement) {
    let row: HTMLElement | null = element
    while (row && row.parentElement !== root) row = row.parentElement
    return row
}

function List({
    variant = 'standard',
    onReorder,
    className,
    ref,
    ...props
}: React.ComponentProps<'div'> & {
    variant?: ListVariant
    onReorder?: (from: number, to: number) => void
}) {
    const onReorderRef = React.useRef(onReorder)

    React.useEffect(() => {
        onReorderRef.current = onReorder
    })

    const startDrag = React.useCallback((event: React.PointerEvent<HTMLElement>, onEnd: () => void) => {
        const handle = event.currentTarget
        const root = handle.closest<HTMLElement>('[data-slot=list]')
        const row = root && rowOf(root, handle)
        if (!root || !row || event.button !== 0) return
        event.preventDefault()

        const rows = [...root.children] as HTMLElement[]
        const rects = rows.map(element => element.getBoundingClientRect())
        const rootTop = root.getBoundingClientRect().top
        const from = rows.indexOf(row)
        const last = rows.length - 1
        const height = rects[from].height
        const gap = rows.length > 1 ? rects[1].top - rects[0].bottom : 0
        const shift = height + gap
        const startY = event.clientY
        const segmented = root.dataset.variant === 'segmented'
        let to = from

        // The drop zone is the list's ::before, so it never counts as a row for :first-child or :last-child.
        const placeDropZone = () => {
            const top = to < from ? rects[to].top : to > from ? rects[to].bottom - height : rects[from].top
            root.style.setProperty('--list-drop-top', `${top - rootTop}px`)
            root.style.setProperty('--list-drop-top-radius', segmented && to === 0 ? '16px' : '4px')
            root.style.setProperty('--list-drop-bottom-radius', segmented && to === last ? '16px' : '4px')
        }
        root.style.setProperty('--list-drop-height', `${height}px`)
        placeDropZone()
        root.dataset.dragging = ''

        try {
            handle.setPointerCapture(event.pointerId)
        } catch {}
        row.style.zIndex = '10'
        row.style.position = 'relative'
        for (const element of rows) if (element !== row) element.style.transition = 'transform 200ms ease'

        const move = (moveEvent: PointerEvent) => {
            const min = rects[0].top - rects[from].top
            const max = rects[last].bottom - rects[from].bottom
            const delta = Math.min(Math.max(moveEvent.clientY - startY, min), max)
            const top = rects[from].top + delta
            const bottom = rects[from].bottom + delta
            // Moving down passes a row once the dragged bottom edge crosses its middle, moving up once the top edge does.
            const below = rects.filter((rect, index) => index > from && bottom >= rect.top + rect.height / 2).length
            const above = rects.filter((rect, index) => index < from && top <= rect.top + rect.height / 2).length
            to = from + below - above
            row.style.transform = `translateY(${delta}px)`
            rows.forEach((element, index) => {
                if (element === row) return
                const offset = index > from && index <= to ? -shift : index < from && index >= to ? shift : 0
                element.style.transform = offset ? `translateY(${offset}px)` : ''
            })
            placeDropZone()
        }

        const end = () => {
            handle.removeEventListener('pointermove', move)
            handle.removeEventListener('pointerup', end)
            handle.removeEventListener('pointercancel', end)
            delete root.dataset.dragging
            for (const name of ['--list-drop-top', '--list-drop-height', '--list-drop-top-radius', '--list-drop-bottom-radius'])
                root.style.removeProperty(name)
            flushSync(() => {
                if (to !== from) onReorderRef.current?.(from, to)
                onEnd()
            })
            for (const element of rows) {
                element.style.transition = ''
                element.style.transform = ''
                element.style.zIndex = ''
                element.style.position = ''
            }
        }

        handle.addEventListener('pointermove', move)
        handle.addEventListener('pointerup', end)
        handle.addEventListener('pointercancel', end)
    }, [])

    const moveBy = React.useCallback((element: HTMLElement, delta: number) => {
        const root = element.closest<HTMLElement>('[data-slot=list]')
        const row = root && rowOf(root, element)
        if (!root || !row) return
        const from = [...root.children].indexOf(row)
        const to = from + delta
        if (to < 0 || to >= root.children.length) return
        onReorderRef.current?.(from, to)
    }, [])

    const context = React.useMemo<ListContextValue>(
        () => ({
            variant,
            startDrag: onReorder ? startDrag : null,
            moveBy: onReorder ? moveBy : null,
        }),
        [variant, onReorder, startDrag, moveBy],
    )

    return (
        <ListContext.Provider value={context}>
            <div
                ref={ref}
                role='list'
                data-slot='list'
                data-variant={variant}
                className={cn(
                    'relative isolate flex flex-col [--list-item-bottom:4px] [--list-item-top:4px]',
                    // Segmented lists round the outer corners of the first and last rows. The radii inherit into
                    // reveal wrappers and collapsible groups.
                    variant === 'segmented'
                        ? 'gap-0.5 [--list-gap:--spacing(0.5)] *:first:[--list-item-top:16px] *:last:[--list-item-bottom:16px]'
                        : '[--list-gap:0px]',
                    'before:pointer-events-none before:absolute before:inset-x-0 before:top-(--list-drop-top) before:-z-1 before:hidden before:h-(--list-drop-height) before:rounded-t-(--list-drop-top-radius) before:rounded-b-(--list-drop-bottom-radius) before:bg-surface-container-low before:transition-[top,border-radius] before:duration-200 data-dragging:before:block',
                    className,
                )}
                {...props}
            />
        </ListContext.Provider>
    )
}

type ListItemTone = 'default' | 'selected' | 'dragged' | 'disabled' | 'selected-disabled'

const toneClasses: Record<ListItemTone, string> = {
    default: 'bg-surface [--list-item-content:var(--color-on-surface)] [--list-item-variant:var(--color-on-surface-variant)]',
    selected:
        'bg-secondary-container [--list-item-content:var(--color-on-secondary-container)] [--list-item-variant:var(--color-on-secondary-container)]',
    dragged:
        'z-10 bg-tertiary-container shadow-elevation-4 [--list-item-content:var(--color-on-tertiary-container)] [--list-item-variant:var(--color-on-tertiary-container)]',
    disabled:
        'bg-surface [--list-item-content:var(--color-on-surface)] [--list-item-variant:var(--color-on-surface)] *:opacity-38',
    'selected-disabled':
        'bg-on-surface/10 [--list-item-content:var(--color-on-surface)] [--list-item-variant:var(--color-on-surface)] *:opacity-38',
}

type ListItemProps = React.ComponentProps<'div'> & {
    asChild?: boolean
    selectable?: boolean
    selected?: boolean
    defaultSelected?: boolean
    onSelectedChange?: (selected: boolean) => void
    disabled?: boolean
    dragged?: boolean
    interactive?: boolean
}

function ListItem({
    asChild = false,
    selectable = false,
    selected: selectedProp,
    defaultSelected = false,
    onSelectedChange,
    disabled = false,
    dragged = false,
    interactive,
    className,
    children,
    onClick,
    onKeyDown,
    ...props
}: ListItemProps) {
    const [dragging, setDragging] = React.useState(false)
    const [uncontrolledSelected, setUncontrolledSelected] = React.useState(defaultSelected)
    const selected = selectedProp ?? uncontrolledSelected
    const wrapped = React.useContext(ListItemWrappedContext)
    const Comp = asChild ? Slot : 'div'
    const isDragged = dragged || dragging
    const isInteractive = !disabled && (interactive ?? (selectable || onClick !== undefined || asChild))
    const isActivatable = !asChild && isInteractive && (selectable || onClick !== undefined)
    const tone: ListItemTone = disabled
        ? selected
            ? 'selected-disabled'
            : 'disabled'
        : isDragged
          ? 'dragged'
          : selected
            ? 'selected'
            : 'default'
    const context = React.useMemo(() => ({ setDragging, selectable }), [selectable])

    return (
        <ListItemContext.Provider value={context}>
            <Comp
                role={selectable ? 'checkbox' : asChild || wrapped ? undefined : 'listitem'}
                tabIndex={isActivatable ? 0 : undefined}
                aria-checked={selectable ? selected : undefined}
                aria-disabled={disabled || undefined}
                data-slot='list-item'
                data-selected={selected ? '' : undefined}
                data-dragged={isDragged ? '' : undefined}
                data-disabled={disabled ? '' : undefined}
                data-interactive={isInteractive ? '' : undefined}
                className={cn(
                    'group/list-item relative flex min-h-14 w-full items-center gap-3 rounded-t-[var(--list-item-top,4px)] rounded-b-[var(--list-item-bottom,4px)] px-4 py-2.5 text-left text-(--list-item-content) outline-none select-none',
                    'transition-[border-radius,background-color,box-shadow] duration-200 ease-out',
                    'has-data-[slot=list-item-overline]:min-h-18 has-data-[slot=list-item-supporting-text]:min-h-18',
                    'has-data-[lines=2]:min-h-22 has-data-[lines=2]:items-start',
                    'data-dragged:rounded-2xl! data-selected:rounded-2xl!',
                    isInteractive &&
                        'cursor-pointer hover:rounded-xl! focus-visible:rounded-2xl! active:rounded-2xl! data-dragged:cursor-grabbing',
                    disabled && 'cursor-not-allowed',
                    toneClasses[tone],
                    className,
                )}
                onClick={
                    disabled
                        ? undefined
                        : event => {
                              onClick?.(event)
                              if (!selectable || event.defaultPrevented) return
                              if (selectedProp === undefined) setUncontrolledSelected(!selected)
                              onSelectedChange?.(!selected)
                          }
                }
                onKeyDown={event => {
                    onKeyDown?.(event)
                    if (isActivatable && event.target === event.currentTarget && (event.key === 'Enter' || event.key === ' ')) {
                        event.preventDefault()
                        event.currentTarget.click()
                    }
                }}
                {...props}
            >
                {isInteractive && (
                    <span
                        data-slot='list-item-state-layer'
                        className='pointer-events-none absolute inset-0 rounded-[inherit] bg-(--list-item-content) opacity-0 transition-opacity group-hover/list-item:opacity-8 group-focus-visible/list-item:opacity-10 group-active/list-item:opacity-10 group-data-dragged/list-item:opacity-0'
                    />
                )}
                {isInteractive && <Ripple />}
                <Slottable>{children}</Slottable>
            </Comp>
        </ListItemContext.Provider>
    )
}

// In a selectable item the whole item toggles, so controls inside it are presentational.
function useControlsInert() {
    return React.useContext(ListItemContext)?.selectable || undefined
}

function ListItemLeading({ className, ...props }: React.ComponentProps<'div'>) {
    const inert = useControlsInert()
    return (
        <div
            inert={inert}
            data-slot='list-item-leading'
            className={cn(
                "relative flex shrink-0 items-center justify-center text-(--list-item-variant) [&>i:not([class*='size-'])]:size-5",
                className,
            )}
            {...props}
        />
    )
}

function ListItemContent({ className, ...props }: React.ComponentProps<'div'>) {
    return <div data-slot='list-item-content' className={cn('relative flex min-w-0 flex-1 flex-col', className)} {...props} />
}

function ListItemOverline({ className, ...props }: React.ComponentProps<'span'>) {
    return (
        <span
            data-slot='list-item-overline'
            className={cn('truncate text-[11px] leading-4 font-medium tracking-[0.5px] text-(--list-item-variant)', className)}
            {...props}
        />
    )
}

function ListItemLabel({ className, ...props }: React.ComponentProps<'span'>) {
    return (
        <span
            data-slot='list-item-label'
            className={cn('truncate text-base leading-6 tracking-[0.5px] text-(--list-item-content)', className)}
            {...props}
        />
    )
}

function ListItemSupportingText({ lines = 1, className, ...props }: React.ComponentProps<'span'> & { lines?: 1 | 2 }) {
    return (
        <span
            data-slot='list-item-supporting-text'
            data-lines={lines}
            className={cn(
                'text-sm leading-5 tracking-[0.25px] text-(--list-item-variant)',
                lines === 1 ? 'truncate' : 'line-clamp-2',
                className,
            )}
            {...props}
        />
    )
}

function ListItemTrailing({ className, ...props }: React.ComponentProps<'div'>) {
    const inert = useControlsInert()
    return (
        <div
            inert={inert}
            data-slot='list-item-trailing'
            className={cn(
                "relative flex shrink-0 items-center gap-2 text-(--list-item-variant) [&>i:not([class*='size-'])]:size-5",
                className,
            )}
            {...props}
        />
    )
}

function ListItemTrailingText({ className, ...props }: React.ComponentProps<'span'>) {
    return (
        <span
            data-slot='list-item-trailing-text'
            className={cn('text-[11px] leading-4 font-medium tracking-[0.5px] text-(--list-item-variant)', className)}
            {...props}
        />
    )
}

function ListItemDragHandle({
    label = 'Reorder',
    className,
    onPointerDown,
    onKeyDown,
    ...props
}: React.ComponentProps<'button'> & { label?: string }) {
    const list = React.useContext(ListContext)
    const item = React.useContext(ListItemContext)

    return (
        <button
            type='button'
            aria-label={label}
            title={label}
            data-slot='list-item-drag-handle'
            className={cn(
                'relative flex size-6 shrink-0 cursor-grab touch-none items-center justify-center rounded-full text-(--list-item-variant) outline-none focus-visible:ring-2 focus-visible:ring-secondary active:cursor-grabbing',
                className,
            )}
            onClick={event => event.stopPropagation()}
            onPointerDown={event => {
                onPointerDown?.(event)
                event.stopPropagation()
                if (event.defaultPrevented || !list.startDrag) return
                item?.setDragging(true)
                list.startDrag(event, () => item?.setDragging(false))
            }}
            onKeyDown={event => {
                onKeyDown?.(event)
                if (!list.moveBy) return
                if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
                    event.preventDefault()
                    event.stopPropagation()
                    list.moveBy(event.currentTarget, event.key === 'ArrowUp' ? -1 : 1)
                }
            }}
            {...props}
        >
            <i className='icon-[material-symbols--drag-handle-rounded] size-5' />
        </button>
    )
}

type ListCollapsibleContextValue = {
    open: boolean
    setOpen: (open: boolean) => void
    contentId: string
}

const ListCollapsibleContext = React.createContext<ListCollapsibleContextValue | null>(null)

function useListCollapsible(component: string) {
    const context = React.useContext(ListCollapsibleContext)
    if (!context) throw new Error(`${component} must be used within ListCollapsible`)
    return context
}

function ListCollapsible({
    open: openProp,
    defaultOpen = false,
    onOpenChange,
    className,
    ...props
}: React.ComponentProps<'div'> & {
    open?: boolean
    defaultOpen?: boolean
    onOpenChange?: (open: boolean) => void
}) {
    const [uncontrolled, setUncontrolled] = React.useState(defaultOpen)
    const open = openProp ?? uncontrolled
    const contentId = React.useId()
    const setOpen = React.useCallback(
        (next: boolean) => {
            if (openProp === undefined) setUncontrolled(next)
            onOpenChange?.(next)
        },
        [openProp, onOpenChange],
    )
    const context = React.useMemo(() => ({ open, setOpen, contentId }), [open, setOpen, contentId])

    return (
        <ListCollapsibleContext.Provider value={context}>
            <div
                role='listitem'
                data-slot='list-collapsible'
                data-state={open ? 'open' : 'closed'}
                className={cn('flex flex-col [&[data-state=open]>[data-slot=list-item]]:[--list-item-bottom:4px]', className)}
                {...props}
            />
        </ListCollapsibleContext.Provider>
    )
}

function ListCollapsibleTrigger({ onClick, ...props }: React.ComponentProps<typeof Slot>) {
    const { open, setOpen, contentId } = useListCollapsible('ListCollapsibleTrigger')

    return (
        <Slot
            data-state={open ? 'open' : 'closed'}
            role='button'
            aria-expanded={open}
            aria-controls={contentId}
            onClick={event => {
                onClick?.(event)
                if (!event.defaultPrevented) setOpen(!open)
            }}
            {...props}
        />
    )
}

function ListCollapsibleIndicator({ className, ...props }: React.ComponentProps<'span'>) {
    const { open } = useListCollapsible('ListCollapsibleIndicator')

    return (
        <span
            aria-hidden
            data-slot='list-collapsible-indicator'
            data-state={open ? 'open' : 'closed'}
            className={cn(
                'flex size-8 items-center justify-center rounded-full bg-surface text-on-surface transition-colors duration-200 data-[state=open]:bg-surface-container',
                className,
            )}
            {...props}
        >
            <i
                className={cn(
                    'icon-[material-symbols--keyboard-arrow-down-rounded] size-5 transition-transform duration-200',
                    open && 'rotate-180',
                )}
            />
        </span>
    )
}

function ListCollapsibleContent({ className, children, ...props }: React.ComponentProps<'div'>) {
    const { open, contentId } = useListCollapsible('ListCollapsibleContent')

    return (
        <div
            id={contentId}
            data-slot='list-collapsible-content'
            data-state={open ? 'open' : 'closed'}
            inert={!open}
            className={cn(
                'grid transition-[grid-template-rows] duration-300 ease-out',
                open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
                className,
            )}
            {...props}
        >
            <div
                role='list'
                className='flex min-h-0 flex-col gap-(--list-gap) overflow-hidden pt-(--list-gap) [--list-item-top:4px] [&>:not(:last-child)]:[--list-item-bottom:4px]'
            >
                {children}
            </div>
        </div>
    )
}

const REVEAL_SLOP = 8
const REVEAL_GAP = 4

// Counts the actions, looking through fragments and skipping empty slots such as `false` or `null`.
function countActions(node: React.ReactNode): number {
    return React.Children.toArray(node).reduce<number>(
        (count, child) =>
            count +
            (React.isValidElement<{ children?: React.ReactNode }>(child) && child.type === React.Fragment
                ? countActions(child.props.children)
                : 1),
        0,
    )
}

type ListItemRevealContextValue = { open: boolean; setOpen: (open: boolean) => void; actionsId: string }

const ListItemRevealContext = React.createContext<ListItemRevealContextValue | null>(null)

function ListItemReveal({
    actions,
    open: openProp,
    defaultOpen = false,
    onOpenChange,
    actionWidth = 56,
    className,
    children,
    style,
    ...props
}: React.ComponentProps<'div'> & {
    actions: React.ReactNode
    actionWidth?: number
    open?: boolean
    defaultOpen?: boolean
    onOpenChange?: (open: boolean) => void
}) {
    const [uncontrolled, setUncontrolled] = React.useState(defaultOpen)
    const open = openProp ?? uncontrolled
    const [drag, setDrag] = React.useState<number | null>(null)
    const rootRef = React.useRef<HTMLDivElement>(null)
    const gesture = React.useRef<{
        x: number
        y: number
        start: number
        offset: number
        active: boolean
        moved: boolean
    } | null>(null)

    const setOpen = React.useCallback(
        (next: boolean) => {
            if (openProp === undefined) setUncontrolled(next)
            onOpenChange?.(next)
        },
        [openProp, onOpenChange],
    )
    const actionsId = React.useId()
    const revealContext = React.useMemo(() => ({ open, setOpen, actionsId }), [open, setOpen, actionsId])

    React.useEffect(() => {
        if (!open) return
        const close = (event: PointerEvent) => {
            if (!rootRef.current?.contains(event.target as Node)) setOpen(false)
        }
        document.addEventListener('pointerdown', close)
        return () => document.removeEventListener('pointerdown', close)
    }, [open, setOpen])

    // Fully open, each action is actionWidth wide with a gap before it.
    const width = countActions(actions) * (actionWidth + REVEAL_GAP)
    const offset = drag ?? (open ? width : 0)
    const progress = width ? offset / width : 0

    return (
        <div
            ref={rootRef}
            role='listitem'
            data-slot='list-item-reveal'
            data-state={open ? 'open' : 'closed'}
            data-revealed={offset > 0 ? '' : undefined}
            className={cn('relative flex overflow-hidden data-revealed:[&_[data-slot=list-item]]:rounded-2xl!', className)}
            style={
                {
                    '--list-reveal-icon-opacity': Math.min(Math.max((progress - 0.3) / 0.4, 0), 1),
                    ...style,
                } as React.CSSProperties
            }
            onKeyDown={event => {
                if (event.key === 'Escape' && open) {
                    setOpen(false)
                    rootRef.current?.querySelector<HTMLElement>('[data-slot=list-item]')?.focus()
                }
            }}
            {...props}
        >
            <div
                id={actionsId}
                data-slot='list-item-reveal-actions'
                className={cn(
                    'absolute inset-y-0 right-0 flex gap-1 overflow-hidden pl-1',
                    drag === null && 'transition-[width] duration-300 ease-out',
                )}
                style={{ width: offset }}
                onFocus={() => setOpen(true)}
            >
                {actions}
            </div>
            <div
                className={cn('relative w-full touch-pan-y', drag === null && 'transition-transform duration-300 ease-out')}
                style={{ transform: `translateX(${-offset}px)` }}
                onPointerDown={event => {
                    if (event.button !== 0) return
                    gesture.current = {
                        x: event.clientX,
                        y: event.clientY,
                        start: offset,
                        offset,
                        active: false,
                        moved: false,
                    }
                }}
                onPointerMove={event => {
                    const current = gesture.current
                    if (!current) return
                    const dx = event.clientX - current.x
                    const dy = event.clientY - current.y
                    if (!current.active) {
                        if (Math.abs(dy) > REVEAL_SLOP && Math.abs(dy) > Math.abs(dx)) gesture.current = null
                        if (Math.abs(dx) <= REVEAL_SLOP || Math.abs(dx) < Math.abs(dy)) return
                        current.active = true
                        current.moved = true
                        try {
                            event.currentTarget.setPointerCapture(event.pointerId)
                        } catch {}
                    }
                    current.offset = Math.min(Math.max(current.start - dx, 0), width)
                    setDrag(current.offset)
                }}
                onPointerUp={() => {
                    const current = gesture.current
                    if (current?.active) setOpen(current.offset > width / 2)
                    setDrag(null)
                    if (!current?.moved) gesture.current = null
                }}
                onPointerCancel={() => {
                    gesture.current = null
                    setDrag(null)
                }}
                onClickCapture={event => {
                    if (gesture.current?.moved) {
                        event.preventDefault()
                        event.stopPropagation()
                    }
                    gesture.current = null
                }}
            >
                <ListItemRevealContext.Provider value={revealContext}>
                    <ListItemWrappedContext.Provider value>{children}</ListItemWrappedContext.Provider>
                </ListItemRevealContext.Provider>
            </div>
        </div>
    )
}

function ListItemRevealAction({
    label,
    variant = 'tonal',
    className,
    children,
    ...props
}: React.ComponentProps<'button'> & { label?: string; variant?: 'tonal' | 'filled' }) {
    return (
        <button
            type='button'
            aria-label={label}
            title={label}
            data-slot='list-item-reveal-action'
            data-variant={variant}
            className={cn(
                "group/reveal-action relative flex min-w-0 flex-1 cursor-pointer items-center justify-center overflow-hidden rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-inset [&_i]:shrink-0 [&_i]:opacity-(--list-reveal-icon-opacity) [&_i:not([class*='size-'])]:size-6",
                variant === 'tonal' && 'bg-secondary-container text-on-secondary-container',
                variant === 'filled' && 'bg-primary text-on-primary',
                className,
            )}
            {...props}
        >
            <span className='absolute inset-0 rounded-[inherit] bg-current opacity-0 transition-opacity group-hover/reveal-action:opacity-8 group-active/reveal-action:opacity-10' />
            <Ripple />
            {children}
        </button>
    )
}

function ListItemRevealTrigger({
    label = 'More actions',
    className,
    children,
    onClick,
    ...props
}: React.ComponentProps<'button'> & { label?: string }) {
    const context = React.useContext(ListItemRevealContext)
    if (!context) throw new Error('ListItemRevealTrigger must be used within ListItemReveal')
    const { open, setOpen, actionsId } = context

    return (
        <button
            type='button'
            aria-label={label}
            aria-expanded={open}
            aria-controls={actionsId}
            title={label}
            data-slot='list-item-reveal-trigger'
            data-state={open ? 'open' : 'closed'}
            className={cn(
                "relative flex size-6 shrink-0 cursor-pointer items-center justify-center rounded-full text-(--list-item-variant) outline-none focus-visible:ring-2 focus-visible:ring-secondary [&_i:not([class*='size-'])]:size-5",
                className,
            )}
            onClick={event => {
                onClick?.(event)
                event.stopPropagation()
                if (!event.defaultPrevented) setOpen(!open)
            }}
            {...props}
        >
            {children ?? <i className='icon-[material-symbols--more-vert]' />}
        </button>
    )
}

export {
    List,
    ListItem,
    ListItemLeading,
    ListItemContent,
    ListItemOverline,
    ListItemLabel,
    ListItemSupportingText,
    ListItemTrailing,
    ListItemTrailingText,
    ListItemDragHandle,
    ListCollapsible,
    ListCollapsibleTrigger,
    ListCollapsibleIndicator,
    ListCollapsibleContent,
    ListItemReveal,
    ListItemRevealAction,
    ListItemRevealTrigger,
}
