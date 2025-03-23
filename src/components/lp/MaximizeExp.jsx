// import Image from "next/image";

// const MaximizeExp = () => {
//     return (
//         <section className="py-10 px-4 relative max-w-5xl mx-auto overflow-hidden">
//             <div className="bg-[url('/assets/images/maximizeexperience.png')] absolute inset-0 bg-contain bg-no-repeat bg-center" 
//             ></div>
//             <div className="max-w-5xl mx-auto rounded-xl overflow-hidden relative z-10">
//                 <div className="relative h-[380px]">
//                     {/* Left side - Image */}
//                     <div className="absolute bottom-0 left-0 w-1/2 flex justify-center">
//                         <Image 
//                             src="/assets/images/phone.png" 
//                             alt="Maximize Your Experience" 
//                             width={350} 
//                             height={650}
//                             className="object-contain z-20 relative"
//                         />
//                     </div>

//                     {/* Right side - Content */}
//                     <div className="absolute top-1/2 left-[72%] transform -translate-x-1/2 -translate-y-1/2 w-1/2 p-8 relative z-20">
//                         <h2 className="text-[40px] font-semibold tracking-tight text-gray-900 sm:text-4xl mb-6">
//                         Maximize your experience with our mobile app
//                         </h2>
//                         <div className="flex  items-center gap-6">
//                             <Image 
//                                 src="/assets/images/googleplay.png" 
//                                 alt="Google Play" 
//                                 width={100} 
//                                 height={50}
//                                 className="cursor-pointer hover:opacity-90 transition-opacity"
//                             />
//                             <Image 
//                                 src="/assets/images/applyappstore.png" 
//                                 alt="App Store" 
//                                 width={100} 
//                                 height={50}
//                                 className="cursor-pointer hover:opacity-90 transition-opacity"
//                             />
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </section>
//     );
// };

// export default MaximizeExp;
import Image from "next/image";

const MaximizeExp = () => {
    return (
        <section className="py-10 px-4 relative max-w-5xl mx-auto overflow-hidden">
            <div 
                className="bg-[url('/assets/images/maximizeexperience.svg')] absolute inset-0 bg-contain bg-no-repeat bg-center" 
            ></div>
            <div className="max-w-5xl mx-auto rounded-xl overflow-hidden relative z-10">
                <div className="relative min-h-[380px] flex flex-col lg:flex-row">
                    {/* Left side - Image */}
                    <div className="w-full lg:w-1/2 flex justify-center items-end order-2 lg:order-1">
                        <Image 
                            src="/assets/images/phone.svg" 
                            alt="Maximize Your Experience" 
                            width={350} 
                            height={650}
                            className="object-contain z-20 relative max-w-[250px] lg:max-w-none"
                        />
                    </div>

                    {/* Right side - Content */}
                    <div className="w-full lg:w-1/2 p-4 flex flex-col justify-center items-center lg:items-start text-center lg:text-left order-1 lg:order-2">
                        <h2 className="text-2xl md:text-4xl lg:text-[40px] leading-[1] font-semibold text-gray-900 mb-6 max-w-lg capitalize">
                            Maximize your experience with our mobile app
                        </h2>
                        <div className="flex items-center gap-6">
                            <Image 
                                src="/assets/images/googleplay.png" 
                                alt="Google Play" 
                                width={100} 
                                height={50}
                                className="cursor-pointer hover:opacity-90 transition-opacity"
                            />
                            <Image 
                                src="/assets/images/applyappstore.png" 
                                alt="App Store" 
                                width={100} 
                                height={50}
                                className="cursor-pointer hover:opacity-90 transition-opacity"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default MaximizeExp;