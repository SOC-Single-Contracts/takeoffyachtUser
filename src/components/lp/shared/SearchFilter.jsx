import React, { useState, useEffect, useRef, useContext } from 'react';
import { Button } from "@/components/ui/button";
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
import { MapPin, Calendar as CalendarIcon, Users, Search, X } from 'lucide-react';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import yachtApi from '@/services/api';
import { format } from 'date-fns';
import { API_BASE_URL } from '@/lib/api';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from "@/hooks/use-toast";
import { GlobalStateContext, useGlobalState } from '@/context/GlobalStateContext';
import { removeLeadingZeros } from '@/helper/calculateDays';


const SearchFilter = () => {
  const { state, setFilter } = useGlobalState();
  const router = useRouter();
  const { toast } = useToast();
  const { data: session } = useSession();
  const [activeMainTab, setActiveMainTab] = useState("yachts");
  const [activeSearchTab, setActiveSearchTab] = useState("where");
  const [selectedCity, setSelectedCity] = useState("");
  const [searchByName, setsearchByName] = useState("")
  const [selectedDateRange, setSelectedDateRange] = useState({
    from: null,
    to: null
  });
  const { globalState: appState, dispatch: appDispatch } = useContext(GlobalStateContext)
  // console.log("appState", appState)
  const { yachtsType, eventsType, experienceType } = useParams();

  const [minimumGuests, setMinimumGuests] = useState({
    // adults: 1,
    // children: 0,
    // infants: 0,
    capacity: 1,
  });
  const [maxGuest, setMaxGuest] = useState(0)
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // New state for dynamic locations
  const [locations, setLocations] = useState([]);
  const [isLocationsLoading, setIsLocationsLoading] = useState(true);

  // New state for cities
  const [cities, setCities] = useState([]);
  const [isCitiesLoading, setIsCitiesLoading] = useState(true);
  const [initialRender, setInitialRender] = useState(true)

  // Fetch locations based on active tab
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        setIsLocationsLoading(true);
        let locationResults;
        switch (activeMainTab) {
          case 'yachts':
            locationResults = await yachtApi.checkYachts({ user_id: session?.user?.userid || 1, yachtType: yachtsType == "f1yachts" ? "f1yachts" : "regularr" });
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

    // fetchLocations();

  }, [activeMainTab]);

  // Fetch cities from City API
  useEffect(() => {
    const fetchCities = async () => {
      try {
        setIsCitiesLoading(true);
        const response = await fetch(`${API_BASE_URL}/yacht/city/`);
        const data = await response.json();

        if (data.error_code === 'pass') {
          setCities(data.data);
          appDispatch({ type: "setCitites", cities: data?.data });


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
  //test
  //   useEffect(()=>{
  // console.log("guests",guests)
  //   },[guests])

  const handleGuestChange = (type, action) => {
    setMaxGuest("");

    setMinimumGuests(prev => {
      const currentValue = prev[type] === "" ? 0 : prev[type]; // if "" treat as 0

      return {
        ...prev,
        [type]: action === 'increase'
          ? currentValue + 1
          : Math.max(0, currentValue - 1)
      };
    });
  };


  const handleSearch = async () => {
    setLoading(true);
    try {
      const totalGuests = minimumGuests?.capacity;
      const formattedStartDate = selectedDateRange?.from ? format(selectedDateRange?.from, 'yyyy-MM-dd') : null;
      const formattedEndDate = selectedDateRange?.to ? format(selectedDateRange?.to, 'yyyy-MM-dd') : null;

      // Check if at least one criterion is provided
      if (!selectedCity && !formattedStartDate && (totalGuests === 0 || totalGuests == "")) {
        toast({
          title: "Error",
          description: "Please select at least one search criterion.",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      const baseParams = {
        user_id: session?.user?.userid || 1,
        starting_date: formattedStartDate,
        ending_date: formattedEndDate,
        YachtType: yachtsType == "f1yachts" ? "f1yachts" : "regular",

      };

      let searchResults;
      let searchPath;

      // {console.log("activeMainTab",activeMainTab)}
      switch (activeMainTab) {
        case 'yachts':
          const yachtParams = {
            ...baseParams,
            YachtType: "regular",
            guest: totalGuests > 0 ? totalGuests : undefined,
            location: selectedCity || undefined,
            // min_price: 1000,
            // max_price: 4000,
            capacity: totalGuests > 0 ? totalGuests : undefined,
            price_des: true,
            price_asc: false,
            cabin_des: false,
            cabin_asc: true,
            name: searchByName,
            YachtType: yachtsType == "f1yachts" ? "f1yachts" : "regular",


          };
          searchResults = await yachtApi.checkYachts(yachtParams);
          searchPath = `/dashboard/${yachtsType == "f1yachts" ? "f1yachts" : "yachts"}/search`;
          break;

        case 'experiences':
          const experienceParams = {
            ...baseParams,
            name: searchByName,
            YachtType: yachtsType == "f1yachts" ? "f1yachts" : "regular",


          };
          searchResults = await yachtApi.checkExperiences(experienceParams);
          searchPath = `/dashboard/experience/${experienceType == "f1-exp" ? "f1-exp" : "regular-exp"}/search`;

          break;

        case 'events':
          const eventParams = {
            user_id: session?.user?.userid || 1,
            name: searchByName,
            YachtType: yachtsType == "f1yachts" ? "f1yachts" : "regular",

          };
          // searchResults = await yachtApi.checkEvents(eventParams);
          searchPath = `/dashboard/event/${eventsType == "f1-events" ? "f1-events" : "all"}/search`;

          break;
      }
      setFilter({ max_guest: totalGuests, location: selectedCity })
      if (activeMainTab == "experiences") {
        if (searchResults?.success == true) {
          // router.push(`${searchPath}?${new URLSearchParams({
          //   location: selectedCity || '',
          //   date: formattedStartDate || '',
          //   guests: totalGuests > 1 ? totalGuests : '',
          //   name: searchByName || "",
          //   min_guest: maxGuest > 0 ? parseInt(maxGuest) : 1
          //   // ...(maxGuest ? { min_guest: parseInt(maxGuest) } :1 )
          // }).toString()}`);
          // if (typeof window !== "undefined") {
          //   window.location.reload();
          // }
          const queryParams = new URLSearchParams({
            location: selectedCity || "",
            min_guest: totalGuests > 0 ? totalGuests : "",
            name: searchByName || "",
            max_guest: maxGuest > 0 ? parseInt(maxGuest) : "",
            start_date: formattedStartDate || "",
            end_date: formattedEndDate || ""

          }).toString();

          const newPath = `${searchPath}?${queryParams}`;

          // Navigate and reload
          if (typeof window !== "undefined") {
            window.location.assign(newPath);
          }


          setIsDialogOpen(false);
        } else {
          // toast.error('No results found. Please try different search criteria.');
        }
      } else if (activeMainTab == "yachts") {
        if (searchResults?.error_code === 'pass') {
          // router.push(`${searchPath}?${new URLSearchParams({
          //   location: selectedCity || '',
          //   date: formattedStartDate || '',
          //   guests: totalGuests > 1 ? totalGuests : '',
          //   name: searchByName || "",
          //   min_guest: maxGuest > 0 ? parseInt(maxGuest) : 1
          //   // ...(maxGuest ? { min_guest: parseInt(maxGuest) } :1 )
          // }).toString()}`);
          // if (typeof window !== "undefined") {
          //   window.location.reload();
          // }
          const queryParams = new URLSearchParams({
            location: selectedCity || "",
            min_guest: totalGuests > 0 ? totalGuests : "",
            name: searchByName || "",
            max_guest: maxGuest > 0 ? parseInt(maxGuest) : "",
            start_date: formattedStartDate || "",
            end_date: formattedEndDate || ""

          }).toString();

          const newPath = `${searchPath}?${queryParams}`;

          // Navigate and reload
          if (typeof window !== "undefined") {
            window.location.assign(newPath);
          }


          setIsDialogOpen(false);
        } else {
          // toast.error('No results found. Please try different search criteria.');
        }
      } else if (activeMainTab == "events") {
        const queryParams = new URLSearchParams({
          location: selectedCity || "",
          min_guest: totalGuests > 0 ? totalGuests : "",
          name: searchByName || "",
          max_guest: maxGuest > 0 ? parseInt(maxGuest) : "",
          start_date: formattedStartDate || "",
          end_date: formattedEndDate || ""

        }).toString();

        const newPath = `${searchPath}?${queryParams}`;

        // Navigate and reload
        if (typeof window !== "undefined") {
          window.location.assign(newPath);
        }


        setIsDialogOpen(false);
      }

    } catch (error) {
      console.error('Search error:', error);
      toast.error('Failed to perform search. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGuestSelection = (range) => {
    // let adults = 0;
    // let children = 0;
    let capacity = 0;
    let min_guest = 0

    if (range === "1 - 10") {
      min_guest = 1
      capacity = 10;
    } else if (range === "10 - 30") {
      min_guest = 10
      capacity = 30;
    } else if (range === "30 - 50") {
      min_guest = 30
      capacity = 50;
    } else if (range === "50+") {
      min_guest = 50;
    }

    setMaxGuest(capacity)
    setMinimumGuests({ capacity: min_guest });
  };

  const resetSearch = () => {
    setActiveSearchTab("where");
    setSelectedCity("");
    setSelectedDateRange({ from: null, to: null });
    setMinimumGuests({ capacity: 1 });
    setsearchByName("")
    setInitialRender(true)

    // console.log("hdhhddhhd")
  };

  // useEffect(() => {
  //   console.log('State changes:', {
  //     searchByName,
  //     activeSearchTab,
  //     selectedCity,
  //     selectedDateRange,
  //     guests
  //   });
  // }, [searchByName, activeSearchTab, selectedCity, selectedDateRange, guests]);
  const handleTabChange = (value) => {
    setActiveMainTab(value);
  };

  const sheetRef = useRef(null); // Reference to the Sheet component

  const handleCloseSheet = () => {
    setIsDialogOpen(false); // Close the dialog when clicking on the specific div
    // setInitialRender(true)
    // resetSearch()
  };
  // useEffect(()=>{
  // console.log("globalStateFilter",state)
  // },[state])

  //test
  // useEffect(() => {
  //   console.log("minimumGuests",minimumGuests)
  //   console.log("maxGuest",maxGuest)
  //   console.log("initialRender",initialRender)
  // return()=>{
  //   setInitialRender(true)
  // }
  // }, [minimumGuests, maxGuest, initialRender])

  // useEffect(() => {
  //   console.log("selectedDateRange", selectedDateRange)
  // }, [selectedDateRange])

  return (
    <section className="">
      <Sheet open={isDialogOpen}
        onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) resetSearch();
        }}
      // ref={sheetRef} // Assign the ref here
      >
        <SheetTrigger asChild>
          <div className="flex items-center justify-between bg-white dark:bg-gray-700 lg:w-[425px] rounded-full shadow-lg cursor-pointer">
            <div className="flex items-center">
              <div className="flex items-center px-2 md:px-4 lg:px-6 py-1.5 md:py-3 border-r text-sm">
                <MapPin className="mr-2 h-3 w-3 text-gray-500 dark:text-gray-300" />
                <span className="truncate max-w-[80px] text-xs dark:text-gray-300">{state?.filters?.location || "Where?"}</span>
              </div>
              <div className="flex items-center px-2 md:px-4 lg:px-6 py-1.5 md:py-3 border-r text-sm">
                <CalendarIcon className="mr-2 h-3 w-3 text-gray-500 dark:text-gray-300" />
                <span className="dark:text-gray-300 text-center text-xs">

                  {state?.filters?.start_date || state?.filters?.end_date ? (
                    <>
                      {state?.filters?.start_date && format(state?.filters?.start_date, 'MMM dd')}
                      {state?.filters?.end_date && ` - ${format(state?.filters?.end_date, 'MMM dd')}`}
                    </>
                  ) : (
                    "When?"
                  )}
                </span>
              </div>
              <div className="flex items-center px-2 md:px-4 py-1.5 md:py-3 text-sm">
                <Users className="mr-2 h-3 w-3 text-gray-500 dark:text-gray-300" />
                <span className="dark:text-gray-300 text-xs">
                  {state?.filters?.min_guest ? state?.filters?.min_guest : 1} Guests
                </span>
              </div>
            </div>
            <Button
              variant="default"
              size="icon"
              className="rounded-full h-12 w-12 ml-2 bg-[#BEA355] dark:bg-[#BEA355]"
            >
              <Search className="h-8 w-8 dark:invert" />
            </Button>
          </div>
        </SheetTrigger>
        <SheetContent handleCloseSheet={handleCloseSheet} side="top" className="max-w-8xl p-0 overflow-hidden mt-[-10.5rem] h-[700px] rounded-b-2xl border-none shadow-none outline-none bg-none bg-transparent">
          <SheetHeader>
            <VisuallyHidden>
              <SheetTitle>Yacht Search Filter</SheetTitle>
            </VisuallyHidden>
          </SheetHeader>
          <div
            onClick={(e) => {
              e.stopPropagation(); // Prevent closing the sheet
              // Your button logic here
            }}
            className="w-full">
            <div className="transition-all duration-300 ease-in-out">
              <Tabs
                value={activeMainTab}
                onValueChange={setActiveMainTab}
                className="w-full mt-40 md:mt-40"
              >
                <div
                  className="bg-white flex items-center justify-between dark:bg-gray-800 py-3.5 md:py-8 transition-all duration-300 ease-in-out z-0">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsDialogOpen(false)}
                    className="text-gray-500 hover:text-gray-800 w-5 h-5 bg-gray-100 md:ml-1 ml-0.5 dark:text-gray-400 dark:hover:text-gray-200 z-50"
                  >
                    <X className="dark:invert" />
                  </Button>
                  <TabsList className="grid max-w-md mx-auto grid-cols-3 rounded-full border-b bg-[#EFF1F2] border-none h-auto md:h-[50px] p-1">
                    <TabsTrigger
                      value="yachts"
                      className={`py-2.5 text-xs md:text-sm text-[#BEA355] rounded-full transition-transform duration-300 ease-in-out ${activeMainTab === 'yachts' ? 'transform scale-105' : ''}`}
                    >
                      Yachts
                    </TabsTrigger>
                    <TabsTrigger
                      value="experiences"
                      className={`py-2.5 text-xs md:text-sm text-[#BEA355] rounded-full transition-transform duration-300 ease-in-out ${activeMainTab === 'experiences' ? 'transform scale-105' : ''}`}
                    >
                      Experiences
                    </TabsTrigger>
                    <TabsTrigger
                      value="events"
                      className={`py-2.5 text-xs md:text-sm text-[#BEA355] rounded-full transition-transform duration-300 ease-in-out ${activeMainTab === 'events' ? 'transform scale-105' : ''}`}
                    >
                      Events
                    </TabsTrigger>
                  </TabsList>
                </div>

                {/* Search Tabs */}
                <Tabs
                  value={activeSearchTab}
                  onValueChange={setActiveSearchTab}
                  className="w-full mx-auto mt-2 bg-transparent px-2 sm:px-4"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent closing the sheet
                    // Your button logic here
                  }}
                >
                  <TabsList
                    className="relative grid grid-cols-2 sm:grid-cols-4 w-full mx-auto rounded-none border-b bg-[#EFF1F2] dark:bg-gray-800 h-auto md:h-[72px] rounded-[14px] md:rounded-full gap-1 sm:gap-4"

                  >
                    <TabsTrigger
                      value="searchbyName"
                      className="py-2 sm:py-3 text-xs sm:text-sm rounded-full text-[#BEA355] dark:text-[#BEA355] flex flex-col items-start px-2 sm:px-4"
                    >
                      <div className="flex flex-col items-start md:pl-2 w-full">
                        <span className="font-semibold text-xs">Search</span>
                        <span className="text-xs md:text-sm text-gray-500 font-light dark:text-gray-400 max-w-full truncate">{searchByName || "By Name"}</span>
                      </div>
                    </TabsTrigger>
                    <TabsTrigger
                      value="where"
                      className="py-2 sm:py-3 text-xs sm:text-sm rounded-full text-[#BEA355] dark:text-[#BEA355] flex flex-col items-start px-2 sm:px-4"
                    >
                      <div className="flex flex-col items-start md:pl-2 w-full">
                        <span className="font-semibold text-xs">Where</span>
                        <span className="text-xs md:text-sm text-gray-500 font-light dark:text-gray-400 max-w-full truncate">{selectedCity || "Add Destination"}</span>
                      </div>
                    </TabsTrigger>
                    {activeMainTab != "events" && <TabsTrigger
                      value="when"
                      // disabled={!selectedCity}
                      className="py-2 sm:py-3 text-xs sm:text-sm rounded-full text-[#BEA355] dark:text-[#BEA355] flex flex-col items-start px-2 sm:px-4"
                    >
                      <div className="flex flex-col items-start md:pl-2 w-full">
                        <span className="font-semibold text-xs">When</span>
                        <span className="text-xs md:text-sm text-gray-500 font-light dark:text-gray-400 max-w-full truncate">
                          {selectedDateRange?.from || selectedDateRange?.to ? (
                            <>
                              {selectedDateRange?.from && format(selectedDateRange.from, 'MMM dd')}
                              {selectedDateRange?.to && ` - ${format(selectedDateRange.to, 'MMM dd')}`}
                            </>
                          ) : (
                            "Add Dates"
                          )}
                        </span>

                      </div>
                    </TabsTrigger>}

                    {activeMainTab != "events" && <TabsTrigger
                      value="who"
                      // disabled={!selectedDate}
                      className="py-1 md:py-3.5 w-[130px] md:w-[150px] text-xs md:text-sm rounded-full bg-transparent hover:bg-transparent text-[#BEA355] dark:text-[#BEA355] data-[state=active]:bg-white data-[state=active]:drop-shadow-2xl flex flex-col items-start"
                    >
                      <div className="flex flex-col items-start md:pl-2 w-full">
                        <span className="font-semibold text-xs">Who</span>
                        <span className="text-xs md:text-sm text-gray-500 font-light dark:text-gray-400 max-w-full truncate">{minimumGuests.capacity > 0 ? `${minimumGuests.capacity} Guests` : "Add Guests"}</span>
                      </div>
                    </TabsTrigger>}

                    <div>

                    </div>
                    <TabsTrigger
                      value="search"
                      onClick={handleSearch}
                      // disabled={!selectedCity || !selectedDate || loading}
                      className="py-2 md:py-4 w-[80px] md:w-[120px] absolute  right-4 bottom-2 text-[9px] md:text-sm rounded-full bg-[#BEA355] text-white hover:bg-[#a98a47] data-[state=disabled]:opacity-50"
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
                    {activeMainTab != "events" && <TabsContent
                      value="who"
                      className="absolute right-0 top-full mt-2 z-10 w-full sm:w-[350px] p-6 space-y-3 bg-white dark:bg-gray-800 rounded-2xl h-[230px] overflow-y-auto shadow-lg border border-gray-200 dark:border-gray-700"
                    >
                      <h3 className="text-xl font-semibold">Who&apos;s coming?</h3>
                      {Object.keys(minimumGuests).map(type => (
                        <div
                          key={type}
                          className="flex items-center justify-between"
                        >
                          <span className="text-base capitalize flex-grow">{type}</span>
                          <div className="flex items-center space-x-4 justify-end">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleGuestChange(type, 'decrease')}
                              className="rounded-full h-8 w-8"
                            >
                              -
                            </Button>
                            <Input
                              type="number"
                              min="0"
                              value={removeLeadingZeros(minimumGuests[type].toString())}
                              // onChange={(e) => {
                              //   const value = parseInt(e.target.value, 10) || 0;
                              //   setMinimumGuests(prev => ({
                              //     ...prev,
                              //     [type]: Math.max(0, value)
                              //   }));
                              // }}
                              onChange={(e) => {
                                setMaxGuest(0)
                                const value = e.target.value;
                                if (value === "") {
                                  setMinimumGuests(prev => ({
                                    ...prev,
                                    [type]: "" // Allow empty input temporarily
                                  }));
                                } else {
                                  if (initialRender) {
                                    const lastDigit = parseInt(value[value.length - 1], 10); // Take only last character
                                    setMinimumGuests(prev => ({
                                      ...prev,
                                      [type]: lastDigit
                                    }));
                                    setInitialRender(false);
                                  } else {
                                    const parsedValue = Math.max(0, parseInt(value, 10));
                                    setMinimumGuests(prev => ({
                                      ...prev,
                                      [type]: parsedValue
                                    }));
                                  }
                                }
                              }}
                              className="w-14 text-center text-lg font-medium border rounded-md px-1 py-1 focus:outline-none focus:ring-0 focus:ring-[#BEA355] dark:bg-gray-700 dark:text-white dark:border-gray-600"
                            />
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleGuestChange(type, 'increase')}
                              className="rounded-full h-8 w-8"
                            >
                              +
                            </Button>
                          </div>
                        </div>
                      ))}
                      {/* <div className="flex flex-wra pt-4 items-end gap-2 md:gap-0 md:space-y-0 space-y-1.5 overflow-y-auto md:space-x-1 justify-between">
                        <Button
                          variant="outline"
                          type="button" // Change to button to prevent form submission
                          onClick={() => handleGuestSelection("1 - 10")}
                          className="w-full sm:w-[70px] border-2 dark:bg-gray-600 border-[#BEA355] h-[75px] flex flex-col items-center"
                        >
                          <Image src="/assets/images/oneuser.svg" className='dark:invert' width={15} height={15} alt="" />
                          1 - 10
                        </Button>
                        <Button
                          variant="outline"
                          type="button"
                          onClick={() => handleGuestSelection("10 - 30")}
                          className="w-full sm:w-[70px] border-2 dark:bg-gray-600 border-[#BEA355] h-[75px] flex flex-col items-center"
                        >
                          <Image src="/assets/images/twouser.svg" className='dark:invert' width={20} height={20} alt="" />
                          10 - 30
                        </Button>
                        <Button
                          variant="outline"
                          type="button"
                          onClick={() => handleGuestSelection("30 - 50")}
                          className="w-full sm:w-[70px] border-2 dark:bg-gray-600 border-[#BEA355] h-[75px] flex flex-col items-center"
                        >
                          <Image src="/assets/images/threeuser.svg" className='dark:invert' width={20} height={20} alt="" />
                          30 - 50
                        </Button>
                        <Button
                          variant="outline"
                          type="button"
                          onClick={() => handleGuestSelection("50+")}
                          className="w-full sm:w-[70px] border-2 dark:bg-gray-600 border-[#BEA355] h-[75px] flex flex-col items-center"
                        >
                          <Image src="/assets/images/threeuser.svg" className='dark:invert' width={20} height={20} alt="" />
                          50+
                        </Button>
                      </div> */}
                      <div className="flex w-full justify-between pt-4 gap-2">
                        <Button
                          variant="outline"
                          type="button"
                          onClick={() => handleGuestSelection("1 - 10")}
                          className="flex-1 border-2 dark:bg-gray-600 border-[#BEA355] h-[75px] flex flex-col items-center justify-center text-xs min-w-0"
                        >
                          <Image src="/assets/images/oneuser.svg" className="dark:invert" width={20} height={20} alt="" />
                          1 - 10
                        </Button>
                        <Button
                          variant="outline"
                          type="button"
                          onClick={() => handleGuestSelection("10 - 30")}
                          className="flex-1 border-2 dark:bg-gray-600 border-[#BEA355] h-[75px] flex flex-col items-center justify-center text-xs min-w-0"
                        >
                          <Image src="/assets/images/twouser.svg" className="dark:invert" width={20} height={20} alt="" />
                          10 - 30
                        </Button>
                        <Button
                          variant="outline"
                          type="button"
                          onClick={() => handleGuestSelection("30 - 50")}
                          className="flex-1 border-2 dark:bg-gray-600 border-[#BEA355] h-[75px] flex flex-col items-center justify-center text-xs min-w-0"
                        >
                          <Image src="/assets/images/threeuser.svg" className="dark:invert" width={20} height={20} alt="" />
                          30 - 50
                        </Button>
                        <Button
                          variant="outline"
                          type="button"
                          onClick={() => handleGuestSelection("50+")}
                          className="flex-1 border-2 dark:bg-gray-600 border-[#BEA355] h-[75px] flex flex-col items-center justify-center text-xs min-w-0"
                        >
                          <Image src="/assets/images/threeuser.svg" className="dark:invert" width={20} height={20} alt="" />
                          50+
                        </Button>
                      </div>


                    </TabsContent>}

                    <TabsContent
                      value="where"
                      className="absolute left-0 top-full mt-2 z-10 md:w-[400px] mx-2 p-6 space-y-3 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700"
                    >
                      <h3 className="text-md md:text-xl font-semibold mb-4">Add Destination</h3>
                      {isCitiesLoading ? (
                        <div className="flex justify-center items-center h-64">
                          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#BEA355]"></div>
                        </div>
                      ) : cities.length > 0 ? (
                        <Carousel className="w-full">
                          <CarouselContent>
                            {cities.map((city) => (
                              <CarouselItem key={city.id} className="basis-1/2 md:basis-1/2 p-2 ml-4">
                                <div
                                  className="group cursor-pointer"
                                  onClick={() => {
                                    setSelectedCity(city.name);
                                    setActiveSearchTab("when");
                                  }}
                                >
                                  <div className="relative overflow-hidden rounded-2xl">
                                    <Image
                                      src={`${process.env.NEXT_PUBLIC_S3_URL}${city.image}`}
                                      alt=""
                                      width={100}
                                      height={200}
                                      quality={100}
                                      onError={(e) => {
                                        e.target.src = '/assets/images/Imagenotavailable.png';
                                      }}
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
                  </TabsList>
                  {/* When Tab Content */}
                  {activeMainTab != "events" &&
                    <TabsContent value="when" className="flex justify-center">
                      <div className="bg-white dark:bg-gray-800 rounded-2xl">
                        <Calendar
                          // mode="range"
                          mode="single"
                          selected={selectedDateRange}
                          onSelect={(range) => {
                            setSelectedDateRange({ from: range, to: null });
                            if (range) {
                              setActiveSearchTab("who");
                            }
                          }}
                          disabled={(date) => date < new Date().setHours(0, 0, 0, 0)}
                          numberOfMonths={1}
                          className="rounded-md"
                        />
                      </div>
                    </TabsContent>}



                  <TabsContent value="searchbyName" className="flex justify-start">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl">
                      <div className='bg-white dark:bg-[#24262F] rounded-xl shadow-md p-6'>

                        <div className="space-y-2 my-2">
                          <Label htmlFor="searchByName">
                            Search By Name
                          </Label>
                          <Input
                            id="searchByName"
                            type="text"
                            placeholder="Search"
                            required
                            value={searchByName}
                            onChange={(e) => setsearchByName(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                handleSearch(); // Call your search function
                              }
                            }}

                          />
                        </div>



                      </div>
                    </div>
                  </TabsContent>

                </Tabs>
              </Tabs>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </section>
  );
};

export default SearchFilter;