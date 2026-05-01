'use client'

import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import {
    DateLib,
    DayPicker,
    DayFlag,
    SelectionState,
    UI,
    dateMatchModifiers,
    defaultLocale,
    formatCaption,
    formatMonthDropdown,
    formatWeekdayName,
    formatYearDropdown,
    rangeContainsModifiers,
    type DateRange,
    type DayButtonProps,
    type DayPickerProps,
    type MonthProps,
} from 'react-day-picker'

import { cn } from '@/lib/utils'
import { Button } from './button'
import { Ripple } from './ripple'

type CalendarView = 'day' | 'month' | 'year'
type CalendarSelectionValue = Date | DateRange | undefined

type CalendarProps = Omit<DayPickerProps, 'mode' | 'selected' | 'onSelect' | 'month' | 'defaultMonth' | 'onMonthChange'> & {
    mode?: 'single' | 'range'
    selected?: Date | DateRange
    onSelect?: (value: CalendarSelectionValue) => void
    children?: React.ReactNode
}

type CalendarDayPickerOptions = Omit<CalendarProps, 'mode' | 'selected' | 'onSelect' | 'children'>
type CalendarDateLibOptions = NonNullable<ConstructorParameters<typeof DateLib>[0]>

type YearRange = {
    start: number
    end: number
}

type RangePickerBounds = {
    startMonth: Date
    endMonth: Date
}

type RangePickerScrollAnchor = {
    monthKey: string
    top: number
}

type CalendarContextValue = {
    mode: 'single' | 'range'
    isRange: boolean
    selectedSingle?: Date
    selectedRange?: DateRange
    selectedValue: CalendarSelectionValue
    displayMonth: Date
    setDisplayMonth: (month: Date) => void
    view: CalendarView
    setView: (view: CalendarView) => void
    selectSingle: (date: Date | undefined) => void
    selectRange: (range: DateRange | undefined) => void
    selectToday: () => void
    todayScrollToken: number
    clear: () => void
    isDateDisabled: (date: Date | undefined) => boolean
    classNames?: DayPickerProps['classNames']
    components?: DayPickerProps['components']
    showOutsideDays?: boolean
    yearRange: YearRange
    dayPickerProps: CalendarDayPickerOptions
    dateLib: DateLib
    dateLibOptions: CalendarDateLibOptions
}

const DEFAULT_START_YEAR = 1900
const DEFAULT_END_YEAR = 2100
const RANGE_PICKER_BOUNDARY_MONTHS = 3
const RANGE_PICKER_SCROLL_THRESHOLD = 96
const RANGE_PICKER_WEEKDAY_HEIGHT = 48
const CalendarContext = React.createContext<CalendarContextValue | null>(null)

function useCalendarContext() {
    const context = React.useContext(CalendarContext)

    if (!context) {
        throw new Error('Calendar components must be used within Calendar')
    }

    return context
}

function Calendar(calendarProps: CalendarProps) {
    const {
        className,
        children,
        mode = 'single',
        selected,
        onSelect,
        showOutsideDays,
        classNames,
        components,
        ...props
    } = calendarProps
    const isRange = mode === 'range'
    const isSelectedControlled = Object.prototype.hasOwnProperty.call(calendarProps, 'selected')
    const dayPickerProps = props
    const [view, setView] = React.useState<CalendarView>('day')
    const [internalSingle, setInternalSingle] = React.useState<Date | undefined>()
    const [internalRange, setInternalRange] = React.useState<DateRange | undefined>()
    const [internalMonth, setInternalMonth] = React.useState(() => startOfMonth(getSelectedMonth(selected) ?? new Date()))
    const [todayScrollToken, setTodayScrollToken] = React.useState(0)
    const dateLibOptions = getDateLibOptions(dayPickerProps)
    const dateLib = new DateLib(dateLibOptions, dayPickerProps.dateLib)

    const selectedSingle = isSelectedControlled ? (isDate(selected) ? selected : undefined) : internalSingle
    const selectedRange = isSelectedControlled ? (isDateRangeValue(selected) ? selected : undefined) : internalRange
    const selectedValue = isRange ? selectedRange : selectedSingle
    const displayMonth = startOfMonth(internalMonth)
    const yearRange = getYearRange(dayPickerProps, displayMonth)

    const isDateDisabled = (date: Date | undefined) => isCalendarDateDisabled(date, dayPickerProps.disabled, dateLib)
    const isRangeDisabled = (range: DateRange | undefined) =>
        isCalendarRangeDisabled(range, dayPickerProps.disabled, dateLib, getRangeExcludeDisabled(dayPickerProps))

    const setDisplayMonth = (nextMonth: Date) => {
        const normalized = startOfMonth(nextMonth)
        setInternalMonth(normalized)
    }

    const selectSingle = (date: Date | undefined) => {
        if (isDateDisabled(date)) return

        if (!isSelectedControlled) {
            setInternalSingle(date)
        }
        if (date) {
            setDisplayMonth(date)
        }
        onSelect?.(date)
    }

    const selectRange = (range: DateRange | undefined) => {
        if (isRangeDisabled(range)) return

        if (!isSelectedControlled) {
            setInternalRange(range)
        }
        if (range?.from) {
            setDisplayMonth(range.from)
        }
        onSelect?.(range)
    }

    const clear = () => {
        if (isRange) {
            selectRange(undefined)
        } else {
            selectSingle(undefined)
        }
        setView('day')
    }

    const selectToday = () => {
        const today = dateLib.today()
        if (isDateDisabled(today)) return

        if (isRange) {
            selectRange({ from: today })
        } else {
            selectSingle(today)
        }
        setDisplayMonth(today)
        setView('day')
        setTodayScrollToken(token => token + 1)
    }

    const contextValue: CalendarContextValue = {
        mode,
        isRange,
        selectedSingle,
        selectedRange,
        selectedValue,
        displayMonth,
        setDisplayMonth,
        view,
        setView,
        selectSingle,
        selectRange,
        selectToday,
        todayScrollToken,
        clear,
        isDateDisabled,
        classNames,
        components,
        showOutsideDays,
        yearRange,
        dateLib,
        dateLibOptions,
        dayPickerProps,
    }

    return (
        <CalendarContext.Provider value={contextValue}>
            <div
                data-slot='calendar'
                className={cn(
                    'inline-flex min-w-90 flex-col overflow-hidden rounded-[28px] bg-surface-container-high text-on-surface',
                    className,
                )}
            >
                {children}
            </div>
        </CalendarContext.Provider>
    )
}

function CalendarHeader({
    title,
    label,
    showVariantToggle = false,
    onVariantToggle,
    className,
    ...props
}: React.ComponentProps<'div'> & {
    title?: React.ReactNode
    label?: (value: CalendarSelectionValue) => string
    showVariantToggle?: boolean
    onVariantToggle?: () => void
}) {
    const { isRange, selectedValue, dateLib } = useCalendarContext()
    const headline = label?.(selectedValue) ?? formatHeaderLabel(selectedValue, isRange, dateLib)

    return (
        <div
            data-slot='calendar-header'
            className={cn('flex w-full flex-col gap-9 border-b border-outline-variant pt-4 pr-3 pb-2 pl-6', className)}
            {...props}
        >
            <p className='text-sm leading-5 font-medium text-on-surface-variant'>
                {title ?? (isRange ? 'Select dates' : 'Select date')}
            </p>
            <div className='flex w-full items-center gap-2'>
                <p className='min-w-0 flex-1 text-[32px] leading-12'>{headline}</p>
                {showVariantToggle && (
                    <CalendarIconButton label='Toggle calendar variant' onClick={onVariantToggle}>
                        <i className='icon-[material-symbols--edit-rounded]' />
                    </CalendarIconButton>
                )}
            </div>
        </div>
    )
}

function CalendarCompactPicker({ className, ...props }: React.ComponentProps<'div'>) {
    const { view, showOutsideDays } = useCalendarContext()

    return (
        <div data-slot='calendar-compact-picker' className={cn('flex flex-col', className)} {...props}>
            {view === 'year' ? (
                <YearGrid />
            ) : (
                <>
                    <CalendarSelectionRow />
                    <CalendarDayPicker showOutsideDays={showOutsideDays ?? false} />
                </>
            )}
        </div>
    )
}

function CalendarInputPicker({ className, ...props }: React.ComponentProps<'div'>) {
    const { selectedSingle, selectSingle } = useCalendarContext()

    return (
        <div
            data-slot='calendar-input-picker'
            className={cn('flex items-start justify-center px-6 pt-4.5 pb-4', className)}
            {...props}
        >
            <CalendarTextInput
                label='Date'
                value={formatInputDate(selectedSingle)}
                placeholder='mm/dd/yyyy'
                className='w-full'
                onDateChange={selectSingle}
            />
        </div>
    )
}

function CalendarRangePicker({ className, onScroll, ...props }: React.ComponentProps<'div'>) {
    const { selectedRange, todayScrollToken, dateLib, dateLibOptions, dayPickerProps } = useCalendarContext()
    const scrollAreaRef = React.useRef<HTMLDivElement>(null)
    const scrollAnchorRef = React.useRef<RangePickerScrollAnchor | null>(null)
    const initialScrollDoneRef = React.useRef(false)
    const lastTodayScrollTokenRef = React.useRef(0)
    const selectedFromTime = selectedRange?.from?.getTime()
    const selectedToTime = selectedRange?.to?.getTime()
    const [rangeBounds, setRangeBounds] = React.useState<RangePickerBounds>(() =>
        getRangePickerBounds(selectedRange, dayPickerProps.today ?? new Date()),
    )
    const weekdayLabels = React.useMemo(
        () => getWeekdayLabels(dateLib, dateLibOptions, dayPickerProps),
        [dateLib, dateLibOptions, dayPickerProps],
    )
    const numberOfMonths = getMonthDistance(rangeBounds.startMonth, rangeBounds.endMonth) + 1

    const captureScrollAnchor = React.useCallback(() => {
        const scrollArea = scrollAreaRef.current
        if (!scrollArea) return

        const viewportTop = scrollArea.getBoundingClientRect().top + RANGE_PICKER_WEEKDAY_HEIGHT
        const monthElements = Array.from(
            scrollArea.querySelectorAll<HTMLElement>('[data-calendar-range-month]'),
        )
        const anchorElement =
            monthElements.find(element => element.getBoundingClientRect().bottom > viewportTop) ?? monthElements[0]

        if (!anchorElement) return

        scrollAnchorRef.current = {
            monthKey: anchorElement.dataset.calendarRangeMonth ?? '',
            top: anchorElement.getBoundingClientRect().top - viewportTop,
        }
    }, [])

    const setRangeBoundsPreservingScroll = React.useCallback(
        (nextBounds: RangePickerBounds | ((currentBounds: RangePickerBounds) => RangePickerBounds)) => {
            captureScrollAnchor()
            setRangeBounds(currentBounds => {
                const resolvedBounds = typeof nextBounds === 'function' ? nextBounds(currentBounds) : nextBounds

                if (isSameRangePickerBounds(currentBounds, resolvedBounds)) {
                    scrollAnchorRef.current = null
                    return currentBounds
                }

                return resolvedBounds
            })
        },
        [captureScrollAnchor],
    )

    React.useEffect(() => {
        setRangeBoundsPreservingScroll(getRangePickerBounds(selectedRange, dayPickerProps.today ?? new Date()))
    }, [dayPickerProps.today, selectedFromTime, selectedToTime, selectedRange, setRangeBoundsPreservingScroll])

    React.useLayoutEffect(() => {
        const anchor = scrollAnchorRef.current
        const scrollArea = scrollAreaRef.current
        if (!anchor || !scrollArea) return

        scrollAnchorRef.current = null

        const anchorElement = scrollArea.querySelector<HTMLElement>(
            `[data-calendar-range-month="${anchor.monthKey}"]`,
        )
        if (!anchorElement) return

        const viewportTop = scrollArea.getBoundingClientRect().top + RANGE_PICKER_WEEKDAY_HEIGHT
        const nextTop = anchorElement.getBoundingClientRect().top - viewportTop
        scrollArea.scrollTop += nextTop - anchor.top
    }, [rangeBounds.startMonth, rangeBounds.endMonth])

    React.useLayoutEffect(() => {
        if (initialScrollDoneRef.current) return

        const focusDate = getRangePickerFocusDate(selectedRange, dayPickerProps.today ?? dateLib.today())
        const scrollArea = scrollAreaRef.current
        const focusMonth = scrollArea?.querySelector<HTMLElement>(
            `[data-calendar-range-month="${formatMonthKey(focusDate)}"]`,
        )
        if (!scrollArea || !focusMonth) return

        scrollArea.scrollTop = getCenteredScrollTop(scrollArea, focusMonth)
        initialScrollDoneRef.current = true
    }, [dateLib, dayPickerProps.today, rangeBounds.startMonth, rangeBounds.endMonth, selectedRange])

    React.useLayoutEffect(() => {
        if (todayScrollToken === 0) return
        if (lastTodayScrollTokenRef.current === todayScrollToken) return

        const scrollArea = scrollAreaRef.current
        const todayMonth = scrollArea?.querySelector<HTMLElement>('[data-calendar-range-today-month="true"]')
        if (!scrollArea || !todayMonth) return

        scrollArea.scrollTop = getCenteredScrollTop(scrollArea, todayMonth)
        lastTodayScrollTokenRef.current = todayScrollToken
    }, [todayScrollToken, rangeBounds.startMonth, rangeBounds.endMonth])

    const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
        onScroll?.(event)

        const scrollArea = event.currentTarget
        const isNearTop = scrollArea.scrollTop < RANGE_PICKER_SCROLL_THRESHOLD
        const isNearBottom =
            scrollArea.scrollHeight - scrollArea.clientHeight - scrollArea.scrollTop < RANGE_PICKER_SCROLL_THRESHOLD

        if (!isNearTop && !isNearBottom) return

        setRangeBoundsPreservingScroll(currentBounds => ({
            startMonth: isNearTop ? addCalendarMonths(currentBounds.startMonth, -1) : currentBounds.startMonth,
            endMonth: isNearBottom ? addCalendarMonths(currentBounds.endMonth, 1) : currentBounds.endMonth,
        }))
    }

    return (
        <div
            ref={scrollAreaRef}
            data-slot='calendar-range-picker'
            className={cn('max-h-114 overflow-y-auto overscroll-contain', className)}
            onScroll={handleScroll}
            {...props}
        >
            <div className='sticky top-0 z-20 mx-3 flex h-12 bg-surface-container-high'>
                {weekdayLabels.map((day, index) => (
                    <div key={`${day}-${index}`} className='flex h-12 w-12 items-center justify-center text-base leading-6'>
                        {day}
                    </div>
                ))}
            </div>
            <CalendarRangeDayPicker
                month={rangeBounds.startMonth}
                showOutsideDays={false}
                hideWeekdays
                numberOfMonths={numberOfMonths}
            />
        </div>
    )
}

function CalendarRangeInputPicker({ className, ...props }: React.ComponentProps<'div'>) {
    const { selectedRange, selectRange } = useCalendarContext()

    return (
        <div
            data-slot='calendar-range-input-picker'
            className={cn('flex items-start gap-3 px-6 pt-4.5 pb-4', className)}
            {...props}
        >
            <CalendarTextInput
                label='Date'
                value={formatInputDate(selectedRange?.from)}
                placeholder='mm/dd/yyyy'
                onDateChange={date => selectRange({ from: date, to: selectedRange?.to })}
            />
            <CalendarTextInput
                label='End date'
                value={formatInputDate(selectedRange?.to)}
                placeholder='End date'
                onDateChange={date => selectRange({ from: selectedRange?.from, to: date })}
            />
        </div>
    )
}

function CalendarPicker({ className, ...props }: React.ComponentProps<'div'>) {
    const { view, showOutsideDays } = useCalendarContext()

    return (
        <div data-slot='calendar-picker' className={cn('flex flex-col', className)} {...props}>
            {view === 'month' ? (
                <DockedList />
            ) : view === 'year' ? (
                <DockedList />
            ) : (
                <>
                    <DockedSelectionRow />
                    <CalendarDayPicker
                        showOutsideDays={showOutsideDays ?? true}
                    />
                </>
            )}
        </div>
    )
}

function CalendarDayPicker({
    hideWeekdays = false,
    numberOfMonths,
    showOutsideDays,
}: {
    hideWeekdays?: boolean
    numberOfMonths?: DayPickerProps['numberOfMonths']
    showOutsideDays?: DayPickerProps['showOutsideDays']
}) {
    const {
        displayMonth,
        setDisplayMonth,
        selectedSingle,
        selectSingle,
        classNames,
        components,
        dayPickerProps,
    } = useCalendarContext()

    return (
        <DayPicker
            mode='single'
            month={displayMonth}
            onMonthChange={setDisplayMonth}
            selected={selectedSingle}
            onSelect={selectSingle}
            numberOfMonths={numberOfMonths}
            showOutsideDays={showOutsideDays}
            classNames={getCalendarDayPickerClassNames(hideWeekdays, classNames)}
            components={getCalendarDayPickerComponents(components)}
            {...dayPickerProps}
        />
    )
}

function CalendarRangeDayPicker({
    hideWeekdays = false,
    month,
    numberOfMonths,
    showOutsideDays,
}: {
    hideWeekdays?: boolean
    month?: DayPickerProps['month']
    numberOfMonths?: DayPickerProps['numberOfMonths']
    showOutsideDays?: DayPickerProps['showOutsideDays']
}) {
    const {
        displayMonth,
        setDisplayMonth,
        selectedRange,
        selectRange,
        classNames,
        components,
        dayPickerProps,
    } = useCalendarContext()

    return (
        <DayPicker
            mode='range'
            month={month ?? displayMonth}
            onMonthChange={setDisplayMonth}
            selected={selectedRange}
            onSelect={selectRange}
            numberOfMonths={numberOfMonths}
            showOutsideDays={showOutsideDays}
            classNames={getCalendarRangeDayPickerClassNames(hideWeekdays, classNames)}
            components={getCalendarRangeDayPickerComponents(components)}
            {...dayPickerProps}
        />
    )
}

function getCalendarDayPickerClassNames(hideWeekdays: boolean, classNames: DayPickerProps['classNames']) {
    return {
        [UI.Root]: 'select-none px-3 pb-1',
        [UI.Months]: 'flex flex-col gap-4',
        [UI.Month]: 'flex flex-col',
        [UI.MonthCaption]: 'hidden',
        [UI.Nav]: 'hidden',
        [UI.MonthGrid]: 'border-collapse',
        [UI.Weekdays]: cn('flex', hideWeekdays && 'hidden'),
        [UI.Weekday]: 'flex h-12 w-12 items-center justify-center text-base leading-6 font-normal text-on-surface',
        [UI.Weeks]: 'flex flex-col',
        [UI.Week]: 'flex',
        [UI.Day]: 'relative flex h-12 w-12 items-center justify-center',
        [UI.DayButton]: 'outline-none',
        [DayFlag.outside]: 'text-on-surface-variant/38',
        [DayFlag.disabled]: 'pointer-events-none text-on-surface/38',
        [DayFlag.hidden]: 'invisible',
        [DayFlag.today]: '',
        [SelectionState.selected]: '',
        [SelectionState.range_start]: 'rounded-s-full bg-primary/12',
        [SelectionState.range_middle]: 'bg-primary/12',
        [SelectionState.range_end]: 'rounded-e-full bg-primary/12',
        ...classNames,
    }
}

function getCalendarDayPickerComponents(components: DayPickerProps['components']) {
    return {
        DayButton: CalendarDayButton,
        ...components,
    }
}

function getCalendarRangeDayPickerClassNames(hideWeekdays: boolean, classNames: DayPickerProps['classNames']) {
    return {
        [UI.Root]: 'select-none px-0 pb-0',
        [UI.Months]: 'flex flex-col',
        [UI.Month]: 'mx-3 flex w-84 flex-col',
        [UI.MonthCaption]: 'flex h-12 items-start px-6 pt-4 pb-3',
        [UI.CaptionLabel]: 'text-sm leading-5 font-medium text-on-surface-variant',
        [UI.Nav]: 'hidden',
        [UI.MonthGrid]: 'border-collapse',
        [UI.Weekdays]: cn('flex', hideWeekdays && 'hidden'),
        [UI.Weekday]: 'flex h-12 w-12 items-center justify-center text-base leading-6 font-normal text-on-surface',
        [UI.Weeks]: 'flex flex-col',
        [UI.Week]: 'flex',
        [UI.Day]: 'relative flex h-12 w-12 items-center justify-center overflow-hidden',
        [UI.DayButton]: 'outline-none',
        [DayFlag.outside]: 'text-on-surface-variant/38',
        [DayFlag.disabled]: 'pointer-events-none text-on-surface/38',
        [DayFlag.hidden]: 'invisible',
        [DayFlag.today]: '',
        [SelectionState.selected]: '',
        [SelectionState.range_start]: 'before:absolute before:top-1 before:right-0 before:bottom-1 before:left-1/2 before:bg-secondary-container',
        [SelectionState.range_middle]: 'before:absolute before:inset-x-0 before:inset-y-1 before:bg-secondary-container',
        [SelectionState.range_end]: 'before:absolute before:top-1 before:right-1/2 before:bottom-1 before:left-0 before:bg-secondary-container',
        ...classNames,
    }
}

function getCalendarRangeDayPickerComponents(components: DayPickerProps['components']) {
    return {
        ...components,
        DayButton: CalendarDayButton,
        Month: CalendarRangeMonth,
    }
}

function CalendarRangeMonth({ calendarMonth, displayIndex, className, ...props }: MonthProps) {
    const { dateLib } = useCalendarContext()
    const today = dateLib.today()
    const month = calendarMonth.date
    void displayIndex

    return (
        <div
            data-calendar-range-month={formatMonthKey(month)}
            data-calendar-range-today-month={isSameCalendarMonth(month, today)}
            className={className}
            {...props}
        />
    )
}

function CalendarDayButton({ className, day, modifiers, children, disabled, ...props }: DayButtonProps) {
    const { dateLib } = useCalendarContext()
    const isRangeMiddle = modifiers.range_middle && !modifiers.range_start && !modifiers.range_end
    const isRangeEndpoint = modifiers.range_start || modifiers.range_end
    const isSelected = (modifiers.selected && !isRangeMiddle) || isRangeEndpoint
    const isDisabled = disabled || modifiers.disabled

    return (
        <button
            data-day={formatDataDay(day.date, dateLib)}
            disabled={isDisabled}
            className={cn(
                'relative z-10 flex size-10 items-center justify-center rounded-full text-base leading-6 transition-colors outline-none hover:bg-on-surface/8 focus-visible:ring-2 focus-visible:ring-primary active:bg-on-surface/10',
                modifiers.today && 'border',
                modifiers.today && (isSelected ? 'border-on-primary' : 'border-primary text-primary'),
                modifiers.outside && 'text-on-surface-variant/38',
                isDisabled && 'pointer-events-none text-on-surface/38',
                isRangeMiddle && 'rounded-none bg-transparent text-on-secondary-container',
                isSelected && 'bg-primary text-on-primary hover:bg-primary active:bg-primary',
                className,
            )}
            {...props}
        >
            {children}
        </button>
    )
}

function CalendarSelectionRow() {
    const { displayMonth, setDisplayMonth, view, setView, dateLib, dateLibOptions, dayPickerProps } = useCalendarContext()

    return (
        <div className='flex items-center justify-between py-1 pr-3 pl-4'>
            <CalendarMenuButton onClick={() => setView(view === 'year' ? 'day' : 'year')} expanded={view === 'year'}>
                {formatMonthYear(displayMonth, dateLib, dateLibOptions, dayPickerProps.formatters)}
            </CalendarMenuButton>
            <div className='flex items-center'>
                <CalendarIconButton label='Previous month' onClick={() => setDisplayMonth(dateLib.addMonths(displayMonth, -1))}>
                    <i className='icon-[material-symbols--chevron-left-rounded]' />
                </CalendarIconButton>
                <CalendarIconButton label='Next month' onClick={() => setDisplayMonth(dateLib.addMonths(displayMonth, 1))}>
                    <i className='icon-[material-symbols--chevron-right-rounded]' />
                </CalendarIconButton>
            </div>
        </div>
    )
}

function DockedSelectionRow() {
    const { displayMonth, setDisplayMonth, view, setView, dateLib, dayPickerProps } = useCalendarContext()

    return (
        <div className='flex h-16 items-center justify-between'>
            <div className='flex items-center justify-center'>
                <CalendarIconButton label='Previous month' onClick={() => setDisplayMonth(dateLib.addMonths(displayMonth, -1))}>
                    <i className='icon-[material-symbols--chevron-left-rounded]' />
                </CalendarIconButton>
                <CalendarMenuButton onClick={() => setView(view === 'month' ? 'day' : 'month')} expanded={view === 'month'}>
                    {formatMonthName(displayMonth, dateLib, 'short', dayPickerProps.formatters)}
                </CalendarMenuButton>
                <CalendarIconButton label='Next month' onClick={() => setDisplayMonth(dateLib.addMonths(displayMonth, 1))}>
                    <i className='icon-[material-symbols--chevron-right-rounded]' />
                </CalendarIconButton>
            </div>
            <div className='flex items-center justify-center'>
                <CalendarIconButton label='Previous year' onClick={() => setDisplayMonth(dateLib.setYear(displayMonth, dateLib.getYear(displayMonth) - 1))}>
                    <i className='icon-[material-symbols--chevron-left-rounded]' />
                </CalendarIconButton>
                <CalendarMenuButton onClick={() => setView(view === 'year' ? 'day' : 'year')} expanded={view === 'year'}>
                    {formatYear(dateLib.getYear(displayMonth), dateLib, dayPickerProps.formatters)}
                </CalendarMenuButton>
                <CalendarIconButton label='Next year' onClick={() => setDisplayMonth(dateLib.setYear(displayMonth, dateLib.getYear(displayMonth) + 1))}>
                    <i className='icon-[material-symbols--chevron-right-rounded]' />
                </CalendarIconButton>
            </div>
        </div>
    )
}

function DockedList() {
    const { displayMonth, setDisplayMonth, view, setView, yearRange, dateLib, dayPickerProps } = useCalendarContext()
    const years = React.useMemo(() => getYears(yearRange), [yearRange])
    const monthLabels = React.useMemo(
        () => getMonthLabels(dateLib, dayPickerProps.formatters, dateLib.getYear(displayMonth)),
        [dateLib, dayPickerProps.formatters, displayMonth],
    )
    const selectedYearRef = React.useRef<HTMLButtonElement>(null)

    React.useEffect(() => {
        if (view === 'year') {
            selectedYearRef.current?.scrollIntoView({ block: 'center' })
        }
    }, [displayMonth, view])

    return (
        <>
            <div className='flex h-16 items-center justify-between border-b border-outline-variant px-12'>
                <CalendarMenuButton onClick={() => setView(view === 'month' ? 'day' : 'month')} expanded={view === 'month'}>
                    {formatMonthName(displayMonth, dateLib, 'short', dayPickerProps.formatters)}
                </CalendarMenuButton>
                <CalendarMenuButton onClick={() => setView(view === 'year' ? 'day' : 'year')} expanded={view === 'year'}>
                    {formatYear(dateLib.getYear(displayMonth), dateLib, dayPickerProps.formatters)}
                </CalendarMenuButton>
            </div>
            <div className='flex max-h-113 flex-col overflow-y-auto pb-5'>
                {view === 'month'
                    ? monthLabels.map((label, index) => {
                          const selected = index === dateLib.getMonth(displayMonth)
                          return (
                              <DockedListItem
                                  key={index}
                                  selected={selected}
                                  onClick={() => {
                                      setDisplayMonth(dateLib.setMonth(displayMonth, index))
                                      setView('day')
                                  }}
                              >
                                  {label}
                              </DockedListItem>
                          )
                      })
                    : years.map(year => {
                          const selected = year === dateLib.getYear(displayMonth)
                          return (
                              <DockedListItem
                                  key={year}
                                  buttonRef={selected ? selectedYearRef : undefined}
                                  selected={selected}
                                  onClick={() => {
                                      setDisplayMonth(dateLib.setYear(displayMonth, year))
                                      setView('day')
                                  }}
                              >
                                  {formatYear(year, dateLib, dayPickerProps.formatters)}
                              </DockedListItem>
                          )
                      })}
            </div>
        </>
    )
}

function DockedListItem({
    selected,
    buttonRef,
    children,
    className,
    ...props
}: React.ComponentProps<'button'> & {
    selected: boolean
    buttonRef?: React.Ref<HTMLButtonElement>
}) {
    return (
        <button
            ref={buttonRef}
            type='button'
            className={cn(
                'relative flex min-h-12 items-center gap-4 px-4 py-1 text-left text-base leading-6 transition-colors hover:bg-on-surface/8',
                selected && 'bg-on-surface/8',
                className,
            )}
            {...props}
        >
            <span className='flex size-6 shrink-0 items-center justify-center'>
                {selected && <i className='icon-[material-symbols--check-rounded]' />}
            </span>
            <span className='min-w-66'>{children}</span>
        </button>
    )
}

function YearGrid() {
    const { yearRange, displayMonth, setDisplayMonth, setView, dateLib, dayPickerProps } = useCalendarContext()
    const years = React.useMemo(() => getYears(yearRange), [yearRange])
    const selectedYear = dateLib.getYear(displayMonth)
    const selectedYearRef = React.useRef<HTMLButtonElement>(null)

    React.useEffect(() => {
        selectedYearRef.current?.scrollIntoView({ block: 'center' })
    }, [selectedYear])

    return (
        <div className='grid max-h-78 w-full grid-cols-[repeat(3,auto)] justify-between gap-y-4 overflow-y-auto px-6 py-6'>
            {years.map(year => (
                <button
                    key={year}
                    ref={year === selectedYear ? selectedYearRef : undefined}
                    type='button'
                    className={cn(
                        'flex h-9 w-18 items-center justify-center rounded-full text-base leading-6 text-on-surface-variant transition-colors hover:bg-on-surface/8',
                        year === selectedYear && 'bg-primary font-medium text-on-primary hover:bg-primary',
                    )}
                    onClick={() => {
                        setDisplayMonth(dateLib.setYear(displayMonth, year))
                        setView('day')
                    }}
                >
                    {formatYear(year, dateLib, dayPickerProps.formatters)}
                </button>
            ))}
        </div>
    )
}

function CalendarTextInput({
    label,
    value,
    placeholder,
    helperText,
    trailingIcon,
    className,
    onDateChange,
}: {
    label: string
    value?: string
    placeholder: string
    helperText?: string
    trailingIcon?: React.ReactNode
    className?: string
    onDateChange: (date: Date | undefined) => void
}) {
    const [text, setText] = React.useState(value ?? '')

    React.useEffect(() => {
        setText(value ?? '')
    }, [value])

    return (
        <div className={cn('flex flex-col gap-1', className)}>
            <label
                className={cn(
                    'group relative flex h-14 items-center rounded border pl-4 text-base leading-6 transition-colors',
                    'border-outline text-on-surface focus-within:[box-shadow:inset_0_0_0_2px_var(--color-primary)]',
                )}
            >
                <span
                    className={cn(
                        'absolute -top-2 left-3 bg-surface-container-high px-1 text-xs leading-4',
                        'text-on-surface-variant group-focus-within:text-primary',
                    )}
                >
                    {label}
                </span>
                <input
                    className='min-w-0 flex-1 bg-transparent outline-none placeholder:text-on-surface-variant'
                    value={text}
                    placeholder={placeholder}
                    inputMode='numeric'
                    onChange={event => {
                        const nextValue = event.target.value
                        setText(nextValue)
                        if (nextValue.length >= 8) {
                            onDateChange(parseInputDate(nextValue))
                        }
                    }}
                    onBlur={() => onDateChange(parseInputDate(text))}
                />
                {trailingIcon && <span className='flex h-12 w-12 shrink-0 items-center justify-center'>{trailingIcon}</span>}
            </label>
            {helperText && <p className='px-4 text-xs leading-4 text-on-surface-variant'>{helperText}</p>}
        </div>
    )
}

function CalendarFooter({ className, ...props }: React.ComponentProps<'div'>) {
    return (
        <div
            data-slot='calendar-footer'
            className={cn('flex w-full items-start justify-end gap-2 px-3 pt-1 pb-2', className)}
            {...props}
        />
    )
}

type CalendarActionButtonProps = React.ComponentProps<typeof Button> & {
    action?: () => void
    dataSlot: string
}

function CalendarActionButton({
    action,
    asChild = false,
    children,
    className,
    dataSlot,
    disabled,
    icon,
    onClick,
    size = 'sm',
    square,
    type = 'button',
    variant = 'text',
    ...props
}: CalendarActionButtonProps) {
    const handleClick: React.MouseEventHandler<HTMLButtonElement> = event => {
        if (disabled) {
            event.preventDefault()
            return
        }

        onClick?.(event)
        if (event.defaultPrevented) return

        action?.()
    }

    if (asChild) {
        const slotButtonProps = { type } satisfies Pick<React.ComponentProps<'button'>, 'type'>
        const slotDisabledProps = disabled
            ? ({ disabled } satisfies Pick<React.ComponentProps<'button'>, 'disabled'>)
            : {}

        return (
            <Slot
                data-slot={dataSlot}
                data-disabled={disabled || undefined}
                aria-disabled={disabled || undefined}
                className={className}
                onClick={handleClick}
                {...slotButtonProps}
                {...slotDisabledProps}
                {...props}
            >
                {children}
            </Slot>
        )
    }

    return (
        <Button
            type={type}
            variant={variant}
            size={size}
            square={square}
            icon={icon}
            data-slot={dataSlot}
            className={className}
            disabled={disabled}
            onClick={handleClick}
            {...props}
        >
            {children}
        </Button>
    )
}

function CalendarClearButton({
    children,
    className,
    onClear,
    onClick,
    ...props
}: React.ComponentProps<typeof Button> & {
    onClear?: () => void
}) {
    const { clear } = useCalendarContext()

    return (
        <CalendarActionButton
            dataSlot='calendar-clear-button'
            className={cn('mr-auto', className)}
            onClick={onClick}
            action={() => {
                clear()
                onClear?.()
            }}
            {...props}
        >
            {children}
        </CalendarActionButton>
    )
}

function CalendarTodayButton({
    children,
    className,
    disabled,
    onToday,
    onClick,
    ...props
}: React.ComponentProps<typeof Button> & {
    onToday?: () => void
}) {
    const { dateLib, isDateDisabled, selectToday } = useCalendarContext()
    const isTodayDisabled = isDateDisabled(dateLib.today())

    return (
        <CalendarActionButton
            dataSlot='calendar-today-button'
            className={cn('mr-auto', className)}
            disabled={disabled || isTodayDisabled}
            onClick={onClick}
            action={() => {
                selectToday()
                onToday?.()
            }}
            {...props}
        >
            {children}
        </CalendarActionButton>
    )
}

function CalendarCancelButton({
    children,
    onCancel,
    onClick,
    ...props
}: React.ComponentProps<typeof Button> & {
    onCancel?: () => void
}) {
    return (
        <CalendarActionButton
            dataSlot='calendar-cancel-button'
            onClick={onClick}
            action={() => {
                onCancel?.()
            }}
            {...props}
        >
            {children}
        </CalendarActionButton>
    )
}

function CalendarConfirmButton({
    children,
    onConfirm,
    onClick,
    ...props
}: React.ComponentProps<typeof Button> & {
    onConfirm?: () => void
}) {
    return (
        <CalendarActionButton
            dataSlot='calendar-confirm-button'
            onClick={onClick}
            action={() => {
                onConfirm?.()
            }}
            {...props}
        >
            {children}
        </CalendarActionButton>
    )
}

function CalendarIconButton({
    label,
    wide = false,
    square = false,
    children,
    ...props
}: React.ComponentProps<'button'> & {
    label: string
    wide?: boolean
    square?: boolean
}) {
    return (
        <button
            type='button'
            aria-label={label}
            className={cn(
                'group relative flex h-12 shrink-0 items-center justify-center rounded-full text-on-surface-variant outline-none transition-colors hover:bg-on-surface-variant/8 focus-visible:ring-2 focus-visible:ring-primary active:bg-on-surface-variant/10 [&_i]:size-6',
                wide ? 'w-13' : 'w-12',
                square && 'rounded-lg',
            )}
            {...props}
        >
            {children}
            <Ripple />
        </button>
    )
}

function CalendarMenuButton({
    children,
    expanded = false,
    ...props
}: React.ComponentProps<'button'> & {
    expanded?: boolean
}) {
    return (
        <button
            type='button'
            className='group relative flex items-center justify-center gap-2 rounded-full py-2.5 pr-1 pl-2 text-sm leading-5 font-medium text-on-surface-variant outline-none transition-colors hover:bg-on-surface-variant/8 focus-visible:ring-2 focus-visible:ring-primary disabled:pointer-events-none disabled:opacity-38'
            {...props}
        >
            <span>{children}</span>
            {!props.disabled && (
                <i
                    className={cn(
                        'icon-[material-symbols--arrow-drop-down-rounded] size-4.5 transition-transform',
                        expanded && 'rotate-180',
                    )}
                />
            )}
            <Ripple />
        </button>
    )
}

function getWeekdayLabels(
    dateLib: DateLib,
    dateLibOptions: CalendarDateLibOptions,
    dayPickerProps: CalendarDayPickerOptions,
) {
    const referenceToday = dayPickerProps.today ?? dateLib.today()
    const start = dayPickerProps.broadcastCalendar
        ? dateLib.startOfBroadcastWeek(referenceToday, dateLib)
        : dayPickerProps.ISOWeek
          ? dateLib.startOfISOWeek(referenceToday)
          : dateLib.startOfWeek(referenceToday)
    const weekdays = Array.from({ length: 7 }, (_, index) => dateLib.addDays(start, index))
    const formatWeekday = dayPickerProps.formatters?.formatWeekdayName ?? formatWeekdayName

    return weekdays.map(weekday => formatWeekday(weekday, dateLibOptions, dateLib))
}

function getMonthLabels(dateLib: DateLib, formatters: DayPickerProps['formatters'] | undefined, year: number) {
    const formatMonth = formatters?.formatMonthDropdown ?? formatMonthDropdown

    return Array.from({ length: 12 }, (_, index) => formatMonth(dateLib.newDate(year, index, 1), dateLib))
}

function formatHeaderLabel(value: CalendarSelectionValue, isRange: boolean, dateLib: DateLib) {
    if (isRange) {
        return formatRangeHeaderLabel(isDateRangeValue(value) ? value : undefined, dateLib)
    }

    return isDate(value) ? dateLib.format(value, 'EEE, MMM d') : 'Select date'
}

function formatRangeHeaderLabel(range: DateRange | undefined, dateLib: DateLib) {
    if (!range?.from && !range?.to) return 'Select dates'
    if (range.from && !range.to) return formatShortHeaderDate(range.from, dateLib)
    if (!range.from && range.to) return formatShortHeaderDate(range.to, dateLib)
    return `${formatShortHeaderDate(range.from, dateLib)} - ${formatShortHeaderDate(range.to, dateLib)}`
}

function formatShortHeaderDate(date: Date | undefined, dateLib: DateLib) {
    if (!date) return ''

    return dateLib.format(date, 'MMM d')
}

function formatMonthYear(
    date: Date,
    dateLib: DateLib,
    dateLibOptions: CalendarDateLibOptions,
    formatters?: DayPickerProps['formatters'],
) {
    const formatMonthCaption = formatters?.formatCaption ?? formatters?.formatMonthCaption ?? formatCaption

    return formatMonthCaption(date, dateLibOptions, dateLib)
}

function formatMonthName(
    date: Date,
    dateLib: DateLib,
    width: 'short' | 'long' = 'long',
    formatters?: DayPickerProps['formatters'],
) {
    if (width === 'long') {
        const formatMonth = formatters?.formatMonthDropdown ?? formatMonthDropdown
        return formatMonth(date, dateLib)
    }

    return dateLib.format(date, 'LLL')
}

function formatYear(year: number, dateLib: DateLib, formatters?: DayPickerProps['formatters']) {
    const formatYear = formatters?.formatYearDropdown ?? formatters?.formatYearCaption ?? formatYearDropdown

    return formatYear(dateLib.newDate(year, 0, 1), dateLib)
}

function formatDataDay(date: Date, dateLib: DateLib) {
    return dateLib.format(date, 'P')
}

function getDateLibOptions(options: CalendarDayPickerOptions): CalendarDateLibOptions {
    return {
        locale: getDateLibLocale(options.locale),
        weekStartsOn: options.weekStartsOn,
        firstWeekContainsDate: options.firstWeekContainsDate,
        useAdditionalWeekYearTokens: options.useAdditionalWeekYearTokens,
        useAdditionalDayOfYearTokens: options.useAdditionalDayOfYearTokens,
        timeZone: options.timeZone,
        numerals: options.numerals,
    }
}

function getDateLibLocale(locale: CalendarDayPickerOptions['locale']): CalendarDateLibOptions['locale'] {
    if (!locale) return undefined

    return {
        ...defaultLocale,
        ...locale,
        code: locale.code ?? defaultLocale.code,
    } as CalendarDateLibOptions['locale']
}

function formatInputDate(date?: Date) {
    if (!date) return ''
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${month}/${day}/${date.getFullYear()}`
}

function parseInputDate(value: string) {
    const match = value.trim().match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/)
    if (!match) return undefined

    const month = Number(match[1])
    const day = Number(match[2])
    const year = Number(match[3])
    const date = new Date(year, month - 1, day)

    if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
        return undefined
    }

    return date
}

function startOfMonth(date: Date) {
    return new Date(date.getFullYear(), date.getMonth(), 1)
}

function addCalendarMonths(date: Date, amount: number) {
    return startOfMonth(new Date(date.getFullYear(), date.getMonth() + amount, 1))
}

function getMonthDistance(start: Date, end: Date) {
    return getMonthIndex(end) - getMonthIndex(start)
}

function getMonthIndex(date: Date) {
    return date.getFullYear() * 12 + date.getMonth()
}

function getRangePickerBounds(range: DateRange | undefined, today: Date): RangePickerBounds {
    let startDate = getRangePickerFocusDate(range, today)
    let endDate = range?.to ?? range?.from ?? today

    if (startDate.getTime() > endDate.getTime()) {
        ;[startDate, endDate] = [endDate, startDate]
    }

    return {
        startMonth: addCalendarMonths(startDate, -RANGE_PICKER_BOUNDARY_MONTHS),
        endMonth: addCalendarMonths(endDate, RANGE_PICKER_BOUNDARY_MONTHS),
    }
}

function getRangePickerFocusDate(range: DateRange | undefined, today: Date) {
    return range?.from ?? range?.to ?? today
}

function isSameRangePickerBounds(bounds: RangePickerBounds, otherBounds: RangePickerBounds) {
    return (
        isSameCalendarMonth(bounds.startMonth, otherBounds.startMonth) &&
        isSameCalendarMonth(bounds.endMonth, otherBounds.endMonth)
    )
}

function getCenteredScrollTop(scrollArea: HTMLElement, target: HTMLElement) {
    const scrollAreaRect = scrollArea.getBoundingClientRect()
    const targetRect = target.getBoundingClientRect()
    const targetTop = targetRect.top - scrollAreaRect.top + scrollArea.scrollTop
    const targetCenter = targetTop + target.offsetHeight / 2
    const visibleHeight = scrollArea.clientHeight - RANGE_PICKER_WEEKDAY_HEIGHT
    const desiredCenter = RANGE_PICKER_WEEKDAY_HEIGHT + visibleHeight / 2
    const maxScrollTop = scrollArea.scrollHeight - scrollArea.clientHeight

    return Math.max(0, Math.min(targetCenter - desiredCenter, maxScrollTop))
}

function formatMonthKey(date: Date) {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
}

function isSameCalendarMonth(date: Date, otherDate: Date) {
    return date.getFullYear() === otherDate.getFullYear() && date.getMonth() === otherDate.getMonth()
}

function getYearRange(
    options: Pick<CalendarProps, 'startMonth' | 'endMonth' | 'fromYear' | 'toYear'>,
    displayMonth: Date,
): YearRange {
    let start = options.startMonth?.getFullYear() ?? options.fromYear ?? DEFAULT_START_YEAR
    let end = options.endMonth?.getFullYear() ?? options.toYear ?? DEFAULT_END_YEAR
    const displayedYear = displayMonth.getFullYear()

    if (start > end) {
        ;[start, end] = [end, start]
    }

    return {
        start: Math.min(start, displayedYear),
        end: Math.max(end, displayedYear),
    }
}

function getYears(range: YearRange) {
    return Array.from({ length: range.end - range.start + 1 }, (_, index) => range.start + index)
}

function isCalendarDateDisabled(
    date: Date | undefined,
    disabled: CalendarDayPickerOptions['disabled'],
    dateLib: DateLib,
) {
    if (!date || !disabled) return false

    return dateMatchModifiers(date, disabled, dateLib)
}

function isCalendarRangeDisabled(
    range: DateRange | undefined,
    disabled: CalendarDayPickerOptions['disabled'],
    dateLib: DateLib,
    excludeDisabled: boolean,
) {
    if (!range || !disabled) return false
    if (isCalendarDateDisabled(range.from, disabled, dateLib)) return true
    if (isCalendarDateDisabled(range.to, disabled, dateLib)) return true
    if (!excludeDisabled || !range.from || !range.to) return false

    return rangeContainsModifiers(getOrderedDateRange(range.from, range.to), disabled, dateLib)
}

function getRangeExcludeDisabled(options: CalendarDayPickerOptions) {
    return 'excludeDisabled' in options && !!options.excludeDisabled
}

function getOrderedDateRange(from: Date, to: Date) {
    return from.getTime() <= to.getTime() ? { from, to } : { from: to, to: from }
}

function getSelectedMonth(selected?: Date | DateRange) {
    if (isDate(selected)) return selected
    if (isDateRangeValue(selected)) return selected.from ?? selected.to
    return undefined
}

function isDate(value: unknown): value is Date {
    return value instanceof Date
}

function isDateRangeValue(value: unknown): value is DateRange {
    return !!value && typeof value === 'object' && ('from' in value || 'to' in value)
}

export {
    Calendar,
    CalendarHeader,
    CalendarCompactPicker,
    CalendarInputPicker,
    CalendarRangePicker,
    CalendarRangeInputPicker,
    CalendarPicker,
    CalendarFooter,
    CalendarClearButton,
    CalendarTodayButton,
    CalendarCancelButton,
    CalendarConfirmButton,
    type CalendarProps,
    type CalendarSelectionValue,
    type CalendarView,
}
