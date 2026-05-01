'use client'

import * as React from 'react'
import type { DateRange } from 'react-day-picker'

import {
    Calendar,
    CalendarCancelButton,
    CalendarClearButton,
    CalendarCompactPicker,
    CalendarConfirmButton,
    CalendarFooter,
    CalendarHeader,
    type CalendarSelectionValue,
} from '@/components/ui/calendar'

export function CalendarLabelDemo() {
    const [date, setDate] = React.useState<Date | undefined>(new Date(2025, 7, 17))

    return (
        <Calendar mode='single' selected={date} onSelect={value => setDate(value as Date | undefined)}>
            <CalendarHeader title='预约日期' label={formatCalendarLabel} />
            <CalendarCompactPicker />
            <CalendarFooter>
                <CalendarClearButton>清除</CalendarClearButton>
                <CalendarCancelButton>取消</CalendarCancelButton>
                <CalendarConfirmButton>保存</CalendarConfirmButton>
            </CalendarFooter>
        </Calendar>
    )
}

function formatCalendarLabel(value: CalendarSelectionValue) {
    if (value instanceof Date) {
        return new Intl.DateTimeFormat('zh-CN', {
            dateStyle: 'medium',
        }).format(value)
    }

    if (isDateRange(value)) {
        return [value.from, value.to].filter(Boolean).map(date => formatShortDate(date)).join(' 至 ') || '选择日期范围'
    }

    return '选择日期'
}

function formatShortDate(date?: Date) {
    if (!date) return ''

    return new Intl.DateTimeFormat('zh-CN', {
        month: 'short',
        day: 'numeric',
    }).format(date)
}

function isDateRange(value: CalendarSelectionValue): value is DateRange {
    return !!value && !(value instanceof Date) && typeof value === 'object' && ('from' in value || 'to' in value)
}
