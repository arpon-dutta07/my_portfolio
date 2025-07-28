import React, { useEffect, useRef, useState } from 'react';

const PhoenixScrollSection = () => {
  const sectionRef = useRef(null);
  const pathRef = useRef(null);
  const videoRef = useRef(null);
  const imageRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showVideo, setShowVideo] = useState(false);

  // Preload and prepare video
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.preload = 'auto';
      video.load();
    }
  }, []);

  // Handle scroll progress
  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const scrollStart = window.innerHeight * 0.2;
      const scrollEnd = window.innerHeight * 0.8;
      const progress = Math.max(0, Math.min(1, (scrollStart - rect.top) / (scrollEnd - scrollStart)));

      setScrollProgress(progress);

      const shouldShowVideo = progress >= 0.95;

      if (shouldShowVideo && !showVideo) {
        setShowVideo(true);
        tryPlayVideo();
      } else if (!shouldShowVideo && showVideo) {
        setShowVideo(false);
        if (videoRef.current) videoRef.current.pause();
      }
    };

    const onScroll = () => requestAnimationFrame(handleScroll);
    window.addEventListener('scroll', onScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', onScroll);
  }, [showVideo]);

  const tryPlayVideo = () => {
    const video = videoRef.current;
    if (!video) return;

    const playSafely = () => {
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(err => console.warn('Autoplay blocked or failed:', err));
      }
    };

    if (video.readyState >= 3) {
      playSafely();
    } else {
      video.addEventListener('canplaythrough', playSafely, { once: true });
    }
  };

  // Animate SVG path
  useEffect(() => {
    if (!pathRef.current) return;

    const path = pathRef.current;
    const pathLength = path.getTotalLength();
    const offset = pathLength * (1 - scrollProgress);

    const hue = Math.floor(scrollProgress * 360);
    const glowIntensity = 0.8 + scrollProgress * 0.4;

    path.style.strokeDasharray = `${pathLength}`;
    path.style.strokeDashoffset = `${offset}`;
    path.style.stroke = `hsl(${hue}, 100%, 50%)`;
    path.style.strokeWidth = `${10 + scrollProgress * 6}`;
    path.style.filter = `
      drop-shadow(0 0 10px hsla(${hue}, 100%, 60%, ${glowIntensity}))
      drop-shadow(0 0 20px hsla(${hue}, 100%, 50%, ${glowIntensity * 0.7}))
      drop-shadow(0 0 40px hsla(${hue}, 100%, 40%, ${glowIntensity * 0.4}))
      drop-shadow(0 0 80px hsla(${hue}, 100%, 30%, ${glowIntensity * 0.2}))
    `;
  }, [scrollProgress]);

  const galaxyImage = "/assets/galaxy.jpg";
  const videoSource = "/assets/video10.mp4";

  return (
    <section
      ref={sectionRef}
      className="relative bg-black text-white min-h-screen w-full flex items-center justify-center overflow-hidden"
      style={{ height: '150vh' }}
    >
      {/* SVG Path */}
      <svg
        className="absolute top-0 left-0 w-full h-full pointer-events-none"
        viewBox="0 0 1200 800"
        fill="none"
        preserveAspectRatio="xMidYMid slice"
        style={{ zIndex: 20 }}
      >
        <path
          d="M80 200 C150 120, 250 120, 320 200 C350 230, 380 260, 420 280 C480 310, 540 320, 600 300 C680 270, 720 240, 780 260 C840 280, 880 320, 920 360 C950 390, 980 420, 1000 450 C1020 480, 1040 510, 1050 550 C1060 590, 1050 630, 1020 660 C990 690, 950 700, 900 690 C850 680, 800 660, 760 630 C720 600, 690 570, 650 540 C610 510, 570 480, 520 460 C470 440, 420 430, 370 440 C320 450, 280 470, 250 500 C220 530, 200 570, 190 610"
          stroke="url(#glowGradient)"
          strokeWidth="20"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.3"
          style={{
            strokeDasharray: scrollProgress > 0 ? 'none' : '0',
            strokeDashoffset: scrollProgress > 0 ? '0' : '100%',
            filter: 'blur(4px)'
          }}
        />
        <path
          ref={pathRef}
          d="M80 200 C150 120, 250 120, 320 200 C350 230, 380 260, 420 280 C480 310, 540 320, 600 300 C680 270, 720 240, 780 260 C840 280, 880 320, 920 360 C950 390, 980 420, 1000 450 C1020 480, 1040 510, 1050 550 C1060 590, 1050 630, 1020 660 C990 690, 950 700, 900 690 C850 680, 800 660, 760 630 C720 600, 690 570, 650 540 C610 510, 570 480, 520 460 C470 440, 420 430, 370 440 C320 450, 280 470, 250 500 C220 530, 200 570, 190 610"
          stroke="#ff0000"
          strokeWidth="12"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <defs>
          <radialGradient id="glowGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0.8" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0.1" />
          </radialGradient>
        </defs>
      </svg>

      {/* Main Content */}
      <div className="relative z-30 w-full max-w-6xl mx-auto px-8  top-0">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          {/* Image and Video */}
          <div className="flex-1 flex justify-center lg:justify-start">
            <div className="relative w-full max-w-md">
              <img
                ref={imageRef}
                src={galaxyImage}
                alt="Galaxy"
                className="w-full h-80 rounded-2xl object-cover shadow-2xl transition-transform duration-1000 ease-out absolute inset-0"
                style={{
                  transform: showVideo ? 'scale(1.3) rotate(5deg)' : 'scale(1)',
                  opacity: showVideo ? 0 : 1,
                  filter: showVideo ? 'blur(10px)' : 'blur(0px)',
                  zIndex: 10,
                }}
              />
              {/* Full-screen Video Overlay */}
              <div
                className={`transition-opacity duration-1000 ease-in-out ${
                  showVideo ? 'opacity-100 visible' : 'opacity-0 invisible'
                }`}
                style={{
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  width: '100vw',
                  height: '100vh',
                  zIndex: 50,
                  pointerEvents: showVideo ? 'auto' : 'none',
                }}
              >
                <video
                  ref={videoRef}
                  className="w-full h-full object-cover"
                  muted
                  playsInline
                  loop
                  preload="auto"
                >
                  <source src={videoSource} type="video/mp4" />
                </video>
              </div>
            </div>
          </div>

          {/* Text Content */}
          <div className="flex-1 space-y-8 lg:pl-12">
            <h1
              className="text-5xl lg:text-6xl font-light transition-all duration-1000"
              style={{
                transform: showVideo ? 'translateY(-10px)' : 'translateY(0)',
                color: showVideo ? '#a855f7' : '#ffffff',
              }}
            >
              About Me
            </h1>
            <div className="space-y-6 text-lg text-gray-300 leading-relaxed">
              <p style={{ opacity: showVideo ? 0.7 : 1 }}>
                I'm a creative professional passionate about crafting digital experiences that tell compelling stories through design and technology.
              </p>
              <p style={{ opacity: showVideo ? 0.8 : 1 }}>
                My work focuses on creating meaningful connections between brands and their audiences through innovative visual storytelling.
              </p>
              <p style={{ opacity: showVideo ? 0.9 : 1 }}>
                Every project is an opportunity to explore new creative possibilities and push the boundaries of what's possible.
              </p>
            </div>
            <div className="mt-8">
              <div className="w-full bg-gray-800 rounded-full h-1">
                <div
                  className="bg-gradient-to-r from-purple-500 to-blue-500 h-1 rounded-full transition-all duration-300"
                  style={{ width: `${scrollProgress * 100}%` }}
                />
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Scroll progress: {Math.round(scrollProgress * 100)}%
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PhoenixScrollSection;
