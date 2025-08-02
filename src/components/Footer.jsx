"use client";
import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";

const Footer = () => {
  const footerRef = useRef(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [particles, setParticles] = useState([]);
  const isInView = useInView(footerRef, { once: true, margin: "-50px" });

  // Generate magical particles
  useEffect(() => {
    const generateParticles = () => {
      const newParticles = Array.from({ length: 12 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 3 + 1,
        opacity: Math.random() * 0.4 + 0.2,
        color: ['#8B5CF6', '#EC4899', '#3B82F6', '#10B981', '#F59E0B'][Math.floor(Math.random() * 5)],
        speed: Math.random() * 0.3 + 0.1,
        direction: Math.random() * 360
      }));
      setParticles(newParticles);
    };

    if (isInView) {
      generateParticles();
    }
  }, [isInView]);

  // Animate particles
  useEffect(() => {
    if (!isInView) return;
    
    const animateParticles = () => {
      setParticles(prev => prev.map(particle => ({
        ...particle,
        x: (particle.x + Math.cos(particle.direction * Math.PI / 180) * particle.speed * 0.02) % 100,
        y: (particle.y + Math.sin(particle.direction * Math.PI / 180) * particle.speed * 0.02) % 100,
        direction: particle.direction + 0.1
      })));
    };

    const interval = setInterval(animateParticles, 100);
    return () => clearInterval(interval);
  }, [isInView]);

  const handleMouseMove = (e) => {
    const rect = footerRef.current?.getBoundingClientRect();
    if (rect) {
      setMousePosition({
        x: ((e.clientX - rect.left) / rect.width) * 100,
        y: ((e.clientY - rect.top) / rect.height) * 100
      });
    }
  };

  // Smooth scroll to section function
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  // Navigation items with their corresponding section IDs
  const navigationItems = [
    { name: 'Home', sectionId: 'home', icon: '🏠' },
    { name: 'About', sectionId: 'about', icon: '👨‍💻' },
    { name: 'Work', sectionId: 'work', icon: '💼' },
    { name: 'Contact', sectionId: 'contact', icon: '📧' }
  ];

  // Social media links with icons
  const socialLinks = [
    {
      name: 'Instagram',
      url: 'https://www.instagram.com/arpon_._dutta?igsh=bmhreWxvcnlmdnh1',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
        </svg>
      )
    },
    {
      name: 'Discord',
      url: 'https://discord.com',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
        </svg>
      )
    },
    {
      name: 'Facebook',
      url: 'https://www.facebook.com/arpon.dutta.524',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      )
    },
    {
      name: 'Github',
      url: 'https://github.com/arpon-dutta07',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
        </svg>
      )
    },
    {
      name: 'LinkedIn',
      url: 'https://www.linkedin.com/in/arpon-dutta-009a88360?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
      )
    },
    {
      name: 'WhatsApp',
      url: 'https://wa.me/7595842466',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.488"/>
        </svg>
      )
    }
  ];

  return (
    <motion.footer
      ref={footerRef}
      className="relative bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white overflow-hidden min-h-screen flex items-center justify-center"
      onMouseMove={handleMouseMove}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 1.2 }}
    >
      {/* Epic Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Dynamic Mouse-Following Gradient */}
        <motion.div
          className="absolute inset-0 opacity-30"
          style={{
            background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, 
              rgba(139, 92, 246, 0.3) 0%, 
              rgba(236, 72, 153, 0.2) 30%, 
              rgba(59, 130, 246, 0.2) 60%, 
              transparent 80%)`,
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
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
              scale: [1, 1.5, 1],
              opacity: [particle.opacity, particle.opacity * 2, particle.opacity]
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 2
            }}
          />
        ))}
        
        {/* Cosmic Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
              linear-gradient(rgba(139, 92, 246, 0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(139, 92, 246, 0.3) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
            transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px)`
          }}
        />

        {/* Animated Waves */}
        <motion.div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(90deg, 
              transparent 0%, 
              rgba(139, 92, 246, 0.1) 25%, 
              rgba(236, 72, 153, 0.1) 50%, 
              rgba(59, 130, 246, 0.1) 75%, 
              transparent 100%)`,
            filter: 'blur(1px)'
          }}
          animate={{
            x: ['-100%', '100%'],
            opacity: [0, 0.5, 0]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {/* Centered Main Content */}
        <motion.div 
          className="flex flex-col items-center justify-center min-h-[80vh] space-y-16"
          initial={{ y: 100, opacity: 0 }}
          animate={isInView ? { y: 0, opacity: 1 } : { y: 100, opacity: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          
          {/* Epic Title Section */}
          <motion.div 
            className="text-center space-y-8"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={isInView ? { scale: 1, opacity: 1 } : { scale: 0.8, opacity: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            <motion.h2 
              className="text-4xl md:text-6xl font-bold relative"
              animate={{
                textShadow: [
                  '0 0 20px rgba(139, 92, 246, 0.5)',
                  '0 0 40px rgba(236, 72, 153, 0.7)',
                  '0 0 20px rgba(139, 92, 246, 0.5)'
                ]
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                Let's Connect
              </span>
              
              {/* Glowing Shadow */}
              <span className="absolute inset-0 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent blur-2xl opacity-50">
                Let's Connect
              </span>
            </motion.h2>

            {/* Animated Divider */}
            <motion.div 
              className="flex justify-center items-center space-x-6"
              initial={{ opacity: 0, scale: 0 }}
              animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
            >
              <motion.div 
                className="w-20 h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent"
                animate={{ scaleX: [1, 1.5, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <motion.div 
                className="w-4 h-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                animate={{ 
                  scale: [1, 1.3, 1],
                  rotate: [0, 180, 360]
                }}
                transition={{ duration: 3, repeat: Infinity }}
              />
              <motion.div 
                className="w-32 h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500"
                animate={{ scaleX: [1, 1.2, 1] }}
                transition={{ duration: 2.5, repeat: Infinity }}
              />
              <motion.div 
                className="w-4 h-4 bg-gradient-to-r from-pink-500 to-blue-500 rounded-full"
                animate={{ 
                  scale: [1, 1.3, 1],
                  rotate: [360, 180, 0]
                }}
                transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
              />
              <motion.div 
                className="w-20 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent"
                animate={{ scaleX: [1, 1.5, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: 1 }}
              />
            </motion.div>
          </motion.div>

          {/* Main Content Grid - Perfectly Centered */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 w-full max-w-6xl">
            
            {/* Left Section - Navigation */}
            <motion.div
              className="flex flex-col items-center text-center space-y-8"
              initial={{ x: -100, opacity: 0 }}
              animate={isInView ? { x: 0, opacity: 1 } : { x: -100, opacity: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <motion.h3 
                className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent relative"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                Navigation
                <motion.div
                  className="absolute -inset-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg blur-lg"
                  animate={{ opacity: [0.3, 0.7, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </motion.h3>
              
              {/* Horizontal Navigation Items */}
              <div className="flex flex-wrap justify-center gap-4 lg:gap-6">
                {navigationItems.map((item, index) => (
                  <motion.button
                    key={item.name}
                    onClick={() => scrollToSection(item.sectionId)}
                    className="group relative px-4 py-2 bg-gradient-to-r from-gray-800/50 to-gray-700/50 rounded-xl border border-gray-600/30 hover:border-purple-500/50 transition-all duration-500 backdrop-blur-sm"
                    whileHover={{ 
                      scale: 1.05,
                      rotateY: 5,
                      boxShadow: "0 20px 40px rgba(139, 92, 246, 0.3)"
                    }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, y: 30, rotateX: 15 }}
                    animate={isInView ? { opacity: 1, y: 0, rotateX: 0 } : { opacity: 0, y: 30, rotateX: 15 }}
                    transition={{ duration: 0.6, delay: 0.9 + index * 0.1 }}
                  >
                    {/* Magical Background */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-blue-500/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      animate={{
                        background: [
                          'linear-gradient(45deg, rgba(139, 92, 246, 0.2) 0%, rgba(236, 72, 153, 0.2) 100%)',
                          'linear-gradient(45deg, rgba(236, 72, 153, 0.2) 0%, rgba(59, 130, 246, 0.2) 100%)',
                          'linear-gradient(45deg, rgba(139, 92, 246, 0.2) 0%, rgba(236, 72, 153, 0.2) 100%)'
                        ]
                      }}
                      transition={{ duration: 3, repeat: Infinity }}
                    />
                    
                    <div className="relative z-10 flex items-center justify-center space-x-3">
                      <motion.span 
                        className="text-lg"
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
                      >
                        {item.icon}
                      </motion.span>
                      <span className="text-sm font-semibold text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-300 group-hover:to-pink-300 group-hover:bg-clip-text transition-all duration-300">
                        {item.name}
                      </span>
                    </div>

                    {/* Shimmer Effect */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 rounded-2xl"
                      animate={{ x: ['-100%', '100%'] }}
                      transition={{ duration: 1.5, ease: "easeInOut" }}
                    />
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Right Section - Social Media */}
            <motion.div
              className="flex flex-col items-center text-center space-y-8"
              initial={{ x: 100, opacity: 0 }}
              animate={isInView ? { x: 0, opacity: 1 } : { x: 100, opacity: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <motion.h3 
                className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent relative"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                Explore
                <motion.div
                  className="absolute -inset-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg blur-lg"
                  animate={{ opacity: [0.3, 0.7, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                />
              </motion.h3>
              
              {/* Horizontal Social Media Icons */}
              <div className="flex flex-wrap justify-center gap-3 lg:gap-4">
                {socialLinks.map((social, index) => {
                  // Define actual brand colors for each social platform
                  const brandColors = {
                    'Instagram': { 
                      bg: 'linear-gradient(45deg, #f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%)',
                      shadow: '225, 48, 108',
                      glow: '#e1306c'
                    },
                    'Discord': { 
                      bg: 'linear-gradient(45deg, #5865f2 0%, #7289da 100%)',
                      shadow: '88, 101, 242',
                      glow: '#5865f2'
                    },
                    'Facebook': { 
                      bg: 'linear-gradient(45deg, #1877f2 0%, #42a5f5 100%)',
                      shadow: '24, 119, 242',
                      glow: '#1877f2'
                    },
                    'Github': { 
                      bg: 'linear-gradient(45deg, #333 0%, #24292e 100%)',
                      shadow: '36, 41, 46',
                      glow: '#f0f6fc'
                    },
                    'LinkedIn': { 
                      bg: 'linear-gradient(45deg, #0077b5 0%, #00a0dc 100%)',
                      shadow: '0, 119, 181',
                      glow: '#0077b5'
                    },
                    'WhatsApp': { 
                      bg: 'linear-gradient(45deg, #25d366 0%, #128c7e 100%)',
                      shadow: '37, 211, 102',
                      glow: '#25d366'
                    }
                  };
                  
                  const colors = brandColors[social.name] || brandColors['Github'];
                  
                  return (
                    <motion.a
                      key={social.name}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative p-4 rounded-xl bg-gradient-to-br from-gray-800/60 to-gray-700/60 border border-gray-600/30 transition-all duration-500 backdrop-blur-sm overflow-hidden"
                      whileHover={{ 
                        scale: 1.2,
                        rotateY: 15,
                        rotateX: 10,
                        z: 50
                      }}
                      whileTap={{ scale: 0.9 }}
                      initial={{ opacity: 0, scale: 0, rotateY: 45 }}
                      animate={isInView ? { opacity: 1, scale: 1, rotateY: 0 } : { opacity: 0, scale: 0, rotateY: 45 }}
                      transition={{ duration: 0.6, delay: 1 + index * 0.1 }}
                      style={{
                        boxShadow: `0 0 0 rgba(${colors.shadow}, 0)`,
                      }}
                      onHoverStart={() => {}}
                    >
                      {/* Brand Color Background on Hover */}
                      <motion.div
                        className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                        style={{
                          background: colors.bg,
                        }}
                        initial={{ scale: 0, rotate: 0 }}
                        whileHover={{ 
                          scale: 1.1, 
                          rotate: 360,
                        }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                      />
                      
                      {/* Pulsing Glow Effect */}
                      <motion.div
                        className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-60"
                        style={{
                          background: `radial-gradient(circle, ${colors.glow}40 0%, transparent 70%)`,
                          filter: 'blur(10px)',
                        }}
                        animate={{
                          scale: [1, 1.5, 1],
                          opacity: [0, 0.6, 0]
                        }}
                        transition={{ 
                          duration: 2, 
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      />
                      
                      {/* Sparkle Particles */}
                      <motion.div
                        className="absolute inset-0 pointer-events-none"
                        initial={{ opacity: 0 }}
                        whileHover={{ opacity: 1 }}
                      >
                        {[...Array(6)].map((_, i) => (
                          <motion.div
                            key={i}
                            className="absolute w-1 h-1 bg-white rounded-full"
                            style={{
                              left: `${20 + i * 10}%`,
                              top: `${20 + (i % 2) * 40}%`,
                            }}
                            animate={{
                              scale: [0, 1, 0],
                              opacity: [0, 1, 0],
                              rotate: [0, 180, 360]
                            }}
                            transition={{
                              duration: 1.5,
                              repeat: Infinity,
                              delay: i * 0.2,
                              ease: "easeInOut"
                            }}
                          />
                        ))}
                      </motion.div>
                      
                      {/* Icon with Color Transition */}
                      <motion.div 
                        className="relative z-10 text-gray-400 group-hover:text-white transition-all duration-500"
                        whileHover={{ 
                          scale: 1.1,
                          rotate: [0, -10, 10, 0],
                          filter: "drop-shadow(0 0 10px rgba(255,255,255,0.8))"
                        }}
                        transition={{ duration: 0.6 }}
                      >
                        <motion.div
                          animate={{ 
                            rotate: [0, 5, -5, 0],
                          }}
                          transition={{ 
                            duration: 3, 
                            repeat: Infinity, 
                            delay: index * 0.3 
                          }}
                        >
                          {social.icon}
                        </motion.div>
                      </motion.div>
                      
                      {/* Enhanced Tooltip with Brand Colors */}
                      <motion.div 
                        className="absolute -top-10 left-1/2 transform -translate-x-1/2 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none shadow-lg whitespace-nowrap z-50"
                        style={{
                          background: colors.bg,
                          boxShadow: `0 4px 20px rgba(${colors.shadow}, 0.4)`
                        }}
                        whileHover={{ scale: 1.05, y: -2 }}
                      >
                        {social.name}
                        <div 
                          className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent"
                          style={{ borderTopColor: colors.glow }}
                        />
                      </motion.div>

                      {/* Ripple Effect on Hover */}
                      <motion.div
                        className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-30"
                        style={{
                          background: `radial-gradient(circle at center, ${colors.glow} 0%, transparent 70%)`
                        }}
                        initial={{ scale: 0 }}
                        whileHover={{ 
                          scale: [0, 1.5, 2],
                          opacity: [0, 0.3, 0]
                        }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                      />
                    </motion.a>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Epic Separator */}
        <motion.div
          className="relative my-16"
          initial={{ scaleX: 0, opacity: 0 }}
          animate={isInView ? { scaleX: 1, opacity: 1 } : { scaleX: 0, opacity: 0 }}
          transition={{ duration: 1.2, delay: 1.5 }}
        >
          <div className="h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent" />
          <motion.div
            className="absolute inset-0 h-px bg-gradient-to-r from-transparent via-white to-transparent"
            animate={{ x: ['-100%', '100%'] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          />
        </motion.div>

        {/* Enhanced Bottom Bar */}
        <motion.div
          className="text-center py-8 space-y-6"
          initial={{ y: 50, opacity: 0 }}
          animate={isInView ? { y: 0, opacity: 1 } : { y: 50, opacity: 0 }}
          transition={{ duration: 0.8, delay: 1.8 }}
        >
          <motion.p 
            className="text-gray-400 text-sm md:text-base relative"
            whileHover={{ scale: 1.02 }}
          >
            © 2025 <motion.span 
              className="text-white font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"
              animate={{ 
                textShadow: [
                  '0 0 10px rgba(139, 92, 246, 0.5)',
                  '0 0 20px rgba(236, 72, 153, 0.7)',
                  '0 0 10px rgba(139, 92, 246, 0.5)'
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              Arpon Dutta
            </motion.span>. All rights reserved.
          </motion.p>
          
          {/* Epic Decorative Elements */}
          <motion.div 
            className="flex justify-center items-center space-x-4"
            initial={{ opacity: 0, scale: 0 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
            transition={{ duration: 0.6, delay: 2 }}
          >
            {[
              { color: 'bg-purple-500', size: 'w-3 h-3', delay: 0 },
              { color: 'bg-pink-500', size: 'w-2 h-2', delay: 0.3 },
              { color: 'bg-blue-500', size: 'w-4 h-4', delay: 0.6 },
              { color: 'bg-green-500', size: 'w-2 h-2', delay: 0.9 },
              { color: 'bg-yellow-500', size: 'w-3 h-3', delay: 1.2 }
            ].map((dot, index) => (
              <motion.div
                key={index}
                className={`${dot.color} ${dot.size} rounded-full`}
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 1, 0.5],
                  y: [0, -10, 0]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: dot.delay,
                  ease: "easeInOut"
                }}
              />
            ))}
          </motion.div>
        </motion.div>
      </div>
    </motion.footer>
  );
};

export default Footer;