"use client";
import { Button } from '@/components/ui/button';
import { ArrowLeft, CheckCircle, CreditCard } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import BrandCard from './DiscountCard';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { fetchBrands } from '@/api/yachts';
import { handleLogoutGlobal } from '@/lib/auth';
import DiscountSliderEmbala from '@/components/DiscountSlider/js/EmblaCarouselDiscount';


const OPTIONS = { align: 'start' }
const SLIDE_COUNT = 6
const SLIDES = Array.from(Array(SLIDE_COUNT).keys())

const PartnerDiscount = () => {
    const router = useRouter();
    const [isProcessing, setIsProcessing] = useState(false);
    const [promoCode, setPromoCode] = useState("");
    const { data: session } = useSession();
    const { toast } = useToast();
    const token = session?.user?.token;
    const [brands, setBrands] = useState([

        // {
        //     id: 1,
        //     name: "Luxury Yachts In",
        //     description: "Premium yacht manufacturer",
        //     image: "/brands/yacht.jpg"
        // },
        // {
        //     id: 2,
        //     name: "Elite Marine",
        //     description: "High-end luxury boats",
        //     image: "/brands/elite-marine.jpg"
        // },
        // {
        //     id: 3,
        //     name: "Oceanic Cruises",
        //     description: "Experience the finest sea voyages",
        //     image: "/brands/oceanic-cruises.jpg"
        // }
    ]);

    const [allBrandsList,setAllBrandsList] = useState([])
    

    const getAllBrands = async () => {
        try {
            const data = await fetchBrands(token)
            // console.log(data)
            // const multipliedBrands = [...data, ...data,...data,...data,...data];
            setAllBrandsList(data)
        } catch (err) {
            console.error('Yacht fetching error:', err);
            if (err?.status == 401) {
                handleLogoutGlobal()
            }
        } finally {
        }
    };
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
            // console.log(result)

            if (!response.ok) {
                throw new Error(result.error || 'Promocode processing failed');
            }
            // Promocode successful

            setBrands(result?.data?.brands);
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

    useEffect(() => {
        if (session) {
            getAllBrands()
        }
    }, [token])
    //test
    // useEffect(() => {
    //     // console.log("branfds", brands)
    // }, [brands])
    // If not logged in, show login prompt
    if (!session) {
        return (
            <section className="py-16 text-center">
                <div className="max-w-md mx-auto px-4">
                    <h2 className="text-2xl font-bold mb-4">Welcome to Get Discount</h2>
                    <p className="text-gray-600 mb-6">
                        Looks like you're not logged in. Please sign in to view and manage your Wallet.
                    </p>
                    <Button
                        onClick={() => router.push('/login')}
                        className="bg-[#BEA355] hover:bg-[#a68f4b] text-white rounded-full"
                    >
                        Login to Continue
                    </Button>
                </div>
            </section>
        );
    }

    return (


        <div className='mx-auto py-10 mt-7 w-full max-w-3xl mx-auto container my-2 flex flex-column justify-between  flex-col items-start gap-8 px-2 px-4 lg:px-6'>
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
                    className='w-full space-y-6 '>
                    <div className='bg-white dark:bg-[#24262F] rounded-xl shadow-md p-6 '>

                        
                     {allBrandsList?.length > 0 && <div className="container classForEmbalaCaroselDiscount mx-auto pb-6 px-6">
                        <h1 className="text-md md:text-lg mb-5 mt-3 mx-3 font-bold">All Brands</h1>

                        <DiscountSliderEmbala slides={allBrandsList} />
               
            </div>}

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

            {brands?.length > 0 && <div className="container  mx-auto pb-6 px-6">
                <h1 className="text-md md:text-lg mb-5 mt-3 mx-3 font-bold">Brands List</h1>

                <div className="grid  sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 place-items-center justify-center w-full">
                    {brands?.map((brand) => (
                        <>
                        <BrandCard key={brand?.id} brand={brand} />

                        </>
                    ))}   
                </div>
            </div>}

        </div>


    );
};

const PartnerDiscountWizard = () => {
    return (
        <PartnerDiscount />

    );
};

export default PartnerDiscountWizard;