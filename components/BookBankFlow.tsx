
// import React, { useState } from 'react';
// import { Year, Branch, User, BookBankBundle, CollectionSchedule } from '../types';
// import { MOCK_BOOK_BANK_BUNDLES, SCHEDULES } from '../data';
// import { ChevronRight, Home, LayoutGrid, Clock, MapPin, CreditCard, Check, ShieldCheck, ArrowLeft, BookOpen } from 'lucide-react';

// interface BookBankFlowProps {
//   initialYear: Year;
//   user: User | null;
//   onLogin: () => void;
//   onComplete: (bundle: BookBankBundle) => void;
//   onBack: () => void;
// }

// const BookBankFlow: React.FC<BookBankFlowProps> = ({ initialYear, user, onLogin, onComplete, onBack }) => {
//   const [step, setStep] = useState<'branch' | 'bundle'>(initialYear === 'FE' ? 'bundle' : 'branch');
//   const [selectedBranch, setSelectedBranch] = useState<Branch>(initialYear === 'FE' ? 'Common' : 'CSE');

//   const bundle = MOCK_BOOK_BANK_BUNDLES.find(b => b.year === initialYear && b.branch === selectedBranch);
//   const schedule = SCHEDULES.find(s => s.year === initialYear && s.branch === selectedBranch);

//   const handleProceed = () => {
//     if (!user) {
//       onLogin();
//     } else if (bundle) {
//       onComplete(bundle);
//     }
//   };

//   return (
//     <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
//       {/* Breadcrumbs */}
//       <nav className="flex items-center gap-2 text-sm font-medium text-slate-400">
//         <button onClick={onBack} className="flex items-center gap-1 hover:text-[#003366]">
//           <Home className="w-4 h-4" /> Book Bank
//         </button>
//         <ChevronRight className="w-4 h-4" />
//         <span className="text-slate-800">{initialYear} Program</span>
//         {step === 'bundle' && initialYear !== 'FE' && (
//           <>
//             <ChevronRight className="w-4 h-4" />
//             <span className="text-slate-800">{selectedBranch}</span>
//           </>
//         )}
//       </nav>

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//         <div className="lg:col-span-2 space-y-8">
//           {step === 'branch' ? (
//             <div className="space-y-6">
//               <div className="flex items-center gap-4">
//                 <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center text-[#003366]">
//                   <LayoutGrid className="w-6 h-6" />
//                 </div>
//                 <div>
//                   <h2 className="text-2xl font-black text-slate-800">Select Your Branch</h2>
//                   <p className="text-slate-500">Core semester books included for specific departments.</p>
//                 </div>
//               </div>
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                 {(['CE', 'CSE', 'EXTC'] as Branch[]).map(branch => (
//                   <button
//                     key={branch}
//                     onClick={() => {
//                       setSelectedBranch(branch);
//                       setStep('bundle');
//                     }}
//                     className="p-6 bg-white border-2 border-slate-100 rounded-[2rem] text-left hover:border-[#003366] hover:shadow-xl transition-all group"
//                   >
//                     <div className="w-10 h-10 bg-slate-50 rounded-xl mb-4 flex items-center justify-center text-slate-400 group-hover:bg-[#003366] group-hover:text-white transition-colors">
//                       <LayoutGrid className="w-5 h-5" />
//                     </div>
//                     <h3 className="font-bold text-lg text-slate-800 mb-1">{branch}</h3>
//                     <p className="text-xs text-slate-500 leading-relaxed italic">Curated core semester books included</p>
//                   </button>
//                 ))}
//               </div>
//             </div>
//           ) : (
//             <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
//               <div className="flex items-center gap-4">
//                 <button 
//                   onClick={() => initialYear === 'FE' ? onBack() : setStep('branch')} 
//                   className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
//                 >
//                   <ArrowLeft className="w-5 h-5" />
//                 </button>
//                 <div>
//                   <h2 className="text-2xl font-black text-slate-800">{initialYear} - {selectedBranch} Bundle</h2>
//                   <p className="text-slate-500">Semester {bundle?.semester} Set • {bundle?.books.length} Books</p>
//                 </div>
//               </div>

//               {/* Bundle Book List */}
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 {bundle?.books.map((book, i) => (
//                   <div key={i} className="p-5 bg-white border border-slate-100 rounded-3xl flex gap-4 shadow-sm hover:shadow-md transition-shadow">
//                     <div className="w-12 h-16 bg-slate-100 rounded-lg flex items-center justify-center text-slate-300">
//                       <BookOpen className="w-6 h-6" />
//                     </div>
//                     <div>
//                       <h4 className="font-bold text-slate-800 text-sm line-clamp-1">{book.title}</h4>
//                       <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">{book.author}</p>
//                       <span className="px-2 py-0.5 bg-blue-50 text-[#003366] text-[10px] font-bold rounded-md">
//                         {book.subject}
//                       </span>
//                     </div>
//                     <div className="ml-auto flex items-center">
//                       <span className="text-[10px] font-black text-emerald-500 uppercase">Included</span>
//                     </div>
//                   </div>
//                 ))}
//               </div>

//               {/* Timetable Section */}
//               <div className="p-8 bg-slate-900 text-white rounded-[2.5rem] shadow-2xl relative overflow-hidden">
//                 <div className="absolute top-0 right-0 p-8 opacity-5">
//                    <Clock className="w-48 h-48" />
//                 </div>
//                 <div className="relative z-10">
//                   <div className="flex items-center gap-2 mb-6">
//                     <Clock className="w-5 h-5 text-[#FF9933]" />
//                     <h3 className="text-xl font-bold uppercase tracking-tight">Collection Timings</h3>
//                   </div>
//                   <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                     <div className="space-y-1">
//                       <p className="text-blue-200 text-[10px] font-bold uppercase tracking-widest">Schedule</p>
//                       <p className="text-lg font-bold">{schedule?.days.join(' & ')}</p>
//                     </div>
//                     <div className="space-y-1">
//                       <p className="text-blue-200 text-[10px] font-bold uppercase tracking-widest">Window</p>
//                       <p className="text-lg font-bold">{schedule?.time}</p>
//                     </div>
//                     <div className="space-y-1">
//                       <p className="text-blue-200 text-[10px] font-bold uppercase tracking-widest">Location</p>
//                       <p className="text-lg font-bold flex items-center gap-2">
//                         <MapPin className="w-4 h-4 text-[#FF9933]" /> {schedule?.location}
//                       </p>
//                     </div>
//                   </div>
//                   <div className="mt-6 pt-6 border-t border-white/10 flex items-center gap-3 text-xs text-blue-100/60 font-medium">
//                     <ShieldCheck className="w-4 h-4 text-emerald-400" />
//                     Physical collection available immediately after payment confirmation.
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Pricing Card */}
//         <div className="lg:col-span-1">
//           <div className="sticky top-24 space-y-6">
//             <div className="p-8 bg-white border border-slate-100 rounded-[2.5rem] shadow-xl">
//               <h3 className="text-xl font-black text-slate-800 mb-6">Purchase Summary</h3>
//               <div className="space-y-4 mb-8">
//                 <div className="flex justify-between text-slate-500 text-sm">
//                   <span>Semester Bundle Price</span>
//                   <span className="line-through">₹{bundle?.originalPrice}</span>
//                 </div>
//                 <div className="flex justify-between items-center">
//                   <span className="text-slate-800 font-bold">Book Bank Discount</span>
//                   <span className="text-emerald-500 font-black text-sm">- 80%</span>
//                 </div>
//                 <div className="pt-4 border-t border-slate-100 flex justify-between items-end">
//                   <div>
//                     <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Amount to Pay</p>
//                     <p className="text-4xl font-black text-[#003366]">₹{bundle?.price}</p>
//                   </div>
//                 </div>
//               </div>

//               <button 
//                 onClick={handleProceed}
//                 className="w-full py-4 bg-[#003366] text-white rounded-2xl font-bold shadow-xl shadow-[#003366]/20 flex items-center justify-center gap-3 group active:scale-95 transition-all"
//               >
//                 <CreditCard className="w-5 h-5 group-hover:rotate-12 transition-transform" />
//                 {user ? 'Pay via Razorpay' : 'Login to Purchase'}
//               </button>
              
//               {!user && (
//                 <p className="text-center text-[10px] text-slate-400 mt-4 font-medium italic">
//                   * Login required for transaction safety and receipt generation.
//                 </p>
//               )}
//             </div>

//             <div className="p-6 bg-blue-50 border border-blue-100 rounded-3xl flex gap-4">
//               <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center text-[#003366] shadow-sm">
//                 <Check className="w-5 h-5" />
//               </div>
//               <p className="text-xs text-slate-600 font-medium leading-relaxed">
//                 SmartShelves Book Bank ensures you have all your core materials at the lowest possible cost.
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default BookBankFlow;
