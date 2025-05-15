'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import EmptySearch from '@/components/shared/EmptySearch';
import yachtApi from '@/services/api';
import { format } from 'date-fns';
import { useSession } from 'next-auth/react';
import ExperienceCard from '@/components/lp/ExperienceCard';

export default function SearchResults() {
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const totalGuests = parseInt(searchParams.get('guests')) || 1;
        const location = searchParams.get('location');

        const params = {
          user_id: session?.user?.userid || 1,
          created_on: format(new Date(), 'yyyy-MM-dd'),
          guest: totalGuests,
          location: location,
          name:searchParams.get('name') || ""

        };

        const response = await yachtApi.checkExperiences(params);
        if (response.error_code === 'pass' && response.data) {
          setResults(response.data);
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
        type="experiences"
        searchParams={Object.fromEntries(searchParams.entries())}
      />
    );
  }

  return (
    <div className="max-w-5xl px-2 mx-auto py-8">
      <h1 className="text-2xl font-semibold mb-6">
        Search Results ({results.length})
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {results.map((experience) => (
          <ExperienceCard key={experience.id} experience={experience} />
        ))}
      </div>
    </div>
  );
}
