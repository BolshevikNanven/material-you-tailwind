import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export function AvatarDemo() {
    return (
        <div className='flex flex-col gap-4'>
            <h3>Avatar</h3>
            <div className='mb-6 flex flex-wrap items-center gap-4'>
                <Avatar>
                    <AvatarImage src={'https://github.com/bolsheviknanven.png'} alt='avatar' />
                    <AvatarFallback>A</AvatarFallback>
                </Avatar>
            </div>
        </div>
    )
}
