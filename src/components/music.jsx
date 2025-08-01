import { useEffect, useRef, useState } from 'react';

function Music() {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);

  // Auto-play on mount and add event listeners
  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = 0.5;
      
      // Add event listeners to sync state with audio
      const handlePlay = () => setIsPlaying(true);
      const handlePause = () => setIsPlaying(false);
      const handleEnded = () => setIsPlaying(false);
      
      audio.addEventListener('play', handlePlay);
      audio.addEventListener('pause', handlePause);
      audio.addEventListener('ended', handleEnded);
      
      // Try to auto-play
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => setIsPlaying(true))
          .catch((err) => {
            console.warn('Autoplay blocked:', err);
            setIsPlaying(false);
          });
      }
      
      // Cleanup event listeners
      return () => {
        audio.removeEventListener('play', handlePlay);
        audio.removeEventListener('pause', handlePause);
        audio.removeEventListener('ended', handleEnded);
      };
    }
  }, []);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play()
        .then(() => setIsPlaying(true))
        .catch((err) => {
          console.error('Play failed:', err);
          setIsPlaying(false);
        });
    }
  };

  return (
    <>
      {/* Background music */}
      <audio ref={audioRef} src="/audio.mp3" loop />

      {/* Floating control - ONLY CHANGED THE POSITIONING CLASSES */}
      <div className="fixed top-6 right-4 sm:right-6 z-[999]">
        <button
          onClick={togglePlay}
          className="bg-violet-600 hover:bg-violet-700 p-4 rounded-full shadow-xl transition-all duration-300 flex items-center justify-center relative w-12 h-12 sm:w-16 sm:h-16"
          title={isPlaying ? 'Pause Music' : 'Play Music'}
          aria-label={isPlaying ? 'Pause music' : 'Play music'}
        >
          {/* Wave animation when playing */}
          {isPlaying ? (
            <div className="flex gap-[2px] sm:gap-[3px] absolute">
              <div className="w-[3px] h-3 sm:w-[4px] sm:h-4 bg-black animate-wave" style={{ animationDelay: '0ms' }}></div>
              <div className="w-[3px] h-4 sm:w-[4px] sm:h-6 bg-black animate-wave" style={{ animationDelay: '100ms' }}></div>
              <div className="w-[3px] h-3.5 sm:w-[4px] sm:h-5 bg-black animate-wave" style={{ animationDelay: '200ms' }}></div>
              <div className="w-[3px] h-5 sm:w-[4px] sm:h-7 bg-black animate-wave" style={{ animationDelay: '300ms' }}></div>
            </div>
          ) : (
            <>
              {/* Play icon (replaced remix icon with SVG) */}
              <svg 
                width="24" 
                height="24" 
                viewBox="0 0 24 24" 
                fill="none" 
                className="text-black w-5 h-5 sm:w-6 sm:h-6"
              >
                <path d="M8 5V19L19 12L8 5Z" fill="currentColor"/>
              </svg>
            </>
          )}
        </button>
      </div>

      {/* Animation styles */}
      <style jsx global>{`
        @keyframes wave {
          0%, 100% {
            transform: scaleY(1);
          }
          50% {
            transform: scaleY(0.3);
          }
        }
        .animate-wave {
          animation: wave 1.2s ease-in-out infinite;
          transform-origin: bottom;
        }
      `}</style>
    </>
  );
}

export default Music;