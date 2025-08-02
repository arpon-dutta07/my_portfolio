"use client";
import { useScroll, useTransform, motion, useInView } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";

export const Timeline = ({ data }) => {
  const ref = useRef(null);
  const containerRef = useRef(null);
  const [height, setHeight] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [particles, setParticles] = useState([]);
  const isInView = useInView(containerRef, { once: false, margin: "-100px" });

  useEffect(() => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setHeight(rect.height);
    }
  }, [ref]);

  // Generate floating particles
  useEffect(() => {
    const generateParticles = () => {
      const newParticles = Array.from({ length: 30 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 4 + 2,
        opacity: Math.random() * 0.6 + 0.2,
        color: ['#8B5CF6', '#EC4899', '#3B82F6', '#10B981', '#F59E0B'][Math.floor(Math.random() * 5)],
        speed: Math.random() * 2 + 1,
        direction: Math.random() * 360
      }));
      setParticles(newParticles);
    };

    generateParticles();
  }, []);

  // Animate particles
  useEffect(() => {
    const animateParticles = () => {
      setParticles(prev => prev.map(particle => ({
        ...particle,
        x: (particle.x + Math.cos(particle.direction * Math.PI / 180) * particle.speed * 0.1) % 100,
        y: (particle.y + Math.sin(particle.direction * Math.PI / 180) * particle.speed * 0.1) % 100,
        direction: particle.direction + 0.5
      })));
    };

    const interval = setInterval(animateParticles, 50);
    return () => clearInterval(interval);
  }, []);

  const handleMouseMove = (e) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      setMousePosition({
        x: ((e.clientX - rect.left) / rect.width) * 100,
        y: ((e.clientY - rect.top) / rect.height) * 100
      });
    }
  };

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 10%", "end 50%"],
  });

  const heightTransform = useTransform(scrollYProgress, [0, 1], [0, height]);
  const opacityTransform = useTransform(scrollYProgress, [0, 0.1], [0, 1]);
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <div 
      className="c-space section-spacing relative overflow-hidden" 
      ref={containerRef}
      onMouseMove={handleMouseMove}
    >
      {/* Epic Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Dynamic Gradient Background */}
        <motion.div
          className="absolute inset-0 opacity-30"
          style={{
            background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, 
              rgba(139, 92, 246, 0.15) 0%, 
              rgba(236, 72, 153, 0.1) 25%, 
              rgba(59, 130, 246, 0.1) 50%, 
              transparent 70%)`,
            y: backgroundY
          }}
        />
        
        {/* Floating Particles */}
        {particles.map(particle => (
          <motion.div
            key={particle.id}
            className="absolute rounded-full blur-sm"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: particle.size,
              height: particle.size,
              backgroundColor: particle.color,
              opacity: particle.opacity,
            }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [particle.opacity, particle.opacity * 1.5, particle.opacity]
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        ))}
        
        {/* Cosmic Grid */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
              linear-gradient(rgba(139, 92, 246, 0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(139, 92, 246, 0.3) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
            transform: `translate(${mousePosition.x * 0.1}px, ${mousePosition.y * 0.1}px)`
          }}
        />
      </div>

      {/* Stunning Title */}
      <motion.div 
        className="relative z-10 text-center mb-16"
      >
        <motion.h2 
          className="text-4xl md:text-6xl lg:text-7xl font-black mb-6 relative"
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
            My Work Experience
          </span>
          
          {/* Glowing Shadow */}
          <span className="absolute inset-0 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent blur-lg opacity-50">
            My Work Experience
          </span>
        </motion.h2>
        
        {/* Animated Divider */}
        <motion.div 
          className="flex justify-center items-center space-x-4 mb-8"
          initial={{ opacity: 0, scale: 0 }}
          animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <div className="w-16 h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent animate-pulse"></div>
          <div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-bounce"></div>
          <div className="w-32 h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 animate-pulse"></div>
          <div className="w-3 h-3 bg-gradient-to-r from-pink-500 to-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
          <div className="w-16 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent animate-pulse"></div>
        </motion.div>
      </motion.div>

      <div ref={ref} className="relative pb-20 z-10">
        {data.map((item, index) => (
          <motion.div
            key={index}
            className="flex justify-start pt-6 md:pt-20 md:gap-10 relative"
            initial={{ opacity: 0, x: -100 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ 
              duration: 0.8, 
              delay: index * 0.2,
              ease: "easeOut"
            }}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            {/* Hover Glow Effect */}
            {hoveredIndex === index && (
              <motion.div
                className="absolute inset-0 rounded-2xl pointer-events-none"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                style={{
                  background: `radial-gradient(circle at center, 
                    rgba(139, 92, 246, 0.1) 0%, 
                    rgba(236, 72, 153, 0.05) 50%, 
                    transparent 70%)`,
                  boxShadow: '0 0 50px rgba(139, 92, 246, 0.2)'
                }}
              />
            )}

            {/* Timeline Node */}
            <div className="sticky z-40 flex flex-col items-center self-start max-w-xs md:flex-row top-20 lg:max-w-sm md:w-full">
              <motion.div 
                className="absolute flex items-center justify-center w-12 h-12 rounded-full -left-[18px]"
                whileHover={{ scale: 1.2 }}
                style={{
                  background: `conic-gradient(from 0deg, 
                    #8B5CF6 0deg, 
                    #EC4899 120deg, 
                    #3B82F6 240deg, 
                    #8B5CF6 360deg)`,
                  boxShadow: hoveredIndex === index ? 
                    '0 0 30px rgba(139, 92, 246, 0.6), 0 0 60px rgba(236, 72, 153, 0.4)' : 
                    '0 0 20px rgba(139, 92, 246, 0.3)'
                }}
                animate={{
                  rotate: hoveredIndex === index ? 360 : 0,
                  scale: hoveredIndex === index ? 1.1 : 1
                }}
                transition={{ duration: 2, ease: "easeInOut" }}
              >
                <motion.div 
                  className="w-6 h-6 rounded-full bg-black border-2 border-white"
                  animate={{
                    boxShadow: hoveredIndex === index ? 
                      'inset 0 0 10px rgba(139, 92, 246, 0.8)' : 
                      'inset 0 0 5px rgba(139, 92, 246, 0.4)'
                  }}
                />
              </motion.div>
              
              {/* Desktop Info */}
              <motion.div 
                className="flex-col hidden gap-2 text-xl font-bold md:flex md:pl-20 md:text-4xl"
                whileHover={{ x: 10 }}
                transition={{ duration: 0.3 }}
              >
                <motion.h3 
                  className="text-2xl md:text-3xl bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent font-bold"
                  animate={{
                    scale: hoveredIndex === index ? 1.05 : 1
                  }}
                >
                  {item.date}
                </motion.h3>
                <motion.h3 
                  className="text-xl md:text-2xl text-white font-semibold"
                  animate={{
                    color: hoveredIndex === index ? '#EC4899' : '#ffffff'
                  }}
                >
                  {item.title}
                </motion.h3>
                <motion.h3 
                  className="text-lg md:text-xl text-gray-400 font-medium"
                  animate={{
                    color: hoveredIndex === index ? '#8B5CF6' : '#9CA3AF'
                  }}
                >
                  {item.job}
                </motion.h3>
              </motion.div>
            </div>

            {/* Content Section */}
            <motion.div 
              className="relative w-full pl-20 pr-4 md:pl-4 -mt-4"
              whileHover={{ x: 5 }}
              transition={{ duration: 0.3 }}
            >
              {/* Glass Card Background */}
              <motion.div
                className="absolute inset-0 rounded-2xl opacity-0"
                animate={{
                  opacity: hoveredIndex === index ? 1 : 0
                }}
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
                }}
              />
              
              {/* Mobile Info */}
              <div className="block mb-6 text-2xl font-bold text-left md:hidden relative z-10">
                <h3 className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                  {item.date}
                </h3>
                <h3 className="text-white mb-1">{item.title}</h3>
                <h3 className="text-gray-400 text-lg">{item.job}</h3>
              </div>
              
              {/* Content Items */}
              <div className="relative z-10 space-y-4">
                {item.contents.map((content, contentIndex) => (
                  <motion.div
                    key={contentIndex}
                    className="relative"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ 
                      duration: 0.6, 
                      delay: contentIndex * 0.1 
                    }}
                  >
                    {/* Content Bullet */}
                    <div className="flex items-start space-x-3">
                      <motion.div
                        className="w-2 h-2 rounded-full mt-2 flex-shrink-0"
                        style={{
                          background: `linear-gradient(45deg, 
                            ${['#8B5CF6', '#EC4899', '#3B82F6', '#10B981', '#F59E0B'][contentIndex % 5]}, 
                            ${['#EC4899', '#3B82F6', '#10B981', '#F59E0B', '#8B5CF6'][contentIndex % 5]})`
                        }}
                        animate={{
                          scale: hoveredIndex === index ? [1, 1.3, 1] : 1,
                          boxShadow: hoveredIndex === index ? 
                            `0 0 10px ${['#8B5CF6', '#EC4899', '#3B82F6', '#10B981', '#F59E0B'][contentIndex % 5]}` : 
                            'none'
                        }}
                        transition={{ 
                          duration: 2, 
                          repeat: hoveredIndex === index ? Infinity : 0,
                          ease: "easeInOut"
                        }}
                      />
                      <motion.p 
                        className="text-gray-300 leading-relaxed text-sm md:text-base"
                        whileHover={{ 
                          color: '#ffffff',
                          x: 5
                        }}
                        transition={{ duration: 0.2 }}
                      >
                        {content}
                      </motion.p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        ))}
        
        {/* Enhanced Timeline Line */}
        <div
          style={{ height: height + "px" }}
          className="absolute md:left-1 left-1 top-0 overflow-hidden w-[3px] rounded-full"
        >
          {/* Background Line */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-700 to-transparent opacity-50" />
          
          {/* Animated Progress Line */}
          <motion.div
            style={{
              height: heightTransform,
              opacity: opacityTransform,
            }}
            className="absolute inset-x-0 top-0 w-[3px] rounded-full"
            animate={{
              background: [
                'linear-gradient(to bottom, #8B5CF6 0%, #EC4899 50%, #3B82F6 100%)',
                'linear-gradient(to bottom, #EC4899 0%, #3B82F6 50%, #10B981 100%)',
                'linear-gradient(to bottom, #3B82F6 0%, #10B981 50%, #F59E0B 100%)',
                'linear-gradient(to bottom, #8B5CF6 0%, #EC4899 50%, #3B82F6 100%)'
              ],
              boxShadow: [
                '0 0 20px rgba(139, 92, 246, 0.6)',
                '0 0 20px rgba(236, 72, 153, 0.6)',
                '0 0 20px rgba(59, 130, 246, 0.6)',
                '0 0 20px rgba(139, 92, 246, 0.6)'
              ]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          
          {/* Glowing Orb at Progress End */}
          <motion.div
            style={{
              top: heightTransform,
              opacity: opacityTransform,
            }}
            className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full"
            animate={{
              background: [
                'radial-gradient(circle, #8B5CF6 0%, transparent 70%)',
                'radial-gradient(circle, #EC4899 0%, transparent 70%)',
                'radial-gradient(circle, #3B82F6 0%, transparent 70%)',
                'radial-gradient(circle, #8B5CF6 0%, transparent 70%)'
              ],
              scale: [1, 1.5, 1],
              boxShadow: [
                '0 0 20px rgba(139, 92, 246, 0.8)',
                '0 0 20px rgba(236, 72, 153, 0.8)',
                '0 0 20px rgba(59, 130, 246, 0.8)',
                '0 0 20px rgba(139, 92, 246, 0.8)'
              ]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>
      </div>
    </div>
  );
};
