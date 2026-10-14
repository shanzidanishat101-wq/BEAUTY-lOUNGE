import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { ASSETS } from '../data/mockData';

export const Footer: React.FC = () => {
  const { navigateTo, showToast, isAdminAuthenticated, logoutAdmin } = useStore();
  const [newsletterEmail, setNewsletterEmail] = useState('');

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail) {
      showToast('Welcome to Beauty Lounge Privé! Voucher DHAKA10 activated.');
      setNewsletterEmail('');
    }
  };

  return (
    <footer className="w-full bg-[#fbf1f3] text-[#1f1a1c] pt-16 pb-12 shadow-[0_-2px_12px_rgba(197,136,130,0.06)] border-t border-[#d6c2c0]/20">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
        {/* Brand Column */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-3">
            <img
              alt="Beauty Lounge Logo"
              className="h-7 w-auto object-contain"
              src={ASSETS.logo}
            />
            <span className="font-headline text-lg sm:text-xl text-[#84504c] font-bold">
              BEAUTY LOUNGE
            </span>
          </div>
          <p className="text-sm text-[#524342] pr-6 leading-relaxed">
            The premier boutique sanctuary for authentic luxury beauty and dermatological
            formulations in Bangladesh. Ethically curated from Seoul, Paris, and London to
            elevate your everyday self-care ritual.
          </p>
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#d7e7d1] text-[#111f11] text-xs font-semibold">
              <span className="material-symbols-outlined text-xs">verified</span>
              100% Lab Tested & Authentic
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ffdcbd] text-[#2c1600] text-xs font-semibold">
              <span className="material-symbols-outlined text-xs">local_shipping</span>
              64 Districts Express
            </span>
          </div>
        </div>

        {/* Column 2: Flagship */}
        <div className="space-y-3">
          <h4 className="font-headline text-base font-bold text-[#1f1a1c]">
            Concierge & Flagship
          </h4>
          <p className="text-xs sm:text-sm text-[#524342] leading-relaxed">
            Plot 42, Road 11, Banani
            <br />
            Gulshan 2 Luxury Zone, Dhaka
          </p>
          <p className="text-xs sm:text-sm text-[#84504c] font-semibold flex items-center gap-1.5 pt-1">
            <span className="material-symbols-outlined text-sm">call</span>
            +880 1700-BEAUTY (232889)
          </p>
          <p className="text-xs text-[#524342]">Daily: 10:00 AM – 9:30 PM</p>
        </div>

        {/* Column 3: Curations & Support */}
        <div className="space-y-3">
          <h4 className="font-headline text-base font-bold text-[#1f1a1c]">
            Curations & Support
          </h4>
          <ul className="space-y-2 text-xs sm:text-sm text-[#524342]">
            <li>
              <button
                onClick={() => navigateTo('shop-catalog')}
                className="hover:text-[#84504c] transition-colors text-left"
              >
                Shop All Categories
              </button>
            </li>
            <li>
              <button
                onClick={() => navigateTo('tracking')}
                className="hover:text-[#9e3544] dark:hover:text-[#f27284] transition-colors text-left flex items-center gap-1.5 font-semibold text-[#9e3544] dark:text-[#f27284]"
              >
                <span className="material-symbols-outlined text-xs">local_shipping</span>
                <span>Track Nationwide Order (পার্সেল ট্র্যাকিং)</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => navigateTo('shop-catalog')}
                className="hover:text-[#84504c] transition-colors text-left"
              >
                Authenticity Guarantee Seal
              </button>
            </li>
            <li>
              <button
                onClick={() => navigateTo('shop-catalog')}
                className="hover:text-[#84504c] transition-colors text-left"
              >
                Shipping Across 64 Districts
              </button>
            </li>
            <li className="pt-1 border-t border-[#d6c2c0]/30">
              {isAdminAuthenticated ? (
                <div className="space-y-1">
                  <button
                    onClick={() => navigateTo('admin-portal')}
                    className="text-[#84504c] font-bold hover:underline text-left flex items-center gap-1.5"
                  >
                    <span className="w-2 h-2 rounded-full bg-[#536251]"></span>
                    <span>Lounge OS Admin Portal</span>
                    <span className="material-symbols-outlined text-xs">arrow_forward</span>
                  </button>
                  <button
                    onClick={() => logoutAdmin()}
                    className="text-xs text-[#ba1a1a] hover:underline flex items-center gap-1 pl-3.5"
                  >
                    <span className="material-symbols-outlined text-xs">logout</span>
                    <span>Admin Log Out (লগ আউট)</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => navigateTo('admin-portal')}
                  className="text-[#84504c] font-semibold hover:underline text-left flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-sm">lock</span>
                  <span>Admin Panel Login (এডমিন লগইন)</span>
                  <span className="material-symbols-outlined text-xs">arrow_forward</span>
                </button>
              )}
            </li>
          </ul>
        </div>

        {/* Column 4: Newsletter Privé */}
        <div className="space-y-4">
          <h4 className="font-headline text-base font-bold text-[#1f1a1c]">
            Lounge Privé Newsletter
          </h4>
          <p className="text-xs sm:text-sm text-[#524342]">
            Receive exclusive Eid launches, beauty editor recommendations, and bespoke discounts.
          </p>
          <form onSubmit={handleNewsletterSubmit} className="space-y-2">
            <div className="flex items-center bg-white px-3 py-1.5 rounded-full shadow-sm border border-[#d6c2c0]/40">
              <input
                className="w-full bg-transparent border-none outline-none text-xs text-[#1f1a1c] placeholder:text-[#524342]/70 px-2"
                placeholder="Your email address..."
                type="email"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                required
              />
              <button
                type="submit"
                className="bg-[#84504c] hover:bg-[#c58882] text-white px-4 py-1.5 rounded-full text-xs font-semibold transition-colors shrink-0"
              >
                Join
              </button>
            </div>
            <span className="text-[10px] text-[#524342]/80 block">
              Strictly confidential. No spam, ever.
            </span>
          </form>
        </div>
      </div>

      {/* Bottom Payment Badges & Copyright */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 pt-8 border-t border-[#d6c2c0]/30 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-wrap items-center gap-2 text-[#524342]">
          <span className="text-xs mr-2 font-medium">Accepted Payment Modes in BD:</span>
          <span className="px-2.5 py-1 rounded-full bg-white text-xs font-semibold text-[#1f1a1c] shadow-sm">
            bKash
          </span>
          <span className="px-2.5 py-1 rounded-full bg-white text-xs font-semibold text-[#1f1a1c] shadow-sm">
            Nagad
          </span>
          <span className="px-2.5 py-1 rounded-full bg-white text-xs font-semibold text-[#1f1a1c] shadow-sm">
            Visa
          </span>
          <span className="px-2.5 py-1 rounded-full bg-white text-xs font-semibold text-[#1f1a1c] shadow-sm">
            Mastercard
          </span>
          <span className="px-2.5 py-1 rounded-full bg-[#f6ebee] text-xs font-semibold text-[#7d562d]">
            Cash on Delivery (COD)
          </span>
        </div>
        <div className="text-xs text-[#524342] text-center md:text-right">
          © 2025 Beauty Lounge Bangladesh. All Rights Reserved. Crafted with quiet luxury.
        </div>
      </div>
    </footer>
  );
};
