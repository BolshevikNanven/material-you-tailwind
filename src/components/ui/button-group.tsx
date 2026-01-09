import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonGroupVariants = cva('flex', {
    variants: {
        variant: {
            standard: [
                'gap-2 *:active:scale-x-110 *:data-[square=false]:active:rounded-xl *:data-[square=true]:active:rounded-full',
                '*:data-[state=on]:rounded-xl',
            ],
            connected: [
                'gap-0.5 *:not-first:not-last:rounded-lg *:first:rounded-r-lg *:last:rounded-l-lg',
                '*:data-[state=on]:rounded-[40px]!',
            ],
        },
    },
    defaultVariants: {
        variant: 'standard',
    },
})
function ButtonGroup({ variant, className, ...props }: React.ComponentProps<'div'> & VariantProps<typeof buttonGroupVariants>) {
    return <div role='group' data-slot='button-group' className={cn(buttonGroupVariants({ variant }), className)} {...props} />
}

export { ButtonGroup }
