import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { ArrowLeft, CircleHelp, CreditCard, DollarSign } from 'lucide-react'
import React from 'react'

const Payment = () => {
    // const { data: session } = useSession();
    // const searchParams = useSearchParams();
    // const router = useRouter();
    // const bookingId = searchParams.get('booking_id');
  
    // const handlePayment = async () => {
    //   if (!session?.user?.userid || !bookingId) {
    //     toast.error('Invalid booking information');
    //     return;
    //   }
  
    //   try {
    //     const paymentData = {
    //       booking_id: bookingId,
    //       user_id: session.user.userid,
    //       amount: 13.54, // Replace with actual amount calculation
    //       payment_method: 'credit_card' // Add payment method selection
    //     };
  
    //     await makePartialPayment(paymentData);
    //     toast.success('Payment successful');
    //     router.push('/dashboard/bookings');
    //   } catch (error) {
    //     toast.error('Payment failed. Please try again.');
    //   }
    // };
  return (
    <section className='py-10 px-2'>
    <div className='container px-2 mx-auto flex items-center space-x-4'>
        <Button className="bg-[#F8F8F8] hover:bg-[#F8F8F8] shadow-md rounded-full flex items-center justify-center w-10 h-10">
            <ArrowLeft className='w-4 h-4 text-black' />
        </Button>
        <h1 className='text-sm md:text-lg font-medium'>Make Payment</h1>
    </div>
    <div className='mx-auto container flex justify-evenly md:flex-row flex-col items-center gap-4 px-2 space-y-6 mt-8'>
    <div className='space-y-3'>
        <h1 className='text-2xl font-semibold'>Order Summary</h1>
        <div className="flex w-full items-center space-x-2">
            <Input type="text" placeholder="Discount Code" />
            <Button type="submit">Apply</Button>
        </div>
        <div className='flex w-full items-center justify-between text-sm'>
            <p className='flex items-center gap-2'>Subtotal <CircleHelp className='w-4 h-4 text-black' /></p>
            <p className='flex items-center gap-2'>
                <DollarSign className='w-4 h-4 text-black' />
                4.25</p>
        </div>
        <div className='flex w-full items-center justify-between text-sm'>
            <p className='flex items-center gap-2'>Shipping <CircleHelp className='w-4 h-4 text-black' /></p>
            <p className='flex items-center gap-2'>
                <DollarSign className='w-4 h-4 text-black' />
                8.89</p>
        </div>
        <div className='flex w-full items-center justify-between text-sm'>
            <p className='flex items-center gap-2'>Estimated Taxes <CircleHelp className='w-4 h-4 text-black' /></p>
            <p className='flex items-center gap-2'>
                <DollarSign className='w-4 h-4 text-black' />
                0.40</p>
        </div>
        <div className='flex w-full items-center justify-between text-sm'>
            <p className='font-semibold'>Total</p>
            <p className='flex items-center font-semibold gap-2'>
                <DollarSign className='w-4 h-4 text-black' />
                13.54</p>
        </div>
    </div>
    <div className='space-y-3 bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-7 w-full max-w-[400px] h-auto'>
        <h1 className='text-2xl font-semibold'>Payment Method</h1>
        <RadioGroup className='space-y-1 py-4' defaultValue="debit-credit">
        <div className="flex items-center justify-between space-x-2">
        <Label className='flex items-center gap-2' htmlFor="r1"><CreditCard className='w-6 h-6 text-black' />Debit/Credit</Label>
            <RadioGroupItem value="debit-credit" id="r1" />
        </div>
        {/* <div className="flex items-center justify-between space-x-2">
        <Label className='flex items-center gap-2' htmlFor="r2"><CreditCard className='w-6 h-6 text-black' />Tamara</Label>
            <RadioGroupItem  value="tamara" id="r2" />
        </div>
        <div className="flex items-center justify-between space-x-2">
        <Label className='flex items-center gap-2' htmlFor="r3"><CreditCard className='w-6 h-6 text-black' /> Apple Pay</Label>
            <RadioGroupItem value="apple-pay" id="r3" />
        </div> */}
        </RadioGroup>

        <div className='flex w-full items-center justify-between text-sm'>
            <p className='font-semibold'>Total</p>
            <p className='flex items-center font-semibold gap-2'>
                <DollarSign className='w-4 h-4 text-black' />
                13.54</p>
        </div>

        <Button className='w-full bg-[#BEA355] rounded-full text-white'>Confirm Payment</Button>
{/* 
        <div className='flex w-full items-center justify-center gap-3'>
            <Button variant='outline' className='w-full rounded-full text-xs'>Credit Card</Button>
            <Button className='w-full rounded-full text-xs'>Paypal</Button>
        </div> */}
    </div>
    </div>
    </section>
  )
}

export default Payment
