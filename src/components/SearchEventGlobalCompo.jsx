"use client";
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { CalendarIcon, Dot, FilterIcon, List, Map, MapPin, SortAscIcon } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectTriggerSort } from "@/components/ui/select";
import { SlidersHorizontal, X } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from '@/components/ui/scroll-area';
import { addToWishlist, removeFromWishlist, fetchWishlist } from '@/api/wishlist';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Carousel, CarouselContent, CarouselDots, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import SearchFilter from '@/components/lp/shared/SearchFilter';
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useGlobalState } from '@/context/GlobalStateContext';
import { Loading } from '@/components/ui/loading';
import { calculateDaysBetween } from '@/helper/calculateDays';
import MapBoxComponent from "@/components/shared/dashboard/mapBox";
import { checkValidateLatLong } from '@/helper/validateLatlong';
import { cn } from '@/lib/utils';
import { Calendar } from './ui/calendar';
import { getMonthName } from '@/helper/filterData';

const PAGE_SIZE = 10;


const SearchEventGlobalCompo = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [favorites, setFavorites] = useState(new Set());
  const [originalEvents, setOriginalEvents] = useState([]);
  const [onCancelEachFilter, setonCancelEachFilter] = useState(false);
  const observer = useRef();
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [allowFetching, setAllowFetching] = useState(true); // Prevent API spam
  const { eventsType } = useParams();
  const [showSkeleton, setShowSkeleton] = useState(false);
  const { state, setFilter } = useGlobalState();
  const queryString = typeof window !== "undefined" ? window.location.search : "";
  const currentPath = typeof window !== "undefined" ? window.location.pathname : "";
  const searchParams = useSearchParams(queryString);
  const [totalEvents, settotalEvents] = useState(0);
  const [paginateEvents, setpaginateEvents] = useState(0);
  const [componentType, setcomponentType] = useState("simpleEvent")
  const [searchPath, setSearchPath] = useState(`/dashboard/event/${eventsType == "year-events" ? "year-events" : eventsType ==  "f1-events" ? "f1-events" : "normal-events"}`)
  const targetPath = `/dashboard/event/${eventsType == "year-events" ? "year-events" : eventsType ==  "f1-events" ? "f1-events" : "normal-events"}/search`;

  const [mapBox, setMapBox] = useState(false)
  const [validMarkers, setValidMarkers] = useState([])
  const [validmovingObjects, setValidMovingObject] = useState([])

  const [filters, setFilters] = useState({
    min_price: "",
    max_price: "",
    min_guest: "",
    max_guest: "",
    sleep_capacity: "",
    capacity: "",
    location: "",
    eventType: "",
    eventOrder: "",
    eventMonth: "",
    category_name: [],
    subcategory_name: [],
    boat_category: [],
    price_des: false,
    price_asc: false,
    cabin_des: false,
    cabin_asc: false,
    engine_type: "",
    number_of_cabin: "",
    created_on: "",
    min_length: "",
    max_length: "",
    amenities: [],
    outdoor_equipment: [],
    kitchen: [],
    energy: [],
    leisure: [],
    navigation: [],
    extra_comforts: [],
    indoor: [],
    name: ""
  });

  const initialFilterState = {
    min_price: "",
    max_price: "",
    min_guest: "",
    max_guest: "",
    sleep_capacity: "",
    capacity: "",
    location: "",
    eventType: "",
    eventOrder: "",
    eventMonth: "",
    category_name: [],
    subcategory_name: [],
    boat_category: [],
    price_des: false,
    price_asc: false,
    cabin_des: false,
    cabin_asc: false,
    engine_type: "",
    number_of_cabin: "",
    created_on: "",
    min_length: "",
    max_length: "",
    amenities: [],
    outdoor_equipment: [],
    kitchen: [],
    energy: [],
    leisure: [],
    navigation: [],
    extra_comforts: [],
    indoor: [],
  };
  const [isOpen, setIsOpen] = useState(false); // State to control Sheet visibility
  const [apiCall, setapiCall] = useState("firstRender")



  const sortByOptions = [
    { value: "default", label: "Default" },
    { value: "Price-High-Low", label: "Price: High to Low" },
    { value: "Price-Low-High", label: "Price: Low to High" },
    { value: "Capacity-High-Low", label: "Capacity: High to Low" },
    { value: "Capacity-Low-High", label: "Capacity: Low to High" }
  ];

  const [selectedSortBy, setSelectedSortBy] = useState(searchParams.get('sortBy') || "default");
  const [startSort, setStartSort] = useState(false);

  const handleChange = (value) => {
    setStartSort(true);
    setSelectedSortBy(value);

    // Get current search params
    const currentParams = new URLSearchParams(window.location.search);

    // Update or add new parameter
    currentParams.set("sortBy", value);

    // Push updated URL with all existing params
    router.push(`${searchPath}?${currentParams.toString()}`);
  };

  const selectedOption = sortByOptions.find(option => option.value === selectedSortBy);


  const userId = session?.user?.userid || 1;

  const categories = ['Catamarans', "motor boat", "motor", 'Explorer Yacht', 'Ferries & Cruises', 'House Boat', 'Mega Yacht', 'Jet Ski', 'Open Yachts', 'Wake Surfing', 'Motor Yachts', 'House Yacht', 'Wedding Yacht', 'Trawler Yachts'];
  const locations = ['Dubai', 'Abu Dhabi', 'Sharjah'];
  const eventTypes = ['YEAR', 'NORMAL', 'F1'];
  const eventOrders = ['upcoming', 'past',];
  const months = [
    { name: 'January', value: '1' },
    { name: 'February', value: '2' },
    { name: 'March', value: '3' },
    { name: 'April', value: '4' },
    { name: 'May', value: '5' },
    { name: 'June', value: '6' },
    { name: 'July', value: '7' },
    { name: 'August', value: '8' },
    { name: 'September', value: '9' },
    { name: 'October', value: '10' },
    { name: 'November', value: '11' },
    { name: 'December', value: '12' }
  ];


  const packageTypes = ['basic', 'f1', 'Sharjah'];

  const outdoorEquipment = [
    { name: 'Bath Towels', icon: '/assets/images/bathtowels.svg' },
    { name: 'Bathing Ladder', icon: '/assets/images/bathingladder.svg' },
    { name: 'Beach Towels', icon: '/assets/images/beachtowels.svg' },
    { name: 'Bathing Platform', icon: '/assets/images/bathingplatform.svg' },
    { name: 'Outdoor Table', icon: '/assets/images/outdoortable.svg' },
    { name: 'Aft Sundeck', icon: '/assets/images/aftsundeck.svg' },
    { name: 'Teak deck', icon: '/assets/images/teakdeck.svg' },
    { name: 'Bimini', icon: '/assets/images/bimini.svg' },
    { name: 'Cooker', icon: '/assets/images/cooker.svg' },
    { name: 'Outdoor shower', icon: '/assets/images/outdoorshower.svg' },
    { name: 'External speakers', icon: '/assets/images/externalspeakers.svg' },
    { name: 'External table', icon: '/assets/images/externaltable.svg' },
  ];
  const kitchenOptions = [
    { name: 'Tableware', icon: '/assets/images/Icon_Tableware.svg' },
    { name: 'BBQ Grill', icon: '/assets/images/Icon_BBQgrill.svg' },
    { name: 'Ice machine', icon: '/assets/images/Icon_Icemachine.svg' },
    { name: 'Coffee Machine', icon: '/assets/images/Icon_Coffeemachine.svg' },
    { name: 'Bar', icon: '/assets/images/Icon_Bar.svg' },
    { name: 'Barware', icon: '/assets/images/Icon_Barware.svg' },
    { name: 'Dining Utensils', icon: '/assets/images/Icon_DiningUtensils.svg' },
    { name: 'Dishwasher', icon: '/assets/images/Icon_Dishwasher.svg' },
    { name: 'Microwave', icon: '/assets/images/Icon_Microwave.svg' },
    { name: 'Oven/stovetop', icon: '/assets/images/Icon_Oven.svg' },
    { name: 'Freezer', icon: '/assets/images/Icon_Freezer.svg' }
  ];
  const energyOptions = [{ name: '220V Power Outlet', icon: '/assets/images/Icon_220Vpoweroutlet.svg' }, { name: 'Power Inverter', icon: '/assets/images/Icon_Powerinverter.svg' }, { name: 'Solar Panels', icon: '/assets/images/Icon_Solarpanels.svg' }, { name: 'Generator', icon: '/assets/images/Icon_Generator.svg' }];
  const leisureActivities = [
    { name: 'Swimming Pool', icon: '/assets/images/Icon_Swimmingpool.svg' },
    { name: 'Inflatable banana', icon: '/assets/images/Icon_Inflatablebanana.svg' },
    { name: 'Kneeboard', icon: '/assets/images/Icon_Kneeboard.svg' },
    { name: 'Video Camera', icon: '/assets/images/Icon_Videocamera.svg' },
    { name: 'Windsuft equipment', icon: '/assets/images/Icon_Windsuftequipment.svg' },
    { name: 'Diving equipment', icon: '/assets/images/Icon_Divingequipment.svg' },
    { name: 'Kitesurfing equipment', icon: '/assets/images/Icon_Kitesurfingequipment.svg' },
    { name: 'Drone', icon: '/assets/images/Icon_Drone.svg' },
    { name: 'Wakeboard', icon: '/assets/images/Icon_Wakeboard.svg' },
    { name: 'Gym', icon: '/assets/images/Icon_Gym.svg' },
    { name: 'Inflatable waterslide', icon: '/assets/images/Icon_Inflatablewaterslide.svg' },
    { name: 'Jacuzzi', icon: '/assets/images/Icon_Jacuzzi.svg' },
    { name: 'Fishing equipment', icon: '/assets/images/Icon_Fishingequipment.svg' },
    { name: 'Water skis', icon: '/assets/images/Icon_Waterskis.svg' },
    { name: 'Jet ski', icon: '/assets/images/Icon_Jetski.svg' },
    { name: 'Kayak', icon: '/assets/images/Icon_Kayak.svg' },
    { name: 'Paddle board', icon: '/assets/images/Icon_Paddleboard.svg' },
    { name: 'Sea scooter', icon: '/assets/images/Icon_Seascooter.svg' },
    { name: 'Seabob', icon: '/assets/images/Icon_Seabob.svg' },
    { name: 'Flyboard', icon: '/assets/images/Icon_Flyboard.svg' }
  ];
  const navigationEquipment = [
    { name: 'Fishing Sonar', icon: '/assets/images/Icon_FishingSonar.svg' },
    { name: 'Autopilot', icon: '/assets/images/Icon_Autopilot.svg' },
    { name: 'Bow Sundeck', icon: '/assets/images/Icon_Bowsundeck.svg' },
    { name: 'Bow Thruster', icon: '/assets/images/Icon_Bowthruster.svg' },
    { name: 'Depth Sounder', icon: '/assets/images/Icon_Depthsounder.svg' },
    { name: 'Wi-Fi', icon: '/assets/images/Icon_Wi-Fi.svg' },
    { name: 'Animals Allowed', icon: '/assets/images/Icon_FishingSonar.svg' },
    { name: 'VHF', icon: '/assets/images/Icon_VHF.svg' },
    { name: 'Dinghy', icon: '/assets/images/Icon_Dinghy.svg' },
    { name: "Dinghy's motor", icon: '/assets/images/Icon_Dinghysmotor.svg' },
    { name: 'GPS', icon: '/assets/images/Icon_GPS.svg' }
  ];
  const extraComforts = [
    { name: 'Parking', icon: '/assets/images/Icon_Parking.svg' },
    { name: 'Towable Tube', icon: '/assets/images/Icon_TowableTube.svg' },
    { name: 'Washing Machine', icon: '/assets/images/Icon_Washingmachine.svg' },
    { name: 'Watermaker', icon: '/assets/images/Icon_Watermaker.svg' },
    { name: 'A.C', icon: '/assets/images/Icon_AirConditioning.svg' },
    { name: 'Bluetooth', icon: '/assets/images/Icon_Bluetooth.svg' },
    { name: 'TV', icon: '/assets/images/Icon_TV.svg' },
    { name: 'USB Socket', icon: '/assets/images/Icon_USBsocket.svg' },
    { name: 'Bed Linen', icon: '/assets/images/Icon_Bedlinen.svg' },
    { name: 'Haeting', icon: '/assets/images/Icon_Haeting.svg' },
    { name: 'Hot Water', icon: '/assets/images/Icon_Hotwater.svg' },
    { name: 'Electric toilet', icon: '/assets/images/Icon_Electrictoilet.svg' },
    { name: 'Fans', icon: '/assets/images/Icon_Fans.svg' }
  ];
  const indoorEquipment = [
    { name: 'Indoor Table', icon: '/assets/images/Icon_IndoorTable.svg' },
    { name: 'Restrooms', icon: '/assets/images/Icon_Restrooms.svg' },
    { name: 'Shower', icon: '/assets/images/Icon_Shower.svg' },
    { name: 'Sound System', icon: '/assets/images/Icon_SoundSystem.svg' },
    { name: 'Speakers', icon: '/assets/images/Icon_Speakers.svg' }];

  const [activeFilters, setActiveFilters] = useState([]);

  const updateActiveFilters = () => {
    const newFilters = [];
    // if (filters.min_price !== "" || filters.max_price !== "") {
    //   newFilters.push(`Price: ${filters.min_price}-${filters.max_price} AED`);
    // }
    // if (filters.min_guest || filters.max_guest) newFilters.push(`Guests: ${filters.min_guest}-${filters.max_guest}`);
    if (filters.location) newFilters.push(`Location: ${filters.location}`);
    if (filters.eventType) newFilters.push(`Type: ${filters.eventType}`);
    if (filters.eventOrder) newFilters.push(`Order: ${filters.eventOrder}`);
    if (filters.eventMonth) newFilters.push(`Month: ${filters.eventMonth}`);

    if (filters.name) newFilters.push(`name: ${filters.name}`);

    // if (filters.category_name.length) newFilters.push(`Categories: ${filters.category_name.length}`);
    // if (filters.boat_category.length) newFilters.push(`Boat Categories: ${filters.boat_category.length}`);
    // if (filters.engine_type) newFilters.push(`Type: ${filters.engine_type}`);
    // if (filters.min_length) newFilters.push(`Length: ${filters.min_length}-${filters.max_length}ft`);
    // if (filters.number_of_cabin) newFilters.push(`Min No. of Cabins: ${filters.number_of_cabin}`);
    // if (filters.sleep_capacity) newFilters.push(`Min Sleeping Capacity: ${filters.sleep_capacity}`);
    // if (filters.amenities.length) newFilters.push(`Amenities: ${filters.amenities.length}`); // Added amenities filter
    // if (filters.outdoor_equipment.length) newFilters.push(`Outdoor Equipment: ${filters.outdoor_equipment.length}`); // Added outdoor equipment filter
    // if (filters.kitchen.length) newFilters.push(`Kitchen: ${filters.kitchen.length}`); // Added kitchen filter
    // if (filters.energy.length) newFilters.push(`Onboard Energy: ${filters.energy.length}`); // Added energy filter
    // if (filters.leisure.length) newFilters.push(`Leisure Activities: ${filters.leisure.length}`); // Added leisure activities filter
    // if (filters.navigation.length) newFilters.push(`Navigation Equipment: ${filters.navigation.length}`); // Added navigation equipment filter
    // if (filters.extra_comforts.length) newFilters.push(`Extra Comforts: ${filters.extra_comforts.length}`); // Added extra comforts filter
    // if (filters.indoor.length) newFilters.push(`Indoor Equipment: ${filters.indoor.length}`); // Added indoor equipment filter

    setActiveFilters(newFilters);
  };

  /// update filter on searchParams
  useEffect(() => {
    /// for this compo
    let obj = {
      location: searchParams.get('location') || "",
      name: searchParams.get('name') || "",
      eventType: searchParams.get('eventType') || "",
      eventOrder: searchParams.get('eventOrder') || "",
      eventMonth: searchParams.get('eventMonth') || "",

      // max_guest: searchParams.get('max_guest') ? parseInt(searchParams.get('max_guest')) : "",
      // min_guest: searchParams.get('min_guest') ? parseInt(searchParams.get('min_guest')) : "",
      // min_price: searchParams.get('min_price') ? parseInt(searchParams.get('min_price')) : "",
      // max_price: searchParams.get('max_price') ? parseInt(searchParams.get('max_price')) : "",
      // sortBy: searchParams.get('sortBy') ? searchParams.get('sortBy') : "default",
      // min_length: searchParams.get('min_length') ? parseInt(searchParams.get('min_length')) : "",
      // max_length: searchParams.get('max_length') ? parseInt(searchParams.get('max_length')) : "",
      // sleep_capacity: searchParams.get('sleep_capacity') ? parseInt(searchParams.get('sleep_capacity')) : "",
      // number_of_cabin: searchParams.get('number_of_cabin') ? parseInt(searchParams.get('number_of_cabin')) : "",
      // category_name: searchParams.get('category_name')
      //   ? JSON.parse(searchParams.get('category_name'))
      //   : [],
      // outdoor_equipment: searchParams.get('outdoor_equipment')
      //   ? JSON.parse(searchParams.get('outdoor_equipment'))
      //   : [],
      // navigation: searchParams.get('navigation')
      //   ? JSON.parse(searchParams.get('navigation'))
      //   : [],
      // leisure: searchParams.get('leisure')
      //   ? JSON.parse(searchParams.get('leisure'))
      //   : [],
      // kitchen: searchParams.get('kitchen')
      //   ? JSON.parse(searchParams.get('kitchen'))
      //   : [],
      // indoor: searchParams.get('indoor')
      //   ? JSON.parse(searchParams.get('indoor'))
      //   : [],
      // extra_comforts: searchParams.get('extra_comforts')
      //   ? JSON.parse(searchParams.get('extra_comforts'))
      //   : [],
      // energy: searchParams.get('energy')
      //   ? JSON.parse(searchParams.get('energy'))
      //   : [],



    }
    setFilters((prev) => ({
      ...prev,
      ...obj
    }));
    //for global state or search filter
    setFilter({
      ...obj
    })
  }, [searchParams])


  useEffect(() => {
    updateActiveFilters();
  }, [filters]);

  //loadWishlist
  useEffect(() => {
    const loadWishlist = async () => {
      if (userId) {
        try {
          const wishlistItems = await fetchWishlist(userId);
          const wishlistIds = new Set(wishlistItems.map(item => item?.yacht));
          setFavorites(wishlistIds);
        } catch (err) {
          console.error('Wishlist loading error:', err);
        }
      }
    };

    // loadWishlist();
  }, [userId]);

  const handlePagination = async () => {

    if (!userId) return;
    if (!hasMore) return;

    let payload = {
      // max_guest: parseInt(searchParams.get('max_guest')) || "",
      location: searchParams.get('location'),
      date_filter: searchParams.get('eventOrder'),
      month: searchParams.get('eventMonth'),
      search: searchParams.get('name') || "",
      // created_on: searchParams.get('date') || "",
      // ...((searchParams.get('min_guest') && !isNaN(parseInt(searchParams.get('min_guest'))))
      //   ? { min_guest: parseInt(searchParams.get('min_guest')) }
      //   : {}),
      // ...(eventsType === "normal-events"
      //   ? {
      //     min_per_hour: parseInt(searchParams.get('min_price')) || "",
      //     max_per_hour: parseInt(searchParams.get('max_price')) || "",
      //   }
      //   : eventsType == "year-events" ? "year-events" : eventsType === "f1-events"
      //     ? {
      //       min_per_day: parseInt(searchParams.get('min_price')) || "",
      //       max_per_day: parseInt(searchParams.get('max_price')) || "",
      //     }
      //     : {}),
      // min_length: parseInt(searchParams.get('min_length')) || "",
      // max_length: parseInt(searchParams.get('max_length')) || "",
      // sleep_capacity: parseInt(searchParams.get('sleep_capacity')) || "",
      // number_of_cabin: parseInt(searchParams.get('number_of_cabin')) || "",
      // category_names: searchParams.get('category_name')
      //   ? JSON.parse(searchParams.get('category_name'))
      //   : [],
      // features: [
      //   ...(JSON.parse(searchParams.get('outdoor_equipment') || "[]")),
      //   ...(JSON.parse(searchParams.get('navigation') || "[]")),
      //   ...(JSON.parse(searchParams.get('leisure') || "[]")),
      //   ...(JSON.parse(searchParams.get('kitchen') || "[]")),
      //   ...(JSON.parse(searchParams.get('indoor') || "[]")),
      //   ...(JSON.parse(searchParams.get('extra_comforts') || "[]")),
      //   ...(JSON.parse(searchParams.get('energy') || "[]"))
      // ]



    };
    payload = {
      ...payload,
      source: componentType == "searchEvent" ? "searchEvent" : componentType == "simpleEvent" ? "simpleEvent" : "",
      reqType: "handlePagination",
      event_type: eventsType == "year-events" ? "YEAR" : eventsType == "f1-events" ? "F1" : "NORMAL",
      user_id: userId,
      page: page
    };
    try {
      setLoading(true);

      let response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/yacht/check_eventsystem/?page=${page}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          "Referer": window.location.href

        },
        body: JSON.stringify(payload),
      });


      const responseData = await response.json();
      if (responseData.success === true) {

        // Filter events based on price range
        // const filteredYachts = responseData.events.filter(item => {
        //   const price = item?.yacht?.per_hour_price;
        //   return price >= filters.min_price && price <= filters.max_price;
        // }); 
        const filteredYachts = responseData.events;
        settotalEvents(responseData?.total_events)
        setpaginateEvents(responseData?.paginated_count)



        setOriginalEvents((prev) => [...prev, ...filteredYachts]);
        if (filteredYachts?.length < PAGE_SIZE) {
          console.log("no more data")
          setHasMore(false)
        } else {
          console.log("more data")
          setHasMore(true)
        }
      } else {
        setHasMore(false);
        // setError(responseData.error || 'Failed to apply filters');
        console.error('API Error:', responseData.error);
      }
    } catch (err) {
      setError(err.message || 'Error applying filters');
      console.error('Filter error:', err);
    } finally {
      setLoading(false);
    }
    setIsOpen(false);
  };
  const handleResetAll = async () => {

    if (!userId) return;
    let payloadHardReset = {
      source: componentType == "searchEvent" ? "searchEvent" : componentType == "simpleEvent" ? "simpleEvent" : "",
      reqType: "handleResetAll",
      event_type: eventsType == "year-events" ? "YEAR" : eventsType == "f1-events" ? "F1" : "NORMAL",
      user_id: userId,
      page: 1,
    };
    try {
      setLoading(true);

      let response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/yacht/check_eventsystem/?page=1`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          "Referer": window.location.href

        },
        body: JSON.stringify(payloadHardReset),
      });


      const responseData = await response.json();
      if (responseData.success === true) {

        // Filter events based on price range
        // const filteredYachts = responseData.events.filter(item => {
        //   const price = item?.yacht?.per_hour_price;
        //   return price >= filters.min_price && price <= filters.max_price;
        // }); 
        const filteredYachts = responseData.events;
        settotalEvents(responseData?.total_events)
        setpaginateEvents(responseData?.paginated_count)


        setOriginalEvents([...filteredYachts]);
        setHasMore(true)
      } else {
        setHasMore(true)
        // setError(responseData.error || 'Failed to apply filters');
        console.error('API Error:', responseData.error);
      }
    } catch (err) {
      setError(err.message || 'Error applying filters');
      console.error('Filter error:', err);
    } finally {
      setLoading(false);
      setPage(1)

    }
    router.push(`${searchPath}?${new URLSearchParams({
      // max_guest: "",
      // min_guest: "",
      // min_price: "",
      // max_price: "",
      location: "",
      eventType: "",
      eventOrder: "",
      eventMonth: "",
      // min_length: "",
      // max_length: "",
      // sleep_capacity: "",
      // number_of_cabin: "",
      // category_name: "[]",
      // outdoor_equipment: "[]",
      // navigation: "[]",
      // leisure: "[]",
      // kitchen: "[]",
      // indoor: "[]",
      // extra_comforts: "[]",
      // energy: "[]",
      name: "",

    }).toString()}`);

    setIsOpen(false);

  }

  const handleFilterChange = async () => {

    if (!userId) return;

    let payload = {
      // max_guest: parseInt(searchParams.get('max_guest')) || "",
      location: searchParams.get('location'),
      date_filter: searchParams.get('eventOrder'),
      month: searchParams.get('eventMonth'),
      search: searchParams.get('name') || "",
      // created_on: searchParams.get('date') || "",
      // ...((searchParams.get('min_guest') && !isNaN(parseInt(searchParams.get('min_guest'))))
      //   ? { min_guest: parseInt(searchParams.get('min_guest')) }
      //   : {}),
      // ...(eventsType === "normal-events"
      //   ? {
      //     min_per_hour: parseInt(searchParams.get('min_price')) || "",
      //     max_per_hour: parseInt(searchParams.get('max_price')) || "",
      //   }
      //   : eventsType == "year-events" ? "year-events" : eventsType === "f1-events"
      //     ? {
      //       min_per_day: parseInt(searchParams.get('min_price')) || "",
      //       max_per_day: parseInt(searchParams.get('max_price')) || "",
      //     }
      //     : {}),
      // min_length: parseInt(searchParams.get('min_length')) || "",
      // max_length: parseInt(searchParams.get('max_length')) || "",
      // sleep_capacity: parseInt(searchParams.get('sleep_capacity')) || "",
      // number_of_cabin: parseInt(searchParams.get('number_of_cabin')) || "",
      // category_names: searchParams.get('category_name')
      //   ? JSON.parse(searchParams.get('category_name'))
      //   : [],
      // features: [
      //   ...(JSON.parse(searchParams.get('outdoor_equipment') || "[]")),
      //   ...(JSON.parse(searchParams.get('navigation') || "[]")),
      //   ...(JSON.parse(searchParams.get('leisure') || "[]")),
      //   ...(JSON.parse(searchParams.get('kitchen') || "[]")),
      //   ...(JSON.parse(searchParams.get('indoor') || "[]")),
      //   ...(JSON.parse(searchParams.get('extra_comforts') || "[]")),
      //   ...(JSON.parse(searchParams.get('energy') || "[]"))
      // ]



    };
    payload = {
      ...payload,
      page: 1,
      source: componentType == "searchEvent" ? "searchEvent" : componentType == "simpleEvent" ? "simpleEvent" : "",
      reqType: "handleFilterChange",
      event_type: eventsType == "year-events" ? "YEAR" : eventsType == "f1-events" ? "F1" : "NORMAL",
      user_id: userId,
      // ...(eventsType === "normal-events"
      //   ? {
      //     min_per_hour: filters?.min_price?.toString() || "",
      //     max_per_hour: filters?.max_price?.toString() || "",
      //   }
      //   : eventsType == "year-events" ? "year-events" : eventsType === "f1-events"
      //     ? {
      //       min_per_day: filters?.min_price?.toString() || "",
      //       max_per_day: filters?.max_price?.toString() || "",
      //     }
      //     : {}),
      // min_guest: filters?.min_guest || "",
      // max_guest: filters?.max_guest || "",
      // sleep_capacity: filters?.sleep_capacity || "",
      // number_of_cabin: filters?.number_of_cabin || "",
      // category_names: filters?.category_name || [],
      // features: [
      //   ...(filters?.amenities || []),
      //   ...(filters?.outdoor_equipment || []),
      //   ...(filters?.kitchen || []),
      //   ...(filters?.energy || []),
      //   ...(filters?.leisure || []),
      //   ...(filters?.navigation || []),
      //   ...(filters?.extra_comforts || []),
      //   ...(filters?.indoor || [])
      // ],
      // price_asc: filters?.price_asc || false,
      // price_des: filters?.price_des || false,
      // cabin_asc: filters?.cabin_asc || false,
      // cabin_des: filters?.cabin_des || false,
      // created_on: filters?.created_on || "",
      location: filters?.location || "",
      date_filter: filters?.eventOrder,
      month: filters?.eventMonth,
      // min_length: filters?.min_length || "",
      // max_length: filters?.max_length || "",
      search: filters?.name || "",

    };

    try {
      setLoading(true);

      let response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/yacht/check_eventsystem/?page=1`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          "Referer": window.location.href

        },
        body: JSON.stringify(payload),
      });


      const responseData = await response.json();
      if (responseData.success === true) {

        // Filter events based on price range
        // const filteredYachts = responseData.events.filter(item => {
        //   const price = item?.yacht?.per_hour_price;
        //   return price >= filters.min_price && price <= filters.max_price;
        // }); 
        const filteredYachts = responseData.events;
        settotalEvents(responseData?.total_events)
        setpaginateEvents(responseData?.paginated_count)



        setOriginalEvents([...filteredYachts]);
        if (filteredYachts?.length < PAGE_SIZE) {
          setHasMore(false);
        } else {
          setHasMore(true);

        }
      } else {
        setHasMore(false);
        // setError(responseData.error || 'Failed to apply filters');
        console.error('API Error:', responseData.error);
      }
    } catch (err) {
      setError(err.message || 'Error applying filters');
      console.error('Filter error:', err);
    } finally {
      setLoading(false);
      setPage(1)
    }


    router.push(`${searchPath}?${new URLSearchParams({

      // max_guest: filters?.max_guest,
      // min_guest: filters?.min_guest,
      // min_price: filters?.min_price,
      // max_price: filters?.max_price,
      location: filters?.location,
      eventType: filters?.eventType,
      eventOrder: filters?.eventOrder,
      eventMonth: filters?.eventMonth,
      name: filters?.name
      // min_length: filters?.min_length,
      // max_length: filters?.max_length,
      // sleep_capacity: filters?.sleep_capacity,
      // number_of_cabin: filters?.number_of_cabin,
      // category_name: filters?.category_name?.length
      //   ? `["${filters.category_name.join('","')}"]`
      //   : "[]",
      // outdoor_equipment: filters?.outdoor_equipment?.length
      //   ? `["${filters.outdoor_equipment.join('","')}"]`
      //   : "[]",
      // navigation: filters?.navigation?.length
      //   ? `["${filters.navigation.join('","')}"]`
      //   : "[]",
      // leisure: filters?.leisure?.length
      //   ? `["${filters.leisure.join('","')}"]`
      //   : "[]",
      // kitchen: filters?.kitchen?.length
      //   ? `["${filters.kitchen.join('","')}"]`
      //   : "[]",
      // indoor: filters?.indoor?.length
      //   ? `["${filters.indoor.join('","')}"]`
      //   : "[]",
      // extra_comforts: filters?.extra_comforts?.length
      //   ? `["${filters.extra_comforts.join('","')}"]`
      //   : "[]",
      // energy: filters?.energy?.length
      //   ? `["${filters.energy.join('","')}"]`
      //   : "[]",



    }).toString()}`);

    // const queryParams = new URLSearchParams();

    // const addParam = (key, value) => {
    //   if (value && value.length !== 0) {
    //     queryParams.append(key, value);
    //   }
    // };

    // addParam("guests", filters?.max_guest);
    // addParam("min_guest", filters?.min_guest);
    // addParam("min_price", filters?.min_price);
    // addParam("max_price", filters?.max_price);
    // addParam("location", filters?.location);
    // addParam("min_length", filters?.min_length);
    // addParam("max_length", filters?.max_length);
    // addParam("sleep_capacity", filters?.sleep_capacity);
    // addParam("number_of_cabin", filters?.number_of_cabin);

    // const addArrayParam = (key, array) => {
    //   if (array?.length) {
    //     queryParams.append(key, `["${array.join('","')}"]`);
    //   }
    // };

    // addArrayParam("category_name", filters?.category_name);
    // addArrayParam("outdoor_equipment", filters?.outdoor_equipment);
    // addArrayParam("navigation", filters?.navigation);
    // addArrayParam("leisure", filters?.leisure);
    // addArrayParam("kitchen", filters?.kitchen);
    // addArrayParam("indoor", filters?.indoor);
    // addArrayParam("extra_comforts", filters?.extra_comforts);
    // addArrayParam("energy", filters?.energy);

    // router.push(`${searchPath}?${queryParams.toString()}`);
    setIsOpen(false);
  };


  // "hitApiCall" on first render and when scroll page
  useEffect(() => {
    // if (apiCall == "firstRender") {
    //   console.log("this is working")

    // }
    if (page > 1) {
      handlePagination();
    }
  }, [page]);

  useEffect(() => {
    handlePagination();
  }, []);
  //page

  // hitApiCall Modify resetFilters function
  const resetFilters = () => {
    setFilters(initialFilterState);
    handleResetAll();
  };

  // "hitApiCall" onCancelEachFilter
  useEffect(() => {
    if (onCancelEachFilter) {
      handleFilterChange();
      setonCancelEachFilter(false);
    }
  }, [filters, onCancelEachFilter]);

  const handleWishlistToggle = async (eventId) => {
    if (!session?.user?.userid) return;

    const updatedFavorites = new Set(favorites);
    try {
      if (updatedFavorites.has(eventId)) {
        await removeFromWishlist(session.user.userid, eventId, 'event');
        updatedFavorites.delete(eventId);
      } else {
        await addToWishlist(session.user.userid, eventId, 'event');
        updatedFavorites.add(eventId);
      }
      setFavorites(updatedFavorites);
    } catch (error) {
      console.error('Error toggling wishlist:', error);
    }
  };
  
  /// set orignial events to events
  useEffect(() => {
    let data = [...originalEvents]
    setEvents(data)
  }, [originalEvents]);

  /// "hitApiCall" for hit api on scroll ,setPage,setAllowFetching
  const lastYachtRef = useCallback(
    (node) => {
      if (!hasMore || !allowFetching) return;

      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            console.log("Fetching Next Page...");
            setAllowFetching(false);
            setPage((prevPage) => prevPage + 1);
            setTimeout(() => {

              setAllowFetching(true)
              // setShowSkeleton(true)
            }, 1000); // Delay to avoid multiple rapid requests
            // setShowSkeleton(false) 
          }
        },
        {
          threshold: 0.75, // Adjust threshold to trigger earlier (before it's fully visible)
        }
      );

      if (node) observer.current.observe(node);
    },
    [hasMore, allowFetching]
  );
  /// for scroll position
  useEffect(() => {
    if (events.length > 0) {
      setAllowFetching(false);

      setTimeout(() => {
        const middleIndex = Math.floor(events.length * 0.75);
        const middleYacht = document.getElementById(`yacht-${events[middleIndex]?.yacht?.id}`);

        // // Smoothly scroll to the middle yacht if needed
        // if (middleYacht) {
        //   middleYacht.scrollIntoView({ behavior: "smooth", block: "end" });
        // }

        setAllowFetching(true);
      }, 100);
    }
  }, [events.length]);

  useEffect(() => {
    // console.log(currentPath,"=>",targetPath)
    if (currentPath === targetPath) {
      let value = `/dashboard/event/${eventsType == "year-events" ? "year-events" : eventsType ==  "f1-events" ? "f1-events" : "normal-events"}/search`;
      setSearchPath(value)
      setcomponentType("searchEvent")
    } else {
      let value = `/dashboard/event/${eventsType == "year-events" ? "year-events" : eventsType ==  "f1-events" ? "f1-events" : "normal-events"}`;
      setSearchPath(value)
      setcomponentType("simpleEvent")

    }
  }, [currentPath, targetPath, eventsType])


  useEffect(() => {
    let validArr = checkValidateLatLong(events);
    let structureArr = validArr?.map(item => ({
      latitude: item?.yacht?.latitude,
      longitude: item?.yacht?.longitude,
      yacht: item.yacht,
      eventsType: eventsType,  // Ensure eventsType is included in dependencies if used
    }));
    setValidMarkers(structureArr);
  }, [events, eventsType]);  // Added eventsType as a dependency

  useEffect(() => {
    let structuredMovingObject = validMarkers?.map(item => ({
      id: item?.yacht?.id,
      name: item?.yacht?.name, // Corrected access
      coordinates: [item?.yacht?.longitude, item?.yacht?.latitude], // Corrected access
    }));
    setValidMovingObject(structuredMovingObject);
  }, [validMarkers]);




  //test
  //   useEffect(()=>{
  //  console.log("normal-events",events)
  //  console.log("Page",page)
  //  console.log("hasMore",hasMore)
  //  console.log("allowFetching",allowFetching)
  // },[events,page,hasMore,allowFetching])

  // useEffect(() => {
  //   console.log("componentType", componentType, searchPath)

  // }, [componentType, searchPath])
  // useEffect(() => {
  //   console.log("filters", filters);
  // }, [filters]);

  // useEffect(() => {
  //   console.log("activeFilters", activeFilters);
  // }, [activeFilters]);






  // console.log(validMarkers)
  // console.log(validmovingObjects)
  // useEffect(() => {
  //   console.log("selectedOption.value",selectedOption.value);
  // }, [selectedOption]);
  // useEffect(() => {
  //  console.log("page",page)
  // }, [page]);


  // if (loading) {
  //   return (
  //     <section className="md:py-20 py-8">
  //       <div className="max-w-5xl px-4 mx-auto">
  //         {/* Heading Skeleton */}
  //         <div className="w-full flex items-center justify-between mb-8">
  //           <div className="h-10 bg-gray-200 dark:bg-gray-700 w-1/3 rounded-md animate-pulse"></div>
  //         </div>

  //         {/* Cards Grid Skeleton */}
  //         <div className="grid grid-cols-1 gap-[0.6rem] xs:grid-cols-1  sm:grid-cols-2 lg:grid-cols-3 place-items-center">
  //           {Array.from({ length: 6 }).map((_, index) => (
  //             <Card
  //               key={index}
  //               className="overflow-hidden bg-white dark:bg-gray-800 w-full max-w-[350px] rounded-2xl h-full min-h-[280px] shadow-lg animate-pulse"
  //             >
  //               <div className="relative">
  //                 {/* Image Skeleton */}
  //                 <div className="bg-gray-200 dark:bg-gray-700 w-full h-[221px] rounded-t-2xl"></div>

  //                 {/* Wishlist Button Skeleton */}
  //                 <div className="absolute top-6 right-6 w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full"></div>

  //                 {/* Price Skeleton */}
  //                 <div className="absolute bottom-4 right-6 w-24 h-8 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
  //               </div>

  //               <CardContent className="px-4 py-4 space-y-3">
  //                 {/* Yacht Name Skeleton */}
  //                 <div className="h-6 bg-gray-200 dark:bg-gray-700 w-2/3 rounded-md"></div>

  //                 {/* Specs Skeleton */}
  //                 <div className="flex justify-start items-center gap-2">
  //                   <div className="h-4 bg-gray-200 dark:bg-gray-700 w-16 rounded-md"></div>
  //                   <div className="h-4 bg-gray-200 dark:bg-gray-700 w-16 rounded-md"></div>
  //                   <div className="h-4 bg-gray-200 dark:bg-gray-700 w-16 rounded-md"></div>
  //                 </div>
  //               </CardContent>
  //             </Card>
  //           ))}
  //         </div>
  //       </div>
  //     </section>
  //   );
  // }

  // if (loading) {
  //     return (
  //         <Loading />
  //     );
  // }

  if (error) {
    return (
      <section className="py-16">
        <div className="container px-4 mx-auto">
          <p className="text-red-500">Error loading events: {error}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-4 px-2">
      <div className="max-w-5xl mx-auto">
        {/* {componentType == "searchEvent" ? <h1 className="text-2xl font-semibold mb-6">
          Listing ({events.length}) {eventsType == "year-events" ? "year-events" : eventsType === "f1-events" ? "f1 events" : eventsType === "normal-events" ? "normal-Events" : ""}
        </h1> : componentType == "simpleEvent" ? <h1 className="text-2xl font-semibold mb-6">
          Listing ({totalEvents}) {eventsType == "year-events" ? "year-events" : eventsType === "f1-events" ? "f1 events" : eventsType === "normal-events" ? "normal-Events" : ""}
        </h1> : ""} */}

        {activeFilters.length > 0 ? <h1 className="text-2xl font-semibold mb-6">
          Search Results ({paginateEvents ? paginateEvents : 0}) {eventsType == "year-events" ? "year events" : eventsType === "f1-events" ? "f1 events" : eventsType === "normal-events" ? "normal Events" : ""}
        </h1> : <h1 className="text-2xl font-semibold mb-6">
          Listing ({totalEvents}) {eventsType == "year-events" ? "year events" : eventsType === "f1-events" ? "f1 events" : eventsType === "normal-events" ? "normal Events" : ""}
        </h1>}

        <h1 className="md:text-4xl text-3xl font-bold mb-6">Our Events</h1>

        <div className="flex flex-col space-y-4 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center w-full gap-2 flex-wrap">
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <div className="flex justify-between w-full">
                  <SheetTrigger asChild>
                    <Button variant="outline" className="gap-2">
                      <SlidersHorizontal className="h-4 w-4" />
                      Filters
                    </Button>
                  </SheetTrigger>

                  <span>

                    <div className="space-y-2">
                      {/* <Select value={selectedSortBy} onValueChange={handleChange}>
                        <SelectTriggerSort className="w-full">
                          <SelectValue placeholder="Sort By" />
                        </SelectTriggerSort>
                        <SelectContent>
                          {sortByOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select> */}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={resetFilters}
                        className="text-sm"
                      >
                        Reset All
                      </Button>
                    </div>

                  </span>
                </div>

                <SheetContent side="left" className="w-full sm:w-[540px]">
                  <SheetHeader>
                    <SheetTitle>Filters</SheetTitle>
                  </SheetHeader>
                  <ScrollArea className="h-[calc(100vh-80px)] px-2">

                    <div className="space-y-6 py-6 px-1">



                      {/* Location */}
                      {/* <div className="space-y-2">
                        <Label className="text-base">Package Types</Label>
                        <Select
                          value={filters.location}
                          onValueChange={(value) => setFilters(prev => ({ ...prev, location: value }))}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select Package Type" />
                          </SelectTrigger>
                          <SelectContent>
                            {locations.map((location) => (
                              <SelectItem key={location} value={location}>
                                {location}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div> */}
                      <div className="space-y-2">
                        <Label className="text-base">Location</Label>
                        <Select
                          value={filters.location}
                          onValueChange={(value) => setFilters(prev => ({ ...prev, location: value }))}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select location" />
                          </SelectTrigger>
                          <SelectContent>
                            {locations.map((location) => (
                              <SelectItem key={location} value={location}>
                                {location}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      {/* <div className="space-y-2">
                        <Label className="text-base">Event Type</Label>
                        <Select
                          value={filters.eventType}
                          onValueChange={(value) => setFilters(prev => ({ ...prev, eventType: value }))}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select Event Type" />
                          </SelectTrigger>
                          <SelectContent>
                            {eventTypes.map((eventType) => (
                              <SelectItem key={eventType} value={eventType}>
                                {eventType}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div> */}

                      <div className="space-y-2">
                        <Label className="text-base">Event Order</Label>
                        <Select
                          value={filters.eventOrder}
                          onValueChange={(value) => setFilters(prev => ({ ...prev, eventOrder: value }))}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select Event Order" />
                          </SelectTrigger>
                          <SelectContent>
                            {eventOrders.map((eventOrder) => (
                              <SelectItem key={eventOrder} value={eventOrder}>
                                {eventOrder}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-base">Event Month</Label>
                        <Select
                          value={filters.eventMonth}
                          onValueChange={(value) => setFilters(prev => ({ ...prev, eventMonth: value }))}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select Event Month" />
                          </SelectTrigger>
                          <SelectContent>
                            {months.map((month) => (
                              <SelectItem key={month?.value} value={month?.value}>
                                {month?.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>



                      {/* <div className="space-y-2">
                                              <Label className="text-sm"> {eventsType == "normal-events" ? "Min Available Packages " : eventsType == "year-events" ? "year-events" : "f1-events" ? "Min Available Packages" : ""}</Label>
                                              <div className="flex gap-4">
                                                <div className="flex-1">
                                                  <Input
                                                    type="number"
                                                    min="0"
                                                    placeholder="Min"
                                                    value={filters?.min_price}
                                                    onChange={(e) => {
                                                      const value = e.target.value;
                                                      if (value === "" || (!isNaN(value) && Number(value) >= 0)) {
                                                        setFilters((prev) => ({ ...prev, min_price: value }));
                                                      }
                                                    }}
                                                    className="w-full"
                                                  />
                                                </div>
                                            
                                              </div>
                                            </div> */}


                      <Button
                        className="w-full bg-[#BEA355] mt-6 rounded-full"
                        onClick={() => {
                          handleFilterChange();
                        }}
                      >
                        Apply Filters
                      </Button>
                    </div>
                  </ScrollArea>
                </SheetContent>
              </Sheet>

              <div className="flex flex-wrap gap-2">
                {activeFilters.map((filter, index) => {
                  const [filterName, filterValue] = filter.split(':');
                  return (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="px-3 py-1 flex items-center gap-1"
                    >
                      {filterName === "Month" ? `${filterName}: ${getMonthName(filterValue?.trim(),months)}` : filter}
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() => {
                          const [type] = filter.split(':');
                          switch (type) {
                            case 'Price':
                              setFilters(prev => ({ ...prev, min_price: "", max_price: "" }));
                              break;
                            case 'Guests':
                              setFilters(prev => ({ ...prev, min_guest: '', max_guest: '' }));
                              break;
                            case 'Location':
                              setFilters(prev => ({ ...prev, location: '' }));
                              break;
                            case 'Type':
                              setFilters(prev => ({ ...prev, eventType: '' }));
                              break; case 'Order':
                              setFilters(prev => ({ ...prev, eventOrder: '' }));
                              break; case 'Month':
                              setFilters(prev => ({ ...prev, eventMonth: '' }));
                              break;
                            case 'Categories':
                              setFilters(prev => ({ ...prev, category_name: [] }));
                              break;
                            case 'Boat Categories':
                              setFilters(prev => ({ ...prev, boat_category: [] }));
                              break;
                            case 'Type':
                              setFilters(prev => ({ ...prev, engine_type: '' }));
                              break;
                            case 'Length':
                              setFilters(prev => ({ ...prev, min_length: '', max_length: '' }));
                              break;
                            case 'Min No. of Cabins':
                              setFilters(prev => ({ ...prev, number_of_cabin: '' }));
                              break;
                            case 'Min Sleeping Capacity':
                              setFilters(prev => ({ ...prev, sleep_capacity: '' }));
                              break;
                            case 'Amenities':
                              setFilters(prev => ({ ...prev, amenities: [] }));
                              break;
                            case 'Outdoor Equipment':
                              setFilters(prev => ({ ...prev, outdoor_equipment: [] }));
                              break;
                            case 'Kitchen':
                              setFilters(prev => ({ ...prev, kitchen: [] }));
                              break;
                            case 'Onboard Energy':
                              setFilters(prev => ({ ...prev, energy: [] }));
                              break;
                            case 'Leisure Activities':
                              setFilters(prev => ({ ...prev, leisure: [] }));
                              break;
                            case 'Navigation Equipment':
                              setFilters(prev => ({ ...prev, navigation: [] }));
                              break;
                            case 'Extra Comforts':
                              setFilters(prev => ({ ...prev, extra_comforts: [] }));
                              break;
                            case 'Indoor Equipment':
                              setFilters(prev => ({ ...prev, indoor: [] }));
                              break;
                            case 'name':
                              setFilters(prev => ({ ...prev, name: "" }));
                              break;
                          }
                          setonCancelEachFilter(true);
                        }}
                      />
                    </Badge>

                  )


                })}
                {activeFilters.length > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={resetFilters}
                    className="text-sm"
                  >
                    Reset All
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
        {/* grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 place-items-center */}
        {/* Cards Grid */}
        {!mapBox ? <div className="grid grid-cols-1 gap-4 xs:grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 place-items-center my-8">
          {events.length > 0 ? (
            events.map((event, ind) => {
              if (!event) {
                return null;
              }
              // console.log(`https://api.takeoffyachts.com${event.event_image}`)
              return (
                <Card
                  key={`event-${event?.id}-${ind}`}
                  id={`event-${event?.id}-${ind}`}
                  className="overflow-hidden bg-white dark:bg-gray-800 rounded-2xl shadow-md w-full md:max-w-[250px]]  h-full md:min-h-[270px] min-h-[290px]"
                  ref={ind === events.length - 1 ? lastYachtRef : null}

                >
                  <div className="relative">
                    <Image
                      src={event.event_image
                        ? `${process.env.NEXT_PUBLIC_S3_URL}${event.event_image}`
                        : '/assets/images/Imagenotavailable.png'
                      }

                      alt={event.name || 'Event Image'}
                      width={100}
                      height={250}
                      className="object-cover w-full px-3 pt-3 rounded-2xl  md:h-[220px] h-[240px]"
                      onError={(e) => {
                        e.target.src = '/assets/images/Imagenotavailable.png'
                      }}
                    />

                    <Link href={`/dashboard/event/${eventsType}/${event.id}`}>
                      <p className="absolute inset-0 z-10"></p>
                    </Link>

                    <Button
                      variant="secondary"
                      size="icon"
                      className="absolute top-5 right-5 rounded-full bg-white hover:bg-white/80 z-10"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleWishlistToggle(event.id);
                      }}
                    >
                      <Image
                        src={favorites.has(event.id) ? '/assets/images/wishlist.svg' : '/assets/images/unwishlist.svg'}
                        width={20}
                        height={20}
                        alt="Wishlist"
                        className="text-red-500"
                      />
                    </Button>
                    <div className="absolute bottom-4 right-6 bg-white/80 dark:bg-gray-900 backdrop-blur-sm p-1.5 rounded-md">
                      <span className="text-xs font-medium">
                        {event?.packages_system?.length} Packages Available
                      </span>
                    </div>
                  </div>
                  <CardContent className="px-4 py-2">
                    <h3 className="text-md font-semibold mb-1">{event.name || 'Unnamed Event'}</h3>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {event.location || 'Location N/A'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                      {(event.description || '').substring(0, 24)}...
                    </p>
                  </CardContent>
                </Card>
              );
            })
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center py-12">
              <p className="text-gray-500 text-lg mb-4">No Events found</p>
              <Button
                variant="outline"
                onClick={resetFilters}
                className="gap-2"
              >
                <X className="h-4 w-4" />
                Reset Filters
              </Button>

            </div>
          )}

          {loading && (
            // Render skeleton UI
            Array.from({ length: 9 }).map((_, index) => (
              <Card
                key={`skeleton-${index}`}
                className="overflow-hidden bg-white dark:bg-gray-800 w-full max-w-[350px] rounded-2xl h-full min-h-[280px] shadow-lg animate-pulse"
              >
                <div className="relative">
                  <div className="bg-gray-200 dark:bg-gray-700 w-full h-[221px] rounded-t-2xl"></div>
                  <div className="absolute top-6 right-6 w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                  <div className="absolute bottom-4 right-6 w-24 h-8 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
                </div>

                <CardContent className="px-4 py-4 space-y-3">
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 w-2/3 rounded-md"></div>
                  <div className="flex justify-start items-center gap-2">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 w-16 rounded-md"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 w-16 rounded-md"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 w-16 rounded-md"></div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div> : <>
          <MapBoxComponent
            markers={validMarkers}
            movingObjects={validmovingObjects}

          // markers={[
          //   { latitude: 25.127476, longitude: 55.342584, yacht: selectedYacht?.yacht, eventsType },
          //   { latitude: 25.128476, longitude: 55.343584, yacht: selectedYacht?.yacht, eventsType },
          //   { latitude: 25.129476, longitude: 55.344584, yacht: selectedYacht?.yacht, eventsType },
          //   { latitude: 25.130476, longitude: 55.345584, yacht: selectedYacht?.yacht, eventsType },
          //   { latitude: 25.131476, longitude: 55.346584, yacht: selectedYacht?.yacht, eventsType },
          //   { latitude: 25.132476, longitude: 55.347584, yacht: selectedYacht?.yacht, eventsType },
          // ]}
          // validmovingObjects={[
          //   { id: 'obj1', name: 'Object 1', coordinates: [55.343584, 25.128476] },
          //   { id: 'obj2', name: 'Object 2', coordinates: [55.344584, 25.129476] },
          //   { id: 'obj3', name: 'Object 3', coordinates: [55.345584, 25.130476] },
          //   { id: 'obj4', name: 'Object 4', coordinates: [55.346584, 25.131476] },
          //   { id: 'obj5', name: 'Object 5', coordinates: [55.347584, 25.132476] },
          // ]}
          />
        </>}




        {/* <div className="fixed md:hidde bottom-0 left-0 w-full  shadow-md z-50 p-4">
          <div className="relative  flex justify-center">
            <Button
              onClick={() => setMapBox(!mapBox)}
              className="rounded-full bg-[#BEA355]  min-w-[100px] h-12 flex items-center gap-2 shadow-lg px-4"

            >
              {mapBox ? (
                <>
                  <List />
                  List
                </>
              ) : (
                <>
                  <Map /> Map
                </>
              )}
            </Button>

          </div>
        </div> */}
      </div>
    </section>
  );
};

export default SearchEventGlobalCompo;


// changes in:
// initialPayload
// router.push
// setFilters
// setFilter