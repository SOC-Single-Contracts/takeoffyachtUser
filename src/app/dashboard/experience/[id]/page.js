"use client";
import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Fancybox from "@/components/Fancybox";
import { Button } from '@/components/ui/button';
import { Heart, MapPin, Clock, Users, Languages, Ship, Power, Info, Check, Star } from 'lucide-react';
import { featuredyachts } from '../../../../../public/assets/images';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useParams } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {Skeleton} from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { addDays } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import MapSectionWrapper from "@/components/shared/dashboard/MapSectionWrapper";
import TestimonialsCarousel from "../../testimonials/TestimonialsCarousel";
import Featured from "@/components/lp/Featured";
import { useRouter } from 'next/navigation';
import { useToast } from "@/hooks/use-toast";

const ExperienceDetails = () => {
  const { id } = useParams();
  const { data: session } = useSession();
  const router = useRouter();
  const { toast } = useToast();
  const [experience, setExperience] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedMainImage, setSelectedMainImage] = useState(null);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [selectedGalleryImage, setSelectedGalleryImage] = useState(null);
  const [date, setDate] = useState({
    from: new Date(2024, 0, 20),
    to: addDays(new Date(2024, 0, 20), 20),
  });

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

  useEffect(() => {
    const fetchExperience = async () => {
      if (!id) return;
      
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://api.takeoffyachts.com'}/yacht/get_experience/1`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          
        });

        if (!response.ok) {
          throw new Error('Failed to fetch experience');
        }

        const data = await response.json();
        if (data.error_code === "pass" && data.data?.length > 0) {
          const matchingExperience = data.data.find(item => item.experience.id.toString() === id.toString());
          setExperience(matchingExperience || data.data[0]);
          setSelectedImage(matchingExperience?.experience?.image1 || matchingExperience?.experience?.experience_image);
        } else {
          throw new Error('Experience not found');
        }
      } catch (err) {
        console.error('Error fetching experience:', err);
        setError(err.message || 'Failed to fetch experience');
      } finally {
        setLoading(false);
      }
    };
   
    fetchExperience();
  }, [id]);

  if (loading) {
    return (
      <section className="py-16 max-w-5xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-8 mt-8">
          <div className="w-full lg:w-1/2">
            <Skeleton className="h-96 mb-4" />
            <div className="flex gap-2">
              {Array(4).fill(null).map((_, index) => (
                <Skeleton key={index} className="w-24 h-16 rounded-md" />
              ))}
            </div>
          </div>

          <div className="w-full lg:w-1/2">
            <Skeleton className="h-8 w-1/2 mb-4" />
            <Skeleton className="h-6 w-3/4 mb-6" />
            <div className="grid grid-cols-2 gap-4 my-3">
              {Array(6).fill(null).map((_, index) => (
                <Skeleton key={index} className="h-20 rounded-lg" />
              ))}
            </div>
            <Skeleton className="h-8 w-full mb-4" />
            <Skeleton className="h-10 w-full" />
            <div className="mt-6">
              <Skeleton className="h-12 w-full mb-4" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16">
        <div className="container px-4 mx-auto">
          <p className="text-red-500">Error loading experience: {error}</p>
        </div>
      </section>
    );
  }

  if (!experience) {
    return null;
  }

  const { experience: exp, food, categories, subcategories, inclusion } = experience;
  const baseImageUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.takeoffyachts.com';
  const images = [
    exp.image1,
    exp.image2,
    exp.image3,
    exp.image4,
    exp.image5,
    exp.image6,
    exp.image7,
    exp.image8,
    exp.image9,
    exp.image10,
    exp.image11,
    exp.image12,
    exp.image13,
    exp.image14,
    exp.image15,
    exp.image16,
    exp.image17,
    exp.image18,
    exp.image19,
    exp.image20
  ].filter(Boolean);
  const mainImage = exp.image1 || exp.experience_image;
  const uniqueExperienceImages = [...new Set([mainImage, ...images])].filter(Boolean);

  return (
    <>
      <section>
        <div className="max-w-5xl mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row -mx-4">
            <div className="w-full lg:w-1/2 px-2 mb-8 lg:mb-0">
              <div className="flex flex-col gap-6">
                <Carousel className="w-full">
                  <CarouselContent>
                    {uniqueExperienceImages.map((image, index) => (
                      <CarouselItem key={index}>
                        <Image
                          src={`${baseImageUrl}${image}`}
                          alt={`Experience Image ${index + 1}`}
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
                  {images.map((image, index) => (
                    <div
                      key={index}
                      className="aspect-square"
                      onClick={() => handleMainImageSelect(image)}
                    >
                      <Image
                        src={`${baseImageUrl}${image}`}
                        alt={`Experience Image ${index + 1}`}
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
                      className="fixed inset-0 bg-white dark:bg-gray-900  z-50 flex items-center justify-center p-4"
                      onClick={closeGalleryView}
                    >
                      <div
                        className="bg-white dark:bg-gray-900  p-4 rounded-lg max-w-5xl w-full mx-auto grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[90vh] overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {/* Selected Image Display */}
                        <div className="md:col-span-2 mb-4">
                          <a
                            href={`${baseImageUrl}${selectedGalleryImage || images[0]}`}
                            data-fancybox="experience-gallery"
                          >
                            <Image
                              src={`${baseImageUrl}${selectedGalleryImage || images[0]}`}
                              alt="Selected Gallery Image"
                              className="w-full h-[400px] md:h-[500px] object-cover rounded-md cursor-pointer"
                              width={800}
                              height={500}
                              quality={100}
                            />
                          </a>
                        </div>

                        {/* Gallery Grid */}
                        {images.map((image, index) => (
                          <a
                            key={index}
                            href={`${baseImageUrl}${image}`}
                            data-fancybox="experience-gallery"
                            className="aspect-square"
                            onClick={(e) => {
                              e.preventDefault();
                              handleGalleryImageSelect(image);
                            }}
                          >
                            <Image
                              src={`${baseImageUrl}${image}`}
                              alt={`Experience Image ${index + 1}`}
                              quality={100}
                              className={`w-full h-full object-cover rounded-md shadow-sm cursor-pointer 
                                ${selectedGalleryImage === image ? 'border-4 border-blue-500' : 'hover:opacity-80'}
                              `}
                              width={200}
                              height={200}
                            />
                          </a>
                        ))}
                      </div>
                    </div>
                  </Fancybox>
                )}
              </div>
              {/* <div className="my-4">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={date?.from}
                  selected={date}
                  onSelect={setDate}
                  numberOfMonths={2}
                  className="p-0"
                />
                <Link href={`/dashboard/experience/${id}/booking`}>
                  <Button className="rounded-full bg-[#BEA355] w-full max-w-[210px] mx-auto text-white h-10 mt-4">
                    Book Now
                  </Button>
                </Link>
              </div> */}
            </div>

            {/* Details Column */}
            <div className="w-full md:w-2/2 lg:w-2/4 px-2">
              <Badge className="bg-[#BEA355]/30 text-black dark:text-white font-medium p-1 hover:bg-[#BEA355]/40">
                <MapPin className="size-4 mr-2" />
                {exp.location || "Location Not Available"}
              </Badge>
              <div className="flex justify-between items-center mt-2">
                <h2 className="text-xl md:text-2xl font-bold">{exp.name}</h2>
                <div className="text-right">
                  <p className="text-gray-600 dark:text-gray-400">AED <span className="text-xl font-bold !text-black dark:!text-white">{exp.min_price.toLocaleString()}</span></p>
                  {exp.max_price > exp.min_price && (
                    <p className="text-xs text-gray-500 dark:text-gray-400">Up to AED {exp.max_price.toLocaleString()}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3">
                <div className="flex flex-col justify-center items-center w-full space-y-2 font-medium text-xs py-4 border border-gray-300 rounded-lg shadow-sm">
                  <Clock className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                  <p className="text-gray-700 dark:text-gray-300">{exp.duration_hour}h {exp.duration_minutes}m</p>
                </div>
                <div className="flex flex-col justify-center items-center w-full space-y-2 font-medium text-xs py-4 border border-gray-300 rounded-lg shadow-sm">
                  <Users className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                  <p className="text-gray-700 dark:text-gray-300">Up to {exp.guest} guests</p>
                </div>
                <div className="flex flex-col justify-center items-center w-full space-y-2 font-medium text-xs py-4 border border-gray-300 rounded-lg shadow-sm">
                  <Languages className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                  <p className="text-gray-700 dark:text-gray-300">{exp.crew_language || 'English'}</p>
                </div>
                <div className="flex justify-center items-center w-full h-20 border border-gray-300 rounded-lg shadow-sm">
                  <Image src="/assets/images/logoround.svg" quality={100} width={60} height={60} alt="Logo" />
                </div>
              </div>

              <div className="flex justify-between flex-wrap items-center gap-2 my-4">
                <div className="flex items-center gap-2">
                <Image src="/assets/images/profile.png" quality={100} width={40} height={40} alt="" />
                <div className="flex flex-col justify-start">
                  <p className="text-gray-700 dark:text-gray-400 font-light text-sm">
                    Hosted by{" "}
                    <span className="text-black dark:text-white font-medium underline">
                      {exp.crew_member || "Unknown"}
                    </span>
                  </p>
                  <div className="flex justify-start gap-1 items-center text-orange-300">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`size-3 fill-current`}
                        aria-hidden="true"
                      />
                    ))}
                    <p className="text-gray-700 font-semibold dark:text-gray-400 text-xs">5.0</p>
                  </div>
                </div>
                </div>
                <Link href={`/dashboard/experience/${id}/booking`}>
                  <Button 
                    onClick={(e) => {
                      if (!session) {
                        e.preventDefault();
                        toast({
                          title: "Login Required",
                          description: "Please login to book an experience",
                          variant: "destructive"
                        });
                        router.push('/login');
                      }
                    }}
                    className="rounded-full bg-[#BEA355] w-full min-w-[210px] mx-auto text-white h-10 mt-4"
                  >
                    Book Now
                  </Button>
                </Link>
              </div>

               {/* Description */}
               <h6 className="text-lg font-medium mb-2">Description</h6>
              <Accordion className="space-y-4" type="multiple" collapsible>
                <AccordionItem className="" value="item-1">
                  <AccordionTrigger className="w-full flex justify-center font-medium items-center h-8 text-xs rounded-lg border-2 border-black dark:border-gray-400">
                    View full description
                  </AccordionTrigger>
                  <AccordionContent className="mt-4">
                    <p className="text-gray-700 dark:text-gray-400 font-light text-sm mb-3">
                      {exp.description || "No description available."}
                    </p>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem className="" value="item-2">
                  <AccordionTrigger className="w-full flex justify-center font-medium items-center h-8 text-xs rounded-lg border-2 border-black dark:border-gray-400">
                    View full specifications
                  </AccordionTrigger>
                  <AccordionContent className="mt-4">
                    <h2 className="text-lg font-medium">Experience Details</h2>
                    <div className="flex justify-between items-center h-10 px-4 py-2 bg-[#F1F1F1] dark:bg-gray-700 rounded-lg mt-2 font-medium">
                      <p className="text-gray-700 dark:text-gray-300 font-normal text-sm">Duration</p>
                      <p className="text-gray-700 dark:text-gray-300 font-normal text-sm">{exp.duration_hour}h {exp.duration_minutes}m</p>
                    </div>
                    <div className="flex justify-between items-center h-10 px-4 py-2 bg-[#F1F1F1] dark:bg-gray-700 rounded-lg mt-2 font-medium">
                      <p className="text-gray-700 dark:text-gray-300 font-normal text-sm">Group Size</p>
                      <p className="text-gray-700 dark:text-gray-300 font-normal text-sm">Up to {exp.guest} guests</p>
                    </div>
                    <div className="flex justify-between items-center h-10 px-4 py-2 bg-[#F1F1F1] dark:bg-gray-700 rounded-lg mt-2 font-medium">
                      <p className="text-gray-700 dark:text-gray-300 font-normal text-sm">Cancellation</p>
                      <p className="text-gray-700 dark:text-gray-300 font-normal text-sm">{exp.cancel_time_in_hour}h before</p>
                    </div>
                    <div className="flex justify-between items-center h-10 px-4 py-2 bg-[#F1F1F1] dark:bg-gray-700 rounded-lg mt-2 font-medium">
                      <p className="text-gray-700 dark:text-gray-300 font-normal text-sm">Languages</p>
                      <p className="text-gray-700 dark:text-gray-300 font-normal text-sm">{exp.crew_language || "English"}</p>
                    </div>
                    <div className="flex justify-between items-center h-10 px-4 py-2 bg-[#F1F1F1] dark:bg-gray-700 rounded-lg mt-2 font-medium">
                      <p className="text-gray-700 dark:text-gray-300 font-normal text-sm">Type</p>
                      <p className="text-gray-700 dark:text-gray-300 font-normal text-sm">{exp.type}</p>
                    </div>
                    <div className="flex justify-between items-center h-10 px-4 py-2 bg-[#F1F1F1] dark:bg-gray-700 rounded-lg mt-2 font-medium">
                      <p className="text-gray-700 dark:text-gray-300 font-normal text-sm">Availability</p>
                      <p className="text-gray-700 dark:text-gray-300 font-normal text-sm">
                        {(() => {
                          try {
                            const availability = JSON.parse(exp.availability.replace(/'/g, '"'));
                            return `${availability.from} - ${availability.to}`;
                          } catch {
                            return "Contact for details";
                          }
                        })()}
                      </p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              {/* Testimonials Section */}
              <section className="mt-8">
                <TestimonialsCarousel />
              </section>

              {/* Food Menu Section - Updated */}
              {food && food.length > 0 && (
                <section className="mt-8">
                  <h2 className="text-lg font-medium mb-4">Food Menu</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {food.map((item) => (
                      <div key={item.id} className="flex justify-between items-center p-4 bg-[#F1F1F1] dark:bg-gray-800 rounded-lg">
                        <div className="flex items-center gap-3">
                          <Image
                            src="/assets/images/food.svg"
                            width={24}
                            height={24}
                            alt={item.name}
                            className="dark:invert"
                          />
                          <div>
                            <p className="text-sm font-medium">{item.name}</p>
                            <p className="text-xs text-gray-500">{item.menucategory}</p>
                          </div>
                        </div>
                        <p className="text-[#BEA355] font-semibold">AED {item.price?.toLocaleString()}</p>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Inclusions Section - Updated */}
              {inclusion && inclusion.length > 0 && (
                <section className="mt-8">
                  <h2 className="text-lg font-medium mb-4">What's Included</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {inclusion.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-3 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm"
                      >
                        <Image
                          src={item.light_icon ? `${baseImageUrl}${item.light_icon}` : "/assets/images/check.svg"}
                          width={24}
                          height={24}
                          alt={item.name}
                          className="dark:invert"
                        />
                        <span className="text-sm font-medium">{item.name}</span>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Categories Section - Updated */}
              {/* {categories && categories.length > 0 && (
                <section className="mt-8">
                  <h2 className="text-lg font-medium mb-4">Categories</h2>
                  <div className="flex flex-wrap gap-3">
                    {categories.map((cat) => (
                      <Badge
                        key={cat.id}
                        className="bg-[#BEA355]/10 text-[#BEA355] hover:bg-[#BEA355]/20"
                      >
                        {cat.name}
                      </Badge>
                    ))}
                  </div>
                </section>
              )} */}

              {/* Subcategories Section */}
              {subcategories && subcategories.length > 0 && (
                <section className="mt-8">
                  <h2 className="text-lg font-medium mb-4">Features</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {subcategories.map((sub) => (
                      <div
                        key={sub.id}
                        className="flex items-center gap-2 p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm"
                      >
                        <Check className="h-4 w-4 text-[#BEA355]" />
                        <span className="text-sm">{sub.name}</span>
                      </div>
                    ))}
                  </div>
                </section>
              )}

                 {/* Map Section */}
                 {exp.longitude && exp.latitude && (
                <section className="mt-8">
                  <MapSectionWrapper
                    longitude={exp.longitude}
                    latitude={exp.latitude}
                    className="w-full h-[300px] rounded-lg"
                  />
                </section>
              )}
            </div>
          </div>
        </div>
      </section>
       {/* Featured Experiences */}
       <section className="mt-8">
          <Featured />
        </section>
    </>
  );
};

export default ExperienceDetails;