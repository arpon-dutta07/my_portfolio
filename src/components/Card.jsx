import { motion } from "motion/react";
const Card = ({ style, text, image, containerRef }) => {
  return image && !text ? (
    <motion.img
      className="absolute w-15 cursor-grab"
      src={image}
      style={style}
      whileHover={{ 
        scale: 1.05,
        filter: "drop-shadow(0 0 12px rgba(232, 121, 249, 0.8))" // Fuchsia-pink glow
        }}
      drag
      dragConstraints={containerRef}
      dragElastic={1}
    />
  ) : (
    <motion.div
      className="absolute px-1 py-4 text-xl text-center rounded-full ring ring-gray-700 font-extralight bg-storm w-[12rem] cursor-grab"
      style={style}
      whileHover={{ 
        scale: 1.05,
        textShadow: "0px 0px 12px rgba(255,255,255,0.7)" // White glow
        }}
      drag
      dragConstraints={containerRef}
      dragElastic={1}
    >
      {text}
    </motion.div>
  );
};

export default Card;