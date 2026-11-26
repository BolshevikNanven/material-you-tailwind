'use client'

import * as React from 'react'
import * as TabsPrimitive from '@radix-ui/react-tabs'
import { cn } from '@/lib/utils'
import { cva, type VariantProps } from 'class-variance-authority'
import { Ripple } from './ripple'

function Tabs({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Root>) {
    return <TabsPrimitive.Root data-slot='tabs' className={cn('flex flex-col gap-2', className)} {...props} />
}

const tabListVariants = cva('relative flex border-b border-outline-variant', {
    variants: {
        variant: {
            primary: [
                'h-16 **:data-[slot=tabs-tab]:flex-col **:data-[slot=tabs-tab]:gap-0.5 **:data-[tab-narrow-trigger=false]:h-full',
            ],
            secondary: [
                'h-12 **:data-[slot=tabs-trigger]:px-0',
                '**:data-[slot=tabs-tab]:w-full **:data-[slot=tabs-tab]:gap-2',
            ],
        },
    },
    defaultVariants: {
        variant: 'primary',
    },
})

/** Layout offset of `element` inside `ancestor`, unaffected by CSS transforms and scrolling. */
function offsetLeftWithin(element: HTMLElement, ancestor: HTMLElement) {
    let left = 0
    let node: HTMLElement | null = element
    while (node && node !== ancestor) {
        left += node.offsetLeft
        node = node.offsetParent as HTMLElement | null
    }
    return left
}

function TabsList({
    variant = 'primary',
    className,
    children,
    ref,
    ...props
}: React.ComponentProps<typeof TabsPrimitive.List> & VariantProps<typeof tabListVariants>) {
    const localRef = React.useRef<HTMLDivElement>(null)

    const [indicatorStyle, setIndicatorStyle] = React.useState({ left: 0, width: 0, opacity: 0 })
    // The indicator is placed before the first paint, so it only animates once it has a position.
    const [animated, setAnimated] = React.useState(false)

    const updateIndicator = React.useCallback(() => {
        const list = localRef.current
        if (!list) return

        const activeTab = list.querySelector<HTMLElement>('[data-slot="tabs-trigger"][data-state="active"]')
        if (!activeTab) {
            setIndicatorStyle(prev => (prev.opacity === 0 ? prev : { ...prev, opacity: 0 }))
            return
        }

        const target = (variant === 'primary' && activeTab.querySelector<HTMLElement>('[data-slot="tabs-tab"]')) || activeTab
        const next = { left: offsetLeftWithin(target, list), width: target.offsetWidth, opacity: 1 }

        setIndicatorStyle(prev =>
            prev.left === next.left && prev.width === next.width && prev.opacity === next.opacity ? prev : next,
        )
    }, [variant])

    React.useLayoutEffect(() => {
        updateIndicator()
    }, [updateIndicator])

    React.useEffect(() => {
        const frame = requestAnimationFrame(() => setAnimated(true))
        return () => cancelAnimationFrame(frame)
    }, [])

    React.useEffect(() => {
        const list = localRef.current
        if (!list) return

        // Tabs can change width without the list resizing (labels, badges, fonts loading), so watch each trigger.
        const resizeObserver = new ResizeObserver(updateIndicator)
        const observeTriggers = () => {
            resizeObserver.disconnect()
            resizeObserver.observe(list)
            list.querySelectorAll('[data-slot="tabs-trigger"]').forEach(trigger => resizeObserver.observe(trigger))
        }
        observeTriggers()

        const mutationObserver = new MutationObserver(mutations => {
            if (mutations.some(mutation => mutation.type === 'childList')) observeTriggers()
            updateIndicator()
        })
        mutationObserver.observe(list, {
            attributes: true,
            childList: true,
            subtree: true,
            attributeFilter: ['data-state', 'class'],
        })

        return () => {
            mutationObserver.disconnect()
            resizeObserver.disconnect()
        }
    }, [updateIndicator])

    return (
        <TabsPrimitive.List
            ref={node => {
                localRef.current = node
                if (typeof ref === 'function') {
                    ref(node)
                } else if (ref) {
                    ;(ref as React.RefObject<HTMLDivElement | null>).current = node
                }
            }}
            data-slot='tabs-list'
            className={cn(tabListVariants({ variant, className }))}
            {...props}
        >
            {children}
            <span
                data-slot='tabs-indicator'
                className={cn(
                    'absolute bottom-0 left-0 z-10 h-0.75 min-w-6 rounded-t-full bg-primary',
                    animated && 'transition-[transform,width] duration-300 ease-out',
                    variant === 'secondary' && 'h-0.5 rounded-none',
                )}
                style={{
                    transform: `translateX(${indicatorStyle.left}px)`,
                    width: `${indicatorStyle.width}px`,
                    opacity: indicatorStyle.opacity,
                }}
            />
        </TabsPrimitive.List>
    )
}

function TabsTrigger({
    className,
    icon,
    children,
    asChild,
    ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger> & { icon?: React.ReactNode; asChild?: boolean }) {
    return (
        <TabsPrimitive.Trigger
            data-slot='tabs-trigger'
            data-tab-narrow-trigger={!icon || !children}
            className={cn(
                'flex h-full w-full cursor-pointer px-4 text-sm leading-5 font-medium whitespace-nowrap text-on-surface-variant transition-colors not-data-[state=active]:hover:bg-on-surface/8 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:text-primary [&_i]:pointer-events-none [&_i]:shrink-0 [&_i:not([class*=size-])]:size-6',
                className,
            )}
            {...props}
            asChild={asChild}
        >
            {asChild && React.isValidElement(children) ? (
                React.cloneElement(children as React.ReactElement<React.PropsWithChildren>, {
                    children: (
                        <>
                            <Ripple />
                            <div data-slot='tabs-tab' className={cn('mx-auto flex h-full w-fit items-center justify-center')}>
                                {icon}
                                {(children as React.ReactElement<React.PropsWithChildren>).props.children}
                            </div>
                        </>
                    ),
                })
            ) : (
                <>
                    <Ripple />
                    <div data-slot='tabs-tab' className={cn('mx-auto flex h-full w-fit items-center justify-center')}>
                        {icon}
                        {children}
                    </div>
                </>
            )}
        </TabsPrimitive.Trigger>
    )
}

function TabsContent({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Content>) {
    return <TabsPrimitive.Content data-slot='tabs-content' className={cn('flex-1 outline-none', className)} {...props} />
}

export { Tabs, TabsList, TabsTrigger, TabsContent }
