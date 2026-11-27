'use client'

import * as React from 'react'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ButtonGroup } from '@/components/ui/button-group'
import { Card, CardContent } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Chip } from '@/components/ui/chip'
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuGroup,
    ContextMenuItem,
    ContextMenuRadioGroup,
    ContextMenuRadioItem,
    ContextMenuShortcut,
    ContextMenuSub,
    ContextMenuSubContent,
    ContextMenuSubTrigger,
    ContextMenuTrigger,
} from '@/components/ui/context-menu'
import { CopyButton } from '@/components/ui/copy-button'
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { Divider } from '@/components/ui/divider'
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuShortcut,
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
import { Loading } from '@/components/ui/loading'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Progress } from '@/components/ui/progress'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Search, SearchInput, SearchList, SearchListItem, SearchTrigger } from '@/components/ui/search'
import { toast } from '@/components/ui/snakebar'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { TextField } from '@/components/ui/text-field'
import { Toolbar, ToolbarItem } from '@/components/ui/toolbar'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

/* ------------------------------------ Model ----------------------------------- */

const me = 'Alex Morgan'
const assignees = ['Unassigned', me, 'Maya Chen', 'Sam Rivera'] as const
const statuses = ['Open', 'Waiting', 'Resolved'] as const
const priorities = ['Low', 'Normal', 'High', 'Urgent'] as const
const queues = ['Open', 'Mine', 'Snoozed', 'Resolved'] as const
const quickFilters = ['Unread', 'Urgent', 'Unassigned', 'Starred', 'SLA at risk'] as const
const sorts = ['Newest', 'Oldest', 'SLA due', 'Priority'] as const
const allTags = ['billing', 'bug', 'sso', 'onboarding', 'integrations', 'feature-request', 'escalated', 'vip'] as const
const snoozeOptions = ['In 1 hour', 'This afternoon', 'Tomorrow, 9:00 AM', 'Next Monday'] as const
const presences = ['Available', 'Away', 'Offline'] as const

type Assignee = (typeof assignees)[number]
type Status = (typeof statuses)[number]
type Priority = (typeof priorities)[number]
type Queue = (typeof queues)[number]
type QuickFilter = (typeof quickFilters)[number]
type Sort = (typeof sorts)[number]
type Tag = (typeof allTags)[number]
type Presence = (typeof presences)[number]
type ComposerMode = 'reply' | 'note'
type SendAction = 'send' | 'waiting' | 'resolve'

type Attachment = { name: string; size: string }
type Message = {
    kind: 'customer' | 'reply' | 'note' | 'event'
    author: string
    time: string
    body: string
    attachments?: Attachment[]
}
type Customer = {
    name: string
    email: string
    company: string
    plan: 'Starter' | 'Business' | 'Enterprise'
    location: string
    localTime: string
    since: string
    mrr: string
    csat: number
    history: { id: number; subject: string; date: string; status: Status }[]
}
type TicketFields = { assignee: Assignee; priority: Priority; status: Status }
type Ticket = TicketFields & {
    id: number
    subject: string
    channel: 'Email' | 'Chat' | 'Web form'
    customer: Customer
    tags: Tag[]
    /** Minutes since midnight, used for sorting and the list timestamp. */
    updatedAt: number
    unread?: boolean
    starred?: boolean
    snoozed?: (typeof snoozeOptions)[number]
    /** Minutes left until the next-response SLA; negative means breached. */
    slaDue?: number
    slaTotal: number
    /** A scripted customer follow-up that arrives after the agent replies. */
    followUp?: string
    messages: Message[]
}

const NOW = 10 * 60 + 30

const initialTickets: Ticket[] = [
    {
        id: 1048,
        subject: 'Charged twice after plan upgrade',
        channel: 'Email',
        customer: {
            name: 'Nina Patel',
            email: 'nina@brightside.example',
            company: 'Brightside Studio',
            plan: 'Business',
            location: 'London, UK',
            localTime: '3:30 PM',
            since: 'Mar 2023',
            mrr: '$240',
            csat: 96,
            history: [
                { id: 981, subject: 'Export invoices as CSV', date: 'Aug 12', status: 'Resolved' },
                { id: 902, subject: 'Add a second billing contact', date: 'May 3', status: 'Resolved' },
            ],
        },
        tags: ['billing', 'vip'],
        assignee: me,
        priority: 'Urgent',
        status: 'Open',
        updatedAt: 10 * 60 + 24,
        slaDue: 18,
        slaTotal: 60,
        followUp: 'Perfect, thank you! I can see the refund as pending on our card statement now.',
        messages: [
            {
                kind: 'customer',
                author: 'Nina Patel',
                time: '10:04 AM',
                body: 'We upgraded to Business yesterday and our card shows two $240 charges. Could you check whether both went through? The receipt I received is INV-8724.',
                attachments: [
                    { name: 'INV-8724.pdf', size: '84 KB' },
                    { name: 'card-statement.png', size: '312 KB' },
                ],
            },
            { kind: 'event', author: 'Maya Chen', time: '10:11 AM', body: 'assigned this ticket to Alex Morgan' },
            {
                kind: 'reply',
                author: me,
                time: '10:24 AM',
                body: 'Thanks for sending the receipt, Nina. I’ll compare the invoice with our payment records and confirm whether the second charge was captured.',
            },
        ],
    },
    {
        id: 1047,
        subject: 'Invite link expires before teammates can join',
        channel: 'Chat',
        customer: {
            name: 'Miles Reed',
            email: 'miles@fieldwork.example',
            company: 'Fieldwork',
            plan: 'Starter',
            location: 'Austin, US',
            localTime: '9:30 AM',
            since: 'Oct 2025',
            mrr: '$48',
            csat: 88,
            history: [],
        },
        tags: ['onboarding', 'bug'],
        assignee: 'Unassigned',
        priority: 'High',
        status: 'Open',
        updatedAt: 9 * 60 + 52,
        unread: true,
        slaDue: -6,
        slaTotal: 30,
        followUp: 'That worked — the new links open fine. Thanks for the quick fix!',
        messages: [
            {
                kind: 'customer',
                author: 'Miles Reed',
                time: '9:52 AM',
                body: 'The invite links I sent this morning all show “expired” when my teammates open them. I can reproduce it with a new invitation to my other email. We start onboarding at noon.',
            },
        ],
    },
    {
        id: 1046,
        subject: 'Audit log export missing sign-in events',
        channel: 'Email',
        customer: {
            name: 'Emma Brooks',
            email: 'emma@stonebridge.example',
            company: 'Stonebridge Finance',
            plan: 'Enterprise',
            location: 'Toronto, CA',
            localTime: '10:30 AM',
            since: 'Jan 2022',
            mrr: '$2,400',
            csat: 92,
            history: [{ id: 877, subject: 'SCIM provisioning for new hires', date: 'Feb 9', status: 'Resolved' }],
        },
        tags: [],
        assignee: 'Maya Chen',
        priority: 'Normal',
        status: 'Waiting',
        updatedAt: 9 * 60 + 31,
        slaTotal: 240,
        messages: [
            {
                kind: 'customer',
                author: 'Emma Brooks',
                time: '9:12 AM',
                body: 'I downloaded the October audit log for our quarterly review. It includes user changes but no sign-in events for the first week. Is there a separate export for authentication?',
            },
            {
                kind: 'reply',
                author: 'Maya Chen',
                time: '9:31 AM',
                body: 'Could you share the time zone you selected for the export? I can compare the report window with the events recorded in your workspace.',
            },
            { kind: 'event', author: 'Maya Chen', time: '9:31 AM', body: 'changed status to Waiting' },
        ],
    },
    {
        id: 1045,
        subject: 'SAML sign-in redirects back to login',
        channel: 'Web form',
        customer: {
            name: 'Owen Kline',
            email: 'owen@aster.example',
            company: 'Aster Labs',
            plan: 'Enterprise',
            location: 'Berlin, DE',
            localTime: '4:30 PM',
            since: 'Jun 2021',
            mrr: '$3,100',
            csat: 81,
            history: [
                { id: 1012, subject: 'Okta group sync is delayed', date: 'Oct 28', status: 'Resolved' },
                { id: 955, subject: 'Enforce SSO for contractors', date: 'Jul 2', status: 'Resolved' },
                { id: 870, subject: 'Rotate SCIM token', date: 'Jan 30', status: 'Resolved' },
            ],
        },
        tags: ['sso', 'vip'],
        assignee: 'Sam Rivera',
        priority: 'Urgent',
        status: 'Open',
        updatedAt: 9 * 60 + 18,
        unread: true,
        starred: true,
        slaDue: 42,
        slaTotal: 60,
        messages: [
            {
                kind: 'customer',
                author: 'Owen Kline',
                time: '9:02 AM',
                body: 'Our Okta certificate rotated this morning. Users get through Okta successfully, then land back on the sign-in page. It affects everyone who uses SSO.',
                attachments: [{ name: 'har-capture.har', size: '1.8 MB' }],
            },
            {
                kind: 'reply',
                author: 'Sam Rivera',
                time: '9:08 AM',
                body: 'Thanks Owen — we’re looking into this now. Could you confirm the time the certificate was rotated in Okta?',
            },
            { kind: 'customer', author: 'Owen Kline', time: '9:12 AM', body: 'Around 8:40 AM CET, automatically.' },
            {
                kind: 'note',
                author: 'Sam Rivera',
                time: '9:18 AM',
                body: 'Support logs show a signature mismatch. Confirm the workspace has the new signing certificate before asking the customer to run another test.',
            },
        ],
    },
    {
        id: 1044,
        subject: 'Transfer ownership of archived projects',
        channel: 'Email',
        customer: {
            name: 'Lena Morales',
            email: 'lena@commonwell.example',
            company: 'Commonwell',
            plan: 'Business',
            location: 'Madrid, ES',
            localTime: '4:30 PM',
            since: 'Sep 2024',
            mrr: '$480',
            csat: 99,
            history: [],
        },
        tags: [],
        assignee: me,
        priority: 'Low',
        status: 'Waiting',
        updatedAt: -40,
        snoozed: 'Tomorrow, 9:00 AM',
        slaTotal: 480,
        messages: [
            {
                kind: 'customer',
                author: 'Lena Morales',
                time: 'Yesterday',
                body: 'We’re offboarding a workspace owner. Can we transfer their archived projects in bulk? There are 18, and we need to retain their history.',
            },
        ],
    },
    {
        id: 1043,
        subject: 'Webhook events delivered twice after a timeout',
        channel: 'Email',
        customer: {
            name: 'Iris Wong',
            email: 'iris@tandem.example',
            company: 'Tandem Commerce',
            plan: 'Business',
            location: 'Singapore',
            localTime: '11:30 PM',
            since: 'Apr 2023',
            mrr: '$720',
            csat: 90,
            history: [{ id: 990, subject: 'Webhook signing secret rotation', date: 'Sep 14', status: 'Resolved' }],
        },
        tags: ['integrations'],
        assignee: 'Unassigned',
        priority: 'Normal',
        status: 'Open',
        updatedAt: -90,
        slaDue: 135,
        slaTotal: 240,
        followUp: 'Got it — we’ll make our handler idempotent on the event ID. Appreciate the detail.',
        messages: [
            {
                kind: 'customer',
                author: 'Iris Wong',
                time: 'Yesterday',
                body: 'We see two deliveries with the same event ID whenever our endpoint takes longer than six seconds. What timeout and retry window should we plan for?',
            },
        ],
    },
    {
        id: 1042,
        subject: 'Update the VAT number on our invoice',
        channel: 'Email',
        customer: {
            name: 'Rafael Silva',
            email: 'rafael@bureaueight.example',
            company: 'Bureau Eight',
            plan: 'Starter',
            location: 'Lisbon, PT',
            localTime: '3:30 PM',
            since: 'Nov 2024',
            mrr: '$48',
            csat: 100,
            history: [],
        },
        tags: ['billing'],
        assignee: me,
        priority: 'Normal',
        status: 'Resolved',
        updatedAt: -120,
        slaTotal: 480,
        messages: [
            {
                kind: 'customer',
                author: 'Rafael Silva',
                time: 'Yesterday',
                body: 'Our finance team updated the VAT number in the billing profile. Can the November invoice be reissued with the updated information?',
            },
            {
                kind: 'reply',
                author: me,
                time: 'Yesterday',
                body: 'The corrected invoice is available under Billing → Invoices. Future invoices will use the updated number on your billing profile.',
                attachments: [{ name: 'INV-8650-corrected.pdf', size: '88 KB' }],
            },
            { kind: 'event', author: me, time: 'Yesterday', body: 'changed status to Resolved' },
        ],
    },
    {
        id: 1041,
        subject: 'Request: dark mode for the mobile app',
        channel: 'Web form',
        customer: {
            name: 'Theo Grant',
            email: 'theo@northwind.example',
            company: 'Northwind',
            plan: 'Business',
            location: 'Sydney, AU',
            localTime: '1:30 AM',
            since: 'Dec 2023',
            mrr: '$240',
            csat: 94,
            history: [],
        },
        tags: ['feature-request'],
        assignee: 'Maya Chen',
        priority: 'Low',
        status: 'Open',
        updatedAt: -200,
        slaDue: 300,
        slaTotal: 480,
        messages: [
            {
                kind: 'customer',
                author: 'Theo Grant',
                time: 'Yesterday',
                body: 'Our field team uses the app at night and the bright screens are rough. Any plans for a dark theme on iOS and Android?',
            },
        ],
    },
]

const macros = [
    {
        title: 'Acknowledge and investigate',
        body: 'Hi {first}, thanks for reaching out. I’m looking into this now and will update you within the hour.',
    },
    {
        title: 'Duplicate charge refunded',
        body: 'Hi {first}, I’ve confirmed the duplicate charge and issued a full refund. It should appear on your statement in 3–5 business days.',
    },
    {
        title: 'Request a screen recording',
        body: 'Hi {first}, could you send a short screen recording of the issue? It helps our engineers reproduce it quickly.',
    },
    {
        title: 'Shared with product team',
        body: 'Hi {first}, thanks for the suggestion! I’ve shared it with our product team and added your vote to the request.',
    },
] as const

const fakeAttachments: Attachment[] = [
    { name: 'screenshot.png', size: '640 KB' },
    { name: 'refund-receipt.pdf', size: '92 KB' },
    { name: 'setup-guide.pdf', size: '1.2 MB' },
]

const shortcuts = [
    { keys: ['J'], label: 'Next ticket' },
    { keys: ['K'], label: 'Previous ticket' },
    { keys: ['R'], label: 'Reply' },
    { keys: ['N'], label: 'Internal note' },
    { keys: ['S'], label: 'Star / unstar' },
    { keys: ['U'], label: 'Mark as unread' },
    { keys: ['E'], label: 'Resolve' },
    { keys: ['⌘', '↵'], label: 'Send message' },
    { keys: ['?'], label: 'Show shortcuts' },
]

const priorityRank: Record<Priority, number> = { Low: 0, Normal: 1, High: 2, Urgent: 3 }

const statusIcons: Record<Status, string> = {
    Open: 'icon-[material-symbols--radio-button-unchecked]',
    Waiting: 'icon-[material-symbols--hourglass-empty-rounded]',
    Resolved: 'icon-[material-symbols--check-circle-outline-rounded]',
}

const priorityIcons: Record<Priority, string> = {
    Low: 'icon-[material-symbols--keyboard-arrow-down-rounded]',
    Normal: 'icon-[material-symbols--drag-handle-rounded]',
    High: 'icon-[material-symbols--keyboard-arrow-up-rounded]',
    Urgent: 'icon-[material-symbols--priority-high-rounded]',
}

const channelIcons: Record<Ticket['channel'], string> = {
    Email: 'icon-[material-symbols--mail-outline-rounded]',
    Chat: 'icon-[material-symbols--chat-outline-rounded]',
    'Web form': 'icon-[material-symbols--web-asset]',
}

const presenceColors: Record<Presence, string> = {
    Available: 'bg-[#2e7d32]',
    Away: 'bg-[#f9a825]',
    Offline: 'bg-outline',
}

function inQueue(ticket: Ticket, queue: Queue) {
    if (queue === 'Resolved') return ticket.status === 'Resolved'
    if (ticket.status === 'Resolved') return false
    if (queue === 'Snoozed') return !!ticket.snoozed
    if (ticket.snoozed) return false
    return queue === 'Open' || ticket.assignee === me
}

function homeQueue(ticket: Ticket): Queue {
    return queues.find(queue => queue !== 'Mine' && inQueue(ticket, queue)) ?? 'Open'
}

function slaAtRisk(ticket: Ticket) {
    return ticket.status === 'Open' && ticket.slaDue !== undefined && ticket.slaDue <= 30
}

function matchesFilters(ticket: Ticket, filters: QuickFilter[]) {
    return filters.every(filter => {
        if (filter === 'Unread') return ticket.unread
        if (filter === 'Urgent') return ticket.priority === 'Urgent'
        if (filter === 'Unassigned') return ticket.assignee === 'Unassigned'
        if (filter === 'Starred') return ticket.starred
        return slaAtRisk(ticket)
    })
}

function compareTickets(sort: Sort) {
    return (a: Ticket, b: Ticket) => {
        if (sort === 'Oldest') return a.updatedAt - b.updatedAt
        if (sort === 'SLA due') return (a.slaDue ?? Infinity) - (b.slaDue ?? Infinity) || b.updatedAt - a.updatedAt
        if (sort === 'Priority') return priorityRank[b.priority] - priorityRank[a.priority] || b.updatedAt - a.updatedAt
        return b.updatedAt - a.updatedAt
    }
}

function formatTime(minutes: number) {
    if (minutes > NOW) return 'Now'
    if (minutes < 0) return 'Yesterday'
    const h = Math.floor(minutes / 60)
    return `${h % 12 || 12}:${String(minutes % 60).padStart(2, '0')} ${h < 12 ? 'AM' : 'PM'}`
}

function formatDuration(minutes: number) {
    const value = Math.abs(minutes)
    const h = Math.floor(value / 60)
    const m = value % 60
    return h ? `${h}h${m ? ` ${m}m` : ''}` : `${m}m`
}

function slaLabel(ticket: Ticket) {
    if (ticket.slaDue === undefined) return null
    return ticket.slaDue < 0 ? `Overdue ${formatDuration(ticket.slaDue)}` : `Due in ${formatDuration(ticket.slaDue)}`
}

function firstName(name: string) {
    return name.split(' ')[0]
}

function initials(name: string) {
    return name
        .split(' ')
        .map(part => part[0])
        .join('')
}

/* ----------------------------------- Shared ----------------------------------- */

function PersonAvatar({ name, customer = false, className }: { name: string; customer?: boolean; className?: string }) {
    return (
        <Avatar aria-hidden='true' className={cn(customer && 'bg-tertiary-container', className)}>
            <AvatarFallback className={cn('text-sm font-medium', customer && 'text-on-tertiary-container')}>
                {initials(name)}
            </AvatarFallback>
        </Avatar>
    )
}

function IconAction({
    label,
    shortcut,
    children,
    className,
    ...props
}: React.ComponentProps<typeof Button> & { label: string; shortcut?: string }) {
    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <Button
                    type='button'
                    variant='text'
                    size='sm'
                    icon
                    aria-label={label}
                    aria-keyshortcuts={shortcut}
                    className={cn('text-on-surface-variant', className)}
                    {...props}
                >
                    {children}
                </Button>
            </TooltipTrigger>
            <TooltipContent>
                {label}
                {shortcut && <span className='ml-2 opacity-70'>{shortcut}</span>}
            </TooltipContent>
        </Tooltip>
    )
}

/** An icon button that opens a dropdown menu and shows a tooltip on hover. */
function IconMenu({
    label,
    icon,
    className,
    children,
    ...props
}: Omit<React.ComponentProps<typeof DropdownMenuContent>, 'children'> & {
    label: string
    icon: string
    children: React.ReactNode
}) {
    return (
        <DropdownMenu>
            <Tooltip>
                <TooltipTrigger asChild>
                    <DropdownMenuTrigger asChild>
                        <Button
                            type='button'
                            variant='text'
                            size='sm'
                            icon
                            aria-label={label}
                            className='text-on-surface-variant'
                        >
                            <i className={icon} />
                        </Button>
                    </DropdownMenuTrigger>
                </TooltipTrigger>
                <TooltipContent>{label}</TooltipContent>
            </Tooltip>
            <MenuContent className={className} {...props}>
                {children}
            </MenuContent>
        </DropdownMenu>
    )
}

/** Dropdown content that is never narrower than the element that opens it. */
function MenuContent({ className, ...props }: React.ComponentProps<typeof DropdownMenuContent>) {
    return <DropdownMenuContent compact className={cn('min-w-(--radix-dropdown-menu-trigger-width)', className)} {...props} />
}

function SlaBadge({ ticket }: { ticket: Ticket }) {
    const label = slaLabel(ticket)
    if (!label || ticket.status !== 'Open') return null
    const breached = (ticket.slaDue ?? 0) < 0
    return (
        <span
            className={cn(
                'inline-flex h-6 items-center gap-1 rounded-lg pr-2 pl-1.5 text-xs font-medium',
                breached
                    ? 'bg-error-container text-on-error-container'
                    : slaAtRisk(ticket)
                      ? 'bg-tertiary-container text-on-tertiary-container'
                      : 'bg-surface-container-high text-on-surface-variant',
            )}
        >
            <i className='icon-[material-symbols--timer-outline-rounded] size-4' aria-hidden='true' />
            {label}
        </span>
    )
}

/* ---------------------------------- List pane --------------------------------- */

function InboxSearch({ tickets, onSelect }: { tickets: Ticket[]; onSelect: (ticket: Ticket) => void }) {
    const [query, setQuery] = React.useState('')
    const [open, setOpen] = React.useState(false)
    const search = query.trim().toLowerCase().replace(/^#/, '')
    const matches = tickets
        .filter(ticket =>
            [String(ticket.id), ticket.subject, ticket.customer.name, ticket.customer.company, ...ticket.tags].some(value =>
                value.toLowerCase().includes(search),
            ),
        )
        .slice(0, 6)

    function select(ticket: Ticket) {
        setQuery('')
        setOpen(false)
        onSelect(ticket)
    }

    return (
        <Search open={open} onOpenChange={setOpen} className='min-w-0 flex-1'>
            <SearchTrigger className='h-12' onSearch={() => search && matches[0] && select(matches[0])}>
                <span data-slot='search-icon'>
                    <i className='icon-[material-symbols--search-rounded]' aria-hidden='true' />
                </span>
                <SearchInput
                    aria-label='Search tickets'
                    placeholder='Search tickets, customers, tags'
                    className='pl-0'
                    value={query}
                    onValueChange={setQuery}
                />
            </SearchTrigger>
            <SearchList className='shadow-elevation-2'>
                {!search && <p className='px-4 pt-3 pb-1 text-sm text-on-surface-variant'>Recent tickets</p>}
                {matches.length === 0 && (
                    <p role='status' className='px-4 py-6 text-sm text-on-surface-variant'>
                        No tickets match “{query}”
                    </p>
                )}
                {matches.map(ticket => (
                    <SearchListItem key={ticket.id} onClick={() => select(ticket)}>
                        <ListItemLeading>
                            <PersonAvatar name={ticket.customer.name} customer className='size-8' />
                        </ListItemLeading>
                        <ListItemContent>
                            <ListItemLabel>{ticket.subject}</ListItemLabel>
                            <ListItemSupportingText>
                                #{ticket.id} · {ticket.customer.name} · {ticket.status}
                            </ListItemSupportingText>
                        </ListItemContent>
                    </SearchListItem>
                ))}
            </SearchList>
        </Search>
    )
}

function TicketContextMenu({
    ticket,
    children,
    onOpen,
    onPatch,
    onUpdate,
}: {
    ticket: Ticket
    children: React.ReactNode
    onOpen: () => void
    onPatch: (patch: Partial<Ticket>, message?: string) => void
    onUpdate: (patch: Partial<TicketFields>) => void
}) {
    const resolved = ticket.status === 'Resolved'
    return (
        <ContextMenu>
            <ContextMenuTrigger asChild>
                <div className='contents'>{children}</div>
            </ContextMenuTrigger>
            <ContextMenuContent compact className='w-52'>
                <ContextMenuGroup>
                    <ContextMenuItem onSelect={onOpen}>
                        <i className='icon-[material-symbols--open-in-new-rounded]' />
                        Open
                    </ContextMenuItem>
                    <ContextMenuItem onSelect={() => onPatch({ unread: !ticket.unread })}>
                        <i
                            className={
                                ticket.unread
                                    ? 'icon-[material-symbols--drafts-outline-rounded]'
                                    : 'icon-[material-symbols--mark-email-unread-outline-rounded]'
                            }
                        />
                        {ticket.unread ? 'Mark as read' : 'Mark as unread'}
                        <ContextMenuShortcut>U</ContextMenuShortcut>
                    </ContextMenuItem>
                    <ContextMenuItem onSelect={() => onPatch({ starred: !ticket.starred })}>
                        <i className='icon-[material-symbols--star-outline-rounded]' />
                        {ticket.starred ? 'Unstar' : 'Star'}
                        <ContextMenuShortcut>S</ContextMenuShortcut>
                    </ContextMenuItem>
                    {ticket.assignee !== me && (
                        <ContextMenuItem onSelect={() => onUpdate({ assignee: me })}>
                            <i className='icon-[material-symbols--person-add-outline-rounded]' />
                            Assign to me
                        </ContextMenuItem>
                    )}
                </ContextMenuGroup>
                <ContextMenuGroup>
                    <ContextMenuSub>
                        <ContextMenuSubTrigger>
                            <i className='icon-[material-symbols--flag-outline-rounded]' />
                            <span className='ml-2'>Priority</span>
                        </ContextMenuSubTrigger>
                        <ContextMenuSubContent className='w-36'>
                            <ContextMenuGroup>
                                <ContextMenuRadioGroup value={ticket.priority}>
                                    {priorities.map(priority => (
                                        <ContextMenuRadioItem
                                            key={priority}
                                            value={priority}
                                            onSelect={() => onUpdate({ priority })}
                                        >
                                            {priority}
                                        </ContextMenuRadioItem>
                                    ))}
                                </ContextMenuRadioGroup>
                            </ContextMenuGroup>
                        </ContextMenuSubContent>
                    </ContextMenuSub>
                    {!resolved && (
                        <ContextMenuSub>
                            <ContextMenuSubTrigger>
                                <i className='icon-[material-symbols--snooze-outline-rounded]' />
                                <span className='ml-2'>Snooze</span>
                            </ContextMenuSubTrigger>
                            <ContextMenuSubContent className='w-44'>
                                <ContextMenuGroup>
                                    {snoozeOptions.map(option => (
                                        <ContextMenuItem
                                            key={option}
                                            onSelect={() =>
                                                onPatch({ snoozed: option }, `#${ticket.id} snoozed until ${option}`)
                                            }
                                        >
                                            {option}
                                        </ContextMenuItem>
                                    ))}
                                </ContextMenuGroup>
                            </ContextMenuSubContent>
                        </ContextMenuSub>
                    )}
                    <ContextMenuItem onSelect={() => onUpdate({ status: resolved ? 'Open' : 'Resolved' })}>
                        <i
                            className={
                                resolved ? 'icon-[material-symbols--undo-rounded]' : 'icon-[material-symbols--check-rounded]'
                            }
                        />
                        {resolved ? 'Reopen' : 'Resolve'}
                        {!resolved && <ContextMenuShortcut>E</ContextMenuShortcut>}
                    </ContextMenuItem>
                </ContextMenuGroup>
            </ContextMenuContent>
        </ContextMenu>
    )
}

function TicketRow({
    ticket,
    active,
    checked,
    selecting,
    onOpen,
    onCheck,
    onPatch,
    onUpdate,
}: {
    ticket: Ticket
    active: boolean
    checked: boolean
    selecting: boolean
    onOpen: () => void
    onCheck: (checked: boolean) => void
    onPatch: (patch: Partial<Ticket>, message?: string) => void
    onUpdate: (patch: Partial<TicketFields>) => void
}) {
    const preview = ticket.messages.findLast(message => message.kind === 'customer' || message.kind === 'reply')
    const showCheckbox = selecting || checked

    return (
        <TicketContextMenu ticket={ticket} onOpen={onOpen} onPatch={onPatch} onUpdate={onUpdate}>
            <ListItem
                selected={active || checked}
                aria-current={active ? 'true' : undefined}
                aria-label={`${ticket.unread ? 'Unread, ' : ''}#${ticket.id} ${ticket.subject}, from ${ticket.customer.name}`}
                onClick={onOpen}
                className='items-start gap-4 py-3.5 pr-4'
            >
                <ListItemLeading className='size-10'>
                    <PersonAvatar
                        name={ticket.customer.name}
                        customer
                        className={cn('transition-opacity group-hover/list-item:opacity-0', showCheckbox && 'opacity-0')}
                    />
                    <span
                        className={cn(
                            'absolute inset-0 grid place-items-center opacity-0 transition-opacity group-hover/list-item:opacity-100 has-focus-visible:opacity-100',
                            showCheckbox && 'opacity-100',
                        )}
                        onClick={event => event.stopPropagation()}
                    >
                        <Checkbox
                            checked={checked}
                            onCheckedChange={value => onCheck(value === true)}
                            aria-label={`Select ticket #${ticket.id}`}
                        />
                    </span>
                </ListItemLeading>
                <ListItemContent className='gap-0.5'>
                    <span className='flex min-w-0 items-center gap-2'>
                        <span className={cn('truncate text-sm', ticket.unread ? 'font-semibold' : 'font-medium')}>
                            {ticket.customer.name}
                        </span>
                        {ticket.starred && (
                            <i
                                className='icon-[material-symbols--star-rounded] size-4 shrink-0 text-tertiary'
                                aria-label='Starred'
                            />
                        )}
                        <ListItemTrailingText className={cn('ml-auto shrink-0', ticket.unread && 'text-primary')}>
                            {formatTime(ticket.updatedAt)}
                        </ListItemTrailingText>
                    </span>
                    <span className='flex min-w-0 items-center gap-2'>
                        <ListItemLabel className={cn('flex-1 text-sm leading-5', ticket.unread && 'font-semibold')}>
                            {ticket.subject}
                        </ListItemLabel>
                        {ticket.unread && <Badge size='sm' className='size-2 shrink-0 bg-primary' aria-hidden='true' />}
                    </span>
                    <ListItemSupportingText>
                        {preview?.kind === 'reply' && <span className='font-medium'>{firstName(preview.author)}: </span>}
                        {preview?.body}
                    </ListItemSupportingText>
                    <span className='mt-2 flex flex-wrap items-center gap-1.5 empty:hidden'>
                        {ticket.snoozed ? (
                            <span className='inline-flex h-6 items-center gap-1 rounded-lg bg-surface-container-high pr-2 pl-1.5 text-xs font-medium text-on-surface-variant'>
                                <i className='icon-[material-symbols--snooze-outline-rounded] size-4' aria-hidden='true' />
                                {ticket.snoozed}
                            </span>
                        ) : (
                            <SlaBadge ticket={ticket} />
                        )}
                        {ticket.priority === 'Urgent' && (
                            <span className='inline-flex h-6 items-center gap-0.5 rounded-lg bg-error-container pr-2 pl-1 text-xs font-medium text-on-error-container'>
                                <i className={cn(priorityIcons.Urgent, 'size-4')} aria-hidden='true' />
                                Urgent
                            </span>
                        )}
                    </span>
                </ListItemContent>
            </ListItem>
        </TicketContextMenu>
    )
}

type BulkAction = 'assign' | 'read' | 'snooze' | 'resolve'

function BulkToolbar({
    count,
    total,
    onSelectAll,
    onClear,
    onAction,
}: {
    count: number
    total: number
    onSelectAll: (all: boolean) => void
    onClear: () => void
    onAction: (action: BulkAction) => void
}) {
    const actions = [
        { key: 'assign', label: 'Assign to me', icon: 'icon-[material-symbols--person-add-outline-rounded]' },
        { key: 'read', label: 'Mark as read', icon: 'icon-[material-symbols--drafts-outline-rounded]' },
        { key: 'snooze', label: 'Snooze until tomorrow', icon: 'icon-[material-symbols--snooze-outline-rounded]' },
        { key: 'resolve', label: 'Resolve', icon: 'icon-[material-symbols--check-circle-outline-rounded]' },
    ] as const

    return (
        <Toolbar variant='docked' compact color='vibrant' aria-label='Bulk actions' className='h-12 rounded-full px-1'>
            <div className='flex items-center gap-1'>
                <span className='grid size-10 place-items-center'>
                    <Checkbox
                        checked={count === total}
                        onCheckedChange={value => onSelectAll(value === true)}
                        aria-label='Select all tickets'
                    />
                </span>
                <span className='text-sm font-medium'>{count} selected</span>
            </div>
            <div className='flex items-center'>
                {actions.map(action => (
                    <Tooltip key={action.key}>
                        <TooltipTrigger asChild>
                            <span className='inline-flex'>
                                <ToolbarItem aria-label={action.label} onClick={() => onAction(action.key)}>
                                    <i className={action.icon} />
                                </ToolbarItem>
                            </span>
                        </TooltipTrigger>
                        <TooltipContent>{action.label}</TooltipContent>
                    </Tooltip>
                ))}
                <Tooltip>
                    <TooltipTrigger asChild>
                        <span className='inline-flex'>
                            <ToolbarItem aria-label='Clear selection' onClick={onClear}>
                                <i className='icon-[material-symbols--close-rounded]' />
                            </ToolbarItem>
                        </span>
                    </TooltipTrigger>
                    <TooltipContent>Clear selection</TooltipContent>
                </Tooltip>
            </div>
        </Toolbar>
    )
}

/* --------------------------------- Detail pane -------------------------------- */

function PropertyMenu<T extends string>({
    label,
    value,
    icon,
    options,
    className,
    renderOption,
    onSelect,
}: {
    label: string
    value: T
    icon: React.ReactNode
    options: readonly T[]
    className?: string
    renderOption?: (option: T) => React.ReactNode
    onSelect: (value: T) => void
}) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Chip
                    asChild
                    leadingIcon={icon}
                    trailingIcon={<i className='icon-[material-symbols--arrow-drop-down-rounded]' />}
                    className={cn('[&>i]:text-current', className)}
                >
                    <button type='button' aria-label={`${label}: ${value}`}>
                        {value}
                    </button>
                </Chip>
            </DropdownMenuTrigger>
            <MenuContent align='start'>
                <DropdownMenuGroup>
                    <DropdownMenuLabel>{label}</DropdownMenuLabel>
                    {options.map(option => (
                        <DropdownMenuItem key={option} onSelect={() => onSelect(option)}>
                            {renderOption ? renderOption(option) : option}
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuGroup>
            </MenuContent>
        </DropdownMenu>
    )
}

function TagMenu({ tags, onChange }: { tags: Tag[]; onChange: (tags: Tag[]) => void }) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Chip
                    asChild
                    leadingIcon={<i className='icon-[material-symbols--label-outline-rounded]' />}
                    trailingIcon={<i className='icon-[material-symbols--arrow-drop-down-rounded]' />}
                    className='max-w-56 [&>i]:text-current'
                >
                    <button type='button' aria-label={`Tags: ${tags.join(', ') || 'none'}`}>
                        <span className='truncate'>{tags.length ? tags.join(', ') : 'Add tags'}</span>
                    </button>
                </Chip>
            </DropdownMenuTrigger>
            <MenuContent align='start' className='w-48'>
                <DropdownMenuGroup>
                    <DropdownMenuLabel>Tags</DropdownMenuLabel>
                    {allTags.map(tag => (
                        <DropdownMenuCheckboxItem
                            key={tag}
                            checked={tags.includes(tag)}
                            onSelect={event => event.preventDefault()}
                            onCheckedChange={checked => onChange(checked ? [...tags, tag] : tags.filter(item => item !== tag))}
                        >
                            {tag}
                        </DropdownMenuCheckboxItem>
                    ))}
                </DropdownMenuGroup>
            </MenuContent>
        </DropdownMenu>
    )
}

function CustomerPanel({
    ticket,
    tickets,
    onOpenTicket,
}: {
    ticket: Ticket
    tickets: Ticket[]
    onOpenTicket: (ticket: Ticket) => void
}) {
    const { customer } = ticket
    const related = tickets.filter(item => item.id !== ticket.id && item.customer.company === customer.company)
    const facts = [
        {
            icon: 'icon-[material-symbols--location-on-outline-rounded]',
            label: 'Location',
            value: customer.location,
            trailing: `${customer.localTime} local`,
        },
        { icon: 'icon-[material-symbols--calendar-month-outline-rounded]', label: 'Customer since', value: customer.since },
    ]

    return (
        <div className='flex flex-col gap-4'>
            <div className='flex items-center gap-4 px-2 pt-2'>
                <PersonAvatar name={customer.name} customer className='size-14 [&_span]:text-lg' />
                <div className='min-w-0'>
                    <p className='truncate text-lg leading-6 font-medium'>{customer.name}</p>
                    <p className='truncate text-sm text-on-surface-variant'>{customer.company}</p>
                    <span className='mt-1 inline-flex h-6 items-center rounded-lg bg-secondary-container px-2 text-xs font-medium text-on-secondary-container'>
                        {customer.plan}
                    </span>
                </div>
            </div>
            <div className='grid grid-cols-3 gap-2 px-2 text-center'>
                {[
                    { label: 'MRR', value: customer.mrr },
                    { label: 'CSAT', value: customer.csat + '%' },
                    { label: 'Tickets', value: String(customer.history.length + related.length + 1) },
                ].map(stat => (
                    <div key={stat.label} className='rounded-2xl bg-surface-container-high px-2 py-3'>
                        <p className='text-base font-medium'>{stat.value}</p>
                        <p className='text-xs text-on-surface-variant'>{stat.label}</p>
                    </div>
                ))}
            </div>
            <List aria-label='Contact details'>
                <ListItem className='pr-1'>
                    <ListItemLeading>
                        <i className='icon-[material-symbols--mail-outline-rounded]' />
                    </ListItemLeading>
                    <ListItemContent>
                        <ListItemSupportingText className='text-xs'>Email</ListItemSupportingText>
                        <ListItemLabel className='text-sm'>{customer.email}</ListItemLabel>
                    </ListItemContent>
                    <ListItemTrailing>
                        <CopyButton text={customer.email} aria-label='Copy email' className='bg-transparent' />
                    </ListItemTrailing>
                </ListItem>
                {facts.map(fact => (
                    <ListItem key={fact.label}>
                        <ListItemLeading>
                            <i className={fact.icon} />
                        </ListItemLeading>
                        <ListItemContent>
                            <ListItemSupportingText className='text-xs'>{fact.label}</ListItemSupportingText>
                            <ListItemLabel className='text-sm'>{fact.value}</ListItemLabel>
                        </ListItemContent>
                        {fact.trailing && (
                            <ListItemTrailing>
                                <ListItemTrailingText>{fact.trailing}</ListItemTrailingText>
                            </ListItemTrailing>
                        )}
                    </ListItem>
                ))}
            </List>
            <Divider />
            <div>
                <h3 className='px-2 pb-2 text-sm font-medium text-on-surface-variant'>Other conversations</h3>
                <List variant='segmented' aria-label='Other conversations'>
                    {related.map(item => (
                        <ListItem key={item.id} onClick={() => onOpenTicket(item)} className='bg-surface-container-low'>
                            <ListItemLeading>
                                <i className={statusIcons[item.status]} />
                            </ListItemLeading>
                            <ListItemContent>
                                <ListItemLabel className='text-sm'>{item.subject}</ListItemLabel>
                                <ListItemSupportingText className='text-xs'>
                                    #{item.id} · {item.status}
                                </ListItemSupportingText>
                            </ListItemContent>
                        </ListItem>
                    ))}
                    {customer.history.map(item => (
                        <ListItem
                            key={item.id}
                            className='bg-surface-container-low'
                            onClick={() => toast({ message: `#${item.id} was resolved on ${item.date}` })}
                        >
                            <ListItemLeading>
                                <i className={statusIcons[item.status]} />
                            </ListItemLeading>
                            <ListItemContent>
                                <ListItemLabel className='text-sm'>{item.subject}</ListItemLabel>
                                <ListItemSupportingText className='text-xs'>
                                    #{item.id} · {item.date}
                                </ListItemSupportingText>
                            </ListItemContent>
                        </ListItem>
                    ))}
                    {related.length + customer.history.length === 0 && (
                        <ListItem className='bg-surface-container-low'>
                            <ListItemContent>
                                <ListItemSupportingText>This is their first conversation.</ListItemSupportingText>
                            </ListItemContent>
                        </ListItem>
                    )}
                </List>
            </div>
        </div>
    )
}

type Escalation = { summary: string; severity: string; notify: boolean }

function EscalateDialog({
    ticket,
    open,
    onOpenChange,
    onEscalate,
}: {
    ticket: Ticket
    open: boolean
    onOpenChange: (open: boolean) => void
    onEscalate: (input: Escalation) => void
}) {
    const [summary, setSummary] = React.useState(ticket.subject)
    const [severity, setSeverity] = React.useState('S2')
    const [notify, setNotify] = React.useState(true)
    const severities = [
        { value: 'S1', label: 'S1 · Outage', text: 'Many customers blocked, page on-call now' },
        { value: 'S2', label: 'S2 · Major', text: 'A core workflow is broken for this customer' },
        { value: 'S3', label: 'S3 · Minor', text: 'A workaround exists, fix in the next sprint' },
    ]

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className='max-w-md'>
                <DialogHeader>
                    <DialogTitle>Escalate to engineering</DialogTitle>
                    <DialogDescription>
                        Creates an engineering issue linked to #{ticket.id} and tags the ticket as escalated.
                    </DialogDescription>
                </DialogHeader>
                <form
                    id='escalate-form'
                    className='flex flex-col gap-4'
                    onSubmit={event => {
                        event.preventDefault()
                        if (summary.trim()) onEscalate({ summary: summary.trim(), severity, notify })
                    }}
                >
                    <TextField
                        label='Issue summary'
                        value={summary}
                        onChange={event => setSummary(event.target.value)}
                        error={!summary.trim()}
                        helperText={summary.trim() ? 'Visible to engineering only' : 'Add a short summary'}
                    />
                    <fieldset>
                        <legend className='mb-2 text-sm font-medium'>Severity</legend>
                        <RadioGroup value={severity} onValueChange={setSeverity} className='gap-1'>
                            {severities.map(item => (
                                <label
                                    key={item.value}
                                    className={cn(
                                        'group/severity relative flex cursor-pointer items-center gap-4 rounded-2xl px-4 py-2.5 transition-colors',
                                        severity === item.value && 'bg-secondary-container text-on-secondary-container',
                                    )}
                                >
                                    <span
                                        aria-hidden='true'
                                        className='pointer-events-none absolute inset-0 rounded-[inherit] bg-current opacity-0 transition-opacity group-hover/severity:opacity-8 group-active/severity:opacity-10 group-has-focus-visible/severity:opacity-10'
                                    />
                                    <RadioGroupItem value={item.value} />
                                    <span>
                                        <span className='block text-sm font-medium'>{item.label}</span>
                                        <span className='block text-xs opacity-80'>{item.text}</span>
                                    </span>
                                </label>
                            ))}
                        </RadioGroup>
                    </fieldset>
                    <label className='flex cursor-pointer items-center justify-between gap-4 text-sm'>
                        <span>
                            Let {firstName(ticket.customer.name)} know engineering is involved
                            <span className='block text-xs text-on-surface-variant'>Sends a short reply on your behalf</span>
                        </span>
                        <Switch checked={notify} onCheckedChange={setNotify} />
                    </label>
                </form>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant='text' size='sm'>
                            Cancel
                        </Button>
                    </DialogClose>
                    <Button size='sm' type='submit' form='escalate-form' disabled={!summary.trim()}>
                        Escalate
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

function ShortcutsDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className='max-w-sm'>
                <DialogHeader>
                    <DialogTitle>Keyboard shortcuts</DialogTitle>
                    <DialogDescription>Work through the queue without leaving the keyboard.</DialogDescription>
                </DialogHeader>
                <dl className='flex flex-col'>
                    {shortcuts.map(shortcut => (
                        <div key={shortcut.label} className='flex items-center justify-between py-1.5 text-sm'>
                            <dt>{shortcut.label}</dt>
                            <dd className='flex gap-1'>
                                {shortcut.keys.map(key => (
                                    <kbd
                                        key={key}
                                        className='grid h-7 min-w-7 place-items-center rounded-lg bg-surface-container-highest px-2 font-sans text-xs font-medium'
                                    >
                                        {key}
                                    </kbd>
                                ))}
                            </dd>
                        </div>
                    ))}
                </dl>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button size='sm'>Got it</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

function ThreadMessage({ message, ticket }: { message: Message; ticket: Ticket }) {
    if (message.kind === 'event') {
        return (
            <div className='flex items-center gap-3 px-2 py-1 text-xs text-on-surface-variant'>
                <Divider className='flex-1' />
                <span className='max-w-[80%] text-center'>
                    <span className='font-medium'>{message.author === me ? 'You' : message.author}</span> {message.body} ·{' '}
                    {message.time}
                </span>
                <Divider className='flex-1' />
            </div>
        )
    }

    const customer = message.kind === 'customer'
    const note = message.kind === 'note'

    return (
        <Card
            variant={customer ? 'outlined' : 'filled'}
            className={cn(
                'shrink-0 rounded-[20px]',
                note && 'bg-tertiary-container text-on-tertiary-container',
                message.kind === 'reply' && 'bg-surface-container',
            )}
        >
            <CardContent className='@4xl/app:p-5'>
                <header className='flex items-center gap-3'>
                    <PersonAvatar name={message.author} customer={customer} className='size-9' />
                    <div className='min-w-0 flex-1'>
                        <h3 className='truncate text-sm font-medium'>
                            {message.author}
                            {message.author === me && <span className='font-normal opacity-70'> (you)</span>}
                        </h3>
                        <p className={cn('truncate text-xs', note ? 'opacity-80' : 'text-on-surface-variant')}>
                            {note ? (
                                <span className='inline-flex items-center gap-1'>
                                    <i className='icon-[material-symbols--lock-outline] size-3.5' aria-hidden='true' />
                                    Internal note
                                </span>
                            ) : customer ? (
                                `via ${ticket.channel}`
                            ) : (
                                `to ${ticket.customer.email}`
                            )}
                        </p>
                    </div>
                    <time className={cn('shrink-0 self-start text-xs', note ? 'opacity-80' : 'text-on-surface-variant')}>
                        {message.time}
                    </time>
                </header>
                <p className='mt-3 text-sm leading-6 wrap-break-word whitespace-pre-wrap'>{message.body}</p>
                {!!message.attachments?.length && (
                    <div className='mt-3 flex flex-wrap gap-2'>
                        {message.attachments.map(file => (
                            <Chip
                                key={file.name}
                                asChild
                                leadingIcon={
                                    <i
                                        className={
                                            file.name.endsWith('.png')
                                                ? 'icon-[material-symbols--image-outline-rounded]'
                                                : 'icon-[material-symbols--description-outline-rounded]'
                                        }
                                    />
                                }
                            >
                                <button type='button' onClick={() => toast({ message: `Downloading ${file.name}` })}>
                                    {file.name}
                                    <span className='text-xs text-on-surface-variant'>{file.size}</span>
                                </button>
                            </Chip>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    )
}

type Draft = { reply?: string; note?: string; attachments?: Attachment[] }
type SendHandler = (mode: ComposerMode, body: string, attachments: Attachment[], action: SendAction) => void

function Composer({
    ticket,
    draft,
    mode,
    textareaRef,
    onMode,
    onDraft,
    onSend,
}: {
    ticket: Ticket
    draft: Draft
    mode: ComposerMode
    textareaRef: React.RefObject<HTMLTextAreaElement | null>
    onMode: (mode: ComposerMode) => void
    onDraft: (patch: Draft) => void
    onSend: SendHandler
}) {
    const text = draft[mode] ?? ''
    const body = text.trim()
    const note = mode === 'note'
    const attachments = note ? [] : (draft.attachments ?? [])
    const first = firstName(ticket.customer.name)

    function send(action: SendAction = 'send') {
        if (body) onSend(mode, body, attachments, action)
    }

    function insertMacro(template: string) {
        const filled = template.replace('{first}', first)
        onMode('reply')
        onDraft({ reply: draft.reply?.trim() ? `${draft.reply.trim()}\n\n${filled}` : filled })
        requestAnimationFrame(() => textareaRef.current?.focus())
    }

    return (
        <form
            className={cn(
                'mx-4 mb-4 shrink-0 overflow-hidden rounded-[24px] transition-colors @4xl/app:mx-6 @4xl/app:mb-6',
                note ? 'bg-tertiary-container/60' : 'bg-surface-container-high',
            )}
            onSubmit={event => {
                event.preventDefault()
                send()
            }}
        >
            <textarea
                ref={textareaRef}
                aria-label={note ? 'Internal note' : `Reply to ${ticket.customer.name}`}
                placeholder={note ? 'Only your team can see notes…' : `Reply to ${first} at ${ticket.customer.email}`}
                value={text}
                maxLength={4000}
                rows={2}
                onChange={event => onDraft({ [mode]: event.target.value })}
                onKeyDown={event => {
                    if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) {
                        event.preventDefault()
                        send()
                    }
                }}
                className='block w-full resize-none bg-transparent px-4 pt-3 text-sm leading-6 outline-none placeholder:text-on-surface-variant'
            />
            {attachments.length > 0 && (
                <div className='flex flex-wrap gap-2 px-3 pt-1'>
                    {attachments.map(file => (
                        <Chip
                            key={file.name}
                            variant='input'
                            asChild
                            leadingIcon={<i className='icon-[material-symbols--attach-file-rounded]' />}
                        >
                            <button
                                type='button'
                                aria-label={`Remove ${file.name}`}
                                onClick={() => onDraft({ attachments: attachments.filter(item => item !== file) })}
                            >
                                {file.name}
                            </button>
                        </Chip>
                    ))}
                </div>
            )}
            <div className='flex items-center gap-1 p-2'>
                {!note && (
                    <>
                        <IconAction
                            label='Attach file'
                            disabled={attachments.length >= fakeAttachments.length}
                            onClick={() => {
                                const next = fakeAttachments.find(file => !attachments.includes(file))
                                if (next) onDraft({ attachments: [...attachments, next] })
                            }}
                        >
                            <i className='icon-[material-symbols--attach-file-rounded]' />
                        </IconAction>
                        <IconMenu
                            label='Insert macro'
                            icon='icon-[material-symbols--bolt-outline-rounded]'
                            align='start'
                            side='top'
                            className='w-72'
                        >
                            <DropdownMenuGroup>
                                <DropdownMenuLabel>Macros</DropdownMenuLabel>
                                {macros.map(macro => (
                                    <DropdownMenuItem
                                        key={macro.title}
                                        className='h-auto flex-col items-start gap-0.5 py-2.5'
                                        onSelect={() => insertMacro(macro.body)}
                                    >
                                        <span className='font-medium'>{macro.title}</span>
                                        <span className='line-clamp-1 text-xs text-on-surface-variant'>
                                            {macro.body.replace('{first}', first)}
                                        </span>
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuGroup>
                        </IconMenu>
                    </>
                )}
                {text.length > 3600 && (
                    <span className='ml-1 hidden text-xs text-on-surface-variant @lg/app:inline'>
                        {4000 - text.length} characters left
                    </span>
                )}
                <ButtonGroup className='ml-auto gap-0.5'>
                    <Button type='submit' size='sm' disabled={!body} className='rounded-r-sm pr-3'>
                        <i
                            className={
                                note
                                    ? 'icon-[material-symbols--note-add-outline-rounded]'
                                    : 'icon-[material-symbols--send-rounded]'
                            }
                        />
                        {note ? 'Add note' : 'Send'}
                    </Button>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button type='button' size='sm' aria-label='Send options' className='rounded-l-sm px-2'>
                                <i className='icon-[material-symbols--keyboard-arrow-down-rounded]' />
                            </Button>
                        </DropdownMenuTrigger>
                        <MenuContent align='end' side='top' className='w-52'>
                            <DropdownMenuGroup>
                                <DropdownMenuLabel>Message type</DropdownMenuLabel>
                                <DropdownMenuRadioGroup value={mode} onValueChange={value => onMode(value as ComposerMode)}>
                                    <DropdownMenuRadioItem value='reply'>
                                        Reply
                                        <DropdownMenuShortcut>R</DropdownMenuShortcut>
                                    </DropdownMenuRadioItem>
                                    <DropdownMenuRadioItem value='note'>
                                        Internal note
                                        <DropdownMenuShortcut>N</DropdownMenuShortcut>
                                    </DropdownMenuRadioItem>
                                </DropdownMenuRadioGroup>
                            </DropdownMenuGroup>
                            {!note && (
                                <DropdownMenuGroup>
                                    <DropdownMenuItem disabled={!body} onSelect={() => send('waiting')}>
                                        <i className={statusIcons.Waiting} />
                                        Send and set to Waiting
                                    </DropdownMenuItem>
                                    <DropdownMenuItem disabled={!body} onSelect={() => send('resolve')}>
                                        <i className={statusIcons.Resolved} />
                                        Send and resolve
                                    </DropdownMenuItem>
                                </DropdownMenuGroup>
                            )}
                        </MenuContent>
                    </DropdownMenu>
                </ButtonGroup>
            </div>
        </form>
    )
}

function TicketDetail({
    ticket,
    tickets,
    draft,
    typing,
    composerMode,
    textareaRef,
    onComposerMode,
    onBack,
    onDraft,
    onSend,
    onPatch,
    onUpdate,
    onEscalate,
    onOpenTicket,
}: {
    ticket: Ticket
    tickets: Ticket[]
    draft: Draft
    typing: boolean
    composerMode: ComposerMode
    textareaRef: React.RefObject<HTMLTextAreaElement | null>
    onComposerMode: (mode: ComposerMode) => void
    onBack: () => void
    onDraft: (patch: Draft) => void
    onSend: SendHandler
    onPatch: (patch: Partial<Ticket>, message?: string) => void
    onUpdate: (patch: Partial<TicketFields>) => void
    onEscalate: (input: Escalation) => void
    onOpenTicket: (ticket: Ticket) => void
}) {
    const threadRef = React.useRef<HTMLDivElement>(null)
    const [expanded, setExpanded] = React.useState(false)
    const [escalating, setEscalating] = React.useState(false)
    const resolved = ticket.status === 'Resolved'
    const collapsed = !expanded && ticket.messages.length > 4 ? ticket.messages.length - 3 : 0
    const shown = collapsed ? [ticket.messages[0], ...ticket.messages.slice(collapsed + 1)] : ticket.messages
    const breached = (ticket.slaDue ?? 0) < 0

    React.useEffect(() => {
        const thread = threadRef.current
        if (thread) thread.scrollTo({ top: thread.scrollHeight, behavior: 'smooth' })
    }, [ticket.messages.length, typing])

    return (
        <div className='flex min-h-0 min-w-0 flex-1 flex-col'>
            <header className='shrink-0 px-4 pt-3 @4xl/app:px-6 @4xl/app:pt-5'>
                <div className='flex flex-wrap items-center gap-y-2 @4xl/app:flex-nowrap @4xl/app:items-start'>
                    <IconAction label='Back to tickets' className='-ml-2 @4xl/app:hidden' onClick={onBack}>
                        <i className='icon-[material-symbols--arrow-back-rounded] size-6' />
                    </IconAction>
                    <h2 className='order-last basis-full text-[22px] leading-7 wrap-break-word @4xl/app:order-none @4xl/app:min-w-0 @4xl/app:flex-1 @4xl/app:basis-auto @4xl/app:pt-1 @4xl/app:text-[28px] @4xl/app:leading-9'>
                        {ticket.subject}
                    </h2>
                    <div className='-mr-2 ml-auto flex shrink-0 items-center @4xl/app:ml-4'>
                        <IconAction
                            label={ticket.starred ? 'Unstar' : 'Star'}
                            shortcut='S'
                            aria-pressed={!!ticket.starred}
                            onClick={() => onPatch({ starred: !ticket.starred })}
                        >
                            <i
                                className={
                                    ticket.starred
                                        ? 'icon-[material-symbols--star-rounded] text-tertiary'
                                        : 'icon-[material-symbols--star-outline-rounded]'
                                }
                            />
                        </IconAction>
                        {!resolved && (
                            <IconMenu
                                label='Snooze'
                                icon='icon-[material-symbols--snooze-outline-rounded]'
                                align='end'
                                className='w-52'
                            >
                                <DropdownMenuGroup>
                                    <DropdownMenuLabel>Snooze until</DropdownMenuLabel>
                                    {snoozeOptions.map(option => (
                                        <DropdownMenuItem
                                            key={option}
                                            onSelect={() =>
                                                onPatch({ snoozed: option }, `#${ticket.id} snoozed until ${option}`)
                                            }
                                        >
                                            {option}
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuGroup>
                            </IconMenu>
                        )}
                        <Popover>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <PopoverTrigger asChild>
                                        <Button
                                            type='button'
                                            variant='text'
                                            size='sm'
                                            icon
                                            aria-label='Customer details'
                                            className='text-on-surface-variant @min-[90rem]/app:hidden'
                                        >
                                            <i className='icon-[material-symbols--account-circle-outline]' />
                                        </Button>
                                    </PopoverTrigger>
                                </TooltipTrigger>
                                <TooltipContent>Customer details</TooltipContent>
                            </Tooltip>
                            <PopoverContent
                                align='end'
                                aria-label='Customer details'
                                className='max-h-(--radix-popover-content-available-height) w-80 overflow-y-auto rounded-[28px] p-3'
                            >
                                <CustomerPanel ticket={ticket} tickets={tickets} onOpenTicket={onOpenTicket} />
                            </PopoverContent>
                        </Popover>
                        <IconMenu label='More actions' icon='icon-[material-symbols--more-vert]' align='end' className='w-56'>
                            <DropdownMenuGroup>
                                <DropdownMenuItem
                                    onSelect={() =>
                                        navigator.clipboard
                                            .writeText(`https://support.example/tickets/${ticket.id}`)
                                            .then(() => toast({ message: 'Ticket link copied' }))
                                    }
                                >
                                    <i className='icon-[material-symbols--link-rounded]' />
                                    Copy link
                                </DropdownMenuItem>
                                <DropdownMenuItem onSelect={() => onPatch({ unread: true }, `#${ticket.id} marked as unread`)}>
                                    <i className='icon-[material-symbols--mark-email-unread-outline-rounded]' />
                                    Mark as unread
                                    <DropdownMenuShortcut>U</DropdownMenuShortcut>
                                </DropdownMenuItem>
                                {ticket.assignee !== me && (
                                    <DropdownMenuItem onSelect={() => onUpdate({ assignee: me })}>
                                        <i className='icon-[material-symbols--person-add-outline-rounded]' />
                                        Assign to me
                                    </DropdownMenuItem>
                                )}
                                <DropdownMenuItem
                                    disabled={ticket.tags.includes('escalated')}
                                    onSelect={() => setEscalating(true)}
                                >
                                    <i className='icon-[material-symbols--engineering-outline-rounded]' />
                                    Escalate to engineering…
                                </DropdownMenuItem>
                            </DropdownMenuGroup>
                            <DropdownMenuGroup>
                                <DropdownMenuItem onSelect={() => toast({ message: 'Transcript sent to printer' })}>
                                    <i className='icon-[material-symbols--print-outline-rounded]' />
                                    Print transcript
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    disabled={ticket.tags.includes('vip')}
                                    onSelect={() =>
                                        onPatch({ tags: [...ticket.tags, 'vip'] }, `${ticket.customer.company} flagged as VIP`)
                                    }
                                >
                                    <i className='icon-[material-symbols--workspace-premium-outline-rounded]' />
                                    Flag customer as VIP
                                </DropdownMenuItem>
                            </DropdownMenuGroup>
                        </IconMenu>
                        <Button
                            type='button'
                            size='sm'
                            variant={resolved ? 'tonal' : 'default'}
                            aria-keyshortcuts='E'
                            aria-label={resolved ? 'Reopen' : 'Resolve'}
                            className='ml-1 aspect-square px-0 @lg/app:aspect-auto @lg/app:px-4'
                            onClick={() => onUpdate({ status: resolved ? 'Open' : 'Resolved' })}
                        >
                            <i
                                className={
                                    resolved
                                        ? 'icon-[material-symbols--undo-rounded]'
                                        : 'icon-[material-symbols--check-rounded]'
                                }
                            />
                            <span className='hidden @lg/app:inline'>{resolved ? 'Reopen' : 'Resolve'}</span>
                        </Button>
                    </div>
                </div>
                <div className='mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-on-surface-variant'>
                    <i className={cn(channelIcons[ticket.channel], 'size-4.5')} aria-hidden='true' />
                    <span>#{ticket.id}</span>
                    <span aria-hidden='true'>·</span>
                    <span>{ticket.customer.name}</span>
                    {ticket.status === 'Open' && ticket.slaDue !== undefined && (
                        <>
                            <span aria-hidden='true'>·</span>
                            <span className={cn('inline-flex items-center gap-2', breached && 'font-medium text-error')}>
                                {slaLabel(ticket)}
                                <Progress
                                    aria-label='Response time used'
                                    value={Math.min(100, Math.round((1 - ticket.slaDue / ticket.slaTotal) * 100))}
                                    stroke={4}
                                    className='w-16'
                                />
                            </span>
                        </>
                    )}
                </div>
                <div className='mt-4 flex flex-wrap gap-2'>
                    <PropertyMenu
                        label='Status'
                        value={ticket.status}
                        options={statuses}
                        icon={<i className={statusIcons[ticket.status]} />}
                        renderOption={option => (
                            <>
                                <i className={statusIcons[option]} />
                                {option}
                            </>
                        )}
                        onSelect={status => onUpdate({ status })}
                    />
                    <PropertyMenu
                        label='Priority'
                        value={ticket.priority}
                        options={priorities}
                        icon={<i className={priorityIcons[ticket.priority]} />}
                        className={
                            ticket.priority === 'Urgent'
                                ? 'border-transparent bg-error-container text-on-error-container'
                                : undefined
                        }
                        renderOption={option => (
                            <>
                                <i className={priorityIcons[option]} />
                                {option}
                            </>
                        )}
                        onSelect={priority => onUpdate({ priority })}
                    />
                    <PropertyMenu
                        label='Assignee'
                        value={ticket.assignee}
                        options={assignees}
                        icon={
                            ticket.assignee === 'Unassigned' ? (
                                <i className='icon-[material-symbols--person-add-outline-rounded]' />
                            ) : (
                                <PersonAvatar name={ticket.assignee} className='size-6 [&_span]:text-[10px]' />
                            )
                        }
                        renderOption={option => (
                            <>
                                {option === 'Unassigned' ? (
                                    <i className='icon-[material-symbols--person-off-outline-rounded]' />
                                ) : (
                                    <PersonAvatar name={option} className='size-5 [&_span]:text-[9px]' />
                                )}
                                {option === me ? `${option} (you)` : option}
                            </>
                        )}
                        onSelect={assignee => onUpdate({ assignee })}
                    />
                    <TagMenu tags={ticket.tags} onChange={tags => onPatch({ tags })} />
                </div>
                {ticket.snoozed && (
                    <div className='mt-4 flex items-center gap-3 rounded-2xl bg-secondary-container py-1 pr-1 pl-4 text-sm text-on-secondary-container'>
                        <i className='icon-[material-symbols--snooze-outline-rounded] size-5' aria-hidden='true' />
                        <span className='flex-1'>Snoozed until {ticket.snoozed}</span>
                        <Button
                            type='button'
                            size='sm'
                            variant='text'
                            onClick={() => onPatch({ snoozed: undefined }, `#${ticket.id} is back in the queue`)}
                        >
                            Unsnooze
                        </Button>
                    </div>
                )}
            </header>
            <div
                ref={threadRef}
                role='log'
                aria-label='Conversation'
                className='flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-4 py-4 @4xl/app:px-6'
            >
                {shown.map((message, index) => (
                    <React.Fragment key={index}>
                        <ThreadMessage message={message} ticket={ticket} />
                        {collapsed > 0 && index === 0 && (
                            <Button
                                type='button'
                                variant='outline'
                                size='sm'
                                className='self-center'
                                onClick={() => setExpanded(true)}
                            >
                                <i className='icon-[material-symbols--unfold-more-rounded]' />
                                {collapsed} earlier messages
                            </Button>
                        )}
                    </React.Fragment>
                ))}
                {typing && (
                    <div role='status' className='flex items-center gap-2 px-1 text-sm text-on-surface-variant'>
                        <Loading className='size-8' />
                        {firstName(ticket.customer.name)} is typing…
                    </div>
                )}
            </div>
            <Composer
                ticket={ticket}
                draft={draft}
                mode={composerMode}
                textareaRef={textareaRef}
                onMode={onComposerMode}
                onDraft={onDraft}
                onSend={onSend}
            />
            <EscalateDialog
                ticket={ticket}
                open={escalating}
                onOpenChange={setEscalating}
                onEscalate={input => {
                    setEscalating(false)
                    onEscalate(input)
                }}
            />
        </div>
    )
}

/* ------------------------------------ Shell ----------------------------------- */

export default function SupportInboxBlock() {
    const [tickets, setTickets] = React.useState(initialTickets)
    const [queue, setQueue] = React.useState<Queue>('Open')
    const [filters, setFilters] = React.useState<QuickFilter[]>([])
    const [sort, setSort] = React.useState<Sort>('Newest')
    const [activeId, setActiveId] = React.useState<number>()
    const [showThread, setShowThread] = React.useState(false)
    const [checked, setChecked] = React.useState<number[]>([])
    const [drafts, setDrafts] = React.useState<Record<number, Draft>>({})
    const [composerMode, setComposerMode] = React.useState<ComposerMode>('reply')
    const [typing, setTyping] = React.useState<number[]>([])
    const [presence, setPresence] = React.useState<Presence>('Available')
    const [shortcutsOpen, setShortcutsOpen] = React.useState(false)
    const textareaRef = React.useRef<HTMLTextAreaElement>(null)
    const timers = React.useRef<number[]>([])
    const clock = React.useRef(NOW)
    const activeRef = React.useRef<number>(undefined)

    const visible = tickets
        .filter(ticket => inQueue(ticket, queue) && matchesFilters(ticket, filters))
        .sort(compareTickets(sort))
    const active = visible.find(ticket => ticket.id === activeId) ?? visible[0]

    React.useEffect(() => {
        activeRef.current = active?.id
    })
    React.useEffect(() => () => timers.current.forEach(window.clearTimeout), [])

    function stamp() {
        clock.current += 1
        return clock.current
    }

    function event(body: string): Message {
        return { kind: 'event', author: me, time: 'Just now', body }
    }

    function changeQueue(next: Queue) {
        setQueue(next)
        setFilters([])
        setChecked([])
        setActiveId(undefined)
        setShowThread(false)
    }

    function patchTicket(id: number, patch: Partial<Ticket>, message?: string) {
        setTickets(current => current.map(item => (item.id === id ? { ...item, ...patch } : item)))
        if (message) toast({ message })
    }

    function openTicket(ticket: Ticket) {
        setActiveId(ticket.id)
        setShowThread(true)
        if (ticket.unread) patchTicket(ticket.id, { unread: false })
    }

    function jumpTo(ticket: Ticket) {
        changeQueue(homeQueue(ticket))
        openTicket(ticket)
    }

    function updateTicket(ticket: Ticket, patch: Partial<TicketFields>) {
        const changes = (Object.keys(patch) as (keyof TicketFields)[]).filter(key => patch[key] !== ticket[key])
        if (!changes.length) return
        const events = changes.map(key =>
            key === 'assignee'
                ? event(
                      patch.assignee === 'Unassigned' ? 'unassigned this ticket' : `assigned this ticket to ${patch.assignee}`,
                  )
                : event(`changed ${key} to ${patch[key]}`),
        )
        const previous = Object.fromEntries(changes.map(key => [key, ticket[key]])) as Partial<TicketFields>
        setTickets(current =>
            current.map(item =>
                item.id === ticket.id
                    ? {
                          ...item,
                          ...patch,
                          snoozed: patch.status === 'Resolved' ? undefined : item.snoozed,
                          messages: [...item.messages, ...events],
                      }
                    : item,
            ),
        )
        if (patch.status && patch.status !== ticket.status) {
            toast({
                message: `#${ticket.id} ${patch.status === 'Resolved' ? 'resolved' : `moved to ${patch.status}`}`,
                action: {
                    label: 'Undo',
                    onClick: () =>
                        setTickets(current =>
                            current.map(item =>
                                item.id === ticket.id
                                    ? {
                                          ...item,
                                          ...previous,
                                          snoozed: ticket.snoozed,
                                          messages: item.messages.filter(message => !events.includes(message)),
                                      }
                                    : item,
                            ),
                        ),
                },
            })
        }
    }

    function writeDraft(id: number, patch: Draft) {
        setDrafts(current => ({ ...current, [id]: { ...current[id], ...patch } }))
    }

    function sendMessage(ticket: Ticket, mode: ComposerMode, body: string, attachments: Attachment[], action: SendAction) {
        const message: Message = {
            kind: mode,
            author: me,
            time: 'Just now',
            body,
            attachments: attachments.length ? attachments : undefined,
        }
        const status: Status | undefined = action === 'waiting' ? 'Waiting' : action === 'resolve' ? 'Resolved' : undefined
        const extra = status && status !== ticket.status ? [event(`changed status to ${status}`)] : []
        const claim = mode === 'reply' && ticket.assignee === 'Unassigned'
        setTickets(current =>
            current.map(item =>
                item.id === ticket.id
                    ? {
                          ...item,
                          status: status ?? item.status,
                          assignee: claim ? me : item.assignee,
                          updatedAt: stamp(),
                          slaDue: mode === 'reply' ? undefined : item.slaDue,
                          messages: [
                              ...item.messages,
                              message,
                              ...(claim ? [event('assigned this ticket to Alex Morgan')] : []),
                              ...extra,
                          ],
                      }
                    : item,
            ),
        )
        writeDraft(ticket.id, mode === 'reply' ? { reply: '', attachments: [] } : { note: '' })
        toast({
            message:
                mode === 'note'
                    ? 'Internal note added'
                    : ticket.status === 'Open' && ticket.slaDue !== undefined
                      ? `Reply sent · SLA ${ticket.slaDue < 0 ? 'missed' : 'met'}`
                      : status
                        ? `Reply sent · ${status.toLowerCase()}`
                        : 'Reply sent',
        })

        // Simulate the customer answering a moment later.
        if (mode === 'reply' && ticket.followUp && action !== 'resolve') {
            const followUp = ticket.followUp
            patchTicket(ticket.id, { followUp: undefined })
            timers.current.push(
                window.setTimeout(() => setTyping(current => [...current, ticket.id]), 1500),
                window.setTimeout(() => {
                    setTyping(current => current.filter(id => id !== ticket.id))
                    setTickets(current =>
                        current.map(item =>
                            item.id === ticket.id
                                ? {
                                      ...item,
                                      status: item.status === 'Waiting' ? 'Open' : item.status,
                                      unread: activeRef.current !== ticket.id,
                                      updatedAt: stamp(),
                                      slaDue: 60,
                                      slaTotal: 60,
                                      messages: [
                                          ...item.messages,
                                          { kind: 'customer', author: item.customer.name, time: 'Just now', body: followUp },
                                      ],
                                  }
                                : item,
                        ),
                    )
                }, 4500),
            )
        }
    }

    function escalate(ticket: Ticket, input: Escalation) {
        const issue = `ENG-${4200 + (ticket.id % 100)}`
        const messages: Message[] = [event(`escalated to engineering as ${issue} (${input.severity}): ${input.summary}`)]
        if (input.notify) {
            messages.push({
                kind: 'reply',
                author: me,
                time: 'Just now',
                body: `Hi ${firstName(ticket.customer.name)}, I’ve escalated this to our engineering team and will update you as soon as I hear back.`,
            })
        }
        setTickets(current =>
            current.map(item =>
                item.id === ticket.id
                    ? {
                          ...item,
                          tags: item.tags.includes('escalated') ? item.tags : [...item.tags, 'escalated'],
                          priority: input.severity === 'S1' ? 'Urgent' : item.priority,
                          updatedAt: stamp(),
                          slaDue: input.notify ? undefined : item.slaDue,
                          messages: [...item.messages, ...messages],
                      }
                    : item,
            ),
        )
        toast({ message: `Created ${issue} and linked it to #${ticket.id}` })
    }

    function bulk(action: BulkAction) {
        const ids = checked
        const patch: Partial<Ticket> = {
            assign: { assignee: me },
            read: { unread: false },
            snooze: { snoozed: 'Tomorrow, 9:00 AM' },
            resolve: { status: 'Resolved', snoozed: undefined },
        }[action] as Partial<Ticket>
        const before = tickets.filter(ticket => ids.includes(ticket.id))
        setTickets(current => current.map(item => (ids.includes(item.id) ? { ...item, ...patch } : item)))
        setChecked([])
        const verb = { assign: 'assigned to you', read: 'marked as read', snooze: 'snoozed', resolve: 'resolved' }[action]
        toast({
            message: `${ids.length} ${ids.length === 1 ? 'ticket' : 'tickets'} ${verb}`,
            action: {
                label: 'Undo',
                onClick: () =>
                    setTickets(current => current.map(item => before.find(original => original.id === item.id) ?? item)),
            },
        })
    }

    function handleShortcut(event: React.KeyboardEvent) {
        const target = event.target as HTMLElement
        if (event.metaKey || event.ctrlKey || event.altKey) return
        if (target.closest('input, textarea, [role=menu], [role=dialog], [contenteditable=true]')) return
        const key = event.key.toLowerCase()
        const index = active ? visible.indexOf(active) : -1
        if (key === 'j' || key === 'k') {
            const next = visible[Math.min(visible.length - 1, Math.max(0, index + (key === 'j' ? 1 : -1)))]
            if (next) openTicket(next)
        } else if (event.key === '?') setShortcutsOpen(true)
        else if (!active) return
        else if (key === 'r' || key === 'n') {
            setComposerMode(key === 'r' ? 'reply' : 'note')
            setShowThread(true)
            requestAnimationFrame(() => textareaRef.current?.focus())
        } else if (key === 's') patchTicket(active.id, { starred: !active.starred })
        else if (key === 'u') patchTicket(active.id, { unread: true }, `#${active.id} marked as unread`)
        else if (key === 'e' && active.status !== 'Resolved') updateTicket(active, { status: 'Resolved' })
        else return
        event.preventDefault()
    }

    return (
        <div
            className='@container/app relative flex h-full w-full gap-3 overflow-hidden bg-surface-container p-3 text-on-surface @lg/app:p-4 @4xl/app:p-5'
            onKeyDown={handleShortcut}
        >
            <h1 className='sr-only'>Support inbox</h1>

            {/* List pane */}
            <section
                aria-label='Tickets'
                className={cn(
                    'min-h-0 min-w-0 flex-1 flex-col @4xl/app:flex @4xl/app:w-96 @4xl/app:flex-none @7xl/app:w-108',
                    showThread ? 'hidden' : 'flex',
                )}
            >
                <div className='relative z-20 flex shrink-0 items-center gap-2'>
                    <InboxSearch tickets={tickets} onSelect={jumpTo} />
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button
                                type='button'
                                aria-label={`Your status: ${presence}`}
                                className='relative grid size-10 shrink-0 cursor-pointer place-items-center rounded-full'
                            >
                                <PersonAvatar name={me} className='size-9' />
                                <span
                                    className={cn(
                                        'absolute right-0 bottom-0 size-3 rounded-full ring-2 ring-surface-container',
                                        presenceColors[presence],
                                    )}
                                />
                            </button>
                        </DropdownMenuTrigger>
                        <MenuContent align='end' className='w-56'>
                            <DropdownMenuGroup>
                                <DropdownMenuLabel>{me}</DropdownMenuLabel>
                                <DropdownMenuRadioGroup value={presence}>
                                    {presences.map(item => (
                                        <DropdownMenuRadioItem
                                            key={item}
                                            value={item}
                                            onSelect={() => {
                                                setPresence(item)
                                                toast({
                                                    message:
                                                        item === 'Available'
                                                            ? 'New tickets will be routed to you'
                                                            : `Auto-assignment paused while you’re ${item.toLowerCase()}`,
                                                })
                                            }}
                                        >
                                            {item}
                                            <span className={cn('ml-auto size-2.5 rounded-full', presenceColors[item])} />
                                        </DropdownMenuRadioItem>
                                    ))}
                                </DropdownMenuRadioGroup>
                            </DropdownMenuGroup>
                            <DropdownMenuGroup>
                                <DropdownMenuItem onSelect={() => setShortcutsOpen(true)}>
                                    <i className='icon-[material-symbols--keyboard-outline-rounded]' />
                                    Keyboard shortcuts
                                    <DropdownMenuShortcut>?</DropdownMenuShortcut>
                                </DropdownMenuItem>
                            </DropdownMenuGroup>
                        </MenuContent>
                    </DropdownMenu>
                </div>

                <Tabs value={queue} onValueChange={value => changeQueue(value as Queue)} className='mt-3 shrink-0'>
                    <TabsList variant='secondary' aria-label='Queues'>
                        {queues.map(item => (
                            <TabsTrigger key={item} value={item}>
                                {item}
                                <span className='hidden min-w-5 rounded-full bg-surface-container-highest px-1.5 text-[11px] leading-5 text-on-surface-variant @md/app:inline'>
                                    {tickets.filter(ticket => inQueue(ticket, item)).length}
                                </span>
                            </TabsTrigger>
                        ))}
                    </TabsList>
                </Tabs>

                <div className='flex h-16 shrink-0 items-center gap-2'>
                    {checked.length > 0 ? (
                        <BulkToolbar
                            count={checked.length}
                            total={visible.length}
                            onSelectAll={all => setChecked(all ? visible.map(ticket => ticket.id) : [])}
                            onClear={() => setChecked([])}
                            onAction={bulk}
                        />
                    ) : (
                        <>
                            <div
                                role='group'
                                aria-label='Quick filters'
                                className='flex min-w-0 flex-1 gap-2 overflow-x-auto py-2 [scrollbar-width:none]'
                            >
                                {quickFilters
                                    .filter((item, index) => index < 3 || filters.includes(item))
                                    .map(item => {
                                        const on = filters.includes(item)
                                        return (
                                            <Chip key={item} variant='filter' selected={on} asChild className='shrink-0'>
                                                <button
                                                    type='button'
                                                    aria-pressed={on}
                                                    onClick={() =>
                                                        setFilters(current =>
                                                            on ? current.filter(value => value !== item) : [...current, item],
                                                        )
                                                    }
                                                >
                                                    {item}
                                                </button>
                                            </Chip>
                                        )
                                    })}
                            </div>
                            <IconMenu
                                label='Filter and sort'
                                icon='icon-[material-symbols--tune-rounded]'
                                align='end'
                                className='w-48'
                            >
                                <DropdownMenuGroup>
                                    <DropdownMenuLabel>Show only</DropdownMenuLabel>
                                    {quickFilters.map(item => (
                                        <DropdownMenuCheckboxItem
                                            key={item}
                                            checked={filters.includes(item)}
                                            onSelect={event => event.preventDefault()}
                                            onCheckedChange={on =>
                                                setFilters(current =>
                                                    on ? [...current, item] : current.filter(value => value !== item),
                                                )
                                            }
                                        >
                                            {item}
                                        </DropdownMenuCheckboxItem>
                                    ))}
                                </DropdownMenuGroup>
                                <DropdownMenuGroup>
                                    <DropdownMenuLabel>Sort by</DropdownMenuLabel>
                                    <DropdownMenuRadioGroup value={sort}>
                                        {sorts.map(item => (
                                            <DropdownMenuRadioItem key={item} value={item} onSelect={() => setSort(item)}>
                                                {item}
                                            </DropdownMenuRadioItem>
                                        ))}
                                    </DropdownMenuRadioGroup>
                                </DropdownMenuGroup>
                            </IconMenu>
                        </>
                    )}
                </div>

                <div className='min-h-0 flex-1 overflow-y-auto'>
                    {visible.length > 0 ? (
                        <List variant='segmented' aria-label='Ticket list' className='[--list-item-container:var(--surface)]'>
                            {visible.map(ticket => (
                                <TicketRow
                                    key={ticket.id}
                                    ticket={ticket}
                                    active={ticket.id === active?.id && checked.length === 0}
                                    checked={checked.includes(ticket.id)}
                                    selecting={checked.length > 0}
                                    onOpen={() => openTicket(ticket)}
                                    onCheck={value =>
                                        setChecked(current =>
                                            value ? [...current, ticket.id] : current.filter(id => id !== ticket.id),
                                        )
                                    }
                                    onPatch={(patch, message) => patchTicket(ticket.id, patch, message)}
                                    onUpdate={patch => updateTicket(ticket, patch)}
                                />
                            ))}
                        </List>
                    ) : (
                        <div role='status' className='flex flex-col items-center gap-2 px-6 py-16 text-center'>
                            <i className='icon-[material-symbols--done-all-rounded] size-10 text-outline' aria-hidden='true' />
                            <p className='text-base font-medium'>All caught up</p>
                            <p className='text-sm text-on-surface-variant'>No tickets match this view.</p>
                            {filters.length > 0 && (
                                <Button variant='text' size='sm' onClick={() => setFilters([])}>
                                    Clear filters
                                </Button>
                            )}
                        </div>
                    )}
                </div>
            </section>

            {/* Detail pane */}
            <main
                className={cn(
                    'min-h-0 min-w-0 flex-1 overflow-hidden rounded-[28px] bg-surface @4xl/app:flex',
                    showThread ? 'flex' : 'hidden',
                )}
            >
                {active ? (
                    <TicketDetail
                        key={active.id}
                        ticket={active}
                        tickets={tickets}
                        draft={drafts[active.id] ?? {}}
                        typing={typing.includes(active.id)}
                        composerMode={composerMode}
                        textareaRef={textareaRef}
                        onComposerMode={setComposerMode}
                        onBack={() => setShowThread(false)}
                        onDraft={patch => writeDraft(active.id, patch)}
                        onSend={(mode, body, attachments, action) => sendMessage(active, mode, body, attachments, action)}
                        onPatch={(patch, message) => patchTicket(active.id, patch, message)}
                        onUpdate={patch => updateTicket(active, patch)}
                        onEscalate={input => escalate(active, input)}
                        onOpenTicket={jumpTo}
                    />
                ) : (
                    <div className='m-auto flex flex-col items-center gap-2 p-6 text-center'>
                        <i className='icon-[material-symbols--forum-outline-rounded] size-12 text-outline' aria-hidden='true' />
                        <p className='text-base font-medium'>No conversation selected</p>
                        <p className='text-sm text-on-surface-variant'>Pick a ticket to read the thread.</p>
                    </div>
                )}
            </main>

            {/* Supporting pane */}
            {active && (
                <aside
                    aria-label='Customer details'
                    className='hidden w-80 shrink-0 overflow-y-auto rounded-[28px] bg-surface p-4 @min-[90rem]/app:block'
                >
                    <CustomerPanel ticket={active} tickets={tickets} onOpenTicket={jumpTo} />
                </aside>
            )}

            <ShortcutsDialog open={shortcutsOpen} onOpenChange={setShortcutsOpen} />
        </div>
    )
}
