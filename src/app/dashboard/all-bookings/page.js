"use client";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft } from "lucide-react";
import React, { useState, useEffect, useMemo } from "react";
import BookingCards from "./BookingCard";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Loading } from "@/components/ui/loading";
import { Sailboat } from "lucide-react"; // Import Sailboat icon
import { isAfter, parseISO, startOfDay } from "date-fns";
import { classifyBookings } from "@/helper/bookingHelper";

const AllBookings = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Compute user ID
  const userId = useMemo(() => {
    return session?.user?.userid || null;
  }, [session]);

  // Fetch bookings effect
  useEffect(() => {
    // Only fetch if authenticated and have a user ID
    if (status !== "authenticated" || !userId) {
      setLoading(false);
      return;
    }

    const fetchBookings = async () => {
      try {
        // Fetch bookings from multiple endpoints
        const [yachtResponse, experienceResponse, f1yachtResponse, eventResponse] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/yacht/get_yacht_booking/${userId}?BookingType=regular`),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/yacht/get_exp_booking/${userId}/?BookingType=duration`),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/yacht/get_yacht_booking/${userId}?BookingType=f1yachts`),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/yacht/get_event_booking/${userId}`),
          // fetch(`${process.env.NEXT_PUBLIC_API_URL}/yacht/get_exp_booking/1/?BookingType=date_range`)

        ]);

        // Check responses
        // if (!yachtResponse.ok || !eventResponse.ok || !experienceResponse.ok) {
        //   throw new Error('Failed to fetch bookings');
        // }
        if (!yachtResponse.ok || !experienceResponse.ok || !f1yachtResponse.ok || !eventResponse.ok) {
          throw new Error('Failed to fetch bookings');
        }

        const [yachtData, experienceData, f1yachtData, eventData] = await Promise.all([
          yachtResponse.json(),
          experienceResponse.json(),
          f1yachtResponse.json(),
          eventResponse.json(),
        ]);

        // console.log("yach",yachtData)
        // console.log("experienceData",experienceData)
        // console.log("f1yachtData",f1yachtData)
        // console.log("eventData",eventData)


        // Process yacht bookings
        const yachtBookings = yachtData.data ? yachtData.data.map(item => ({
          ...item.booking[0],
          yacht: item?.yacht[0],
          type: 'yacht',
          name: item?.yacht[0]?.name,
          image: item?.yacht[0]?.yacht_image,
          location: item?.yacht[0]?.location
        })) : [];


        const f1yachtBookings = f1yachtData?.data ? f1yachtData?.data.map(item => ({
          ...item.booking[0],
          yacht: item?.yacht[0],
          type: 'f1yachts',
          name: item?.yacht[0]?.name,
          image: item?.yacht[0]?.yacht_image,
          location: item?.yacht[0]?.location
        })) : [];
        // console.log("f1yachtBookings",f1yachtBookings)
        // console.log("yachtBookings",yachtBookings)

        // Process event bookings
        const eventBookings = eventData?.data ? eventData?.data.map(item => ({
          ...item.booking[0],
          yacht: item?.event[0],
          type: 'event',
          name: item?.event[0]?.name,
          image: item?.event[0]?.event_image,
          location: 'Event Location',
          selected_date: item?.event[0].from_date,
          duration_hour: item?.event[0].duration_hour
        })) : [];

        // Process experience bookings
        const experienceBookings = experienceData?.data ? experienceData?.data.map(item => ({
          ...item.booking[0],
          yacht: item?.experience[0],
          type: 'regular-exp',
          name: item?.experience[0]?.name,
          image: item?.experience[0]?.experience_image,
          location: item?.experience[0]?.location
        })) : [];

        // console.log(experienceBookings)

        // Combine all bookings
        const allBookings = [...yachtBookings, ...f1yachtBookings, ...eventBookings, ...experienceBookings];

        // Categorize bookings based on date
        // ?.filter(booking => booking?.type === "f1yachts")

        const processedBookings = allBookings
          // ?.filter(booking => booking?.type === "event")

          ?.map(booking => {
            const today = new Date();

            // Use end_date for f1yachts, otherwise selected_date
            const selectedDate = new Date(
              booking.type === "f1yachts" ? booking.start_date : booking.type === "event" ? booking.from_date : booking.selected_date
            );

            return {
              ...booking,
              daysLeft: Math.ceil((selectedDate - today) / (1000 * 60 * 60 * 24))
            };
          })
          .sort((a, b) => {
            const dateA =
              a.type === "f1yachts"
                ? new Date(a.start_date) :
                a.type === "event"
                  ? new Date(a.from_date)
                  : new Date(a.selected_date);
            const dateB =
              b.type === "f1yachts"
                ? new Date(b.start_date) :
                a.type === "event"
                  ? new Date(a.from_date)
                  : new Date(b.selected_date);

            return dateA - dateB; // Ascending sort
          });


        // let filterData = processedBookings.filter((booking)=>booking?.type=="f1yachts")
        // console.log(filterData)
        // console.log(processedBookings)
        setBookings(processedBookings);
      } catch (error) {
        console.error('Error fetching bookings:', error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [userId, status]);

  // Memoize filtered bookings
  const { upcoming: upcomingBookings, past: pastBookings, cancel: cancelBookings } = useMemo(() => {
    return classifyBookings(bookings);
  }, [bookings]);
  //test
  //   useEffect(()=>{

  // console.log("bookings",bookings)
  // console.log("upcomingBookings",upcomingBookings)
  // console.log("pastBookings",pastBookings)  
  //  console.log("cancelBookings",cancelBookings)

  //   },[bookings,upcomingBookings,pastBookings,cancelBookings])

  if (status === "loading") {
    return <Loading />;
  }

  if (!session) {
    return (
      <section className="py-16 text-center">
        <div className="max-w-md mx-auto px-4">
          <h2 className="text-2xl font-bold mb-4">View Your Bookings</h2>
          <p className="text-gray-600 mb-6">
            Looks like you're not logged in. Please sign in to view your bookings.
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

  if (error) {
    return <div className="text-center text-red-500">Error loading bookings. Please try again later.</div>;
  }

  return (
    <section className="py-10">
      <div className="max-w-5xl px-2 mx-auto flex items-center space-x-4">
        <Button
          onClick={() => router.back()}
          className="bg-[#F8F8F8] hover:bg-[#F8F8F8] shadow-md rounded-full flex items-center justify-center w-10 h-10"
        >
          <ArrowLeft className="w-4 h-4 text-black" />
        </Button>
        <h1 className="text-sm md:text-lg font-medium">All Bookings</h1>
      </div>
      <div className="max-w-5xl px-2 mx-auto my-6">
        <Tabs defaultValue="upcoming" className="w-full">
          <TabsList className="w-full flex justify-center rounded-full items-center h-12">
            <TabsTrigger
              className="text-sm md:text-md font-medium rounded-full w-full h-10"
              value="upcoming"
            >
              Upcoming Bookings
            </TabsTrigger>
            <TabsTrigger
              className="text-sm md:text-md font-medium rounded-full w-full h-10"
              value="past"
            >
              Past Bookings
            </TabsTrigger>
            <TabsTrigger
              className="text-sm md:text-md font-medium rounded-full w-full h-10"
              value="cancel"
            >
              Cancel Bookings
            </TabsTrigger>
          </TabsList>
          <TabsContent value="upcoming">
            {upcomingBookings.length === 0 && !loading ? (
              <div className="flex flex-col items-center justify-center w-full py-12 text-center">
                <Sailboat className="w-16 h-16 text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No Upcoming Bookings Found</h3>
                <p className="text-gray-500 mb-6">
                  You haven't made any upcoming yacht bookings yet. Start exploring our amazing yacht experiences!
                </p>
                <Button
                  onClick={() => router.push('/dashboard')}
                  className="bg-[#BEA355] hover:bg-[#a68f4b] text-white rounded-full"
                >
                  Explore Yachts
                </Button>
              </div>
            ) : (
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                <BookingCards
                  bookings={upcomingBookings}
                  loading={loading}
                  bookingType="upcoming"

                />
              </div>
            )}
          </TabsContent>
          <TabsContent value="past">
            {pastBookings.length === 0 && !loading ? (
              <div className="flex flex-col items-center justify-center w-full py-12 text-center">
                <Sailboat className="w-16 h-16 text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No Past Bookings Found</h3>
                <p className="text-gray-500 mb-6">
                  You haven't made any past yacht bookings yet. Start exploring our amazing yacht experiences!
                </p>
                <Button
                  onClick={() => router.push('/dashboard')}
                  className="bg-[#BEA355] hover:bg-[#a68f4b] text-white rounded-full"
                >
                  Explore Yachts
                </Button>
              </div>
            ) : (
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                <BookingCards
                  bookings={pastBookings}
                  loading={loading}
                  bookingType="past"

                />
              </div>
            )}
          </TabsContent>
          <TabsContent value="cancel">
            {cancelBookings.length === 0 && !loading ? (
              <div className="flex flex-col items-center justify-center w-full py-12 text-center">
                <Sailboat className="w-16 h-16 text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No Cancel Bookings Found</h3>
                <p className="text-gray-500 mb-6">
                  You haven't made any past yacht bookings yet. Start exploring our amazing yacht experiences!
                </p>
                <Button
                  onClick={() => router.push('/dashboard')}
                  className="bg-[#BEA355] hover:bg-[#a68f4b] text-white rounded-full"
                >
                  Explore Yachts
                </Button>
              </div>
            ) : (
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                <BookingCards
                  bookings={cancelBookings}
                  loading={loading}
                  bookingType="cancel"
                />
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};

export default AllBookings;