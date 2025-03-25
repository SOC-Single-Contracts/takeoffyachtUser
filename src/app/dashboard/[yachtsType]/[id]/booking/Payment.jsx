"use client";
import { Button } from '@/components/ui/button';
import { Check, CheckCircle, CreditCard, Square } from 'lucide-react';
import { useBookingContext } from './BookingContext';
import { useSession } from 'next-auth/react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { API_BASE_URL } from '@/lib/api';
import { useToast } from "@/hooks/use-toast";
import { useParams } from 'next/navigation';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { handleDispatchBookingData } from '@/helper/bookingData';
import { handleDispatchwalletData } from '@/helper/walletData';
import { getWallet } from '@/api/wallet';
import { f1yachtsTotal } from '@/helper/calculateDays';


const stripePromise = loadStripe(`${process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY}`);

const PaymentForm = ({ isPartialPayment, setIsPartialPayment, bookingDetails }) => {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const { id: yachtId, yachtsType } = useParams();

  const { toast } = useToast();
  const { bookingData, updateBookingData, selectedYacht, calculateTotal } = useBookingContext();
  const { data: session } = useSession();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [cardComplete, setCardComplete] = useState(false);
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [paymentType, setPaymentType] = useState('initial');
  const appStatWwalletContext =
    typeof window !== "undefined" && localStorage.getItem("walletContext")
      ? JSON.parse(localStorage.getItem("walletContext"))
      : {};
  const token = typeof window !== "undefined" ? localStorage.getItem("token") || null : null;
  const userId = typeof window !== "undefined" ? localStorage.getItem("userid") || null : null;
  const [openAccordionCard, setOpenAccordionCard] = useState(null);
  const [openAccordionWallet, setOpenAccordionWallet] = useState(null);
  const [deductFromWallet, setDeductFromWallet] = useState(false);
  const isWalletDisabled =
    !appStatWwalletContext ||
    Object.keys(appStatWwalletContext).length === 0 ||
    appStatWwalletContext?.balance === 0;
  // const isWalletDisabled = false;
  const [dueAmountAlltime, setdueAmountAlltime] = useState(600)
  const [showStripeStuff, setshowStripeStuff] = useState(true)


  useEffect(() => {
    const initializePaymentState = async () => {
      if (!bookingData.bookingId) return;

      if (yachtsType == "yachts"){
        try {
     

          const response = await fetch(`${API_BASE_URL}/yacht/bookings/${bookingData.bookingId}/?user_id=${session?.user?.userid}`);
          if (!response.ok) throw new Error('Failed to fetch booking details');
  
          const data = await response.json();
  
          if (!data.paid_cost || data.paid_cost === 0) {
            setPaymentType('initial');
            updateBookingData({
              ...bookingData,
              paymentType: 'initial',
              remainingCost: 0,
              paidAmount: 0
            });
          } else if (data.remaining_cost > 0) {
            setPaymentType('remaining');
            updateBookingData({
              ...bookingData,
              paymentType: 'remaining',
              remainingCost: data.remaining_cost,
              paidAmount: data.paid_cost
            });
          }
          setdueAmountAlltime(data?.total_cost - data.paid_cost)
          setIsPartialPayment(data.is_partial_payment || false);
        } catch (error) {
          console.error('Error fetching booking details:', error);
        }
      } else if (yachtsType == "f1yachts"){
        try {
     

          const response = await fetch(`${API_BASE_URL}/yacht/f1_details/${bookingData.bookingId}/?user_id=${session?.user?.userid}`);
          if (!response.ok) throw new Error('Failed to fetch booking details');
  
          const data = await response.json();
  
          if (!data.paid_cost || data.paid_cost === 0) {
            setPaymentType('initial');
            updateBookingData({
              ...bookingData,
              paymentType: 'initial',
              remainingCost: 0,
              paidAmount: 0
            });
          } else if (data.remaining_cost > 0) {
            setPaymentType('remaining');
            updateBookingData({
              ...bookingData,
              paymentType: 'remaining',
              remainingCost: data.remaining_cost,
              paidAmount: data.paid_cost
            });
          }
          setdueAmountAlltime(data?.total_cost - data.paid_cost)
          setIsPartialPayment(data.is_partial_payment || false);
        } catch (error) {
          console.error('Error fetching booking details:', error);
        }
      }
     
    };

    initializePaymentState();
  }, [bookingData.bookingId]);
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

  const getPaymentButtonText = () => {
    if (bookingData.remainingCost > 0) {
      return `Pay Balance Due (AED ${bookingData.remainingCost.toFixed(2)})`;
    }
    return `Pay Full Amount (AED ${calculateTotal().toFixed(2)})`;
  };

  const handleSubmitFull = async (e, type) => {
    e.preventDefault();
    if (type == "payOnlywithWallet") {
      if (!bookingData?.termsAccepted) {
        toast({
          title: "Error",
          description: "You must accept the terms and conditions before proceeding.",
          variant: "destructive",
        });
        return;
      }



      setIsProcessing(true);
      setError(null);

      try {
        const totalAmount = calculateTotal();
        const paymentAmount = totalAmount;

        // Use paymentType to determine endpoint
        let endpoint;
        if (yachtsType == "yachts") {
          endpoint = paymentType === 'remaining'
            ? `${API_BASE_URL}/yacht/capture-remaining-payments/${bookingData.bookingId}/`
            : `${API_BASE_URL}/yacht/capture-initial-payments/${bookingData.bookingId}/`;
        } else if (yachtsType == "f1yachts") {
          endpoint = paymentType === 'remaining'
            ? `${API_BASE_URL}/yacht/f1-capture-remaining-payment/${bookingData.bookingId}/`
            : `${API_BASE_URL}/yacht/f1-capture-initial-payment/${bookingData.bookingId}/`;
        }


        const response = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            is_partial_payment: false,
            user_id: userId,
            wallet: true

          }),
        });

        const result = await response.json();
        if (!response.ok) throw new Error(result.error || 'Payment processing failed');

        const successMessage = paymentType === 'remaining'
          ? 'Remaining payment processed successfully!'
          : 'Full payment processed successfully!';

        toast({
          title: "Success! 🎉",
          description: successMessage,
          variant: "default",
          className: "bg-green-500 text-white border-none",
        });
        router.push('/dashboard/success');
        handleDispatchBookingData({});

      } catch (error) {
        console.error('Payment error:', error);
        setError(error.message);
        toast({
          title: "Error",
          description: error.message || "Payment processing failed",
          variant: "destructive",
        });
      } finally {
        setIsProcessing(false);
      }
    } else if (type == "paycard+wallet") {
      if (!stripe || !elements || !validateForm()) return;

      if (!bookingData?.termsAccepted) {
        toast({
          title: "Error",
          description: "You must accept the terms and conditions before proceeding.",
          variant: "destructive",
        });
        return;
      }



      setIsProcessing(true);
      setError(null);

      try {
        const totalAmount = calculateTotal();
        const paymentAmount = totalAmount;

        const { error: paymentMethodError, paymentMethod } = await stripe.createPaymentMethod({
          type: 'card',
          card: elements.getElement(CardElement),
          billing_details: {
            name: bookingData.fullName,
            email: bookingData.email,
            phone: bookingData.phone,
          },
        });

        if (paymentMethodError) throw new Error(paymentMethodError.message);

        // Use paymentType to determine endpoint
        let endpoint;
        if (yachtsType == "yachts") {
          endpoint = paymentType === 'remaining'
            ? `${API_BASE_URL}/yacht/capture-remaining-payments/${bookingData.bookingId}/`
            : `${API_BASE_URL}/yacht/capture-initial-payments/${bookingData.bookingId}/`;
        } else if (yachtsType == "f1yachts") {
          endpoint = paymentType === 'remaining'
            ? `${API_BASE_URL}/yacht/f1-capture-remaining-payment/${bookingData.bookingId}/`
            : `${API_BASE_URL}/yacht/f1-capture-initial-payment/${bookingData.bookingId}/`;
        }


        const response = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            payment_method_id: paymentMethod.id,
            is_partial_payment: false,
            user_id: userId,
            wallet: deductFromWallet

          }),
        });

        const result = await response.json();
        if (!response.ok) throw new Error(result.error || 'Payment processing failed');

        const successMessage = paymentType === 'remaining'
          ? 'Remaining payment processed successfully!'
          : 'Full payment processed successfully!';

        toast({
          title: "Success! 🎉",
          description: successMessage,
          variant: "default",
          className: "bg-green-500 text-white border-none",
        });
        router.push('/dashboard/success');
        handleDispatchBookingData({});

      } catch (error) {
        console.error('Payment error:', error);
        setError(error.message);
        toast({
          title: "Error",
          description: error.message || "Payment processing failed",
          variant: "destructive",
        });
      } finally {
        setIsProcessing(false);
      }
    }

  };
  const handleSubmitPartial = async (e, type) => {
    e.preventDefault();
    if (type == "payOnlywithWallet") {
      if (!bookingData?.termsAccepted) {
        toast({
          title: "Error",
          description: "You must accept the terms and conditions before proceeding.",
          variant: "destructive",
        });
        return;
      }

      setIsProcessing(true);
      setError(null);

      try {
        const totalAmount = calculateTotal();
        const paymentAmount = totalAmount * 0.25;

        // Use paymentType to determine endpoint
        let endpoint;
        if (yachtsType == "yachts") {
          endpoint = paymentType === 'remaining'
            ? `${API_BASE_URL}/yacht/capture-remaining-payments/${bookingData.bookingId}/`
            : `${API_BASE_URL}/yacht/capture-initial-payments/${bookingData.bookingId}/`;
        } else if (yachtsType == "f1yachts") {
          endpoint = paymentType === 'remaining'
            ? `${API_BASE_URL}/yacht/f1-capture-remaining-payment/${bookingData.bookingId}/`
            : `${API_BASE_URL}/yacht/f1-capture-initial-payment/${bookingData.bookingId}/`;
        }

        const response = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            is_partial_payment: true,
            user_id: userId,
            wallet: true
          }),
        });

        const result = await response.json();
        if (!response.ok) throw new Error(result.error || 'Payment processing failed');

        const successMessage = paymentType === 'remaining'
          ? 'Remaining payment processed successfully!'
          : 'Initial payment (25%) processed successfully!';

        toast({
          title: "Success! 🎉",
          description: successMessage,
          variant: "default",
          className: "bg-green-500 text-white border-none",
        });
        router.push('/dashboard/success');
        handleDispatchBookingData({})


      } catch (error) {
        console.error('Payment error:', error);
        setError(error.message);
        toast({
          title: "Error",
          description: error.message || "Payment processing failed",
          variant: "destructive",
        });
      } finally {
        setIsProcessing(false);
      }
    } else if (type == "paycard+wallet") {
      if (!stripe || !elements || !validateForm()) return;
      if (!bookingData?.termsAccepted) {
        toast({
          title: "Error",
          description: "You must accept the terms and conditions before proceeding.",
          variant: "destructive",
        });
        return;
      }

      setIsProcessing(true);
      setError(null);

      try {
        const totalAmount = calculateTotal();
        const paymentAmount = totalAmount * 0.25;

        const { error: paymentMethodError, paymentMethod } = await stripe.createPaymentMethod({
          type: 'card',
          card: elements.getElement(CardElement),
          billing_details: {
            name: bookingData.fullName,
            email: bookingData.email,
            phone: bookingData.phone,
          },
        });

        if (paymentMethodError) throw new Error(paymentMethodError.message);

        // Use paymentType to determine endpoint
        let endpoint;
        if (yachtsType == "yachts") {
          endpoint = paymentType === 'remaining'
            ? `${API_BASE_URL}/yacht/capture-remaining-payments/${bookingData.bookingId}/`
            : `${API_BASE_URL}/yacht/capture-initial-payments/${bookingData.bookingId}/`;
        } else if (yachtsType == "f1yachts") {
          endpoint = paymentType === 'remaining'
            ? `${API_BASE_URL}/yacht/f1-capture-remaining-payment/${bookingData.bookingId}/`
            : `${API_BASE_URL}/yacht/f1-capture-initial-payment/${bookingData.bookingId}/`;
        }

        const response = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            payment_method_id: paymentMethod.id,
            is_partial_payment: true,
            user_id: userId,
            wallet: deductFromWallet

          }),
        });

        const result = await response.json();
        if (!response.ok) throw new Error(result.error || 'Payment processing failed');

        const successMessage = paymentType === 'remaining'
          ? 'Remaining payment processed successfully!'
          : 'Initial payment (25%) processed successfully!';

        toast({
          title: "Success! 🎉",
          description: successMessage,
          variant: "default",
          className: "bg-green-500 text-white border-none",
        });
        router.push('/dashboard/success');
        handleDispatchBookingData({})


      } catch (error) {
        console.error('Payment error:', error);
        setError(error.message);
        toast({
          title: "Error",
          description: error.message || "Payment processing failed",
          variant: "destructive",
        });
      } finally {
        setIsProcessing(false);
      }
    }

  };


  useEffect(() => {
    console.log("dueAmountAlltime", dueAmountAlltime)

    if (deductFromWallet && appStatWwalletContext?.balance >= dueAmountAlltime) {
      setshowStripeStuff(false)
    } else {
      setshowStripeStuff(true)

    }
  }, [dueAmountAlltime, appStatWwalletContext, deductFromWallet])

  useEffect(() => {
    if (!showStripeStuff && elements) {
      const cardElement = elements.getElement(CardElement);
      if (cardElement) {
        cardElement.clear(); // Clears the input when showStripeStuff is false
      }
    }
  }, [showStripeStuff, elements]);

  useEffect(() => {
    console.log("showStripeStuff", showStripeStuff)
  }, [showStripeStuff])


  return (
    <form className='w-full space-y-6'>
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



        <div
          className={`flex items-center justify-between my-3 p-4 rounded-lg transition-all duration-300 border 
    ${deductFromWallet ? "bg-[#EAF7E4] border-[#BEA355]" : "bg-gray-100 border-gray-300"}
    ${isWalletDisabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
  `}
          onClick={() => {
            if (isWalletDisabled) return; // Prevent clicking when balance is 0 or context is empty
            setDeductFromWallet((prev) => !prev);
          }}
          role="button"
          tabIndex={0}
        >
          {/* Left Side: Check Icon + Wallet Icon + Label */}
          <div className="flex items-center space-x-3">
            {/* ✅ Check Icon (Only Visible if Selected) */}
            {deductFromWallet ? (
              <div className="w-5 h-5 bg-[#BEA355] text-white flex items-center justify-center rounded-md">
                <Check size={20} />
              </div>
            ) : (
              <div className="w-5 h-5 bg-[#BEA355] text-white flex items-center justify-center rounded-md">
                <Square size={20} className="text-[#BEA355]" />
              </div>
            )}

            {/* Wallet Icon */}
            <img src="/assets/images/wallet.png" alt="Wallet Icon" className="w-8 h-8" />

            {/* Wallet Details */}
            <div>
              <Label htmlFor="partial-payment" className="text-base font-medium">
                Rewards & Wallet
              </Label>
              <p className="text-sm text-[#BEA355]">
                To spend today: AED {appStatWwalletContext?.balance ? appStatWwalletContext?.balance : "0"}
              </p>
            </div>
          </div>
        </div>


        <div className='space-y-4'>
          {/* Card Input Section */}
          <div
            className={`border rounded-md p-3 transition-opacity ${!showStripeStuff ? "opacity-50 cursor-not-allowed pointer-events-none" : ""
              }`}
          >
            <CardElement
              onChange={handleCardChange}
              options={{
                style: {
                  base: {
                    fontSize: '16px',
                    color: '#424770',
                    '::placeholder': { color: '#aab7c4' },
                  },
                  invalid: { color: '#9e2146' },
                },
                hidePostalCode: true,
              }}
              disabled={!showStripeStuff} // Ensure Stripe input is disabled
            />
          </div>

          {/* Info Messages */}
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

          {/* Payment Info */}
          <div className='text-xs text-gray-500 dark:text-gray-400'>
            We accept all major credit and debit cards including Visa, Mastercard, and American Express
          </div>
        </div>







        <div className="space-y-2 pl-1 mt-4">
          {/* {(!bookingDetails?.paid_cost || bookingDetails.paid_cost === 0) && (
    <div className="flex items-center space-x-2">
      <Checkbox 
        id="partial-payment" 
        checked={isPartialPayment}
        onCheckedChange={(checked) => setIsPartialPayment(checked)}
      />
      <Label htmlFor="partial-payment" className="text-sm">
        You want to do partial payment?
      </Label>
    </div>
  )} */}

          <div className="flex items-center space-x-2">
            <Checkbox
              id="terms"
              className="checked:bg-[#BEA355] checked:border-[#BEA355]"
              checked={bookingData.termsAccepted}
              onCheckedChange={(checked) => updateBookingData({ termsAccepted: checked })}
            />
            <Dialog open={isTermsOpen} onOpenChange={setIsTermsOpen}>
              <DialogTrigger asChild>
                <Label htmlFor="terms" className="text-sm cursor-pointer underline hover:text-[#BEA355]">
                  I agree to terms & conditions
                </Label>
              </DialogTrigger>
              <DialogContent className="max-w-[800px] max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-xl font-semibold mb-4">Terms and Conditions</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 text-sm">
                  <h3 className="font-semibold text-lg">1. Booking and Payment</h3>
                  <p>• A deposit of 25% of the total charter fee is required to confirm your booking.</p>
                  <p>• The remaining balance must be paid at least 7 days before the charter date.</p>
                  <p>• All payments are non-refundable unless otherwise specified.</p>

                  <h3 className="font-semibold text-lg">2. Cancellation Policy</h3>
                  <p>• Cancellations made more than 30 days before the charter date: 80% refund</p>
                  <p>• Cancellations made 15-30 days before: 50% refund</p>
                  <p>• Cancellations made less than 15 days before: No refund</p>

                  <h3 className="font-semibold text-lg">3. Charter Requirements</h3>
                  <p>• The lead charterer must be at least 21 years of age.</p>
                  <p>• Valid identification is required for all passengers.</p>
                  <p>• The number of guests must not exceed the yacht's capacity.</p>

                  <h3 className="font-semibold text-lg">4. Safety and Conduct</h3>
                  <p>• All guests must follow safety instructions provided by the crew.</p>
                  <p>• The captain has full authority to terminate the charter if safety is compromised.</p>
                  <p>• No illegal activities or substances are permitted on board.</p>

                  <h3 className="font-semibold text-lg">5. Weather Conditions</h3>
                  <p>• The captain reserves the right to cancel or modify the itinerary due to weather.</p>
                  <p>• Weather-related cancellations will be rescheduled at no additional cost.</p>

                  <h3 className="font-semibold text-lg">6. Liability</h3>
                  <p>• The company is not liable for any personal injury or loss of property.</p>
                  <p>• Guests are advised to have appropriate insurance coverage.</p>

                  <h3 className="font-semibold text-lg">7. Additional Charges</h3>
                  <p>• Fuel surcharges may apply for extended cruising.</p>
                  <p>• Additional hours will be charged at the standard hourly rate.</p>
                  <p>• Damage to the vessel or equipment will be charged accordingly.</p>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      {(!showStripeStuff) && <div>
        <Button
          onClick={(e) => handleSubmitFull(e, "payOnlywithWallet")}
          disabled={isProcessing || isWalletDisabled}
          className="w-full bg-[#BEA355] text-white rounded-full hover:bg-[#A89245] disabled:opacity-50 disabled:cursor-not-allowed h-12"
        >
          {`Pay Full Amount (AED ${calculateTotal().toFixed(2)})`}
        </Button>

        {(!bookingDetails?.paid_cost || bookingDetails.paid_cost === 0) && (
          <Button
            onClick={(e) => handleSubmitPartial(e, "payOnlywithWallet")}
            disabled={isProcessing || isWalletDisabled}
            className="w-full mt-4 bg-[#BEA355] text-white rounded-full hover:bg-[#A89245] disabled:opacity-50 disabled:cursor-not-allowed h-12"
          >
            {`Pay Partial  (AED ${(calculateTotal() * 0.25).toFixed(2)})`}
          </Button>
        )}
      </div>}

      {showStripeStuff && <div>
        <Button
          onClick={(e) => handleSubmitFull(e, "paycard+wallet")}

          disabled={isProcessing || !stripe || !cardComplete}
          className="w-full bg-[#BEA355] text-white rounded-full hover:bg-[#A89245] disabled:opacity-50 disabled:cursor-not-allowed h-12"
        >
          {getPaymentButtonText()}
        </Button>

        {(!bookingDetails?.paid_cost || bookingDetails.paid_cost === 0) && (
          <Button
            onClick={(e) => handleSubmitPartial(e, "paycard+wallet")}
            disabled={isProcessing || !stripe || !cardComplete}
            className="w-full mt-4 bg-[#BEA355] text-white rounded-full hover:bg-[#A89245] disabled:opacity-50 disabled:cursor-not-allowed h-12"
          >
            {`Pay Partial (AED ${(calculateTotal() * 0.25).toFixed(2)})`}
          </Button>
        )}
      </div>}


    </form>
  );
};

const Payment = () => {
  const { data: session } = useSession();
  const { bookingData, selectedYacht, calculateTotal, updateBookingData } = useBookingContext();
  const [isPartialPayment, setIsPartialPayment] = useState(false);
  const [bookingDetails, setBookingDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { yachtsType } = useParams();

  useEffect(() => {
    updateBookingData({
      ...bookingData,
      paymentType: 'initial',
      remainingCost: 0,
      paidAmount: 0
    });
  }, []);

  const calculateDays = () => {
    if (!bookingData.date || !bookingData.endDate) return 1;

    const startDate = new Date(bookingData.date);
    const endDate = new Date(bookingData.endDate);
    return Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
  };

  useEffect(() => {
    const bookingId = new URLSearchParams(window.location.search).get('bookingId');
    const fetchBookingDetails = async () => {
    
      if (yachtsType == "yachts"){
        try {
          const response = await fetch(`${API_BASE_URL}/yacht/bookings/${bookingId}/?user_id=${session?.user?.userid}`);
          if (!response.ok) {
            throw new Error('Failed to fetch booking details');
          }
          const data = await response.json();
          setBookingDetails(data);
          setIsPartialPayment(data.is_partial_payment);
        } catch (error) {
          console.error('Error fetching booking details:', error);
        }
      } else if (yachtsType == "f1yachts"){
        try {
          const response = await fetch(`${API_BASE_URL}/yacht/f1_details/${bookingData.bookingId}/?user_id=${session?.user?.userid}`);
          if (!response.ok) {
            throw new Error('Failed to fetch booking details');
          }
          const data = await response.json();
          setBookingDetails(data);
          setIsPartialPayment(data.is_partial_payment);
        } catch (error) {
          console.error('Error fetching booking details:', error);
        }
      }
    };
  
    if (bookingId) {
      fetchBookingDetails();
    }
  }, [selectedYacht]);


  useEffect(() => {
    const fetchBookingDetails = async () => {
      if (yachtsType == "yachts"){
        try {
          const bookingId = bookingData.bookingId;
          if (!bookingId) return;
  
          const response = await fetch(`${API_BASE_URL}/yacht/bookings/${bookingId}/?user_id=${session?.user?.userid}`);
          if (!response.ok) {
            throw new Error('Failed to fetch booking details');
          }
          const data = await response.json();
          setBookingDetails(data);
          setIsPartialPayment(data.is_partial_payment);
        } catch (error) {
          console.error('Error fetching booking details:', error);
        } finally {
          setLoading(false);
        }
      } else if (yachtsType == "f1yachts"){
        try {
          const bookingId = bookingData.bookingId;
          if (!bookingId) return;
  
          const response = await fetch(`${API_BASE_URL}/yacht/f1_details/${bookingData.bookingId}/?user_id=${session?.user?.userid}`);
          if (!response.ok) {
            throw new Error('Failed to fetch booking details');
          }
          const data = await response.json();
          setBookingDetails(data);
          setIsPartialPayment(data.is_partial_payment);
        } catch (error) {
          console.error('Error fetching booking details:', error);
        } finally {
          setLoading(false);
        }
      }
   
    };

    fetchBookingDetails();
  }, [bookingData.bookingId]);

  if (loading) {
    return (
      <div className='mx-auto container flex justify-between md:flex-row flex-col items-start gap-8 px-2'>
        <div className='w-full md:w-1/2 space-y-4'>
          <div className='bg-white dark:bg-[#24262F] rounded-xl shadow-md p-6 animate-pulse'>
            <h2 className='text-xl font-semibold mb-4'>
              <div className='h-6 bg-gray-200 rounded w-1/2'></div>
            </h2>
            <div className='space-y-3'>
              <div className='flex justify-between text-sm'>
                <div className='h-4 bg-gray-200 rounded w-1/4'></div>
                <div className='h-4 bg-gray-200 rounded w-1/4'></div>
              </div>
              <div className='flex justify-between text-sm'>
                <div className='h-4 bg-gray-200 rounded w-1/4'></div>
                <div className='h-4 bg-gray-200 rounded w-1/4'></div>
              </div>
              <div className='border-t dark:border-gray-600 pt-4 mt-4'>
                <div className='flex justify-between font-semibold text-lg'>
                  <div className='h-4 bg-gray-200 rounded w-1/4'></div>
                  <div className='h-4 bg-gray-200 rounded w-1/4'></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className='w-full md:w-1/2 animate-pulse'>
          <div className='bg-white dark:bg-[#24262F] rounded-xl shadow-md p-6'>
            <h2 className='text-xl font-semibold mb-4'>Payment Method</h2>
            <div className='h-10 bg-gray-200 rounded'></div>
            <div className='h-10 bg-gray-200 rounded mt-4'></div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className='mx-auto container flex justify-between md:flex-row flex-col items-start gap-8 px-2'>
      <div className='w-full md:w-1/2 space-y-4'>
        <div className='bg-white dark:bg-[#24262F] rounded-xl shadow-md p-6'>
          <h2 className='text-xl font-semibold mb-4'>Order Summary</h2>

          <div className='space-y-3'>
            <div className='flex justify-between text-sm'>
              <span>
              {yachtsType == "yachts" ? bookingDetails?.booking_type === 'date_range' ? (
                  `Charter (${calculateDays(bookingDetails?.selected_date, bookingDetails?.end_date)} days)`
                ) : (
                  `Charter (${bookingDetails?.duration_hour || bookingData.duration} hours)`
                ) : yachtsType == "f1yachts" ? "" :""}
                
              </span>
              {yachtsType == "yachts" ?   <span className='font-medium'>
                AED {(bookingData.isNewYearBooking ?
                  (selectedYacht?.yacht?.new_year_price || 0) :
                  (selectedYacht?.yacht?.per_hour_price || 0)) *
                  (bookingDetails?.booking_type === 'date_range' ?
                    calculateDays(bookingDetails?.selected_date, bookingDetails?.end_date) :
                    bookingData.duration)}
              </span> : yachtsType == "f1yachts" ? "" :""}
           
            </div>
            {(bookingDetails?.extras_data || bookingData.extras)?.map((item) => (
              item.quantity > 0 && (
                <div key={item.extra_id || item.id} className='flex justify-between text-sm'>
                  <span>{item.name}</span>
                  <span className='font-medium'>AED {item.price * item.quantity}</span>
                </div>
              )
            ))}
            <div className='border-t dark:border-gray-600 pt-4 mt-4'>
              <div className='flex justify-between font-semibold text-lg'>
                <span>Total Due</span>
                {yachtsType == "yachts" ? "" : yachtsType == "f1yachts" ? "" :""}
                <span className='text-xl font-bold'>AED {bookingDetails ? bookingDetails.total_cost : calculateTotal()}</span>
              </div>
              {isPartialPayment && bookingDetails?.paid_cost === 0 && (
                <>
                  <div className='flex justify-between text-blue-600 dark:text-blue-400 font-semibold mt-3'>
                    <span>Deposit (25%)</span>
                    <span>AED {(calculateTotal() * 0.25).toFixed(2)}</span>
                  </div>
                  <div className='flex justify-between text-gray-600 dark:text-gray-400 font-semibold mt-1'>
                    <span>Outstanding Amount (75%)</span>
                    <span>AED {(calculateTotal() * 0.75).toFixed(2)}</span>
                  </div>
                </>
              )}
              {bookingDetails ? (
                <>
                  {bookingDetails.paid_cost > 0 && (
                    <div className='flex justify-between text-blue-600 dark:text-blue-400 font-semibold mt-3'>
                      <span>Amount Settled</span>
                      <span>AED {bookingDetails.paid_cost.toFixed(2)}</span>
                    </div>
                  )}
                  {bookingDetails.remaining_cost > 0 && (
                    <div className='flex justify-between text-gray-600 dark:text-gray-400 font-semibold mt-1'>
                      <span>Balance Due</span>
                      <span>AED {bookingDetails.remaining_cost.toFixed(2)}</span>
                    </div>
                  )}
                </>
              ) : (
                <>
                  {isPartialPayment && (
                    <>
                      <div className='flex justify-between text-blue-600 dark:text-blue-400 font-semibold mt-3'>
                        <span>Deposit (25%)</span>
                        <span>AED {(calculateTotal() * 0.25).toFixed(2)}</span>
                      </div>
                      <div className='flex justify-between text-gray-600 dark:text-gray-400 font-semibold mt-1'>
                        <span>Outstanding Amount (75%)</span>
                        <span>AED {(calculateTotal() * 0.75).toFixed(2)}</span>
                      </div>
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
        <div className='bg-gray-50 dark:bg-[#24262F] space-y-2 p-4 rounded-xl'>
          <p className='text-sm text-gray-800 dark:text-gray-400'>
            Your payment information is securely processed by Stripe. We never store your card details.
          </p>
          <p className='inline-flex items-center text-gray-600 dark:text-gray-400 text-xs md:text-sm md:mb-0 mb-2'>
            Payments powered by <span><svg className='ml-1' xmlns="http://www.w3.org/2000/svg" width="40" height="24" fill="none" viewBox="0 0 40 24"><g fill="#635bff"><g fillRule="evenodd" clipRule="evenodd"><path d="M39.656 12.232c0-2.761-1.337-4.94-3.894-4.94-2.567 0-4.12 2.179-4.12 4.919 0 3.246 1.833 4.886 4.465 4.886 1.284 0 2.255-.291 2.988-.701v-2.158c-.733.367-1.575.594-2.643.594-1.046 0-1.973-.367-2.092-1.64h5.274c0-.14.022-.7.022-.96zm-5.329-1.024c0-1.22.745-1.726 1.424-1.726.658 0 1.36.507 1.36 1.726zM27.478 7.292c-1.057 0-1.737.496-2.114.841l-.14-.668H22.85v12.577l2.696-.572.011-3.053c.388.28.96.68 1.91.68 1.93 0 3.688-1.553 3.688-4.973-.01-3.128-1.79-4.832-3.678-4.832zm-.647 7.432c-.637 0-1.014-.227-1.273-.507l-.01-4.002c.28-.313.668-.528 1.283-.528.981 0 1.66 1.1 1.66 2.513 0 1.445-.668 2.524-1.66 2.524zM19.14 6.655l2.707-.582v-2.19l-2.707.572z"></path></g><path d="M21.847 7.475H19.14v9.438h2.707z"></path><path fillRule="evenodd" d="m16.238 8.273-.173-.798h-2.33v9.439h2.697v-6.397c.636-.83 1.715-.68 2.05-.56V7.474c-.346-.13-1.608-.366-2.244.798zM10.845 5.135l-2.632.56-.01 8.64c0 1.597 1.197 2.773 2.793 2.773.884 0 1.532-.162 1.888-.356v-2.19c-.346.14-2.05.637-2.05-.96V9.773h2.05V7.475h-2.05zM3.553 10.215c0-.42.345-.582.917-.582.82 0 1.855.248 2.675.69V7.788a7.113 7.113 0 0 0-2.675-.496c-2.19 0-3.646 1.143-3.646 3.053 0 2.977 4.1 2.502 4.1 3.786 0 .496-.432.658-1.036.658-.896 0-2.04-.367-2.945-.863v2.567a7.477 7.477 0 0 0 2.945.615c2.243 0 3.786-1.111 3.786-3.042-.011-3.215-4.12-2.643-4.12-3.85z" clipRule="evenodd"></path></g></svg></span>
          </p>
        </div>
      </div>

      {/* Payment Form */}
      <div className='w-full md:w-1/2'>
        <Elements stripe={stripePromise}>
          <PaymentForm bookingDetails={bookingDetails} isPartialPayment={isPartialPayment} setIsPartialPayment={setIsPartialPayment} />
        </Elements>
      </div>
    </div>
  );
};

export default Payment;

// payment senario
// fullstripe =
// halfstripe =
// fullwallet = payOnlywithWallet
// halfwallet = 
// full+card+wallet = 
// half+card+wallet = 