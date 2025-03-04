import React from 'react';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';

const BrandCard = ({ brand }) => {
    // Early return if no brand data
    if (!brand) {
        return null;
    }

  

    return (
        <Card className="overflow-hidden bg-white dark:bg-gray-800 rounded-2xl shadow-md w-full max-w-[298px] h-full max-h-[260px]">
            <div className="relative">
                <Image 
                    src={
                        brand?.image 
                        ? `${process.env.NEXT_PUBLIC_API_URL}${brand?.image}`
                        : '/assets/images/f1.png'
                    }
                    alt={brand.name || 'brand Image'}
                    width={400}
                    height={250}
                    className="object-cover px-3 pt-3 rounded-3xl h-[120px]"
                    onError={(e) => {
                        e.target.src = '/assets/images/f1.png'
                    }}
                />

                <Link href={`/dashboard/partner-discounts`}> 
                    <p className="absolute inset-0 z-10"></p>
                </Link>
            </div>
            
            <div className="px-4 py-2">
                <h3 className="text-md text-center font-semibold mb-1">{brand?.name || 'Unnamed brand'}</h3>
            </div>
        </Card>
    );
};

export default BrandCard;