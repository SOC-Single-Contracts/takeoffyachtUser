"use client";
import { useEffect, useState } from 'react';
import BookingWizard from "./BookingWizard";
import { useParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { fetchEvents } from '@/api/yachts';
import { useSession } from 'next-auth/react';
import { Loading } from '@/components/ui/loading';
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { findEventById } from '@/api/events';

export default function BookingPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  const [eventData, setEventData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        // Only fetch if session is fully loaded and user is authenticated
        if (session?.user?.userid) {
          // const events = await fetchEvents(session.user.userid);
          // const event = events.find(item => item.event.id.toString() === id);
                  const event = await findEventById(id)
                  // console.log("event",event)
          
          
          if (!event) {
            throw new Error('Event not found');
          }
          
          setEventData(event);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    // Immediately stop loading if no session or session is loading
    if (session === null) {
      setLoading(false);
    } else {
      fetchEventData();
    }
  }, [id, session]);

  // Separate effect for handling unauthenticated state
  useEffect(() => {
    if (status === 'unauthenticated') {
      toast({
        title: "Login Required",
        description: "You need to be logged in to book an event",
        variant: "destructive"
      });
      router.push('/login');
    }
  }, [status, toast, router]);


  // useEffect(() => {
  // console.log("eventData", eventData);
  // }, [eventData]);

  // Handle different loading and session states
  if (loading || status === 'loading') {
    return <Loading />;
  }

  if (error) {
    return <div className="text-center text-red-500 p-4">{error}</div>;
  }

  return <BookingWizard initialEventData={eventData} />;
}