'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, File,X, Binary, Activity } from 'lucide-react';

export default function UploadSection({ onUploadComplete, isScanning, scanProgress }) {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFile = (selectedFile) => {
    setFile(selectedFile);
    onUploadComplete(selectedFile);
  };

  return (
    <section id="upload" className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black mb-4">Verification Portal</h2>
          <p className="text-[#ffffff60]">Upload media to initiate deepfake forensic analysis</p>
        </div>

        <div className="relative">
          <AnimatePresence mode="wait">
            {!isScanning ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={`
                  relative border-2 border-dashed rounded-[32px] p-20 flex flex-col items-center justify-center transition-all duration-500
                  ${dragActive ? 'border-[#00f2ff] bg-[#00f2ff05] shadow-[0_0_50px_rgba(0,242,255,0.1)]' : 'border-[#ffffff15] bg-[#ffffff02]'}
                `}
              >
                <div className="w-24 h-24 mb-8 rounded-full bg-[#00f2ff08] flex items-center justify-center border border-[#00f2ff20]">
                    <Upload className="w-10 h-10 text-[#00f2ff]" />
                </div>
                
                <h3 className="text-2xl font-bold mb-4">Drag & Drop Media</h3>
                <p className="text-[#ffffff40] mb-8 text-center max-w-xs">
                    Support for high-resolution Video (.mp4, .mov), Audio (.wav, .mp3) and Images (.jpg, .png)
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <label className="cyber-button cursor-pointer flex items-center justify-center">
                      BROWSE LOCAL FILES
                      <input 
                          type="file" 
                          className="hidden" 
                          onChange={(e) => handleFile(e.target.files[0])}
                          accept="video/*,audio/*,image/*"
                      />
                  </label>
                  <button className="px-8 py-3 rounded-full bg-[#ffffff05] border border-[#ffffff10] text-white font-semibold hover:bg-[#ffffff10] transition-colors flex items-center justify-center gap-2">
                    <Activity className="w-4 h-4 text-[#0fb]" />
                    SCAN SOURCE URL
                  </button>
                </div>
                
                <div className="mt-8 flex items-center gap-4 opacity-30 text-[8px] font-mono tracking-widest grayscale hover:grayscale-0 transition-all cursor-default">
                    <span>SOCIAL MEDIA SCAN:</span>
                    <span>X</span>
                    <span>LINKEDIN</span>
                    <span>TIKTOK</span>
                    <span>META</span>
                </div>
                
                {/* Decorative corners */}
                <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-[#00f2ff40]"></div>
                <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-[#00f2ff40]"></div>
                <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-[#00f2ff40]"></div>
                <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-[#00f2ff40]"></div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="glass-glow rounded-[32px] p-20 flex flex-col items-center justify-center relative overflow-hidden"
              >
                <div className="scanline"></div>
                
                <div className="relative mb-12">
                   <div className="absolute inset-0 bg-[#00f2ff20] blur-3xl rounded-full"></div>
                   <Activity className="w-16 h-16 text-[#00f2ff] relative z-10 animate-pulse" />
                </div>
                
                <h3 className="text-3xl font-black mb-2 text-glow">ANALYZING ARTIFACTS</h3>
                <div className="font-mono text-[#00f2ff] text-sm mb-12 tracking-widest uppercase">
                    Neural Engine V.3.1 - Active
                </div>
                
                <div className="w-full max-w-md">
                   <div className="flex justify-between font-mono text-[10px] text-[#ffffff40] mb-2 uppercase">
                       <span>Decoding Frame Buffers</span>
                       <span>{Math.floor(scanProgress)}%</span>
                   </div>
                   <div className="h-1 w-full bg-[#ffffff05] rounded-full overflow-hidden">
                       <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${scanProgress}%` }}
                        className="h-full bg-[#00f2ff] shadow-[0_0_15px_#00f2ff]"
                       />
                   </div>
                </div>
                
                {/* Random hex bits animation */}
                <div className="mt-12 grid grid-cols-4 gap-4 opacity-20 font-mono text-[8px] text-[#00f2ff]">
                    {[...Array(8)].map((_, i) => (
                        <div key={i} className="animate-pulse">{Math.random().toString(16).substr(2, 6).toUpperCase()}</div>
                    ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
