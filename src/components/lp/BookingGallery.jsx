"use client";
import Image from "next/image";
import { useState, useEffect, useCallback } from "react";
import { Button } from "../ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useSwipeable } from "react-swipeable";

const BookingGallery = ({ images }) => {
    const IMAGES = images.length > 0 ? [...images] : ["/assets/images/fycht.jpg"];
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    // Auto-advance image every 8s
    const advanceImage = useCallback(() => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % IMAGES.length);
    }, [IMAGES.length]);

    useEffect(() => {
        if (IMAGES.length <= 1) return;
        const interval = setInterval(advanceImage, 8000);
        return () => clearInterval(interval);
    }, [advanceImage, IMAGES.length]);

    const handlePrev = () => {
        setCurrentImageIndex((prev) => (prev - 1 + IMAGES.length) % IMAGES.length);
    };

    const handleNext = () => {
        setCurrentImageIndex((prev) => (prev + 1) % IMAGES.length);
    };

    // Swipe handling for both **Mobile & Desktop**
    const handlers = useSwipeable({
        onSwipedLeft: handleNext,
        onSwipedRight: handlePrev,
        preventScrollOnSwipe: true, // Ensures smoother swipe handling on touch devices
        trackMouse: true, // Enables desktop mouse drag
    });

    return (
        <section className="px-2 sm:px-4">
            <div {...handlers} className="select-none cursor-grab active:cursor-grabbing mx-auto mt-8 md:mt-14 max-w-5xl relative rounded-xl md:rounded-3xl overflow-hidden">
                <div className="relative h-[300px] sm:h-[400px] md:h-[500px] w-full">
                    {IMAGES.length > 0 && (
                        <Image
                            src={IMAGES[currentImageIndex]}
                            fill
                            alt="yachts gallery"
                            className="object-cover transition-opacity duration-500"
                            priority
                            sizes="(max-width: 640px) 100vw, (max-width: 768px) 80vw, (max-width: 1024px) 70vw, 60vw"
                            draggable={false} // Prevents accidental image dragging
                        />
                    )}
                    {IMAGES.length > 1 && (
                        <>
                            <div className="absolute top-1/2 left-[1rem] z-10 transform -translate-y-1/2">
                                <Button className="rounded-full" variant="outline" size="icon" onClick={handlePrev}>
                                    <ChevronLeft />
                                </Button>
                            </div>
                            <div className="absolute top-1/2 right-[1rem] z-10 transform -translate-y-1/2">
                                <Button className="rounded-full" variant="outline" size="icon" onClick={handleNext}>
                                    <ChevronRight />
                                </Button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </section>
    );
};

export default BookingGallery;
