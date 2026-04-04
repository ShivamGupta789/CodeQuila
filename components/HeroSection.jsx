'use client';

import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import NeuralNetworkVisualization from '@/three/NeuralNetwork';

export default function HeroSection({ onStart }) {
  return (
    <section className="relative w-full h-screen min-h-[700px] flex items-center justify-center overflow-hidden">
      {/* Background Neural Network */}
      <div className="absolute inset-0 z-0">
        <NeuralNetworkVisualization />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-cyber-bg"></div>
      </div>
      
      <div className="container relative z-10 px-4 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col items-center"
        >
          <div className="px-4 py-1.5 mb-6 glass rounded-full border-[rgba(0,242,255,0.3)] shadow-[0_0_15px_rgba(0,242,255,0.2)]">
            <span className="text-[10px] font-mono tracking-widest text-[#00f2ff] uppercase">Secure | AI | Verification</span>
          </div>
          
          <h1 className="text-5xl md:text-8xl font-black tracking-tight mb-8">
            The TrustLens <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00f2ff] via-[#7000ff] to-[#ff00e5] font-black italic">
              Multimodal Engine
            </span>
          </h1>
          
          <p className="max-w-2xl text-lg md:text-xl text-[#ffffff80] mb-12 font-light leading-relaxed">
            Protecting the truth in a digital world. Detect deepfakes, manipulated media, 
            and AI-generated synthesis across video, audio, and images with 99.8% precision.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6">
            <button 
              onClick={onStart}
              className="group cyber-button flex items-center justify-center gap-2 text-glow hover:scale-105"
            >
              LAUNCH SCANNER
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="px-8 py-3 rounded-full bg-[#ffffff05] border border-[#ffffff10] text-white font-semibold hover:bg-[#ffffff10] transition-colors">
              VIEW CASE STUDIES
            </button>
          </div>
        </motion.div>
      </div>

      {/* Floating stats */}
      <div className="hidden lg:flex absolute bottom-12 left-12 flex-col gap-4 text-[10px] font-mono tracking-widest text-[#ffffff40]">
        <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00f2ff] shadow-[0_0_10px_#00f2ff]"></span>
            LATENCY: 12ms
        </div>
        <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00f2ff] shadow-[0_0_10px_#00f2ff]"></span>
            NODES ACTIVE: 4102
        </div>
        <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00f2ff] shadow-[0_0_10px_#00f2ff]"></span>
            PROTOCOL: SHIELD-X
        </div>
      </div>
    </section>
  );
}
