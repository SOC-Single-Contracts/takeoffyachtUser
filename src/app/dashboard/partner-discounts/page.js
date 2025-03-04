"use client";
import { Button } from '@/components/ui/button';
import { ArrowLeft, CheckCircle, CreditCard } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';




const PartnerDiscount = () => {
    const router = useRouter();
    const [isProcessing, setIsProcessing] = useState(false);
    const [promoCode, setPromoCode] = useState("");
    const { data: session } = useSession();
    const { toast } = useToast();
    const [brands, setBrands] = useState([ {
        id: 1,
        name: "Luxury Yachts In",
        description: "Premium yacht manufacturer",
        image: "/brands/yacht.jpg"
      },
      {
        id: 2,
        name: "Elite Marine",
        description: "High-end luxury boats",
        image: "/brands/elite-marine.jpg"
      },
      {
        id: 3,
        name: "Oceanic Cruises",
        description: "Experience the finest sea voyages",
        image: "/brands/oceanic-cruises.jpg"
      }]);

   
      

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsProcessing(true);
        try {
            const promo = promoCode;
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/yacht/validate-promo-code/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session?.user?.token}`
                },
                body: JSON.stringify({
                    code: promo
                })
            });
            const result = await response.json();
            console.log(result)

            if (!response.ok) {
                throw new Error(result.error || 'Promocode processing failed');
            }
            // Promocode successful
            const formattedBrands = result?.data?.brands?.map((brand) => ({
                ...brand,
                image: `${process.env.NEXT_PUBLIC_API_URL}${brand.image}`, 
            }));    
            setBrands(formattedBrands);
            toast({
                title: "Validated",
                description: "Validate Promocode successfully!",
                variant: "default",
                className: "bg-green-500 text-white border-none",
            });

        }
        catch (error) {
            console.error('Promocode error:', error);
            toast({
                title: "Error",
                description: error.message,
                variant: "destructive",
            });
        } finally {
            setIsProcessing(false);
        }
    };
    return (
        <div className='mx-auto w-full max-w-3xl mx-auto container my-2 flex flex-column justify-between  flex-col items-start gap-8 px-2 px-4 lg:px-6'>
            <div className="flex items-center">
                <Button
                    onClick={() => router.back()}
                    className="bg-[#F8F8F8] hover:bg-[#F8F8F8] shadow-md rounded-full flex items-center justify-center w-10 h-10"
                >
                    <ArrowLeft className="w-4 h-4 text-black" />
                </Button>
                <h1 className="text-md md:text-lg mx-3 font-medium">Partner Discounts</h1>

            </div>

            <div className='w-full max-w-3xl mx-auto'>
                <form
                    onSubmit={handleSubmit}
                    className='w-full space-y-6'>
                    <div className='bg-white dark:bg-[#24262F] rounded-xl shadow-md p-6'>

                        <div className="space-y-2 my-2">
                            <Label htmlFor="promoCode">
                                Reference Code <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="promoCode"
                                type="text"
                                placeholder="Enter your code here"
                                required
                                value={promoCode}
                                onChange={(e) => setPromoCode(e.target.value)}
                            />
                        </div>



                    </div>

                    <Button
                        type='submit'
                        disabled={isProcessing}
                        className='w-full bg-[#BEA355] text-white rounded-full hover:bg-[#A89245] disabled:opacity-50 disabled:cursor-not-allowed h-10'
                    >
                        {isProcessing ? 'Processing...' : `Apply Code`}
                    </Button>
                </form>
            </div>
        </div>
    );
};

const PartnerDiscountWizard = () => {
    return (
        <PartnerDiscount />

    );
};

export default PartnerDiscountWizard;