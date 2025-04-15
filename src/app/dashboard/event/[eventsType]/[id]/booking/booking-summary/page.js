"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowLeft, Mail, MapPin, Phone, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useParams, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { dubai, summaryimg } from "../../../../../../../../public/assets/images";
import Image from "next/image";

const BookingSummary = () => {
  const { id } = useParams();
  const searchParams = useSearchParams();
  const bookingId = searchParams.get("bookingId");
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    const fetchBookingDetails = async () => {
      if (!bookingId || !session?.user?.userid) {
        setError('Missing booking ID or user session');
        setLoading(false);
        return;
      }
      
      try {
        console.log('Fetching booking details:', {
          bookingId,
          userId: session.user.userid
        });

        // Fetch event bookings
        const response = await fetch(`https://api.takeoffyachts.com/yacht/get_event_booking/${session.user.userid}`);
        const data = await response.json();

        if (data.error_code === 'pass' && data.data) {
          // Find booking by ID or package ID
          const foundBooking = data.data.find(item => 
            item.id === parseInt(bookingId) || 
            item.package_id === parseInt(id)
          );

          if (foundBooking) {
            setBooking({
              ...foundBooking,
              type: 'event',
              package: foundBooking.package,
              event: {
                name: foundBooking.package?.event_name || 
                       foundBooking.name || 
                       foundBooking.package?.package_name || 
                       'Unnamed Event',
                description: foundBooking.package?.description || 'No description available'
              },
              name: foundBooking.package?.event_name || 
                    foundBooking.name || 
                    foundBooking.package?.package_name || 
                    'Unnamed Event'
            });
          } else {
            setError('No matching booking found');
            console.error('No matching booking found', { 
              bookingId, 
              id, 
              bookings: data.data 
            });
          }
        } else {
          setError('Failed to fetch bookings');
        }
      } catch (error) {
        console.error('Error fetching booking details:', error);
        setError(error.message || 'An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchBookingDetails();
  }, [bookingId, id, session?.user?.userid]);

  // Error handling for loading and error states
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-pulse space-y-4">
          <div className="h-12 bg-gray-200 rounded-lg w-64"></div>
          <div className="h-4 bg-gray-200 rounded w-48"></div>
        </div>
      </div>
    );
  }

  // Comprehensive error handling
  if (error || !booking) {
    return (
      <div className="flex items-center justify-center h-screen text-center">
        <div>
          <h3 className="text-xl font-semibold text-red-600 mb-2">
            Booking Not Found
          </h3>
          <p className="text-gray-500 mb-4">
            {error || 'The requested booking could not be retrieved.'}
          </p>
          <Button 
            onClick={() => router.push('/dashboard/all-bookings')}
            className="bg-[#BEA355] hover:bg-[#a68f4b] text-white rounded-full"
          >
            Back to Bookings
          </Button>
        </div>
      </div>
    );
  }

  // Rest of the component remains the same, but add a safety check
  return (
    <section className="py-10 px-2">
      {/* Add a safety check before accessing nested properties */}
      {booking && booking.package && (
        <>
          {/* Your existing rendering logic */}
          <div className="max-w-5xl px-2 mx-auto flex items-center space-x-4">
            <Link href="/dashboard/all-bookings">
              <Button className="bg-[#F8F8F8] hover:bg-[#F8F8F8] shadow-md rounded-full flex items-center justify-center w-10 h-10">
                <ArrowLeft className="w-4 h-4 text-black" />
              </Button>
            </Link>
            <h1 className="text-sm md:text-lg font-medium">Booking Details</h1>
          </div>
          <div className="max-w-5xl mx-auto container px-2 space-y-6 mt-8">
            <Image src={summaryimg} className="w-full h-[300px] object-cover rounded-xl" alt="" />
            <Table>
              <TableHeader className="bg-[#EBEBEB] dark:bg-gray-700">
                <TableRow>
                  <TableHead className="font-semibold text-black dark:text-gray-400 rounded-t-lg">
                    {booking.package.event_name || 'Event Details'}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="border border-gray-200 dark:border-gray-700 bg-white">
                <TableRow>
                  <TableCell className="flex justify-between">
                    <span className="text-black dark:text-gray-400">Departure</span>
                    <span className="font-medium text-xs text-gray-600 dark:text-gray-400">
                      {new Date(booking.selected_date).toLocaleString()}
                    </span>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="flex justify-between">
                    <span className="text-black dark:text-gray-400">Duration</span>
                    <span className="font-medium text-xs text-gray-600 dark:text-gray-400">{booking.duration_hour} Hours</span>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="flex justify-between">
                    <span className="text-black dark:text-gray-400">Tickets</span>
                    <span className="font-medium text-xs text-gray-600 dark:text-gray-400">
                      {booking.number_of_ticket} 
                      <span className="text-xs ml-1">
                        (max {booking.package.number_of_ticket})
                      </span>
                    </span>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="flex justify-between items-center">
                    <span className="text-black dark:text-gray-400">Location</span>
                    <span className="font-medium text-xs text-gray-600 dark:text-gray-400 flex items-center bg-[#BEA355]/20 dark:bg-[#A68D3F]/20 rounded-md p-1">
                      <MapPin className="h-4 w-4 mr-1" />
                      {booking.package.location || 'Not Available'}
                    </span>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
            <Table className="bg-[#F4F0E4] w-full rounded-lg">
              <TableHeader>
                <TableRow>
                  <TableHead className="font-semibold text-md text-black">
                    Price Summary
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="bg-white dark:bg-gray-800 text-xs">
                <TableRow>
                  <TableCell className="font-semibold">Event</TableCell>
                  <TableCell className="font-medium">AED {booking.total_cost}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-semibold">Catering</TableCell>
                  <TableCell className="font-medium">AED 0</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-semibold">Due</TableCell>
                  <TableCell className="font-medium capitalize">
                    AED {booking.remaining_cost}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
            <Table className="bg-[#F4F0E4] w-full rounded-lg">
              <TableHeader>
                <TableRow>
                  <TableHead className="font-semibold text-md text-black">
                    Booking Details
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="bg-white dark:bg-gray-800 text-xs">
                <TableRow>
                  <TableCell className="font-semibold">Duration</TableCell>
                  <TableCell className="font-medium">{booking.duration_hour} hours</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-semibold">Selected Date</TableCell>
                  <TableCell className="font-medium">{new Date(booking.selected_date).toLocaleDateString()}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-semibold">Package Image</TableCell>
                  <TableCell className="font-medium">
                    <img src={`https://api.takeoffyachts.com${booking.package.package_image}`} alt="Package Image" className="w-32 h-32 object-cover" />
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
            <Table className="bg-[#F4F0E4] w-full rounded-lg">
              <TableHeader>
                <TableRow>
                  <TableHead className="font-semibold text-md text-black">
                    Your Payments
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="bg-white dark:bg-gray-800 text-xs">
                <TableRow>
                  <TableCell className="font-semibold">Amount</TableCell>
                  <TableCell className="font-semibold">Mode</TableCell>
                  <TableCell className="font-semibold">Receipt</TableCell>
                </TableRow>
                <TableRow className="bg-white dark:bg-gray-800">
                  <TableCell className="font-medium">{booking.paid_cost}</TableCell>
                  <TableCell className="font-medium">Online</TableCell>
                  <TableCell className="font-medium">
                    {booking.qr_code ? (
                      <Link href={`https://api.takeoffyachts.com${booking.qr_code}`} target="_blank" className="text-blue-600 hover:underline">
                        View Receipt
                      </Link>
                    ) : 'N/A'}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
            <Table className="bg-[#F4F0E4] dark:bg-[#F4F0E4] w-full rounded-lg">
              <TableHeader>
                <TableRow>
                  <TableHead className="font-semibold text-md text-black">
                    Your Contact Details
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="bg-white dark:bg-gray-800 text-xs">
                <TableRow className="bg-white dark:bg-gray-800">
                  <TableCell className="font-medium flex items-center gap-2">
                    <User className="w-4 h-4" /> {session?.user?.name || 'Guest User'}
                  </TableCell>
                </TableRow>
                <TableRow className="bg-white dark:bg-gray-800">
                  <TableCell className="font-medium flex items-center gap-2">
                    <Phone className="w-4 h-4" /> {booking.phone_number}
                  </TableCell>
                </TableRow>
                <TableRow className="bg-white dark:bg-gray-800">
                  <TableCell className="font-medium flex items-center gap-2">
                    <Mail className="w-4 h-4" /> {session?.user?.email || 'N/A'}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
            <Table className="bg-[#F4F0E4] dark:bg-[#F4F0E4] w-full rounded-t-lg">
              <TableHeader>
                <TableRow>
                  <TableHead className="font-semibold text-md text-black">
                    Event Details
                  </TableHead>
                </TableRow>
              </TableHeader>
            
            <div className="flex justify-center md:flex-row flex-col items-center bg-white mx-auto gap-10 p-6">
              <User className="size-40 bg-slate-100 dark:bg-slate-800 p-2 rounded-full" />
              <div className="max-w-sm flex flex-col gap-3">
                <h1 className="text-sm font-medium dark:text-gray-400">{booking.event.name}</h1>
                <Separator className="w-full" />
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {booking.event.description}
                </p>
                <Separator className="w-full" />
                <p className="text-xs flex items-center dark:text-gray-500 gap-2">
                  <Phone className="w-4 h-4" />
                  Contact Support
                </p>
                <Separator className="w-full" />
                <p className="text-xs flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  support@yacht.com
                </p>
              </div>
            </div>
            </Table>
          </div>
        </>
      )}
    </section>
  );
};

export default BookingSummary;
