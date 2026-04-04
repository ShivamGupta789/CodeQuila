'use client';

import { motion } from 'framer-motion';
import { Layers, ShieldCheck, Zap } from 'lucide-react';

const FeatureCard = ({ icon: Icon, title, description, delay }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      whileHover={{ scale: 1.05, borderColor: 'rgba(0, 242, 255, 0.4)' }}
      className="glass group relative p-8 flex flex-col gap-6 cursor-pointer overflow-hidden border border-[rgba(0,242,255,0.1)] transition-colors duration-300"
    >
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#00f2ff] to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
      <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-[#00f2ff08] border border-[#00f2ff15] group-hover:bg-[#00f2ff15] group-hover:border-[#00f2ff30] transition-all">
        <Icon className="w-8 h-8 text-[#00f2ff] group-hover:scale-110 transition-transform" />
      </div>
      
      <div className="flex flex-col gap-2">
        <h3 className="text-2xl font-bold text-white group-hover:text-[#00f2ff] transition-colors">{title}</h3>
        <p className="text-[#ffffff60] leading-relaxed group-hover:text-[#ffffff80] transition-colors">
          {description}
        </p>
      </div>
    </motion.div>
  );
};

export default function FeaturesSection() {
  const features = [
    {
      icon: Layers,
      title: "Multimodal Detection",
      description: "Analyze cross-media synchronization. Detect mismatches between audio lip-sync and visual depth fields in real-time.",
      delay: 0.2
    },
    {
      icon: Zap,
      title: "Real-time Score",
      description: "Get instant authenticity scores as content streams. Built-in low-latency inference engine powered by distributed GPU clusters.",
      delay: 0.4
    },
    {
      icon: ShieldCheck,
      title: "Explainable AI",
      description: "Don't just trust the score. See exactly why the engine flagged content with visual heatmap overlays and logic traces.",
      delay: 0.6
    }
  ];

  return (
    <section className="py-32 relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-24">
          <motion.div 
            initial={{ opacity: 0 }} 
            whileInView={{ opacity: 1 }} 
            className="text-[10px] uppercase font-mono tracking-widest text-[#00f2ff] mb-4"
          >
            Core Technologies
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            className="text-4xl md:text-5xl font-black italic"
          >
            Built for the <span className="text-[#00f2ff]">Truth</span>
          </motion.h2>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, idx) => (
            <FeatureCard key={idx} {...feature} />
          ))}
        </div>
      </div>
      
      <div className="absolute top-1/2 left-0 w-full h-[600px] -translate-y-1/2 -z-10 bg-gradient-to-b from-transparent via-[#00f2ff05] to-transparent pointer-events-none"></div>
    </section>
  );
}
