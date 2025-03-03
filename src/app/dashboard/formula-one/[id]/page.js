"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Fancybox from "@/components/Fancybox";
import {
  Calendar,
  Clock,
  DollarSign,
  MapPin,
  UserRound,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import MapSectionWrapper from "@/components/shared/dashboard/MapSectionWrapper";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { fetchFormulaOne } from "@/api/yachts";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { useToast } from "@/hooks/use-toast";
import Events from "../page";

const EventDetail = () => {
  const { id } = useParams();
  const [selectedYacht, setSelectedYacht] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMainImage, setSelectedMainImage] = useState(null);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [selectedGalleryImage, setSelectedGalleryImage] = useState(null);
  const router = useRouter();
  const { data: session } = useSession();
  const { toast } = useToast();

  useEffect(() => {
    const getYacht = async () => {
      try {
        const data = await fetchFormulaOne();
        
        const yacht = data.find(
          (item) => item.id.toString() === id
        );

        if (!yacht) {
          throw new Error('Yacht not found');
        }

        setSelectedYacht(yacht);
      } catch (err) {
        setError(err.message || 'Unexpected Error');
      } finally {
        setLoading(false);
      }
    };

    getYacht();
  }, [id]);

  if (error) {
    return (
      <section className="py-16">
        <div className="container px-4 mx-auto">
          <p className="text-red-500">Error loading yacht: {error}</p>
        </div>
      </section>
    );
  }

  if (!selectedYacht) {
    return null;
  }

  const {
    name,
    location,
    title,
    longitude,
    latitude,
    from_date,
    to_date,
    cancel_time_in_hour,
    description,
    notes,
    length,
    capacity,
    per_day_price,
    crew_member,
    crew_language,
    features
  } = selectedYacht;

  const handleBookNow = () => {
    if (!session) {
      toast({
        title: "Login Required",
        description: "Please login to book a yacht",
        variant: "destructive"
      });
      router.push('/login');
      return;
    }

    router.push(`/dashboard/formula-one/${id}/booking`);
  };

  const handleMainImageSelect = (image) => {
    setSelectedMainImage(image);
  };

  const openGalleryView = () => {
    setIsGalleryOpen(true);
  };

  const closeGalleryView = () => {
    setIsGalleryOpen(false);
    setSelectedGalleryImage(null);
  };

  const handleGalleryImageSelect = (image) => {
    setSelectedGalleryImage(image);
  };

  // Generate yacht images (using placeholder since API doesn't provide multiple images)
  const yachtImages = [
    '/assets/images/f1.png',
    '/assets/images/dubai.png',
    '/assets/images/yacht-placeholder-1.jpg',
    '/assets/images/yacht-placeholder-2.jpg',
  ];

  return (
    <>
      <section>
        <div className="max-w-5xl mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row -mx-4">
            {/* Image Column */}
            <div className="w-full lg:w-1/2 px-2 mb-8 lg:mb-0">
              <div className="flex flex-col gap-6">
                <Carousel className="w-full">
                  <CarouselContent>
                    {yachtImages.map((image, index) => (
                      <CarouselItem key={index}>
                        <Image
                          src={image}
                          alt={`Yacht Image ${index + 1}`}
                          className="w-full h-[320px] object-cover rounded-md shadow-md cursor-pointer"
                          width={800}
                          height={500}
                          quality={100}
                          onClick={openGalleryView}
                        />
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2" />
                  <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2" />
                </Carousel>

                {/* Thumbnail Gallery */}
                <div className="grid grid-cols-5 gap-2">
                  {yachtImages.map((image, index) => (
                    <div
                      key={index}
                      className="aspect-square"
                      onClick={() => handleMainImageSelect(image)}
                    >
                      <Image
                        src={image}
                        alt={`Yacht Image ${index + 1}`}
                        className="w-full h-full object-cover rounded-md shadow-sm cursor-pointer hover:opacity-80 transition-opacity"
                        width={200}
                        height={200}
                        quality={100}
                      />
                    </div>
                  ))}
                </div>

                {/* Gallery Overlay */}
                {isGalleryOpen && (
                  <Fancybox
                    options={{
                      Carousel: {
                        infinite: false,
                      },
                      groupAll: true,
                    }}
                  >
                    <div
                      className="fixed inset-0 bg-white dark:bg-gray-900 z-50 flex items-center justify-center p-4"
                      onClick={closeGalleryView}
                    >
                      <div
                        className="bg-white dark:bg-gray-800 p-4 rounded-lg max-w-5xl w-full mx-auto grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[90vh] overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {/* Selected Image Display */}
                        <div className="md:col-span-2 mb-4">
                          <Image
                            src={selectedGalleryImage || yachtImages[0]}
                            alt="Selected Gallery Image"
                            className="w-full h-[400px] md:h-[500px] object-cover rounded-md cursor-pointer"
                            width={800}
                            height={500}
                            quality={100}
                          />
                        </div>

                        {/* Gallery Grid */}
                        {yachtImages.map((image, index) => (
                          <div
                            key={index}
                            className="aspect-square"
                            onClick={() => handleGalleryImageSelect(image)}
                          >
                            <Image
                              src={image}
                              alt={`Yacht Image ${index + 1}`}
                              quality={100}
                              className={`w-full h-full object-cover rounded-md shadow-sm cursor-pointer 
                                ${selectedGalleryImage === image ? 'border-4 border-blue-500' : 'hover:opacity-80'}
                              `}
                              width={200}
                              height={200}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </Fancybox>
                )}
              </div>
            </div>

            {/* Details Column */}
            <div className="w-full md:w-2/2 lg:w-2/4 px-4">
              <Badge className="bg-[#BEA355]/30 text-black dark:text-white font-medium p-1 hover:bg-[#BEA355]/40">
                <MapPin className="size-4 mr-2 text-gray-700 dark:text-gray-400" />
                {location || "Location Not Available"}
              </Badge>
              
              <div className="flex justify-between items-center mt-6">
                <h2 className="text-xl md:text-3xl font-bold">{name}</h2>
                <p className="text-gray-600 dark:text-gray-400">{title}</p>
              </div>
              
              {/* Yacht Details Grid */}
              <div className="grid grid-cols-2 md:grid-cols-2 gap-4 my-3">
                <div className="flex flex-col justify-center items-center w-full h-20 space-y-2 font-semibold text-sm py-4 border border-gray-300 rounded-lg shadow-sm">
                  <Calendar className="size-5" />
                  <p className="text-gray-700 dark:text-gray-400">{new Date(from_date).toLocaleDateString()}</p>
                </div>
                <div className="flex flex-col justify-center items-center w-full h-20 space-y-2 font-semibold text-sm py-4 border border-gray-300 rounded-lg shadow-sm">
                  <Clock className="size-5" />
                  <p className="text-gray-700 dark:text-gray-400">{length} m Length</p>
                </div>
                <div className="flex flex-col justify-center items-center w-full h-20 space-y-2 font-semibold text-sm py-4 border border-gray-300 rounded-lg shadow-sm">
                  <UserRound className="size-5" />
                  <p className="text-gray-700 dark:text-gray-400">Capacity: {capacity} Guests</p>
                </div>
                <div className="flex flex-col justify-center items-center w-full h-20 space-y-2 font-semibold text-sm py-4 border border-gray-300 rounded-lg shadow-sm">
                  <UserRound className="size-5" />
                  <p className="text-gray-700 dark:text-gray-400">Cancellation: {cancel_time_in_hour}h</p>
                </div>
              </div>

              <h6 className="text-lg font-medium mt-4">Description</h6>
              <p className="text-gray-700 dark:text-gray-400 font-light text-sm mb-3">
                {description || "No description available."}
              </p>

              {/* Yacht Features */}
              <div className="my-5">
                <h2 className="text-2xl font-semibold mb-4">Yacht Features</h2>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(features || {}).map(([feature, available]) => (
                    available && (
                      <Badge 
                        key={feature} 
                        variant="secondary" 
                        className="px-3 py-1"
                      >
                        {feature.charAt(0).toUpperCase() + feature.slice(1)}
                      </Badge>
                    )
                  ))}
                </div>
              </div>

              {/* Crew Information */}
              <div className="bg-[#BEA355]/10 rounded-2xl p-4 mt-4">
                <h1 className="text-lg font-medium dark:text-white">Crew Information</h1>
                <div className="flex items-center space-x-2 mt-2">
                  <UserRound className="size-5 text-gray-700 dark:text-white" />
                  <p className="text-gray-700 font-light text-sm dark:text-white">
                    {crew_member || 'No crew information available'}
                  </p>
                </div>
                <div className="flex items-center space-x-2 mt-1">
                  <Clock className="size-5 text-gray-700 dark:text-white" />
                  <p className="text-gray-700 font-light text-sm dark:text-white">
                    Language: {crew_language || 'Not specified'}
                  </p>
                </div>
              </div>

              {/* Pricing */}
              <div className="my-4">
                <h2 className="text-2xl font-semibold mb-2">Pricing</h2>
                <div className="flex items-center space-x-2">
                  <DollarSign className="size-6 text-[#BEA355]" />
                  <p className="text-xl font-bold text-[#BEA355]">
                    {per_day_price} AED <span className="text-sm text-gray-600">per day</span>
                  </p>
                </div>
              </div>

              {/* Book Now Button */}
              <div className="my-4">
                <Button 
                  onClick={handleBookNow}
                  className="rounded-full bg-[#BEA355] w-full text-white h-10"
                >
                  Book Now
                </Button>
              </div>

              {/* Special Notes */}
              <div className="bg-[#BEA355]/10 rounded-2xl p-4 mt-4">
                <h1 className="text-lg font-medium dark:text-white">Special Notes</h1>
                <p className="text-gray-700 font-light text-sm dark:text-white">
                  {notes || "No special notes available."}
                </p>
              </div>

              {/* Map Section */}
              <div className="mt-6">
                {(longitude || latitude) && (
                  <MapSectionWrapper
                    latitude={parseFloat(latitude)}
                    longitude={parseFloat(longitude)}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Yachts Section */}
      <section className="px-2 py-20">
        <Events />
        <div className="flex justify-center">
          <Link href="/dashboard/formula-one">
            <Button className="rounded-full bg-[#BEA355] text-white flex justify-center mx-auto">
              View All F1 Yachts
            </Button>
          </Link>
        </div>
      </section>
    </>
  );
};

export default EventDetail;