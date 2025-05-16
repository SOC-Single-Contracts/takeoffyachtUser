"use client";
import { Button } from '@/components/ui/button';
import { CheckCircle, CreditCard } from 'lucide-react';
import { useBookingContext } from './BookingContext';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { format } from 'date-fns';

// Initialize Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

const PaymentForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const { bookingDetails, selectedExperience, calculateTotal } = useBookingContext();
  const { data: session } = useSession();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [cardComplete, setCardComplete] = useState(false);

  const handleCardChange = (event) => {
    setError(event.error ? event.error.message : null);
    setCardComplete(event.complete);
  };

  const validateForm = () => {
    if (!cardComplete) {
      setError('Please complete card details');
      return false;
    }
    if (!selectedExperience?.experience) {
      setError('Experience data not found');
      return false;
    }
    if (!bookingDetails.date || !bookingDetails.startTime) {
      setError('Please select date and time');
      return false;
    }
    if (!bookingDetails.seats || bookingDetails.seats === 0) {
      setError('Please select number of guests');
      return false;
    }
    if (!bookingDetails.phone) {
      setError('Please provide contact information');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    if (!validateForm()) {
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const paymentAmount = calculateTotal();
      
      // Create source from card details
      const { error: sourceError, source } = await stripe.createSource(
        elements.getElement(CardElement),
        {
          type: 'card',
          amount: Math.round(paymentAmount * 100), // Convert to cents and ensure it's a whole number
          currency: 'aed',
          owner: {
            name: bookingDetails.fullName || session?.user?.name,
            email: session?.user?.email,
            phone: bookingDetails.phone,
          },
        }
      );

      if (sourceError) {
        throw new Error(sourceError.message);
      }

      // Process payment with source ID
      const response = await fetch('https://api.takeoffyachts.com/yacht/process-payment/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.accessToken}`
        },
        body: JSON.stringify({
          payment_intent_id: source.id, // Using source.id as the payment token
          booking_type: "experience",
          amount: Math.round(paymentAmount * 100), // Send amount in cents
          user_id: session?.user?.userid,
          email: session?.user?.email,
          experience_id: selectedExperience.experience.id,
          phone_number: bookingDetails.phone,
          message: bookingDetails.message || '',
          duration_hour: bookingDetails.duration_hour,
          selected_date: format(bookingDetails.date, 'yyyy-MM-dd'),
          booking_time: format(bookingDetails.startTime, 'HH:mm:ss'),
          total_cost: Math.round(calculateTotal() * 100), // Send total_cost in cents as well
          seats: bookingDetails.seats,
          extras: bookingDetails.extras || [],
          country: bookingDetails.country,
          guest: bookingDetails.seats // For consistency with other booking types
        })
      });

      const result = await response.json();
      
      if (result.error) {
        throw new Error(result.error);
      }

      // Handle successful payment
      toast.success('Payment successful! Redirecting to success page...');
      router.push('/dashboard/success');

    } catch (error) {
      console.error('Payment error:', error);
      setError(error.message);
      toast.error(error.message || 'Payment processing failed');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className='w-full space-y-6'>
      <div className='bg-white dark:bg-gray-800 rounded-xl shadow-md p-6'>
        <div className='flex items-center gap-2 mb-6'>
          <CreditCard className='w-5 h-5' />
          <h2 className='text-xl font-semibold'>Payment Method</h2>
        </div>

        {error && (
          <div className='bg-red-50 border border-red-200 text-red-700 p-3 rounded-md mb-4'>
            {error}
          </div>
        )}

        <div className='space-y-4'>
          <div className='border rounded-md p-3'>
            <CardElement 
              onChange={handleCardChange}
              options={{
                style: {
                  base: {
                    fontSize: '16px',
                    color: '#424770',
                    '::placeholder': {
                      color: '#aab7c4',
                    },
                  },
                  invalid: {
                    color: '#9e2146',
                  },
                },
                hidePostalCode: true,
              }}
            />
          </div>
          <div className="flex flex-col space-y-2">
            <p className='text-[11px] flex items-center gap-2 bg-green-50 text-green-700 p-1 rounded-md'>
              <CheckCircle className='w-3 h-3 text-green-500' />
              You are only charged if the owner accepts.
            </p>
            <p className='text-[11px] flex items-center gap-2 bg-green-50 text-green-700 p-1 rounded-md'>
              <CheckCircle className='w-3 h-3 text-green-500' />
              Guaranteed response within 24 hours
            </p>
          </div>
          <div className='text-xs text-gray-500'>
            We accept all major credit and debit cards including Visa, Mastercard, and American Express
          </div>
        </div>
      </div>

      <Button 
        type='submit'
        disabled={isProcessing || !stripe || !cardComplete}
        className='w-full bg-[#BEA355] text-white hover:bg-[#A89245] rounded-full disabled:opacity-50 disabled:cursor-not-allowed h-10'
      >
        {isProcessing ? 'Processing...' : `Pay AED ${calculateTotal()}`}
      </Button>
    </form>
  );
};

const Payment = () => {
  const { bookingDetails, selectedExperience, calculateTotal } = useBookingContext();

  return (
    <div className='mx-auto container flex justify-between md:flex-row flex-col items-start gap-8 px-2'>
      {/* Payment Summary */}
      <div className='w-full md:w-1/2 space-y-4'>
        <div className='bg-white dark:bg-gray-800 rounded-xl shadow-md p-6'>
          <h2 className='text-xl font-semibold mb-4'>Order Summary</h2>
          
          <div className='space-y-3'>
            <div className='flex justify-between text-sm'>
              <span>Experience ({selectedExperience?.experience?.name})</span>
              <span className='font-medium'>
                AED {selectedExperience?.experience?.min_price || 0}
              </span>
            </div>
            
            <div className='flex justify-between text-sm'>
              <span>Number of Guests</span>
              <span className='font-medium'>{bookingDetails.seats}</span>
            </div>

            {bookingDetails.extras?.length > 0 && (
              <div className='space-y-2'>
                <div className='text-sm font-medium'>Extras:</div>
                {bookingDetails.extras.map((extra, index) => (
                  <div key={index} className='flex justify-between text-sm'>
                    <span>{extra.name} x{extra.quantity}</span>
                    <span>AED {extra.price * extra.quantity}</span>
                  </div>
                ))}
              </div>
            )}

            <div className='border-t pt-3 mt-2'>
              <div className='flex justify-between font-semibold'>
                <span>Total Amount</span>
                <span>AED {calculateTotal()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Security Notice */}
        <div className='bg-gray-50 dark:bg-gray-700 p-4 rounded-xl'>
          <p className='text-sm text-gray-600 dark:text-gray-300'>
            Your payment information is securely processed. We never store your card details.
          </p>
        </div>
      </div>

      {/* Payment Form */}
      <div className='w-full md:w-1/2'>
        <Elements stripe={stripePromise}>
          <PaymentForm />
        </Elements>
      </div>
    </div>
  );
};

export default Payment;
