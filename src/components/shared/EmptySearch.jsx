import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

const EmptySearch = ({ type = 'yachts', searchParams }) => {
  const router = useRouter();

  const content = {
    yachts: {
      title: 'No Yachts Found',
      description: 'We couldn\'t find any yachts matching your search criteria.',
      // image: '/assets/images/fycht.'
    },
    experiences: {
      title: 'No Experiences Found',
      description: 'We couldn\'t find any experiences matching your search criteria.',
      image: '/assets/images/empty-experience.png'
    },
    events: {
      title: 'No Events Found',
      description: 'We couldn\'t find any events matching your search criteria.',
      image: '/assets/images/empty-event.png'
    }
  };

  const { title, description, image } = content[type] || content.yachts;

  const searchDetails = [
    { label: 'Location', value: searchParams?.location },
    { label: 'Date', value: searchParams?.date ? new Date(searchParams.date).toLocaleDateString() : null },
    { label: 'Guests', value: searchParams?.guests }
  ].filter(detail => detail.value);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 py-16">
      {/* <div className="relative w-64 h-64 mb-8">
        <Image
          src={image}
          alt="No results found"
          fill
          className="object-contain"
        />
      </div> */}
      
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-3">
        {title}
      </h2>
      
      <p className="text-gray-500 dark:text-gray-400 text-center max-w-md mb-6">
        {description}
      </p>

      {searchDetails.length > 0 && (
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-6">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">You searched for:</p>
          <div className="space-y-1">
            {searchDetails.map((detail, index) => (
              <p key={index} className="text-sm">
                <span className="font-medium text-gray-700 dark:text-gray-300">{detail.label}:</span>
                <span className="ml-2 text-gray-600 dark:text-gray-400">{detail.value}</span>
              </p>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-4">
        <Button
          onClick={() => router.back()}
          variant="outline"
          className="rounded-full"
        >
          Go Back
        </Button>
        <Button
          onClick={() => router.push('/dashboard/' + type)}
          className="rounded-full bg-[#BEA355] text-white hover:bg-[#A68D3F]"
        >
          Explore All {type.charAt(0).toUpperCase() + type.slice(1)}
        </Button>
      </div>
    </div>
  );
};

export default EmptySearch;
