// "use client";
// import { useState, useEffect } from 'react';
// import { Button } from '@/components/ui/button';
// import { ArrowLeft } from 'lucide-react';
// import UserDetails from './UserDetails';
// import Selection from './Selection';
// import Payment from './Payment';
// import Summary from './Summary';
// import { BookingProvider } from './BookingContext';
// import { useParams, useSearchParams } from 'next/navigation';
// import { fetchYachts } from '@/api/yachts';
// import { useSession } from 'next-auth/react';
// import { useBookingContext } from './BookingContext';

// const steps = [
//   { id: 1, title: 'Selection', component: Selection },
//   { id: 2, title: 'User Details', component: UserDetails },
//   { id: 3, title: 'Summary', component: Summary },
//   { id: 4, title: 'Payment', component: Payment },
// ];

// const BookingWizardContent = () => {
//   const [currentStep, setCurrentStep] = useState(1);
//   const { id } = useParams();
//   const { data: session } = useSession();
//   const { setSelectedYacht } = useBookingContext();

//   useEffect(() => {
//     const getYachtDetails = async () => {
//       try {
//         const yachts = await fetchYachts(session?.user?.userid);
//         const yacht = yachts.find(
//           (item) => item.yacht.id.toString() === id
//         );
//         if (yacht) {
//           setSelectedYacht(yacht);
//         }
//       } catch (error) {
//         console.error('Error fetching yacht details:', error);
//       }
//     };

//     if (session?.user?.userid && id) {
//       getYachtDetails();
//     }
//   }, [id, session?.user?.userid, setSelectedYacht]);

//   const handleNext = () => {
//     setCurrentStep((prev) => Math.min(prev + 1, steps.length));
//   };

//   const handleBack = () => {
//     setCurrentStep((prev) => Math.max(prev - 1, 1));
//   };

//   const CurrentStepComponent = steps[currentStep - 1].component;

//   return (
//     <section className="py-10">
//       <div className="container mx-auto px-4">
//         <div className="flex items-center space-x-4 mb-8">
//           {currentStep > 1 && (
//             <Button
//               onClick={handleBack}
//               className="bg-[#F8F8F8] hover:bg-[#F8F8F8] shadow-md rounded-full flex items-center justify-center w-10 h-10"
//             >
//               <ArrowLeft className='w-4 h-4 text-black' />
//             </Button>
//           )}
//           <h1 className='text-sm md:text-lg font-medium'>{steps[currentStep - 1].title}</h1>
//         </div>

//         <div className="w-full bg-gray-200 rounded-full h-2.5 mb-8">
//           <div 
//             className="bg-[#BEA355] h-2.5 rounded-full transition-all duration-300"
//             style={{ width: `${(currentStep / steps.length) * 100}%` }}
//           ></div>
//         </div>

//         <div className="mt-8">
//           <CurrentStepComponent onNext={handleNext} />
//         </div>
//       </div>
//     </section>
//   );
// };

// const BookingWizard = () => {
//   return (
//     <BookingProvider>
//       <BookingWizardContent />
//     </BookingProvider>
//   );
// };

// export default BookingWizard;
"use client";
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import UserDetails from './UserDetails';
import Selection from './Selection';
import Payment from './Payment';
import Summary from './Summary';
import { BookingProvider } from './BookingContext';

const steps = [
  { id: 1, title: 'Selection', component: Selection },
  { id: 2, title: 'User Details', component: UserDetails },
  { id: 3, title: 'Summary', component: Summary },
  { id: 4, title: 'Payment', component: Payment },
];

const BookingWizardContent = ({ eventData }) => {
  const [currentStep, setCurrentStep] = useState(2);

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
          {currentStep > 2 && (
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
          <CurrentStepComponent onNext={handleNext} eventData={eventData} />
        </div>
      </div>
    </section>
  );
};

const BookingWizard = ({ initialEventData }) => {
  return (
    <BookingProvider initialEventData={initialEventData}>
      <BookingWizardContent eventData={initialEventData} />
    </BookingProvider>
  );
};

export default BookingWizard;