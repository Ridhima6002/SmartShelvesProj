
import React, { useState } from 'react';
import { RACK_INFO } from '../data';
import { Map, Info, MousePointer2 } from 'lucide-react';

const RackMap: React.FC = () => {
  const [hoveredRack, setHoveredRack] = useState<number | null>(null);

  return (
    <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm animate-in fade-in duration-700">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h2 className="text-3xl font-black text-[#003366] mb-2">Library Floor Plan</h2>
          <p className="text-slate-500 font-medium">Visual guide to locate your books instantly</p>
        </div>
        <div className="hidden md:flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-100 rounded-sm"></div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Main Corridor</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-[#003366] rounded-sm"></div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Entry/Exit</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-10 gap-4 mb-10">
        {RACK_INFO.map(rack => (
          <div 
            key={rack.id}
            onMouseEnter={() => setHoveredRack(rack.id)}
            onMouseLeave={() => setHoveredRack(null)}
            className={`relative group aspect-square rounded-2xl border-2 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 ${
              hoveredRack === rack.id 
              ? 'bg-[#003366] border-[#003366] shadow-xl shadow-[#003366]/20 scale-110 z-10' 
              : 'bg-white border-slate-100 hover:border-blue-200'
            }`}
          >
            <span className={`text-2xl font-black ${hoveredRack === rack.id ? 'text-white' : 'text-slate-300'}`}>
              {rack.id}
            </span>
            <span className={`text-[8px] font-bold uppercase tracking-widest mt-1 ${hoveredRack === rack.id ? 'text-blue-200' : 'text-slate-400'}`}>
              Rack
            </span>

            {hoveredRack === rack.id && (
              <div className="absolute bottom-[110%] left-1/2 -translate-x-1/2 w-48 bg-slate-900 text-white p-4 rounded-2xl shadow-2xl animate-in zoom-in-95 duration-200 z-[100]">
                <div className="flex items-center gap-2 mb-2 text-[#FF9933]">
                  <Info className="w-4 h-4" />
                  <span className="text-[10px] font-black uppercase">Information</span>
                </div>
                <p className="text-xs font-bold leading-snug">{rack.category}</p>
                <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-slate-900"></div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center text-[#003366]">
            <MousePointer2 className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-slate-800">Quick Navigation</h4>
            <p className="text-xs text-slate-500">Hover over a rack to see subject categories.</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 justify-center">
          <span className="px-4 py-2 bg-white text-xs font-bold text-slate-600 rounded-xl border border-slate-200">EXTC: Rack 7</span>
          <span className="px-4 py-2 bg-white text-xs font-bold text-slate-600 rounded-xl border border-slate-200">CS/IT: Rack 4-6</span>
          <span className="px-4 py-2 bg-white text-xs font-bold text-slate-600 rounded-xl border border-slate-200">Entrance: Rack 1</span>
        </div>
      </div>
    </div>
  );
};

export default RackMap;
