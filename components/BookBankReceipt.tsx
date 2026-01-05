
import React from 'react';
import { User, BookBankBundle, CollectionSchedule } from '../types';
// Added Clock to lucide-react imports to resolve the error on line 67
import { CheckCircle, Download, Calendar, MapPin, Printer, ShieldCheck, ArrowRight, Clock } from 'lucide-react';

interface BookBankReceiptProps {
  user: User;
  bundle: BookBankBundle;
  schedule: CollectionSchedule | undefined;
  onDone: () => void;
}

const BookBankReceipt: React.FC<BookBankReceiptProps> = ({ user, bundle, schedule, onDone }) => {
  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in zoom-in-95 duration-500 py-8">
      <div className="text-center space-y-4">
        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
          <CheckCircle className="w-10 h-10" />
        </div>
        <h1 className="text-4xl font-black text-slate-800">Payment Successful</h1>
        <p className="text-slate-500 font-medium">Your Book Bank enrollment is confirmed.</p>
      </div>

      <div className="bg-white rounded-[3rem] border border-slate-100 shadow-2xl overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Order ID</p>
            <p className="font-mono text-xs font-bold text-slate-600">BB-SPIT-{Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl text-xs font-bold text-[#003366] border border-slate-200 shadow-sm hover:shadow-md transition-all">
            <Download className="w-3 h-3" /> Download PDF
          </button>
        </div>

        <div className="p-10 space-y-8">
          <div className="grid grid-cols-2 gap-8">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Student Name</p>
              <p className="font-bold text-slate-800">{user.name}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Academic Year</p>
              <p className="font-bold text-slate-800">{bundle.year} ({bundle.branch})</p>
            </div>
          </div>

          <div className="p-6 bg-slate-50 rounded-3xl space-y-3">
             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Purchased Bundle (Sem {bundle.semester})</p>
             {bundle.books.map((b, i) => (
               <div key={i} className="flex justify-between items-center text-sm">
                 <span className="text-slate-700 font-medium">{b.title}</span>
                 <span className="text-slate-400 italic text-[11px]">{b.subject}</span>
               </div>
             ))}
             <div className="pt-4 mt-4 border-t border-slate-200 flex justify-between items-center">
               <span className="font-bold text-slate-800">Total Paid</span>
               <span className="text-2xl font-black text-[#003366]">₹{bundle.price}</span>
             </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-black text-slate-800 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[#FF9933]" /> Collection Instructions
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex gap-4 p-4 bg-orange-50 rounded-2xl border border-orange-100">
                <Clock className="w-5 h-5 text-[#FF9933]" />
                <div>
                  <p className="text-[10px] font-bold text-orange-400 uppercase tracking-widest">Time Slot</p>
                  <p className="text-xs font-bold text-orange-900">{schedule?.days.join(' & ')}</p>
                  <p className="text-[10px] text-orange-800/60">{schedule?.time}</p>
                </div>
              </div>
              <div className="flex gap-4 p-4 bg-blue-50 rounded-2xl border border-blue-100">
                <MapPin className="w-5 h-5 text-[#003366]" />
                <div>
                  <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">Counter</p>
                  <p className="text-xs font-bold text-blue-900">{schedule?.location}</p>
                  <p className="text-[10px] text-blue-800/60">Library 1st Floor</p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 bg-[#003366] text-white rounded-3xl flex items-center justify-between">
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
                 <ShieldCheck className="w-6 h-6 text-emerald-400" />
               </div>
               <div>
                 <h5 className="font-bold text-sm">Bring your Digital Receipt</h5>
                 <p className="text-blue-100/60 text-[10px]">Show this screen at the counter for pickup.</p>
               </div>
            </div>
            <ArrowRight className="w-5 h-5 text-white/30" />
          </div>
        </div>
      </div>

      <button 
        onClick={onDone}
        className="w-full py-5 bg-slate-100 text-slate-600 font-black rounded-3xl hover:bg-slate-200 transition-all flex items-center justify-center gap-2"
      >
        <Printer className="w-5 h-5" /> Back to Library Dashboard
      </button>
    </div>
  );
};

export default BookBankReceipt;
