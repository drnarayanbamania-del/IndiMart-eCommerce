import React, { useState, useEffect } from 'react';
import { useStore } from '../contexts/StoreContext';
import { UserRole } from '../types';
import { ShoppingCart, User as UserIcon, Menu, X, LogOut, Search } from 'lucide-react';

interface NavbarProps {
  onNavigate: (page: string) => void;
  currentPage: string;
}

// Custom Illustrated Logo matching 'Apna Store / Bharat E Store' style
const BharatEMartLogo = () => (
  <svg width="56" height="56" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="transform hover:scale-110 transition-transform duration-500 drop-shadow-lg filter">
    {/* Blue Shopping Cart (Left Side) - Adjusted positioning */}
    <path d="M8 38H16L20 62H50" stroke="#3b82f6" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M20 62L17 72" stroke="#3b82f6" strokeWidth="4" strokeLinecap="round" />
    <path d="M18 45H53" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" opacity="0.4"/>
    <path d="M19 53H50" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" opacity="0.4"/>
    <circle cx="22" cy="74" r="3.5" fill="#3b82f6" />
    <circle cx="46" cy="74" r="3.5" fill="#3b82f6" />
    
    {/* Shopping Bag (Main Character) - Centered and vibrant */}
    {/* Blue Handles */}
    <path d="M45 30V20C45 12 65 12 65 20V30" stroke="#0284c7" strokeWidth="5" strokeLinecap="round" fill="none"/>
    
    {/* Bag Body - Top (Orange/Saffron) */}
    <path d="M35 30H75L78 52H32L35 30Z" fill="#f97316" stroke="#c2410c" strokeWidth="1"/>
    
    {/* Bag Body - Bottom (Green) */}
    <path d="M32 52H78L80 78C80 85 75 85 75 85H35C35 85 30 85 30 78L32 52Z" fill="#22c55e" stroke="#15803d" strokeWidth="1"/>
    
    {/* White Curved Separator (Smile shape on bag body) */}
    <path d="M32 52Q55 62 78 52" stroke="white" strokeWidth="4" fill="none" />

    {/* Face Eyes - Larger and cuter */}
    <ellipse cx="48" cy="44" rx="5" ry="6" fill="white"/>
    <circle cx="48" cy="44" r="2.5" fill="#1e293b"/>
    <ellipse cx="62" cy="44" rx="5" ry="6" fill="white"/>
    <circle cx="62" cy="44" r="2.5" fill="#1e293b"/>

    {/* Face Mouth (Open Smile) */}
    <path d="M48 58Q55 68 62 58Z" fill="#7f1d1d"/>
    <path d="M52 64Q55 66 58 64" stroke="#fca5a5" strokeWidth="2" strokeLinecap="round" />

    {/* Hanging Tags (Right Side) - More defined */}
    <g transform="translate(73, 28) rotate(15)">
       <rect x="0" y="0" width="12" height="18" rx="2" fill="#ef4444" stroke="white" strokeWidth="1" />
       <circle cx="6" cy="3" r="1.5" fill="white" />
    </g>
    <g transform="translate(76, 25) rotate(35)">
       <rect x="0" y="0" width="12" height="18" rx="2" fill="#facc15" stroke="white" strokeWidth="1" />
       <circle cx="6" cy="3" r="1.5" fill="white" />
       <path d="M3 15L9 15" stroke="#ca8a04" strokeWidth="1" />
    </g>
    
    {/* Sparkles - Animated feel positions */}
    <path d="M25 15L27 10L29 15L34 17L29 19L27 24L25 19L20 17L25 15Z" fill="#fbbf24" className="animate-pulse"/>
    <path d="M85 18L87 15L89 18L92 19L89 20L87 23L85 20L82 19L85 18Z" fill="#38bdf8" className="animate-pulse delay-75"/>
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
        <div className="flex justify-between items-center h-16">
          {/* Logo Section */}
          <div className="flex items-center cursor-pointer group select-none" onClick={() => handleNav('home')}>
             <div className="relative z-10 p-1 bg-white/50 rounded-full backdrop-blur-sm shadow-sm border border-white/50 group-hover:bg-white/80 transition-all">
                <BharatEMartLogo />
             </div>
             <div className="flex flex-col ml-3 justify-center">
                <h1 className="text-2xl md:text-3xl font-black text-slate-900 leading-none tracking-tight uppercase font-heading group-hover:text-primary-900 transition-colors drop-shadow-sm flex items-baseline gap-1.5" style={{ textShadow: '1px 1px 0px rgba(255,255,255,0.5)' }}>
                  Bharat <span className="text-transparent bg-clip-text bg-gradient-to-tr from-indigo-600 to-primary-500 relative -top-[1px] inline-block transform group-hover:scale-110 transition-transform duration-300">E</span> Mart
                </h1>
                <div className="flex items-center overflow-hidden h-4">
                   <div className="h-[2px] w-0 bg-gradient-to-r from-indigo-500 to-primary-500 rounded-full mr-0 opacity-0 group-hover:w-6 group-hover:mr-2 group-hover:opacity-100 transition-all duration-500 ease-out"></div>
                   <span className="text-[10px] font-bold text-slate-500 tracking-[0.25em] uppercase whitespace-nowrap group-hover:text-indigo-600 transition-colors">India's Choice</span>
                </div>
             </div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6 bg-slate-100/50 p-1.5 rounded-2xl shadow-inner border border-white/50 ml-8">
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
          <div className="flex items-center space-x-2 md:space-x-5 ml-auto">
            <button className="p-2.5 text-slate-500 bg-white hover:text-primary-600 hover:bg-primary-50 rounded-full transition-all md:block hidden shadow-sm border border-slate-100 hover:shadow-md hover:-translate-y-0.5">
              <Search className="w-5 h-5" />
            </button>

            <button onClick={() => setIsCartOpen(true)} className="relative p-2.5 text-slate-700 bg-white hover:text-primary-600 hover:bg-primary-50 rounded-full transition-all shadow-sm border border-slate-100 hover:shadow-md hover:-translate-y-0.5">
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-r from-primary-600 to-indigo-600 text-[10px] font-black text-white ring-2 ring-white shadow-lg animate-in zoom-in">
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