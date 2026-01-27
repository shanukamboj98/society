import React from 'react'
import Carousel from './EventCarousel'
import AboutUs from './AboutUs'
import Events from './Events'


function Home() {
  return (
    <div className='main'>
<Carousel />
<AboutUs />

<Events />
    </div>
  )
}

export default Home