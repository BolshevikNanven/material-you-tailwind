'use client'

import { cn } from '@/lib/utils'
import { cva } from 'class-variance-authority'
import React from 'react'
import { Ripple } from './ripple'

import * as Dialog from '@radix-ui/react-dialog'
import { Slot } from '@radix-ui/react-slot'

export type NavigationMode = 'persistent' | 'modal' | 'hidden'

interface NavigationContextValue {
    mode: NavigationMode
    contained: boolean
    expanded: boolean
    setExpanded: React.Dispatch<React.SetStateAction<boolean>>
    portalContainer: HTMLElement | null
    setPortalContainer: (node: HTMLElement | null) => void
}

interface RailProps {
    mode?: NavigationMode
    contained?: boolean
    expanded?: boolean
    onExpand?: (value: boolean) => void
    children: React.ReactNode
}

const NavigationContext = React.createContext<NavigationContextValue>({
    mode: 'persistent',
    expanded: false,
    contained: false,
    setExpanded: () => {},
    portalContainer: null,
    setPortalContainer: () => {},
})

const railItemVariants = cva(
    'relative mx-4 flex cursor-pointer text-xs text-on-surface-variant transition-colors select-none',
    {
        variants: {
            horizon: {
                true: [
                    'flex h-14 w-fit items-center gap-2 rounded-full px-4 text-sm',
                    'hover:bg-on-secondary-container/8 active:bg-on-secondary-container/10',
                ],
                false: 'flex w-14 flex-col items-center justify-center gap-1 py-1.5 transition-none',
            },
        },
        defaultVariants: {
            horizon: false,
        },
    },
)
const NavigationRailItem = React.memo(function NavigationRailItem({
    active,
    icon,
    className,
    children,
}: React.ComponentProps<'div'> & { icon: React.ReactNode; active?: boolean }) {
    const { expanded } = React.useContext(NavigationContext)

    return (
        <div
            data-slot='navigation-rail-item'
            data-active={!!active}
            className={cn('group', railItemVariants({ horizon: expanded, className }))}
        >
            <span
                className={cn(
                    'absolute rounded-full bg-secondary-container transition-[scale_width] ease-out',
                    active ? 'scale-x-100' : 'scale-x-0',
                    expanded ? 'top-0 left-0 h-full w-full' : 'top-1.5 h-8 w-14',
                )}
            />
            <span
                data-active={!!active}
                className={cn(
                    'flex items-center justify-center text-on-secondary-container transition-colors *:[i]:size-6',
                    !expanded &&
                        'h-8 w-14 rounded-2xl group-hover:bg-on-secondary-container/8 group-active:bg-on-secondary-container/10',
                )}
            >
                {icon}
            </span>
            <div className='z-10'>{children}</div>
        </div>
    )
})

function NavigationRailContent({
    className,
    children,
    fab,
    ...props
}: React.ComponentProps<'div'> & { fab?: React.ReactNode }) {
    const { mode, expanded, setExpanded, contained, setPortalContainer, ...ctx } = React.useContext(NavigationContext)
    const anchorRef = React.useRef<HTMLSpanElement>(null)

    React.useLayoutEffect(() => {
        if (contained && mode === 'modal' && anchorRef.current) {
            setPortalContainer(anchorRef.current.parentElement)
        }
    }, [contained, mode, setPortalContainer])

    const subContextValue = React.useMemo(
        () => ({
            ...ctx,
            mode,
            contained,
            setPortalContainer,
            expanded: mode === 'persistent' ? expanded : false,
            setExpanded,
            portalContainer: null,
        }),
        [ctx, mode, contained, setPortalContainer, expanded, setExpanded],
    )

    return (
        <>
            <span ref={anchorRef} className='hidden' aria-hidden='true' />
            {mode !== 'hidden' && (
                <div
                    data-slot='navigation-rail'
                    className={cn(
                        'relative flex h-full flex-col pt-4 transition-all ease-out',
                        expanded && mode === 'persistent' ? 'w-55' : 'w-22',
                        className,
                    )}
                    {...props}
                >
                    <div className={cn('mx-4 mb-10 flex flex-col gap-1', expanded ? 'w-fit' : 'w-14')}>
                        <button
                            onClick={() => setExpanded(prev => !prev)}
                            className='flex size-14 cursor-pointer rounded-full transition-colors hover:bg-on-surface-variant/8'
                        >
                            <Ripple />
                            <i
                                className={cn(
                                    'm-auto size-6',
                                    expanded
                                        ? 'icon-[material-symbols--menu-open-rounded]'
                                        : 'icon-[material-symbols--menu-rounded]',
                                )}
                            />
                        </button>
                        {fab}
                    </div>
                    <NavigationContext.Provider value={subContextValue}>
                        <div className={cn('flex flex-1 flex-col', (!expanded || mode !== 'persistent') && 'gap-1')}>
                            {children}
                        </div>
                    </NavigationContext.Provider>
                </div>
            )}
            {mode !== 'persistent' && (
                <RailModalContent className={className} fab={fab} {...props}>
                    {children}
                </RailModalContent>
            )}
        </>
    )
}

function RailModalContent({ className, children, fab, ...props }: React.ComponentProps<'div'> & { fab?: React.ReactNode }) {
    const { mode, expanded, setExpanded, portalContainer, ...ctx } = React.useContext(NavigationContext)

    const close = () => {
        setExpanded(false)
    }

    const modalContextValue = React.useMemo(
        () => ({
            ...ctx,
            mode,
            expanded: true,
            setExpanded,
            portalContainer, // 保持透传
        }),
        [ctx, setExpanded, portalContainer, mode],
    )

    return (
        <Dialog.Root open={expanded}>
            <Dialog.Portal container={portalContainer}>
                <Dialog.Overlay
                    onClick={close}
                    className={cn(
                        'absolute inset-0 z-98 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0',
                        mode === 'hidden' && 'bg-black/20',
                    )}
                />
                <Dialog.Content
                    className={cn(
                        'absolute top-0 left-0 z-99 flex h-full w-55 flex-col rounded-r-2xl bg-surface-container pt-4 transition-all duration-300 ease-out',
                        expanded ? 'animate-in slide-in-from-left-100' : 'animate-out slide-out-to-left-100',
                        mode === 'modal' && 'shadow-elevation-2',
                        className,
                    )}
                    {...props}
                >
                    <Dialog.Title className='hidden'>expanded navigation</Dialog.Title>
                    <div className='mx-4 mb-10 flex w-fit flex-col gap-1'>
                        <button
                            onClick={close}
                            className='flex size-14 cursor-pointer rounded-full transition-colors hover:bg-on-surface-variant/8'
                        >
                            <Ripple />
                            <i className='m-auto icon-[material-symbols--menu-open-rounded] size-6' />
                        </button>
                        {fab}
                    </div>
                    <NavigationContext.Provider value={modalContextValue}>
                        <div className={cn('flex flex-1 flex-col')}>{children}</div>
                    </NavigationContext.Provider>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    )
}

const NavigationRailTrigger = React.memo(function NavigationRailTrigger({
    onClick,
    className,
    asChild = false,
    ...props
}: React.ComponentProps<'div'> & { asChild?: boolean }) {
    const { setExpanded, mode, contained, setPortalContainer } = React.useContext(NavigationContext)
    const triggerRef = React.useRef<HTMLDivElement>(null)

    const Comp = asChild ? Slot : 'div'

    React.useLayoutEffect(() => {
        if (contained && mode === 'hidden' && triggerRef.current) {
            setPortalContainer(triggerRef.current.parentElement)
        }
    }, [contained, mode, setPortalContainer])

    if (asChild) {
        return (
            <Comp
                ref={triggerRef}
                onClick={e => {
                    setExpanded(prev => !prev)
                    onClick?.(e)
                }}
                className={className}
                {...props}
            />
        )
    }

    return (
        <div
            className={cn(
                'flex size-14 cursor-pointer rounded-full transition-colors hover:bg-on-surface-variant/8',
                className,
            )}
            {...props}
        >
            <Ripple />
            <i className='m-auto icon-[material-symbols--menu-rounded] size-6' />
        </div>
    )
})

function NavigationRail({ mode = 'persistent', expanded: expandedProp, onExpand, contained = false, children }: RailProps) {
    const [internalExpanded, setInternalExpanded] = React.useState(false)

    const isControlled = expandedProp !== undefined
    const expanded = isControlled ? expandedProp : internalExpanded

    const [portalContainer, setPortalContainer] = React.useState<HTMLElement | null>(null)

    React.useEffect(() => {
        if (!contained) {
            setPortalContainer(null)
        }
    }, [contained])

    const setExpanded = React.useCallback<React.Dispatch<React.SetStateAction<boolean>>>(
        action => {
            const nextValue = typeof action === 'function' ? (action as (prev: boolean) => boolean)(expanded) : action

            if (!isControlled) {
                setInternalExpanded(nextValue)
            }
            if (nextValue !== expanded) {
                onExpand?.(nextValue)
            }
        },
        [isControlled, expanded, onExpand],
    )

    const contextValue = React.useMemo(
        () => ({
            contained,
            mode,
            expanded,
            setExpanded,
            portalContainer,
            setPortalContainer,
        }),
        [contained, mode, expanded, setExpanded, portalContainer],
    )

    return <NavigationContext.Provider value={contextValue}>{children}</NavigationContext.Provider>
}

export { NavigationRail, NavigationRailContent, NavigationRailTrigger, NavigationRailItem }
