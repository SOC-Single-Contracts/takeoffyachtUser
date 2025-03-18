import Image from "next/image";

const ListExperience = () => {
    return (
        <section className="my-14 relative max-w-5xl mx-auto w-[98%] overflow-hidden rounded-3xl shadow-md">
            <div className="bg-[#91908b] dark:bg-gray-700 absolute inset-0" ></div>
            <div className="max-w-6xl mx-auto rounded-2xl overflow-hidden relative z-10">
                <div className="relative min-h-[250px] flex flex-col-reverse lg:flex-row">
                    {/* Left side - Content */}
                    <div className="w-full lg:w-[1400px] px-8 pt-8 flex flex-col justify-center items-center lg:items-start text-center lg:text-left order-2 lg:order-1">
                        <h2 className="text-xl md:text-2xl lg:text-[32px] capitalize font-semibold tracking-tight text-white dark:text-white mb-6 flex items-center justify-center lg:justify-start w-full">
                            <span className="mr-4">
                                <Image
                                    src="/assets/images/boaticon.svg"
                                    alt="List Your Yacht"
                                    width={35}
                                    height={35}
                                    className="invert"
                                />
                            </span>
                            List your yachts and experiences
                        </h2>
                        <p className="text-normal text-sm md:text-[16px] text-white dark:text-white mb-6 text-balance w-full max-w-[700px] text-center lg:text-left">
                            Sail the azure waters in style aboard our meticulously crafted yacht, equipped with opulent amenities and a professional crew Sail the azure waters in style aboard our meticulously crafted yacht.
                        </p>
                    </div>

                    <div className="w-full flex justify-end items-end order-1 lg:order-2 px-0 sm:px-0 md:px-0 lg:px-0">
                    <Image 
                        src="/assets/images/yachtcut.png" 
                        alt="List Your Yacht" 
                        width={400} 
                        height={300}
                        className="object-contain z-20 relative max-w-full h-auto"
                    />
                </div>

                </div>
            </div>
        </section>
    );
};

export default ListExperience;