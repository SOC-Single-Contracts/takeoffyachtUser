"use client";

import React from 'react';
import BlogList from '@/app/blogs/blogs/BlogList';
import Header from '@/components/lp/shared/Header';
import Footer from '@/components/lp/shared/Footer';

const BlogsPage = () => {

  return (
<>
  <Header />
  <main className="flex-1 pt-32 pb-6 bg-[#E2E2E2] dark:bg-gray-900 dark:text-white">
    <div className="w-full px-4 md:px-0 md:w-9/12 mx-auto">
      <section className="w-full bg-[#E2E2E2] text-black dark:bg-gray-900 dark:text-white">
        <h1 className="text-2xl font-bold mb-4 mt-10">All Blogs</h1>
        <BlogList />
      </section>
    </div>
  </main>
  <Footer />
</>

  );
};

export default BlogsPage;