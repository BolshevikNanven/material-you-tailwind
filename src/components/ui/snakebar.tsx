'use client'

import { cn } from '@/lib/utils'
import { toast as sonnerToast, Toaster as Sonner, type ToasterProps } from 'sonner'

interface ToastProps {
    id: string | number
    message: string
    action?: {
        label: string
        onClick: () => void
    }
    closable?: boolean
}
function toast({ message, action, closable }: Omit<ToastProps, 'id'>) {
    return sonnerToast.custom(id => (
        <div className='flex h-12 w-full items-center rounded-sm bg-inverse-surface text-sm text-inverse-on-surface shadow-elevation-3 md:max-w-91'>
            <p className='flex flex-1 items-center px-4 text-sm'>{message}</p>
            {action && (
                <button
                    className={cn(
                        'flex h-10 cursor-pointer items-center rounded-full px-3 text-inverse-primary transition-colors hover:bg-inverse-primary/8 active:bg-inverse-primary/10',
                        !closable && 'mr-2',
                    )}
                    onClick={() => {
                        action.onClick()
                        sonnerToast.dismiss(id)
                    }}
                >
                    {action.label}
                </button>
            )}
            {closable && (
                <button
                    className='m-1 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-inverse-on-surface hover:bg-inverse-on-surface/8 active:bg-inverse-on-surface/10'
                    onClick={() => sonnerToast.dismiss(id)}
                >
                    <i className='icon-[material-symbols--close-rounded] size-4' />
                </button>
            )}
        </div>
    ))
}

const Snakebar = ({ ...props }: ToasterProps) => (
    <Sonner className='toaster group' position='bottom-right' expand visibleToasts={5} {...props} />
)

export { toast, Snakebar }
