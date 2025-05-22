import React, { useEffect, useState } from 'react'
import Hero from './Hero'
import TableContent from './TableContent'
import { getBlogDetail } from '@/api/blogs'
import { Loading } from '@/components/ui/loading'
import { useToast } from '@/hooks/use-toast'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

const DetailedBlog = ({ blogId }) => {
  const [blog, setBlog] = useState(null)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  const parseBlogContent = (content) => {
    const tempDiv = document.createElement('div')
    tempDiv.innerHTML = content

    const headers = tempDiv.getElementsByTagName('h2')

    return [{
      id: 'main',
      title: 'Blog Content',
      content: content
    }]
    
    if (headers.length === 0) {
      return [{
        id: 'main',
        title: 'Blog Content',
        content: content
      }]
    }

    return Array.from(headers).map((header, index) => {
      const sectionId = `section-${index}`
      const title = header.textContent
      
      let sectionContent = []
      let currentElement = header.nextElementSibling
      
      while (currentElement && currentElement.tagName !== 'H2') {
        sectionContent.push(currentElement.outerHTML)
        currentElement = currentElement.nextElementSibling
      }

      return {
        id: sectionId,
        title: title,
        content: sectionContent.join('')
      }
    })
  }

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const data = await getBlogDetail(blogId)
        setBlog(data)
      } catch (error) {
        toast({
          title: "Error Fetching Blog",
          description: "Unable to retrieve blog details. Please try again later.",
          variant: "destructive"
        });
      } finally {
        setLoading(false)
      }
    }
    fetchBlog()
  }, [blogId, toast])

  if (loading) {
    return <Loading />
  }

  if (!blog) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center text-center p-4">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">
          Blog Not Found
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          The blog you are looking for might have been removed or is temporarily unavailable.
        </p>
        <Link href="/blogs">
          <Button variant="outline" className="rounded-full">
            Browse All Blogs
          </Button>
        </Link>
      </div>
    )
  }

  const sections = parseBlogContent(blog.content)


  //test
  // console.log("sections,blog",sections,blog)


  return (
    <>
      <Hero blog={blog} />
      <div className="max-w-5xl mx-auto px-2 py-4 md:py-8">
        <TableContent sections={sections} blog={blog} />
      </div>
    </>
  )
}

export default DetailedBlog
