import { TextField } from '@/components/ui/text-field'
import { Search, XCircle } from 'lucide-react'

export function TextFieldDemo() {
    return (
        <>
            <h3>TextField</h3>
            <div className='mb-6 flex flex-wrap items-center gap-4'>
                <TextField label='Label text' placeholder='Placeholder' helperText='Supporting Text' startIcon={<Search />} endIcon={<XCircle />} />
                <TextField variant='filled' label='Label text' placeholder='Placeholder' error errorText='Error!!' startIcon={<Search />}/>
            </div>
        </>
    )
}
