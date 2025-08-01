import React, { createContext, useContext, useRef, forwardRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValue, useAnimation } from 'framer-motion';

const SPRING_CONFIG = {
  type: "spring",
  stiffness: 100,
  damping: 16,
  mass: 0.75,
  restDelta: 0.005,
  duration: 0.3,
};

const blurVariants = {
  hidden: {
    filter: "blur(10px)",
    opacity: 0,
  },
  visible: {
    filter: "blur(0px)",
    opacity: 1,
  },
};

const ContainerScrollContext = createContext(undefined);

function useContainerScrollContext() {
  const context = useContext(ContainerScrollContext);
  if (!context) {
    throw new Error(
      "useContainerScrollContext must be used within a ContainerScroll Component"
    );
  }
  return context;
}

// Floating orbs component
function FloatingOrbs() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 8 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full blur-xl opacity-30"
          style={{
            width: `${60 + Math.random() * 100}px`,
            height: `${60 + Math.random() * 100}px`,
            background: `radial-gradient(circle, ${
              ['#8B5CF6', '#EC4899', '#3B82F6', '#10B981', '#F59E0B'][
                Math.floor(Math.random() * 5)
              ]
            }, transparent)`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            x: [0, 100, -50, 0],
            y: [0, -100, 50, 0],
            scale: [1, 1.2, 0.8, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 15 + Math.random() * 10,
            repeat: Infinity,
            ease: "linear",
            delay: Math.random() * 5,
          }}
        />
      ))}
    </div>
  );
}

// Ripple effect component
function RippleEffect({ mouseX, mouseY }) {
  const [ripples, setRipples] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setRipples(prev => [
        ...prev,
        {
          id: Date.now(),
          x: mouseX.get(),
          y: mouseY.get(),
        }
      ]);
    }, 2000);

    return () => clearInterval(interval);
  }, [mouseX, mouseY]);

  useEffect(() => {
    const cleanup = setTimeout(() => {
      setRipples(prev => prev.slice(-5));
    }, 3000);

    return () => clearTimeout(cleanup);
  }, [ripples]);

  return (
    <div className="absolute inset-0 pointer-events-none">
      {ripples.map((ripple) => (
        <motion.div
          key={ripple.id}
          className="absolute rounded-full border-2 border-purple-400/30"
          style={{
            left: ripple.x - 25,
            top: ripple.y - 25,
          }}
          initial={{ width: 0, height: 0, opacity: 1 }}
          animate={{ 
            width: 200, 
            height: 200, 
            opacity: 0,
            scale: [1, 1.5, 2]
          }}
          transition={{ duration: 2, ease: "easeOut" }}
        />
      ))}
    </div>
  );
}

function ContainerScroll({
  children,
  className,
  style,
  ...props
}) {
  const scrollRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: scrollRef,
  });
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = (event) => {
    mouseX.set(event.clientX);
    mouseY.set(event.clientY);
  };
  
  return (
    <ContainerScrollContext.Provider value={{ scrollYProgress, mouseX, mouseY }}>
      <div
        ref={scrollRef}
        className={`relative min-h-[120vh] ${className || ''}`}
        style={{
          perspective: "1000px",
          perspectiveOrigin: "center top",
          transformStyle: "preserve-3d",
          ...style,
        }}
        onMouseMove={handleMouseMove}
        {...props}
      >
        {children}
      </div>
    </ContainerScrollContext.Provider>
  );
}

function ContainerSticky({
  className,
  style,
  ...props
}) {
  return (
    <div
      className={`sticky left-0 top-0 min-h-[30rem] w-full overflow-hidden ${className || ''}`}
      style={{
        perspective: "1000px",
        perspectiveOrigin: "center top",
        transformStyle: "preserve-3d",
        transformOrigin: "50% 50%",
        ...style,
      }}
      {...props}
    />
  );
}

function GalleryContainer({
  children,
  className,
  style,
  ...props
}) {
  const { scrollYProgress } = useContainerScrollContext();
  const rotateX = useTransform(scrollYProgress, [0, 0.5], [75, 0]);
  const scale = useTransform(scrollYProgress, [0.5, 0.9], [1.2, 1]);
  const rotateY = useTransform(scrollYProgress, [0, 1], [0, 5]);

  return (
    <motion.div
      className={`relative grid size-full grid-cols-3 gap-2 rounded-2xl ${className || ''}`}
      style={{
        rotateX,
        rotateY,
        scale,
        transformStyle: "preserve-3d",
        perspective: "1000px",
        ...style,
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

function GalleryCol({
  className,
  style,
  yRange = ["0%", "-10%"],
  ...props
}) {
  const { scrollYProgress } = useContainerScrollContext();
  const y = useTransform(scrollYProgress, [0.5, 1], yRange);

  return (
    <motion.div
      className={`relative flex w-full flex-col gap-2 ${className || ''}`}
      style={{
        y,
        ...style,
      }}
      {...props}
    />
  );
}

// Enhanced image component with stunning effects
function EnhancedImage({ src, alt, index, colorTheme }) {
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  return (
    <motion.div
      className="relative group cursor-pointer"
      initial={{ opacity: 0, y: 50, rotateX: 45 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ 
        duration: 0.8, 
        delay: index * 0.1,
        type: "spring",
        stiffness: 100,
        damping: 20
      }}
      viewport={{ once: true }}
      whileHover={{ 
        scale: 1.08, 
        z: 20,
        rotateY: 5,
        rotateX: -5,
        transition: { duration: 0.4, type: "spring", stiffness: 300, damping: 20 }
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
      style={{
        transformStyle: "preserve-3d",
      }}
    >
      {/* Magical glow effect */}
      <motion.div
        className={`absolute -inset-1 rounded-xl blur-md opacity-0 group-hover:opacity-100 bg-gradient-to-r ${colorTheme}`}
        animate={{
          scale: isHovered ? [1, 1.05, 1] : 1,
          rotate: isHovered ? [0, 2, -2, 0] : 0,
        }}
        transition={{
          duration: 2,
          repeat: isHovered ? Infinity : 0,
          repeatType: "reverse",
        }}
      />
      
      {/* Shimmer effect */}
      <motion.div
        className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100"
        animate={{
          background: isHovered 
            ? [
              "linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.5) 50%, transparent 70%)",
              "linear-gradient(225deg, transparent 30%, rgba(255,255,255,0.5) 50%, transparent 70%)"
            ]
            : "transparent"
        }}
        transition={{ duration: 1.5, repeat: isHovered ? Infinity : 0 }}
      />

      {/* Main image */}
      <motion.img
        className="aspect-video block h-auto max-h-full w-full rounded-xl object-cover shadow-2xl border border-white/20 backdrop-blur-sm relative z-10"
        src={src}
        alt={alt}
        style={{
          filter: isHovered ? "brightness(1.1) contrast(1.1) saturate(1.2)" : "brightness(1)",
        }}
        whileHover={{
          filter: "brightness(1.2) contrast(1.2) saturate(1.3)",
        }}
        transition={{ duration: 0.3 }}
      />

      {/* Interactive light following mouse */}
      <motion.div
        className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 pointer-events-none"
        style={{
          background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(255,255,255,0.3) 0%, transparent 50%)`,
        }}
        animate={{
          opacity: isHovered ? [0.3, 0.6, 0.3] : 0,
        }}
        transition={{ duration: 2, repeat: isHovered ? Infinity : 0 }}
      />

      {/* Particle explosion on hover */}
      {isHovered && (
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 12 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full"
              style={{
                left: '50%',
                top: '50%',
              }}
              initial={{ scale: 0, x: 0, y: 0 }}
              animate={{
                scale: [0, 1, 0],
                x: [(Math.random() - 0.5) * 100, (Math.random() - 0.5) * 200],
                y: [(Math.random() - 0.5) * 100, (Math.random() - 0.5) * 200],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 1.5,
                delay: i * 0.1,
                repeat: Infinity,
                repeatDelay: 2,
              }}
            />
          ))}
        </div>
      )}

      {/* Holographic overlay */}
      <motion.div
        className={`absolute inset-0 bg-gradient-to-br ${colorTheme} rounded-xl opacity-0 group-hover:opacity-20 mix-blend-overlay`}
        animate={{
          opacity: isHovered ? [0.1, 0.3, 0.1] : 0,
        }}
        transition={{ duration: 1.5, repeat: isHovered ? Infinity : 0 }}
      />

      {/* Ring effect */}
      <motion.div
        className={`absolute inset-0 ring-2 ring-purple-400/0 group-hover:ring-purple-400/70 rounded-xl`}
        animate={{
          scale: isHovered ? [1, 1.02, 1] : 1,
        }}
        transition={{ duration: 2, repeat: isHovered ? Infinity : 0 }}
      />
    </motion.div>
  );
}

// Image arrays - using local gallery images
const IMAGES_1 = [
  "/assets/Gallery/IMG20250527024742.jpg",
  "/assets/Gallery/IMG_20250801_120622_938.jpg",
  "/assets/Gallery/IMG_20250801_120623_330.jpg",
  "/assets/Gallery/IMG_20250801_120622_866.jpg",
];

const IMAGES_2 = [
  "/assets/Gallery/IMG_20250801_120623_223.jpg",
  "/assets/Gallery/IMG_20250801_120622_593.jpg",
  "/assets/Gallery/IMG_20250801_120623_286.jpg",
  "/assets/Gallery/IMG_20250801_120623_397.jpg",
];

const IMAGES_3 = [
  "/assets/Gallery/IMG_20250801_120626_136.jpg",
  "/assets/Gallery/IMG_20250801_120626_467.jpg",
  "/assets/Gallery/IMG_20250801_120623_423.jpg",
  "/assets/Gallery/IMG_20250801_120622_774.jpg",
];

export default function MyGallery() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const [stars, setStars] = useState([]);

  // Generate stars
  useEffect(() => {
    const newStars = Array.from({ length: 100 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      opacity: Math.random() * 0.8 + 0.2,
      animationDuration: Math.random() * 3 + 2,
    }));
    setStars(newStars);
  }, []);

  return (
    <div className="relative bg-black min-h-screen overflow-hidden">
      {/* Animated star field */}
      <div className="absolute inset-0">
        {stars.map((star) => (
          <motion.div
            key={star.id}
            className="absolute bg-white rounded-full"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
            }}
            animate={{
              opacity: [star.opacity, star.opacity * 0.3, star.opacity],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: star.animationDuration,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Dynamic gradient background */}
      <motion.div
        className="absolute inset-0"
        animate={{
          background: [
            "radial-gradient(circle at 20% 50%, #1e1b4b 0%, #0f0f23 50%, #000000 100%)",
            "radial-gradient(circle at 80% 20%, #581c87 0%, #1e1b4b 50%, #000000 100%)",
            "radial-gradient(circle at 40% 80%, #1e3a8a 0%, #0f0f23 50%, #000000 100%)",
            "radial-gradient(circle at 20% 50%, #1e1b4b 0%, #0f0f23 50%, #000000 100%)",
          ]
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      {/* Floating orbs */}
      <FloatingOrbs />

      {/* Mouse ripple effect */}
      <RippleEffect mouseX={mouseX} mouseY={mouseY} />

      <ContainerScroll>
        <div className="flex flex-col items-center justify-center py-20">
          {/* Spectacular title with multiple effects */}
          <motion.div className="relative mb-20">
            <motion.h1 
              className="text-8xl font-black text-center relative z-10"
              initial={{ opacity: 0, y: 50, scale: 0.5 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            >
              <motion.span
                className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent"
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "linear",
                }}
                style={{
                  backgroundSize: "200% 200%",
                }}
              >
                Edited Photography Showcase
              </motion.span>
            </motion.h1>
            
            {/* Glowing shadow */}
            <motion.h1 
              className="absolute inset-0 text-8xl font-black text-center text-purple-400 blur-lg opacity-50"
              animate={{
                scale: [1, 1.05, 1],
                opacity: [0.3, 0.7, 0.3],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              Edited Photography Showcase
            </motion.h1>
          </motion.div>

          {/* Animated divider */}
          <motion.div className="relative mb-20">
            <motion.div
              className="w-64 h-1 bg-gradient-to-r from-transparent via-purple-400 to-transparent mx-auto rounded-full"
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 256, opacity: 1 }}
              transition={{ duration: 2, delay: 0.5, ease: "easeOut" }}
            />
            <motion.div
              className="absolute inset-0 w-64 h-1 bg-gradient-to-r from-purple-400 to-pink-400 mx-auto rounded-full blur-sm"
              animate={{
                opacity: [0.5, 1, 0.5],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </motion.div>
          
          <ContainerSticky>
            <GalleryContainer className="p-8">
              <GalleryCol yRange={["0%", "-15%"]}>
                {IMAGES_1.map((imageUrl, index) => (
                  <EnhancedImage
                    key={index}
                    src={imageUrl}
                    alt="gallery item"
                    index={index}
                    colorTheme="from-purple-600 to-pink-600"
                  />
                ))}
              </GalleryCol>
              <GalleryCol yRange={["0%", "-5%"]}>
                {IMAGES_2.map((imageUrl, index) => (
                  <EnhancedImage
                    key={index}
                    src={imageUrl}
                    alt="gallery item"
                    index={index}
                    colorTheme="from-pink-600 to-blue-600"
                  />
                ))}
              </GalleryCol>
              <GalleryCol yRange={["0%", "-10%"]}>
                {IMAGES_3.map((imageUrl, index) => (
                  <EnhancedImage
                    key={index}
                    src={imageUrl}
                    alt="gallery item"
                    index={index}
                    colorTheme="from-blue-600 to-purple-600"
                  />
                ))}
              </GalleryCol>
            </GalleryContainer>
          </ContainerSticky>
        </div>
      </ContainerScroll>
    </div>
  );
}