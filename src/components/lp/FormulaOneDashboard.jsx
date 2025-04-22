"use client";
import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dot, Heart, Sailboat, RefreshCw, Badge, MapPin, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { fetchYachts } from "@/api/yachts";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { addToWishlist, removeFromWishlist, fetchWishlist } from "@/api/wishlist";
import { Carousel, CarouselContent, CarouselDots, CarouselItem, CarouselNext, CarouselPrevious } from "../ui/carousel";
import { useParams } from "next/navigation";

// Empty State Component
const EmptyYachtState = ({ onRetry }) => {
  return (
    <section className="py-16">
      <div className="container px-4 mx-auto text-center">
        <Sailboat className="w-24 h-24 text-[#BEA355] mx-auto mb-6" />
        <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">
          No Yachts Available
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
          We're currently updating our yacht collection.
          Please check back later or explore our other offerings.
        </p>
        <div className="flex justify-center space-x-4">
          <Button
            onClick={onRetry}
            className="rounded-full bg-[#BEA355] hover:bg-[#a68f4b] flex items-center"
          >
            <RefreshCw className="mr-2 w-4 h-4" />
            Retry Loading
          </Button>
          <Link href="/dashboard/yachts">
            <Button
              variant="outline"
              className="rounded-full border-[#BEA355] text-[#BEA355] hover:bg-[#BEA355]/10"
            >
              Explore All Formula One Yachts
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

const FormulaOneDashboard = () => {
  const [yachts, setYachts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [favorites, setFavorites] = useState(new Set());
  const { data } = useSession();
  const { yachtsType } = useParams();


  const getYachts = async () => {
    try {
      setLoading(true);
      setError(null);
      // Using hardcoded user ID 1 for public access
      const newData = await fetchYachts(1, "f1yachts");
      setYachts(newData);
    } catch (err) {
      console.error('Yacht fetching error:', err);
      setError(err.message || "Unable to load yachts. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadWishlist = async () => {
      if (data?.user?.userid) {
        try {
          const wishlistItems = await fetchWishlist(data.user.userid);
          const wishlistIds = new Set(wishlistItems.map(item => item.yacht));
          setFavorites(wishlistIds);
        } catch (err) {
          console.error('Wishlist loading error:', err);
          // Optionally, you could set a toast or log the error
        }
      }
    };

    getYachts();
    if (data) {
      loadWishlist();
    }
  }, []);

  if (loading) {
    return (
      <section className="md:py-20 py-8">
        <div className="max-w-5xl px-2 mx-auto">
          {/* Heading Skeleton */}
          <div className="w-full flex items-center justify-between mb-8">
            <div className="h-10 bg-gray-200 dark:bg-gray-700 w-1/3 rounded-md animate-pulse"></div>
          </div>

          {/* Cards Grid Skeleton */}
          <div className="grid grid-cols-1 gap-[0.6rem] xs:grid-cols-1  sm:grid-cols-2 lg:grid-cols-3 place-items-center">
            {Array.from({ length: 6 }).map((_, index) => (
              <Card
                key={index}
                className="overflow-hidden bg-white dark:bg-gray-800 w-full max-w-[350px]] rounded-2xl h-full min-h-[280px] shadow-lg animate-pulse"
              >
                <div className="relative">
                  {/* Image Skeleton */}
                  <div className="bg-gray-200 dark:bg-gray-700 w-full h-[221px] rounded-t-2xl"></div>

                  {/* Wishlist Button Skeleton */}
                  <div className="absolute top-6 right-6 w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full"></div>

                  {/* Price Skeleton */}
                  <div className="absolute bottom-4 right-6 w-24 h-8 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
                </div>

                <CardContent className="px-4 py-4 space-y-3">
                  {/* Yacht Name Skeleton */}
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 w-2/3 rounded-md"></div>

                  {/* Specs Skeleton */}
                  <div className="flex justify-start items-center gap-2">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 w-16 rounded-md"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 w-16 rounded-md"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 w-16 rounded-md"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16">
        <div className="container px-4 mx-auto text-center">
          <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 p-6 rounded-lg max-w-md mx-auto">
            <h2 className="text-2xl font-bold text-red-700 dark:text-red-300 mb-4">
              Oops! Something Went Wrong
            </h2>
            <p className="text-red-600 dark:text-red-400 mb-6">
              {error}
            </p>
            <Button
              onClick={getYachts}
              className="bg-red-500 hover:bg-red-600 text-white rounded-full"
            >
              <RefreshCw className="mr-2 w-4 h-4" />
              Try Again
            </Button>
          </div>
        </div>
      </section>
    );
  }

  // No Yachts Available State
  if (yachts.length === 0) {
    return <EmptyYachtState onRetry={getYachts} />;
  }

  const handleWishlistToggle = async (yachtId) => {
    const updatedFavorites = new Set(favorites);
    if (updatedFavorites.has(yachtId)) {
      await removeFromWishlist(data.user.userid, yachtId, 'yacht');
      updatedFavorites.delete(yachtId);
    } else {
      updatedFavorites.add(yachtId);
      await addToWishlist(data.user.userid, yachtId, 'yacht');
    }
    setFavorites(updatedFavorites);
  };

  return (
    <section className=" pb-8 ">
      <div className="max-w-5xl px-2 mx-auto">
        {/* Heading Section */}
        <div className="w-full flex items-center justify-between">
          <h2 className=" text-[32px] font-semibold tracking-tight md:text-4xl">
            Formula One
          </h2>
        </div>
        {/* Cards Grid */}
        <div className="grid grid-cols-1 gap-4 xs:grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 place-items-center my-8">
          {yachts.slice(0, 6).map((item) => {
            // Collect all image URLs
            const images = [
              item?.yacht?.yacht_image,
              // "/200908_5_AlShaali45ft11.webp"
            ].filter((image) => typeof image === "string" && image.trim() !== "");

            return (
              <Card
                key={item.id}
                className="overflow-hidden bg-white dark:bg-gray-800 rounded-2xl shadow-md w-full md:max-w-[350px] md:max-w-[298px] h-full max-h-[320px]} md:max-h-[260px]]"
              >
                <div className="relative">
                  <Image src="/assets/images/redtag.png" alt="Hot" width={50} height={50} className="absolute top-0 right-0 z-10" />
                  <Image
                        src={images?.length >0  ? `${process.env.NEXT_PUBLIC_S3_URL}${images[0]}` : '/assets/images/fycht.jpg'}

                    alt={item.name || 'Event Image'}
                    width={400}
                    height={250}
                    className="object-cover px-2 ml-0.5 md:ml-0 pt-3 rounded-3xl md:h-[170px] h-[230px]"
                    onError={(e) => {
                      e.target.src = '/assets/images/fycht.jpg'
                    }}
                  />

                  {/* <Link href={`/dashboard/f1yachts/${item?.yacht.id}`}>
                    <div className="absolute inset-0"></div>
                  </Link> */}

                  {/* <div className="absolute bottom-2 right-5 bg-white dark:bg-gray-900 backdrop-blur-sm p-1.5 rounded-md">
                    <span className="text-xs font-medium">
                      {item.packages?.length || 0} Package Available
                    </span>
                  </div> */}
                </div>
                   <Link href={`/dashboard/f1yachts/${item?.yacht.id}`}>

                <CardContent className="px-4 py-2">
                  <p className="text-xs font-light bg-[#BEA355]/30 text-black dark:text-white rounded-md px-1 py-0.5 w-auto inline-flex items-center">
                    <MapPin className="size-3 mr-1" /> {item?.yacht.location || "Location Not Available"}
                  </p>
                  <div className="flex justify-between items-center">
                    <h3 className="text-[20px] font-semibold mb-1 truncate max-w-[230px]">{item?.yacht.name}</h3>
                    <span className="font-medium text-xs">
                      AED <span className="font-bold text-sm text-primary">{item?.yacht.per_day_price}</span>
                      <span className="text-xs font-light ml-1">/Day</span>
                    </span>
                  </div>
                  <div className="flex justify-start items-center gap-1">
                    <Image src="/assets/images/transfer.svg" alt="length" quality={100} width={9} height={9} className="" />
                    <p className="font-semibold text-xs">{item?.yacht.length || 0} ft</p>
                    <Dot />
                    <div className="text-center font-semibold flex items-center text-xs space-x-2">
                      <Image src="/assets/images/person.svg" alt="length" quality={100} width={8} height={8} className="dark:invert" />
                      <p>Guests</p>
                      <p>{item?.yacht.guest || 0}</p>
                    </div>
                    <Dot />
                    <div className="text-center font-semibold flex items-center text-xs space-x-2">
                      <Image src="/assets/images/cabin.svg" alt="length" quality={100} width={8} height={8} className="dark:invert" />
                      <p>Cabins</p>
                      <p>{item?.yacht.number_of_cabin || 0}</p>
                    </div>
                  </div>
                </CardContent>
            </Link>
              </Card>
            );
          })}
        </div>

        <Link href="/dashboard/f1yachts">
          <Button variant="outline" className="text-black hover:underline font-semibold uppercase md:text-[16px] hover:shadow-2xl transition duration-500 ease-in-out dark:text-white text-[12px] rounded-full flex items-center group">
            See All
            <svg
              className="w-4 ml-1 transition-transform duration-300 ease-in-out group-hover:translate-x-1"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </Button>
        </Link>
      </div>
    </section>
  );
};

export default FormulaOneDashboard;