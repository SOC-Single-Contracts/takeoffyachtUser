"use client";
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Dot, FilterIcon, MapPin, SortAscIcon } from 'lucide-react';
import Link from 'next/link';
import { fetchf1Yachts } from '@/api/yachts';
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

const PAGE_SIZE = 10;


const SimpleYacht = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [yachts, setYachts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [favorites, setFavorites] = useState(new Set());
  const [originalYachts, setOriginalYachts] = useState([]);
  const [onCancelEachFilter, setonCancelEachFilter] = useState(false);
  const observer = useRef();
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [allowFetching, setAllowFetching] = useState(true); // Prevent API spam
  const { yachtsType } = useParams();
  const [showSkeleton, setShowSkeleton] = useState(false);
  const { state, setFilter } = useGlobalState()
  const searchParams = useSearchParams();
  let searchPath = `/dashboard/${yachtsType == "f1yachts" ? "f1yachts" : "yachts"}`;
  const [totalYachts,settotalYachts] = useState(0)


  // console.log("yachtsType",yachtsType)
  const [filters, setFilters] = useState({
    min_price: "",
    max_price: "",
    min_guest: "",
    max_guest: "",
    sleep_capacity: "",
    capacity: "",
    location: "",
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
  });

  const initialFilterState = {
    min_price: "",
    max_price: "",
    min_guest: "",
    max_guest: "",
    sleep_capacity: "",
    capacity: "",
    location: "",
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
  const [apiCall,setapiCall] = useState("firstRender")



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

  const categories = ['Catamarans', 'Explorer Yacht', 'Ferries & Cruises', 'House Boat', 'Mega Yacht', 'Jet Ski', 'Open Yachts', 'Wake Surfing', 'Motor Yachts', 'House Yacht', 'Wedding Yacht', 'Trawler Yachts'];
  const locations = ['Dubai', 'Abu Dhabi', 'Sharjah'];
  const outdoorEquipment = [
    { name: 'Bath Towels', icon: '/assets/images/bathtowels.svg' },
    { name: 'Bathing Ladder', icon: '/assets/images/bathingladder.svg' },
    { name: 'Beach Towels', icon: '/assets/images/beachtowels.svg' },
    { name: 'Bathing Platform', icon: '/assets/images/bathingplatform.svg' },
    { name: 'Outdoor Table', icon: '/assets/images/outdoortable.svg' },
    { name: 'Aft Sundeck', icon: '/asssets/images/aftsundeck.svg' },
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
    { name: 'Air conditioning', icon: '/assets/images/Icon_AirConditioning.svg' },
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
    { name: 'Sound system', icon: '/assets/images/Icon_SoundSystem.svg' },
    { name: 'Speakers', icon: '/assets/images/Icon_Speakers.svg' }];

  const [activeFilters, setActiveFilters] = useState([]);

  const updateActiveFilters = () => {
    const newFilters = [];
    if (filters.min_price !== "" || filters.max_price !== "") {
      newFilters.push(`Price: ${filters.min_price}-${filters.max_price} AED`);
    }
    if (filters.min_guest || filters.max_guest) newFilters.push(`Guests: ${filters.min_guest}-${filters.max_guest}`);
    if (filters.location) newFilters.push(`Location: ${filters.location}`);
    if (filters.category_name.length) newFilters.push(`Categories: ${filters.category_name.length}`);
    if (filters.boat_category.length) newFilters.push(`Boat Categories: ${filters.boat_category.length}`);
    if (filters.engine_type) newFilters.push(`Type: ${filters.engine_type}`);
    if (filters.min_length) newFilters.push(`Length: ${filters.min_length}-${filters.max_length}ft`);
    if (filters.number_of_cabin) newFilters.push(`Min No. of Cabins: ${filters.number_of_cabin}`);
    if (filters.sleep_capacity) newFilters.push(`Min Sleeping Capacity: ${filters.sleep_capacity}`);
    if (filters.amenities.length) newFilters.push(`Amenities: ${filters.amenities.length}`); // Added amenities filter
    if (filters.outdoor_equipment.length) newFilters.push(`Outdoor Equipment: ${filters.outdoor_equipment.length}`); // Added outdoor equipment filter
    if (filters.kitchen.length) newFilters.push(`Kitchen: ${filters.kitchen.length}`); // Added kitchen filter
    if (filters.energy.length) newFilters.push(`Onboard Energy: ${filters.energy.length}`); // Added energy filter
    if (filters.leisure.length) newFilters.push(`Leisure Activities: ${filters.leisure.length}`); // Added leisure activities filter
    if (filters.navigation.length) newFilters.push(`Navigation Equipment: ${filters.navigation.length}`); // Added navigation equipment filter
    if (filters.extra_comforts.length) newFilters.push(`Extra Comforts: ${filters.extra_comforts.length}`); // Added extra comforts filter
    if (filters.indoor.length) newFilters.push(`Indoor Equipment: ${filters.indoor.length}`); // Added indoor equipment filter
    setActiveFilters(newFilters);
  };

  /// update filter on searchParams
  useEffect(() => {
    /// for this compo
    let obj = {
      location: searchParams.get('location') || "",
      max_guest: searchParams.get('guests') ? parseInt(searchParams.get('guests')) : "",
      min_guest: searchParams.get('min_guest') ? parseInt(searchParams.get('min_guest')) : "",
      min_price: searchParams.get('min_price') ? parseInt(searchParams.get('min_price')) : "",
      max_price: searchParams.get('max_price') ? parseInt(searchParams.get('max_price')) : "",
      sortBy: searchParams.get('sortBy') ? searchParams.get('sortBy') : "default",
      min_length: searchParams.get('min_length') ? parseInt(searchParams.get('min_length')) : "",
      max_length: searchParams.get('max_length') ? parseInt(searchParams.get('max_length')) : "",
      sleep_capacity: searchParams.get('sleep_capacity') ? parseInt(searchParams.get('sleep_capacity')) : "",
      number_of_cabin: searchParams.get('number_of_cabin') ? parseInt(searchParams.get('number_of_cabin')) : "",
      category_name: searchParams.get('category_name')
        ? JSON.parse(searchParams.get('category_name'))
        : [],
      outdoor_equipment: searchParams.get('outdoor_equipment')
        ? JSON.parse(searchParams.get('outdoor_equipment'))
        : [],
      navigation: searchParams.get('navigation')
        ? JSON.parse(searchParams.get('navigation'))
        : [],
      leisure: searchParams.get('leisure')
        ? JSON.parse(searchParams.get('leisure'))
        : [],
      kitchen: searchParams.get('kitchen')
        ? JSON.parse(searchParams.get('kitchen'))
        : [],
      indoor: searchParams.get('indoor')
        ? JSON.parse(searchParams.get('indoor'))
        : [],
      extra_comforts: searchParams.get('extra_comforts')
        ? JSON.parse(searchParams.get('extra_comforts'))
        : [],
      energy: searchParams.get('energy')
        ? JSON.parse(searchParams.get('energy'))
        : [],


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


  const handleFilterChange = async (type) => {

    if (!userId) return;
    if (!hasMore) return;

    let payload = {
      max_guest: parseInt(searchParams.get('guests')) || "",
      location: searchParams.get('location'),
      name: searchParams.get('name') || "",
      created_on: searchParams.get('date') || "",
      ...((searchParams.get('min_guest') && !isNaN(parseInt(searchParams.get('min_guest'))))
        ? { min_guest: parseInt(searchParams.get('min_guest')) }
        : {}),
      ...(yachtsType === "yachts"
        ? {
          min_per_hour: parseInt(searchParams.get('min_price')) || "",
          max_per_hour: parseInt(searchParams.get('max_price')) || "",
        }
        : yachtsType === "f1yachts"
          ? {
            min_per_day: parseInt(searchParams.get('min_price')) || "",
            max_per_day: parseInt(searchParams.get('max_price')) || "",
          }
          : {}),
      min_length: parseInt(searchParams.get('min_length')) || "",
      max_length: parseInt(searchParams.get('max_length')) || "",
      sleep_capacity: parseInt(searchParams.get('sleep_capacity')) || "",
      number_of_cabin: parseInt(searchParams.get('number_of_cabin')) || "",
      categories: searchParams.get('category_name')
        ? JSON.parse(searchParams.get('category_name'))
        : [],
      features: [
        ...(JSON.parse(searchParams.get('outdoor_equipment') || "[]")),
        ...(JSON.parse(searchParams.get('navigation') || "[]")),
        ...(JSON.parse(searchParams.get('leisure') || "[]")),
        ...(JSON.parse(searchParams.get('kitchen') || "[]")),
        ...(JSON.parse(searchParams.get('indoor') || "[]")),
        ...(JSON.parse(searchParams.get('extra_comforts') || "[]")),
        ...(JSON.parse(searchParams.get('energy') || "[]"))
      ]



    };
    if (type == "firstRender") {
      payload = {
        ...payload,
        source: "S",
        YachtType: yachtsType == "f1yachts" ? "f1yachts" : "regular",
        user_id: userId,
      };
      try {
        setLoading(true);

        let response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/yacht/check_yacht/?page=${page}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            "Referer": window.location.href

          },
          body: JSON.stringify(payload),
        });


        const responseData = await response.json();
        if (responseData.error_code === 'pass') {

          // Filter yachts based on price range
          // const filteredYachts = responseData.data.filter(item => {
          //   const price = item?.yacht?.per_hour_price;
          //   return price >= filters.min_price && price <= filters.max_price;
          // }); 
          const filteredYachts = responseData.data;
          settotalYachts(responseData?.total_yachts)

          // Sort the filtered yachts if needed
          const sortedYachts = filteredYachts?.sort((a, b) => {
            return a.yacht?.per_hour_price - b.yacht?.per_hour_price;
          });
          setOriginalYachts((prev) => [...prev, ...sortedYachts]);
          // if (sortedYachts?.length < PAGE_SIZE) setHasMore(false);
        } else {
          // setHasMore(false);
          setError(responseData.error || 'Failed to apply filters');
          console.error('API Error:', responseData.error);
        }
      } catch (err) {
        setError(err.message || 'Error applying filters');
        console.error('Filter error:', err);
      } finally {
        setLoading(false);
      }


    } else if (type == "normal") {
      payload = {
        ...payload,
        source: "simpleYacht",
        YachtType: yachtsType == "f1yachts" ? "f1yachts" : "regular",
        user_id: userId,
        ...(yachtsType === "yachts"
          ? {
            min_per_hour: filters?.min_price?.toString() || "",
            max_per_hour: filters?.max_price?.toString() || "",
          }
          : yachtsType === "f1yachts"
            ? {
              min_per_day: filters?.min_price?.toString() || "",
              max_per_day: filters?.max_price?.toString() || "",
            }
            : {}),
        guest: filters?.max_guest || "",
        min_guest: filters?.min_guest || "",
        max_guest: filters?.max_guest || "",
        sleep_capacity: filters?.sleep_capacity || "",
        number_of_cabin: filters?.number_of_cabin || "",
        categories: filters?.category_name || [],
        features: [
          ...(filters?.amenities || []),
          ...(filters?.outdoor_equipment || []),
          ...(filters?.kitchen || []),
          ...(filters?.energy || []),
          ...(filters?.leisure || []),
          ...(filters?.navigation || []),
          ...(filters?.extra_comforts || []),
          ...(filters?.indoor || [])
        ],
        price_asc: filters?.price_asc || false,
        price_des: filters?.price_des || false,
        cabin_asc: filters?.cabin_asc || false,
        cabin_des: filters?.cabin_des || false,
        created_on: filters?.created_on || "",
        location: filters?.location || "",
        min_length: filters?.min_length || "",
        max_length: filters?.max_length || "",
      };

      try {
        setLoading(true);

        let response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/yacht/check_yacht/?page=1`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            "Referer": window.location.href

          },
          body: JSON.stringify(payload),
        });


        const responseData = await response.json();
        if (responseData.error_code === 'pass') {

          // Filter yachts based on price range
          // const filteredYachts = responseData.data.filter(item => {
          //   const price = item?.yacht?.per_hour_price;
          //   return price >= filters.min_price && price <= filters.max_price;
          // }); 
          const filteredYachts = responseData.data;
          settotalYachts(responseData?.total_yachts)


          // Sort the filtered yachts if needed
          const sortedYachts = filteredYachts?.sort((a, b) => {
            return a.yacht?.per_hour_price - b.yacht?.per_hour_price;
          });
          setOriginalYachts([...sortedYachts]);
        } else {
          setError(responseData.error || 'Failed to apply filters');
          console.error('API Error:', responseData.error);
        }
      } catch (err) {
        setError(err.message || 'Error applying filters');
        console.error('Filter error:', err);
      } finally {
        setLoading(false);
        setPage(1)
        setapiCall("normal")
      }


      router.push(`${searchPath}?${new URLSearchParams({

        guests: filters?.max_guest,
        min_guest: filters?.min_guest,
        min_price: filters?.min_price,
        max_price: filters?.max_price,
        location: filters?.location,
        min_length: filters?.min_length,
        max_length: filters?.max_length,
        sleep_capacity: filters?.sleep_capacity,
        number_of_cabin: filters?.number_of_cabin,
        category_name: filters?.category_name?.length
          ? `["${filters.category_name.join('","')}"]`
          : "[]",
        outdoor_equipment: filters?.outdoor_equipment?.length
          ? `["${filters.outdoor_equipment.join('","')}"]`
          : "[]",
        navigation: filters?.navigation?.length
          ? `["${filters.navigation.join('","')}"]`
          : "[]",
        leisure: filters?.leisure?.length
          ? `["${filters.leisure.join('","')}"]`
          : "[]",
        kitchen: filters?.kitchen?.length
          ? `["${filters.kitchen.join('","')}"]`
          : "[]",
        indoor: filters?.indoor?.length
          ? `["${filters.indoor.join('","')}"]`
          : "[]",
        extra_comforts: filters?.extra_comforts?.length
          ? `["${filters.extra_comforts.join('","')}"]`
          : "[]",
        energy: filters?.energy?.length
          ? `["${filters.energy.join('","')}"]`
          : "[]",


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
    } else if (type == "hardReset") {
      let payloadHardReset = {
        source: "simpleYacht",
        YachtType: yachtsType == "f1yachts" ? "f1yachts" : "regular",
        user_id: userId,
      };
      try {
        setLoading(true);

        let response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/yacht/check_yacht/?page=1`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            "Referer": window.location.href

          },
          body: JSON.stringify(payloadHardReset),
        });


        const responseData = await response.json();
        if (responseData.error_code === 'pass') {

          // Filter yachts based on price range
          // const filteredYachts = responseData.data.filter(item => {
          //   const price = item?.yacht?.per_hour_price;
          //   return price >= filters.min_price && price <= filters.max_price;
          // }); 
          const filteredYachts = responseData.data;
          settotalYachts(responseData?.total_yachts)


          // Sort the filtered yachts if needed
          const sortedYachts = filteredYachts?.sort((a, b) => {
            return a.yacht?.per_hour_price - b.yacht?.per_hour_price;
          });
          setOriginalYachts([...sortedYachts]);
          // if (sortedYachts?.length < PAGE_SIZE) setHasMore(false);
        } else {
          // setHasMore(false);
          setError(responseData.error || 'Failed to apply filters');
          console.error('API Error:', responseData.error);
        }
      } catch (err) {
        setError(err.message || 'Error applying filters');
        console.error('Filter error:', err);
      } finally {
        setLoading(false);
      }
      router.push(`${searchPath}?${new URLSearchParams({
        guests: "",
        min_guest: "",
        min_price: "",
        max_price: "",
        location: "",
        min_length: "",
        max_length: "",
        sleep_capacity: "",
        number_of_cabin: "",
        category_name: "[]",
        outdoor_equipment: "[]",
        navigation: "[]",
        leisure: "[]",
        kitchen: "[]",
        indoor: "[]",
        extra_comforts: "[]",
        energy: "[]",
      }).toString()}`);

      
    }
    setIsOpen(false);
  };


  // "hitApiCall" on first render and when scroll page
  useEffect(() => {
    // console.log("this is working")
    if(apiCall=="firstRender"){
      handleFilterChange("firstRender");
    }
  }, [page]);
  //page

  // hitApiCall Modify resetFilters function
  const resetFilters = () => {
    setFilters(initialFilterState);
    handleFilterChange("hardReset");
  };


  // "hitApiCall" onCancelEachFilter
  useEffect(() => {
    if (onCancelEachFilter) {
      handleFilterChange("normal");
      setonCancelEachFilter(false);
    }
  }, [filters, onCancelEachFilter]);

  const handleWishlistToggle = async (yachtId) => {
    if (!userId) return;

    const updatedFavorites = new Set(favorites);
    try {
      if (updatedFavorites.has(yachtId)) {
        await removeFromWishlist(userId, yachtId, 'yacht');
        updatedFavorites.delete(yachtId);
      } else {
        await addToWishlist(userId, yachtId, 'yacht');
        updatedFavorites.add(yachtId);
      }

      setFavorites(updatedFavorites);
    } catch (error) {
      console.error('Error toggling wishlist:', error);
    }
  };
  ///sorting
  useEffect(() => {

    // if (!startSort) {
    //   return;
    // }
    if (yachts.length <= 0 || originalYachts.length <= 0) {
      return;
    }

    let data = [...yachts];
    if (selectedOption?.value === "default") {
      data = [...originalYachts];
    }
    else if (selectedOption?.value === "Price-High-Low") {
      if (yachtsType === "yachts") {
        data.sort((a, b) => (b.yacht?.per_hour_price) - (a.yacht?.per_hour_price));
      } else if (yachtsType === "f1yachts") {
        data.sort((a, b) => (b.yacht?.per_day_price) - (a.yacht?.per_day_price));
      }
    }
    else if (selectedOption?.value === "Price-Low-High") {
      if (yachtsType === "yachts") {
        data.sort((a, b) => (a.yacht?.per_hour_price) - (b.yacht?.per_hour_price));
      } else if (yachtsType === "f1yachts") {
        data.sort((a, b) => (a.yacht?.per_day_price) - (b.yacht?.per_day_price));
      }
    }
    else if (selectedOption?.value === "Capacity-High-Low") {
      data.sort((a, b) => b.yacht?.guest - a.yacht?.guest);
    } else if (selectedOption?.value === "Capacity-Low-High") {
      data.sort((a, b) => a.yacht?.guest - b.yacht?.guest);
    }

    if (JSON.stringify(data) !== JSON.stringify(yachts)) {
      setYachts(data);
    }
  }, [selectedOption]);
  /// set orignial yachts to yachts
  useEffect(() => {
    let data = [...originalYachts]
    setYachts(data)
  }, [originalYachts]);

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
            setapiCall("firstRender")
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
    [hasMore, allowFetching, setPage]
  );
  /// for scroll position
  useEffect(() => {
    if (yachts.length > 0) {
      setAllowFetching(false);

      setTimeout(() => {
        const middleIndex = Math.floor(yachts.length * 0.75);
        const middleYacht = document.getElementById(`yacht-${yachts[middleIndex]?.yacht?.id}`);

        // // Smoothly scroll to the middle yacht if needed
        // if (middleYacht) {
        //   middleYacht.scrollIntoView({ behavior: "smooth", block: "end" });
        // }

        setAllowFetching(true);
      }, 100);
    }
  }, [yachts.length]);



  ///test

  // useEffect(() => {
  //   console.log("yachts", yachts);
  // }, [yachts]);
  // useEffect(() => {
  //   console.log("filters", filters);
  // }, [filters]);
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
          <p className="text-red-500">Error loading yachts: {error}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-4 px-2">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-semibold mb-6">
          Listing ({totalYachts}) {yachtsType === "f1yachts" ? "f1 yachts" : yachtsType === "yachts" ? "Regular yachts" : ""}
        </h1>
        <h1 className="md:text-4xl text-3xl font-bold mb-6">Our Fleet</h1>

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
                      <Select value={selectedSortBy} onValueChange={handleChange}>
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
                      </Select>
                    </div>

                  </span>
                </div>

                <SheetContent side="left" className="w-full sm:w-[540px]">
                  <SheetHeader>
                    <SheetTitle>Filters</SheetTitle>
                  </SheetHeader>
                  <ScrollArea className="h-[calc(100vh-80px)] px-2">
                    <Button
                      className="w-full bg-[#BEA355] mt-6 rounded-full"
                      onClick={() => {
                        handleFilterChange("normal");
                      }}
                    >
                      Show Results
                    </Button>
                    <div className="space-y-6 py-6 px-1">
                      {/* Price Range */}
                      <div className="space-y-2">
                        <Label className="text-sm"> {yachtsType == "yachts" ? "Price Per Hour (AED) " : yachtsType == "f1yachts" ? "Price Per Day (AED) " : ""}</Label>
                        <div className="flex gap-4">
                          <div className="flex-1">
                            <Input
                              type="number"
                              min="0"
                              placeholder="Min"
                              value={filters.min_price}
                              onChange={(e) => {
                                const value = e.target.value;
                                if (value === "" || (!isNaN(value) && Number(value) >= 0)) {
                                  setFilters((prev) => ({ ...prev, min_price: value }));
                                }
                              }}
                              className="w-full"
                            />
                          </div>
                          <div className="flex-1">
                            <Input
                              type="number"
                              min="0"
                              placeholder="Max"
                              value={filters.max_price}
                              onChange={(e) => {
                                const value = e.target.value;
                                if (value === "" || (!isNaN(value) && Number(value) >= 0)) {
                                  setFilters((prev) => ({ ...prev, max_price: value }));
                                }
                              }}
                              className="w-full"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Guest Capacity */}
                      <div className="space-y-2">
                        <Label className="text-sm">Guest Capacity</Label>
                        <div className="flex gap-4">
                          <div className="flex-1">
                            <Input
                              type="number"
                              min="0"
                              placeholder="Min"
                              value={filters.min_guest}
                              onChange={(e) => {
                                const value = e.target.value;
                                if (value === "" || (!isNaN(value) && Number(value) >= 0)) {
                                  setFilters((prev) => ({ ...prev, min_guest: value }));
                                }
                              }}
                              className="w-full"
                            />
                          </div>
                          <div className="flex-1">
                            <Input
                              type="number"
                              min="0"
                              placeholder="Max"
                              value={filters.max_guest}
                              onChange={(e) => {
                                const value = e.target.value;
                                if (value === "" || (!isNaN(value) && Number(value) >= 0)) {
                                  setFilters((prev) => ({ ...prev, max_guest: value }));
                                }
                              }}
                              className="w-full"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Boat Length */}
                      <div className="space-y-2">
                        <Label className="text-sm">Boat Length (ft)</Label>
                        <div className="flex gap-4">
                          <div className="flex-1">
                            <Input
                              type="number"
                              min="0"
                              placeholder="Min ft"
                              value={filters.min_length}
                              onChange={(e) => {
                                const value = e.target.value;
                                if (value === "" || (!isNaN(value) && Number(value) >= 0)) {
                                  setFilters((prev) => ({ ...prev, min_length: value }));
                                }
                              }}
                              className="w-full"
                            />
                          </div>
                          <div className="flex-1">
                            <Input
                              type="number"
                              min="0"
                              placeholder="Max ft"
                              value={filters.max_length}
                              onChange={(e) => {
                                const value = e.target.value;
                                if (value === "" || (!isNaN(value) && Number(value) >= 0)) {
                                  setFilters((prev) => ({ ...prev, max_length: value }));
                                }
                              }}
                              className="w-full"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Min Sleeping Capacity */}
                      <div className="space-y-2 flex justify-between items-center">
                        <Label className="text-sm">Min. Sleeping Capacity</Label>
                        <div className="flex items-center gap-4">
                          <Button
                            onClick={() => setFilters(prev => ({ ...prev, sleep_capacity: Math.max(0, (prev.sleep_capacity || 0) - 1) }))}
                            className="bg-gray-400 rounded-md px-2"
                          >
                            -
                          </Button>
                          <Input
                            type="number"
                            min="0"
                            // value={filters.sleep_capacity || 0}
                            // onChange={(e) => setFilters(prev => ({ ...prev, sleep_capacity: Math.max(0, parseInt(e.target.value) || 0) }))}
                            value={filters.sleep_capacity === undefined ? "" : filters.sleep_capacity}
                            onChange={(e) => {
                              const value = e.target.value;
                              setFilters(prev => ({
                                ...prev,
                                sleep_capacity: value === "" ? undefined : Math.max(0, parseInt(value)) // Allow empty input and set to undefined
                              }));
                            }}
                            className="w-16 text-center"
                          />
                          <Button
                            onClick={() => setFilters(prev => ({ ...prev, sleep_capacity: (prev.sleep_capacity || 0) + 1 }))}
                            className="bg-gray-400 rounded-md px-2"
                          >
                            +
                          </Button>
                        </div>
                      </div>

                      {/* Min No. of Cabins */}
                      <div className="space-y-2 flex justify-between items-center">
                        <Label className="text-sm">Min. No. of Cabins</Label>
                        <div className="flex items-center gap-4">
                          <Button
                            onClick={() => setFilters(prev => ({ ...prev, number_of_cabin: Math.max(0, (prev.number_of_cabin || 0) - 1) }))}
                            className="bg-gray-400 rounded-md px-2"
                          >
                            -
                          </Button>
                          <Input
                            type="number"
                            min="0"
                            // value={filters.number_of_cabin || 0}
                            // onChange={(e) => setFilters(prev => ({ ...prev, number_of_cabin: Math.max(0, parseInt(e.target.value) || 0) }))}
                            value={filters.number_of_cabin === undefined ? "" : filters.number_of_cabin}
                            onChange={(e) => {
                              const value = e.target.value;
                              setFilters(prev => ({
                                ...prev,
                                number_of_cabin: value === "" ? undefined : Math.max(0, parseInt(value)) // Allow empty input and set to undefined
                              }));
                            }}
                            className="w-16 text-center"
                          />
                          <Button
                            onClick={() => setFilters(prev => ({ ...prev, number_of_cabin: (prev.number_of_cabin || 0) + 1 }))}
                            className="bg-gray-400 rounded-md px-2"
                          >
                            +
                          </Button>
                        </div>
                      </div>

                      {/* Location */}
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

                      {/* Boat Categories */}
                      <Accordion collapsible type="multiple">
                        <AccordionItem value="item-1">
                          <AccordionTrigger className="text-base">Boat Categories</AccordionTrigger>
                          <AccordionContent>
                            <div className="grid grid-cols-2 gap-4">
                              {categories.map((category) => (
                                <div key={category} className="flex items-center space-x-2">
                                  <Checkbox
                                    id={category}
                                    checked={filters.category_name.includes(category)}
                                    onCheckedChange={(checked) => {
                                      setFilters(prev => ({
                                        ...prev,
                                        category_name: checked
                                          ? [...prev.category_name, category]
                                          : prev.category_name.filter(c => c !== category)
                                      }));
                                    }}
                                  />
                                  <label htmlFor={category} className="text-sm">{category}</label>
                                </div>
                              ))}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>

                      <Accordion collapsible type="multiple">
                        <AccordionItem value="item-2">
                          <AccordionTrigger className="text-base">Amenities & Features</AccordionTrigger>
                          <AccordionContent>
                            <Accordion collapsible type="multiple">
                              <AccordionItem value="outdoor-equipment">
                                <AccordionTrigger className="">Outdoor Equipment</AccordionTrigger>
                                <AccordionContent>
                                  <div className="space-y-3">
                                    <div className="space-y-3">
                                      {outdoorEquipment.map(({ name, icon }) => (
                                        <div key={name} className="flex items-center justify-between space-x-2">
                                          <div className="flex items-center space-x-2">
                                            <Image src={icon} alt={`${name} icon`} width={25} height={25}
                                            //  className="w-5 h-5"
                                            />
                                            <label htmlFor={name} className="text-sm">{name}</label>
                                          </div>
                                          <Checkbox
                                            id={name}
                                            checked={filters.outdoor_equipment.includes(name)}
                                            onCheckedChange={(checked) => {
                                              setFilters(prev => ({
                                                ...prev,
                                                outdoor_equipment: checked
                                                  ? [...prev.outdoor_equipment, name]
                                                  : prev.outdoor_equipment.filter(e => e !== name)
                                              }));
                                            }}
                                          />

                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </AccordionContent>
                              </AccordionItem>

                              <AccordionItem value="kitchen">
                                <AccordionTrigger>Kitchen</AccordionTrigger>
                                <AccordionContent>
                                  <div className="space-y-3">
                                    {kitchenOptions.map((option) => (
                                      <div key={option.name} className="flex items-center justify-between space-x-2">
                                        <div className="flex items-center space-x-2">
                                          <Image src={option.icon} alt={`${option.name} icon`} width={25} height={25}
                                          //  className="w-5 h-5"
                                          />
                                          <label htmlFor={option.name} className="text-sm">{option.name}</label>
                                        </div>
                                        <Checkbox
                                          id={option.name}
                                          checked={filters.kitchen.includes(option.name)}
                                          onCheckedChange={(checked) => {
                                            setFilters(prev => ({
                                              ...prev,
                                              kitchen: checked
                                                ? [...prev.kitchen, option.name]
                                                : prev.kitchen.filter(k => k !== option.name)
                                            }));
                                          }}
                                        />
                                      </div>
                                    ))}
                                  </div>
                                </AccordionContent>
                              </AccordionItem>

                              <AccordionItem value="onboard-energy">
                                <AccordionTrigger>Onboard Energy</AccordionTrigger>
                                <AccordionContent>
                                  <div className="space-y-3">
                                    {energyOptions.map((option) => (
                                      <div key={option.name} className="flex items-center justify-between space-x-2">
                                        <div className="flex items-center space-x-2">
                                          <Image src={option.icon} alt={`${option.name} icon`} width={25} height={25}
                                          //  className="w-5 h-5"
                                          />
                                          <label htmlFor={option.name} className="text-sm">{option.name}</label>
                                        </div>
                                        <Checkbox
                                          id={option.name}
                                          checked={filters.energy.includes(option.name)}
                                          onCheckedChange={(checked) => {
                                            setFilters(prev => ({
                                              ...prev,
                                              energy: checked
                                                ? [...prev.energy, option.name]
                                                : prev.energy.filter(e => e !== option.name)
                                            }));
                                          }}
                                        />
                                      </div>
                                    ))}
                                  </div>
                                </AccordionContent>
                              </AccordionItem>

                              <AccordionItem value="leisure-activities">
                                <AccordionTrigger>Leisure Activities</AccordionTrigger>
                                <AccordionContent>
                                  <div className="space-y-3">
                                    {leisureActivities.map((activity) => (
                                      <div key={activity.name} className="flex items-center justify-between space-x-2">
                                        <div className="flex items-center space-x-2">
                                          <Image src={activity.icon} alt={`${activity.name} icon`} width={25} height={25}
                                          // className="w-5 h-5"
                                          />
                                          <label htmlFor={activity.name} className="text-sm">{activity.name}</label>
                                        </div>
                                        <Checkbox
                                          id={activity.name}
                                          checked={filters.leisure.includes(activity.name)}
                                          onCheckedChange={(checked) => {
                                            setFilters(prev => ({
                                              ...prev,
                                              leisure: checked
                                                ? [...prev.leisure, activity.name]
                                                : prev.leisure.filter(a => a !== activity.name)
                                            }));
                                          }}
                                        />
                                      </div>
                                    ))}
                                  </div>
                                </AccordionContent>
                              </AccordionItem>

                              <AccordionItem value="navigation-equipment">
                                <AccordionTrigger>Navigation Equipment</AccordionTrigger>
                                <AccordionContent>
                                  <div className="space-y-3">
                                    {navigationEquipment.map((equipment) => (
                                      <div key={equipment.name} className="flex items-center justify-between space-x-2">
                                        <div className="flex items-center space-x-2">
                                          <Image src={equipment.icon} alt={`${equipment.name} icon`} width={25} height={25}
                                          //  className="w-5 h-5"
                                          />
                                          <label htmlFor={equipment.name} className="text-sm">{equipment.name}</label>
                                        </div>
                                        <Checkbox
                                          id={equipment.name}
                                          checked={filters.navigation.includes(equipment.name)}
                                          onCheckedChange={(checked) => {
                                            setFilters(prev => ({
                                              ...prev,
                                              navigation: checked
                                                ? [...prev.navigation, equipment.name]
                                                : prev.navigation.filter(e => e !== equipment.name)
                                            }));
                                          }}
                                        />
                                      </div>
                                    ))}
                                  </div>
                                </AccordionContent>
                              </AccordionItem>

                              <AccordionItem value="extra-comforts">
                                <AccordionTrigger>Extra Comforts</AccordionTrigger>
                                <AccordionContent>
                                  <div className="space-y-3">
                                    {extraComforts.map((comfort) => (
                                      <div key={comfort.name} className="flex items-center justify-between space-x-2">
                                        <div className="flex items-center space-x-2">
                                          <Image src={comfort.icon} alt={`${comfort.name} icon`} width={25} height={25}
                                          //  className="w-5 h-5"
                                          />
                                          <label htmlFor={comfort.name} className="text-sm">{comfort.name}</label>
                                        </div>
                                        <Checkbox
                                          id={comfort.name}
                                          checked={filters.extra_comforts.includes(comfort.name)}
                                          onCheckedChange={(checked) => {
                                            setFilters(prev => ({
                                              ...prev,
                                              extra_comforts: checked
                                                ? [...prev.extra_comforts, comfort.name]
                                                : prev.extra_comforts.filter(c => c !== comfort.name)
                                            }));
                                          }}
                                        />
                                      </div>
                                    ))}
                                  </div>
                                </AccordionContent>
                              </AccordionItem>

                              <AccordionItem value="indoor-equipment">
                                <AccordionTrigger>Indoor Equipment</AccordionTrigger>
                                <AccordionContent>
                                  <div className="space-y-3">
                                    {indoorEquipment.map((equipment) => (
                                      <div key={equipment.name} className="flex items-center justify-between space-x-2">
                                        <div className="flex items-center space-x-2">
                                          <Image src={equipment.icon} alt={`${equipment.name} icon`} width={25} height={25}
                                          //  className="w-5 h-5"
                                          />
                                          <label htmlFor={equipment.name} className="text-sm">{equipment.name}</label>
                                        </div>
                                        <Checkbox
                                          id={equipment.name}
                                          checked={filters.indoor.includes(equipment.name)}
                                          onCheckedChange={(checked) => {
                                            setFilters(prev => ({
                                              ...prev,
                                              indoor: checked
                                                ? [...prev.indoor, equipment.name]
                                                : prev.indoor.filter(e => e !== equipment.name)
                                            }));
                                          }}
                                        />
                                      </div>
                                    ))}
                                  </div>
                                </AccordionContent>
                              </AccordionItem>
                            </Accordion>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>

                      <Button
                        className="w-full bg-[#BEA355] mt-6 rounded-full"
                        onClick={() => {
                          handleFilterChange("normal");
                        }}
                      >
                        Show Results
                      </Button>
                    </div>
                  </ScrollArea>
                </SheetContent>
              </Sheet>

              <div className="flex flex-wrap gap-2">
                {activeFilters.map((filter, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="px-3 py-1 flex items-center gap-1"
                  >
                    {filter}
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
                        }
                        setonCancelEachFilter(true);
                      }}
                    />
                  </Badge>
                ))}
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

        {/* Cards Grid */}
        <div className="grid grid-cols-1 gap-4 xs:grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 place-items-center my-8">
          {showSkeleton ? (
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
          ) : (
            yachts.length > 0 ? (
              yachts.map((item, ind) => {
                if (!item || !item?.yacht) return null;
                const images = [
                  item?.yacht?.yacht_image,
                  item?.yacht?.image1,
                  item?.yacht?.image2,
                  item?.yacht?.image3,
                  item?.yacht?.image4,
                  item?.yacht?.image5,
                  item?.yacht?.image6,
                  item?.yacht?.image7,
                  item?.yacht?.image8,
                  item?.yacht?.image9,
                  item?.yacht?.image10,
                  item?.yacht?.image11,
                  item?.yacht?.image12,
                  item?.yacht?.image13,
                  item?.yacht?.image14,
                  item?.yacht?.image15,
                  item?.yacht?.image16,
                  item?.yacht?.image17,
                  item?.yacht?.image18,
                  item?.yacht?.image19,
                  item?.yacht?.image20,
                ].filter((image) => typeof image === "string" && image.trim() !== "");
                const daysCount = calculateDaysBetween(item?.yacht?.from_date, item?.yacht?.to_date);

                return (
                  <Card
                    key={item?.yacht?.id}
                    id={`yacht-${item?.yacht?.id}`}
                    className="overflow-hidden bg-white dark:bg-gray-800 w-full md:max-w-[350px] rounded-2xl h-full md:min-h-[280px] min-h-[300px] shadow-lg hover:shadow-2xl transition duration-500 ease-in-out"
                    ref={ind === yachts.length - 1 ? lastYachtRef : null}
                  >
                    <div className="relative">
                      <Carousel className="">
                        <CarouselContent>
                          {images.length > 0 ? (
                            images.map((image, index) => (
                              <CarouselItem key={index}>
                                <Image
                                  src={image ? `https://images-yacht.s3.us-east-1.amazonaws.com${image}` : '/assets/images/fycht.jpg'}
                                  alt="not found"
                                  width={326}
                                  height={300}
                                  className="object-cover px-4 pt-3 rounded-3xl w-full md:h-[221px] h-[240px] ml-1.5"
                                  onError={(e) => {
                                    e.target.src = '/assets/images/fycht.jpg';
                                  }}
                                  priority={true}
                                />
                              </CarouselItem>
                            ))
                          ) : (
                            <CarouselItem>
                              <Image
                                src="/assets/images/fycht.jpg"
                                alt="fallback image"

                                width={326}
                                height={300}
                                className="object-cover px-4 pt-3 rounded-3xl w-full md:h-[221px] h-[240px] ml-1.5"
                              />
                            </CarouselItem>

                          )}
                        </CarouselContent>
                        <CarouselPrevious className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10">
                          <Button variant="icon" onClick={(e) => e.stopPropagation()}>
                            <ChevronLeft />
                          </Button>
                        </CarouselPrevious>
                        <CarouselNext className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10">
                          <Button variant="icon" onClick={(e) => e.stopPropagation()}>
                            <ChevronRight />
                          </Button>
                        </CarouselNext>
                        <CarouselDots />
                      </Carousel>

                      <Button
                        variant="secondary"
                        size="icon"
                        className="absolute top-6 right-6 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white"
                        onClick={() => handleWishlistToggle(item?.yacht?.id)}
                      >
                        <Image
                          src={favorites.has(item?.yacht?.id)
                            ? "/assets/images/wishlist.svg"
                            : "/assets/images/unwishlist.svg"
                          }
                          alt="wishlist"
                          width={20}
                          height={20}
                        />
                      </Button>

                      <div className="absolute bottom-2 right-5 bg-white dark:bg-gray-800 p-[0.3rem] rounded-md shadow-md">

                        {yachtsType == "yachts" ? <span className="font-medium text-xs">
                          AED <span className="font-bold font-medium text-primary">{item?.yacht?.per_hour_price}</span>
                          <span className="text-xs font-light ml-1">/Hour</span>
                        </span> : yachtsType == "f1yachts" ? <span className="font-medium text-xs">
                          AED <span className="font-bold font-medium text-primary">{item?.yacht?.per_day_price}</span>
                          <span className="text-xs font-light ml-1">{`/${daysCount} ${daysCount === 1 ? 'Day' : 'Days'}`}                          </span>
                        </span> : ""}

                      </div>
                    </div>
                    <Link href={`/dashboard/${yachtsType}/${item?.yacht?.id}`}>
                      <CardContent className="px-4 py-2">
                        <p className="text-xs font-light bg-[#BEA355]/30 text-black dark:text-white rounded-md px-1 py-0.5 w-auto inline-flex items-center">
                          <MapPin className="size-3 mr-1" /> {item?.yacht?.location || "Location Not Available"}
                        </p>
                        <div className="flex justify-between items-center">
                          <h3 className="text-[20px] font-semibold mb-1 truncate max-w-[230px]">{item?.yacht?.name}</h3>
                          {yachtsType == "yachts" ?         <span className="font-medium text-xs">
                            AED <span className="font-bold text-sm text-primary">{item?.yacht?.per_day_price}</span>
                            <span className="text-xs font-light ml-1">/Day</span>
                          </span> : yachtsType == "f1yachts" ?         <span className="font-medium text-xs">
                            AED <span className="font-bold text-sm text-primary">{item?.yacht?.per_day_price}</span>
                            <span className="text-xs font-light ml-1">{`/${daysCount} ${daysCount === 1 ? 'Day' : 'Days'}`}  </span>
                          </span> : ""}
                 
                        </div>
                        <div className="flex justify-start items-center gap-1 flex-wrap">
                          <Image src="/assets/images/transfer.svg" alt="length" width={9} height={9} className="" />
                          <p className="font-semibold text-xs">{item?.yacht?.length || 0} ft</p>
                          <Dot />
                          <div className="text-center font-semibold flex items-center text-xs space-x-2">
                            <Image src="/assets/images/person.svg" alt="length" width={8} height={8} className="dark:invert" />
                            <p>Guests</p>
                            <p>{item?.yacht?.guest || 0}</p>
                          </div>
                          <Dot />
                          <div className="text-center font-semibold flex items-center text-xs space-x-2">
                            <Image src="/assets/images/cabin.svg" alt="length" width={8} height={8} className="dark:invert" />
                            <p>Cabins</p>
                            <p>{item?.yacht?.number_of_cabin || 0}</p>
                          </div>
                        </div>

                      </CardContent>
                    </Link>
                  </Card>
                );
              })
            ) : (
              <div className="col-span-full flex flex-col items-center justify-center py-12">
                <p className="text-gray-500 text-lg mb-4">No yachts found</p>
                <Button
                  variant="outline"
                  onClick={resetFilters}
                  className="gap-2"
                >
                  <X className="h-4 w-4" />
                  Reset Filters
                </Button>

              </div>
            )
          )}
        </div>
      </div>
    </section>
  );
};

export default SimpleYacht;


// changes in:
// initialPayload
// router.push
// setFilters
// setFilter