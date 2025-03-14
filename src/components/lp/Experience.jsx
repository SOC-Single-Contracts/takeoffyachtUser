"use client"
import React, { useEffect, useState } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Sailboat, RefreshCw } from "lucide-react"
import { fetchAllExperiences } from '@/api/experiences'
import { addToWishlist, fetchWishlist, removeFromWishlist } from "@/api/wishlist";
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import ExperienceCard from './ExperienceCard'
import Image from 'next/image'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog'

const ExperienceSkeleton = () => {
  return (
    <div className="bg-gray-200 dark:bg-gray-800 w-full max-w-[300px] h-full max-h-[308px] rounded-lg animate-pulse shadow-md">
      <div className="h-[180px] w-full bg-gray-300 dark:bg-gray-700 rounded-t-lg"></div>
      <div className="p-6 space-y-4">
        <div className="h-6 w-3/4 bg-gray-300 dark:bg-gray-700 rounded"></div>
        <div className="h-4 w-1/2 bg-gray-300 dark:bg-gray-700 rounded"></div>
        <div className="h-4 w-full bg-gray-300 dark:bg-gray-700 rounded"></div>
      </div>
    </div>
  );
};

const FeatureSkeleton = () => (
  <div className="bg-gray-200 dark:bg-gray-800 w-full max-w-[300px] h-full max-h-[308px] rounded-lg animate-pulse shadow-md">
    <div className="h-16 w-16 bg-gray-300 dark:bg-gray-700 rounded-full mx-auto mt-6"></div>
    <div className="p-6 space-y-4">
      <div className="h-6 w-3/4 bg-gray-300 dark:bg-gray-700 rounded mx-auto"></div>
      <div className="h-4 w-1/2 bg-gray-300 dark:bg-gray-700 rounded mx-auto"></div>
      <div className="h-4 w-full bg-gray-300 dark:bg-gray-700 rounded mx-auto"></div>
    </div>
  </div>
);

const EmptyExperienceState = ({ onRetry }) => {
  return (
    <section className="py-16">
      <div className="container px-4 mx-auto text-center">
        <Sailboat className="w-24 h-24 text-[#BEA355] mx-auto mb-6" />
        <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">
          No Experiences Available
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
          We're currently updating our experiences collection. 
          Please check back later or explore our other offerings.
        </p>
        <div className="flex justify-center space-x-4">
          <Button 
            onClick={onRetry}
            className="rounded-full bg-[#BEA355] hover:bg-[#a68f4b] flex items-center"
          >
            <RefreshCw className="mr-2 w-4 h-4" />
            Retry Loading
          </Button>
          <Link href="/dashboard/experience">
            <Button 
              variant="outline" 
              className="rounded-full border-[#BEA355] text-[#BEA355] hover:bg-[#BEA355]/10"
            >
              Explore All Experiences
            </Button>
          </Link>
        </div>
    </div>
  </section>
  );
};

const Experience = () => {
  const { data: session, status } = useSession();
  const userId = session?.user?.userid || 1;

  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [favorites, setFavorites] = useState(new Set());
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const loadData = async () => {
    if (status === 'loading') return;

    if (!userId) {
      console.error('User ID is undefined.');
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const [experiencesData, wishlistData] = await Promise.all([
        fetchAllExperiences(userId),
        fetchWishlist(userId)
      ]);

      if (Array.isArray(experiencesData)) {
        setExperiences(experiencesData.slice(0, 4));
      } else {
        throw new Error('Invalid data format received');
      }

      // Set wishlist items
      const wishlistIds = new Set(wishlistData.map(item => item.experience));
      setFavorites(wishlistIds);
    } catch (error) {
      console.error('Error loading experiences:', error);
      setError(error.message || 'Unable to load experiences. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [userId, status]);

  const handleWishlistToggle = async (experienceId) => {
    if (!userId) return;
    
    const updatedFavorites = new Set(favorites);
    try {
      if (updatedFavorites.has(experienceId)) {
        updatedFavorites.delete(experienceId);
        await removeFromWishlist(userId, experienceId, 'experience');
      } else {
        updatedFavorites.add(experienceId);
        await addToWishlist(userId, experienceId, 'experience');
      }
      setFavorites(updatedFavorites);
    } catch (error) {
      console.error('Error toggling wishlist:', error);
    }
  };

  // Error State
  if (error) {
    return (
      <section className="py-16">
        <div className="container px-4 mx-auto text-center">
          <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 p-6 rounded-lg max-w-md mx-auto">
            <h2 className="text-2xl font-bold text-red-700 dark:text-red-300 mb-4">
              Oops! Something Went Wrong
            </h2>
            <p className="text-red-600 dark:text-red-400 mb-6">
              {error}
            </p>
            <Button 
              onClick={loadData} 
              className="bg-red-500 hover:bg-red-600 text-white rounded-full"
            >
              <RefreshCw className="mr-2 w-4 h-4" />
              Try Again
            </Button>
          </div>
        </div>
      </section>
    );
  }

  // Loading State
  if (loading || status === 'loading') {
    return (
      <>
        <section className="md:py-16 py-10">
          <div className="max-w-5xl px-2 mx-auto">
            <div className="flex justify-between items-center">
              <div className="h-10 w-1/3 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 place-items-center gap-2 my-8">
              {Array.from({ length: 4 }).map((_, index) => <ExperienceSkeleton key={index} />)}
            </div>
          </div>
        </section>
        <section className="py-10">
          <div className="max-w-5xl px-2 mx-auto">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 place-items-center">
              {Array.from({ length: 3 }).map((_, index) => (
                <FeatureSkeleton key={index} />
              ))}
            </div>
          </div>
        </section>
      </>
    );
  }

  // Empty State
  if (experiences.length === 0) {
    return <EmptyExperienceState onRetry={loadData} />;
  }

  const features = [
    {
      id: 1,
      icon: <Image 
        src="/assets/images/headphonesicon.svg" 
        width={40} 
        height={40} 
        alt="Top Experiences" 
        className="dark:invert"
      />,
      title: "Top Experiences",
      description: "Sail the azure waters in style aboard our meticulously crafted yacht, equipped with opulent amenities and a professional crew to cater to your every need."
    },
    {
      id: 2,
      icon: <Image 
        src="/assets/images/dollaricon.svg" 
        width={40} 
        height={40} 
        alt="Alternative Payments" 
        className="dark:invert"
      />,
      title: "alternative payments",
      description: "Sail the azure waters in style aboard our meticulously crafted yacht, equipped with opulent amenities and a professional crew to cater to your every need."
    },
    {
      id: 3,
      icon: <Image 
        src="/assets/images/gifticon.svg" 
        width={40} 
        height={40} 
        alt="Add-on Services" 
        className="dark:invert"
      />,
      title: "add-on services",
      description: "Sail the azure waters in style aboard our meticulously crafted yacht, equipped with opulent amenities and a professional crew to cater to your every need."
    },
  ];

  return (
    <>
      <section className="md:py-16 py-10">
        <div className="max-w-5xl px-2 mx-auto">
          <div className="flex justify-between items-center">
            <h2 className="md:text-[40px] text-[24px] font-semibold tracking-tight sm:text-4xl">
              Top Experiences
            </h2>
          </div>
          
          <div className="grid xs:grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[0.6rem]   my-8">
            {experiences.map((experienceData) => (
              <ExperienceCard
                key={experienceData.experience.id} 
                experienceData={experienceData}
                isFavorite={favorites.has(experienceData.experience.id)}
                onWishlistToggle={handleWishlistToggle}
              />
            ))}
          </div>
          <Link href="/dashboard/experience">
          <Button variant="outline" className="text-black hover:underline font-semibold uppercase md:text-[16px] hover:shadow-2xl transition duration-500 ease-in-out dark:text-white text-[12px] rounded-full flex items-center group">
            See All
            <svg
              className="w-4 ml-1 transition-transform duration-300 ease-in-out group-hover:translate-x-1"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </Button>
          </Link>
        </div>
      </section>
      <section className="py-10">
        <div className="max-w-5xl px-2 mx-auto">
          {/* Cards Grid */}
          <div className="grid xs:grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[0.6rem] place-items-center">
            {features.map((feature) => (
              <Card
                key={feature.id}
                className="bg-white cursor-pointer dark:bg-gray-800 w-full max-w-[300px]] h-full max-h-[308px] border-none shadow-2xl hover:shadow-xl hover:scale-20 transition-all duration-500 rounded-2xl"
                onClick={() => setIsDialogOpen(true)}
              >
                <CardContent className="p-6 space-y-4">
                  <div className="flex justify-start mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="md:text-[24px] text-[20px] font-semibold capitalize">
                    {feature.title}
                  </h3>
                  <p className="md:text-[16px] text-[12px]">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      <Dialog  open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Get in touch</DialogTitle>
            </DialogHeader>
          <div className="p-2">
        <ul className="list-disc space-y-3 list-inside mb-4">
          <li>If you need help with the booking process, such as inquiries about available yachts, pricing, or special requirements.</li>
          <li>If you encounter technical issues with the app, like login problems, payment errors, or navigation difficulties.</li>
          <li>If you wish to provide feedback, report issues, or raise complaints related to their yacht rental experience.</li>
        </ul>
      </div>
      <div className="flex justify-between items-center p-4 border-t">
        <Link href="tel:+123456789" className="text-base underline">+123456789</Link>
        <Link href="https://wa.me/971524252070" target="_blank" rel="noopener noreferrer">
          <Button className="bg-green-500 hover:bg-green-600 text-white rounded-full"><span><svg xmlns="http://www.w3.org/2000/svg" width="25" height="24" fill="none" viewBox="0 0 25 24" data-v-89995b31=""><clipPath id="i-1963824468__a"><path d="M.5 0h24v24H.5z"></path></clipPath><g clipPath="url(#i-1963824468__a)"><path fill="#fff" fillRule="evenodd" d="M17.927 14.437c-.297-.148-1.759-.867-2.031-.966-.273-.1-.47-.15-.669.148s-.768.967-.941 1.166c-.174.198-.347.223-.644.074-.297-.149-1.255-.463-2.39-1.475-.884-.788-1.48-1.761-1.654-2.059-.174-.297-.019-.458.13-.606.134-.133.297-.347.446-.52s.198-.298.297-.496c.1-.199.05-.372-.025-.521-.074-.149-.668-1.611-.916-2.206-.241-.58-.486-.501-.669-.51a11.94 11.94 0 0 0-.57-.011c-.198 0-.52.074-.792.372-.273.297-1.04 1.016-1.04 2.479s1.065 2.876 1.213 3.074c.149.198 2.096 3.2 5.078 4.487.71.306 1.263.489 1.695.626.712.226 1.36.194 1.872.118.571-.086 1.759-.72 2.006-1.414.248-.694.248-1.289.174-1.413-.075-.124-.273-.198-.57-.347zm-5.424 7.403H12.5a9.875 9.875 0 0 1-5.032-1.377l-.361-.215-3.743.982 1-3.648-.236-.374a9.86 9.86 0 0 1-1.512-5.26c.002-5.45 4.438-9.884 9.892-9.884a9.823 9.823 0 0 1 6.99 2.899 9.824 9.824 0 0 1 2.894 6.993c-.002 5.45-4.438 9.884-9.888 9.884zm8.415-18.297A11.821 11.821 0 0 0 12.504.055C5.946.055.61 5.39.607 11.947c-.001 2.096.547 4.142 1.588 5.945L.507 24.055l6.306-1.654a11.89 11.89 0 0 0 5.685 1.448h.005c6.557 0 11.894-5.335 11.897-11.893a11.819 11.819 0 0 0-3.481-8.413z" clipRule="evenodd"></path></g></svg></span> WhatsApp</Button>
        </Link>
      </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Experience;