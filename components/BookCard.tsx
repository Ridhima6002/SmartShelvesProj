
import React from 'react';
import { Book } from '../types';
import { Book as BookIcon, User as AuthorIcon, Hash, CheckCircle, XCircle, TrendingUp, Star } from 'lucide-react';

interface BookCardProps {
  book: Book;
  onClick: (book: Book) => void;
}

const BookCard: React.FC<BookCardProps> = ({ book, onClick }) => {
  return (
    <div 
      onClick={() => onClick(book)}
      className="group relative flex-shrink-0 w-64 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 cursor-pointer overflow-hidden"
    >
      <div className="h-40 overflow-hidden relative">
        <img 
          src={book.image} 
          alt={book.title} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
          <button className="w-full py-2 bg-white/20 backdrop-blur-md text-white rounded-lg text-xs font-bold border border-white/30 hover:bg-white/30 transition-colors">
            View Details
          </button>
        </div>
        
        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {book.tags.includes('Most Borrowed') && (
            <span className="bg-orange-500 text-white text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1 shadow-md">
              <TrendingUp className="w-3 h-3" /> Popular
            </span>
          )}
          {book.tags.includes('Recommended') && (
            <span className="bg-blue-600 text-white text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1 shadow-md">
              <Star className="w-3 h-3" /> Recommended
            </span>
          )}
        </div>
      </div>

      <div className="p-4">
        <h3 className="text-sm font-bold text-slate-800 line-clamp-2 min-h-[40px] leading-snug group-hover:text-[#003366] transition-colors">
          {book.title}
        </h3>
        <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
          <AuthorIcon className="w-3 h-3" /> {book.author}
        </p>

        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            {book.available ? (
              <CheckCircle className="w-4 h-4 text-emerald-500" />
            ) : (
              <XCircle className="w-4 h-4 text-rose-500" />
            )}
            <span className={`text-[11px] font-bold ${book.available ? 'text-emerald-600' : 'text-rose-600'}`}>
              {book.available ? `${book.copies} Available` : `Waitlist #${book.queuePosition}`}
            </span>
          </div>
          <div className="flex items-center gap-1 text-slate-400 bg-slate-50 px-2 py-1 rounded-md text-[10px]">
            <Hash className="w-3 h-3" /> Rack {book.rack}
          </div>
        </div>

        {book.demand === 'High' && (
          <div className="mt-3 pt-3 border-t border-slate-50">
            <div className="flex justify-between items-center mb-1">
              <span className="text-[10px] font-bold text-rose-500 uppercase tracking-wider">High Demand</span>
              <span className="text-[10px] text-slate-400">92% issued</span>
            </div>
            <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-rose-500 w-[92%]"></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookCard;
