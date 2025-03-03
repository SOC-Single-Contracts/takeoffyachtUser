// import { Button } from "@/components/ui/button";
// import { Separator } from "@/components/ui/separator";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { Copy, Mail, Phone, User } from "lucide-react";
// import { useBookingContext } from "./BookingContext";
// import { useSession } from "next-auth/react";
// import yachtApi from "@/services/api";
// import { useState } from "react";
// import { toast } from "sonner";

// const Summary = ({ onNext }) => {
//   const { bookingData, selectedYacht } = useBookingContext();
//   const [loading, setLoading] = useState(false);
//   const { data: session } = useSession();

//   // const calculateTotal = () => {
//   //   const basePrice = selectedYacht?.yacht?.per_hour_price || 0;
//   //   const hours = bookingData?.duration || 3;
//   //   return basePrice * hours;
//   // };
//   const calculateTotal = () => {
//     const basePrice = selectedYacht?.yacht?.per_hour_price || 0;
//     const duration = bookingData?.duration || 3;
//     const totalGuests = bookingData?.adults + bookingData?.kids || 0;
//     return basePrice * duration * totalGuests;
//   };

//   const handleConfirm = async () => {
//     setLoading(true);
//     try {
//       // Create initial booking
//       const bookingPayload = {
//         guest: bookingData.adults + bookingData.kids,
//         yacht: selectedYacht.yacht.id,
//         user_id: session.user.userid,
//         duration_hour: bookingData.duration,
//         booking_date: bookingData.date,
//         booking_time: bookingData.startTime,
//         phone_number: bookingData.phone,
//         country: bookingData.country,
//         message: bookingData.notes,
//         adults: bookingData.adults,
//         kid_teen: bookingData.kids,
//       };

//       const response = await yachtApi.createEventBooking(bookingPayload);

//       if (response.error_code === 'pass') {
//         // updateBookingData({ bookingId: response.data.id });
//         onNext();
//       } else {
//         throw new Error(response.error || 'Failed to create booking');
//       }
//     } catch (error) {
//       console.error('Error:', error);
//       toast.error('Failed to create booking. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };


//   return (
//     <div className="mx-auto container px-2 space-y-6">
//       {/* Price Summary */}
//       <Table className="bg-[#F4F0E4] w-full rounded-lg">
//         <TableHeader>
//           <TableRow>
//             <TableHead className="font-semibold text-md text-black">
//               Price Summary
//             </TableHead>
//           </TableRow>
//         </TableHeader>
//         <TableBody className="bg-white text-xs">
//           <TableRow>
//             <TableCell className="font-semibold">Charter</TableCell>
//             <TableCell className="font-medium">
//               AED {selectedYacht?.yacht?.per_hour_price || 0}
//             </TableCell>
//           </TableRow>
//           <TableRow>
//             <TableCell className="font-semibold">Duration</TableCell>
//             <TableCell className="font-medium">
//               {bookingData?.duration || 3} hours
//             </TableCell>
//           </TableRow>
//           <TableRow>
//             <TableCell className="font-semibold">Total</TableCell>
//             <TableCell className="font-medium">AED {calculateTotal()}</TableCell>
//           </TableRow>
//         </TableBody>
//       </Table>

//       {/* Contact Details */}
//       <Table className="bg-[#F4F0E4] w-full rounded-lg">
//         <TableHeader>
//           <TableRow>
//             <TableHead className="font-semibold text-md text-black">
//               Your Contact Details
//             </TableHead>
//           </TableRow>
//         </TableHeader>
//         <TableBody className="bg-white text-xs">
//           <TableRow>
//             <TableCell className="font-medium flex items-center gap-2">
//               <User className="w-4 h-4" /> {bookingData?.fullName}
//             </TableCell>
//           </TableRow>
//           <TableRow>
//             <TableCell className="font-medium flex items-center gap-2">
//               <Phone className="w-4 h-4" /> {bookingData?.phone}
//             </TableCell>
//           </TableRow>
//           <TableRow>
//             <TableCell className="font-medium flex items-center gap-2">
//               <Mail className="w-4 h-4" /> {bookingData?.email}
//             </TableCell>
//           </TableRow>
//         </TableBody>
//       </Table>

//       {/* Booking Link */}
//       <div className="bg-[#F4F0E4] w-full rounded-t-lg p-3">
//         <p className="text-sm font-semibold">Your Unique booking link</p>
//       </div>
//       <div className="bg-[#EFF2FF] flex justify-center items-center w-full border-dashed border-2 border-[#1D74FF] p-2">
//         <Button
//           variant="link"
//           className="underline text-xs font-medium text-[#1D74FF]"
//         >
//           https://yacht.com/booking/{selectedYacht?.yacht?.id || ''} <Copy />
//         </Button>
//       </div>

//       <Button 
//         onClick={handleConfirm}
//         disabled={loading}
//         className="rounded-full bg-[#BEA355] w-full text-white"
//       >
//         {loading ? 'Processing...' : 'Continue to Payment'}
//       </Button>
//     </div>
//   );
// };

// export default Summary;
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
import { Copy, Mail, Phone, User, CheckCircle } from "lucide-react";
import { useBookingContext } from "./BookingContext";
import { useSession } from "next-auth/react";
import yachtApi from "@/services/api";
import { useState } from "react";
import { toast } from "sonner";
import { format } from "date-fns";

const Summary = ({ onNext }) => {
  const { bookingData, eventData } = useBookingContext();
  const [loading, setLoading] = useState(false);
  const { data: session } = useSession();

  const calculateTotal = () => {
    if (!bookingData.selectedPackage) return 0;
    
    const packagePrice = bookingData.selectedPackage.package_price || 0;
    const totalGuests = bookingData.adults + bookingData.kids;
    const featuresPrices = bookingData.selectedPackage.features?.reduce((total, feature) => 
      total + (feature.price || 0), 0) || 0;
    
    return (packagePrice + featuresPrices) * totalGuests;
  };

  const handleConfirm = async () => {
    if (!bookingData.selectedPackage) {
      toast.error('Please select a package first');
      return;
    }

    setLoading(true);
    try {
      const bookingPayload = {
        guest: bookingData.adults + bookingData.kids,
        event: eventData.event.id,
        package: bookingData.selectedPackage.id,
        user_id: session.user.userid,
        duration_hour: bookingData.selectedPackage.duration_hour || 3,
        booking_date: format(new Date(bookingData.date), 'yyyy-MM-dd'),
        booking_time: format(new Date(bookingData.startTime), 'HH:mm:ss'),
        phone_number: bookingData.phone,
        country: bookingData.country,
        message: bookingData.notes,
        adults: bookingData.adults,
        kid_teen: bookingData.kids,
        total_cost: calculateTotal(),
      };

      const response = await yachtApi.createEventBooking(bookingPayload);

      if (response.error_code === 'pass') {
        onNext();
      } else {
        throw new Error(response.error || 'Failed to create booking');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to create booking. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-2 space-y-6">
      {/* Package Summary */}
      <Table className="bg-[#F4F0E4] dark:bg-gray-800 w-full rounded-lg">
        <TableHeader>
          <TableRow>
            <TableHead className="font-semibold text-md text-black dark:text-white">
              Package Summary
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="bg-white dark:bg-gray-800 text-xs">
          <TableRow>
            <TableCell className="font-semibold">Selected Package</TableCell>
            <TableCell className="font-medium">
              {bookingData.selectedPackage?.name || 'No package selected'}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-semibold">Package Price</TableCell>
            <TableCell className="font-medium">
              ${bookingData.selectedPackage?.package_price || 0}/ticket
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-semibold">Duration</TableCell>
            <TableCell className="font-medium">
              {bookingData.selectedPackage?.duration_hour || 3} hours
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-semibold">Total Tickets</TableCell>
            <TableCell className="font-medium">
              {bookingData.adults + bookingData.kids} tickets
            </TableCell>
          </TableRow>
          {bookingData.selectedPackage?.features?.length > 0 && (
            <TableRow>
              <TableCell className="font-semibold" colSpan={2}>
                <p className="mb-2">Included Features:</p>
                <ul className="space-y-1">
                  {bookingData.selectedPackage.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      {feature.name} (${feature.price})
                    </li>
                  ))}
                </ul>
              </TableCell>
            </TableRow>
          )}
          <TableRow>
            <TableCell className="font-semibold">Total Amount</TableCell>
            <TableCell className="font-medium">${calculateTotal()}</TableCell>
          </TableRow>
        </TableBody>
      </Table>

      {/* Contact Details */}
      <Table className="bg-[#F4F0E4] dark:bg-gray-800 w-full rounded-lg">
        <TableHeader>
          <TableRow>
            <TableHead className="font-semibold text-md text-black dark:text-white">
              Your Contact Details
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="bg-white dark:bg-gray-700 text-xs">
          <TableRow>
            <TableCell className="font-medium flex items-center gap-2">
              <User className="w-4 h-4" /> {bookingData?.fullName}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium flex items-center gap-2">
              <Phone className="w-4 h-4" /> {bookingData?.phone}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium flex items-center gap-2">
              <Mail className="w-4 h-4" /> {bookingData?.email}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>

      {/* Booking Link */}
      {/* <div className="bg-[#F4F0E4] w-full rounded-t-lg p-3">
        <p className="text-sm font-semibold">Your Unique booking link</p>
      </div>
      <div className="bg-[#EFF2FF] flex justify-center items-center w-full border-dashed border-2 border-[#1D74FF] p-2">
        <Button
          variant="link"
          className="underline text-xs font-medium text-[#1D74FF]"
        >
          https://yacht.com/booking/{eventData?.event?.id || ''} <Copy />
        </Button>
      </div> */}

      <Button 
        onClick={handleConfirm}
        disabled={loading || !bookingData.selectedPackage}
        className="rounded-full bg-[#BEA355] w-full text-white"
      >
        {loading ? 'Processing...' : 'Continue to Payment'}
      </Button>
    </div>
  );
};

export default Summary;