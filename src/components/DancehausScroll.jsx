import React, { useEffect, useRef, useState } from 'react';

const PhoenixScrollSection = () => {
  const sectionRef = useRef(null);
  const pathRef = useRef(null);
  const videoRef = useRef(null);
  const imageRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showVideo, setShowVideo] = useState(false);
  const [particles, setParticles] = useState([]);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [sectionInView, setSectionInView] = useState(true);

  // Create particles
  useEffect(() => {
    const newParticles = Array.from({ length: 80 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      delay: Math.random() * 2,
      speed: Math.random() * 0.5 + 0.2,
    }));
    setParticles(newParticles);
  }, []);

  // ===== VIDEO OPTIMIZATION START =====
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Force preload and buffer the video
    video.preload = "auto";
    video.muted = true;
    video.playsInline = true;
    video.loop = true;
    
    // Create source element for better loading control
    const source = document.createElement('source');
    source.src = "/assets/video10.mp4";
    source.type = "video/mp4";
    video.appendChild(source);
    video.load();

    const handleCanPlay = () => {
      setIsVideoLoaded(true);
      // Warm up the video decoder by playing/pausing
      video.play()
        .then(() => {
          video.pause();
          video.currentTime = 0;
        })
        .catch(e => console.log("Video warmup:", e));
    };

    video.addEventListener('canplaythrough', handleCanPlay);

    return () => {
      video.removeEventListener('canplaythrough', handleCanPlay);
      video.pause();
      video.currentTime = 0;
    };
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !isVideoLoaded) return;

    if (showVideo) {
      // Ensure smooth playback start
      video.currentTime = 0;
      const playPromise = video.play();
      
      if (playPromise !== undefined) {
        playPromise.catch(e => {
          console.log("Playback failed, trying muted:", e);
          video.muted = true;
          video.play().catch(e => console.log("Muted playback failed:", e));
        });
      }
    } else {
      // Reset video when not showing
      video.pause();
      video.currentTime = 0;
    }
  }, [showVideo, isVideoLoaded]);
  // ===== VIDEO OPTIMIZATION END =====

  // Function to close video
  const closeVideo = () => {
    setShowVideo(false);
    const video = videoRef.current;
    if (video) {
      video.pause();
      video.currentTime = 0;
    }
  };

  // Handle scroll
  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const scrollStart = window.innerHeight * 0.2;
      const scrollEnd = window.innerHeight * 0.8;
      const progress = Math.max(0, Math.min(1, (scrollStart - rect.top) / (scrollEnd - scrollStart)));

      setScrollProgress(progress);
      const isInView = rect.bottom > 0 && rect.top < window.innerHeight;
      setSectionInView(isInView);

      const shouldShowVideo = progress >= 0.95 && isInView;
      if (shouldShowVideo && !showVideo) {
        setShowVideo(true);
      } else if (showVideo && (!isInView || progress < 0.9)) {
        closeVideo();
      }
    };

    const onScroll = () => requestAnimationFrame(handleScroll);
    window.addEventListener('scroll', onScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', onScroll);
  }, [showVideo, sectionInView]);

  // Animate SVG path
  useEffect(() => {
    if (!pathRef.current) return;
    const path = pathRef.current;
    const pathLength = path.getTotalLength();
    const offset = pathLength * (1 - scrollProgress);
    const hue = Math.floor(scrollProgress * 300 + 260);
    const saturation = 80 + scrollProgress * 20;
    const lightness = 50 + scrollProgress * 20;

    path.style.strokeDasharray = `${pathLength}`;
    path.style.strokeDashoffset = `${offset}`;
    path.style.stroke = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    path.style.strokeWidth = `${8 + scrollProgress * 4}`;
    path.style.filter = `
      drop-shadow(0 0 8px hsla(${hue}, 100%, 60%, 0.8))
      drop-shadow(0 0 16px hsla(${hue}, 100%, 50%, 0.6))
      drop-shadow(0 0 32px hsla(${hue}, 100%, 40%, 0.4))
    `;
  }, [scrollProgress]);

  const galaxyImage = "/assets/galaxy.jpg";

  return (
    <>
      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-20px) rotate(180deg); }
          }
          
          @keyframes pulse {
            0%, 100% { opacity: 0.4; transform: scale(1); }
            50% { opacity: 1; transform: scale(1.1); }
          }
          
          @keyframes shimmer {
            0% { background-position: -200% 0; }
            100% { background-position: 200% 0; }
          }
          
          @keyframes fadeInScale {
            0% { opacity: 0; transform: scale(0.8) translateY(30px); }
            100% { opacity: 1; transform: scale(1) translateY(0); }
          }
          
          @keyframes slideInLeft {
            0% { opacity: 0; transform: translateX(-50px); }
            100% { opacity: 1; transform: translateX(0); }
          }
          
          @keyframes slideInRight {
            0% { opacity: 0; transform: translateX(50px); }
            100% { opacity: 1; transform: translateX(0); }
          }
          
          @keyframes gradientShift {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          
          @keyframes fadeOut {
            0% { opacity: 1; transform: scale(1); }
            100% { opacity: 0; transform: scale(0.9); }
          }
          
          .floating-particle {
            position: absolute;
            width: 4px;
            height: 4px;
            background: radial-gradient(circle, rgba(255,255,255,0.8) 0%, transparent 70%);
            border-radius: 50%;
            animation: float var(--duration) ease-in-out infinite;
            animation-delay: var(--delay);
            opacity: 0.6;
          }
          
          .shimmer-text {
            background: linear-gradient(
              90deg,
              #ffffff 0%,
              #a855f7 25%,
              #06b6d4 50%,
              #a855f7 75%,
              #ffffff 100%
            );
            background-size: 200% 100%;
            -webkit-background-clip: text;
            background-clip: text;
            -webkit-text-fill-color: transparent;
            animation: shimmer 3s ease-in-out infinite;
          }
          
          .gradient-text {
            background: linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4, #feca57);
            background-size: 300% 300%;
            -webkit-background-clip: text;
            background-clip: text;
            -webkit-text-fill-color: transparent;
            animation: gradientShift 4s ease infinite;
          }
          
          .glow-border {
            box-shadow: 
              0 0 20px rgba(168, 85, 247, 0.5),
              0 0 40px rgba(168, 85, 247, 0.3),
              0 0 60px rgba(168, 85, 247, 0.1);
          }
          
          .image-container {
            transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
            transform-style: preserve-3d;
          }
          
          .video-overlay {
            backdrop-filter: blur(20px);
            background: rgba(0, 0, 0, 0.3);
          }
          
          .video-exit {
            animation: fadeOut 0.5s ease-out forwards;
          }
        `}
      </style>

      <section
        ref={sectionRef}
        className="relative bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 text-white min-h-screen w-full flex items-center justify-center overflow-hidden"
        style={{ height: '150vh' }}
      >
        {/* Full Screen Violet Overlay when video shows */}
        {showVideo && (
          <div 
            className="fixed inset-0 z-40"
            style={{ 
              background: 'linear-gradient(135deg, rgba(139, 69, 193, 0.95) 0%, rgba(67, 56, 202, 0.95) 50%, rgba(79, 70, 229, 0.95) 100%)',
              animation: 'fadeInScale 0.5s ease-out'
            }}
          />
        )}
        
        {/* Floating Particles Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {particles.map(particle => (
            <div
              key={particle.id}
              className="floating-particle"
              style={{
                left: `${particle.x}%`,
                top: `${particle.y}%`,
                '--duration': `${4 + particle.speed * 6}s`,
                '--delay': `${particle.delay}s`,
              }}
            />
          ))}
        </div>

        {/* Animated SVG Path */}
        <svg
          className="absolute top-0 left-0 w-full h-full pointer-events-none"
          viewBox="0 0 1200 800"
          fill="none"
          preserveAspectRatio="xMidYMid slice"
          style={{ zIndex: 20 }}
        >
          <path
            ref={pathRef}
            d="M80 200 C150 120, 250 120, 320 200 C350 230, 380 260, 420 280 C480 310, 540 320, 600 300 C680 270, 720 240, 780 260 C840 280, 880 320, 920 360 C950 390, 980 420, 1000 450 C1020 480, 1040 510, 1050 550 C1060 590, 1050 630, 1020 660 C990 690, 950 700, 900 690 C850 680, 800 660, 760 630 C720 600, 690 570, 650 540 C610 510, 570 480, 520 460 C470 440, 420 430, 370 440 C320 450, 280 470, 250 500 C220 530, 200 570, 190 610"
            stroke="#a855f7"
            strokeWidth="10"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        {/* Video Fullscreen Overlay */}
        {showVideo && (
          <div 
            className="fixed inset-0 z-50"
            style={{ 
              animation: 'fadeInScale 0.8s ease-out',
              backgroundColor: 'rgba(0, 0, 0, 0.95)'
            }}
          >
            {!isVideoLoaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70">
                <div className="text-white text-lg">Loading video...</div>
              </div>
            )}
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              muted
              playsInline
              loop
              autoPlay
              disablePictureInPicture
              disableRemotePlayback
            >
              <source src="/assets/video10.mp4" type="video/mp4" />
            </video>
            
            {/* Close Button */}
            <button
              onClick={closeVideo}
              className="absolute top-6 right-6 w-12 h-12 bg-black bg-opacity-50 hover:bg-opacity-80 rounded-full flex items-center justify-center text-white text-2xl font-light transition-all duration-300 backdrop-blur-sm border border-white border-opacity-20 hover:border-opacity-40 hover:scale-110"
              style={{ animation: 'fadeInScale 1s ease-out 0.3s both' }}
            >
              ×
            </button>
            
            {/* Additional instruction text */}
            <div 
              className="absolute bottom-6 left-1/2 transform -translate-x-1/2 text-white text-sm opacity-70"
              style={{ animation: 'fadeInScale 1s ease-out 0.5s both' }}
            >
              Scroll to next section or click × to close
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="relative z-30 w-full max-w-6xl mx-auto px-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            
            {/* Image Section */}
            <div className="flex-1 flex justify-center lg:justify-start">
              <div className="relative">
                <div 
                  className="image-container"
                  style={{
                    transform: showVideo ? 'scale(0.95) rotateY(10deg)' : 'scale(1)',
                    opacity: showVideo ? 0.3 : 1,
                  }}
                >
                  <img
                    ref={imageRef}
                    src={galaxyImage}
                    alt="Galaxy"
                    className="w-96 h-80 rounded-2xl object-cover shadow-2xl"
                    style={{
                      filter: showVideo ? 'blur(5px)' : 'blur(0px)',
                    }}
                  />
                  
                  {/* Subtle glow effect */}
                  <div 
                    className="absolute inset-0 rounded-2xl"
                    style={{
                      background: `linear-gradient(45deg, 
                        rgba(168, 85, 247, ${scrollProgress * 0.2}) 0%, 
                        rgba(6, 182, 212, ${scrollProgress * 0.2}) 100%)`,
                      opacity: scrollProgress,
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Text Content */}
            <div className="flex-1 space-y-8 lg:pl-12">
              <h1
                className={`text-6xl font-light transition-all duration-1000 ${
                  showVideo ? 'gradient-text' : 'shimmer-text'
                }`}
                style={{
                  transform: showVideo ? 'translateY(-5px)' : 'translateY(0)',
                  animation: showVideo ? 'slideInRight 0.8s ease-out' : 'none',
                }}
              >
                About Me
              </h1>
              
              <div className="space-y-6 text-lg text-gray-300 leading-relaxed">
                <p 
                  style={{ 
                    opacity: showVideo ? 0.8 : 1,
                    animation: showVideo ? 'slideInLeft 0.8s ease-out 0.2s both' : 'none',
                    transition: 'opacity 0.5s ease'
                  }}
                >
                  I'm a creative professional passionate about crafting digital experiences that tell compelling stories through design and technology.
                </p>
                <p 
                  style={{ 
                    opacity: showVideo ? 0.9 : 1,
                    animation: showVideo ? 'slideInRight 0.8s ease-out 0.4s both' : 'none',
                    transition: 'opacity 0.5s ease'
                  }}
                >
                  My work focuses on creating meaningful connections between brands and their audiences through innovative visual storytelling.
                </p>
                <p 
                  style={{ 
                    opacity: showVideo ? 1 : 1,
                    animation: showVideo ? 'slideInLeft 0.8s ease-out 0.6s both' : 'none',
                    transition: 'opacity 0.5s ease'
                  }}
                >
                  Every project is an opportunity to explore new creative possibilities and push the boundaries of what's possible.
                </p>
              </div>
              
              {/* Progress Bar */}
              <div className="mt-8">
                <div className="w-full bg-gray-800 bg-opacity-50 rounded-full h-2 backdrop-blur-sm">
                  <div
                    className="h-2 rounded-full transition-all duration-500 ease-out"
                    style={{ 
                      width: `${scrollProgress * 100}%`,
                      background: `linear-gradient(90deg, 
                        hsl(${260 + scrollProgress * 40}, 80%, 60%) 0%, 
                        hsl(${180 + scrollProgress * 40}, 80%, 60%) 100%)`,
                      boxShadow: `0 0 20px hsla(${260 + scrollProgress * 40}, 80%, 60%, 0.5)`,
                    }}
                  />
                </div>
                <p className="text-sm text-gray-400 mt-3 font-light">
                  {showVideo ? 'Experience Activated' : `Progress: ${Math.round(scrollProgress * 100)}%`}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default PhoenixScrollSection;