'use client';

import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import SplashScreen from '@/components/SplashScreen';
import HeroSection from '@/components/HeroSection';
import FeaturesSection from '@/components/FeaturesSection';
import UploadSection from '@/components/UploadSection';
import DashboardSection from '@/components/DashboardSection';

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState('landing');
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [analysisResult, setAnalysisResult] = useState(null);

  useEffect(() => {
    const handleScroll = () => {
      const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (winScroll / height) * 100;
      setScrollProgress(scrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleFinishLoading = () => {
    setLoading(false);
  };

  const handleUploadComplete = async (file) => {
    setIsScanning(true);
    setScanProgress(10); // Start progress

    const formData = new FormData();
    formData.append('media', file);
    
    try {
      setScanProgress(30);
      const response = await fetch('http://localhost:8000/api/v1/verify', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) throw new Error('Inference failed');
      
      setScanProgress(80);
      const data = await response.json();
      setAnalysisResult(data);
      
      setScanProgress(100);
      setTimeout(() => {
          setActiveView('dashboard');
          setIsScanning(false);
          setScanProgress(0);
          window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 800);
      
    } catch (error) {
      console.error('Analysis failed:', error);
      setIsScanning(false);
      setScanProgress(0);
      alert("Verification failed. Ensure the TrustLens backend is running on localhost:8000.");
    }
  };

  const startAnalysis = () => {
    document.getElementById('upload')?.scrollIntoView({ behavior: 'smooth' });
  };

  if (loading) {
    return (
      <AnimatePresence>
        <SplashScreen finishLoading={handleFinishLoading} />
      </AnimatePresence>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#020710] selection:bg-[#00f2ff20]">
      {/* Premium UI Enhancements */}
      
      {/* Side Data Stream (Left) */}
      <div className="fixed left-4 top-1/2 -translate-y-1/2 z-[60] flex flex-col gap-8 opacity-10 pointer-events-none hidden xl:flex text-glow">
         {[...Array(20)].map((_, i) => (
           <div key={i} className="font-mono text-[8px] vertical-text transform -rotate-180 text-[#00f2ff] tracking-[0.5em] animate-pulse">
              {Math.random().toString(16).substr(2, 8).toUpperCase()}
           </div>
         ))}
      </div>

      <div className="fixed top-0 left-0 w-full h-1 z-[100] bg-transparent">
        <motion.div 
          className="h-full bg-gradient-to-r from-[#00f2ff] to-[#7000ff]"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      <header className="fixed top-0 w-full z-[80] p-6 flex justify-between items-center backdrop-blur-md">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-gradient-to-br from-[#00f2ff] to-[#7000ff] flex items-center justify-center font-black text-white text-xs">TL</div>
          <span className="font-black tracking-tighter text-lg">TRUSTLENS</span>
        </div>
        <nav className="hidden md:flex gap-8 text-[10px] uppercase font-mono tracking-widest text-[#ffffff40]">
           <a href="#" className="hover:text-[#00f2ff] transition-colors">Technology</a>
           <a href="#" className="hover:text-[#00f2ff] transition-colors">Engine</a>
           <a href="#" className="hover:text-[#00f2ff] transition-colors">Security</a>
           <a href="#" className="hover:text-[#4ade80] transition-colors underline underline-offset-4 decoration-[#4ade80]/40">Download Extension</a>
        </nav>
        <button className="px-4 py-1.5 glass text-[10px] font-mono tracking-widest text-[#00f2ff] border-[rgba(0,242,255,0.2)]">
          SYSTEM STATUS: OPTIMAL
        </button>
      </header>

      <AnimatePresence mode="wait">
        {activeView === 'landing' ? (
          <motion.div 
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <HeroSection onStart={startAnalysis} />
            <FeaturesSection />
            <UploadSection 
              onUploadComplete={handleUploadComplete} 
              isScanning={isScanning}
              scanProgress={scanProgress}
            />
          </motion.div>
        ) : (
          <motion.div 
            key="dashboard"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="pt-32">
              <div className="container mx-auto px-4 mb-8">
                <button 
                  onClick={() => setActiveView('landing')}
                  className="text-[10px] font-mono text-[#ffffff40] hover:text-[#00f2ff]"
                >
                  ← BACK TO GATEWAY
                </button>
                <h2 className="text-3xl font-black mt-4 uppercase italic">Forensic Analysis Report</h2>
                <p className="text-[#ffffff40] text-sm">Session ID: {analysisResult?.session_id || "TL-UNKNOWN"}</p>
              </div>
              <DashboardSection data={analysisResult} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <footer className="py-12 border-t border-[#ffffff05] mt-24">
         <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded bg-white/10 flex items-center justify-center font-black text-white text-[8px]">TL</div>
                <span className="font-bold tracking-tighter text-sm">TRUSTLENS AI</span>
              </div>
              <p className="text-[10px] text-[#ffffff20]">© 2026 Multimodal Deepfake Detection Engine. Proprietary Technology.</p>
            </div>
            <div className="flex gap-8 text-[10px] font-mono tracking-widest text-[#ffffff20]">
              <a href="#" className="hover:text-white transition-colors">DATAFORENSICS</a>
              <a href="#" className="hover:text-white transition-colors">ETHICAL AI</a>
              <a href="#" className="hover:text-white transition-colors">NEURAL ARCH</a>
            </div>
         </div>
      </footer>
    </div>
  );
}
