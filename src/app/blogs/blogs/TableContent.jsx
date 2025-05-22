"use client";
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { ArrowRight, Copy, Linkedin, ShareIcon, User } from 'lucide-react'
import React from 'react'
import SuggesstionBlog from './SuggesstionBlog'
import { useToast } from '@/hooks/use-toast'
import Image from 'next/image'

const TableContent = ({ sections, blog }) => {
  const { toast } = useToast()

  const handleCopyLink = () => {
    const currentUrl = window.location.href
    navigator.clipboard.writeText(currentUrl)
    toast({
      title: "Link Copied!",
      description: "The blog link has been copied to your clipboard.",
    })
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: blog?.title,
          text: `Check out this blog: ${blog?.title}`,
          url: window.location.href,
        })
      } catch (error) {
        console.error('Error sharing:', error)
      }
    } else {
      handleCopyLink()
    }
  }

  return (
    <>
      <section className='mt-4 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8'>
      <Tabs defaultValue={sections[0]?.id} className="flex flex-col-reverse lg:flex-row justify-between items-start w-full">



          {/* Content Area */}
          <div className='flex-1 mt-10 lg:mt-0 lg:ml-8 w-full max-w-full lg:max-w-[600px]'>
            {/* <div className='w-full lg:max-w-[220px] h-full '>
            <TabsList className="flex flex-row lg:flex-col gap-2 h-[70px] lg:h-0 bg-transparent shadow-none items-start mt-6 overflow-x-auto lg:overflow-visible">
              {sections.map((section) => (
                <TabsTrigger
                  className='bg-transparent shadow-none border-l-4 lg:border-l-4 border-t-4 lg:border-t-0 border-[#BEA355] rounded-none flex-shrink-0'
                  key={section.id}
                  value={section.id}
                >
                  <p className='text-[#BEA355] text-sm text-start font-medium whitespace-nowrap lg:whitespace-normal'>{section.title}</p>
                </TabsTrigger>
              ))}
            </TabsList>
          </div> */}
            {sections.map((section, index) => (
              <div
                key={index}
                className="bg-[#f9f6ef]  border-[#BEA355] rounded shadow-sm mb-6"
              >
                {/* Background heading */}
                <div className="bg-[#BEA355] px-4 py-2">
                  <h3 className="text-white text-sm font-semibold">{section.title}</h3>
                </div>

                {/* Main content */}
                {/* <div className="p-4">
                  <p className="text-sm text-gray-700">{section.content}</p>
                </div> */}
              </div>
            ))}


            {sections.map((section) => (
              <TabsContent key={section.id} value={section.id}>
                <div dangerouslySetInnerHTML={{ __html: section.content }} className="prose max-w-none" />
              </TabsContent>
            ))}
          </div>

          <div className='flex-1 mt-6 lg:mt-0 lg:ml-8 w-full max-w-full lg:max-w-[200px]'>
            <div className='flex flex-col items-center justify-center'>
              <div className='w-full max-w-[130px] h-[120px] bg-slate-100 rounded-md flex items-center justify-center'>
                <User className='w-12 h-12 text-gray-500' />
                {/* <Image
                  width={100}
                  height={100}
                  className='w-full max-w-[130px] h-[120px]'
                 src="/assets/images/userIconImage.jpg"     onError={(e) => {
            e.target.src = '/assets/images/Imagenotavailable.png';
          }} alt="user"/> */}
              </div>
              <h6 className='text-black dark:text-white mt-2 text-lg font-semibold'>{blog?.author_name || 'Author'}</h6>
              <p className='text-gray-700 dark:text-gray-400 text-xs'>Content Writer</p>
              {/* <a href="#" className="inline-block text-[#BEA355] hover:text-[#9a8544]">
                <Linkedin className='h-6 w-6' />
              </a> */}
            </div>
            {/* <Separator className='my-2' />
            <div className='space-y-2'>
              <h5 className="font-semibold text-lg mb-2">Related Topics</h5>
              {blog?.tags.split(',').map((tag, index) => (
                <div className='' key={index}>
                  <h6 className='text-black dark:text-white text-md font-medium capitalize'>{tag.trim()}</h6>
                  <Button className='text-[#BEA355] dark:text-[#BEA355] text-xs font-medium pl-0 hover:pl-2 transition-all duration-300 ease-in-out hover:bg-[#BEA355] hover:text-white bg-transparent shadow-none uppercase flex items-center'>
                    View Posts <ArrowRight className='ml-1' />
                  </Button>
                </div>
              ))}
            </div>
            <Separator className='my-3' />
            <div className='flex overflow-hidden gap-1 flex-wrap'>
              {blog?.meta_tags.split(',').map((tag, index) => (
                <Button key={index} className="rounded-full truncate ellipsis text-xs bg-white dark:bg-black text-black dark:text-white hover:text-white">
                  {tag.trim()}
                </Button>
              ))}
            </div>
            <Separator className='my-3' /> */}
            <div className='flex flex-col items-center mt-10 justify-start space-y-2'>
              <Button
                onClick={handleCopyLink}
                className="rounded-full w-full text-xs font-medium bg-white text-black hover:text-white flex items-center justify-center"
              >
                Copy Link <Copy className='w-4 h-4 ml-1' />
              </Button>
              <Button
                onClick={handleShare}
                className="rounded-full w-full text-xs font-medium bg-[#BEA355] text-white hover:text-white flex items-center justify-center"
              >
                Share Article <ShareIcon className='w-4 h-4 ml-1' />
              </Button>
            </div>
          </div>
        </Tabs>
      </section>
      {/* <SuggesstionBlog currentBlogId={blog?.ID} tags={blog?.tags} /> */}
    </>
  )
}

export default TableContent