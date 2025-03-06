"use client";
import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { fetchFormulaOne } from '@/api/yachts';
import { useSession } from 'next-auth/react';
import { Sailboat, RefreshCw } from 'lucide-react';

const SkeletonCard = () => (
  <Card className="overflow-hidden bg-gray-100 dark:bg-gray-800 rounded-2xl shadow-md w-full max-w-[250px] h-full max-h-[260px] animate-pulse">
      <div className="relative bg-gray-300 dark:bg-gray-700 h-[170px] rounded-t-2xl"></div>
      <CardContent className="px-4 py-2 space-y-3">
        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
        <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
        <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-full"></div>
      </CardContent>
  </Card>
);

const EmptyEventState = ({ onRetry }) => {
  return (
    <section className="py-16">
      <div className="container px-4 mx-auto text-center">
        <Sailboat className="w-24 h-24 text-[#BEA355] mx-auto mb-6" />
        <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">
          No Events Available
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
          We're currently updating our event collection. 
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
          <Link href="/dashboard/events">
            <Button 
              variant="outline" 
              className="rounded-full border-[#BEA355] text-[#BEA355] hover:bg-[#BEA355]/10"
            >
              Explore All Events
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

const FormulaOne = ({ limit = 4 }) => {
  const { data: session } = useSession()
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchFormulaOne();
      setEvents(data);
    } catch (err) {
      console.error('Events fetching error:', err);
      setError(err.message || 'Unable to load events. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getEvents();
  }, []);

  if (loading) {
    return (
      <section className="py-10 px-2">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Formula One</h1>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 place-items-center">
            {Array(4)
              .fill(0)
              .map((_, idx) => (
                <SkeletonCard key={idx} />
              ))}
          </div>
        </div>
      </section>
    );
  }

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
              onClick={getEvents} 
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

  // No Events Available State
  if (events.length === 0) {
    return <EmptyEventState onRetry={getEvents} />;
  }

  const eventsToDisplay = events.slice(0, limit);

  return (
    <section className="py-8 px-2">
      <div className="max-w-5xl mx-auto">
        <h1 className="md:text-4xl text-[24px] font-semibold text-start">Formula One</h1>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 place-items-center my-8">
          {eventsToDisplay.map((item) => {
            if (!item) {
              return null;
            }

            return (
              <Card
                key={item.id}
                className="overflow-hidden bg-white dark:bg-gray-800 rounded-2xl shadow-md w-full max-w-[298px] h-full max-h-[260px]"
              >
                <div className="relative">
                <Image src="/assets/images/redtag.png" alt="Hot" width={50} height={50} className="absolute top-0 right-0 z-10" />
                <Image
                    src={
                        item.event_image 
                        ? `https://api.takeoffyachts.com${item.event_image}`
                        : '/assets/images/f1.png'
                    }
                    alt={item.name || 'Event Image'}
                    width={400}
                    height={250}
                    className="object-cover px-3 pt-3 rounded-3xl h-[170px]"
                    onError={(e) => {
                        e.target.src = '/assets/images/f1.png'
                    }}
                    />

                  <Link href={`/dashboard/formula-one/${item.id}`}>
                    <p className="absolute inset-0 z-10"></p>
                  </Link>

                  <div className="absolute bottom-2 right-5 bg-white dark:bg-gray-900 backdrop-blur-sm p-1.5 rounded-md">
                    <span className="text-xs font-medium">
                      {/* Assuming packages is part of the item, adjust if not */}
                      {item.packages?.length || 0} Package Available
                    </span>
                  </div>
                </div>
                <CardContent className="px-4 py-2">
                  <h3 className="text-md font-semibold mb-1">{item.name || 'Unnamed Event'}</h3>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-black dark:text-gray-400">
                      {item.location || 'Location N/A'}
                    </span>
                  </div>
                  <p className="text-xs text-black mb-4 dark:text-gray-400">
                    {(item.description || '').substring(0, 24)}...
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
        <Link href="/dashboard/formula-one">
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
  );
};

export default FormulaOne;