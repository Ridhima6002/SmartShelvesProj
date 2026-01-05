
import React from 'react';
import { User, Book } from '../types';
import { Clock, AlertCircle, CreditCard, ChevronRight, BookOpen, Download } from 'lucide-react';

interface StudentDashboardProps {
  user: User;
  books: Book[];
}

const StudentDashboard: React.FC<StudentDashboardProps> = ({ user, books }) => {
  const issuedBookDetails = user.issuedBooks.map(ib => ({
    ...ib,
    book: books.find(b => b.id === ib.bookId)
  }));

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Stats & Books */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-3">
              <BookOpen className="w-6 h-6 text-[#003366]" /> Currently Issued Books
            </h3>
            
            <div className="space-y-4">
              {issuedBookDetails.length > 0 ? issuedBookDetails.map((ib, i) => (
                <div key={i} className="group p-5 bg-slate-50 rounded-3xl border border-slate-100 flex items-center justify-between hover:border-[#003366]/30 transition-all">
                  <div className="flex items-center gap-4">
                    <img src={ib.book?.image} className="w-12 h-16 rounded-lg object-cover shadow-md" alt="book" />
                    <div>
                      <h4 className="font-bold text-slate-800 group-hover:text-[#003366] transition-colors">{ib.book?.title}</h4>
                      <p className="text-sm text-slate-500">{ib.book?.author}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2 text-rose-500 font-bold text-sm mb-1">
                      <Clock className="w-4 h-4" /> Due: {ib.dueDate}
                    </div>
                    <p className="text-xs text-slate-400">14-day reminder sent</p>
                  </div>
                </div>
              )) : (
                <div className="py-12 flex flex-col items-center text-slate-400">
                  <BookOpen className="w-12 h-12 mb-3 opacity-20" />
                  <p>You haven't issued any books yet.</p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-[#003366] p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-700">
              <CreditCard className="w-48 h-48" />
            </div>
            <div className="relative z-10">
              <span className="px-4 py-1.5 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-wider">New Benefit</span>
              <h3 className="text-3xl font-bold mt-4 mb-2">Book Bank Program</h3>
              <p className="text-blue-100 max-w-md text-sm leading-relaxed mb-6">
                Get full semester book bundles at 20% of the cost. A collaborative initiative for all engineering years at SPIT.
              </p>
              <div className="flex gap-4">
                <button className="px-8 py-3 bg-white text-[#003366] font-bold rounded-2xl shadow-lg hover:shadow-white/20 transition-all active:scale-95">
                  Enroll Now
                </button>
                <button className="px-8 py-3 bg-transparent border border-white/30 text-white font-bold rounded-2xl hover:bg-white/10 transition-all">
                  Learn More
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Fines & Payments */}
        <div className="space-y-8">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-3">
              <AlertCircle className="w-6 h-6 text-[#FF9933]" /> Pending Fines
            </h3>
            <div className="text-center py-6">
              <p className="text-slate-400 text-sm mb-2 font-medium uppercase tracking-widest">Total Outstanding</p>
              <h2 className="text-6xl font-black text-slate-800 mb-2 tracking-tighter">₹{user.fines}</h2>
              <p className="text-rose-500 font-bold text-sm">₹5 per day late fee</p>
            </div>
            <button className="w-full py-4 bg-[#FF9933] text-white rounded-2xl font-bold shadow-lg shadow-[#FF9933]/30 flex items-center justify-center gap-2 hover:translate-y-[-2px] transition-all active:translate-y-0">
              <CreditCard className="w-5 h-5" /> Pay Now via Razorpay
            </button>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center justify-between">
              Recent Activity <ChevronRight className="w-5 h-5 text-slate-300" />
            </h3>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center text-white">
                  <Download className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-emerald-900 text-sm">Book Bank Receipt</h4>
                  <p className="text-emerald-600 text-[10px] font-bold uppercase">Downloaded • Oct 12</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 opacity-60">
                <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center text-slate-500">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-700 text-sm">Book Returned</h4>
                  <p className="text-slate-400 text-[10px] font-bold uppercase">LA Fundamentals • Sep 28</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
