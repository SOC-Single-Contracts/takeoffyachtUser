import Image from 'next/image';
import React from 'react';

const MerchantDashboard = () => {
    return (
        <>
            <div className="min-h-screen bg-gradient-to-br from-[#F5F5F5] via-[#E0E0E0] to-[#BEA355] flex items-center justify-center p-6 overflow-hidden">
                <div className="relative w-full max-w-4xl">
                    <div className="bg-white/80 backdrop-blur-lg shadow-2xl rounded-3xl p-12 text-center relative overflow-hidden">
                        <div className="relative w-full h-[200px] sm:h-[300px] md:h-[400px] mb-8">
                            <Image
                                src="/assets/images/1.webp"
                                alt="Merchant Dashboard"
                                fill
                                className="object-contain rounded-lg"
                                priority
                                sizes="(max-width: 640px) 100vw, (max-width: 768px) 80vw, (max-width: 1024px) 70vw, 50vw"
                            />
                        </div>

                        <p className="text-base sm:text-lg text-gray-600 mt-4 mb-8">
                            Please contact info@takeoffyachts.com for merchant and partner queries.
                        </p>
                    </div>

                    {/* Decorative Blurred Circles */}
                    <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-[#BEA355]/20 rounded-full blur-3xl animate-blob"></div>
                    <div className="absolute -top-20 -right-20 w-96 h-96 bg-gray-300/30 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
                </div>
            </div>
        </>
    );
};

export default MerchantDashboard;