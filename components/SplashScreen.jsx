'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import gsap from 'gsap';

export default function SplashScreen({ finishLoading }) {
  const [loading, setLoading] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setLoading((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            finishLoading();
          }, 1000);
          return 100;
        }
        return prev + 1;
      });
    }, 30);

    // GSAP Glitch effect for title
    gsap.to(".splash-title", {
       opacity: 1,
       duration: 0.1,
       stagger: 0.05,
       ease: "power2.inOut",
       repeat: -1,
       repeatDelay: 2,
       yoyo: true
    });

    return () => clearInterval(timer);
  }, [finishLoading]);

  return (
    <motion.div 
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.5, ease: "easeInOut" }}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-cyber-bg overflow-hidden"
    >
      <div className="absolute inset-0 pointer-events-none neural-grid opacity-20"></div>
      
      {/* Animated Brain/Neural Network */}
      <div className="relative w-64 h-64 mb-12">
        <motion.div 
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 rounded-full bg-[#00f2ff] filter blur-[60px]"
        ></motion.div>
        
        {/* Simple animated brain nodes with SVG */}
        <svg viewBox="0 0 100 100" className="w-full h-full relative z-10 fill-none stroke-[#00f2ff] stroke-[0.5]">
          <motion.circle cx="50" cy="50" r="45" strokeOpacity="0.2" />
          <motion.circle cx="50" cy="50" r="30" strokeOpacity="0.4" />
          <motion.path 
            d="M50 5 L50 95 M5 50 L95 50 M20 20 L80 80 M20 80 L80 20" 
            strokeOpacity="0.1"
          />
          {[...Array(8)].map((_, i) => (
            <motion.circle 
              key={i}
              cx={50 + 40 * Math.cos(i * Math.PI / 4)}
              cy={50 + 40 * Math.sin(i * Math.PI / 4)}
              r="2"
              fill="#00f2ff"
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.5, 0] }}
              transition={{ 
                duration: 2, 
                repeat: Infinity, 
                delay: i * 0.2,
                ease: "easeInOut"
              }}
            />
          ))}
          <motion.circle 
            cx="50" cy="50" r="5" 
            fill="#00f2ff" 
            className="shadow-[0_0_20px_#00f2ff]"
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          />
        </svg>
      </div>

      <motion.h1 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="text-6xl md:text-8xl font-black tracking-tighter text-white text-glow mb-2 flex"
      >
        {"TRUSTLENS".split("").map((char, index) => (
          <span key={index} className="splash-title inline-block">{char}</span>
        ))}
      </motion.h1>

      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="text-[#00f2ff] font-mono tracking-widest text-sm uppercase mb-12"
      >
        Multimodal Deepfake Detection Engine
      </motion.p>

      {/* Loading Progress */}
      <div className="w-64 h-1 bg-[#ffffff10] rounded-full overflow-hidden relative border border-[#ffffff05]">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${loading}%` }}
          className="h-full bg-gradient-to-right bg-[#00f2ff] shadow-[0_0_10px_#00f2ff]"
        ></motion.div>
      </div>
      
      <div className="mt-4 font-mono text-[10px] text-[#ffffff40]">
        INITIALIZING CORE MODULES: {Math.floor(loading)}%
      </div>
    </motion.div>
  );
}
