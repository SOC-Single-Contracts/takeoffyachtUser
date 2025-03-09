import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Mail, Phone, User, Calendar, Clock, Users, Globe, MessageSquare } from "lucide-react";
import { useBookingContext } from "./BookingContext";
import { format } from "date-fns";
import { Fancybox } from "@fancyapps/ui";
import "@fancyapps/ui/dist/fancybox/fancybox.css";
import Image from "next/image";

const Summary = ({ onNext, onEditExtras  }) => {
  const { bookingData, selectedYacht, calculateTotal } = useBookingContext();

  return (
    <section className="">
      <div className="max-w-5xl mx-auto container px-2 space-y-6 mt-8">
        <div className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {selectedYacht?.yacht?.yacht_image && (
              <div className="relative h-48 rounded-lg overflow-hidden cursor-pointer"
                onClick={() => {
                  Fancybox.show([
                    {
                      src: `${process.env.NEXT_PUBLIC_API_URL || 'https://api.takeoffyachts.com'}${selectedYacht.yacht.yacht_image}`,
                      type: "image",
                    }
                  ]);
                }}
              >
                <Image
                  src={`${process.env.NEXT_PUBLIC_API_URL || 'https://api.takeoffyachts.com'}${selectedYacht.yacht.yacht_image}`}
                  alt={selectedYacht.yacht.name}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
            )}
            {[...Array(20)].map((_, index) => {
              const imageKey = `image${index + 1}`;
              if (selectedYacht?.yacht?.[imageKey]) {
                return (
                  <div
                    key={imageKey}
                    className="relative h-48 rounded-lg overflow-hidden cursor-pointer"
                    onClick={() => {
                      Fancybox.show([
                        {
                          src: `${process.env.NEXT_PUBLIC_API_URL || 'https://api.takeoffyachts.com'}${selectedYacht.yacht[imageKey]}`,
                          type: "image",
                        }
                      ]);
                    }}
                  >
                    <Image
                      src={`${process.env.NEXT_PUBLIC_API_URL || 'https://api.takeoffyachts.com'}${selectedYacht.yacht[imageKey]}`}
                      alt={`${selectedYacht.yacht.name} - ${index + 1}`}
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                );
              }
              return null;
            })}
          </div>
        </div>
        {/* Contact Details Table */}
        <Table className="bg-[#F4F0E4] w-full rounded-lg">
          <TableHeader>
            <TableRow>
              <TableHead className="font-semibold text-md text-black">
                Your Contact Details
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="bg-white dark:bg-gray-800 text-xs">
            <TableRow>
              <TableCell className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span className="font-semibold">Full Name</span>
              </TableCell>
              <TableCell className="font-medium">{bookingData.fullName}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span className="font-semibold">Email</span>
              </TableCell>
              <TableCell className="font-medium">{bookingData.email}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span className="font-semibold">Phone</span>
              </TableCell>
              <TableCell className="font-medium">{bookingData.phone}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="flex items-center gap-2">
                <Globe className="w-4 h-4" />
                <span className="font-semibold">Country</span>
              </TableCell>
              <TableCell className="font-medium">{bookingData.country}</TableCell>
            </TableRow>
          </TableBody>
        </Table>

        {/* Booking Details Table */}
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
              <TableCell className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {/* <span className="font-semibold">Date</span> */}
                <span className="font-semibold">{bookingData.endDate ? 'Stay Period' : 'Date'}</span>
              </TableCell>
              <TableCell className="font-medium">
                {/* {format(new Date(bookingData.date), 'dd MMMM yyyy')} */}
                {bookingData.endDate ? (
        `${format(new Date(bookingData.date), 'dd MMMM yyyy')} - ${format(new Date(bookingData.endDate), 'dd MMMM yyyy')}`
      ) : (
        format(new Date(bookingData.date), 'dd MMMM yyyy')
      )}
              </TableCell>
            </TableRow>
            {/* <TableRow>
              <TableCell className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span className="font-semibold">Time & Duration</span>
              </TableCell>
              <TableCell className="font-medium">
                {format(new Date(bookingData.startTime), 'hh:mm a')} ({bookingData.duration} hours)
              </TableCell>
            </TableRow> */}
              {!bookingData.endDate ? (
    <TableRow>
      <TableCell className="flex items-center gap-2">
        <Clock className="w-4 h-4" />
        <span className="font-semibold">Time & Duration</span>
      </TableCell>
      <TableCell className="font-medium">
        {format(new Date(bookingData.startTime), 'hh:mm a')} ({bookingData.duration} hours)
      </TableCell>
    </TableRow>
  ) : (
    <TableRow>
      <TableCell className="flex items-center gap-2">
        <Clock className="w-4 h-4" />
        <span className="font-semibold">Duration</span>
      </TableCell>
      <TableCell className="font-medium">
        {Math.ceil((new Date(bookingData.endDate) - new Date(bookingData.date)) / (1000 * 60 * 60 * 24) + 1)} Days
      </TableCell>
    </TableRow>
  )}
            <TableRow>
              <TableCell className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span className="font-semibold">Guests</span>
              </TableCell>
              <TableCell className="font-medium">
                {bookingData.adults} Adults{bookingData.kids > 0 && `, ${bookingData.kids} Children`}
              </TableCell>
            </TableRow>
            {bookingData.notes && (
              <TableRow>
                <TableCell className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  <span className="font-semibold">Special Requests</span>
                </TableCell>
                <TableCell className="font-medium">{bookingData.notes}</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {/* Price Summary Table */}
        <Table className="bg-[#F4F0E4] w-full rounded-lg">
          <TableHeader>
            <TableRow>
              <TableHead className="font-semibold text-md text-black">
                Price Summary {bookingData.isNewYearBooking && "(New Year's Eve Special Rate)"}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="bg-white dark:bg-gray-800 text-xs">
            {/* <TableRow>
              <TableCell className="font-semibold">
                Charter ({bookingData.duration} hours)
                {bookingData.isNewYearBooking && " - New Year's Eve Rate"}
              </TableCell>
              <TableCell className="font-medium">
                AED {(bookingData.isNewYearBooking ?
                  (selectedYacht?.yacht?.new_year_price || 0) :
                  (selectedYacht?.yacht?.per_hour_price || 0)) * bookingData.duration}
              </TableCell>
            </TableRow> */}
              <TableRow>
    <TableCell className="font-semibold">
      {bookingData.endDate ? (
        `Charter (${Math.ceil((new Date(bookingData.endDate) - new Date(bookingData.date)) / (1000 * 60 * 60 * 24) + 1)} days)`
      ) : (
        `Charter (${bookingData.duration} hours)${bookingData.isNewYearBooking ? " - New Year's Eve Rate" : ""}`
      )}
    </TableCell>
    <TableCell className="font-medium">
      AED {bookingData.endDate ? 
        (selectedYacht?.yacht?.per_day_price || 0) * (Math.ceil((new Date(bookingData.endDate) - new Date(bookingData.date)) / (1000 * 60 * 60 * 24) + 1)) :
        (bookingData.isNewYearBooking ? 
          (selectedYacht?.yacht?.new_year_price || 0) : 
          (selectedYacht?.yacht?.per_hour_price || 0)) * bookingData.duration
      }
    </TableCell>
  </TableRow>
            {bookingData.extras && bookingData.extras.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-semibold">{item.name}</TableCell>
                <TableCell className="font-medium">AED {item.price * item.quantity}</TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell className="font-bold">Total Amount</TableCell>
              <TableCell className="font-bold">AED {calculateTotal()}</TableCell>
            </TableRow>
            {bookingData.isPartialPayment && (
              <TableRow>
                <TableCell className="font-bold text-blue-600">Amount Due Now (50%)</TableCell>
                <TableCell className="font-bold text-blue-600">AED {calculateTotal() / 2}</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        <div className="flex justify-end space-x-2">
        <Button
          onClick={onEditExtras}
          variant="secondary"
          className=" rounded-full hover:bg-[#A89245]"
        >
          Edit Optional Extras
        </Button>
          <Button
            onClick={onNext}
            className="bg-[#BEA355] text-white px-8 py-2 rounded-full hover:bg-[#A89245]"
          >
            Proceed to Payment
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Summary;