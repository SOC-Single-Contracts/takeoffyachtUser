import React, { useEffect, useState } from 'react';
import { BookOpen, PenLine } from 'lucide-react';
import { Button } from '@/components/ui/button';
import BlogItem from './BlogItem';
import { getAllBlogs } from '@/api/blogs';
import { Loading } from '@/components/ui/loading';

const EmptyBlogState = () => {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
      <BookOpen className="w-24 h-24 text-[#BEA355] mb-6" />
      <h2 className="text-2xl font-bold mb-4 text-gray-800">No Blogs Available</h2>
      <p className="text-gray-600 mb-6 max-w-md">
        We're curating exciting yacht stories and travel experiences. 
        Check back soon for our latest blog posts about luxury yacht adventures!
      </p>
      <div className="flex space-x-4">
        <Button 
          variant="outline" 
          className="rounded-full border-[#BEA355] text-[#BEA355] hover:bg-[#BEA355]/10"
        >
          <PenLine className="mr-2 w-4 h-4" />
          Suggest a Topic
        </Button>
        <Button 
          className="rounded-full bg-[#BEA355] hover:bg-[#a68f4b]"
        >
          Explore Yachts
        </Button>
      </div>
    </div>
  );
};

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await getAllBlogs();
        
        // Check if response has data and status is true
        if (response.status && response.data && response.data.length > 0) {
          setBlogs(response.data);
        } else {
          console.warn('No blogs found or invalid response');
          setBlogs([]);
        }
      } catch (error) {
        console.error('Error fetching blogs:', error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  if (loading) {
    return <Loading />;
  }

  if (error || !blogs) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500">Error loading blogs. Please try again later.</p>
      </div>
    );
  }

  if (blogs.length === 0) {
    return <EmptyBlogState />;
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 my-14 md:my-16 lg:my-24">
      {blogs.map((blog) => (
        <BlogItem 
          key={blog.ID} 
          blog={{
            ...blog,
            id: blog.ID,
            title: blog.title,
            content: blog.content,
            author: blog.author_name,
            image: blog.thumbnail_image,
            date: blog.created_at
          }} 
        />
      ))}
    </div>
  );
};

export default BlogList;