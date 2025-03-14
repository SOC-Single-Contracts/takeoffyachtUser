"use client";
import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Dot, FilterIcon, MapPin, SortAscIcon } from 'lucide-react';
import Link from 'next/link';
import { fetchYachts } from '@/api/yachts';
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
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import SearchResults from './mainSearch';
import { Loading } from '@/components/ui/loading';
import YachtCard from '@/components/yachts/YachtCard';
import { useSearchParams } from 'next/navigation';
import EmptySearch from '@/components/shared/EmptySearch';
import yachtApi from '@/services/api';
import { format } from 'date-fns';
import SearchFilter from '@/components/lp/shared/SearchFilter';

const SearchYacht = () => {
    const { data: session } = useSession();
    const searchParams = useSearchParams();
    const [yachts, setYachts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [favorites, setFavorites] = useState(new Set());
    const [originalYachts, setOriginalYachts] = useState([]);
    const [startFilterWork, setStartFilterWork] = useState(false)
    const [onCancelEachFilter, setonCancelEachFilter] = useState(false);
    const [filters, setFilters] = useState({
        min_price: 1000,
        max_price: 4000,
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
        min_price: 1000,
        max_price: 4000,
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
    const sortByOptions = [
        { value: "default", label: "Default" },
        { value: "Price-High-Low", label: "Price: High to Low" },
        { value: "Price-Low-High", label: "Price: Low to High" },
        { value: "Capacity-High-Low", label: "Capacity: High to Low" },
        { value: "Capacity-Low-High", label: "Capacity: Low to High" }
    ];

    const [selectedSortBy, setSelectedSortBy] = useState("default");
    const [startSort, setStartSort] = useState(false);

    const handleChange = (value) => {
        setStartSort(true)
        setSelectedSortBy(value);
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
        { name: 'VHF', icon: '/assets/images/Icon_VHF.svg' },
        { name: 'Dinghy', icon: '/assets/images/Icon_Dinghy.svg' },
        { name: 'Dinghy’s motor', icon: '/assets/images/Icon_Dinghysmotor.svg' },
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
        if (filters.min_price !== 1000 || filters.max_price !== 4000) {
            newFilters.push(`Price: ${filters.min_price}-${filters.max_price} AED`);
        }
        if (filters.min_guest) newFilters.push(`Guests: ${filters.min_guest}-${filters.max_guest}`);
        if (filters.location) newFilters.push(`Location: ${filters.location}`);
        if (filters.category_name.length) newFilters.push(`Categories: ${filters.category_name.length}`);
        if (filters.boat_category.length) newFilters.push(`Boat Categories: ${filters.boat_category.length}`);
        if (filters.engine_type) newFilters.push(`Type: ${filters.engine_type}`);
        if (filters.min_length) newFilters.push(`Length: ${filters.min_length}-${filters.max_length}m`);
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

    useEffect(() => {
        updateActiveFilters();
    }, [filters]);

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

        loadWishlist();
    }, [userId]);
    //hit
    const handleFilterChange = async (type) => {
        if (!userId) return;

        let payload = {
            user_id: session?.user?.userid || 1,
            guest: parseInt(searchParams.get('guests')) || 1,
            location: searchParams.get('location'),
            capacity: parseInt(searchParams.get('guests')) || 1,
            name: searchParams.get('name') || "",
            created_on: searchParams.get('date') || "",
        };
        if (type == "reset&FirstRender") {
            console.log("ifff")
            payload = {
                ...payload,
                user_id: userId,

            };
        } else {
            console.log("else")
            payload = {
                ...payload, user_id: userId,
                min_per_hour: filters.min_price.toString(),
                max_per_hour: filters.max_price.toString(),
                guest: filters.max_guest,
                min_guest: filters?.min_guest,
                max_guest: filters?.max_guest,
                sleep_capacity: filters.sleep_capacity,
                number_of_cabin: filters.number_of_cabin,
                categories: filters.category_name,
                features: [
                    ...filters.amenities,  // Include amenities first
                    ...filters.outdoor_equipment,  // Include outdoor equipment
                    ...filters.kitchen,  // Include kitchen
                    ...filters.energy,  // Include energy
                    ...filters.leisure,  // Include leisure
                    ...filters.navigation,  // Include navigation
                    ...filters.extra_comforts,  // Include extra comforts
                    ...filters.indoor  // Include indoor
                ],
                price_asc: filters.price_asc,
                price_des: filters.price_des,
                cabin_asc: filters.cabin_asc,
                cabin_des: filters.cabin_des,
                location: filters?.location,
                min_length: filters.min_length,
                max_length: filters.max_length,
            };
        }


        try {
            setLoading(true);
            const response = await fetch('https://api.takeoffyachts.com/yacht/check_yacht/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            console.log("how many times")
            const responseData = await response.json();
            if (responseData.error_code === 'pass') {

                // Filter yachts based on price range
                // const filteredYachts = responseData.data.filter(item => {
                //   const price = item.yacht.per_hour_price;
                //   return price >= filters.min_price && price <= filters.max_price;
                // }); 
                const filteredYachts = responseData.data;


                // Sort the filtered yachts if needed
                const sortedYachts = filteredYachts?.sort((a, b) => {
                    return a.yacht.per_hour_price - b.yacht.per_hour_price;
                });
                setOriginalYachts(sortedYachts)
            } else {
                setError(responseData.error || 'Failed to apply filters');
                console.error('API Error:', responseData.error);
            }
        } catch (err) {
            setError(err.message || 'Error applying filters');
            console.error('Filter error:', err);
        } finally {
            setLoading(false);
        }
    };

    const resetFilters = () => {
        setFilters(initialFilterState);
    };


    useEffect(() => {
        // console.log(JSON.stringify(filters))
        if (JSON.stringify(filters) === JSON.stringify(initialFilterState)) {
            handleFilterChange("reset&FirstRender");
        }
    }, [filters, searchParams, session]);
    // call onCancelEachFilter
    useEffect(() => {
        if (onCancelEachFilter) {
            console.log("its call")
            handleFilterChange("normal");
            setonCancelEachFilter(false);
        }
    }, [filters, onCancelEachFilter]);
    //   useEffect(() => {
    //     const getYachts = async () => {
    //       if (!userId) return;
    //       try {
    //         const data = await fetchYachts(userId);
    //         setYachts(data);
    //         setOriginalYachts(data)
    //       } catch (err) {
    //         setError(err.message || 'Unexpected Error');
    //       } finally {
    //         setLoading(false);
    //       }
    //     };

    //     getYachts();
    //   }, [userId]);

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

    useEffect(() => {

        if (!startSort) {
            return;
        }

        let data = [...yachts];
        if (selectedOption?.value === "default") {
            data = [...originalYachts];
        }
        else if (selectedOption?.value === "Price-High-Low") {
            data.sort((a, b) => b.yacht?.per_hour_price - a.yacht?.per_hour_price);
        } else if (selectedOption?.value === "Price-Low-High") {
            data.sort((a, b) => a.yacht?.per_hour_price - b.yacht?.per_hour_price);
        } else if (selectedOption?.value === "Capacity-High-Low") {
            data.sort((a, b) => b.yacht?.guest - a.yacht?.guest);
        } else if (selectedOption?.value === "Capacity-Low-High") {
            data.sort((a, b) => a.yacht?.guest - b.yacht?.guest);
        }

        if (JSON.stringify(data) !== JSON.stringify(yachts)) {
            setYachts(data);
        }
    }, [selectedOption]);

    ///hit //old search
    //    useEffect(() => {
    //       const fetchResults = async () => {
    //         try {

    //           const params = {
    //             user_id: session?.user?.userid || 1,
    //             guest: parseInt(searchParams.get('guests')) || 1,
    //             location: searchParams.get('location'),
    //             capacity: parseInt(searchParams.get('guests')) || 1,
    //             name:searchParams.get('name') || "",
    //             // created_on:searchParams.get('date') || "" ,
    //           };  
    //           const response = await yachtApi.checkYachts(params);
    //           console.log("response=>>>>",response)
    //           if (response.error_code === 'pass' && response.data) {
    //           setOriginalYachts(response.data)
    //           } else {
    //             setError(response.message || 'No results found');
    //           }
    //         } catch (err) {
    //           setError(err.message || 'Failed to fetch results');
    //         } finally {
    //           setLoading(false);
    //         }
    //       };

    //       fetchResults();
    //     }, [searchParams, session]);

    useEffect(() => {
        let data = [...originalYachts]
        setYachts(data)
    }, [originalYachts]);
    //test
    useEffect(() => {
        console.log("yachts", yachts, error);
    }, [yachts]);


    if (loading) {
        return (
            <Loading />
        );
    }

    if (error || !yachts.length) {
        return (
            <EmptySearch
                type="yachts"
                searchParams={Object.fromEntries(searchParams.entries())}
                filters={filters}
            />
        );
    }

    return (
        <section className="py-4 px-2">
            <div className="max-w-5xl mx-auto">
                <h1 className="text-2xl font-semibold mb-6">
                    Search Results ({yachts.length})
                </h1>

                <div className="flex flex-col space-y-4 mb-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center  w-full gap-2 flex-wrap">
                            <Sheet>
                                <div className="flex justify-between w-full">
                                    <SheetTrigger asChild>
                                        <Button
                                            //  onClick={()=>setStartFilterWork(true)}
                                            variant="outline" className="gap-2">
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
                                                <Label className="text-sm">Price Per Hour (AED)</Label>
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
                                                            placeholder="Min"
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
                                                            placeholder="Max"
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
                                                        value={filters.sleep_capacity || 0}
                                                        onChange={(e) => setFilters(prev => ({ ...prev, sleep_capacity: Math.max(0, parseInt(e.target.value) || 0) }))}
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
                                                        value={filters.number_of_cabin || 0}
                                                        onChange={(e) => setFilters(prev => ({ ...prev, number_of_cabin: Math.max(0, parseInt(e.target.value) || 0) }))}
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
                                                                                        <Image src={icon} alt={`${name} icon`} width={25} height={25} className="" />
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
                                                                                    <Image src={option.icon} alt={`${option.name} icon`} width={25} height={25} className="" />
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
                                                                                    <Image src={option.icon} alt={`${option.name} icon`} width={25} height={25} className="" />
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
                                                                                    <Image src={activity.icon} alt={`${activity.name} icon`} width={25} height={25} className="" />
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
                                                                                    <Image src={equipment.icon} alt={`${equipment.name} icon`} width={25} height={25} className="" />
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
                                                                                    <Image src={comfort.icon} alt={`${comfort.name} icon`} width={25} height={25} className="" />
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
                                                                                    <Image src={equipment.icon} alt={`${equipment.name} icon`} width={25} height={25} className="" />
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
                                        <X className="h-3 w-3 cursor-pointer" onClick={() => {
                                            const [type] = filter.split(':');
                                            switch (type) {
                                                case 'Price':
                                                    setFilters(prev => ({ ...prev, min_price: 1000, max_price: 4000 }));
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
                                                    setFilters(prev => ({ ...prev, amenities: [] })); // Added amenities filter
                                                    break;
                                                case 'Outdoor Equipment':
                                                    setFilters(prev => ({ ...prev, outdoor_equipment: [] })); // Added outdoor equipment filter
                                                    break;
                                                case 'Kitchen':
                                                    setFilters(prev => ({ ...prev, kitchen: [] })); // Added kitchen filter
                                                    break;
                                                case 'Onboard Energy':
                                                    setFilters(prev => ({ ...prev, energy: [] })); // Added energy filter
                                                    break;
                                                case 'Leisure Activities':
                                                    setFilters(prev => ({ ...prev, leisure: [] })); // Added leisure activities filter
                                                    break;
                                                case 'Navigation Equipment':
                                                    setFilters(prev => ({ ...prev, navigation: [] })); // Added navigation equipment filter
                                                    break;
                                                case 'Extra Comforts':
                                                    setFilters(prev => ({ ...prev, extra_comforts: [] })); // Added extra comforts filter
                                                    break;
                                                case 'Indoor Equipment':
                                                    setFilters(prev => ({ ...prev, indoor: [] })); // Added indoor equipment filter
                                                    break;
                                            }
                                            setonCancelEachFilter(true);
                                        }} />
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

                <div className=" grid xs:grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
                    {yachts.map((yacht) => (
                        <YachtCard key={yacht.id} yacht={yacht} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default SearchYacht;