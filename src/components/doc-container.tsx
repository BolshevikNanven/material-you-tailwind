import DocList from '@/components/doc-list'

export default function DocContainer({
    children,
    data,
}: {
    children: React.ReactNode
    data: { title: string; href: string }[]
}) {
    return (
        <div className='flex h-full w-full rounded-l-3xl bg-surface'>
            <div className='flex h-full w-60 shrink-0 flex-col overflow-y-auto p-2'>
                <DocList data={data} />
            </div>
            <div className='flex flex-1 overflow-auto'>{children}</div>
        </div>
    )
}
