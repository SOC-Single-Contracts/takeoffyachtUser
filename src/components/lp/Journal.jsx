"use client"
import React, { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import BlogItem from '../../app/blogs/blogs/BlogItem'
import Link from 'next/link'
import { getAllBlogs } from '@/api/blogs'
import { useToast } from '@/hooks/use-toast'
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselPrevious, 
  CarouselNext 
} from "@/components/ui/carousel"

const Journal = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await getAllBlogs();
        console.log('Fetched Blogs Response:', response);
        
        // Check if response has data and status is true
        if (response.status && response.data && response.data.length > 0) {
          setBlogs(response.data.slice(0, 6));
        } else {
          console.warn('No blogs found or invalid response');
          setBlogs([]);
        }
      } catch (error) {
        console.error('Error in fetchBlogs:', error);
        toast({
          title: "Error Fetching Blogs",
          description: "Unable to retrieve blog posts. Please try again later.",
          variant: "destructive"
        });
        setBlogs([]);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, [toast]);


  return (
    <section className="py-10 md:py-16">
      <div className="max-w-5xl px-4 mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="md:text-[40px] text-[32px] font-bold tracking-tight sm:text-4xl">
            Journal
          </h2>
        </div>

        <Carousel 
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent>
            {loading ? (
              <>
                {[1, 2, 3].map((_, index) => (
                  <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                    <BlogItem loading={true} />
                  </CarouselItem>
                ))}
              </>
            ) : blogs.length > 0 ? (
              blogs.map((blog, index) => (
                <CarouselItem 
                  key={blog.ID || `blog-${index}`} 
                  className="md:basis-1/2 lg:basis-1/3"
                >
                  <BlogItem blog={blog} loading={false} />
                </CarouselItem>
              ))
            ) : (
              <div className="w-full flex justify-center items-center py-10">
                <p className="text-gray-500 text-center">
                  No blog posts available at the moment. 
                  <br />
                  Check back later for exciting updates!
                </p>
              </div>
            )}
          </CarouselContent>
          {blogs.length > 0 && (
            <>
              <CarouselPrevious className="left-[-12] top-1/3" />
              <CarouselNext className="md:right-[-12] right-0 top-1/3" />
            </>
          )}
        </Carousel>
        <Link href="/blogs">
        <Button variant="outline" className="text-black mt-4 hover:underline font-semibold uppercase md:text-[16px] hover:shadow-2xl transition duration-500 ease-in-out dark:text-white text-[12px] rounded-full flex items-center group">
            See All
            <svg
              className="w-4 ml-1 transition-transform duration-300 ease-in-out group-hover:translate-x-1"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </Button>
          </Link>
      </div>
    </section>
  );
};

export default Journal;