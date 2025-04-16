import Image from 'next/image'
import React, { useState, useCallback } from 'react'

const PLACEHOLDER_SRC = `/assets/images/fycht.jpg`

export const LazyLoadImage = (props) => {
  const { imgSrc, inView } = props
  const [hasLoaded, setHasLoaded] = useState(false)

  const setLoaded = useCallback(() => {
    if (inView) setHasLoaded(true)
  }, [inView, setHasLoaded])

  return (
    <div className="embla__slide">
        {!hasLoaded && <span className="embla__lazy-load__spinner" />}

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
            e.target.src = '/assets/images/fycht.jpg';
          }}
        />
      </div>
    </div>
  )
}
