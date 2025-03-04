"use client";
import { Button } from '@/components/ui/button';
import { ArrowLeft, CheckCircle, CreditCard } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useWalletContext, WalletProvider } from '../WalletContext';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

// Initialize Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

const AddMoneyForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const { data: session } = useSession();
  console.log("session",session)
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [cardComplete, setCardComplete] = useState(false);
  const { walletDetails,updateWalletDetails } = useWalletContext();

  console.log("walletDetails",walletDetails)

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



  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    if (!validateForm()) {
      return;
    }

    setIsProcessing(true);
    setError(null);

    

    try {
        const paymentAmount = Number(walletDetails?.topupAmount);

        
        // Create payment method from card details
        const { error: paymentMethodError, paymentMethod } = await stripe.createPaymentMethod({
          type: 'card',
          card: elements.getElement(CardElement),
        });
  
        if (paymentMethodError) {
          throw new Error(paymentMethodError.message);
        }
  
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/yacht/wallet`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.user?.token}`
        },
        body: JSON.stringify({
          payment_method_id: paymentMethod.id,
          amount: paymentAmount
        })
      });
  
        const result = await response.json();
        
        if (!response.ok) {
          throw new Error(result.error || 'Payment processing failed');
        }
  
        // Payment successful
        toast.success('Payment processed successfully!');
        router.push('/dashboard/success');
  
      }
     catch (error) {
      console.error('Payment error:', error);
      setError(error.message);
      toast.error(error.message || 'Payment processing failed');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className='w-full space-y-6'>
      <div className='bg-white dark:bg-[#24262F] rounded-2xl shadow-md p-6'>
        <div className='flex items-center gap-2 mb-6'>
          <CreditCard className='w-5 h-5' />
          <h2 className='text-xl font-semibold'>Payment Method</h2>
        </div>

         <div className="space-y-2 my-2">
                      <Label htmlFor="topupAmount">
                        Top Up Amount <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="topupAmount"
                        type="number"
                        placeholder="Enter Top Up Amount"
                        required
                        value={walletDetails.topupAmount || ''}
                        onChange={(e) => updateWalletDetails({ topupAmount: e.target.value })}
                      />
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
        disabled={isProcessing || !stripe || !cardComplete || walletDetails?.topupAmount <= 0}
        className='w-full bg-[#BEA355] text-white rounded-full hover:bg-[#A89245] disabled:opacity-50 disabled:cursor-not-allowed h-10'
      >
        {isProcessing ? 'Processing...' : `Confirm Deposit`}
      </Button>
    </form>
  );
};

const AddMoney = () => {
  const router = useRouter();
    const { walletDetails } = useWalletContext();

  return (
    <div className='mx-auto w-full max-w-3xl mx-auto container my-2 flex flex-column justify-between  flex-col items-start gap-8 px-2 px-4 lg:px-6'>
         <div className="flex items-center">
          <Button
            onClick={() => router.back()}
            className="bg-[#F8F8F8] hover:bg-[#F8F8F8] shadow-md rounded-full flex items-center justify-center w-10 h-10"
          >
            <ArrowLeft className="w-4 h-4 text-black" />
          </Button>
          <h1 className="text-sm md:text-lg mx-3 font-medium">My Wallet/Add Money</h1>

        </div>
      
      <div className='w-full max-w-3xl mx-auto'>
        <Elements stripe={stripePromise}>
          <AddMoneyForm />
        </Elements>
      </div>
    </div>
  );
};

const AddMoneyWizard = () => {
  return (
    <WalletProvider>
      <AddMoney />
    </WalletProvider>
  );
};

export default AddMoneyWizard;