'use client'

import * as React from 'react'
import * as SliderPrimitive from '@radix-ui/react-slider'

import { cn } from '@/lib/utils'

type SliderSize = 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge'
type SliderVariant = 'standard' | 'centered'

type SliderProps = Omit<React.ComponentProps<typeof SliderPrimitive.Root>, 'orientation'> & {
    orientation?: 'horizontal' | 'vertical'
    size?: SliderSize
    variant?: SliderVariant
    showStops?: boolean
    stops?: number
    showValueIndicator?: boolean
    centerValue?: number
    icon?: React.ReactNode
    formatValue?: (value: number, index: number) => React.ReactNode
}

const HANDLE_WIDTH = 4
const HANDLE_GAP = 6
const HANDLE_INSET = HANDLE_GAP + HANDLE_WIDTH / 2
const ORIGIN_INSET = 2
const STOP_SIZE = 4

const sizeClasses = {
    xsmall: {
        root: 'h-11',
        rootVertical: 'w-11',
        track: 'h-4',
        trackVertical: 'w-4',
        handle: 'h-11',
        handleVertical: 'w-11',
        icon: 'size-6',
        start: 'rounded-l-[16px] rounded-r-[2px]',
        end: 'rounded-l-[2px] rounded-r-[16px]',
        startVertical: 'rounded-t-[2px] rounded-b-[16px]',
        endVertical: 'rounded-t-[16px] rounded-b-[2px]',
    },
    small: {
        root: 'h-11',
        rootVertical: 'w-11',
        track: 'h-6',
        trackVertical: 'w-6',
        handle: 'h-11',
        handleVertical: 'w-11',
        icon: 'size-6',
        start: 'rounded-l-[8px] rounded-r-[2px]',
        end: 'rounded-l-[2px] rounded-r-[8px]',
        startVertical: 'rounded-t-[2px] rounded-b-[8px]',
        endVertical: 'rounded-t-[8px] rounded-b-[2px]',
    },
    medium: {
        root: 'h-[52px]',
        rootVertical: 'w-[52px]',
        track: 'h-10',
        trackVertical: 'w-10',
        handle: 'h-[52px]',
        handleVertical: 'w-[52px]',
        icon: 'size-6',
        start: 'rounded-l-[12px] rounded-r-[2px]',
        end: 'rounded-l-[2px] rounded-r-[12px]',
        startVertical: 'rounded-t-[2px] rounded-b-[12px]',
        endVertical: 'rounded-t-[12px] rounded-b-[2px]',
    },
    large: {
        root: 'h-[68px]',
        rootVertical: 'w-[68px]',
        track: 'h-14',
        trackVertical: 'w-14',
        handle: 'h-[68px]',
        handleVertical: 'w-[68px]',
        icon: 'size-6',
        start: 'rounded-l-[16px] rounded-r-[2px]',
        end: 'rounded-l-[2px] rounded-r-[16px]',
        startVertical: 'rounded-t-[2px] rounded-b-[16px]',
        endVertical: 'rounded-t-[16px] rounded-b-[2px]',
    },
    xlarge: {
        root: 'h-[108px]',
        rootVertical: 'w-[108px]',
        track: 'h-24',
        trackVertical: 'w-24',
        handle: 'h-[108px]',
        handleVertical: 'w-[108px]',
        icon: 'size-8',
        start: 'rounded-l-[28px] rounded-r-[2px]',
        end: 'rounded-l-[2px] rounded-r-[28px]',
        startVertical: 'rounded-t-[2px] rounded-b-[28px]',
        endVertical: 'rounded-t-[28px] rounded-b-[2px]',
    },
} satisfies Record<
    SliderSize,
    {
        root: string
        rootVertical: string
        track: string
        trackVertical: string
        handle: string
        handleVertical: string
        icon: string
        start: string
        end: string
        startVertical: string
        endVertical: string
    }
>

function clamp(value: number, min: number, max: number) {
    return Math.min(Math.max(value, min), max)
}

function valueToPercent(value: number, min: number, max: number) {
    if (max === min) return 0
    return clamp(((value - min) / (max - min)) * 100, 0, 100)
}

function getDefaultValue(value: number[] | undefined, defaultValue: number[] | undefined, min: number) {
    if (Array.isArray(value) && value.length > 0) return value
    if (Array.isArray(defaultValue) && defaultValue.length > 0) return defaultValue
    return [min]
}

function getCenteredOrigin(min: number, max: number, centerValue?: number) {
    if (typeof centerValue === 'number') return centerValue
    if (min < 0 && max > 0) return 0
    return min + (max - min) / 2
}

function getSegmentStyle(
    orientation: 'horizontal' | 'vertical',
    from: number,
    to: number,
    startInset = 0,
    endInset = 0,
): React.CSSProperties {
    const start = clamp(Math.min(from, to), 0, 100)
    const end = clamp(Math.max(from, to), 0, 100)
    const size = end - start

    if (orientation === 'vertical') {
        return {
            insetBlockEnd: `calc(${start}% + ${startInset}px)`,
            blockSize: `max(0px, calc(${size}% - ${startInset + endInset}px))`,
        }
    }

    return {
        insetInlineStart: `calc(${start}% + ${startInset}px)`,
        inlineSize: `max(0px, calc(${size}% - ${startInset + endInset}px))`,
    }
}

function getStopInBoundsOffset(percent: number) {
    return STOP_SIZE / 2 - (percent / 100) * STOP_SIZE
}

function getStopStyle(orientation: 'horizontal' | 'vertical', percent: number): React.CSSProperties {
    const offset = getStopInBoundsOffset(percent)

    if (orientation === 'vertical') {
        return {
            insetBlockEnd: `calc(${percent}% + ${offset}px)`,
            insetInlineStart: '50%',
            transform: 'translate(-50%, 50%)',
        }
    }

    return {
        insetBlockStart: '50%',
        insetInlineStart: `calc(${percent}% + ${offset}px)`,
        transform: 'translate(-50%, -50%)',
    }
}

function isPercentActive(percent: number, intervals: Array<[number, number]>) {
    return intervals.some(([from, to]) => percent >= Math.min(from, to) && percent <= Math.max(from, to))
}

function SliderTrackSegment({
    active,
    className,
    orientation,
    style,
}: {
    active?: boolean
    className: string
    orientation: 'horizontal' | 'vertical'
    style: React.CSSProperties
}) {
    return (
        <span
            data-slot={active ? 'slider-active-track' : 'slider-inactive-track'}
            className={cn(
                'pointer-events-none absolute',
                orientation === 'horizontal' ? 'inset-y-0' : 'inset-x-0',
                active
                    ? 'bg-primary group-data-[disabled]/slider:bg-on-surface/38'
                    : 'bg-secondary-container group-data-[disabled]/slider:bg-on-surface/10',
                className,
            )}
            style={style}
        />
    )
}

function SliderStop({
    active,
    orientation,
    percent,
}: {
    active?: boolean
    orientation: 'horizontal' | 'vertical'
    percent: number
}) {
    return (
        <span
            data-slot='slider-stop'
            className={cn(
                'pointer-events-none absolute z-10 size-1 rounded-full',
                active
                    ? 'bg-secondary-container group-data-[disabled]/slider:bg-on-surface/38'
                    : 'bg-on-secondary-container group-data-[disabled]/slider:bg-on-surface/38',
            )}
            style={getStopStyle(orientation, percent)}
        />
    )
}

function SliderTrackVisual({
    centerValue,
    icon,
    max,
    min,
    orientation,
    showStops,
    size,
    stops,
    value,
    variant,
}: {
    centerValue?: number
    icon?: React.ReactNode
    max: number
    min: number
    orientation: 'horizontal' | 'vertical'
    showStops: boolean
    size: SliderSize
    stops: number
    value: number[]
    variant: SliderVariant
}) {
    const classes = sizeClasses[size]
    const percentages = value.map(item => valueToPercent(item, min, max)).sort((a, b) => a - b)
    const isRange = percentages.length > 1
    const thumbPercent = percentages[0] ?? 0
    const originPercent = valueToPercent(getCenteredOrigin(min, max, centerValue), min, max)
    const activeIntervals: Array<[number, number]> = []

    const segmentEdgeClasses = {
        start: orientation === 'horizontal' ? classes.start : classes.startVertical,
        end: orientation === 'horizontal' ? classes.end : classes.endVertical,
        middle: 'rounded-[2px]',
    }

    const segments: React.ReactNode[] = []

    const pushSegment = (
        key: string,
        from: number,
        to: number,
        kind: keyof typeof segmentEdgeClasses,
        active = false,
        startInset = 0,
        endInset = 0,
    ) => {
        if (Math.abs(to - from) <= 0.01) return

        segments.push(
            <SliderTrackSegment
                active={active}
                className={segmentEdgeClasses[kind]}
                key={key}
                orientation={orientation}
                style={getSegmentStyle(orientation, from, to, startInset, endInset)}
            />,
        )
    }

    if (isRange) {
        const lower = percentages[0]
        const upper = percentages[percentages.length - 1]

        activeIntervals.push([lower, upper])
        pushSegment('inactive-start', 0, lower, 'start', false, 0, HANDLE_INSET)
        pushSegment('active-range', lower, upper, 'middle', true, HANDLE_INSET, HANDLE_INSET)
        pushSegment('inactive-end', upper, 100, 'end', false, HANDLE_INSET, 0)
    } else if (variant === 'centered') {
        activeIntervals.push([thumbPercent, originPercent])

        if (Math.abs(thumbPercent - originPercent) <= 0.01) {
            pushSegment('inactive-start', 0, originPercent, 'start', false, 0, HANDLE_INSET)
            pushSegment('inactive-end', originPercent, 100, 'end', false, HANDLE_INSET, 0)
        } else if (thumbPercent < originPercent) {
            pushSegment('inactive-start', 0, thumbPercent, 'start', false, 0, HANDLE_INSET)
            pushSegment('active-centered-start', thumbPercent, originPercent, 'middle', true, HANDLE_INSET, ORIGIN_INSET)
            pushSegment('inactive-end', originPercent, 100, 'end', false, ORIGIN_INSET, 0)
        } else {
            pushSegment('inactive-start', 0, originPercent, 'start', false, 0, ORIGIN_INSET)
            pushSegment('active-centered-end', originPercent, thumbPercent, 'middle', true, ORIGIN_INSET, HANDLE_INSET)
            pushSegment('inactive-end', thumbPercent, 100, 'end', false, HANDLE_INSET, 0)
        }
    } else {
        activeIntervals.push([0, thumbPercent])
        pushSegment('active-start', 0, thumbPercent, 'start', true, 0, HANDLE_INSET)
        pushSegment('inactive-end', thumbPercent, 100, 'end', false, HANDLE_INSET, 0)
    }

    const stopCount = Math.max(2, stops)
    const stopPercents = Array.from({ length: stopCount }, (_, index) =>
        stopCount === 1 ? 0 : (index / (stopCount - 1)) * 100,
    )
    const showEndpointStops = !showStops

    return (
        <>
            {segments}
            {showStops
                ? stopPercents.map(percent => (
                      <SliderStop
                          active={isPercentActive(percent, activeIntervals)}
                          key={percent}
                          orientation={orientation}
                          percent={percent}
                      />
                  ))
                : showEndpointStops && (
                      <>
                          {(isRange || variant === 'centered') && <SliderStop orientation={orientation} percent={0} />}
                          <SliderStop orientation={orientation} percent={100} />
                      </>
                  )}
            {icon && (
                <span
                    data-slot='slider-icon'
                    className={cn(
                        'pointer-events-none absolute z-10 grid place-items-center text-on-primary',
                        classes.icon,
                        orientation === 'horizontal' ? 'top-1/2 left-2 -translate-y-1/2' : 'bottom-2 left-1/2 -translate-x-1/2',
                    )}
                >
                    {icon}
                </span>
            )}
        </>
    )
}

function SliderValueIndicator({
    formatValue,
    index,
    orientation,
    value,
}: {
    formatValue?: (value: number, index: number) => React.ReactNode
    index: number
    orientation: 'horizontal' | 'vertical'
    value: number
}) {
    return (
        <span
            data-slot='slider-value-indicator'
            className={cn(
                'pointer-events-none absolute z-30 flex min-w-12 items-center justify-center rounded-full bg-inverse-surface px-4 py-3 text-sm leading-5 font-medium whitespace-nowrap text-inverse-on-surface opacity-0 transition-opacity group-focus-visible/thumb:opacity-100 group-active/thumb:opacity-100 group-data-[disabled]/slider:hidden',
                orientation === 'horizontal'
                    ? 'bottom-full left-1/2 -translate-x-1/2'
                    : 'top-1/2 left-[calc(100%+8px)] -translate-y-1/2',
            )}
        >
            {formatValue ? formatValue(value, index) : Math.round(value)}
        </span>
    )
}

function Slider({
    centerValue,
    className,
    defaultValue,
    formatValue,
    icon,
    max = 100,
    min = 0,
    onValueChange,
    orientation = 'horizontal',
    showStops = false,
    showValueIndicator = false,
    size = 'xsmall',
    stops = 11,
    value,
    variant = 'standard',
    ...props
}: SliderProps) {
    const [internalValue, setInternalValue] = React.useState(() => getDefaultValue(value, defaultValue, min))
    const values = Array.isArray(value) && value.length > 0 ? value : internalValue
    const classes = sizeClasses[size]

    React.useEffect(() => {
        if (Array.isArray(value) && value.length > 0) {
            setInternalValue(value)
        }
    }, [value])

    const handleValueChange = React.useCallback(
        (nextValue: number[]) => {
            setInternalValue(nextValue)
            onValueChange?.(nextValue)
        },
        [onValueChange],
    )

    return (
        <SliderPrimitive.Root
            data-slot='slider'
            data-size={size}
            data-variant={variant}
            defaultValue={defaultValue}
            max={max}
            min={min}
            onValueChange={handleValueChange}
            orientation={orientation}
            value={value}
            className={cn(
                'group/slider relative flex touch-none select-none data-[disabled]:cursor-not-allowed',
                orientation === 'horizontal'
                    ? ['w-full items-center', classes.root]
                    : ['h-full min-h-44 flex-col items-center justify-center', classes.rootVertical],
                className,
            )}
            {...props}
        >
            <SliderPrimitive.Track
                data-slot='slider-track'
                className={cn(
                    'relative isolate grow overflow-visible',
                    orientation === 'horizontal' ? ['w-full', classes.track] : ['h-full', classes.trackVertical],
                )}
            >
                <SliderPrimitive.Range data-slot='slider-range' className='sr-only' />
                <SliderTrackVisual
                    centerValue={centerValue}
                    icon={icon}
                    max={max}
                    min={min}
                    orientation={orientation}
                    showStops={showStops}
                    size={size}
                    stops={stops}
                    value={values}
                    variant={variant}
                />
            </SliderPrimitive.Track>
            {values.map((item, index) => (
                <SliderPrimitive.Thumb
                    data-slot='slider-thumb'
                    key={index}
                    className={cn(
                        'group/thumb relative z-20 flex shrink-0 cursor-pointer items-center justify-center bg-transparent outline-none after:absolute after:top-1/2 after:left-1/2 after:size-11 after:-translate-x-1/2 after:-translate-y-1/2 after:content-[""] data-[disabled]:cursor-not-allowed',
                        orientation === 'horizontal' ? ['w-1', classes.handle] : ['h-1', classes.handleVertical],
                    )}
                >
                    <span
                        data-slot='slider-handle'
                        className={cn(
                            'relative block overflow-hidden rounded-[2px] bg-primary transition-[width,height,background-color] group-data-[disabled]/slider:bg-on-surface/38',
                            orientation === 'horizontal'
                                ? 'h-full w-1 group-active/thumb:w-0.5'
                                : 'h-1 w-full group-active/thumb:h-0.5',
                        )}
                    >
                        <span className='absolute inset-0 bg-on-primary/0 transition-colors group-hover/thumb:bg-on-primary/8 group-focus-visible/thumb:bg-on-primary/10 group-active/thumb:bg-on-primary/10 group-data-[disabled]/slider:hidden' />
                    </span>
                    {showValueIndicator && (
                        <SliderValueIndicator formatValue={formatValue} index={index} orientation={orientation} value={item} />
                    )}
                </SliderPrimitive.Thumb>
            ))}
        </SliderPrimitive.Root>
    )
}

export { Slider }
