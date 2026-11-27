'use client'

import * as React from 'react'

import { cn } from '@/lib/utils'
import { Button } from './button'
import { Ripple } from './ripple'
import { ScrollField } from './scroll-field'
import { Tooltip, TooltipContent, TooltipTrigger } from './tooltip'

type TimePickerValue = { hour: number; minute: number }
type TimePickerMode = 'clock' | 'input' | 'scroll'
type TimePickerSelection = 'hour' | 'minute'
type TimePickerOrientation = 'vertical' | 'horizontal'

type TimePickerProps = Omit<React.ComponentProps<'div'>, 'defaultValue' | 'onChange'> & {
    value?: TimePickerValue
    defaultValue?: TimePickerValue
    onValueChange?: (value: TimePickerValue) => void
    is24Hour?: boolean
    mode?: TimePickerMode
    defaultMode?: TimePickerMode
    onModeChange?: (mode: TimePickerMode) => void
    orientation?: TimePickerOrientation
}

type TimePickerContextValue = {
    hour: number
    minute: number
    is24Hour: boolean
    isPm: boolean
    hourForDisplay: number
    getTime: () => TimePickerValue
    setTime: (value: TimePickerValue) => void
    selection: TimePickerSelection
    setSelection: (selection: TimePickerSelection) => void
    mode: TimePickerMode
    returnMode: Exclude<TimePickerMode, 'input'>
    setMode: (mode: TimePickerMode) => void
    orientation: TimePickerOrientation
    invalid: Record<TimePickerSelection, boolean>
    setInvalid: (field: TimePickerSelection, invalid: boolean) => void
    rootRef: React.RefObject<HTMLDivElement | null>
}

type Spring = { stiffness: number; dampingRatio: number }

// Material 3 Expressive motion scheme, default spatial spring.
const DEFAULT_SPATIAL: Spring = { stiffness: 380, dampingRatio: 0.8 }

const TAU = Math.PI * 2
const RADIANS_PER_HOUR = TAU / 12
const RADIANS_PER_MINUTE = TAU / 60
// Clock dial geometry from the Compose TimePicker specs, in dp.
const DIAL_SIZE = 256
const DIAL_CENTER = DIAL_SIZE / 2
const OUTER_RADIUS = 101
const INNER_RADIUS = 69
const HANDLE_RADIUS = 24
const CENTER_DOT_RADIUS = 4
// Presses closer to the center than this pick the inner ring of a 24 hour dial.
const MAX_DISTANCE = 74
const TOUCH_SLOP = 8
const AUTO_SWITCH_DELAY_MS = 100
const HOURS = [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
const MINUTES = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55]

const TimePickerContext = React.createContext<TimePickerContextValue | null>(null)

function useTimePicker() {
    const context = React.useContext(TimePickerContext)
    if (!context) throw new Error('TimePicker components must be used within TimePicker')
    return context
}

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max)
const pad = (value: number) => String(value).padStart(2, '0')
const mod = (value: number, count: number) => ((value % count) + count) % count

function normalizeTime(value: TimePickerValue | undefined): TimePickerValue {
    return {
        hour: clamp(Math.round(value?.hour ?? 0), 0, 23),
        minute: clamp(Math.round(value?.minute ?? 0), 0, 59),
    }
}

function displayHour(hour: number, is24Hour: boolean) {
    if (is24Hour) return hour
    return hour % 12 === 0 ? 12 : hour % 12
}

function TimePicker({
    value,
    defaultValue,
    onValueChange,
    is24Hour = false,
    mode: modeProp,
    defaultMode = 'clock',
    onModeChange,
    orientation = 'vertical',
    className,
    children,
    ref,
    ...props
}: TimePickerProps) {
    const [internalTime, setInternalTime] = React.useState(() => normalizeTime(defaultValue))
    const [internalMode, setInternalMode] = React.useState(defaultMode)
    const [returnMode, setReturnMode] = React.useState<Exclude<TimePickerMode, 'input'>>(
        defaultMode === 'input' ? 'clock' : defaultMode,
    )
    const [selection, setSelection] = React.useState<TimePickerSelection>('hour')
    const [invalid, setInvalidState] = React.useState({ hour: false, minute: false })
    const rootRef = React.useRef<HTMLDivElement>(null)

    const controlled = value !== undefined
    const { hour, minute } = controlled ? normalizeTime(value) : internalTime
    const mode = modeProp ?? internalMode
    const isPm = hour >= 12

    const timeRef = React.useRef({ hour, minute })
    const latest = React.useRef({ controlled, onValueChange, onModeChange, modeProp })
    React.useLayoutEffect(() => {
        timeRef.current = { hour, minute }
    }, [hour, minute])
    React.useEffect(() => {
        latest.current = { controlled, onValueChange, onModeChange, modeProp }
    })
    React.useEffect(() => {
        if (mode !== 'input') setReturnMode(mode)
    }, [mode])

    const getTime = React.useCallback(() => timeRef.current, [])

    const setTime = React.useCallback((next: TimePickerValue) => {
        const current = timeRef.current
        if (next.hour === current.hour && next.minute === current.minute) return
        timeRef.current = next
        if (!latest.current.controlled) setInternalTime(next)
        latest.current.onValueChange?.(next)
    }, [])

    const setMode = React.useCallback((next: TimePickerMode) => {
        if (latest.current.modeProp === undefined) setInternalMode(next)
        latest.current.onModeChange?.(next)
    }, [])

    const setInvalid = React.useCallback((field: TimePickerSelection, next: boolean) => {
        setInvalidState(current => (current[field] === next ? current : { ...current, [field]: next }))
    }, [])

    // Errors belong to the text fields, so they clear once the fields are gone.
    React.useEffect(() => {
        if (mode !== 'input') setInvalidState(current => (current.hour || current.minute ? { hour: false, minute: false } : current))
    }, [mode])

    const setRefs = (node: HTMLDivElement | null) => {
        rootRef.current = node
        if (typeof ref === 'function') ref(node)
        else if (ref) ref.current = node
    }

    const landscape = mode === 'clock' && orientation === 'horizontal'

    return (
        <TimePickerContext.Provider
            value={{
                hour,
                minute,
                is24Hour,
                isPm,
                hourForDisplay: displayHour(hour, is24Hour),
                getTime,
                setTime,
                selection,
                setSelection,
                mode,
                returnMode,
                setMode,
                orientation,
                invalid,
                setInvalid,
                rootRef,
            }}
        >
            <div
                ref={setRefs}
                role='group'
                data-slot='time-picker'
                data-mode={mode}
                data-orientation={orientation}
                className={cn(
                    'inline-flex w-fit flex-col rounded-[28px] bg-surface-container text-on-surface',
                    landscape ? 'gap-6 px-6 py-3' : 'gap-3 p-3',
                    className,
                )}
                {...props}
            >
                {children}
            </div>
        </TimePickerContext.Provider>
    )
}

function TimePickerContent(props: React.ComponentProps<'div'>) {
    const { mode } = useTimePicker()
    if (mode === 'input') return <TimePickerInput {...props} />
    if (mode === 'scroll') return <TimePickerScroll {...props} />
    return <TimePickerClock {...props} />
}

function TimeSeparator({ className }: { className?: string }) {
    return (
        <span
            aria-hidden
            data-slot='time-picker-separator'
            className={cn(
                'flex h-[120px] w-4 shrink-0 items-center justify-center text-[57px] leading-16 tracking-[-0.25px] text-on-surface select-none',
                className,
            )}
        >
            <span className='-translate-y-1'>:</span>
        </span>
    )
}

function TimeSelector({
    field,
    text,
    selected,
    invalid = false,
    className,
    onClick,
    ...props
}: React.ComponentProps<'button'> & {
    field: TimePickerSelection
    text: string
    selected: boolean
    invalid?: boolean
}) {
    const { is24Hour, setSelection } = useTimePicker()
    const number = Number(text)
    const description =
        field === 'minute' ? `${number} minutes` : is24Hour ? `${number} hours` : `${number} o'clock`

    return (
        <button
            type='button'
            role='radio'
            aria-checked={selected}
            aria-label={`${field === 'hour' ? 'Select hour' : 'Select minutes'}, ${description}`}
            data-slot='time-picker-selector'
            data-selected={selected || undefined}
            data-invalid={invalid || undefined}
            className={cn(
                'group/selector relative flex h-[120px] w-[100px] shrink-0 cursor-pointer items-center justify-center rounded-2xl text-[57px] leading-16 tracking-[-0.25px] outline-none select-none',
                'transition-[color,background-color,box-shadow] duration-150 ease-[cubic-bezier(0.2,0,0,1)]',
                'focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-secondary focus-visible:outline-solid',
                invalid
                    ? 'bg-error-container text-on-error-container'
                    : cn('bg-surface-container-lowest', selected ? 'text-primary' : 'text-on-surface'),
                selected && (invalid ? 'inset-ring-2 inset-ring-error' : 'inset-ring-2 inset-ring-primary'),
                className,
            )}
            onClick={event => {
                onClick?.(event)
                if (!event.defaultPrevented) setSelection(field)
            }}
            {...props}
        >
            <span className='absolute inset-0 rounded-[inherit] bg-current opacity-0 transition-opacity group-hover/selector:opacity-8 group-active/selector:opacity-10' />
            <Ripple />
            <span className='relative'>{text}</span>
        </button>
    )
}

function PeriodToggle({ orientation }: { orientation: TimePickerOrientation }) {
    const { isPm, invalid, getTime, setTime } = useTimePicker()
    const vertical = orientation === 'vertical'

    const choose = (pm: boolean) => {
        const time = getTime()
        if (pm === time.hour >= 12 || invalid.hour) return
        setTime({ hour: time.hour + (pm ? 12 : -12), minute: time.minute })
    }

    return (
        <div
            role='radiogroup'
            aria-label='Select AM or PM'
            data-slot='time-picker-period'
            className={cn('flex', vertical ? 'h-[120px] w-14 flex-col gap-2' : 'h-10 w-[216px] gap-4')}
        >
            {[false, true].map(pm => {
                const checked = pm === isPm
                return (
                    <button
                        key={String(pm)}
                        type='button'
                        role='radio'
                        aria-checked={checked}
                        data-state={checked ? 'on' : 'off'}
                        className={cn(
                            'group/period relative flex min-h-0 min-w-0 flex-1 cursor-pointer items-center justify-center px-1 text-base leading-6 tracking-[0.15px] outline-none select-none',
                            '[transition:border-radius_350ms_cubic-bezier(0.42,1.67,0.21,0.9),background-color_150ms_cubic-bezier(0.2,0,0,1),color_150ms_cubic-bezier(0.2,0,0,1)]',
                            'focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-secondary focus-visible:outline-solid',
                            checked
                                ? 'rounded-xl bg-primary-container font-bold text-on-primary-container'
                                : cn(
                                      'bg-surface-container-lowest font-medium text-on-surface-variant active:rounded-xl',
                                      vertical ? 'rounded-[28px]' : 'rounded-[20px]',
                                  ),
                        )}
                        onClick={() => choose(pm)}
                    >
                        <span className='absolute inset-0 rounded-[inherit] bg-current opacity-0 transition-opacity group-hover/period:opacity-8 group-active/period:opacity-10' />
                        <Ripple />
                        <span className='relative truncate'>{pm ? 'PM' : 'AM'}</span>
                    </button>
                )
            })}
        </div>
    )
}

function useSpringAngle(initial: number) {
    const [angle, setAngle] = React.useState(initial)
    const angleRef = React.useRef(initial)
    const targetRef = React.useRef(initial)
    const frameRef = React.useRef<number | null>(null)

    const cancel = React.useCallback(() => {
        if (frameRef.current !== null) cancelAnimationFrame(frameRef.current)
        frameRef.current = null
    }, [])

    const set = React.useCallback((value: number) => {
        angleRef.current = value
        setAngle(value)
    }, [])

    const snapTo = React.useCallback(
        (value: number) => {
            cancel()
            targetRef.current = value
            set(value)
        },
        [cancel, set],
    )

    const animateTo = React.useCallback(
        (target: number, spring: Spring = DEFAULT_SPATIAL) => {
            cancel()
            targetRef.current = target
            if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                set(target)
                return
            }
            const { stiffness, dampingRatio } = spring
            const damping = 2 * dampingRatio * Math.sqrt(stiffness)
            let position = angleRef.current
            let velocity = 0
            let last = performance.now()
            const tick = (now: number) => {
                let elapsed = Math.min((now - last) / 1000, 1 / 20)
                last = now
                while (elapsed > 0) {
                    const dt = Math.min(elapsed, 1 / 240)
                    velocity += (-stiffness * (position - target) - damping * velocity) * dt
                    position += velocity * dt
                    elapsed -= dt
                }
                if (Math.abs(position - target) < 0.0005 && Math.abs(velocity) < 0.005) {
                    frameRef.current = null
                    set(target)
                    return
                }
                set(position)
                frameRef.current = requestAnimationFrame(tick)
            }
            frameRef.current = requestAnimationFrame(tick)
        },
        [cancel, set],
    )

    // The equivalent of `target` that is the shortest turn away from the current angle.
    const nearest = React.useCallback((target: number) => {
        let diff = mod(target - angleRef.current, TAU)
        if (diff > Math.PI) diff -= TAU
        return angleRef.current + diff
    }, [])

    React.useEffect(() => cancel, [cancel])

    return { angle, targetRef, snapTo, animateTo, nearest }
}

type DialLabel = { value: number; text: string; radius: number; index: number }

function dialLabels(face: TimePickerSelection, is24Hour: boolean): DialLabel[] {
    if (face === 'minute') {
        return MINUTES.map((value, index) => ({ value, text: pad(value), radius: OUTER_RADIUS, index }))
    }
    if (!is24Hour) {
        return HOURS.map((value, index) => ({ value, text: String(value), radius: OUTER_RADIUS, index }))
    }
    return [
        ...HOURS.map((value, index) => ({
            value: value % 12,
            text: value % 12 === 0 ? '00' : String(value % 12),
            radius: OUTER_RADIUS,
            index,
        })),
        ...HOURS.map((value, index) => ({ value: (value % 12) + 12, text: String((value % 12) + 12), radius: INNER_RADIUS, index })),
    ]
}

// Rounded so server and client render the same positions.
const round = (value: number) => Math.round(value * 1000) / 1000

function pointOnDial(angle: number, radius: number) {
    return { x: round(DIAL_CENTER + radius * Math.sin(angle)), y: round(DIAL_CENTER - radius * Math.cos(angle)) }
}

function ClockDial() {
    const { hour, minute, is24Hour, isPm, hourForDisplay, selection, setSelection, getTime, setTime } = useTimePicker()
    const isHour = selection === 'hour'
    const valueAngle = isHour ? (hour % 12) * RADIANS_PER_HOUR : minute * RADIANS_PER_MINUTE
    const { angle, targetRef, snapTo, animateTo, nearest } = useSpringAngle(valueAngle)

    const dialRef = React.useRef<HTMLDivElement>(null)
    const selectionRef = React.useRef(selection)
    const switchTimerRef = React.useRef<number | null>(null)
    const dragRef = React.useRef<{ pointerId: number; x: number; y: number; moved: boolean } | null>(null)

    React.useEffect(
        () => () => {
            if (switchTimerRef.current !== null) window.clearTimeout(switchTimerRef.current)
        },
        [],
    )

    // Turn to the other hand when the selection changes, and jump to values set from outside the dial.
    React.useEffect(() => {
        if (dragRef.current?.moved) return
        const selectionChanged = selectionRef.current !== selection
        selectionRef.current = selection
        if (selectionChanged) {
            animateTo(nearest(valueAngle))
        } else if (Math.abs(mod(targetRef.current - valueAngle + Math.PI, TAU) - Math.PI) > 1e-6) {
            snapTo(valueAngle)
        }
    }, [selection, valueAngle, animateTo, nearest, snapTo, targetRef])

    const angleOfTime = (time: TimePickerValue, face: TimePickerSelection) =>
        face === 'hour' ? (time.hour % 12) * RADIANS_PER_HOUR : time.minute * RADIANS_PER_MINUTE

    const locate = (event: React.PointerEvent) => {
        const rect = dialRef.current!.getBoundingClientRect()
        const scale = rect.width / DIAL_SIZE || 1
        const x = (event.clientX - rect.left) / scale - DIAL_CENTER
        const y = (event.clientY - rect.top) / scale - DIAL_CENTER
        return { angle: mod(Math.atan2(x, -y), TAU), distance: Math.hypot(x, y) }
    }

    // Set the value under an angle; 24 hour dials pick the inner ring near the center.
    const apply = (pointAngle: number, distance: number) => {
        const time = getTime()
        if (selectionRef.current === 'hour') {
            const base = Math.round(pointAngle / RADIANS_PER_HOUR) % 12
            const pm = is24Hour ? distance < MAX_DISTANCE : time.hour >= 12
            setTime({ hour: base + (pm ? 12 : 0), minute: time.minute })
        } else {
            setTime({ hour: time.hour, minute: Math.round(pointAngle / RADIANS_PER_MINUTE) % 60 })
        }
    }

    const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
        if (!event.isPrimary || event.button !== 0) return
        event.preventDefault()
        if (document.activeElement instanceof HTMLElement && event.currentTarget.contains(document.activeElement)) {
            document.activeElement.blur()
        }
        if (switchTimerRef.current !== null) window.clearTimeout(switchTimerRef.current)
        event.currentTarget.setPointerCapture(event.pointerId)
        dragRef.current = { pointerId: event.pointerId, x: event.clientX, y: event.clientY, moved: false }
    }

    const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
        const drag = dragRef.current
        if (!drag || drag.pointerId !== event.pointerId) return
        if (!drag.moved && Math.hypot(event.clientX - drag.x, event.clientY - drag.y) < TOUCH_SLOP) return
        drag.moved = true
        const point = locate(event)
        apply(point.angle, point.distance)
        // The hand follows the pointer while dragging, then settles on the value.
        snapTo(nearest(point.angle))
    }

    const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
        const drag = dragRef.current
        if (!drag || drag.pointerId !== event.pointerId) return
        dragRef.current = null
        if (drag.moved) {
            if (selectionRef.current === 'hour') {
                setSelection('minute')
            } else {
                animateTo(nearest(angleOfTime(getTime(), 'minute')))
            }
            return
        }
        const point = locate(event)
        const step = selectionRef.current === 'hour' ? RADIANS_PER_HOUR : RADIANS_PER_MINUTE * 5
        const snapped = mod(Math.round(point.angle / step) * step, TAU)
        apply(snapped, point.distance)
        animateTo(nearest(snapped))
        if (selectionRef.current === 'hour') {
            switchTimerRef.current = window.setTimeout(() => {
                switchTimerRef.current = null
                setSelection('minute')
            }, AUTO_SWITCH_DELAY_MS)
        }
    }

    const handlePointerCancel = (event: React.PointerEvent<HTMLDivElement>) => {
        if (dragRef.current?.pointerId !== event.pointerId) return
        dragRef.current = null
        animateTo(nearest(angleOfTime(getTime(), selectionRef.current)))
    }

    // Keyboard and assistive technology activation selects a value without switching hands.
    const selectLabel = (face: TimePickerSelection, label: DialLabel) => {
        const time = getTime()
        if (face === 'hour') {
            const next = is24Hour ? label.value : (label.value % 12) + (time.hour >= 12 ? 12 : 0)
            setTime({ hour: next, minute: time.minute })
        } else {
            setTime({ hour: time.hour, minute: label.value })
        }
    }

    const handleFaceKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
        const forward = event.key === 'ArrowDown' || event.key === 'ArrowRight'
        const backward = event.key === 'ArrowUp' || event.key === 'ArrowLeft'
        if (!forward && !backward) return
        const buttons = Array.from(event.currentTarget.querySelectorAll<HTMLButtonElement>('button'))
        const index = buttons.indexOf(event.target as HTMLButtonElement)
        if (index < 0) return
        event.preventDefault()
        buttons[mod(index + (forward ? 1 : -1), buttons.length)].focus()
    }

    const selectorRadius = is24Hour && isPm && isHour ? INNER_RADIUS : OUTER_RADIUS
    const handle = pointOnDial(angle, selectorRadius)
    const trackEnd = pointOnDial(angle, selectorRadius - HANDLE_RADIUS)
    const closestMinute = (Math.round(minute / 5) * 5) % 60
    const faces: TimePickerSelection[] = ['hour', 'minute']

    const isSelectedLabel = (face: TimePickerSelection, label: DialLabel) =>
        face === 'hour' ? label.value === (is24Hour ? hour : hourForDisplay) : label.value === closestMinute

    const renderLabels = (face: TimePickerSelection, interactive: boolean) =>
        dialLabels(face, is24Hour).map(label => {
            const position = pointOnDial(label.index * (TAU / 12), label.radius)
            const style = { left: position.x - HANDLE_RADIUS, top: position.y - HANDLE_RADIUS }
            const className =
                'absolute flex size-12 items-center justify-center rounded-full text-base leading-6 tracking-[0.5px]'
            if (!interactive) {
                return (
                    <span key={`${label.radius}-${label.value}`} className={className} style={style}>
                        {label.text}
                    </span>
                )
            }
            const selected = isSelectedLabel(face, label)
            return (
                <button
                    key={`${label.radius}-${label.value}`}
                    type='button'
                    role='radio'
                    aria-checked={selected}
                    aria-label={
                        face === 'minute'
                            ? `${label.value} minutes`
                            : is24Hour
                              ? `${label.value} hours`
                              : `${label.value} o'clock`
                    }
                    tabIndex={selected ? 0 : -1}
                    className={cn(
                        className,
                        'outline-none focus-visible:outline-3 focus-visible:outline-secondary focus-visible:outline-solid',
                    )}
                    style={style}
                    onClick={event => {
                        if (event.detail === 0) selectLabel(face, label)
                    }}
                >
                    {label.text}
                </button>
            )
        })

    return (
        <div
            ref={dialRef}
            data-slot='time-picker-dial'
            className='relative size-64 shrink-0 cursor-pointer touch-none overflow-hidden rounded-full bg-surface-container-lowest select-none'
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerCancel}
        >
            {faces.map(face => (
                <div
                    key={face}
                    role='radiogroup'
                    aria-label={face === 'hour' ? 'Select hour' : 'Select minutes'}
                    aria-hidden={face !== selection || undefined}
                    inert={face !== selection}
                    className={cn(
                        'pointer-events-none absolute inset-0 text-on-surface transition-opacity duration-200 ease-[cubic-bezier(0.2,0,0,1)]',
                        face === selection ? 'opacity-100' : 'opacity-0',
                    )}
                    onKeyDown={handleFaceKeyDown}
                >
                    {renderLabels(face, true)}
                </div>
            ))}
            <svg aria-hidden className='pointer-events-none absolute inset-0 size-full' viewBox={`0 0 ${DIAL_SIZE} ${DIAL_SIZE}`}>
                <line
                    x1={DIAL_CENTER}
                    y1={DIAL_CENTER}
                    x2={trackEnd.x}
                    y2={trackEnd.y}
                    className='stroke-primary'
                    strokeWidth={2}
                />
                <circle cx={DIAL_CENTER} cy={DIAL_CENTER} r={CENTER_DOT_RADIUS} className='fill-primary' />
                <circle cx={handle.x} cy={handle.y} r={HANDLE_RADIUS} className='fill-primary' />
            </svg>
            {/* Numbers under the handle switch to on-primary, even when partly covered. */}
            {faces.map(face => (
                <div
                    key={face}
                    aria-hidden
                    className={cn(
                        'pointer-events-none absolute inset-0 text-on-primary transition-opacity duration-200 ease-[cubic-bezier(0.2,0,0,1)]',
                        face === selection ? 'opacity-100' : 'opacity-0',
                    )}
                    style={{ clipPath: `circle(${HANDLE_RADIUS}px at ${handle.x}px ${handle.y}px)` }}
                >
                    {renderLabels(face, false)}
                </div>
            ))}
        </div>
    )
}

function TimePickerClock({ className, ...props }: React.ComponentProps<'div'>) {
    const { is24Hour, hourForDisplay, minute, selection, orientation } = useTimePicker()
    const vertical = orientation === 'vertical'

    const numbers = (
        <div role='radiogroup' aria-label='Select time' className='flex'>
            <TimeSelector
                field='hour'
                text={pad(hourForDisplay)}
                selected={selection === 'hour'}
                className={vertical && is24Hour ? 'w-[132px]' : undefined}
            />
            <TimeSeparator />
            <TimeSelector
                field='minute'
                text={pad(minute)}
                selected={selection === 'minute'}
                className={vertical && is24Hour ? 'w-[132px]' : undefined}
            />
        </div>
    )

    return (
        <div
            data-slot='time-picker-clock'
            className={cn('flex items-center', vertical ? 'flex-col gap-3' : 'gap-[52px]', className)}
            {...props}
        >
            <div className={cn('flex', !vertical && 'flex-col justify-center')}>
                {numbers}
                {!is24Hour && (
                    <div className={vertical ? 'pl-4' : 'pt-4'}>
                        <PeriodToggle orientation={vertical ? 'vertical' : 'horizontal'} />
                    </div>
                )}
            </div>
            <ClockDial />
        </div>
    )
}

function TimeInputField({ field }: { field: TimePickerSelection }) {
    const { is24Hour, hourForDisplay, minute, selection, setSelection, getTime, setTime, invalid, setInvalid, rootRef } =
        useTimePicker()
    const selected = selection === field
    const value = field === 'hour' ? hourForDisplay : minute
    const isInvalid = invalid[field]
    const [text, setText] = React.useState(() => pad(value))
    const [focused, setFocused] = React.useState(false)
    const inputRef = React.useRef<HTMLInputElement>(null)
    const userEditRef = React.useRef(false)
    const firstRunRef = React.useRef(true)
    const errorId = React.useId()

    // Rewrite the text when the value changes from outside the field.
    React.useEffect(() => {
        if (userEditRef.current) {
            userEditRef.current = false
            return
        }
        setText(current => (current === pad(value) ? current : pad(value)))
        setInvalid(field, false)
    }, [value, field, setInvalid])

    React.useEffect(() => {
        const first = firstRunRef.current
        firstRunRef.current = false
        if (!selected) return
        // Only take focus on mount when the picker already has it, such as after switching modes.
        if (first && !rootRef.current?.contains(document.activeElement)) return
        inputRef.current?.focus()
    }, [selected, rootRef])

    const commit = (next: TimePickerValue) => {
        const time = getTime()
        if (next.hour === time.hour && next.minute === time.minute) return
        userEditRef.current = true
        setTime(next)
    }

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const input = event.currentTarget
        const time = getTime()
        const pm = time.hour >= 12
        let next = input.value
        if (next === '') {
            setText('')
            setInvalid(field, false)
            if (field === 'hour') commit({ hour: !is24Hour && pm ? 12 : 0, minute: time.minute })
            else commit({ hour: time.hour, minute: 0 })
            return
        }
        if (!/^\d+$/.test(next)) return
        // Typing into a full field replaces it with the new digit.
        if (text.length === 2 && next.length === 3) {
            const caret = input.selectionStart ?? next.length
            next = next.charAt(Math.max(0, caret - 1))
        }
        if (next.length > 2) return
        const number = Number(next)
        setText(next)

        if (field === 'minute') {
            const valid = number <= 59
            setInvalid('minute', !valid)
            if (valid) commit({ hour: time.hour, minute: number })
            return
        }

        const target = is24Hour ? number : number === 12 ? (pm ? 12 : 0) : pm ? number + 12 : number
        const valid = is24Hour ? target <= 23 : pm ? target >= 12 && target <= 23 : target <= 11
        setInvalid('hour', !valid)
        if (!valid) return
        commit({ hour: target, minute: time.minute })
        const inserted = (event.nativeEvent as InputEvent).inputType?.startsWith('insert')
        if (next.length === 2 || (inserted && !is24Hour && number >= 2 && number <= 9)) setSelection('minute')
    }

    const message =
        field === 'minute' ? 'Minute must be 0–59' : is24Hour ? 'Hour must be 0–23' : 'Hour must be 1–12'

    return (
        <div data-slot='time-picker-field' className='flex w-[100px] flex-col'>
            {selected ? (
                <input
                    ref={inputRef}
                    type='text'
                    inputMode='numeric'
                    autoComplete='off'
                    aria-label={field === 'hour' ? 'Hour' : 'Minute'}
                    aria-invalid={isInvalid || undefined}
                    aria-describedby={isInvalid ? errorId : undefined}
                    value={text}
                    data-slot='time-picker-input'
                    className={cn(
                        'h-[120px] w-full min-w-0 rounded-2xl text-center text-[57px] leading-16 tracking-[-0.25px] caret-primary outline-none',
                        'transition-[background-color,box-shadow] duration-150 ease-[cubic-bezier(0.2,0,0,1)]',
                        'selection:bg-primary-container selection:text-on-primary-container',
                        isInvalid ? 'bg-error-container text-error' : 'bg-surface-container-lowest text-primary',
                        focused
                            ? isInvalid
                                ? 'inset-ring-2 inset-ring-error'
                                : 'inset-ring-2 inset-ring-primary'
                            : isInvalid && 'inset-ring-1 inset-ring-error',
                    )}
                    onChange={handleChange}
                    onFocus={event => {
                        setFocused(true)
                        event.currentTarget.select()
                    }}
                    onBlur={() => setFocused(false)}
                    onKeyDown={event => {
                        if (event.key === 'Enter' && field === 'hour' && !isInvalid) {
                            event.preventDefault()
                            setSelection('minute')
                        }
                    }}
                />
            ) : (
                <TimeSelector
                    field={field}
                    text={isInvalid && text !== '' ? pad(Number(text)) : pad(value)}
                    selected={false}
                    invalid={isInvalid}
                />
            )}
            {isInvalid && (
                <p id={errorId} aria-live='polite' className='min-h-8 pt-[7px] text-xs leading-4 tracking-[0.4px] text-error'>
                    {message}
                </p>
            )}
        </div>
    )
}

function TimePickerInput({ className, ...props }: React.ComponentProps<'div'>) {
    const { is24Hour } = useTimePicker()

    return (
        <div data-slot='time-picker-input-mode' className={cn('flex items-start', className)} {...props}>
            <div dir='ltr' className='flex items-start'>
                <TimeInputField field='hour' />
                <TimeSeparator />
                <TimeInputField field='minute' />
            </div>
            {!is24Hour && (
                <div className='pl-2'>
                    <PeriodToggle orientation='vertical' />
                </div>
            )}
        </div>
    )
}

function TimePickerScroll({ className, ...props }: React.ComponentProps<'div'>) {
    const { is24Hour, hour, hourForDisplay, minute, getTime, setTime } = useTimePicker()

    return (
        <div data-slot='time-picker-scroll' className={cn('flex items-start', className)} {...props}>
            <div dir='ltr' className='flex items-start'>
                <ScrollField
                    aria-label='Select hour'
                    min={is24Hour ? 0 : 1}
                    max={is24Hour ? 23 : 12}
                    value={is24Hour ? hour : hourForDisplay}
                    onValueChange={next => {
                        const time = getTime()
                        const base = Number(next)
                        const nextHour = is24Hour ? base : (base % 12) + (time.hour >= 12 ? 12 : 0)
                        setTime({ hour: nextHour, minute: time.minute })
                    }}
                />
                <TimeSeparator />
                <ScrollField
                    aria-label='Select minutes'
                    min={0}
                    max={59}
                    value={minute}
                    onValueChange={next => {
                        const time = getTime()
                        setTime({ hour: time.hour, minute: Number(next) })
                    }}
                />
            </div>
            {!is24Hour && (
                <div className='pl-2'>
                    <PeriodToggle orientation='vertical' />
                </div>
            )}
        </div>
    )
}

function TimePickerActions({ className, ...props }: React.ComponentProps<'div'>) {
    return (
        <div
            data-slot='time-picker-actions'
            className={cn('flex min-h-12 w-full items-center justify-end gap-2', className)}
            {...props}
        />
    )
}

function TimePickerModeToggle({ className, onClick, ...props }: React.ComponentProps<'button'>) {
    const { mode, returnMode, setMode } = useTimePicker()
    const toInput = mode !== 'input'
    const label = toInput
        ? 'Switch to text input mode'
        : returnMode === 'scroll'
          ? 'Switch to scroll mode'
          : 'Switch to clock mode'
    const icon = toInput
        ? 'icon-[material-symbols--keyboard-rounded]'
        : returnMode === 'scroll'
          ? 'icon-[material-symbols--swipe-vertical-rounded]'
          : 'icon-[material-symbols--schedule-rounded]'

    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <button
                    type='button'
                    aria-label={label}
                    data-slot='time-picker-mode-toggle'
                    className={cn(
                        'group/mode relative mr-auto inline-flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-full text-on-surface-variant outline-none',
                        'focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-secondary focus-visible:outline-solid',
                        className,
                    )}
                    onClick={event => {
                        onClick?.(event)
                        if (!event.defaultPrevented) setMode(toInput ? 'input' : returnMode)
                    }}
                    {...props}
                >
                    <span className='absolute inset-0 rounded-[inherit] bg-on-surface-variant opacity-0 transition-opacity group-hover/mode:opacity-8 group-active/mode:opacity-10' />
                    <Ripple />
                    <i className={cn('relative size-6', icon)} />
                </button>
            </TooltipTrigger>
            <TooltipContent side='top'>{label}</TooltipContent>
        </Tooltip>
    )
}

function TimePickerCancelButton({
    onCancel,
    onClick,
    variant = 'text',
    size = 'sm',
    ...props
}: React.ComponentProps<typeof Button> & { onCancel?: () => void }) {
    return (
        <Button
            type='button'
            data-slot='time-picker-cancel-button'
            variant={variant}
            size={size}
            onClick={event => {
                onClick?.(event)
                if (!event.defaultPrevented) onCancel?.()
            }}
            {...props}
        />
    )
}

function TimePickerConfirmButton({
    onConfirm,
    onClick,
    disabled,
    variant = 'text',
    size = 'sm',
    ...props
}: React.ComponentProps<typeof Button> & { onConfirm?: (value: TimePickerValue) => void }) {
    const { invalid, getTime } = useTimePicker()

    return (
        <Button
            type='button'
            data-slot='time-picker-confirm-button'
            variant={variant}
            size={size}
            disabled={disabled || invalid.hour || invalid.minute}
            onClick={event => {
                onClick?.(event)
                if (!event.defaultPrevented) onConfirm?.(getTime())
            }}
            {...props}
        />
    )
}

export {
    TimePicker,
    TimePickerContent,
    TimePickerClock,
    TimePickerInput,
    TimePickerScroll,
    TimePickerActions,
    TimePickerModeToggle,
    TimePickerCancelButton,
    TimePickerConfirmButton,
}
export type { TimePickerProps, TimePickerValue, TimePickerMode, TimePickerOrientation }
