import { blogs } from '@/app/data';
import React from 'react';
import DetailedBlog from './DetailedBlog';

const BlogDetails = () => {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {blogs.map(blog => (
        <DetailedBlog key={blog.id} blog={blog} />
      ))}
    </div>
  );
};

export default BlogDetails;