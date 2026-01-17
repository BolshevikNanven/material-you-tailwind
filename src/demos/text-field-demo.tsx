import { TextField } from '@/components/ui/text-field'

export function TextFieldDemo() {
    return (
        <div className='flex flex-col gap-4'>
            <h3>TextField</h3>
            <div className='mb-6 flex flex-wrap items-center gap-4'>
                <TextField
                    label='Label text'
                    placeholder='Placeholder'
                    helperText='Supporting Text'
                    startIcon={<i className='icon-[material-symbols--search-rounded]' />}
                    endIcon={<i className='icon-[material-symbols--close-rounded]' />}
                    className='w-75'
                    error
                />
                <TextField label='Label text' placeholder='Placeholder' helperText='Supporting Text' className='w-75' />
                <TextField placeholder='Placeholder' helperText='Supporting Text' className='w-75' />
                <TextField variant='filled' label='Label text' placeholder='Placeholder' helperText='Supporting Text' />
            </div>
        </div>
    )
}
