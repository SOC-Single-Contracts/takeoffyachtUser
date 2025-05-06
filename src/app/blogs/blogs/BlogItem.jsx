import React from 'react';
import Link from 'next/link';
import { Card, CardContent } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import DOMPurify from 'isomorphic-dompurify';

const sanitizeHTML = (html) => {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['p', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'ul', 'ol', 'li', 'br'],
    ALLOWED_ATTR: []
  });
};

const BlogItem = ({ blog }) => {
  return (
    <Card className="overflow-hidden bg-transparent shadow-none border-none w-full max-w-[350px]] h-full max-h-[465px]">
      <div className="relative overflow-hidden rounded-2xl group">
        <Image 
          src={blog?.thumbnail_image || "/assets/images/blog-hero.png"}
          alt="Blog Image"
          width={350}
          height={221}
          className="object-cover rounded-2xl w-full max-w-[349px]] h-[221px] transition-transform duration-300 ease-in-out group-hover:scale-105 origin-center"
          onError={(e) => {
            e.target.src = "/assets/images/blog-hero.png";
          }}
        />
      </div>
      <CardContent className="px-6 md:px-3 py-2">
        <p className="font-light text-[12px] py-1.5 text-gray-700 dark:text-gray-400">
          {new Date(blog?.created_at).toLocaleDateString()}
        </p>
        <h3 className="text-[20px] font-semibold line-clamp-1">
          {blog?.title}
        </h3>
        <div 
          className="text-sm text-gray-600 mb-4 line-clamp-3 dark:text-gray-300"
          dangerouslySetInnerHTML={{ 
            __html: sanitizeHTML(blog?.content || '').slice(0, 250) + '...'
          }}
        />
        <div className="flex items-center justify-between">
          <Link href={`/blogs/${blog?.ID}`}>
            <Button variant="link" className="p-0 h-auto uppercase group text-[16px] font-semibold dark:text-gray-200">
              Read More <ArrowRight className="ml-2 h-4 w-4 group-hover:rotate-[-45deg] transition-all duration-200 ease-in" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default BlogItem;