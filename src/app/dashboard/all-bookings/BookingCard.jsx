import React from "react";
import { Button } from "@/components/ui/button";
import { MapPin, Sailboat } from "lucide-react";
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

const BookingCard = ({ booking }) => {
  // Determine the booking details based on type
  const bookingDetails = {
    name: booking.yacht?.name ||
          booking.package?.event_name || 
          booking.experience?.name || 
          booking.event_name || 
          'Unknown',
    image: booking.yacht?.yacht_image 
      ? `https://api.takeoffyachts.com/${booking.yacht.yacht_image}` 
      : booking.package?.package_image 
        ? `https://api.takeoffyachts.com/${booking.package.package_image}` 
        : booking.experience?.experience_image 
          ? `https://api.takeoffyachts.com/${booking.experience.experience_image}` 
          : "/assets/images/abudhabi.png",
    location: booking.yacht?.location || 
              booking.package?.location || 
              booking.experience?.location || 
              'Unknown Location',
    guests: `${booking.adults || 0} Adults, ${booking.kid_teen || 0} Kids`,
    duration: booking.duration_hour || 
              booking.package?.duration_hour || 
              booking.experience?.duration || 
              'N/A'
  };

  // Determine the correct ID and type for routing
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
      className="relative w-full max-w-[400px] mx-auto bg-white dark:!bg-gray-800 shadow-md rounded-2xl overflow-hidden mt-6"
    >
      {booking.daysLeft > 0 && (
        <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-normal px-2 py-1 rounded-sm">
          {booking.daysLeft} Days Left
        </div>
      )}
      <Image
        src={bookingDetails.image}
        alt={bookingDetails.name}
        className="w-full h-48 object-cover"
        width={500}
        height={300}
      />  
      <div className="p-4 dark:!bg-gray-800">
        <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">
          {bookingDetails.name}
        </h2>
        <div className="flex flex-row justify-start gap-6 mb-4">
          <div className="flex flex-col space-y-1">
            <span className="font-medium text-gray-600 dark:text-gray-400">Departure:</span>
            <span className="font-medium text-gray-600 dark:text-gray-400">Duration:</span>
            <span className="font-medium text-gray-600 dark:text-gray-400">Guests:</span>
            <span className="font-medium text-gray-600 dark:text-gray-400">Location:</span>
          </div>
          <div className="flex flex-col space-y-1">
            <span className="font-light text-gray-600 dark:text-gray-400">
              {new Date(booking.selected_date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
            <span className="font-light text-gray-600 dark:text-gray-400">
              {bookingDetails.duration} {booking.type === 'yacht' ? 'hours' : ''}
            </span>
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
      </div>
    </div>
  );
};

const BookingCards = ({ bookings, loading }) => {
  // If loading, show skeleton loaders
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
        <BookingCard key={booking.id} booking={booking} />
      ))}
    </>
  );
};

export default BookingCards;