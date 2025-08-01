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
  const [showPlayButton, setShowPlayButton] = useState(false);

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

  // Enhanced video handling for mobile and desktop
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleCanPlay = () => {
      setIsVideoLoaded(true);
      if (showVideo) {
        // Enhanced mobile compatibility
        const playPromise = video.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              // Video started successfully
              console.log('Video playing successfully');
              setShowPlayButton(false);
            })
            .catch(error => {
              console.warn('Autoplay prevented:', error);
              // Show manual play button for mobile
              setShowPlayButton(true);
              setIsVideoLoaded(true);
            });
        }
      }
    };

    const handleLoadedData = () => {
      setIsVideoLoaded(true);
    };

    const handleError = (e) => {
      console.error('Video error:', e);
      setIsVideoLoaded(false);
    };

    // Enhanced event listeners
    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('loadeddata', handleLoadedData);
    video.addEventListener('error', handleError);
    
    // Better mobile support
    video.preload = 'metadata'; // Changed from 'auto' for better mobile performance
    video.load();

    return () => {
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('loadeddata', handleLoadedData);
      video.removeEventListener('error', handleError);
      video.pause();
      video.currentTime = 0;
      video.removeAttribute('src');
      video.load();
    };
  }, [showVideo]);

  // Function to close video
  const closeVideo = () => {
    const video = videoRef.current;
    if (video) {
      video.pause();
      video.currentTime = 0;
      // Force stop all video processes
      video.src = '';
      video.removeAttribute('src');
      video.load();
    }
    setShowVideo(false);
    setShowPlayButton(false);
    setIsVideoLoaded(false);
  };

  // Manual play function for mobile
  const handleManualPlay = () => {
    const video = videoRef.current;
    if (video) {
      video.play()
        .then(() => {
          setShowPlayButton(false);
        })
        .catch(error => {
          console.error('Manual play failed:', error);
        });
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

      // Check if section is in view
      const isInView = rect.bottom > 0 && rect.top < window.innerHeight;
      setSectionInView(isInView);

      // Show video when progress reaches 95%
      const shouldShowVideo = progress >= 0.95 && isInView;

      if (shouldShowVideo && !showVideo) {
        setShowVideo(true);
      } 
      // Close video when scrolling out of section or progress drops
      else if (showVideo && (!isInView || progress < 0.9)) {
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
  const videoSource = "/assets/video10.mp4";
  
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
            d="M0 400 C50 350, 100 300, 150 320 C200 340, 250 120, 320 200 C350 230, 380 260, 420 280 C480 310, 540 320, 600 300 C680 270, 720 240, 780 260 C840 280, 880 320, 920 360 C950 390, 980 420, 1000 450 C1020 480, 1040 510, 1050 550 C1060 590, 1050 630, 1020 660 C990 690, 950 700, 900 690 C850 680, 800 660, 760 630 C720 600, 690 570, 650 540 C610 510, 570 480, 520 460 C470 440, 420 430, 370 440 C320 450, 280 470, 250 500 C220 530, 200 570, 150 580 C100 590, 50 550, 0 400"
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
              preload="metadata"
              autoPlay
              disablePictureInPicture
              disableRemotePlayback
              webkit-playsinline="true"
              x5-playsinline="true"
              x5-video-player-type="h5"
              x5-video-player-fullscreen="true"
              x-webkit-airplay="allow"
              onLoadedData={() => setIsVideoLoaded(true)}
              onError={() => setIsVideoLoaded(false)}
              onCanPlay={() => {
                const video = videoRef.current;
                if (video && showVideo) {
                  video.play().catch(e => console.warn('Mobile autoplay prevented:', e));
                }
              }}
              style={{
                objectFit: 'cover',
                width: '100%',
                height: '100%',
                backgroundColor: '#000'
              }}
            >
              <source src={videoSource} type="video/mp4" />
              <p className="text-white text-center p-4">
                Your browser doesn't support HTML5 video. 
                <a href={videoSource} className="text-blue-400 underline ml-2">
                  Download the video instead.
                </a>
              </p>
            </video>
            
            {/* Manual Play Button for Mobile */}
            {showPlayButton && (
              <button
                onClick={handleManualPlay}
                className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 backdrop-blur-sm transition-all duration-300 hover:bg-opacity-40"
                style={{ animation: 'fadeInScale 0.5s ease-out' }}
              >
                <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center border-2 border-white border-opacity-40 hover:border-opacity-60 hover:scale-110 transition-all duration-300">
                  <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </div>
                <div className="absolute bottom-20 text-white text-lg font-light">
                  Tap to play video
                </div>
              </button>
            )}

            {/* Close Button */}
            <button
              onClick={closeVideo}
              className="absolute top-6 right-6 w-12 h-12 bg-black bg-opacity-50 hover:bg-opacity-80 rounded-full flex items-center justify-center text-white text-2xl font-light transition-all duration-300 backdrop-blur-sm border border-white border-opacity-20 hover:border-opacity-40 hover:scale-110 z-10"
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
                Creative Excellence
              </h1>
              
              <div className="space-y-6 text-lg text-gray-300 leading-relaxed">
                <p 
                  style={{ 
                    opacity: showVideo ? 0.8 : 1,
                    animation: showVideo ? 'slideInLeft 0.8s ease-out 0.2s both' : 'none',
                    transition: 'opacity 0.5s ease'
                  }}
                >
                  Transforming concepts into stunning 3D visuals through advanced modeling and rendering techniques.
                </p>
                <p 
                  style={{ 
                    opacity: showVideo ? 0.9 : 1,
                    animation: showVideo ? 'slideInRight 0.8s ease-out 0.4s both' : 'none',
                    transition: 'opacity 0.5s ease'
                  }}
                >
                  Expertise in Blender, Cinema 4D, and Maya for creating photorealistic architectural visualizations and conceptual art.
                </p>
                <p 
                  style={{ 
                    opacity: showVideo ? 1 : 1,
                    animation: showVideo ? 'slideInLeft 0.8s ease-out 0.6s both' : 'none',
                    transition: 'opacity 0.5s ease'
                  }}
                >
                  Pushing creative boundaries with dynamic lighting, particle systems, and procedural generation techniques.
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