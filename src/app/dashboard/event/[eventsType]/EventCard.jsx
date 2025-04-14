import React from 'react';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';

const EventCard = ({ event, packages, onClick }) => {
    // Early return if no event data
    if (!event) {
        return null;
    }

    // Calculate lowest package price
    const lowestPrice = packages && packages.length > 0 
        ? Math.min(...packages.map(pkg => pkg.package_price || 0))
        : null;

    const handleClick = (e) => {
        e.preventDefault();
        if (onClick) {
            onClick(event.id);
        }
    };
    return (
        <Card className="overflow-hidden bg-white dark:bg-gray-800 rounded-2xl shadow-md w-full max-w-[298px] h-full max-h-[260px]">
            <div className="relative">
                <Image 
                    src={
                        event.event_image 
                        ? `${process.env.NEXT_PUBLIC_API_URL}${event.event_image}`
                        : '/assets/images/f1.png'
                    }
                    alt={event.name || 'Event Image'}
                    width={400}
                    height={250}
                    className="object-cover px-3 pt-3 rounded-3xl h-[170px]"
                    onError={(e) => {
                        e.target.src = '/assets/images/f1.png'
                    }}
                />

                <Link href={`/dashboard/events/${event.id}`}> 
                    <p className="absolute inset-0 z-10"></p>
                </Link>

                {packages && packages.length > 0 && (
                    <div className="absolute bottom-2 right-5 bg-white dark:bg-gray-900 backdrop-blur-sm p-1.5 rounded-md">
                        <span className="text-xs font-medium">
                            {packages.length} Package Available
                        </span>
                    </div>
                )}
            </div>
            
            <CardContent className="px-4 py-2">
                <h3 className="text-md font-semibold mb-1">{event?.name || 'Unnamed Event'}</h3>
                <div className="flex items-center space-x-2">
                    <span className="text-sm text-black dark:text-gray-400">
                        {event?.location || 'Location N/A'}
                    </span>
                </div>
                <p className="text-xs text-black mb-4 dark:text-gray-400">
                    {(event?.description || '').substring(0, 24)}...
                </p>
            </CardContent>
        </Card>
    );
};

export default EventCard;