import React, { useRef, useState, useEffect } from 'react';

// Individual Interactive Double Image Component
function InteractiveDoubleImage({ projects, reversed = false }) {
  const firstImage = useRef(null);
  const secondImage = useRef(null);
  const containerRef = useRef(null);
  const [zoomedImage, setZoomedImage] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [particles, setParticles] = useState([]);
  const [glowIntensity, setGlowIntensity] = useState(0);
  
  // Animation variables - using useRef to persist across renders
  const animationState = useRef({
    requestAnimationFrameId: null,
    xPercent: reversed ? 100 : 0,
    currentXPercent: reversed ? 100 : 0,
    speed: 0.18, // Slightly faster for more responsive feel
    glowAnimationId: null
  });
  
  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  // Initialize image widths and cleanup animation on unmount
  useEffect(() => {
    // Set initial widths based on reversed prop
    if (firstImage.current && secondImage.current && !isMobile) {
      const initialFirstPercent = reversed ? 33.33 : 66.66;
      const initialSecondPercent = reversed ? 66.66 : 33.33;
      firstImage.current.style.width = `${initialFirstPercent}%`;
      secondImage.current.style.width = `${initialSecondPercent}%`;
    }
    
    return () => {
      if (animationState.current.requestAnimationFrameId) {
        window.cancelAnimationFrame(animationState.current.requestAnimationFrameId);
      }
    };
  }, [reversed, isMobile]);
  
  // Generate stunning particle effects
  const generateParticles = (x, y) => {
    const newParticles = Array.from({ length: 15 }, (_, i) => ({
      id: Date.now() + i,
      x: x + (Math.random() - 0.5) * 100,
      y: y + (Math.random() - 0.5) * 100,
      vx: (Math.random() - 0.5) * 8,
      vy: (Math.random() - 0.5) * 8,
      life: 1,
      decay: 0.02 + Math.random() * 0.02,
      size: Math.random() * 4 + 2,
      color: ['#8B5CF6', '#EC4899', '#3B82F6', '#10B981', '#F59E0B'][Math.floor(Math.random() * 5)]
    }));
    
    setParticles(prev => [...prev.slice(-30), ...newParticles]);
  };

  const manageMouseMove = (e) => {
    // Disable mouse interaction on mobile
    if (isMobile) return;
    
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setMousePosition({ x, y });
      
      // Generate particles occasionally
      if (Math.random() < 0.1) {
        generateParticles(x, y);
      }
    }
    
    const { clientX } = e;
    animationState.current.xPercent = (clientX / window.innerWidth) * 100;
    
    if (!animationState.current.requestAnimationFrameId) {
      animationState.current.requestAnimationFrameId = window.requestAnimationFrame(animate);
    }
  };
  
  const animate = () => {
    // Add easing to the animation
    const xPercentDelta = animationState.current.xPercent - animationState.current.currentXPercent;
    animationState.current.currentXPercent = animationState.current.currentXPercent + (xPercentDelta * animationState.current.speed);
    
    // Change width of images between 33.33% and 66.66% based on cursor
    const firstImagePercent = 66.66 - (animationState.current.currentXPercent * 0.33);
    const secondImagePercent = 33.33 + (animationState.current.currentXPercent * 0.33);
    
    if (firstImage.current && secondImage.current && !isMobile) {
      // Apply width changes
      firstImage.current.style.width = `${firstImagePercent}%`;
      secondImage.current.style.width = `${secondImagePercent}%`;
      
      // Add dynamic 3D transforms based on mouse position
      const intensity = Math.abs(xPercentDelta) * 0.1;
      const rotateY = (animationState.current.currentXPercent - 50) * 0.1;
      const rotateX = intensity * 2;
      
      firstImage.current.style.transform = `perspective(1000px) rotateY(${rotateY}deg) rotateX(${rotateX}deg) translateZ(${intensity * 10}px)`;
      secondImage.current.style.transform = `perspective(1000px) rotateY(${-rotateY}deg) rotateX(${-rotateX}deg) translateZ(${intensity * 10}px)`;
      
      // Dynamic glow intensity
      setGlowIntensity(intensity * 5);
    }
    
    if (Math.round(animationState.current.xPercent) === Math.round(animationState.current.currentXPercent)) {
      window.cancelAnimationFrame(animationState.current.requestAnimationFrameId);
      animationState.current.requestAnimationFrameId = null;
    } else {
      animationState.current.requestAnimationFrameId = window.requestAnimationFrame(animate);
    }
  };

  // Particle animation system
  useEffect(() => {
    const animateParticles = () => {
      setParticles(prev => prev.map(particle => ({
        ...particle,
        x: particle.x + particle.vx,
        y: particle.y + particle.vy,
        life: particle.life - particle.decay,
        vx: particle.vx * 0.99,
        vy: particle.vy * 0.99
      })).filter(particle => particle.life > 0));
    };

    const interval = setInterval(animateParticles, 16);
    return () => clearInterval(interval);
  }, []);

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
      ref={containerRef}
      onMouseMove={manageMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      className="relative mt-4 mb-4 md:mt-8 md:mb-8 cursor-pointer max-w-full px-2 md:px-0 overflow-hidden"
      style={{
        background: isHovering && !isMobile ? 
          `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(139, 92, 246, 0.1) 0%, transparent 50%)` : 
          'transparent'
      }}
    >
      {/* Stunning Background Effects */}
      {!isMobile && (
        <>
          {/* Dynamic Gradient Overlay */}
          <div 
            className="absolute inset-0 pointer-events-none transition-opacity duration-500"
            style={{
              background: `conic-gradient(from ${mousePosition.x * 0.5}deg at ${mousePosition.x}px ${mousePosition.y}px, 
                rgba(139, 92, 246, 0.1) 0deg, 
                rgba(236, 72, 153, 0.1) 90deg, 
                rgba(59, 130, 246, 0.1) 180deg, 
                rgba(16, 185, 129, 0.1) 270deg, 
                rgba(139, 92, 246, 0.1) 360deg)`,
              opacity: isHovering ? 0.6 : 0
            }}
          />
          
          {/* Animated Border Glow */}
          <div 
            className="absolute inset-0 rounded-2xl pointer-events-none transition-all duration-300"
            style={{
              boxShadow: isHovering ? 
                `0 0 ${20 + glowIntensity * 10}px rgba(139, 92, 246, ${0.3 + glowIntensity * 0.1}), 
                 0 0 ${40 + glowIntensity * 20}px rgba(236, 72, 153, ${0.2 + glowIntensity * 0.05}),
                 inset 0 0 ${10 + glowIntensity * 5}px rgba(255, 255, 255, 0.1)` : 
                'none'
            }}
          />
          
          {/* Particle System */}
          <div className="absolute inset-0 pointer-events-none">
            {particles.map(particle => (
              <div
                key={particle.id}
                className="absolute rounded-full blur-sm"
                style={{
                  left: particle.x,
                  top: particle.y,
                  width: particle.size,
                  height: particle.size,
                  backgroundColor: particle.color,
                  opacity: particle.life,
                  transform: `scale(${particle.life})`,
                  boxShadow: `0 0 ${particle.size * 2}px ${particle.color}`
                }}
              />
            ))}
          </div>
          
          {/* Floating Energy Orbs */}
          {isHovering && Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full animate-pulse pointer-events-none"
              style={{
                left: `${20 + i * 15}%`,
                top: `${30 + Math.sin(Date.now() * 0.001 + i) * 20}%`,
                width: `${8 + Math.sin(Date.now() * 0.002 + i) * 4}px`,
                height: `${8 + Math.sin(Date.now() * 0.002 + i) * 4}px`,
                background: `radial-gradient(circle, ${['#8B5CF6', '#EC4899', '#3B82F6', '#10B981', '#F59E0B'][i]} 0%, transparent 70%)`,
                animation: `float-${i} ${3 + i * 0.5}s ease-in-out infinite`,
                opacity: 0.7
              }}
            />
          ))}
          
          {/* Cinematic Light Rays */}
          <div 
            className="absolute inset-0 pointer-events-none opacity-30"
            style={{
              background: `linear-gradient(${mousePosition.x * 0.2}deg, 
                transparent 0%, 
                rgba(139, 92, 246, 0.1) 20%, 
                transparent 40%, 
                rgba(236, 72, 153, 0.1) 60%, 
                transparent 80%, 
                rgba(59, 130, 246, 0.1) 100%)`,
              transform: `rotate(${mousePosition.x * 0.1}deg)`,
              transition: 'all 0.3s ease-out'
            }}
          />
        </>
      )}
      {/* Desktop Layout - Side by side */}
      <div className={`hidden md:flex relative z-10 ${isMobile ? 'flex-col space-y-4' : ''}`}>
        {/* First Image Container */}
        <div 
          ref={firstImage}
          className={`relative ${
            reversed ? 'w-1/3' : 'w-2/3'
          }`}
          style={{
            transformStyle: 'preserve-3d',
            transition: 'transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
          }}
        >
          <div 
            className="relative w-full h-[400px] lg:h-[450px] overflow-hidden rounded-2xl cursor-pointer group"
            onClick={() => handleImageClick(projects[0])}
            style={{
              background: 'linear-gradient(135deg, rgba(0,0,0,0.9) 0%, rgba(20,20,40,0.9) 100%)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.1)',
              boxShadow: `
                0 25px 50px -12px rgba(0, 0, 0, 0.8),
                0 0 0 1px rgba(255, 255, 255, 0.05),
                inset 0 1px 0 rgba(255, 255, 255, 0.1)
              `
            }}
          >
            {/* Holographic Border Effect */}
            <div 
              className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-700 pointer-events-none"
              style={{
                background: `linear-gradient(45deg, 
                  transparent 30%, 
                  rgba(139, 92, 246, 0.4) 35%, 
                  rgba(236, 72, 153, 0.4) 50%, 
                  rgba(59, 130, 246, 0.4) 65%, 
                  transparent 70%)`,
                backgroundSize: '200% 200%',
                animation: 'shimmer 2s linear infinite'
              }}
            />
            
            {/* Main Image with Advanced Effects */}
            <img
              src={projects[0].src}
              alt="project image"
              className="absolute inset-0 w-full h-full object-contain transition-all duration-1000 ease-out group-hover:scale-110"
              style={{
                filter: 'contrast(1.1) saturate(1.2) brightness(1.05)',
                transition: 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
              }}
            />
            
            {/* Dynamic Overlay Effects */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />
            
            {/* Floating Action Button */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-700">
              <div 
                className="bg-white/10 backdrop-blur-xl rounded-full p-4 transform scale-75 group-hover:scale-100 transition-all duration-500 border border-white/20"
                style={{
                  boxShadow: '0 8px 32px rgba(139, 92, 246, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
                }}
              >
                <svg className="w-8 h-8 text-white drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                </svg>
              </div>
            </div>
            
            {/* Corner Accent Lights */}
            <div className="absolute top-2 left-2 w-3 h-3 bg-purple-400 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 blur-sm" />
            <div className="absolute top-2 right-2 w-2 h-2 bg-pink-400 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-700 blur-sm" />
            <div className="absolute bottom-2 left-2 w-2 h-2 bg-blue-400 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-600 blur-sm" />
            <div className="absolute bottom-2 right-2 w-3 h-3 bg-green-400 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-800 blur-sm" />
          </div>
          
          {/* Enhanced Text Section */}
          <div className="p-4 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 to-pink-900/20 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-500" />
            <h3 className="text-xl mb-2 mt-0 font-bold text-white transition-all duration-500 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-purple-400 hover:to-pink-400 relative z-10">
              {projects[0].name}
            </h3>
            <p className="text-base m-0 text-gray-300 leading-relaxed relative z-10 transition-colors duration-300 hover:text-gray-200">
              {projects[0].description}
            </p>
            <p className="text-sm m-0 text-purple-400 mt-2 font-semibold relative z-10">
              {projects[0].year}
            </p>
          </div>
        </div>

        {/* Second Image Container */}
        <div 
          ref={secondImage}
          className={`relative ${
            reversed ? 'w-2/3' : 'w-1/3'
          }`}
          style={{
            transformStyle: 'preserve-3d',
            transition: 'transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
          }}
        >
          <div 
            className="relative w-full h-[400px] lg:h-[450px] overflow-hidden rounded-2xl cursor-pointer group"
            onClick={() => handleImageClick(projects[1])}
            style={{
              background: 'linear-gradient(135deg, rgba(0,0,0,0.9) 0%, rgba(20,20,40,0.9) 100%)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.1)',
              boxShadow: `
                0 25px 50px -12px rgba(0, 0, 0, 0.8),
                0 0 0 1px rgba(255, 255, 255, 0.05),
                inset 0 1px 0 rgba(255, 255, 255, 0.1)
              `
            }}
          >
            {/* Holographic Border Effect */}
            <div 
              className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-700 pointer-events-none"
              style={{
                background: `linear-gradient(225deg, 
                  transparent 30%, 
                  rgba(236, 72, 153, 0.4) 35%, 
                  rgba(59, 130, 246, 0.4) 50%, 
                  rgba(16, 185, 129, 0.4) 65%, 
                  transparent 70%)`,
                backgroundSize: '200% 200%',
                animation: 'shimmer 2.5s linear infinite reverse'
              }}
            />
            
            {/* Main Image with Advanced Effects */}
            <img
              src={projects[1].src}
              alt="project image"
              className="absolute inset-0 w-full h-full object-contain transition-all duration-1000 ease-out group-hover:scale-110"
              style={{
                filter: 'contrast(1.1) saturate(1.2) brightness(1.05)',
                transition: 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
              }}
            />
            
            {/* Dynamic Overlay Effects */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />
            
            {/* Floating Action Button */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-700">
              <div 
                className="bg-white/10 backdrop-blur-xl rounded-full p-4 transform scale-75 group-hover:scale-100 transition-all duration-500 border border-white/20"
                style={{
                  boxShadow: '0 8px 32px rgba(236, 72, 153, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
                }}
              >
                <svg className="w-8 h-8 text-white drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                </svg>
              </div>
            </div>
            
            {/* Corner Accent Lights */}
            <div className="absolute top-2 left-2 w-2 h-2 bg-pink-400 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-600 blur-sm" />
            <div className="absolute top-2 right-2 w-3 h-3 bg-blue-400 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 blur-sm" />
            <div className="absolute bottom-2 left-2 w-3 h-3 bg-green-400 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-700 blur-sm" />
            <div className="absolute bottom-2 right-2 w-2 h-2 bg-yellow-400 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-800 blur-sm" />
          </div>
          
          {/* Enhanced Text Section */}
          <div className="p-4 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-pink-900/20 to-blue-900/20 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-500" />
            <h3 className="text-xl mb-2 mt-0 font-bold text-white transition-all duration-500 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-pink-400 hover:to-blue-400 relative z-10">
              {projects[1].name}
            </h3>
            <p className="text-base m-0 text-gray-300 leading-relaxed relative z-10 transition-colors duration-300 hover:text-gray-200">
              {projects[1].description}
            </p>
            <p className="text-sm m-0 text-pink-400 mt-2 font-semibold relative z-10">
              {projects[1].year}
            </p>
          </div>
        </div>
      </div>

      {/* Mobile Layout - Column wise, full width */}
      <div className="flex flex-col space-y-6 md:hidden">
        {/* First Image Container - Full Width */}
        <div className="relative w-full transform transition-all duration-500 hover:scale-[1.02] animate-fadeInUp">
          <div 
            className="relative w-full h-[280px] sm:h-[320px] overflow-hidden rounded-lg bg-black/80 backdrop-blur-sm border border-white/10 shadow-2xl cursor-pointer group hover:shadow-purple-500/20 hover:border-purple-500/30"
            onClick={() => handleImageClick(projects[0])}
          >
            <img
              src={projects[0].src}
              alt="project image"
              className="absolute inset-0 w-full h-full object-contain transition-all duration-500 group-active:scale-95 group-hover:brightness-110"
            />
            <div className="absolute inset-0 bg-black/0 group-active:bg-black/10 transition-all duration-300 flex items-center justify-center">
              <div className="opacity-0 group-active:opacity-100 transition-all duration-300 bg-white/20 backdrop-blur-sm rounded-full p-3 transform group-active:scale-110">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                </svg>
              </div>
            </div>
            
            {/* Subtle gradient overlay for better text readability */}
            <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/60 to-transparent pointer-events-none"></div>
          </div>
          <div className="p-3 text-sm">
            <h3 className="text-lg mb-2 mt-0 font-medium text-white transition-colors duration-300 hover:text-purple-300">
              {projects[0].name}
            </h3>
            <p className="text-sm m-0 text-gray-300 line-clamp-3 leading-relaxed">
              {projects[0].description}
            </p>
            <p className="text-sm m-0 text-gray-500 mt-2 font-medium">
              {projects[0].year}
            </p>
          </div>
        </div>

        {/* Second Image Container - Full Width */}
        <div className="relative w-full transform transition-all duration-500 hover:scale-[1.02] animate-fadeInUp" style={{animationDelay: '0.2s'}}>
          <div 
            className="relative w-full h-[280px] sm:h-[320px] overflow-hidden rounded-lg bg-black/80 backdrop-blur-sm border border-white/10 shadow-2xl cursor-pointer group hover:shadow-purple-500/20 hover:border-purple-500/30"
            onClick={() => handleImageClick(projects[1])}
          >
            <img
              src={projects[1].src}
              alt="project image"
              className="absolute inset-0 w-full h-full object-contain transition-all duration-500 group-active:scale-95 group-hover:brightness-110"
            />
            <div className="absolute inset-0 bg-black/0 group-active:bg-black/10 transition-all duration-300 flex items-center justify-center">
              <div className="opacity-0 group-active:opacity-100 transition-all duration-300 bg-white/20 backdrop-blur-sm rounded-full p-3 transform group-active:scale-110">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                </svg>
              </div>
            </div>
            
            {/* Subtle gradient overlay for better text readability */}
            <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/60 to-transparent pointer-events-none"></div>
          </div>
          <div className="p-3 text-sm">
            <h3 className="text-lg mb-2 mt-0 font-medium text-white transition-colors duration-300 hover:text-purple-300">
              {projects[1].name}
            </h3>
            <p className="text-sm m-0 text-gray-300 line-clamp-3 leading-relaxed">
              {projects[1].description}
            </p>
            <p className="text-sm m-0 text-gray-500 mt-2 font-medium">
              {projects[1].year}
            </p>
          </div>
        </div>
      </div>

      {/* Epic Zoom Modal */}
      {zoomedImage && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-2 md:p-4 animate-fadeIn"
          onClick={closeZoom}
          style={{
            background: `radial-gradient(circle at center, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.98) 100%)`,
            backdropFilter: 'blur(20px)'
          }}
        >
          {/* Cosmic Background Effects */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {/* Rotating Cosmic Ring */}
            <div 
              className="absolute top-1/2 left-1/2 w-96 h-96 border border-purple-500/20 rounded-full"
              style={{
                transform: 'translate(-50%, -50%)',
                animation: 'cosmic-rotation 30s linear infinite'
              }}
            />
            <div 
              className="absolute top-1/2 left-1/2 w-80 h-80 border border-pink-500/15 rounded-full"
              style={{
                transform: 'translate(-50%, -50%)',
                animation: 'cosmic-rotation 25s linear infinite reverse'
              }}
            />
            
            {/* Floating Particles */}
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 rounded-full opacity-40"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  background: ['#8B5CF6', '#EC4899', '#3B82F6', '#10B981'][Math.floor(Math.random() * 4)],
                  animation: `float-particle ${8 + Math.random() * 4}s ease-in-out infinite`,
                  animationDelay: `${Math.random() * 3}s`
                }}
              />
            ))}
          </div>

          <div className="relative max-w-7xl max-h-full w-full h-full flex items-center justify-center">
            {/* Enhanced Close Button */}
            <button
              onClick={closeZoom}
              className="absolute top-2 right-2 md:top-4 md:right-4 z-10 glass-effect rounded-full p-2 md:p-3 hover:bg-white/30 transition-all duration-500 group transform hover:scale-110 hover:rotate-90"
              style={{
                boxShadow: '0 8px 32px rgba(139, 92, 246, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
              }}
            >
              <svg className="w-5 h-5 md:w-6 md:h-6 text-white transition-all duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Cinematic Image Container */}
            <div className="relative w-full h-full flex items-center justify-center animate-zoomIn">
              <div 
                className="relative max-w-full max-h-full rounded-2xl overflow-hidden"
                style={{
                  boxShadow: `
                    0 25px 50px -12px rgba(0, 0, 0, 0.8),
                    0 0 100px rgba(139, 92, 246, 0.3),
                    0 0 200px rgba(236, 72, 153, 0.2),
                    inset 0 1px 0 rgba(255, 255, 255, 0.1)
                  `
                }}
              >
                {/* Holographic Border */}
                <div 
                  className="absolute inset-0 rounded-2xl pointer-events-none"
                  style={{
                    background: `linear-gradient(45deg, 
                      transparent 30%, 
                      rgba(139, 92, 246, 0.3) 35%, 
                      rgba(236, 72, 153, 0.3) 50%, 
                      rgba(59, 130, 246, 0.3) 65%, 
                      transparent 70%)`,
                    backgroundSize: '200% 200%',
                    animation: 'shimmer 3s linear infinite'
                  }}
                />
                
                <img
                  src={zoomedImage.src}
                  alt={zoomedImage.name}
                  className="max-w-full max-h-full object-contain transition-all duration-700"
                  onClick={(e) => e.stopPropagation()}
                  style={{
                    filter: 'contrast(1.1) saturate(1.2) brightness(1.05) drop-shadow(0 20px 40px rgba(0,0,0,0.5))'
                  }}
                />
              </div>
              
              {/* Enhanced Info Overlay */}
              <div 
                className="absolute bottom-0 left-0 right-0 p-4 md:p-8 rounded-b-2xl"
                style={{
                  background: `linear-gradient(to top, 
                    rgba(0,0,0,0.95) 0%, 
                    rgba(0,0,0,0.8) 50%, 
                    transparent 100%)`,
                  backdropFilter: 'blur(10px)'
                }}
              >
                <h3 className="text-xl md:text-3xl font-bold mb-2 md:mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                  {zoomedImage.name}
                </h3>
                <p className="text-sm md:text-lg text-gray-300 mb-2 md:mb-4 leading-relaxed line-clamp-3 md:line-clamp-none">
                  {zoomedImage.description}
                </p>
                <p className="text-xs md:text-base text-purple-400 font-semibold">
                  {zoomedImage.year}
                </p>
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
    <div className="min-h-screen bg-black p-2 md:p-4 lg:p-8">
      {/* Cinematic Header */}
      <div className="text-center mb-10 md:mb-16 lg:mb-20 relative overflow-hidden">
        {/* Epic Background Animation */}
        <div className="absolute inset-0 -z-10">
          {/* Main Cosmic Orb */}
          <div 
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 md:w-96 md:h-96 lg:w-[500px] lg:h-[500px] rounded-full blur-3xl opacity-60"
            style={{
              background: `conic-gradient(from 0deg, 
                #8B5CF6 0deg, 
                #EC4899 72deg, 
                #3B82F6 144deg, 
                #10B981 216deg, 
                #F59E0B 288deg, 
                #8B5CF6 360deg)`,
              animation: 'cosmic-rotation 20s linear infinite'
            }}
          />
          
          {/* Orbiting Energy Spheres */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="absolute w-4 h-4 md:w-6 md:h-6 rounded-full blur-sm"
                style={{
                  background: `radial-gradient(circle, ${['#8B5CF6', '#EC4899', '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#06B6D4', '#84CC16'][i]} 0%, transparent 70%)`,
                  left: `${150 + Math.cos(i * 45 * Math.PI / 180) * 120}px`,
                  top: `${150 + Math.sin(i * 45 * Math.PI / 180) * 120}px`,
                  animation: `orbit-${i} ${8 + i * 0.5}s linear infinite`,
                  animationDelay: `${i * 0.2}s`
                }}
              />
            ))}
          </div>
          
          {/* Pulsating Rings */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="absolute border rounded-full opacity-20"
                style={{
                  width: `${200 + i * 100}px`,
                  height: `${200 + i * 100}px`,
                  left: `${-100 - i * 50}px`,
                  top: `${-100 - i * 50}px`,
                  borderColor: ['#8B5CF6', '#EC4899', '#3B82F6'][i],
                  borderWidth: '2px',
                  animation: `pulse-ring ${3 + i}s ease-in-out infinite`,
                  animationDelay: `${i * 0.5}s`
                }}
              />
            ))}
          </div>
          
          {/* Floating Particles */}
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 md:w-2 md:h-2 rounded-full opacity-40"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                background: ['#8B5CF6', '#EC4899', '#3B82F6', '#10B981', '#F59E0B'][Math.floor(Math.random() * 5)],
                animation: `float-particle ${5 + Math.random() * 10}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 5}s`
              }}
            />
          ))}
        </div>
        
        {/* Main Title with Multiple Animations */}
        <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl xl:text-7xl font-black mb-4 md:mb-6 tracking-wide relative px-2">
          <span className="inline-block animate-fadeInUp">
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent animate-gradient-x bg-300% hover:scale-105 transition-transform duration-500">
              Selected
            </span>
          </span>
          <br />
          <span className="inline-block animate-fadeInUp" style={{animationDelay: '0.2s'}}>
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-gradient-x bg-300% hover:scale-105 transition-transform duration-500">
              Graphic Design
            </span>
          </span>
          <br />
          <span className="inline-block animate-fadeInUp" style={{animationDelay: '0.4s'}}>
            <span className="bg-gradient-to-r from-pink-400 via-blue-400 to-purple-400 bg-clip-text text-transparent animate-gradient-x bg-300% hover:scale-105 transition-transform duration-500">
              Projects
            </span>
          </span>
        </h1>
        
        {/* Animated Decorative Elements */}
        <div className="flex justify-center items-center space-x-2 md:space-x-4 mb-6 md:mb-8 px-4">
          <div className="w-8 md:w-12 lg:w-16 h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent animate-pulse"></div>
          <div className="w-2 h-2 md:w-3 md:h-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
          <div className="w-16 md:w-24 lg:w-32 h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 animate-gradient-x bg-300%"></div>
          <div className="w-2 h-2 md:w-3 md:h-3 bg-gradient-to-r from-pink-500 to-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
          <div className="w-8 md:w-12 lg:w-16 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent animate-pulse"></div>
        </div>
        
        {/* Floating Particles */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-purple-400 rounded-full animate-ping" style={{animationDelay: '1s'}}></div>
          <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-pink-400 rounded-full animate-ping" style={{animationDelay: '2s'}}></div>
          <div className="absolute top-1/2 left-3/4 w-1.5 h-1.5 bg-blue-400 rounded-full animate-ping" style={{animationDelay: '3s'}}></div>
        </div>
      </div>
      
      {/* Gallery Items */}
      <div className="space-y-8 md:space-y-12 lg:space-y-16">
        {projectSets.map((set, index) => (
          <div key={index} className="animate-fadeInUp" style={{animationDelay: `${index * 0.2}s`}}>
            <InteractiveDoubleImage 
              projects={set.projects} 
              reversed={set.reversed} 
            />
          </div>
        ))}
      </div>
      
      {/* Epic CSS Animations */}
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
            transform: scale(1);
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

        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }

        @keyframes cosmic-rotation {
          0% {
            transform: translate(-50%, -50%) rotate(0deg) scale(1);
          }
          50% {
            transform: translate(-50%, -50%) rotate(180deg) scale(1.1);
          }
          100% {
            transform: translate(-50%, -50%) rotate(360deg) scale(1);
          }
        }

        @keyframes pulse-ring {
          0%, 100% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 0.2;
          }
          50% {
            transform: translate(-50%, -50%) scale(1.1);
            opacity: 0.4;
          }
        }

        @keyframes float-particle {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
            opacity: 0.4;
          }
          50% {
            transform: translateY(-20px) rotate(180deg);
            opacity: 0.8;
          }
        }

        ${Array.from({ length: 8 }, (_, i) => `
          @keyframes orbit-${i} {
            0% {
              transform: translate(-50%, -50%) rotate(0deg) translateX(120px) rotate(0deg);
            }
            100% {
              transform: translate(-50%, -50%) rotate(360deg) translateX(120px) rotate(-360deg);
            }
          }
        `).join('')}

        ${Array.from({ length: 5 }, (_, i) => `
          @keyframes float-${i} {
            0%, 100% {
              transform: translateY(0px) rotate(0deg) scale(1);
            }
            33% {
              transform: translateY(-${10 + i * 5}px) rotate(120deg) scale(1.1);
            }
            66% {
              transform: translateY(${5 + i * 3}px) rotate(240deg) scale(0.9);
            }
          }
        `).join('')}
        
        .animate-fadeInUp {
          animation: fadeInUp 0.8s ease-out forwards;
          opacity: 0;
        }
        
        .animate-gradient-x {
          animation: gradient-x 3s ease infinite;
        }

        .animate-fadeIn {
          animation: fadeIn 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }

        .animate-zoomIn {
          animation: zoomIn 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }
        
        .bg-300% {
          background-size: 300% 300%;
        }
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        /* Advanced hover effects */
        .group:hover {
          transform: translateY(-2px);
        }

        .group:hover img {
          filter: contrast(1.2) saturate(1.3) brightness(1.1) drop-shadow(0 10px 20px rgba(0,0,0,0.3));
        }
        
        @media (max-width: 768px) {
          .animate-fadeInUp {
            animation-duration: 0.6s;
          }
          
          .animate-gradient-x {
            animation-duration: 2s;
          }
          
          /* Optimize mobile performance */
          * {
            -webkit-tap-highlight-color: transparent;
          }
          
          .group:active {
            transform: scale(0.98);
          }

          /* Reduce complex animations on mobile */
          @keyframes cosmic-rotation {
            0% { transform: translate(-50%, -50%) rotate(0deg); }
            100% { transform: translate(-50%, -50%) rotate(360deg); }
          }
        }
        
        /* Smooth scrolling for better mobile experience */
        @media (max-width: 768px) {
          html {
            scroll-behavior: smooth;
          }
        }

        /* Glass morphism effects */
        .glass-effect {
          backdrop-filter: blur(20px);
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </div>
  );
}