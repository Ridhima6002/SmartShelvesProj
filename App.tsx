
import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import BookCard from './components/BookCard';
import BookDetail from './components/BookDetail';
import StudentDashboard from './components/StudentDashboard';
import AIChatbot from './components/AIChatbot';
import RackMap from './components/RackMap';
import { MOCK_BOOKS, MOCK_USER, SCHEDULES } from './data';
import { Book, Year, Branch, User } from './types';
import { ChevronRight, Calendar, BookOpen, Library, BrainCircuit, LayoutGrid, Zap, Filter, ArrowLeft } from 'lucide-react';

const App: React.FC = () => {
  const [view, setView] = useState('dashboard');
  const [user, setUser] = useState<User | null>(MOCK_USER); // Default to logged in for preview
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [activeYear, setActiveYear] = useState<Year>('SE');
  const [activeBranch, setActiveBranch] = useState<Branch>('EXTC');

  const filteredBooks = MOCK_BOOKS.filter(b => b.year === activeYear && (activeYear === 'FE' ? true : b.branch === activeBranch));

  const years: Year[] = ['FE', 'SE', 'TE', 'BE'];
  const branches: Branch[] = ['CE', 'CSE', 'EXTC'];

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 pb-24">
      <Navbar 
        user={user} 
        onLogin={() => setUser(MOCK_USER)} 
        onLogout={() => setUser(null)}
        onNavigate={(v) => setView(v)}
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
                <p className="text-slate-500 font-medium max-w-md">Find semester-specific textbooks and recommended reading curated for your branch.</p>
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
                {filteredBooks.length > 0 ? filteredBooks.map(book => (
                  <div key={book.id} className="snap-center">
                    <BookCard book={book} onClick={(b) => setSelectedBook(b)} />
                  </div>
                )) : (
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
            <StudentDashboard user={user} books={MOCK_BOOKS} />
          </div>
        )}

        {/* Admin Placeholder */}
        {view === 'admin' && (
          <div className="flex flex-col items-center justify-center py-32 space-y-8">
            <h1 className="text-4xl font-black text-slate-800">Admin Portal</h1>
            <p className="text-slate-500">Coming soon.</p>
            <button onClick={() => setView('dashboard')} className="px-10 py-4 bg-[#003366] text-white font-black rounded-2xl">Back to Dashboard</button>
          </div>
        )}
      </main>

      {/* Overlays */}
      {selectedBook && (
        <BookDetail 
          book={selectedBook} 
          onClose={() => setSelectedBook(null)}
          onAction={(b) => {
            alert(b.available ? `Successfully issued: ${b.title}` : `Joined waitlist for: ${b.title}`);
            setSelectedBook(null);
          }}
        />
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
