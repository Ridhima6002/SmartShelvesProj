import React, { useState, useEffect } from 'react';
// 1. Import your logo file here (adjust path if necessary)
import teamLogo from './assets/team logo.jpeg'; 
import { User } from '../types';
import { LogOut, User as UserIcon, BookOpen, Search, CreditCard, ChevronDown, Key } from 'lucide-react';

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
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!user) setShowDropdown(false);
  }, [user]);

  return (
    <nav className={`fixed top-0 left-0 right-0 h-20 z-50 px-8 flex items-center justify-between transition-all duration-300 ${
      isScrolled ? 'bg-white/80 backdrop-blur-lg shadow-md' : 'bg-transparent border-b border-slate-200/50'
    }`}>
      
      {/* --- 🚀 UPDATED BRAND LOGO SECTION --- */}
      <div 
        className="flex items-center gap-3 cursor-pointer transition-transform hover:scale-105" 
        onClick={() => onNavigate('dashboard')}
      >
        <img 
          src={teamLogo} 
          alt="SmartShelves Logo" 
          className="w-10 h-10 md:w-12 md:h-12 rounded-xl shadow-lg border border-white/50 object-cover" 
        />
        <div className="hidden sm:flex flex-col">
          <span className="text-xl font-black text-[#001f3f] leading-none">
            Smart<span className="text-orange-500">Shelves</span>
          </span>
          <span className="text-[10px] font-bold text-orange-500 tracking-widest uppercase">
            SPIT Library
          </span>
        </div>
      </div>
      {/* ------------------------------------ */}

      {/* Modernized Search Bar */}
      <div className="hidden md:flex flex-1 justify-center px-10">
        <div className="relative w-full max-w-xl group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="w-5 h-5 text-slate-400 group-focus-within:text-orange-500 transition-colors" />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && search.trim()) {
                onSearch(search);
                setSearch('');
              }
            }}
            placeholder="Search by book, author or category..."
            className="w-full h-12 pl-12 pr-4 bg-slate-100/50 border border-slate-200 rounded-2xl text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500/50 focus:bg-white transition-all shadow-sm group-hover:shadow-md"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4">
        {!user ? (
          <div className="flex gap-3">
            <button
              onClick={onLogin}
              className="px-5 py-2.5 text-sm font-bold text-[#003366] bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center gap-2"
            >
              <UserIcon className="w-4 h-4" />
              <span className="hidden lg:inline">Student Portal</span>
            </button>
            <button
              onClick={onAdminLogin}
              className="px-5 py-2.5 text-sm font-bold text-slate-500 bg-slate-100/50 border border-transparent rounded-xl hover:bg-slate-100 transition-all flex items-center gap-2"
            >
              <Key className="w-4 h-4" />
              <span className="hidden lg:inline">Admin</span>
            </button>
          </div>
        ) : (
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-3 bg-white border border-slate-100 p-1.5 pr-4 rounded-2xl shadow-sm hover:shadow-md hover:border-orange-200 transition-all"
            >
              <div className="relative">
                <img src={user.avatar} className="w-9 h-9 rounded-xl border-2 border-white object-cover" alt="avatar" />
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
              </div>
              <div className="text-left hidden sm:block">
                <p className="text-xs text-slate-400 font-bold uppercase leading-none mb-1">Student</p>
                <p className="text-sm font-black text-slate-800 leading-none">{user.name.split(' ')[0]}</p>
              </div>
              <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${showDropdown ? 'rotate-180 text-orange-500' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {showDropdown && (
              <div className="absolute right-0 mt-3 w-64 bg-white rounded-[2rem] shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 p-2">
                <div className="px-4 py-4 mb-2 bg-slate-50 rounded-[1.5rem]">
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Institutional ID</p>
                  <p className="text-sm font-bold text-slate-800 truncate">{user.email}</p>
                </div>
                <div className="space-y-1">
                  <NavItem icon={BookOpen} label="My Library Books" onClick={() => onNavigate('profile')} />
                  {/* <NavItem icon={CreditCard} label="Fine Payments" onClick={() => onNavigate('payments')} />
                  <NavItem icon={UserIcon} label="Account Profile" onClick={() => onNavigate('profile')} /> */}
                </div>
                <div className="mt-2 pt-2 border-t border-slate-100">
                  <button
                    onClick={() => { onLogout(); setShowDropdown(false); }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                  >
                    <LogOut className="w-4 h-4" /> Logout System
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

const NavItem = ({ icon: Icon, label, onClick }: { icon: React.ElementType, label: string, onClick: () => void }) => (
  <button
    onClick={onClick}
    className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-600 hover:bg-slate-50 hover:text-orange-500 rounded-xl transition-all"
  >
    <Icon className="w-4 h-4" />
    {label}
  </button>
);

export default Navbar;