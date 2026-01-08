
import React, { useState } from 'react';
import { LOGO } from '../constants';
import { User } from '../types';
import { LogOut, User as UserIcon, BookOpen, Search, CreditCard, ChevronDown, Key } from 'lucide-react';
import { useEffect } from 'react';

interface NavbarProps {
  user: User | null;
  onLogin: () => void;
  onAdminLogin: () => void;
  onLogout: () => void;
  onNavigate: (view: string) => void;
  onSearch: (query: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ user, onLogin, onAdminLogin, onLogout, onNavigate, onSearch }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [search, setSearch] = useState('');

useEffect(() => {
  if (!user) setShowDropdown(false);
}, [user]);



  return (
    <nav className="fixed top-0 left-0 right-0 h-16 glass border-b border-slate-200 z-50 px-6 flex items-center justify-between">
      <div className="cursor-pointer" onClick={() => onNavigate('dashboard')}>
        {LOGO}
      </div>
      {/* Center Search Bar */}
      {/* Center Search Bar */}
      <div className="hidden md:flex flex-1 justify-center px-6 ml-40">
        <div className="relative w-full max-w-lg">
          <input

            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                if (!search.trim()) return;
                onSearch(search); // sends search to App
                setSearch(''); // optional: clear input
              }
            }}

            placeholder="Search by book or author"
            className="
        w-full h-10
        px-4 pr-11
        rounded-xl
        bg-white
        border border-slate-300
        text-sm text-slate-700
        placeholder:text-slate-400
        shadow-sm
        focus:outline-none
        focus:ring-1 focus:ring-[#003366]/30
        focus:border-[#003366]/50
        transition
      "
          />
          <button
            onClick={() => {
              if (!search.trim()) return;
              onSearch(search);
            }}
            disabled={!search.trim()}
            className="
    absolute right-3 top-1/2 -translate-y-1/2
    p-1.5 rounded-md
    hover:bg-slate-100
    transition
    disabled:opacity-40
    disabled:cursor-not-allowed
  "
            aria-label="Search books"
          >
            <Search className="w-4 h-4 text-slate-500" />
          </button>

          {/* // <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" /> */}
        </div>
      </div>



      <div className="flex items-center gap-6">
        {!user ? (
          <div className="flex gap-3 items-center">
            <button
              onClick={onLogin}
              className="px-4 py-2 text-sm font-semibold text-[#003366] bg-white border border-slate-100 rounded-full shadow-sm hover:shadow-md transition-all active:scale-95 flex items-center gap-2"
              aria-label="student portal"
            >
              <UserIcon className="w-4 h-4" />
              <span className="hidden sm:inline">Student Portal</span>
            </button>
            <button
              onClick={onAdminLogin}
              className="px-4 py-2 text-sm font-semibold text-[#003366] bg-white border border-slate-100 rounded-full transition-all flex items-center gap-2"
              aria-label="Admin Portal"
            >
              <Key className="w-4 h-4" />
              <span className="hidden sm:inline">Admin Portal</span>
            </button>
          </div>
        ) : (
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-2 bg-slate-100 pr-3 pl-1 py-1 rounded-full hover:bg-slate-200 transition-colors"
            >
              <img src={user.avatar} className="w-8 h-8 rounded-full border-2 border-white" alt="avatar" />
              <span className="text-sm font-semibold text-slate-700">{user.name.split(' ')[0]}</span>
              <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
            </button>

            {showDropdown && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="p-4 border-b border-slate-50">
                  <p className="text-xs text-slate-400 font-semibold uppercase mb-1">Signed in as</p>
                  <p className="text-sm font-bold text-slate-800 truncate">{user.email}</p>
                </div>
                <div className="py-1">
                  <button
                    onClick={() => { onNavigate('profile'); setShowDropdown(false); }}
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 transition-colors"
                  >
                    <BookOpen className="w-4 h-4" /> My Books
                  </button>
                  <button
                    onClick={() => { onNavigate('payments'); setShowDropdown(false); }}
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 transition-colors"
                  >
                    <CreditCard className="w-4 h-4" /> Payments
                  </button>
                  <button
                    onClick={() => { onNavigate('profile'); setShowDropdown(false); }}
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 transition-colors"
                  >
                    <UserIcon className="w-4 h-4" /> Profile
                  </button>
                </div>
                <div className="p-1 border-t border-slate-50">
                  <button
                    onClick={() => { onLogout(); setShowDropdown(false); }}
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="w-4 h-4" /> Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
