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

// Initialize Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

const PaymentForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const { bookingData, selectedYacht, calculateTotal } = useBookingContext();
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
    return true;
  };

  const calculatePaymentAmount = () => {
    const total = calculateTotal();
    return bookingData.isPartialPayment ? total / 2 : total;
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
      const paymentAmount = calculatePaymentAmount();
      
      // Create source from card details
      const { error: sourceError, source } = await stripe.createSource(
        elements.getElement(CardElement),
        {
          type: 'card',
          amount: Math.round(paymentAmount * 100), // Convert to cents and ensure it's a whole number
          currency: 'aed',
          owner: {
            name: bookingData.fullName,
            email: session.user.email,
            phone: bookingData.phone,
          },
        }
      );

      if (sourceError) {
        throw new Error(sourceError.message);
      }

      // Send booking details with source ID as payment token
      const response = await fetch('https://api.takeoffyachts.com/yacht/process-payment/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.accessToken}`
        },
        body: JSON.stringify({
          payment_intent_id: source.id, // Using source.id as the payment token
          booking_type: "yacht",
          amount: paymentAmount, // Send the actual payment amount
          user_id: session.user.userid,
          email: session.user.email,
          yacht_id: selectedYacht.yacht.id,
          phone_number: bookingData.phone,
          country: bookingData.country,
          message: bookingData.notes,
          adults: bookingData.adults,
          kid_teen: bookingData.kids,
          duration_hour: bookingData.duration,
          selected_date: bookingData.date,
          total_cost: calculateTotal(), // This remains the full amount
          booking_time: bookingData.startTime,
          guest: bookingData.adults + bookingData.kids,
          extras: bookingData.extras || [],
          is_partial_payment: bookingData.isPartialPayment
        })
      });

      const bookingResult = await response.json();
      
      if (bookingResult.error) {
        throw new Error(bookingResult.error);
      }

      // Payment successful
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
      <div className='bg-white dark:bg-[#24262F] rounded-xl shadow-md p-6'>
        <div className='flex items-center gap-2 mb-6'>
          <CreditCard className='w-5 h-5' />
          <h2 className='text-xl font-semibold'>Payment Method</h2>
        </div>

        {error && (
          <div className='bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 text-red-700 dark:text-red-300 p-3 rounded-md mb-4'>
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
            <p className='text-[11px] flex items-center gap-2 bg-green-50 dark:bg-green-900 text-green-700 dark:text-green-300 p-1 rounded-md'>
              <CheckCircle className='w-3 h-3 text-green-500' />
              You are only charged if the owner accepts.
            </p>
            <p className='text-[11px] flex items-center gap-2 bg-green-50 dark:bg-green-900 text-green-700 dark:text-green-300 p-1 rounded-md'>
              <CheckCircle className='w-3 h-3 text-green-500' />
              Guaranteed response within 24 hours
            </p>
          </div>
          <div className='text-xs text-gray-500 dark:text-gray-400'>
            We accept all major credit and debit cards including Visa, Mastercard, and American Express
          </div>
        </div>
      </div>

      <Button 
        type='submit'
        disabled={isProcessing || !stripe || !cardComplete}
        className='w-full bg-[#BEA355] text-white rounded-full hover:bg-[#A89245] disabled:opacity-50 disabled:cursor-not-allowed h-10'
      >
        {isProcessing ? 'Processing...' : `Pay ${bookingData.isPartialPayment ? '50%' : 'Full'} Amount (AED ${calculatePaymentAmount()})`}
      </Button>
    </form>
  );
};

const Payment = () => {
  const { bookingData, selectedYacht, calculateTotal } = useBookingContext();

  return (
    <div className='mx-auto container flex justify-between md:flex-row flex-col items-start gap-8 px-2'>
      {/* Payment Summary */}
      <div className='w-full md:w-1/2 space-y-4'>
        <div className='bg-white dark:bg-[#24262F] rounded-xl shadow-md p-6'>
          <h2 className='text-xl font-semibold mb-4'>Order Summary</h2>
          
          <div className='space-y-3'>
            <div className='flex justify-between text-sm'>
              <span>Charter ({bookingData.duration} hours)</span>
              <span className='font-medium'>
                AED {(bookingData.isNewYearBooking ? 
                  (selectedYacht?.yacht?.new_year_price || 0) : 
                  (selectedYacht?.yacht?.per_hour_price || 0)) * bookingData.duration}
              </span>
            </div>
            {bookingData.extras && bookingData.extras.map((item) => (
              <div key={item.id} className='flex justify-between text-sm'>
                <span>{item.name}</span>
                <span className='font-medium'>AED {item.price * item.quantity}</span>
              </div>
            ))}
            <div className='border-t dark:border-gray-600 pt-3 mt-2'>
              <div className='flex justify-between font-semibold'>
                <span>Total Amount</span>
                <span>AED {calculateTotal()}</span>
              </div>
              {bookingData.isPartialPayment && (
                <div className='flex justify-between text-blue-600 font-semibold mt-2'>
                  <span>Amount Due Now (50%)</span>
                  <span>AED {calculateTotal() / 2}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Security Notice */}
        <div className='bg-gray-50 dark:bg-[#24262F] p-4 rounded-xl'>
          <p className='text-sm text-gray-600 dark:text-gray-400'>
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