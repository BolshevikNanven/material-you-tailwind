import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export function AvatarDemo() {
    return (
        <Avatar>
            <AvatarImage src={'https://github.com/bolsheviknanven.png'} alt='avatar' />
            <AvatarFallback>A</AvatarFallback>
        </Avatar>
    )
}
