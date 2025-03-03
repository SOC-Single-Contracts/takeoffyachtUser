"use client";
import { format } from 'date-fns';
import { useBookingContext } from './BookingContext';
import { Clock, Users, Calendar, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const Summary = ({ onNext }) => {
  const { selectedExperience, bookingDetails } = useBookingContext();

  if (!selectedExperience) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#BEA355]"></div>
      </div>
    );
  }

  return (
    <section>
     
      <div className="mx-auto max-w-5xl px-2 space-y-6 mt-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
          <h2 className="text-2xl font-semibold mb-6">Experience Details</h2>
          
          <div className="space-y-6">
            <div className="border-b pb-4">
              <div className="space-y-3">
                <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {selectedExperience.experience.name}
                </p>
                <p className="text-gray-600 dark:text-gray-300">
                  {selectedExperience.experience.description}
                </p>
              </div>
            </div>

            <div className="border-b pb-4">
              <h3 className="text-lg font-medium mb-4">Booking Details</h3>
              <Table className="bg-[#F4F0E4] w-full rounded-lg">
                <TableHeader>
                  <TableRow className="">
                    <TableHead className="font-semibold text-md text-black">
                      Booking Details
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="bg-white dark:bg-gray-700 text-xs">
                  <TableRow>
                    <TableCell className="font-semibold">Date</TableCell>
                    <TableCell className="font-medium">{format(bookingDetails.date, 'MMMM dd, yyyy')}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-semibold">Participants</TableCell>
                    <TableCell className="font-medium">{bookingDetails.seats} {bookingDetails.seats === 1 ? 'person' : 'people'}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-semibold">Duration</TableCell>
                    <TableCell className="font-medium">{bookingDetails.duration_hour} {bookingDetails.duration_hour === 1 ? 'hour' : 'hours'}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>

            <Table className="bg-[#F4F0E4] w-full rounded-lg">
              <TableHeader>
                <TableRow className="">
                  <TableHead className="font-semibold text-md text-black">
                    Price Summary
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="bg-white dark:bg-gray-700 text-xs">
                <TableRow>
                  <TableCell className="font-semibold">Experience Cost</TableCell>
                  <TableCell className="font-medium">AED {selectedExperience.experience.min_price.toLocaleString()}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-semibold">Number of Participants</TableCell>
                  <TableCell className="font-medium">× {bookingDetails.seats}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-semibold">Total Amount</TableCell>
                  <TableCell className="font-medium capitalize text-[#BEA355]">
                    AED {bookingDetails.total_cost.toLocaleString()}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>
        <Button 
          onClick={onNext}
          className="rounded-full bg-[#BEA355] px-6 py-2 w-full hover:bg-[#A68A3E] text-white"
        >
          Proceed to Payment
        </Button>
      </div>
    </section>
  );
};

export default Summary;
