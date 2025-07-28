
import React, { useRef } from 'react'
import Card from '../components/Card'
import { Globe } from '../components/globe';
import CopyEmailButton from '../components/CopyEmailButton';
import { Frameworks } from '../components/Frameworks';
// About.jsx
import BackgroundVideo from '../components/BackgroundVideo'; // Adjust path as needed


const About = () => {
    const grid2Container = useRef();
  return (
    <div className="w-screen relative left-1/2 right-1/2 -mx-[50vw] px-4 sm:px-8">
    <BackgroundVideo
      videoSrc="/assets/video4.mp4"
      fallbackImage="/assets/space.jpg"
    >
    <section className=' relative c-space section-spacing' >
      <h2 className='text-heading text-xl font-bold transition-colors text-gray-300 hover:text-white' >About Me</h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-6 md:auto-rows-[18rem] mt-12">
        {/* Grid 1 */}
        <div className="flex items-end grid-default-color grid-1 transition-all duration-300 ease-in-out hover:-translate-y-1 hover:text-cyan-300 hover:drop-shadow-[0_0_12px_rgba(34,211,238,0.8)] ">
          <img
            src="assets/coding-pov.png"
            className="absolute scale-[1.75] -right-[5rem] -top-[1rem] md:scale-[3] md:left-50 md:inset-y-10 lg:scale-[2.5]"
          />
          <div className="z-10">
            <p className="headtext transition-all duration-300 ease-in-out hover:text-cyan-300 hover:drop-shadow-[0_0_12px_rgba(34,211,238,0.8)] hover:-translate-y-1 hover:scale-105">
              Hi, I'm Arpon Dutta</p>
            <p className="subtext transition-all duration-300 ease-in-out hover:text-cyan-300 hover:drop-shadow-[0_0_12px_rgba(34,211,238,0.8)] hover:-translate-y-1 hover:scale-105">
              Over the last 4 years, I developed my frontend and backend dev
              skills to deliver dynamic and software and web applications.
            </p>
          </div>
          <div className="absolute inset-x-0 pointer-evets-none -bottom-4 h-1/2 sm:h-1/3 bg-gradient-to-t from-indigo" />
          {/* this upper div is used as gradient so that both the paragraph text are visible. */}
        </div>

        {/* Grid 2 */}
        <div className="grid-default-color grid-2 transition-all duration-300 ease-in-out hover:-translate-y-1 hover:text-cyan-300 hover:drop-shadow-[0_0_12px_rgba(34,211,238,0.8)] ">
          <div
            ref={grid2Container}
            className="flex items-center justify-center w-full h-full"
          >
            <p className="flex items-end text-5xl text-gray-500">
              CODE IS CRAFT
            </p>
            <Card
              style={{ rotate: "75deg", top: "30%", left: "20%" }}
              text="GRASP"
              containerRef={grid2Container}
            />
            <Card
              style={{ rotate: "-30deg", top: "60%", left: "45%" }}
              text="SOLID"
              containerRef={grid2Container}
            />
            <Card
              style={{ rotate: "90deg", bottom: "30%", left: "70%" }}
              text="Design Patterns"
              containerRef={grid2Container}
            />
            <Card
              style={{ rotate: "-45deg", top: "55%", left: "0%" }}
              text="Design Principles"
              containerRef={grid2Container}
            />
            <Card
              style={{ rotate: "20deg", top: "10%", left: "38%" }}
              text="SRP"
              containerRef={grid2Container}
            />
            <Card
              style={{ rotate: "30deg", top: "70%", left: "70%" }}
              image="assets/logos/csharp-pink.png"
              containerRef={grid2Container}
            />
            <Card
              style={{ rotate: "-45deg", top: "70%", left: "25%" }}
              image="assets/logos/dotnet-pink.png"
              containerRef={grid2Container}
            />
            <Card
              style={{ rotate: "-45deg", top: "5%", left: "10%" }}
              image="assets/logos/blazor-pink.png"
              containerRef={grid2Container}
            />
          </div>
        </div>
        {/* Grid 3 */}
        <div className="grid-black-color grid-3 transition-all duration-300 ease-in-out hover:drop-shadow-[0_0_25px_rgba(167,139,250,0.6)] hover:scale-105">
          <div className="z-10 w-[50%]">
            <p className="headtext transition-all duration-300 ease-in-out hover:text-amber-300 hover:drop-shadow-[0_0_12px_rgba(253,186,116,0.8)] hover:-translate-y-1 hover:scale-105 ">Time Zone</p>
            <p className="subtext transition-all duration-300 ease-in-out hover:text-amber-300 hover:drop-shadow-[0_0_12px_rgba(253,186,116,0.8)] hover:-translate-y-1 hover:scale-105">
              I'm based in Howrah (Kolkata), and prefer working on-site with teams located in or around Kolkata.
            </p>
          </div>
          <figure className="absolute left-[30%] top-[10%]">
            <Globe/>
            {/* I have added the globe effect from the  Magic UI website.  */}
          </figure>
        </div>

        {/* Grid 4 */}
        <div className="grid-special-color grid-4 transition-all duration-300 ease-in-out hover:text-emerald-300 hover:drop-shadow-[0_0_12px_rgba(110,231,183,0.7)] hover:-translate-y-1 hover:scale-105">
          <div className="flex flex-col items-center justify-center gap-4 size-full">
            <p className="text-center headtext">
              Looking to bring your next idea to life? Let's connect.
            </p>
            <CopyEmailButton />
          </div>
        </div>
        {/* Grid 5 */}
        <div className="grid-default-color grid-5  transition-all duration-300 ease-in-out hover:-translate-y-1 hover:text-cyan-300 hover:drop-shadow-[0_0_12px_rgba(34,211,238,0.8)]">
          <div className="z-10 w-[50%]">
            <p className="headText transition-all duration-300 ease-in-out hover:-translate-y-1 hover:text-cyan-300 hover:drop-shadow-[0_0_12px_rgba(34,211,238,0.8)]">Tech Stack</p>
            <p className="subtext transition-all duration-300 ease-in-out hover:-translate-y-1 hover:text-cyan-300 hover:drop-shadow-[0_0_12px_rgba(34,211,238,0.8)]">
              I specialize in building scalable web applications using technologies like React,
              Tailwind CSS, Vite, and Next.js, with strong foundations in JavaScript, Python, Java, and Git. 
              I also bring creative expertise in UI/UX design with Figma, graphic design with Photoshop and Canva, 
              and video editing with CapCut — enabling me to deliver end-to-end digital experiences.
            </p>
          </div>
          <div className="absolute inset-y-0 md:inset-y-9 w-full h-full start-[50%] md:scale-125">
            <Frameworks />
          </div>
        </div>
      </div>
    </section>
  </BackgroundVideo>
  </div>
  )
}

export default About

