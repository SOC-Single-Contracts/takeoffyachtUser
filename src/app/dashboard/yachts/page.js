"use client";
import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Dot, MapPin } from 'lucide-react';
import Link from 'next/link';
import { fetchYachts } from '@/api/yachts';
import { useSession } from 'next-auth/react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SlidersHorizontal, X } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from '@/components/ui/scroll-area';
import { addToWishlist, removeFromWishlist, fetchWishlist } from '@/api/wishlist';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const Yachts = () => {
  const { data: session } = useSession();
  const [yachts, setYachts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [favorites, setFavorites] = useState(new Set());
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
    { name:'Tableware', icon: '/assets/images/Icon_Tableware.svg'}, 
    {name: 'BBQ Grill', icon: '/assets/images/Icon_BBQgrill.svg'}, 
    {name: 'Ice machine', icon: '/assets/images/Icon_Icemachine.svg'}, 
    {name: 'Coffee Machine', icon: '/assets/images/Icon_Coffeemachine.svg'}, 
    {name: 'Bar', icon: '/assets/images/Icon_Bar.svg'}, 
    {name: 'Barware', icon: '/assets/images/Icon_Barware.svg'}, 
    {name: 'Dining Utensils', icon: '/assets/images/Icon_DiningUtensils.svg'}, 
    {name: 'Dishwasher', icon: '/assets/images/Icon_Dishwasher.svg'}, 
    {name: 'Microwave', icon: '/assets/images/Icon_Microwave.svg'}, 
    {name: 'Oven/stovetop', icon: '/assets/images/Icon_Oven.svg'}, 
    {name:'Freezer', icon: '/assets/images/Icon_Freezer.svg'}
  ]; 
  const energyOptions = [{name: '220V Power Outlet', icon: '/assets/images/Icon_220Vpoweroutlet.svg'}, {name: 'Power Inverter', icon: '/assets/images/Icon_Powerinverter.svg'}, {name: 'Solar Panels', icon: '/assets/images/Icon_Solarpanels.svg'}, {name: 'Generator', icon: '/assets/images/Icon_Generator.svg'}];
  const leisureActivities = [
    {name: 'Swimming Pool', icon: '/assets/images/Icon_Swimmingpool.svg'}, 
    {name: 'Inflatable banana', icon: '/assets/images/Icon_Inflatablebanana.svg'}, 
    {name: 'Kneeboard', icon: '/assets/images/Icon_Kneeboard.svg'}, 
    {name: 'Video Camera', icon: '/assets/images/Icon_Videocamera.svg'}, 
    {name: 'Windsuft equipment', icon: '/assets/images/Icon_Windsuftequipment.svg'}, 
    {name: 'Diving equipment', icon: '/assets/images/Icon_Divingequipment.svg'}, 
    {name: 'Kitesurfing equipment', icon: '/assets/images/Icon_Kitesurfingequipment.svg'}, 
    {name: 'Drone', icon: '/assets/images/Icon_Drone.svg'}, 
    {name: 'Wakeboard', icon: '/assets/images/Icon_Wakeboard.svg'}, 
    {name: 'Gym', icon: '/assets/images/Icon_Gym.svg'}, 
    {name: 'Inflatable waterslide', icon: '/assets/images/Icon_Inflatablewaterslide.svg'}, 
    {name: 'Jacuzzi', icon: '/assets/images/Icon_Jacuzzi.svg'}, 
    {name: 'Fishing equipment', icon: '/assets/images/Icon_Fishingequipment.svg'}, 
    {name: 'Water skis', icon: '/assets/images/Icon_Waterskis.svg'}, 
    {name: 'Jet ski', icon: '/assets/images/Icon_Jetski.svg'}, 
    {name: 'Kayak', icon: '/assets/images/Icon_Kayak.svg'}, 
    {name: 'Paddle board', icon: '/assets/images/Icon_Paddleboard.svg'}, 
    {name: 'Sea scooter', icon: '/assets/images/Icon_Seascooter.svg'}, 
    {name: 'Seabob', icon: '/assets/images/Icon_Seabob.svg'}, 
    {name: 'Flyboard', icon: '/assets/images/Icon_Flyboard.svg'}
  ]; 
  const navigationEquipment = [
    {name: 'Fishing Sonar', icon: '/assets/images/Icon_FishingSonar.svg'}, 
    {name: 'Autopilot', icon: '/assets/images/Icon_Autopilot.svg'}, 
    {name: 'Bow Sundeck', icon: '/assets/images/Icon_Bowsundeck.svg'}, 
    {name: 'Bow Thruster', icon: '/assets/images/Icon_Bowthruster.svg'}, 
    {name: 'Depth Sounder', icon: '/assets/images/Icon_Depthsounder.svg'}, 
    {name: 'Wi-Fi', icon: '/assets/images/Icon_Wi-Fi.svg'}, 
    {name: 'VHF', icon: '/assets/images/Icon_VHF.svg'}, 
    {name: 'Dinghy', icon: '/assets/images/Icon_Dinghy.svg'}, 
    {name: 'Dinghy’s motor', icon: '/assets/images/Icon_Dinghysmotor.svg'}, 
    {name: 'GPS', icon: '/assets/images/Icon_GPS.svg'}
  ];
  const extraComforts = [ 
    { name: 'Parking', icon: '/assets/images/Icon_Parking.svg'}, 
    { name: 'Towable Tube', icon: '/assets/images/Icon_TowableTube.svg'}, 
    { name: 'Washing Machine', icon: '/assets/images/Icon_Washingmachine.svg'}, 
    { name: 'Watermaker', icon: '/assets/images/Icon_Watermaker.svg'}, 
    { name: 'Air conditioning', icon: '/assets/images/Icon_AirConditioning.svg'}, 
    { name: 'Bluetooth', icon: '/assets/images/Icon_Bluetooth.svg'}, 
    { name: 'TV', icon: '/assets/images/Icon_TV.svg'}, 
    { name: 'USB Socket', icon: '/assets/images/Icon_USBsocket.svg'}, 
    { name: 'Bed Linen', icon: '/assets/images/Icon_Bedlinen.svg'}, 
    { name: 'Haeting', icon: '/assets/images/Icon_Haeting.svg'}, 
    { name: 'Hot Water', icon: '/assets/images/Icon_Hotwater.svg'}, 
    { name: 'Electric toilet', icon: '/assets/images/Icon_Electrictoilet.svg'}, 
    { name: 'Fans', icon: '/assets/images/Icon_Fans.svg'}
  ]; 
  const indoorEquipment = [
    {name: 'Indoor Table', icon: '/assets/images/Icon_IndoorTable.svg'}, 
    {name: 'Restrooms', icon: '/assets/images/Icon_Restrooms.svg'}, 
    {name: 'Shower', icon: '/assets/images/Icon_Shower.svg'}, 
    {name: 'Sound system', icon: '/assets/images/Icon_SoundSystem.svg'}, 
    {name: 'Speakers', icon: '/assets/images/Icon_Speakers.svg'}]; 

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
                const wishlistIds = new Set(wishlistItems.map(item => item.yacht));
                setFavorites(wishlistIds);
            } catch (err) {
                console.error('Wishlist loading error:', err);
            }
        }
    };

    loadWishlist();
  }, [userId]);

  const handleFilterChange = async () => {
    if (!userId) return;
    
    const payload = {
        user_id: userId,
        min_price: filters.min_price.toString(),
        max_price: filters.max_price.toString(),
        guest: filters.max_guest,
        sleep_capacity: filters.sleep_capacity,
        number_of_cabin: filters.number_of_cabin,
        categories: JSON.stringify(filters.category_name),
        features: JSON.stringify(filters.amenities.concat(
            filters.outdoor_equipment,
            filters.kitchen,
            filters.energy,
            filters.leisure,
            filters.navigation,
            filters.extra_comforts,
            filters.indoor
        )),
        price_asc: filters.price_asc,
        price_des: filters.price_des,
        cabin_asc: filters.cabin_asc,
        cabin_des: filters.cabin_des,
        created_on: filters.created_on,
        location: filters.location,
    };
    
    try {
      setLoading(true);
      const response = await fetch('https://api.takeoffyachts.com/yacht/check_yacht/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      
      const responseData = await response.json();
      if (responseData.error_code === 'pass') {
        setYachts(responseData.data || []);
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
    setFilters({
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
      amenities: [], // Reset amenities filter
      outdoor_equipment: [], // Reset outdoor equipment filter
      kitchen: [], // Reset kitchen filter
      energy: [], // Reset energy filter
      leisure: [], // Reset leisure activities filter
      navigation: [], // Reset navigation equipment filter
      extra_comforts: [], // Reset extra comforts filter
      indoor: [], // Reset indoor equipment filter
    });
    handleFilterChange();
  };

  useEffect(() => {
    const getYachts = async () => {
      if (!userId) return;
      try {
        const data = await fetchYachts(userId);
        setYachts(data);
      } catch (err) {
        setError(err.message || 'Unexpected Error');
      } finally {
        setLoading(false);
      }
    };

    getYachts();
  }, [userId]);

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

  if (loading) {
    return (
      <section className="md:py-20 py-8">
        <div className="max-w-5xl px-4 mx-auto">
          {/* Heading Skeleton */}
          <div className="w-full flex items-center justify-between mb-8">
            <div className="h-10 bg-gray-200 dark:bg-gray-700 w-1/3 rounded-md animate-pulse"></div>
          </div>
          
          {/* Cards Grid Skeleton */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 place-items-center">
            {Array.from({ length: 6 }).map((_, index) => (
              <Card
                key={index}
                className="overflow-hidden bg-white dark:bg-gray-800 w-full max-w-[350px] rounded-2xl h-full min-h-[280px] shadow-lg animate-pulse"
              >
                <div className="relative">
                  {/* Image Skeleton */}
                  <div className="bg-gray-200 dark:bg-gray-700 w-full h-[221px] rounded-t-2xl"></div>

                  {/* Wishlist Button Skeleton */}
                  <div className="absolute top-6 right-6 w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full"></div>

                  {/* Price Skeleton */}
                  <div className="absolute bottom-4 right-6 w-24 h-8 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
                </div>
                
                <CardContent className="px-4 py-4 space-y-3">
                  {/* Yacht Name Skeleton */}
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 w-2/3 rounded-md"></div>
                  
                  {/* Specs Skeleton */}
                  <div className="flex justify-start items-center gap-2">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 w-16 rounded-md"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 w-16 rounded-md"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 w-16 rounded-md"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

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
        <h1 className="md:text-4xl text-3xl font-bold mb-6">Our Fleet</h1>
        
        <div className="flex flex-col space-y-4 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 flex-wrap">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <SlidersHorizontal className="h-4 w-4" />
                    Filters
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-full sm:w-[540px]">
                  <SheetHeader>
                    <SheetTitle>Filters</SheetTitle>
                  </SheetHeader>
                  <ScrollArea className="h-[calc(100vh-80px)] px-2">
                  <Button 
                    className="w-full bg-[#BEA355] mt-6 rounded-full"
                    onClick={() => {
                      handleFilterChange();
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
                              placeholder="Min"
                              value={filters.min_price}
                              onChange={(e) => setFilters(prev => ({ ...prev, min_price: e.target.value }))}
                              className="w-full"
                            />
                          </div>
                          <div className="flex-1">
                            <Input
                              type="number"
                              placeholder="Max"
                              value={filters.max_price}
                              onChange={(e) => setFilters(prev => ({ ...prev, max_price: e.target.value }))}
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
                              placeholder="Min"
                              value={filters.min_guest}
                              onChange={(e) => setFilters(prev => ({ ...prev, min_guest: e.target.value }))}
                              className="w-full"
                            />
                          </div>
                          <div className="flex-1">
                            <Input
                              type="number"
                              placeholder="Max"
                              value={filters.max_guest}
                              onChange={(e) => setFilters(prev => ({ ...prev, max_guest: e.target.value }))}
                              className="w-full"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Boat Length */}
                      <div className="space-y-2">
                        <Label className="text-sm">Boat Length (m)</Label>
                        <div className="flex gap-4">
                          <div className="flex-1">
                            <Input
                              type="number"
                              placeholder="Min"
                              value={filters.min_length}
                              onChange={(e) => setFilters(prev => ({ ...prev, min_length: e.target.value }))}
                              className="w-full"
                            />
                          </div>
                          <div className="flex-1">
                            <Input
                              type="number"
                              placeholder="Max"
                              value={filters.max_length}
                              onChange={(e) => setFilters(prev => ({ ...prev, max_length: e.target.value }))}
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
                      <Accordion collapsible  type="multiple">
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

                      <Accordion collapsible  type="multiple">
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
                                            <Image src={icon} alt={`${name} icon`} width={5} height={5} className="w-5 h-5" />
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
                                            <Image src={option.icon} alt={`${option.name} icon`} width={5} height={5} className="w-5 h-5" />
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
                                        <Image src={option.icon} alt={`${option.name} icon`} width={5} height={5} className="w-5 h-5" />
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
                                          <Image src={activity.icon} alt={`${activity.name} icon`} width={5} height={5} className="w-5 h-5" />
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
                                          <Image src={equipment.icon} alt={`${equipment.name} icon`} width={5} height={5} className="w-5 h-5" />
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
                                          <Image src={comfort.icon} alt={`${comfort.name} icon`} width={5} height={5} className="w-5 h-5" />
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
                                          <Image src={equipment.icon} alt={`${equipment.name} icon`} width={5} height={5} className="w-5 h-5" />
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
                          handleFilterChange();
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
                      switch(type) {
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

        {/* Cards Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 place-items-center my-8">
          {yachts.length > 0 ? (
           yachts.map((item) => (
            <Card
              key={item.yacht.id}
              className="overflow-hidden bg-white dark:bg-gray-800 w-full max-w-[350px] rounded-2xl h-full min-h-[280px] shadow-lg hover:shadow-2xl transition duration-500 ease-in-out"
            >
              <div className="relative">
                <Image
                  src={
                    item.yacht.yacht_image 
                      ? `https://api.takeoffyachts.com${item.yacht.yacht_image}`
                      : item.yacht.image1
                        ? `https://api.takeoffyachts.com${item.yacht.image1}`
                        : '/assets/images/fycht.jpg'
                  }
                  alt="not found"
                  width={326}
                  height={300}
                  className="object-cover px-3 pt-3 rounded-3xl w-full h-[221px]"
                  onError={(e) => {
                    e.target.src = '/assets/images/fycht.jpg'
                  }}
                />

                <Link href={`/dashboard/yachts/${item.yacht.id}`}>
                  <p className="absolute inset-0"></p>
                </Link>

                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute top-6 right-6 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white"
                  onClick={() => handleWishlistToggle(item.yacht.id)}
                >
                  <Image 
                    src={favorites.has(item.yacht.id) 
                      ? "/assets/images/wishlist.svg" 
                      : "/assets/images/unwishlist.svg"
                    } 
                    alt="wishlist" 
                    width={20} 
                    height={20} 
                  />
                </Button>

                {/* Hourly Rate */}
                <div className="absolute bottom-4 right-6 bg-white dark:bg-gray-800 p-1.5 rounded-md shadow-md">
                <span className="font-medium text-xs">
                  AED <span className="font-bold text-lg text-primary">{item.yacht.per_hour_price}</span>
                    <span className="text-xs font-light ml-1">/Hour</span>
                </span>
                </div>
              </div>
              <CardContent className="px-4 py-2">
                {/* Yacht Name */}
                <p className="text-xs font-light bg-[#BEA355]/30 text-black dark:text-white rounded-md px-1 py-0.5 w-auto inline-flex items-center">
                  <MapPin className="size-3 mr-1" /> {item.yacht.location || "Location Not Available"}
                </p>
                <div className="flex justify-between items-center">
                <h3 className="text-[20px] font-semibold mb-1 truncate max-w-[230px]">{item.yacht.name}</h3>
                <span className="font-medium text-xs">
                  AED <span className="font-bold text-sm text-primary">{item.yacht.per_hour_price}</span>
                    <span className="text-xs font-light ml-1">/Day</span>
                </span>
                </div>
                {/* Specs Grid */}
                <div className="flex justify-start items-center gap-1">
                <Image src="/assets/images/transfer.svg" alt="length" width={9} height={9} className="" />
                  <p className="font-semibold text-xs">{item.yacht.length || 0} ft</p>
                  <Dot />
                  <div className="text-center font-semibold flex items-center text-xs space-x-2">
                  <Image src="/assets/images/person.svg" alt="length" width={8} height={8} className="dark:invert" />
                    <p>Guests</p>
                    <p>{item.yacht.guest || 0}</p>
                  </div>
                  <Dot />
                  <div className="text-center font-semibold flex items-center text-xs space-x-2">
                  <Image src="/assets/images/cabin.svg" alt="length" width={8} height={8} className="dark:invert" />
                    <p>Cabins</p>
                    <p>{item.yacht.number_of_cabin || 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
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
        )}
        </div>
      </div>
    </section>
  );
};

export default Yachts;