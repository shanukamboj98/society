
import Carousel from './EventCarousel'
import AboutUs from './AboutUs'
import Activity from "../pages/activity_event/Activity"
import Organisation from './Organisation'
import Events from './Events'



function Home() {
  return (
    <div className='main'>
<Carousel />
<AboutUs />
<Organisation />
<Events/>

<Activity />
    </div>
  )
}

export default Home