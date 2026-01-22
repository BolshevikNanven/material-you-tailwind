import { Loading } from "@/components/ui/loading";

export default function RootLoading() {
    return (
        <div className='flex h-screen w-full flex-col overflow-hidden rounded-l-3xl bg-surface'>
            <Loading className=" m-auto size-20" />
        </div>
    )
}