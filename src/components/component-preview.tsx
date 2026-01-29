'use client'

export default function ComponentPreview({ children }: { children: React.ReactNode }) {
    return (
        <div className='flex flex-col'>
            <div>{children}</div>
            <div></div>
        </div>
    )
}
