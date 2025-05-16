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
  const { bookingDetails, updateBookingDetails } = useBookingContext();
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
      const missingFields = requiredFields.filter(field => !bookingDetails[field]);

      if (missingFields.length > 0) {
        toast.error(`Please fill in all required fields: ${missingFields.join(', ')}`);
        setLoading(false);
        return;
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(bookingDetails.email)) {
        toast.error('Please enter a valid email address');
        setLoading(false);
        return;
      }

      // Validate phone number
      const phoneRegex = /^\+?[\d\s-]{8,}$/;
      if (!phoneRegex.test(bookingDetails.phone)) {
        toast.error('Please enter a valid phone number');
        setLoading(false);
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
    <div className="max-w-6xl mx-auto px-2 py-8">
      <div className="">
        <h2 className="text-2xl font-semibold mb-6">User Details</h2>
        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="fullName">
                Full Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="fullName"
                type="text"
                placeholder="Enter your full name"
                required
                value={bookingDetails.fullName || ''}
                onChange={(e) => updateBookingDetails({ fullName: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">
                Email <span className="text-red-500">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                required
                value={bookingDetails.email || ''}
                onChange={(e) => updateBookingDetails({ email: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="country">
                Country <span className="text-red-500">*</span>
              </Label>
              <Select 
                value={bookingDetails.country || ''}
                onValueChange={(value) => updateBookingDetails({ country: value })}
              >
                <SelectTrigger>
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

            <div className="space-y-2">
              <Label htmlFor="phone">
                Phone Number <span className="text-red-500">*</span>
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder="Enter your phone number"
                required
                value={bookingDetails.phone || ''}
                onChange={(e) => updateBookingDetails({ phone: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Special Requests (Optional)</Label>
            <Input
              id="message"
              placeholder="Any special requests or notes?"
              value={bookingDetails.message || ''}
              onChange={(e) => updateBookingDetails({ message: e.target.value })}
            />
          </div>

          <div className="flex justify-end pt-4">
            <Button
              type="submit"
              disabled={loading}
              className="bg-[#BEA355] text-white hover:bg-[#A89245] w-full md:w-auto rounded-full"
            >
              {loading ? "Saving..." : "Continue to Payment"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserDetails;
