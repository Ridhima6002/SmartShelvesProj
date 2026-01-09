// src/BookBankData.tsx
import React, { useState, useEffect,useRef } from "react";
import { supabase } from "../services/supabase";
import BookCard from "./BookCard";
import { Book, Year, Branch } from "../types";
import {
  ChevronRight,
  LayoutGrid,
  Clock,
  MapPin,
  CreditCard,
  ShieldCheck,
  BookOpen,

} from "lucide-react";

const years: Year[] = ["FE", "SE", "TE", "BE"];
const branches: Branch[] = ["CSE", "CE", "EXTC"];
const collectionData = {
  FE: {
    CSE: { window: "10:00 AM – 12:00 PM", location: "CSE Desk" },
    EXTC: { window: "11:00 AM – 1:00 PM", location: "EXTC Desk" },
    CE: { window: "12:00 PM – 2:00 PM", location: "CE Desk" },
  },
  SE: {
    CSE: { window: "1:00 PM – 3:00 PM", location: "CSE Desk" },
    EXTC: { window: "2:00 PM – 4:00 PM", location: "EXTC Desk" },
    CE: { window: "3:00 PM – 5:00 PM", location: "CE Desk" },
  },
  TE: {
    CSE: { window: "10:30 AM – 12:30 PM", location: "CSE Desk" },
    EXTC: { window: "11:30 AM – 1:30 PM", location: "EXTC Desk" },
    CE: { window: "12:30 PM – 2:30 PM", location: "CE Desk" },
  },
  BE: {
    CSE: { window: "1:30 PM – 3:30 PM", location: "CSE Desk" },
    EXTC: { window: "2:30 PM – 4:30 PM", location: "EXTC Desk" },
    CE: { window: "3:30 PM – 5:30 PM", location: "CE Desk" },
  },
};

const BookBankData: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loadingBooks, setLoadingBooks] = useState(true);
 const contentRef = useRef<HTMLDivElement | null>(null);
  const [activeYear, setActiveYear] = useState<Year>("FE");
  const [activeBranch, setActiveBranch] = useState<Branch | null>(null);
  const [year, setYear] = useState<keyof typeof collectionData>("FE");
  const [branch, setBranch] = useState<"CSE" | "EXTC" | "CE">("CSE");

  const { window, location } = collectionData[year][branch];
  useEffect(() => {
    const fetchBooks = async () => {
      setLoadingBooks(true);
      const { data } = await supabase.from("books").select("*");
      setBooks((data || []) as Book[]);
      setLoadingBooks(false);
    };
    fetchBooks();
  }, []);

  const filteredBooks = books.filter((b) => {
    if (activeYear === "FE") return b.year === "FE";
    if (!activeBranch) return false;
    return b.year === activeYear && b.branch === activeBranch;
  });

  return (
    <div className="min-h-screen bg-[#f8fafc] selection:bg-blue-100">
      <div className="max-w-7xl mx-auto px-6 py-12 space-y-12 animate-in fade-in slide-in-from-bottom-4">

        {/* 1. Enhanced Header Section */}
        <header className="relative flex flex-col md:flex-row md:items-end justify-between gap-6">
  {/* Title */}
  <div className="relative w-fit">
    <h1 className="text-6xl md:text-7xl font-extrabold tracking-tight leading-none">
      <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#0B3C5D] via-[#2563EB] to-[#1E40AF] drop-shadow-sm">
        BOOK BANK
      </span>
      <span className="block mt-2 text-3xl md:text-4xl font-bold tracking-wide text-blue-700/90">
        PROGRAM
      </span>
    </h1>

    {/* Accent underline */}
    <div className="mt-4 h-1.5 w-32 rounded-full bg-gradient-to-r from-blue-600 to-blue-400"></div>

    {/* Soft glow */}
    <div className="absolute -top-10 -left-10 w-72 h-72 bg-blue-200/40 rounded-full blur-[90px] -z-10"></div>
  </div>

  {/* Badge */}
  <div className="flex items-center gap-3 px-4 py-2 bg-white/70 backdrop-blur-md rounded-2xl border border-white shadow-sm">
    <ShieldCheck className="text-blue-600 w-5 h-5" />
    <span className="text-sm font-semibold text-slate-700 tracking-tight">
      Verified Academic Program
    </span>
  </div>
</header>


        {/* 2. Year Selection Area (The "Control Panel") */}
        <section className="bg-white/70 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
  <div className="flex flex-col gap-6">
    <div className="flex items-center gap-3 ml-2">
      <span className="h-px w-8 bg-blue-200"></span>
      <p className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-400">Select Academic Year</p>
    </div>
    <div className="grid grid-cols-4 gap-4">
      {years.map((y) => (
        <button
          key={y}
          onClick={() => { setActiveYear(y); setActiveBranch(null); setTimeout(() => {
    contentRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, 100);
}}
          className={`relative px-6 py-6 rounded-2xl font-black text-xl transition-all duration-300 transform active:scale-95 ${
            activeYear === y
              ? "bg-blue-600 text-white shadow-[0_20px_40px_-10px_rgba(37,99,235,0.4)] border-2 border-blue-400"
              : "bg-blue-500 text-white/90 border-2 border-blue-400/50 hover:bg-blue-600 hover:border-blue-400 hover:shadow-lg"
          }`}
        >
          {activeYear === y && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-white border-2 border-blue-600"></span>
            </span>
          )}
          {y}
        </button>
      ))}
    </div>
  </div>
</section>

        {/* 3. Branch Selection (Modern Grid) */}
        {activeYear !== "FE" && !activeBranch && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4">
            {branches.map((b) => (
              <button
                key={b}
                onClick={() => setActiveBranch(b)}
                className="group relative bg-white border border-slate-100 rounded-[2.5rem] p-10 text-left transition-all hover:-translate-y-2 hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] hover:border-blue-500/20 overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                   <LayoutGrid size={120} />
                </div>
                <div className="w-16 h-16 rounded-2xl bg-slate-50 group-hover:bg-[#001a33] flex items-center justify-center mb-8 transition-colors duration-500">
                  <LayoutGrid className="text-slate-400 group-hover:text-blue-400" size={28} />
                </div>
                <h3 className="text-3xl font-black text-slate-800 group-hover:text-[#001a33]">{b}</h3>
                <p className="text-slate-400 mt-2 font-medium">Explore curriculum bundles</p>
                <div className="mt-6 flex items-center text-blue-600 font-bold text-sm opacity-0 group-hover:opacity-100 transition-all translate-x-[-10px] group-hover:translate-x-0">
                  View Collection <ChevronRight size={16} />
                </div>
              </button>
            ))}
          </div>
        )}

        {/* 4. Main Content Area (Split View) */}
        {(activeYear === "FE" || activeBranch) && (
  <div
    ref={contentRef}
    className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start scroll-mt-24"
  >

            
            {/* Left: Books and Schedule */}
            <div className="lg:col-span-8 space-y-10">
              
              {/* Included Books Section */}
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <h2 className="text-3xl font-black text-[#001a33] flex items-center gap-3">
                    <span className="p-2 bg-blue-50 text-blue-600 rounded-lg"><BookOpen /></span>
                    Included Books
                  </h2>
                  <div className="flex-1 h-px bg-gradient-to-r from-slate-200 to-transparent"></div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {loadingBooks ? (
                    <div className="col-span-full py-12 text-center bg-white rounded-3xl border border-dashed border-slate-200">
                      <p className="text-slate-400 animate-pulse font-bold">Curating your collection...</p>
                    </div>
                  ) : (
                    filteredBooks.map((book) => (
                      <div key={book.id} className="group bg-white rounded-3xl p-6 shadow-sm border border-slate-100 hover:shadow-xl hover:border-blue-100 transition-all duration-300">
                        <div className="flex justify-between items-start mb-4">
                          <div className="p-3 bg-slate-50 rounded-xl group-hover:bg-blue-50 transition-colors">
                            <BookOpen className="text-slate-400 group-hover:text-blue-600" size={20} />
                          </div>
                          <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                            Available
                          </span>
                        </div>
                        <h3 className="text-xl font-black text-slate-800 leading-tight">{book.title}</h3>
                        <p className="text-sm text-slate-500 mt-2 font-medium italic">by {book.author}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Schedule Card */}
              <div className="relative bg-[#001a33] rounded-[3rem] p-10 text-white overflow-hidden shadow-2xl">
                <Clock className="absolute -right-10 -top-10 w-64 h-64 text-white/5 rotate-12" />
                
                <div className="relative z-10">
                  <div className="flex justify-between items-start flex-wrap gap-6 mb-10">
                    <div>
                      <h3 className="text-2xl font-black mb-2 flex items-center gap-2">
                        <Clock className="text-blue-400" /> Collection Window
                      </h3>
                      <p className="text-blue-200/60 font-medium">Please arrive at your designated time-slot.</p>
                    </div>
                    
                    <div className="flex gap-3 bg-white/5 p-2 rounded-2xl backdrop-blur-md">
                      <select 
                        value={year} 
                        onChange={(e) => setYear(e.target.value as any)}
                        className="bg-transparent text-sm font-bold p-2 focus:outline-none"
                      >
                        {Object.keys(collectionData).map(y => <option key={y} value={y} className="text-black">{y}</option>)}
                      </select>
                      <select 
                        value={branch} 
                        onChange={(e) => setBranch(e.target.value as any)}
                        className="bg-transparent text-sm font-bold p-2 focus:outline-none border-l border-white/10"
                      >
                        {["CSE", "EXTC", "CE"].map(b => <option key={b} value={b} className="text-black">{b}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    <div className="bg-white/5 rounded-3xl p-6 border border-white/10 hover:bg-white/10 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-500/20 rounded-2xl"><Clock className="text-blue-400" /></div>
                        <div>
                          <p className="text-xs uppercase tracking-widest font-black text-blue-300/60">Time Slot</p>
                          <p className="text-xl font-bold">{window}</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-white/5 rounded-3xl p-6 border border-white/10 hover:bg-white/10 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-emerald-500/20 rounded-2xl"><MapPin className="text-emerald-400" /></div>
                        <div>
                          <p className="text-xs uppercase tracking-widest font-black text-emerald-300/60">Collection Point</p>
                          <p className="text-xl font-bold">{location}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Sticky Sidebar Summary */}
            <aside className="lg:col-span-4 sticky top-10">
              <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-2xl space-y-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full blur-3xl -mr-16 -mt-16"></div>
                
                <div className="relative text-center">
                  <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
                    <CreditCard className="w-10 h-10 text-[#001a33]" />
                  </div>
                  <h3 className="text-2xl font-black text-slate-800">Purchase Summary</h3>
                  <p className="text-slate-400 font-medium text-sm mt-1">Safe & Secure checkout</p>
                </div>

                <div className="bg-slate-50 rounded-[2rem] p-6 space-y-4">
                  <div className="flex justify-between items-center text-sm font-bold text-slate-400">
                    <span>Bundle Price</span>
                    <span className="line-through">₹5,000</span>
                  </div>
                  <div className="flex justify-between items-end">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md w-fit mb-1">SAVE 80%</span>
                      <span className="text-4xl font-black text-[#001a33]">₹999</span>
                    </div>
                    <span className="text-slate-400 text-xs font-bold pb-1">One-time fee</span>
                  </div>
                </div>

                <button className="group w-full bg-[#001a33] text-white py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-3 transition-all hover:bg-[#002b55] hover:shadow-[0_15px_30px_-5px_rgba(0,26,51,0.4)] active:scale-95">
                  <CreditCard className="group-hover:animate-pulse" />
                  Pay via Razorpay
                </button>

                <div className="flex items-start gap-4 p-4 bg-blue-50/50 rounded-2xl border border-blue-100">
                  <ShieldCheck className="text-blue-600 shrink-0" size={20} />
                  <p className="text-[11px] leading-relaxed text-blue-900/70 font-bold uppercase tracking-tight">
                    Secured by SmartShelves · Official Book Bank program for students.
                  </p>
                </div>
              </div>
            </aside>

          </div>
        )}
      </div>
    </div>
  );
};

export default BookBankData;
