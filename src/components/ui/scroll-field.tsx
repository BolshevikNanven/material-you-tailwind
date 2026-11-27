'use client'

import * as React from 'react'

import { cn } from '@/lib/utils'

type ScrollFieldValue = number | string
type ScrollFieldSize = 'small' | 'medium' | 'large'

type ScrollFieldProps = Omit<React.ComponentProps<'div'>, 'defaultValue' | 'onChange' | 'children'> & {
    min?: number
    max?: number
    step?: number
    options?: readonly string[]
    value?: ScrollFieldValue
    defaultValue?: ScrollFieldValue
    onValueChange?: (value: ScrollFieldValue) => void
    loop?: boolean
    size?: ScrollFieldSize
    disabled?: boolean
    editable?: boolean
    formatValue?: (value: ScrollFieldValue) => string
    name?: string
}

type Spring = { stiffness: number; dampingRatio: number }

// Each option sits in a 52dp slot, so adjacent display-medium labels keep a 16dp gap.
const ITEM_HEIGHT = 52
// Labels render at display large (57sp) and scale down to display medium (45sp) when not selected.
const UNSELECTED_SCALE = 45 / 57
const DRAG_THRESHOLD = 4
const OVERSCROLL_RESISTANCE = 0.35
const FLING_PROJECTION = 0.3
const WHEEL_SETTLE_MS = 90
const TYPEAHEAD_RESET_MS = 600

// Material 3 Expressive motion scheme springs.
const FAST_SPATIAL: Spring = { stiffness: 1400, dampingRatio: 0.9 }
const FLING_SPATIAL: Spring = { stiffness: 300, dampingRatio: 1 }

const sizeClasses: Record<ScrollFieldSize, string> = {
    small: 'w-[100px]',
    medium: 'w-[146px]',
    large: 'w-[192px]',
}

const mod = (value: number, count: number) => ((value % count) + count) % count
const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max)

function decimalsOf(step: number) {
    const [, fraction = ''] = String(step).split('.')
    return fraction.length
}

function defaultFormat(value: ScrollFieldValue, decimals: number) {
    if (typeof value === 'string') return value
    if (decimals > 0) return value.toFixed(decimals)
    return value < 0 ? String(value) : String(value).padStart(2, '0')
}

function ScrollField({
    min = 0,
    max = 99,
    step = 1,
    options,
    value,
    defaultValue,
    onValueChange,
    loop = true,
    size = 'small',
    disabled = false,
    editable = true,
    formatValue,
    name,
    className,
    style,
    ref,
    onKeyDown,
    ...props
}: ScrollFieldProps) {
    const decimals = decimalsOf(step)
    const numeric = !options
    const values = React.useMemo<ScrollFieldValue[]>(() => {
        if (options) return [...options]
        const count = Math.max(1, Math.floor((max - min) / step + 1e-9) + 1)
        return Array.from({ length: count }, (_, index) => Number((min + index * step).toFixed(decimals)))
    }, [options, min, max, step, decimals])
    const count = values.length
    const format = React.useCallback(
        (option: ScrollFieldValue) => (formatValue ? formatValue(option) : defaultFormat(option, decimals)),
        [formatValue, decimals],
    )
    const indexOf = React.useCallback(
        (option: ScrollFieldValue | undefined) => {
            if (option === undefined) return 0
            if (typeof option === 'number' && numeric) return clamp(Math.round((option - min) / step), 0, count - 1)
            return Math.max(0, values.indexOf(option))
        },
        [numeric, min, step, count, values],
    )
    const selectedOf = React.useCallback(
        (position: number) => (loop ? mod(Math.round(position), count) : clamp(Math.round(position), 0, count - 1)),
        [loop, count],
    )

    const [offset, setOffset] = React.useState(() => indexOf(value ?? defaultValue))
    const [height, setHeight] = React.useState(120)
    const [draft, setDraft] = React.useState<string | null>(null)

    const rootRef = React.useRef<HTMLDivElement>(null)
    const inputRef = React.useRef<HTMLInputElement>(null)
    const offsetRef = React.useRef(offset)
    const selectedRef = React.useRef(selectedOf(offset))
    const frameRef = React.useRef<number | null>(null)
    const targetRef = React.useRef<number | null>(null)
    const silentRef = React.useRef(false)
    const interactingRef = React.useRef(false)
    const wheelTimerRef = React.useRef<number | null>(null)
    const draftRef = React.useRef<string | null>(null)
    const selectDraftRef = React.useRef(false)
    const typeaheadRef = React.useRef({ text: '', time: 0 })
    const dragRef = React.useRef<{
        pointerId: number
        startY: number
        startOffset: number
        moved: boolean
        samples: { time: number; y: number }[]
    } | null>(null)

    const latest = React.useRef({ value, onValueChange, values, indexOf })
    React.useEffect(() => {
        latest.current = { value, onValueChange, values, indexOf }
    })

    const restrict = React.useCallback(
        (position: number) => {
            if (loop) return position
            const last = count - 1
            if (position < 0) return position * OVERSCROLL_RESISTANCE
            if (position > last) return last + (position - last) * OVERSCROLL_RESISTANCE
            return position
        },
        [loop, count],
    )

    const commitSelection = React.useCallback(() => {
        const selected = selectedOf(offsetRef.current)
        if (selected === selectedRef.current) return
        selectedRef.current = selected
        latest.current.onValueChange?.(latest.current.values[selected])
    }, [selectedOf])

    const moveTo = React.useCallback(
        (position: number) => {
            offsetRef.current = position
            setOffset(position)
            if (!silentRef.current) commitSelection()
        },
        [commitSelection],
    )

    const stop = React.useCallback(() => {
        if (frameRef.current !== null) cancelAnimationFrame(frameRef.current)
        frameRef.current = null
        targetRef.current = null
    }, [])

    const settleRef = React.useRef<() => void>(() => {})

    const animate = React.useCallback(
        (target: number, spring: Spring, velocity = 0) => {
            if (frameRef.current !== null) cancelAnimationFrame(frameRef.current)
            targetRef.current = target
            const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
            if (reduceMotion) {
                moveTo(target)
                targetRef.current = null
                settleRef.current()
                return
            }
            const { stiffness, dampingRatio } = spring
            const damping = 2 * dampingRatio * Math.sqrt(stiffness)
            let position = offsetRef.current
            let speed = velocity
            let last = performance.now()
            const tick = (now: number) => {
                let elapsed = Math.min((now - last) / 1000, 1 / 20)
                last = now
                while (elapsed > 0) {
                    const dt = Math.min(elapsed, 1 / 240)
                    const acceleration = -stiffness * (position - target) - damping * speed
                    speed += acceleration * dt
                    position += speed * dt
                    elapsed -= dt
                }
                if (Math.abs(position - target) < 0.001 && Math.abs(speed) < 0.01) {
                    frameRef.current = null
                    targetRef.current = null
                    moveTo(target)
                    settleRef.current()
                    return
                }
                moveTo(position)
                frameRef.current = requestAnimationFrame(tick)
            }
            frameRef.current = requestAnimationFrame(tick)
        },
        [moveTo],
    )

    // The position of `index` closest to the current one, wrapping when the field loops.
    const nearestPosition = React.useCallback(
        (index: number) => {
            if (!loop) return clamp(index, 0, count - 1)
            const base = Math.round(targetRef.current ?? offsetRef.current)
            let diff = index - mod(base, count)
            if (diff > count / 2) diff -= count
            if (diff < -count / 2) diff += count
            return base + diff
        },
        [loop, count],
    )

    const stepBy = React.useCallback(
        (delta: number) => {
            interactingRef.current = true
            const base = Math.round(targetRef.current ?? offsetRef.current)
            const target = loop ? base + delta : clamp(base + delta, 0, count - 1)
            animate(target, FAST_SPATIAL)
        },
        [animate, loop, count],
    )

    const selectIndex = React.useCallback(
        (index: number) => {
            interactingRef.current = true
            animate(nearestPosition(index), FAST_SPATIAL)
        },
        [animate, nearestPosition],
    )

    const settle = React.useCallback(() => {
        silentRef.current = false
        interactingRef.current = false
        const { value: controlled, indexOf: resolve } = latest.current
        if (controlled === undefined) {
            commitSelection()
            return
        }
        // A controlled field whose value was not updated returns to that value.
        selectedRef.current = selectedOf(offsetRef.current)
        const wanted = resolve(controlled)
        if (wanted === selectedRef.current) return
        selectedRef.current = wanted
        silentRef.current = true
        animate(nearestPosition(wanted), FAST_SPATIAL)
    }, [commitSelection, selectedOf, animate, nearestPosition])

    React.useEffect(() => {
        settleRef.current = settle
    }, [settle])

    // Follow a controlled value.
    React.useEffect(() => {
        if (value === undefined || interactingRef.current) return
        const wanted = indexOf(value)
        if (wanted === selectedRef.current) return
        selectedRef.current = wanted
        silentRef.current = true
        animate(nearestPosition(wanted), FAST_SPATIAL)
    }, [value, indexOf, animate, nearestPosition])

    // Keep the position inside a finite range when the options change.
    React.useEffect(() => {
        if (loop || interactingRef.current) return
        const position = clamp(Math.round(offsetRef.current), 0, count - 1)
        if (position !== offsetRef.current) {
            stop()
            moveTo(position)
        }
    }, [loop, count, moveTo, stop])

    React.useEffect(() => {
        const root = rootRef.current
        if (!root) return
        const observer = new ResizeObserver(([entry]) => setHeight(entry.contentRect.height))
        observer.observe(root)
        return () => observer.disconnect()
    }, [])

    React.useEffect(
        () => () => {
            if (frameRef.current !== null) cancelAnimationFrame(frameRef.current)
            if (wheelTimerRef.current !== null) window.clearTimeout(wheelTimerRef.current)
        },
        [],
    )

    // Wheel needs a non-passive listener to keep the page from scrolling.
    React.useEffect(() => {
        const root = rootRef.current
        if (!root || disabled) return
        const onWheel = (event: WheelEvent) => {
            if (draftRef.current !== null) return
            event.preventDefault()
            const delta =
                event.deltaMode === 1 ? event.deltaY * 16 : event.deltaMode === 2 ? event.deltaY * height : event.deltaY
            if (delta === 0) return
            const notched = event.deltaMode !== 0 || (Math.abs(delta) >= 40 && Number.isInteger(delta))
            if (notched) {
                stepBy(Math.sign(delta))
                return
            }
            // Trackpads scroll continuously, then snap once the gesture goes quiet.
            stop()
            interactingRef.current = true
            const raw = offsetRef.current + delta / ITEM_HEIGHT
            moveTo(loop ? raw : clamp(raw, -0.5, count - 0.5))
            if (wheelTimerRef.current !== null) window.clearTimeout(wheelTimerRef.current)
            wheelTimerRef.current = window.setTimeout(() => {
                wheelTimerRef.current = null
                animate(nearestPosition(selectedOf(offsetRef.current)), FAST_SPATIAL)
            }, WHEEL_SETTLE_MS)
        }
        root.addEventListener('wheel', onWheel, { passive: false })
        return () => root.removeEventListener('wheel', onWheel)
    }, [disabled, height, loop, count, stepBy, stop, moveTo, animate, nearestPosition, selectedOf])

    const startEditing = (text: string, selectAll: boolean) => {
        if (!editable || !numeric || disabled) return
        // Snap to the nearest option before editing it.
        const target = targetRef.current ?? Math.round(offsetRef.current)
        stop()
        silentRef.current = false
        moveTo(loop ? target : clamp(target, 0, count - 1))
        settle()
        selectDraftRef.current = selectAll
        draftRef.current = text
        setDraft(text)
    }

    React.useLayoutEffect(() => {
        const input = inputRef.current
        if (draft === null || !input || document.activeElement === input) return
        input.focus()
        if (selectDraftRef.current) input.select()
        else input.setSelectionRange(input.value.length, input.value.length)
    }, [draft])

    const finishEditing = (apply: boolean) => {
        const text = draftRef.current
        if (text === null) return
        draftRef.current = null
        setDraft(null)
        if (!apply) return
        const parsed = Number.parseFloat(text)
        if (Number.isNaN(parsed)) return
        selectIndex(clamp(Math.round((parsed - min) / step), 0, count - 1))
    }

    const typeahead = (key: string) => {
        const now = performance.now()
        const state = typeaheadRef.current
        state.text = now - state.time > TYPEAHEAD_RESET_MS ? key : state.text + key
        state.time = now
        const query = state.text.toLowerCase()
        // A new search starts after the current option, a longer query may keep it.
        const first = state.text.length > 1 ? 0 : 1
        for (let i = first; i < first + count; i++) {
            const index = (selectedRef.current + i) % count
            if (format(values[index]).toLowerCase().startsWith(query)) {
                selectIndex(index)
                return
            }
        }
    }

    const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
        onKeyDown?.(event)
        if (event.defaultPrevented || disabled || event.target !== event.currentTarget) return
        const page = Math.max(1, Math.round(count / 10))
        switch (event.key) {
            case 'ArrowUp':
                stepBy(-1)
                break
            case 'ArrowDown':
                stepBy(1)
                break
            case 'PageUp':
                stepBy(-page)
                break
            case 'PageDown':
                stepBy(page)
                break
            case 'Home':
                selectIndex(0)
                break
            case 'End':
                selectIndex(count - 1)
                break
            case 'Enter':
            case 'F2':
                if (!editable || !numeric) return
                startEditing(format(values[selectedRef.current]), true)
                break
            default:
                if (event.key.length !== 1 || event.metaKey || event.ctrlKey || event.altKey) return
                if (numeric) {
                    if (!/[\d.-]/.test(event.key)) return
                    startEditing(event.key, false)
                } else if (event.key.trim()) {
                    typeahead(event.key)
                } else {
                    return
                }
        }
        event.preventDefault()
    }

    const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
        if (disabled || !event.isPrimary || event.button !== 0) return
        if (event.target instanceof HTMLInputElement) return
        if (draftRef.current !== null) {
            // Pressing outside the input ends editing instead of starting a drag.
            event.preventDefault()
            finishEditing(true)
            event.currentTarget.focus()
            return
        }
        stop()
        if (wheelTimerRef.current !== null) window.clearTimeout(wheelTimerRef.current)
        interactingRef.current = true
        silentRef.current = false
        event.currentTarget.setPointerCapture(event.pointerId)
        dragRef.current = {
            pointerId: event.pointerId,
            startY: event.clientY,
            startOffset: offsetRef.current,
            moved: false,
            samples: [{ time: event.timeStamp, y: event.clientY }],
        }
    }

    const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
        const drag = dragRef.current
        if (!drag || drag.pointerId !== event.pointerId) return
        const distance = event.clientY - drag.startY
        if (!drag.moved && Math.abs(distance) < DRAG_THRESHOLD) return
        drag.moved = true
        drag.samples.push({ time: event.timeStamp, y: event.clientY })
        if (drag.samples.length > 8) drag.samples.shift()
        moveTo(restrict(drag.startOffset - distance / ITEM_HEIGHT))
    }

    const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
        const drag = dragRef.current
        if (!drag || drag.pointerId !== event.pointerId) return
        dragRef.current = null
        if (!drag.moved) {
            const rect = event.currentTarget.getBoundingClientRect()
            const slot = Math.round((event.clientY - (rect.top + rect.height / 2)) / ITEM_HEIGHT)
            const position = Math.round(offsetRef.current) + slot
            if (!loop && (position < 0 || position > count - 1)) {
                animate(clamp(Math.round(offsetRef.current), 0, count - 1), FAST_SPATIAL)
            } else if (slot === 0 && editable && numeric) {
                startEditing(format(values[selectedOf(position)]), true)
            } else {
                animate(position, FAST_SPATIAL)
            }
            return
        }
        const recent = drag.samples.filter(sample => event.timeStamp - sample.time < 100)
        const first = recent[0] ?? drag.samples[0]
        const elapsed = (event.timeStamp - first.time) / 1000
        const velocity = elapsed > 0 ? -(event.clientY - first.y) / ITEM_HEIGHT / elapsed : 0
        const projected = Math.round(offsetRef.current + velocity * FLING_PROJECTION)
        const target = loop ? projected : clamp(projected, 0, count - 1)
        animate(target, FLING_SPATIAL, velocity)
    }

    const handlePointerCancel = (event: React.PointerEvent<HTMLDivElement>) => {
        if (dragRef.current?.pointerId !== event.pointerId) return
        dragRef.current = null
        animate(nearestPosition(selectedOf(offsetRef.current)), FAST_SPATIAL)
    }

    const setRefs = (node: HTMLDivElement | null) => {
        rootRef.current = node
        if (typeof ref === 'function') ref(node)
        else if (ref) ref.current = node
    }

    const selectedIndex = selectedOf(offset)
    const selectedValue = values[selectedIndex]
    const center = Math.round(offset)
    const radius = Math.ceil(height / 2 / ITEM_HEIGHT) + 1
    const maxLength = numeric ? Math.max(format(min).length, format(values[count - 1]).length) : undefined
    const items: React.ReactNode[] = []

    for (let position = center - radius; position <= center + radius; position++) {
        if (!loop && (position < 0 || position > count - 1)) continue
        const option = values[mod(position, count)]
        const selected = position === (loop ? center : clamp(center, 0, count - 1))
        const editing = selected && draft !== null
        items.push(
            <div
                key={position}
                data-slot='scroll-field-item'
                data-selected={selected || undefined}
                className='pointer-events-none absolute inset-x-0 top-1/2 flex h-[52px] items-center justify-center'
                style={{ transform: `translateY(${(position - offset - 0.5) * ITEM_HEIGHT}px)` }}
            >
                {editing ? (
                    <input
                        ref={inputRef}
                        aria-label={props['aria-label'] ?? 'Value'}
                        inputMode={decimals > 0 || min < 0 ? 'decimal' : 'numeric'}
                        maxLength={maxLength}
                        value={draft}
                        onChange={event => {
                            const next = event.target.value.replace(min < 0 ? /[^\d.-]/g : /[^\d.]/g, '')
                            draftRef.current = next
                            setDraft(next)
                        }}
                        onKeyDown={event => {
                            if (event.key === 'Enter') {
                                event.preventDefault()
                                finishEditing(true)
                                rootRef.current?.focus()
                            } else if (event.key === 'Escape') {
                                event.preventDefault()
                                finishEditing(false)
                                rootRef.current?.focus()
                            }
                        }}
                        onBlur={() => finishEditing(true)}
                        className='pointer-events-auto h-16 w-full min-w-0 bg-transparent text-center text-[57px] leading-16 font-medium tracking-[-0.25px] text-on-surface caret-primary outline-none selection:bg-primary-container selection:text-on-primary-container'
                    />
                ) : (
                    <span
                        className={cn(
                            'text-[57px] leading-16 tracking-[-0.25px] whitespace-nowrap [transition:transform_350ms_cubic-bezier(0.42,1.67,0.21,0.9),color_150ms_cubic-bezier(0.2,0,0,1),font-weight_150ms_cubic-bezier(0.2,0,0,1)]',
                            selected ? 'font-medium' : 'font-normal',
                            disabled ? 'text-on-surface/38' : selected ? 'text-on-surface' : 'text-outline',
                        )}
                        style={{ transform: `scale(${selected ? 1 : UNSELECTED_SCALE})` }}
                    >
                        {format(option)}
                    </span>
                )}
            </div>,
        )
    }

    return (
        <div
            {...props}
            ref={setRefs}
            role='spinbutton'
            tabIndex={disabled ? -1 : 0}
            aria-disabled={disabled || undefined}
            aria-valuenow={typeof selectedValue === 'number' ? selectedValue : undefined}
            aria-valuemin={numeric ? min : undefined}
            aria-valuemax={numeric ? (values[count - 1] as number) : undefined}
            aria-valuetext={format(selectedValue)}
            data-slot='scroll-field'
            data-disabled={disabled || undefined}
            data-editing={draft !== null || undefined}
            className={cn(
                'relative h-[120px] shrink-0 touch-none overflow-hidden rounded-2xl bg-surface-container-lowest outline-none select-none',
                'after:pointer-events-none after:absolute after:inset-0 after:bg-on-surface after:opacity-0 after:transition-opacity focus-visible:after:opacity-10',
                'focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-secondary focus-visible:outline-solid',
                'data-editing:outline-2 data-editing:-outline-offset-2 data-editing:outline-primary data-editing:outline-solid',
                'data-disabled:pointer-events-none data-disabled:bg-surface-container-lowest/38',
                sizeClasses[size],
                className,
            )}
            style={style}
            onKeyDown={handleKeyDown}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerCancel}
        >
            {items}
            {name && <input type='hidden' name={name} value={String(selectedValue)} />}
        </div>
    )
}

function ScrollFieldGroup({ className, ...props }: React.ComponentProps<'div'>) {
    return (
        <div
            role='group'
            data-slot='scroll-field-group'
            className={cn('inline-flex items-center gap-2 rounded-[28px] bg-surface-container-highest p-3', className)}
            {...props}
        />
    )
}

function ScrollFieldSeparator({ className, children = ':', ...props }: React.ComponentProps<'span'>) {
    return (
        <span
            aria-hidden
            data-slot='scroll-field-separator'
            className={cn('-translate-y-1 text-[57px] leading-16 text-on-surface-variant select-none', className)}
            {...props}
        >
            {children}
        </span>
    )
}

export { ScrollField, ScrollFieldGroup, ScrollFieldSeparator }
export type { ScrollFieldProps, ScrollFieldValue, ScrollFieldSize }
