"use client";
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  CalendarIcon, 
  MapPin, 
  Minus, 
  Plus, 
  DollarSign,
  CheckCircle 
} from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { useBookingContext } from './BookingContext';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Image from 'next/image';
import { summaryimg } from '../../../../../../../public/assets/images';
import { useParams, useSearchParams } from 'next/navigation';
import { Label } from '@/components/ui/label';
import { formatDate } from '@/helper/calculateDays';

const Selection = ({ onNext,eventData }) => {
  const { bookingData, updateBookingData } = useBookingContext();
  const [loading, setLoading] = useState(false);
    const { eventsType } = useParams();
      const queryString = typeof window !== "undefined" ? window.location.search : "";
      const searchParams = useSearchParams(queryString);
      let tickets = Number(searchParams.get('tickets'))
      let packageId = searchParams.get('package')
  

  // useEffect(() => {
  //   if (!bookingData.startTime) {
  //     const defaultTime = new Date();
  //     defaultTime.setHours(9, 0, 0, 0);
  //     updateBookingData({ startTime: defaultTime });
  //   }
  // }, []);

  const handlePackageSelect = (pkg) => {
    updateBookingData({ 
      selectedPackage: pkg,
      duration: eventData?.duration_hour || 3
    });
  };

  const calculateTotal = () => {
    if (!bookingData.selectedPackage) return 0;
    
    const packagePrice = bookingData.selectedPackage.price || 0;
    const totalGuests = bookingData.tickets + bookingData.kids;
    const featuresPrices = bookingData.selectedPackage.features?.reduce((total, feature) => 
      total + (feature.price || 0), 0) || 0; 
    
    return (packagePrice + featuresPrices) * totalGuests;
  };

  const handleNext = () => {
    if (!bookingData.selectedPackage) {
      toast.error('Please select a package to continue');
      return;
    }

    if (bookingData.tickets + bookingData.kids === 0) {
      toast.error('Please add at least one tickets');
      return;
    }

    onNext();
  };

  useEffect(() => {
    const selectedPackage = eventData?.packages_system?.find((v) => v?.id == packageId);  
    if (selectedPackage) {
      updateBookingData({ 
        selectedPackage: selectedPackage,
      duration: eventData?.duration_hour || 3,
        tickets:tickets,
        eventId:eventData?.id,
        totalDaysPrice:eventData?.total_days_price

      });
    }
  }, [eventData,packageId,tickets])

///test

  return (
    <div className="space-y-8">
      {/* Event Details */}
      <Card className="p-4">
        <div className="relative w-full h-48 mb-4">
          <Image
            src={eventData?.event_image
              ? `${process.env.NEXT_PUBLIC_S3_URL}${eventData?.event_image}`
              : '/assets/images/Imagenotavailable.png'
          }
            alt={eventData?.name}
            fill
            className="object-cover rounded-lg"
            onError={(e) => {
              e.target.src = '/assets/images/Imagenotavailable.png'
          }}
          />
        </div>
        <h2 className="text-xl font-semibold mb-2">{eventData?.name}</h2>
        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-2">
          <MapPin className="w-4 h-4" />
          <span>{eventData?.location || 'Location not specified'}</span>
        </div>
      </Card>

      {/* Package Selection */}
      {/* <div className="my-5">
        <h3 className="text-lg font-semibold mb-4">Select Package</h3>
        <Carousel>
          <CarouselContent>
            {console.log("eventData",eventData)}
            {eventData?.packages_system?.map((pkg, index) => (
              <CarouselItem key={index} className="ml-4 p-2">
                <div 
                  className={cn(
                    'bg-white dark:bg-gray-800 rounded-2xl border p-4 space-y-2 w-full max-w-[270px] h-full min-h-[250px] shadow-md flex flex-col justify-between cursor-pointer transition-all',
                    bookingData.selectedPackage?.id === pkg?.id 
                      ? "border-[#BEA355] bg-[#F4F0E4]" 
                      : "hover:border-[#BEA355]"
                  )}
                  onClick={() => handlePackageSelect(pkg)}
                >
                  <div>
                    <h3 className='text-gray-700 dark:text-gray-100 capitalize font-semibold text-lg'>{pkg?.package_type}</h3>
                    <p className='text-gray-700 dark:text-gray-300 font-normal text-sm flex-grow truncate overflow-hidden ellipsis'>
                      {pkg?.description || 'No description available'}
                    </p>
                  </div>
                  <div className='flex flex-col justify-start space-y-2'>
                    <p className='font-semibold text-3xl text-[#BEA355] flex items-center'>
                      <span className="text-sm mx-2">AED</span>     
                      {pkg?.price}
                      <span className='text-sm text-gray-700 dark:text-gray-300 mt-2'>.00/ticket</span>
                    </p>
                    <div className="text-sm text-gray-600 dark:text-gray-300">
                      Duration: {pkg?.duration_hour || 3} hours
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">
                      Available Tickets: {pkg?.quantity_available}
                    </div>
                  </div>
                  {pkg?.features && pkg?.features.length > 0 && (
                    <div className='flex flex-col justify-start items-start space-y-2 mt-2 ml-2'>
                      <h5 className='text-gray-700 dark:text-gray-300 font-semibold text-lg capitalize mb-2'>What's included?</h5>
                      <ul className='list-disc list-inside text-gray-700 dark:text-gray-300 font-light text-sm'>
                        {pkg?.features.map((feature, idx) => (
                          <li key={idx} className='flex items-center capitalize'>
                            <CheckCircle className='size-6 mr-2 text-green-500 bg-green-500/10 rounded-full p-1' />
                            {feature.name} (${feature.price})
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div> */}

      <div className="grid grid-cols-2 gap-8">
        <div className="space-y-6">

            {eventsType == "all" ? <div className="flex flex-col space-y-2">
                        <Label className="text-sm font-medium">
                          <span className='text-red-5'> Event Booking Slot:</span>
                        </Label>
                        <span className='mt-4'> {formatDate(eventData?.from_date)} - {formatDate(eventData?.to_date)}</span>
          
                      
          
                      </div>: eventsType == "f1events" ? "" : ""}
          {/* <div className="space-y-4">
            <div className="grid gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !bookingData.date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {bookingData.date ? format(bookingData.date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={bookingData.date}
                    onSelect={(date) => updateBookingData({ date })}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div> */}

          {/* Guests Selection */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Number of Tickets</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Tickets</span>
                <div className="flex items-center gap-4">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => updateBookingData({ tickets: Math.max(0, bookingData.tickets - 1) })}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span>{bookingData.tickets}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => updateBookingData({ tickets: bookingData.tickets + 1 })}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* <div className="flex items-center justify-between">
                <span>Kids</span>
                <div className="flex items-center gap-4">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => updateBookingData({ kids: Math.max(0, bookingData.kids - 1) })}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span>{bookingData.kids}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => updateBookingData({ kids: bookingData.kids + 1 })}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div> */}
            </div>
          </div>

          {/* Total Price */}
          <div className="bg-[#F4F0E4] dark:bg-gray-800 p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="font-medium">Total Price:</span>
              <span className="font-bold">AED {calculateTotal()}</span>
            </div>
          </div>

          <Button 
            onClick={handleNext}
            disabled={loading || bookingData?.tickets <=0}
            className="bg-[#BEA355] text-white rounded-full w-full h-10"
          >
            {loading ? 'Processing...' : 'Continue'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Selection;