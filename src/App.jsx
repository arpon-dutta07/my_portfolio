import React from 'react'
import Navbar from './sections/Navbar'
import Hero from './sections/Hero'
import About from './sections/About'
import DancehausScroll from './components/DancehausScroll'
import { SmoothCursor } from './components/SmoothCursor'
import ParticleTextEffect from './components/ui/ParticleTextEffect'
import CustomScrollBar from './components/CustomScrollBar'
import Projects from './sections/Projects'
import MyGallery from './components/animated-gallery'
import InteractiveGallery from './components/InteractiveDoubleImage'
import Experiences from './sections/Experiences'
import Testimonial from './sections/Testimonial'
import Contact from './sections/Contact'
import Footer from './components/Footer'



const App = () => {
  return (
    <div className='box w-full h-full '>
      <CustomScrollBar/>
    <div className='container mx-auto max-w-7xl'>
      <SmoothCursor/>
      <Navbar/>
      <div id="home">
        <Hero/> 
      </div>
    </div>     
      <div id="about">
        <About/>
      </div>
      <DancehausScroll/>
      <ParticleTextEffect/>
      <div id="work">
        <Projects/>
      </div>
      <MyGallery/>
      <InteractiveGallery/>
      <Experiences/>
      <Testimonial/>
      <div id="contact">
        <Contact/>
      </div>
      <Footer/>
    </div>
  )
}

export default App