'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function AccuracyGauge({ score = 0, size = 200 }) {
  const [displayScore, setDisplayScore] = useState(0);

  useEffect(() => {
    // Animate the number count
    const timeout = setTimeout(() => {
      setDisplayScore(score);
    }, 500);
    return () => clearTimeout(timeout);
  }, [score]);

  // Dynamic color based on score
  const getScoreColor = (s) => {
    if (s > 80) return "#4ade80"; // Bright Green
    if (s > 60) return "#facc15"; // Yellow
    return "#f87171"; // Red
  };

  const currentColor = getScoreColor(score);
  const rotation = (score / 100) * 240 - 210;

  return (
    <div className="relative flex flex-col items-center justify-center transition-colors duration-1000" style={{ width: size, height: size * 0.8 }}>
      <svg
        viewBox="0 0 100 80"
        className="w-full h-full overflow-visible"
      >
        {/* Background Track */}
        <path
          d="M10 70 A 40 40 0 1 1 90 70"
          fill="none"
          stroke="#1a2b3b"
          strokeWidth="6"
          strokeLinecap="round"
          className="opacity-50"
        />

        {/* Progress Arc */}
        <motion.path
          d="M10 70 A 40 40 0 1 1 90 70"
          fill="none"
          stroke={currentColor}
          strokeWidth="6"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: score / 100 }}
          transition={{ duration: 2, ease: "easeOut" }}
          style={{ filter: `drop-shadow(0 0 8px ${currentColor}40)` }}
        />

        {/* Ticks */}
        {[...Array(11)].map((_, i) => {
          const angle = (i * 24 - 210) * (Math.PI / 180);
          const x1 = 50 + 35 * Math.cos(angle);
          const y1 = 45 + 35 * Math.sin(angle);
          const x2 = 50 + 42 * Math.cos(angle);
          const y2 = 45 + 42 * Math.sin(angle);
          const isFilled = i / 10 <= score / 100;
          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={isFilled ? currentColor : "#1a2b3b"}
              strokeWidth="1"
              strokeOpacity={isFilled ? "0.8" : "0.3"}
              className="transition-colors duration-1000"
            />
          );
        })}

        {/* Needle */}
        <motion.g
          style={{ originX: "50px", originY: "45px" }}
          initial={{ rotate: -210 }}
          animate={{ rotate: rotation }}
          transition={{ duration: 2, ease: "backOut" }}
        >
          <path
            d="M50 45 L50 15"
            stroke={currentColor}
            strokeWidth="3"
            strokeLinecap="round"
            className="transition-colors duration-1000"
            style={{ filter: `drop-shadow(0 0 8px ${currentColor})` }}
          />
          <circle cx="50" cy="45" r="4" fill={currentColor} className="transition-colors duration-1000" />
        </motion.g>
      </svg>

      {/* Numerical Display */}
      <div className="absolute top-[60%] flex flex-col items-center">
        <motion.span 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-black transition-colors duration-1000"
          style={{ color: currentColor, textShadow: `0 0 15px ${currentColor}40` }}
        >
          {displayScore.toFixed(1)}%
        </motion.span>
        <span className="text-[10px] font-mono text-[#ffffff40] uppercase tracking-widest mt-1">Authenticity Index</span>
      </div>
      
      {/* Background Glow */}
      <div 
        className="absolute inset-0 blur-3xl rounded-full opacity-10 pointer-events-none transition-colors duration-1000"
        style={{ backgroundColor: currentColor }}
      ></div>
    </div>
  );
}
