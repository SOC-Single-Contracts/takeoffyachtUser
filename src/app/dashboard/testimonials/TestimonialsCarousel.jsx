import React, { useEffect, useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { fetchTestimonials } from "@/api/yachts";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star } from "lucide-react";
import Link from "next/link";
import { Loading } from "@/components/ui/loading";
import Image from "next/image";

const TestimonialsCarousel = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getTestimonials = async () => {
      try {
        const data = await fetchTestimonials();
        setTestimonials(data);
      } catch (err) {
        setError(err.message || "Failed to load testimonials.");
      } finally {
        setLoading(false);
      }
    };

    getTestimonials();
  }, []);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <p className="text-red-500">Error: {error}</p>;
  }

  return (
    <>
      <div className="flex flex-col justify-center text-center items-center gap-2 my-5">
        <div className="flex items-center justify-center">
          <Image src="/assets/images/maskleft.svg" width={30} height={30} alt="" />
          <h1 className="text-4xl font-bold flex items-center gap-2">4.94</h1>
          <Image src="/assets/images/maskright.svg" width={30} height={30} alt="" />
        </div>
        <h6 className="text-lg font-semibold">Tourist’s Favourite</h6>
        <p className="text-gray-700 dark:text-gray-300 font-light text-sm text-balance">
          Sapien facilisis ut malesuada sed tellus adipiscing. Volutpat dictum
          libero tincidunt bibendum sed tempor lectus egestas.
        </p>
      </div>
      <Carousel>
        <CarouselContent className="ml-1">
          {testimonials.map((item, index) => (
            <CarouselItem
              key={item.id}
              className="basis-1/1 md:basis-1/3 lg:basis-1/2 p-2"
            >
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 space-y-4 w-full max-w-[255px] h-full min-h-[235px] shadow-lg flex flex-col justify-between">
                <div className="flex flex-row justify-between items-start gap-2">
                  {/* <div className="flex justify-center gap-1 items-center text-orange-300">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="size-3" aria-hidden="true" />
                    ))}
                    <span
                      className="text-gray-700 font-semibold text-xs"
                      aria-label={`Rating: ${item.star_count || 0} out of 5`}
                    >
                      {item.star_count || "0"}
                    </span>
                  </div> */}
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
                    className="text-gray-600 dark:text-gray-200 font-light text-xs"
                    dateTime={new Date().toISOString()}
                  >
                    {new Date().toLocaleDateString()}
                  </time>
                </div>
                <p className="text-gray-700 dark:text-gray-200 font-normal text-sm flex-grow">
                  {item.statement || "No statement provided."}
                </p>
                <div className="flex items-center gap-3">
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
                      {item.location}
                    </p>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
      <Accordion className="mt-2">
        <AccordionItem>
          <AccordionTrigger className="w-full flex justify-center font-medium text-xs items-center h-8 rounded-lg border-2 border-black dark:border-gray-600">
            <Link href="/dashboard/testimonials">
              Show All Reviews
            </Link>
          </AccordionTrigger>
        </AccordionItem>
      </Accordion>
    </>
  );
};

export default TestimonialsCarousel;
