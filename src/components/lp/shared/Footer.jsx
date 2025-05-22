"use client";

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image';
const Footer = () => {
  const [reviews, setReviews] = useState([]);

  const fetchGoogleReviews = async () => {
    const response = await fetch(`https://maps.googleapis.com/maps/api/place/details/json?placeid=${placeId}&key=${apiKey}`);
    const data = await response.json();
    return data.result.reviews;
  };

  useEffect(() => {
    const getReviews = async () => {
      const reviewsData = await fetchGoogleReviews();
      setReviews(reviewsData);
    };
    // getReviews();
  }, []);
//test
  // useEffect(() => {
  //  console.log("reviews",reviews)
  // }, [reviews]);

 return (
   <footer className="text-black dark:text-white bg-[#E2E2E2] dark:bg-gray-700">
    <hr className='w-full h-0.5 bg-black/10' />
     <div className="max-w-5xl px-2 mx-auto">
       <div className="flex justify-between md:flex-row flex-col md:space-y-0 space-y-4 pt-6 md:pt-14">
         <div className="space-y-3 w-full max-w-[250px]">
           <h3 className="text-lg font-semibold uppercase">about us</h3>
             <p className="text-gray-600 dark:text-gray-200 text-sm">Jennys bilge blimey cutlass seas o'nine on. Sail lass coffer yarr gangway fluke bucko buccaneer killick.</p>
              <div className="flex items-center gap-2">
                <Image alt="Google Play" className="cursor-pointer w-full max-w-[100px]" width={100} height={50} src="/assets/images/googleplay.png" quality={100} />
                <Image alt="App Store" className="cursor-pointer w-full max-w-[100px]" width={100} height={50} src="/assets/images/applyappstore.png" quality={100} />
                </div>
         </div>
         <div className="space-y-3">
           <h3 className="text-lg font-semibold">Resources</h3>
           <nav className="flex flex-col space-y-2 text-sm">
             <Link href="/cancellation-policy" className="text-gray-600 dark:text-gray-200 hover:text-gray-800 transition ease-in duration-200">Cancellation Policy</Link>
           <Link href="/about" className="text-gray-600 dark:text-gray-200 hover:text-gray-800 transition ease-in duration-200">About us</Link>
             <Link href="/faqs" className="text-gray-600 dark:text-gray-200 hover:text-gray-800 transition ease-in duration-200">FAQs</Link>
             <Link href="/blogs" className="text-gray-600 dark:text-gray-200 hover:text-gray-800 transition ease-in duration-200">Journal</Link>
           </nav>
         </div>
         <div className="space-y-3">
           <h3 className="text-lg font-semibold">Legal</h3>
           <nav className="flex flex-col space-y-2 text-sm">
             <Link href="/privacy" className="text-gray-600 dark:text-gray-200 hover:text-gray-800 transition ease-in duration-200">Privacy Policy</Link>
             <Link href="/terms" className="text-gray-600 dark:text-gray-200 hover:text-gray-800 transition ease-in duration-200">Terms of Service</Link>
             <Link href="/cookie-policy" className="text-gray-600 dark:text-gray-200 hover:text-gray-800 transition ease-in duration-200">Cookie Policy</Link>
           </nav>
         </div>
         <div className='space-y-3 w-full max-w-[190px]'>
           <h3 className="text-lg font-semibold">Follow Us</h3>
           <nav className="space-x-2 flex items-center">
             <Link href="#" className="w-full max-w-[35px]"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 40 40" data-v-89995b31=""><radialGradient id="i-999135228__a" cx="0" cy="0" r="1" gradientTransform="rotate(180 -.402 19.594) scale(92.3719)" gradientUnits="userSpaceOnUse"><stop offset="0" stopColor="#f9ed32"></stop><stop offset=".36" stopColor="#ee2a7b"></stop><stop offset=".44" stopColor="#d22a8a"></stop><stop offset=".6" stopColor="#8b2ab2"></stop><stop offset=".83" stopColor="#1b2af0"></stop><stop offset=".88" stopColor="#002aff"></stop></radialGradient><g clipPath="url(#i-999135228__instagram_b)"><path fill="url(#i-999135228__a)" d="M7 40h26a7 7 0 0 0 7-7V7a7 7 0 0 0-7-7H7a7 7 0 0 0-7 7v26a7 7 0 0 0 7 7z"></path><g fill="#fff"><path d="M27.5 35h-15A7.5 7.5 0 0 1 5 27.5v-15A7.5 7.5 0 0 1 12.5 5h15a7.5 7.5 0 0 1 7.5 7.5v15a7.5 7.5 0 0 1-7.5 7.5zm-15-27A4.506 4.506 0 0 0 8 12.5v15a4.506 4.506 0 0 0 4.5 4.5h15a4.507 4.507 0 0 0 4.5-4.5v-15A4.507 4.507 0 0 0 27.5 8z"></path><path d="M20 28.5a8.5 8.5 0 1 1 0-17 8.5 8.5 0 0 1 0 17zm0-14a5.5 5.5 0 1 0 5.5 5.5 5.506 5.506 0 0 0-5.5-5.5zM28.5 13.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z"></path></g></g></svg></Link>
             <Link href="#" className="w-full max-w-[35px]"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 40 40" data-v-89995b31=""><clipPath id="i-2121125387__a"><path d="M0 0h40v40H0z"></path></clipPath><g clipPath="url(#i-2121125387__a)"><path fill="#ef3f38" d="M40 31.023C40 35.984 35.977 40 31.023 40H8.977C4.023 40 0 35.977 0 31.023V8.977C0 4.023 4.023 0 8.977 0h22.046C35.977 0 40 4.023 40 8.977z"></path><path fill="#fff" fillRule="evenodd" d="M11.102 27.39c-.844-.28-1.415-.835-1.72-1.671-.741-2.047-.96-10.61.47-12.297a2.813 2.813 0 0 1 1.875-1c3.859-.414 15.804-.36 17.18.14.804.29 1.374.82 1.687 1.625.812 2.118.843 9.82-.11 11.86-.257.555-.68.945-1.21 1.219-1.438.757-16.274.75-18.172.125zm6.14-4.015 6.961-3.61-6.96-3.632z" clipRule="evenodd"></path></g></svg></Link>
             <Link href="#" className="w-full max-w-[35px]"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" data-v-89995b31=""><rect width="1000" height="1000" rx="200"></rect><path fill="#fff" d="m173.59 193.041 253.3 338.7-254.9 275.3h57.4l223.1-241.1 180.3 241.1h195.2l-267.5-357.7 237.2-256.3h-57.3l-205.5 222-166-222zm84.4 42.2h89.7l396 529.5h-89.7z"></path></svg></Link>
             <Link href="#" className="w-full max-w-[35px]"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 40 40" data-v-89995b31=""><clipPath id="i-569469164__a"><path d="M0 0h40v40H0z"></path></clipPath><g clipPath="url(#i-569469164__a)"><path fill="#000" d="M33.35 0H6.65A6.65 6.65 0 0 0 0 6.65v26.7A6.65 6.65 0 0 0 6.65 40h26.7A6.65 6.65 0 0 0 40 33.35V6.65A6.65 6.65 0 0 0 33.35 0z"></path><path fill="#00f6ef" d="M32.467 16.727v-5.334c-6.972-.294-7.197-6.63-7.197-7.226v-.044h-5.389v20.774a4.268 4.268 0 1 1-3.024-4.085V15.31a9.666 9.666 0 1 0 8.421 9.587c0-.136 0-.27-.01-.404v-10.23c2.482 2.27 7.2 2.464 7.2 2.464z"></path><path fill="#fff" d="M34.055 18.043v-5.337c-6.973-.294-7.197-6.63-7.197-7.226v-.044H21.47V26.21a4.268 4.268 0 1 1-3.024-4.084v-5.503a9.784 9.784 0 0 0-1.248-.075 9.667 9.667 0 1 0 9.669 9.662c0-.136 0-.27-.01-.404v-10.23c2.482 2.27 7.2 2.467 7.2 2.467z"></path><g fill="#ff004f"><path d="M25.405 5.436c.26 1.415 1.019 3.627 3.23 4.921-1.69-1.969-1.775-4.51-1.775-4.877v-.044zM34.055 18.043v-5.337a9.949 9.949 0 0 1-1.59-.187v4.202s-4.716-.194-7.196-2.464v10.227a9.668 9.668 0 0 1-15.012 8.451 9.666 9.666 0 0 0 16.608-6.725c0-.135 0-.27-.009-.404v-10.23c2.481 2.271 7.199 2.467 7.199 2.467z"></path><path d="M16.858 20.803a4.27 4.27 0 0 0-3.103 7.93 4.27 4.27 0 0 1 4.69-6.607v-5.502a9.782 9.782 0 0 0-1.248-.076c-.115 0-.228 0-.342.006z"></path></g></g></svg></Link>
           </nav>
           <div className="space-y-3">
          <h3 className="text-lg font-semibold">Google Reviews</h3>
          <div className="flex flex-col space-y-2">
            {reviews.map((review, index) => (
              <p key={index} className="text-gray-600">{review.text}</p>
            ))}
          </div>
        </div>
         </div>
       </div>
        <hr className="my-4 md:my-8 border-black border-opacity-20 h-[1px]" />
        <div className='flex md:flex-row flex-col-reverse md:space-y-0 items-center md:justify-between pb-4'>
         <p className="text-xs md:text-sm text-center text-gray-600 dark:text-gray-400">
            Copyright © {new Date().getFullYear()} TakeOffYachts.com All rights reserved.
         </p>
          <p className='inline-flex items-center text-gray-600 dark:text-gray-400 text-xs md:text-sm md:mb-0 mb-2'>Payments powered by <span><svg className='ml-1 mt-[2px]' xmlns="http://www.w3.org/2000/svg" width="40" height="24" fill="none" viewBox="0 0 40 24" data-v-89995b31=""><g fill="#635bff"><g fillRule="evenodd" clipRule="evenodd"><path d="M39.656 12.232c0-2.761-1.337-4.94-3.894-4.94-2.567 0-4.12 2.179-4.12 4.919 0 3.246 1.833 4.886 4.465 4.886 1.284 0 2.255-.291 2.988-.701v-2.158c-.733.367-1.575.594-2.643.594-1.046 0-1.973-.367-2.092-1.64h5.274c0-.14.022-.7.022-.96zm-5.329-1.024c0-1.22.745-1.726 1.424-1.726.658 0 1.36.507 1.36 1.726zM27.478 7.292c-1.057 0-1.737.496-2.114.841l-.14-.668H22.85v12.577l2.696-.572.011-3.053c.388.28.96.68 1.91.68 1.93 0 3.688-1.553 3.688-4.973-.01-3.128-1.79-4.832-3.678-4.832zm-.647 7.432c-.637 0-1.014-.227-1.273-.507l-.01-4.002c.28-.313.668-.528 1.283-.528.981 0 1.66 1.1 1.66 2.513 0 1.445-.668 2.524-1.66 2.524zM19.14 6.655l2.707-.582v-2.19l-2.707.572z"></path></g><path d="M21.847 7.475H19.14v9.438h2.707z"></path><path fillRule="evenodd" d="m16.238 8.273-.173-.798h-2.33v9.439h2.697v-6.397c.636-.83 1.715-.68 2.05-.56V7.474c-.346-.13-1.608-.366-2.244.798zM10.845 5.135l-2.632.56-.01 8.64c0 1.597 1.197 2.773 2.793 2.773.884 0 1.532-.162 1.888-.356v-2.19c-.346.14-2.05.637-2.05-.96V9.773h2.05V7.475h-2.05zM3.553 10.215c0-.42.345-.582.917-.582.82 0 1.855.248 2.675.69V7.788a7.113 7.113 0 0 0-2.675-.496c-2.19 0-3.646 1.143-3.646 3.053 0 2.977 4.1 2.502 4.1 3.786 0 .496-.432.658-1.036.658-.896 0-2.04-.367-2.945-.863v2.567a7.477 7.477 0 0 0 2.945.615c2.243 0 3.786-1.111 3.786-3.042-.011-3.215-4.12-2.643-4.12-3.85z" clipRule="evenodd"></path></g></svg></span></p>
         </div>
     </div>
   </footer>
 )
}
export default Footer