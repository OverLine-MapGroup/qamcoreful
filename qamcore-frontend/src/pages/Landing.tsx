import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Header } from "../components/Header";
// import { Footer } from "../components/Footer";
import "../styles/landing.css";

export const Landing = () => {
  return (
    <div className="landing-container">
      {/* SVG Filter for liquid glass distortion effect */}
      <svg width="0" height="0" style={{ position: "absolute" }}>
        <defs>
          <filter id="glass-distortion" x="-50%" y="-50%" width="200%" height="200%">
            <feTurbulence 
              type="fractalNoise" 
              baseFrequency="0.015 0.015" 
              numOctaves="2" 
              seed="1" 
              result="turbulence"
            />
            <feGaussianBlur in="turbulence" stdDeviation="0.5" result="blurred"/>
            <feDisplacementMap 
              in="SourceGraphic" 
              in2="blurred" 
              scale="4" 
              xChannelSelector="R" 
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>

      {/* Animated gradient background */}
      <div className="gradient-bg">
        <motion.div
          animate={{
            x: [0, 60, -30, 0],
            y: [0, -40, 50, 0],
            scale: [1, 1.15, 0.95, 1],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="gradient-blob blob-1"
        />
        
        <motion.div
          animate={{
            x: [0, -50, 40, 0],
            y: [0, 60, -30, 0],
            scale: [1, 0.9, 1.1, 1],
          }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
          className="gradient-blob blob-2"
        />
        
        <motion.div
          animate={{
            x: [0, 40, -50, 0],
            y: [0, -50, 30, 0],
            scale: [1, 1.1, 0.9, 1],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="gradient-blob blob-3"
        />
      </div>

      <Header />

      <main className="main">
        <motion.h1 
          initial={{ opacity: 0, y: 30, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="hero-title"
        >
          QamCore AI — предиктивная платформа для защиты ментального благополучия
          и предотвращения критических потерь
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <Link to="/login" className="liquid-glass-button">
            <span>Войти</span>
          </Link>
        </motion.div>
      </main>

      {/* <Footer /> */}
    </div>
  );
};
