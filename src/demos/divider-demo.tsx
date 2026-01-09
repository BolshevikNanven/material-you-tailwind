import { Divider } from "@/components/ui/divider";

export function DividerDemo() {
    return (
        <div className='flex flex-col gap-4'>
            <h3>Divider</h3>
            <div className='mb-6 flex flex-wrap items-center gap-4'>
                <Divider />
            </div>
        </div>
    )
}
