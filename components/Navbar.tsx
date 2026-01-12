
import React, { useState, useEffect } from 'react';
import { useStore } from '../contexts/StoreContext';
import { UserRole } from '../types';
import { ShoppingCart, User as UserIcon, Menu, X, LogOut, Search } from 'lucide-react';

interface NavbarProps {
  onNavigate: (page: string) => void;
  currentPage: string;
}

// Professional Geometric Abstract Logo with 3D Drop Shadow
const ApnaStoreLogo = () => (
  <svg width="48" height="48" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-3 transform hover:rotate-6 transition-transform duration-300 drop-shadow-lg">
    <defs>
      <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#2563eb" />
        <stop offset="100%" stopColor="#1d4ed8" />
      </linearGradient>
      <linearGradient id="accentGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#EA580C" />
        <stop offset="100%" stopColor="#C2410C" />
      </linearGradient>
      <filter id="inset-shadow" x="-50%" y="-50%" width="200%" height="200%">
        <feComponentTransfer in="SourceAlpha">
          <feFuncA type="table" tableValues="1 0" />
        </feComponentTransfer>
        <feGaussianBlur stdDeviation="3" />
        <feOffset dx="3" dy="3" result="offsetblur" />
        <feFlood flood-color="rgb(0, 0, 0)" flood-opacity="0.2" />
        <feComposite in2="offsetblur" operator="in" />
        <feComposite in2="SourceAlpha" operator="in" />
        <feMerge>
          <feMergeNode in="SourceGraphic" />
          <feMergeNode />
        </feMerge>
      </filter>
    </defs>
    {/* Background Base with shadow */}
    <rect width="40" height="40" rx="10" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
    
    {/* Abstract Geometric "A" structure with gradients */}
    <path d="M20 6L32 30H26L20 18L14 30H8L20 6Z" fill="url(#logoGradient)" style={{filter: 'drop-shadow(2px 4px 6px rgba(37, 99, 235, 0.3))'}} />
    <path d="M20 18L24 26H16L20 18Z" fill="url(#accentGradient)" style={{filter: 'drop-shadow(0px 2px 4px rgba(234, 88, 12, 0.3))'}} />
    
    {/* Shine effect for 3D glass look */}
    <path d="M12 10L15 13" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.6" />
    <path d="M20 6L8 30H10L20 8V6Z" fill="white" fillOpacity="0.1" />
  </svg>
);

const Navbar: React.FC<NavbarProps> = ({ onNavigate, currentPage }) => {
  const { user, cart, setIsCartOpen, logout } = useStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleNav = (page: string) => {
    onNavigate(page);
    setMobileMenuOpen(false);
  };

  const navItemClass = (page: string) => `
    relative px-3 py-2 text-sm font-bold tracking-wide transition-all duration-300 rounded-lg
    ${currentPage === page 
      ? 'text-primary-700 bg-primary-50 shadow-inner' 
      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 hover:-translate-y-0.5 hover:shadow-md'}
    group
  `;

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-500 ease-out 
      ${isScrolled 
        ? 'bg-white/95 backdrop-blur-xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.15)] border-b border-slate-200/50 py-2' 
        : 'bg-gradient-to-b from-white to-slate-50/80 shadow-[0_35px_60px_-15px_rgba(0,0,0,0.1)] border-b border-slate-200 py-4 transform'
      }`}>
      
      {/* 3D Highlight Line at top */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white to-transparent opacity-50"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="flex justify-between items-center">
          {/* Logo Section */}
          <div className="flex items-center cursor-pointer group" onClick={() => handleNav('home')}>
             <ApnaStoreLogo />
             <div className="flex flex-col drop-shadow-sm">
                <span className="text-2xl font-black text-slate-900 leading-none tracking-tighter uppercase font-heading group-hover:text-primary-700 transition-colors" style={{ textShadow: '1px 2px 2px rgba(0,0,0,0.05)' }}>
                  Apna<span className="text-indigo-700 group-hover:text-indigo-900 transition-colors">Store</span>
                </span>
                <span className="text-[10px] font-bold text-slate-400 tracking-[0.2em] uppercase mt-0.5">Curated Excellence</span>
             </div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6 bg-slate-100/50 p-1.5 rounded-2xl shadow-inner border border-white/50">
            <button onClick={() => handleNav('home')} className={navItemClass('home')}>
              HOME
            </button>
            <button onClick={() => handleNav('shop')} className={navItemClass('shop')}>
              COLLECTIONS
            </button>
            {user?.role === UserRole.ADMIN && (
              <button onClick={() => handleNav('admin_dashboard')} className="px-4 py-2 bg-gradient-to-r from-red-50 to-red-100 text-red-700 text-xs font-black rounded-lg border border-red-200 hover:from-red-600 hover:to-red-700 hover:text-white transition-all shadow-sm hover:shadow-lg hover:-translate-y-0.5">
                ADMIN CONSOLE
              </button>
            )}
            {user?.role === UserRole.USER && (
               <button onClick={() => handleNav('user_dashboard')} className={navItemClass('user_dashboard')}>
                 MY ACCOUNT
               </button>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-2 md:space-x-5">
            <button className="p-2.5 text-slate-500 bg-white hover:text-primary-600 hover:bg-primary-50 rounded-full transition-all md:block hidden shadow-sm border border-slate-100 hover:shadow-md hover:-translate-y-0.5">
              <Search className="w-5 h-5" />
            </button>

            <button onClick={() => setIsCartOpen(true)} className="relative p-2.5 text-slate-700 bg-white hover:text-primary-600 hover:bg-primary-50 rounded-full transition-all shadow-sm border border-slate-100 hover:shadow-md hover:-translate-y-0.5">
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-r from-primary-600 to-indigo-600 text-[10px] font-black text-white ring-2 ring-white shadow-lg">
                  {cartCount}
                </span>
              )}
            </button>

            <div className="h-8 w-px bg-gradient-to-b from-transparent via-slate-300 to-transparent mx-2 hidden md:block"></div>

            {user ? (
              <div className="hidden md:flex items-center space-x-4">
                <div className="flex flex-col items-end">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Welcome</span>
                  <span className="text-xs font-bold text-slate-900 truncate max-w-[100px]">{user.name}</span>
                </div>
                <button onClick={logout} className="p-2.5 text-slate-400 bg-white hover:text-red-500 hover:bg-red-50 rounded-full transition-all shadow-sm border border-slate-100 hover:shadow-md" title="Logout">
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <button onClick={() => handleNav('login')} className="flex items-center space-x-2 px-6 py-2.5 bg-gradient-to-r from-slate-900 to-slate-800 text-white text-xs font-black rounded-xl hover:from-primary-600 hover:to-indigo-600 transition-all shadow-lg hover:shadow-primary-500/30 hover:-translate-y-0.5 active:scale-95 border border-slate-700">
                <UserIcon className="w-4 h-4" />
                <span className="uppercase tracking-widest">Login</span>
              </button>
            )}

            {/* Mobile Toggle */}
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg">
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-xl border-t border-slate-100 animate-in slide-in-from-top duration-300 shadow-2xl relative z-40">
          <div className="px-4 pt-4 pb-6 space-y-3">
             <button onClick={() => handleNav('home')} className="block w-full text-left px-4 py-3 rounded-xl text-sm font-black text-slate-700 hover:bg-primary-50 hover:text-primary-600 transition-all shadow-sm border border-slate-50">HOME</button>
             <button onClick={() => handleNav('shop')} className="block w-full text-left px-4 py-3 rounded-xl text-sm font-black text-slate-700 hover:bg-primary-50 hover:text-primary-600 transition-all shadow-sm border border-slate-50">COLLECTIONS</button>
             {user?.role === UserRole.ADMIN && (
                <button onClick={() => handleNav('admin_dashboard')} className="block w-full text-left px-4 py-3 rounded-xl text-sm font-black text-red-600 bg-red-50 shadow-sm border border-red-100">ADMIN PANEL</button>
             )}
             {user?.role === UserRole.USER && (
                <button onClick={() => handleNav('user_dashboard')} className="block w-full text-left px-4 py-3 rounded-xl text-sm font-black text-slate-700 hover:bg-primary-50 hover:text-primary-600 transition-all shadow-sm border border-slate-50">MY ACCOUNT</button>
             )}
             {user && (
               <button onClick={() => { logout(); setMobileMenuOpen(false); }} className="block w-full text-left px-4 py-3 rounded-xl text-sm font-black text-red-500 hover:bg-red-50 transition-all shadow-sm border border-red-50">LOGOUT</button>
             )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
