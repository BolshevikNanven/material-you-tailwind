'use client'

/* eslint-disable @next/next/no-img-element */

import * as React from 'react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ButtonGroup } from '@/components/ui/button-group'
import { Card, CardContent } from '@/components/ui/card'
import { Carousel, CarouselItem, CarouselItemLabel } from '@/components/ui/carousel'
import { Checkbox } from '@/components/ui/checkbox'
import { Chip } from '@/components/ui/chip'
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuGroup,
    ContextMenuItem,
    ContextMenuSub,
    ContextMenuSubContent,
    ContextMenuSubTrigger,
    ContextMenuTrigger,
} from '@/components/ui/context-menu'
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
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
    List,
    ListCollapsible,
    ListCollapsibleContent,
    ListCollapsibleIndicator,
    ListCollapsibleTrigger,
    ListItem,
    ListItemContent,
    ListItemDragHandle,
    ListItemLabel,
    ListItemLeading,
    ListItemOverline,
    ListItemSupportingText,
    ListItemTrailing,
    ListItemTrailingText,
} from '@/components/ui/list'
import { Loading } from '@/components/ui/loading'
import { NavigationBar, NavigationBarItem } from '@/components/ui/navigation-bar'
import { NavigationRail, NavigationRailContent, NavigationRailItem } from '@/components/ui/navigation-rail'
import {
    Popover,
    PopoverContent,
    PopoverDescription,
    PopoverHeader,
    PopoverTitle,
    PopoverTrigger,
} from '@/components/ui/popover'
import { Progress } from '@/components/ui/progress'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Search, SearchInput, SearchList, SearchListItem, SearchTrigger } from '@/components/ui/search'
import {
    Sheet,
    SheetBody,
    SheetCloseButton,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet'
import { Slider } from '@/components/ui/slider'
import { toast } from '@/components/ui/snakebar'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { TextField } from '@/components/ui/text-field'
import { Toggle } from '@/components/ui/toggle'
import { Toolbar, ToolbarItem } from '@/components/ui/toolbar'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

/* ------------------------------------ Model ----------------------------------- */

type Album = { id: string; title: string; artist: string; year: number; genre: string; cover: string; hue: number }
type LyricLine = [time: number, text: string]
type Track = {
    id: string
    title: string
    artist: string
    albumId: string
    /** Seconds. */
    duration: number
    plays: number
    /** Days since the song was added to the library. */
    added: number
    format: 'FLAC' | 'MP3' | 'M4A'
    liked?: boolean
    lyrics?: LyricLine[]
}
type Playlist = { id: string; name: string; description: string; trackIds: string[] }

type Tab = 'home' | 'search' | 'library'
type LibraryTab = 'songs' | 'albums' | 'artists' | 'playlists' | 'folders'
type Detail = { kind: 'album' | 'artist' | 'playlist' | 'genre'; id: string } | null
type RepeatMode = 'off' | 'all' | 'one'
type SongSort = 'title' | 'artist' | 'added' | 'duration'
type SongFilter = 'Favorites' | 'Hi-Res' | 'Recently added'
type Device = 'phone' | 'buds' | 'speaker'
type PlayerView = 'cover' | 'lyrics' | 'queue'
type Settings = {
    dynamicColor: boolean
    gapless: boolean
    crossfade: number
    normalize: boolean
    showAlbumArtist: boolean
    folders: Record<string, boolean>
}

const albums: Album[] = [
    {
        id: 'a1',
        title: 'Northern Lights',
        artist: 'Aurora Vale',
        year: 2025,
        genre: 'Ambient',
        cover: '/carousel/mountains.jpg',
        hue: 250,
    },
    {
        id: 'a2',
        title: 'Falling Water',
        artist: 'The Tidewells',
        year: 2024,
        genre: 'Indie Folk',
        cover: '/carousel/waterfall.jpg',
        hue: 160,
    },
    {
        id: 'a3',
        title: 'Aegean Blue',
        artist: 'Mira Solace',
        year: 2026,
        genre: 'Dream Pop',
        cover: '/carousel/santorini.jpg',
        hue: 225,
    },
    {
        id: 'a4',
        title: 'Canal Nights',
        artist: 'Velvet Static',
        year: 2023,
        genre: 'Synthwave',
        cover: '/carousel/canals.jpg',
        hue: 35,
    },
    {
        id: 'a5',
        title: 'Golden Hour',
        artist: 'Mira Solace',
        year: 2024,
        genre: 'Dream Pop',
        cover: '/carousel/sunset.jpg',
        hue: 55,
    },
    {
        id: 'a6',
        title: 'Salt & Shore',
        artist: 'The Tidewells',
        year: 2026,
        genre: 'Indie Folk',
        cover: '/carousel/coastline.jpg',
        hue: 195,
    },
    {
        id: 'a7',
        title: 'After Midnight',
        artist: 'Velvet Static',
        year: 2025,
        genre: 'Synthwave',
        cover: '/carousel/streets.jpg',
        hue: 320,
    },
    {
        id: 'a8',
        title: 'Ember Season',
        artist: 'Pine & Ember',
        year: 2025,
        genre: 'Acoustic',
        cover: '/carousel/cabin.jpg',
        hue: 100,
    },
]

const albumById = new Map(albums.map(album => [album.id, album]))
const artistNames = [...new Set(albums.map(album => album.artist))]
const genres = [...new Set(albums.map(album => album.genre))]

const lyrics: Record<string, LyricLine[]> = {
    'a5-1': [
        [0, '♪'],
        [9, 'Light spills over the parking lot'],
        [16, 'Turning every window into gold'],
        [23, 'You said stay a minute, then we stayed for hours'],
        [31, 'Counting airplanes as they fold'],
        [38, 'Into the orange of the evening'],
        [45, 'Nothing here is meant to hold'],
        [54, 'So let it burn slow, let it burn slow'],
        [61, 'Golden hour, don’t you go'],
        [68, 'Every shadow getting longer'],
        [75, 'Every second moving slow'],
        [84, '♪'],
        [98, 'Your hand out the passenger window'],
        [105, 'Catching wind like it’s a wave'],
        [112, 'We were never good at leaving'],
        [119, 'We were better when we stayed'],
        [128, 'So let it burn slow, let it burn slow'],
        [135, 'Golden hour, don’t you go'],
        [142, 'If the sun forgets to set tonight'],
        [149, 'I won’t be the one to know'],
        [160, '♪'],
        [182, 'Let it burn slow'],
        [190, 'Golden hour, don’t you go'],
    ],
    'a7-1': [
        [0, '♪'],
        [12, 'City hums in a minor key'],
        [18, 'Every streetlight blinking just for me'],
        [25, 'Radio static, half a song'],
        [31, 'Singing the parts that I get wrong'],
        [38, 'After midnight, after midnight'],
        [44, 'Everything’s electric, nothing’s quite right'],
        [51, 'Chrome and rain on the boulevard'],
        [57, 'I keep driving till I find where you are'],
        [66, '♪'],
        [82, 'Taxi signs in a violet haze'],
        [88, 'Clocks forget how to count the days'],
        [95, 'You’re a rumor in the neon glow'],
        [101, 'A city secret that I used to know'],
        [108, 'After midnight, after midnight'],
        [114, 'Everything’s electric, nothing’s quite right'],
        [121, 'Chrome and rain on the boulevard'],
        [127, 'I keep driving till I find where you are'],
        [138, '♪'],
        [170, 'Till I find where you are'],
    ],
    'a1-1': [
        [0, '♪'],
        [24, 'Follow the one that doesn’t move'],
        [34, 'Over the ice and the open blue'],
        [46, 'When every compass starts to lie'],
        [56, 'Look up, look up, there’s a light'],
        [70, '♪'],
        [104, 'Polaris, hold still for me'],
        [114, 'Polaris, I’m lost at sea'],
        [126, 'When the long night tries to stay'],
        [136, 'You’re the one who knows the way'],
        [150, '♪'],
        [198, 'Look up, there’s a light'],
    ],
    'a2-1': [
        [0, '♪'],
        [8, 'Down by the riverbed we carved our names'],
        [15, 'Into the soft clay before the rain'],
        [22, 'Water remembers what we forget'],
        [29, 'Every promise that we haven’t kept'],
        [37, 'Oh, carry me, carry me down'],
        [43, 'Past the old mill and the sleeping town'],
        [50, 'If the current takes me, let it be'],
        [57, 'The riverbed knows the way to the sea'],
        [66, '♪'],
        [88, 'Stones turned smooth from a thousand years'],
        [95, 'Holding the weight of our quiet fears'],
        [102, 'Oh, carry me, carry me down'],
        [108, 'Past the old mill and the sleeping town'],
        [118, '♪'],
        [150, 'The riverbed knows the way'],
    ],
}

const seed: [albumId: string, title: string, duration: number, plays: number, added: number][] = [
    ['a1', 'Polaris', 252, 64, 40],
    ['a1', 'Quiet Glacier', 318, 22, 40],
    ['a1', 'Long Exposure', 276, 31, 40],
    ['a1', 'Magnetic North', 241, 18, 40],
    ['a1', 'Snowfield Static', 365, 9, 40],
    ['a2', 'Riverbed', 198, 88, 120],
    ['a2', 'Moss & Stone', 224, 41, 120],
    ['a2', 'Falling Water', 263, 57, 120],
    ['a2', 'Paper Boats', 187, 33, 120],
    ['a2', 'Undertow', 245, 12, 120],
    ['a3', 'Whitewash', 211, 29, 3],
    ['a3', 'Aegean Blue', 238, 46, 3],
    ['a3', 'Lantern Steps', 202, 15, 3],
    ['a3', 'Salt in Your Hair', 226, 21, 3],
    ['a3', 'Islands Apart', 274, 8, 3],
    ['a4', 'Canal Nights', 255, 37, 210],
    ['a4', 'Neon Gondola', 219, 52, 210],
    ['a4', 'Low Tide City', 243, 19, 210],
    ['a4', 'Bridges', 198, 26, 210],
    ['a4', 'Reflections', 301, 14, 210],
    ['a5', 'Golden Hour', 214, 112, 90],
    ['a5', 'Slow Motion Summer', 232, 74, 90],
    ['a5', 'Paper Sun', 196, 38, 90],
    ['a5', 'Afterglow', 248, 61, 90],
    ['a5', 'Last Light', 283, 27, 90],
    ['a6', 'Salt & Shore', 207, 18, 1],
    ['a6', 'Driftwood', 193, 11, 1],
    ['a6', 'Harbor Lights', 236, 23, 1],
    ['a6', 'Sea Glass', 214, 9, 1],
    ['a6', 'Northbound Ferry', 262, 5, 1],
    ['a7', 'After Midnight', 236, 97, 14],
    ['a7', 'Taillights', 221, 68, 14],
    ['a7', 'Rooftop Radio', 204, 44, 14],
    ['a7', 'Static Hearts', 249, 39, 14],
    ['a7', '4 AM Drive', 312, 30, 14],
    ['a8', 'Kindling', 178, 21, 60],
    ['a8', 'Woodsmoke', 205, 34, 60],
    ['a8', 'First Frost', 229, 16, 60],
    ['a8', 'Hearthside', 241, 25, 60],
    ['a8', 'Ember Season', 266, 48, 60],
]

const formats = ['FLAC', 'MP3', 'M4A'] as const
const likedIds = new Set(['a5-1', 'a7-1', 'a2-1', 'a3-2', 'a7-2', 'a1-1', 'a5-4', 'a4-2'])

const initialTracks: Track[] = seed.map(([albumId, title, duration, plays, added], i) => {
    const n = seed.slice(0, i).filter(row => row[0] === albumId).length + 1
    const id = `${albumId}-${n}`
    return {
        id,
        title,
        artist: albumById.get(albumId)!.artist,
        albumId,
        duration,
        plays,
        added,
        format: formats[i % 3],
        liked: likedIds.has(id),
        lyrics: lyrics[id],
    }
})

/** Songs a library rescan "finds" in the newly enabled folders. */
const scannedTracks: Track[] = [
    {
        id: 'a8-6',
        title: 'Kindling (Live)',
        artist: 'Pine & Ember',
        albumId: 'a8',
        duration: 214,
        plays: 0,
        added: 0,
        format: 'FLAC',
    },
    {
        id: 'a3-6',
        title: 'Whitewash (Demo)',
        artist: 'Mira Solace',
        albumId: 'a3',
        duration: 189,
        plays: 0,
        added: 0,
        format: 'M4A',
    },
    {
        id: 'a7-6',
        title: 'Taillights (Night Drive Mix)',
        artist: 'Velvet Static',
        albumId: 'a7',
        duration: 342,
        plays: 0,
        added: 0,
        format: 'MP3',
    },
]

const initialPlaylists: Playlist[] = [
    {
        id: 'focus',
        name: 'Focus Flow',
        description: 'Ambient textures for deep work',
        trackIds: ['a1-2', 'a1-3', 'a1-5', 'a4-5', 'a1-4', 'a8-3'],
    },
    {
        id: 'road',
        name: 'Road Trip',
        description: 'Windows down, volume up',
        trackIds: ['a5-2', 'a2-3', 'a6-1', 'a7-3', 'a5-1', 'a2-4', 'a6-5'],
    },
    {
        id: 'late',
        name: 'Late Night Drive',
        description: 'Neon, chrome and rain',
        trackIds: ['a7-1', 'a4-1', 'a7-5', 'a4-2', 'a7-4'],
    },
]

const dailyMixIds = ['a5-1', 'a7-1', 'a2-1', 'a3-2', 'a4-2', 'a5-4', 'a7-2', 'a2-3', 'a1-1', 'a8-5']

const devices: { value: Device; label: string; text: string; icon: string }[] = [
    { value: 'phone', label: 'This phone', text: 'Speaker', icon: 'icon-[material-symbols--smartphone-outline]' },
    {
        value: 'buds',
        label: 'Pixel Buds Pro',
        text: 'Bluetooth · 82% battery',
        icon: 'icon-[material-symbols--headphones-outline-rounded]',
    },
    { value: 'speaker', label: 'Living room', text: 'Cast speaker', icon: 'icon-[material-symbols--speaker-outline-rounded]' },
]

const sleepOptions = [
    { value: 'off', label: 'Off' },
    { value: '5', label: '5 minutes' },
    { value: '15', label: '15 minutes' },
    { value: '30', label: '30 minutes' },
    { value: '60', label: '1 hour' },
    { value: 'track', label: 'End of song' },
] as const
type SleepValue = (typeof sleepOptions)[number]['value']

const eqBands = ['60 Hz', '230 Hz', '910 Hz', '3.6 kHz', '14 kHz']
const eqPresets: Record<string, number[]> = {
    Flat: [0, 0, 0, 0, 0],
    'Bass boost': [7, 4, 0, 0, 1],
    Vocal: [-2, 0, 4, 3, 0],
    Electronic: [5, 2, -1, 3, 5],
    Acoustic: [3, 1, 2, 3, 2],
}

const destinations: { value: Tab; label: string; icon: string; activeIcon: string }[] = [
    {
        value: 'home',
        label: 'Home',
        icon: 'icon-[material-symbols--home-outline-rounded]',
        activeIcon: 'icon-[material-symbols--home-rounded]',
    },
    {
        value: 'search',
        label: 'Search',
        icon: 'icon-[material-symbols--search-rounded]',
        activeIcon: 'icon-[material-symbols--search-rounded]',
    },
    {
        value: 'library',
        label: 'Library',
        icon: 'icon-[material-symbols--library-music-outline-rounded]',
        activeIcon: 'icon-[material-symbols--library-music-rounded]',
    },
]

/* ---------------------------------- Helpers ---------------------------------- */

function formatTime(seconds: number) {
    const s = Math.max(0, Math.floor(seconds))
    return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
}

function formatTotal(seconds: number) {
    const minutes = Math.round(seconds / 60)
    return minutes >= 60 ? `${Math.floor(minutes / 60)} h ${minutes % 60} min` : `${minutes} min`
}

function plural(count: number, word: string) {
    return `${count} ${word}${count === 1 ? '' : 's'}`
}

function shuffled<T>(items: T[]) {
    const next = [...items]
    for (let i = next.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[next[i], next[j]] = [next[j], next[i]]
    }
    return next
}

function move<T>(items: T[], from: number, to: number) {
    const next = [...items]
    const [moved] = next.splice(from, 1)
    next.splice(to, 0, moved)
    return next
}

function useElementWidth<T extends HTMLElement>() {
    const ref = React.useRef<T>(null)
    const [width, setWidth] = React.useState(0)
    // Measure before the first paint, so layouts that depend on the width never flash the wrong variant.
    React.useLayoutEffect(() => {
        const element = ref.current
        if (!element) return
        setWidth(element.getBoundingClientRect().width)
        const observer = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width))
        observer.observe(element)
        return () => observer.disconnect()
    }, [])
    return [ref, width] as const
}

/**
 * Tonal palette seeded from the album art hue, like Material You dynamic color.
 * Applied to a wrapper together with `--hue`, it re-tints every color role underneath.
 */
const albumScheme = [
    '[--primary:oklch(0.5_0.13_var(--hue))] [--on-primary:oklch(1_0_0)] [--primary-container:oklch(0.91_0.07_var(--hue))] [--on-primary-container:oklch(0.3_0.09_var(--hue))]',
    '[--secondary:oklch(0.52_0.04_var(--hue))] [--on-secondary:oklch(1_0_0)] [--secondary-container:oklch(0.9_0.04_var(--hue))] [--on-secondary-container:oklch(0.28_0.035_var(--hue))]',
    '[--tertiary-container:oklch(0.9_0.07_calc(var(--hue)_+_70))] [--on-tertiary-container:oklch(0.3_0.08_calc(var(--hue)_+_70))]',
    '[--surface:oklch(0.985_0.006_var(--hue))] [--surface-container-lowest:oklch(1_0_0)] [--surface-container-low:oklch(0.965_0.01_var(--hue))] [--surface-container:oklch(0.95_0.013_var(--hue))] [--surface-container-high:oklch(0.935_0.015_var(--hue))] [--surface-container-highest:oklch(0.92_0.017_var(--hue))]',
    '[--on-surface:oklch(0.22_0.012_var(--hue))] [--on-surface-variant:oklch(0.43_0.02_var(--hue))] [--outline:oklch(0.6_0.02_var(--hue))] [--outline-variant:oklch(0.83_0.02_var(--hue))]',
    'dark:[--primary:oklch(0.82_0.11_var(--hue))] dark:[--on-primary:oklch(0.3_0.09_var(--hue))] dark:[--primary-container:oklch(0.39_0.1_var(--hue))] dark:[--on-primary-container:oklch(0.92_0.06_var(--hue))]',
    'dark:[--secondary:oklch(0.8_0.04_var(--hue))] dark:[--on-secondary:oklch(0.3_0.035_var(--hue))] dark:[--secondary-container:oklch(0.37_0.04_var(--hue))] dark:[--on-secondary-container:oklch(0.91_0.035_var(--hue))]',
    'dark:[--tertiary-container:oklch(0.39_0.08_calc(var(--hue)_+_70))] dark:[--on-tertiary-container:oklch(0.92_0.06_calc(var(--hue)_+_70))]',
    'dark:[--surface:oklch(0.17_0.01_var(--hue))] dark:[--surface-container-lowest:oklch(0.14_0.008_var(--hue))] dark:[--surface-container-low:oklch(0.2_0.012_var(--hue))] dark:[--surface-container:oklch(0.215_0.014_var(--hue))] dark:[--surface-container-high:oklch(0.255_0.016_var(--hue))] dark:[--surface-container-highest:oklch(0.295_0.018_var(--hue))]',
    'dark:[--on-surface:oklch(0.92_0.01_var(--hue))] dark:[--on-surface-variant:oklch(0.8_0.02_var(--hue))] dark:[--outline:oklch(0.62_0.02_var(--hue))] dark:[--outline-variant:oklch(0.38_0.02_var(--hue))]',
].join(' ')

function schemeFor(hue: number | null) {
    if (hue === null) return { className: '', style: undefined }
    return { className: albumScheme, style: { '--hue': hue } as React.CSSProperties }
}

/* ----------------------------------- Player ----------------------------------- */

type PlayerState = {
    queue: string[]
    /** Queue order before shuffle was turned on. */
    original: string[] | null
    index: number
    position: number
    playing: boolean
    repeat: RepeatMode
    source: string
    sleep: { remaining: number | null; endOfTrack: boolean }
    /** Bumped when the sleep timer pauses playback, so the UI can announce it. */
    slept: number
}

type PlayerAction =
    | { type: 'play'; ids: string[]; index?: number; source: string; shuffle?: boolean }
    | { type: 'toggle' }
    | { type: 'seek'; position: number }
    | { type: 'next' }
    | { type: 'prev' }
    | { type: 'tick'; duration: number }
    | { type: 'jump'; index: number }
    | { type: 'shuffle' }
    | { type: 'repeat' }
    | { type: 'reorder'; from: number; to: number }
    | { type: 'remove'; index: number }
    | { type: 'enqueue'; ids: string[]; next: boolean }
    | { type: 'clear' }
    | { type: 'sleep'; value: SleepValue }

const initialPlayer: PlayerState = {
    queue: dailyMixIds,
    original: null,
    index: 0,
    position: 47,
    playing: false,
    repeat: 'off',
    source: 'Daily Mix',
    sleep: { remaining: null, endOfTrack: false },
    slept: 0,
}

function advance(state: PlayerState, auto: boolean): PlayerState {
    const last = state.index >= state.queue.length - 1
    if (!last) return { ...state, index: state.index + 1, position: 0 }
    if (state.repeat === 'all' || !auto) return { ...state, index: 0, position: 0 }
    return { ...state, position: 0, playing: false }
}

function playerReducer(state: PlayerState, action: PlayerAction): PlayerState {
    switch (action.type) {
        case 'play': {
            const start = action.index ?? 0
            if (action.shuffle) {
                const ids = shuffled(action.ids)
                return {
                    ...state,
                    queue: ids,
                    original: action.ids,
                    index: 0,
                    position: 0,
                    playing: true,
                    source: action.source,
                }
            }
            return {
                ...state,
                queue: action.ids,
                original: null,
                index: start,
                position: 0,
                playing: true,
                source: action.source,
            }
        }
        case 'toggle':
            return { ...state, playing: !state.playing }
        case 'seek':
            return { ...state, position: action.position }
        case 'next':
            return advance(state, false)
        case 'prev':
            if (state.position > 3 || state.index === 0) return { ...state, position: 0 }
            return { ...state, index: state.index - 1, position: 0 }
        case 'jump':
            return { ...state, index: action.index, position: 0, playing: true }
        case 'tick': {
            let next = state
            if (state.sleep.remaining !== null) {
                const remaining = state.sleep.remaining - 1
                if (remaining <= 0) {
                    return { ...state, playing: false, sleep: { remaining: null, endOfTrack: false }, slept: state.slept + 1 }
                }
                next = { ...state, sleep: { ...state.sleep, remaining } }
            }
            if (next.position + 1 < action.duration) return { ...next, position: next.position + 1 }
            if (next.repeat === 'one') return { ...next, position: 0 }
            if (next.sleep.endOfTrack) {
                return {
                    ...advance(next, true),
                    playing: false,
                    sleep: { remaining: null, endOfTrack: false },
                    slept: next.slept + 1,
                }
            }
            return advance(next, true)
        }
        case 'shuffle': {
            const current = state.queue[state.index]
            if (state.original) {
                const original = state.original
                const restored = [
                    ...original.filter(id => state.queue.includes(id)),
                    ...state.queue.filter(id => !original.includes(id)),
                ]
                return { ...state, queue: restored, original: null, index: Math.max(0, restored.indexOf(current)) }
            }
            const rest = shuffled(state.queue.filter((_, i) => i !== state.index))
            return { ...state, queue: [current, ...rest], original: state.queue, index: 0 }
        }
        case 'repeat':
            return { ...state, repeat: state.repeat === 'off' ? 'all' : state.repeat === 'all' ? 'one' : 'off' }
        case 'reorder': {
            const { from, to } = action
            let index = state.index
            if (from === index) index = to
            else if (from < index && to >= index) index -= 1
            else if (from > index && to <= index) index += 1
            return { ...state, queue: move(state.queue, from, to), index }
        }
        case 'remove': {
            if (action.index === state.index) return state
            const queue = state.queue.filter((_, i) => i !== action.index)
            return { ...state, queue, index: action.index < state.index ? state.index - 1 : state.index }
        }
        case 'enqueue': {
            const at = action.next ? state.index + 1 : state.queue.length
            const queue = [...state.queue.slice(0, at), ...action.ids, ...state.queue.slice(at)]
            return { ...state, queue }
        }
        case 'clear':
            return { ...state, queue: [state.queue[state.index]], original: null, index: 0 }
        case 'sleep':
            if (action.value === 'off') return { ...state, sleep: { remaining: null, endOfTrack: false } }
            if (action.value === 'track') return { ...state, sleep: { remaining: null, endOfTrack: true } }
            return { ...state, sleep: { remaining: Number(action.value) * 60, endOfTrack: false } }
    }
}

/* ---------------------------------- Context ---------------------------------- */

type MusicContextValue = {
    tracks: Track[]
    trackById: Map<string, Track>
    playlists: Playlist[]
    player: PlayerState
    current: Track
    shuffle: boolean
    settings: Settings
    scheme: { className: string; style: React.CSSProperties | undefined }
    dispatch: React.Dispatch<PlayerAction>
    playTracks: (ids: string[], options: { index?: number; source: string; shuffle?: boolean }) => void
    enqueue: (ids: string[], next: boolean) => void
    toggleLike: (id: string) => void
    addToPlaylist: (playlistId: string, ids: string[]) => void
    openDetail: (detail: Detail) => void
    requestNewPlaylist: (ids?: string[]) => void
    requestEditTags: (id: string) => void
    device: Device
    setDevice: (device: Device) => void
    volume: number
    setVolume: (volume: number) => void
}

const MusicContext = React.createContext<MusicContextValue | null>(null)

function useMusic() {
    const context = React.useContext(MusicContext)
    if (!context) throw new Error('useMusic must be used within the music player block')
    return context
}

/** Portaled layers (menus, popovers, dialogs) render outside the block, so they re-apply the album tint. */
function useTint(className?: string) {
    const { scheme } = useMusic()
    return { className: cn(className, scheme.className), style: scheme.style }
}

/* ---------------------------------- Pieces ---------------------------------- */

function IconButton({ label, children, className, ...props }: React.ComponentProps<typeof Button> & { label: string }) {
    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <Button variant='text' icon aria-label={label} className={cn('text-on-surface-variant', className)} {...props}>
                    {children}
                </Button>
            </TooltipTrigger>
            <TooltipContent>{label}</TooltipContent>
        </Tooltip>
    )
}

function Cover({ album, className }: { album: Album; className?: string }) {
    return (
        <img
            src={album.cover}
            alt=''
            draggable={false}
            className={cn('aspect-square shrink-0 bg-surface-container-highest object-cover', className)}
        />
    )
}

/** A 2×2 grid of covers, used for playlists and mixes. */
function Mosaic({ ids, className }: { ids: string[]; className?: string }) {
    const { trackById } = useMusic()
    const covers = [...new Set(ids.map(id => trackById.get(id)?.albumId).filter(Boolean) as string[])]
    if (covers.length === 0) {
        return (
            <div
                className={cn(
                    'flex aspect-square shrink-0 items-center justify-center bg-secondary-container text-on-secondary-container',
                    className,
                )}
            >
                <i className='icon-[material-symbols--queue-music-rounded] size-1/2' />
            </div>
        )
    }
    if (covers.length < 4) return <Cover album={albumById.get(covers[0])!} className={className} />
    return (
        <div className={cn('grid aspect-square shrink-0 grid-cols-2 overflow-hidden', className)}>
            {covers.slice(0, 4).map(id => (
                <Cover key={id} album={albumById.get(id)!} className='size-full' />
            ))}
        </div>
    )
}

function NowPlayingBars({ playing }: { playing: boolean }) {
    return (
        <span aria-hidden className='flex h-4 items-end gap-0.5'>
            {[0.9, 0.5, 0.75].map((height, i) => (
                <span
                    key={i}
                    className={cn('w-1 rounded-full bg-primary', playing && 'animate-pulse')}
                    style={{ height: `${height * 100}%`, animationDelay: `${i * 180}ms`, animationDuration: '900ms' }}
                />
            ))}
        </span>
    )
}

// Dropdown and context menus share the same items, rendered with either set of primitives.
const menuParts = {
    dropdown: {
        Group: DropdownMenuGroup,
        Item: DropdownMenuItem,
        Sub: DropdownMenuSub,
        SubTrigger: DropdownMenuSubTrigger,
        SubContent: DropdownMenuSubContent,
    },
    context: {
        Group: ContextMenuGroup,
        Item: ContextMenuItem,
        Sub: ContextMenuSub,
        SubTrigger: ContextMenuSubTrigger,
        SubContent: ContextMenuSubContent,
    },
} satisfies Record<string, Record<string, React.ElementType>>

function TrackMenuItems({ track, kind, onRemove }: { track: Track; kind: keyof typeof menuParts; onRemove?: () => void }) {
    const { enqueue, toggleLike, playlists, addToPlaylist, openDetail, requestNewPlaylist, requestEditTags } = useMusic()
    const { Group, Item, Sub, SubTrigger, SubContent } = menuParts[kind] as Record<string, React.ElementType>
    const album = albumById.get(track.albumId)!

    return (
        <>
            <Group>
                <Item onSelect={() => enqueue([track.id], true)}>
                    <i className='icon-[material-symbols--playlist-play-rounded]' />
                    Play next
                </Item>
                <Item onSelect={() => enqueue([track.id], false)}>
                    <i className='icon-[material-symbols--queue-music-rounded]' />
                    Add to queue
                </Item>
                <Sub>
                    <SubTrigger>
                        <i className='icon-[material-symbols--playlist-add-rounded]' />
                        <span className='ml-2'>Add to playlist</span>
                    </SubTrigger>
                    <SubContent {...useTint('w-48')}>
                        <Group>
                            <Item onSelect={() => requestNewPlaylist([track.id])}>
                                <i className='icon-[material-symbols--add-rounded]' />
                                New playlist…
                            </Item>
                        </Group>
                        <Group>
                            {playlists.map(playlist => (
                                <Item key={playlist.id} onSelect={() => addToPlaylist(playlist.id, [track.id])}>
                                    <i className='icon-[material-symbols--queue-music-rounded]' />
                                    {playlist.name}
                                </Item>
                            ))}
                        </Group>
                    </SubContent>
                </Sub>
                <Item onSelect={() => toggleLike(track.id)}>
                    <i
                        className={
                            track.liked
                                ? 'icon-[material-symbols--heart-minus-outline-rounded]'
                                : 'icon-[material-symbols--favorite-outline-rounded]'
                        }
                    />
                    {track.liked ? 'Remove from favorites' : 'Add to favorites'}
                </Item>
            </Group>
            <Group>
                <Item onSelect={() => openDetail({ kind: 'album', id: album.id })}>
                    <i className='icon-[material-symbols--album-outline]' />
                    Go to album
                </Item>
                <Item onSelect={() => openDetail({ kind: 'artist', id: album.artist })}>
                    <i className='icon-[material-symbols--artist-outline-rounded]' />
                    Go to artist
                </Item>
                <Item onSelect={() => requestEditTags(track.id)}>
                    <i className='icon-[material-symbols--edit-outline-rounded]' />
                    Edit tags
                </Item>
                {onRemove && (
                    <Item onSelect={onRemove}>
                        <i className='icon-[material-symbols--playlist-remove-rounded]' />
                        Remove from playlist
                    </Item>
                )}
            </Group>
        </>
    )
}

function TrackMenuButton({ track, onRemove }: { track: Track; onRemove?: () => void }) {
    return (
        <DropdownMenu>
            <Tooltip>
                <TooltipTrigger asChild>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant='text'
                            icon
                            size='sm'
                            className='text-on-surface-variant'
                            aria-label={`More options for ${track.title}`}
                            onClick={event => event.stopPropagation()}
                            onKeyDown={event => event.stopPropagation()}
                        >
                            <i className='icon-[material-symbols--more-vert]' />
                        </Button>
                    </DropdownMenuTrigger>
                </TooltipTrigger>
                <TooltipContent>More options</TooltipContent>
            </Tooltip>
            <DropdownMenuContent compact align='end' {...useTint('w-56')}>
                <TrackMenuItems track={track} kind='dropdown' onRemove={onRemove} />
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

function TrackRow({
    track,
    number,
    onPlay,
    onRemove,
    showAlbum = true,
    trailing,
}: {
    track: Track
    /** Shows the track number instead of the cover, as on album pages. */
    number?: number
    onPlay: () => void
    onRemove?: () => void
    showAlbum?: boolean
    trailing?: React.ReactNode
}) {
    const { current, player } = useMusic()
    const album = albumById.get(track.albumId)!
    const active = current.id === track.id

    return (
        <ContextMenu>
            <ContextMenuTrigger asChild>
                <div className='contents'>
                    <ListItem selected={active} onClick={onPlay} className='gap-4 pr-2'>
                        <ListItemLeading className={cn(number !== undefined ? 'w-6' : 'size-12')}>
                            {number !== undefined ? (
                                active ? (
                                    <NowPlayingBars playing={player.playing} />
                                ) : (
                                    <span className='text-sm tabular-nums'>{number}</span>
                                )
                            ) : (
                                <>
                                    <Cover album={album} className='size-12 rounded-xl' />
                                    {active && (
                                        <span className='absolute inset-0 flex items-center justify-center rounded-xl bg-scrim/40'>
                                            <NowPlayingBars playing={player.playing} />
                                        </span>
                                    )}
                                </>
                            )}
                        </ListItemLeading>
                        <ListItemContent>
                            <ListItemLabel className={cn(active && 'font-medium')}>{track.title}</ListItemLabel>
                            <ListItemSupportingText>
                                {track.format === 'FLAC' && (
                                    <span className='mr-1.5 inline-flex h-4 items-center rounded-sm bg-on-surface/10 px-1 align-[1px] text-[10px] leading-none font-medium'>
                                        HI-RES
                                    </span>
                                )}
                                {track.artist}
                                {showAlbum && ` · ${album.title}`}
                            </ListItemSupportingText>
                        </ListItemContent>
                        <ListItemTrailing className='gap-1'>
                            {track.liked && (
                                <i
                                    aria-label='Favorite'
                                    className='icon-[material-symbols--favorite-rounded] size-4 text-primary'
                                />
                            )}
                            <ListItemTrailingText className='hidden w-10 text-right tabular-nums @md:inline'>
                                {formatTime(track.duration)}
                            </ListItemTrailingText>
                            {trailing}
                            <TrackMenuButton track={track} onRemove={onRemove} />
                        </ListItemTrailing>
                    </ListItem>
                </div>
            </ContextMenuTrigger>
            <ContextMenuContent compact {...useTint('w-56')}>
                <TrackMenuItems track={track} kind='context' onRemove={onRemove} />
            </ContextMenuContent>
        </ContextMenu>
    )
}

function SectionHeader({ title, action }: { title: string; action?: React.ReactNode }) {
    return (
        <div className='mb-3 flex min-h-10 items-center gap-2'>
            <h2 className='mr-auto text-[22px] leading-7'>{title}</h2>
            {action}
        </div>
    )
}

/* -------------------------------- Seekbar & controls -------------------------------- */

function Seekbar({ className }: { className?: string }) {
    const { player, current, dispatch } = useMusic()
    const [scrubbing, setScrubbing] = React.useState(false)
    const { position } = player
    const { duration } = current

    return (
        <div className={cn('flex flex-col gap-1.5', className)}>
            {/* Fixed to the wave height, so switching between flat and wavy never shifts the layout */}
            <div className='relative flex h-[11px] items-center'>
                <Progress value={(position / duration) * 100} wave={player.playing && !scrubbing} stroke={5} />
                <input
                    type='range'
                    min={0}
                    max={duration}
                    step={1}
                    value={position}
                    aria-label='Seek'
                    aria-valuetext={`${formatTime(position)} of ${formatTime(duration)}`}
                    onChange={event => dispatch({ type: 'seek', position: Number(event.target.value) })}
                    onPointerDown={() => setScrubbing(true)}
                    onPointerUp={() => setScrubbing(false)}
                    onBlur={() => setScrubbing(false)}
                    data-sheet-no-drag
                    className='absolute inset-x-0 -inset-y-3 h-auto w-full cursor-pointer opacity-0'
                />
            </div>
            <div className='flex justify-between text-xs text-on-surface-variant tabular-nums'>
                <span>{formatTime(position)}</span>
                <span>-{formatTime(duration - position)}</span>
            </div>
        </div>
    )
}

/** Transparent until pressed, then a tonal container. */
const quietToggle = 'bg-transparent data-[state=on]:bg-secondary-container data-[state=on]:text-on-secondary-container'

/**
 * Tooltip triggers write their own `data-state` onto the child, which would hide the toggle's pressed state,
 * so the tooltip wraps a span around the toggle instead.
 */
function TooltipToggle({ label, ...props }: React.ComponentProps<typeof Toggle> & { label: string }) {
    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <span className='inline-flex'>
                    <Toggle icon {...props} />
                </span>
            </TooltipTrigger>
            <TooltipContent>{label}</TooltipContent>
        </Tooltip>
    )
}

function TransportControls({ size = 'lg' }: { size?: 'md' | 'lg' }) {
    const { player, shuffle, dispatch } = useMusic()
    const repeatLabel = player.repeat === 'off' ? 'Repeat off' : player.repeat === 'all' ? 'Repeat all' : 'Repeat one'

    return (
        <div className='flex items-center justify-between gap-2'>
            <TooltipToggle
                label={shuffle ? 'Shuffle on' : 'Shuffle off'}
                size='sm'
                pressed={shuffle}
                onPressedChange={() => dispatch({ type: 'shuffle' })}
                aria-label='Shuffle'
                className={quietToggle}
            >
                <i className='icon-[material-symbols--shuffle-rounded]' />
            </TooltipToggle>

            <ButtonGroup className='items-center'>
                <Button
                    variant='tonal'
                    size={size}
                    icon
                    square
                    aria-label='Previous'
                    className={size === 'lg' ? 'w-16' : undefined}
                    onClick={() => dispatch({ type: 'prev' })}
                >
                    <i className='icon-[material-symbols--skip-previous-rounded]' />
                </Button>
                <Button
                    size={size}
                    square={player.playing}
                    aria-label={player.playing ? 'Pause' : 'Play'}
                    className={cn('transition-[border-radius,width]', size === 'lg' ? 'w-24' : 'w-18')}
                    onClick={() => dispatch({ type: 'toggle' })}
                >
                    <i
                        className={cn(
                            player.playing
                                ? 'icon-[material-symbols--pause-rounded]'
                                : 'icon-[material-symbols--play-arrow-rounded]',
                            size === 'lg' ? 'size-8!' : 'size-6!',
                        )}
                    />
                </Button>
                <Button
                    variant='tonal'
                    size={size}
                    icon
                    square
                    aria-label='Next'
                    className={size === 'lg' ? 'w-16' : undefined}
                    onClick={() => dispatch({ type: 'next' })}
                >
                    <i className='icon-[material-symbols--skip-next-rounded]' />
                </Button>
            </ButtonGroup>

            <TooltipToggle
                label={repeatLabel}
                size='sm'
                pressed={player.repeat !== 'off'}
                onPressedChange={() => dispatch({ type: 'repeat' })}
                aria-label={repeatLabel}
                className={quietToggle}
            >
                <i
                    className={
                        player.repeat === 'one'
                            ? 'icon-[material-symbols--repeat-one-rounded]'
                            : 'icon-[material-symbols--repeat-rounded]'
                    }
                />
            </TooltipToggle>
        </div>
    )
}

function LikeToggle({ track }: { track: Track }) {
    const { toggleLike } = useMusic()
    const label = track.liked ? 'Remove from favorites' : 'Add to favorites'
    return (
        <TooltipToggle
            label={label}
            variant='tonal'
            pressed={!!track.liked}
            onPressedChange={() => toggleLike(track.id)}
            aria-label={label}
        >
            <i
                className={
                    track.liked
                        ? 'icon-[material-symbols--favorite-rounded]'
                        : 'icon-[material-symbols--favorite-outline-rounded]'
                }
            />
        </TooltipToggle>
    )
}

function TrackHeading({ size = 'lg', onNavigate }: { size?: 'md' | 'lg'; onNavigate?: () => void }) {
    const { current, openDetail } = useMusic()
    const album = albumById.get(current.albumId)!
    return (
        <div className='flex items-center gap-3'>
            <div className='min-w-0 flex-1'>
                <h2 className={cn('truncate', size === 'lg' ? 'text-[28px] leading-9' : 'text-[22px] leading-7')}>
                    {current.title}
                </h2>
                <p className='truncate text-on-surface-variant'>
                    <button
                        type='button'
                        className='cursor-pointer hover:text-on-surface hover:underline'
                        onClick={() => {
                            openDetail({ kind: 'artist', id: album.artist })
                            onNavigate?.()
                        }}
                    >
                        {current.artist}
                    </button>
                    {' · '}
                    <button
                        type='button'
                        className='cursor-pointer hover:text-on-surface hover:underline'
                        onClick={() => {
                            openDetail({ kind: 'album', id: album.id })
                            onNavigate?.()
                        }}
                    >
                        {album.title}
                    </button>
                </p>
            </div>
            <LikeToggle track={current} />
        </div>
    )
}

/* ----------------------------------- Lyrics ----------------------------------- */

function LyricsView({ className }: { className?: string }) {
    const { current, player, dispatch } = useMusic()
    const containerRef = React.useRef<HTMLDivElement>(null)
    const [searching, setSearching] = React.useState(false)
    const lines = current.lyrics
    const active = lines ? lines.findLastIndex(([time]) => time <= player.position) : -1

    React.useEffect(() => {
        const container = containerRef.current
        const line = container?.children[Math.max(0, active)] as HTMLElement | undefined
        if (!container || !line) return
        container.scrollTo({ top: line.offsetTop - container.clientHeight / 3, behavior: 'smooth' })
    }, [active, current.id])

    React.useEffect(() => setSearching(false), [current.id])

    if (!lines) {
        return (
            <div className={cn('flex flex-col items-center justify-center gap-3 p-6 text-center', className)}>
                <span className='flex size-16 items-center justify-center rounded-3xl bg-secondary-container text-on-secondary-container'>
                    <i className='icon-[material-symbols--lyrics-outline-rounded] size-8' />
                </span>
                <p className='font-medium'>No lyrics for this song</p>
                <p className='max-w-64 text-sm text-on-surface-variant'>
                    Add an .lrc file next to the song, or search the online lyrics database.
                </p>
                {searching ? (
                    <Loading className='size-12' />
                ) : (
                    <Button
                        variant='tonal'
                        size='sm'
                        onClick={() => {
                            setSearching(true)
                            setTimeout(() => {
                                setSearching(false)
                                toast({ message: `No synced lyrics found for “${current.title}”`, closable: true })
                            }, 1400)
                        }}
                    >
                        <i className='icon-[material-symbols--travel-explore-rounded]' />
                        Search online
                    </Button>
                )}
            </div>
        )
    }

    return (
        <div
            ref={containerRef}
            className={cn(
                'relative flex flex-col gap-1 overflow-y-auto [mask-image:linear-gradient(transparent,black_15%,black_85%,transparent)] py-[30%] [scrollbar-width:none]',
                className,
            )}
        >
            {lines.map(([time, text], i) => (
                <button
                    key={time}
                    type='button'
                    onClick={() => dispatch({ type: 'seek', position: time })}
                    className={cn(
                        'origin-left cursor-pointer rounded-2xl px-3 py-2 text-left text-2xl leading-8 font-medium transition-all duration-500 hover:bg-on-surface/8',
                        i === active ? 'scale-100 text-on-surface' : 'scale-95 text-on-surface-variant/50',
                        i < active && 'text-on-surface-variant/70',
                    )}
                >
                    {text}
                </button>
            ))}
        </div>
    )
}

/* ------------------------------------ Queue ------------------------------------ */

function QueueView({ className }: { className?: string }) {
    const { player, trackById, dispatch, current } = useMusic()
    const start = player.index + 1
    const upcoming = player.queue.slice(start)
    const remaining = upcoming.reduce((sum, id) => sum + (trackById.get(id)?.duration ?? 0), 0)
    const currentAlbum = albumById.get(current.albumId)!

    return (
        <div className={cn('flex flex-col gap-4', className)}>
            <div>
                <p className='mb-2 px-1 text-sm font-medium text-on-surface-variant'>Now playing · {player.source}</p>
                <div className='flex items-center gap-4 rounded-2xl bg-secondary-container p-3 text-on-secondary-container'>
                    <Cover album={currentAlbum} className='size-12 rounded-xl' />
                    <div className='min-w-0 flex-1'>
                        <p className='truncate'>{current.title}</p>
                        <p className='truncate text-sm opacity-80'>{current.artist}</p>
                    </div>
                    <NowPlayingBars playing={player.playing} />
                </div>
            </div>
            <div>
                <div className='mb-2 flex items-center gap-2 px-1'>
                    <p className='mr-auto text-sm font-medium text-on-surface-variant'>
                        Up next · {plural(upcoming.length, 'song')}
                        {upcoming.length > 0 && ` · ${formatTotal(remaining)}`}
                    </p>
                    {upcoming.length > 0 && (
                        <Button
                            variant='text'
                            size='sm'
                            onClick={() => {
                                const snapshot = player
                                dispatch({ type: 'clear' })
                                toast({
                                    message: 'Queue cleared',
                                    action: {
                                        label: 'Undo',
                                        onClick: () =>
                                            dispatch({
                                                type: 'play',
                                                ids: snapshot.queue,
                                                index: snapshot.index,
                                                source: snapshot.source,
                                            }),
                                    },
                                })
                            }}
                        >
                            Clear
                        </Button>
                    )}
                </div>
                {upcoming.length === 0 ? (
                    <p className='rounded-2xl bg-surface-container px-4 py-6 text-center text-sm text-on-surface-variant'>
                        Nothing else is queued. Add songs with “Play next”.
                    </p>
                ) : (
                    <List
                        variant='segmented'
                        onReorder={(from, to) => dispatch({ type: 'reorder', from: from + start, to: to + start })}
                    >
                        {upcoming.map((id, i) => {
                            const track = trackById.get(id)!
                            return (
                                <ListItem
                                    key={`${id}-${i + start}`}
                                    onClick={() => dispatch({ type: 'jump', index: i + start })}
                                    className='gap-3 pr-2'
                                >
                                    <ListItemLeading>
                                        <Cover album={albumById.get(track.albumId)!} className='size-10 rounded-lg' />
                                    </ListItemLeading>
                                    <ListItemContent>
                                        <ListItemLabel>{track.title}</ListItemLabel>
                                        <ListItemSupportingText>{track.artist}</ListItemSupportingText>
                                    </ListItemContent>
                                    <ListItemTrailing className='gap-1'>
                                        <Button
                                            variant='text'
                                            icon
                                            size='sm'
                                            aria-label={`Remove ${track.title} from queue`}
                                            className='text-on-surface-variant'
                                            onClick={event => {
                                                event.stopPropagation()
                                                dispatch({ type: 'remove', index: i + start })
                                            }}
                                        >
                                            <i className='icon-[material-symbols--close-rounded]' />
                                        </Button>
                                        <ListItemDragHandle label={`Reorder ${track.title}`} data-sheet-no-drag />
                                    </ListItemTrailing>
                                </ListItem>
                            )
                        })}
                    </List>
                )}
            </div>
        </div>
    )
}

/* ------------------------------- Player tool menus ------------------------------- */

function SleepTimerMenu() {
    const { player, dispatch } = useMusic()
    const value: SleepValue = player.sleep.endOfTrack
        ? 'track'
        : player.sleep.remaining === null
          ? 'off'
          : (sleepOptions.find(o => o.value !== 'off' && o.value !== 'track' && Number(o.value) * 60 >= player.sleep.remaining!)
                ?.value ?? 'off')
    const active = player.sleep.endOfTrack || player.sleep.remaining !== null

    return (
        <DropdownMenu>
            <ToolbarTip label={active ? 'Sleep timer on' : 'Sleep timer'}>
                <ToolbarItem asChild>
                    <DropdownMenuTrigger asChild>
                        {/* Menu triggers own `data-state`, so the active look comes from the variant instead of a Toggle */}
                        <Button icon variant={active ? 'tonal' : 'text'} aria-label='Sleep timer' aria-pressed={active}>
                            <i className='icon-[material-symbols--bedtime-outline-rounded]' />
                        </Button>
                    </DropdownMenuTrigger>
                </ToolbarItem>
            </ToolbarTip>
            <DropdownMenuContent compact side='top' {...useTint('w-52')}>
                <DropdownMenuGroup>
                    <DropdownMenuLabel>Sleep timer</DropdownMenuLabel>
                    <DropdownMenuRadioGroup
                        value={value}
                        onValueChange={next => {
                            dispatch({ type: 'sleep', value: next as SleepValue })
                            const option = sleepOptions.find(o => o.value === next)!
                            toast({
                                message:
                                    next === 'off'
                                        ? 'Sleep timer off'
                                        : next === 'track'
                                          ? 'Playback stops after this song'
                                          : `Playback stops in ${option.label}`,
                            })
                        }}
                    >
                        {sleepOptions.map(option => (
                            <DropdownMenuRadioItem key={option.value} value={option.value}>
                                {option.label}
                            </DropdownMenuRadioItem>
                        ))}
                    </DropdownMenuRadioGroup>
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

function OutputPopover() {
    const { device, setDevice: onDeviceChange, volume, setVolume: onVolumeChange } = useMusic()
    const selected = devices.find(d => d.value === device)!
    return (
        <Popover>
            <ToolbarTip label={`Playing on ${selected.label}`}>
                <ToolbarItem asChild>
                    <PopoverTrigger asChild>
                        <Button
                            icon
                            variant={device !== 'phone' ? 'tonal' : 'text'}
                            aria-label={`Output: ${selected.label}`}
                            aria-pressed={device !== 'phone'}
                        >
                            <i className={selected.icon} />
                        </Button>
                    </PopoverTrigger>
                </ToolbarItem>
            </ToolbarTip>
            <PopoverContent side='top' {...useTint('w-80 gap-4 p-4')}>
                <PopoverHeader>
                    <PopoverTitle className='text-base font-medium'>Play on</PopoverTitle>
                    <PopoverDescription className='text-sm text-on-surface-variant'>
                        Switch where the music plays.
                    </PopoverDescription>
                </PopoverHeader>
                <RadioGroup
                    value={device}
                    onValueChange={value => {
                        onDeviceChange(value as Device)
                        toast({ message: `Connected to ${devices.find(d => d.value === value)!.label}` })
                    }}
                    className='gap-1'
                >
                    {devices.map(item => (
                        <label
                            key={item.value}
                            className={cn(
                                'group/device relative flex cursor-pointer items-center gap-3 rounded-2xl px-3 py-2.5 transition-colors',
                                device === item.value && 'bg-secondary-container text-on-secondary-container',
                            )}
                        >
                            <span className='pointer-events-none absolute inset-0 rounded-[inherit] bg-current opacity-0 transition-opacity group-hover/device:opacity-8' />
                            <i className={cn(item.icon, 'size-6')} />
                            <span className='flex-1'>
                                <span className='block text-sm font-medium'>{item.label}</span>
                                <span className='block text-xs opacity-80'>{item.text}</span>
                            </span>
                            <RadioGroupItem value={item.value} />
                        </label>
                    ))}
                </RadioGroup>
                <Divider />
                <div className='flex flex-col gap-2'>
                    <p className='flex justify-between text-sm'>
                        Volume <span className='text-on-surface-variant tabular-nums'>{volume}%</span>
                    </p>
                    <Slider
                        size='medium'
                        value={[volume]}
                        onValueChange={([value]) => onVolumeChange(value)}
                        aria-label='Volume'
                        icon={
                            <i
                                className={cn(
                                    'size-full',
                                    volume === 0
                                        ? 'icon-[material-symbols--volume-off-outline-rounded]'
                                        : volume < 50
                                          ? 'icon-[material-symbols--volume-down-outline-rounded]'
                                          : 'icon-[material-symbols--volume-up-outline-rounded]',
                                )}
                            />
                        }
                    />
                </div>
            </PopoverContent>
        </Popover>
    )
}

function SleepChip() {
    const { player, dispatch } = useMusic()
    if (player.sleep.remaining === null && !player.sleep.endOfTrack) return null
    return (
        <Chip
            selected
            leadingIcon={<i className='icon-[material-symbols--bedtime-outline-rounded]' />}
            trailingIcon={<i className='icon-[material-symbols--close-rounded]' />}
            className='cursor-pointer tabular-nums'
            onClick={() => dispatch({ type: 'sleep', value: 'off' })}
            role='button'
            aria-label='Cancel sleep timer'
        >
            {player.sleep.endOfTrack ? 'Stops after this song' : `Stops in ${formatTime(player.sleep.remaining!)}`}
        </Chip>
    )
}

/**
 * Tooltip for a toolbar item. A span carries the tooltip trigger so the item keeps its own `data-state`
 * (pressed toggles, open menus) and the toolbar's item styles still reach it.
 */
function ToolbarTip({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <span className='inline-flex'>{children}</span>
            </TooltipTrigger>
            <TooltipContent side='top'>{label}</TooltipContent>
        </Tooltip>
    )
}

function PlayerToolbar({
    lyricsPressed,
    queuePressed,
    onLyrics,
    onQueue,
}: {
    lyricsPressed: boolean
    queuePressed: boolean
    onLyrics: () => void
    onQueue: () => void
}) {
    const { current } = useMusic()
    return (
        <Toolbar compact>
            <ToolbarTip label='Lyrics'>
                <ToolbarItem asChild>
                    <Toggle icon variant='tonal' pressed={lyricsPressed} aria-label='Lyrics' onPressedChange={onLyrics}>
                        <i className='icon-[material-symbols--lyrics-outline-rounded]' />
                    </Toggle>
                </ToolbarItem>
            </ToolbarTip>
            <ToolbarTip label='Queue'>
                <ToolbarItem asChild>
                    <Toggle icon variant='tonal' pressed={queuePressed} aria-label='Queue' onPressedChange={onQueue}>
                        <i className='icon-[material-symbols--queue-music-rounded]' />
                    </Toggle>
                </ToolbarItem>
            </ToolbarTip>
            <SleepTimerMenu />
            <OutputPopover />
            <ToolbarTip label='Share'>
                <ToolbarItem aria-label='Share' onClick={() => toast({ message: `Link to “${current.title}” copied` })}>
                    <i className='icon-[material-symbols--share-outline]' />
                </ToolbarItem>
            </ToolbarTip>
        </Toolbar>
    )
}

/* ---------------------------------- Full player ---------------------------------- */

function FullPlayer({ view, onClose }: { view: PlayerView; onClose: () => void }) {
    const { current, player, scheme } = useMusic()
    const album = albumById.get(current.albumId)!
    const [ref, width] = useElementWidth<HTMLDivElement>()
    const measured = width > 0
    const wide = width >= 768
    const [showLyrics, setShowLyrics] = React.useState(view === 'lyrics')
    const [sideTab, setSideTab] = React.useState<'queue' | 'lyrics'>(view === 'queue' ? 'queue' : 'lyrics')
    const [queueOpen, setQueueOpen] = React.useState(view === 'queue')
    const lyricsPressed = wide ? sideTab === 'lyrics' : showLyrics

    React.useEffect(() => {
        const onKeyDown = (event: KeyboardEvent) => {
            // Leave Escape to any open menu, popover or sheet first.
            const layer = document.querySelector('[data-radix-popper-content-wrapper], [role=dialog][data-state=open]')
            if (event.key === 'Escape' && !event.defaultPrevented && !layer) {
                onClose()
            }
        }
        window.addEventListener('keydown', onKeyDown)
        return () => window.removeEventListener('keydown', onKeyDown)
    }, [onClose])

    return (
        <div
            ref={ref}
            role='region'
            aria-label='Now playing'
            className='absolute inset-0 z-30 flex animate-in flex-col overflow-hidden bg-surface-container text-on-surface duration-300 fade-in slide-in-from-bottom-12'
        >
            {/* Blurred album art wash behind the player */}
            <img
                src={album.cover}
                alt=''
                aria-hidden
                className='pointer-events-none absolute inset-0 -z-0 size-full scale-125 object-cover opacity-25 blur-3xl dark:opacity-20'
            />
            <div className='relative flex min-h-0 flex-1 flex-col'>
                <header className='flex h-16 shrink-0 items-center gap-2 px-2 @3xl/app:px-4'>
                    <IconButton label='Minimize player' onClick={onClose}>
                        <i className='icon-[material-symbols--keyboard-arrow-down-rounded] size-7' />
                    </IconButton>
                    <div className='min-w-0 flex-1 text-center'>
                        <p className='text-xs tracking-wide text-on-surface-variant uppercase'>Playing from</p>
                        <p className='truncate text-sm font-medium'>{player.source}</p>
                    </div>
                    <DropdownMenu>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <DropdownMenuTrigger asChild>
                                    <Button variant='text' icon aria-label='Song options' className='text-on-surface-variant'>
                                        <i className='icon-[material-symbols--more-vert]' />
                                    </Button>
                                </DropdownMenuTrigger>
                            </TooltipTrigger>
                            <TooltipContent>Song options</TooltipContent>
                        </Tooltip>
                        <DropdownMenuContent compact align='end' {...useTint('w-56')}>
                            <TrackMenuItems track={current} kind='dropdown' />
                        </DropdownMenuContent>
                    </DropdownMenu>
                </header>

                <div className='flex min-h-0 flex-1 gap-10 px-6 pb-6 @3xl/app:px-10'>
                    <div className='mx-auto flex min-h-0 w-full max-w-120 flex-1 flex-col gap-5'>
                        <div
                            className='relative flex min-h-0 flex-1 items-center justify-center'
                            style={{ containerType: 'size' }}
                        >
                            {!wide && showLyrics ? (
                                <LyricsView className='size-full' />
                            ) : (
                                <img
                                    key={album.id}
                                    src={album.cover}
                                    alt={`${album.title} cover`}
                                    draggable={false}
                                    className={cn(
                                        'aspect-square size-[min(100cqw,100cqh)] animate-in object-cover shadow-elevation-3 transition-[border-radius,scale] duration-500 zoom-in-95 fade-in',
                                        player.playing ? 'scale-100 rounded-[48px]' : 'scale-[0.94] rounded-[28px]',
                                    )}
                                />
                            )}
                        </div>
                        <TrackHeading onNavigate={onClose} />
                        <Seekbar />
                        <TransportControls />
                        <div className='flex flex-col items-center gap-3'>
                            <SleepChip />
                            <PlayerToolbar
                                lyricsPressed={lyricsPressed}
                                queuePressed={wide ? sideTab === 'queue' : queueOpen}
                                onLyrics={() => (wide ? setSideTab('lyrics') : setShowLyrics(v => !v))}
                                onQueue={() => (wide ? setSideTab('queue') : setQueueOpen(true))}
                            />
                        </div>
                    </div>

                    {wide && (
                        <Tabs
                            value={sideTab}
                            onValueChange={value => setSideTab(value as 'queue' | 'lyrics')}
                            className='flex min-h-0 w-[min(420px,45%)] shrink-0 flex-col rounded-[28px] bg-surface-container-low/80'
                        >
                            <TabsList className='shrink-0 px-2'>
                                <TabsTrigger value='lyrics'>Lyrics</TabsTrigger>
                                <TabsTrigger value='queue'>Up next</TabsTrigger>
                            </TabsList>
                            <TabsContent value='lyrics' className='min-h-0 flex-1'>
                                <LyricsView className='h-full px-3' />
                            </TabsContent>
                            <TabsContent value='queue' className='min-h-0 flex-1 overflow-y-auto p-4'>
                                <QueueView />
                            </TabsContent>
                        </Tabs>
                    )}
                </div>
            </div>

            <Sheet open={queueOpen && measured && !wide} onOpenChange={setQueueOpen}>
                <SheetContent className={cn('h-[80dvh]', scheme.className)} style={scheme.style}>
                    <SheetHeader>
                        <SheetTitle>Queue</SheetTitle>
                        <SheetCloseButton />
                    </SheetHeader>
                    <SheetDescription className='sr-only'>Reorder or remove upcoming songs</SheetDescription>
                    <SheetBody className='pb-6'>
                        <QueueView />
                    </SheetBody>
                </SheetContent>
            </Sheet>
        </div>
    )
}

/* ---------------------------------- Mini player & pane ---------------------------------- */

function MiniPlayer({ onExpand }: { onExpand: () => void }) {
    const { current, player, dispatch } = useMusic()
    const album = albumById.get(current.albumId)!

    return (
        <div
            role='button'
            tabIndex={0}
            aria-label={`Open player, ${current.title} by ${current.artist}`}
            onClick={onExpand}
            onKeyDown={event => {
                if (event.target === event.currentTarget && (event.key === 'Enter' || event.key === ' ')) {
                    event.preventDefault()
                    onExpand()
                }
            }}
            className='group/mini relative mx-2 mb-2 flex h-16 shrink-0 cursor-pointer items-center gap-3 overflow-hidden rounded-[20px] bg-primary-container pr-2 pl-2 text-on-primary-container shadow-elevation-1 outline-none focus-visible:ring-2 focus-visible:ring-primary @6xl/app:hidden'
        >
            <span className='pointer-events-none absolute inset-0 bg-current opacity-0 transition-opacity group-hover/mini:opacity-8' />
            <Cover
                album={album}
                className={cn('size-12 transition-[border-radius]', player.playing ? 'rounded-2xl' : 'rounded-lg')}
            />
            <div className='min-w-0 flex-1'>
                <p className='truncate text-sm font-medium'>{current.title}</p>
                <p className='truncate text-xs opacity-80'>{current.artist}</p>
            </div>
            <span className='relative flex size-12 items-center justify-center'>
                <Progress
                    variant='circle'
                    value={(player.position / current.duration) * 100}
                    stroke={4}
                    className='pointer-events-none absolute inset-0 size-12'
                />
                <Button
                    variant='text'
                    icon
                    size='sm'
                    aria-label={player.playing ? 'Pause' : 'Play'}
                    className='text-on-primary-container'
                    onClick={event => {
                        event.stopPropagation()
                        dispatch({ type: 'toggle' })
                    }}
                >
                    <i
                        className={cn(
                            'size-6!',
                            player.playing
                                ? 'icon-[material-symbols--pause-rounded]'
                                : 'icon-[material-symbols--play-arrow-rounded]',
                        )}
                    />
                </Button>
            </span>
            <Button
                variant='text'
                icon
                size='sm'
                aria-label='Next'
                className='text-on-primary-container'
                onClick={event => {
                    event.stopPropagation()
                    dispatch({ type: 'next' })
                }}
            >
                <i className='icon-[material-symbols--skip-next-rounded] size-6!' />
            </Button>
        </div>
    )
}

function NowPlayingPane({ onExpand }: { onExpand: (view: PlayerView) => void }) {
    const { current, player, trackById, dispatch } = useMusic()
    const album = albumById.get(current.albumId)!
    const next = trackById.get(player.queue[player.index + 1] ?? '')

    return (
        <aside className='hidden w-96 shrink-0 flex-col overflow-hidden rounded-t-3xl bg-surface-container-low @6xl/app:flex'>
            <div className='flex items-center gap-2 py-2 pr-2 pl-5'>
                <div className='mr-auto min-w-0'>
                    <h2 className='font-medium'>Now playing</h2>
                    <p className='truncate text-xs text-on-surface-variant'>{player.source}</p>
                </div>
                <IconButton label='Open full player' onClick={() => onExpand('cover')}>
                    <i className='icon-[material-symbols--open-in-full-rounded]' />
                </IconButton>
            </div>
            <div className='flex min-h-0 flex-1 flex-col gap-5 px-5 pb-5'>
                {/* The cover takes whatever height is left, staying square */}
                <div className='flex min-h-40 flex-1 items-center justify-center' style={{ containerType: 'size' }}>
                    <button
                        type='button'
                        aria-label='Open full player'
                        onClick={() => onExpand('cover')}
                        className={cn(
                            'size-[min(100cqw,100cqh)] cursor-pointer overflow-hidden shadow-elevation-2 transition-[border-radius,scale] duration-500',
                            player.playing ? 'scale-100 rounded-[40px]' : 'scale-[0.94] rounded-[28px]',
                        )}
                    >
                        <Cover key={album.id} album={album} className='size-full animate-in duration-500 fade-in' />
                    </button>
                </div>
                <TrackHeading size='md' />
                <Seekbar />
                <TransportControls size='md' />
                <div className='flex flex-col items-center gap-3'>
                    <SleepChip />
                    <PlayerToolbar
                        lyricsPressed={false}
                        queuePressed={false}
                        onLyrics={() => onExpand('lyrics')}
                        onQueue={() => onExpand('queue')}
                    />
                </div>
                {next && (
                    <List variant='segmented'>
                        <ListItem onClick={() => dispatch({ type: 'next' })} className='gap-3 pr-3'>
                            <ListItemLeading>
                                <Cover album={albumById.get(next.albumId)!} className='size-10 rounded-lg' />
                            </ListItemLeading>
                            <ListItemContent>
                                <ListItemOverline>Up next</ListItemOverline>
                                <ListItemLabel>{next.title}</ListItemLabel>
                            </ListItemContent>
                            <ListItemTrailing>
                                <i className='icon-[material-symbols--skip-next-outline-rounded] size-5' />
                            </ListItemTrailing>
                        </ListItem>
                    </List>
                )}
            </div>
        </aside>
    )
}

/* ------------------------------------ Home ------------------------------------ */

function HomeView() {
    const { tracks, trackById, playlists, playTracks, openDetail, player, dispatch } = useMusic()
    const mix = dailyMixIds.filter(id => trackById.has(id))
    const quickPicks = [...tracks].sort((a, b) => b.plays - a.plays).slice(0, 6)
    const recentAlbums = ['a7', 'a3', 'a5', 'a2', 'a6', 'a1', 'a4', 'a8'].map(id => albumById.get(id)!)
    const topArtist = artistNames
        .map(name => ({ name, plays: tracks.filter(t => t.artist === name).reduce((s, t) => s + t.plays, 0) }))
        .sort((a, b) => b.plays - a.plays)[0]
    const topArtistAlbum = albums.find(a => a.artist === topArtist.name)!
    const mixPlaying = player.source === 'Daily Mix'

    return (
        <div className='flex flex-col gap-10'>
            {/* Hero: Daily Mix */}
            <Card variant='filled' className='overflow-hidden rounded-[28px] bg-primary-container text-on-primary-container'>
                <CardContent className='flex flex-col gap-5 p-5 @lg:flex-row @lg:items-center @lg:p-6'>
                    <Mosaic ids={mix} className='size-28 rounded-3xl shadow-elevation-2 @lg:size-36' />
                    <div className='min-w-0 flex-1'>
                        <p className='text-sm font-medium opacity-80'>Made for you · Updated today</p>
                        <h2 className='mt-1 text-[32px] leading-10'>Daily Mix</h2>
                        <p className='mt-1 text-sm opacity-80'>
                            Mira Solace, Velvet Static, The Tidewells and more · {plural(mix.length, 'song')}
                        </p>
                    </div>
                    <div className='flex gap-2'>
                        <Button
                            size='lg'
                            onClick={() =>
                                mixPlaying ? dispatch({ type: 'toggle' }) : playTracks(mix, { source: 'Daily Mix' })
                            }
                            className='bg-primary text-on-primary'
                        >
                            <i
                                className={
                                    mixPlaying && player.playing
                                        ? 'icon-[material-symbols--pause-rounded]'
                                        : 'icon-[material-symbols--play-arrow-rounded]'
                                }
                            />
                            {mixPlaying ? (player.playing ? 'Pause' : 'Resume') : 'Play'}
                        </Button>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    size='lg'
                                    variant='tonal'
                                    icon
                                    aria-label='Shuffle Daily Mix'
                                    onClick={() => playTracks(mix, { source: 'Daily Mix', shuffle: true })}
                                >
                                    <i className='icon-[material-symbols--shuffle-rounded]' />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>Shuffle</TooltipContent>
                        </Tooltip>
                    </div>
                </CardContent>
            </Card>

            <section>
                <SectionHeader title='Jump back in' />
                <Carousel className='-mx-2'>
                    {recentAlbums.map(album => (
                        <CarouselItem key={album.id} onClick={() => openDetail({ kind: 'album', id: album.id })}>
                            <img src={album.cover} alt={album.title} draggable={false} className='size-full object-cover' />
                            <CarouselItemLabel className='text-white [text-shadow:0_1px_4px_rgb(0_0_0/0.6)]'>
                                {album.title}
                                <span className='block text-sm font-normal opacity-90'>{album.artist}</span>
                            </CarouselItemLabel>
                        </CarouselItem>
                    ))}
                </Carousel>
            </section>

            <div className='grid grid-cols-1 gap-10 @4xl:grid-cols-[minmax(0,1fr)_300px]'>
                <section>
                    <SectionHeader
                        title='Quick picks'
                        action={
                            <Button
                                variant='text'
                                size='sm'
                                onClick={() =>
                                    playTracks(
                                        quickPicks.map(t => t.id),
                                        { source: 'Quick picks' },
                                    )
                                }
                            >
                                Play all
                            </Button>
                        }
                    />
                    <div>
                        <List variant='segmented'>
                            {quickPicks.map((track, i) => (
                                <TrackRow
                                    key={track.id}
                                    track={track}
                                    onPlay={() =>
                                        playTracks(
                                            quickPicks.map(t => t.id),
                                            { index: i, source: 'Quick picks' },
                                        )
                                    }
                                />
                            ))}
                        </List>
                    </div>
                </section>

                <section className='flex flex-col gap-4'>
                    <SectionHeader title='Your week' />
                    <Card variant='filled' className='rounded-3xl bg-surface-container-low'>
                        <CardContent className='flex items-center gap-5 p-5'>
                            <div className='relative flex shrink-0 items-center justify-center'>
                                <Progress variant='circle' wave value={74} stroke={7} className='size-24' />
                                <span className='absolute text-lg font-medium'>74%</span>
                            </div>
                            <div>
                                <p className='text-[28px] leading-9'>
                                    5 h 55 <span className='text-base'>min</span>
                                </p>
                                <p className='text-sm text-on-surface-variant'>of your 8 hour listening goal</p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card
                        variant='filled'
                        actionable
                        className='rounded-3xl bg-surface-container-low'
                        onClick={() => openDetail({ kind: 'artist', id: topArtist.name })}
                    >
                        <CardContent className='flex items-center gap-4 p-5'>
                            <Avatar className='size-14'>
                                <AvatarImage src={topArtistAlbum.cover} alt='' className='object-cover' />
                                <AvatarFallback>{topArtist.name.at(0)}</AvatarFallback>
                            </Avatar>
                            <div className='min-w-0 flex-1'>
                                <p className='text-sm text-on-surface-variant'>Top artist this week</p>
                                <p className='truncate text-lg'>{topArtist.name}</p>
                                <p className='text-sm text-on-surface-variant'>{topArtist.plays} plays</p>
                            </div>
                            <i className='icon-[material-symbols--chevron-right-rounded] size-6 text-on-surface-variant' />
                        </CardContent>
                    </Card>
                    <div className='flex flex-wrap gap-2'>
                        {genres.map(genre => (
                            <Chip
                                key={genre}
                                leadingIcon={<i className='icon-[material-symbols--music-note-rounded]' />}
                                onClick={() => openDetail({ kind: 'genre', id: genre })}
                                className='cursor-pointer'
                            >
                                {genre}
                            </Chip>
                        ))}
                    </div>
                </section>
            </div>

            <section>
                <SectionHeader title='Your playlists' />
                <div className='grid grid-cols-2 gap-4 @xl:grid-cols-4'>
                    {[
                        { id: 'favorites', name: 'Favorites', ids: tracks.filter(t => t.liked).map(t => t.id) },
                        ...playlists.map(p => ({ id: p.id, name: p.name, ids: p.trackIds })),
                    ].map(item => (
                        <button
                            key={item.id}
                            type='button'
                            onClick={() => openDetail({ kind: 'playlist', id: item.id })}
                            className='group/playlist flex cursor-pointer flex-col gap-2 text-left'
                        >
                            {item.id === 'favorites' ? (
                                <span className='flex aspect-square w-full items-center justify-center rounded-3xl bg-tertiary-container text-on-tertiary-container transition-[border-radius] group-hover/playlist:rounded-[40px]'>
                                    <i className='icon-[material-symbols--favorite-rounded] size-1/3' />
                                </span>
                            ) : (
                                <Mosaic
                                    ids={item.ids}
                                    className='w-full rounded-3xl transition-[border-radius] group-hover/playlist:rounded-[40px]'
                                />
                            )}
                            <span>
                                <span className='block truncate font-medium'>{item.name}</span>
                                <span className='block text-sm text-on-surface-variant'>{plural(item.ids.length, 'song')}</span>
                            </span>
                        </button>
                    ))}
                </div>
            </section>
        </div>
    )
}

/* ------------------------------------ Search ------------------------------------ */

function SearchView() {
    const { tracks, playTracks, openDetail } = useMusic()
    const [query, setQuery] = React.useState('')
    const [open, setOpen] = React.useState(false)
    const [recent, setRecent] = React.useState(['velvet static', 'golden hour', 'acoustic'])
    const q = query.trim().toLowerCase()

    const songs = q ? tracks.filter(t => `${t.title} ${t.artist}`.toLowerCase().includes(q)).slice(0, 5) : []
    const albumMatches = q ? albums.filter(a => `${a.title} ${a.artist}`.toLowerCase().includes(q)).slice(0, 3) : []
    const artistMatches = q ? artistNames.filter(name => name.toLowerCase().includes(q)) : []
    const empty = q && songs.length + albumMatches.length + artistMatches.length === 0

    const remember = () => {
        if (q) setRecent(list => [q, ...list.filter(item => item !== q)].slice(0, 6))
        setOpen(false)
    }

    return (
        <div className='flex flex-col gap-8'>
            <Search open={open} onOpenChange={setOpen} className='w-full max-w-2xl'>
                <SearchTrigger onSearch={() => songs[0] && (remember(), playTracks([songs[0].id], { source: 'Search' }))}>
                    <span data-slot='search-icon'>
                        <i className='icon-[material-symbols--search-rounded]' aria-hidden='true' />
                    </span>
                    <SearchInput
                        aria-label='Search your library'
                        placeholder='Songs, albums, artists'
                        className='pl-0'
                        value={query}
                        onValueChange={setQuery}
                    />
                </SearchTrigger>
                <SearchList className='shadow-elevation-2'>
                    {!q && (
                        <>
                            <p className='px-4 pt-3 pb-1 text-sm text-on-surface-variant'>Recent searches</p>
                            {recent.map(item => (
                                <SearchListItem key={item} onClick={() => setQuery(item)}>
                                    <ListItemLeading>
                                        <i className='icon-[material-symbols--history-rounded]' />
                                    </ListItemLeading>
                                    <ListItemContent>
                                        <ListItemLabel>{item}</ListItemLabel>
                                    </ListItemContent>
                                </SearchListItem>
                            ))}
                        </>
                    )}
                    {empty && (
                        <p role='status' className='px-4 py-6 text-sm text-on-surface-variant'>
                            Nothing in your library matches “{query}”
                        </p>
                    )}
                    {artistMatches.map(name => (
                        <SearchListItem
                            key={name}
                            onClick={() => {
                                remember()
                                openDetail({ kind: 'artist', id: name })
                            }}
                        >
                            <ListItemLeading>
                                <Avatar className='size-10'>
                                    <AvatarImage
                                        src={albums.find(a => a.artist === name)!.cover}
                                        alt=''
                                        className='object-cover'
                                    />
                                    <AvatarFallback>{name.at(0)}</AvatarFallback>
                                </Avatar>
                            </ListItemLeading>
                            <ListItemContent>
                                <ListItemLabel>{name}</ListItemLabel>
                                <ListItemSupportingText>Artist</ListItemSupportingText>
                            </ListItemContent>
                        </SearchListItem>
                    ))}
                    {albumMatches.map(album => (
                        <SearchListItem
                            key={album.id}
                            onClick={() => {
                                remember()
                                openDetail({ kind: 'album', id: album.id })
                            }}
                        >
                            <ListItemLeading>
                                <Cover album={album} className='size-10 rounded-lg' />
                            </ListItemLeading>
                            <ListItemContent>
                                <ListItemLabel>{album.title}</ListItemLabel>
                                <ListItemSupportingText>Album · {album.artist}</ListItemSupportingText>
                            </ListItemContent>
                        </SearchListItem>
                    ))}
                    {songs.map(track => (
                        <SearchListItem
                            key={track.id}
                            onClick={() => {
                                remember()
                                playTracks([track.id], { source: 'Search' })
                            }}
                        >
                            <ListItemLeading>
                                <Cover album={albumById.get(track.albumId)!} className='size-10 rounded-lg' />
                            </ListItemLeading>
                            <ListItemContent>
                                <ListItemLabel>{track.title}</ListItemLabel>
                                <ListItemSupportingText>Song · {track.artist}</ListItemSupportingText>
                            </ListItemContent>
                            <ListItemTrailing>
                                <ListItemTrailingText>{formatTime(track.duration)}</ListItemTrailingText>
                            </ListItemTrailing>
                        </SearchListItem>
                    ))}
                </SearchList>
            </Search>

            {recent.length > 0 && (
                <section>
                    <SectionHeader
                        title='Recent searches'
                        action={
                            <Button variant='text' size='sm' onClick={() => setRecent([])}>
                                Clear
                            </Button>
                        }
                    />
                    <div className='flex flex-wrap gap-2'>
                        {recent.map(item => (
                            <Chip
                                key={item}
                                variant='input'
                                trailingIcon={
                                    <button
                                        type='button'
                                        aria-label={`Remove ${item}`}
                                        className='flex cursor-pointer items-center'
                                        onClick={event => {
                                            event.stopPropagation()
                                            setRecent(list => list.filter(entry => entry !== item))
                                        }}
                                    >
                                        <i className='icon-[material-symbols--close-rounded] size-4.5' />
                                    </button>
                                }
                                className='cursor-pointer'
                                onClick={() => {
                                    setQuery(item)
                                    setOpen(true)
                                }}
                            >
                                {item}
                            </Chip>
                        ))}
                    </div>
                </section>
            )}

            <section>
                <SectionHeader title='Browse by genre' />
                <div className='grid grid-cols-2 gap-3 @xl:grid-cols-3 @4xl:grid-cols-5'>
                    {genres.map(genre => {
                        const genreAlbums = albums.filter(a => a.genre === genre)
                        const tone = schemeFor(genreAlbums[0].hue)
                        return (
                            <button
                                key={genre}
                                type='button'
                                onClick={() => openDetail({ kind: 'genre', id: genre })}
                                style={tone.style}
                                className={cn(
                                    tone.className,
                                    'group/genre relative flex h-28 cursor-pointer overflow-hidden rounded-3xl bg-primary-container p-4 text-left text-on-primary-container transition-[border-radius] hover:rounded-[40px]',
                                )}
                            >
                                <span className='relative z-10 text-lg font-medium'>{genre}</span>
                                <Cover
                                    album={genreAlbums[0]}
                                    className='absolute -right-4 -bottom-4 size-20 rotate-[20deg] rounded-2xl shadow-elevation-2 transition-transform group-hover/genre:rotate-[10deg]'
                                />
                            </button>
                        )
                    })}
                </div>
            </section>
        </div>
    )
}

/* ------------------------------------ Library ------------------------------------ */

const songFilters = ['Favorites', 'Hi-Res', 'Recently added'] as const satisfies readonly SongFilter[]

const sortLabels: Record<SongSort, string> = {
    added: 'Recently added',
    title: 'Title',
    artist: 'Artist',
    duration: 'Duration',
}

/** Section headers for the song list, matching the active sort. */
function songGroup(track: Track, sort: SongSort) {
    if (sort === 'title') return /[a-z]/i.test(track.title[0]) ? track.title[0].toUpperCase() : '#'
    if (sort === 'artist') return track.artist
    if (sort === 'duration')
        return track.duration >= 240 ? 'Over 4 minutes' : track.duration >= 180 ? '3 – 4 minutes' : 'Under 3 minutes'
    return track.added <= 7
        ? 'This week'
        : track.added <= 31
          ? 'This month'
          : track.added <= 120
            ? 'Earlier this year'
            : 'Older'
}

/** Newly scanned songs land in Download, the rest are filed by artist. */
function folderOf(track: Track) {
    return track.added === 0 ? '/Download' : `/Music/${track.artist}`
}

function LibraryShortcut({ label, icon, tone, onClick }: { label: string; icon: string; tone: string; onClick: () => void }) {
    return (
        <button
            type='button'
            onClick={onClick}
            className='group/shortcut flex w-20 shrink-0 cursor-pointer flex-col items-center gap-2'
        >
            <span
                className={cn(
                    'relative flex size-18 items-center justify-center overflow-hidden rounded-full transition-[border-radius] duration-300 group-hover/shortcut:rounded-3xl group-active/shortcut:rounded-2xl',
                    tone,
                )}
            >
                <span className='absolute inset-0 bg-current opacity-0 transition-opacity group-hover/shortcut:opacity-8' />
                <i className={cn(icon, 'size-7')} />
            </span>
            <span className='w-full truncate text-center text-sm'>{label}</span>
        </button>
    )
}

/** A cover with a play button that appears on hover, and a live indicator while the collection plays. */
function PlayableArt({
    children,
    playing,
    label,
    onPlay,
    round,
}: {
    children: React.ReactNode
    playing: boolean
    label: string
    onPlay: () => void
    round?: boolean
}) {
    return (
        <span className='relative block'>
            {children}
            {playing && (
                <span className='absolute top-3 left-3 flex h-7 items-center rounded-full bg-primary px-2.5 text-on-primary shadow-elevation-1 [&_span_span]:bg-on-primary'>
                    <NowPlayingBars playing />
                </span>
            )}
            <Button
                icon
                size='sm'
                aria-label={label}
                onClick={event => {
                    event.stopPropagation()
                    onPlay()
                }}
                className={cn(
                    'absolute shadow-elevation-2 transition-[opacity,translate] group-focus-within/card:translate-y-0 group-focus-within/card:opacity-100 group-hover/card:translate-y-0 group-hover/card:opacity-100',
                    round ? 'right-1 bottom-1' : 'right-3 bottom-3',
                    playing ? 'opacity-100' : 'translate-y-2 opacity-0',
                )}
            >
                <i className='icon-[material-symbols--play-arrow-rounded] size-6!' />
            </Button>
        </span>
    )
}

function LibraryView({
    tab,
    onTabChange,
    onNewPlaylist,
}: {
    tab: LibraryTab
    onTabChange: (tab: LibraryTab) => void
    onNewPlaylist: () => void
}) {
    const { tracks, playlists, player, current, playTracks, openDetail } = useMusic()
    const [sort, setSort] = React.useState<SongSort>('added')
    const [filters, setFilters] = React.useState<SongFilter[]>([])
    const [albumLayout, setAlbumLayout] = React.useState<'grid' | 'list'>('grid')
    const [albumSort, setAlbumSort] = React.useState<'year' | 'title' | 'artist'>('year')

    const songs = tracks
        .filter(t => !filters.includes('Favorites') || t.liked)
        .filter(t => !filters.includes('Hi-Res') || t.format === 'FLAC')
        .filter(t => !filters.includes('Recently added') || t.added <= 14)
        .sort((a, b) => {
            if (sort === 'title') return a.title.localeCompare(b.title)
            if (sort === 'artist') return a.artist.localeCompare(b.artist) || a.title.localeCompare(b.title)
            if (sort === 'duration') return b.duration - a.duration
            return a.added - b.added || a.id.localeCompare(b.id, undefined, { numeric: true })
        })
    const songIds = songs.map(t => t.id)
    const groups: { label: string; items: { track: Track; index: number }[] }[] = []
    songs.forEach((track, index) => {
        const label = songGroup(track, sort)
        const group = groups.at(-1)
        if (group?.label === label) group.items.push({ track, index })
        else groups.push({ label, items: [{ track, index }] })
    })

    const sortedAlbums = [...albums].sort((a, b) =>
        albumSort === 'year'
            ? b.year - a.year || a.title.localeCompare(b.title)
            : albumSort === 'title'
              ? a.title.localeCompare(b.title)
              : a.artist.localeCompare(b.artist) || b.year - a.year,
    )
    const favorites = tracks.filter(t => t.liked).map(t => t.id)
    const total = tracks.reduce((sum, t) => sum + t.duration, 0)
    const folders = [...new Set(tracks.map(folderOf))].sort()
    const counts: Record<LibraryTab, number> = {
        songs: tracks.length,
        albums: albums.length,
        artists: artistNames.length,
        playlists: playlists.length + 1,
        folders: folders.length,
    }
    const tracksOf = (albumId: string) => tracks.filter(t => t.albumId === albumId).map(t => t.id)
    const isSource = (source: string) => player.playing && player.source === source

    return (
        <div className='flex flex-col gap-6'>
            {/* Overview */}
            <section className='flex flex-col gap-5'>
                <p className='text-sm text-on-surface-variant'>
                    {plural(tracks.length, 'song')} · {plural(albums.length, 'album')} · {formatTotal(total)} of music
                </p>
                <div className='-mx-4 flex gap-3 overflow-x-auto px-4 [scrollbar-width:none] @3xl/app:-mx-8 @3xl/app:px-8'>
                    <LibraryShortcut
                        label='Shuffle all'
                        icon='icon-[material-symbols--shuffle-rounded]'
                        tone='bg-primary text-on-primary'
                        onClick={() =>
                            playTracks(
                                tracks.map(t => t.id),
                                { source: 'Library', shuffle: true },
                            )
                        }
                    />
                    <LibraryShortcut
                        label='Favorites'
                        icon='icon-[material-symbols--favorite-rounded]'
                        tone='bg-tertiary-container text-on-tertiary-container'
                        onClick={() => openDetail({ kind: 'playlist', id: 'favorites' })}
                    />
                    <LibraryShortcut
                        label='Most played'
                        icon='icon-[material-symbols--trending-up-rounded]'
                        tone='bg-secondary-container text-on-secondary-container'
                        onClick={() =>
                            playTracks(
                                [...tracks]
                                    .sort((a, b) => b.plays - a.plays)
                                    .slice(0, 20)
                                    .map(t => t.id),
                                { source: 'Most played' },
                            )
                        }
                    />
                    <LibraryShortcut
                        label='New songs'
                        icon='icon-[material-symbols--history-rounded]'
                        tone='bg-secondary-container text-on-secondary-container'
                        onClick={() => {
                            onTabChange('songs')
                            setSort('added')
                            setFilters(['Recently added'])
                        }}
                    />
                    {artistNames.map(name => (
                        <button
                            key={name}
                            type='button'
                            onClick={() => openDetail({ kind: 'artist', id: name })}
                            className='group/shortcut flex w-20 shrink-0 cursor-pointer flex-col items-center gap-2'
                        >
                            <Avatar className='size-18 transition-transform duration-300 group-hover/shortcut:scale-105'>
                                <AvatarImage src={albums.find(a => a.artist === name)!.cover} alt='' className='object-cover' />
                                <AvatarFallback>{name.at(0)}</AvatarFallback>
                            </Avatar>
                            <span className='w-full truncate text-center text-sm'>{name}</span>
                        </button>
                    ))}
                </div>
            </section>

            <Tabs value={tab} onValueChange={value => onTabChange(value as LibraryTab)} className='flex flex-col gap-4'>
                {/* Sticks to the top of the scroller, clear of its top padding */}
                <TabsList className='sticky -top-6 z-10 -mx-4 overflow-x-auto bg-surface px-2 [scrollbar-width:none] @3xl/app:-mx-8 @3xl/app:px-6'>
                    {(Object.keys(counts) as LibraryTab[]).map(key => (
                        <TabsTrigger key={key} value={key}>
                            <span className='flex items-center'>
                                <span className='capitalize'>{key}</span>
                                <span className='ml-1.5 hidden rounded-full bg-on-surface/8 px-1.5 text-[11px] leading-4 tabular-nums @xl:inline'>
                                    {counts[key]}
                                </span>
                            </span>
                        </TabsTrigger>
                    ))}
                </TabsList>

                <TabsContent value='songs' className='flex flex-col gap-2'>
                    <div className='flex flex-wrap items-center gap-2'>
                        {songFilters.map(filter => {
                            const selected = filters.includes(filter)
                            return (
                                <Chip
                                    key={filter}
                                    variant='filter'
                                    selected={selected}
                                    role='checkbox'
                                    aria-checked={selected}
                                    className='cursor-pointer'
                                    onClick={() =>
                                        setFilters(list => (selected ? list.filter(f => f !== filter) : [...list, filter]))
                                    }
                                >
                                    {filter}
                                </Chip>
                            )
                        })}
                        <div className='ml-auto flex items-center'>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant='text' size='sm' className='px-3'>
                                        <i className='icon-[material-symbols--sort-rounded]' />
                                        {sortLabels[sort]}
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent compact align='end' {...useTint('w-44')}>
                                    <DropdownMenuGroup>
                                        <DropdownMenuLabel>Sort by</DropdownMenuLabel>
                                        <DropdownMenuRadioGroup
                                            value={sort}
                                            onValueChange={value => setSort(value as SongSort)}
                                        >
                                            {(Object.keys(sortLabels) as SongSort[]).map(key => (
                                                <DropdownMenuRadioItem key={key} value={key}>
                                                    {sortLabels[key]}
                                                </DropdownMenuRadioItem>
                                            ))}
                                        </DropdownMenuRadioGroup>
                                    </DropdownMenuGroup>
                                </DropdownMenuContent>
                            </DropdownMenu>
                            <IconButton
                                label={`Shuffle ${plural(songs.length, 'song')}`}
                                disabled={songs.length === 0}
                                onClick={() => playTracks(songIds, { source: 'Library', shuffle: true })}
                            >
                                <i className='icon-[material-symbols--shuffle-rounded]' />
                            </IconButton>
                        </div>
                    </div>
                    {songs.length === 0 ? (
                        <div className='flex flex-col items-center gap-3 rounded-3xl bg-surface-container px-6 py-12 text-center'>
                            <i className='icon-[material-symbols--filter-list-off-rounded] size-10 text-on-surface-variant' />
                            <p className='font-medium'>No songs match these filters</p>
                            <Button variant='tonal' size='sm' onClick={() => setFilters([])}>
                                Clear filters
                            </Button>
                        </div>
                    ) : (
                        groups.map(group => (
                            <section key={group.label} aria-label={group.label}>
                                <h3 className='flex items-baseline gap-2 px-4 pt-4 pb-2 text-sm font-medium text-primary'>
                                    {group.label}
                                    <span className='text-xs font-normal text-on-surface-variant'>
                                        {plural(group.items.length, 'song')}
                                    </span>
                                </h3>
                                <List variant='segmented'>
                                    {group.items.map(({ track, index }) => (
                                        <TrackRow
                                            key={track.id}
                                            track={track}
                                            onPlay={() => playTracks(songIds, { index, source: 'Library' })}
                                        />
                                    ))}
                                </List>
                            </section>
                        ))
                    )}
                </TabsContent>

                <TabsContent value='albums' className='flex flex-col gap-4'>
                    <div className='flex items-center gap-2'>
                        <div className='mr-auto flex flex-wrap gap-2'>
                            {(['year', 'title', 'artist'] as const).map(key => (
                                <Chip
                                    key={key}
                                    variant='filter'
                                    selected={albumSort === key}
                                    role='radio'
                                    aria-checked={albumSort === key}
                                    className='cursor-pointer capitalize'
                                    onClick={() => setAlbumSort(key)}
                                >
                                    {key === 'year' ? 'Newest' : key}
                                </Chip>
                            ))}
                        </div>
                        <ButtonGroup variant='connected'>
                            <Toggle
                                size='sm'
                                variant='tonal'
                                icon
                                aria-label='Grid'
                                pressed={albumLayout === 'grid'}
                                onPressedChange={() => setAlbumLayout('grid')}
                            >
                                <i className='icon-[material-symbols--grid-view-outline-rounded]' />
                            </Toggle>
                            <Toggle
                                size='sm'
                                variant='tonal'
                                icon
                                aria-label='List'
                                pressed={albumLayout === 'list'}
                                onPressedChange={() => setAlbumLayout('list')}
                            >
                                <i className='icon-[material-symbols--view-list-outline-rounded]' />
                            </Toggle>
                        </ButtonGroup>
                    </div>
                    {albumLayout === 'grid' ? (
                        <div className='grid grid-cols-2 gap-x-4 gap-y-6 @xl:grid-cols-3 @4xl:grid-cols-4'>
                            {sortedAlbums.map(album => {
                                const ids = tracksOf(album.id)
                                const source = `Album · ${album.title}`
                                return (
                                    <div
                                        key={album.id}
                                        role='button'
                                        tabIndex={0}
                                        onClick={() => openDetail({ kind: 'album', id: album.id })}
                                        onKeyDown={event =>
                                            event.target === event.currentTarget &&
                                            event.key === 'Enter' &&
                                            openDetail({ kind: 'album', id: album.id })
                                        }
                                        className='group/card flex cursor-pointer flex-col gap-2.5 rounded-3xl outline-none focus-visible:ring-2 focus-visible:ring-primary'
                                    >
                                        <PlayableArt
                                            playing={isSource(source) || (player.playing && current.albumId === album.id)}
                                            label={`Play ${album.title}`}
                                            onPlay={() => playTracks(ids, { source })}
                                        >
                                            <Cover
                                                album={album}
                                                className='w-full rounded-3xl transition-[border-radius] duration-300 group-hover/card:rounded-[40px]'
                                            />
                                        </PlayableArt>
                                        <span className='px-1'>
                                            <span className='block truncate font-medium'>{album.title}</span>
                                            <span className='block truncate text-sm text-on-surface-variant'>
                                                {album.artist} · {album.year}
                                            </span>
                                        </span>
                                    </div>
                                )
                            })}
                        </div>
                    ) : (
                        <List variant='segmented'>
                            {sortedAlbums.map(album => {
                                const ids = tracksOf(album.id)
                                const total = ids.reduce((sum, id) => sum + tracks.find(t => t.id === id)!.duration, 0)
                                return (
                                    <ListItem
                                        key={album.id}
                                        onClick={() => openDetail({ kind: 'album', id: album.id })}
                                        className='gap-4 pr-2'
                                    >
                                        <ListItemLeading>
                                            <Cover album={album} className='size-14 rounded-xl' />
                                        </ListItemLeading>
                                        <ListItemContent>
                                            <ListItemLabel>{album.title}</ListItemLabel>
                                            <ListItemSupportingText>
                                                {album.artist} · {album.year} · {album.genre}
                                            </ListItemSupportingText>
                                        </ListItemContent>
                                        <ListItemTrailing className='gap-1'>
                                            <ListItemTrailingText className='hidden @md:inline'>
                                                {plural(ids.length, 'song')} · {formatTotal(total)}
                                            </ListItemTrailingText>
                                            <IconButton
                                                label={`Play ${album.title}`}
                                                size='sm'
                                                onClick={event => {
                                                    event.stopPropagation()
                                                    playTracks(ids, { source: `Album · ${album.title}` })
                                                }}
                                            >
                                                <i className='icon-[material-symbols--play-circle-outline-rounded] size-6' />
                                            </IconButton>
                                        </ListItemTrailing>
                                    </ListItem>
                                )
                            })}
                        </List>
                    )}
                </TabsContent>

                <TabsContent value='artists'>
                    <div className='grid grid-cols-2 gap-x-4 gap-y-6 @xl:grid-cols-3 @4xl:grid-cols-5'>
                        {artistNames.map(name => {
                            const artistAlbums = albums.filter(a => a.artist === name)
                            const ids = tracks.filter(t => t.artist === name).map(t => t.id)
                            const source = `Artist · ${name}`
                            return (
                                <div
                                    key={name}
                                    role='button'
                                    tabIndex={0}
                                    onClick={() => openDetail({ kind: 'artist', id: name })}
                                    onKeyDown={event =>
                                        event.target === event.currentTarget &&
                                        event.key === 'Enter' &&
                                        openDetail({ kind: 'artist', id: name })
                                    }
                                    className='group/card flex cursor-pointer flex-col items-center gap-3 rounded-3xl p-2 text-center outline-none focus-visible:ring-2 focus-visible:ring-primary'
                                >
                                    <PlayableArt
                                        round
                                        playing={isSource(source) || (player.playing && current.artist === name)}
                                        label={`Play ${name}`}
                                        onPlay={() => playTracks(ids, { source })}
                                    >
                                        <Avatar className='aspect-square size-auto w-full max-w-40 transition-transform duration-300 group-hover/card:scale-[1.03]'>
                                            <AvatarImage src={artistAlbums[0].cover} alt='' className='object-cover' />
                                            <AvatarFallback>{name.at(0)}</AvatarFallback>
                                        </Avatar>
                                    </PlayableArt>
                                    <span className='w-full'>
                                        <span className='block truncate font-medium'>{name}</span>
                                        <span className='block text-sm text-on-surface-variant'>
                                            {plural(artistAlbums.length, 'album')} · {plural(ids.length, 'song')}
                                        </span>
                                    </span>
                                </div>
                            )
                        })}
                    </div>
                </TabsContent>

                <TabsContent value='playlists'>
                    <div className='grid grid-cols-2 gap-x-4 gap-y-6 @xl:grid-cols-3 @4xl:grid-cols-4'>
                        <button
                            type='button'
                            onClick={onNewPlaylist}
                            className='group/new flex cursor-pointer flex-col gap-2.5 text-left'
                        >
                            <span className='flex aspect-square w-full flex-col items-center justify-center gap-2 rounded-3xl border-2 border-dashed border-outline-variant text-primary transition-[border-radius,background-color] duration-300 group-hover/new:rounded-[40px] group-hover/new:bg-primary/8'>
                                <i className='icon-[material-symbols--add-rounded] size-10' />
                            </span>
                            <span className='px-1'>
                                <span className='block font-medium'>New playlist</span>
                                <span className='block text-sm text-on-surface-variant'>Start from scratch</span>
                            </span>
                        </button>
                        {[
                            { id: 'favorites', name: 'Favorites', text: 'Auto playlist', ids: favorites },
                            ...playlists.map(p => ({ id: p.id, name: p.name, text: p.description, ids: p.trackIds })),
                        ].map(item => {
                            const source = `Playlist · ${item.name}`
                            return (
                                <div
                                    key={item.id}
                                    role='button'
                                    tabIndex={0}
                                    onClick={() => openDetail({ kind: 'playlist', id: item.id })}
                                    onKeyDown={event =>
                                        event.target === event.currentTarget &&
                                        event.key === 'Enter' &&
                                        openDetail({ kind: 'playlist', id: item.id })
                                    }
                                    className='group/card flex cursor-pointer flex-col gap-2.5 rounded-3xl outline-none focus-visible:ring-2 focus-visible:ring-primary'
                                >
                                    <PlayableArt
                                        playing={isSource(source)}
                                        label={`Play ${item.name}`}
                                        onPlay={() => playTracks(item.ids, { source })}
                                    >
                                        {item.id === 'favorites' ? (
                                            <span className='flex aspect-square w-full items-center justify-center rounded-3xl bg-tertiary-container text-on-tertiary-container transition-[border-radius] duration-300 group-hover/card:rounded-[40px]'>
                                                <i className='icon-[material-symbols--favorite-rounded] size-1/3' />
                                            </span>
                                        ) : (
                                            <Mosaic
                                                ids={item.ids}
                                                className='w-full rounded-3xl transition-[border-radius] duration-300 group-hover/card:rounded-[40px]'
                                            />
                                        )}
                                    </PlayableArt>
                                    <span className='px-1'>
                                        <span className='block truncate font-medium'>{item.name}</span>
                                        <span className='block truncate text-sm text-on-surface-variant'>
                                            {plural(item.ids.length, 'song')}
                                            {item.text && ` · ${item.text}`}
                                        </span>
                                    </span>
                                </div>
                            )
                        })}
                    </div>
                </TabsContent>

                <TabsContent value='folders' className='flex flex-col gap-3'>
                    <p className='px-1 text-sm text-on-surface-variant'>
                        Browse songs the way they are stored on this device. Choose which folders are scanned in Settings.
                    </p>
                    <List variant='segmented'>
                        {folders.map((folder, i) => {
                            const folderTracks = tracks.filter(t => folderOf(t) === folder)
                            const ids = folderTracks.map(t => t.id)
                            return (
                                <ListCollapsible key={folder} defaultOpen={i === 0}>
                                    <ListCollapsibleTrigger>
                                        <ListItem className='gap-4'>
                                            <ListItemLeading>
                                                <span className='flex size-10 items-center justify-center rounded-xl bg-secondary-container text-on-secondary-container'>
                                                    <i className='icon-[material-symbols--folder-outline-rounded] size-6' />
                                                </span>
                                            </ListItemLeading>
                                            <ListItemContent>
                                                <ListItemLabel className='font-mono text-sm'>{folder}</ListItemLabel>
                                                <ListItemSupportingText>
                                                    {plural(folderTracks.length, 'song')} ·{' '}
                                                    {formatTotal(folderTracks.reduce((sum, t) => sum + t.duration, 0))}
                                                </ListItemSupportingText>
                                            </ListItemContent>
                                            <ListItemTrailing>
                                                <ListCollapsibleIndicator />
                                            </ListItemTrailing>
                                        </ListItem>
                                    </ListCollapsibleTrigger>
                                    <ListCollapsibleContent>
                                        {folderTracks.map((track, index) => (
                                            <TrackRow
                                                key={track.id}
                                                track={track}
                                                onPlay={() => playTracks(ids, { index, source: `Folder · ${folder}` })}
                                            />
                                        ))}
                                    </ListCollapsibleContent>
                                </ListCollapsible>
                            )
                        })}
                    </List>
                </TabsContent>
            </Tabs>
        </div>
    )
}

/* ------------------------------------ Details ------------------------------------ */

function CollectionHeader({
    art,
    overline,
    title,
    meta,
    hue,
    ids,
    source,
    actions,
}: {
    art: React.ReactNode
    overline: string
    title: string
    meta: React.ReactNode
    hue: number | null
    ids: string[]
    source: string
    actions?: React.ReactNode
}) {
    const { playTracks, enqueue, player } = useMusic()
    const tone = schemeFor(hue)
    const isPlaying = player.source === source && player.playing

    return (
        <header
            style={tone.style}
            className={cn(
                tone.className,
                'flex flex-col gap-5 rounded-[32px] bg-primary-container p-5 text-on-primary-container @lg:flex-row @lg:items-end @lg:p-6',
            )}
        >
            {art}
            <div className='flex min-w-0 flex-1 flex-col gap-4'>
                <div>
                    <p className='text-sm font-medium opacity-80'>{overline}</p>
                    <h1 className='mt-1 text-[32px] leading-10 @lg:text-[40px] @lg:leading-12'>{title}</h1>
                    <div className='mt-1 text-sm opacity-80'>{meta}</div>
                </div>
                <div className='flex flex-wrap items-center gap-2'>
                    <Button
                        disabled={ids.length === 0}
                        onClick={() => playTracks(ids, { source })}
                        className='bg-primary text-on-primary'
                    >
                        <i
                            className={
                                isPlaying
                                    ? 'icon-[material-symbols--graphic-eq-rounded]'
                                    : 'icon-[material-symbols--play-arrow-rounded]'
                            }
                        />
                        Play
                    </Button>
                    <Button
                        variant='tonal'
                        disabled={ids.length === 0}
                        onClick={() => playTracks(ids, { source, shuffle: true })}
                    >
                        <i className='icon-[material-symbols--shuffle-rounded]' />
                        Shuffle
                    </Button>
                    <DropdownMenu>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <DropdownMenuTrigger asChild>
                                    <Button variant='text' icon aria-label='More' className='text-on-primary-container'>
                                        <i className='icon-[material-symbols--more-vert]' />
                                    </Button>
                                </DropdownMenuTrigger>
                            </TooltipTrigger>
                            <TooltipContent>More</TooltipContent>
                        </Tooltip>
                        <DropdownMenuContent compact align='start' {...useTint('w-52')}>
                            <DropdownMenuGroup>
                                <DropdownMenuItem disabled={ids.length === 0} onSelect={() => enqueue(ids, true)}>
                                    <i className='icon-[material-symbols--playlist-play-rounded]' />
                                    Play next
                                </DropdownMenuItem>
                                <DropdownMenuItem disabled={ids.length === 0} onSelect={() => enqueue(ids, false)}>
                                    <i className='icon-[material-symbols--queue-music-rounded]' />
                                    Add to queue
                                </DropdownMenuItem>
                            </DropdownMenuGroup>
                            {actions}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </header>
    )
}

function AlbumDetail({ album }: { album: Album }) {
    const { tracks, playTracks, openDetail, requestNewPlaylist } = useMusic()
    const albumTracks = tracks.filter(t => t.albumId === album.id)
    const ids = albumTracks.map(t => t.id)
    const total = albumTracks.reduce((sum, t) => sum + t.duration, 0)
    const more = albums.filter(a => a.artist === album.artist && a.id !== album.id)
    const source = `Album · ${album.title}`

    return (
        <div className='flex flex-col gap-8'>
            <CollectionHeader
                art={<Cover album={album} className='size-40 rounded-[28px] shadow-elevation-3 @lg:size-52' />}
                overline={`Album · ${album.genre}`}
                title={album.title}
                meta={
                    <>
                        <button
                            type='button'
                            className='cursor-pointer font-medium hover:underline'
                            onClick={() => openDetail({ kind: 'artist', id: album.artist })}
                        >
                            {album.artist}
                        </button>{' '}
                        · {album.year} · {plural(albumTracks.length, 'song')} · {formatTotal(total)}
                    </>
                }
                hue={album.hue}
                ids={ids}
                source={source}
                actions={
                    <DropdownMenuGroup>
                        <DropdownMenuItem onSelect={() => requestNewPlaylist(ids)}>
                            <i className='icon-[material-symbols--playlist-add-rounded]' />
                            Save as playlist
                        </DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => openDetail({ kind: 'artist', id: album.artist })}>
                            <i className='icon-[material-symbols--artist-outline-rounded]' />
                            Go to artist
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                }
            />
            <List className='-mx-2'>
                {albumTracks.map((track, i) => (
                    <TrackRow
                        key={track.id}
                        track={track}
                        number={i + 1}
                        showAlbum={false}
                        onPlay={() => playTracks(ids, { index: i, source })}
                    />
                ))}
            </List>
            {more.length > 0 && (
                <section>
                    <SectionHeader title={`More by ${album.artist}`} />
                    <div className='grid grid-cols-2 gap-4 @xl:grid-cols-4'>
                        {more.map(other => (
                            <button
                                key={other.id}
                                type='button'
                                onClick={() => openDetail({ kind: 'album', id: other.id })}
                                className='group/album flex cursor-pointer flex-col gap-2 text-left'
                            >
                                <Cover
                                    album={other}
                                    className='w-full rounded-3xl transition-[border-radius] group-hover/album:rounded-[40px]'
                                />
                                <span className='truncate font-medium'>{other.title}</span>
                            </button>
                        ))}
                    </div>
                </section>
            )}
        </div>
    )
}

function ArtistDetail({ name }: { name: string }) {
    const { tracks, playTracks, openDetail } = useMusic()
    const artistAlbums = albums.filter(a => a.artist === name)
    const artistTracks = tracks.filter(t => t.artist === name)
    const popular = [...artistTracks].sort((a, b) => b.plays - a.plays).slice(0, 5)
    const ids = artistTracks.map(t => t.id)
    const source = `Artist · ${name}`

    return (
        <div className='flex flex-col gap-8'>
            <CollectionHeader
                art={
                    <Avatar className='size-40 shadow-elevation-3 @lg:size-52'>
                        <AvatarImage src={artistAlbums[0].cover} alt='' className='object-cover' />
                        <AvatarFallback>{name.at(0)}</AvatarFallback>
                    </Avatar>
                }
                overline='Artist'
                title={name}
                meta={`${plural(artistAlbums.length, 'album')} · ${plural(artistTracks.length, 'song')} · ${artistTracks.reduce((s, t) => s + t.plays, 0)} plays`}
                hue={artistAlbums[0].hue}
                ids={ids}
                source={source}
            />
            <section>
                <SectionHeader title='Popular' />
                <div>
                    <List variant='segmented'>
                        {popular.map((track, i) => (
                            <TrackRow
                                key={track.id}
                                track={track}
                                onPlay={() =>
                                    playTracks(
                                        popular.map(t => t.id),
                                        { index: i, source },
                                    )
                                }
                                trailing={
                                    <span className='hidden text-xs text-on-surface-variant @lg:inline'>
                                        {track.plays} plays
                                    </span>
                                }
                            />
                        ))}
                    </List>
                </div>
            </section>
            <section>
                <SectionHeader title='Albums' />
                <div className='grid grid-cols-2 gap-4 @xl:grid-cols-4'>
                    {artistAlbums.map(album => (
                        <button
                            key={album.id}
                            type='button'
                            onClick={() => openDetail({ kind: 'album', id: album.id })}
                            className='group/album flex cursor-pointer flex-col gap-2 text-left'
                        >
                            <Cover
                                album={album}
                                className='w-full rounded-3xl transition-[border-radius] group-hover/album:rounded-[40px]'
                            />
                            <span>
                                <span className='block truncate font-medium'>{album.title}</span>
                                <span className='block text-sm text-on-surface-variant'>{album.year}</span>
                            </span>
                        </button>
                    ))}
                </div>
            </section>
        </div>
    )
}

function GenreDetail({ genre }: { genre: string }) {
    const { tracks, playTracks, openDetail } = useMusic()
    const genreAlbums = albums.filter(a => a.genre === genre)
    const genreTracks = tracks.filter(t => genreAlbums.some(a => a.id === t.albumId))
    const ids = genreTracks.map(t => t.id)
    const source = `Genre · ${genre}`

    return (
        <div className='flex flex-col gap-8'>
            <CollectionHeader
                art={<Mosaic ids={ids} className='size-40 rounded-[28px] shadow-elevation-3 @lg:size-52' />}
                overline='Genre'
                title={genre}
                meta={`${plural(genreAlbums.length, 'album')} · ${plural(genreTracks.length, 'song')}`}
                hue={genreAlbums[0].hue}
                ids={ids}
                source={source}
            />
            <div className='flex flex-wrap gap-2'>
                {genreAlbums.map(album => (
                    <Chip
                        key={album.id}
                        elevated
                        leadingIcon={<i className='icon-[material-symbols--album-outline]' />}
                        className='cursor-pointer'
                        onClick={() => openDetail({ kind: 'album', id: album.id })}
                    >
                        {album.title}
                    </Chip>
                ))}
            </div>
            <div>
                <List variant='segmented'>
                    {genreTracks.map((track, i) => (
                        <TrackRow key={track.id} track={track} onPlay={() => playTracks(ids, { index: i, source })} />
                    ))}
                </List>
            </div>
        </div>
    )
}

function PlaylistDetail({
    id,
    onRename,
    onDelete,
    onReorder,
    onRemoveTrack,
}: {
    id: string
    onRename: (playlist: Playlist) => void
    onDelete: (playlist: Playlist) => void
    onReorder: (playlistId: string, from: number, to: number) => void
    onRemoveTrack: (playlistId: string, index: number) => void
}) {
    const { tracks, trackById, playlists, playTracks } = useMusic()
    const favorites = id === 'favorites'
    const playlist = playlists.find(p => p.id === id)
    if (!favorites && !playlist) return null

    const ids = favorites
        ? tracks.filter(t => t.liked).map(t => t.id)
        : playlist!.trackIds.filter(trackId => trackById.has(trackId))
    const name = favorites ? 'Favorites' : playlist!.name
    const total = ids.reduce((sum, trackId) => sum + trackById.get(trackId)!.duration, 0)
    const source = `Playlist · ${name}`

    return (
        <div className='flex flex-col gap-8'>
            <CollectionHeader
                art={
                    favorites ? (
                        <span className='flex size-40 items-center justify-center rounded-[28px] bg-tertiary-container text-on-tertiary-container shadow-elevation-3 @lg:size-52'>
                            <i className='icon-[material-symbols--favorite-rounded] size-1/3' />
                        </span>
                    ) : (
                        <Mosaic ids={ids} className='size-40 rounded-[28px] shadow-elevation-3 @lg:size-52' />
                    )
                }
                overline={favorites ? 'Auto playlist' : 'Playlist'}
                title={name}
                meta={
                    <>
                        {!favorites && playlist!.description && <p>{playlist!.description}</p>}
                        {plural(ids.length, 'song')} · {formatTotal(total)}
                    </>
                }
                hue={null}
                ids={ids}
                source={source}
                actions={
                    !favorites && (
                        <DropdownMenuGroup>
                            <DropdownMenuItem onSelect={() => onRename(playlist!)}>
                                <i className='icon-[material-symbols--edit-outline-rounded]' />
                                Rename
                            </DropdownMenuItem>
                            <DropdownMenuItem onSelect={() => onDelete(playlist!)} className='text-error [&_i]:text-error'>
                                <i className='icon-[material-symbols--delete-outline-rounded]' />
                                Delete playlist
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                    )
                }
            />
            {ids.length === 0 ? (
                <div className='flex flex-col items-center gap-2 rounded-3xl bg-surface-container-low px-6 py-12 text-center'>
                    <i className='icon-[material-symbols--queue-music-rounded] size-10 text-on-surface-variant' />
                    <p className='font-medium'>This playlist is empty</p>
                    <p className='text-sm text-on-surface-variant'>Use “Add to playlist” on any song to fill it up.</p>
                </div>
            ) : (
                <div>
                    {favorites ? (
                        <List variant='segmented'>
                            {ids.map((trackId, i) => (
                                <TrackRow
                                    key={trackId}
                                    track={trackById.get(trackId)!}
                                    onPlay={() => playTracks(ids, { index: i, source })}
                                />
                            ))}
                        </List>
                    ) : (
                        <List variant='segmented' onReorder={(from, to) => onReorder(playlist!.id, from, to)}>
                            {ids.map((trackId, i) => (
                                <TrackRow
                                    key={`${trackId}-${i}`}
                                    track={trackById.get(trackId)!}
                                    onPlay={() => playTracks(ids, { index: i, source })}
                                    onRemove={() => onRemoveTrack(playlist!.id, i)}
                                    trailing={<ListItemDragHandle label={`Reorder ${trackById.get(trackId)!.title}`} />}
                                />
                            ))}
                        </List>
                    )}
                </div>
            )}
        </div>
    )
}

/* ------------------------------------ Dialogs ------------------------------------ */

function PlaylistDialog({
    open,
    onOpenChange,
    initialName,
    mode,
    songCount,
    onSubmit,
}: {
    open: boolean
    onOpenChange: (open: boolean) => void
    initialName: string
    mode: 'create' | 'rename'
    songCount: number
    onSubmit: (name: string, description: string) => void
}) {
    const [name, setName] = React.useState(initialName)
    const [description, setDescription] = React.useState('')

    React.useEffect(() => {
        if (open) {
            setName(initialName)
            setDescription('')
        }
    }, [open, initialName])

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent {...useTint('max-w-sm')}>
                <DialogHeader>
                    <DialogTitle>{mode === 'create' ? 'New playlist' : 'Rename playlist'}</DialogTitle>
                    <DialogDescription>
                        {mode === 'create'
                            ? songCount > 0
                                ? `${plural(songCount, 'song')} will be added to the new playlist.`
                                : 'Give your playlist a name. You can add songs later.'
                            : 'Playlists are stored on this device.'}
                    </DialogDescription>
                </DialogHeader>
                <form
                    id='playlist-form'
                    className='flex flex-col gap-4'
                    onSubmit={event => {
                        event.preventDefault()
                        if (name.trim()) onSubmit(name.trim(), description.trim())
                    }}
                >
                    <TextField label='Name' value={name} onChange={event => setName(event.target.value)} autoFocus />
                    {mode === 'create' && (
                        <TextField
                            label='Description'
                            value={description}
                            onChange={event => setDescription(event.target.value)}
                            helperText='Optional'
                        />
                    )}
                </form>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant='text' size='sm'>
                            Cancel
                        </Button>
                    </DialogClose>
                    <Button size='sm' type='submit' form='playlist-form' disabled={!name.trim()}>
                        {mode === 'create' ? 'Create' : 'Save'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

function EditTagsDialog({
    track,
    onOpenChange,
    onSave,
}: {
    track: Track | null
    onOpenChange: (open: boolean) => void
    onSave: (id: string, patch: Pick<Track, 'title' | 'artist'>) => void
}) {
    const [title, setTitle] = React.useState('')
    const [artist, setArtist] = React.useState('')
    const [writeFile, setWriteFile] = React.useState(true)

    React.useEffect(() => {
        if (track) {
            setTitle(track.title)
            setArtist(track.artist)
        }
    }, [track])

    const album = track ? albumById.get(track.albumId) : null

    return (
        <Dialog open={!!track} onOpenChange={onOpenChange}>
            <DialogContent {...useTint('max-w-md')}>
                <DialogHeader>
                    <DialogTitle>Edit tags</DialogTitle>
                    <DialogDescription>
                        {track && `${track.format} · ${album?.title} · ${formatTime(track.duration)}`}
                    </DialogDescription>
                </DialogHeader>
                <form
                    id='tags-form'
                    className='flex flex-col gap-4'
                    onSubmit={event => {
                        event.preventDefault()
                        if (track && title.trim() && artist.trim()) {
                            onSave(track.id, { title: title.trim(), artist: artist.trim() })
                        }
                    }}
                >
                    <TextField
                        label='Title'
                        value={title}
                        onChange={event => setTitle(event.target.value)}
                        error={!title.trim()}
                        helperText={title.trim() ? undefined : 'Title is required'}
                    />
                    <TextField
                        label='Track artist'
                        value={artist}
                        onChange={event => setArtist(event.target.value)}
                        error={!artist.trim()}
                        helperText={artist.trim() ? `Album artist stays ${album?.artist}` : 'Artist is required'}
                    />
                    <label className='flex cursor-pointer items-center justify-between gap-4 text-sm'>
                        <span>
                            Write tags to the file
                            <span className='block text-xs text-on-surface-variant'>
                                Otherwise changes only live in this app
                            </span>
                        </span>
                        <Switch checked={writeFile} onCheckedChange={setWriteFile} />
                    </label>
                </form>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant='text' size='sm'>
                            Cancel
                        </Button>
                    </DialogClose>
                    <Button size='sm' type='submit' form='tags-form' disabled={!title.trim() || !artist.trim()}>
                        Save
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

function EqualizerDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
    const [enabled, setEnabled] = React.useState(true)
    const [preset, setPreset] = React.useState('Flat')
    const [bands, setBands] = React.useState(eqPresets.Flat)

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent {...useTint('max-w-lg')}>
                <DialogHeader>
                    <DialogTitle>Equalizer</DialogTitle>
                    <DialogDescription>Shape the sound for every song on this device.</DialogDescription>
                </DialogHeader>
                <div className='flex flex-col gap-5'>
                    <label className='flex cursor-pointer items-center justify-between rounded-2xl bg-surface-container px-4 py-3 text-sm font-medium'>
                        Use equalizer
                        <Switch checked={enabled} onCheckedChange={setEnabled} />
                    </label>
                    <div className='flex flex-wrap gap-2'>
                        {Object.keys(eqPresets).map(name => (
                            <Chip
                                key={name}
                                variant='filter'
                                selected={preset === name}
                                className={cn('cursor-pointer', !enabled && 'pointer-events-none opacity-38')}
                                onClick={() => {
                                    setPreset(name)
                                    setBands(eqPresets[name])
                                }}
                            >
                                {name}
                            </Chip>
                        ))}
                        {preset === 'Custom' && (
                            <Chip variant='filter' selected>
                                Custom
                            </Chip>
                        )}
                    </div>
                    <div className='flex h-56 justify-between px-2'>
                        {eqBands.map((band, i) => (
                            <div key={band} className='flex flex-col items-center gap-2'>
                                <span className='text-xs text-on-surface-variant tabular-nums'>
                                    {bands[i] > 0 ? '+' : ''}
                                    {bands[i]} dB
                                </span>
                                <Slider
                                    orientation='vertical'
                                    variant='centered'
                                    size='small'
                                    min={-12}
                                    max={12}
                                    centerValue={0}
                                    disabled={!enabled}
                                    value={[bands[i]]}
                                    aria-label={`${band} gain`}
                                    onValueChange={([value]) => {
                                        setBands(list => list.map((v, j) => (j === i ? value : v)))
                                        setPreset('Custom')
                                    }}
                                    className='min-h-0 flex-1'
                                />
                                <span className='text-xs whitespace-nowrap text-on-surface-variant'>{band}</span>
                            </div>
                        ))}
                    </div>
                </div>
                <DialogFooter>
                    <Button
                        variant='text'
                        size='sm'
                        className='mr-auto'
                        onClick={() => {
                            setPreset('Flat')
                            setBands(eqPresets.Flat)
                        }}
                    >
                        Reset
                    </Button>
                    <DialogClose asChild>
                        <Button size='sm'>Done</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

/* ------------------------------------ Settings ------------------------------------ */

function SettingRow({
    icon,
    label,
    description,
    children,
}: {
    icon: string
    label: string
    description?: string
    children: React.ReactNode
}) {
    return (
        <label className='flex cursor-pointer items-center gap-4 py-3'>
            <i className={cn(icon, 'size-6 shrink-0 text-on-surface-variant')} />
            <span className='min-w-0 flex-1'>
                <span className='block'>{label}</span>
                {description && <span className='block text-sm text-on-surface-variant'>{description}</span>}
            </span>
            {children}
        </label>
    )
}

function SettingsSheet({
    open,
    onOpenChange,
    settings,
    onSettingsChange,
    onOpenEqualizer,
    scanning,
    onRescan,
}: {
    open: boolean
    onOpenChange: (open: boolean) => void
    settings: Settings
    onSettingsChange: (patch: Partial<Settings>) => void
    onOpenEqualizer: () => void
    scanning: boolean
    onRescan: () => void
}) {
    const { scheme, tracks } = useMusic()

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent side='right' className={cn('w-100', scheme.className)} style={scheme.style}>
                <SheetHeader>
                    <SheetTitle>Settings</SheetTitle>
                    <SheetCloseButton />
                </SheetHeader>
                <SheetDescription className='sr-only'>Appearance, playback and library preferences</SheetDescription>
                <SheetBody className='flex flex-col gap-2 pb-8'>
                    <h3 className='pt-2 text-sm font-medium text-primary'>Appearance</h3>
                    <SettingRow
                        icon='icon-[material-symbols--palette-outline]'
                        label='Colors from album art'
                        description='Tint the app with the cover of the current song'
                    >
                        <Switch
                            checked={settings.dynamicColor}
                            onCheckedChange={dynamicColor => onSettingsChange({ dynamicColor })}
                        />
                    </SettingRow>
                    <SettingRow
                        icon='icon-[material-symbols--person-outline-rounded]'
                        label='Group by album artist'
                        description='Keep featured artists on the main album'
                    >
                        <Switch
                            checked={settings.showAlbumArtist}
                            onCheckedChange={showAlbumArtist => onSettingsChange({ showAlbumArtist })}
                        />
                    </SettingRow>

                    <Divider className='my-2' />
                    <h3 className='pt-2 text-sm font-medium text-primary'>Playback</h3>
                    <SettingRow
                        icon='icon-[material-symbols--all-inclusive-rounded]'
                        label='Gapless playback'
                        description='No silence between tracks on the same album'
                    >
                        <Switch checked={settings.gapless} onCheckedChange={gapless => onSettingsChange({ gapless })} />
                    </SettingRow>
                    <div className='flex flex-col gap-3 py-3'>
                        <div className='flex items-center gap-4'>
                            <i className='icon-[material-symbols--swap-horiz-rounded] size-6 shrink-0 text-on-surface-variant' />
                            <span className='flex-1'>
                                <span className='block'>Crossfade</span>
                                <span className='block text-sm text-on-surface-variant'>
                                    {settings.crossfade === 0 ? 'Off' : `${settings.crossfade} seconds between songs`}
                                </span>
                            </span>
                        </div>
                        <div className='pl-10'>
                            <Slider
                                data-sheet-no-drag
                                min={0}
                                max={12}
                                step={1}
                                showStops
                                stops={13}
                                showValueIndicator
                                formatValue={value => `${value}s`}
                                value={[settings.crossfade]}
                                onValueChange={([crossfade]) => onSettingsChange({ crossfade })}
                                aria-label='Crossfade duration'
                            />
                        </div>
                    </div>
                    <SettingRow
                        icon='icon-[material-symbols--equalizer-rounded]'
                        label='Normalize volume'
                        description='Play every song at a similar loudness'
                    >
                        <Switch checked={settings.normalize} onCheckedChange={normalize => onSettingsChange({ normalize })} />
                    </SettingRow>
                    <Button variant='tonal' size='sm' className='ml-10 self-start' onClick={onOpenEqualizer}>
                        <i className='icon-[material-symbols--tune-rounded]' />
                        Equalizer
                    </Button>

                    <Divider className='my-4' />
                    <h3 className='text-sm font-medium text-primary'>Library</h3>
                    <p className='text-sm text-on-surface-variant'>Folders to scan for music</p>
                    <div className='flex flex-col'>
                        {Object.entries(settings.folders).map(([folder, checked]) => (
                            <label key={folder} className='flex cursor-pointer items-center gap-4 py-2'>
                                <i className='icon-[material-symbols--folder-outline-rounded] size-6 text-on-surface-variant' />
                                <span className='flex-1 font-mono text-sm'>{folder}</span>
                                <Checkbox
                                    checked={checked}
                                    onCheckedChange={value =>
                                        onSettingsChange({ folders: { ...settings.folders, [folder]: value === true } })
                                    }
                                />
                            </label>
                        ))}
                    </div>
                    <div className='mt-2 flex items-center gap-3 rounded-2xl bg-surface-container p-4'>
                        {scanning ? (
                            <Loading className='size-10' />
                        ) : (
                            <i className='icon-[material-symbols--library-music-outline-rounded] size-6 text-on-surface-variant' />
                        )}
                        <span className='flex-1 text-sm'>
                            {scanning ? 'Scanning folders…' : `${plural(tracks.length, 'song')} in your library`}
                        </span>
                        <Button size='sm' variant='text' disabled={scanning} onClick={onRescan}>
                            Rescan
                        </Button>
                    </div>
                </SheetBody>
            </SheetContent>
        </Sheet>
    )
}

/* ------------------------------------ Block ------------------------------------ */

export default function MusicPlayerBlock() {
    const [tracks, setTracks] = React.useState(initialTracks)
    const [playlists, setPlaylists] = React.useState(initialPlaylists)
    const [player, dispatch] = React.useReducer(playerReducer, initialPlayer)
    const [tab, setTab] = React.useState<Tab>('home')
    const [libraryTab, setLibraryTab] = React.useState<LibraryTab>('songs')
    const [history, setHistory] = React.useState<Detail[]>([])
    const [expanded, setExpanded] = React.useState<PlayerView | null>(null)
    const [settingsOpen, setSettingsOpen] = React.useState(false)
    const [equalizerOpen, setEqualizerOpen] = React.useState(false)
    const [settings, setSettings] = React.useState<Settings>({
        dynamicColor: true,
        gapless: true,
        crossfade: 4,
        normalize: false,
        showAlbumArtist: true,
        folders: { '/Music': true, '/Download': true, '/Recordings': false },
    })
    const [scanning, setScanning] = React.useState(false)
    const [newSongs, setNewSongs] = React.useState(0)
    const [device, setDevice] = React.useState<Device>('phone')
    const [volume, setVolume] = React.useState(72)
    const [playlistDialog, setPlaylistDialog] = React.useState<{
        mode: 'create' | 'rename'
        ids: string[]
        playlist?: Playlist
    } | null>(null)
    const [editingId, setEditingId] = React.useState<string | null>(null)
    const mainRef = React.useRef<HTMLElement>(null)

    const trackById = React.useMemo(() => new Map(tracks.map(t => [t.id, t])), [tracks])
    const current = trackById.get(player.queue[player.index]) ?? tracks[0]
    const currentAlbum = albumById.get(current.albumId)!
    const scheme = React.useMemo(
        () => schemeFor(settings.dynamicColor ? currentAlbum.hue : null),
        [settings.dynamicColor, currentAlbum.hue],
    )
    const detail = history.at(-1) ?? null

    // Playback clock
    React.useEffect(() => {
        if (!player.playing) return
        const id = window.setInterval(() => dispatch({ type: 'tick', duration: current.duration }), 1000)
        return () => window.clearInterval(id)
    }, [player.playing, current.duration])

    React.useEffect(() => {
        if (player.slept > 0) toast({ message: 'Sleep timer ended, playback paused', closable: true })
    }, [player.slept])

    React.useEffect(() => {
        mainRef.current?.scrollTo({ top: 0 })
    }, [tab, detail])

    const openDetail = React.useCallback((next: Detail) => {
        setExpanded(null)
        setHistory(list => [...list, next])
    }, [])

    const navigate = (next: Tab) => {
        setTab(next)
        setHistory([])
        if (next === 'library') setNewSongs(0)
    }

    const playTracks = React.useCallback(
        (ids: string[], options: { index?: number; source: string; shuffle?: boolean }) =>
            dispatch({ type: 'play', ids, ...options }),
        [],
    )

    const enqueue = React.useCallback(
        (ids: string[], next: boolean) => {
            dispatch({ type: 'enqueue', ids, next })
            const label = ids.length === 1 ? `“${trackById.get(ids[0])?.title}”` : plural(ids.length, 'song')
            toast({ message: next ? `${label} will play next` : `${label} added to queue` })
        },
        [trackById],
    )

    const toggleLike = React.useCallback(
        (id: string) => {
            const track = trackById.get(id)
            if (!track) return
            const flip = () => setTracks(list => list.map(t => (t.id === id ? { ...t, liked: !t.liked } : t)))
            flip()
            toast({
                message: track.liked ? 'Removed from Favorites' : 'Added to Favorites',
                action: { label: 'Undo', onClick: flip },
            })
        },
        [trackById],
    )

    const addToPlaylist = React.useCallback(
        (playlistId: string, ids: string[]) => {
            const playlist = playlists.find(p => p.id === playlistId)
            if (!playlist) return
            const fresh = ids.filter(id => !playlist.trackIds.includes(id))
            if (fresh.length === 0) {
                toast({ message: `Already in ${playlist.name}` })
                return
            }
            setPlaylists(list => list.map(p => (p.id === playlistId ? { ...p, trackIds: [...p.trackIds, ...fresh] } : p)))
            toast({
                message: `Added to ${playlist.name}`,
                action: { label: 'View', onClick: () => openDetail({ kind: 'playlist', id: playlistId }) },
            })
        },
        [playlists, openDetail],
    )

    const requestNewPlaylist = React.useCallback((ids: string[] = []) => setPlaylistDialog({ mode: 'create', ids }), [])
    const requestEditTags = React.useCallback((id: string) => setEditingId(id), [])

    const rescan = () => {
        setScanning(true)
        window.setTimeout(() => {
            setScanning(false)
            const found = scannedTracks.filter(t => !trackById.has(t.id))
            if (found.length === 0) {
                toast({ message: 'Library is up to date' })
                return
            }
            setTracks(list => [...list, ...found])
            setNewSongs(found.length)
            toast({
                message: `Found ${plural(found.length, 'new song')}`,
                action: {
                    label: 'Show',
                    onClick: () => {
                        setSettingsOpen(false)
                        setTab('library')
                        setLibraryTab('songs')
                        setHistory([])
                        setNewSongs(0)
                    },
                },
            })
        }, 1800)
    }

    // Keyboard shortcuts: space plays or pauses, arrows seek, N / P skip, L likes.
    React.useEffect(() => {
        const onKeyDown = (event: KeyboardEvent) => {
            const target = event.target as HTMLElement
            if (event.metaKey || event.ctrlKey || event.altKey) return
            if (target.closest('input, textarea, [contenteditable=true], [role=dialog], [role=menu], [role=slider]')) return
            if (event.key === ' ' && !target.closest('button, [role=button], [role=tab], [role=listitem]')) {
                event.preventDefault()
                dispatch({ type: 'toggle' })
            } else if (event.key === 'ArrowRight' && target === document.body) {
                dispatch({ type: 'seek', position: Math.min(current.duration - 1, player.position + 10) })
            } else if (event.key === 'ArrowLeft' && target === document.body) {
                dispatch({ type: 'seek', position: Math.max(0, player.position - 10) })
            } else if (event.key === 'n') {
                dispatch({ type: 'next' })
            } else if (event.key === 'p') {
                dispatch({ type: 'prev' })
            } else if (event.key === 'l') {
                toggleLike(current.id)
            }
        }
        window.addEventListener('keydown', onKeyDown)
        return () => window.removeEventListener('keydown', onKeyDown)
    }, [current, player.position, toggleLike])

    const context: MusicContextValue = {
        tracks,
        trackById,
        playlists,
        player,
        current,
        shuffle: player.original !== null,
        settings,
        scheme,
        dispatch,
        playTracks,
        enqueue,
        toggleLike,
        addToPlaylist,
        openDetail,
        requestNewPlaylist,
        requestEditTags,
        device,
        setDevice,
        volume,
        setVolume,
    }

    const titles: Record<Tab, string> = { home: 'Good evening', search: 'Search', library: 'Library' }

    let content: React.ReactNode
    if (detail?.kind === 'album') content = <AlbumDetail album={albumById.get(detail.id)!} />
    else if (detail?.kind === 'artist') content = <ArtistDetail name={detail.id} />
    else if (detail?.kind === 'genre') content = <GenreDetail genre={detail.id} />
    else if (detail?.kind === 'playlist')
        content = (
            <PlaylistDetail
                id={detail.id}
                onRename={playlist => setPlaylistDialog({ mode: 'rename', ids: [], playlist })}
                onDelete={playlist => {
                    const index = playlists.indexOf(playlist)
                    setPlaylists(list => list.filter(p => p.id !== playlist.id))
                    setHistory(list => list.slice(0, -1))
                    toast({
                        message: `Deleted “${playlist.name}”`,
                        action: {
                            label: 'Undo',
                            onClick: () => setPlaylists(list => [...list.slice(0, index), playlist, ...list.slice(index)]),
                        },
                    })
                }}
                onReorder={(playlistId, from, to) =>
                    setPlaylists(list =>
                        list.map(p => (p.id === playlistId ? { ...p, trackIds: move(p.trackIds, from, to) } : p)),
                    )
                }
                onRemoveTrack={(playlistId, index) => {
                    const snapshot = playlists
                    setPlaylists(list =>
                        list.map(p => (p.id === playlistId ? { ...p, trackIds: p.trackIds.filter((_, i) => i !== index) } : p)),
                    )
                    toast({
                        message: 'Removed from playlist',
                        action: { label: 'Undo', onClick: () => setPlaylists(snapshot) },
                    })
                }}
            />
        )
    else if (tab === 'home') content = <HomeView />
    else if (tab === 'search') content = <SearchView />
    else content = <LibraryView tab={libraryTab} onTabChange={setLibraryTab} onNewPlaylist={() => requestNewPlaylist()} />

    return (
        <MusicContext.Provider value={context}>
            <div
                style={scheme.style}
                className={cn(
                    scheme.className,
                    '@container/app relative flex h-full w-full overflow-hidden bg-surface-container text-on-surface transition-colors duration-700',
                )}
            >
                {/* Medium and up: navigation rail */}
                <div className='hidden @3xl/app:flex'>
                    <NavigationRail variant='modal' contained>
                        <NavigationRailContent className='pt-4'>
                            {destinations.map(d => (
                                <NavigationRailItem
                                    key={d.value}
                                    active={tab === d.value}
                                    icon={
                                        <span className='relative flex'>
                                            <i className={cn(tab === d.value ? d.activeIcon : d.icon, 'size-6')} />
                                            {d.value === 'library' && newSongs > 0 && (
                                                <Badge className='absolute -top-1 -right-2'>{newSongs}</Badge>
                                            )}
                                        </span>
                                    }
                                    onClick={() => navigate(d.value)}
                                >
                                    {d.label}
                                </NavigationRailItem>
                            ))}
                        </NavigationRailContent>
                    </NavigationRail>
                </div>

                <div className='flex min-w-0 flex-1 flex-col overflow-hidden'>
                    {/* Top app bar */}
                    <header className='flex h-16 shrink-0 items-center gap-1 px-2 @3xl/app:pl-0'>
                        {detail ? (
                            <IconButton label='Back' onClick={() => setHistory(list => list.slice(0, -1))}>
                                <i className='icon-[material-symbols--arrow-back-rounded] size-6' />
                            </IconButton>
                        ) : (
                            <span className='flex size-12 items-center justify-center @3xl/app:hidden'>
                                <i className='icon-[material-symbols--graphic-eq-rounded] size-7 text-primary' />
                            </span>
                        )}
                        <h1 className='min-w-0 flex-1 truncate text-[22px] leading-7 @3xl/app:pl-2'>
                            {detail ? '' : titles[tab]}
                        </h1>
                        <IconButton
                            label='Search'
                            className={cn(tab === 'search' && !detail && 'hidden')}
                            onClick={() => navigate('search')}
                        >
                            <i className='icon-[material-symbols--search-rounded] size-6' />
                        </IconButton>
                        <IconButton label='Settings' onClick={() => setSettingsOpen(true)}>
                            <i className='icon-[material-symbols--settings-outline-rounded] size-6' />
                        </IconButton>
                        <Avatar className='mx-2 size-9'>
                            <AvatarFallback>A</AvatarFallback>
                        </Avatar>
                    </header>

                    <div className='flex min-h-0 flex-1'>
                        <main
                            ref={mainRef}
                            className='@container min-w-0 flex-1 overflow-y-auto bg-surface px-4 pt-6 pb-10 @3xl/app:rounded-tl-3xl @3xl/app:px-8 @6xl/app:rounded-tr-3xl'
                        >
                            <div
                                key={`${tab}-${history.length}`}
                                className='mx-auto max-w-5xl animate-in duration-300 fade-in slide-in-from-bottom-2'
                            >
                                {content}
                            </div>
                        </main>
                        <div className='hidden w-4 shrink-0 @6xl/app:block' />
                        <NowPlayingPane onExpand={setExpanded} />
                    </div>

                    <div className='bg-surface pt-2 @3xl/app:bg-transparent'>
                        <MiniPlayer onExpand={() => setExpanded('cover')} />
                    </div>

                    {/* Compact widths: navigation bar replaces the rail */}
                    <NavigationBar className='shrink-0 @3xl/app:hidden'>
                        {destinations.map(d => (
                            <NavigationBarItem
                                key={d.value}
                                asChild
                                active={tab === d.value}
                                icon={
                                    <span className='relative flex'>
                                        <i className={cn(tab === d.value ? d.activeIcon : d.icon, 'size-6')} />
                                        {d.value === 'library' && newSongs > 0 && (
                                            <Badge className='absolute -top-1 -right-2'>{newSongs}</Badge>
                                        )}
                                    </span>
                                }
                            >
                                <button type='button' onClick={() => navigate(d.value)}>
                                    {d.label}
                                </button>
                            </NavigationBarItem>
                        ))}
                    </NavigationBar>
                </div>

                {expanded && <FullPlayer view={expanded} onClose={() => setExpanded(null)} />}

                <SettingsSheet
                    open={settingsOpen}
                    onOpenChange={setSettingsOpen}
                    settings={settings}
                    onSettingsChange={patch => setSettings(value => ({ ...value, ...patch }))}
                    onOpenEqualizer={() => setEqualizerOpen(true)}
                    scanning={scanning}
                    onRescan={rescan}
                />
                <EqualizerDialog open={equalizerOpen} onOpenChange={setEqualizerOpen} />
                <PlaylistDialog
                    open={!!playlistDialog}
                    onOpenChange={open => !open && setPlaylistDialog(null)}
                    mode={playlistDialog?.mode ?? 'create'}
                    initialName={playlistDialog?.playlist?.name ?? ''}
                    songCount={playlistDialog?.ids.length ?? 0}
                    onSubmit={(name, description) => {
                        if (!playlistDialog) return
                        if (playlistDialog.mode === 'rename' && playlistDialog.playlist) {
                            const id = playlistDialog.playlist.id
                            setPlaylists(list => list.map(p => (p.id === id ? { ...p, name } : p)))
                            toast({ message: `Renamed to “${name}”` })
                        } else {
                            const id = `pl-${Date.now()}`
                            setPlaylists(list => [...list, { id, name, description, trackIds: playlistDialog.ids }])
                            toast({
                                message: `Created “${name}”`,
                                action: { label: 'View', onClick: () => openDetail({ kind: 'playlist', id }) },
                            })
                        }
                        setPlaylistDialog(null)
                    }}
                />
                <EditTagsDialog
                    track={editingId ? (trackById.get(editingId) ?? null) : null}
                    onOpenChange={open => !open && setEditingId(null)}
                    onSave={(id, patch) => {
                        setTracks(list => list.map(t => (t.id === id ? { ...t, ...patch } : t)))
                        setEditingId(null)
                        toast({ message: 'Tags saved' })
                    }}
                />
            </div>
        </MusicContext.Provider>
    )
}
