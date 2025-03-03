"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft, Copy, Mail, MapPin, Phone, User } from "lucide-react";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loading } from '@/components/ui/loading';
import { dubai } from "../../../../public/assets/images";
import Image from "next/image";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import MapSectionWrapper from "@/components/shared/dashboard/MapSectionWrapper";

const BookingDetails = () => {
  const router = useRouter();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if the router is ready
    if (!router.isReady) return;

    const { id } = router.query;

    // Check if id is undefined
    if (!id) return;

    const fetchBookingDetails = async () => {
      try {
        const response = await fetch(`https://api.takeoffyachts.com/yacht/get_yacht_booking/${id}`);
        const data = await response.json();
        setBooking(data.data[0]);
      } catch (error) {
        console.error('Error fetching booking details:', error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookingDetails();
  }, [router.isReady, router.query]);

  if (loading) return <Loading />;
  if (error) return <div>Error loading booking details</div>;

  return (
    <section className="py-6 px-2">
      <div className="max-w-5xl px-2 mx-auto flex items-center space-x-4">
        <Button className="bg-[#F8F8F8] hover:bg-[#F8F8F8] shadow-md rounded-full flex items-center justify-center w-10 h-10">
          <ArrowLeft className="w-4 h-4 text-black" />
        </Button>
        <h1 className="text-sm md:text-lg font-medium">Booking Details</h1>
      </div>
      <div className="container mx-auto my-8">
        <Image
          src={dubai}
          alt="yacht"
          quality={100}
          className="w-full h-52 object-cover rounded-2xl"
        />
        <div className="flex flex-col gap-4 mt-4">
        <Table className="bg-[#EBEBEB] w-full rounded-lg">
            <TableHeader>
                <TableRow className="">
                <TableHead className="font-semibold text-md text-black">34ft Yacht</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody className="bg-white border text-xs">
                <TableRow>
                <TableCell className="font-semibold">Departure</TableCell>
                <TableCell className="font-medium">{new Date(booking.selected_date).toLocaleTimeString()} {new Date(booking.selected_date).toLocaleDateString()}</TableCell>
                </TableRow>
                <TableRow>
                <TableCell className="font-semibold">Duration</TableCell>
                <TableCell className="font-medium">{booking.duration_hour} Hours</TableCell>
                </TableRow>
                <TableRow>
                <TableCell className="font-semibold">Guests</TableCell>
                <TableCell className="font-medium capitalize">{booking.info.guest} <span className="text-gray-500 text-[11px]">(max capacity is 17 guests)</span></TableCell>
                </TableRow>
                <TableRow>
                <TableCell className="font-semibold">Location</TableCell>
                <TableCell className="font-medium flex items-center capitalize"><MapPin className='w-3.5 h-3.5 text-gray-900 mr-1' />{booking.yacht.location}</TableCell>
                </TableRow>
            </TableBody>
        </Table>
        <Table className="bg-[#F4F0E4] w-full rounded-lg">
          <TableHeader>
            <TableRow className="">
              <TableHead className="font-semibold text-md text-black">
                Price Summary
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="bg-white text-xs">
            <TableRow>
              <TableCell className="font-semibold">Charter</TableCell>
              <TableCell className="font-medium">AED {booking.charter}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-semibold">Catering</TableCell>
              <TableCell className="font-medium">AED {booking.catering}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-semibold">Due</TableCell>
              <TableCell className="font-medium capitalize">
                AED {booking.total_cost}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <Table className="bg-[#F4F0E4] w-full rounded-lg">
          <TableHeader>
            <TableRow className="">
              <TableHead className="font-semibold text-md text-black">
                Your Payments
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="bg-white text-xs">
            <TableRow>
              <TableCell className="font-semibold">Amount</TableCell>
              <TableCell className="font-semibold">Mode</TableCell>
              <TableCell className="font-semibold">Receipt</TableCell>
            </TableRow>
            <TableRow className="bg-white">
              <TableCell className="font-medium">{booking.payment_amount}</TableCell>
              <TableCell className="font-medium">{booking.payment_mode}</TableCell>
              <TableCell className="font-medium">{booking.receipt}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <Table className="bg-[#F4F0E4] w-full rounded-lg">
          <TableHeader>
            <TableRow className="">
              <TableHead className="font-semibold text-md text-black">
                Your Contact Details
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="bg-white text-xs">
            <TableRow className="bg-white">
              <TableCell className="font-medium flex items-center gap-2">
                <User className="w-4 h-4" /> {booking.info.name}
              </TableCell>
            </TableRow>
            <TableRow className="bg-white">
              <TableCell className="font-medium flex items-center gap-2">
                <Phone className="w-4 h-4" /> {booking.info.phone}
              </TableCell>
            </TableRow>
            <TableRow className="bg-white">
              <TableCell className="font-medium flex items-center gap-2">
                <Mail className="w-4 h-4" /> {booking.info.email}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <Table className="bg-[#F4F0E4] w-full rounded-t-lg">
          <TableHeader>
            <TableRow className="">
              <TableHead className="font-semibold text-md text-black">
                Map
              </TableHead>
            </TableRow>
          </TableHeader>
          <MapSectionWrapper className="bg-white" />
        </Table>
        <Table className="bg-[#F4F0E4] w-full rounded-t-lg">
          <TableHeader>
            <TableRow className="">
              <TableHead className="font-semibold text-md text-black">
                Your Consultant
              </TableHead>
            </TableRow>
          </TableHeader>
        </Table>
        <div className="flex justify-center items-center md:flex-row flex-col bg-white mx-auto gap-10">
          {/* <Image src={} alt='' /> */}
          <User className="size-40 bg-slate-100 p-2 rounded-full" />
          <div className="max-w-sm flex flex-col gap-3">
            <h1 className="text-sm font-medium">{booking.consultant.name}</h1>
            <Separator className="w-full" />
            <p className="text-xs text-gray-500">
              Tales maroon to spanish pin privateer. Blossom rum cat prey
              hogshead six mizzen gunwalls. Pounders ketch chain timbers black
              lateen cog lee. Belaying driver quarterdeck warp hang landlubber
              ketch brace. Lee lugsail blossom splice boom killick hands yer
              sail.
            </p>
            <Separator className="w-full" />
            <p className="text-xs flex items-center gap-2">
              <Phone className="w-4 h-4" />
              {booking.consultant.phone}
            </p>
            <Separator className="w-full" />
            <p className="text-xs flex items-center gap-2">
              <Mail className="w-4 h-4" />
              {booking.consultant.email}
            </p>
          </div>
        </div>
        {/* <div className="bg-[#F4F0E4] w-full rounded-t-lg p-3">
          <p className="text-sm font-semibold">Your Unique booking link</p>
        </div>
        <div className="bg-[#EFF2FF] flex justify-center items-center w-full border-dashed border-2 border-[#1D74FF] p-2">
          <Button
            variant="link"
            className="underline text-xs font-medium text-[#1D74FF]"
          >
            https://yacht.com/booking/{router.query.id} <Copy />
          </Button>
        </div> */}
        </div>
      </div>
    </section>
  );
};

export default BookingDetails;
