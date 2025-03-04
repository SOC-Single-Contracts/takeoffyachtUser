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
import { Copy, Mail, Phone, User, Calendar, Clock, Users, Globe, MessageSquare } from "lucide-react";
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
        setBookingDetails(details);
        setEditableExtras(details.extras || []);
        setIsPartialPayment(details.is_partial_payment || false);

        // Update booking context with booking details
        updateBookingData({
          bookingId: details.id,
          qrCodeUrl: details.qr_code,
          remainingCost: details.remaining_cost,
          totalCost: details.total_cost,
          paidCost: details.paid_cost
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

  const handleUpdateExtras = async () => {
    try {
      const bookingId = bookingDetails.id;
      
      // Destructure to remove unwanted fields
      const { qr_code, ...payloadWithoutQrCode } = bookingDetails;
      
      const payload = {
        ...payloadWithoutQrCode,
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
      toast({
        title: "Success",
        description: "Booking details updated successfully",
        variant: "success"
      });
    } catch (error) {
      console.error('Error updating booking details:', error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

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

  const updateExtraQuantity = (index, newQuantity) => {
    const updatedExtras = [...editableExtras];
    updatedExtras[index].quantity = newQuantity;
    setEditableExtras(updatedExtras);
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
              Charter ({bookingDetails.duration_hour} hours)
              {bookingDetails.is_new_year_booking && " - New Year's Eve Rate"}
            </TableCell>
            <TableCell className="font-medium">
              AED {(bookingDetails.is_new_year_booking ? 
                (selectedYacht?.yacht?.new_year_price || 0) : 
                (selectedYacht?.yacht?.per_hour_price || 0)) * bookingDetails.duration_hour}
            </TableCell>
          </TableRow>
          {(bookingDetails.extras || editableExtras).map((item) => (
            <TableRow key={item.id}>
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
          {isPartialPayment && (
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
    return <div>Loading booking details...</div>;
  }

  return (
    <section className="">
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
            <TableRow>
              <TableCell className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span className="font-semibold">Date</span>
              </TableCell>
              <TableCell className="font-medium">
                {safeFormat(bookingDetails.selected_date, 'dd MMMM yyyy')}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span className="font-semibold">Time & Duration</span>
              </TableCell>
              <TableCell className="font-medium">
                {safeFormat(bookingDetails.starting_time, 'hh:mm a')} ({bookingDetails.duration_hour} hours)
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
            {editableExtras.length > 0 ? (
              editableExtras.map((extra, index) => (
                <TableRow key={extra.id}>
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
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} className="text-center text-gray-500 py-4">
                  No optional extras available
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {/* Partial Payment Toggle */}
        <div className="bg-[#F4F0E4] w-full rounded-lg p-4 flex items-center justify-between">
          <div>
            <Label htmlFor="partial-payment" className="text-md font-semibold text-black">
              Partial Payment
            </Label>
            <p className="text-sm text-gray-600">
              Pay 25% now and the remaining amount later
            </p>
          </div>
          <Switch
            id="partial-payment"
            className="data-[state=checked]:bg-[#BEA355] data-[state=unchecked]:bg-gray-300"
            checked={isPartialPayment}
            onCheckedChange={(checked) => setIsPartialPayment(checked)}
          />
        </div>

        {renderPriceSummary()}

        <div className="flex justify-end space-x-4">
          <Button
          variant="secondary"
            onClick={handleUpdateExtras}
            className="px-6 py-2 rounded-full"
          >
            Update Extras
          </Button>
          {((bookingDetails.paid_cost === 0 || bookingDetails.paid_cost === undefined) || 
            (bookingDetails.remaining_cost > 0)) && (
            <Button
              onClick={() => {
                handleUpdatePartialPayment();
                onNext();
              }}
              className="bg-[#BEA355] text-white px-8 py-2 rounded-full hover:bg-[#A89245]"
            >
              {isPartialPayment 
                ? `Proceed to Payment (25% AED ${(bookingDetails.total_cost * 0.25).toFixed(2)})` 
                : (bookingDetails.remaining_cost > 0 
                  ? `Proceed to Payment (Remaining AED ${bookingDetails.remaining_cost.toFixed(2)})`
                  : `Proceed to Payment (Total AED ${bookingDetails.total_cost.toFixed(2)})`)}
            </Button>
          )}
        </div>
      </div>
    </section>
  );
};

export default Summary;