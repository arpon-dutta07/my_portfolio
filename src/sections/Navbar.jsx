import { useState } from "react";
import { motion } from "framer-motion";
import Music from "../components/music";
import { SparklesCore } from "../components/ui/sparkles";

function Navigation() {
  return (
    <ul className="nav-ul flex items-center gap-6">
      <li className="nav-li"><a className="nav-link" href="#home">Home</a></li>
      <li className="nav-li"><a className="nav-link" href="#about">About</a></li>
      <li className="nav-li"><a className="nav-link" href="#work">Work</a></li>
      <li className="nav-li"><a className="nav-link" href="#contact">Contact</a></li>
    </ul>
  );
}

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed inset-x-0 z-20 w-full backdrop-blur-lg bg-primary/40">
      {/* Sparkles Background */}
      <div className="absolute inset-0 w-full h-full">
        <SparklesCore
          id="navbar-sparkles"
          background="transparent"
          minSize={0.4}
          maxSize={1.4}
          particleDensity={50}
          className="w-full h-full"
          particleColor="#ffffff"
          speed={1}
        />
      </div>
      <div className="mx-auto c-space max-w-7xl relative z-10">
        <div className="flex items-center justify-between py-2 sm:py-0">
          {/* Logo */}
          <a
            href="/"
            className="text-xl font-bold transition-colors text-neutral-400 hover:text-white"
          >
            Phoenix
          </a>

          {/* Desktop Navigation & Music */}
          <div className="hidden sm:flex items-center gap-6">
            <Navigation />
            <div className="ml-2"><Music /></div>
          </div>

          {/* Mobile Menu Toggle & Music - UPDATED THIS SECTION */}
          <div className="flex sm:hidden items-center gap-4">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-neutral-400 hover:text-white focus:outline-none"
            >
              <img
                src={isOpen ? "assets/close.svg" : "assets/menu.svg"}
                className="w-6 h-6"
                alt="toggle"
              />
            </button>
            <div className="ml-7"><Music /></div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isOpen && (
        <motion.div
          className="block overflow-hidden text-center sm:hidden"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          style={{ maxHeight: "100vh" }}
        >
          <nav className="pb-5">
            <Navigation />
          </nav>
        </motion.div>
      )}
    </div>
  );
};

export default Navbar;