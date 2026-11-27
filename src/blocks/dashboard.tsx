'use client'

import * as React from 'react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ButtonGroup } from '@/components/ui/button-group'
import { Card, CardContent } from '@/components/ui/card'
import { Chip } from '@/components/ui/chip'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
    List,
    ListItem,
    ListItemContent,
    ListItemLabel,
    ListItemLeading,
    ListItemSupportingText,
    ListItemTrailing,
    ListItemTrailingText,
} from '@/components/ui/list'
import {
    NavigationRail,
    NavigationRailContent,
    NavigationRailItem,
    NavigationRailMenu,
    NavigationRailTrigger,
} from '@/components/ui/navigation-rail'
import { NavigationBar, NavigationBarItem } from '@/components/ui/navigation-bar'
import { Progress } from '@/components/ui/progress'
import { Search, SearchInput, SearchList, SearchListItem, SearchTrigger } from '@/components/ui/search'
import { toast } from '@/components/ui/snakebar'
import { Toggle } from '@/components/ui/toggle'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

type Range = '7d' | '30d' | '90d'
type Status = 'Paid' | 'Pending' | 'Refunded'
type Filter = 'All' | Status

const ranges: { value: Range; label: string }[] = [
    { value: '7d', label: '7 days' },
    { value: '30d', label: '30 days' },
    { value: '90d', label: '90 days' },
]

const filters: Filter[] = ['All', 'Paid', 'Pending', 'Refunded']

const destinations = [
    { label: 'Overview', icon: 'icon-[material-symbols--space-dashboard-outline-rounded]' },
    { label: 'Orders', icon: 'icon-[material-symbols--receipt-long-outline-rounded]' },
    { label: 'Products', icon: 'icon-[material-symbols--inventory-2-outline-rounded]' },
    { label: 'Customers', icon: 'icon-[material-symbols--group-outline-rounded]' },
]

const stats: Record<Range, { label: string; value: string; delta: number; icon: string }[]> = {
    '7d': [
        { label: 'Revenue', value: '$48,210', delta: 12.4, icon: 'icon-[material-symbols--payments-outline-rounded]' },
        { label: 'Orders', value: '1,284', delta: 8.1, icon: 'icon-[material-symbols--local-mall-outline-rounded]' },
        { label: 'Visitors', value: '32.6k', delta: -2.3, icon: 'icon-[material-symbols--group-outline-rounded]' },
        { label: 'Conversion', value: '3.94%', delta: 0.6, icon: 'icon-[material-symbols--trending-up-rounded]' },
    ],
    '30d': [
        { label: 'Revenue', value: '$201,930', delta: 9.8, icon: 'icon-[material-symbols--payments-outline-rounded]' },
        { label: 'Orders', value: '5,412', delta: 6.2, icon: 'icon-[material-symbols--local-mall-outline-rounded]' },
        { label: 'Visitors', value: '141k', delta: 4.5, icon: 'icon-[material-symbols--group-outline-rounded]' },
        { label: 'Conversion', value: '3.84%', delta: -0.3, icon: 'icon-[material-symbols--trending-up-rounded]' },
    ],
    '90d': [
        { label: 'Revenue', value: '$588,400', delta: 15.1, icon: 'icon-[material-symbols--payments-outline-rounded]' },
        { label: 'Orders', value: '16,027', delta: 11.7, icon: 'icon-[material-symbols--local-mall-outline-rounded]' },
        { label: 'Visitors', value: '402k', delta: 7.9, icon: 'icon-[material-symbols--group-outline-rounded]' },
        { label: 'Conversion', value: '3.98%', delta: 0.4, icon: 'icon-[material-symbols--trending-up-rounded]' },
    ],
}

const topProducts: Record<Range, { name: string; sold: number; share: number }[]> = {
    '7d': [
        { name: 'Wireless Headphones', sold: 312, share: 82 },
        { name: 'Smart Watch Series 4', sold: 241, share: 64 },
        { name: 'Mechanical Keyboard', sold: 188, share: 49 },
        { name: 'USB-C Hub (7-in-1)', sold: 126, share: 33 },
    ],
    '30d': [
        { name: 'Smart Watch Series 4', sold: 1204, share: 88 },
        { name: 'Wireless Headphones', sold: 1132, share: 79 },
        { name: 'Desk Lamp Pro', sold: 702, share: 51 },
        { name: 'Mechanical Keyboard', sold: 655, share: 46 },
    ],
    '90d': [
        { name: 'Wireless Headphones', sold: 3820, share: 91 },
        { name: 'Smart Watch Series 4', sold: 3406, share: 80 },
        { name: 'Mechanical Keyboard', sold: 2210, share: 55 },
        { name: 'Desk Lamp Pro', sold: 1985, share: 47 },
    ],
}

const orders: { id: string; customer: string; item: string; amount: string; status: Status }[] = [
    { id: '#3210', customer: 'Zita Di Marco', item: 'Wireless Headphones', amount: '$129.00', status: 'Paid' },
    { id: '#3209', customer: 'In Yeong-hui', item: 'Smart Watch Series 4', amount: '$349.00', status: 'Pending' },
    { id: '#3208', customer: 'Renee Claes', item: 'Mechanical Keyboard', amount: '$89.90', status: 'Paid' },
    { id: '#3207', customer: 'Odette Ambricourt', item: 'USB-C Hub (7-in-1)', amount: '$45.50', status: 'Refunded' },
    { id: '#3206', customer: 'Dagmar Bachmann', item: 'Desk Lamp Pro', amount: '$62.00', status: 'Paid' },
    { id: '#3205', customer: 'Marcus Lindqvist', item: 'Wireless Headphones', amount: '$129.00', status: 'Pending' },
]

const statusStyles: Record<Status, string> = {
    Paid: 'bg-primary-container text-on-primary-container',
    Pending: 'bg-tertiary-container text-on-tertiary-container',
    Refunded: 'bg-error-container text-on-error-container',
}

function IconAction({ label, children, ...props }: React.ComponentProps<typeof Button> & { label: string }) {
    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <Button variant='text' icon aria-label={label} {...props}>
                    {children}
                </Button>
            </TooltipTrigger>
            <TooltipContent>{label}</TooltipContent>
        </Tooltip>
    )
}

function DashboardSearch() {
    const [query, setQuery] = React.useState('')
    const q = query.trim().toLowerCase()
    const results = q
        ? orders.filter(o => [o.id, o.customer, o.item].some(v => v.toLowerCase().includes(q)))
        : orders.slice(0, 3)

    return (
        <Search variant='docked' className='max-w-xl'>
            <SearchTrigger className='h-12'>
                <span data-slot='search-icon'>
                    <i className='icon-[material-symbols--search-rounded]' />
                </span>
                <SearchInput className='pl-0' placeholder='Search orders' value={query} onValueChange={setQuery} />
            </SearchTrigger>
            <SearchList className='shadow-elevation-2'>
                {!q && <p className='px-4 pt-3 pb-1 text-sm text-on-surface-variant'>Recent orders</p>}
                {results.length === 0 && <p className='px-4 py-6 text-sm text-on-surface-variant'>No results for “{query}”</p>}
                {results.map(o => (
                    <SearchListItem key={o.id}>
                        <ListItemLeading>
                            <i className='icon-[material-symbols--receipt-long-outline-rounded]' />
                        </ListItemLeading>
                        <ListItemContent>
                            <ListItemLabel>{o.customer}</ListItemLabel>
                            <ListItemSupportingText>
                                {o.id} · {o.item}
                            </ListItemSupportingText>
                        </ListItemContent>
                        <ListItemTrailing>
                            <ListItemTrailingText>{o.amount}</ListItemTrailingText>
                        </ListItemTrailing>
                    </SearchListItem>
                ))}
            </SearchList>
        </Search>
    )
}

function OrderActions({ id }: { id: string }) {
    return (
        <DropdownMenu>
            <Tooltip>
                <TooltipTrigger asChild>
                    <DropdownMenuTrigger asChild>
                        <Button variant='text' icon size='sm' className='text-on-surface-variant' aria-label='Order actions'>
                            <i className='icon-[material-symbols--more-vert]' />
                        </Button>
                    </DropdownMenuTrigger>
                </TooltipTrigger>
                <TooltipContent>Order actions</TooltipContent>
            </Tooltip>
            <DropdownMenuContent compact align='end'>
                <DropdownMenuGroup>
                    <DropdownMenuItem>
                        <i className='icon-[material-symbols--visibility-outline-rounded]' />
                        View details
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <i className='icon-[material-symbols--print-outline-rounded]' />
                        Print invoice
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuGroup>
                    <DropdownMenuItem
                        onClick={() => toast({ message: `Refund issued for ${id}`, action: { label: 'Undo', onClick() {} } })}
                    >
                        <i className='icon-[material-symbols--undo-rounded]' />
                        Issue refund
                    </DropdownMenuItem>
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default function DashboardBlock() {
    const [range, setRange] = React.useState<Range>('7d')
    const [filter, setFilter] = React.useState<Filter>('All')
    const [nav, setNav] = React.useState('Overview')

    const visibleOrders = orders.filter(o => filter === 'All' || o.status === filter)

    return (
        <div className='@container/app relative flex h-full w-full overflow-hidden bg-surface-container'>
            {/* Medium and up: navigation rail */}
            <div className='hidden @3xl/app:flex'>
                <NavigationRail variant='modal' contained>
                    <NavigationRailContent className='pt-2'>
                        <NavigationRailMenu className='mb-2'>
                            <NavigationRailTrigger />
                        </NavigationRailMenu>
                        {destinations.map(d => (
                            <NavigationRailItem
                                key={d.label}
                                active={nav === d.label}
                                icon={<i className={d.icon} />}
                                onClick={() => setNav(d.label)}
                            >
                                {d.label}
                            </NavigationRailItem>
                        ))}
                    </NavigationRailContent>
                </NavigationRail>
            </div>

            <div className='flex min-w-0 flex-1 flex-col overflow-hidden'>
                {/* Top app bar */}
                <header className='relative z-20 flex h-16 shrink-0 items-center gap-2 px-4 @3xl/app:pl-2'>
                    <DashboardSearch />
                    <div className='ml-auto flex items-center gap-1'>
                        <IconAction label='Notifications' className='relative text-on-surface-variant'>
                            <i className='icon-[material-symbols--notifications-outline-rounded] size-6' />
                            <Badge className='absolute top-2 right-2'>3</Badge>
                        </IconAction>
                        <IconAction label='Settings' className='hidden text-on-surface-variant @3xl/app:inline-flex'>
                            <i className='icon-[material-symbols--settings-outline-rounded] size-6' />
                        </IconAction>
                        <Avatar className='ml-2 size-9'>
                            <AvatarImage src='https://github.com/bolsheviknanven.png' alt='avatar' />
                            <AvatarFallback>A</AvatarFallback>
                        </Avatar>
                    </div>
                </header>

                <main className='@container flex-1 overflow-y-auto bg-surface px-4 pt-6 pb-10 @3xl/app:rounded-tl-3xl @3xl/app:px-8'>
                    {/* Headline */}
                    <div className='flex flex-wrap items-end gap-4'>
                        <div className='mr-auto'>
                            <p className='text-sm text-on-surface-variant'>Good morning, Alex</p>
                            <h1 className='text-[28px] leading-9 @lg:text-[32px] @lg:leading-10'>Store overview</h1>
                        </div>
                        <ButtonGroup variant='connected'>
                            {ranges.map(r => (
                                <Toggle
                                    key={r.value}
                                    size='sm'
                                    variant='tonal'
                                    pressed={range === r.value}
                                    onPressedChange={() => setRange(r.value)}
                                >
                                    {range === r.value && <i className='icon-[material-symbols--check-rounded]' />}
                                    {r.label}
                                </Toggle>
                            ))}
                        </ButtonGroup>
                        <Button
                            size='sm'
                            aria-label='Export'
                            className='px-2.5 @lg:px-4'
                            onClick={() => toast({ message: 'Report exported to Downloads', closable: true })}
                        >
                            <i className='icon-[material-symbols--download-rounded]' />
                            <span className='hidden @lg:inline'>Export</span>
                        </Button>
                    </div>

                    {/* KPIs: one tonal surface split by dividers instead of four cards */}
                    <section className='mt-6 grid grid-cols-2 gap-y-5 rounded-3xl bg-surface-container-low py-5 @4xl:grid-cols-4'>
                        {stats[range].map(s => {
                            const positive = s.delta >= 0
                            return (
                                <div
                                    key={s.label}
                                    className='flex flex-col gap-2 border-outline-variant px-4 @lg:px-6 @4xl:not-first:border-l'
                                >
                                    <p className='flex items-center gap-2 text-sm text-on-surface-variant'>
                                        <i className={cn(s.icon, 'size-5')} />
                                        {s.label}
                                    </p>
                                    <p className='text-[28px] leading-9'>{s.value}</p>
                                    <p className='flex items-center gap-1 text-xs text-on-surface-variant'>
                                        <span
                                            className={cn(
                                                'inline-flex items-center font-medium',
                                                positive ? 'text-primary' : 'text-error',
                                            )}
                                        >
                                            <i
                                                className={cn(
                                                    'size-4',
                                                    positive
                                                        ? 'icon-[material-symbols--arrow-upward-rounded]'
                                                        : 'icon-[material-symbols--arrow-downward-rounded]',
                                                )}
                                            />
                                            {Math.abs(s.delta)}%
                                        </span>
                                        vs last period
                                    </p>
                                </div>
                            )
                        })}
                    </section>

                    <div className='mt-8 grid grid-cols-1 gap-8 @5xl:grid-cols-[minmax(0,1fr)_320px]'>
                        {/* Recent orders */}
                        <section>
                            <div className='flex flex-wrap items-center gap-3'>
                                <div className='mr-auto'>
                                    <h2 className='text-[22px] leading-7'>Recent orders</h2>
                                    <p className='text-sm text-on-surface-variant'>
                                        {visibleOrders.length} {visibleOrders.length === 1 ? 'order' : 'orders'}
                                    </p>
                                </div>
                                <ButtonGroup variant='connected'>
                                    {filters.map(f => (
                                        <Toggle
                                            key={f}
                                            size='sm'
                                            variant='tonal'
                                            pressed={filter === f}
                                            onPressedChange={() => setFilter(f)}
                                        >
                                            {f}
                                        </Toggle>
                                    ))}
                                </ButtonGroup>
                            </div>

                            <div className='mt-3'>
                                <List variant='segmented'>
                                    {visibleOrders.map(o => (
                                        <ListItem key={o.id} className='gap-4 pr-2'>
                                            <ListItemLeading>
                                                <Avatar>
                                                    <AvatarFallback>{o.customer.at(0)}</AvatarFallback>
                                                </Avatar>
                                            </ListItemLeading>
                                            <ListItemContent>
                                                <ListItemLabel>{o.customer}</ListItemLabel>
                                                <ListItemSupportingText>
                                                    <span className='@lg:hidden'>{o.status} · </span>
                                                    {o.id} · {o.item}
                                                </ListItemSupportingText>
                                            </ListItemContent>
                                            <ListItemTrailing>
                                                <span
                                                    className={cn(
                                                        'hidden rounded-lg px-2.5 py-1 text-xs font-medium @lg:inline',
                                                        statusStyles[o.status],
                                                    )}
                                                >
                                                    {o.status}
                                                </span>
                                                <span className='text-right text-sm font-medium text-on-surface @lg:w-20'>
                                                    {o.amount}
                                                </span>
                                                <OrderActions id={o.id} />
                                            </ListItemTrailing>
                                        </ListItem>
                                    ))}
                                </List>
                            </div>

                            <div className='mt-4 flex flex-wrap gap-2'>
                                <Chip leadingIcon={<i className='icon-[material-symbols--auto-awesome-outline-rounded]' />}>
                                    Summarize this week
                                </Chip>
                                <Chip leadingIcon={<i className='icon-[material-symbols--mail-outline-rounded]' />}>
                                    Email pending customers
                                </Chip>
                            </div>
                        </section>

                        <aside className='flex flex-col gap-8'>
                            {/* The one emphasized card on the page */}
                            <Card variant='filled' className='bg-primary-container text-on-primary-container'>
                                <CardContent className='flex items-center gap-5 p-6'>
                                    <div className='relative flex shrink-0 items-center justify-center'>
                                        <Progress variant='circle' wave value={78} stroke={7} className='size-24' />
                                        <span className='absolute text-xl font-medium'>78%</span>
                                    </div>
                                    <div>
                                        <h2 className='text-base font-medium'>Monthly goal</h2>
                                        <p className='mt-1 text-sm opacity-80'>$195k of $250k. 6 days left to reach target.</p>
                                    </div>
                                </CardContent>
                            </Card>

                            <section>
                                <div className='flex items-center'>
                                    <h2 className='mr-auto text-[22px] leading-7'>Top products</h2>
                                    <Button variant='text' size='sm'>
                                        View all
                                    </Button>
                                </div>
                                <List className='-mx-4 mt-1'>
                                    {topProducts[range].map((p, i) => (
                                        <ListItem key={p.name} className='items-start'>
                                            <ListItemLeading className='mt-0.5 size-6 rounded-full bg-secondary-container text-xs font-medium text-on-secondary-container'>
                                                {i + 1}
                                            </ListItemLeading>
                                            <ListItemContent className='gap-2'>
                                                <ListItemLabel>{p.name}</ListItemLabel>
                                                <Progress value={p.share} />
                                            </ListItemContent>
                                            <ListItemTrailing className='mt-0.5'>
                                                <ListItemTrailingText>{p.sold.toLocaleString()} sold</ListItemTrailingText>
                                            </ListItemTrailing>
                                        </ListItem>
                                    ))}
                                </List>
                            </section>
                        </aside>
                    </div>
                </main>

                {/* Compact widths: navigation bar replaces the rail */}
                <NavigationBar className='shrink-0 @3xl/app:hidden'>
                    {destinations.map(d => (
                        <NavigationBarItem key={d.label} asChild active={nav === d.label} icon={<i className={d.icon} />}>
                            <button type='button' onClick={() => setNav(d.label)}>
                                {d.label}
                            </button>
                        </NavigationBarItem>
                    ))}
                </NavigationBar>
            </div>
        </div>
    )
}
