import React from 'react';
import { motion } from 'framer-motion';

export const FlightTag: React.FC = () => {
  return (
    <motion.div
      className="absolute z-50 pointer-events-none will-change-transform transform-gpu scale-75 sm:scale-90 md:scale-100 origin-top-right"
      // Position it to the right and slightly down from the center (where the shoe is)
      style={{
        right: '6%',
        top: '42%',
      }}
      animate={{
        y: [0, -15, 0],
        rotate: [12, 16, 12],
      }}
      transition={{
        duration: 5,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      {/* The Tag Body */}
      <div className="relative bg-white rounded-md w-32 sm:w-40 flex flex-col overflow-hidden border border-slate-200 shadow-[0_10px_30px_rgba(0,0,0,0.15)]">
        {/* Punched Hole */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 w-3 h-3 bg-slate-200 rounded-full inset-shadow-sm border border-slate-300" />
        
        {/* Top Section */}
        <div className="pt-8 pb-2 px-3 text-center border-b border-slate-200">
          <p className="text-[8px] sm:text-[10px] font-bold text-slate-400 tracking-widest uppercase">
            Destination
          </p>
          <h2 className="text-3xl sm:text-4xl font-black text-ym-charcoal tracking-tighter leading-none mt-1">
            CAI
          </h2>
          <p className="text-[9px] sm:text-[11px] font-black text-ym-charcoal uppercase tracking-widest mt-1">
            Cairo, EGYPT
          </p>
        </div>

        {/* Middle Section */}
        <div className="py-2 px-3 bg-ym-lime flex justify-between items-center">
          <span className="text-[8px] sm:text-[9px] font-black uppercase text-ym-charcoal">ESTABLISHED</span>
          <span className="text-[8px] sm:text-[9px] font-black uppercase text-ym-charcoal">2018</span>
        </div>
        
        <div className="py-2 px-3 flex justify-between items-center border-b border-slate-200 bg-slate-50">
          <span className="text-[8px] sm:text-[9px] font-bold text-slate-500 uppercase">Status</span>
          <span className="text-[8px] sm:text-[9px] font-black text-ym-charcoal uppercase">100% Auth</span>
        </div>

        {/* Barcode Section */}
        <div className="p-3 bg-white flex justify-center items-center">
          <div className="w-full flex justify-between items-end h-8 gap-[1px] opacity-80">
            {/* Static barcode bars */}
            {[
              {w: 2, h: 100}, {w: 1, h: 80}, {w: 3, h: 100}, {w: 1, h: 60}, {w: 2, h: 90},
              {w: 4, h: 100}, {w: 1, h: 100}, {w: 2, h: 70}, {w: 1, h: 90}, {w: 3, h: 100},
              {w: 1, h: 50}, {w: 2, h: 100}, {w: 1, h: 100}, {w: 4, h: 80}, {w: 1, h: 100},
              {w: 2, h: 60}, {w: 1, h: 100}, {w: 3, h: 90}, {w: 2, h: 100}, {w: 1, h: 70},
              {w: 2, h: 100}, {w: 1, h: 100}, {w: 3, h: 80}, {w: 2, h: 100}
            ].map((bar, i) => (
              <div 
                key={i} 
                className="bg-black rounded-sm" 
                style={{ 
                  width: `${bar.w}px`,
                  height: `${bar.h}%` 
                }} 
              />
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
