'use client'

import * as React from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'

import { cn } from '@/lib/utils'
import { Button } from './button'

type SheetSide = 'bottom' | 'left' | 'right'
type SheetValue = 'hidden' | 'partiallyExpanded' | 'expanded'
type SheetAnchors = Partial<Record<SheetValue, number>>

// MotionScheme.expressive() defaultSpatialSpec, used by Compose to settle sheets.
const SPRING_DAMPING = 0.8
const SPRING_STIFFNESS = 380
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
    animateTo: (value: SheetValue) => void
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
                'fixed inset-0 z-50 bg-scrim/32 opacity-0 transition-opacity duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] starting:opacity-0 data-[visible=true]:opacity-100',
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
    const frameRef = React.useRef(0)
    const targetRef = React.useRef<SheetValue | null>(null)
    const velocityRef = React.useRef(0)
    const draggingRef = React.useRef(false)

    // Sheets move along one axis. Offsets grow from 0 (fully shown) towards the closing edge.
    const vertical = side === 'bottom'
    const direction = side === 'left' ? -1 : 1

    const applyOffset = React.useCallback(
        (offset: number) => {
            offsetRef.current = offset
            const el = contentRef.current
            if (!el) return
            el.style.transform = vertical ? `translateY(${offset}px)` : `translateX(${offset * direction}px)`
        },
        [vertical, direction],
    )

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

    const stop = React.useCallback(() => {
        cancelAnimationFrame(frameRef.current)
        frameRef.current = 0
        targetRef.current = null
    }, [])

    const animateTo = React.useCallback(
        (target: SheetValue, initialVelocity = 0) => {
            stop()
            const anchors = anchorsRef.current
            const to = anchors[target] ?? anchors.expanded ?? 0
            valueRef.current = target
            setValue(target)

            const finish = () => {
                stop()
                velocityRef.current = 0
                applyOffset(to)
                if (target === 'hidden' && !openRef.current) setMounted(false)
            }
            if (prefersReducedMotion()) return finish()

            // Damped spring, solved in closed form so frame drops do not change the path.
            const omega = Math.sqrt(SPRING_STIFFNESS)
            const decay = SPRING_DAMPING * omega
            const omegaD = omega * Math.sqrt(1 - SPRING_DAMPING * SPRING_DAMPING)
            const a = offsetRef.current - to
            const b = (initialVelocity + decay * a) / omegaD
            const start = performance.now()
            targetRef.current = target

            const step = (now: number) => {
                const t = (now - start) / 1000
                const envelope = Math.exp(-decay * t)
                const cos = Math.cos(omegaD * t)
                const sin = Math.sin(omegaD * t)
                const x = envelope * (a * cos + b * sin)
                const v = envelope * (-decay * (a * cos + b * sin) + omegaD * (b * cos - a * sin))
                velocityRef.current = v
                if (Math.abs(x) < 0.5 && Math.abs(v) < 10) return finish()
                applyOffset(to + x)
                frameRef.current = requestAnimationFrame(step)
            }
            frameRef.current = requestAnimationFrame(step)
        },
        [applyOffset, stop],
    )

    // Show and hide follow the open state.
    React.useLayoutEffect(() => {
        openRef.current = open
        if (!node) return
        if (open) {
            const anchors = measure()
            if (valueRef.current === 'hidden' && targetRef.current === null) applyOffset(anchors.hidden!)
            if (valueRef.current === 'hidden') animateTo(anchors.partiallyExpanded !== undefined ? 'partiallyExpanded' : 'expanded')
        } else if (valueRef.current !== 'hidden') {
            animateTo('hidden', velocityRef.current)
        } else if (targetRef.current === null) {
            // Already hidden, for example after a dismiss drag without motion.
            setMounted(false)
        }
    }, [open, node, measure, applyOffset, animateTo])

    // Keep the sheet on its anchor when its content or the window resizes.
    React.useEffect(() => {
        const el = node
        if (!el) return
        const update = () => {
            const anchors = measure()
            if (draggingRef.current) return
            let target = targetRef.current ?? valueRef.current
            if (target === 'partiallyExpanded' && anchors.partiallyExpanded === undefined) target = 'expanded'
            if (targetRef.current !== null) animateTo(target, velocityRef.current)
            else if (target !== valueRef.current) animateTo(target)
            else applyOffset(anchors[target]!)
        }
        const observer = new ResizeObserver(update)
        observer.observe(el)
        window.addEventListener('resize', update)
        return () => {
            observer.disconnect()
            window.removeEventListener('resize', update)
        }
    }, [node, measure, animateTo, applyOffset])

    React.useEffect(() => stop, [stop])

    // Drag to move between anchors, and to dismiss.
    React.useEffect(() => {
        const el = node
        if (!el || !gesturesEnabled) return

        let pointer: { id: number; x: number; y: number; origin: number; offset: number; from: SheetValue } | null =
            null
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
                stop()
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
            animateTo(target, velocity)
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
    }, [node, gesturesEnabled, vertical, direction, applyOffset, animateTo, stop, setOpen])

    const contentContext = React.useMemo(
        () => ({
            side,
            value,
            hasPartiallyExpanded: vertical && !skipPartiallyExpanded,
            animateTo: (next: SheetValue) => animateTo(next),
        }),
        [side, value, vertical, skipPartiallyExpanded, animateTo],
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
                    'group/sheet fixed z-50 flex flex-col bg-surface-container-low text-on-surface outline-none will-change-transform',
                    modal && 'shadow-elevation-1',
                    side === 'bottom' && [
                        'inset-x-0 bottom-0 mx-auto max-h-[calc(100dvh-72px)] w-full max-w-160 rounded-t-[28px] pb-[env(safe-area-inset-bottom)]',
                        // Covers the gap behind the sheet when the spring overshoots.
                        !detached && 'after:absolute after:inset-x-0 after:top-full after:h-20 after:bg-inherit',
                        detached && 'inset-x-4 bottom-4 w-auto max-h-[calc(100dvh-88px)] rounded-[28px]',
                    ],
                    side !== 'bottom' && [
                        'inset-y-0 w-100 max-w-[calc(100%-56px)]',
                        !detached && 'after:absolute after:inset-y-0 after:w-20 after:bg-inherit',
                        detached && 'inset-y-4 max-w-[calc(100%-32px)] rounded-2xl',
                        !modal && !detached && 'bg-surface',
                    ],
                    side === 'right' && [
                        'right-0 after:left-full',
                        detached ? 'right-4' : modal ? 'rounded-l-2xl' : 'border-l border-outline-variant',
                    ],
                    side === 'left' && [
                        'left-0 after:right-full',
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
                if (value === 'partiallyExpanded') context.animateTo('expanded')
                else if (canCollapse) context.animateTo('partiallyExpanded')
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
                'flex min-h-18 shrink-0 touch-none items-center gap-1 py-3 pr-3 pl-6 has-[>button:first-child]:pl-3 group-data-[side=bottom]/sheet:min-h-14 group-data-[side=bottom]/sheet:pt-0 [&>button]:shrink-0',
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
            className={cn(
                'min-w-0 flex-1 text-[22px] leading-7 text-on-surface-variant',
                className,
            )}
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
            className={cn(
                'mt-auto flex shrink-0 items-center gap-2 border-t border-outline-variant px-6 pt-4 pb-6',
                className,
            )}
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
