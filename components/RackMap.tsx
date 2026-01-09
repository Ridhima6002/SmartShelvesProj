import React, { useState } from 'react';
import { RACK_INFO } from '../data';
import { Info } from 'lucide-react';

const RackMap: React.FC = () => {
  const [hoveredRack, setHoveredRack] = useState<number | null>(null);

  return (
    /* 1. Added a blue-tinted shadow and a subtle blue background glow */
    <div className="relative group bg-white p-10 rounded-[3rem] border border-blue-50/50 shadow-[0_20px_50px_rgba(30,58,138,0.1)] animate-in fade-in duration-700">
      
      {/* 2. The 'Subtle Blue Tint' Background Element */}
      <div className="absolute inset-0 bg-gradient-to-tr from-blue-50/40 via-transparent to-transparent rounded-[3rem] pointer-events-none" />

      <div className="relative z-10 flex items-center justify-between mb-10">
        <div>
          {/* 3. Darker, bolder blue title */}
          <h2 className="text-4xl font-black text-blue-900 mb-2 tracking-tight">
            Library <span className="text-blue-900">Floor Plan</span>
          </h2>
          <p className="text-slate-500 font-bold text-sm uppercase tracking-wide">
            Visual guide to locate your books instantly
          </p>
        </div>

        <div className="hidden md:flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-blue-100/50 rounded-lg border border-blue-200"></div>
            <span className="text-[11px] font-black text-[#001f3f] uppercase tracking-widest">Main Corridor</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-[#001f3f] rounded-lg "></div>
            <span className="text-[11px] font-black text-[#001f3f] uppercase tracking-widest">Entry/Exit</span>
          </div>
        </div>
      </div>

      <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-10 gap-4 mb-10">
        {RACK_INFO.map(rack => (
          <div 
            key={rack.id}
            onMouseEnter={() => setHoveredRack(rack.id)}
            onMouseLeave={() => setHoveredRack(null)}
            className={`relative group aspect-square rounded-2xl border-2 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 ${
              hoveredRack === rack.id 
                /* Active/Hover: Strong Dark Blue with Glow */
                ? 'bg-[#001f3f] border-[#001f3f] shadow-2xl shadow-blue-500/40 scale-110 z-20' 
                : 'bg-white border-blue-50 hover:border-blue-200 shadow-sm shadow-blue-900/5'
            }`}
          >
            {/* 4. Rack numbers: Darker blue and extra bold when not hovered */}
            <span className={`text-2xl font-black transition-colors duration-300 ${
              hoveredRack === rack.id ? 'text-white' : 'text-[#001f3f]'
            }`}>
              {rack.id}
            </span>
            <span className={`text-[9px] font-black uppercase tracking-[0.15em] mt-1 transition-colors duration-300 ${
              hoveredRack === rack.id ? 'text-blue-300' : 'text-blue-400/60'
            }`}>
              Rack
            </span>

            {hoveredRack === rack.id && (
              <div className="absolute bottom-[115%] left-1/2 -translate-x-1/2 w-52 bg-[#001f3f] text-white p-5 rounded-3xl shadow-2xl animate-in zoom-in-95 slide-in-from-bottom-2 duration-200 z-[100] border border-blue-500/30">
                <div className="flex items-center gap-2 mb-2 text-blue-400">
                  <Info className="w-4 h-4" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Section</span>
                </div>
                <p className="text-sm font-bold leading-tight">{rack.category}</p>
                {/* Custom Triangle Arrow */}
                <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-[#001f3f]"></div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default RackMap;