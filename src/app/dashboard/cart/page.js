"use client";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import React, { useState, useEffect } from "react";
import CartItem from "./CartItem";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const SkeletonLoader = () => (
  <div className="animate-pulse flex flex-col space-y-4 p-4 border rounded-lg shadow">
    <div className="h-40 bg-gray-300 rounded-lg"></div>
    <div className="h-6 bg-gray-300 rounded"></div>
    <div className="h-4 bg-gray-300 rounded w-1/2"></div>
    <div className="h-4 bg-gray-300 rounded w-1/4"></div>
    <div className="h-10 bg-gray-300 rounded"></div>
  </div>
);

const Cart = () => {
  const { data: session, status } = useSession();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Get user ID, default to 1 if not available
  const userId = session?.user?.userid ;

  useEffect(() => {
    const loadWishlist = async () => {
      // Only attempt to load wishlist if session is authenticated
      if (status === 'loading') {
        return;
      }

      if (!session) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`https://api.takeoffyachts.com/wishlist/wishlistview/?Auth_user=${userId}`);
        const wishlistItems = await response.json();
        // console.log(wishlistItems)
        const filterYac = wishlistItems.filter((item)=>item?.yacht == 55);

        const detailedItems = await Promise.all(wishlistItems.map(async (item, index) => {
          try {
            if (item?.yacht && item?.yacht_details) {
              const yacht = item?.yacht_details;
              return {
                uniqueKey: `yacht-${yacht?.id}-${index}`,
                id: yacht?.id,
                wishlistId: item?.id,
                name: yacht?.name || 'Unnamed Yacht',
                description: yacht?.description || 'No description available',
                image: yacht?.yacht_image ? `${process.env.NEXT_PUBLIC_S3_URL}${yacht?.yacht_image}` : null,
                features: yacht.features 
                ? Object.keys(yacht.features).map(key => `${key}: ${yacht.features[key]}`).join(', ')
                : [],              
                pricePerHour: yacht?.per_hour_price || 0,
                minHours: yacht?.duration_hour || 0,
                type: 'yacht'
              };
            }else if (item?.f1yacht && item?.f1yacht_details) {
              const yacht = item?.f1yacht_details;
              return {
                uniqueKey: `f1yacht-${yacht?.id}-${index}`,
                id: yacht?.id,
                wishlistId: item?.id,
                name: yacht?.name || 'Unnamed Yacht',
                description: yacht?.description || 'No description available',
                image: yacht?.yacht_image ? `${process.env.NEXT_PUBLIC_S3_URL}${yacht?.yacht_image}` : null,
                features: yacht.features 
                ? Object.keys(yacht.features).map(key => `${key}: ${yacht.features[key]}`).join(', ')
                : [],              
                pricePerHour: yacht?.per_hour_price || 0,
                pricePerDat: yacht?.per_day_price || 0,
                minHours: yacht?.duration_hour || 0,
                type: 'f1-yachts'
              };
            } else if (item?.experience && item?.experience_details) {
              const experience = item?.experience_details;
              return {
                uniqueKey: `experience-${experience?.id}-${index}`,
                id: experience?.id,
                wishlistId: item?.id,
                name: experience?.name || 'Unnamed Experience',
                description: experience?.description || 'No description available',
                image: experience?.experience_image ? `${process.env.NEXT_PUBLIC_S3_URL}${experience?.experience_image}` : null,
                features: experience.features 
                ? Object.keys(experience.features).map(key => `${key}: ${experience.features[key]}`).join(', ')
                : [],
              
                pricePerHour: experience?.per_hour_price || 0,
                minHours: experience?.duration_hour || 0,
                type: 'regular-exp'
              };
            } else if (item?.event) {
              const event =item?.event_detials;
              return {
                uniqueKey: `event-${item?.event}-${index}`,
                id: item?.event,
                wishlistId: item?.id,
                name: event?.name || 'Event',
                description: event?.description || 'No description available',
                image: event?.event_image ? `${process.env.NEXT_PUBLIC_S3_URL}${event?.event_image}` : null,
                features: [],
                pricePerHour: 0,
                minHours: 0,
                type: 'event'
              };
            }
          } catch (error) {
            console.error(`Error processing wishlist item:`, error);
          }
          return null;
        }));

        setCartItems(detailedItems.filter(item => item !== null));
      } catch (error) {
        console.error('Error loading wishlist:', error);
      } finally {
        setLoading(false);
      }
    };

    loadWishlist();
  }, [session, status]);

  ///test
  // useEffect(()=>{
// console.log("cartItems",cartItems)
// const filterYaccart = cartItems.filter((item)=>item?.id == 55);
// console.log("filterYaccart",filterYaccart)

//   },[cartItems])

  // Show loading state while checking session
  if (status === 'loading') {
    return (
      <section className="py-10">
        <div className="max-w-5xl px-2 mx-auto flex items-center space-x-4">
          <div className="animate-pulse w-10 h-10 bg-gray-200 rounded-full"></div>
          <div className="h-6 bg-gray-200 w-1/4 rounded"></div>
        </div>
        <div className="max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-6 px-2 mx-auto my-12">
          {Array(4).fill(null).map((_, index) => (
            <SkeletonLoader key={index} />
          ))}
        </div>
      </section>
    );
  }

  // If not logged in, show login prompt
  if (!session) {
    return (
      <section className="py-16 text-center">
        <div className="max-w-md mx-auto px-4">
          <h2 className="text-2xl font-bold mb-4">Welcome to Your Wishlist</h2>
          <p className="text-gray-600 mb-6">
            Looks like you're not logged in. Please sign in to view and manage your wishlist.
          </p>
          <Button 
            onClick={() => router.push('/login')}
            className="bg-[#BEA355] hover:bg-[#a68f4b] text-white rounded-full"
          >
            Login to Continue
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section className="py-10 ">
      <div className="max-w-5xl px-2 mx-auto flex items-center space-x-4">
        <Button 
          onClick={() => router.back()}
          className="bg-[#F8F8F8] hover:bg-[#F8F8F8] shadow-md rounded-full flex items-center justify-center w-10 h-10"
        >
          <ArrowLeft className="w-4 h-4 text-black" />
        </Button>
        <h1 className="text-sm md:text-lg font-medium">My Wishlist</h1>
      </div>
      <div className="max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-6 px-2 mx-auto my-12">
        {loading ? (
          Array(4)
            .fill(null)
            .map((_, index) => <SkeletonLoader key={index} />)
        ) : cartItems.length > 0 ? (
          cartItems.map((yacht) => (
            <CartItem 
              key={yacht?.uniqueKey} 
              yacht={yacht} 
            />
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <h2 className="text-xl font-semibold mb-4">Your Wishlist is Empty</h2>
            <p className="text-gray-600 mb-6">
              Explore our yachts and add your favorites to the wishlist.
            </p>
            <Button 
              onClick={() => router.push('/dashboard/yachts')}
              className="bg-[#BEA355] hover:bg-[#a68f4b] text-white"
            >
              Browse Yachts
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default Cart;