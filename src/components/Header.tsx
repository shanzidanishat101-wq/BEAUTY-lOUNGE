import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { ASSETS } from '../data/mockData';
import { PageView } from '../types';

export const Header: React.FC = () => {
  const {
    currentPage,
    navigateTo,
    cartCount,
    cartTotal,
    wishlistIds,
    searchQuery,
    setSearchQuery,
    user,
    setActiveCategory,
    isAdminAuthenticated,
    adminUser,
    logoutAdmin,
    isDarkMode,
    toggleDarkMode,
  } = useStore();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks: { label: string; page: PageView; category?: string; badge?: string }[] = [
    { label: 'Home', page: 'home' },
    { label: 'Shop All', page: 'shop-catalog', category: 'All' },
    { label: 'Skincare', page: 'shop-catalog', category: 'Skincare' },
    { label: 'Makeup', page: 'shop-catalog', category: 'Makeup' },
    { label: 'Haircare', page: 'shop-catalog', category: 'Haircare' },
    { label: 'Fragrance', page: 'shop-catalog', category: 'Fragrance' },
    { label: 'Offers', page: 'shop-catalog', category: 'Offers' },
    { label: 'Track Order', page: 'tracking' },
    {
      label: isAdminAuthenticated ? 'Admin Panel' : 'Admin Login',
      page: 'admin-portal',
      badge: isAdminAuthenticated ? 'Active' : undefined,
    },
  ];

  const handleNavClick = (page: PageView, category?: string) => {
    if (category) {
      setActiveCategory(category);
    }
    navigateTo(page);
    setMobileMenuOpen(false);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentPage !== 'shop-catalog') {
      navigateTo('shop-catalog');
    }
  };

  return (
    <header className="fixed top-0 inset-x-0 z-40 bg-[#fff8f8]/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(197,136,130,0.08)]">
      {/* Eid Glow Top Strip */}
      <div className="bg-[#84504c] text-white py-1.5 px-4 text-center">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 text-xs sm:text-sm">
          <span className="material-symbols-outlined text-sm">auto_awesome</span>
          <p className="font-medium tracking-wide">
            Special Eid Glow Sale: Up to 35% Off Across Gulshan, Banani, Dhanmondi & Nationwide Express Delivery | 100% Authentic Guaranteed
          </p>
        </div>
      </div>

      {/* Main Top Header */}
      <div className="h-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 flex items-center justify-between gap-4 sm:gap-6">
        {/* Brand Lockup */}
        <button
          onClick={() => navigateTo('home')}
          className="flex items-center gap-3 shrink-0 text-left hover:opacity-90 transition-opacity"
        >
          <img
            alt="Beauty Lounge Logo"
            className="h-8 w-auto object-contain"
            src={ASSETS.logo}
          />
          <div className="flex flex-col">
            <span className="font-headline text-lg sm:text-xl tracking-tight text-[#84504c] font-bold leading-tight">
              BEAUTY LOUNGE
            </span>
            <span className="text-[10px] uppercase tracking-widest text-[#524342]">
              Dhaka • Luxe Formulations
            </span>
          </div>
        </button>

        {/* Global Search Bar */}
        <form
          onSubmit={handleSearchSubmit}
          className="hidden xl:flex flex-1 max-w-md mx-4"
        >
          <div className="w-full flex items-center bg-[#fbf1f3] px-4 py-2 rounded-full focus-within:ring-2 focus-within:ring-[#c58882] transition-all">
            <span className="material-symbols-outlined text-[#524342] text-sm mr-2.5">
              search
            </span>
            <input
              type="text"
              placeholder="Search authentic serums, lipsticks, niche perfumes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent border-none outline-none text-xs sm:text-sm text-[#1f1a1c] placeholder:text-[#524342]/70"
            />
            <div className="hidden sm:flex items-center gap-1.5 ml-2">
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('K-Beauty');
                  navigateTo('shop-catalog');
                }}
                className="px-2 py-0.5 rounded-full bg-[#f6ebee] text-[10px] font-semibold text-[#524342] hover:bg-[#f0e6e8] transition-colors"
              >
                K-Beauty
              </button>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('SPF 50');
                  navigateTo('shop-catalog');
                }}
                className="px-2 py-0.5 rounded-full bg-[#f6ebee] text-[10px] font-semibold text-[#524342] hover:bg-[#f0e6e8] transition-colors"
              >
                SPF 50
              </button>
            </div>
          </div>
        </form>

        {/* Action Zone: Currency, Wishlist, Cart, Profile */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* BDT Currency indicator */}
          <div className="hidden sm:flex items-center gap-1.5 bg-[#fbf1f3] px-3 py-1.5 rounded-full">
            <span className="material-symbols-outlined text-sm text-[#7d562d]">
              payments
            </span>
            <span className="text-xs text-[#1f1a1c] font-semibold">BDT (৳)</span>
          </div>

          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            aria-label="Toggle Dark Mode"
            className="p-2 rounded-full hover:bg-[#fde5e9] dark:hover:bg-[#28141c] text-[#593f44] dark:text-[#d6b4bd] transition-colors flex items-center justify-center cursor-pointer"
            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Luxury Mode'}
          >
            <span className="material-symbols-outlined text-xl">
              {isDarkMode ? 'light_mode' : 'dark_mode'}
            </span>
          </button>

          {/* Wishlist Icon */}
          <button
            onClick={() => navigateTo('customer-account')}
            aria-label="Wishlist"
            className="relative p-2 rounded-full hover:bg-[#f0e6e8] text-[#524342] hover:text-[#1f1a1c] transition-colors flex items-center justify-center"
          >
            <span className="material-symbols-outlined text-xl">favorite</span>
            <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#84504c] text-white text-[10px] flex items-center justify-center leading-none font-bold">
              {wishlistIds.length}
            </span>
          </button>

          {/* Cart Icon & Amount */}
          <button
            onClick={() => navigateTo('cart-checkout')}
            className="flex items-center gap-2 bg-[#c58882] text-white hover:bg-[#84504c] px-3 sm:px-4 py-2 rounded-full transition-all shadow-[0_2px_10px_-2px_rgba(197,136,130,0.25)]"
          >
            <span className="material-symbols-outlined text-base">shopping_bag</span>
            <div className="flex items-center gap-1.5">
              <span className="text-xs sm:text-sm font-bold">{cartCount}</span>
              <span className="hidden md:inline text-xs sm:text-sm opacity-95">
                | ৳{cartTotal.toLocaleString()}
              </span>
            </div>
          </button>

          {/* Account Profile */}
          <button
            onClick={() => navigateTo('customer-account')}
            className="flex items-center gap-2 pl-1 sm:pl-2 rounded-full hover:bg-[#f0e6e8] transition-colors"
          >
            <img
              alt="Profile"
              className="w-8 h-8 rounded-full object-cover ring-2 ring-[#c58882]/40"
              src={user.avatarUrl}
            />
            <span className="hidden lg:inline text-xs sm:text-sm text-[#524342] font-medium pr-1">
              My Account
            </span>
          </button>

          {/* Admin Portal Quick Switch */}
          {isAdminAuthenticated ? (
            <div className="hidden xl:flex items-center gap-1 pl-2 border-l border-[#d6c2c0]/40">
              <button
                onClick={() => navigateTo('admin-portal')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#f6ebee] hover:bg-[#ebd7da] text-[#84504c] text-xs font-bold transition-all shadow-xs border border-[#c58882]/30 cursor-pointer"
                title="Go to Lounge OS Admin Panel"
              >
                <span className="w-2 h-2 rounded-full bg-[#536251] animate-pulse"></span>
                <span className="max-w-[100px] truncate">Admin ({adminUser?.name?.split(' ')[0] || 'Nusrat'})</span>
              </button>
              <button
                onClick={() => logoutAdmin()}
                className="p-1.5 rounded-full hover:bg-[#ffdad6] text-[#ba1a1a] transition-colors cursor-pointer"
                title="Log out of Admin"
              >
                <span className="material-symbols-outlined text-base">logout</span>
              </button>
            </div>
          ) : (
            <button
              onClick={() => navigateTo('admin-portal')}
              className="hidden xl:flex items-center gap-1 pl-2 text-xs text-[#524342] hover:text-[#84504c] font-semibold transition-colors cursor-pointer"
              title="Admin Portal Login"
            >
              <span className="material-symbols-outlined text-sm">lock</span>
              <span>Admin</span>
            </button>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-full hover:bg-[#f0e6e8] text-[#524342]"
            aria-label="Toggle navigation menu"
          >
            <span className="material-symbols-outlined">
              {mobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      {/* Category Navigation Bar */}
      <div className="bg-[#fbf1f3]/70 backdrop-blur-md shadow-[0_1px_4px_rgba(197,136,130,0.05)] border-t border-[#d6c2c0]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
          <nav className="flex items-center justify-start lg:justify-center gap-1 sm:gap-2 py-2 overflow-x-auto no-scrollbar">
            {navLinks.map((item) => {
              const isActive =
                currentPage === item.page ||
                (item.page === 'shop-catalog' &&
                  currentPage === 'shop-catalog' &&
                  item.label === 'Shop All');

              return (
                <button
                  key={item.label}
                  onClick={() => handleNavClick(item.page, item.category)}
                  className={`px-3.5 py-1.5 rounded-full text-xs sm:text-sm transition-all whitespace-nowrap font-medium flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-[#c58882] text-white font-semibold shadow-sm'
                      : 'text-[#524342] hover:text-[#1f1a1c] hover:bg-[#f6ebee]'
                  }`}
                >
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#536251]"></span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#fff8f8] border-b border-[#d6c2c0]/30 p-4 space-y-3">
          <form onSubmit={handleSearchSubmit} className="flex items-center bg-[#fbf1f3] px-3 py-2 rounded-full mb-3">
            <span className="material-symbols-outlined text-[#524342] text-sm mr-2">search</span>
            <input
              type="text"
              placeholder="Search serums, lipstick..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent text-sm outline-none"
            />
          </form>
          <div className="grid grid-cols-2 gap-2">
            {navLinks.map((item) => (
              <button
                key={item.label}
                onClick={() => handleNavClick(item.page, item.category)}
                className="text-left px-3 py-2 rounded-lg text-sm text-[#524342] hover:bg-[#fbf1f3]"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};
