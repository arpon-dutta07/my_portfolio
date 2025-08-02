"use client";
import { twMerge } from "tailwind-merge";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export default function Marquee({
  className,
  reverse = false,
  pauseOnHover = false,
  children,
  vertical = false,
  repeat = 4,
  ...props
}) {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={containerRef}
      {...props}
      className={twMerge(
        `group relative flex overflow-hidden p-2 [--duration:40s] [--gap:1rem] [gap:var(--gap)] ${
          vertical ? "flex-col" : "flex-row"
        }`,
        className
      )}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {/* Subtle Background Effect */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            background: `linear-gradient(45deg, 
              rgba(139, 92, 246, 0.1) 0%, 
              rgba(236, 72, 153, 0.05) 50%, 
              rgba(59, 130, 246, 0.1) 100%)`
          }}
        />
      </div>

      {/* Optimized Marquee Content */}
      {Array(repeat)
        .fill(0)
        .map((_, i) => (
          <div
            key={i}
            className={twMerge(
              "flex shrink-0 justify-around [gap:var(--gap)] relative z-10",
              vertical
                ? "animate-marquee-vertical flex-col"
                : "animate-marquee flex-row",
              pauseOnHover && "group-hover:[animation-play-state:paused]",
              reverse && "[animation-direction:reverse]"
            )}
          >
            {children}
          </div>
        ))}
    </motion.div>
  );
}
