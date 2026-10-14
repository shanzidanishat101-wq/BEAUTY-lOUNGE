import React from 'react';
import { useStore } from '../context/StoreContext';

export const TrackingMapModal: React.FC = () => {
  const { trackingModalOrder, setTrackingModalOrder } = useStore();

  if (!trackingModalOrder) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#342f31]/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white max-w-2xl w-full rounded-2xl p-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={() => setTrackingModalOrder(null)}
          aria-label="Close modal"
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-[#f6ebee] text-[#524342] transition-colors z-10"
        >
          <span className="material-symbols-outlined text-xl">close</span>
        </button>

        <div className="space-y-4">
          <div className="flex items-center justify-between pr-8">
            <div>
              <span className="text-[10px] uppercase tracking-wider text-[#84504c] font-bold">
                Steadfast / Pathao Live Map Telemetry
              </span>
              <h3 className="font-headline text-lg sm:text-xl font-bold text-[#1f1a1c]">
                Live Dispatch: Order #{trackingModalOrder.id}
              </h3>
            </div>
            <span className="px-3 py-1 rounded-full bg-[#ffdcbd] text-[#2c1600] text-xs font-bold animate-pulse">
              18 Mins Away
            </span>
          </div>

          {/* Interactive Dhaka Map Simulation Canvas */}
          <div className="relative h-64 sm:h-72 w-full rounded-xl overflow-hidden bg-[#e1d8da] border border-[#d6c2c0]/40 p-4 flex flex-col justify-between">
            {/* Map styling grid & river simulation */}
            <div className="absolute inset-0 bg-[#e8e2e0] opacity-80 pointer-events-none">
              <svg className="w-full h-full opacity-30" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#847371" strokeWidth="0.5" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
                {/* Gulshan Lake curvy line */}
                <path d="M 120 0 Q 180 150 210 300" stroke="#7a9eb8" strokeWidth="16" fill="none" opacity="0.6" />
                <path d="M 450 0 Q 420 180 500 300" stroke="#7a9eb8" strokeWidth="12" fill="none" opacity="0.4" />
              </svg>
            </div>

            {/* Landmarks in Banani / Gulshan */}
            <div className="relative z-10 flex justify-between text-xs font-semibold text-[#524342]">
              <span className="bg-white/80 px-2 py-0.5 rounded shadow-sm">Banani Road 11</span>
              <span className="bg-white/80 px-2 py-0.5 rounded shadow-sm">Gulshan 2 Circle</span>
              <span className="bg-white/80 px-2 py-0.5 rounded shadow-sm">Kamal Ataturk Ave</span>
            </div>

            {/* Simulated Live Route Path */}
            <div className="relative z-10 flex items-center justify-center my-auto">
              <div className="w-3/4 flex items-center justify-between relative">
                {/* Dashed line */}
                <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 border-b-2 border-dashed border-[#84504c]"></div>

                {/* Hub Point */}
                <div className="relative z-10 flex flex-col items-center">
                  <div className="w-9 h-9 rounded-full bg-[#84504c] text-white flex items-center justify-center shadow-md">
                    <span className="material-symbols-outlined text-sm">warehouse</span>
                  </div>
                  <span className="text-[10px] font-bold mt-1 bg-white px-1.5 py-0.5 rounded shadow-xs text-[#1f1a1c]">
                    Banani Hub
                  </span>
                </div>

                {/* Live Courier Point (Active) */}
                <div className="relative z-10 flex flex-col items-center">
                  <div className="w-11 h-11 rounded-full bg-[#7d562d] text-white flex items-center justify-center shadow-lg ring-4 ring-[#ffdcbd] animate-bounce">
                    <span className="material-symbols-outlined text-base">moped</span>
                  </div>
                  <span className="text-[10px] font-bold mt-1 bg-[#ffdcbd] text-[#2c1600] px-2 py-0.5 rounded shadow-xs">
                    Rider Rahim
                  </span>
                </div>

                {/* Destination Point */}
                <div className="relative z-10 flex flex-col items-center">
                  <div className="w-9 h-9 rounded-full bg-[#536251] text-white flex items-center justify-center shadow-md">
                    <span className="material-symbols-outlined text-sm">home</span>
                  </div>
                  <span className="text-[10px] font-bold mt-1 bg-white px-1.5 py-0.5 rounded shadow-xs text-[#1f1a1c]">
                    House 42, Banani
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom map status bar */}
            <div className="relative z-10 bg-white/90 backdrop-blur-sm p-2.5 rounded-lg shadow-sm flex items-center justify-between text-xs">
              <span className="text-[#524342] flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                Rider speed: 28 km/h · Heading North-East
              </span>
              <span className="text-[#84504c] font-bold">Courier Phone: +880 1799-887766</span>
            </div>
          </div>

          {/* Courier Details */}
          <div className="bg-[#fbf1f3] p-4 rounded-xl flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-[#ffdcbd] text-[#2c1600] flex items-center justify-center font-bold text-lg">
                RR
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#1f1a1c]">Rider Rahim Mia</h4>
                <p className="text-xs text-[#524342]">Steadfast Express · Verified Banani Zone Fleet</p>
                <div className="flex items-center gap-1 text-[#7d562d] text-xs font-semibold mt-0.5">
                  <span className="material-symbols-outlined text-xs fill">star</span>
                  <span>4.95 Rating (1,240 deliveries)</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <a
                href="tel:+8801799887766"
                className="px-4 py-2 rounded-full bg-[#84504c] text-white text-xs font-bold hover:bg-[#c58882] transition-colors flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-sm">call</span>
                <span>Call Rider</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
