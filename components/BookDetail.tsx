import React from 'react';
import { Book } from '../types';
import { X, Check, Clock, TrendingUp } from 'lucide-react';

interface BookDetailProps {
  book: Book;
  onClose: () => void;
  onAction: (book: Book) => void;
}

const demandDescriptions: Record<string, string> = {
  High: "This book is highly recommended by students and frequently referred to by faculty. It’s excellent for grasping key concepts quickly.",
  Medium: "This book is useful for analytical understanding and in-depth concept coverage. While it covers some topics thoroughly, it may not focus heavily on numerical problems.",
  Low: "This book is ideal for concept building with exercises and questions after each chapter. It’s a gentle, structured way to strengthen understanding at your own pace."
};

const BookDetail: React.FC<BookDetailProps> = ({ book, onClose, onAction }) => {
  return (
    // CHANGE 1: Increased outer padding (md:py-24) to shrink the modal height significantly
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:py-24 bg-slate-900/60 backdrop-blur-sm" onClick={onClose}>
      
      {/* Modal Container */}
      <div 
        className="relative bg-white w-full max-w-3xl rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row animate-in fade-in zoom-in duration-300"
        onClick={(e) => e.stopPropagation()} // Prevent click from closing when clicking inside
      >

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 p-2 bg-white/50 hover:bg-white backdrop-blur-md rounded-full text-slate-800 transition-all shadow-sm"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left: Book Image */}
        {/* Adjusted height to be compact on mobile, auto on desktop */}
        <div className="w-full md:w-2/5 h-48 md:h-auto relative bg-slate-100">
          <img src={book.image} alt={book.title} className="w-full h-full object-cover" />
        </div>

        {/* Right: Info Section */}
        {/* Reduced padding (p-6) to make it more compact */}
        <div className="w-full md:w-3/5 p-6 flex flex-col justify-center">
          
          {/* Header */}
          <div className="mb-4">
            <h2 className="text-2xl font-bold text-slate-800 leading-tight">{book.title}</h2>
            <p className="text-sm text-slate-500 font-medium mt-1">by {book.author}</p>
          </div>

          {/* Availability / Queue Section */}
          <div className="mb-5">
            {book.available ? (
              <div className="flex items-center gap-3 p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                <div className="p-1.5 bg-white rounded-full shadow-sm text-emerald-600">
                  <Check className="w-4 h-4" />
                </div>
                <p className="text-emerald-800 font-semibold text-sm">
                  {book.copies} available
                </p>
              </div>
            ) : (
              // CHANGE 2: Redesigned Out of Stock Box
              <div className="flex items-start gap-3 p-4 bg-gradient-to-br from-rose-50 to-white rounded-xl border border-rose-100 shadow-sm">
                <div className="p-2 bg-white rounded-full shadow-sm text-rose-500 border border-rose-50">
                  <Clock className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h4 className="text-rose-900 font-bold text-sm">Out of Stock</h4>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400 bg-rose-100 px-2 py-0.5 rounded-full">
                      Wait: 4-6 Days
                    </span>
                  </div>
                  <p className="text-sm text-rose-600 mt-1">
                    You are <span className="font-bold">#{book.queuePosition || 1}</span> in the queue.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Book Overview */}
          <div className="mb-6">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2">
              Overview
            </h4>
            <p className="text-sm text-slate-600 leading-relaxed line-clamp-3 md:line-clamp-none">
              {demandDescriptions[book.demand || 'Low']}
            </p>
          </div>

          {/* Action Button */}
          <div className="mt-auto">
            {book.available ? (
              <button
                onClick={() => onAction(book)}
                className="w-full py-3 bg-[#003366] text-white rounded-xl font-bold shadow-lg shadow-blue-900/20 hover:shadow-xl hover:bg-[#002855] transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
              >
                <Check className="w-4 h-4" /> Issue Book
              </button>
            ) : (
              <button
                onClick={() => onAction(book)}
                className="w-full py-3 bg-rose-600 text-white rounded-xl font-bold shadow-lg shadow-rose-600/20 hover:shadow-xl hover:bg-rose-700 transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
              >
                <TrendingUp className="w-4 h-4" /> Join Queue
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetail;