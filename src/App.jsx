import React from 'react'
import Navbar from './sections/Navbar'
import Hero from './sections/Hero'
import About from './sections/About'
import DancehausScroll from './components/DancehausScroll'
import { SmoothCursor } from './components/SmoothCursor'




const App = () => {
  return (
    <div className='container mx-auto max-w-7xl'>
      <SmoothCursor/>
      <Navbar/>
      <Hero/>      
      <About/>
      <DancehausScroll/>

    </div>
  )
}

export default App