import React from 'react';
import { Book } from '../types';
import { User as AuthorIcon, Hash, CheckCircle, XCircle, ArrowUpRight } from 'lucide-react';

interface BookCardProps {
  book: Book;
  onClick: (book: Book) => void;
}

const BookCard: React.FC<BookCardProps> = ({ book, onClick }) => {
  return (
    <div 
  onClick={() => onClick(book)}
  className="group relative w-64 bg-[#ebeef5] rounded-xl border border-[#3b82f6]/40 shadow-lg transition-all duration-300 cursor-pointer overflow-hidden hover:-translate-y-1 hover:shadow-2xl"
  style={{ 
    minHeight: '370px',
    /* Bluish shadow instead of navy */
    boxShadow: '0 10px 30px -12px rgba(59, 130, 246, 0.25)' 
  }}
>

      {/* Image Container - Reduced Rounding */}
      <div className="h-48 overflow-hidden relative m-1.5 rounded-lg bg-slate-100">
        <img 
          src={book.image} 
          alt={book.title} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Floating Course Code - Navy Theme */}
        <div className="absolute top-2 right-2 px-2.5 py-1 rounded-md bg-[#001f3f]/90 backdrop-blur-md border border-white/10">
          <p className="text-[9px] font-bold text-[#FF9933] tracking-wider uppercase">
            {book.course_code || 'CS-202'}
          </p>
        </div>

        {/* Clean Hover Overlay */}
        <div className="absolute inset-0 bg-[#001f3f]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
           <div className="bg-white text-[#001f3f] p-2 rounded-lg shadow-lg transform scale-90 group-hover:scale-100 transition-transform">
             <ArrowUpRight className="w-4 h-4" />
           </div>
        </div>
      </div>

      {/* Content Area - Compact Spacing */}
      <div className="p-4 flex flex-col justify-between h-[170px]">
        <div className="space-y-1.5">
          <h3 className="text-sm font-bold text-[#001f3f] line-clamp-2 leading-tight group-hover:text-[#FF9933] transition-colors">
            {book.title}
          </h3>
          <p className="text-[11px] text-slate-500 flex items-center gap-1.5">
            <AuthorIcon className="w-3 h-3 text-[#FF9933]" /> {book.author}
          </p>
        </div>

        {/* Bottom Metadata Row */}
        <div className="flex items-center justify-between pt-2">
          <div className={`flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold border ${
            book.available 
            ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
            : 'bg-rose-50 text-rose-600 border-rose-100'
          }`}>
            {book.available ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
            {book.available ? 'Available' : 'Not Available'}
          </div>

          <div className="flex items-center gap-1 text-[#001f3f] font-bold bg-slate-50 px-2 py-0.5 rounded-md text-[10px] border border-slate-100">
            <Hash className="w-2.5 h-2.5 text-[#FF9933]" /> RACK {book.rack}
          </div>
        </div>

        {/* High Demand Logic */}
        {book.demand === 'High' && (
          <div className="mt-3 pt-3 border-t border-slate-50">
            <div className="flex justify-between items-center mb-1">
              <span className="text-[9px] font-bold text-[#FF9933] uppercase">High Demand</span>
              <span className="text-[9px] font-medium text-[#001f3f]/40">92%</span>
            </div>
            <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-[#FF9933] to-orange-600 rounded-full"
                style={{ width: '92%' }}
              ></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookCard;