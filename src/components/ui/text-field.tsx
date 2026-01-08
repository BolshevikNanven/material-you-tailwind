'use client'

function TextField({ ...props }: React.ComponentProps<'input'>) {
    return (
        <div>
            <input {...props} />
        </div>
    )
}

export { TextField }
