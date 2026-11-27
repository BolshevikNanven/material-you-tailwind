'use client'

import * as React from 'react'
import { cva } from 'class-variance-authority'

import { cn } from '@/lib/utils'
import { ListItem } from './list'

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
    onKeyDown,
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

    // Like Compose: Down moves focus from the input into the results, Up from the first result returns to the input.
    const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
        onKeyDown?.(event)

        if (event.defaultPrevented || !open || (event.key !== 'ArrowDown' && event.key !== 'ArrowUp')) return

        const options = Array.from(
            rootRef.current?.querySelectorAll<HTMLElement>('[role="option"]:not([aria-disabled="true"])') ?? [],
        )
        if (options.length === 0) return

        const index = options.findIndex(option => option === document.activeElement || option.contains(document.activeElement))
        if (index === -1 && event.key === 'ArrowUp') return

        const next = event.key === 'ArrowDown' ? index + 1 : index - 1

        event.preventDefault()

        if (next < 0) inputRef.current?.focus()
        else options[Math.min(next, options.length - 1)]?.focus()
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
                onKeyDown={handleKeyDown}
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
    '[&>:is([data-slot=search-button],[data-slot=search-icon],[data-slot=search-leading],[data-slot=search-trailing])]:flex [&>:is([data-slot=search-button],[data-slot=search-icon],[data-slot=search-leading],[data-slot=search-trailing])]:size-12 [&>:is([data-slot=search-button],[data-slot=search-icon],[data-slot=search-leading],[data-slot=search-trailing])]:shrink-0 [&>:is([data-slot=search-button],[data-slot=search-icon],[data-slot=search-leading],[data-slot=search-trailing])]:items-center [&>:is([data-slot=search-button],[data-slot=search-icon],[data-slot=search-leading],[data-slot=search-trailing])]:justify-center [&>:is([data-slot=search-button],[data-slot=search-icon],[data-slot=search-leading],[data-slot=search-trailing])]:rounded-full [&>:is([data-slot=search-button],[data-slot=search-icon],[data-slot=search-leading],[data-slot=search-trailing])]:text-on-surface-variant [&>:is([data-slot=search-button],[data-slot=search-icon],[data-slot=search-leading],[data-slot=search-trailing])]:[&_i:not([class*=size-])]:size-6',
    '[&>:is([data-slot=search-button],button[data-slot=search-leading],button[data-slot=search-trailing])]:cursor-pointer [&>:is([data-slot=search-button],button[data-slot=search-leading],button[data-slot=search-trailing])]:hover:bg-on-surface-variant/8 [&>:is([data-slot=search-button],button[data-slot=search-leading],button[data-slot=search-trailing])]:active:bg-on-surface-variant/10',
    '[&>[data-slot=avatar]]:mx-2 [&>[data-slot=avatar]]:size-[30px] [&>[data-slot=avatar]]:bg-primary [&>[data-slot=avatar-fallback]]:text-on-primary',
]

function SearchTrigger({ className, children, onClick, onFocusCapture, onSearch, onSubmit, ...props }: SearchTriggerProps) {
    const { clearInput, disabled, inputRef, open, setOpen, variant } = useSearchContext('SearchTrigger')
    const isFullscreenOpen = variant === 'fullscreen' && open
    const isDockedOpen = variant === 'docked' && open
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

        if (inputRef.current?.value) {
            clearInput()
            return
        }

        setOpen(false)
    }

    // The input is a keyed item of the same array in both states, so React keeps one <input> instance
    // (and its uncontrolled value) while the trigger opens and closes.
    const items = open
        ? [
              <button
                  key='search-close'
                  data-slot='search-button'
                  type='button'
                  aria-label='Close search'
                  onClick={handleClose}
              >
                  <i className='icon-[material-symbols--arrow-back-rounded]' />
              </button>,
              inputChild ?? <SearchInput key='search-input' />,
              <button
                  key='search-clear'
                  data-slot='search-button'
                  type='button'
                  aria-label='Clear search'
                  onClick={handleClear}
              >
                  <i className='icon-[material-symbols--close-rounded]' />
              </button>,
          ]
        : React.Children.toArray(children)

    React.useEffect(() => {
        if (open) inputRef.current?.focus()
    }, [open, inputRef])

    return (
        <form
            role='search'
            data-slot='search-trigger'
            data-state={open ? 'open' : 'closed'}
            data-variant={variant}
            className={cn(
                'group/trigger relative flex h-14 w-full items-center overflow-hidden rounded-[28px] bg-surface-container-high text-on-surface-variant transition-all',
                // Contained full screen: the pill is inset 8px horizontally and 4px from the top.
                isFullscreenOpen && 'fixed inset-x-2 top-1 z-[60] w-auto',
                isDockedOpen && 'z-[45]',
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
                {items}
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
            // Docked with gap: at least 240px (never taller than the cap) and at most half of the viewport height, then it scrolls.
            docked: 'absolute top-[calc(100%+2px)] left-0 max-h-[50vh] min-h-[min(240px,50vh)] w-full overflow-hidden rounded-xl bg-surface-container-high',
            // Contained full screen: surface-container-low, 4px + 56px pill + 8px gap above the results.
            fullscreen: 'fixed inset-0 z-50 overflow-y-auto bg-surface-container-low pt-[68px] pb-6',
        },
    },
    defaultVariants: {
        variant: 'docked',
    },
})

function SearchList({ className, contentClassName, children, forceMount, ...props }: SearchListProps) {
    const { listId, open, setOpen, variant } = useSearchContext('SearchList')

    if (!forceMount && !open) {
        return null
    }

    return (
        <>
            {variant === 'docked' && open && (
                <div
                    aria-hidden='true'
                    data-slot='search-scrim'
                    className='fixed inset-0 z-40 bg-scrim/32'
                    onClick={() => setOpen(false)}
                />
            )}
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
                    tabIndex={-1}
                    className={cn(
                        'flex w-full flex-col gap-0 outline-none',
                        variant === 'docked' && 'min-h-0 flex-1 overflow-y-auto rounded-xl',
                        contentClassName,
                    )}
                >
                    {children}
                </div>
            </div>
        </>
    )
}

type SearchListItemProps = Omit<React.ComponentProps<typeof ListItem>, 'dragged' | 'interactive' | 'selectable'> & {
    closeOnSelect?: boolean
}

// Search results are plain list items on a transparent container, inset 4px vertically,
// the same way the Compose search samples build them with ListItem(containerColor = Transparent).
function SearchListItem({ className, closeOnSelect = true, onClick, selected, ...props }: SearchListItemProps) {
    const { setOpen } = useSearchContext('SearchListItem')

    const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
        onClick?.(event)

        if (!event.defaultPrevented && closeOnSelect) {
            setOpen(false)
        }
    }

    return (
        <ListItem
            role='option'
            aria-selected={selected || undefined}
            selected={selected}
            interactive
            className={cn('my-1 bg-transparent data-selected:bg-secondary-container', className)}
            onClick={handleClick}
            {...props}
        />
    )
}

export { Search, SearchTrigger, SearchInput, SearchList, SearchListItem }
