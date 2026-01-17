import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export function TabsDemo() {
    return (
        <div className='flex flex-col gap-4'>
            <h3>Tabs</h3>
            <div className='mb-6 flex flex-wrap items-center gap-12'>
                <Tabs defaultValue='Video' className='w-100'>
                    <TabsList>
                        <TabsTrigger value='Video' icon={<i className='icon-[material-symbols--videocam-outline-rounded]' />}>
                            Video
                        </TabsTrigger>
                        <TabsTrigger value='Photos' icon={<i className='icon-[material-symbols--image-outline-rounded]' />}>
                            Photos
                        </TabsTrigger>
                        <TabsTrigger
                            value='Audio'
                            icon={<i className='icon-[material-symbols--library-music-outline-rounded]' />}
                        >
                            Audio
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent value='Video'>Video</TabsContent>
                    <TabsContent value='Photos'>Photos</TabsContent>
                    <TabsContent value='Audio'>Audio</TabsContent>
                </Tabs>
                <Tabs defaultValue='Video' className='w-100'>
                    <TabsList variant='secondary'>
                        <TabsTrigger value='Video'>Video</TabsTrigger>
                        <TabsTrigger value='Photos'>Photos</TabsTrigger>
                        <TabsTrigger value='Audio'>Audio</TabsTrigger>
                    </TabsList>
                    <TabsContent value='Video'>Video</TabsContent>
                    <TabsContent value='Photos'>Photos</TabsContent>
                    <TabsContent value='Audio'>Audio</TabsContent>
                </Tabs>
            </div>
        </div>
    )
}
