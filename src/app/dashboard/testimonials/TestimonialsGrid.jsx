import React from 'react';
import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from "@/components/ui/avatar";
import { Star } from "lucide-react";

const TestimonialsGrid = ({ testimonials }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-4 p-4 mb-8 w-full place-items-center justify-items-center mx-auto max-w-5xl">
      {testimonials.map((item) => (
        <div
          key={item.id}
          className="bg-white dark:bg-slate-700 dark:text-white rounded-lg dark: rounded-2xl p-4 shadow-lg flex flex-col justify-between h-full min-h-[235px] w-full max-w-[255px]"
        >
          <div className="flex flex-row justify-between items-start gap-2">
            <div className="flex justify-center gap-1 items-center text-orange-300">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`size-3 ${i < (item.star_count || 0) ? "fill-current" : "text-gray-300"}`}
                aria-hidden="true"
              />
            ))}
            <span className="text-gray-700 dark:text-gray-200 font-semibold text-xs">
              {item.star_count || "0"}
            </span>
          </div>
            <time
              className="text-gray-600 dark:text-gray-400 font-light text-xs"
              dateTime={new Date().toISOString()}
            >
              {new Date().toLocaleDateString()}
            </time>
          </div>
          <p className="text-gray-700 dark:text-gray-200 font-normal mt-2 text-xs flex-grow">
            {item.statement || "No statement provided."}
          </p>
          <div className="flex items-center gap-3 mt-4">
            <Avatar>
              <AvatarImage
                src={`https://api.takeoffyachts.com/${item.testimonial_image}`}
                alt={`${item.name}'s avatar`}
              />
              <AvatarFallback>{item.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <p className="text-gray-700 dark:text-gray-200 font-semibold text-sm">
                {item.name}
              </p>
              <p className="text-gray-700 dark:text-gray-200 font-light text-xs">
                {item.location || "Location not provided"}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TestimonialsGrid;