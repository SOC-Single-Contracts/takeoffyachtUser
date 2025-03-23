import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const Hero = () => {
  return (
    // <section
    //   className="relative h-[900px] text-white bg-gray-900 overflow-hidden flex items-center"
    //   aria-labelledby="hero-heading"
    // >
    //   <Image
    //     src="/assets/images/banner.jpg"
    //     alt="Luxury yacht on azure waters"
    //     fill
    //     sizes="100vw"
    //     style={{ 
    //       objectFit: 'cover', 
    //       objectPosition: 'center',
    //       zIndex: 0 
    //     }}
    //     priority
    //   />
    //   <div className="absolute inset-0 bg-black/10 z-10"></div>

    //   {/* Content */}
    //   <div className="relative z-20 max-w-5xl mx-auto px-4 flex flex-col items-start justify-center h-full w-full text-balance">
    //     <h1
    //       id="hero-heading"
    //       className="text-3xl sm:text-4xl md:text-[64px] font-semibold w-full max-w-[700px] text-white md:leading-tight leading-normal capitalize"
    //     >
    //       The best yacht booking platform
    //     </h1>
    //     <p className="mt-6 text-md md:text-xl text-gray-300 leading-relaxed max-w-2xl">
    //       At YachtExplore, we believe that every journey is unique. Our extensive collection of luxury yachts includes motor yachts, sailing yachts, and superyachts, each designed to offer the best in luxury, speed, and comfort. 
    //     </p>
    //     <div className="mt-8">
    //       <Link href="/dashboard/yachts">
    //       <Button
    //         size="lg"
    //         className="bg-white text-black font-semibold hover:transition-all hover:duration-300 hover:text-white rounded-full h-10 px-6 py-3"
    //       >
    //         Discover Yachts
    //       </Button>
    //       </Link>
    //     </div>
    //   </div>
    // </section>
    <>
    <section className="mt-24 md:mt-28 overflow-hidden flex items-center">
      <div className="max-w-4xl px-4 mx-auto flex flex-col items-center text-center space-y-5">
        {/* <h1 className="lg:text-[48px] md:text-[46px] text-[32px] font-semibold text-black dark:text-white capitalize">The best yacht booking platform</h1> */}
        <p className="mt-24 md:mt-2 text-black dark:text-white text-[16px] text-balance">
        At YachtExplore, we believe that every journey is unique. Our extensive collection of luxury yachts includes motor yachts, sailing yachts, and superyachts, each designed to offer the best in luxury, speed, and comfort. 
        </p>
        <Link href="/dashboard/yachts">
          <Button className="rounded-full h-10 px-10 py-4 bg-[#91908b] hover:bg-[#BEA355] dark:text-white transition duration-300 hover:shadow-2xl">Discover Yachts</Button>
        </Link>
      </div>
    </section>
    </>
  );
};

export default Hero;
