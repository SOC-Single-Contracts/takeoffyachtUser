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
  Ticket,
  UserRound,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import MapSectionWrapper from "@/components/shared/dashboard/MapSectionWrapper";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { fetchEvents } from "@/api/yachts";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { useToast } from "@/hooks/use-toast";
import Events from "@/components/lp/Events";
import { fetchAllEventsList, findEventById } from "@/api/events";
import DetailPageGallery2 from "@/components/lp/DetailPageGallery2";
import EventSliderEmbala from "@/components/EventsSlider/js/EmblaCarouselEvent";

const EventDetail = () => {
  const { id, eventsType } = useParams();
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [ticketCounts, setTicketCounts] = useState({});
  const [selectedMainImage, setSelectedMainImage] = useState(null);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [selectedGalleryImage, setSelectedGalleryImage] = useState(null);
  const router = useRouter();
  const { data: session } = useSession();
  const { toast } = useToast();

  useEffect(() => {
    const getEvent = async () => {
      try {
        // const data = await fetchEvents(session?.user?.userid || 1);
        const event = await findEventById(id)
        // console.log(event)


        // const event = data.find(
        //   (item) => item.event.id.toString() === id
        // ); 

        if (!event) {
          throw new Error('Event not found');
        }

        setSelectedEvent(event);
      } catch (err) {
        setError(err.message || 'Unexpected Error');
      } finally {
        setLoading(false);
      }
    };

    if (session?.user?.userid || 1) {
      getEvent();
    }
  }, [id, session?.user?.userid || 1]);

  // setTicketCounts(prev => ({
  //   ...prev,
  //   [packageId]: action === 'increase'
  //     ? (prev[packageId] || 0) + 1
  //     : Math.max(0, (prev[packageId] || 0) - 1)
  // }));
  const handleTicketChange = (packageId, action, pkg) => {
    const now = new Date();
    const today = now.toISOString().split("T")[0]; // e.g. "2025-06-10"
    const eventEndDate = selectedEvent.to_date.split("T")[0]; // e.g. "2025-06-12"
  
    // console.log("Today:", today);
    // console.log("Event End Date:", eventEndDate);
  
    if (today > eventEndDate) {
      toast({
        title: "Error",
        description: "Cannot book tickets for past events.",
        variant: "destructive",
      });
      return;
    }

    setTicketCounts(prev => {
      const currentCount = prev[packageId] || 0;
      const remaining = pkg.remaining_quantity;

      
      if (action === 'increase') {
        if (currentCount < remaining) {
          return {
            ...prev,
            [packageId]: currentCount + 1
          };
        } else {
          toast({
            title: 'Error',
            description: `You have reached the maximum allowed tickets (${remaining}) for this package.`,
            variant: "destructive",
          });
          return prev;
        }
      } else {
        return {
          ...prev,
          [packageId]: Math.max(0, currentCount - 1)
        };
      }
    });
  };



  if (error) {
    return (
      <section className="py-16">
        <div className="container px-4 mx-auto">
          <p className="text-red-500">Error loading event: {error}</p>
        </div>
      </section>
    );
  }

  if (!selectedEvent) {
    return null;
  }

  const {
    name,
    location,
    title,
    event_image,
    total_tickets, //
    from_date,
    to_date,
    duration_hour,
    cancel_time_in_hours, //
    description,
    notes, //
    longitude, //
    latitude, //
    packages_system,
  } = selectedEvent;

  const handleBookNow = () => {
    if (!session) {
      toast.error("Please login to book an event");
      router.push('/login');
      return;
    }

    router.push(`/dashboard/event/${eventsType}/${id}/booking`);
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

  const eventImages = [
    selectedEvent?.event_image,
    selectedEvent?.event?.image1,
    selectedEvent?.event?.image2,
    selectedEvent?.event?.image3,
    selectedEvent?.event?.image4,
    selectedEvent?.event?.image5,
  ].filter(Boolean);

  const uniqueEventImages = [...new Set([selectedEvent?.event_image, ...eventImages])].filter(Boolean);

  //test
  console.log("selectedEvent", selectedEvent)
  // console.log("ticketCounts", ticketCounts)



  return (
    <>
      <section>
        <div className="max-w-5xl mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row -mx-4">
            <div className="w-full mt-8 mb-10">
              {/* {console.log("eventImages",eventImages)} */}
              {!selectedEvent || !selectedEvent ? null : (() => {
                const images = eventImages
                  .filter((image) => typeof image === "string" && image.trim() !== "")
                  .map((image) => `${process.env.NEXT_PUBLIC_S3_URL}${image}`)
                // .map((image) => `https://api.takeoffyachts.com${image}`)


                return (
                  <>
                    {/* <DetailPageGallery images={images} /> */}
                    <DetailPageGallery2 images={images} showThumb={false} />
                  </>
                )
              })()}
            </div>
            {/* Image Column */}
            {/* <div className="w-full lg:w-1/2 px-4 mb-8 lg:mb-0">
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-4">
                  <Image
                    src={event_image
                      ? `https://api.takeoffyachts.com${event_image}`
                      : "/assets/images/f1.png"
                    }
                    alt={name}
                    className="w-full h-auto object-cover rounded-md shadow-md"
                    width={600}
                    height={400}
                  />
                </div>
              </div>
            </div> */}
            {/* Image Column */}
            {/* <div className="w-full lg:w-1/2 px-2 mb-8 lg:mb-0"> */}
            {/* <div className="flex flex-col gap-6"> */}
            {/* <Carousel className="w-full">
                  <CarouselContent>
                    {uniqueEventImages.map((image, index) => (
                      <CarouselItem key={index}>
                        <Image
                          src={`https://api.takeoffyachts.com${image}`}
                          alt={`Event Image`}
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
                </Carousel> */}

            {/* Thumbnail Gallery */}
            {/* <div className="grid grid-cols-5 gap-2">
                  {eventImages.map((image, index) => (
                    <div
                      key={index}
                      className="aspect-square"
                      onClick={() => handleMainImageSelect(image)}
                    >
                      <Image
                        src={`https://api.takeoffyachts.com${image}`}
                        alt={`Event Image`}
                        className="w-full h-full object-cover rounded-md shadow-sm cursor-pointer hover:opacity-80 transition-opacity"
                        width={200}
                        height={200}
                        quality={100}
                      />
                    </div>
                  ))}
                </div> */}

            {/* Gallery Overlay */}
            {/* {isGalleryOpen && (
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
                        <div className="md:col-span-2 mb-4">
                          <a
                            href={`https://api.takeoffyachts.com${selectedGalleryImage || eventImages[0]}`}
                            data-fancybox="event-gallery"
                          >
                            <Image
                              src={`https://api.takeoffyachts.com${selectedGalleryImage || eventImages[0]}`}
                              alt="Selected Gallery Image"
                              className="w-full h-[400px] md:h-[500px] object-cover rounded-md cursor-pointer"
                              width={800}
                              height={500}
                              quality={100}
                            />
                          </a>
                        </div>

                        {eventImages.map((image, index) => (
                          <a
                            key={index}
                            href={`https://api.takeoffyachts.com${image}`}
                            data-fancybox="event-gallery"
                            className="aspect-square"
                            onClick={(e) => {
                              e.preventDefault();
                              handleGalleryImageSelect(image);
                            }}
                          >
                            <Image
                              src={`https://api.takeoffyachts.com${image}`}
                              alt={`Event Image`}
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
                )} */}
            {/* </div> */}
            {/* </div> */}
            {/* Details Column */}
            <div className="w-full md:w-2/2 lg:w-2/4 px-4">
              <Badge className="bg-[#BEA355]/30 text-black dark:text-white font-medium p-1 hover:bg-[#BEA355]/40">
                <MapPin className="size-4 mr-2 text-gray-700 dark:text-gray-400" />
                {location || "Location Not Available"}
              </Badge>
              <div className="flex justify-between items-center mt-6">
                <h2 className="text-xl md:text-3xl font-bold">{name}</h2>
                <p className="text-gray-600 dark:text-gray-400">{packages_system?.length} Packages Available</p>
              </div>

              {/* Event Details Grid */}
              <div className="grid grid-cols-3 md:grid-cols-3 gap-4 my-3">
                <div className="flex flex-col justify-center items-center w-full h-20 space-y-2 font-semibold text-sm py-4 border border-gray-300 rounded-lg shadow-sm">
                  <Calendar className="size-5" />
                  <p className="text-gray-700 dark:text-gray-400">{new Date(from_date).toLocaleDateString()}</p>
                </div>
                <div className="flex flex-col justify-center items-center w-full h-20 space-y-2 font-semibold text-sm py-4 border border-gray-300 rounded-lg shadow-sm">
                  <Clock className="size-5" />
                  <p className="text-gray-700 dark:text-gray-400">{duration_hour} Hours</p>
                </div>
                <div className="flex flex-col justify-center items-center w-full h-20 space-y-2 font-semibold text-sm py-4 border border-gray-300 rounded-lg shadow-sm">
                  <Ticket className="size-5" />
                  <p className="text-gray-700 dark:text-gray-400">{total_tickets} Tickets</p>
                </div>
                {/* <div className="flex flex-col justify-center items-center w-full h-20 space-y-2 font-semibold text-sm py-4 border border-gray-300 rounded-lg shadow-sm">
                  <UserRound className="size-5" />
                  <p className="text-gray-700 dark:text-gray-400">Cancellation: {cancel_time_in_hours}h</p>
                </div> */}
              </div>

              <h6 className="text-lg font-medium mt-4">Description</h6>
              <p className="text-gray-700 dark:text-gray-400 font-light text-sm mb-3">
                {description || "No description available."}
              </p>

              {/* Packages Section */}
              <div className='my-5'>
                <h2 className="text-2xl font-semibold mb-4">Available Packages</h2>
                {/* <Carousel>
                  <CarouselContent>
                    {packages_system?.map((pkg, index) => (
                      <CarouselItem key={index} className="ml-4 p-2">
                        <div className='bg-white dark:bg-gray-800 rounded-3xl border p-4 space-y-2 w-full max-w-[270px] h-full min-h-[220px] flex flex-col justify-between'>
                          <div>
                            <h3 className='text-gray-700 font-semibold text-lg dark:text-white'>{pkg?.name}</h3>
                            <p className='text-gray-700 font-normal text-sm flex-grow dark:text-white truncate overflow-hidden ellipsis'>
                              {pkg?.description || 'No description available'}
                            </p>
                          </div>
                          <div className='flex flex-col justify-start space-y-4'>
                            <p className='font-semibold text-3xl text-[#BEA355] flex items-center dark:text-white mt-6'>
                              <span className="text-sm mx-2">AED</span>     {pkg?.price}
                              <span className='text-sm text-gray-700 mt-2 dark:text-white'>.00/per ticket</span>
                            </p>

                            <div className="flex items-center justify-between dark:bg-gray-900 p-2 rounded-lg">
                              <span className="text-sm font-medium">Tickets</span>
                              <div className="flex items-center space-x-3">
                                <Button
                                  variant="outline"
                                  size="icon"
                                  onClick={() => handleTicketChange(pkg?.id, 'decrease')}
                                  className="h-8 w-8 rounded-xl bg-[#F4F4F4] dark:bg-gray-800"
                                >
                                  -
                                </Button>
                                <span className="text-lg font-medium w-6 text-center">
                                  {ticketCounts[pkg?.id] || 0}
                                </span>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  onClick={() => handleTicketChange(pkg?.id, 'increase')}
                                  className="h-8 w-8 rounded-xl bg-[#F4F4F4] dark:bg-gray-800"
                                >
                                  +
                                </Button>
                              </div>
                            </div>

                            <div className="text-sm font-medium flex justify-between items-center">
                              <span>Total Amount:</span>
                              <span className="text-[#BEA355]">
                                AED {(ticketCounts[pkg?.id] || 0) * pkg?.price}
                              </span>
                            </div>

                            <Link
                              className="w-full"
                              href={`/dashboard/event/${eventsType}/${id}/booking?tickets=${ticketCounts[pkg?.id] || 0}&package=${pkg?.id}`}
                              onClick={(e) => {
                                if (!ticketCounts[pkg?.id]) {
                                  e.preventDefault();
                                  toast({
                                    title: "Select Tickets",
                                    description: "Please select at least one ticket",
                                    variant: "default"
                                  });
                                  return;
                                }

                                if (!session) {
                                  e.preventDefault();
                                  toast({
                                    title: "Login Required",
                                    description: "Please login to book an event",
                                    variant: "destructive"
                                  });
                                  router.push('/login');
                                }
                              }}
                            >
                              <Button
                                className='bg-[#BEA355] text-white rounded-full px-4 h-10 w-full disabled:opacity-50'
                                disabled={!ticketCounts[pkg?.id]}
                              >
                                Book Now
                              </Button>
                            </Link>
                    
                          </div>
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                </Carousel> */}

                {packages_system?.length > 0 && <div className="container classForEmbalaCaroselEvent mx-auto pb-6 px-2">

                  <EventSliderEmbala slides={packages_system} handleTicketChange={handleTicketChange} ticketCounts={ticketCounts} />

                </div>}
              </div>
              {/* Book Now Button */}
              {/* <div className="my-4">
                <Button 
                  onClick={handleBookNow}
                  className="rounded-full bg-[#BEA355] w-full text-white h-10"
                >
                  Book Now
                </Button>
              </div> */}

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

      {/* Featured Events Section */}
      <section className="px-2 pb-10">
        <Events />
        <div className="flex justify-center">
          <Link href="/dashboard/event/all">
            <Button className="rounded-full bg-[#BEA355] text-white flex justify-center mx-auto">
              View All Events
            </Button>
          </Link>
        </div>
      </section>
    </>
  );
};

export default EventDetail;