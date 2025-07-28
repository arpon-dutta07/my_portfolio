import React from 'react'
import Navbar from './sections/Navbar'
import Hero from './sections/Hero'
import About from './sections/About'
import DancehausScroll from './components/DancehausScroll'
import { SmoothCursor } from './components/SmoothCursor'
import ParticleTextEffect from './components/ui/ParticleTextEffect'




const App = () => {
  return (
    <div className='box w-full h-full '>
    <div className='container mx-auto max-w-7xl'>
      <SmoothCursor/>
      <Navbar/>
      <Hero/>      
      <About/>
      <DancehausScroll/>
      <ParticleTextEffect/>

    </div>
    </div>
  )
}

export default App