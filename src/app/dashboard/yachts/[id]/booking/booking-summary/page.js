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
import { ArrowLeft, Download, ExternalLink, Mail, MapPin, Phone, Receipt, User } from "lucide-react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import MapSectionWrapper from "@/components/shared/dashboard/MapSectionWrapper";
import { dubai, summaryimg } from "../../../../../../../public/assets/images";
import Image from "next/image";
import jsPDF from "jspdf";
import QRCode from "qrcode";

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

  const renderPriceSummary = () => {
    switch (booking.type) {
      case 'yacht':
        return (
          <TableBody className="bg-white dark:bg-gray-700 text-xs">
            <TableRow>
              <TableCell className="font-semibold">Charter</TableCell>
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
        );
      case 'event':
        return (
          <TableBody className="bg-white dark:bg-gray-700 text-xs">
            <TableRow>
              <TableCell className="font-semibold">Event Cost</TableCell>
              <TableCell className="font-medium">AED {booking.total_cost}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-semibold">Paid</TableCell>
              <TableCell className="font-medium capitalize">
                AED {booking.paid_cost}
              </TableCell>
            </TableRow>
          </TableBody>
        );
      case 'experience':
        return (
          <TableBody className="bg-white dark:bg-gray-700 text-xs">
            <TableRow>
              <TableCell className="font-semibold">Experience Cost</TableCell>
              <TableCell className="font-medium">AED {booking.total_cost}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-semibold">Paid</TableCell>
              <TableCell className="font-medium capitalize">
                AED {booking.paid_cost}
              </TableCell>
            </TableRow>
          </TableBody>
        );
      default:
        return null;
    }
  };

  const renderDetailsSection = () => {
    switch (booking.type) {
      case 'yacht':
        return (
          <div className="flex justify-center md:flex-row flex-col items-center bg-white dark:bg-gray-700 mx-auto gap-10 p-6 max-w-5xl mx-auto">
            <User className="size-40 bg-slate-100 dark:bg-slate-700 p-6 rounded-full" />
            <div className="max-w-sm flex flex-col gap-3">
              <h1 className="text-sm font-medium dark:text-gray-300">{booking.yacht.name}</h1>
              <Separator className="w-full" />
              <p className="text-xs text-gray-500 dark:text-gray-300">
                {booking.yacht.description}
              </p>
              <Separator className="w-full" />
              <p className="text-xs flex items-center gap-2">
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
        );
      case 'event':
        return (
          <div className="flex justify-center md:flex-row flex-col items-center bg-white dark:bg-gray-700 mx-auto gap-10 p-6 max-w-5xl mx-auto">
            <User className="size-40 bg-slate-100 dark:bg-slate-700 p-6 rounded-full" />
            <div className="max-w-sm flex flex-col gap-3">
              <h1 className="text-sm font-medium dark:text-gray-300">{booking.package.event_name}</h1>
              <Separator className="w-full" />
              <p className="text-xs text-gray-500 dark:text-gray-300">
                {booking.package.description}
              </p>
              <Separator className="w-full" />
              <p className="text-xs flex items-center gap-2">
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
        );
      case 'experience':
        return (
          <div className="flex justify-center md:flex-row flex-col items-center bg-white dark:bg-gray-700 mx-auto gap-10 p-6 max-w-5xl mx-auto">
            <User className="size-40 bg-slate-100 dark:bg-slate-700 p-6 rounded-full" />
            <div className="max-w-sm flex flex-col gap-3">
              <h1 className="text-sm font-medium dark:text-gray-300">{booking.experience.name}</h1>
              <Separator className="w-full" />
              <p className="text-xs text-gray-500 dark:text-gray-300">
                {booking.experience.description}
              </p>
              <Separator className="w-full" />
              <p className="text-xs flex items-center gap-2">
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
        );
      default:
        return null;
    }
  };

  const handleDownloadQRCode = async () => {
    if (!booking.qr_code) return;
  
    try {
      const qrCodeDataUrl = await QRCode.toDataURL(`https://api.takeoffyachts.com${booking.qr_code}`);
  
      const doc = new jsPDF();
  
      doc.addImage(qrCodeDataUrl, 'PNG', 10, 10, 180, 180);
  
      doc.save('booking_qr_code.pdf');
    } catch (error) {
      console.error('Error generating QR code PDF:', error);
    }
  };

  return (
    <section className="py-8 px-2">
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
      {booking.type === 'yacht' && (
        <Table>
          <TableHeader className="bg-[#EBEBEB] dark:bg-gray-700">
            <TableRow>
              <TableHead className="font-semibold text-black dark:text-gray-400 rounded-t-lg">
                {booking.yacht.title || 'Yacht Details'}
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
                <span className="text-black dark:text-gray-400">Guests</span>
                <span className="font-medium text-xs text-gray-600 dark:text-gray-400">
                  {booking.adults + booking.kid_teen} 
                  <span className="text-xs ml-1">
                    (max {booking.yacht.capacity})
                  </span>
                </span>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="flex justify-between items-center">
                <span className="text-black dark:text-gray-400">Location</span>
                <span className="font-medium text-xs text-gray-600 dark:text-gray-400 flex items-center bg-[#BEA355]/20 dark:bg-[#A68D3F]/20 rounded-md p-1">
                  <MapPin className="h-4 w-4 mr-1" />
                  {booking.yacht.location || 'Not Available'}
                </span>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      )}
      {booking.type === 'experience' && (
        <Table>
          <TableHeader className="bg-[#EBEBEB] dark:bg-gray-700">
            <TableRow>
              <TableHead className="font-semibold text-black dark:text-gray-400 rounded-t-lg">
                Experience Details
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="border border-gray-200 dark:border-gray-700 bg-white">
            <TableRow>
              <TableCell className="flex justify-between">
                <span className="text-black dark:text-gray-400">Experience Name</span>
                <span className="font-medium text-xs text-gray-600 dark:text-gray-400">
                  {booking.experience.name}
                </span>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="flex justify-between">
                <span className="text-black dark:text-gray-400">Experience Description</span>
                <span className="font-medium text-xs text-gray-600 dark:text-gray-400">
                  {booking.experience.description}
                </span>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="flex justify-between">
                <span className="text-black dark:text-gray-400">Experience Duration</span>
                <span className="font-medium text-xs text-gray-600 dark:text-gray-400">
                  {booking.experience.duration}
                </span>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="flex justify-between items-center">
                <span className="text-black dark:text-gray-400">Experience Location</span>
                <span className="font-medium text-xs text-gray-600 dark:text-gray-400 flex items-center bg-[#BEA355]/20 dark:bg-[#A68D3F]/20 rounded-md p-1">
                  <MapPin className="h-4 w-4 mr-1" />
                  {booking.experience.location || 'Not Available'}
                </span>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      )}
      <Table className="bg-[#F4F0E4] dark:bg-gray-800 w-full rounded-lg">
        <TableHeader>
          <TableRow>
            <TableHead className="font-semibold text-md text-black dark:text-white">
              Price Summary
            </TableHead>
          </TableRow>
        </TableHeader>
        {renderPriceSummary()}
      </Table>
      <Table className="bg-[#F4F0E4] dark:bg-gray-800 w-full rounded-lg">
        <TableHeader>
          <TableRow>
            <TableHead className="font-semibold text-md text-black dark:text-white">
              Your Payments
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="bg-white dark:bg-gray-700 text-xs">
          <TableRow>
            <TableCell className="font-semibold">Amount</TableCell>
            <TableCell className="font-semibold">Mode</TableCell>
            <TableCell className="font-semibold">Receipt</TableCell>
          </TableRow>
          <TableRow className="bg-white dark:bg-gray-700">
            <TableCell className="font-medium">{booking.paid_cost}</TableCell>
            <TableCell className="font-medium">Online</TableCell>
            <TableCell className="font-medium">
              {booking.qr_code ? (
                <div className="flex items-center gap-2">
                  {/* <Link 
                    href={`https://api.takeoffyachts.com${booking.qr_code}`} 
                    target="_blank" 
                    className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-[#BEA355] to-[#D4B96E] text-white rounded-full text-xs font-medium transition-all hover:scale-105 hover:shadow-lg"
                  >
                    <Receipt className="w-3.5 h-3.5" />
                    View Receipt
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-full border-[#BEA355] text-[#BEA355] hover:bg-[#BEA355] hover:text-white dark:border-[#BEA355] dark:text-[#BEA355] dark:hover:bg-[#BEA355] dark:hover:text-white"
                    onClick={() => window.open(`https://api.takeoffyachts.com${booking.qr_code}`, '_blank')}
                  >
                    <Download className="w-3.5 h-3.5" />
                  </Button> */}
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-full border-[#BEA355] text-[#BEA355] hover:bg-[#BEA355] hover:text-white dark:border-[#BEA355] dark:text-[#BEA355] dark:hover:bg-[#BEA355] dark:hover:text-white"
                    onClick={handleDownloadQRCode}
                  >
                    <Download className="w-3.5 h-3.5" />
                  </Button>
                </div>
              ) : (
                <span className="text-gray-500 dark:text-gray-400 text-sm">N/A</span>
              )}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
      
      {/* Conditionally render map if yacht booking */}
      {booking.type === 'yacht' && booking.yacht.longitude && booking.yacht.latitude && (
        <MapSectionWrapper
          latitude={parseFloat(booking.yacht.latitude)}
          longitude={parseFloat(booking.yacht.longitude)}
        />
      )}
      </div>
      
      <Table className="bg-[#F4F0E4] dark:bg-gray-800 w-full rounded-t-lg mt-6 max-w-5xl mx-auto">
        <TableHeader>
          <TableRow>
            <TableHead className="font-semibold text-md text-black dark:text-white">
              {booking.type === 'yacht' ? 'Yacht Details' : 
               booking.type === 'event' ? 'Event Details' : 
               'Experience Details'}
            </TableHead>
          </TableRow>
        </TableHeader>
      </Table>
      
      {renderDetailsSection()}
    </section>
  );
};

export default BookingSummary;
