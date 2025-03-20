"use client";
import React, { useState, useMemo } from "react";
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
import { toast } from "sonner";
import { countries } from 'countries-list';

const UserDetails = ({ onNext }) => {
  const { bookingData, updateBookingData } = useBookingContext();
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
      // Validate required fields
      const requiredFields = ['fullName', 'email', 'phone', 'country'];
      const missingFields = requiredFields.filter(field => !bookingData[field]);

      if (missingFields.length > 0) {
        toast.error(`Please fill in all required fields: ${missingFields.join(', ')}`);
        return;
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(bookingData.email)) {
        toast.error('Please enter a valid email address');
        return;
      }

      // Validate phone number
      const phoneRegex = /^\+?[\d\s-]{8,}$/;
      if (!phoneRegex.test(bookingData.phone)) {
        toast.error('Please enter a valid phone number');
        return;
      }

      onNext();
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to save details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-8 md:grid grid-cols-2 gap-4 md:space-y-0 space-y-4 container mx-auto bg-white dark:bg-gray-900 p-4 rounded-lg">
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
          value={bookingData?.country}
          onValueChange={(value) => updateBookingData({ country: value })}
        >
          <SelectTrigger className="w-full mt-1">
            <SelectValue placeholder="Select your country" />
          </SelectTrigger>
          <SelectContent>
            {countriesList.map(country => (
              <SelectItem key={country.code} value={country.code}>
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
          onChange={(e) => updateBookingData({ phone: e.target.value })}
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