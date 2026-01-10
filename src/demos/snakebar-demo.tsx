import { Button } from '@/components/ui/button'
import { toast } from '@/components/ui/snakebar'

export function SnakebarDemo() {
    return (
        <div className='flex flex-col gap-4'>
            <h3>Snakebar</h3>
            <div className='mb-6 flex flex-wrap items-center gap-4'>
                <Button onClick={() => toast({ message: 'Single-line snackbar with icon', closable: true })}>Click me</Button>
                <Button
                    variant={'tonal'}
                    onClick={() =>
                        toast({ message: 'Single-line snackbar with icon', action: { label: 'undo', onClick() {} } })
                    }
                >
                    Click me
                </Button>
            </div>
        </div>
    )
}
