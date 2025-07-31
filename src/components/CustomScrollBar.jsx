import React, { useEffect } from 'react';
import { motion, useSpring, useTransform, useMotionValue } from 'framer-motion';

const CustomScrollBar = () => {
  const scrollY = useMotionValue(0);
  const scrollYSpring = useSpring(scrollY, {
    stiffness: 100,
    damping: 20,
    mass: 0.5,
  });

  // Calculate scrollbar position and height
  const y = useTransform(scrollYSpring, v => v * (window.innerHeight - 40));
  const height = useTransform(scrollYSpring, v => {
    const viewportRatio = window.innerHeight / document.body.scrollHeight;
    return `${Math.max(30, viewportRatio * 100)}%`;
  });

  // Handle scroll events
  useEffect(() => {
    const updateScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.body.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? scrollTop / docHeight : 0;
      scrollY.set(progress);
    };

    // Add event listeners
    window.addEventListener('scroll', updateScroll, { passive: true });
    window.addEventListener('resize', updateScroll);
    updateScroll();

    // Hide default scrollbar
    document.documentElement.style.scrollbarWidth = 'none';
    document.documentElement.style.overflowY = 'scroll'; // Force scrollbar space
    document.documentElement.style.msOverflowStyle = 'none';
    
    const style = document.createElement('style');
    style.innerHTML = `
      ::-webkit-scrollbar {
        display: none;
        width: 0;
        background: transparent;
      }
    `;
    document.head.appendChild(style);

    return () => {
      window.removeEventListener('scroll', updateScroll);
      window.removeEventListener('resize', updateScroll);
      document.head.removeChild(style);
      document.documentElement.style.scrollbarWidth = '';
      document.documentElement.style.overflowY = '';
      document.documentElement.style.msOverflowStyle = '';
    };
  }, [scrollY]);

  // Handle click and drag on the scrollbar
  const handleDrag = (e, info) => {
    const scrollHeight = document.body.scrollHeight - window.innerHeight;
    const newY = info.point.y / window.innerHeight;
    window.scrollTo(0, newY * scrollHeight);
  };

  return (
    <div className="fixed right-0 top-0 h-full w-3 z-[9999] pointer-events-auto">
      <div className="relative w-full h-full bg-gray-800 bg-opacity-20">
        <motion.div
          style={{ y, height }}
          className="absolute top-0 w-full rounded-full bg-gradient-to-b from-fuchsia-500 to-cyan-400 shadow-lg cursor-pointer"
          drag="y"
          dragConstraints={{ top: 0, bottom: window.innerHeight - 40 }}
          dragElastic={0}
          dragMomentum={false}
          onDrag={handleDrag}
          whileHover={{ scaleX: 1.5 }}
          whileTap={{ scaleX: 1.5 }}
        />
      </div>
    </div>
  );
};

export default CustomScrollBar;