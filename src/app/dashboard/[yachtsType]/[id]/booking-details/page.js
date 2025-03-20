"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import { useParams } from "next/navigation";

const BookingDetails = () => {
    const { yachtsType } = useParams();
  
  return (
    <section className="py-10">
      <div className="max-w-5xl mx-auto flex items-center space-x-4">
        <Button className="bg-[#F8F8F8] hover:bg-[#F8F8F8] shadow-md rounded-full flex items-center justify-center w-10 h-10">
          <ArrowLeft className="w-4 h-4 text-black" />
        </Button>
        <h1 className="text-sm md:text-lg font-medium">Booking Details</h1>
      </div>
      <form className="mt-8 md:grid grid-cols-2 gap-4 md:space-y-0 space-y-4 container mx-auto px-2 bg-white dark:bg-gray-900">
        <div>
          <Label htmlFor="fullName" className="block text-sm font-medium">
            Full Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="fullName"
            type="text"
            placeholder="Enter your full name"
            required
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
            className="mt-1 block w-full"
          />
        </div>

        <div>
          <Label htmlFor="country" className="block text-sm font-medium">
            Country <span className="text-red-500">*</span>
          </Label>
          <Select>
            <SelectTrigger className="w-full mt-1">
              <SelectValue placeholder="Select your country" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="us">United States</SelectItem>
              <SelectItem value="ca">Canada</SelectItem>
              <SelectItem value="uk">United Kingdom</SelectItem>
              <SelectItem value="au">Australia</SelectItem>
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
            placeholder="Enter your phone number"
            required
            className="mt-1 block w-full"
          />
        </div>

        <Link
          className="w-full col-span-2 flex justify-end"
          href={`/dashboard/${yachtsType}/1/booking-summary`}
        >
          <Button className="rounded-full bg-[#BEA355] px-6 py-2" type="submit">
            Next
          </Button>
        </Link>
      </form>
    </section>
  );
};

export default BookingDetails;
