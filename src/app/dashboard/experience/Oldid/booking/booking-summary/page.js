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
import { useParams, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { dubai, summaryimg } from "../../../../../../../public/assets/images";
import Image from "next/image";

const BookingSummary = () => {
  const { id } = useParams();
  const searchParams = useSearchParams();
  const bookingId = searchParams.get("bookingId");
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const { data: session } = useSession();

  useEffect(() => {
    const fetchBookingDetails = async () => {
      if (!bookingId || !session?.user?.userid) return;
      
      try {
        // Fetch bookings from all endpoints
        const [yachtResponse, eventResponse, experienceResponse] = await Promise.all([
          fetch(`https://api.takeoffyachts.com/yacht/get_yacht_booking/${session.user.userid}`),
          fetch(`https://api.takeoffyachts.com/yacht/get_event_booking/${session.user.userid}`),
          fetch(`https://api.takeoffyachts.com/yacht/get_experience_booking/${session.user.userid}`)
        ]);

        const [yachtData, eventData, experienceData] = await Promise.all([
          yachtResponse.json(),
          eventResponse.json(),
          experienceResponse.json()
        ]);

        // Find booking across all types
        let foundBooking = null;

        // Check yacht bookings
        if (yachtData.data) {
          foundBooking = yachtData.data.find(item => 
            item.booking[0].id === parseInt(bookingId)
          );
          if (foundBooking) {
            setBooking({
              ...foundBooking.booking[0],
              yacht: foundBooking.yacht[0],
              type: 'yacht'
            });
            return;
          }
        }

        // Check event bookings
        if (eventData.data) {
          foundBooking = eventData.data.find(item => 
            item.id === parseInt(bookingId)
          );
          if (foundBooking) {
            setBooking({
              ...foundBooking,
              type: 'event',
              package: foundBooking.package
            });
            return;
          }
        }

        // Check experience bookings
        if (experienceData.data) {
          foundBooking = experienceData.data.find(item => 
            item.id === parseInt(bookingId)
          );
          if (foundBooking) {
            setBooking({
              ...foundBooking,
              type: 'experience',
              experience: foundBooking.experience
            });
            return;
          }
        }

        // If no booking found
        console.error('Booking not found');
      } catch (error) {
        console.error('Error fetching booking details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookingDetails();
  }, [bookingId, session?.user?.userid]);

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

  if (!booking) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Booking Not Found</h3>
          <p className="text-gray-500">The requested booking could not be found</p>
        </div>
      </div>
    );
  }

  return (
    <section className="py-10 px-2">
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
                    {booking.experience.name || 'Experience Details'}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
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
                  <TableCell className="flex justify-between items-center">
                    <span className="text-black dark:text-gray-400">Location</span>
                    <span className="font-medium text-xs text-gray-600 dark:text-gray-400 flex items-center bg-[#BEA355]/20 dark:bg-[#A68D3F]/20 rounded-md p-1">
                      <MapPin className="h-4 w-4 mr-1" />
                      {booking.experience.location || 'Not Available'}
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
              <TableCell className="font-semibold">Experience</TableCell>
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
                Experience Details
              </TableHead>
            </TableRow>
          </TableHeader>
        
        <div className="flex justify-center md:flex-row flex-col items-center bg-white dark:bg-gray-800 mx-auto gap-10 p-6">
          <User className="size-40 bg-slate-100 dark:bg-slate-800 p-2 rounded-full" />
          <div className="max-w-sm flex flex-col gap-3">
            <h1 className="text-sm font-medium dark:text-gray-400">{booking.experience.name}</h1>
            <Separator className="w-full" />
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {booking.experience.description}
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
    </section>
  );
};

export default BookingSummary;
