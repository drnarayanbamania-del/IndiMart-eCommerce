
import React, { useState, useEffect } from 'react';
import { useStore } from '../contexts/StoreContext';
import { UserRole } from '../types';
import { ShoppingCart, User as UserIcon, Menu, X, LogOut, Search } from 'lucide-react';

interface NavbarProps {
  onNavigate: (page: string) => void;
  currentPage: string;
}

// Professional Geometric Abstract Logo
const ApnaStoreLogo = () => (
  <svg width="48" height="48" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-3 transform hover:rotate-6 transition-transform duration-300">
    <defs>
      <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#2563eb" />
        <stop offset="100%" stopColor="#1d4ed8" />
      </linearGradient>
      <linearGradient id="accentGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#EA580C" />
        <stop offset="100%" stopColor="#C2410C" />
      </linearGradient>
    </defs>
    {/* Background Base */}
    <rect width="40" height="40" rx="10" fill="#f8fafc" />
    {/* Abstract Geometric "A" structure */}
    <path d="M20 6L32 30H26L20 18L14 30H8L20 6Z" fill="url(#logoGradient)" />
    <path d="M20 18L24 26H16L20 18Z" fill="url(#accentGradient)" />
    {/* Shine effect */}
    <path d="M12 10L15 13" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.4" />
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
    relative px-1 py-2 text-sm font-bold tracking-wide transition-all duration-300
    ${currentPage === page ? 'text-primary-600' : 'text-slate-500 hover:text-slate-900'}
    group
  `;

  const navUnderline = (page: string) => `
    absolute bottom-0 left-0 w-full h-0.5 bg-primary-600 transform origin-left transition-transform duration-300
    ${currentPage === page ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}
  `;

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/90 backdrop-blur-md shadow-lg py-2' : 'bg-white py-4'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo Section */}
          <div className="flex items-center cursor-pointer group" onClick={() => handleNav('home')}>
             <ApnaStoreLogo />
             <div className="flex flex-col">
                <span className="text-2xl font-black text-slate-900 leading-none tracking-tighter uppercase font-heading group-hover:text-primary-700 transition-colors">
                  Apna<span className="text-indigo-700 group-hover:text-indigo-900 transition-colors">Store</span>
                </span>
                <span className="text-[10px] font-bold text-slate-400 tracking-[0.2em] uppercase mt-0.5">Curated Excellence</span>
             </div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-10">
            <button onClick={() => handleNav('home')} className={navItemClass('home')}>
              HOME
              <span className={navUnderline('home')} />
            </button>
            <button onClick={() => handleNav('shop')} className={navItemClass('shop')}>
              COLLECTIONS
              <span className={navUnderline('shop')} />
            </button>
            {user?.role === UserRole.ADMIN && (
              <button onClick={() => handleNav('admin_dashboard')} className="px-4 py-1.5 bg-red-50 text-red-600 text-xs font-black rounded-full border border-red-100 hover:bg-red-600 hover:text-white transition-all">
                ADMIN CONSOLE
              </button>
            )}
            {user?.role === UserRole.USER && (
               <button onClick={() => handleNav('user_dashboard')} className={navItemClass('user_dashboard')}>
                 MY ACCOUNT
                 <span className={navUnderline('user_dashboard')} />
               </button>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-2 md:space-x-5">
            <button className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-full transition-all md:block hidden">
              <Search className="w-5 h-5" />
            </button>

            <button onClick={() => setIsCartOpen(true)} className="relative p-2.5 text-slate-700 hover:text-primary-600 hover:bg-primary-50 rounded-full transition-all">
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary-600 text-[10px] font-black text-white ring-2 ring-white">
                  {cartCount}
                </span>
              )}
            </button>

            <div className="h-6 w-px bg-slate-200 mx-2 hidden md:block"></div>

            {user ? (
              <div className="hidden md:flex items-center space-x-4">
                <div className="flex flex-col items-end">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Welcome</span>
                  <span className="text-xs font-bold text-slate-900 truncate max-w-[100px]">{user.name}</span>
                </div>
                <button onClick={logout} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all" title="Logout">
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <button onClick={() => handleNav('login')} className="flex items-center space-x-2 px-5 py-2.5 bg-slate-900 text-white text-xs font-black rounded-full hover:bg-primary-600 transition-all shadow-md active:scale-95">
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
        <div className="md:hidden bg-white border-t border-slate-100 animate-in slide-in-from-top duration-300">
          <div className="px-4 pt-4 pb-6 space-y-3">
             <button onClick={() => handleNav('home')} className="block w-full text-left px-4 py-3 rounded-xl text-sm font-black text-slate-700 hover:bg-primary-50 hover:text-primary-600 transition-all">HOME</button>
             <button onClick={() => handleNav('shop')} className="block w-full text-left px-4 py-3 rounded-xl text-sm font-black text-slate-700 hover:bg-primary-50 hover:text-primary-600 transition-all">COLLECTIONS</button>
             {user?.role === UserRole.ADMIN && (
                <button onClick={() => handleNav('admin_dashboard')} className="block w-full text-left px-4 py-3 rounded-xl text-sm font-black text-red-600 bg-red-50">ADMIN PANEL</button>
             )}
             {user?.role === UserRole.USER && (
                <button onClick={() => handleNav('user_dashboard')} className="block w-full text-left px-4 py-3 rounded-xl text-sm font-black text-slate-700 hover:bg-primary-50 hover:text-primary-600 transition-all">MY ACCOUNT</button>
             )}
             {user && (
               <button onClick={() => { logout(); setMobileMenuOpen(false); }} className="block w-full text-left px-4 py-3 rounded-xl text-sm font-black text-red-500 hover:bg-red-50 transition-all">LOGOUT</button>
             )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
