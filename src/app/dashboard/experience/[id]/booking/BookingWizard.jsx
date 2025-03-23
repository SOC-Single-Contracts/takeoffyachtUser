"use client";
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Selection from './Selection';
import Summary from './Summary';
import UserDetails from './UserDetails';
import Payment from './Payment';
import { BookingProvider } from './BookingContext';
import { useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useBookingContext } from './BookingContext';

const steps = [
  { id: 1, title: 'Booking Details', component: Selection },
  { id: 2, title: 'User Details', component: UserDetails },
  { id: 3, title: 'Summary', component: Summary },
  { id: 4, title: 'Make Payment', component: Payment },
];

const BookingWizardContent = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const { id } = useParams();
  const { data: session } = useSession();
  const { setSelectedExperience } = useBookingContext();

  useEffect(() => {
    const getExperienceDetails = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://api.takeoffyachts.com'}/yacht/get_experience/${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch experience');
        }

        const data = await response.json();
        
        if (data.error_code === "pass" && Array.isArray(data.data)) {
          const experience = data.data.find(
            (item) => item.experience.id.toString() === id
          );
          if (experience) {
            setSelectedExperience(experience);
          } else {
            console.error('Experience not found');
          }
        } else {
          throw new Error(data.data || 'Invalid response format');
        }
      } catch (error) {
        console.error('Error fetching experience details:', error);
      }
    };

    if (id) {
      getExperienceDetails();
    }
  }, [id, setSelectedExperience]);

  const handleNext = () => {
    setCurrentStep((prev) => Math.min(prev + 1, steps.length));
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const CurrentStepComponent = steps[currentStep - 1].component;

  return (
    <section className="py-10">
      <div className="max-w-5xl mx-auto px-4">
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
          <CurrentStepComponent onNext={handleNext} />
        </div>
      </div>
    </section>
  );
};

const BookingWizard = () => {
  return (
    <BookingProvider>
      <BookingWizardContent />
    </BookingProvider>
  );
};

export default BookingWizard;
