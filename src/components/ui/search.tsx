'use client'

import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'
import { Ripple } from './ripple'

type SearchVariant = 'docked' | 'fullscreen'

type SearchContextValue = {
    clearInput: () => void
    disabled?: boolean
    inputRef: React.RefObject<HTMLInputElement | null>
    listId: string
    open: boolean
    setOpen: (open: boolean) => void
    variant: SearchVariant
}

const SearchContext = React.createContext<SearchContextValue | null>(null)

function useSearchContext(component: string) {
    const context = React.useContext(SearchContext)

    if (!context) {
        throw new Error(`${component} must be used within Search`)
    }

    return context
}

function useControllableState({
    value,
    defaultValue,
    onChange,
}: {
    value?: boolean
    defaultValue?: boolean
    onChange?: (value: boolean) => void
}) {
    const [uncontrolledValue, setUncontrolledValue] = React.useState(defaultValue ?? false)
    const isControlled = value !== undefined
    const currentValue = isControlled ? value : uncontrolledValue

    const setValue = React.useCallback(
        (nextValue: boolean) => {
            if (!isControlled) {
                setUncontrolledValue(nextValue)
            }

            onChange?.(nextValue)
        },
        [isControlled, onChange],
    )

    return [currentValue, setValue] as const
}

function setRef<T>(ref: React.Ref<T> | undefined, value: T | null) {
    if (typeof ref === 'function') {
        ref(value)
    } else if (ref) {
        ;(ref as React.RefObject<T | null>).current = value
    }
}

type SearchProps = React.ComponentProps<'div'> & {
    defaultOpen?: boolean
    disabled?: boolean
    onOpenChange?: (open: boolean) => void
    open?: boolean
    variant?: SearchVariant
}

function Search({
    className,
    defaultOpen,
    disabled,
    onBlurCapture,
    onOpenChange,
    open: openProp,
    variant = 'docked',
    ...props
}: SearchProps) {
    const generatedId = React.useId()
    const rootRef = React.useRef<HTMLDivElement>(null)
    const inputRef = React.useRef<HTMLInputElement>(null)
    const [open, setOpen] = useControllableState({
        value: openProp,
        defaultValue: defaultOpen,
        onChange: onOpenChange,
    })

    const clearInput = React.useCallback(() => {
        const input = inputRef.current
        if (!input) return

        const valueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')?.set
        valueSetter?.call(input, '')
        input.dispatchEvent(new Event('input', { bubbles: true }))
        input.focus()
    }, [])

    const handleBlurCapture = (event: React.FocusEvent<HTMLDivElement>) => {
        onBlurCapture?.(event)

        if (event.defaultPrevented || variant !== 'docked') return

        window.setTimeout(() => {
            if (!rootRef.current?.contains(document.activeElement)) {
                setOpen(false)
            }
        }, 0)
    }

    React.useEffect(() => {
        if (!open) return

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setOpen(false)
            }
        }

        window.addEventListener('keydown', handleKeyDown)

        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [open, setOpen])

    return (
        <SearchContext.Provider
            value={{
                clearInput,
                disabled,
                inputRef,
                listId: `${generatedId}-search-list`,
                open,
                setOpen,
                variant,
            }}
        >
            <div
                ref={rootRef}
                data-disabled={disabled || undefined}
                data-slot='search'
                data-state={open ? 'open' : 'closed'}
                data-variant={variant}
                className={cn('relative w-full', disabled && 'pointer-events-none opacity-50', className)}
                onBlurCapture={handleBlurCapture}
                {...props}
            />
        </SearchContext.Provider>
    )
}

type SearchInputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'children' | 'className' | 'type'> & {
    className?: string
    onValueChange?: (value: string) => void
}

const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
    (
        { className, disabled: disabledProp, onChange, onFocus, onValueChange, placeholder = 'Hinted search text', ...props },
        ref,
    ) => {
        const { disabled, inputRef, listId, open, setOpen } = useSearchContext('SearchInput')
        const isDisabled = disabled || disabledProp
        const inputAriaLabel = (props['aria-label'] ?? props['aria-labelledby']) ? undefined : 'Search'

        const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
            onChange?.(event)
            onValueChange?.(event.target.value)
        }

        const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
            onFocus?.(event)

            if (!isDisabled && !event.defaultPrevented) {
                setOpen(true)
            }
        }

        return (
            <input
                ref={node => {
                    inputRef.current = node
                    setRef(ref, node)
                }}
                aria-autocomplete='list'
                aria-controls={listId}
                aria-expanded={open}
                aria-label={inputAriaLabel}
                data-slot='search-input'
                disabled={isDisabled}
                placeholder={placeholder}
                role='combobox'
                type='search'
                className={cn(
                    !open && 'px-4',
                    'h-full min-w-0 flex-1 bg-transparent text-base leading-6 tracking-[0.5px] text-on-surface outline-none placeholder:text-on-surface-variant disabled:cursor-not-allowed',
                    '[&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-decoration]:appearance-none',
                    className,
                )}
                onChange={handleChange}
                onFocus={handleFocus}
                {...props}
            />
        )
    },
)
SearchInput.displayName = 'SearchInput'

function getSearchInputChild(children: React.ReactNode) {
    return React.Children.toArray(children).find(
        (child): child is React.ReactElement<SearchInputProps> => React.isValidElement(child) && child.type === SearchInput,
    )
}

function shouldOpenFromEventTarget(target: EventTarget | null) {
    if (!(target instanceof HTMLElement)) return true

    if (target.closest('[data-slot="search-input"]')) {
        return true
    }

    return target.closest('[data-search-open]')
}

type SearchTriggerProps = Omit<React.ComponentProps<'form'>, 'onSubmit'> & {
    onSearch?: (query: string) => void
    onSubmit?: React.FormEventHandler<HTMLFormElement>
}

const triggerContentClassName = [
    'relative z-10 flex h-full w-full items-center gap-1 px-1',
    '[&>[data-slot=search-leading]]:flex [&>[data-slot=search-leading]]:size-12 [&>[data-slot=search-leading]]:shrink-0 [&>[data-slot=search-leading]]:items-center [&>[data-slot=search-leading]]:justify-center [&>[data-slot=search-leading]]:rounded-full [&>[data-slot=search-leading]]:text-on-surface-variant [&>[data-slot=search-leading]]:[&_i:not([class*=size-])]:size-6',
    '[&>[data-slot=search-trailing]]:flex [&>[data-slot=search-trailing]]:size-12 [&>[data-slot=search-trailing]]:shrink-0 [&>[data-slot=search-trailing]]:items-center [&>[data-slot=search-trailing]]:justify-center [&>[data-slot=search-trailing]]:rounded-full [&>[data-slot=search-trailing]]:text-on-surface-variant [&>[data-slot=search-trailing]]:[&_i:not([class*=size-])]:size-6',
    '[&>button[data-slot=search-leading]]:cursor-pointer [&>button[data-slot=search-leading]]:hover:bg-on-surface-variant/8 [&>button[data-slot=search-leading]]:active:bg-on-surface-variant/10',
    '[&>button[data-slot=search-trailing]]:cursor-pointer [&>button[data-slot=search-trailing]]:hover:bg-on-surface-variant/8 [&>button[data-slot=search-trailing]]:active:bg-on-surface-variant/10',
    '[&>[data-slot=avatar]]:mx-2 [&>[data-slot=avatar]]:size-[30px] [&>[data-slot=avatar]]:bg-primary [&>[data-slot=avatar-fallback]]:text-on-primary',
]

function SearchTrigger({ className, children, onClick, onFocusCapture, onSearch, onSubmit, ...props }: SearchTriggerProps) {
    const { clearInput, disabled, open, setOpen, variant } = useSearchContext('SearchTrigger')
    const isFullscreenOpen = variant === 'fullscreen' && open
    const inputChild = getSearchInputChild(children)

    const handleClick = (event: React.MouseEvent<HTMLFormElement>) => {
        onClick?.(event)

        if (!disabled && !open && !event.defaultPrevented && shouldOpenFromEventTarget(event.target)) {
            setOpen(true)
        }
    }

    const handleFocusCapture = (event: React.FocusEvent<HTMLFormElement>) => {
        onFocusCapture?.(event)

        if (!disabled && !open && !event.defaultPrevented && shouldOpenFromEventTarget(event.target)) {
            setOpen(true)
        }
    }

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        onSubmit?.(event)
        const userPreventedDefault = event.defaultPrevented

        event.preventDefault()

        if (disabled || userPreventedDefault) return

        const input = event.currentTarget.querySelector('[data-slot="search-input"]') as HTMLInputElement | null
        onSearch?.(input?.value ?? '')
    }

    const handleClose = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault()
        event.stopPropagation()
        setOpen(false)
    }

    const handleClear = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault()
        event.stopPropagation()
        clearInput()
    }

    const openInput = inputChild ? (
        React.cloneElement(inputChild, { autoFocus: inputChild.props.autoFocus ?? true })
    ) : (
        <SearchInput autoFocus />
    )

    return (
        <form
            role='search'
            data-slot='search-trigger'
            data-state={open ? 'open' : 'closed'}
            data-variant={variant}
            className={cn(
                'group/trigger relative flex h-14 w-full items-center overflow-hidden rounded-[28px] bg-surface-container-high text-on-surface-variant transition-all',
                isFullscreenOpen && 'fixed top-0 right-3 left-3 z-[60] w-auto',
                className,
            )}
            onClick={handleClick}
            onFocusCapture={handleFocusCapture}
            onSubmit={handleSubmit}
            {...props}
        >
            <span
                aria-hidden='true'
                className={cn(
                    'pointer-events-none absolute inset-0 z-0 rounded-[inherit] transition-all',
                    !open && 'group-hover/trigger:bg-on-surface/8 group-active/trigger:bg-on-surface/10',
                )}
            />
            <div data-slot='search-trigger-content' className={cn(triggerContentClassName)}>
                {open ? (
                    <>
                        <button data-slot='search-leading' type='button' aria-label='Close search' onClick={handleClose}>
                            <i className='icon-[material-symbols--arrow-back-rounded]' />
                        </button>
                        {openInput}
                        <button data-slot='search-trailing' type='button' aria-label='Clear search' onClick={handleClear}>
                            <i className='icon-[material-symbols--close-rounded]' />
                        </button>
                    </>
                ) : (
                    children
                )}
            </div>
        </form>
    )
}

type SearchListProps = React.ComponentProps<'div'> & {
    contentClassName?: string
    forceMount?: boolean
}

const searchListVariants = cva('z-50 flex flex-col', {
    variants: {
        variant: {
            docked: 'absolute top-[calc(100%+2px)] left-0 min-h-[72px] w-full overflow-hidden rounded-xl bg-surface-container-high',
            fullscreen: 'fixed inset-0 z-50 overflow-y-auto bg-surface-container pt-[58px] pb-6',
        },
    },
    defaultVariants: {
        variant: 'docked',
    },
})

function SearchList({ className, contentClassName, children, forceMount, ...props }: SearchListProps) {
    const { listId, open, variant } = useSearchContext('SearchList')

    if (!forceMount && !open) {
        return null
    }

    return (
        <div
            id={listId}
            aria-hidden={!open}
            data-slot='search-list'
            data-state={open ? 'open' : 'closed'}
            data-variant={variant}
            role='listbox'
            className={cn(searchListVariants({ variant }), !open && 'hidden', className)}
            {...props}
        >
            <div
                data-slot='search-list-content'
                className={cn(
                    'flex w-full flex-col gap-0',
                    variant === 'docked' && 'overflow-hidden rounded-xl',
                    contentClassName,
                )}
            >
                {children}
            </div>
        </div>
    )
}

const searchListItemVariants = cva(
    [
        'group/search-item relative flex min-h-12 w-full items-center gap-3 overflow-hidden rounded-xl px-4 py-2.5 text-left text-on-surface transition-colors outline-none select-none',
        'hover:bg-on-surface/8 focus:bg-on-surface/8 active:bg-on-surface/10 disabled:pointer-events-none disabled:opacity-50',
        '[&_[data-slot=search-list-item-leading]]:flex [&_[data-slot=search-list-item-leading]]:size-10 [&_[data-slot=search-list-item-leading]]:shrink-0 [&_[data-slot=search-list-item-leading]]:items-center [&_[data-slot=search-list-item-leading]]:justify-center [&_[data-slot=search-list-item-leading]]:rounded-full [&_[data-slot=search-list-item-leading]]:text-on-surface-variant [&_[data-slot=search-list-item-leading]]:[&_i:not([class*=size-])]:size-6',
        '[&_[data-slot=search-list-item-content]]:flex [&_[data-slot=search-list-item-content]]:min-w-0 [&_[data-slot=search-list-item-content]]:flex-1 [&_[data-slot=search-list-item-content]]:flex-col',
        '[&_[data-slot=search-list-item-title]]:truncate [&_[data-slot=search-list-item-title]]:text-base [&_[data-slot=search-list-item-title]]:leading-6 [&_[data-slot=search-list-item-title]]:font-normal [&_[data-slot=search-list-item-title]]:tracking-[0.5px]',
        '[&_[data-slot=search-list-item-supporting]]:truncate [&_[data-slot=search-list-item-supporting]]:text-sm [&_[data-slot=search-list-item-supporting]]:leading-5 [&_[data-slot=search-list-item-supporting]]:tracking-[0.25px] [&_[data-slot=search-list-item-supporting]]:text-on-surface-variant',
        '[&_[data-slot=search-list-item-trailing]]:ml-auto [&_[data-slot=search-list-item-trailing]]:shrink-0 [&_[data-slot=search-list-item-trailing]]:text-sm [&_[data-slot=search-list-item-trailing]]:text-on-surface-variant',
    ],
    {
        variants: {
            selected: {
                true: 'bg-secondary-container text-on-secondary-container hover:bg-secondary-container active:bg-secondary-container [&_[data-slot=search-list-item-leading]]:text-on-secondary-container [&_[data-slot=search-list-item-supporting]]:text-on-secondary-container/80 [&_[data-slot=search-list-item-trailing]]:text-on-secondary-container/80',
            },
        },
        defaultVariants: {
            selected: false,
        },
    },
)

type SearchListItemProps = React.ComponentProps<'button'> &
    VariantProps<typeof searchListItemVariants> & {
        asChild?: boolean
        closeOnSelect?: boolean
    }

function SearchListItem({
    asChild,
    children,
    className,
    closeOnSelect = true,
    onClick,
    selected,
    type = 'button',
    ...props
}: SearchListItemProps) {
    const { setOpen } = useSearchContext('SearchListItem')
    const Comp = asChild ? Slot : 'button'

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        onClick?.(event)

        if (!event.defaultPrevented && closeOnSelect) {
            setOpen(false)
        }
    }

    const adornments = <Ripple className='rounded-xl' />

    return (
        <Comp
            aria-selected={selected || undefined}
            data-selected={selected || undefined}
            data-slot='search-list-item'
            role='option'
            className={cn(searchListItemVariants({ selected, className }))}
            onClick={handleClick}
            {...(!asChild ? { type } : {})}
            {...props}
        >
            {asChild && React.isValidElement(children) ? (
                React.cloneElement(children as React.ReactElement<React.PropsWithChildren>, {
                    children: (
                        <>
                            {(children as React.ReactElement<React.PropsWithChildren>).props.children}
                            {adornments}
                        </>
                    ),
                })
            ) : (
                <>
                    {children}
                    {adornments}
                </>
            )}
        </Comp>
    )
}

export { Search, SearchTrigger, SearchInput, SearchList, SearchListItem }
