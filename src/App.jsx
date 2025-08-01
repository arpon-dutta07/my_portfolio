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



const App = () => {
  return (
    <div className='box w-full h-full '>
      <CustomScrollBar/>
    <div className='container mx-auto max-w-7xl'>
      <SmoothCursor/>
      <Navbar/>
      <Hero/> 
    </div>     
      <About/>
      <DancehausScroll/>
      <ParticleTextEffect/>
      <Projects/>
      <MyGallery/>

      



    </div>
  )
}

export default App