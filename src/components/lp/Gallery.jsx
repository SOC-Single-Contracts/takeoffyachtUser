// "use client"
// import Image from "next/image"
// import { useState, useEffect, useCallback } from "react"
// import { Progress } from "../ui/progress"

// const Gallery = () => {
//     const IMAGES = [
//         "/assets/images/0.webp",
//         "/assets/images/1.webp",
//         "/assets/images/2.webp",
//         "/assets/images/3.webp",
//         "/assets/images/4.webp",
//         "/assets/images/5.webp",
//     ]

//     const [currentImageIndex, setCurrentImageIndex] = useState(0)
//     const [progress, setProgress] = useState(0)

//     const advanceImage = useCallback(() => {
//         setCurrentImageIndex((prevIndex) => 
//             (prevIndex + 1) % IMAGES.length
//         )
//         setProgress(0)
//     }, [IMAGES.length])

//     useEffect(() => {
//         const intervalDuration = 8000
//         const progressInterval = 80

//         const imageTimer = setTimeout(advanceImage, intervalDuration)
        
//         const progressTimer = setInterval(() => {
//             setProgress((prevProgress) => {
//                 if (prevProgress >= 100) {
//                     return 0
//                 }
//                 return prevProgress + (progressInterval / intervalDuration) * 100
//             })
//         }, progressInterval)

//         return () => {
//             clearTimeout(imageTimer)
//             clearInterval(progressTimer)
//         }
//     }, [currentImageIndex, advanceImage])

//     const handleThumbnailClick = (index) => {
//         setCurrentImageIndex(index)
//         setProgress(0)
//     }

//     return (
//         <section className="px-2 sm:px-4 md:px-6">
//         <div className="mx-auto mt-8 md:mt-14 max-w-5xl relative rounded-xl md:rounded-3xl overflow-hidden">
//             <div className="relative h-[300px] sm:h-[400px] md:h-[500px] w-full">
//                 <Image
//                     src={IMAGES[currentImageIndex]}
//                     fill
//                     alt="yachts gallery"
//                     className="object-cover transition-opacity duration-500"
//                     priority
//                     sizes="(max-width: 640px) 100vw, (max-width: 768px) 80vw, (max-width: 1024px) 70vw, 60vw"
//                 />
//                 <div className="absolute top-1/2 left-0 transform -translate-y-1/2">
//                     <Button className="rounded-full" variant="outline" size="icon" onClick={() => setCurrentImageIndex((currentImageIndex - 1 + IMAGES.length) % IMAGES.length)}>
//                         <ChevronLeft />
//                     </Button>
//                 </div>
//                 <div className="absolute top-1/2 right-0 transform -translate-y-1/2">
//                     <Button className="rounded-full" variant="outline" size="icon" onClick={() => setCurrentImageIndex((currentImageIndex + 1) % IMAGES.length)}>
//                         <ChevronRight />
//                     </Button>
//                 </div>
//                 <div className="absolute bottom-0 left-0 right-0">
//                     <Progress className="rounded-none h-1" value={progress} />
//                 </div>
//             </div>
//             {/* Thumbnail Grid */}
//             <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 h-[80px] sm:h-[100px] md:h-[130px]">
//                 {IMAGES.map((image, index) => (
//                     <div 
//                         key={index} 
//                         className={`
//                             relative overflow-hidden transition-all duration-300 
//                             ${currentImageIndex === index 
//                                 ? 'opacity-100' 
//                                 : 'opacity-70 hover:opacity-100'}
//                             cursor-pointer
//                         `}
//                         onClick={() => handleThumbnailClick(index)}
//                     >
//                         <Image
//                             src={image}
//                             fill
//                             alt={`yachts gallery image ${index + 1}`}
//                             className="object-cover"
//                             sizes="(max-width: 640px) 33vw, (max-width: 768px) 25vw, 16vw"
//                         />
//                     </div>
//                 ))}
//             </div>
//         </div>
//         </section>
//     )
// }

// export default Gallery
"use client"
import Image from "next/image"
import { useState, useEffect, useCallback } from "react"
import { Progress } from "../ui/progress"
import { Button } from "../ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

const Gallery = () => {
    const IMAGES = [
        "/assets/images/0.webp",
        "/assets/images/1.webp",
        "/assets/images/2.webp",
        "/assets/images/3.webp",
        "/assets/images/4.webp",
        "/assets/images/5.webp",
    ]

    const [currentImageIndex, setCurrentImageIndex] = useState(0)
    const [progress, setProgress] = useState(0)

    const advanceImage = useCallback(() => {
        setCurrentImageIndex((prevIndex) => 
            (prevIndex + 1) % IMAGES.length
        )
        setProgress(0)
    }, [IMAGES.length])

    useEffect(() => {
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
    }, [currentImageIndex, advanceImage])

    const handleThumbnailClick = (index) => {
        setCurrentImageIndex(index)
        setProgress(0)
    }

    return (
        <section className="px-2 sm:px-4">
            <div className="mx-auto mt-8 md:mt-14 max-w-5xl relative rounded-xl md:rounded-3xl overflow-hidden">
                <div className="relative h-[300px] sm:h-[400px] md:h-[500px] w-full">
                    <Image
                        src={IMAGES[currentImageIndex]}
                        fill
                        alt="yachts gallery"
                        className="object-cover transition-opacity duration-500"
                        priority
                        sizes="(max-width: 640px) 100vw, (max-width: 768px) 80vw, (max-width: 1024px) 70vw, 60vw"
                    />
                    <div className="absolute top-1/2 left-[1rem] z-10 transform -translate-y-1/2">
                        <Button className="rounded-full" variant="outline" size="icon" onClick={() => setCurrentImageIndex((currentImageIndex - 1 + IMAGES.length) % IMAGES.length)}>
                            <ChevronLeft />
                        </Button>
                    </div>
                    <div className="absolute top-1/2 right-[1rem] z-10 transform -translate-y-1/2">
                        <Button className="rounded-full" variant="outline" size="icon" onClick={() => setCurrentImageIndex((currentImageIndex + 1) % IMAGES.length)}>
                            <ChevronRight />
                        </Button>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0">
                        <Progress className="rounded-none h-1" value={progress} />
                    </div>
                </div>
                {/* Thumbnail Grid */}
                {/* <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 h-[170px] md:h-[130px]">
                    {IMAGES.map((image, index) => (
                        <div 
                            key={index} 
                            className={`
                                relative overflow-hidden transition-all duration-300 
                                ${currentImageIndex === index 
                                    ? 'opacity-100' 
                                    : 'opacity-70 hover:opacity-100'}
                                cursor-pointer
                            `}
                            onClick={() => handleThumbnailClick(index)}
                        >
                            <Image
                                src={image}
                                fill
                                alt={`yachts gallery image ${index + 1}`}
                                className="object-cover"
                                sizes="(max-width: 640px) 33vw, (max-width: 768px) 25vw, 16vw"
                            />
                        </div>
                    ))}
                </div> */}
                <div className="flex overflow-x-auto space-x-1 md:space-x-1 h-[150px] scrollbar-hide">
  {IMAGES.map((image, index) => (
    <div 
      key={index} 
      className={`
        relative w-[30%] sm:w-[20%] md:w-[15%] lg:w-[30%] h-[55%] sm:h-[60%] md:h-[100%] overflow-hidden transition-all duration-300 
        ${currentImageIndex === index ? 'opacity-100' : 'opacity-70 hover:opacity-100'} 
        cursor-pointer
      `}
      onClick={() => handleThumbnailClick(index)}
    >
      <Image
        src={image}
        fill
        alt={`yachts gallery image ${index + 1}`}
        className="object-cover"
        sizes="(max-width: 640px) 33vw, (max-width: 768px) 25vw, 16vw"
      />
    </div>
  ))}
</div>

            </div>
        </section>
    )
}

export default Gallery