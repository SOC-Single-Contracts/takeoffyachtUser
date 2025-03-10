'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dot } from 'lucide-react';
import { useState } from 'react';
import { addToWishlist, removeFromWishlist } from '@/api/wishlist';
import { useSession } from 'next-auth/react';

export default function YachtCard({ yacht }) {
  const { yacht: yachtData, categories } = yacht;
  const { data: session } = useSession();
  const [isFavorite, setIsFavorite] = useState(false);

  const handleWishlistToggle = async () => {
    try {
      if (isFavorite) {
        // await removeFromWishlist(yachtData?.id);
      } else {
        await addToWishlist(session?.user?.userid, yachtData?.id);
      }
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error('Wishlist toggle error:', error);
    }
  };

  return (
    <Card className="overflow-hidden cursor-pointer bg-white dark:bg-gray-800 w-full max-w-[350px] rounded-2xl h-full min-h-[280px] shadow-lg hover:shadow-2xl transition duration-500 ease-in-out">
        <Link href={`/dashboard/yachts/${yachtData?.id}`}>
      <div className="relative">
        <Image
          src={
            yachtData?.yacht_image 
              ? `https://api.takeoffyachts.com${yachtData?.yacht_image}`
              : yachtData?.image1
                ? `https://api.takeoffyachts.com${yachtData?.image1}`
                : '/assets/images/fycht.jpg'
          }
          alt={yachtData?.name}
          width={326}
          height={300}
          className="object-cover px-3 pt-3 rounded-3xl w-full h-[221px]"
          onError={(e) => {
            e.target.src = '/assets/images/fycht.jpg'
          }}
        />

          <p className="absolute inset-0"></p>

        <Button
          variant="secondary"
          size="icon"
          className="absolute top-6 right-6 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white"
          onClick={handleWishlistToggle}
          >
          <Image 
            src={isFavorite 
              ? "/assets/images/wishlist.svg" 
              : "/assets/images/unwishlist.svg"
            } 
            alt="wishlist" 
            width={20} 
            height={20} 
            />
        </Button>

        <div className="absolute bottom-4 right-6 bg-white dark:bg-gray-800 p-1.5 rounded-md shadow-md">
          <span className="font-medium text-xs">
            AED <span className="font-bold text-lg text-primary">{yachtData?.per_hour_price}</span>
            <span className="text-xs font-light ml-1">/Hour</span>
          </span>
        </div>
      </div>
      
      <CardContent className="px-4 py-2">
        <div className="flex justify-between items-center">
          <h3 className="text-[20px] font-semibold mb-1 truncate max-w-[230px]">{yachtData?.name}</h3>
          <span className="font-medium text-xs">
            AED <span className="font-bold text-sm text-primary">{yachtData?.per_hour_price}</span>
            <span className="text-xs font-light ml-1">/Day</span>
          </span>
        </div>

        <div className="flex justify-start items-center gap-1 flex-wrap">
          <Image 
            src="/assets/images/transfer.svg" 
            alt="length" 
            width={9} 
            height={9} 
            className="" 
            />
          <p className="font-semibold text-xs">{yachtData?.length || 0} ft</p>
          <Dot />
          <div className="text-center font-semibold flex items-center text-xs space-x-2">
            <Image 
              src="/assets/images/person.svg" 
              alt="guests" 
              width={8} 
              height={8} 
              className="dark:invert" 
              />
            <p>Guests</p>
            <p>{yachtData?.guest || 0}</p>
          </div>
          <Dot />
          <div className="text-center font-semibold flex items-center text-xs space-x-2">
            <Image 
              src="/assets/images/cabin.svg" 
              alt="cabins" 
              width={8} 
              height={8} 
              className="dark:invert" 
            />
            <p>Cabins</p>
            <p>{yachtData?.number_of_cabin || 0}</p>
          </div>
         
        </div>
      </CardContent>
              </Link>
    </Card>
  );
}
