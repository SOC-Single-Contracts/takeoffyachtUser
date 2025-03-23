'use client';

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
import { ArrowLeft, Mail, Phone, User } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { toast } from "sonner";
import { useSession } from "next-auth/react";

const BookingSummary = () => {
  const [bookingDetails, setBookingDetails] = useState(null);
  const searchParams = useSearchParams();
  const bookingId = searchParams.get("bookingId");
  const { data: session } = useSession();

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        const response = await fetch("https://api.takeoffyachts.com/yacht/get_experience_booking/3", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: session?.user?.id || 3
          })
        });

        const data = await response.json();
        if (data.error_code === "pass") {
          const booking = data.data.find(item => 
            item.booking[0].id.toString() === bookingId
          );
          if (booking) {
            setBookingDetails(booking);
          } else {
            toast.error("Booking not found");
          }
        } else {
          toast.error("Failed to fetch booking details");
        }
      } catch (error) {
        console.error("Error fetching booking details:", error);
        toast.error("Error loading booking details");
      }
    };

    if (bookingId) {
      fetchBookingDetails();
    }
  }, [bookingId, session?.user?.id]);

  if (!bookingDetails) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  const { booking, experience } = bookingDetails;
  const bookingInfo = booking[0];
  const experienceInfo = experience[0];

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <section className="py-10 px-2">
      <div className="container px-2 mx-auto flex items-center space-x-4">
        <Link href="/dashboard/all-bookings">
          <Button className="bg-[#F8F8F8] hover:bg-[#F8F8F8] shadow-md rounded-full flex items-center justify-center w-10 h-10">
            <ArrowLeft className="w-4 h-4 text-black" />
          </Button>
        </Link>
        <h1 className="text-sm md:text-lg font-medium">Booking Summary - {experienceInfo.name}</h1>
      </div>

      <div className="mx-auto container px-2 space-y-6 mt-8">
        <Table className="bg-[#F4F0E4] w-full rounded-lg">
          <TableHeader>
            <TableRow>
              <TableHead className="font-semibold text-md text-black">
                Price Summary
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="bg-white text-xs">
            <TableRow>
              <TableCell className="font-semibold">Charter ({bookingInfo.duration_hour} hours)</TableCell>
              <TableCell className="font-medium">AED {bookingInfo.total_cost.toLocaleString()}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-semibold">Paid Amount</TableCell>
              <TableCell className="font-medium">AED {bookingInfo.paid_cost.toLocaleString()}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-semibold">Remaining Amount</TableCell>
              <TableCell className="font-medium">AED {bookingInfo.remaining_cost.toLocaleString()}</TableCell>
            </TableRow>
          </TableBody>
        </Table>

        <Table className="bg-[#F4F0E4] w-full rounded-lg">
          <TableHeader>
            <TableRow>
              <TableHead className="font-semibold text-md text-black">
                Experience Details
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="bg-white text-xs">
            <TableRow>
              <TableCell className="font-semibold">Experience Name</TableCell>
              <TableCell className="font-medium">{experienceInfo.name}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-semibold">Location</TableCell>
              <TableCell className="font-medium">{experienceInfo.location}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-semibold">Booking Date & Time</TableCell>
              <TableCell className="font-medium">{formatDate(bookingInfo.selected_date)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-semibold">Duration</TableCell>
              <TableCell className="font-medium">{bookingInfo.duration_hour} hours</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-semibold">Number of Seats</TableCell>
              <TableCell className="font-medium">{bookingInfo.info.seats}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-semibold">Experience Type</TableCell>
              <TableCell className="font-medium">{experienceInfo.type}</TableCell>
            </TableRow>
          </TableBody>
        </Table>

        {bookingInfo.info.selectedExtras && bookingInfo.info.selectedExtras.length > 0 && (
          <Table className="bg-[#F4F0E4] w-full rounded-lg">
            <TableHeader>
              <TableRow>
                <TableHead className="font-semibold text-md text-black">
                  Selected Extras
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="bg-white text-xs">
              <TableRow>
                <TableCell className="font-medium">
                  {bookingInfo.info.selectedExtras.map((extra, index) => (
                    <span key={extra}>
                      Extra {extra}{index < bookingInfo.info.selectedExtras.length - 1 ? ', ' : ''}
                    </span>
                  ))}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        )}

        <Table className="bg-[#F4F0E4] w-full rounded-lg">
          <TableHeader>
            <TableRow>
              <TableHead className="font-semibold text-md text-black">
                Experience Information
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="bg-white text-xs">
            <TableRow>
              <TableCell className="font-semibold">Crew Member</TableCell>
              <TableCell className="font-medium">{experienceInfo.crew_member}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-semibold">Crew Language</TableCell>
              <TableCell className="font-medium">{experienceInfo.crew_language}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-semibold">Notes</TableCell>
              <TableCell className="font-medium">{experienceInfo.notes}</TableCell>
            </TableRow>
          </TableBody>
        </Table>

        {bookingInfo.qr_code && (
          <Table className="bg-[#F4F0E4] w-full rounded-lg">
            <TableHeader>
              <TableRow>
                <TableHead className="font-semibold text-md text-black">
                  Booking QR Code
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="bg-white text-xs">
              <TableRow>
                <TableCell className="font-medium flex justify-center py-4">
                  <div className="relative w-48 h-48">
                    <Image
                      src={`https://api.takeoffyachts.com${bookingInfo.qr_code}`}
                      alt="Booking QR Code"
                      fill
                      className="object-contain"
                    />
                  </div>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        )}
      </div>
    </section>
  );
};

export default BookingSummary;
