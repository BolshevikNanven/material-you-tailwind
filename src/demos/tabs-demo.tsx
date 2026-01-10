import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Image, Music2, Video } from 'lucide-react'

export function TabsDemo() {
    return (
        <div className='flex flex-col gap-4'>
            <h3>Tabs</h3>
            <div className='mb-6 flex flex-wrap items-center gap-12'>
                <Tabs defaultValue='Video' className='w-100'>
                    <TabsList>
                        <TabsTrigger value='Video' icon={<Video />}>
                            Video
                        </TabsTrigger>
                        <TabsTrigger value='Photos' icon={<Image />}>
                            Photos
                        </TabsTrigger>
                        <TabsTrigger value='Audio' icon={<Music2 />}>
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
