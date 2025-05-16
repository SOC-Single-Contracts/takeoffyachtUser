import Image from 'next/image'
import React, { useState, useCallback, useEffect } from 'react'

const PLACEHOLDER_SRC = `/assets/images/dubai.png`

export const LazyLoadImage = (props) => {
  const { imgSrc, inView, slidesInView } = props
  const [hasLoaded, setHasLoaded] = useState(false)

  const setLoaded = useCallback(() => {
    if (inView) setHasLoaded(true)
  }, [inView, setHasLoaded])

  //test
  // useEffect(() => {
  //   console.log("slidesInView", slidesInView)
  // }, [slidesInView])

  return (
    <div className="embla__slide">
      {/* {!hasLoaded && <span className="embla__lazy-load__spinner" />} */}

      {(!hasLoaded && slidesInView?.length > 2) ? <span className="embla__lazy-load__spinner" /> : !hasLoaded ? 
      // <Image
      //   className="object-cover px-2 pt-3 rounded-[1.8rem] w-full h-[240px] "
      //   src={`/assets/images/Imagenotavailable.png`}
      //   alt="loadAlt"
      //   height={240}
      //   width={100}
      //   onError={(e) => {
      //     e.target.src = '/assets/images/Imagenotavailable.png';
      //   }}
      // /> 
      <span className="embla__lazy-load__spinner" />

      : ""}

      {/* <span className="embla__lazy-load__spinner" /> */}

      <div
        className={'embla__lazy-load'.concat(
          hasLoaded ? ' embla__lazy-load--has-loaded' : ''
        )}
      >
        <Image
          className="embla__slide__img embla__lazy-load__img"
          onLoad={setLoaded}
          src={inView ? imgSrc : PLACEHOLDER_SRC}
          alt="loadAlt"
          height={240}
          width={100}
          data-src={imgSrc}
          onError={(e) => {
            e.target.src = '/assets/images/Imagenotavailable.png';
          }}
        />
      </div>
    </div>
  )
}
