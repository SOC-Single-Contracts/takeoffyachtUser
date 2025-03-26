"use client"
import Image from "next/image"
import { useState, useEffect, useCallback } from "react"
import { Button } from "../ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

const DetailPageGallery = ({ images }) => {
    // Ensure there's always at least one image
    const IMAGES = images.length > 0 ? [...images] : ["/assets/images/fycht.jpg"]

    // console.log("Images received:", images)

    const [currentImageIndex, setCurrentImageIndex] = useState(0)
    const [progress, setProgress] = useState(0)

    const advanceImage = useCallback(() => {
        setCurrentImageIndex((prevIndex) =>
            (prevIndex + 1) % IMAGES.length
        )
        setProgress(0)
    }, [IMAGES.length])

    useEffect(() => {
        if (IMAGES.length <= 1) return // Prevent unnecessary intervals for a single image

        const intervalDuration = 8000
        const progressInterval = 80

        const imageTimer = setTimeout(advanceImage, intervalDuration)

        const progressTimer = setInterval(() => {
            setProgress((prevProgress) => {
                if (prevProgress >= 100) {
                    return 0
                }
                return prevProgress + (progressInterval / intervalDuration) * 100
            })
        }, progressInterval)

        return () => {
            clearTimeout(imageTimer)
            clearInterval(progressTimer)
        }
    }, [currentImageIndex, advanceImage, IMAGES.length])

    const handleThumbnailClick = (index) => {
        setCurrentImageIndex(index)
        setProgress(0)
    }

    return (
        <section className="px-2 sm:px-4">
            <div className="mx-auto mt-8 md:mt-14 max-w-5xl relative rounded-xl md:rounded-3xl overflow-hidden">
                <div className="relative h-[300px] sm:h-[400px] md:h-[500px] w-full">
                    {IMAGES.length > 0 && (
                        <Image
                            src={IMAGES[currentImageIndex]}
                            fill
                            alt="yachts gallery"
                            className="object-cover transition-opacity duration-500"
                            priority
                            sizes="(max-width: 640px) 100vw, (max-width: 768px) 80vw, (max-width: 1024px) 70vw, 60vw"
                        />
                    )}
                    {IMAGES.length > 1 && (
                        <>
                            <div className="absolute top-1/2 left-[1rem] z-10 transform -translate-y-1/2">
                                <Button
                                    className="rounded-full"
                                    variant="outline"
                                    size="icon"
                                    onClick={() => setCurrentImageIndex((currentImageIndex - 1 + IMAGES.length) % IMAGES.length)}
                                >
                                    <ChevronLeft />
                                </Button>
                            </div>
                            <div className="absolute top-1/2 right-[1rem] z-10 transform -translate-y-1/2">
                                <Button
                                    className="rounded-full"
                                    variant="outline"
                                    size="icon"
                                    onClick={() => setCurrentImageIndex((currentImageIndex + 1) % IMAGES.length)}
                                >
                                    <ChevronRight />
                                </Button>
                            </div>
                        </>
                    )}
                </div>


                <div className="w-full flex flex-col items-center">

                    {images.length > 1 && (
                        <div className="flex overflow-x-auto space-x-2 md:space-x-3 h-[100px] scrollbar-hide mt-2">
                            {images.map((image, index) => (
                                <div
                                    key={index}
                                    className={`relative w-[80px] sm:w-[100px] md:w-[120px] h-full overflow-hidden transition-all duration-300 rounded-lg 
                ${currentImageIndex === index ? 'opacity-100 border-2 border-blue-500' : 'opacity-70 hover:opacity-100'} 
                cursor-pointer`
                                    }
                                    onClick={() => handleThumbnailClick(index)}
                                >
                                    <Image
                                        src={image}
                                        layout="fill"
                                        alt={`Thumbnail ${index + 1}`}
                                        className="object-cover rounded-lg"
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </section>
    )
}

export default DetailPageGallery
