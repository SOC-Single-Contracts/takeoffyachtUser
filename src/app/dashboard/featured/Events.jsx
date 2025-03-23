"use client"
import { Loading } from "@/components/ui/loading"
import NotFound from "@/app/not-found"
import EventCard from "../events/EventCard"
import { useState, useEffect } from 'react';
import { fetchEvents } from "@/api/yachts"

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getEvents = async () => {
      try {
        const data = await fetchEvents(1);
        setEvents(data);
      } catch (err) {
        setError(err.message || 'Unexpected Error');
      } finally {
        setLoading(false);
      }
    };
  
    getEvents();
  }, []);

  if (loading) return <Loading />
  if (error) return <NotFound />
  return (
    <div className="container mx-auto py-8 px-6">
      <h1 className="text-3xl font-bold mb-6">All Events</h1>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 place-items-center justify-center w-full">
        {events.slice(0, 4).map((eventData) => (
          <EventCard key={eventData.event.id} eventData={eventData} />
        ))}
      </div>
    </div>
  )
}
export default Events