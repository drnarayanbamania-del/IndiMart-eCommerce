import React, { useState } from 'react';
import { useStore } from '../contexts/StoreContext';
import { UserRole } from '../types';
import { ShoppingCart, User as UserIcon, Menu, X, LogOut } from 'lucide-react';

interface NavbarProps {
  onNavigate: (page: string) => void;
  currentPage: string;
}

// Modern SVG Logo Component
const ApnaStoreLogo = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2 flex-shrink-0">
    {/* Handle */}
    <path d="M13 11V7C13 3.13401 16.134 0 20 0C23.866 0 27 3.13401 27 7V11" stroke="#15803D" strokeWidth="3.5" strokeLinecap="round"/>
    {/* Bag Body - Orange Top */}
    <path d="M5.5 11H34.5L32.8 36.6C32.65 38.5 31.1 40 29.2 40H10.8C8.9 40 7.35 38.5 7.2 36.6L5.5 11Z" fill="#F97316"/>
    {/* Bag Body - Green Bottom (Live Better) */}
    <path d="M6.2 25H33.8L32.8 36.6C32.65 38.5 31.1 40 29.2 40H10.8C8.9 40 7.35 38.5 7.2 36.6L6.2 25Z" fill="#16A34A"/>
    {/* Minimalist Mascot Face */}
    <circle cx="14" cy="19" r="2.5" fill="white"/>
    <circle cx="26" cy="19" r="2.5" fill="white"/>
    <path d="M17 25C17 25 18.5 27 20 27C21.5 27 23 25 23 25" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
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
            <span className="text-2xl font-heading font-bold text-primary-600 tracking-tight">ApnaStore</span>
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