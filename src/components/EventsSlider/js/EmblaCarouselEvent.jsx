import React, { useCallback, useEffect, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import { LazyLoadImage } from './EmblaCarouselLazyLoadImage'
import {
  NextButton,
  PrevButton,
  usePrevNextButtons
} from './EmblaCarouselArrowButtons'
import { DotButton, useDotButton } from './EmblaCarouselDotButton'
import '../css/base.css'
import '../css/sandbox.css'
import '../css/embla.css'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import BrandCard from '@/app/dashboard/partner-discounts/DiscountCard'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useTheme } from 'next-themes'

const EventSliderEmbala = (props) => {
  const { slides, options, handleTicketChange, ticketCounts } = props
  const [emblaRef, emblaApi] = useEmblaCarousel(options)
  const { id, eventsType } = useParams();
  const { theme } = useTheme();


  const { selectedIndex, scrollSnaps, onDotButtonClick } =
    useDotButton(emblaApi)

  const {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick
  } = usePrevNextButtons(emblaApi)

  //test
  // console.log("slides", slides)

  return (
    <section className="embla cursor-pointer">
      <div className="embla__viewport" ref={emblaRef}>
        <div className="embla__container">
          {slides.map((pkg, index) => (
            <div className="embla__slide" key={index}>
           

              <div className='bg-white relative  dark:bg-gray-800 rounded-3xl border p-4 space-y-2 w-full max-w-[270px] h-full min-h-[220px] flex flex-col justify-between'>
           
                <div>
                {
                (pkg?.sold) &&

                <Image src={theme === 'dark' ? "/assets/images/sold_out_dark-removebg-preview.png" : "/assets/images/sold_out_light.png"} alt="Hot" width={80} height={100} className="absolute rounded-3xl top-0 right-0 z-10" />

              }
                  <h3 className='text-gray-700 font-semibold text-lg dark:text-white'>{pkg?.package_type}</h3>
                  <p className={`text-gray-700 font-normal text-sm flex-grow dark:text-white ${pkg?.sold ? 'line-clamp-2' : 'truncate overflow-hidden ellipsis'}`}>
                    {pkg?.description || <span>No description<br />available</span>}
                  </p>
                </div>
                <div className='flex flex-col justify-start space-y-4'>
                  <p className='font-semibold text-3xl text-[#BEA355] flex items-center dark:text-white mt-6'>
                    {/* <DollarSign className='size-4 text-gray-700 dark:text-white' /> */}
                    <span className="text-sm mx-2">AED</span>     {pkg?.price}
                    <span className='text-sm text-gray-700 mt-2 dark:text-white'>.00/per ticket</span>
                  </p>

                  {/* Ticket Counter */}
                  <div className="flex items-center justify-between dark:bg-gray-900 p-2 rounded-lg">
                    <span className="text-sm font-medium">Tickets</span>
                    <div className="flex items-center space-x-3">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleTicketChange(pkg?.id, 'decrease', pkg)}
                        className="h-8 w-8 rounded-xl bg-[#F4F4F4] dark:bg-gray-800"
                        disabled={pkg?.sold}

                        
                      >
                        -
                      </Button>
                      <span className="text-lg font-medium w-6 text-center">
                        {ticketCounts[pkg?.id] || 0}
                      </span>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleTicketChange(pkg?.id, 'increase', pkg)}
                        className="h-8 w-8 rounded-xl bg-[#F4F4F4] dark:bg-gray-800"
                        disabled={pkg?.sold}
                      >
                        +
                      </Button>
                    </div>
                  </div>

                  {/* Total Amount */}
                  <div className="text-sm font-medium flex justify-between items-center">
                    <span>Total Amount:</span>
                    <span className="text-[#BEA355]">
                      AED {(ticketCounts[pkg?.id] || 0) * pkg?.price}
                    </span>
                  </div>

                  {/* Book Now Button */}
                  <Link
                    className="w-full"
                    href={`/dashboard/event/${eventsType}/${id}/booking?tickets=${ticketCounts[pkg?.id] || 0}&package=${pkg?.id}`}
                    onClick={(e) => {
                      // Check if no tickets are selected
                      if (!ticketCounts[pkg?.id]) {
                        e.preventDefault();
                        toast({
                          title: "Select Tickets",
                          description: "Please select at least one ticket",
                          variant: "default"
                        });
                        return;
                      }

                      // Check if user is not logged in
                      if (!session) {
                        e.preventDefault();
                        toast({
                          title: "Login Required",
                          description: "Please login to book an event",
                          variant: "destructive"
                        });
                        router.push('/login');
                      }
                    }}
                  >
                    <Button
                      className='bg-[#BEA355] text-white rounded-full px-4 h-10 w-full disabled:opacity-50'
                      disabled={!ticketCounts[pkg?.id]}
                    >
                      Book Now
                    </Button>
                  </Link>
                  {/* <Link className="w-full" href={`/dashboard/event/${eventsType}/${id}/booking`}>
                            <Button className='bg-[#BEA355] text-white rounded-full px-4 h-10 w-full'>Book Now</Button>
                          </Link> */}
                </div>
              </div>

            </div>
          ))}
        </div>
      </div>

      {/* <div className="embla__controls">
        <div className="embla__buttons">
          <PrevButton onClick={onPrevButtonClick} disabled={prevBtnDisabled} />
          <NextButton onClick={onNextButtonClick} disabled={nextBtnDisabled} />
        </div>

        <div className="embla__dots">
          {scrollSnaps.map((_, index) => (
            <DotButton
              key={index}
              onClick={() => onDotButtonClick(index)}
              className={'embla__dot'.concat(
                index === selectedIndex ? ' embla__dot--selected' : ''
              )}
            />
          ))}
        </div>
      </div> */}
    </section>
  )
}

export default EventSliderEmbala
