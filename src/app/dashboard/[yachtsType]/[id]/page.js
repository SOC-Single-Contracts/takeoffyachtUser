"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  Star,
  X,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useParams, useRouter } from "next/navigation";
import MapSectionWrapper from "@/components/shared/dashboard/MapSectionWrapper";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { fetchYachts } from "@/api/yachts";
import TestimonialsCarousel from "../../testimonials/TestimonialsCarousel";
import { useSession } from "next-auth/react";
import Featured from "@/components/lp/Featured";
import { toast } from "sonner";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from "@/components/ui/carousel"
import Fancybox from "@/components/Fancybox"
import { Calendar } from "@/components/ui/calendar";
import { addDays } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { calculateDaysBetween, f1yachtsTotal } from "@/helper/calculateDays";
import DetailPageGallery from "@/components/lp/DetailPageGallery";
import MapBoxComponent from "@/components/shared/dashboard/mapBox";
import DetailPageGallery2 from "@/components/lp/DetailPageGallery2";

const Skeleton = ({ className }) => (
  <div className={`${className} bg-gray-200 animate-pulse`}></div>
);

const YachtDetail = () => {
  const { id, yachtsType } = useParams();
  const { data: session, status } = useSession();
  const [selectedYacht, setSelectedYacht] = useState(null);
  const [featuredYachts, setFeaturedYachts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mainImage, setMainImage] = useState('');
  const [date, setDate] = useState({
    from: new Date(2024, 0, 20),
    to: addDays(new Date(2024, 0, 20), 20),
  })
  const [markers, setMarkers] = useState([]);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const getYachts = async () => {
      if (status === "loading") return; // Wait for session to load
      setLoading(true)

      try {
        const newData = await fetchYachts(session?.user?.userid || 1, yachtsType == "f1yachts" ? "f1yachts" : "regular");
        const yacht = newData?.find(
          (item) => item.yacht && item.yacht.id.toString() == id
        );

        // const allYachtIds = newData?.map(item => item.yacht?.id).filter(id => id !== undefined);

        // console.log("All Yacht IDs:", allYachtIds);
        // console.log("yacht", yacht, newData, id);
        // const yachtWithId8 = newData?.find(item => item.yacht?.id === 8);

        // console.log("Yacht with ID 8:", yachtWithId8);
        if (!yacht) {
          throw new Error('Yacht not found');
        }

        setSelectedYacht(yacht);

        const featured = newData.filter(
          (item) => item.yacht && item.yacht.id.toString() !== id
        );

        setFeaturedYachts(featured);
      } catch (err) {
        console.log(err)
        setError(err.message || 'Unexpected Error');
      } finally {
        setLoading(false);
      }
    };

    getYachts();
  }, [id, session, status]);

  const handleThumbnailClick = (image) => {
    setMainImage(image);
  };

  const getYachtDetailsGrid = (yacht) => {
    const detailsMap = [
      {
        imgSrc: "/assets/images/person.svg",
        text: `${yacht?.capacity} Max`,
        condition: yacht?.capacity
      },
      {
        imgSrc: "/assets/images/sleeping.svg",
        text: `${yacht?.sleep_capacity} Max`,
        condition: yacht?.sleep_capacity
      },
      {
        imgSrc: "/assets/images/ft.svg",
        text: yacht?.length ? `${yacht?.length} ft.` : "",
        condition: yacht?.length
      },
      {
        imgSrc: "/assets/images/cabin.svg",
        text: yacht?.number_of_cabin ? `${yacht?.number_of_cabin} Cabins` : "",
        condition: yacht?.number_of_cabin
      },
      {
        imgSrc: "/assets/images/pilot.svg",
        text: yacht?.crew_member ? `${yacht?.crew_member} Crew` : "Included",
        condition: true
      },
      // {
      //   imgSrc: "/assets/images/lang.png",
      //   text: yacht.crew_language || "0",
      //   condition: true
      // },
      {
        imgSrc: "/assets/images/bath.svg",
        text: yacht.bath || "0",
        condition: true
      },
      {
        imgSrc: "/assets/images/yacht.svg",
        text: Array.isArray(selectedYacht?.categories) && typeof selectedYacht.categories[0] === "string"
          ? selectedYacht.categories[0].replace(/'/g, '')
          : "Super Yacht", // Show first category or default to "Super Yacht"
        condition: true
      }
    ];

    return detailsMap
      .filter(item => item.condition)
      .map(({ imgSrc, text }, index) => (
        <div
          key={index}
          className="flex flex-col justify-center items-center w-full space-y-2 font-medium text-xs py-4 border border-gray-300 rounded-lg shadow-sm"
        >
          <Image src={imgSrc} quality={100} alt={text} width={20} height={20} className="dark:invert" />
          <p className="text-gray-700 dark:text-gray-300">{text}</p>
        </div>
      ))
  }

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

    router.push(`/dashboard/yachts/${id}/booking`);
  };

  const getInclusionIcon = (name) => {
    const iconMap = {
      'water drop': "/assets/images/water.svg",
      'ice': "/assets/images/ice-cube.svg",
      'water drop': "/assets/images/Icon_Wi-Fi.svg",
      'fruit plater': "/assets/images/fruits.svg",
      'ny water': "/assets/images/water.svg",
      'ny ice': "/assets/images/ice-cube.svg",
      'ny fruit plater': "/assets/images/fruits.svg",
      'default': "/assets/images/sailboat.svg"
    };

    const lowercaseName = name.toLowerCase();
    return iconMap[lowercaseName] || iconMap['default'];
  };

  // Add new state for image gallery
  const [selectedMainImage, setSelectedMainImage] = useState(null);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [selectedGalleryImage, setSelectedGalleryImage] = useState(null);

  // Function to handle main image selection
  const handleMainImageSelect = (image) => {
    setSelectedMainImage(image);
  };

  // Function to open gallery view
  const openGalleryView = () => {
    setIsGalleryOpen(true);
  };

  // Function to close gallery view
  const closeGalleryView = () => {
    setIsGalleryOpen(false);
    setSelectedGalleryImage(null);
  };

  // Function to select image in gallery view
  const handleGalleryImageSelect = (image) => {
    setSelectedGalleryImage(image);
  };

  // Function to convert 24-hour format to 12-hour format
  const formatTimeTo12Hour = (time) => {
    if (!time) {
      console.warn('Invalid time provided to formatTimeTo12Hour:', time);
      return 'Invalid time'; // or return a default value
    }

    const [hour, minute] = time.split(':');
    const formattedHour = hour % 12 || 12; // Convert to 12-hour format
    const ampm = hour >= 12 ? 'PM' : 'AM'; // Determine AM/PM
    return `${formattedHour}:${minute} ${ampm}`;
  };
  //   useEffect(() => {
  //     // Simulate a new marker every 5 seconds
  //     const interval = setInterval(() => {
  //         setMarkers((prevMarkers) => [
  //             ...prevMarkers,
  //             {
  //                 longitude: -74.00 + Math.random() * 0.1,
  //                 latitude: 40.71 + Math.random() * 0.1,
  //             },
  //         ]);
  //     }, 5000);

  //     return () => clearInterval(interval);
  // }, []);

  // console.log(selectedYacht)
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
          <p className="text-red-500">Error loading yacht: {error}</p>
        </div>
      </section>
    );
  }

  if (!selectedYacht) {
    return null;
  }

  const {
    yacht: {
      name,
      location,
      per_hour_price,
      per_day_price,
      yacht_image,
      capacity,
      sleep_capacity,
      number_of_cabin,
      length,
      power,
      engine_type,
      flag,
      crew_member,
      crew_language,
      description,
      notes,
      longitude,
      latitude,
      ny_availability,
      ny_price,
      ny_firework,
      ny_status,
      from_date,
      to_date,
      guest,
      title,

    },
    subcategories,
  } = selectedYacht;
  const daysCount = calculateDaysBetween(from_date, to_date);


  const yachtImages = [
    selectedYacht?.yacht?.yacht_image,
    selectedYacht?.yacht?.image1,
    selectedYacht?.yacht?.image2,
    selectedYacht?.yacht?.image3,
    selectedYacht?.yacht?.image4,
    selectedYacht?.yacht?.image5,
    selectedYacht?.yacht?.image6,
    selectedYacht?.yacht?.image7,
    selectedYacht?.yacht?.image8,
    selectedYacht?.yacht?.image9,
    selectedYacht?.yacht?.image10,
    selectedYacht?.yacht?.image11,
    selectedYacht?.yacht?.image12,
    selectedYacht?.yacht?.image13,
    selectedYacht?.yacht?.image14,
    selectedYacht?.yacht?.image15,
    selectedYacht?.yacht?.image16,
    selectedYacht?.yacht?.image17,
    selectedYacht?.yacht?.image18,
    selectedYacht?.yacht?.image19,
    selectedYacht?.yacht?.image20,
  ].filter(Boolean);

  const allInclusions = [
    ...(selectedYacht?.inclusion || []),
    // ...(selectedYacht['New year inclusion'] || [])
  ];

  const uniqueYachtImages = [...new Set([selectedYacht?.yacht?.yacht_image, ...yachtImages])].filter(Boolean);

  // const parseNYAvailability = (availability) => {
  //   try {
  //     if (typeof availability === 'string') {
  //       const parsed = JSON.parse(availability.replace(/'/g, '"'));
  //       return `${parsed.from || 'N/A'} - ${parsed.to || 'N/A'}`;
  //     }
  //     return 'N/A';
  //   } catch {
  //     return 'N/A';
  //   }
  // };
  const parseNYAvailability = (availability) => {
    try {
      if (availability && typeof availability === 'object') {
        const { data, time } = availability;
        return `${data || 'N/A'} ${time ? `at ${time}` : ''}`.trim();
      }
      return 'N/A';
    } catch {
      return 'N/A';
    }
  };


  // useEffect(()=>{

  //   let arr = [{latitude:latitude,longitude:longitude}]

  //   setMarkers(arr)

  // },[selectedYacht])

  //test
  // console.log(selectedYacht)

  return (
    <>
      <section>
        <div className="max-w-5xl mx-auto px-4 py-4 md:py-8">
          <div className="flex flex-col lg:flex-row -mx-4">
            <div className="w-full overflow-hidden lg:w-1/2 px-2 mb-8 lg:mb-0">
              <div className="flex flex-col gap-6">
                {/* Default View */}
                {/* <div className="w-full mb-0">
                  <Image
                    src={`${process.env.NEXT_PUBLIC_S3_URL}${selectedMainImage || yachtImages[0]}`}
                    alt="Main Yacht Image"
                    className="w-full h-[320px] object-cover rounded-md shadow-md cursor-pointer"
                    width={800}
                    height={500}
                    onClick={openGalleryView}
                  />
                </div> */}
                {/* <Carousel className="w-full mt-4">
                  <CarouselContent>
                    {uniqueYachtImages.map((image, index) => (
                      <CarouselItem key={index}>
                        <Image
                          src={`${process.env.NEXT_PUBLIC_S3_URL}${image}`}
                          alt={`Yacht Image ${index + 1}`}
                          className="w-full h-[180px] md:h-[320px] object-cover rounded-md shadow-md cursor-pointer"
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
                </Carousel> */}
                {/* Thumbnail Gallery */}
                {/* <div className="grid grid-cols-5 gap-2">
                  {yachtImages.map((image, index) => (
                    <div
                      key={index}
                      className="aspect-square"
                      onClick={() => handleMainImageSelect(image)}
                    >
                      <Image
                        src={`${process.env.NEXT_PUBLIC_S3_URL}${image}`}
                        alt={`Yacht Image ${index + 1}`}
                        className="w-full h-full object-cover rounded-md shadow-sm cursor-pointer hover:opacity-80 transition-opacity"
                        width={200}
                        height={200}
                        quality={100}
                      />
                    </div>
                  ))}
                </div> */}

                <div className="w-full mt-8">
                  {!selectedYacht || !selectedYacht?.yacht ? null : (() => {
                    const images = uniqueYachtImages
                      .filter((image) => typeof image === "string" && image.trim() !== "")
                      .map((image) => `${process.env.NEXT_PUBLIC_S3_URL}${image}`)

                    return (
                      <>
                      {/* <DetailPageGallery images={images} /> */}
                      <DetailPageGallery2 images={images} />
                      </>
                    )
                  })()}
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
                      className="fixed inset-0 bg-white dark:bg-gray-900 z-50 flex flex-col items-end justify-center p-4"
                      onClick={closeGalleryView}
                    >
                      <div>
                        <Button
                          variant="default"
                          size="icon"
                          className="rounded-full my-3 h-12 w-12 ml-2 bg-[#BEA355]"
                          onClick={closeGalleryView}
                        >
                          <X className="h-8 w-8 dark:invert" />

                        </Button>
                      </div>

                      <div
                        className="bg-white dark:bg-gray-900 p-4 rounded-lg max-w-5xl w-full mx-auto grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[90vh] overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {/* Selected Image Display */}
                        <div className="md:col-span-2 mb-4">
                          <a
                            href={`${process.env.NEXT_PUBLIC_S3_URL}${selectedGalleryImage || yachtImages[0]}`}
                            data-fancybox="yacht-gallery"
                          >
                            <Image
                              src={`${process.env.NEXT_PUBLIC_S3_URL}${selectedGalleryImage || yachtImages[0]}`}
                              alt="Selected Gallery Image"
                              className="w-full h-[400px] md:h-[500px] object-cover rounded-md cursor-pointer"
                              width={800}
                              height={500}
                              quality={100}
                            />
                          </a>
                        </div>

                        {/* Gallery Grid */}
                        {yachtImages.map((image, index) => (
                          <a
                            key={index}
                            href={`${process.env.NEXT_PUBLIC_S3_URL}${image}`}
                            data-fancybox="yacht-gallery"
                            className="aspect-square"
                            onClick={(e) => {
                              e.preventDefault();
                              handleGalleryImageSelect(image);
                            }}
                          >
                            <Image
                              src={`${process.env.NEXT_PUBLIC_S3_URL}${image}`}
                              alt={`Yacht Image ${index + 1}`}
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
                <Link href={`/dashboard/yachts/${id}/booking`}>
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
                {location || "Location Not Available"}
              </Badge>
              <div className="flex justify-between items-center mt-2">
                <h2 className="text-xl md:text-2xl font-bold">{name}</h2>
                {yachtsType == "yachts" ? <p className="text-gray-600 dark:text-gray-400">AED <span className="text-xl font-bold !text-black dark:!text-white">{per_day_price}</span>/day</p> : yachtsType == "f1yachts" ? <p className="text-gray-600 dark:text-gray-400">AED
                  <span className="text-xl font-bold !text-black dark:!text-white">{per_day_price}</span>{`/${daysCount} ${daysCount === 1 ? 'Day' : 'Days'}`} </p> : ""}
                {/* f1yachtsTotal(per_day_price,from_date,to_date,[]) */}

              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3">
                {getYachtDetailsGrid(selectedYacht?.yacht)}
                <div className="flex justify-center items-center w-full h-20 border border-gray-300 rounded-lg shadow-sm">
                  <Image src="/assets/images/logoround.svg" quality={100} width={60} height={60} alt="Logo" />
                </div>
              </div>
              <div className="flex justify-between flex-wrap items-center gap-2 my-4">
                <div className="flex justify-start items-center gap-2">
                  <Image src="/assets/images/profile.png" quality={100} width={40} height={40} alt="" />
                  <div className="flex flex-col justify-start">
                    <p className="text-gray-700 dark:text-gray-400 font-light text-sm">
                      Hosted by{" "}
                      <span className="text-black dark:text-white font-medium underline">
                        {crew_member || "Unknown"}
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
                <Link className="hidden md:block" href={session ? `/dashboard/${yachtsType}/${id}/booking` : `/dashboard/${yachtsType}/${id}/guest-booking`}>
                  <Button
                    // onClick={(e) => {
                    //   if (!session) {
                    //     e.preventDefault();
                    //     toast({
                    //       title: "Login Required",
                    //       description: "Please login to book a yacht",
                    //       variant: "destructive"
                    //     });
                    //     router.push('/login');
                    //   }
                    // }}
                    className="rounded-full bg-[#BEA355] w-full min-w-[210px] mx-auto text-white h-10"
                  >
                    Book Now
                  </Button>
                </Link>
              </div>

              {/* Book Now Button */}
              {/* <div className="my-2">
                <Link href={`/dashboard/yachts/${id}/booking`}>
                <Button  className="rounded-full bg-[#BEA355] w-full text-white h-10">
                Book Now
                </Button>
                </Link>
                </div> */}
              <h6 className="text-lg font-medium mb-2">Description</h6>
              <Accordion className="space-y-4" type="multiple" collapsible>
                <AccordionItem className="" value="item-1">
                  <AccordionTrigger className="w-full flex justify-center font-medium items-center h-8 text-xs rounded-lg border-2 border-black dark:border-gray-600">
                    View full description
                  </AccordionTrigger>
                  <AccordionContent className="mt-4">
                    <p className="text-gray-700 dark:text-gray-400 font-light text-sm mb-3">
                      {description || "No description available."}
                    </p>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem className="" value="item-2">
                  <AccordionTrigger className="w-full flex justify-center font-medium items-center h-8 text-xs rounded-lg border-2 border-black dark:border-gray-600">
                    View full specifications
                  </AccordionTrigger>
                  <AccordionContent className="mt-4">
                    <h2 className="text-lg font-medium">
                      Yacht Specifications
                    </h2>
                    {/* Specifications details */}
                    <div className="flex justify-between items-center h-10 px-4 py-2 bg-[#F1F1F1] dark:bg-gray-800 rounded-lg mt-2 font-medium">
                      <p className="text-gray-700 dark:text-gray-400 font-normal text-sm">
                        Capacity
                      </p>
                      <p className="text-gray-700 dark:text-gray-400 font-normal text-sm">
                        {capacity}
                      </p>
                    </div>
                    <div className="flex justify-between items-center h-10 px-4 py-2 bg-[#F1F1F1] dark:bg-gray-800 rounded-lg mt-2 font-medium">
                      <p className="text-gray-700 dark:text-gray-400 font-normal text-sm">
                        Sleeping Capacity
                      </p>
                      <p className="text-gray-700 dark:text-gray-400 font-normal text-sm">
                        {sleep_capacity}
                      </p>
                    </div>
                    <div className="flex justify-between items-center h-10 px-4 py-2 bg-[#F1F1F1] dark:bg-gray-800 rounded-lg mt-2 font-medium">
                      <p className="text-gray-700 dark:text-gray-400 font-normal text-sm">
                        Number of Cabins
                      </p>
                      <p className="text-gray-700 dark:text-gray-400 font-normal text-sm">
                        {number_of_cabin}
                      </p>
                    </div>
                    {length && (
                      <div className="flex justify-between items-center h-10 px-4 py-2 bg-[#F1F1F1] dark:bg-gray-800 rounded-lg mt-2 font-medium">
                        <p className="text-gray-700 dark:text-gray-400 font-normal text-sm">
                          Length
                        </p>
                        <p className="text-gray-700 dark:text-gray-400 font-normal text-sm">
                          {`${length} ft.`}
                        </p>
                      </div>
                    )}
                    {power && (
                      <div className="flex justify-between items-center h-10 px-4 py-2 bg-[#F1F1F1] dark:bg-gray-800 rounded-lg mt-2 font-medium">
                        <p className="text-gray-700 dark:text-gray-400 font-normal text-sm">
                          Power
                        </p>
                        <p className="text-gray-700 dark:text-gray-400 font-normal text-sm">
                          {power}
                        </p>
                      </div>
                    )}

                    {/* <div className="flex justify-between items-center h-10 px-4 py-2 bg-[#F1F1F1] dark:bg-gray-800 rounded-lg mt-2 font-medium">
                      <p className="text-gray-700 dark:text-gray-400 font-normal text-sm">
                        Engine Type
                      </p>
                      <p className="text-gray-700 dark:text-gray-400 font-normal text-sm">
                        {engine_type || "N/A"}
                      </p>
                    </div> */}
                    {flag && (
                      <div className="flex justify-between items-center h-10 px-4 py-2 bg-[#F1F1F1] dark:bg-gray-800 rounded-lg mt-2 font-medium">
                        <p className="text-gray-700 dark:text-gray-400 font-normal text-sm">
                          Flag
                        </p>
                        <p className="text-gray-700 dark:text-gray-400 font-normal text-sm">
                          {flag}
                        </p>
                      </div>
                    )}

                    {crew_member && (
                      <div className="flex justify-between items-center h-10 px-4 py-2 bg-[#F1F1F1] dark:bg-gray-800 rounded-lg mt-2 font-medium">
                        <p className="text-gray-700 dark:text-gray-400 font-normal text-sm">
                          Crew Members
                        </p>
                        <p className="text-gray-700 dark:text-gray-400 font-normal text-sm">
                          {crew_member}
                        </p>
                      </div>
                    )}

                    {crew_language && (
                      <div className="flex justify-between items-center h-10 px-4 py-2 bg-[#F1F1F1] dark:bg-gray-800 rounded-lg mt-2 font-medium">
                        <p className="text-gray-700 dark:text-gray-400 font-normal text-sm">
                          Crew Languages
                        </p>
                        <p className="text-gray-700 dark:text-gray-400 font-normal text-sm">
                          {crew_language}
                        </p>
                      </div>
                    )}

                  </AccordionContent>
                </AccordionItem>
              </Accordion>
              {(crew_member || crew_language) && (
                <section className="mt-4">
                  <h2 className="text-lg font-medium">
                    Crew Info
                  </h2>

                  {crew_member && (
                    <div className="flex justify-between items-center h-10 px-4 py-2 bg-[#F1F1F1] dark:bg-gray-800 rounded-lg mt-2 font-medium">
                      <p className="text-gray-700 dark:text-gray-400 font-normal text-sm">
                        Crew Members
                      </p>
                      <p className="text-gray-700 dark:text-gray-400 font-normal text-sm">
                        {crew_member}
                      </p>
                    </div>
                  )}

                  {crew_language && (
                    <div className="flex justify-between items-center h-10 px-4 py-2 bg-[#F1F1F1] dark:bg-gray-800 rounded-lg mt-2 font-medium">
                      <p className="text-gray-700 dark:text-gray-400 font-normal text-sm">
                        Crew Languages
                      </p>
                      <p className="text-gray-700 dark:text-gray-400 font-normal text-sm">
                        {crew_language}
                      </p>
                    </div>
                  )}
                </section>
              )}

              {yachtsType !== "f1yachts" && ny_status && (ny_availability || ny_price || ny_firework) && (
                <section className="mt-4">
                  <h2 className="text-lg font-medium">
                    New Year's Eve
                  </h2>
                  {ny_availability && (
                    <div className="flex justify-between items-center h-10 px-4 py-2 bg-[#F1F1F1] dark:bg-gray-800 rounded-lg mt-2 font-medium">
                      <p className="text-gray-700 dark:text-gray-400 font-normal text-sm">
                        Time
                      </p>
                      <p className="text-gray-700 dark:text-gray-400 font-normal text-sm">
                        {formatTimeTo12Hour(ny_availability.from)} - {formatTimeTo12Hour(ny_availability.to)}
                      </p>
                    </div>
                  )}
                  {ny_price && (
                    <div className="flex justify-between items-center h-10 px-4 py-2 bg-[#F1F1F1] dark:bg-gray-800 rounded-lg mt-2 font-medium">
                      <p className="text-gray-700 dark:text-gray-400 font-normal text-sm">
                        New Year's Price
                      </p>
                      <p className="text-gray-700 dark:text-gray-400 font-normal text-sm">
                        {ny_price.toLocaleString()}
                      </p>
                    </div>
                  )}
                  {ny_firework !== undefined && (
                    <div className="flex justify-between items-center h-10 px-4 py-2 bg-[#F1F1F1] dark:bg-gray-800 rounded-lg mt-2 font-medium">
                      <p className="text-gray-700 dark:text-gray-400 font-normal text-sm">
                        Fireworks
                      </p>
                      <p className="text-gray-700 dark:text-gray-400 font-normal text-sm">
                        {ny_firework ? "Included" : "Not Included"}
                      </p>
                    </div>
                  )}
                </section>
              )}
              {selectedYacht['New year inclusion'] && selectedYacht['New year inclusion'].length > 0 && (
                <div className="space-x-2 items-center mt-2 font-medium bg-[#F1F1F1] dark:bg-gray-800 rounded-lg p-4">
                  <p className="text-gray-700 dark:text-gray-400 text-sm font-normal">
                    Inclusions:
                  </p>
                  <div className="flex justify-start flex-wrap gap-2 w-fit capitalize mt-2">
                    {selectedYacht['New year inclusion'].map((inclusion) => (
                      <p
                        key={inclusion.id}
                        className="text-gray-700 dark:text-gray-400 font-semibold text-sm flex items-center bg-white dark:bg-gray-800 border-2 border-gray-300 rounded-lg p-2"
                      >
                        <Image
                          src={
                            sub?.dark_icon != "" ? `${process.env.NEXT_PUBLIC_S3_URL}/${sub?.dark_icon}`
                              : '/assets/images/f1.png'
                          }
                          width={20}
                          height={20}
                          alt={inclusion.name}
                          className="mr-2 dark:invert"
                          quality={100}
                        />
                        {inclusion.name}
                      </p>
                    ))}
                  </div>
                </div>
              )}
              <section className="mt-4">
                <h2 className="text-lg font-medium">Amenities</h2>
                <div className="flex flex-wrap gap-2 mt-2">
                  {/* {console.log("selectedYacht.yacht.features",selectedYacht.yacht.features,selectedYacht.yacht)} */}
                  {selectedYacht.yacht.features && selectedYacht.yacht.features.length > 0 ? (
                    selectedYacht.yacht.features.map((feature, index) => (
                      <div key={index} className="flex items-center bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-md px-3 py-2 hover:shadow-lg transition-shadow duration-300">
                        <div className="flex-shrink-0">
                          {feature?.image && (
                            <Image 
                            src={
                              (feature?.image != "") ? `${process.env.NEXT_PUBLIC_S3_URL}${feature?.image}`
                                : '/assets/images/f1.png'
                            }
                             alt={feature.name} width={40} height={40} className="mr-2" />
                          )}
                        </div>
                        <div className="flex-grow">
                          <h3 className="text-gray-800 dark:text-gray-200 font-medium">{feature.name}</h3>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 dark:text-gray-400 text-xs">No features available</p>
                  )}
                </div>
              </section>
              {/* Reviews Section */}
              <div className="my-5">
                <TestimonialsCarousel />
                {/* Inclusions Section */}
                <div className="space-x-2 items-center my-5 font-medium">
                  <p className="text-gray-700 dark:text-gray-400 text-sm font-semibold">
                    Inclusions:
                  </p>
                  <div className="flex justify-start flex-wrap gap-2 w-fit capitalize mt-2">
                    {allInclusions?.length > 0 ? (
                      allInclusions?.map((sub) => (
                        <p
                          key={sub.id}
                          className="text-gray-700 dark:text-gray-400 font-semibold text-sm flex items-center bg-white dark:bg-gray-800 border-2 border-gray-300 rounded-lg p-2"
                        >
                          {sub?.dark_icon &&     <Image
                            src={
                              sub?.dark_icon != "" ? `${process.env.NEXT_PUBLIC_S3_URL}/${sub?.dark_icon}`
                                : '/assets/images/f1.png'
                            }
                            width={20}
                            height={20}
                            alt={sub.name}
                            className="mr-2 dark:invert"
                            quality={100}
                          /> }
                      
                          {sub.name}
                        </p>
                      ))
                    ) : (
                      <p className="text-gray-500 dark:text-gray-400 text-xs">No inclusions available</p>
                    )}
                  </div>
                </div>
                {(longitude || latitude) && (
                  <>
                    <MapSectionWrapper
                    latitude={parseFloat(latitude)}
                    longitude={parseFloat(longitude)}
                  />
                    {/* <h2 className="text-lg font-medium my-4">Location</h2>

                    <MapBoxComponent
                      markers={[
                        { latitude, longitude, yacht: selectedYacht?.yacht, yachtsType },

                      ]}
                      movingObjects={[
                        { id: id, name: name, coordinates: [longitude, latitude] },
                      ]}
                    /> */}


                  </>

                )}
              </div>
              {/* Special Notes */}
              <div className="bg-[#BEA355]/10 dark:bg-gray-800 rounded-2xl px-3 py-3">
                <h1 className="text-lg font-medium">Special Notes</h1>
                {notes ? (
                  <p
                    className="text-gray-700 dark:text-gray-400 font-light text-sm italic mt-0.5"
                    dangerouslySetInnerHTML={{ __html: notes }}
                  />
                ) : (
                  <p className="text-gray-700 dark:text-gray-400 font-light text-sm italic mt-0.5">
                    No special notes available.
                  </p>
                )}
              </div>
              {/* <Accordion className="mt-2">
                <AccordionItem className="" value="item-2">
                  <AccordionTrigger className="w-full flex justify-center font-semibold items-center h-12 rounded-lg border-2 border-black capitalize">
                    Cancellation Policy
                  </AccordionTrigger>
                </AccordionItem>
              </Accordion> */}
            </div>
          </div>
        </div>
      </section>
      {/* Featured Yachts Section */}
      <section className="">
        <Featured />
        {/* <div className="flex justify-center">
            <Link href="/dashboard/yachts">
              <Button className="rounded-full bg-[#BEA355] text-white flex justify-center mx-auto">
                View All
              </Button>
            </Link>
          </div> */}
      </section>
      <div className="fixed md:hidden bottom-0 left-0 w-full  shadow-md z-50 p-4">
        <div className="relative  flex justify-center">
          <Link className="w-full" href={session ? `/dashboard/${yachtsType}/${id}/booking` : `/dashboard/${yachtsType}/${id}/guest-booking`}>
            <Button
              className="rounded-full bg-[#BEA355] w-full min-w-[210px]} mx-auto text-white h-12"
            >
              Book Now
            </Button>
          </Link>
        </div>
      </div>


    </>
  );
};

export default YachtDetail;