import Image from 'next/image';
import React, { useState, useCallback } from 'react';

const PLACEHOLDER_SRC = '/assets/images/fycht.jpg';

export const LazyLoadImage = ({ imgSrc, inView }) => {
  const [hasLoaded, setHasLoaded] = useState(false);
  const [src, setSrc] = useState(imgSrc);

  const handleLoad = useCallback(() => {
    if (inView) setHasLoaded(true);
  }, [inView]);

  const handleError = useCallback(() => {
    if (src !== PLACEHOLDER_SRC) {
      setSrc(PLACEHOLDER_SRC);
    }
    setHasLoaded(true);
  }, [src]);

  return (
    <div className="embla__slide">
      {!hasLoaded && <span className="embla__lazy-load__spinner" />}
      <div className={`embla__lazy-load${hasLoaded ? ' embla__lazy-load--has-loaded' : ''}`}>
        <Image
          className="embla__slide__img embla__lazy-load__img"
          onLoad={handleLoad}
          onError={handleError}
          src={inView ? src : PLACEHOLDER_SRC}
          alt="loadAlt"
          width={100} // Adjusted to maintain aspect ratio
          height={240}
          style={{ width: '100%', height: '240px', objectFit: 'cover' }}
        />
      </div>
    </div>
  );
};
