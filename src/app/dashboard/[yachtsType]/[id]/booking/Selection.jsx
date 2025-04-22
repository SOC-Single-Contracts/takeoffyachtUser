"use client";
import React, { useContext, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { CalendarIcon, Clock, Minus, Plus, MapPin } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useBookingContext } from './BookingContext';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import Image from 'next/image';
import { Skeleton } from '@/components/ui/skeleton';
import { Fancybox } from "@fancyapps/ui";
import "@fancyapps/ui/dist/fancybox/fancybox.css";
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { handleDispatchBookingData } from '@/helper/bookingData';
import { useParams } from 'next/navigation';
import { handleDispatchwalletData } from '@/helper/walletData';
import { getWallet } from '@/api/wallet';
import { calculateDaysBetween, formatDate, formatHumanReadableTime, formatNewYearTime, isDateDisabled, removeLeadingZeros, showSelectedYachtPrice } from '@/helper/calculateDays';
import { Loading } from '@/components/ui/loading';
import { GlobalStateContext } from '@/context/GlobalStateContext';

const Selection = ({ onNext }) => {
  const { toast } = useToast();
  const { bookingData, updateBookingData, selectedYacht, setBookingData, appStatBookingContext } = useBookingContext();
  const { globalState: appState, dispatch: appDispatch } = useContext(GlobalStateContext)
  // console.log("appState", appState)
  const capacity = selectedYacht?.yacht?.capacity || 0;
  const [loading, setLoading] = useState(false);
  const [availableDates, setAvailableDates] = useState([]);
  const [dateRange, setDateRange] = useState({ start_date: '', end_date: '' });
  const { yachtsType } = useParams();
  const [newYearCondition,setNewYearCondition] = useState(false)
  const token = typeof window !== "undefined" ? localStorage.getItem("token") || null : null;
  const userId = typeof window !== "undefined" ? localStorage.getItem("userid") || null : null;
  const appStatWwalletContext =
    typeof window !== "undefined" && localStorage.getItem("walletContext")
      ? JSON.parse(localStorage.getItem("walletContext"))
      : {};
  const [extras, setExtras] = useState({
    food: [],
    extra: [],
    sport: []
  });
  const [quantities, setQuantities] = useState({});
  const [loadingExtras, setLoadingExtras] = useState(true);
  const [timeLeft, setTimeLeft] = useState(44 * 60);
  const [isTermsOpen, setIsTermsOpen] = useState(false);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 0) {
          clearInterval(timer);
          toast.error("Booking session expired. Please start over.");
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Fetch availability on component mount
  useEffect(() => {
    const fetchAvailability = async () => {
      if (!selectedYacht?.yacht?.id) {
        toast.error('Yacht ID is not available.');
        return;
      }

      setLoading(true);
      try {
        const response = await fetch(`https://api.takeoffyachts.com/yacht/check_yacht_availability/?yacht_id=${selectedYacht.yacht.id}`);
        const data = await response.json();
        if (data.error_code === 'pass') {
          const available = data.availability.filter(item => item.is_available).map(item => item.date);
          available.push("2025-12-30", "2025-12-31");
          setAvailableDates(available); // Store available dates
          setDateRange(data.date_range); // Store date range
          // console.log('Available Dates:', available,data);
        } else {
          toast.error('Failed to check availability.');
        }
      } catch (error) {
        console.error('Error checking availability:', error);
        toast.error('Error checking availability.');
      } finally {
        setLoading(false);
      }
    };

    if (yachtsType == "f1yachts") {
      const generateDateArray = () => {
        let dates = [], d = new Date();
        for (let i = 0; i <= 60; i++) {
          dates.push(d.toISOString().split("T")[0]);
          d.setDate(d.getDate() + 1);
        }
        return dates;
      };

      // console.log(generateDateArray());

      const generateDateRange = () => {
        let startDate = new Date();
        let endDate = new Date();
        endDate.setDate(startDate.getDate() + 60);

        return {
          start_date: startDate.toISOString().split("T")[0],
          end_date: endDate.toISOString().split("T")[0]
        };
      };

      // console.log(generateDateRange());

      setAvailableDates(generateDateArray)
      setDateRange(generateDateRange)
      updateBookingData({
        date: selectedYacht?.yacht?.from_date,
        endDate: selectedYacht?.yacht?.to_date,
        bookingType: 'date_range'
      });

    } else if (yachtsType == "yachts") {
      // fetchAvailability();
    }
  }, [selectedYacht]);

  useEffect(() => {
    const fetchExtras = async () => {
      try {
        const response = await fetch('https://api.takeoffyachts.com/yacht/food/');
        const data = await response.json();
        if (data.error_code === 'pass') {
          const organizedExtras = {
            food: data.food.filter(item => item.price !== null && item.menucategory !== null),
            extra: data.extra.filter(item => item.price !== null && item.menucategory !== null),
            sport: data.sport.filter(item => item.price !== null && item.menucategory !== null)
          };

          setExtras(organizedExtras);
          updateBookingData({ extras: organizedExtras });
        } else {
          toast.error('Failed to fetch extras.');
        }
      } catch (error) {
        console.error('Error fetching extras:', error);
        toast.error('Error fetching extras.');
      } finally {
        setLoadingExtras(false);
      }
    };

    fetchExtras();

    if (!bookingData?.startTime) {
      const defaultTime = new Date();
      defaultTime.setHours(9, 0, 0, 0);
      updateBookingData({ startTime: defaultTime });
    }
  }, [selectedYacht]);

  // useEffect(() => {
  //   const getWalletResponse = async () => {
  //     if (!userId || !token) return;
  //     try {
  //       const data = await getWallet(token);

  //       handleDispatchwalletData({
  //         ...appStatWwalletContext, balance: data?.balance ?? prev.balance,
  //         freezeWallet: data?.freeze ?? prev.freezeWallet,
  //         transactions: data?.transactions ?? prev.transactions
  //       })

  //     } catch (err) {
  //       console.error(err)
  //     } finally {
  //     }
  //   };

  //   getWalletResponse();
  // }, [userId, token]);
  //   useEffect(()=>{
  // // console.log("availableDates,dateRange",availableDates,dateRange)
  // //   },[availableDates,dateRange])



  const handleQuantityChange = (itemId, type) => {
    setQuantities(prev => {
      const currentQty = prev[itemId] || 0;
      const newQty = type === 'increment' ? currentQty + 1 : Math.max(0, currentQty - 1);
      return { ...prev, [itemId]: newQty };
    });
    // appDispatch({ type: "changeNumber", numberInc: appState.number + 2 })

  };

  const calculateCategoryTotal = (items) => {
    return items.reduce((total, item) => {
      return total + (item.price * (quantities[item.id] || 0));
    }, 0);
  };



  const handleNext = async () => {
    setLoading(true);
    try {
      if (yachtsType == "yachts") {
        if (!bookingData?.date || !bookingData?.startTime) {
          toast({ title: 'Error', description: 'Please select date and time' });
          return;
        }

        // if (bookingData?.adults + bookingData?.kids === 0) {
        //   toast({ title: 'Error', description: 'Please add at least one guest' });
        //   return;
        // }

        // Check if it's New Year's Eve
        const isNewYearsEve = newYearCondition

        // Show warning for New Year's Eve bookings
        if (isNewYearsEve) {
          toast({ title: 'Warning', description: `New Year's Eve rates apply for this booking date Special pricing will be calculated accordingly. ` });

        }

        const allExtras = [...extras.food, ...extras.extra, ...extras.sport];

        // Update booking data with quantities and pricing info
        updateBookingData({
          extras: Object.entries(quantities).reduce((acc, [itemId, qty]) => {
            if (qty > 0) {
              // const item = [...extras.food, ...extras.extra, ...extras.sport].find(i => i.id === parseInt(id));
              const item = allExtras.find(i => i.id === Number(itemId))
              if (item) {
                // acc.push({ id, quantity: qty, price: item.price, name: item.name });
                acc.push({ id: item.id.toString(), quantity: qty, price: item.price, name: item.name });
              }
            }
            return acc;
          }, []),
          isNewYearBooking: isNewYearsEve
        });

        handleDispatchBookingData({
          ...appStatBookingContext,
          ...bookingData
        })

        onNext();
      } else if (yachtsType == "f1yachts") {
        if (!bookingData?.date || !bookingData?.endDate) {
          toast({ title: 'Error', description: 'Please select Start Date and End Date' });
          return;
        }

        // if (bookingData?.adults + bookingData?.kids === 0) {
        //   toast({ title: 'Error', description: 'Please add at least one guest' });
        //   return;
        // }

        // Check if it's New Year's Eve
        const isNewYearsEve = newYearCondition

        // Show warning for New Year's Eve bookings
        if (isNewYearsEve) {
             
      toast({ title: 'Warning', description: `New Year's Eve rates apply for this booking date Special pricing will be calculated accordingly. ` });

        }

        const allExtras = [...extras.food, ...extras.extra, ...extras.sport];

        // Update booking data with quantities and pricing info
        updateBookingData({
          extras: Object.entries(quantities).reduce((acc, [itemId, qty]) => {
            if (qty > 0) {
              // const item = [...extras.food, ...extras.extra, ...extras.sport].find(i => i.id === parseInt(id));
              const item = allExtras.find(i => i.id === Number(itemId))
              if (item) {
                // acc.push({ id, quantity: qty, price: item.price, name: item.name });
                acc.push({ id: item.id.toString(), quantity: qty, price: item.price, name: item.name });
              }
            }
            return acc;
          }, []),
          isNewYearBooking: isNewYearsEve
        });

        handleDispatchBookingData({
          ...appStatBookingContext,
          ...bookingData
        })

        onNext();
      }

    } catch (error) {
      console.error('Error:', error);
      toast({ title: 'Error', description: 'Failed to proceed. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 0; hour <= 23; hour++) {
      slots.push(format(new Date().setHours(hour, 0, 0, 0), 'HH:mm'));
    }
    return slots;
  };
  const daysCount = calculateDaysBetween(selectedYacht?.yacht?.from_date, selectedYacht?.yacht?.to_date);


  const renderExtraItem = (item, category) => (
    <div key={item.id} className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
      <div className="flex items-center space-x-4">
        <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100 cursor-pointer"
          onClick={() => {
            if (item.food_image) {
              Fancybox.show([
                {
                  src: `${process.env.NEXT_PUBLIC_API_URL || 'https://api.takeoffyachts.com'}${item.food_image}`,
                  type: "image",
                }
              ]);
            }
          }}
        >
          {item.food_image ? (
            <Image
              src={`${process.env.NEXT_PUBLIC_API_URL || 'https://api.takeoffyachts.com'}${item.food_image}`}
              alt={item.name}
              width={64}
              height={64}
              className="object-cover w-full h-full" // Ensure it covers the full area
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <span className="text-xs">No image</span>
            </div>
          )}
        </div>
        <div>
          <h3 className="font-medium text-black dark:text-white capitalize">{item.name}</h3>
          <p className="text-xs text-black dark:text-gray-400 capitalize">AED {item.price}</p>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <Button
          onClick={() => handleQuantityChange(item.id, 'decrement')}
          variant="outline"
          size="icon"
          className="h-8 w-8 bg-gray-100 dark:bg-gray-800 border-none"
        >
          <Minus className="h-4 w-4" />
        </Button>
        <span className="w-8 text-center">{quantities[item.id] || 0}</span>
        <Button
          onClick={() => handleQuantityChange(item.id, 'increment')}
          variant="outline"
          size="icon"
          className="h-8 w-8 bg-gray-100 dark:bg-gray-800 border-none"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );

  const renderLoadingSkeleton = () => (
    <div className="space-y-4">
      {[1, 2, 3].map(i => (
        <div key={i} className="flex items-center justify-between p-4 bg-white rounded-lg">
          <div className="flex items-center space-x-4">
            <Skeleton className="w-16 h-16 rounded-lg" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-16" />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Skeleton className="h-8 w-8 rounded" />
            <Skeleton className="h-8 w-8 rounded" />
            <Skeleton className="h-8 w-8 rounded" />
          </div>
        </div>
      ))}
    </div>
  );

  const handleDateSelect = (range) => {
    // console.log(range)

    // if (!range) return;
    // const selectedDate = format(range.from, 'yyyy-MM-dd');
    // if (!availableDates.includes(selectedDate)) {
    //   toast({
    //     title: "Error",
    //     description: "Selected date is not available.",
    //     variant: "destructive",
    //   });
    //   return;
    // }

    // // If clicking the same date again or selecting first date
    // if (!range.to || (range.from && range.to && range.from.getTime() === range.to.getTime())) {
    //   updateBookingData({
    //     date: range.from,
    //     endDate: null,
    //     bookingType: 'hourly'
    //   });
    //   return;
    // }

    // if (range.to) {
    //   const endDate = format(range.to, 'yyyy-MM-dd');
    //   if (!availableDates.includes(endDate)) {
    //     return;
    //   }

    //   updateBookingData({
    //     date: range.from,
    //     endDate: range.to,
    //     bookingType: 'date_range'
    //   });
    // }


    if (!range) return;

    // If clicking the same date again or selecting first date
    if (!range.to || (range.from && range.to && range.from.getTime() === range.to.getTime())) {
      updateBookingData({
        date: range.from,
        endDate: null,
        bookingType: 'hourly'
      });
      return;
    }

    if (range.to) {

      updateBookingData({
        date: range.from,
        endDate: range.to,
        bookingType: 'date_range'
      });
    }
    

  };

  useEffect(() => {
    if((bookingData?.date && new Date(bookingData.date).getMonth() === 11 && new Date(bookingData.date).getDate() === 31) && selectedYacht?.yacht?.ny_start_time && selectedYacht?.yacht?.ny_end_time ){
      setNewYearCondition(true)
    }else{
      setNewYearCondition(false)
    }
    // console.log("bookingData", bookingData)
  }, [bookingData,selectedYacht])

  useEffect(() => {
    if (newYearCondition && selectedYacht?.yacht?.ny_start_time && selectedYacht?.yacht?.ny_end_time) {
      const nyStartTimeStr = selectedYacht.yacht.ny_start_time; // "18:00:00"
      const nyEndTimeStr = selectedYacht.yacht.ny_end_time;     // "22:00:00"
  
      const baseDate = bookingData?.date ? new Date(bookingData.date) : new Date(); // fallback to today
  
      const [startHours, startMinutes, startSeconds] = nyStartTimeStr.split(':').map(Number);
      const [endHours, endMinutes, endSeconds] = nyEndTimeStr.split(':').map(Number);
  
      const startTime = new Date(baseDate);
      startTime.setHours(startHours, startMinutes, startSeconds || 0);
  
      const endTime = new Date(baseDate);
      endTime.setHours(endHours, endMinutes, endSeconds || 0);
  
      updateBookingData({ startTime, endTime });
    }
  }, [newYearCondition, selectedYacht]);

  //test
  // useEffect(() => {
  //   console.log("availableDates", availableDates)
  // }, [availableDates])
  // useEffect(() => {
  //   console.log("selectedYacht", selectedYacht)
  //   console.log(showSelectedYachtPrice(selectedYacht, yachtsType, bookingData,newYearCondition))
  //   console.log("newYearCondition",newYearCondition)
  // }, [selectedYacht, yachtsType, bookingData,newYearCondition])


  if (loading || !selectedYacht) {
    return (
      <Loading />
    );
  }



  return (
    <>
      {/* 
<div className="w-full mb-6">
    {loading ? (
        <div className="max-w-5xl mx-auto container px-2 space-y-6 mt-8">
            <div className="mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[...Array(3)].map((_, index) => (
                        <div key={index} className="relative h-48 rounded-lg bg-gray-200 animate-pulse" />
                    ))}
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm space-y-6">
                <div className="flex flex-col space-y-2">
                    <Label className="text-sm font-medium">Select Date</Label>
                    <div className="h-10 w-full bg-gray-200 animate-pulse rounded-lg" />
                </div>

                <div className="flex justify-between items-start">
                    <div className="flex flex-col space-y-2">
                        <Label className="text-sm font-medium">Start Time</Label>
                        <div className="h-10 w-full bg-gray-200 animate-pulse rounded-lg" />
                    </div>
                    <div className="flex flex-col items-end space-y-2">
                        <Label className="text-sm font-medium">Duration</Label>
                        <div className="h-10 w-full bg-gray-200 animate-pulse rounded-lg" />
                    </div>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
                <Label className="text-sm font-medium mb-4 block">Number of Guests</Label>
                <div className="flex flex-col space-y-4 items-end">
                    <div className="flex items-center space-x-4 dark:bg-gray-700 rounded-lg p-2">
                        <div className="h-8 w-24 bg-gray-200 animate-pulse rounded" />
                        <div className="h-8 w-24 bg-gray-200 animate-pulse rounded" />
                    </div>
                </div>
            </div>
        </div>
    ) : (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
            <div className="mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {selectedYacht?.yacht?.yacht_image && (
                        <div className="relative h-48 rounded-lg overflow-hidden cursor-pointer"
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
        </div>
    )}
</div>
*/}

      <div className="flex flex-col lg:flex-row justify-center lg:justify-between gap-6">
        <div className="flex flex-col w-full lg:w-2/4 xl:w-2/3 gap-4">
          {/* Date and Time Selection */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm space-y-6">
            {yachtsType == "yachts" ? <div className="flex flex-col space-y-2">
              <Label className="text-sm font-medium">
                Select Date<span className='text-red-500'>*</span>
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full max-w-[350px]] justify-start text-left font-normal",
                      !bookingData?.date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-1 h-4 w-4" />
                    {/* {bookingData?.date ? format(bookingData?.date, "PPP") : <span>Pick a date</span>} */}
                    {bookingData?.date ? (
                      bookingData?.endDate ?
                        `${format(bookingData?.date, "PPP")} - ${format(bookingData?.endDate, "PPP")}` :
                        format(bookingData?.date, "PPP")
                    ) : (
                      <span>Pick date(s)</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  {/* <Calendar
                  mode="single"
                  selected={bookingData?.date}
                  onSelect={(date) => updateBookingData({ date })}
                  disabled={(date) => date < new Date()}
                  initialFocus
                /> */}
                  {/* <Calendar
              mode="single"
              selected={bookingData?.date}
              onSelect={(date) => {
                if (availableDates.includes(format(date, 'yyyy-MM-dd'))) {
                  updateBookingData({ date });
                } else {
                  toast.error("Selected date is not available.");
                }
              }}
              disabled={(date) => !availableDates.includes(format(date, 'yyyy-MM-dd')) || date < new Date()} // Disable booked dates and past dates
              initialFocus
            /> */}
                  {/* <Calendar
              mode="single"
              selected={bookingData?.date}
              onSelect={(date) => {
                if (availableDates.includes(format(date, 'yyyy-MM-dd'))) {
                  updateBookingData({ date });
                } else {
                  toast.error("Selected date is not available.");
                }
              }}
              disabled={(date) => 
                !availableDates.includes(format(date, 'yyyy-MM-dd')) || 
                date < new Date() || 
                date < new Date(dateRange.start_date) || 
                date > new Date(dateRange.end_date) // Disable dates outside the range
              }
              initialFocus
            /> */}
                  <Calendar
                    mode="range"
                    selected={{
                      from: bookingData?.date || undefined,
                      to: bookingData?.endDate || undefined
                    }}
                    // onSelect={(range) => {
                    //   if (range?.from) {
                    //     const isDateRange = range.to && range.to !== range.from;
                    //     updateBookingData({
                    //       date: range.from,
                    //       endDate: range.to,
                    //       bookingType: isDateRange ? 'date_range' : 'hourly',
                    //       // Reset duration if switching to date range
                    //       duration: isDateRange ? undefined : bookingData?.duration
                    //     });
                    //   }
                    // }}
                    onSelect={handleDateSelect}
                    // disabled={(date) => 
                    //   !availableDates.includes(format(date, 'yyyy-MM-dd')) || 
                    //   date < new Date() || 
                    //   date < new Date(dateRange.start_date) || 
                    //   date > new Date(dateRange.end_date)
                    // }
                    disabled={(date) => isDateDisabled(date, availableDates, dateRange)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div> : yachtsType == "f1yachts" ? <div className="flex flex-col space-y-2">
              <Label className="text-sm font-medium">
                <span className='text-red-5'> F1 Booking Slot:</span>
              </Label>
              <span className='mt-4'> {formatDate(selectedYacht?.yacht?.from_date)} - {formatDate(selectedYacht?.yacht?.to_date)}</span>

              {/* <div className="flex flex-col space-y-2">
              <Label className="text-sm font-medium">
                Select Date<span className='text-red-500'>*</span>
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full max-w-[300px] justify-start text-left font-normal",
                      !bookingData?.date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-1 h-4 w-4" />
                    {bookingData?.date ? (
                      bookingData?.endDate ?
                        `${format(bookingData?.date, "PPP")} - ${format(bookingData?.endDate, "PPP")}` :
                        format(bookingData?.date, "PPP")
                    ) : (
                      <span>Pick date(s)</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  
                  <Calendar
                    mode="range"
                    selected={{
                      from: bookingData?.date || undefined,
                      to: bookingData?.endDate || undefined
                    }}
               
                    onSelect={handleDateSelect}
               
                    disabled={(date) =>
                      date < new Date(new Date().setHours(0, 0, 0, 0)) || // Disable past dates
                      (dateRange?.start_date && date < new Date(dateRange.start_date)) ||
                      (dateRange?.end_date && date > new Date(dateRange.end_date)) ||
                      !availableDates.includes(format(date, 'yyyy-MM-dd'))
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>  */}

            </div> : ""}

            {/* Show duration and time only for hourly bookings */}
            {(!bookingData?.endDate || bookingData?.bookingType === 'hourly') && (
              <>
                <div className="flex justify-between items-start">
                  {yachtsType == "yachts" ? <>

                    <div>
                      {newYearCondition && <>
                        <div className='my-2'>
  New Year Booking Time:
  <span className="text-lg font-semibold text-gray-600 dark:text-gray-400 flex items-center bg-[#BEA355]/20 dark:bg-[#A68D3F]/20 rounded-md p-2">
    {formatHumanReadableTime(selectedYacht?.yacht?.ny_start_time)} to {formatHumanReadableTime(selectedYacht?.yacht?.ny_end_time)}
  </span>
</div>


                      </>}
                      <div className="flex flex-col space-y-2">
                        <Label className="text-sm font-medium">
                          Start Time<span className='text-red-500'>*</span>
                        </Label>
                        <Select
                          value={format(bookingData?.startTime, "HH:mm")}
                          onValueChange={(time) => {
                            const [hours, minutes] = time.split(':');
                            const newDate = new Date(bookingData?.date);
                            newDate.setHours(parseInt(hours), parseInt(minutes));
                            updateBookingData({ startTime: newDate });
                          }}
                        >
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select time">
                              <div className="flex items-center">
                                <Clock className="mr-2 h-4 w-4" />
                                {/* {format(bookingData?.startTime, "h:mm a")} */}
                                {format(bookingData?.startTime, "HH:mm")}
                              </div>
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            {generateTimeSlots().map((time) => (
                              <SelectItem key={time} value={time}>
                                {/* {format(new Date().setHours(...time.split(':').map(Number)), "h:mm a")} */}
                                {time}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      {newYearCondition && <div className="flex flex-col space-y-2 mt-3">
                        <Label className="text-sm font-medium">
                          End Time<span className='text-red-500'>*</span>
                        </Label>
                        <Select
                          value={format(bookingData?.endTime, "HH:mm")}
                          onValueChange={(time) => {
                            const [hours, minutes] = time.split(':');
                            const newDate = new Date(bookingData?.date);
                            newDate.setHours(parseInt(hours), parseInt(minutes));
                            updateBookingData({ endTime: newDate });
                          }}
                        >
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select time">
                              <div className="flex items-center">
                                <Clock className="mr-2 h-4 w-4" />
                                {/* {format(bookingData?.startTime, "h:mm a")} */}
                                {format(bookingData?.endTime, "HH:mm")}
                              </div>
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            {generateTimeSlots().map((time) => (
                              <SelectItem key={time} value={time}>
                                {/* {format(new Date().setHours(...time.split(':').map(Number)), "h:mm a")} */}
                                {time}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>}

                    </div>
                    <div className="flex flex-col items-end space-y-2">
                      <Label className="text-sm font-medium">Duration (min 3 hrs)<span className='text-red-500'>*</span></Label>
                      <div className="flex items-center space-x-4 dark:bg-gray-700 rounded-lg p-2">
                        <Button
                          onClick={() => updateBookingData({ duration: Math.max(3, bookingData?.duration - 1) })}
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 bg-gray-100 dark:bg-gray-700"
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-8 text-center font-medium">{bookingData?.duration}</span>
                        <Button
                          onClick={() => updateBookingData({ duration: bookingData?.duration + 1 })}
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 bg-gray-100 dark:bg-gray-700"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </> : yachtsType == "f1yachts" ? "" : ""}



                </div>
              </>
            )}
          </div>
          {/* Guests Selection */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
            <div className="flex flex-col md:flex-row justify-between items-start space-y-4 md:space-y-0">
              <Label className="text-sm font-medium">Number of Guests</Label>
              <div className="flex flex-col space-y-4 items-end">
                <div className="flex items-center space-x-4 dark:bg-gray-700 rounded-lg p-2">
                  <span className="text-sm">Adults</span>
                  <Button
                    onClick={() => updateBookingData({ adults: Math.max(0, bookingData?.adults - 1) })}
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 bg-gray-100 dark:bg-gray-700"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <Input
                    type="number"
                    value={removeLeadingZeros(bookingData?.adults.toString())}
                    // onChange={(e) => updateBookingData({ adults: Math.max(0, parseInt(e.target.value) || 0) })}
                    onChange={(e) => {
                      const adults = e.target.value === "" ? "" : Math.max(0, parseInt(e.target.value) || 0);
                      const totalGuests = adults + bookingData?.kids;
                      if (totalGuests > capacity) {
                        toast({ title: 'Error', description: `Total guests cannot exceed capacity of ${capacity}.` });
                      } else {
                        updateBookingData({ adults });
                      }
                    }}
                    className="w-16 text-center border rounded"
                  />
                  <Button
                    // onClick={() => updateBookingData({ adults: bookingData?.adults + 1 })}
                    onClick={() => {
                      const newAdults = bookingData?.adults + 1;
                      const totalGuests = newAdults + bookingData?.kids;
                      if (totalGuests > capacity) {
                        toast({ title: 'Error', description: `Total guests cannot exceed capacity of ${capacity}.` });
                      } else {
                        updateBookingData({ adults: newAdults });
                      }
                    }}
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 bg-gray-100 dark:bg-gray-700"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-center space-x-4 dark:bg-gray-700 rounded-lg p-2">
                  <span className="text-sm">Kids</span>
                  <Button
                    onClick={() => updateBookingData({ kids: Math.max(0, bookingData?.kids - 1) })}
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 bg-gray-100 dark:bg-gray-700"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <Input
                    type="number"
                    value={removeLeadingZeros(bookingData?.kids.toString())}
                    // onChange={(e) => updateBookingData({ kids: Math.max(0, parseInt(e.target.value) || 0) })}
                    onChange={(e) => {
                      // let inputValue = removeLeadingZeros(e.target.value);
                      let inputValue = e.target.value;
                      // console.log("ddd")
                      const kids = inputValue === "" ? "" : Math.max(0, parseInt(inputValue) || 0);
                      const totalGuests = bookingData?.adults + kids;
                      if (totalGuests > capacity) {
                        toast({ title: 'Error', description: `Total guests cannot exceed capacity of ${capacity}.` });
                      } else {
                        updateBookingData({ kids });
                      }
                    }}
                    className="w-16 text-center border rounded"
                  />
                  <Button
                    // onClick={() => updateBookingData({ kids: bookingData?.kids + 1 })}
                    onClick={() => {
                      const newKids = bookingData?.kids + 1;
                      const totalGuests = bookingData?.adults + newKids;
                      if (totalGuests > capacity) {
                        toast({ title: 'Error', description: `Total guests cannot exceed capacity of ${capacity}.` });
                      } else {
                        updateBookingData({ kids: newKids });
                      }
                    }}
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 bg-gray-100 dark:bg-gray-700"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Optional Extras */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
            <Label className="text-sm font-medium mb-4 block">
              Optional Extras
            </Label>
            <Accordion type="multiple" className="space-y-4">

              <AccordionItem value="food">
                <AccordionTrigger className="hover:no-underline bg-[#F1F1F1] dark:bg-gray-700 p-4 mb-2 rounded-lg">
                  <div className="flex justify-between w-full items-center">
                    <span className="font-semibold">Food & Beverages</span>
                    <span className="text-black dark:text-gray-400 font-semibold">
                      AED <span className="font-medium text-lg">{calculateCategoryTotal(extras.food)}</span>
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-4 space-y-4">
                  {loadingExtras ? renderLoadingSkeleton() :
                    extras.food.map(item => renderExtraItem(item, 'food'))}
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="sport">
                <AccordionTrigger className="hover:no-underline bg-[#F1F1F1] dark:bg-gray-700 p-4 mb-2 rounded-lg">
                  <div className="flex justify-between w-full items-center">
                    <span className="font-semibold">Water Sports</span>
                    <span className="text-black dark:text-gray-400 font-semibold">
                      AED <span className="font-medium text-lg">{calculateCategoryTotal(extras.sport)}</span>
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-4 space-y-4">
                  {loadingExtras ? renderLoadingSkeleton() :
                    extras.sport.map(item => renderExtraItem(item, 'sport'))}
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="extra">
                <AccordionTrigger className="hover:no-underline bg-[#F1F1F1] dark:bg-gray-700 p-4 mb-2 rounded-lg">
                  <div className="flex justify-between w-full items-center">
                    <span className="font-semibold">Miscellaneous</span>
                    <p className="text-black dark:text-gray-400 font-semibold">
                      AED <span className="font-medium text-lg">{calculateCategoryTotal(extras.extra)}</span>
                    </p>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-4 space-y-4">
                  {loadingExtras ? renderLoadingSkeleton() :
                    extras.extra.map(item => renderExtraItem(item, 'extra'))}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>

        {/* Summary Card */}
        <div className="w-full lg:w-1/2 max-w-[400px]">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm space-y-6 sticky top-4">
            {yachtsType == "yachts" ? <div className="space-y-2">
              {selectedYacht?.yacht && <h2 className="text-lg font-semibold">
                {/* AED <span className="text-2xl font-bold">{calculateTotal()}</span> */}
                AED <span className="text-2xl font-bold">{showSelectedYachtPrice(selectedYacht, yachtsType, bookingData,newYearCondition)}/hour</span>


                {/* {bookingData?.endDate ? (
                  <span className="text-sm ml-2">
                    for {Math.ceil((new Date(bookingData?.endDate) - new Date(bookingData?.date)) / (1000 * 60 * 60 * 24) + 1)} days
                  </span>
                ) : (
                  <span className="text-sm ml-2">for {bookingData?.duration} hours</span>
                )} */}
              </h2>}

            </div>
              : yachtsType == "f1yachts" ? <div className="space-y-2">
                {selectedYacht?.yacht && <h2 className="text-lg font-semibold">
                  {/* AED <span className="text-2xl font-bold">{calculateTotal()}</span> */}
                  AED <span className="text-2xl font-bold">{showSelectedYachtPrice(selectedYacht, yachtsType, bookingData,newYearCondition)}{`/${daysCount} ${daysCount === 1 ? 'Day' : 'Days'}`}</span>


                  {/* {bookingData?.endDate ? (
     <span className="text-sm ml-2">
       for {Math.ceil((new Date(bookingData?.endDate) - new Date(bookingData?.date)) / (1000 * 60 * 60 * 24) + 1)} days
     </span>
   ) : (
     <span className="text-sm ml-2">for {bookingData?.duration} hours</span>
   )} */}
                </h2>}

              </div>
                : ""}

            <Table>
              <TableHeader className="bg-[#EBEBEB] dark:bg-gray-700">
                <TableRow>
                  <TableHead className="font-semibold text-black dark:text-gray-400 rounded-t-lg">
                    {selectedYacht?.yacht?.name || 'Yacht Details'}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="border border-gray-200 dark:border-gray-700">
                <TableRow>
                  <TableCell className="flex justify-between">
                    <span className="text-black dark:text-gray-400">
                      {bookingData?.endDate ? 'Date Range' : 'Departure'}
                    </span>
                    <span className="font-medium text-xs text-gray-600 dark:text-gray-400">
                      {bookingData?.endDate ? (
                        `${format(bookingData?.date, "MMM dd, yyyy")} - ${format(bookingData?.endDate, "MMM dd, yyyy")}`
                      ) : (
                        <>
                          {bookingData?.startTime && format(bookingData?.startTime, "p")},
                          {bookingData?.date && format(bookingData?.date, " MMM dd, yyyy")}
                        </>
                      )}
                    </span>
                  </TableCell>
                </TableRow>
                {!bookingData?.endDate && (
                  <TableRow>
                    <TableCell className="flex justify-between">
                      <span className="text-black dark:text-gray-400">Duration</span>
                      <span className="font-medium text-xs text-gray-600 dark:text-gray-400">
                        {bookingData?.duration} Hours
                      </span>
                    </TableCell>
                  </TableRow>
                )}
                <TableRow>
                  <TableCell className="flex justify-between">
                    <span className="text-black dark:text-gray-400">Guests</span>
                    <span className="font-medium text-xs text-gray-600 dark:text-gray-400">
                      {(bookingData?.adults || 0) + (bookingData?.kids || 0)}
                      <span className="text-xs ml-1">
                        (max {selectedYacht?.yacht?.capacity || 0})
                      </span>
                    </span>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="flex justify-between items-center">
                    <span className="text-black dark:text-gray-400">Location</span>
                    <span className="font-medium text-xs text-gray-600 dark:text-gray-400 flex items-center bg-[#BEA355]/20 dark:bg-[#A68D3F]/20 rounded-md p-1">
                      <MapPin className="h-4 w-4 mr-1" />
                      {selectedYacht?.yacht?.location || 'Dubai'}
                    </span>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>

            <Button
              onClick={handleNext}
              disabled={loading}
              className="w-full bg-[#BEA355] text-white hover:bg-[#A68D3F] rounded-full"
            >
              {loading ? 'Checking availability...' : 'Save and Continue'}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Selection;