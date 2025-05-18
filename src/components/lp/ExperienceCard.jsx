import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Dot, MapPin } from 'lucide-react';

const ExperienceCard = ({ experienceData, isFavorite, onWishlistToggle,experienceType }) => {
    if (!experienceData || !experienceData.experience) {
        console.error('Invalid experience data:', experienceData);
        return null;
    }

    const { experience } = experienceData;

    const handleWishlistClick = (e) => {
        e.preventDefault();
        onWishlistToggle(experience.id);
    };


    return (
        <Link href={`/dashboard/experience/${experienceType}/${experience.id}`} className="group w-full">
            <Card className="overflow-hidden bg-white dark:bg-gray-800 w-full md:max-w-[240px]] h-full md:min-h-[270px] min-h-[290px] rounded-3xl cursor-pointer shadow-lg hover:shadow-xl transition-shadow">
                <div className="relative overflow-hidden group">
                    <div className="overflow-hidden">
                        <Image 
                            src={experience?.experience_image
                                ? `${process.env.NEXT_PUBLIC_S3_URL}${experience?.experience_image}`
                                : '/assets/images/Imagenotavailable.png'
                            }

                            alt="featured yachts"
                            quality={100}
                            width={262} 
                            height={220}
                            className='w-full md:h-[220px] h-[240px] object-cover rounded-3xl px-2 pt-2' 
                            onError={(e) => {
                                e.target.src = '/assets/images/Imagenotavailable.png'
                            }}
                        />
                    </div>
                    
                    <Button 
                        variant="secondary" 
                        size="icon" 
                        className="absolute top-4 right-4 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white"
                        onClick={handleWishlistClick}
                    >
                        <Image 
                            src={isFavorite 
                                ? "/assets/images/wishlist.svg" 
                                : "/assets/images/unwishlist.svg"
                            } 
                            alt="wishlist" 
                            width={20} 
                            height={20}
                            quality={100}
                            className=""
                        />
                    </Button>
                    
                    {experienceType == "f1-exp" ?   <div className="absolute bottom-4 right-5 bg-white dark:bg-gray-900 p-1.5 rounded-md">
                        <span className="text-[14px] font-semibold">
                            AED {experience.per_day_price}
                            <span className='text-[12px] font-normal'>/per day</span>
                        </span>
                    </div> : experienceType == "regular-exp" ?   <div className="absolute bottom-4 right-5 bg-white dark:bg-gray-900 p-1.5 rounded-md">
                        <span className="text-[14px] font-semibold">
                            AED {experience.per_hour_price}
                            <span className='text-[12px] font-normal'>/per hour</span>
                        </span>
                    </div> :""}
                  
                </div>
                
                {/* <div className="pl-4 py-1.5">
                    <h3 className="text-[18px] font-medium">{experience.name}</h3>
                </div> */}


                    <Link href={`/dashboard/experience/${experienceType}/${experience.id}`}>
                
                                  <CardContent className="px-4 py-2">
                                    <p className="text-xs font-light bg-[#BEA355]/30 text-black dark:text-white rounded-md px-1 py-0.5 w-auto inline-flex items-center">
                                      <MapPin className="size-3 mr-1" /> {experience?.location || "Location Not Available"}
                                    </p>
                                    <div className="flex justify-between items-center">
                                      <h3 className="text-[20px] font-semibold mb-1 truncate max-w-[230px]">{experience?.name}</h3>
                                      <span className="font-medium text-xs">
                                        AED <span className="font-bold text-sm text-primary">{experience?.per_day_price}</span>
                                        <span className="text-xs font-light ml-1">/Day</span>
                                      </span>
                                    </div>
                                    <div className="flex justify-start items-center gap-1">
                                      <Image src="/assets/images/transfer.svg" alt="length" quality={100} width={9} height={9} className="" />
                                      <p className="font-semibold text-xs">{experience?.length || 0} ft</p>
                                      <Dot />
                                      <div className="text-center font-semibold flex items-center text-xs space-x-2">
                                        <Image src="/assets/images/person.svg" alt="length" quality={100} width={8} height={8} className="dark:invert" />
                                        <p>Guests</p>
                                        <p>{experience?.guest || 0}</p>
                                      </div>
                                      <Dot />
                                      <div className="text-center font-semibold flex items-center text-xs space-x-2">
                                        <Image src="/assets/images/cabin.svg" alt="length" quality={100} width={8} height={8} className="dark:invert" />
                                        <p>Cabins</p>
                                        <p>{experience?.number_of_cabin || 0}</p>
                                      </div>
                                    </div>
                                  </CardContent>
                                </Link>
            </Card>
        </Link>
    );
};

export default ExperienceCard;