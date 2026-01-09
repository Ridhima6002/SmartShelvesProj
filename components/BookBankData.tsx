// src/BookBankData.tsx
import React, { useState, useEffect, useRef } from "react";
import { supabase } from "../services/supabase";
import {User, Book, Year, Branch } from "../types";
import {
  ChevronRight,
  Clock,
  MapPin,
  CreditCard,
  ShieldCheck,
  BookOpen,
  Library,
  Zap
} from "lucide-react";
import PaymentModal from '../components/PaymentModal';
// import { supabase } from '../services/supabase';
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
interface BookBankDataProps {
  user: User;
 
}
const BookBankData: React.FC<BookBankDataProps> = ({ user }) => {

  const [books, setBooks] = useState<Book[]>([]);
  const [loadingBooks, setLoadingBooks] = useState(true);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const [activeYear, setActiveYear] = useState<Year>("FE");
  const [activeBranch, setActiveBranch] = useState<Branch | null>(null);
  // const [year, setYear] = useState<keyof typeof collectionData>("FE");
  // const [branch, setBranch] = useState<"CSE" | "EXTC" | "CE">("CSE");

  const scheduleYear = activeYear;
const scheduleBranch = activeYear === "FE" ? "CSE" : activeBranch;

const { window, location } =
  scheduleBranch
    ? collectionData[scheduleYear][scheduleBranch]
    : { window: "", location: "" };

 const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [fineAmount, setFineAmount] = useState<number>(0);
  const [loadingFines, setLoadingFines] = useState(true);

  const fetchFines = async () => {
    const { data, error } = await supabase
      .from('students')
      .select('fines')
      .eq('email', user.email)
      .single();

    if (error) {
      console.error('Error fetching fines:', error);
    } else {
      setFineAmount(data?.fines ?? 0);
    }
    setLoadingFines(false);
  };

  useEffect(() => {
    fetchFines();
  }, [user.email]);

  const handlePaymentSuccess = async () => {
    const { error } = await supabase
      .from('students')
      .update({ fines: 0 })
      .eq('email', user.email);

    if (error) {
      console.error('Error updating fines:', error);
    } else {
      setFineAmount(0);
    }
  };
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
  if (activeYear === "FE") return b.year === "FE"; // no branch filter
  if (!activeBranch) return false;
  return b.year === activeYear && b.branch === activeBranch;
});

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-24">
      <div className="max-w-7xl mx-auto px-6 pt-10 space-y-12">
        
        {/* --- HERO SECTION (DASHBOARD STYLE) --- */}
        <section className="relative overflow-hidden rounded-[3rem] min-h-[70vh] flex items-center bg-gradient-to-br from-[#001f3f] to-[#001326] p-8 lg:p-12 text-white shadow-2xl">
          {/* Animated gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#003366]/60 to-[#001a33]/60 animate-pulse opacity-70" />
          
          <div className="relative z-10 w-full flex flex-wrap xl:flex-nowrap items-center justify-between gap-12">
            
            {/* LEFT SIDE: TITLES */}
            <div className="flex-1 max-w-xl">
              <h1 className="text-6xl lg:text-7xl font-black leading-tight tracking-tight mb-2">
                Book <span className="text-orange-500">Bank</span>
              </h1>
              <div className="h-1.5 w-24 bg-orange-600 mt-2 rounded-full mb-6" />
              
              <p className="text-xl font-semibold text-blue-100 mb-4">
                Full Semester Resource Bundles
              </p>
              <p className="text-base lg:text-lg text-blue-200 opacity-90 leading-relaxed mb-8">
                Access verified textbooks for your entire phase at a fraction of the cost. 
                Select your current year to view available collections and schedule.
              </p>

              <div className="flex items-center gap-3 px-4 py-2 bg-white/5 border border-white/10 rounded-2xl w-fit">
                <ShieldCheck className="text-orange-500" size={18} />
                <span className="text-xs font-bold uppercase tracking-widest text-blue-100">Official SPIT Program</span>
              </div>
            </div>

            {/* RIGHT SIDE: YEAR SELECTION GRID (FeatureCard Style) */}
            <div className="w-full max-w-[550px]">
              <div className="grid grid-cols-2 gap-4">
                {years.map((y) => (
                  <div
                    key={y}
                    onClick={() => {
                      setActiveYear(y);
                      setActiveBranch(null);
                    }}
                    className={`relative cursor-pointer rounded-[2rem] p-6 border transition-all duration-300 group flex flex-col h-full backdrop-blur-md
                      ${activeYear === y 
                        ? 'bg-white/15 border-orange-500/50 shadow-orange-500/10 -translate-y-1' 
                        : 'bg-white/5 border-white/10 hover:bg-white/10'}`}
                  >
                    <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl transition-transform group-hover:scale-110 
                      ${activeYear === y ? 'bg-orange-500 text-[#001f3f]' : 'bg-orange-500/20 text-orange-400'}`}>
                      <Library size={24} />
                    </div>
                    <h3 className="text-lg font-bold">Phase {y}</h3>
                    <p className="text-sm text-blue-200 mb-3 opacity-70">
                      {y === "FE" ? "Freshman" : y === "SE" ? "Sophomore" : y === "TE" ? "Junior" : "Senior"} Resources
                    </p>
                    <span className={`text-sm font-bold transition-all ${activeYear === y ? 'text-orange-400' : 'text-slate-400 opacity-0 group-hover:opacity-100'}`}>
                      {activeYear === y ? "Selected ✓" : "Select Phase →"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* --- BRANCH SELECTION --- */}
        {activeYear !== "FE" && !activeBranch && (
          <div className="animate-in fade-in slide-in-from-top-4">
            <h2 className="text-2xl font-black text-[#001f3f] mb-6 flex items-center gap-3">
              <span className="h-2 w-2 rounded-full bg-orange-500"></span>
              Select your Branch
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {branches.map((b) => (
                <button
                  key={b}
                  onClick={() => setActiveBranch(b)}
                  className="p-8 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all text-left group"
                >
                  <div className="w-12 h-12 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center mb-6 group-hover:bg-[#001f3f] group-hover:text-orange-400 transition-colors">
                    <Zap size={24} />
                  </div>
                  <h3 className="text-2xl font-black text-slate-800">{b}</h3>
                  <p className="text-slate-400 font-medium">Curriculum bundle for {activeYear}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* --- MAIN CONTENT AREA --- */}
        {(activeYear === "FE" || activeBranch) && (
          <div ref={contentRef} className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start animate-in fade-in duration-700">
            
            {/* Left: Books and Schedule */}
            <div className="lg:col-span-8 space-y-10">
              
              {/* Books List */}
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <h2 className="text-3xl font-black text-[#001f3f] tracking-tight">
                    Included <span className="text-orange-500">Resources</span>
                  </h2>
                  <div className="flex-1 h-px bg-slate-200"></div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {loadingBooks ? (
                    <div className="col-span-full py-12 text-center bg-white rounded-3xl border border-dashed">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
                      <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Syncing Bundle...</p>
                    </div>
                  ) : (
                    filteredBooks.map((book) => (
                      <div key={book.id} className="group bg-white rounded-3xl p-6 shadow-sm border border-slate-100 hover:border-orange-500/30 transition-all">
                        <div className="flex justify-between items-start mb-4">
                          <div className="p-3 bg-slate-50 rounded-xl group-hover:bg-orange-500/10 group-hover:text-orange-500 transition-colors">
                            <BookOpen size={20} />
                          </div>
                          <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">Bundle Item</span>
                        </div>
                        <h3 className="text-xl font-black text-slate-800 leading-tight">{book.title}</h3>
                        <p className="text-sm text-slate-500 mt-2 italic">by {book.author}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Schedule Card (Dark Themed) */}
              <div className="relative bg-[#001a33] rounded-[3rem] p-10 text-white overflow-hidden shadow-2xl border border-white/5">
                <Clock className="absolute -right-10 -top-10 w-64 h-64 text-orange-500/5 rotate-12" />
                
                <div className="relative z-10 space-y-8">
                  <div className="flex justify-between items-center flex-wrap gap-4">
                    <div>
                      <h3 className="text-2xl font-black flex items-center gap-3">
                        <Clock className="text-orange-500" /> Collection Schedule
                      </h3>
                      <p className="text-blue-200/60 font-medium">Phase {activeYear} • {activeBranch || 'Freshman'}</p>
                    </div>
                    
                    <div className="flex gap-2 bg-white/5 p-1.5 rounded-2xl border border-white/10">
                      <div className="px-4 py-2 bg-orange-500 rounded-xl text-[#001f3f] font-black text-xs uppercase">Verified Slot</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="bg-white/5 rounded-3xl p-6 border border-white/10">
                      <p className="text-[10px] uppercase font-black text-orange-500 tracking-[0.2em] mb-1">Time Slot</p>
                      <p className="text-xl font-bold">{window}</p>
                    </div>
                    <div className="bg-white/5 rounded-3xl p-6 border border-white/10">
                      <p className="text-[10px] uppercase font-black text-orange-500 tracking-[0.2em] mb-1">Location</p>
                      <p className="text-xl font-bold">{location}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar Summary */}
            <aside className="lg:col-span-4 sticky top-10">
              <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-2xl space-y-8 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full blur-3xl" />
                
                <div className="text-center">
                  <div className="w-20 h-20 bg-orange-50 text-orange-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
                    <CreditCard size={40} />
                  </div>
                  <h3 className="text-2xl font-black text-slate-800">Checkout</h3>
                  <p className="text-slate-400 font-medium text-sm">Secure one-time payment</p>
                </div>

                <div className="bg-white p-6 mb-6 border border-gray-200 rounded-2xl">
                <span className="text-gray-400 text-xs uppercase tracking-widest font-bold">Total Balance</span>
                <h2 className="text-3xl font-black text-gray-800 mt-2">
                  {loadingFines ? 'Loading...' : `₹${fineAmount.toFixed(2)}`}
                </h2>
              </div>

                {fineAmount > 0 && !loadingFines ? (
                <button
                  onClick={() => setShowPaymentModal(true)}
                  className="w-full bg-blue-200 text-blue-700 py-4 rounded-2xl font-bold text-lg hover:bg-blue-300 transition-all transform hover:-translate-y-1 active:scale-95"
                >
                  PAY NOW
                </button>
              ) : (
                !loadingFines && (
                  <div className="py-4 px-6 bg-green-100 border border-green-200 rounded-2xl text-green-600 font-bold">
                    All Dues Cleared
                  </div>
                )
              )}

                <div className="flex items-start gap-4 p-4 bg-orange-50/50 rounded-2xl border border-orange-100">
                  <ShieldCheck className="text-orange-500 shrink-0" size={20} />
                  <p className="text-[11px] leading-tight text-[#001f3f]/70 font-bold uppercase">
                    Secured by SmartShelves · Resources must be returned at the end of the semester.
                  </p>
                </div>
              </div>
            </aside>

          </div>
        )}
      </div>
      {showPaymentModal && (
        <PaymentModal
          amount={fineAmount}
          onClose={() => setShowPaymentModal(false)}
          onSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
};

export default BookBankData;