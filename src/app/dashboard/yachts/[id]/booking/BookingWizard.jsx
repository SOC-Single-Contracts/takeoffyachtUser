"use client";
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import UserDetails from './UserDetails';
import Selection from './Selection';
import Payment from './Payment';
import Summary from './Summary';
import { BookingProvider } from './BookingContext';
import { useParams } from 'next/navigation';
import { fetchYachts } from '@/api/yachts';
import { useSession } from 'next-auth/react';
import { useBookingContext } from './BookingContext';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { Loading } from '@/components/ui/loading';

const steps = [
  { id: 1, title: 'Booking Details', component: Selection },
  { id: 2, title: 'User Details', component: UserDetails },
  { id: 3, title: 'Booking Summary', component: Summary },
  { id: 4, title: 'Make Payment', component: Payment },
];

const BookingWizardContent = ({ initialBookingId }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const { id } = useParams();
  const { data: session, status } = useSession();
  const { setSelectedYacht, updateBookingData } = useBookingContext();
  const router = useRouter();
  const { toast } = useToast();

  // Authentication check
  // useEffect(() => {
  //   if (status === 'unauthenticated') {
  //     toast({
  //       title: "Login Required",
  //       description: "You need to be logged in to book a yacht",
  //       variant: "destructive"
  //     });
  //     router.push('/login');
  //   }
  // }, [status, toast, router]);

  useEffect(() => {
    const getYachtDetails = async () => {
      try {
        const yachts = await fetchYachts(1);
        const yacht = yachts.find(
          (item) => item.yacht.id.toString() === id
        );
        if (yacht) {
          setSelectedYacht(yacht);
        }
      } catch (error) {
        console.error('Error fetching yacht details:', error);
      }
    };

    if (id) {
      getYachtDetails();
    }
  }, [id, setSelectedYacht]);

  // If initialBookingId is provided, update booking data
  useEffect(() => {
    if (initialBookingId) {
      updateBookingData({ bookingId: initialBookingId });
      setCurrentStep(3); // Move directly to Summary step
    }
  }, [initialBookingId]);

  // Show loading while checking session
  if (status === 'loading') {
    return <Loading />;
  }

  // Prevent rendering if not authenticated
  // if (status === 'unauthenticated') {
  //   return null;
  // }

  const handleNext = () => {
    setCurrentStep((prev) => Math.min(prev + 1, steps.length));
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const CurrentStepComponent = steps[currentStep - 1].component;

  return (
    <section className="py-6 md:py-10 ">
      <div className="max-w-5xl mx-auto px-2">
        <div className="flex items-center space-x-4 mb-8">
          {currentStep > 1 && (
            <Button
              onClick={handleBack}
              className="bg-[#F8F8F8] hover:bg-[#F8F8F8] shadow-md rounded-full flex items-center justify-center w-10 h-10"
            >
              <ArrowLeft className='w-4 h-4 text-black' />
            </Button>
          )}
          <h1 className='text-sm md:text-lg font-medium'>{steps[currentStep - 1].title}</h1>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-8">
          <div 
            className="bg-[#BEA355] h-2.5 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / steps.length) * 100}%` }}
          ></div>
        </div>

        <div className="mt-8">
          <CurrentStepComponent 
            onNext={handleNext} 
            initialBookingId={initialBookingId} 
          />
        </div>
      </div>
    </section>
  );
};

const BookingWizard = ({ initialBookingId }) => {
  return (
    <BookingProvider>
      <BookingWizardContent initialBookingId={initialBookingId} />
    </BookingProvider>
  );
};

export default BookingWizard;