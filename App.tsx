
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
import { SCHEDULES, RACK_INFO } from './data';
import { Book, Year, Branch, User } from './types';
import { onAuthStateChanged, signOut } from './services/firebase';
import { ChevronRight, Calendar, BookOpen, Library, BrainCircuit, LayoutGrid, Zap, Filter, ArrowLeft } from 'lucide-react';


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



  // Subscribe to Firebase auth state and handle admin intent redirect
  useEffect(() => {
    const unsubscribe = onAuthStateChanged((u) => {
      setUser(u);
      if (u && adminIntent) {
        if (u.role === 'admin') {
          setView('admin');
          setShowAuthModal(false);
        } else {
          alert('You are not authorized as admin. Redirecting to main view.');
          // Sign out the non-admin user and return to dashboard
          signOut().catch(() => { });
          setView('dashboard');
          setShowAuthModal(false);
        }
        setAdminIntent(false);
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
//  useEffect(() => {
//   if (loginPrompt) {
//     console.log('🔔 Login prompt shown');

//     const t = setTimeout(() => {
//       console.log('➡️ Login prompt finished → opening auth');

//       setLoginPrompt(false);
//       setShowAuthModal(true);
//     }, 2000); // message duration

//     return () => clearTimeout(t);
//   }
// }, [loginPrompt]);




  const filteredBooks = books.filter(
    (b) => b.year === activeYear && (activeYear === 'FE' ? true : b.branch === activeBranch)
  );
const handleBookAction = (book: Book) => {
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

  if (book.available) {
    console.log(`📖 Book issued to ${userName}`);
    alert(`✅ Book issued successfully to ${userName}`);
  } else {
    console.log(`⏳ Book not available, waitlist joined`);
    alert(`📌 Joined waitlist for ${book.title}`);
  }

  setSelectedBook(null);
};




  const years: Year[] = ['FE', 'SE', 'TE', 'BE'];
  const branches: Branch[] = ['CE', 'CSE', 'EXTC'];

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 pb-24">
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

      <main className="max-w-7xl mx-auto px-6 pt-24 space-y-12">
        {/* Dashboard View */}
        {view === 'dashboard' && (
          <>
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-br from-[#003366] to-[#001a33] p-12 lg:p-16 rounded-[3rem] text-white shadow-2xl">
              <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[120%] bg-white/5 skew-x-12 blur-3xl rounded-full"></div>
              <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
                <div className="max-w-2xl text-center lg:text-left">
                  <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full mb-6 border border-white/10 animate-in slide-in-from-left duration-700">
                    <Zap className="w-4 h-4 text-[#FF9933]" />
                    <span className="text-xs font-bold uppercase tracking-widest text-[#FF9933]">Next-Gen Library System</span>
                  </div>
                  <h1 className="text-5xl lg:text-7xl font-black leading-tight tracking-tighter mb-6">
                    Smart<span className="text-[#FF9933]">Shelves</span>
                  </h1>
                  <p className="text-lg lg:text-xl text-blue-100 font-medium mb-10 max-w-xl opacity-90 leading-relaxed">
                    Access SPIT's intelligent library catalog. From real-time queue status to AI-powered book search, we've revolutionized your academic journey.
                  </p>
                  <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                    <button className="px-10 py-4 bg-white text-[#003366] font-black rounded-2xl shadow-xl hover:scale-105 transition-all active:scale-95 flex items-center gap-2 group">
                      Explore Catalog <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                    <button className="px-10 py-4 bg-white/10 backdrop-blur-md border border-white/20 text-white font-black rounded-2xl hover:bg-white/20 transition-all">
                      View Timetable
                    </button>
                  </div>
                </div>
                <div className="hidden lg:block w-96 animate-in zoom-in duration-1000">
                  <div className="relative bg-white/10 backdrop-blur-2xl p-8 rounded-[3rem] border border-white/20 shadow-inner">
                    <div className="flex justify-between items-center mb-6">
                      <h4 className="font-bold">Popular Today</h4>
                      <span className="text-xs text-[#FF9933] font-bold">LIVE DATA</span>
                    </div>
                    <div className="space-y-4 opacity-40">
                      {[1, 2, 3].map(i => (
                        <div key={i} className="flex gap-4 items-center bg-white/5 p-3 rounded-2xl">
                          <div className="w-10 h-10 bg-white/10 rounded-xl"></div>
                          <div className="flex-1 h-2 bg-white/10 rounded-full"></div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Main Library Controls */}
            <section className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <h2 className="text-3xl font-black text-[#003366] mb-2 flex items-center gap-3">
                  <Library className="w-8 h-8" /> Academic Bookshelf
                </h2>
                <p className="text-slate-500 font-medium max-w-md">Find year-specific textbooks and recommended reading curated for your branch.</p>
              </div>
              <div className="flex flex-wrap items-center gap-4 bg-white p-2 rounded-3xl border border-slate-100 shadow-sm">
                <div className="flex items-center gap-2 p-2 px-4 bg-slate-50 rounded-2xl text-slate-400 font-bold text-xs uppercase tracking-wider">
                  <Filter className="w-3 h-3" /> Filters
                </div>
                <div className="flex gap-1">
                  {years.map(y => (
                    <button
                      key={y}
                      onClick={() => setActiveYear(y)}
                      className={`px-6 py-2 rounded-2xl font-bold text-sm transition-all ${activeYear === y ? 'bg-[#003366] text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'}`}
                    >
                      {y}
                    </button>
                  ))}
                </div>
                {activeYear !== 'FE' && (
                  <>
                    <div className="w-px h-6 bg-slate-200 hidden sm:block mx-1"></div>
                    <div className="flex gap-1">
                      {branches.map(b => (
                        <button
                          key={b}
                          onClick={() => setActiveBranch(b)}
                          className={`px-6 py-2 rounded-2xl font-bold text-sm transition-all ${activeBranch === b ? 'bg-[#FF9933] text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'}`}
                        >
                          {b}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </section>

            {/* Book Sliders */}
            <section className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                  <LayoutGrid className="w-5 h-5 text-[#003366]" /> {activeYear} {activeYear !== 'FE' && activeBranch} Resources
                </h3>
                <button className="text-[#003366] font-bold text-sm flex items-center gap-1 hover:underline">
                  View All <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              <div className="flex gap-6 overflow-x-auto pb-6 pt-2 scrollbar-hide snap-x">
                {loadingBooks ? (
                  // Show a loading state while fetching
                  <div className="w-full h-48 flex items-center justify-center text-slate-400">
                    Loading books...
                  </div>
                ) : filteredBooks.length > 0 ? (
                  // Render books once loaded
                  filteredBooks.map((book) => (
                    <div key={book.id} className="snap-center">
                      <BookCard book={book} onClick={(b) => setSelectedBook(b)} />
                    </div>
                  ))
                ) : (
                  // No books found for this selection
                  <div className="w-full h-48 bg-slate-50 rounded-[2.5rem] border border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400">
                    <BookOpen className="w-12 h-12 mb-3 opacity-20" />
                    <p className="font-bold">No books found for this selection.</p>
                  </div>
                )}
              </div>

            </section>

            {/* Library Rack Navigation */}
            <section>
              <RackMap />
            </section>

            {/* Timetable Section */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm">
                <h3 className="text-2xl font-black text-[#003366] mb-6 flex items-center gap-3">
                  <Calendar className="w-6 h-6" /> Book Bank Collection
                </h3>
                <div className="space-y-4">
                  {SCHEDULES.map((s, idx) => (
                    <div key={idx} className="flex items-center justify-between p-5 bg-slate-50 rounded-2xl group hover:bg-[#003366] transition-all cursor-pointer">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold transition-colors ${idx % 2 === 0 ? 'bg-blue-100 text-[#003366] group-hover:bg-white/20 group-hover:text-white' : 'bg-orange-100 text-[#FF9933] group-hover:bg-white/20 group-hover:text-white'}`}>
                          {s.year}
                        </div>
                        <div>
                          <p className="font-bold text-slate-800 group-hover:text-white transition-colors">{s.days.join(' & ')}</p>
                          <p className="text-xs text-slate-500 group-hover:text-blue-100 transition-colors uppercase font-bold tracking-widest">{s.time}</p>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-white group-hover:translate-x-1 transition-all" />
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-[#FF9933] p-10 rounded-[3rem] text-white shadow-xl flex flex-col justify-center relative overflow-hidden group">
                <div className="absolute right-[-10%] bottom-[-10%] p-12 opacity-10 rotate-12 group-hover:scale-110 transition-transform duration-1000">
                  <BrainCircuit className="w-64 h-64" />
                </div>
                <h3 className="text-4xl font-black mb-4">AI Chat Assistant</h3>
                <p className="text-orange-50 font-medium mb-8 max-w-xs text-lg opacity-90 leading-snug">
                  Need help finding a specific rack or book? Ask Smarty, our intelligent library bot.
                </p>
                <button className="w-fit px-10 py-4 bg-white text-[#FF9933] font-black rounded-2xl shadow-xl hover:shadow-white/20 transition-all flex items-center gap-2">
                  Launch AI Chat <Zap className="w-4 h-4" />
                </button>
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






      <AIChatbot />

      <footer className="fixed bottom-0 left-0 right-0 bg-white/60 backdrop-blur-xl border-t border-slate-100 h-16 flex items-center justify-center z-40">
        <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-widest">
          Collaborative Initiative by <span className="text-[#003366]">Team Go SmartShelves</span>
        </div>
      </footer>
    </div>
  );

};

export default App;
