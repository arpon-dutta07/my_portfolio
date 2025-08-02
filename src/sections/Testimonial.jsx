"use client";
import { twMerge } from "tailwind-merge";
import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import Marquee from "../components/Marquee";
import { reviews } from "../constants";

const firstRow = reviews.slice(0, reviews.length / 2);
const secondRow = reviews.slice(reviews.length / 2);

const ReviewCard = ({ img, name, username, body, index }) => {
  return (
    <motion.figure
      className={twMerge(
        "relative h-full w-64 cursor-pointer overflow-hidden rounded-xl border p-4 border-gray-50/[.1] bg-gradient-to-br from-indigo-900/30 via-purple-900/20 to-pink-900/30 backdrop-blur-sm hover:from-indigo-900/40 hover:via-purple-900/30 hover:to-pink-900/40 transition-all duration-300"
      )}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ 
        duration: 0.5, 
        delay: index * 0.05,
        ease: "easeOut"
      }}
      whileHover={{ 
        scale: 1.02,
        transition: { duration: 0.2 }
      }}
    >
      {/* Subtle Background Effect */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-xl">
        <div
          className="absolute inset-0 opacity-20 hover:opacity-30 transition-opacity duration-300"
          style={{
            background: 'linear-gradient(45deg, rgba(139, 92, 246, 0.1) 0%, rgba(236, 72, 153, 0.1) 50%, rgba(59, 130, 246, 0.1) 100%)'
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10">
        <div className="flex flex-row items-center gap-2">
          <img
            className="rounded-full bg-white/10 border border-purple-500/20 hover:border-purple-500/40 transition-colors duration-200"
            width="32"
            height="32"
            alt=""
            src={img}
          />
          <div className="flex flex-col">
            <figcaption className="text-sm font-medium text-white hover:text-pink-300 transition-colors duration-200">
              {name}
            </figcaption>
            <p className="text-xs font-medium text-white/40 hover:text-purple-300 transition-colors duration-200">
              {username}
            </p>
          </div>
        </div>
        
        <blockquote className="mt-2 text-sm text-gray-300 leading-relaxed hover:text-white transition-colors duration-200">
          {body}
        </blockquote>
      </div>

      {/* Quote Icon */}
      <div className="absolute top-2 right-2 text-purple-400/30">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
        </svg>
      </div>
    </motion.figure>
  );
};

export default function Testimonial() {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  return (
    <motion.div 
      ref={containerRef}
      className="items-start mt-25 md:mt-35 c-space relative"
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Subtle Background Effect */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute inset-0 opacity-5"
          style={{
            background: 'linear-gradient(45deg, rgba(139, 92, 246, 0.1) 0%, rgba(236, 72, 153, 0.05) 50%, rgba(59, 130, 246, 0.1) 100%)'
          }}
        />
      </div>

      {/* Enhanced Title */}
      <motion.div className="relative z-10 text-center mb-12">
        <motion.h2 
          className="text-heading relative"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
            Hear From My Clients
          </span>
        </motion.h2>
        
        {/* Simple Divider */}
        <motion.div 
          className="flex justify-center items-center space-x-4 mt-6"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <div className="w-12 h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent"></div>
          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
          <div className="w-24 h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500"></div>
          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          <div className="w-12 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent"></div>
        </motion.div>
      </motion.div>

      {/* Optimized Marquee Container */}
      <motion.div 
        className="relative flex flex-col items-center justify-center w-full mt-12 overflow-hidden"
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        {/* First Row */}
        <Marquee pauseOnHover className="[--duration:20s] mb-4">
          {firstRow.map((review, index) => (
            <ReviewCard key={review.username} {...review} index={index} />
          ))}
        </Marquee>

        {/* Second Row */}
        <Marquee reverse pauseOnHover className="[--duration:20s]">
          {secondRow.map((review, index) => (
            <ReviewCard key={review.username} {...review} index={index + firstRow.length} />
          ))}
        </Marquee>

        {/* Simple Gradient Overlays */}
        <div className="absolute inset-y-0 left-0 w-1/4 pointer-events-none bg-gradient-to-r from-primary z-20"></div>
        <div className="absolute inset-y-0 right-0 w-1/4 pointer-events-none bg-gradient-to-l from-primary z-20"></div>
      </motion.div>
    </motion.div>
  );
}
