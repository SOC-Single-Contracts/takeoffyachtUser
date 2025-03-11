import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Copy, Mail, Phone, User, Calendar, Clock, Users, Globe, MessageSquare, Check, Clipboard, CheckCheck } from "lucide-react";
import { useBookingContext } from "./BookingContext";
import { parseISO, format, isValid } from "date-fns";
import { API_BASE_URL } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Fancybox } from "@fancyapps/ui";
import "@fancyapps/ui/dist/fancybox/fancybox.css";
import Image from 'next/image';

const safeFormat = (dateString, formatString, fallback = 'N/A') => {
  try {
    if (!dateString) return fallback;

    // Try parsing as ISO string first
    let parsedDate = parseISO(dateString);
    if (!isValid(parsedDate)) {
      parsedDate = parseISO(`1970-01-01T${dateString}`);
    }

    return isValid(parsedDate) ? format(parsedDate, formatString) : fallback;
  } catch (error) {
    console.error('Date formatting error:', error);
    return fallback;
  }
};

const Summary = ({ onNext, initialBookingId }) => {
  const { toast } = useToast();
  const { bookingData, selectedYacht, calculateTotal, updateBookingData } = useBookingContext();
  const [bookingDetails, setBookingDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editableExtras, setEditableExtras] = useState([]);
  const [isPartialPayment, setIsPartialPayment] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        // Prioritize initialBookingId, then bookingId from context
        const currentBookingId = initialBookingId || bookingData.bookingId;

        if (!currentBookingId) {
          toast.error('No booking ID found. Please complete the booking process again.');
          return;
        }

        const response = await fetch(`${API_BASE_URL}/yacht/booking/${currentBookingId}/`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch booking details');
        }

        const details = await response.json();

        // Filter extras with quantities > 0
        const activeExtras = details.extras_data.filter(extra => extra.quantity > 0);

        setBookingDetails(details);
        setEditableExtras(details.extras_data || []);
        setIsPartialPayment(details.is_partial_payment || false);

        // Update booking context with booking details
        updateBookingData({
          bookingId: details.id,
          qrCodeUrl: details.qr_code,
          remainingCost: details.remaining_cost,
          totalCost: details.total_cost,
          paidCost: details.paid_cost,
          extras: activeExtras
        });
      } catch (error) {
        console.error('Error fetching booking details:', error);
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchBookingDetails();
  }, [initialBookingId, bookingData.bookingId]);


  const calculateUpdatedTotalCost = () => {
    // Calculate base cost (charter cost)
    const baseHourlyRate = bookingDetails.is_new_year_booking
      ? (selectedYacht?.yacht?.new_year_price || 0)
      : (selectedYacht?.yacht?.per_hour_price || 0);
    const charterCost = baseHourlyRate * bookingDetails.duration_hour;

    // Calculate extras cost
    const extrasCost = editableExtras.reduce((total, extra) => {
      return total + (extra.price * extra.quantity);
    }, 0);

    return charterCost + extrasCost;
  };

  // const handleUpdateExtras = async () => {
  //   try {
  //     const bookingId = bookingDetails.id;
  //     const updatedTotalCost = calculateUpdatedTotalCost();

  //     const payload = {
  //       extras: editableExtras.map(extra => ({
  //         extra_id: extra.extra_id,
  //         name: extra.name,
  //         quantity: parseInt(extra.quantity),
  //         price: parseFloat(extra.price)
  //       })),
  //       total_cost: updatedTotalCost,
  //       remaining_cost: bookingDetails.paid_cost > 0 ? updatedTotalCost - bookingDetails.paid_cost : 0
  //     };

  //     const response = await fetch(`${API_BASE_URL}/yacht/booking/${bookingId}/`, {
  //       method: 'PATCH',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify(payload),
  //     });

  //     if (!response.ok) {
  //       throw new Error('Failed to update booking details');
  //     }

  //     const result = await response.json();

  //     if (result.data) {
  //       setBookingDetails(result.data);
  //       setEditableExtras(result.data.extras_data);

  //       updateBookingData({
  //         extras: result.data.extras_data.filter(extra => extra.quantity > 0),
  //         totalCost: result.data.total_cost,
  //         remainingCost: result.data.remaining_cost,
  //         paidCost: result.data.paid_cost
  //       });
  //     }

  //     toast({
  //       title: "Success",
  //       description: "Extras updated successfully",
  //       variant: "success"
  //     });

  //     const refreshResponse = await fetch(`${API_BASE_URL}/yacht/booking/${bookingId}/`);
  //     const refreshedData = await refreshResponse.json();
  //     setBookingDetails(refreshedData);
  //     setEditableExtras(refreshedData.extras_data);

  //   } catch (error) {
  //     console.error('Error updating extras:', error);
  //     toast({
  //       title: "Error",
  //       description: error.message,
  //       variant: "destructive"
  //     });
  //   }
  // };


  const handleUpdateExtras = async () => {
    try {
      const bookingId = bookingDetails.id;

      // Calculate base cost based on booking type
      let baseCost = 0;
      if (bookingDetails.booking_type === 'hourly') {
        const hourlyRate = selectedYacht?.yacht?.per_hour_price || 0;
        baseCost = hourlyRate * (bookingDetails.duration_hour || 3);
      } else {
        // Date range booking
        const startDate = new Date(bookingDetails.selected_date);
        const endDate = new Date(bookingDetails.end_date);
        const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
        baseCost = (selectedYacht?.yacht?.per_day_price || 0) * days;
      }

      // Calculate extras cost
      const extrasCost = editableExtras.reduce((total, extra) => {
        return total + (parseFloat(extra.price) * parseInt(extra.quantity || 0));
      }, 0);

      // Calculate total cost
      const totalCost = baseCost + extrasCost;

      const payload = {
        extras: editableExtras.map(extra => ({
          extra_id: extra.extra_id,
          name: extra.name,
          quantity: parseInt(extra.quantity || 0),
          price: parseFloat(extra.price)
        })),
        total_cost: totalCost,
        remaining_cost: totalCost - (bookingDetails.paid_cost || 0)
      };

      const response = await fetch(`${API_BASE_URL}/yacht/booking/${bookingId}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Failed to update booking details');
      }

      const result = await response.json();

      if (result.data) {
        setBookingDetails(result.data);
        setEditableExtras(result.data.extras_data || []);

        // Update booking context with new data
        updateBookingData({
          extras: result.data.extras_data.filter(extra => extra.quantity > 0),
          totalCost: result.data.total_cost,
          remainingCost: result.data.remaining_cost,
          paidCost: result.data.paid_cost
        });

        toast({
          title: "Success",
          description: "Booking details updated successfully",
          variant: "success"
        });
      }
    } catch (error) {
      console.error('Error updating booking details:', error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  // ... rest of the code ...

  const handleUpdatePartialPayment = async () => {
    try {
      const bookingId = bookingDetails.id;

      // Destructure to remove unwanted fields
      const { qr_code, ...payloadWithoutQrCode } = bookingDetails;

      // Calculate total cost
      const totalCost = bookingDetails.total_cost || calculateTotal();

      const payload = {
        ...payloadWithoutQrCode,
        is_partial_payment: isPartialPayment,
        total_cost: totalCost,
        paid_cost: isPartialPayment ? totalCost * 0.25 : 0,
        remaining_cost: isPartialPayment ? totalCost * 0.75 : 0,
        extras: editableExtras,
      };

      const response = await fetch(`${API_BASE_URL}/yacht/booking/${bookingId}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to update booking details: ${errorText}`);
      }

      const updatedDetails = await response.json();
      setBookingDetails(updatedDetails);

      // Update booking context with partial payment status
      updateBookingData({
        isPartialPayment: isPartialPayment,
        remainingCost: updatedDetails.remaining_cost,
        totalCost: updatedDetails.total_cost,
        paidCost: updatedDetails.paid_cost
      });

      toast({
        title: "Success",
        description: "Partial payment preference updated successfully",
        variant: "success"
      });
    } catch (error) {
      console.error('Error updating partial payment:', error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  // const handleProceedToPayment = async () => {
  //   try {

  //     onNext();
  //   } catch (error) {
  //     console.error('Error proceeding to payment:', error);
  //     toast({
  //       title: "Error",
  //       description: "Failed to proceed to payment. Please try again.",
  //       variant: "destructive"
  //     });
  //   }
  // };
  const handleProceedToPayment = async () => {
    try {
      const bookingId = bookingDetails.id;

      // First, update extras if they were modified
      await handleUpdateExtras();

      // Calculate payment amounts
      const totalCost = bookingDetails.total_cost || calculateTotal();
      const paidCost = bookingDetails.paid_cost || 0;
      const remainingCost = bookingDetails.remaining_cost || 0;

      // Determine payment amount based on booking state
      let paymentAmount;
      let isRemainingPayment = false;

      if (paidCost > 0) {
        // This is a remaining payment
        paymentAmount = remainingCost;
        isRemainingPayment = true;
      } else {
        // This is a new payment
        paymentAmount = isPartialPayment ? totalCost * 0.25 : totalCost;
      }

      // Update booking context with payment information
      updateBookingData({
        bookingId: bookingId,
        totalCost: totalCost,
        remainingCost: remainingCost,
        paidCost: paidCost,
        isPartialPayment: isPartialPayment,
        isRemainingPayment: isRemainingPayment,
        paymentAmount: paymentAmount,
        extras: editableExtras.filter(extra => extra.quantity > 0)
      });

      // Proceed to payment step
      onNext();

    } catch (error) {
      console.error('Error proceeding to payment:', error);
      toast({
        title: "Error",
        description: "Failed to proceed to payment. Please try again.",
        variant: "destructive"
      });
    }
  };


  const updateExtraQuantity = (index, newQuantity) => {
    setEditableExtras(prev => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        quantity: parseInt(newQuantity)
      };
      return updated;
    });
  };

  const handleCopyLink = () => {
    const bookingId = bookingDetails.id;
    const yachtId = selectedYacht?.yacht?.id || bookingData.yachtId;
    const bookingLink = `${window.location.origin}/dashboard/yachts/${yachtId}/guest-booking/?bookingId=${bookingId}`;

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

  const renderPriceSummary = () => {
    const totalCost = bookingDetails.total_cost || calculateTotal();
    const paidCost = bookingDetails.paid_cost || 0;
    const remainingCost = bookingDetails.remaining_cost || 0;

    return (
      <Table className="bg-[#F4F0E4] w-full rounded-lg">
        <TableHeader>
          <TableRow>
            <TableHead className="font-semibold text-md text-black">
              Price Summary {bookingDetails.is_new_year_booking && "(New Year's Eve Special Rate)"}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="bg-white dark:bg-gray-800 text-xs">
          <TableRow>
            <TableCell className="font-semibold">
              {bookingDetails.end_date
                ? `${safeFormat(bookingDetails.selected_date, 'dd MMMM yyyy')} - ${safeFormat(bookingDetails.end_date, 'dd MMMM yyyy')}`
                : safeFormat(bookingDetails.selected_date, 'dd MMMM yyyy')
              }
              {bookingDetails.is_new_year_booking && " - New Year's Eve Rate"}
            </TableCell>
            <TableCell className="font-medium">
              AED {bookingDetails.end_date
                ? (selectedYacht?.yacht?.per_day_price || 0) * (Math.ceil((new Date(bookingDetails.end_date) - new Date(bookingDetails.selected_date)) / (1000 * 60 * 60 * 24) + 1))
                : (bookingDetails.is_new_year_booking
                  ? (selectedYacht?.yacht?.new_year_price || 0)
                  : (selectedYacht?.yacht?.per_hour_price || 0)) * bookingDetails.duration_hour
              }
            </TableCell>
          </TableRow>
          {/* <TableRow>
            <TableCell className="font-semibold">
              Charter ({bookingDetails.duration_hour} hours)
              {bookingDetails.is_new_year_booking && " - New Year's Eve Rate"}
            </TableCell>
            <TableCell className="font-medium">
              AED {(bookingDetails.is_new_year_booking ?
                (selectedYacht?.yacht?.new_year_price || 0) :
                (selectedYacht?.yacht?.per_hour_price || 0)) * bookingDetails.duration_hour}
            </TableCell>
          </TableRow> */}
          {bookingDetails.extras_data && Array.isArray(bookingDetails.extras_data) && bookingDetails.extras_data.map((item) => (
            <TableRow key={item.extra_id}>
              <TableCell className="font-semibold">{item.name}</TableCell>
              <TableCell className="font-medium">AED {item.price * item.quantity}</TableCell>
            </TableRow>
          ))}
          <TableRow>
            <TableCell className="font-bold">Total Amount</TableCell>
            <TableCell className="font-bold">
              AED {totalCost.toFixed(2)}
            </TableCell>
          </TableRow>
          {(!paidCost && !remainingCost && isPartialPayment) && (
            <>
              <TableRow>
                <TableCell className="font-semibold text-green-600">Partial Payment (25%)</TableCell>
                <TableCell className="font-semibold text-green-600">
                  AED {(totalCost * 0.25).toFixed(2)}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-bold text-red-600">Remaining Amount (75%)</TableCell>
                <TableCell className="font-bold text-red-600">
                  AED {(totalCost * 0.75).toFixed(2)}
                </TableCell>
              </TableRow>
            </>
          )}
          {paidCost > 0 && (
            <>
              <TableRow>
                <TableCell className="font-semibold text-green-600">Paid Amount</TableCell>
                <TableCell className="font-semibold text-green-600">
                  AED {paidCost.toFixed(2)}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-bold text-red-600">Remaining Amount</TableCell>
                <TableCell className="font-bold text-red-600">
                  AED {remainingCost.toFixed(2)}
                </TableCell>
              </TableRow>
            </>
          )}
        </TableBody>
      </Table>
    );
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto container px-2 space-y-6 mt-8">
        {/* Skeleton for Yacht Images */}
        <div className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="relative h-48 rounded-lg bg-gray-200 animate-pulse" />
            ))}
          </div>
        </div>

        {/* Skeleton for Contact Details Table */}
        <Table className="bg-[#F4F0E4] w-full rounded-lg">
          <TableHeader>
            <TableRow>
              <TableHead className="font-semibold text-md text-black">Your Contact Details</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="bg-white dark:bg-gray-800 text-xs">
            {[...Array(4)].map((_, index) => (
              <TableRow key={index}>
                <TableCell className="flex items-center gap-2">
                  <div className="h-4 w-24 bg-gray-200 animate-pulse" />
                </TableCell>
                <TableCell className="font-medium">
                  <div className="h-4 w-32 bg-gray-200 animate-pulse" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Skeleton for Booking Details Table */}
        <Table className="bg-[#F4F0E4] w-full rounded-lg">
          <TableHeader>
            <TableRow>
              <TableHead className="font-semibold text-md text-black">Booking Details</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="bg-white dark:bg-gray-800 text-xs">
            {[...Array(4)].map((_, index) => (
              <TableRow key={index}>
                <TableCell className="flex items-center gap-2">
                  <div className="h-4 w-24 bg-gray-200 animate-pulse" />
                </TableCell>
                <TableCell className="font-medium">
                  <div className="h-4 w-32 bg-gray-200 animate-pulse" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Skeleton for Extras Table */}
        <Table className="bg-[#F4F0E4] w-full rounded-lg">
          <TableHeader>
            <TableRow>
              <TableHead className="font-semibold text-md text-black">Optional Extras</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="bg-white dark:bg-gray-800 text-xs">
            {[...Array(4)].map((_, index) => (
              <TableRow key={index}>
                <TableCell className="font-semibold">
                  <div className="h-4 w-32 bg-gray-200 animate-pulse" />
                </TableCell>
                <TableCell>
                  <div className="h-4 w-16 bg-gray-200 animate-pulse" />
                </TableCell>
                <TableCell className="font-medium">
                  <div className="h-4 w-24 bg-gray-200 animate-pulse" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  return (
    <section>
      <div className="max-w-5xl mx-auto container px-2 space-y-6 mt-8">
        {/* Yacht Images */}
        <div className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {selectedYacht?.yacht?.yacht_image && (
              <div
                className="relative h-48 rounded-lg overflow-hidden cursor-pointer"
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
              <TableCell className="font-medium">{bookingDetails.full_name}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span className="font-semibold">Email</span>
              </TableCell>
              <TableCell className="font-medium">{bookingDetails.email}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span className="font-semibold">Phone</span>
              </TableCell>
              <TableCell className="font-medium">{bookingDetails.phone_number}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="flex items-center gap-2">
                <Globe className="w-4 h-4" />
                <span className="font-semibold">Country</span>
              </TableCell>
              <TableCell className="font-medium">{bookingDetails.country}</TableCell>
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
            {/* <TableRow>
              <TableCell className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span className="font-semibold">Date</span>
              </TableCell>
              <TableCell className="font-medium">
                {safeFormat(bookingDetails.selected_date, 'dd MMMM yyyy')}
              </TableCell>
            </TableRow> */}
            {/* <TableRow>
              <TableCell className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span className="font-semibold">Time & Duration</span>
              </TableCell>
              <TableCell className="font-medium">
                {safeFormat(bookingDetails.starting_time, 'hh:mm a')} ({bookingDetails.duration_hour} hours)
              </TableCell>
            </TableRow> */}
            <TableRow>
              <TableCell className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span className="font-semibold">Date</span>
              </TableCell>
              <TableCell className="font-medium">
                {bookingDetails.end_date
                  ? `${safeFormat(bookingDetails.selected_date, 'dd MMMM yyyy')} - ${safeFormat(bookingDetails.end_date, 'dd MMMM yyyy')}`
                  : safeFormat(bookingDetails.selected_date, 'dd MMMM yyyy')
                }
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span className="font-semibold">
                  {bookingDetails.end_date ? 'Duration' : 'Time & Duration'}
                </span>
              </TableCell>
              <TableCell className="font-medium">
                {/* {bookingDetails.end_date 
                  ? ${Math.ceil((new Date(bookingDetails.end_date) - new Date(bookingDetails.selected_date)) / (1000 * 60 * 60 * 24) + 1)} days
                  : ${safeFormat(bookingDetails.starting_time, 'hh:mm a')} (${bookingDetails.duration_hour} hours)
                } */}
                {bookingDetails.end_date
                  ? `${Math.ceil((new Date(bookingDetails.end_date) - new Date(bookingDetails.selected_date)) / (1000 * 60 * 60 * 24) + 1)} days`
                  : `${safeFormat(bookingDetails.starting_time, 'hh:mm a')} (${bookingDetails.duration_hour} hours)`
                }
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span className="font-semibold">Guests</span>
              </TableCell>
              <TableCell className="font-medium">
                {bookingDetails.adults} Adults{bookingDetails.kids > 0 && `, ${bookingDetails.kids} Children`}
              </TableCell>
            </TableRow>
            {bookingDetails.notes && (
              <TableRow>
                <TableCell className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  <span className="font-semibold">Special Requests</span>
                </TableCell>
                <TableCell className="font-medium">{bookingDetails.notes}</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {/* Extras Table with Editable Quantities */}
        <Table className="bg-[#F4F0E4] w-full rounded-lg">
          <TableHeader>
            <TableRow>
              <TableHead className="font-semibold text-md text-black">
                Optional Extras
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="bg-white dark:bg-gray-800 text-xs">
            {editableExtras.map((extra, index) => (
              <TableRow key={extra.extra_id}>
                <TableCell className="font-semibold">{extra.name}</TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateExtraQuantity(index, Math.max(0, extra.quantity - 1))}
                    >
                      -
                    </Button>
                    <span className="mx-2">{extra.quantity}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateExtraQuantity(index, extra.quantity + 1)}
                    >
                      +
                    </Button>
                  </div>
                </TableCell>
                <TableCell className="font-medium">AED {extra.price * extra.quantity}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <Table className="bg-[#F4F0E4] w-full rounded-lg">
          <TableHeader>
            <TableRow>
              <TableHead className="font-semibold text-md text-black">
                Booking Link
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="bg-white dark:bg-gray-800 text-xs">
            <TableRow>
              <TableCell className="font-semibold">Your Booking Link:</TableCell>
              <TableCell className="font-medium">
                <div className="flex items-center">
                  <span
                    className="text-blue-500 cursor-pointer"
                    onClick={handleCopyLink}
                  >
                    {isCopied ? <Check className="h-5 w-5" /> : <Clipboard className="h-5 w-5" />}
                  </span>
                  <span className="ml-2 text-gray-500">{isCopied ? "Copied!" : "(Click to copy)"}</span>
                </div>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>

        {renderPriceSummary()}
        {bookingDetails && bookingDetails.total_cost === bookingDetails.paid_cost && (
          <div className="flex items-center justify-between bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg shadow-md mb-4">
            <div className="flex items-center">
              <CheckCheck className="w-6 h-6 mr-2" /> {/* Optional icon for visual appeal */}
              <div>
                <strong className="font-bold">Thank You!</strong>
                <span className="block sm:inline"> Your payment has been successfully received. We appreciate your business!</span>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end flex-wrap gap-2">


          {/* <Button
                onClick={handleProceedToPayment}
                className="bg-[#BEA355] text-white px-2 text-xs md:px-8 py-2 rounded-full hover:bg-[#A89245]"
              >
                Proceed to Payment
              </Button> */}
          {/* <Button
            onClick={handleProceedToPayment}
            className="bg-[#BEA355] text-white px-2 text-xs md:px-8 py-2 rounded-full hover:bg-[#A89245]"
          >
            {bookingDetails?.paid_cost > 0
              ? `Pay Remaining (AED ${bookingDetails.remaining_cost.toFixed(2)})`
              : isPartialPayment
                ? `Pay 25% (AED ${(bookingDetails.total_cost * 0.25).toFixed(2)})`
                : `Pay Full Amount (AED ${bookingDetails.total_cost.toFixed(2)})`}
          </Button> */}
          <div className="flex justify-end flex-wrap gap-2">
            {(bookingDetails?.remaining_cost > 0 || !bookingDetails?.paid_cost) && (
              <>
                <Button
                  variant="secondary"
                  onClick={handleUpdateExtras}
                  className="px-6 py-2 text-xs rounded-full"
                >
                  Update Extras
                </Button>
                <Button
                  onClick={handleProceedToPayment}
                  className="bg-[#BEA355] text-white px-2 text-xs md:px-8 py-2 rounded-full hover:bg-[#A89245]"
                >
                  Proceed to Payment
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Summary;