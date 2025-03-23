'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import EmptySearch from '@/components/shared/EmptySearch';
import yachtApi from '@/services/api';
import { format } from 'date-fns';
import { useSession } from 'next-auth/react';
import EventCard from '../EventCard';

export default function SearchResults() {
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const params = {
          user_id: session?.user?.userid || 1,
          location: searchParams.get('location'),
          date: searchParams.get('date')
        };

        const response = await yachtApi.checkEvents(params);
        if (response.error_code === 'pass' && response.data) {
          // Access the event objects properly
          setResults(response.data.map(item => item.event));
        } else {
          setError(response.message || 'No results found');
        }
      } catch (err) {
        console.error('Search error:', err);
        setError(err.message || 'Failed to fetch results');
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [searchParams, session]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#BEA355]" />
      </div>
    );
  }

  if (error || !results.length) {
    return (
      <EmptySearch
        type="events"
        searchParams={Object.fromEntries(searchParams.entries())}
      />
    );
  }

  return (
    <div className="max-w-5xl px-2 mx-auto py-8">
      <h1 className="text-2xl font-semibold mb-6">
        Search Results ({results.length})
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {results.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </div>
  );
}
