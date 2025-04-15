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
import { ArrowLeft, Copy, Mail, Phone, User } from "lucide-react";
import Link from "next/link";
import React from "react";

const BookingSummary = () => {
  return (
    <section className="py-10 px-2">
      <div className="container px-2 mx-auto flex items-center space-x-4">
        <Button className="bg-[#F8F8F8] hover:bg-[#F8F8F8] shadow-md rounded-full flex items-center justify-center w-10 h-10">
          <ArrowLeft className="w-4 h-4 text-black" />
        </Button>
        <h1 className="text-sm md:text-lg font-medium">Booking Summary</h1>
      </div>
      <div className="mx-auto container px-2 space-y-6 mt-8">
        <Table className="bg-[#F4F0E4] w-full rounded-lg">
          <TableHeader>
            <TableRow className="">
              <TableHead className="font-semibold text-md text-black">
                Price Summary
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="bg-white text-xs">
            <TableRow>
              <TableCell className="font-semibold">Charter</TableCell>
              <TableCell className="font-medium">AED 1.950</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-semibold">Catering</TableCell>
              <TableCell className="font-medium">AED 0</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-semibold">Due</TableCell>
              <TableCell className="font-medium capitalize">
                AED 1,950
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <Table className="bg-[#F4F0E4] w-full rounded-lg">
          <TableHeader>
            <TableRow className="">
              <TableHead className="font-semibold text-md text-black">
                Your Payments
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="bg-white text-xs">
            <TableRow>
              <TableCell className="font-semibold">Amount</TableCell>
              <TableCell className="font-semibold">Mode</TableCell>
              <TableCell className="font-semibold">Receipt</TableCell>
            </TableRow>
            <TableRow className="bg-white">
              <TableCell className="font-medium">0.00</TableCell>
              <TableCell className="font-medium">0.00</TableCell>
              <TableCell className="font-medium">0.00</TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <Table className="bg-[#F4F0E4] w-full rounded-lg">
          <TableHeader>
            <TableRow className="">
              <TableHead className="font-semibold text-md text-black">
                Your Contact Details
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="bg-white text-xs">
            <TableRow className="bg-white">
              <TableCell className="font-medium flex items-center gap-2">
                <User className="w-4 h-4" /> Alex Harmozi
              </TableCell>
            </TableRow>
            <TableRow className="bg-white">
              <TableCell className="font-medium flex items-center gap-2">
                <Phone className="w-4 h-4" /> +971 50 123 4567
              </TableCell>
            </TableRow>
            <TableRow className="bg-white">
              <TableCell className="font-medium flex items-center gap-2">
                <Mail className="w-4 h-4" /> alex@yacht.com
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <Table className="bg-[#F4F0E4] w-full rounded-t-lg">
          <TableHeader>
            <TableRow className="">
              <TableHead className="font-semibold text-md text-black">
                Your Consultant
              </TableHead>
            </TableRow>
          </TableHeader>
        </Table>
        <div className="flex justify-center md:flex-row flex-col items-center bg-white mx-auto gap-10">
          {/* <Image src={} alt='' /> */}
          <User className="size-40 bg-slate-100 p-2 rounded-full" />
          <div className="max-w-sm flex flex-col gap-3">
            <h1 className="text-sm font-medium">Alex Harmozi</h1>
            <Separator className="w-full" />
            <p className="text-xs text-gray-500">
              Tales maroon to spanish pin privateer. Blossom rum cat prey
              hogshead six mizzen gunwalls. Pounders ketch chain timbers black
              lateen cog lee. Belaying driver quarterdeck warp hang landlubber
              ketch brace. Lee lugsail blossom splice boom killick hands yer
              sail.
            </p>
            <Separator className="w-full" />
            <p className="text-xs flex items-center gap-2">
              <Phone className="w-4 h-4" />
              +1 345 689 0124
            </p>
            <Separator className="w-full" />
            <p className="text-xs flex items-center gap-2">
              <Mail className="w-4 h-4" />
              alex@yacht.com
            </p>
          </div>
        </div>
        <div className="bg-[#F4F0E4] w-full rounded-t-lg p-3">
          <p className="text-sm font-semibold">Your Unique booking link</p>
        </div>
        <div className="bg-[#EFF2FF] flex justify-center items-center w-full border-dashed border-2 border-[#1D74FF] p-2">
          <Button
            variant="link"
            className="underline text-xs font-medium text-[#1D74FF]"
          >
            https://yacht.com/booking/1234567890 <Copy />
          </Button>
        </div>
        <Link
          className="w-full col-span-2 flex justify-end"
          href="/dashboard/yachts/1/payment"
        >
          <Button className="rounded-full bg-[#BEA355] px-6 py-2" type="submit">
            Continue
          </Button>
        </Link>
      </div>
    </section>
  );
};

export default BookingSummary;
