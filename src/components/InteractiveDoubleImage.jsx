import React, { useRef, useState } from 'react';

// Individual Interactive Double Image Component
function InteractiveDoubleImage({ projects, reversed = false }) {
  const firstImage = useRef(null);
  const secondImage = useRef(null);
  const [requestAnimationFrameId, setRequestAnimationFrameId] = useState(null);
  const [zoomedImage, setZoomedImage] = useState(null);
  
  let xPercent = reversed ? 100 : 0;
  let currentXPercent = reversed ? 100 : 0;
  const speed = 0.08;
  
  const manageMouseMove = (e) => {
    const { clientX } = e;
    xPercent = (clientX / window.innerWidth) * 100;
    
    if (!requestAnimationFrameId) {
      const id = window.requestAnimationFrame(animate);
      setRequestAnimationFrameId(id);
    }
  };
  
  const animate = () => {
    // Add easing to the animation
    const xPercentDelta = xPercent - currentXPercent;
    currentXPercent = currentXPercent + (xPercentDelta * speed);
    
    // Change width of images between 33.33% and 66.66% based on cursor
    const firstImagePercent = 66.66 - (currentXPercent * 0.33);
    const secondImagePercent = 33.33 + (currentXPercent * 0.33);
    
    if (firstImage.current && secondImage.current) {
      firstImage.current.style.width = `${firstImagePercent}%`;
      secondImage.current.style.width = `${secondImagePercent}%`;
    }
    
    if (Math.round(xPercent) === Math.round(currentXPercent)) {
      window.cancelAnimationFrame(requestAnimationFrameId);
      setRequestAnimationFrameId(null);
    } else {
      setRequestAnimationFrameId(window.requestAnimationFrame(animate));
    }
  };

  // Handle image click for zoom
  const handleImageClick = (project) => {
    setZoomedImage(project);
  };

  // Close zoom modal
  const closeZoom = () => {
    setZoomedImage(null);
  };

  return (
    <div 
      onMouseMove={manageMouseMove}
      className="flex mt-8 mb-8 cursor-pointer max-w-full"
    >
      {/* First Image Container */}
      <div 
        ref={firstImage}
        className={`relative transition-all duration-500 ease-out ${
          reversed ? 'w-1/3' : 'w-2/3'
        }`}
      >
        <div 
          className="relative w-full h-[450px] overflow-hidden rounded-lg bg-black/80 backdrop-blur-sm border border-white/10 shadow-2xl cursor-pointer group"
          onClick={() => handleImageClick(projects[0])}
        >
          <img
            src={projects[0].src}
            alt="project image"
            className="absolute inset-0 w-full h-full object-contain transition-all duration-700 ease-out hover:scale-105 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/20 backdrop-blur-sm rounded-full p-3">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
              </svg>
            </div>
          </div>
        </div>
        <div className="p-2.5 text-base">
          <h3 className="text-lg mb-1 mt-0 font-normal text-white">
            {projects[0].name}
          </h3>
          <p className="text-base m-0 text-gray-300">
            {projects[0].description}
          </p>
          <p className="text-base m-0 text-gray-500">
            {projects[0].year}
          </p>
        </div>
      </div>

      {/* Second Image Container */}
      <div 
        ref={secondImage}
        className={`relative transition-all duration-500 ease-out ${
          reversed ? 'w-2/3' : 'w-1/3'
        }`}
      >
        <div 
          className="relative w-full h-[450px] overflow-hidden rounded-lg bg-black/80 backdrop-blur-sm border border-white/10 shadow-2xl cursor-pointer group"
          onClick={() => handleImageClick(projects[1])}
        >
          <img
            src={projects[1].src}
            alt="project image"
            className="absolute inset-0 w-full h-full object-contain transition-all duration-700 ease-out hover:scale-105 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/20 backdrop-blur-sm rounded-full p-3">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
              </svg>
            </div>
          </div>
        </div>
        <div className="p-2.5 text-base">
          <h3 className="text-lg mb-1 mt-0 font-normal text-white">
            {projects[1].name}
          </h3>
          <p className="text-base m-0 text-gray-300">
            {projects[1].description}
          </p>
          <p className="text-base m-0 text-gray-500">
            {projects[1].year}
          </p>
        </div>
      </div>

      {/* Zoom Modal */}
      {zoomedImage && (
        <div 
          className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fadeIn"
          onClick={closeZoom}
        >
          <div className="relative max-w-7xl max-h-full w-full h-full flex items-center justify-center">
            {/* Close Button */}
            <button
              onClick={closeZoom}
              className="absolute top-4 right-4 z-10 bg-white/20 backdrop-blur-sm rounded-full p-3 hover:bg-white/30 transition-all duration-300 group"
            >
              <svg className="w-6 h-6 text-white group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Zoomed Image Container */}
            <div className="relative w-full h-full flex items-center justify-center animate-zoomIn">
              <img
                src={zoomedImage.src}
                alt={zoomedImage.name}
                className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              />
              
              {/* Image Info Overlay */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6 rounded-b-lg">
                <h3 className="text-2xl font-bold text-white mb-2">{zoomedImage.name}</h3>
                <p className="text-gray-300 mb-2">{zoomedImage.description}</p>
                <p className="text-gray-400 text-sm">{zoomedImage.year}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Main Gallery Component with Sample Data
export default function InteractiveGallery() {
  // Design project data using current local assets from Design folder
  const projectSets = [
    {
      projects: [
        {
          name: "Marketing Leaflet Design",
          description: "Professional marketing material with compelling design and clear information hierarchy for business promotion.",
          year: "2024",
          src: "/assets/Design/leaflets back 2.png"
        },
        {
          name: "Creative Digital Art",
          description: "Vibrant digital artwork showcasing creative expression with bold colors and artistic composition.",
          year: "2024",
          src: "/assets/Design/Picsart_25-08-01_18-45-06-717.jpg"
        }
      ],
      reversed: false
    },
    {
      projects: [
        {
          name: "Contemporary Art Design",
          description: "Modern contemporary artwork with innovative design elements and striking visual impact for artistic expression.",
          year: "2024",
          src: "/assets/Design/Picsart_25-08-01_19-26-51-716.jpg"
        },

        {
          name: "Artistic Photo Manipulation",
          description: "Creative photo editing and manipulation showcasing advanced digital art techniques and visual storytelling.",
          year: "2024",
          src: "/assets/Design/Picsart_25-08-01_18-59-24-841.jpg"
        }
      ],
      reversed: true
    },
    {
      projects: [
        {
          name: "Dynamic Visual Design",
          description: "Eye-catching visual design with dynamic elements and creative composition for impactful presentation.",
          year: "2024",
          src: "/assets/Design/Picsart_25-08-01_19-02-24-610.jpg"
        },
        {
          name: "Stylized Portrait Art",
          description: "Artistic portrait design with stylized effects and creative visual treatment for unique aesthetic appeal.",
          year: "2024",
          src: "/assets/Design/Picsart_25-08-01_19-18-53-045.jpg"
        }
      ],
      reversed: false
    },
    {
      projects: [
        {
          name: "Abstract Design Composition",
          description: "Modern abstract design with geometric elements and sophisticated color palette for contemporary appeal.",
          year: "2024",
          src: "/assets/Design/Picsart_25-08-01_18-52-30-877.png"
        },
        {
          name: "Professional Poster Design",
          description: "Clean and professional poster design with modern typography and strategic layout for effective communication.",
          year: "2024",
          src: "/assets/Design/Untitled-1 new.png"
        }
      ],
      reversed: true
    },
  ];

  return (
    <div className="min-h-screen bg-black p-8">
      {/* Animated Header */}
      <div className="text-center mb-20 relative overflow-hidden">
        {/* Background Animation */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-blue-600/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-1/2 left-1/4 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-blue-500/15 to-purple-500/15 rounded-full blur-2xl animate-bounce" style={{animationDuration: '3s'}}></div>
          <div className="absolute top-1/2 right-1/4 transform translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-gradient-to-r from-pink-500/15 to-blue-500/15 rounded-full blur-2xl animate-bounce" style={{animationDuration: '4s', animationDelay: '1s'}}></div>
        </div>
        
        {/* Main Title with Multiple Animations */}
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-black mb-6 tracking-wide relative">
          <span className="inline-block animate-fadeInUp">
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent animate-gradient-x bg-300% hover:scale-105 transition-transform duration-300">
              Selected
            </span>
          </span>
          <br />
          <span className="inline-block animate-fadeInUp" style={{animationDelay: '0.2s'}}>
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-gradient-x bg-300% hover:scale-105 transition-transform duration-300">
              Graphic Design
            </span>
          </span>
          <br />
          <span className="inline-block animate-fadeInUp" style={{animationDelay: '0.4s'}}>
            <span className="bg-gradient-to-r from-pink-400 via-blue-400 to-purple-400 bg-clip-text text-transparent animate-gradient-x bg-300% hover:scale-105 transition-transform duration-300">
              Projects
            </span>
          </span>
        </h1>
        
        {/* Animated Decorative Elements */}
        <div className="flex justify-center items-center space-x-4 mb-8">
          <div className="w-16 h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent animate-pulse"></div>
          <div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
          <div className="w-32 h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 animate-gradient-x bg-300%"></div>
          <div className="w-3 h-3 bg-gradient-to-r from-pink-500 to-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
          <div className="w-16 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent animate-pulse"></div>
        </div>
        
        {/* Floating Particles */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-purple-400 rounded-full animate-ping" style={{animationDelay: '1s'}}></div>
          <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-pink-400 rounded-full animate-ping" style={{animationDelay: '2s'}}></div>
          <div className="absolute top-1/2 left-3/4 w-1.5 h-1.5 bg-blue-400 rounded-full animate-ping" style={{animationDelay: '3s'}}></div>
        </div>
      </div>
      
      {/* Gallery Items */}
      {projectSets.map((set, index) => (
        <InteractiveDoubleImage 
          key={index}
          projects={set.projects} 
          reversed={set.reversed} 
        />
      ))}
      
      {/* Custom CSS for additional animations */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes gradient-x {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes zoomIn {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        .animate-fadeInUp {
          animation: fadeInUp 0.8s ease-out forwards;
          opacity: 0;
        }
        
        .animate-gradient-x {
          animation: gradient-x 3s ease infinite;
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }

        .animate-zoomIn {
          animation: zoomIn 0.4s ease-out forwards;
        }
        
        .bg-300% {
          background-size: 300% 300%;
        }
      `}</style>
    </div>
  );
}