"use client";
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { CheckCircle, Mail } from 'lucide-react';

export default function SuccessPageWallet() {
  const router = useRouter();

  return (
    <div className="md:min-h-[90vh] py-10 mt-7 md:py-0 flex items-center justify-center ">
      <div className="bg-white dark:bg-gray-800 p-3 md:p-8 rounded-lg shadow-lg max-w-md md:max-w-lg w-full mx-2 md:mx-4">
        <div className="text-center">
          <div className="relative w-24 h-24 mx-auto my-6">
            <div className="absolute inset-0 animate-ping bg-green-100 rounded-full opacity-25"></div>
            <CheckCircle className="relative text-green-500 w-24 h-24" />
          </div>
          
          <h3 className="text-xl md:text-3xl text-gray-900 dark:text-gray-100 font-bold mb-4">
            Payment Successful!
          </h3>
          
          <div className="space-y-3 text-gray-600 dark:text-gray-400">
            <p className="text-sm md:text-lg">
              Thank you for completing your secure online payment.
            </p>
            <p className="text-sm md:text-lg">
              Your have Top Up successfully.
            </p>
            <p className="text-sm md:text-md text-gray-500 dark:text-gray-300">
              A confirmation email will be sent to your registered email address.
            </p>
          </div>

          <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="flex items-center justify-center space-x-2 text-gray-600 dark:text-gray-400">
              <Mail className="w-5 h-5" />
              <p className="text-xs md:text-md">
                We appreciate your business! If you have any questions, please email{' '}
                <a 
                  href="mailto:info@takeoffyachts.com" 
                  className="text-[#BEA355] hover:underline font-medium"
                >
                  info@takeoffyachts.com
                </a>
              </p>
            </div>
          </div>

          <div className="mt-2 md:mt-10 space-y-2 md:space-y-4">    
            <Button
              onClick={() => router.push('/dashboard/wallet/add-money')}
              variant="outline"
              className="w-full border-[#BEA355] text-[#BEA355] hover:bg-[#BEA355] hover:text-white py-2 md:py-6 md:text-lg"
            >
              Return to Wallet
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
