"use client";
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ArrowLeft, CalendarIcon, ClockIcon, FerrisWheel, MapPin, Minus, Pizza, Plus, Ship } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import TimePicker from '@/components/ui/time-picker';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import Link from 'next/link';

const BookYacht = () => {
    const [date, setDate] = useState(new Date())
    const [startTime, setStartTime] = useState(new Date())

    const [duration, setDuration] = useState(3)

    const [adults, setAdults] = useState(0)
    const [food, setFood] = useState(0)
    const [kids, setKids] = useState(0)

    const formatTime = (time) => {
        return format(time, 'p');
    }

    const handleTimeSelect = (time) => {
        setStartTime(time)
    }

    const handleDecrement = () => {
        setDuration((prev) => (prev > 3 ? prev - 1 : prev))
    }

    const handleIncrement = () => {
        setDuration((prev) => prev + 1)
    }

    const handleAdultsDecrement = () => {
        setAdults((prev) => (prev > 0 ? prev - 1 : prev));
    };

    const handleFoodDecrement = () => {
        setFood((prev) => (prev > 0 ? prev - 1 : prev));
    };

    const handleFoodIncrement = () => {
        setFood((prev) => prev + 1);
    };

    const handleAdultsIncrement = () => {
        setAdults((prev) => prev + 1);
    };

    const handleKidsDecrement = () => {
        setKids((prev) => (prev > 0 ? prev - 1 : prev));
    };

    const handleKidsIncrement = () => {
        setKids((prev) => prev + 1);
    };

    return (
        <section className="py-10 px-2">
            <div className='container px-2 mx-auto flex items-center space-x-4'>
                <Button className="bg-[#F8F8F8] hover:bg-[#F8F8F8] shadow-md rounded-full flex items-center justify-center w-10 h-10">
                    <ArrowLeft className='w-4 h-4 text-black' />
                </Button>
                <h1 className='text-sm md:text-lg font-medium'>Booking Details</h1>
            </div>
            <div className="flex flex-col lg:flex-row justify-center lg:justify-between gap-6 container px-2 mx-auto pt-8">
                <div className="flex flex-col w-full lg:w-2/3 gap-4">
                    <div className="flex flex-col space-y-2">
                        <Label htmlFor="booking-date" className="text-sm font-medium">
                            Select Booking Date<span className='text-red-500'>*</span>
                        </Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant={"outline"}
                                    className={cn(
                                        "w-[280px] justify-start text-left font-normal",
                                        !date && "text-muted-foreground"
                                    )}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <Calendar
                                    mode="single"
                                    selected={date}
                                    onSelect={setDate}
                                    disabled={(day) =>
                                        day > new Date() || day < new Date("1900-01-01")
                                    }
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                    </div>
                    <div className='flex justify-between flex-col md:flex-row'>
                        <div className="flex flex-col space-y-2">
                            <Label htmlFor="start-time" className="text-sm font-medium">
                                Select Start Time<span className='text-red-500'>*</span>
                            </Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant={"outline"}
                                        className={cn(
                                            "w-[280px] justify-start text-left font-normal",
                                            !startTime && "text-muted-foreground"
                                        )}
                                    >
                                        <ClockIcon className="mr-2 h-4 w-4" />
                                        {startTime ? formatTime(startTime) : <span>Pick a time</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <TimePicker
                                        selectedTime={startTime}
                                        onTimeSelect={handleTimeSelect}
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>
                        {/* Duration Field */}
                        <div className="flex flex-col md:items-end items-start pt-4 lg:pt-0 space-y-2">
                            <Label htmlFor="duration" className="text-sm font-medium">
                                Select Duration (min 3 hrs)<span className='text-red-500'>*</span>
                            </Label>
                            <div className="flex items-center justify-end">
                                <Button
                                    type="button"
                                    onClick={handleDecrement}
                                    className="bg-gray-100 hover:bg-gray-200 rounded-md p-2 h-8"
                                >
                                    <Minus className='w-4 h-4 text-gray-900' />
                                </Button>
                                <Input
                                    type="text"
                                    id="duration"
                                    value={duration}
                                    readOnly
                                    className="w-8 px-3 py-2 text-center text-gray-900 text-sm bg-transparent border-none shadow-none dark:text-white"
                                />
                                <Button
                                    type="button"
                                    onClick={handleIncrement}
                                    className="bg-gray-100 hover:bg-gray-200 rounded-md p-2 h-8"
                                >
                                    <Plus className='w-4 h-4 text-gray-900' />
                                </Button>
                            </div>
                        </div>
                    </div>
                    <div className='flex justify-between'>
                        <div className="flex flex-col gap-4 w-full">
                            <div className="flex items-center justify-between">
                                <div>
                                    <Label htmlFor="adults" className="text-sm font-medium">
                                        Persons<span className='text-red-500'>*</span>
                                    </Label>
                                    <p className='text-xs'>(18 and above)</p>
                                </div>
                                <div className="flex items-center">
                                    <Button
                                        type="button"
                                        onClick={handleAdultsDecrement}
                                        className="bg-gray-100 hover:bg-gray-200 rounded-md p-2 h-8"
                                    >
                                        <Minus className="w-4 h-4 text-gray-900" />
                                    </Button>
                                    <Input
                                        type="text"
                                        id="adults"
                                        value={adults}
                                        readOnly
                                        className="w-8 px-3 py-2 text-center text-gray-900 text-sm bg-transparent border-none shadow-none dark:text-white"
                                    />
                                    <Button
                                        type="button"
                                        onClick={handleAdultsIncrement}
                                        className="bg-gray-100 hover:bg-gray-200 rounded-md p-2 h-8"
                                    >
                                        <Plus className="w-4 h-4 text-gray-900" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <Label htmlFor="kids" className="text-sm font-medium">
                            Optional Extras<span className='text-red-500'>*</span>
                        </Label>
                        <Accordion className='space-y-4 mt-2' type="multiple" collapsible>
                            <AccordionItem className="" value="item-1">
                                <AccordionTrigger className='w-full px-4 flex justify-between outline-none text-white font-medium items-center h-12 rounded-lg bg-[#F1F1F1] mb-3 capitalize'>
                                    <div className='flex justify-between w-full items-center'>
                                        <p className='text-gray-700 font-semibold text-sm'>Food & Beverages</p>
                                        <p className='text-gray-700 font-semibold text-sm'>AED <span className='text-black text-lg'>6000</span></p>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="mb-2 border-2 border-[#D2D2D2] rounded-lg p-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <Label htmlFor="food" className="text-sm font-medium">
                                                Pizza
                                            </Label>
                                            <p className='text-xs text-gray-700'>AED <span className='text-black text-sm'>350</span></p>
                                        </div>
                                        <div className="flex items-center">
                                            {/* <Image src={} alt="pizza" width={100} height={100} /> */}
                                            <Pizza className='w-10 h-10 text-gray-900 mr-5' />
                                            <Button
                                                type="button"
                                                onClick={handleFoodDecrement}
                                                className="bg-gray-100 hover:bg-gray-200 rounded-md p-2 h-8"
                                            >
                                                <Minus className="w-4 h-4 text-gray-900" />
                                            </Button>
                                            <Input
                                                type="text"
                                                id="food"
                                                value={food}
                                                readOnly
                                                className="w-8 px-3 py-2 text-center text-gray-900 text-sm bg-transparent border-none shadow-none dark:text-white"
                                            />
                                            <Button
                                                type="button"
                                                onClick={handleFoodIncrement}
                                                className="bg-gray-100 hover:bg-gray-200 rounded-md p-2 h-8"
                                            >
                                                <Plus className="w-4 h-4 text-gray-900" />
                                            </Button>
                                        </div>
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem className="" value="item-2">
                                <AccordionTrigger className='w-full px-4 flex justify-between outline-none text-white font-medium items-center h-12 rounded-lg bg-[#F1F1F1] mb-3 capitalize'>
                                    <div className='flex justify-between w-full items-center'>
                                        <p className='text-gray-700 font-semibold text-sm'>Water Sports</p>
                                        <p className='text-gray-700 font-semibold text-sm'>AED <span className='text-black text-lg'>6000</span></p>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="mb-2 border-2 border-[#D2D2D2] rounded-lg p-4">
                                    <div className="grid grid-cols-3 text-left mb-4 font-semibold">
                                        <p>Item</p>
                                        <div className="text-center">Price</div>
                                        <div className="text-right">Quantity <span className='text-xs text-gray-700'>(Min 2)</span></div>
                                    </div>
                                    <div className="grid grid-cols-3 items-center">
                                        <div className="flex items-center space-x-4">
                                            {/* <Image src="/jetski.jpg" alt="Jet Ski" width={40} height={40} className="rounded-md" /> */}
                                            <Ship className='w-10 h-10 text-gray-900 mr-1' />
                                            <span className="text-sm font-medium text-gray-700">Jet Ski (30 Minutes)</span>
                                        </div>
                                        <div className="text-center text-gray-700 text-sm">AED 500</div>
                                        <div className="flex items-center justify-end">
                                            <Button
                                                type="button"
                                                onClick={handleFoodDecrement}
                                                className="bg-gray-100 hover:bg-gray-200 rounded-md p-2 h-8"
                                            >
                                                <Minus className="w-4 h-4 text-gray-900" />
                                            </Button>
                                            <Input
                                                type="text"
                                                id="jet-ski-quantity"
                                                value={food}
                                                readOnly
                                                className="w-8 px-3 py-2 text-center text-gray-900 text-sm bg-transparent border-none shadow-none dark:text-white"
                                            />
                                            <Button
                                                type="button"
                                                onClick={handleFoodIncrement}
                                                className="bg-gray-100 hover:bg-gray-200 rounded-md p-2 h-8"
                                            >
                                                <Plus className="w-4 h-4 text-gray-900" />
                                            </Button>
                                        </div>
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem className="" value="item-3">
                                <AccordionTrigger className='w-full px-4 flex justify-between outline-none text-white font-medium items-center h-12 rounded-lg bg-[#F1F1F1] mb-3 capitalize'>
                                    <div className='flex justify-between w-full items-center'>
                                        <p className='text-gray-700 font-semibold text-sm'>Miscellaneous</p>
                                        <p className='text-gray-700 font-semibold text-sm'>AED <span className='text-black text-lg'>6000</span></p>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="mb-2 border-2 border-[#D2D2D2] rounded-lg p-4">
                                    <div className="grid grid-cols-3 text-left mb-4 font-semibold">
                                        <p>Item</p>
                                        <div className="text-center">Price</div>
                                        <div className="text-right">Quantity <span className='text-xs text-gray-700'>(Min 2)</span></div>
                                    </div>
                                    <div className="grid grid-cols-3 items-center">
                                        <div className="flex items-center space-x-4">
                                            <FerrisWheel className='w-10 h-10 text-gray-900 mr-1' />
                                            <span className="text-sm font-medium text-gray-700">Ballons</span>
                                        </div>
                                        <div className="text-center text-gray-700 text-sm">AED 6000</div>
                                        <div className="flex items-center justify-end">
                                            <Button
                                                type="button"
                                                onClick={handleFoodDecrement}
                                                className="bg-gray-100 hover:bg-gray-200 rounded-md p-2 h-8"
                                            >
                                                <Minus className="w-4 h-4 text-gray-900" />
                                            </Button>
                                            <Input
                                                type="text"
                                                id="jet-ski-quantity"
                                                value={food}
                                                readOnly
                                                className="w-8 px-3 py-2 text-center text-gray-900 text-sm bg-transparent border-none shadow-none dark:text-white"
                                            />
                                            <Button
                                                type="button"
                                                onClick={handleFoodIncrement}
                                                className="bg-gray-100 hover:bg-gray-200 rounded-md p-2 h-8"
                                            >
                                                <Plus className="w-4 h-4 text-gray-900" />
                                            </Button>
                                        </div>
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </div>
                </div>
                <div className='flex flex-col gap-4 bg-white p-7 rounded-xl w-full lg:w-1/3 max-w-[400px] self-start shadow-md space-y-3'>
                    <h1 className='text-lg font-bold'>AED <span className='text-black text-3xl'>6000</span> FOR 3 HOURS</h1>
                    <Table className="bg-[#EBEBEB] w-full rounded-lg">
                        <TableHeader>
                            <TableRow className="">
                                <TableHead className="font-semibold text-md text-black">34ft Yacht</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody className="bg-white border text-xs">
                            <TableRow>
                                <TableCell className="font-semibold">Departure</TableCell>
                                <TableCell className="font-medium">12:00 PM, 20th July 2024</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="font-semibold">Duration</TableCell>
                                <TableCell className="font-medium">5 Hours</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="font-semibold">Guests</TableCell>
                                <TableCell className="font-medium capitalize">5 (max capacity is 17 guests)</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="font-semibold">Location</TableCell>
                                <TableCell className="font-medium flex items-center capitalize"><MapPin className='w-4 h-4 text-gray-900 mr-1' /> dubai, business bay</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                    <div className='bg-red-100 rounded-lg p-2 w-full text-xs'>you have <span className='font-bold text-red-500 underline'>44 minutes</span> to complete your booking</div>
                    <div className="flex items-center space-x-2">
                        <Checkbox defaultChecked className="data-[state=checked]:bg-[#BEA355] data-[state=unchecked]:border-[#BEA355] data-[state=checked]:border-[#BEA355]" id="terms" />
                        <Label htmlFor="terms">You want to do partial payment?</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Checkbox defaultChecked className="data-[state=checked]:bg-[#BEA355] data-[state=unchecked]:border-[#BEA355] data-[state=checked]:border-[#BEA355]" id="terms" />
                        <Label htmlFor="terms" className="underline">
                            I agree to terms & conditions
                        </Label>
                    </div>
                    <Link className="w-full" href={`/dashboard/yachts/${id}/booking-details`}>
                        <Button className='bg-[#BEA355] text-white rounded-full w-full h-10'>Continue</Button>
                    </Link>
                </div>
            </div>
        </section>
    )
}

export default BookYacht