import React, { useState } from 'react';
import { useStore } from '../contexts/StoreContext';
import { UserRole } from '../types';
import { ShoppingCart, User as UserIcon, Menu, X, LogOut } from 'lucide-react';

interface NavbarProps {
  onNavigate: (page: string) => void;
  currentPage: string;
}

// Modern SVG Logo Component - Redesigned (Premium Flat Style)
const ApnaStoreLogo = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2 flex-shrink-0">
    {/* Variation 1: Modern Minimalist Mascot */}
    {/* Handle: Darker premium green, positioned perfectly */}
    <path d="M12 12V8C12 4.5 15.5 1.5 20 1.5C24.5 1.5 28 4.5 28 8V12" stroke="#15803D" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/>
    
    {/* Body: Premium Orange with soft corners */}
    <rect x="5" y="10" width="30" height="28" rx="6" fill="#EA580C"/>
    
    {/* Bottom: Premium Green with a subtle wave/smile curve for brand personality */}
    <path d="M5 26C5 26 15 23 20 23C25 23 35 26 35 26V32C35 35.3137 32.3137 38 29 38H11C7.68629 38 5 35.3137 5 32V26Z" fill="#15803D"/>
    
    {/* Face: Simplified, less cartoonish, more icon-like */}
    <circle cx="13.5" cy="17" r="2" fill="white" fillOpacity="0.95"/>
    <circle cx="26.5" cy="17" r="2" fill="white" fillOpacity="0.95"/>
    
    {/* Smile: Subtle and balanced */}
    <path d="M17.5 21.5C18 22.5 19 23 20 23C21 23 22 22.5 22.5 21.5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const Navbar: React.FC<NavbarProps> = ({ onNavigate, currentPage }) => {
  const { user, cart, setIsCartOpen, logout } = useStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleNav = (page: string) => {
    onNavigate(page);
    setMobileMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center cursor-pointer" onClick={() => handleNav('home')}>
             <ApnaStoreLogo />
            <span className="text-2xl font-heading font-bold text-primary-600 tracking-tight">Apna Store</span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8">
            <button onClick={() => handleNav('home')} className={`${currentPage === 'home' ? 'text-primary-600 font-semibold' : 'text-gray-600 hover:text-primary-600'}`}>Home</button>
            <button onClick={() => handleNav('shop')} className={`${currentPage === 'shop' ? 'text-primary-600 font-semibold' : 'text-gray-600 hover:text-primary-600'}`}>Shop</button>
            {user?.role === UserRole.ADMIN && (
              <button onClick={() => handleNav('admin_dashboard')} className="text-red-500 font-semibold">Admin Panel</button>
            )}
            {user?.role === UserRole.USER && (
               <button onClick={() => handleNav('user_dashboard')} className={`${currentPage === 'user_dashboard' ? 'text-primary-600 font-semibold' : 'text-gray-600 hover:text-primary-600'}`}>Dashboard</button>
            )}
          </div>

          <div className="hidden md:flex items-center space-x-6">
            <button onClick={() => setIsCartOpen(true)} className="relative p-2 text-gray-600 hover:text-primary-600">
              <ShoppingCart className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-red-600 rounded-full">
                  {cartCount}
                </span>
              )}
            </button>

            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium text-gray-700">Hi, {user.name}</span>
                <button onClick={logout} className="p-2 text-gray-600 hover:text-red-500" title="Logout">
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <button onClick={() => handleNav('login')} className="flex items-center space-x-1 text-gray-600 hover:text-primary-600">
                <UserIcon className="w-5 h-5" />
                <span>Login</span>
              </button>
            )}
          </div>

          {/* Mobile Button */}
          <div className="md:hidden flex items-center">
             <button onClick={() => setIsCartOpen(true)} className="relative p-2 text-gray-600 hover:text-primary-600 mr-4">
              <ShoppingCart className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-red-600 rounded-full">
                  {cartCount}
                </span>
              )}
            </button>
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-gray-600">
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
             <button onClick={() => handleNav('home')} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50 w-full text-left">Home</button>
             <button onClick={() => handleNav('shop')} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50 w-full text-left">Shop</button>
             {user?.role === UserRole.ADMIN && (
                <button onClick={() => handleNav('admin_dashboard')} className="block px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50 w-full text-left">Admin Panel</button>
             )}
             {user?.role === UserRole.USER && (
                <button onClick={() => handleNav('user_dashboard')} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50 w-full text-left">Dashboard</button>
             )}
             {!user && (
               <button onClick={() => handleNav('login')} className="block px-3 py-2 rounded-md text-base font-medium text-primary-600 hover:bg-gray-50 w-full text-left">Login / Sign Up</button>
             )}
             {user && (
               <button onClick={() => { logout(); setMobileMenuOpen(false); }} className="block px-3 py-2 rounded-md text-base font-medium text-red-500 hover:bg-gray-50 w-full text-left">Logout</button>
             )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;