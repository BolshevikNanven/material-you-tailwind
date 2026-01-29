'use client'

import { cn } from '@/lib/utils'
import { cva } from 'class-variance-authority'
import React from 'react'
import { Ripple } from './ripple'

import * as Dialog from '@radix-ui/react-dialog'
import { Slot } from '@radix-ui/react-slot'

export type NavigationVariant = 'persistent' | 'modal' | 'hidden'

interface NavigationContextValue {
    variant: NavigationVariant
    contained: boolean
    expanded: boolean
    setExpanded: React.Dispatch<React.SetStateAction<boolean>>
    portalContainer: HTMLElement | null
    setPortalContainer: (node: HTMLElement | null) => void
}

interface RailProps {
    variant?: NavigationVariant
    contained?: boolean
    expanded?: boolean
    onExpand?: (value: boolean) => void
    children: React.ReactNode
}

const NavigationContext = React.createContext<NavigationContextValue>({
    variant: 'persistent',
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
                false: 'mb-1 flex w-14 flex-col items-center justify-center gap-1 py-1.5 transition-none',
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
    asChild,
    ...props
}: React.ComponentProps<'div'> & { icon: React.ReactNode; active?: boolean; asChild?: boolean }) {
    const { expanded } = React.useContext(NavigationContext)
    const Comp = asChild ? Slot : 'div'

    const Adornments = (child: React.ReactNode) => (
        <>
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
            <div className='z-10 text-center'>{child}</div>
        </>
    )

    return (
        <Comp
            data-slot='navigation-rail-item'
            data-active={!!active}
            className={cn('group', railItemVariants({ horizon: expanded, className }))}
            {...props}
        >
            {asChild && React.isValidElement(children)
                ? React.cloneElement(children as React.ReactElement<React.PropsWithChildren>, {
                      children: Adornments((children as React.ReactElement<React.PropsWithChildren>).props.children),
                  })
                : Adornments(children)}
        </Comp>
    )
})

function NavigationRailContent({ className, children, ...props }: React.ComponentProps<'div'>) {
    const { variant, expanded, setExpanded, contained, setPortalContainer, ...ctx } = React.useContext(NavigationContext)
    const anchorRef = React.useRef<HTMLSpanElement>(null)

    React.useLayoutEffect(() => {
        if (contained && variant === 'modal' && anchorRef.current) {
            setPortalContainer(anchorRef.current.parentElement)
        }
    }, [contained, variant, setPortalContainer])

    const subContextValue = React.useMemo(
        () => ({
            ...ctx,
            variant,
            contained,
            setPortalContainer,
            expanded: variant === 'persistent' ? expanded : false,
            setExpanded,
            portalContainer: null,
        }),
        [ctx, variant, contained, setPortalContainer, expanded, setExpanded],
    )

    return (
        <>
            <span ref={anchorRef} className='hidden' aria-hidden='true' />
            {variant !== 'hidden' && (
                <div
                    data-slot='navigation-rail'
                    className={cn(
                        'relative flex h-full flex-col pt-4 transition-all ease-out',
                        expanded && variant === 'persistent' ? 'w-55' : 'w-22',
                        className,
                    )}
                    {...props}
                >
                    <NavigationContext.Provider value={subContextValue}>{children}</NavigationContext.Provider>
                </div>
            )}
            {variant !== 'persistent' && (
                <RailModalContent className={className} {...props}>
                    {children}
                </RailModalContent>
            )}
        </>
    )
}

function RailModalContent({ className, children, ...props }: React.ComponentProps<'div'>) {
    const { variant, expanded, setExpanded, portalContainer, ...ctx } = React.useContext(NavigationContext)

    const close = () => {
        setExpanded(false)
    }

    const modalContextValue = React.useMemo(
        () => ({
            ...ctx,
            variant,
            expanded: true,
            setExpanded,
            portalContainer,
        }),
        [ctx, setExpanded, portalContainer, variant],
    )

    return (
        <Dialog.Root open={expanded}>
            <Dialog.Portal container={portalContainer}>
                <Dialog.Overlay
                    onClick={close}
                    className={cn(
                        'absolute inset-0 z-98 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0',
                        variant === 'hidden' && 'bg-black/20',
                    )}
                />
                <Dialog.Content
                    className={cn(
                        'absolute top-0 left-0 z-99 flex h-full w-55 flex-col rounded-r-2xl bg-surface-container pt-4 transition-all duration-300 ease-out outline-none',
                        expanded ? 'animate-in slide-in-from-left-100' : 'animate-out slide-out-to-left-100',
                        variant === 'modal' && 'shadow-elevation-2',
                        className,
                    )}
                    {...props}
                >
                    <Dialog.Title className='hidden'>expanded navigation</Dialog.Title>
                    <NavigationContext.Provider value={modalContextValue}>{children}</NavigationContext.Provider>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    )
}

const NavigationRailMenu = React.memo(function NavigationRailMenu({
    className,
    children,
    ...props
}: React.ComponentProps<'div'>) {
    const { expanded } = React.useContext(NavigationContext)

    return (
        <div className={cn('mx-4 mb-2 flex flex-col gap-1', expanded ? 'w-fit' : 'w-14', className)} {...props}>
            {children}
        </div>
    )
})

const NavigationRailTrigger = React.memo(function NavigationRailTrigger({
    onClick,
    className,
    asChild = false,
    ...props
}: React.ComponentProps<'div'> & { asChild?: boolean }) {
    const { expanded, setExpanded, variant, contained, setPortalContainer } = React.useContext(NavigationContext)
    const triggerRef = React.useRef<HTMLDivElement>(null)

    const Comp = asChild ? Slot : 'div'

    React.useLayoutEffect(() => {
        if (contained && variant === 'hidden' && triggerRef.current) {
            setPortalContainer(triggerRef.current.parentElement)
        }
    }, [contained, variant, setPortalContainer])

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
            onClick={e => {
                setExpanded(prev => !prev)
                onClick?.(e)
            }}
            {...props}
        >
            <Ripple />
            <i
                className={cn(
                    'm-auto size-6',
                    expanded ? 'icon-[material-symbols--menu-open-rounded]' : 'icon-[material-symbols--menu-rounded]',
                )}
            />
        </div>
    )
})

function NavigationRail({ variant = 'persistent', expanded: expandedProp, onExpand, contained = false, children }: RailProps) {
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
            variant,
            expanded,
            setExpanded,
            portalContainer,
            setPortalContainer,
        }),
        [contained, variant, expanded, setExpanded, portalContainer],
    )

    return <NavigationContext.Provider value={contextValue}>{children}</NavigationContext.Provider>
}

export { NavigationRail, NavigationRailContent, NavigationRailMenu, NavigationRailTrigger, NavigationRailItem }
