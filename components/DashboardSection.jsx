'use client';

import { motion } from 'framer-motion';
import { Activity, ShieldCheck, AlertTriangle, CheckCircle, BarChart3, PieChart, TrendingUp, Binary } from 'lucide-react';
import { useEffect, useState } from 'react';
import AccuracyGauge from '@/components/AccuracyGauge';

export default function DashboardSection() {
  const [score, setScore] = useState(0);

  useEffect(() => {
    const interval = setTimeout(() => {
      setScore(94.8);
    }, 500);
    return () => clearTimeout(interval);
  }, []);

  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Main Score & Risk Indicator */}
          <div className="lg:w-1/3 flex flex-col gap-6">
            <motion.div 
               initial={{ opacity: 0, x: -20 }}
               animate={{ opacity: 1, x: 0 }}
               className="glass-glow p-10 flex flex-col items-center justify-center relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <ShieldCheck className="w-24 h-24 text-[#00f2ff]" />
              </div>
              
              <AccuracyGauge score={score} size={280} />
              
              <div className="mt-4 flex flex-col items-center gap-4">
                  <div className="px-4 py-1.5 bg-[#00f2ff10] border border-[#00f2ff40] rounded-full text-[#00f2ff] font-mono text-[10px] tracking-widest uppercase">
                    AUTHENTICITY DETECTED
                  </div>
                  <p className="text-center text-[#ffffff40] text-sm max-w-[200px]">
                    Analysis confirms 94.8% source alignment.
                  </p>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="glass p-8"
            >
               <h3 className="text-sm font-bold mb-6 flex items-center gap-2">
                 <AlertTriangle className="w-4 h-4 text-[#7000ff]" />
                 RISK PARAMETERS
               </h3>
               
               <div className="flex flex-col gap-4">
                 {[
                   { label: "LipSync Deviation", val: "0.002%", color: "#00f2ff" },
                   { label: "Artifact Density", val: "Lo-Pass", color: "#00f2ff" },
                   { label: "Neural Signature", val: "Clean", color: "#00f2ff" },
                   { label: "Risk Level", val: "Low", color: "#00f2ff" }
                 ].map((stat, i) => (
                   <div key={i} className="flex justify-between items-center border-b border-[#ffffff05] pb-2">
                     <span className="text-[10px] font-mono text-[#ffffff40] uppercase">{stat.label}</span>
                     <span className="text-[12px] font-mono text-white">{stat.val}</span>
                   </div>
                 ))}
               </div>
            </motion.div>
          </div>

          {/* Visualization & Charts */}
          <div className="lg:w-2/3 flex flex-col gap-6">
             <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass p-8 h-full"
             >
                <div className="flex justify-between items-center mb-8">
                   <h3 className="font-bold flex items-center gap-2">
                     <Binary className="w-4 h-4 text-[#00f2ff]" />
                     FORENSIC HEATMAP
                   </h3>
                   <div className="flex gap-2">
                      <div className="h-2 w-8 bg-[#ffffff10] rounded-full overflow-hidden">
                        <div className="h-full w-2/3 bg-[#00f2ff]"></div>
                      </div>
                      <span className="text-[8px] font-mono text-[#ffffff20]">SYNC: ACTIVE</span>
                   </div>
                </div>
                
                {/* Simulated Heatmap visualization */}
                <div className="relative aspect-video rounded-xl bg-black border border-[#ffffff10] overflow-hidden group cursor-crosshair">
                   <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1620712943543-bcc4628c9759?q=80&w=1543&auto=format&fit=crop')] bg-cover opacity-60"></div>
                   <div className="absolute inset-0 bg-gradient-to-tr from-[#00f2ff10] via-transparent to-[#7000ff20]"></div>
                   
                   {/* Scanning Grid Overlay */}
                   <div className="absolute inset-0 neural-grid opacity-20 group-hover:opacity-40 transition-opacity"></div>
                   
                   {/* Scanning Line */}
                   <motion.div 
                    animate={{ top: ['0%', '100%'] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                    className="absolute left-0 right-0 h-[1px] bg-[#00f2ff] shadow-[0_0_10px_#00f2ff] z-10"
                   />
                   
                   {/* Detection boxes */}
                   <motion.div 
                     initial={{ opacity: 0 }}
                     animate={{ opacity: 1 }}
                     className="absolute top-1/4 left-1/3 w-32 h-32 border border-[#00f2ff] rounded-lg shadow-[0_0_20px_rgba(0,242,255,0.2)] flex items-end p-2"
                   >
                      <div className="text-[8px] font-mono text-[#00f2ff] bg-[#00f2ff10] px-1">LIP_SYNC: 99.1%</div>
                   </motion.div>
                </div>

                {/* Sub charts */}
                <div className="grid md:grid-cols-2 gap-6 mt-8">
                    <div className="glass bg-[#ffffff02] p-4 flex items-center gap-4">
                       <BarChart3 className="w-8 h-8 text-[#00f2ff] opacity-40" />
                       <div>
                          <div className="text-[10px] font-mono text-[#ffffff40]">LATENT DEVIATION</div>
                          <div className="text-xl font-black">0.0234</div>
                       </div>
                    </div>
                    <div className="glass bg-[#ffffff02] p-4 flex items-center gap-4">
                       <TrendingUp className="w-8 h-8 text-[#7000ff] opacity-40" />
                       <div>
                          <div className="text-[10px] font-mono text-[#ffffff40]">MODEL CONFIDENCE</div>
                          <div className="text-xl font-black">HIGH</div>
                       </div>
                    </div>
                </div>
             </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
