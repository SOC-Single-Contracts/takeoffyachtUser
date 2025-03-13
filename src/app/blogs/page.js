"use client";

import React from 'react';
import BlogList from '@/app/blogs/blogs/BlogList';
import Header from '@/components/lp/shared/Header';
import Footer from '@/components/lp/shared/Footer';

const BlogsPage = () => {

  return (
    <>    
    <Header />
    <main className="flex-1 max-w-5xl mx-auto px-4 py-6">
    <div className="mt-10 md:mt-0">
    <h1>All Blogs</h1>
    <BlogList />
            </div>
   
    </main>
    <Footer />
    </>
  );
};

export default BlogsPage;