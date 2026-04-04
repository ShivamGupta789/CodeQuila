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

  // Speedometer math
  // Arc goes from -210 degrees to 30 degrees (240 degree total sweep)
  const rotation = (score / 100) * 240 - 210;

  return (
    <div className="relative flex flex-col items-center justify-center" style={{ width: size, height: size * 0.8 }}>
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
          stroke="url(#gauge-gradient)"
          strokeWidth="6"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: score / 100 }}
          transition={{ duration: 2, ease: "easeOut" }}
        />

        <defs>
          <linearGradient id="gauge-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#7000ff" />
            <stop offset="50%" stopColor="#00f2ff" />
            <stop offset="100%" stopColor="#00f2ff" />
          </linearGradient>
        </defs>

        {/* Ticks */}
        {[...Array(11)].map((_, i) => {
          const angle = (i * 24 - 210) * (Math.PI / 180);
          const x1 = 50 + 35 * Math.cos(angle);
          const y1 = 45 + 35 * Math.sin(angle);
          const x2 = 50 + 42 * Math.cos(angle);
          const y2 = 45 + 42 * Math.sin(angle);
          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={i / 10 <= score / 100 ? "#00f2ff" : "#1a2b3b"}
              strokeWidth="1"
              strokeOpacity={i / 10 <= score / 100 ? "0.8" : "0.3"}
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
            stroke="#00f2ff"
            strokeWidth="3"
            strokeLinecap="round"
            className="drop-shadow-[0_0_8px_#00f2ff]"
          />
          <circle cx="50" cy="45" r="4" fill="#00f2ff" />
        </motion.g>
      </svg>

      {/* Numerical Display */}
      <div className="absolute top-[60%] flex flex-col items-center">
        <motion.span 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-black text-[#00f2ff] text-glow leading-none"
        >
          {displayScore.toFixed(1)}
        </motion.span>
        <span className="text-[10px] font-mono text-[#ffffff40] uppercase tracking-widest mt-1">Authenticity</span>
      </div>
      
      {/* Glow effect for high scores */}
      {score > 90 && (
         <div className="absolute inset-0 bg-[#00f2ff10] blur-3xl rounded-full opacity-40 animate-pulse pointer-events-none"></div>
      )}
    </div>
  );
}
