"use client";

import React from 'react';
import BlogList from '@/app/blogs/blogs/BlogList';
import Header from '@/components/lp/shared/Header';
import Footer from '@/components/lp/shared/Footer';

const BlogsPage = () => {

  return (
    <>    
    <Header />
    <main className="flex-1 max-w-5xl mx-auto px-2 pt-32 pb-6">
    <section>
    <h1 className="text-2xl font-bold mb-4">All Blogs</h1>
    <BlogList />
    </section>
    </main>
    <Footer />
    </>
  );
};

export default BlogsPage;