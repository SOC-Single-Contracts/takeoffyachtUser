"use client";
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { CalendarIcon, Clock, Minus, Plus, MapPin, Users } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Label } from '@/components/ui/label';
import { useBookingContext } from './BookingContext';
import { toast } from 'sonner';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Skeleton } from '@/components/ui/skeleton';
import Image from 'next/image';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Fancybox } from '@fancyapps/ui';
import "@fancyapps/ui/dist/fancybox/fancybox.css";
import { Input } from '@/components/ui/input';

const Selection = ({ onNext }) => {
  const { selectedExperience, bookingDetails, updateBookingDetails } = useBookingContext();
  const [loading, setLoading] = useState(false);
  const [extras, setExtras] = useState({
    food: [],
    extra: [],
    sport: []
  });
  const [quantities, setQuantities] = useState({});
  const [loadingExtras, setLoadingExtras] = useState(true);

  useEffect(() => {
    const fetchExtras = async () => {
      try {
        // Use the experience details already fetched in BookingWizard
        if (selectedExperience?.food) {
          setExtras({
            food: selectedExperience.food || [],
            extra: selectedExperience.extra || [],
            sport: selectedExperience.sport || []
          });
        } else {
          // Fallback to fetch if no details available
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://api.takeoffyachts.com'}/yacht/get_experience/${selectedExperience?.experience?.id}`);
          const data = await response.json();
          
          if (data.error_code === 'pass' && data.data?.length > 0) {
            const experienceData = data.data.find(item => item.experience.id === selectedExperience?.experience?.id);
            if (experienceData) {
              setExtras({
                food: experienceData.food || [],
                extra: experienceData.extra || [],
                sport: experienceData.sport || []
              });
            }
          } else {
            toast.error('Failed to fetch experience details.');
          }
        }
      } catch (error) {
        console.error('Error fetching experience details:', error);
        toast.error('Error fetching experience details.');
      } finally {
        setLoadingExtras(false);
      }
    };

    if (selectedExperience?.experience?.id) {
      fetchExtras();
    }

    if (!bookingDetails.startTime) {
      const defaultTime = new Date();
      defaultTime.setHours(9, 0, 0, 0);
      updateBookingDetails({ startTime: defaultTime });
    }
  }, [selectedExperience?.experience?.id]);

  const handleQuantityChange = (itemId, type) => {
    setQuantities(prev => {
      const currentQty = prev[itemId] || 0;
      const newQty = type === 'increment' ? currentQty + 1 : Math.max(0, currentQty - 1);
      return { ...prev, [itemId]: newQty };
    });
  };

  const calculateCategoryTotal = (items) => {
    return items.reduce((total, item) => {
      return total + (item.price * (quantities[item.id] || 0));
    }, 0);
  };

  const calculateTotal = () => {
    if (!selectedExperience?.experience) return 0;
    
    const basePrice = selectedExperience.experience.min_price || 0;
    const totalExtras = Object.values(extras).reduce((total, category) => {
      return total + calculateCategoryTotal(category);
    }, 0);

    return (basePrice * (bookingDetails.seats || 1)) + totalExtras;
  };

  const handleNext = async () => {
    setLoading(true);
    try {
      if (!bookingDetails.date || !bookingDetails.startTime) {
        toast.error('Please select date and time');
        return;
      }

      if (!bookingDetails.seats || bookingDetails.seats === 0) {
        toast.error('Please add at least one guest');
        return;
      }

      // Update booking details with quantities and pricing info
      updateBookingDetails({
        extras: Object.entries(quantities).reduce((acc, [id, qty]) => {
          if (qty > 0) {
            const item = [...extras.food, ...extras.extra, ...extras.sport].find(i => i.id.toString() === id);
            if (item) {
              acc.push({ id, quantity: qty, price: item.price, name: item.name });
            }
          }
          return acc;
        }, []),
        total_cost: calculateTotal()
      });

      onNext();
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to proceed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 9; hour <= 21; hour++) {
      slots.push(format(new Date().setHours(hour, 0, 0, 0), 'HH:mm'));
    }
    return slots;
  };

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
              className="object-cover"
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

  if (!selectedExperience || !selectedExperience.experience) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#BEA355]"></div>
      </div>
    );
  }

  return (
    <>
    <div className="w-full mb-6">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
        {/* Experience Images */}
        <div className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {selectedExperience?.experience?.experience_image && (
              <div className="relative h-48 rounded-lg overflow-hidden cursor-pointer"
                onClick={() => {
                  Fancybox.show([
                    {
                      src: `${process.env.NEXT_PUBLIC_API_URL || 'https://api.takeoffyachts.com'}${selectedExperience.experience.experience_image}`,
                      type: "image",
                    }
                  ]);
                }}
              >
                <Image
                  src={`${process.env.NEXT_PUBLIC_API_URL || 'https://api.takeoffyachts.com'}${selectedExperience.experience.experience_image}`}
                  alt={selectedExperience.experience.name}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
            )}
            {[...Array(20)].map((_, index) => {
              const imageKey = `image${index + 1}`;
              if (selectedExperience?.experience?.[imageKey]) {
                return (
                  <div 
                    key={imageKey}
                    className="relative h-48 rounded-lg overflow-hidden cursor-pointer"
                    onClick={() => {
                      Fancybox.show([
                        {
                          src: `${process.env.NEXT_PUBLIC_API_URL || 'https://api.takeoffyachts.com'}${selectedExperience.experience[imageKey]}`,
                          type: "image",
                        }
                      ]);
                    }}
                  >
                    <Image
                      src={`${process.env.NEXT_PUBLIC_API_URL || 'https://api.takeoffyachts.com'}${selectedExperience.experience[imageKey]}`}
                      alt={`${selectedExperience.experience.name} - ${index + 1}`}
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

        {/* Experience Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-2xl font-semibold mb-2">{selectedExperience?.experience?.name}</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">{selectedExperience?.experience?.description}</p>
            
            <div className="space-y-4">
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Type</TableCell>
                    <TableCell>{selectedExperience?.experience?.type}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Location</TableCell>
                    <TableCell>{selectedExperience?.experience?.location}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Duration</TableCell>
                    <TableCell>{selectedExperience?.experience?.duration_hour}h {selectedExperience?.experience?.duration_minutes}m</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Available Seats</TableCell>
                    <TableCell>{selectedExperience?.experience?.left_seats || 0} / {selectedExperience?.experience?.total_seats || 0}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Adult Price</TableCell>
                    <TableCell>AED {selectedExperience?.experience?.adult_price}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Child Price</TableCell>
                    <TableCell>AED {selectedExperience?.experience?.child_price}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </div>

          <div className="space-y-6">
            {/* Categories */}
            <div>
              <h3 className="font-semibold mb-3">Categories</h3>
              <div className="flex flex-wrap gap-2">
                {selectedExperience?.categories?.map((category) => (
                  <span 
                    key={category.id} 
                    className="bg-[#BEA355]/10 text-[#BEA355] px-3 py-1 rounded-full text-sm"
                  >
                    {category.name}
                  </span>
                ))}
              </div>
            </div>

            {/* Features */}
            <div>
              <h3 className="font-semibold mb-3">Features</h3>
              <div className="flex flex-wrap gap-2">
                {selectedExperience?.subcategories?.map((sub) => (
                  <span 
                    key={sub.id} 
                    className="bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full text-sm"
                  >
                    {sub.name}
                  </span>
                ))}
              </div>
            </div>

            {/* Inclusions */}
            <div>
              <h3 className="font-semibold mb-3">Included in Experience</h3>
              <div className="grid grid-cols-2 gap-2">
                {selectedExperience?.inclusion?.map((item) => (
                  <div key={item.id} className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-[#BEA355] rounded-full"></div>
                    <span className="text-sm capitalize">{item.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div className="flex flex-col lg:flex-row justify-center lg:justify-between gap-6">
      <div className="flex flex-col w-full lg:w-2/3 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm space-y-6">
          <div className="flex flex-col space-y-4">
            <h2 className="text-xl font-semibold">Select Date & Time</h2>
            <div className="flex flex-col sm:flex-row gap-4">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full sm:w-[240px] justify-start text-left font-normal",
                      !bookingDetails.date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {bookingDetails.date ? format(bookingDetails.date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="start" className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={bookingDetails.date}
                    onSelect={(date) => updateBookingDetails({ date })}
                    disabled={(date) => date < new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>

              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full sm:w-[240px] justify-start text-left font-normal",
                      !bookingDetails.startTime && "text-muted-foreground"
                    )}
                  >
                    <Clock className="mr-2 h-4 w-4" />
                    {bookingDetails.startTime ? format(bookingDetails.startTime, "HH:mm") : <span>Pick a time</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="start" className="w-[200px] p-0">
                  <div className="flex flex-col">
                    {generateTimeSlots().map((time) => (
                      <Button
                        key={time}
                        variant="ghost"
                        className="justify-start"
                        onClick={() => {
                          const [hours, minutes] = time.split(':').map(Number);
                          const newTime = new Date();
                          newTime.setHours(hours, minutes, 0, 0);
                          updateBookingDetails({ startTime: newTime });
                        }}
                      >
                        {time}
                      </Button>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="flex flex-col space-y-4">
            <h2 className="text-xl font-semibold">Number of Guests</h2>
            <div className="flex items-center space-x-4">
              <Button
                onClick={() => updateBookingDetails({ seats: Math.max(1, bookingDetails.seats - 1) })}
                variant="outline"
                size="icon"
                className="h-8 w-8"
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-8 text-center">{bookingDetails.seats || 1}</span>
              <Button
                onClick={() => updateBookingDetails({ seats: Math.min(20, bookingDetails.seats + 1) })}
                variant="outline"
                size="icon"
                className="h-8 w-8"
              >
                <Plus className="h-4 w-4" />
              </Button>
              <span className="text-sm text-gray-500">
                (Max 20 guests)
              </span>
            </div>
          </div>

          {/* Remove User Details section since it's now a separate step */}
          {/* <div className="flex flex-col space-y-4">
            <h2 className="text-xl font-semibold">User Details</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  placeholder="Enter your full name"
                  value={bookingDetails.fullName || ''}
                  onChange={(e) => updateBookingDetails({ fullName: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={bookingDetails.email || ''}
                  onChange={(e) => updateBookingDetails({ email: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  placeholder="Enter your country"
                  value={bookingDetails.country || ''}
                  onChange={(e) => updateBookingDetails({ country: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="Enter your phone number"
                  value={bookingDetails.phone || ''}
                  onChange={(e) => updateBookingDetails({ phone: e.target.value })}
                  required
                />
              </div>
            </div>
          </div> */}
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
          <Label className="text-sm font-medium mb-4 block">
            Optional Extras
          </Label>
          {loadingExtras ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-20 w-full" />
              ))}
            </div>
          ) : (
            <Accordion type="multiple" className="space-y-4">
              {extras.food.length > 0 && (
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
                    {extras.food.map((item) => renderExtraItem(item, 'food'))}
                  </AccordionContent>
                </AccordionItem>
              )}

              {extras.sport.length > 0 && (
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
                    {extras.sport.map((item) => renderExtraItem(item, 'sport'))}
                  </AccordionContent>
                </AccordionItem>
              )}

              {extras.extra.length > 0 && (
                <AccordionItem value="extra">
                  <AccordionTrigger className="hover:no-underline bg-[#F1F1F1] dark:bg-gray-700 p-4 mb-2 rounded-lg">
                    <div className="flex justify-between w-full items-center">
                      <span className="font-semibold">Miscellaneous</span>
                      <span className="text-black dark:text-gray-400 font-semibold">
                        AED <span className="font-medium text-lg">{calculateCategoryTotal(extras.extra)}</span>
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pt-4 space-y-4">
                    {extras.extra.map((item) => renderExtraItem(item, 'extra'))}
                  </AccordionContent>
                </AccordionItem>
              )}
            </Accordion>
          )}
        </div>
      </div>

      <div className="w-full lg:w-1/3">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm sticky top-6">
          <h2 className="text-xl font-semibold mb-6">Booking Summary</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span>Experience Price</span>
              <span>AED {(selectedExperience?.experience?.min_price || 0) * (bookingDetails.seats || 1)}</span>
            </div>
            {Object.entries(extras).map(([category, items]) => {
              const categoryTotal = calculateCategoryTotal(items);
              if (categoryTotal > 0) {
                return (
                  <div key={category} className="flex justify-between items-center">
                    <span className="capitalize">{category} Total</span>
                    <span>AED {categoryTotal}</span>
                  </div>
                );
              }
              return null;
            })}
            <div className="border-t pt-4">
              <div className="flex justify-between items-center font-semibold">
                <span>Total Amount</span>
                <span>AED {calculateTotal()}</span>
              </div>
            </div>
          </div>
          <Button
            className="w-full mt-6 bg-[#BEA355] hover:bg-[#A68A3E] rounded-full"
            onClick={handleNext}
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Processing...
              </div>
            ) : (
              'Continue to Review'
            )}
          </Button>
        </div>
      </div>
    </div>
    </>
  );
};

export default Selection;
