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

const EmblaCarouselYacht = (props) => {
  const { slides, options, yachtsType, item, daysCount, handleWishlistToggle, favorites } = props
  const [emblaRed, emblaApi] = useEmblaCarousel(options)
  const [slidesInView, setSlidesInView] = useState([])

  const { selectedIndex, scrollSnaps, onDotButtonClick } =
    useDotButton(emblaApi)

  const {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick
  } = usePrevNextButtons(emblaApi)

  const updateSlidesInView = useCallback((emblaApi) => {
    setSlidesInView((slidesInView) => {
      if (slidesInView.length === emblaApi.slideNodes().length) {
        emblaApi.off('slidesInView', updateSlidesInView)
      }
      const inView = emblaApi
        .slidesInView()
        .filter((index) => !slidesInView.includes(index))
      return slidesInView.concat(inView)
    })
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return

    updateSlidesInView(emblaApi)
    emblaApi.on('slidesInView', updateSlidesInView)
    emblaApi.on('reInit', updateSlidesInView)
  }, [emblaApi, updateSlidesInView])

  return (
    <div className="embla">
      <div className="embla__viewport" ref={emblaRed}>
        <div className="embla__container">
          {slides?.length > 0 ? slides?.map((slide, index) => (
            // <LazyLoadImage
            //   key={index}
            //   index={index}
            //   imgSrc={`https://picsum.photos/600/350?v=${index}`}
            //   inView={slidesInView.indexOf(index) > -1}
            // />
            <LazyLoadImage
              key={`${slide}-${index}`}
              index={index}
              imgSrc={`${process.env.NEXT_PUBLIC_S3_URL}${slide}`}
              inView={slidesInView.indexOf(index) > -1}
              slidesInView={slidesInView}

            />
          )) : 
          
          <Image
          className="object-cover pl-3 pr-3 pt-3 rounded-[1.8rem] w-full h-[240px] ml-4"
            src={`/assets/images/Imagenotavailable.png`}
            alt="loadAlt"
            height={240}
            width={100}
            onError={(e) => {
              e.target.src = '/assets/images/Imagenotavailable.png';
            }}
          />
          // <span className="embla__lazy-load__spinner" />
          // "FOR1"
          }
        </div>
      </div>
   {yachtsType == "f1yachts" &&   <Image src="/assets/images/redtag.png" alt="Hot" width={50} height={50} className="absolute top-0 right-0 z-10" />} 

                

      <Button
        variant="secondary"
        size="icon"
        className="absolute top-6 right-6 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white"
        onClick={() => handleWishlistToggle(item?.yacht?.id)}
      >
        <Image
          src={favorites.has(item?.yacht?.id)
            ? "/assets/images/wishlist.svg"
            : "/assets/images/unwishlist.svg"
          }
          alt="wishlist"
          width={20}
          height={20}
        />
      </Button>

     <div className="absolute priceContainer right-5 bg-white dark:bg-gray-800 p-[0.3rem] rounded-md shadow-md">

        {yachtsType == "yachts" ? <span className="font-medium text-xs">
          AED <span className="font-bold font-medium text-primary">{item?.yacht?.per_hour_price}</span>
          <span className="text-xs font-light ml-1">/Hour</span>
        </span> : yachtsType == "f1yachts" ? <span className="font-medium text-xs">
          AED <span className="font-bold font-medium text-primary">{item?.yacht?.per_day_price}</span>
          <span className="text-xs font-light ml-1">{`/${daysCount} ${daysCount === 1 ? 'Day' : 'Days'}`}                          </span>
        </span> : ""}

      </div>

      <div className="embla__controls">
        <div className="embla__buttons">
          <PrevButton onClick={onPrevButtonClick} disabled={prevBtnDisabled} />
          <NextButton onClick={onNextButtonClick} disabled={nextBtnDisabled} />
        </div>

        <div className="embla__dots absolute bottom-4 left-0 right-0 flex justify-center gap-1.5 z-50">
          {scrollSnaps.map((_, index) => (
            <DotButton
              key={index}
              onClick={() => onDotButtonClick(index)}
              className={'embla__dotstop h-1.5 w-1.5 rounded-full transition-all '.concat(
                index === selectedIndex ? ' embla__dotstop--selected bg-white' : 'bg-white/50 hover:bg-white/75'
              )}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default EmblaCarouselYacht
