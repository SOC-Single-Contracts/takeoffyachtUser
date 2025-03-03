import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
  } from "@/components/ui/carousel"
import { Calendar } from "@/components/ui/calendar";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { MapPin, Calendar as CalendarIcon, Users, Search } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import yachtApi from '@/services/api';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { API_BASE_URL } from '@/lib/api';


const SearchFilter = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const [activeMainTab, setActiveMainTab] = useState("yachts");
  const [activeSearchTab, setActiveSearchTab] = useState("where");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [guests, setGuests] = useState({
    adults: 1,
    children: 0,
    infants: 0
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // New state for dynamic locations
  const [locations, setLocations] = useState([]);
  const [isLocationsLoading, setIsLocationsLoading] = useState(true);

  // New state for cities
  const [cities, setCities] = useState([]);
  const [isCitiesLoading, setIsCitiesLoading] = useState(true);

  // Fetch locations based on active tab
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        setIsLocationsLoading(true);
        let locationResults;
        switch (activeMainTab) {
          case 'yachts':
            locationResults = await yachtApi.checkYachts({ user_id: session?.user?.userid || 1 });
            // For yachts, extract location and yacht_image from the nested yacht object
            if (locationResults?.data) {
              const transformedLocations = locationResults.data
                .filter(item => item.yacht.location && item.yacht.yacht_image) // Filter out empty locations
                .map(item => ({
                  id: item.yacht.id,
                  name: item.yacht.location, // Use location from yacht object
                  image: `${API_BASE_URL}${item.yacht.yacht_image}` || "/assets/images/dubai.png" // Use yacht_image
                }));
              setLocations(transformedLocations);
            }
            break;
          
          case 'experiences':
            locationResults = await yachtApi.checkExperiences({ user_id: session?.user?.userid || 1 });
            // For experiences, extract location and experience_image from the nested structure
            if (locationResults?.data) {
              const transformedLocations = locationResults.data.map(item => ({
                id: item.experience.id,
                name: item.experience.location, // Use location from experience object
                image: `${API_BASE_URL}${item.experience.experience_image}` || "/assets/images/dubai.png" // Use experience_image
              }));
              setLocations(transformedLocations);
            }
            break;
          
          case 'events':
            locationResults = await yachtApi.checkEvents({ user_id: session?.user?.userid || 1 });
            // For events, extract location and event_image from the nested event object
            if (locationResults?.data) {
              const transformedLocations = locationResults.data.map(item => ({
                id: item.event.id,
                name: item.event.location, // Use location from event object
                image: `${API_BASE_URL}${item.event.event_image}` || "/assets/images/dubai.png" // Use event_image
              }));
              setLocations(transformedLocations);
            }
            break;
        }
      } catch (error) {
        console.error('Error fetching locations:', error);
        toast.error('Failed to fetch locations');
        setLocations([]);
      } finally {
        setIsLocationsLoading(false);
      }
    };

    fetchLocations();
  }, [activeMainTab, session]);

  // Fetch cities from City API
  useEffect(() => {
    const fetchCities = async () => {
      try {
        setIsCitiesLoading(true);
        const response = await fetch(`${API_BASE_URL}/yacht/city/`);
        const data = await response.json();

        if (data.error_code === 'pass') {
          setCities(data.data);
        } else {
          console.error('Failed to fetch cities:', data.error);
        }
      } catch (error) {
        console.error('Error fetching cities:', error);
        toast.error('Failed to fetch cities');
      } finally {
        setIsCitiesLoading(false);
      }
    };

    fetchCities();
  }, []);

  const handleGuestChange = (type, action) => {
    setGuests(prev => ({
      ...prev,
      [type]: action === 'increase' 
        ? prev[type] + 1 
        : Math.max(0, prev[type] - 1)
    }));
  };

  const handleSearch = async () => {
    setLoading(true);
    try {
      const totalGuests = guests.adults + guests.children + guests.infants;
      const formattedDate = format(new Date(), 'yyyy-MM-dd');
      
      const baseParams = {
        user_id: session?.user?.userid || 1,
        created_on: formattedDate,
      };

      let searchResults;
      let searchPath;
      
      switch (activeMainTab) {
        case 'yachts':
          const yachtParams = {
            ...baseParams,
            guest: totalGuests,
            location: selectedCity,
            min_price: 1000,
            max_price: 4000,
            capacity: totalGuests,
            price_des: true,
            price_asc: false,
            cabin_des: false,
            cabin_asc: true,
          };
          searchResults = await yachtApi.checkYachts(yachtParams);
          searchPath = '/dashboard/yachts/search';
          break;

        case 'experiences':
          const experienceParams = {
            ...baseParams,
          };
          searchResults = await yachtApi.checkExperiences(experienceParams);
          searchPath = '/dashboard/experience/search';
          break;

        case 'events':
          const eventParams = {
            user_id: session?.user?.userid || 1
          };
          searchResults = await yachtApi.checkEvents(eventParams);
          searchPath = '/dashboard/events/search';
          break;
      }

      if (searchResults?.error_code === 'pass') {
        router.push(`${searchPath}?${new URLSearchParams({
          location: selectedCity,
          date: selectedDate.toISOString(),
          guests: totalGuests
        }).toString()}`);
        setIsDialogOpen(false);
      } else {
        toast.error('No results found. Please try different search criteria.');
      }
    } catch (error) {
      console.error('Search error:', error);
      toast.error('Failed to perform search. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetSearch = () => {
    setActiveSearchTab("where");
    setSelectedCity("");
    setSelectedDate(null);
    setGuests({ adults: 1, children: 0, infants: 0 });
  };

  return (
    <section>
      <Dialog open={isDialogOpen} onOpenChange={(open) => {
        setIsDialogOpen(open);
        if (!open) resetSearch();
      }}>
        <DialogTrigger asChild>
          <div className="flex items-center justify-between bg-white dark:bg-gray-700 lg:w-[400px] rounded-full shadow-lg cursor-pointer">
            <div className="flex items-center">
            <div className="flex items-center px-2 md:px-4 lg:px-6 py-1.5 md:py-3 border-r text-sm">
                <MapPin className="mr-2 h-3 w-3 text-gray-500 dark:text-gray-300" />
                <span className="truncate max-w-[80px] text-xs dark:text-gray-300">{selectedCity || "Where?"}</span>
            </div>
            <div className="flex items-center px-2 md:px-4 lg:px-6 py-1.5 md:py-3 border-r text-sm">
              <CalendarIcon className="mr-2 h-3 w-3 text-gray-500 dark:text-gray-300" />
              <span className="dark:text-gray-300 text-xs">{selectedDate ? selectedDate.toLocaleDateString() : "When?"}</span>
            </div>
            <div className="flex items-center px-2 md:px-4 py-1.5 md:py-3 text-sm">
              <Users className="mr-2 h-3 w-3 text-gray-500 dark:text-gray-300" />
              <span className="dark:text-gray-300 text-xs">
                {guests.adults + guests.children + guests.infants} Guests
              </span>
            </div>
            </div>
            <Button 
              variant="default" 
              size="icon" 
              className="rounded-full h-12 w-12 ml-2 bg-[#BEA355]"
            >
              <Search className="h-8 w-8 dark:invert" />
            </Button>
          </div>
        </DialogTrigger>
        <DialogContent className="max-w-8xl p-0 overflow-hidden mt-[-16.5rem] h-[700px] rounded-b-2xl border-none shadow-none outline-none">
          <DialogHeader>
            <VisuallyHidden>
              <DialogTitle>Yacht Search Filter</DialogTitle>
            </VisuallyHidden>
          </DialogHeader>
          <div className="w-full">
            <div className="transition-all duration-300 ease-in-out">
              <Tabs 
                value={activeMainTab} 
                onValueChange={setActiveMainTab} 
                className="w-full mt-40 md:mt-40"
              >
                <div className="bg-white dark:bg-gray-800 py-2 md:py-4 transition-all duration-300 ease-in-out">
                  <TabsList className="grid max-w-xs mx-auto grid-cols-3 rounded-full border-b bg-[#BEA355] border-none h-auto md:h-[50px] p-1">
                  <TabsTrigger 
                    value="yachts" 
                    className="py-2.5 text-xs md:text-sm text-white rounded-full data-[state=active]:shadow-lg data-[state=active]:bg-white data-[state=active]:text-[#BEA355]"
                  >
                    Yachts
                  </TabsTrigger>
                  <TabsTrigger 
                    value="experiences" 
                    className="py-2.5 text-xs md:text-sm text-white rounded-full data-[state=active]:shadow-lg data-[state=active]:bg-white data-[state=active]:text-[#BEA355]"
                  >
                    Experiences
                  </TabsTrigger>
                  <TabsTrigger 
                    value="events" 
                    className="py-2.5 text-xs md:text-sm text-white rounded-full data-[state=active]:shadow-lg data-[state=active]:bg-white data-[state=active]:text-[#BEA355]"
                  >
                    Events
                  </TabsTrigger>
                </TabsList>
                </div>

                {/* Search Tabs */}
                <Tabs 
                  value={activeSearchTab} 
                  onValueChange={setActiveSearchTab} 
                  className="w-auto md:max-w-2xl mx-auto mt-4 bg-transparent"
                >
                  <TabsList className="relative grid grid-cols-4 w-auto md:max-w-2xl mx-auto rounded-none border-b bg-[#F5F5F5] h-auto md:h-[75px] rounded-full">
                    <TabsTrigger 
                      value="where" 
                      className="py-2 md:py-5 text-xs md:text-sm rounded-full bg-transparent hover:bg-transparent text-[#BEA355] dark:text-[#BEA355] data-[state=active]:bg-white data-[state=active]:shadow-2xl"
                    >
                      Where
                    </TabsTrigger>
                    <TabsTrigger 
                      value="when" 
                      disabled={!selectedCity}
                      className="py-2 md:py-5 text-xs md:text-sm rounded-full bg-transparent hover:bg-transparent text-[#BEA355] dark:text-[#BEA355] data-[state=active]:bg-white data-[state=active]:shadow-2xl"
                    >
                      When
                    </TabsTrigger>
                    <TabsTrigger 
                      value="who" 
                      disabled={!selectedDate}
                      className="py-2 md:py-5 w-auto md:w-[250px] text-xs md:text-sm rounded-full bg-transparent hover:bg-transparent text-[#BEA355] dark:text-[#BEA355] data-[state=active]:bg-white data-[state=active]:shadow-2xl"
                    >
                      Who
                    </TabsTrigger>
                    <TabsTrigger 
                      value="search" 
                      onClick={handleSearch}
                      disabled={!selectedCity || !selectedDate || loading}
                      className="py-2 md:py-5 w-auto md:w-[150px] absolute right-2 text-sm rounded-full bg-[#BEA355] text-white hover:bg-[#a98a47] data-[state=disabled]:opacity-50"
                    >
                      {loading ? (
                        <div className="flex items-center text-xs md:text-sm">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                          Searching...
                        </div>
                      ) : (
                        <>
                          <Search className="mr-2 h-5 w-5" /> Search
                        </>
                      )}
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="where" className="p-6 max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-2xl">
                  <h3 className="text-md md:text-xl font-semibold mb-4">Add Destination</h3>
                  {isCitiesLoading ? (
                    <div className="flex justify-center items-center h-64">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#BEA355]"></div>
                    </div>
                  ) : cities.length > 0 ? (
                    <Carousel className="w-full">
                      <CarouselContent>
                        {cities.map((city) => (
                          <CarouselItem key={city.id} className="basis-1/2 md:basis-1/4 p-2 ml-4">
                            <div 
                              className="group cursor-pointer"
                              onClick={() => {
                                setSelectedCity(city.name);
                                setActiveSearchTab("when");
                              }}
                            >
                              <div className="relative overflow-hidden rounded-2xl">
                                <Image
                                  src={`${API_BASE_URL}${city.image}`}
                                  alt=""
                                  width={100}
                                  height={200}
                                  quality={100}
                                  className="w-full h-44 object-cover transition-transform duration-300 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-background duration-300"></div>
                              </div>
                              <div className="mt-2 text-center">
                                <h4 className="text-xs font-semibold text-gray-800 group-hover:text-[#BEA355] dark:text-gray-100 transition-colors">
                                  {city.name}
                                </h4>
                              </div>
                            </div>
                          </CarouselItem>
                        ))}
                      </CarouselContent>
                      <CarouselPrevious className="left-2" />
                      <CarouselNext className="right-2" />
                    </Carousel>
                  ) : (
                    <div className="flex justify-center items-center h-64 text-gray-500">
                      No cities available
                    </div>
                  )}
                  </TabsContent>
                  {/* When Tab Content */}
                  <TabsContent value="when" className="flex justify-center">
                      <div className="bg-white dark:bg-gray-800 rounded-2xl">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={(date) => {
                        setSelectedDate(date);
                        setActiveSearchTab("who");
                      }}
                      disabled={(date) => date < new Date().setHours(0, 0, 0, 0)}
                      className="rounded-md"
                    />
                    </div>
                  </TabsContent>

                  {/* Who Tab Content */}
                  <TabsContent value="who" className="p-6 space-y-3 max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-2xl">
                    <h3 className="text-xl font-semibold">Who&apos;s coming?</h3>
                    {Object.keys(guests).map(type => (
                      <div 
                        key={type} 
                        className="flex items-center justify-between"
                      >
                        <span className="text-base capitalize">{type}</span>
                        <div className="flex items-center space-x-4">
                          <Button 
                            variant="outline" 
                            size="icon"
                            onClick={() => handleGuestChange(type, 'decrease')}
                            className="rounded-full"
                          >
                            -
                          </Button>
                          <span className="text-lg font-medium">{guests[type]}</span>
                          <Button 
                            variant="outline" 
                            size="icon"
                            onClick={() => handleGuestChange(type, 'increase')}
                            className="rounded-full"
                          >
                            +
                          </Button>
                        </div>
                      </div>
                    ))}
                    
                  </TabsContent>
                </Tabs>
            </Tabs>
              </div>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default SearchFilter;