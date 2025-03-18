"use client";
import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ChevronDown, SlidersHorizontal, X, CalendarRange } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loading } from '@/components/ui/loading';
import { fetchFormulaOne } from '@/api/yachts';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { addToWishlist, fetchWishlist, removeFromWishlist } from '@/api/wishlist';

const SkeletonCard = () => (
  <Card className="overflow-hidden bg-gray-100 rounded-2xl shadow-md w-full max-w-[250px] h-full max-h-[260px] animate-pulse">
      <div className="relative bg-gray-300 h-[170px] rounded-t-2xl"></div>
      <CardContent className="px-4 py-2 space-y-3">
        <div className="h-4 bg-gray-300 rounded w-3/4"></div>
        <div className="h-3 bg-gray-300 rounded w-1/2"></div>
        <div className="h-3 bg-gray-300 rounded w-full"></div>
      </CardContent>
  </Card>
);

const Events = ({ limit }) => {
  const { data: session } = useSession()
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [favorites, setFavorites] = useState(new Set());
  const [filters, setFilters] = useState({
    eventdb_id: "",
    created_on: "",
    sort_by_date: false,
    sort_by_packages: false,
  });
  const [activeFilters, setActiveFilters] = useState([]);

  const handleFilterChange = async () => {
    if (!session?.user?.userid) return;
    
    try {
      setLoading(true);
      const response = await fetch('https://api.takeoffyachts.com/yacht/f1-yachts/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: session?.user?.userid || 1,
          eventdb_id: filters.eventdb_id,
          created_on: filters.created_on,
        }),
      });
      
      const responseData = await response.json();
      if (responseData.error_code === 'pass') {
        let filteredEvents = responseData.data || [];
        
        // Apply client-side sorting if needed
        if (filters.sort_by_date) {
          filteredEvents.sort((a, b) => new Date(b.event.created_on) - new Date(a.event.created_on));
        }
        if (filters.sort_by_packages) {
          filteredEvents.sort((a, b) => b.packages.length - a.packages.length);
        }
        
        setEvents(filteredEvents);
      } else {
        setError(responseData.error || 'Failed to apply filters');
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
      eventdb_id: "",
      created_on: "",
      sort_by_date: false,
      sort_by_packages: false,
    });
    handleFilterChange();
  };

  const updateActiveFilters = () => {
    const newFilters = [];
    if (filters.eventdb_id) newFilters.push(`Event ID: ${filters.eventdb_id}`);
    if (filters.created_on) newFilters.push(`Date: ${filters.created_on}`);
    if (filters.sort_by_packages) newFilters.push('Sort: Packages (Most First)');
    if (filters.sort_by_date) newFilters.push('Sort: Date (Newest First)');
    setActiveFilters(newFilters);
  };

  useEffect(() => {
    updateActiveFilters();
  }, [filters]);

  useEffect(() => {
    const getEvents = async () => {
      try {
        const data = await fetchFormulaOne(session?.user?.userid || 1);
        setEvents(data);
      } catch (err) {
        setError(err.message || 'Unexpected Error');
      } finally {
        setLoading(false);
      }
    };
  
    getEvents();
  }, [session?.user?.userid]);

  useEffect(() => {
    const getWishlist = async () => {
      if (session?.user?.userid) {
        const wishlistItems = await fetchWishlist(session.user.userid);
        const wishlistSet = new Set(wishlistItems.map(item => item.event)); // Assuming event IDs are stored in the wishlist
        setFavorites(wishlistSet);
      }
    };
    getWishlist();
  }, [session?.user?.userid]);

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

  const eventsToDisplay = limit ? events.slice(0, limit) : events;

  return (
    <section className="md:py-10 py-4 px-2">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Formula One</h1>

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
                <SheetContent side="right" className="w-full sm:w-[540px]">
                  <SheetHeader>
                    <SheetTitle>Filters</SheetTitle>
                  </SheetHeader>
                  <ScrollArea className="h-[calc(100vh-80px)] px-1">
                    <div className="space-y-6 py-6">
                      {/* Date Filter */}
                      <div className="space-y-2">
                        <Label className="text-base">Date</Label>
                        <div className="relative">
                          <Input
                            type="date"
                            value={filters.created_on}
                            onChange={(e) => setFilters(prev => ({ ...prev, created_on: e.target.value }))}
                            className="w-full"
                          />
                          <CalendarRange className="absolute right-3 top-2.5 h-5 w-5 text-gray-500" />
                        </div>
                      </div>

                      {/* Event ID Filter */}
                      <div className="space-y-2">
                        <Label className="text-base">Event ID</Label>
                        <Input
                          type="number"
                          placeholder="Enter Event ID"
                          value={filters.eventdb_id}
                          onChange={(e) => setFilters(prev => ({ ...prev, eventdb_id: e.target.value }))}
                          className="w-full"
                        />
                      </div>

                      {/* Sort Options */}
                      <div className="space-y-2">
                        <Label className="text-base">Sort By</Label>
                        <Select
                          value={filters.sort_by_packages ? "packages" : filters.sort_by_date ? "date" : "default"}
                          onValueChange={(value) => {
                            setFilters(prev => ({
                              ...prev,
                              sort_by_packages: value === "packages",
                              sort_by_date: value === "date"
                            }));
                          }}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select sorting" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="default">Default</SelectItem>
                            <SelectItem value="packages">Packages (Most First)</SelectItem>
                            <SelectItem value="date">Date (Newest First)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <Button 
                        className="w-full bg-[#BEA355] mt-6"
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
                        case 'Event ID':
                          setFilters(prev => ({ ...prev, eventdb_id: '' }));
                          break;
                        case 'Date':
                          setFilters(prev => ({ ...prev, created_on: '' }));
                          break;
                        case 'Sort':
                          setFilters(prev => ({ ...prev, sort_by_packages: false, sort_by_date: false }));
                          break;
                      }
                    }} />
                  </Badge>
                ))}
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={resetFilters}
              className="ml-2"
            >
              Reset
            </Button>
          </div>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 place-items-center">
          {loading ? (
            Array(8)
              .fill(0)
              .map((_, idx) => (
                <SkeletonCard key={idx} />
              ))
          ) : eventsToDisplay.length > 0 ? (
            eventsToDisplay.map((item) => {
              return (
                <Card
                  key={item.id}
                  className="overflow-hidden bg-white dark:bg-gray-800 rounded-2xl shadow-md w-full md:max-w-[250px] h-full md:min-h-[260px] min-h-[240px]"
                >
                  <div className="relative">
                    <Image
                      src={
                        item.event_image 
                        ? `https://api.takeoffyachts.com${item.event_image}`
                        : '/assets/images/f1.png'
                      }
                      alt={item.name || 'F1 Yacht Image'}
                      width={400}
                      height={250}
                      className="object-cover px-1 xs:ml-1 pt-2 rounded-2xl md:h-[170px] h-[220px]"
                      onError={(e) => {
                        e.target.src = '/assets/images/f1.png'
                      }}
                    />

                    <Link href={`/dashboard/formula-one/${item.id}`}>
                      <p className="absolute inset-0 z-10"></p>
                    </Link>

                    <Button
                      variant="secondary"
                      size="icon"
                      className="absolute top-5 right-5 rounded-full bg-white hover:bg-white/80 z-10"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleWishlistToggle(item.id);
                      }}
                    >
                      <Image 
                        src={favorites.has(item.id) ? '/assets/images/wishlist.svg' : '/assets/images/unwishlist.svg'} 
                        width={20} 
                        height={20} 
                        alt="Wishlist"
                        className="text-red-500" 
                      />
                    </Button>
                    <div className="absolute bottom-4 right-6 bg-white/80 dark:bg-gray-900 backdrop-blur-sm p-1.5 rounded-md">
                      <span className="text-xs font-medium">
                        {/* Assuming packages is part of the item, adjust if not */}
                        {item.packages?.length || 0} Package Available
                      </span>
                    </div>
                  </div>
                  <CardContent className="px-4 py-2">
                    <h3 className="text-md font-semibold mb-1">{item.name || 'Unnamed Yacht'}</h3>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {item.location || 'Location N/A'}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                      {(item.description || '').substring(0, 24)}...
                    </p>
                  </CardContent>
                </Card>
              );
            })
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center py-12">
              <p className="text-gray-500 text-lg mb-4">No Formula One Yachts found</p>
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

export default Events;