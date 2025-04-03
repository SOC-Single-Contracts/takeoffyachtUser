"use client";
import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import { Button } from "../ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

const DetailPageGallery = ({ images }) => {
    const IMAGES = images.length > 0 ? [...images] : ["/assets/images/fycht.jpg"];
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
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
        <section className="px-2 sm:px-4">
            <div className="embla" ref={emblaRef}>
                <div className="embla__container">
                    {IMAGES.map((src, index) => (
                        <div className="embla__slide" key={index}>
                            <div className="relative h-[300px] sm:h-[400px] md:h-[500px] w-full">
                                <Image
                                    src={src}
                                    fill
                                    alt={`Gallery Image ${index + 1}`}
                                    className="object-cover rounded-xl md:rounded-3xl"
                                    priority
                                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 80vw, (max-width: 1024px) 70vw, 60vw"
                                    draggable={false}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {IMAGES.length > 1 && (
                <div className="embla-thumbs" ref={thumbsRef}>
                    <div className="embla-thumbs__container">
                        {IMAGES.map((src, index) => (
                            <Thumb
                                key={index}
                                src={src}
                                onClick={() => scrollTo(index)}
                                selected={index === selectedIndex}
                            />
                        ))}
                    </div>
                </div>
            )}
        </section>
    );
};

const Thumb = ({ src, onClick, selected }) => (
    <button
        onClick={onClick}
        className={`embla-thumbs__slide ${selected ? "embla-thumbs__slide--selected" : ""}`}
    >
        <Image src={src} width={80} height={80} alt="Thumbnail" className="rounded-lg object-cover" />
    </button>
);

export default DetailPageGallery;
