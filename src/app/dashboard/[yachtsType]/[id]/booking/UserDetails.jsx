"use client";
import React, { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useBookingContext } from "./BookingContext";
import { countries } from 'countries-list';
import { format } from "date-fns";
import { API_BASE_URL } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { useParams } from 'next/navigation';
import { useSession } from "next-auth/react";
import { handleDispatchBookingData } from "@/helper/bookingData";

const UserDetails = ({ onNext }) => {
  const { data: session } = useSession();
  const { id: yachtId,yachtsType } = useParams();
  const { toast } = useToast();
  const { bookingData, updateBookingData, selectedYacht,appStatBookingContext } = useBookingContext();
  const [loading, setLoading] = useState(false);


  // Convert countries object to sorted array
  const countriesList = useMemo(() => {
    return Object.entries(countries)
      .map(([code, country]) => ({
        code: code.toLowerCase(),
        name: country.name
      }))
      .sort((a, b) => {
        // Put UAE first
        if (a.code === 'ae') return -1;
        if (b.code === 'ae') return 1;
        // Then sort rest alphabetically
        return a.name.localeCompare(b.name);
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {

      if(yachtsType == "yachts"){
        const requiredFields = ['fullName', 'email', 'phone', 'country'];
        const missingFields = requiredFields.filter(field => !bookingData[field]);
  
        if (missingFields.length > 0) {
          toast({
            title: "Validation Error",
            description: `Please fill in all required fields: ${missingFields.join(', ')}`,
            variant: "destructive",
          });
          return;
        }
  
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(bookingData.email)) {
          toast({
            title: "Validation Error",
            description: 'Please enter a valid email address',
            variant: "destructive",
          });
          return;
        }
  
        const phoneRegex = /^\+?[\d\s-]{8,}$/;
        if (!phoneRegex.test(bookingData.phone)) {
          toast({
            title: "Validation Error",
            description: 'Please enter a valid phone number',
            variant: "destructive",
          });
          return;
        }
  
        // const formattedDate = format(bookingData.date, "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");
        const formattedDate = format(bookingData.date, "yyyy-MM-dd");
        const formattedEndDate = bookingData.endDate ? format(bookingData.endDate, "yyyy-MM-dd") : null;
        const formattedTime = format(bookingData.startTime, 'HH:mm');
  
        const formattedExtras = bookingData.extras.map(extra => ({
          ...extra,
          id: extra.id
        }));
  
        const bookingPayload = {
          user_id: session?.user?.userid,
          yacht: yachtId,
          full_name: bookingData.fullName,
          email: bookingData.email,
          phone_number: bookingData.phone,
          country: countriesList.find(c => c.code === bookingData.country)?.name || bookingData.country,
          message: bookingData.message || "",
          adults: bookingData.adults,
          kids: bookingData.kids,
          // duration_hour: bookingData.bookingType === 'hourly' ? bookingData.duration : null,
          duration_hour: bookingData.bookingType === 'date_range' ? 0 : bookingData.duration,
          is_partial_payment: bookingData.isPartialPayment || false,
          terms_accepted: bookingData.termsAccepted || true,
          // selected_date: bookingData.date.toISOString(),
          selected_date: formattedDate,
          end_date: formattedEndDate,
          booking_type: bookingData.bookingType || 'hourly',
          // starting_time: format(bookingData.startTime, 'HH:mm'),
          starting_time: formattedTime,
          per_day_price: bookingData.bookingType === 'date_range' ? selectedYacht?.yacht?.per_day_price || 0 : 0,
          food: 0,
          waterSports: 0,
          misc: 0,
          bath: 0,
          // extras: bookingData.extras ? Object.entries(bookingData.extras).map(([id, { quantity, price, name }]) => ({
          //   id,
          //   quantity,
          //   price,
          //   name,
          // })) : [],
          extras: formattedExtras
        };
  
        if (!yachtId) {
          toast.error('Yacht ID is missing. Please select a yacht.');
          return;
        }
  
        // Send POST request
        const response = await fetch(`${API_BASE_URL}/yacht/yacht_bookings/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(bookingPayload),
        });
  
        if (!response.ok) {
          const errorResult = await response.json(); // Parse the error response
          throw new Error(errorResult.error || 'Failed to create booking');
        }
  
        const result = await response.json();
        // toast({
        //   title: "Temporary Booking Created",
        //   description: `Your temporary booking has been created. Your booking id is ${result.booking_id} Move forward to payment.`,
        //   variant: "success",
        // });
  
        // Update booking context with booking ID
        updateBookingData({ bookingId: result.booking_id });
        handleDispatchBookingData({...appStatBookingContext,
                     ...bookingData
                   })
  
        onNext();
      }else if(yachtsType == "f1yachts"){
        const requiredFields = ['fullName', 'email', 'phone', 'country'];
        const missingFields = requiredFields.filter(field => !bookingData[field]);
  
        if (missingFields.length > 0) {
          toast({
            title: "Validation Error",
            description: `Please fill in all required fields: ${missingFields.join(', ')}`,
            variant: "destructive",
          });
          return;
        }
  
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(bookingData.email)) {
          toast({
            title: "Validation Error",
            description: 'Please enter a valid email address',
            variant: "destructive",
          });
          return;
        }
  
        const phoneRegex = /^\+?[\d\s-]{8,}$/;
        if (!phoneRegex.test(bookingData.phone)) {
          toast({
            title: "Validation Error",
            description: 'Please enter a valid phone number',
            variant: "destructive",
          });
          return;
        }
  
        // const formattedDate = format(bookingData.date, "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");
        const formattedDate = format(bookingData.date, "yyyy-MM-dd");
        const formattedEndDate = bookingData.endDate ? format(bookingData.endDate, "yyyy-MM-dd") : null;
        const formattedTime = format(bookingData.startTime, 'HH:mm');
  
        const formattedExtras = bookingData.extras.map(extra => ({
          ...extra,
          id: extra.id
        }));
  
        const bookingPayload = {
          user_id: session?.user?.userid,
          f1_yacht_id: yachtId,
          full_name: bookingData.fullName,
          email: bookingData.email,
          phone_number: bookingData.phone,
          country: countriesList.find(c => c.code === bookingData.country)?.name || bookingData.country,
          message: bookingData.message || "",
          adults: bookingData.adults,
          kids: bookingData.kids,
          // duration_hour: bookingData.bookingType === 'hourly' ? bookingData.duration : null,
          duration_hour: bookingData.bookingType === 'date_range' ? 0 : bookingData.duration,
          is_partial_payment: bookingData.isPartialPayment || false,
          terms_accepted: bookingData.termsAccepted || true,
          // selected_date: bookingData.date.toISOString(),
          start_date: formattedDate,
          end_date: formattedEndDate,
          booking_type: bookingData.bookingType || 'hourly',
          // starting_time: format(bookingData.startTime, 'HH:mm'),
          starting_time: formattedTime,
          per_day_price: bookingData.bookingType === 'date_range' ? selectedYacht?.yacht?.per_day_price || 0 : 0,
          food: 0,
          waterSports: 0,
          misc: 0,
          bath: 0,
          // extras: bookingData.extras ? Object.entries(bookingData.extras).map(([id, { quantity, price, name }]) => ({
          //   id,
          //   quantity,
          //   price,
          //   name,
          // })) : [],
          extras: formattedExtras
        };
  
        if (!yachtId) {
          toast.error('Yacht ID is missing. Please select a yacht.');
          return;
        }
  
        // Send POST request
        const response = await fetch(`${API_BASE_URL}/yacht/f1-yachts_booking/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(bookingPayload),
        });
  
        if (!response.ok) {
          const errorResult = await response.json(); // Parse the error response
          console.log(errorResult)
          throw new Error(errorResult.error || 'Failed to create booking');
        }
  
        const result = await response.json();
        // toast({
        //   title: "Temporary Booking Created",
        //   description: `Your temporary booking has been created. Your booking id is ${result.booking_id} Move forward to payment.`,
        //   variant: "success",
        // });
  
        // Update booking context with booking ID
        updateBookingData({ bookingId: result.booking_id });
        handleDispatchBookingData({...appStatBookingContext,
                     ...bookingData
                   })
  
        onNext();
      }
   
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };



  if (loading) {
    return (
      <form className="mt-8 md:grid grid-cols-2 gap-4 md:space-y-0 space-y-4 container mx-auto bg-white dark:bg-gray-900 rounded-md p-6">
        <div className="animate-pulse">
          <Label className="block text-sm font-medium">
            Full Name <span className="text-red-500">*</span>
          </Label>
          <div className="mt-1 block w-full h-10 bg-gray-200 rounded"></div>
        </div>

        <div className="animate-pulse">
          <Label className="block text-sm font-medium">
            Email <span className="text-red-500">*</span>
          </Label>
          <div className="mt-1 block w-full h-10 bg-gray-200 rounded"></div>
        </div>

        <div className="animate-pulse">
          <Label className="block text-sm font-medium">
            Country <span className="text-red-500">*</span>
          </Label>
          <div className="mt-1 block w-full h-10 bg-gray-200 rounded"></div>
        </div>

        <div className="animate-pulse">
          <Label className="block text-sm font-medium">
            Phone Number <span className="text-red-500">*</span>
          </Label>
          <div className="mt-1 block w-full h-10 bg-gray-200 rounded"></div>
        </div>

        <div className="col-span-2 flex justify-end animate-pulse">
          <div className="rounded-full bg-[#BEA355] px-6 py-2 text-white h-10 w-32"></div>
        </div>
      </form>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 md:grid grid-cols-2 gap-4 md:space-y-0 space-y-4 container mx-auto bg-white dark:bg-gray-900 rounded-md p-6">
      <div>
        <Label htmlFor="fullName" className="block text-sm font-medium">
          Full Name <span className="text-red-500">*</span>
        </Label>
        <Input
          id="fullName"
          type="text"
          placeholder="Enter your full name"
          required
          value={bookingData.fullName}
          onChange={(e) => updateBookingData({ fullName: e.target.value })}
          className="mt-1 block w-full"
        />
      </div>

      <div>
        <Label htmlFor="email" className="block text-sm font-medium">
          Email <span className="text-red-500">*</span>
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="Enter your email"
          required
          value={bookingData.email}
          onChange={(e) => updateBookingData({ email: e.target.value })}
          className="mt-1 block w-full"
        />
      </div>

      <div>
        <Label htmlFor="country" className="block text-sm font-medium">
          Country <span className="text-red-500">*</span>
        </Label>
        <Select
          value={bookingData.country}
          onValueChange={(value) => updateBookingData({ country: value })}
        >
          <SelectTrigger className="w-full mt-1">
            <SelectValue placeholder="Select your country" />
          </SelectTrigger>
          <SelectContent>

            {countriesList.map(country => (
              <SelectItem key={country?.name} value={country?.name}>
                {country.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="phone" className="block text-sm font-medium">
          Phone Number <span className="text-red-500">*</span>
        </Label>
        <Input
          id="phone"
          type="tel"
          placeholder="Enter any International Number"
          required
          value={bookingData.phone}
          onChange={(e) => {
            const value = e.target.value;
            const sanitizedValue = value.replace(/[^0-9+]/g, ""); 
            updateBookingData({ phone: sanitizedValue });
          }}
          className="mt-1 block w-full"
        />
      </div>

      <div className="col-span-2 flex justify-end">
        <Button
          type="submit"
          disabled={loading}
          className="rounded-full bg-[#BEA355] px-6 py-2 text-white"
        >
          {loading ? 'Saving...' : 'Next'}
        </Button>
      </div>
    </form>
  );
};

export default UserDetails;
