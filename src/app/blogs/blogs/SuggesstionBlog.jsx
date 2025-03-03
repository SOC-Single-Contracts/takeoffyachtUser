import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { getRelatedBlogs } from '@/api/blogs';
import Link from 'next/link';
import { Loading } from '@/components/ui/loading';
import { useToast } from '@/hooks/use-toast';

const SuggesstionBlog = ({ currentBlogId, tags }) => {
  const [relatedBlogs, setRelatedBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchRelatedBlogs = async () => {
      try {
        // Only fetch related blogs if tags exist
        if (!tags) {
          setRelatedBlogs([]);
          return;
        }

        const blogs = await getRelatedBlogs(currentBlogId, tags);
        
        // If no related blogs found, show a toast
        if (blogs.length === 0) {
          toast({
            title: "No Related Blogs",
            description: "We couldn't find any related blogs at the moment.",
            variant: "default"
          });
        }

        setRelatedBlogs(blogs);
      } catch (error) {
        toast({
          title: "Error Fetching Related Blogs",
          description: "Unable to retrieve related blogs.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchRelatedBlogs();
  }, [currentBlogId, tags, toast]);

  if (loading) {
    return (
      <section className='px-4 py-12 sm:px-6 lg:px-8 lg:py-20'>
        <div className='mt-16 mx-auto container'>
          <h1 className='text-black text-2xl sm:text-3xl font-semibold mb-8 capitalize text-center'>You might also like...</h1>
          <div className='flex justify-center'>
            <Loading />
          </div>
        </div>
      </section>
    );
  }

  if (relatedBlogs.length === 0) {
    return null;
  }

  return (
    <section className='px-4 py-12 sm:px-6 lg:px-8 lg:py-20'>
      <div className='mt-16 mx-auto max-w-5xl'>
        <h1 className='text-black dark:text-white text-2xl sm:text-3xl font-semibold mb-8 capitalize text-center'>You might also like...</h1>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 place-items-center justify-items-center gap-6 sm:gap-8 lg:gap-4'>
          {relatedBlogs.map((blog) => (
            <div key={blog.ID} className='bg-white dark:bg-gray-800 w-full max-w-[350px] overflow-hidden h-[340px] rounded-2xl shadow-lg flex flex-col'>
              <div className='relative w-full h-48 sm:h-56 lg:h-64'>
                {blog.thumbnail_image ? (
                  <Image 
                    src={blog.thumbnail_image} 
                    className='object-cover' 
                    alt={blog.title}
                    width={350}
                    height={221}
                    quality={100}
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                    <p className="text-gray-500 dark:text-gray-400 text-sm">No image available</p>
                  </div>
                )}
              </div>
              <div className='p-4 flex flex-col flex-grow'>
                <h2 className='text-black dark:text-white text-sm sm:text-xl font-semibold mb-2 capitalize line-clamp-2'>{blog.title}</h2>
                <div className='mt-1 text-sm text-gray-600 dark:text-gray-400 mb-2'>
                  <p>{new Date(blog.created_at).toLocaleDateString()}</p>
                </div>
                <div className='mt-auto flex items-center justify-start gap-2'>
                  <Link href={`/blogs/${blog.ID}`}>
                    <Button className='rounded-full text-xs sm:text-sm bg-transparent text-[#BEA355] font-semibold shadow-none hover:text-white capitalize flex items-center'>
                      Read More <ArrowRight className='w-4 h-4 sm:w-5 sm:h-5 ml-1' />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SuggesstionBlog;