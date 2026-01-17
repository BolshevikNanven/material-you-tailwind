'use client'

import { cn } from '@/lib/utils'
import { cva } from 'class-variance-authority'
import React from 'react'

type NavigationType = 'bar' | 'rail'

interface NavigationContextValue {
    type: NavigationType
    horizon?: boolean
}

const NavigationContext = React.createContext<NavigationContextValue>({ type: 'bar' })

const itemVariants = cva('flex w-full cursor-pointer text-xs text-on-surface-variant transition-colors select-none', {
    variants: {
        type: {} as Record<'bar' | 'rail', string>,
        horizon: {} as Record<'true' | 'false', string>,
    },
    compoundVariants: [
        {
            type: 'bar',
            horizon: false,
            className: 'h-full flex-col items-center justify-center gap-1',
        },
        {
            type: 'bar',
            horizon: true,
            className: [
                'mx-5 my-auto h-10 flex-row items-center justify-center gap-1 rounded-full px-4',
                'hover:bg-on-secondary-container/8 active:bg-on-secondary-container/10 data-[active=true]:bg-secondary-container',
            ],
        },
        {
            type: 'rail',
            horizon: true,
            className: '',
        },
        {
            type: 'rail',
            horizon: false,
            className: '',
        },
    ],
    defaultVariants: {
        type: 'bar',
        horizon: false,
    },
})
const iconVariants = cva(
    'flex flex-1 items-center justify-center text-on-secondary-container transition-colors *:[i]:size-5',
    {
        variants: {
            type: {} as Record<'bar' | 'rail', string>,
            horizon: {} as Record<'true' | 'false', string>,
        },
        compoundVariants: [
            {
                type: 'bar',
                horizon: false,
                className: [
                    'h-8 w-14 rounded-2xl',
                    'group-hover:bg-on-secondary-container/8 group-active:bg-on-secondary-container/10 data-[active=true]:bg-secondary-container',
                ],
            },
            {
                type: 'bar',
                horizon: true,
                className: '',
            },
            {
                type: 'rail',
                horizon: true,
                className: '',
            },
            {
                type: 'rail',
                horizon: false,
                className: '',
            },
        ],
        defaultVariants: {
            type: 'bar',
            horizon: false,
        },
    },
)
function NavigationItem({
    active,
    icon,
    className,
    children,
}: React.ComponentProps<'div'> & { icon: React.ReactNode; active?: boolean }) {
    const { type, horizon } = React.useContext(NavigationContext)

    return (
        <div
            data-slot='navigation-item'
            data-active={!!active}
            className={cn('group', itemVariants({ type, horizon, className }))}
        >
            <span data-active={!!active} className={cn(iconVariants({ type, horizon }))}>
                {icon}
            </span>
            {children}
        </div>
    )
}

function NavigationBar({ wide, className, children }: React.ComponentProps<'div'> & { wide?: boolean }) {
    return (
        <NavigationContext.Provider value={{ type: 'bar', horizon: wide }}>
            <div data-slot='navigation-bar' data-state={!!wide} className={cn('h-16 bg-surface-container py-1.5', className)}>
                <div className={cn('flex h-full justify-center', wide ? 'mx-auto w-fit' : 'w-full')}>{children}</div>
            </div>
        </NavigationContext.Provider>
    )
}

function NavigationRail({ children }: React.ComponentProps<'div'>) {
    return (
        <NavigationContext.Provider value={{ type: 'rail' }}>
            <div data-slot='navigation-rail' className=''>
                {children}
            </div>
        </NavigationContext.Provider>
    )
}

export { NavigationBar, NavigationRail, NavigationItem }
