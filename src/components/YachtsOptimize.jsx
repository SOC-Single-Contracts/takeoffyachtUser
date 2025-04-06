import { useEffect, useState, useRef, memo } from "react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, CarouselDots } from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

function YachtCarousel({ images = [], item, favorites, handleWishlistToggle, yachtsType, daysCount }) {
    console.log("YachtCarousel")
  return (
    <div className="relative">
      {images.length > 0 ? (
        <Carousel>
          <CarouselContent>
            {images.map((image, index) => (
              <CarouselItem key={`${image}-${index}`}>
                <Image
                  src={image ? `https://images-yacht.s3.us-east-1.amazonaws.com${image}` : '/assets/images/fycht.jpg'}
                  loading="lazy"
                  alt="Yacht Image"
                  width={326}
                  height={300}
                  className="object-cover px-4 pt-3 rounded-3xl w-full md:h-[221px] h-[240px] ml-1.5"
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10">
            <Button variant="icon" onClick={(e) => e.stopPropagation()}>
              <ChevronLeft />
            </Button>
          </CarouselPrevious>
          <CarouselNext className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10">
            <Button variant="icon" onClick={(e) => e.stopPropagation()}>
              <ChevronRight />
            </Button>
          </CarouselNext>
          <CarouselDots />
        </Carousel>
      ) : (
        <Image
          src="/assets/images/fycht.jpg"
          alt="Fallback Image"
          width={326}
          height={300}
          className="object-cover px-4 pt-3 rounded-3xl w-full md:h-[221px] h-[240px] ml-1.5"
        />
      )}

      {/* Wishlist button */}
      <Button
        variant="secondary"
        size="icon"
        className="absolute top-6 right-6 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white"
        onClick={() => handleWishlistToggle(item?.yacht?.id)}
      >
        <Image
          src={favorites?.has(item?.yacht?.id)
            ? "/assets/images/wishlist.svg"
            : "/assets/images/unwishlist.svg"
          }
          alt="wishlist"
          width={20}
          height={20}
        />
      </Button>

      {/* Price Tag */}
      <div className="absolute bottom-2 right-5 bg-white dark:bg-gray-800 p-[0.3rem] rounded-md shadow-md">
        {yachtsType === "yachts" ? (
          <span className="font-medium text-xs">
            AED <span className="font-bold text-primary">{item?.yacht?.per_hour_price}</span>
            <span className="text-xs font-light ml-1">/Hour</span>
          </span>
        ) : yachtsType === "f1yachts" ? (
          <span className="font-medium text-xs">
            AED <span className="font-bold text-primary">{item?.yacht?.per_day_price}</span>
            <span className="text-xs font-light ml-1">{`/${daysCount} ${daysCount === 1 ? 'Day' : 'Days'}`}</span>
          </span>
        ) : null}
      </div>
    </div>
  );
}

// 🚀 Export with memoization
export default memo(YachtCarousel);
