
import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import BookCard from './components/BookCard';
import BookDetail from './components/BookDetail';
import StudentDashboard from './components/StudentDashboard';
import AdminPortal from './components/AdminPortal';
import AIChatbot from './components/AIChatbot';
import RackMap from './components/RackMap';
import SearchResults from './components/SearchResults'
import AuthModal from './components/AuthModal';
import { supabase } from './services/supabase';
import BookBankData from './components/BookBankData'
import { RACK_INFO } from './data';
import { Book, Year, Branch, User } from './types';
import { onAuthStateChanged, signOut } from './services/firebase';
import { ChevronRight, Calendar, BookOpen, Library, BrainCircuit, LayoutGrid, Zap, Filter, ArrowLeft, Compass, FileX } from 'lucide-react';
import { Users } from 'lucide-react'; // Rename the icon import to avoid conflict

const App: React.FC = () => {
  const [view, setView] = useState('dashboard');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [activeYear, setActiveYear] = useState<Year>('FE');
  const [activeBranch, setActiveBranch] = useState<Branch>('CE');
  const [adminIntent, setAdminIntent] = useState(false);
  const [books, setBooks] = useState<Book[]>([]);
  const [loadingBooks, setLoadingBooks] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [pendingBookAction, setPendingBookAction] = useState<Book | null>(null);
  const [loginPrompt, setLoginPrompt] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [count, setCount] = useState(2410);
  const [hasStarted, setHasStarted] = useState(false);
  const statsRef = React.useRef<HTMLDivElement>(null);

  const targetCount = React.useMemo(() => Math.floor(Math.random() * (3000 - 2500 + 1)) + 2500, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasStarted(true);
        } else {
          setHasStarted(false); // <--- This resets it when you scroll away
          setCount(2410);       // <--- This resets the number
        }
      },
      { threshold: 0.2 } // Trigger slightly earlier for a smoother feel
    );

    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!hasStarted) return;

    const duration = 1500;
    const frameDuration = 1000 / 60;
    const totalFrames = Math.round(duration / frameDuration);
    let frame = 0;

    const timer = setInterval(() => {
      frame++;
      const progress = 1 - Math.pow(1 - frame / totalFrames, 2);
      const currentCount = Math.floor(2410 + (targetCount - 2410) * progress);

      if (frame <= totalFrames) {
        setCount(currentCount);
      } else {
        setCount(targetCount);
        clearInterval(timer);
      }
    }, frameDuration);

    return () => clearInterval(timer);
  }, [hasStarted, targetCount]);


  // Subscribe to Firebase auth state and handle admin intent redirect
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(async (u) => {

      if (u) {
        // 🔹 fetch issued_books from students table
        const { data, error } = await supabase
          .from('students')
          .select('issued_books, fines')
          .eq('email', u.email)
          .single();

        if (error) {
          console.error('Error fetching student data:', error);
        }

        // 🔹 attach issuedBooks to user
        setUser({
          ...u,
          issuedBooks: data?.issued_books || [],
          fines: data?.fines || 0,
        });

        // admin intent logic (UNCHANGED)
        if (adminIntent) {
          if (u.role === 'admin') {
            setView('admin');
            setShowAuthModal(false);
          } else {
            alert('You are not authorized as admin.');
            signOut().catch(() => { });
            setView('dashboard');
            setShowAuthModal(false);
          }
          setAdminIntent(false);
        }

      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, [adminIntent]);


  // Keep URL in sync with view (simple routing behavior)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (view === 'admin') {
        window.history.pushState({}, '', '/admin');
      } else if (view === 'dashboard') {
        window.history.pushState({}, '', '/');
      }
    }
  }, [view]);
  useEffect(() => {
    setSelectedBook(null);
  }, [view]);
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }, [view]);


  useEffect(() => {
    const fetchBooks = async () => {
      setLoadingBooks(true); // start loading

      try {
        const { data, error } = await supabase
          .from('books')  // make sure table name is EXACT
          .select('*');

        console.log("Supabase data:", data);
        console.log("Supabase error:", error);

        if (error) {
          console.error("Error fetching books:", error);
          setBooks([]); // clear books if error
        } else {
          setBooks(data as Book[]); // set books from Supabase
        }
      } catch (err) {
        console.error("Unexpected fetch error:", err);
        setBooks([]); // clear books on unexpected error
      } finally {
        setLoadingBooks(false); // stop loading
      }
    };

    fetchBooks();
  }, []);



  // On mount, read the path to initialize view
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const p = window.location.pathname;
      if (p === '/admin') setView('admin');
    }
  }, []);
  interface FeatureCardProps {
    icon: React.ReactNode;
    title: string;
    desc: string;
    hint?: string;
    pulse?: boolean;
    onClick?: () => void;
  }

  const FeatureCard = ({ icon, title, desc, hint, pulse, onClick }: FeatureCardProps) => (
    <div
      onClick={onClick}
      className={`
       relative cursor-pointer rounded-[2rem] bg-white/5 backdrop-blur-md p-6
      border border-white/10 shadow-lg transition-all duration-300
      hover:-translate-y-2 hover:bg-white/10 hover:border-orange-500/50 hover:shadow-orange-500/10
      group flex flex-col h-full
        ${pulse ? 'animate-pulse' : ''}
      `}
    >
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-orange-500/20 text-orange-400 group-hover:scale-110 transition-transform">
        {icon}
      </div>

      <h3 className="text-lg font-bold mb-3">{title}</h3>
      <p className="text-sm text-blue-200 mb-3">{desc}</p>

      {hint && (
        <span className="flex items-center text-sm font-bold text-orange-400 group-hover:gap-2 transition-all">
          {hint}
        </span>
      )}
    </div>
  );

  const filteredBooks = books.filter(
    (b) => b.year === activeYear && (activeYear === 'FE' ? true : b.branch === activeBranch)
  );
  const handleBookAction = async (book: Book) => {
    console.log('📚 Issue Book clicked:', book.title);

    if (!user) {
      console.log('❌ User not logged in');

      setSelectedBook(null);

      // show message
      setLoginPrompt(true);

      return;
    }


    console.log('✅ User logged in:', user.name || user.email);

    const userName = user.name || user.email || 'Student';

    if (book.available && user) {

      const issuedAt = new Date().toISOString().split('T')[0];
      const dueDate = new Date(
        Date.now() + 14 * 24 * 60 * 60 * 1000
      ).toISOString().split('T')[0];

      const newIssuedBook = {
        bookId: book.id,
        title: book.title,
        author: book.author,
        courseCode: book.course_code,
        issuedDate: issuedAt,
        dueDate: dueDate,
      };


      // 1️⃣ Get current issued_books
      // 1️⃣ Fetch existing issued books
      const { data, error: fetchError } = await supabase
        .from('students')
        .select('issued_books')
        .eq('email', user.email)
        .single();

      if (fetchError) {
        console.error(fetchError);
        alert('Could not fetch student record');
        return;
      }

      // 🔒 PREVENT DUPLICATES
      const alreadyIssued = (data.issued_books || []).some(
        (b: any) => b.bookId === book.id
      );

      if (alreadyIssued) {
        alert('⚠️ You have already issued this book.');
        return;
      }

      // 2️⃣ Append new book
      const updatedIssuedBooks = [
        ...(data.issued_books || []),
        newIssuedBook,
      ];

      // 3️⃣ Update Supabase
      await supabase
        .from('students')
        .update({ issued_books: updatedIssuedBooks })
        .eq('email', user.email);

      // 4️⃣ Update local state
      setUser(prev =>
        prev ? { ...prev, issuedBooks: updatedIssuedBooks } : prev
      );

      // 4️⃣ Navigate
      setIsNavigating(true);
      setSelectedBook(null);

      setTimeout(() => {
        setView('profile');
        setIsNavigating(false);
      }, 600);
    }
    else {
      alert(`📌 Joined waitlist for ${book.title}`);
    }
  };

  const years: Year[] = ['FE', 'SE', 'TE', 'BE'];
  const branches: Branch[] = ['CE', 'CSE', 'EXTC'];
  // Generate a random number between 2500 and 3000
  const activeMembersCount = React.useMemo(() => {
    return Math.floor(Math.random() * (3000 - 2500 + 1)) + 2500;
  }, []);

  return (
    <div className="min-h-screen bg-blue-100 text-slate-800 pb-24">
      <Navbar
        user={user}
        onLogin={() => setShowAuthModal(true)}
        onAdminLogin={() => {
          if (user && user.role === 'admin') {
            setView('admin');
          } else {
            setAdminIntent(true);
            setShowAuthModal(true);
          }
        }}
        onLogout={() => signOut()}
        onNavigate={(v) => setView(v)}
        onSearch={(query) => {
          setSearchQuery(query);
          setView('search');
        }}
      />

      <main
        className={`max-w-7xl mx-auto px-6 pt-20 space-y-6 transition-all duration-500 ease-in-out
      ${isNavigating ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}
    `}
      >
        {/* Dashboard View */}
        {view === 'dashboard' && (
          <>
            {/* Updated Hero Section */}
            <section className="
    relative overflow-hidden rounded-[3rem]
    min-h-[85vh] max-h-[90vh]
    flex items-center
    bg-gradient-to-br from-[#001f3f] to-[#001326]
    
    p-8 lg:p-10
    text-white shadow-2xl
  ">

              {/* Animated gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#003366]/60 to-[#001a33]/60 animate-pulse opacity-70" />

              {/* Floating light streak */}
              <div className="absolute top-[-20%] right-[-10%] w-[45%] h-[110%] opacity-60 bg-[#FF9933]/10 skew-x-12 blur-[20px] rounded-full animate-[float_12s_ease-in-out_infinite]" />

              {/* Content */}
              <div className="relative z-10 w-full max-w-[1200px] mx-auto flex flex-wrap xl:flex-nowrap items-center justify-between gap-10">


                {/* LEFT SIDE */}
                <div className="flex-1 min-w-[280px] max-w-xl text-center xl:text-left">
                  {/* Title */}
                  <h1 className="text-6xl lg:text-7xl xl:text-7xl font-black leading-tight tracking-tight mb-2">
                    Smart
                    <span className="text-orange-500">
                      Shelves
                    </span>
                  </h1>
                  <div className="h-1.5 w-24 bg-orange-600 mt-2 rounded-full mb-6" />

                  {/* Tagline */}
                  <p className="text-xl font-semibold text-blue-100 mb-2">
                    The Smart Way to Navigate Your Library
                  </p>

                  <p className="text-base lg:text-lg text-blue-200 opacity-90 leading-relaxed mb-6">
                    Seamlessly manage academic resources, locate textbooks instantly, and
                    navigate the SPIT library with real-time intelligence.
                  </p>

                  {/* CTA BUTTONS */}
                  <div className="flex flex-col sm:flex-row gap-4 justify-center xl:justify-start">
                    <button
                      onClick={() => document.getElementById('stats')?.scrollIntoView({ behavior: 'smooth' })}
                      className="group flex items-center gap-3 rounded-2xl bg-gradient-to-r from-orange-600 via-orange-500 to-orange-600 hover:bg-orange-600 px-8 py-4 font-bold text-[#001f3f] shadow-xl shadow-orange-950/20 hover:scale-105 transition-all"
                    >
                      Explore Library
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>

                {/* RIGHT SIDE – FEATURE GRID */}

                <div className="w-full max-w-[520px]">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-4">


                    <FeatureCard
                      icon={<Library className="w-6 h-6 text-[#FF9933]" />}
                      title="Academic Bookshelf"
                      desc="Branch-wise textbooks"
                      hint="View shelves →"
                      onClick={() => document.getElementById('bookshelf')?.scrollIntoView({ behavior: 'smooth' })}
                    />

                    <FeatureCard
                      icon={<LayoutGrid className="w-6 h-6 text-[#FF9933]" />}
                      title="Library Floor Plan"
                      desc="Locate books instantly"
                      hint="Find faster →"
                      onClick={() => document.getElementById('floorplan')?.scrollIntoView({ behavior: 'smooth' })}
                    />

                    <FeatureCard
                      icon={<Calendar className="w-6 h-6 " />}
                      title="Book Bank"
                      desc="Collection schedules"
                      hint="Check dates →"
                      // pulse
                      onClick={() => document.getElementById('bookbank')?.scrollIntoView({ behavior: 'smooth' })}
                    />

                    <FeatureCard
                      icon={<BrainCircuit className="w-6 h-6 " />}
                      title="Transactions"
                      desc="Personalized history"
                      hint="Your activity →"
                      onClick={() => {
                        if (user) setView('profile');
                        else setLoginPrompt(true);
                      }}
                    />
                  </div>
                </div>
              </div>
            </section>
            {/* Floating Stats Bridge */}
            <div id="stats" className="relative z-20 -mt-10 max-w-5xl mx-auto px-6 scroll-mt-32">
              <div
                ref={statsRef}
                className={`grid grid-cols-2 md:grid-cols-4 gap-4 bg-white/80 backdrop-blur-xl p-4 rounded-[2.5rem] border border-white shadow-xl shadow-blue-900/5 transition-all duration-700 ${hasStarted ? 'opacity-100 scale-100' : 'opacity-50 scale-95'
                  }`}
              >
                {[
                  { label: 'Books Available', value: '12,400+', icon: <BookOpen className="w-4 h-4" /> },
                  {
                    label: 'Active Members',
                    value: `${count.toLocaleString()}+`,
                    icon: <Users className="w-4 h-4" />
                  },
                  { label: 'Digital Access', value: '24/7', icon: <Zap className="w-4 h-4" /> },
                  { label: 'Study Racks', value: '45', icon: <LayoutGrid className="w-4 h-4" /> },
                ].map((stat, i) => (
                  <div key={i} className="flex flex-col items-center justify-center py-2 border-r last:border-0 border-slate-100">
                    <div className="flex items-center gap-2">
                      <div className={`text-orange-500 font-black text-2xl tabular-nums tracking-tighter transition-all duration-300 ${hasStarted && stat.label === 'Active Members' ? 'brightness-110' : ''
                        }`}>
                        {stat.value}
                      </div>

                      {stat.label === 'Active Members' && (
                        <span className={`relative flex h-2 w-2 transition-opacity duration-500 ${hasStarted ? 'opacity-100' : 'opacity-0'}`}>
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] uppercase tracking-widest text-slate-400 font-bold flex items-center gap-1 text-center mt-1">
                      {stat.icon} {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>




            {/* Main Library Controls */}
            {/* <section className="flex flex-col md:flex-row md:items-end justify-between gap-6"> */}
            {/* Reduced padding from py-20 to py-8 and minimized top margin */}
            <section id="bookshelf" className="py-2  scroll-mt-28">
              <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">

                {/* Left Side: Modern Typography with tighter spacing */}
                <div className="relative">
                  <div className="absolute -left-6 -top-6 w-24 h-24 bg-orange-500/5 blur-[40px] rounded-full" />

                  <div className="flex items-center gap-3 mb-2">
                    <div className="h-8 w-1.5 bg-gradient-to-b from-[#FF9933] to-orange-200 rounded-full" />
                    <h2 className="text-4xl font-black text-[#001f3f] tracking-tight">
                      Academic <span className="text-[#FF9933]">Bookshelf</span>
                    </h2>
                  </div>
                  <p className="text-slate-500 text-sm font-medium max-w-md ml-4 leading-snug">
                    Premium resources and branch-specific textbooks for the modern engineer.
                  </p>
                </div>

                {/* Right Side: Compact Floating Glass Filters */}
                <div className="flex flex-col sm:flex-row items-center gap-3">

                  {/* Year Selector: Slimmer Padding */}
                  <div className="flex p-1 bg-slate-100/80 backdrop-blur-md rounded-2xl border border-slate-200 shadow-sm">
                    {years.map(y => (
                      <button
                        key={y}
                        onClick={() => setActiveYear(y)}
                        className={`px-5 py-1.5 rounded-xl font-bold text-xs transition-all duration-300 ${activeYear === y
                            ? 'bg-[#001f3f] text-white shadow-md scale-105'
                            : 'text-slate-400 hover:text-[#001f3f]'
                          }`}
                      >
                        {y}
                      </button>
                    ))}
                  </div>

                  {/* Branch Selector: Slimmer Padding */}
                  {activeYear !== 'FE' && (
                    <div className="flex p-1 bg-orange-50/50 backdrop-blur-md rounded-2xl border border-orange-100 animate-in zoom-in-95">
                      {branches.map(b => (
                        <button
                          key={b}
                          onClick={() => setActiveBranch(b)}
                          className={`px-5 py-1.5 rounded-xl font-bold text-xs transition-all duration-300 ${activeBranch === b
                              ? 'bg-[#FF9933] text-white shadow-sm'
                              : 'text-[#FF9933]/60 hover:text-[#FF9933]'
                            }`}
                        >
                          {b}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Thin, subtle divider with reduced top margin */}
              <div className=" h-px w-full bg-gradient-to-r from-transparent via-slate-200/60 to-transparent" />
            </section>

            {/* Book Sliders */}
            <section className="space-y-0">
              <div className="flex items-center justify-between border-b border-slate-100 pb-5">
                {/* Dynamic Label - Added this part */}
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className="flex h-2 w-2 rounded-full bg-orange-500 animate-pulse"></span>
                    <h3 className="text-sm font-black uppercase tracking-[0.2em] text-[#001f3f]/80">
                      {activeYear} {activeYear !== 'FE' ? activeBranch : 'General'} Resources
                    </h3>
                  </div>
                </div>

                {/* Optional: Add a "Clear Filters" or "View All" if needed */}
              </div>

              <div className="flex gap-6 overflow-x-auto pb-4 pt-2 scrollbar-hide snap-x">
                {loadingBooks ? (
                  <div className="w-full h-48 flex flex-col items-center justify-center text-slate-400 gap-3">
                    <div className="w-10 h-10 border-[3px] border-[#001f3f]/5 border-t-[#001f3f] rounded-full animate-spin" />
                    <p className="font-bold text-[10px] uppercase tracking-[0.2em] text-[#001f3f]/40">Syncing Database...</p>
                  </div>
                ) : filteredBooks.length > 0 ? (
                  filteredBooks.map((book) => (
                    <div key={book.id} className="snap-center">
                      <BookCard book={book} onClick={(b) => setSelectedBook(b)} />
                    </div>
                  ))
                ) : (
                  /* Using FileX which is a valid Lucide icon */
                  <div className="w-full h-56 bg-slate-50/50 rounded-3xl border border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400">
                    <div className="p-5 bg-white rounded-2xl shadow-sm mb-4 border border-slate-100">
                      <FileX className="w-8 h-8 opacity-20 text-[#001f3f]" />
                    </div>
                    <p className="font-black text-[#001f3f]/30 uppercase text-[10px] tracking-[0.3em]">No Resources Indexed</p>
                  </div>
                )}
              </div>
            </section>

            {/* Library Rack Navigation */}
            <section id="floorplan" className="scroll-mt-28 relative group">
              {/* Blue Glow Effect */}
              <div className="absolute -inset-4 bg-blue-500/5 blur-[50px] rounded-[3rem] -z-10 transition-opacity group-hover:bg-blue-500/10" />

              <div className="relative bg-white/50 backdrop-blur-sm rounded-[2.5rem] border border-blue-100/50 shadow-[0_20px_50px_rgba(0,51,102,0.05)] overflow-hidden">
                <RackMap />
              </div>
            </section>

            <section id="bookbank" className="relative w-full min-h-[500px] overflow-hidden rounded-[2rem] bg-[#001a33] flex items-center">
              {/* Background Image with Overlay */}
              <div className="absolute inset-0">
                <img
                  src="components/assets/libImage.jpg"
                  alt="Library"
                  className="w-full h-full object-cover opacity-60"
                />
                {/* Darker gradient to ensure text readability on the left */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#001a33] via-[#001a33]/80 to-transparent" />
              </div>

              {/* Content Container */}
              <div className="relative z-10 w-full max-w-4xl px-8 md:px-16 py-12">
                <span className="inline-block px-3 py-1 mb-6 text-xs font-bold tracking-widest text-blue-400 uppercase bg-blue-500/10 border border-blue-500/20 rounded-full">
                  New Benefit
                </span>

                <h2 className="mb-4 text-4xl md:text-6xl font-extrabold text-white tracking-tight">
                  Book Bank <span className="text-blue-400">Program</span>
                </h2>

                <p className="max-w-lg mb-8 text-lg md:text-xl text-slate-300 leading-relaxed">
                  Get full semester book bundles at <span className="text-white font-semibold">20% of the cost</span>.
                  A collaborative initiative for all engineering years at SPIT.
                </p>

                <div className="flex flex-wrap gap-4">
                  <button
                    onClick={() => setView('bookbank')}
                    className="px-8 py-3 font-semibold text-white transition bg-blue-600 rounded-xl hover:bg-blue-500 hover:shadow-lg hover:shadow-blue-500/30"
                  >
                    Enroll Now
                  </button>

                  <button className="px-8 py-3 font-semibold text-white transition bg-white/10 backdrop-blur-md border border-white/20 rounded-xl hover:bg-white/20">
                    Learn More
                  </button>
                </div>
              </div>
            </section>
          </>
        )}
        {view === 'search' && (
          <SearchResults
            query={searchQuery}          // pass the search text
            books={books}                // pass all books
            onBack={() => setView('dashboard')}
            onSelectBook={(book) => setSelectedBook(book)}
          />
        )}

        {/* Profile/Student View */}
        {view === 'profile' && user && (
          <div className="space-y-8">
            <div className="flex items-center gap-4 mb-8">
              <button
                onClick={() => setView('dashboard')}
                className="p-3 bg-white rounded-2xl border border-slate-100 shadow-sm text-slate-400 hover:text-[#003366] transition-colors"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <div>
                <h1 className="text-4xl font-black text-slate-800">Student Hub</h1>
                <p className="text-slate-500 font-medium">Manage your issues and subscriptions</p>
              </div>
            </div>
            <StudentDashboard user={user} books={filteredBooks} />
          </div>
        )}
        {/* Book Bank View */}
        {view === 'bookbank' && <BookBankData />}


        {/* Admin Placeholder */}
        {view === 'admin' && (
          user && user.role === 'admin' ? (
            <AdminPortal user={user} onBack={() => setView('dashboard')} />
          ) : (
            <div className="flex flex-col items-center justify-center py-32 space-y-6">
              <h1 className="text-3xl font-bold text-slate-800">Admin access required</h1>
              <p className="text-slate-500">Please sign in with an admin account to access this portal.</p>
              <div className="flex gap-4">
                <button onClick={() => { setAdminIntent(true); setShowAuthModal(true); }} className="px-6 py-3 bg-white border border-slate-100 rounded-2xl">Sign in as Admin</button>
                <button onClick={() => setView('dashboard')} className="px-6 py-3 bg-[#003366] text-white rounded-2xl">Back to Dashboard</button>
              </div>
            </div>
          )
        )}
      </main>

      {/* Overlays */}
      {selectedBook && (
        <BookDetail
          book={selectedBook}
          onClose={() => setSelectedBook(null)}
          onAction={handleBookAction}
        />
      )}


      <AuthModal
        open={showAuthModal}
        admin={adminIntent}
        onClose={() => {
          setShowAuthModal(false);
          setAdminIntent(false);
          setPendingBookAction(null);
        }}
        onSuccess={(u) => {
          setUser(u);
          setShowAuthModal(false);

          // IMPORTANT: do NOT auto-issue
          // User must click "Issue Book" again
        }}
      />
      {loginPrompt && (
        <div
          className="fixed inset-0 z-[120] flex items-center justify-center"
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              setLoginPrompt(false);
            }
          }}
          tabIndex={-1} // REQUIRED for key events
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-slate-900/50 backdrop-blur-md"
            onClick={() => setLoginPrompt(false)} // click outside closes
          />

          {/* Auth Gate Card */}
          <div className="relative bg-white max-w-md w-full mx-4 px-8 py-7 rounded-3xl shadow-2xl">
            {/* Close button */}
            <button
              onClick={() => setLoginPrompt(false)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 transition"
              aria-label="Close"
            >
              ✕
            </button>

            <h2 className="text-2xl font-black text-slate-800 text-center">
              🔐 Login Required
            </h2>

            <p className="text-slate-500 text-center mt-3 leading-relaxed">
              Please sign in to issue books, join queues, and manage your library activity.
            </p>

            <button
              onClick={() => {
                setLoginPrompt(false);
                setShowAuthModal(true);
              }}
              className="mt-6 w-full py-3 rounded-2xl bg-[#003366] text-white font-bold hover:scale-[1.02] transition"
            >
              Continue to Login
            </button>
          </div>
        </div>
      )}

      {/* <div className="fixed bottom-6 right-6 z-[110]">
          </div> */}

      <AIChatbot />
    </div>

  );

};

export default App;
