'use client'

import * as React from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'

import { cn } from '@/lib/utils'
import { Button } from './button'

type SheetSide = 'bottom' | 'left' | 'right'
type SheetValue = 'hidden' | 'partiallyExpanded' | 'expanded'
type SheetAnchors = Partial<Record<SheetValue, number>>

// Sheets settle with MotionScheme.expressive() defaultSpatialSpec (damping 0.8, stiffness 380), the spring Compose
// uses. Its curve is sampled into the `linear()` easing on SheetContent and settles within this duration.
const SETTLE_DURATION = 500
// AnchoredDraggable thresholds used by Compose sheets.
const POSITIONAL_THRESHOLD = 56
const VELOCITY_THRESHOLD = 125
const TOUCH_SLOP = 8
// Detached sheets float 16dp away from the screen edge.
const DETACHED_MARGIN = 16
// Extra travel so the container shadow is off screen when hidden.
const HIDDEN_PADDING = 8

interface SheetContextValue {
    open: boolean
    setOpen: (open: boolean) => void
    modal: boolean
}

const SheetContext = React.createContext<SheetContextValue | null>(null)

function useSheet() {
    const context = React.useContext(SheetContext)
    if (!context) throw new Error('Sheet components must be used within <Sheet>')
    return context
}

interface SheetContentContextValue {
    side: SheetSide
    value: SheetValue
    hasPartiallyExpanded: boolean
    settle: (value: SheetValue) => void
}

const SheetContentContext = React.createContext<SheetContentContextValue | null>(null)

function Sheet({
    open: openProp,
    defaultOpen = false,
    onOpenChange,
    modal = true,
    ...props
}: React.ComponentProps<typeof DialogPrimitive.Root>) {
    const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen)
    const open = openProp ?? uncontrolledOpen
    const setOpen = React.useCallback(
        (next: boolean) => {
            if (openProp === undefined) setUncontrolledOpen(next)
            onOpenChange?.(next)
        },
        [openProp, onOpenChange],
    )
    const context = React.useMemo(() => ({ open, setOpen, modal }), [open, setOpen, modal])

    return (
        <SheetContext.Provider value={context}>
            <DialogPrimitive.Root data-slot='sheet' open={open} onOpenChange={setOpen} modal={modal} {...props} />
        </SheetContext.Provider>
    )
}

function SheetTrigger({ ...props }: React.ComponentProps<typeof DialogPrimitive.Trigger>) {
    return <DialogPrimitive.Trigger data-slot='sheet-trigger' {...props} />
}

function SheetClose({ ...props }: React.ComponentProps<typeof DialogPrimitive.Close>) {
    return <DialogPrimitive.Close data-slot='sheet-close' {...props} />
}

function SheetOverlay({
    visible,
    className,
    ...props
}: React.ComponentProps<typeof DialogPrimitive.Overlay> & { visible: boolean }) {
    return (
        <DialogPrimitive.Overlay
            data-slot='sheet-overlay'
            data-visible={visible}
            forceMount
            className={cn(
                'fixed inset-0 z-50 bg-scrim/32 opacity-0 transition-opacity duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] data-[visible=true]:opacity-100 starting:opacity-0',
                className,
            )}
            {...props}
        />
    )
}

function prefersReducedMotion() {
    return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

// Anchor closest to `offset` on one side of it, like Compose's AnchoredDraggable.
function closestAnchor(anchors: SheetAnchors, offset: number, searchUpwards: boolean) {
    let result: SheetValue | undefined
    let distance = Infinity
    for (const [value, position] of Object.entries(anchors) as [SheetValue, number][]) {
        const delta = searchUpwards ? position - offset : offset - position
        if (delta >= 0 && delta < distance) {
            distance = delta
            result = value
        }
    }
    return result
}

function computeTarget(anchors: SheetAnchors, current: SheetValue, offset: number, velocity: number): SheetValue {
    const currentPosition = anchors[current] ?? anchors.expanded!
    if (Math.abs(velocity) >= VELOCITY_THRESHOLD) {
        return closestAnchor(anchors, offset, velocity > 0) ?? current
    }
    const neighbor = closestAnchor(anchors, offset, offset > currentPosition)
    if (!neighbor) return current
    return Math.abs(offset - currentPosition) <= POSITIONAL_THRESHOLD ? current : neighbor
}

function scrollParent(target: EventTarget | null, root: HTMLElement, vertical: boolean) {
    let node = target instanceof HTMLElement ? target : null
    while (node && node !== root) {
        const style = getComputedStyle(node)
        const overflow = vertical ? style.overflowY : style.overflowX
        const scrollable = vertical ? node.scrollHeight > node.clientHeight : node.scrollWidth > node.clientWidth
        if (scrollable && (overflow === 'auto' || overflow === 'scroll')) return node
        node = node.parentElement
    }
    return null
}

function SheetContent({
    side = 'bottom',
    detached = false,
    showDragHandle = side === 'bottom',
    skipPartiallyExpanded = false,
    gesturesEnabled = true,
    className,
    children,
    onInteractOutside,
    onOpenAutoFocus,
    ...props
}: React.ComponentProps<typeof DialogPrimitive.Content> & {
    side?: SheetSide
    detached?: boolean
    showDragHandle?: boolean
    skipPartiallyExpanded?: boolean
    gesturesEnabled?: boolean
}) {
    const { open, setOpen, modal } = useSheet()
    const [mounted, setMounted] = React.useState(open)
    const [value, setValue] = React.useState<SheetValue>('hidden')
    if (open && !mounted) setMounted(true)

    // Radix portals mount their children a commit late, so effects wait for the node.
    const [node, setNode] = React.useState<HTMLDivElement | null>(null)
    const contentRef = React.useRef<HTMLDivElement>(null)
    const setContentRef = React.useCallback((element: HTMLDivElement | null) => {
        contentRef.current = element
        setNode(element)
    }, [])
    const openRef = React.useRef(open)
    const offsetRef = React.useRef(0)
    const valueRef = React.useRef<SheetValue>('hidden')
    const anchorsRef = React.useRef<SheetAnchors>({})
    const draggingRef = React.useRef(false)

    // Sheets move along one axis. Offsets grow from 0 (fully shown) towards the closing edge.
    const vertical = side === 'bottom'
    const direction = side === 'left' ? -1 : 1

    // Resting positions live in CSS (see the `data-value` classes below) and animate with a CSS transition.
    // JavaScript only positions the sheet inline while a drag is in progress.
    const applyOffset = React.useCallback(
        (offset: number) => {
            offsetRef.current = offset
            const el = contentRef.current
            if (!el) return
            el.style.transform = vertical ? `translateY(${offset}px)` : `translateX(${offset * direction}px)`
        },
        [vertical, direction],
    )

    // Where the sheet is right now, including mid-transition. The computed transform is a matrix in pixels.
    const currentOffset = React.useCallback(() => {
        const el = contentRef.current
        if (!el) return 0
        const transform = getComputedStyle(el).transform
        if (transform === 'none') return 0
        const matrix = new DOMMatrixReadOnly(transform)
        return vertical ? matrix.m42 : matrix.m41 * direction
    }, [vertical, direction])

    // Anchor offsets in pixels, for deciding where a drag settles. They mirror the CSS positions.
    const measure = React.useCallback(() => {
        const el = contentRef.current
        if (!el) return anchorsRef.current
        const size = vertical ? el.offsetHeight : el.offsetWidth
        const anchors: SheetAnchors = {
            expanded: 0,
            hidden: size + (detached ? DETACHED_MARGIN : 0) + HIDDEN_PADDING,
        }
        // A bottom sheet taller than half the screen first peeks at half height.
        const half = window.innerHeight / 2
        if (vertical && !skipPartiallyExpanded && size > half) anchors.partiallyExpanded = size - half
        anchorsRef.current = anchors
        return anchors
    }, [vertical, detached, skipPartiallyExpanded])

    // Hands the position back to CSS, which transitions from wherever the sheet is to the target anchor.
    const settle = React.useCallback((target: SheetValue) => {
        valueRef.current = target
        setValue(target)
        const el = contentRef.current
        if (!el) return
        el.style.transform = ''
        delete el.dataset.dragging
    }, [])

    // Show and hide follow the open state.
    React.useLayoutEffect(() => {
        openRef.current = open
        if (!node) return
        if (open) {
            if (valueRef.current !== 'hidden') return
            const anchors = measure()
            // Resolve the hidden position first, so the change below starts a transition instead of jumping.
            void getComputedStyle(node).transform
            settle(anchors.partiallyExpanded !== undefined ? 'partiallyExpanded' : 'expanded')
        } else if (valueRef.current !== 'hidden') {
            settle('hidden')
        }
    }, [open, node, measure, settle])

    // Unmount once the closing transition ends. The timer covers cases without a transition, such as a dismiss
    // drag released exactly at the hidden position, or reduced motion.
    React.useEffect(() => {
        if (open || value !== 'hidden' || !node) return
        const done = () => {
            if (!openRef.current && valueRef.current === 'hidden') setMounted(false)
        }
        if (prefersReducedMotion()) return done()
        const onEnd = (event: TransitionEvent) => {
            if (event.target === node && event.propertyName === 'transform') done()
        }
        node.addEventListener('transitionend', onEnd)
        const timer = window.setTimeout(done, SETTLE_DURATION + 100)
        return () => {
            node.removeEventListener('transitionend', onEnd)
            window.clearTimeout(timer)
        }
    }, [open, value, node])

    // Drag to move between anchors, and to dismiss.
    React.useEffect(() => {
        const el = node
        if (!el || !gesturesEnabled) return

        let pointer: { id: number; x: number; y: number; origin: number; offset: number; from: SheetValue } | null = null
        let samples: { time: number; position: number }[] = []
        let suppressClick = false
        const position = (event: PointerEvent) => (vertical ? event.clientY : event.clientX)

        const onPointerDown = (event: PointerEvent) => {
            if (event.button !== 0 || draggingRef.current) return
            const target = event.target as HTMLElement
            if (target.closest('input, textarea, select, [contenteditable="true"], [data-sheet-no-drag]')) return
            pointer = {
                id: event.pointerId,
                x: event.clientX,
                y: event.clientY,
                origin: 0,
                offset: 0,
                from: valueRef.current,
            }
            samples = []
        }

        const onPointerMove = (event: PointerEvent) => {
            if (!pointer || event.pointerId !== pointer.id) return
            if (!draggingRef.current) {
                const dx = event.clientX - pointer.x
                const dy = event.clientY - pointer.y
                const main = vertical ? dy : dx
                const cross = vertical ? dx : dy
                if (Math.abs(main) < TOUCH_SLOP && Math.abs(cross) < TOUCH_SLOP) return
                if (Math.abs(cross) > Math.abs(main)) {
                    pointer = null
                    return
                }
                // Let scrollable content scroll unless it is already at its start edge.
                const scroller = scrollParent(event.target, el, vertical)
                const closing = main * direction > 0
                const atStart = scroller && (vertical ? scroller.scrollTop <= 0 : scroller.scrollLeft === 0)
                if (scroller && valueRef.current !== 'partiallyExpanded' && !(closing && atStart)) {
                    pointer = null
                    return
                }
                draggingRef.current = true
                // Freeze the sheet where it is, even mid-transition, and follow the pointer from there.
                measure()
                applyOffset(currentOffset())
                el.dataset.dragging = ''
                try {
                    el.setPointerCapture(event.pointerId)
                } catch {}
                document.documentElement.style.userSelect = 'none'
                pointer.origin = position(event)
                pointer.offset = offsetRef.current
                pointer.from = valueRef.current
            }
            const anchors = anchorsRef.current
            const offset = Math.min(
                Math.max(pointer.offset + (position(event) - pointer.origin) * direction, anchors.expanded!),
                anchors.hidden!,
            )
            applyOffset(offset)
            const now = performance.now()
            samples.push({ time: now, position: offset })
            samples = samples.filter(sample => now - sample.time <= 100)
        }

        const onPointerEnd = (event: PointerEvent) => {
            if (!pointer || event.pointerId !== pointer.id) return
            const from = pointer.from
            pointer = null
            if (!draggingRef.current) return
            draggingRef.current = false
            suppressClick = event.type === 'pointerup'
            document.documentElement.style.userSelect = ''

            const first = samples[0]
            const last = samples[samples.length - 1]
            const elapsed = first && last ? last.time - first.time : 0
            const velocity = elapsed > 0 ? ((last.position - first.position) / elapsed) * 1000 : 0
            const target = computeTarget(anchorsRef.current, from, offsetRef.current, velocity)
            settle(target)
            if (target === 'hidden') setOpen(false)
        }

        // Stop the browser from scrolling once a touch drags the sheet.
        const onTouchMove = (event: TouchEvent) => {
            if (draggingRef.current) event.preventDefault()
        }
        const onClick = (event: MouseEvent) => {
            if (!suppressClick) return
            suppressClick = false
            event.preventDefault()
            event.stopPropagation()
        }

        el.addEventListener('pointerdown', onPointerDown)
        el.addEventListener('pointermove', onPointerMove)
        el.addEventListener('pointerup', onPointerEnd)
        el.addEventListener('pointercancel', onPointerEnd)
        el.addEventListener('touchmove', onTouchMove, { passive: false })
        el.addEventListener('click', onClick, true)
        return () => {
            el.removeEventListener('pointerdown', onPointerDown)
            el.removeEventListener('pointermove', onPointerMove)
            el.removeEventListener('pointerup', onPointerEnd)
            el.removeEventListener('pointercancel', onPointerEnd)
            el.removeEventListener('touchmove', onTouchMove)
            el.removeEventListener('click', onClick, true)
            if (draggingRef.current) document.documentElement.style.userSelect = ''
            draggingRef.current = false
        }
    }, [node, gesturesEnabled, vertical, direction, measure, applyOffset, currentOffset, settle, setOpen])

    const contentContext = React.useMemo(
        () => ({
            side,
            value,
            hasPartiallyExpanded: vertical && !skipPartiallyExpanded,
            settle,
        }),
        [side, value, vertical, skipPartiallyExpanded, settle],
    )

    if (!mounted) return null

    return (
        <DialogPrimitive.Portal forceMount data-slot='sheet-portal'>
            <SheetOverlay visible={value !== 'hidden'} />
            <DialogPrimitive.Content
                ref={setContentRef}
                forceMount
                data-slot='sheet-content'
                data-side={side}
                data-value={value}
                data-detached={detached}
                data-modal={modal}
                onOpenAutoFocus={event => {
                    onOpenAutoFocus?.(event)
                    if (event.defaultPrevented) return
                    // Focus the sheet itself rather than its drag handle, like Compose.
                    event.preventDefault()
                    contentRef.current?.focus({ preventScroll: true })
                }}
                onInteractOutside={event => {
                    onInteractOutside?.(event)
                    // Standard sheets live alongside the page, so outside presses keep them open.
                    if (!modal) event.preventDefault()
                }}
                className={cn(
                    'group/sheet fixed z-50 flex flex-col bg-surface-container-low text-on-surface outline-none',
                    // The expressive spatial spring, sampled into a CSS easing. Drags turn it off to follow the pointer.
                    'transition-transform duration-500 ease-[linear(0,0.066,0.213,0.383,0.546,0.685,0.796,0.878,0.935,0.973,0.996,1.008,1.014,1.015,1.014,1.012,1.009,1.007,1.005,1.003,1.002,1.001,1,1,1)] will-change-transform data-dragging:transition-none motion-reduce:transition-none',
                    modal && 'shadow-elevation-1',
                    side === 'bottom' && [
                        // Partially expanded sheets show their top half of the screen; shorter sheets stay fully open.
                        'data-[value=partiallyExpanded]:[transform:translateY(max(0px,calc(100%_-_50dvh)))]',
                        detached
                            ? 'data-[value=hidden]:[transform:translateY(calc(100%_+_24px))]'
                            : 'data-[value=hidden]:[transform:translateY(calc(100%_+_8px))]',
                        'inset-x-0 bottom-0 mx-auto max-h-[calc(100dvh-72px)] w-full max-w-160 rounded-t-[28px] pb-[env(safe-area-inset-bottom)]',
                        // Covers the gap behind the sheet when the spring overshoots.
                        !detached && 'after:absolute after:inset-x-0 after:top-full after:h-20 after:bg-inherit',
                        detached && 'inset-x-4 bottom-4 max-h-[calc(100dvh-88px)] w-auto rounded-[28px]',
                    ],
                    side !== 'bottom' && [
                        'inset-y-0 w-100 max-w-[calc(100%-56px)]',
                        !detached && 'after:absolute after:inset-y-0 after:w-20 after:bg-inherit',
                        detached && 'inset-y-4 max-w-[calc(100%-32px)] rounded-2xl',
                        !modal && !detached && 'bg-surface',
                    ],
                    side === 'right' && [
                        'right-0 after:left-full',
                        detached
                            ? 'data-[value=hidden]:[transform:translateX(calc(100%_+_24px))]'
                            : 'data-[value=hidden]:[transform:translateX(calc(100%_+_8px))]',
                        detached ? 'right-4' : modal ? 'rounded-l-2xl' : 'border-l border-outline-variant',
                    ],
                    side === 'left' && [
                        'left-0 after:right-full',
                        detached
                            ? 'data-[value=hidden]:[transform:translateX(calc(-100%_-_24px))]'
                            : 'data-[value=hidden]:[transform:translateX(calc(-100%_-_8px))]',
                        detached ? 'left-4' : modal ? 'rounded-r-2xl' : 'border-r border-outline-variant',
                    ],
                    className,
                )}
                {...props}
            >
                <SheetContentContext.Provider value={contentContext}>
                    {showDragHandle && <SheetDragHandle />}
                    {children}
                </SheetContentContext.Provider>
            </DialogPrimitive.Content>
        </DialogPrimitive.Portal>
    )
}

function SheetDragHandle({ className, onClick, ...props }: React.ComponentProps<'button'>) {
    const context = React.useContext(SheetContentContext)
    const { setOpen } = useSheet()
    const value = context?.value
    const canCollapse = !!context?.hasPartiallyExpanded && value === 'expanded'
    const label = value === 'partiallyExpanded' ? 'Expand' : canCollapse ? 'Collapse' : 'Dismiss'

    return (
        <button
            type='button'
            data-slot='sheet-drag-handle'
            aria-label={label}
            className={cn(
                'group/handle mx-auto flex h-12 w-12 shrink-0 cursor-grab touch-none items-center justify-center rounded-full outline-none active:cursor-grabbing',
                className,
            )}
            onClick={event => {
                onClick?.(event)
                if (event.defaultPrevented || !context) return
                if (value === 'partiallyExpanded') context.settle('expanded')
                else if (canCollapse) context.settle('partiallyExpanded')
                else setOpen(false)
            }}
            {...props}
        >
            <span className='h-1 w-8 rounded-full bg-on-surface-variant group-focus-visible/handle:outline-2 group-focus-visible/handle:outline-offset-4 group-focus-visible/handle:outline-secondary' />
        </button>
    )
}

function SheetHeader({ className, ...props }: React.ComponentProps<'div'>) {
    return (
        <div
            data-slot='sheet-header'
            className={cn(
                'flex min-h-18 shrink-0 touch-none items-center gap-1 py-3 pr-3 pl-6 group-data-[side=bottom]/sheet:min-h-14 group-data-[side=bottom]/sheet:pt-0 has-[>button:first-child]:pl-3 [&>button]:shrink-0',
                className,
            )}
            {...props}
        />
    )
}

function SheetTitle({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Title>) {
    return (
        <DialogPrimitive.Title
            data-slot='sheet-title'
            className={cn('min-w-0 flex-1 text-[22px] leading-7 text-on-surface-variant', className)}
            {...props}
        />
    )
}

function SheetDescription({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Description>) {
    return (
        <DialogPrimitive.Description
            data-slot='sheet-description'
            className={cn('text-sm text-on-surface-variant', className)}
            {...props}
        />
    )
}

function SheetBody({ className, ...props }: React.ComponentProps<'div'>) {
    return (
        <div
            data-slot='sheet-body'
            className={cn('min-h-0 flex-1 overflow-y-auto overscroll-contain px-6 pb-6', className)}
            {...props}
        />
    )
}

function SheetFooter({ className, ...props }: React.ComponentProps<'div'>) {
    return (
        <div
            data-slot='sheet-footer'
            className={cn('mt-auto flex shrink-0 items-center gap-2 border-t border-outline-variant px-6 pt-4 pb-6', className)}
            {...props}
        />
    )
}

function SheetCloseButton({ className, children, ...props }: React.ComponentProps<typeof Button>) {
    return (
        <DialogPrimitive.Close asChild>
            <Button
                data-slot='sheet-close-button'
                variant='text'
                icon
                aria-label='Close'
                className={cn('ml-auto text-on-surface-variant', className)}
                {...props}
            >
                {children ?? <i className='icon-[material-symbols--close-rounded] size-6' />}
            </Button>
        </DialogPrimitive.Close>
    )
}

export {
    Sheet,
    SheetBody,
    SheetClose,
    SheetCloseButton,
    SheetContent,
    SheetDescription,
    SheetDragHandle,
    SheetFooter,
    SheetHeader,
    SheetOverlay,
    SheetTitle,
    SheetTrigger,
}
export type { SheetSide, SheetValue }
