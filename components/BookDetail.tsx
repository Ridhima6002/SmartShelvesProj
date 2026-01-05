
import React from 'react';
import { Book } from '../types';
import { X, MapPin, Layers, Info, Check, Clock, TrendingUp } from 'lucide-react';

interface BookDetailProps {
  book: Book;
  onClose: () => void;
  onAction: (book: Book) => void;
}

const BookDetail: React.FC<BookDetailProps> = ({ book, onClose, onAction }) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="relative bg-white w-full max-w-4xl rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row animate-in fade-in slide-in-from-bottom-8 duration-300">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-white/20 backdrop-blur-md rounded-full text-slate-800 hover:bg-slate-100 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="w-full md:w-1/3 h-64 md:h-auto relative">
          <img src={book.image} alt={book.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#003366]/80 to-transparent flex flex-col justify-end p-8">
            <span className="text-white/70 text-sm font-medium mb-1">Rack {book.rack}</span>
            <h2 className="text-white text-2xl font-bold leading-tight">{book.title}</h2>
          </div>
        </div>

        <div className="w-full md:w-2/3 p-8 md:p-12 overflow-y-auto max-h-[80vh]">
          <div className="flex flex-wrap gap-2 mb-6">
            <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-semibold">Semester {book.semester}</span>
            <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-semibold">{book.branch}</span>
            {book.tags.map(tag => (
              <span key={tag} className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-semibold">{tag}</span>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <p className="text-slate-400 text-xs font-medium uppercase mb-1 flex items-center gap-2">
                <Layers className="w-3 h-3" /> Availability
              </p>
              <p className={`text-lg font-bold ${book.available ? 'text-emerald-600' : 'text-rose-600'}`}>
                {book.available ? `${book.copies} of ${book.totalCopies} left` : 'Out of Stock'}
              </p>
            </div>
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <p className="text-slate-400 text-xs font-medium uppercase mb-1 flex items-center gap-2">
                <MapPin className="w-3 h-3" /> Location
              </p>
              <p className="text-lg font-bold text-slate-800">Rack #{book.rack}</p>
            </div>
          </div>

          {!book.available && (
            <div className="mb-8 p-6 bg-rose-50 rounded-3xl border border-rose-100">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-rose-100 rounded-full flex items-center justify-center text-rose-600">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-rose-900">Current Queue</h4>
                    <p className="text-rose-600 text-sm">Estimated wait: 4-6 days</p>
                  </div>
                </div>
                <span className="px-4 py-1.5 bg-rose-200 text-rose-800 rounded-full font-bold text-sm">
                  You are #{book.queuePosition || 1} in queue
                </span>
              </div>
              <div className="w-full h-3 bg-rose-100 rounded-full overflow-hidden">
                <div className="w-[75%] h-full bg-rose-500"></div>
              </div>
            </div>
          )}

          <div className="space-y-6">
            <div>
              <h4 className="font-bold text-slate-800 mb-2 flex items-center gap-2">
                <Info className="w-4 h-4 text-[#003366]" /> Synopsis
              </h4>
              <p className="text-slate-600 text-sm leading-relaxed">
                This comprehensive textbook covers the fundamental concepts of {book.title} required for students of {book.branch} Semester {book.semester}. Includes solved examples and practice sets from previous SPIT examinations.
              </p>
            </div>

            <div className="pt-4 flex gap-4">
              {book.available ? (
                <button 
                  onClick={() => onAction(book)}
                  className="flex-1 py-4 bg-[#003366] text-white rounded-2xl font-bold shadow-xl hover:shadow-[#003366]/30 transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
                >
                  <Check className="w-5 h-5" /> Issue This Book
                </button>
              ) : (
                <button 
                  onClick={() => onAction(book)}
                  className="flex-1 py-4 bg-rose-600 text-white rounded-2xl font-bold shadow-xl hover:shadow-rose-600/30 transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
                >
                  <TrendingUp className="w-5 h-5" /> Join the Queue
                </button>
              )}
              <button className="px-6 py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition-colors">
                Add to Wishlist
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetail;
