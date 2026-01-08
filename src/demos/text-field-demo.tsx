import { TextField } from '@/components/ui/text-field'
import { Search, XCircle } from 'lucide-react'

export function TextFieldDemo() {
    return (
        <div className='flex flex-col gap-4'>
            <h3>TextField</h3>
            <div className='mb-6 flex flex-wrap items-center gap-4'>
                <TextField
                    label='Label text'
                    placeholder='Placeholder'
                    helperText='Supporting Text'
                    startIcon={<Search />}
                    endIcon={<XCircle />}
                    className='w-75'
                    error
                />
                <TextField
                    variant='filled'
                    label='Label text'
                    placeholder='Placeholder'
                    helperText='Supporting Text'
                    startIcon={<Search />}
                />
            </div>
        </div>
    )
}
