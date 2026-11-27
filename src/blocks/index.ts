export const categories = [
    {
        name: 'Application',
        icon: 'icon-[material-symbols--space-dashboard-outline-rounded]',
        container: 'bg-primary-container text-on-primary-container',
        accent: 'bg-primary text-on-primary',
    },
    {
        name: 'Patterns',
        icon: 'icon-[material-symbols--table-rounded]',
        container: 'bg-tertiary-container text-on-tertiary-container',
        accent: 'bg-tertiary text-on-tertiary',
    },
] as const

export type BlockCategory = (typeof categories)[number]['name']

export interface Block {
    slug: string
    title: string
    description: string
    category: BlockCategory
    /** Library components the block is built with. */
    components: readonly string[]
    /** Path relative to project root, used to show the source code. */
    file: string
}

export const blocks = [
    {
        slug: 'dashboard',
        title: 'Analytics Dashboard',
        description:
            'A store admin overview with navigation rail, search, KPI summary, goal progress, top products and a filterable order list.',
        category: 'Application',
        components: [
            'Navigation Rail',
            'Navigation Bar',
            'Search',
            'Button Group',
            'Toggle',
            'Button',
            'Dropdown Menu',
            'List',
            'Progress',
            'Card',
            'Chip',
            'Avatar',
            'Badge',
            'Tooltip',
            'Snackbar',
        ],
        file: 'src/blocks/dashboard.tsx',
    },
    {
        slug: 'support-inbox',
        title: 'Support Inbox',
        description:
            'A customer support workspace with queues, SLA tracking, bulk actions, macros, internal notes, escalation, and keyboard shortcuts.',
        category: 'Application',
        components: [
            'Search',
            'Tabs',
            'Chip',
            'List',
            'Checkbox',
            'Toolbar',
            'Context Menu',
            'Dropdown Menu',
            'Card',
            'Button',
            'Button Group',
            'Avatar',
            'Badge',
            'Divider',
            'Progress',
            'Loading',
            'Dialog',
            'Text Field',
            'Radio Group',
            'Switch',
            'Popover',
            'Tooltip',
            'Snackbar',
        ],
        file: 'src/blocks/support-inbox.tsx',
    },
    {
        slug: 'music-player',
        title: 'Music Player',
        description:
            'A local music player with album-art dynamic color, a morphing full-screen player, synced lyrics, a reorderable queue, library browsing, playlists, sleep timer, equalizer and settings.',
        category: 'Application',
        components: [
            'Navigation Rail',
            'Navigation Bar',
            'Search',
            'Carousel',
            'Tabs',
            'List',
            'Card',
            'Chip',
            'Button',
            'Button Group',
            'Toggle',
            'Toolbar',
            'Progress',
            'Slider',
            'Sheet',
            'Dialog',
            'Popover',
            'Dropdown Menu',
            'Context Menu',
            'Text Field',
            'Radio Group',
            'Checkbox',
            'Switch',
            'Avatar',
            'Badge',
            'Divider',
            'Loading',
            'Tooltip',
            'Snackbar',
        ],
        file: 'src/blocks/music-player.tsx',
    },
] as const satisfies readonly Block[]

export type BlockSlug = (typeof blocks)[number]['slug']

export function getBlock(slug: string) {
    return blocks.find(block => block.slug === slug)
}
