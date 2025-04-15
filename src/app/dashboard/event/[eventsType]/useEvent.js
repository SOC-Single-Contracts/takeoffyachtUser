"use client"
import { fetchAllEvents } from '@/api/events'
import { useSession } from 'next-auth/react'
import { useState, useEffect } from 'react'
export const useEvents = () => {
 const [events, setEvents] = useState([])
 const [loading, setLoading] = useState(true)
 const [error, setError] = useState(null)
 const { data } = useSession();
 const userId = data?.user?.id;
  useEffect(() => {
   const loadEvents = async () => {
     setLoading(true); 
     try {
       const eventsData = await fetchAllEvents(userId);
       setEvents(eventsData);
     } catch (error) {
       console.error('Failed to load events:', error);
       setError('Failed to load events. Please try again later.'); 
     } finally {
       setLoading(false); 
     }
   };

   if (userId) { 
     loadEvents();
   }
 }, [userId])
  return { events, loading, error }
}
