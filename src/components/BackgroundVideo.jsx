import React, { useRef, useEffect, useState } from 'react';

const BackgroundVideo = ({ videoSrc, fallbackImage, children }) => {
  const videoRef = useRef(null);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => setIsVideoLoaded(true))
          .catch(() => setIsVideoLoaded(false));
      }
    }
  }, []);

  return (
    <div className="relative w-full h-full">
      {/* Video Element */}
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        disablePictureInPicture
        className="absolute top-0 left-0 w-full h-full object-cover z-[-1] [image-rendering:pixelated] [transform:translateZ(0)]"
        onCanPlay={() => setIsVideoLoaded(true)}
        onError={() => setIsVideoLoaded(false)}
      >
        <source src={videoSrc} type="video/mp4" />
        Your browser does not support HTML5 video.
      </video>

      {/* Fallback Image */}
      {!isVideoLoaded && (
        <img
          src={fallbackImage}
          alt="Background"
          className="absolute top-0 left-0 w-full h-full object-cover z-[-1] [image-rendering:pixelated] [transform:translateZ(0)]"
        />
      )}

      {/* Foreground Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default BackgroundVideo;
