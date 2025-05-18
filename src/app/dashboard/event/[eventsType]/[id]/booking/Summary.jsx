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
import { Copy, Mail, Phone, User, CheckCircle, MapPin, Check, Clipboard } from "lucide-react";
import { useBookingContext } from "./BookingContext";
import { useSession } from "next-auth/react";
import yachtApi from "@/services/api";
import { useState } from "react";
import { toast } from "sonner";
import { format } from "date-fns";
import { formatDate } from "@/helper/calculateDays";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import BookingGalleryEmbala from "@/components/lp/BookingGalleryEmbala";

const Summary = ({ onNext,eventData }) => {
  const { bookingData } = useBookingContext();
  const [loading, setLoading] = useState(false);
  const { data: session } = useSession();
    const [eventDetails, setEventDetails] = useState(null);
  

  const calculateTotal = () => {
    if (!bookingData.selectedPackage) return 0;
    
    const packagePrice = bookingData.selectedPackage.price || 0;
    const totalGuests = bookingData?.tickets;
    const featuresPrices = bookingData.selectedPackage.features?.reduce((total, feature) => 
      total + (feature.price || 0), 0) || 0;
    
    return (packagePrice + featuresPrices) * totalGuests;
  };
  
  
  const handleCopyLink = () => {
    const bookingId = eventDetails?.id;
    const yachtId =  bookingData.yachtId;
    const bookingLink = `${window.location.origin}/dashboard/${yachtsType}/${yachtId}/booking/?bookingId=${bookingId}`;

    navigator.clipboard.writeText(bookingLink).then(() => {
      setIsCopied(true); // Set copied state to true
      toast({
        title: "Link Copied",
        description: "The booking link has been copied to your clipboard.",
        variant: "success",
      });
      setTimeout(() => setIsCopied(false), 2000); // Reset after 2 seconds
    }).catch(err => {
      console.error('Failed to copy: ', err);
      toast({
        title: "Error",
        description: "Failed to copy the booking link.",
        variant: "destructive",
      });
    });
  };

  const handleConfirm = async () => {
    if (!bookingData.selectedPackage) {
      toast.error('Please select a package first');
      return;
    }
    onNext();

    // setLoading(true);
    // try {
    //   const bookingPayload = {
    //     guest: bookingData.adults + bookingData.kids,
    //     event: eventData?.id,
    //     package: bookingData.selectedPackage.id,
    //     user_id: session.user.userid,
    //     duration_hour: bookingData.selectedPackage.duration_hour || 3,
    //     booking_date: format(new Date(bookingData.date), 'yyyy-MM-dd'),
    //     booking_time: format(new Date(bookingData.startTime), 'HH:mm:ss'),
    //     phone_number: bookingData.phone,
    //     country: bookingData.country,
    //     message: bookingData.notes,
    //     adults: bookingData.adults,
    //     kid_teen: bookingData.kids,
    //     total_cost: calculateTotal(),
    //   };

    //   const response = await yachtApi.createEventBooking(bookingPayload);

    //   if (response.error_code === 'pass') {
    //     onNext();
    //   } else {
    //     throw new Error(response.error || 'Failed to create booking');
    //   }
    // } catch (error) {
    //   console.error('Error:', error);
    //   toast.error('Failed to create booking. Please try again.');
    // } finally {
    //   setLoading(false);
    // }
  };


  return (
    <div className="mx-auto max-w-5xl px-2 space-y-6">
      {/* Package Summary */}

          <Card className="p-4">
              <div className="relative w-full h-48 mb-4">
                <Image
                  src={eventData?.event_image
                    ? `${process.env.NEXT_PUBLIC_S3_URL}${eventData?.event_image}`
                    : '/assets/images/Imagenotavailable.png'
                }
                  alt={eventData?.name}
                  fill
                  className="object-cover rounded-lg"
                  onError={(e) => {
                    e.target.src = '/assets/images/Imagenotavailable.png'
                }}
                />
              </div>
              <h2 className="text-xl font-semibold mb-2">{eventData?.name}</h2>
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-2">
                <MapPin className="w-4 h-4" />
                <span>{eventData?.location || 'Location not specified'}</span>
              </div>
            </Card> 

       
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
            <TableCell className="font-semibold">Booking Slot</TableCell>
            <TableCell className="font-medium">
           {formatDate(eventData?.from_date)} - {formatDate(eventData?.to_date)}

            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-semibold">Selected Package</TableCell>
            <TableCell className="font-medium">
           {bookingData.selectedPackage?.package_type || 'No package selected'}

            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-semibold">Package Price</TableCell>
            <TableCell className="font-medium">
              AED {bookingData.selectedPackage?.price || 0}/ticket
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-semibold">Duration</TableCell>
            <TableCell className="font-medium">
              {bookingData?.duration || 3} hours
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-semibold">Total Tickets</TableCell>
            <TableCell className="font-medium">
              {bookingData.tickets} tickets
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
            <TableCell className="font-medium">AED {calculateTotal()}</TableCell>
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
          {/* <TableRow>
              <TableCell className="font-semibold">Your Booking Link:</TableCell>
              <TableCell className="font-medium">
                <div className="flex items-center">
                  <span
                    className="text-blue-500 cursor-pointer"
                    onClick={handleCopyLink}
                  >
                    {isCopied ? <Check className="h-5 w-5" /> : <Clipboard className="h-5 w-5" />}
                  </span>
                  <span  onClick={handleCopyLink} className="ml-2 text-gray-500 cursor-pointer">{isCopied ? "Copied!" : "(Click to copy)"}</span>
                </div>
              </TableCell>
            </TableRow> */}
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

{/* {eventDetails && eventDetails?.total_cost === eventDetails?.paid_cost && (
          <div className="flex items-center justify-between bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg shadow-md mb-4">
            <div className="flex items-center">
              <CheckCheck className="w-6 h-6 mr-2" />
              <div>
                <strong className="font-bold">Thank You!</strong>
                <span className="block sm:inline"> Your payment has been successfully received. We appreciate your business!</span>
              </div>
            </div>

          </div>
        )}
{!(eventDetails && eventDetails?.total_cost === eventDetails?.paid_cost) &&      } */}

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