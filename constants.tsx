
import React from 'react';

export const COLORS = {
  spitBlue: '#003366',
  saffron: '#FF9933',
  bgGray: '#f8fafc',
  textMain: '#1e293b',
  textMuted: '#64748b'
};

export const LOGO = (
  <div className="flex items-center gap-2">
    <div className="w-10 h-10 bg-[#003366] rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-lg">
      S
    </div>
    <div className="flex flex-col leading-tight">
      <span className="font-bold text-lg tracking-tight text-[#003366]">SmartShelves</span>
      <span className="text-[10px] font-medium text-[#FF9933] uppercase">SPIT Library</span>
    </div>
  </div>
);
