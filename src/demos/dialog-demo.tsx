import { Trash2 } from 'lucide-react'
import { Button } from '../components/ui/button'

import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { TextField } from '@/components/ui/text-field'

export function DialogDemo() {
    return (
        <div className='flex flex-col gap-4'>
            <h3>Dialog</h3>
            <div className='mb-6 flex flex-wrap items-center gap-4'>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button square size='sm' variant='elevated'>
                            Open Dialog(centered)
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader center>
                            <Trash2 />
                            <DialogTitle>Delete Settings?</DialogTitle>
                            <DialogDescription>
                                This action cannot be undone. This will permanently delete your account and remove your data
                                from our servers.
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button variant='text' size='sm'>
                                    Action1
                                </Button>
                            </DialogClose>
                            <Button size='sm'>Action2</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button square size='sm' variant='elevated'>
                            Open Dialog
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Are you absolutely sure?</DialogTitle>
                            <DialogDescription>
                                This action cannot be undone. This will permanently delete your account and remove your data
                                from our servers.
                            </DialogDescription>
                        </DialogHeader>
                        <TextField className='w-full' label='Label Text' helperText='type "im sure" to continue'/>
                        <DialogFooter>
                            <DialogClose>
                                <Button variant='text' size='sm'>
                                    Action1
                                </Button>
                            </DialogClose>
                            <Button size='sm'>Action2</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    )
}
