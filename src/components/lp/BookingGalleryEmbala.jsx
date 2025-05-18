"use client";
import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import { Button } from "../ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Carousel, CarouselContent, CarouselDots, CarouselItem, CarouselNext, CarouselPrevious } from "../ui/carousel";

const BookingGalleryEmbala = ({ images }) => {
    const IMAGES = images?.length > 0 ? [...images] : ["/assets/images/fycht.jpg"];
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [emblaRef, emblaApi] = useEmblaCarousel({});
    const [thumbsRef, thumbsApi] = useEmblaCarousel({ containScroll: "keepSnaps", dragFree: true });

    const scrollTo = useCallback(
        (index) => {
            if (!emblaApi) return;
            emblaApi.scrollTo(index);
        },
        [emblaApi]
    );

    const onSelect = useCallback(() => {
        if (!emblaApi) return;
        setSelectedIndex(emblaApi.selectedScrollSnap());
        thumbsApi && thumbsApi.scrollTo(emblaApi.selectedScrollSnap());
    }, [emblaApi, thumbsApi]);

    useEffect(() => {
        if (!emblaApi) return;
        emblaApi.on("select", onSelect);
        emblaApi.on("reInit", onSelect);
    }, [emblaApi, onSelect]);

    return (
        <section id="BookingEmblaCarosuel" className="px-2 sm:px-4">
            {/* <section className="embla">
                <div className="embla__viewport" ref={emblaRef}>
                    <div className="embla__container">
                        {IMAGES?.map((src, index) => (
                            <div className="embla__slide" key={index}>
                                <div className="relative cursor-pointer h-[300px] sm:h-[300px] md:h-[400px] w-full">
                                    <Image
                                        src={src}
                                        fill
                                        alt={`Gallery Image ${index + 1}`}
                                        className="object-cover rounded-xl md:rounded-3xl"
                                        priority
                                        sizes="(max-width: 640px) 100vw, (max-width: 768px) 80vw, (max-width: 1024px) 70vw, 60vw"
                                        draggable={false}
                                    />
                                    {IMAGES?.length > 1 && <div  className="embla__dots absolute bottom-4 left-0 right-0 flex justify-center gap-1.5 z-50">
                                        {IMAGES.map((_, index) => (
                                            <DotButton
                                                key={index}
                                                onClick={() => scrollTo(index)}
                                                className={'embla__dotstop h-1.5 w-1.5 rounded-full transition-all '.concat(
                                                    index === selectedIndex ? ' embla__dotstop--selected bg-white' : 'bg-white/50 hover:bg-white/75'
                                                )}
                                            />
                                        ))}
                                    </div>}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>






            </section> */}

               <Carousel className="px-1 h-[300px] sm:h-[300px] md:h-[400px] w-full">
                                <CarouselContent>
                                  {IMAGES.map((image, index) => (
                                    <CarouselItem key={index}>
                                      <Image
                                        src={image ? `${image}` : '/assets/images/fycht.jpg'}
                                        alt="Yacht Image"
                                        width={326}
                                        height={400}
                                        quality={100}
                                        className="ml-2 object-cover px-3 pt-2.5 rounded-3xl  h-[300px] sm:h-[300px] md:h-[400px] w-full"
                                        onError={(e) => {
                                          e.target.src = '/assets/images/fycht.jpg';
                                        }}
                                      />
                                    </CarouselItem>
                                  ))}
                                </CarouselContent>
                                <CarouselPrevious className="absolute left-5 top-1/2 transform -translate-y-1/2 z-10">
                                  <Button variant="icon" onClick={(e) => {
                                    e.stopPropagation();
                                  }}>
                                    <ChevronLeft />
                                  </Button>
                                </CarouselPrevious>
                                <CarouselNext className="absolute right-5 top-1/2 transform -translate-y-1/2 z-10">
                                  <Button variant="icon" onClick={(e) => {
                                    e.stopPropagation();
                                  }}>
                                    <ChevronRight />
                                  </Button>
                                </CarouselNext>
                              </Carousel>

            {/* {IMAGES?.length > 1 && (
                <div className="embla-thumbs" ref={thumbsRef}>
                    <div className="embla-thumbs__container">
                        {IMAGES?.map((src, index) => (
                            <Thumb
                                key={index}
                                src={src}
                                onClick={() => scrollTo(index)}
                                selected={index === selectedIndex}
                            />
                        ))}
                    </div>
                </div>
            )} */}
        </section>
    );
};

const Thumb = ({ src, onClick, selected }) => (
    <button
        onClick={onClick}
        className={`embla-thumbs__slide ${selected ? "embla-thumbs__slide--selected" : ""}`}
    >
        <Image src={src} width={80} height={80} alt="Thumbnail" className={`rounded-lg object-cover  relative w-[80px] h-[80px] sm:w-[80px] md:w-[120px]  overflow-hidden transition-all duration-300 rounded-lg 
                                          hover:opacity-100 
                                         cursor-pointer ${selected ? "opacity-100" : "opacity-70"}`} />
    </button>
);

export default BookingGalleryEmbala;


export const DotButton = (props) => {
    const { children, ...restProps } = props

    return (
        <button type="button" {...restProps}>
            {children}
        </button>
    )
}