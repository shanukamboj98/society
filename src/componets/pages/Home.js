
import Carousel from './EventCarousel'
import AboutUs from './AboutUs'
import Activity from "../pages/activity_event/Activity"



function Home() {
  return (
    <div className='main'>
<Carousel />
<AboutUs />

<Activity />
    </div>
  )
}

export default Home