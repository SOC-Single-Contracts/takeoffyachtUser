import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

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
        <Link href={`/dashboard/experience/${experienceType}/${experience.id}`} className="group">
            <Card className="overflow-hidden bg-white dark:bg-gray-800 w-full md:max-w-[240px] h-full md:min-h-[270px] min-h-[290px] rounded-3xl cursor-pointer shadow-lg hover:shadow-xl transition-shadow">
                <div className="relative overflow-hidden group">
                    <div className="overflow-hidden">
                        <Image 
                            src={experience?.experience_image
                                ? `${process.env.NEXT_PUBLIC_S3_URL}${experience?.experience_image}`
                                : '/assets/images/dubai.png'
                            }

                            alt="featured yachts"
                            quality={100}
                            width={262} 
                            height={220}
                            className='w-full md:h-[220px] h-[240px] object-cover rounded-3xl px-2 pt-2' 
                            onError={(e) => {
                                e.target.src = '/assets/images/dubai.png'
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
                
                <div className="pl-4 py-1.5">
                    <h3 className="text-[18px] font-medium">{experience.name}</h3>
                </div>
            </Card>
        </Link>
    );
};

export default ExperienceCard;