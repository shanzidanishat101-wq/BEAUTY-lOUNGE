import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { ASSETS } from '../data/mockData';

export const AdminLoginPage: React.FC = () => {
  const { loginAdmin, navigateTo, isDarkMode, toggleDarkMode } = useStore();
  const [email, setEmail] = useState('operations@beautylounge.bd');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    setTimeout(() => {
      const res = loginAdmin(email, password);
      setIsLoading(false);
      if (!res.success) {
        setError(res.message);
      }
    }, 400);
  };

  const handleDemoLogin = () => {
    setEmail('operations@beautylounge.bd');
    setPassword('admin123');
    setError(null);
    setIsLoading(true);
    setTimeout(() => {
      loginAdmin('operations@beautylounge.bd', 'admin123');
      setIsLoading(false);
    }, 300);
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark bg-[#12090c] text-[#fdebed]' : 'bg-[#fff2f4] text-[#1e1315]'} flex flex-col justify-between relative overflow-hidden transition-colors duration-300`}>
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#cf5867]/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-10 left-1/4 w-96 h-96 bg-[#fbc698]/20 rounded-full blur-3xl pointer-events-none"></div>

      {/* Top Navbar */}
      <header className="relative z-10 w-full px-6 lg:px-12 py-5 flex items-center justify-between border-b border-[#e2b7bf]/30 dark:border-[#4a2834] bg-white/70 dark:bg-[#1a0f14]/80 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <img
            alt="Beauty Lounge"
            src={ASSETS.logo}
            className="h-9 w-auto object-contain cursor-pointer"
            onClick={() => navigateTo('home')}
          />
          <div className="flex flex-col">
            <span className="font-headline text-lg font-bold text-[#9e3544] dark:text-[#f27284] tracking-tight">
              LOUNGE OS
            </span>
            <span className="text-[10px] tracking-widest text-[#593f44] dark:text-[#d6b4bd] uppercase font-bold">
              Operations &amp; Admin Panel
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full border border-[#e2b7bf]/40 dark:border-[#4a2834] bg-white/60 dark:bg-[#28141c] hover:bg-white text-[#593f44] dark:text-[#d6b4bd] transition-colors"
            title="Toggle theme"
          >
            <span className="material-symbols-outlined text-sm">
              {isDarkMode ? 'light_mode' : 'dark_mode'}
            </span>
          </button>

          <button
            onClick={() => navigateTo('home')}
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#593f44] dark:text-[#d6b4bd] hover:text-[#9e3544] dark:hover:text-[#f27284] px-3.5 py-2 rounded-full border border-[#e2b7bf]/40 dark:border-[#4a2834] bg-white/60 dark:bg-[#28141c] hover:bg-white transition-all shadow-xs"
          >
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            <span>Return to Storefront</span>
          </button>
        </div>
      </header>

      {/* Main Login Card */}
      <div className="relative z-10 flex-1 flex items-center justify-center p-4 sm:p-6 my-6">
        <div className="w-full max-w-md bg-white dark:bg-[#1e0f15] rounded-3xl p-6 sm:p-8 border border-[#e2b7bf]/60 dark:border-[#4a2834] shadow-[0_20px_50px_-15px_rgba(158,53,68,0.15)]">
          {/* Badge & Lock Icon */}
          <div className="text-center space-y-3 mb-6">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#fde5e9] dark:bg-[#351a24] text-[#9e3544] dark:text-[#f27284] shadow-xs ring-4 ring-[#fde5e9]/60 dark:ring-[#351a24]/60 mb-1">
              <span className="material-symbols-outlined text-2xl">lock</span>
            </div>
            <div>
              <span className="inline-block px-3 py-0.5 rounded-full bg-[#fde5e9] dark:bg-[#351a24] text-[#9e3544] dark:text-[#f27284] text-[11px] font-bold tracking-wider uppercase mb-1">
                এডমিন প্যানেল • Admin Portal
              </span>
              <h1 className="font-headline text-2xl sm:text-3xl font-bold text-[#1e1315] dark:text-[#fdebed]">
                Sign In to Lounge OS
              </h1>
              <p className="text-xs text-[#593f44] dark:text-[#d6b4bd] mt-1.5 leading-relaxed">
                Enter your administrative credentials to manage products, catalog, 64-district dispatches &amp; analytics.
              </p>
            </div>
          </div>

          {/* Quick Demo Credentials Banner */}
          <div className="mb-6 p-3.5 rounded-2xl bg-[#fff2f4] dark:bg-[#28141c] border border-[#e2b7bf]/40 dark:border-[#4a2834] flex items-center justify-between gap-3">
            <div className="space-y-0.5 min-w-0">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#9e3544] dark:text-[#f27284]">
                <span className="material-symbols-outlined text-sm">vpn_key</span>
                <span>Demo Access</span>
              </div>
              <p className="text-[11px] text-[#593f44] dark:text-[#d6b4bd] truncate">
                operations@beautylounge.bd / admin123
              </p>
            </div>
            <button
              type="button"
              onClick={handleDemoLogin}
              className="px-3 py-1.5 rounded-full bg-[#9e3544] text-white hover:bg-[#852c38] text-xs font-semibold shrink-0 transition-colors shadow-xs cursor-pointer"
            >
              1-Click Fill
            </button>
          </div>

          {/* Error notification */}
          {error && (
            <div className="mb-5 p-3 rounded-2xl bg-[#ffd8dc] border border-[#ba1a1a]/20 text-[#3d000c] flex items-center gap-2.5 text-xs animate-in fade-in duration-200">
              <span className="material-symbols-outlined text-base shrink-0">error</span>
              <span>{error}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#1e1315] dark:text-[#fdebed] mb-1.5">
                Staff Email Address / ইউজারনেম
              </label>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-3.5 text-[#8c6d73] dark:text-[#d6b4bd] text-lg">
                  alternate_email
                </span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="operations@beautylounge.bd"
                  className="w-full bg-[#fff2f4] dark:bg-[#28141c] border border-transparent focus:border-[#9e3544] dark:focus:border-[#f27284] rounded-xl pl-10 pr-4 py-3 text-xs sm:text-sm text-[#1e1315] dark:text-[#fdebed] outline-none transition-all placeholder:text-[#8c6d73]/50"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1e1315] dark:text-[#fdebed] mb-1.5">
                Security Passcode / পাসওয়ার্ড
              </label>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-3.5 text-[#8c6d73] dark:text-[#d6b4bd] text-lg">
                  key
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#fff2f4] dark:bg-[#28141c] border border-transparent focus:border-[#9e3544] dark:focus:border-[#f27284] rounded-xl pl-10 pr-10 py-3 text-xs sm:text-sm text-[#1e1315] dark:text-[#fdebed] outline-none transition-all placeholder:text-[#8c6d73]/50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 text-[#8c6d73] hover:text-[#1e1315] dark:hover:text-white transition-colors"
                >
                  <span className="material-symbols-outlined text-lg">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-[#593f44] dark:text-[#d6b4bd]">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-[#e2b7bf] text-[#9e3544] focus:ring-[#9e3544] h-3.5 w-3.5"
                />
                <span>Remember session</span>
              </label>

              <button
                type="button"
                onClick={() => handleDemoLogin()}
                className="text-[#9e3544] dark:text-[#f27284] hover:underline font-semibold"
              >
                Autofill demo
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3.5 px-6 rounded-full bg-[#9e3544] hover:bg-[#852c38] text-white text-xs sm:text-sm font-bold tracking-wide transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  <span>Authenticating Node...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-base">login</span>
                  <span>Log In to Admin Portal</span>
                </>
              )}
            </button>
          </form>

          {/* Security & Audit Footer */}
          <div className="mt-8 pt-5 border-t border-[#e2b7bf]/30 dark:border-[#4a2834] flex flex-wrap items-center justify-center gap-4 text-[11px] text-[#593f44] dark:text-[#d6b4bd]">
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-xs text-[#4d644d]">verified_user</span>
              256-Bit SSL Encrypted
            </span>
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-xs text-[#4d644d]">shield</span>
              Audit Logged Node
            </span>
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-xs text-[#4d644d]">location_on</span>
              Dhaka Banani HQ
            </span>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <footer className="relative z-10 py-4 text-center text-xs text-[#593f44] dark:text-[#d6b4bd]">
        Beauty Lounge • Lounge OS 3.4 • Confidential Administrative Interface
      </footer>
    </div>
  );
};
