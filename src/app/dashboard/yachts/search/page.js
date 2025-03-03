'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import EmptySearch from '@/components/shared/EmptySearch';
import yachtApi from '@/services/api';
import { format } from 'date-fns';
import { useSession } from 'next-auth/react';
import YachtCard from '@/components/yachts/YachtCard';
import { Loading } from '@/components/ui/loading';

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
          created_on: format(new Date(), 'yyyy-MM-dd'),
          guest: parseInt(searchParams.get('guests')) || 1,
          location: searchParams.get('location'),
          min_price: 1000,
          max_price: 4000,
          capacity: parseInt(searchParams.get('guests')) || 1,
          price_des: true,
          price_asc: false,
          cabin_des: false,
          cabin_asc: true,
        };

        const response = await yachtApi.checkYachts(params);
        if (response.error_code === 'pass' && response.data) {
          setResults(response.data);
        } else {
          setError(response.message || 'No results found');
        }
      } catch (err) {
        setError(err.message || 'Failed to fetch results');
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [searchParams, session]);

  if (loading) {
    return (
      <Loading />
    );
  }

  if (error || !results.length) {
    return (
      <EmptySearch
        type="yachts"
        searchParams={Object.fromEntries(searchParams.entries())}
      />
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-8 px-2">
      <h1 className="text-2xl font-semibold mb-6">
        Search Results ({results.length})
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {results.map((yacht) => (
          <YachtCard key={yacht.id} yacht={yacht} />
        ))}
      </div>
    </div>
  );
}
