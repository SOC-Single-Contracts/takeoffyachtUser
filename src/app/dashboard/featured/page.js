import React from 'react'
import FeaturedListings from './Listings'
import Events from '../events/page'

const Featured = () => {
  return (
    <div>
      {/* <Options /> */}
      <FeaturedListings />
      <Events limit={8} />
    </div>
  )
}

export default Featured
