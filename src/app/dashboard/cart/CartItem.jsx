import { Button } from "@/components/ui/button";
import Image from "next/image";
import React from "react";
import { featuredyachts, logo } from "../../../../public/assets/images";
import Link from "next/link";
import YachtDetailsGrid from "../../../../components/YachtDetailsGrid";
import { Heart, Trash, ArrowRight } from 'lucide-react';
import { removeFromWishlist } from '@/api/wishlist'

const CartItem = ({ yacht, userId, upatedWhislist }) => {
  const { id, wishlistId, name, description, image, features, pricePerHour, minHours, type } = yacht;
  // console.log(type)

  const getBookingLink = () => {
    switch (type) {
      case 'yacht':
        return `/dashboard/yachts/${id}/booking`;
      case 'f1-yachts':
        return `/dashboard/f1yachts/${id}/booking`;
      case 'regular-exp':
        return `/dashboard/experience/regular-exp/${id}/booking`;
      case 'event':
        return `/dashboard/event/all/${id}`;
      default:
        return `/dashboard/yachts/${id}/booking`; // Default to yacht booking
    }
  };

  const getNavLink = () => {
    switch (type) {
      case 'yacht':
        return `/dashboard/yachts/${id}`;
      case 'f1-yachts':
        return `/dashboard/f1yachts/${id}`;
      case 'regular-exp':
        return `/dashboard/experience/regular-exp/${id}`;
      case 'event':
        return `/dashboard/event/all/${id}`;
      default:
        return `/dashboard/yachts/${id}`; // Default to yacht booking
    }
  };

  const getButtonText = () => {
    switch (type) {
      case 'yacht':
        return 'Resume Booking';
      case 'experience':
        return 'Resume Booking';
      case 'event':
        return 'View Event Details';
      default:
        return 'Resume Booking';
    }
  };

  const handleRemoveFromWishlist = async () => {
    try {
      const response = await fetch(`https://api.takeoffyachts.com/wishlist/wishlistdelete/${wishlistId}/`, {
        method: 'DELETE'
      });

      if (response.ok) {
        console.log('Item removed from wishlist');
      }
    } catch (error) {
      console.error('Error removing item from wishlist:', error);
    }
  };


  const deleteWishlistItem = async () => {
    await removeFromWishlist(userId, id, type);
    upatedWhislist()
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg overflow-hidden"
    onClick={() => window.location.href = getNavLink()}
    >
      <div className="flex relative md:flex-row flex-col md:items-center items-start md:space-x-4">
        <Image
          src={image || featuredyachts}
          alt={name}
          className="w-full md:max-w-[120px] max-w-[100px] md:h-[110px] h-[100px] object-cover rounded-3xl"
          width={100}
          height={100}
          onError={(e) => {
            e.target.src = '/assets/images/Imagenotavailable.png';
          }}
        />
        <div className="flex flex-col gap-1 md:mt-0 mt-2">
        <div className="flex items-center justify-between">
            <h1 className="md:text-2xl text-lg font-bold">{name}</h1>
            <div className="cursor-pointer relative">
              <Trash size={20} className="absolute bottom-[14px] right-0 hover:opacity-50 z-10"
                onClick={(e) => {
                  e.stopPropagation()
                  deleteWishlistItem()
                  }} />
            </div>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">{description}</p>
        </div>
        {/* <Button
          onClick={()=>handleRemoveFromWishlist()}
          className="absolute top-2 right-2 bg-white/70 hover:bg-white rounded-full p-2 z-10"
        >
          <Heart className="w-5 h-5 text-red-500 fill-red-500" />
        </Button> */}
      </div>
      <div className="cart-item-details">
        <YachtDetailsGrid yacht={yacht} />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-3">
          {features && Array.isArray(features) ? features.map((feature, index) => (
            <div
              key={index}
              className="flex flex-col justify-center items-center w-full h-20 space-y-2 font-semibold text-sm py-4 border border-gray-200 rounded-lg shadow-sm"
            >
              {feature.Icon && <feature.Icon className="size-5" />}
              <p className="text-gray-700">{feature.text || feature}</p>
            </div>
          )) : ""}
        </div>
      </div>
      <div className="flex justify-between md:flex-row flex-col-reverse md:items-center items-start">
          <Button
            variant="outline"
            className="rounded-full font-medium md:h-10 border-black border-2 md:mt-0 mt-2"
            onClick={(e) => {
              e.stopPropagation()
              window.location.href = getBookingLink()
              }}
          >
            {getButtonText()}
          </Button>
          <Button
            className="bg-[#F8F8F8] hover:bg-[#F8F8F8] shadow-md rounded-full flex items-center justify-center w-10 h-10"
            onClick={(e) => {
              e.stopPropagation()
              window.location.href = getNavLink()
              }}
          >
            <ArrowRight className="w-4 h-4 text-black" />
          </Button>
        {/* <div className="flex flex-col text-start">
          <p className="text-sm font-medium">
            AED{" "}
            <span className="md:text-2xl text-lg font-bold">
              {pricePerHour}
            </span>{" "}
            /hour
          </p>
          <p className="text-sm text-gray-500">Min. {minHours} Hours</p>
        </div> */}
      </div>
    </div>
  );
};

export default CartItem;
