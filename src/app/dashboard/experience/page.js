"use client";
import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { SlidersHorizontal, X, CalendarRange } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { fetchAllExperiences } from '@/api/experiences';
import { featuredyachts } from '../../../../public/assets/images';
import { addToWishlist, removeFromWishlist, fetchWishlist } from "@/api/wishlist";
import Options from '../featured/Options';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const Experiences = () => {
  const { data: session } = useSession();
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [favorites, setFavorites] = useState(new Set());
  const [filters, setFilters] = useState({
    experiencedb_id: "",
    created_on: "",
    sort_by_date: false,
    sort_by_price: false,
    price_range: "",
  });
  const [activeFilters, setActiveFilters] = useState([]);

  // Get user ID, default to 1 if not available
  const userId = session?.user?.userid || 1;

  const handleFilterChange = async () => {
    if (!userId) return;
    
    try {
      setLoading(true);
      const response = await fetch('https://api.takeoffyachts.com/yacht/check_experience/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userId || 1,
          experiencedb_id: filters.experiencedb_id,
          created_on: filters.created_on,
        }),
      });
      
      const responseData = await response.json();
      if (responseData.error_code === 'pass') {
        let filteredExperiences = responseData.data || [];
        
        // Apply client-side sorting if needed
        if (filters.sort_by_price) {
          filteredExperiences.sort((a, b) => a.experience.min_price - b.experience.min_price);
        }
        if (filters.sort_by_date) {
          filteredExperiences.sort((a, b) => new Date(b.experience.created_on) - new Date(a.experience.created_on));
        }
        
        setExperiences(filteredExperiences);
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
      experiencedb_id: "",
      created_on: "",
      sort_by_date: false,
      sort_by_price: false,
      price_range: "",
    });
    handleFilterChange();
  };

  const updateActiveFilters = () => {
    const newFilters = [];
    if (filters.experiencedb_id) newFilters.push(`ID: ${filters.experiencedb_id}`);
    if (filters.created_on) newFilters.push(`Date: ${filters.created_on}`);
    if (filters.sort_by_price) newFilters.push('Sort: Price (Low to High)');
    if (filters.sort_by_date) newFilters.push('Sort: Date (Newest First)');
    setActiveFilters(newFilters);
  };

  useEffect(() => {
    updateActiveFilters();
  }, [filters]);

  useEffect(() => {
    const loadData = async () => {
      if (!userId) return;
      try {
        const [experiencesData, wishlistData] = await Promise.all([
          fetchAllExperiences(userId),
          fetchWishlist(userId)
        ]);

        setExperiences(experiencesData);
        const wishlistIds = new Set(wishlistData.map(item => item.experience));
        setFavorites(wishlistIds);
      } catch (err) {
        setError(err.message || 'Unexpected Error');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [userId]);

  const handleWishlistToggle = async (experienceId) => {
    if (!userId) return;
    
    const updatedFavorites = new Set(favorites);
    try {
      if (updatedFavorites.has(experienceId)) {
        await removeFromWishlist(userId, experienceId, 'experience' );
        updatedFavorites.delete(experienceId);
      } else {
        await addToWishlist(userId, experienceId, 'experience');
        updatedFavorites.add(experienceId);
      }
      setFavorites(updatedFavorites);
    } catch (error) {
      console.error('Error toggling wishlist:', error);
    }
  };

  const SkeletonCard = () => (
    <div className="animate-pulse overflow-hidden bg-gray-200 rounded-2xl shadow-md w-full max-w-[250px] h-full max-h-[260px]">
      <div className="bg-gray-300 rounded-3xl h-[170px] w-full"></div>
      <div className="p-4 space-y-2">
        <div className="h-4 bg-gray-300 rounded w-3/4"></div>
        <div className="h-3 bg-gray-300 rounded w-1/2"></div>
        <div className="h-3 bg-gray-300 rounded w-5/6"></div>
      </div>
    </div>
  );

  if (error) {
    return (
      <section className="py-16">
        <div className="container px-4 mx-auto">
          <p className="text-red-500">Error loading experiences: {error}</p>
        </div>
      </section>
    );
  }

  return (
    <>
      <Options />
      <section className="md:py-16 py-4 px-2">
        <div className="max-w-5xl mx-auto px-4">
          <h1 className="md:text-4xl text-3xl font-bold mb-6">Our Experiences</h1>

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

                        {/* Experience ID Filter */}
                        <div className="space-y-2">
                          <Label className="text-base">Experience ID</Label>
                          <Input
                            type="number"
                            placeholder="Enter ID"
                            value={filters.experiencedb_id}
                            onChange={(e) => setFilters(prev => ({ ...prev, experiencedb_id: e.target.value }))}
                            className="w-full"
                          />
                        </div>

                        {/* Sort Options */}
                        <div className="space-y-2">
                          <Label className="text-base">Sort By</Label>
                          <Select
                            value={filters.sort_by_price ? "price" : filters.sort_by_date ? "date" : "default"}
                            onValueChange={(value) => {
                              setFilters(prev => ({
                                ...prev,
                                sort_by_price: value === "price",
                                sort_by_date: value === "date"
                              }));
                            }}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select sorting" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="default">Default</SelectItem>
                              <SelectItem value="price">Price (Low to High)</SelectItem>
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
                          case 'ID':
                            setFilters(prev => ({ ...prev, experiencedb_id: '' }));
                            break;
                          case 'Date':
                            setFilters(prev => ({ ...prev, created_on: '' }));
                            break;
                          case 'Sort':
                            setFilters(prev => ({ ...prev, sort_by_price: false, sort_by_date: false }));
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

          {/* Experiences Grid */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:place-items-start place-items-center">
            {loading ? (
              // Show skeleton loading state
              Array(8).fill(null).map((_, index) => (
                <SkeletonCard key={index} />
              ))
            ) : experiences.length > 0 ? (
              experiences.map((item) => {
                const { experience, categories } = item;
                const mainImage = experience.experience_image;
                return (
                  <Card
                    key={experience.id}
                    className="overflow-hidden bg-white dark:bg-gray-800 rounded-2xl shadow-md w-full max-w-[250px] h-full max-h-[260px]"
                  >
                    <div className="relative">
                      <Image
                        src={mainImage ? `https://api.takeoffyachts.com${mainImage}` : featuredyachts}
                        alt={experience.name || 'Experience Image'}
                        width={400}
                        height={250}
                        className="object-cover px-3 pt-3 rounded-3xl h-[170px]"
                      />

                      <Link href={`/dashboard/experience/${experience.id}`}>
                        <p className="absolute inset-0 z-10"></p>
                      </Link>

                      <Button
                        variant="secondary"
                        size="icon"
                        className="absolute top-5 right-5 rounded-full bg-white hover:bg-white/80 dark:hover:bg-gray-700 z-10"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleWishlistToggle(experience.id);
                        }}
                      >
                        <Image
                          src={favorites.has(experience.id) ? '/assets/images/wishlist.svg' : '/assets/images/unwishlist.svg'}
                          width={20}
                          height={20}
                          alt="Wishlist"
                          className={`h-5 w-5 ${favorites.has(experience.id) ? 'text-red-500 fill-red-500' : ''}`}
                        />
                      </Button>

                      <div className="absolute bottom-4 right-6 bg-white dark:bg-gray-800 px-1.5 py-1 rounded-md">
                        <span className="text-xs font-medium dark:text-gray-300">
                          AED <strong>{experience.min_price?.toLocaleString()}</strong>
                        </span>
                      </div>
                    </div>
                    <CardContent className="px-4 py-2">
                      <h3 className="text-md font-semibold mb-1 dark:text-gray-200">{experience.name || 'Unnamed Experience'}</h3>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {experience.guest !== undefined ? `${experience.guest} Guests` : 'Capacity N/A'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                        {(experience.description || '').substring(0, 24)}...
                      </p>
                    </CardContent>
                  </Card>
                );
              })
            ) : (
              <div className="col-span-full flex flex-col items-center justify-center py-12">
                <p className="text-gray-500 text-lg mb-4">No experiences found</p>
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
    </>
  );
};

export default Experiences;