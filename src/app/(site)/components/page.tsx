import { Card, CardContent } from '@/components/ui/card'
import { componentsSource } from '@/lib/source'
import Link from 'next/link'

export default function ComponentsOverviewPage() {
    const components = componentsSource.getPages()
    const grouped = components.reduce(
        (acc, component) => {
            const firstLetter = component.data.title[0].toUpperCase()
            if (!acc[firstLetter]) {
                acc[firstLetter] = []
            }
            acc[firstLetter].push(component)
            return acc
        },
        {} as Record<string, typeof components>,
    )

    const sortedKeys = Object.keys(grouped).sort()

    return (
        <div className='mx-auto flex h-full w-full max-w-221 flex-col px-8'>
            <header className='mt-28'>
                <h3 className='text-6xl'>Components</h3>
                <div className='mt-4 flex'>
                    <p className='mr-10 text-xl text-on-surface-variant'>
                        A collection of all the components available in the library.
                    </p>
                </div>
            </header>
            <div className='mt-8 flex flex-col gap-8 pb-10'>
                {sortedKeys.map(key => (
                    <div key={key}>
                        <h4 className='pb-2 text-lg font-medium text-on-surface'>{key}</h4>
                        <div className='grid grid-cols-3 gap-4'>
                            {grouped[key].map(component => (
                                <Card key={component.url} actionable asChild>
                                    <Link href={component.url}>
                                        <CardContent>
                                            <p className='font-medium'>{component.data.title}</p>
                                        </CardContent>
                                    </Link>
                                </Card>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
