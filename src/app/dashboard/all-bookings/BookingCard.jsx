import React from "react";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const BookingSkeleton = () => {
  return (
    <div className="relative w-full max-w-[400px] mx-auto bg-white dark:bg-gray-800 shadow-md rounded-2xl overflow-hidden mt-6 animate-pulse">
      <div className="w-full h-48 bg-gray-300"></div>
      <div className="p-4 space-y-4">
        <div className="h-6 w-3/4 bg-gray-300 rounded"></div>
        <div className="flex flex-row justify-start gap-6">
          <div className="flex flex-col space-y-2">
            <div className="h-4 w-20 bg-gray-300 rounded"></div>
            <div className="h-4 w-20 bg-gray-300 rounded"></div>
            <div className="h-4 w-20 bg-gray-300 rounded"></div>
            <div className="h-4 w-20 bg-gray-300 rounded"></div>
          </div>
          <div className="flex flex-col space-y-2">
            <div className="h-4 w-32 bg-gray-300 rounded"></div>
            <div className="h-4 w-24 bg-gray-300 rounded"></div>
            <div className="h-4 w-16 bg-gray-300 rounded"></div>
            <div className="h-4 w-32 bg-gray-300 rounded"></div>
          </div>
        </div>
        <div className="h-10 w-full bg-gray-300 rounded"></div>
      </div>
    </div>
  );
};

const BookingCard = ({ booking,bookingType }) => {
  // console.log("booking",booking)
  const getDisplayDate = (booking) => {
    const date = booking.from_date || booking.selected_date;
    if (!date) return 'Date not available';

    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const bookingDetails = {
    name: booking.yacht?.name ||
          booking.package?.event_name || 
          booking.experience?.name || 
          booking.event_name || 
          'Unknown',
    image: booking.yacht?.yacht_image 
      ? `${process.env.NEXT_PUBLIC_S3_URL}${booking.yacht.yacht_image}` 
      : booking.package?.package_image 
        ? `${process.env.NEXT_PUBLIC_S3_URL}${booking.package.package_image}` 
        : booking.experience?.experience_image 
          ? `${process.env.NEXT_PUBLIC_S3_URL}${booking.experience.experience_image}` 
          : "/assets/images/abudhabi.png",
    location: booking.yacht?.location || 
              booking.package?.location || 
              booking.experience?.location || 
              'Unknown Location',
    guests: `${booking.adults || 0} Adults, ${booking.kid_teen || 0} Kids`,
    duration: booking.duration_hour || 
              booking.package?.duration_hour || 
              booking.experience?.duration || 
              'N/A',
    booking_type: booking.booking_type || 'N/A'
  };

  const getRouteParams = () => {
    switch (booking.type) {
      case 'yacht':
        return { 
          type: 'yachts', 
          id: booking.yacht_id || booking.id 
        };
      case 'event':
        return { 
          type: 'events', 
          id: booking.package_id || booking.package?.id || booking.id 
        };
      case 'experience':
        return { 
          type: 'experience', 
          id: booking.experience_id || booking.id 
        };
      default:
        return { 
          type: 'unknown', 
          id: booking.id 
        };
    }
  };

  const { type, id } = getRouteParams();

  return (
    <div
      key={booking.id}
      className="relative w-full max-w-[400px] mx-auto bg-white dark:!bg-gray-800 shadow-md rounded-2xl overflow-hidden mt-4"
    >
      {/* {booking.daysLeft > 0 && (
        <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-normal px-2 py-1 rounded-sm">
          {booking.daysLeft} Days Left
        </div>
      )} */}
      <Image
        src={bookingDetails.image}
        alt={bookingDetails.name}
        className="w-full h-48 object-cover"
        width={500}
        height={300}
      />  
    {/* <div className="p-4 dark:bg-gray-800">
      <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">
        {bookingDetails.name}
      </h2>
      <div className="flex flex-row justify-start gap-6 mb-4">
      <div className="flex flex-col space-y-1">
        <span className="font-medium text-gray-600 dark:text-gray-400">Departure:</span>
        <span className="font-medium text-gray-600 dark:text-gray-400">Duration:</span>
        <span className="font-medium text-gray-600 dark:text-gray-400">Dates:</span>
        <span className="font-medium text-gray-600 dark:text-gray-400">Guests:</span>
        <span className="font-medium text-gray-600 dark:text-gray-400">Location:</span>
      </div>
      <div className="flex flex-col space-y-1">
        <span className="font-light text-gray-600 dark:text-gray-400">
        {getDisplayDate(booking)}
        </span>
        {bookingDetails.booking_type === "hourly" ? (
          <span className="font-light text-gray-600 dark:text-gray-400">
            {bookingDetails.duration} hours
          </span>
        ) : (
          <>
            <span className="font-light text-gray-600 dark:text-gray-400">
              {bookingDetails.duration} hours
            </span>
            <span className="font-light text-gray-600 dark:text-gray-400">
              {booking?.yacht?.from_date && booking?.yacht?.to_date ? (
                `${new Date(booking?.yacht?.from_date).toLocaleDateString()} - ${new Date(booking?.yacht?.to_date).toLocaleDateString()}`
              ) : (
                'N/A'
              )}
            </span>
          </>
        )}
        <span className="font-light text-gray-600 dark:text-gray-400">
          {bookingDetails.guests}
        </span>
        <span className="font-light text-xs text-gray-700 dark:text-gray-300 bg-[#BEA355]/20 dark:bg-[#BEA355]/20 px-2 py-1 rounded-md flex items-center gap-1">
          <MapPin className="size-3" />
          {bookingDetails.location}
        </span>
      </div>
    </div>
      <Link href={`/dashboard/${type}/${id}/booking/booking-summary?bookingId=${booking.id}`}
            onClick={(e) => {
              console.log('Booking Details:', {
                type: booking.type,
                id: id,
                bookingId: booking.id,
                booking: booking
              });
            }}
      >
        <Button
          variant="outline"
          className="w-full py-3 rounded-full border-2 border-black dark:border-gray-300 dark:text-gray-300 dark:hover:bg-gray-700"
        >
          Booking Summary
        </Button>
      </Link>
    </div> */}
    <div className="px-4 py-2 dark:bg-gray-800">
      <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
        {bookingDetails.name}
      </h2>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center text-sm gap-2">
            <span className="text-gray-600 dark:text-gray-400 font-medium">Departure:</span>
            <span className="text-gray-600 dark:text-gray-400">{getDisplayDate(booking)}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center text-sm gap-2">
            <span className="text-gray-600 dark:text-gray-400 font-medium">Duration:</span>
            <span className="text-gray-600 dark:text-gray-400">{bookingDetails.duration} hours</span>
          </div>
        </div>

        {/* <div className="flex items-center justify-between">
          <div className="flex items-center text-sm gap-2">
            <span className="text-gray-600 dark:text-gray-400 font-medium">Dates:</span>
            <span className="text-gray-600 dark:text-gray-400">
              {booking?.yacht?.from_date && booking?.yacht?.to_date
                ? `${new Date(booking.yacht.from_date).toLocaleDateString()} - ${new Date(booking.yacht.to_date).toLocaleDateString()}`
                : 'N/A'}
            </span>
          </div>
        </div> */}

        <div className="flex items-center justify-between">
          <div className="flex items-center text-sm gap-2">
            <span className="text-gray-600 dark:text-gray-400 font-medium">Guests:</span>
            <span className="text-gray-600 dark:text-gray-400">{bookingDetails.guests}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 bg-[#BEA355]/20 dark:bg-[#BEA355]/20 px-2 py-1 rounded-md">
            <MapPin className="size-4 text-gray-600 dark:text-gray-400" />
            <span className="text-gray-600 text-sm dark:text-gray-400">{bookingDetails.location}</span>
          </div>
        </div>
      </div>
      {booking?.type == "regular-exp" ? 
            <Link 
            href={`/dashboard/experience/regular-exp/${id}/booking/?bookingId=${booking.id}&bookingType=${bookingType}`}
            className="mt-4 block"
          >
            <Button
              variant="outline"
              className="w-full py-3 rounded-full border-2 border-black dark:border-gray-300 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              Booking Summary
            </Button>
          </Link>
       : booking?.type == "f1-exp" ? 
       <Link 
       href={`/dashboard/experience/f1-exp/${id}/booking/?bookingId=${booking.id}&bookingType=${bookingType}`}
       className="mt-4 block"
     >
       <Button
         variant="outline"
         className="w-full py-3 rounded-full border-2 border-black dark:border-gray-300 dark:text-gray-300 dark:hover:bg-gray-700"
       >
         Booking Summary
       </Button>
     </Link> : booking?.type == "f1yachts" ? <Link 
        href={`/dashboard/f1yachts/${id}/booking/?bookingId=${booking.id}&bookingType=${bookingType}`}
        className="mt-4 block"
      >
        <Button
          variant="outline"
          className="w-full py-3 rounded-full border-2 border-black dark:border-gray-300 dark:text-gray-300 dark:hover:bg-gray-700"
        >
          Booking Summary
          
        </Button>
      </Link>
        : <Link 
        href={`/dashboard/${type}/${id}/booking/?bookingId=${booking.id}&bookingType=${bookingType}`}
        className="mt-4 block"
      >
        <Button
          variant="outline"
          className="w-full py-3 rounded-full border-2 border-black dark:border-gray-300 dark:text-gray-300 dark:hover:bg-gray-700"
        >
          Booking Summary
          
        </Button>
      </Link>}

</div>
    </div>
  );
};

const BookingCards = ({ bookings, loading,bookingType }) => {
  if (loading) {
    return (
      <div className="flex flex-wrap w-full space-x-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <BookingSkeleton key={index} />
        ))}
      </div>
    );
  }

  // Render actual booking cards
  return (
    <>
      {bookings.map((booking) => (
        <BookingCard key={booking.id} booking={booking} bookingType={bookingType} />
      ))}
    </>
  );
};

export default BookingCards;