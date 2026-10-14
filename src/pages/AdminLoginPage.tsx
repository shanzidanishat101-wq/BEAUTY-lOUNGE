import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { ASSETS } from '../data/mockData';

export const AdminLoginPage: React.FC = () => {
  const { loginAdmin, navigateTo } = useStore();
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
    <div className="min-h-screen bg-[#fff8f8] flex flex-col justify-between relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#f3d7d4]/40 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-10 left-1/4 w-96 h-96 bg-[#ffdcbd]/30 rounded-full blur-3xl pointer-events-none"></div>

      {/* Top Navbar */}
      <header className="relative z-10 w-full px-6 lg:px-12 py-5 flex items-center justify-between border-b border-[#d6c2c0]/20 bg-[#fff8f8]/80 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <img
            alt="Beauty Lounge"
            src={ASSETS.logo}
            className="h-9 w-auto object-contain cursor-pointer"
            onClick={() => navigateTo('home')}
          />
          <div className="flex flex-col">
            <span className="font-headline text-lg font-bold text-[#84504c] tracking-tight">
              LOUNGE OS
            </span>
            <span className="text-[10px] tracking-widest text-[#524342] uppercase font-bold">
              Operations &amp; Admin Panel
            </span>
          </div>
        </div>

        <button
          onClick={() => navigateTo('home')}
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#524342] hover:text-[#84504c] px-3.5 py-2 rounded-full border border-[#d6c2c0]/40 bg-white/60 hover:bg-white transition-all shadow-xs"
        >
          <span className="material-symbols-outlined text-sm">arrow_back</span>
          <span>Return to Storefront</span>
        </button>
      </header>

      {/* Main Login Card */}
      <div className="relative z-10 flex-1 flex items-center justify-center p-4 sm:p-6 my-6">
        <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 border border-[#d6c2c0]/30 shadow-[0_20px_50px_-15px_rgba(132,80,76,0.12)]">
          {/* Badge & Lock Icon */}
          <div className="text-center space-y-3 mb-6">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#fbf1f3] text-[#84504c] shadow-xs ring-4 ring-[#fbf1f3]/60 mb-1">
              <span className="material-symbols-outlined text-2xl">lock</span>
            </div>
            <div>
              <span className="inline-block px-3 py-0.5 rounded-full bg-[#f6ebee] text-[#84504c] text-[11px] font-bold tracking-wider uppercase mb-1">
                এডমিন প্যানেল • Admin Portal
              </span>
              <h1 className="font-headline text-2xl sm:text-3xl font-bold text-[#1f1a1c]">
                Sign In to Lounge OS
              </h1>
              <p className="text-xs text-[#524342] mt-1.5 leading-relaxed">
                Enter your administrative credentials to manage orders, customs batch clearance, and nationwide logistics.
              </p>
            </div>
          </div>

          {/* Quick Demo Credentials Banner */}
          <div className="mb-6 p-3.5 rounded-2xl bg-[#fbf1f3] border border-[#c58882]/20 flex items-center justify-between gap-3">
            <div className="space-y-0.5 min-w-0">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#84504c]">
                <span className="material-symbols-outlined text-sm">vpn_key</span>
                <span>Demo Access</span>
              </div>
              <p className="text-[11px] text-[#524342] truncate">
                operations@beautylounge.bd / admin123
              </p>
            </div>
            <button
              type="button"
              onClick={handleDemoLogin}
              className="px-3 py-1.5 rounded-full bg-[#84504c] text-white hover:bg-[#6c403d] text-xs font-semibold shrink-0 transition-colors shadow-xs"
            >
              1-Click Fill
            </button>
          </div>

          {/* Error notification */}
          {error && (
            <div className="mb-5 p-3 rounded-2xl bg-[#ffdad6] border border-[#ba1a1a]/20 text-[#410002] flex items-center gap-2.5 text-xs animate-in fade-in duration-200">
              <span className="material-symbols-outlined text-base shrink-0">error</span>
              <span>{error}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#1f1a1c] mb-1.5">
                Staff Email Address / ইউজারনেম
              </label>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-3.5 text-[#524342]/70 text-lg">
                  alternate_email
                </span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="operations@beautylounge.bd"
                  className="w-full bg-[#fbf1f3] border border-transparent focus:border-[#c58882] rounded-xl pl-10 pr-4 py-3 text-xs sm:text-sm text-[#1f1a1c] outline-none transition-all placeholder:text-[#524342]/50"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1f1a1c] mb-1.5">
                Security Passcode / পাসওয়ার্ড
              </label>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-3.5 text-[#524342]/70 text-lg">
                  key
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#fbf1f3] border border-transparent focus:border-[#c58882] rounded-xl pl-10 pr-10 py-3 text-xs sm:text-sm text-[#1f1a1c] outline-none transition-all placeholder:text-[#524342]/50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 text-[#524342] hover:text-[#1f1a1c] transition-colors"
                >
                  <span className="material-symbols-outlined text-lg">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-[#524342]">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-[#d6c2c0] text-[#84504c] focus:ring-[#84504c] h-3.5 w-3.5"
                />
                <span>Remember on this terminal</span>
              </label>

              <button
                type="button"
                onClick={() => handleDemoLogin()}
                className="text-[#84504c] hover:underline font-semibold"
              >
                Reset demo credentials
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3.5 px-6 rounded-full bg-[#84504c] hover:bg-[#6c403d] text-white text-xs sm:text-sm font-bold tracking-wide transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
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
          <div className="mt-8 pt-5 border-t border-[#d6c2c0]/20 flex flex-wrap items-center justify-center gap-4 text-[11px] text-[#524342]">
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-xs text-[#536251]">verified_user</span>
              256-Bit SSL Encrypted
            </span>
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-xs text-[#536251]">shield</span>
              Audit Logged Node
            </span>
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-xs text-[#536251]">location_on</span>
              Dhaka Banani HQ
            </span>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <footer className="relative z-10 py-4 text-center text-xs text-[#524342]">
        Beauty Lounge • Lounge OS 3.4 • Confidential Administrative Interface
      </footer>
    </div>
  );
};
