import type { ComponentType } from 'react'
import DashboardBlock from './dashboard'

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
    components: string[]
    /** Path relative to project root, used to show the source code. */
    file: string
    component: ComponentType
}

export const blocks: Block[] = [
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
            'Progress',
            'Card',
            'Chip',
            'Avatar',
            'Badge',
            'Divider',
            'Snackbar',
        ],
        file: 'src/blocks/dashboard.tsx',
        component: DashboardBlock,
    },
]

export function getBlock(slug: string) {
    return blocks.find(block => block.slug === slug)
}
