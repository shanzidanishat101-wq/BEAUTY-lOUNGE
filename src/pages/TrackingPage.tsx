import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { Order } from '../types';

export const TrackingPage: React.FC = () => {
  const { orders, trackingQuery, setTrackingQuery, navigateTo, showToast } = useStore();
  const [searchInput, setSearchInput] = useState(trackingQuery || 'BL-8921');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    const q = (trackingQuery || searchInput || 'BL-8921').trim().toLowerCase();
    const match = orders.find(
      (o) =>
        o.id.toLowerCase() === q ||
        o.courierTrackingId.toLowerCase() === q ||
        o.customerPhone.includes(q)
    );
    setSelectedOrder(match || orders[0] || null);
  }, [trackingQuery, orders]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchInput.trim().toLowerCase();
    const match = orders.find(
      (o) =>
        o.id.toLowerCase() === q ||
        o.courierTrackingId.toLowerCase() === q ||
        o.customerPhone.includes(q)
    );
    if (match) {
      setSelectedOrder(match);
      setTrackingQuery(match.id);
      showToast(`Found tracking records for Order #${match.id}`);
    } else {
      showToast(`No parcel found for "${searchInput}". Showing active demo order.`);
      setSelectedOrder(orders[0] || null);
    }
  };

  const getStatusStep = (status: Order['status']) => {
    switch (status) {
      case 'New':
        return 1;
      case 'Processing':
        return 2;
      case 'In-Transit':
        return 3;
      case 'Out for Delivery':
        return 4;
      case 'Delivered':
        return 5;
      default:
        return 3;
    }
  };

  const currentStep = selectedOrder ? getStatusStep(selectedOrder.status) : 4;

  const steps = [
    { title: 'Order Confirmed', desc: 'Verified & BSTI lab cleared', time: selectedOrder?.timeline.confirmed || 'Oct 14, 10:30 AM' },
    { title: 'Warehouse QC & Packed', desc: 'Sealed with tamper-evident film', time: selectedOrder?.timeline.packed || 'Oct 14, 11:45 AM' },
    { title: 'Dispatched to Hub', desc: 'Central Dhaka sorting node', time: 'Oct 14, 01:15 PM' },
    { title: 'Out for Delivery', desc: 'Rider en route to delivery address', time: selectedOrder?.timeline.outForDelivery || 'Oct 14, 02:40 PM' },
    { title: 'Delivered & Signed', desc: 'Customer verification pin code', time: selectedOrder?.timeline.delivered || 'Pending handover' },
  ];

  return (
    <div className="w-full min-h-screen py-8 sm:py-12 px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Breadcrumb & Header */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-xs text-[#593f44] dark:text-[#d6b4bd]">
          <button onClick={() => navigateTo('home')} className="hover:text-[#9e3544] dark:hover:text-[#f27284]">
            Home
          </button>
          <span>/</span>
          <span className="font-semibold text-[#1e1315] dark:text-[#fdebed]">
            Nationwide Parcel Tracking
          </span>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#fde5e9] dark:bg-[#351a24] text-[#9e3544] dark:text-[#f27284] text-xs font-bold uppercase tracking-wider mb-1.5">
              <span className="material-symbols-outlined text-sm">local_shipping</span>
              <span>64 Districts Live Dispatch Telemetry</span>
            </div>
            <h1 className="font-headline text-2xl sm:text-4xl font-bold text-[#1e1315] dark:text-[#fdebed]">
              Real-Time Order &amp; Product Tracking
            </h1>
            <p className="text-xs sm:text-sm text-[#593f44] dark:text-[#d6b4bd] mt-1">
              Live GPS telematics, Steadfast &amp; Pathao courier routing, and temperature-controlled logistics.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => navigateTo('customer-account')}
              className="px-4 py-2 rounded-full border border-[#e2b7bf] dark:border-[#4a2834] text-xs font-bold text-[#593f44] dark:text-[#d6b4bd] hover:bg-white dark:hover:bg-[#1e0f15] transition-colors"
            >
              View All My Orders
            </button>
          </div>
        </div>
      </div>

      {/* Search Bar Card */}
      <div className="bg-white dark:bg-[#1e0f15] p-5 sm:p-7 rounded-3xl border border-[#e2b7bf]/60 dark:border-[#4a2834] shadow-[0_10px_30px_-10px_rgba(158,53,68,0.08)] space-y-4">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <span className="material-symbols-outlined absolute left-4 text-[#8c6d73] dark:text-[#d6b4bd] text-lg">
              barcode_scanner
            </span>
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Enter Order ID (e.g. BL-8921) or Courier Tracking (e.g. STF-DH-99214)..."
              className="w-full bg-[#fff2f4] dark:bg-[#28141c] border border-transparent focus:border-[#9e3544] dark:focus:border-[#f27284] rounded-2xl pl-11 pr-4 py-3.5 text-xs sm:text-sm text-[#1e1315] dark:text-[#fdebed] outline-none transition-all placeholder:text-[#8c6d73]/70"
            />
          </div>
          <button
            type="submit"
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-[#9e3544] hover:bg-[#852c38] text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-md shrink-0 cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">search</span>
            <span>Track Parcel</span>
          </button>
        </form>

        {/* Quick Test Demo Chips */}
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
          <span className="text-[#8c6d73] dark:text-[#d6b4bd] font-medium">Quick Demo Parcels:</span>
          {orders.map((ord) => (
            <button
              key={ord.id}
              onClick={() => {
                setSearchInput(ord.id);
                setSelectedOrder(ord);
                setTrackingQuery(ord.id);
                showToast(`Tracking Order #${ord.id}`);
              }}
              className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-all border ${
                selectedOrder?.id === ord.id
                  ? 'bg-[#9e3544] text-white border-[#9e3544]'
                  : 'bg-[#fff2f4] dark:bg-[#28141c] text-[#593f44] dark:text-[#d6b4bd] border-[#e2b7bf]/50 dark:border-[#4a2834] hover:bg-white dark:hover:bg-[#351a24]'
              }`}
            >
              #{ord.id} ({ord.status})
            </button>
          ))}
        </div>
      </div>

      {/* Main Tracking Details Bento */}
      {selectedOrder ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Status Timeline & Interactive Route */}
          <div className="lg:col-span-8 space-y-6">
            {/* Live Status Hero Card */}
            <div className="bg-white dark:bg-[#1e0f15] p-6 sm:p-8 rounded-3xl border border-[#e2b7bf]/60 dark:border-[#4a2834] shadow-sm space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#e2b7bf]/30 dark:border-[#4a2834]">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs uppercase tracking-wider text-[#8c6d73] dark:text-[#d6b4bd] font-bold">
                      Order Reference
                    </span>
                    <span className="font-bold text-base text-[#1e1315] dark:text-[#fdebed]">
                      #{selectedOrder.id}
                    </span>
                  </div>
                  <p className="text-xs text-[#593f44] dark:text-[#d6b4bd] mt-0.5">
                    Carrier Waybill: <span className="font-mono font-semibold text-[#9e3544] dark:text-[#f27284]">{selectedOrder.courierTrackingId}</span> ({selectedOrder.courier})
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`px-3.5 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 ${
                    selectedOrder.status === 'Delivered'
                      ? 'bg-[#d3e7d3] text-[#0e1e0f] dark:bg-[#1b2f1c] dark:text-[#b5ceb5]'
                      : 'bg-[#ffdcbe] text-[#2e1500] dark:bg-[#382010] dark:text-[#fbc698]'
                  }`}>
                    <span className="w-2 h-2 rounded-full bg-current animate-pulse"></span>
                    <span>{selectedOrder.status}</span>
                  </span>
                </div>
              </div>

              {/* Progress Stepper Bar */}
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
                  {steps.map((st, idx) => {
                    const stepNumber = idx + 1;
                    const isDone = stepNumber <= currentStep;
                    const isCurrent = stepNumber === currentStep;

                    return (
                      <div key={st.title} className="flex flex-col space-y-2">
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-all ${
                              isDone
                                ? 'bg-[#9e3544] text-white shadow-xs'
                                : 'bg-[#e2b7bf]/40 dark:bg-[#351a24] text-[#8c6d73] dark:text-[#8a636e]'
                            }`}
                          >
                            {isDone ? (
                              <span className="material-symbols-outlined text-sm">check</span>
                            ) : (
                              stepNumber
                            )}
                          </div>
                          <div className={`h-1 flex-1 rounded-full ${
                            isDone ? 'bg-[#9e3544]' : 'bg-[#e2b7bf]/30 dark:bg-[#351a24]'
                          }`}></div>
                        </div>

                        <div>
                          <p className={`text-xs font-bold leading-tight ${
                            isCurrent
                              ? 'text-[#9e3544] dark:text-[#f27284]'
                              : isDone
                              ? 'text-[#1e1315] dark:text-[#fdebed]'
                              : 'text-[#8c6d73] dark:text-[#8a636e]'
                          }`}>
                            {st.title}
                          </p>
                          <p className="text-[10px] text-[#593f44] dark:text-[#d6b4bd] mt-0.5 leading-tight">
                            {st.desc}
                          </p>
                          <p className="text-[9px] text-[#8c6d73] dark:text-[#8a636e] font-mono mt-0.5">
                            {st.time}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Courier Rider Callout */}
              <div className="p-4 rounded-2xl bg-[#fff2f4] dark:bg-[#28141c] border border-[#e2b7bf]/40 dark:border-[#4a2834] flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#9e3544] text-white flex items-center justify-center font-bold text-sm">
                    🏍️
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[#1e1315] dark:text-[#fdebed]">
                        Hasan Ali (Steadfast Dhaka North Hub)
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-[#d3e7d3] text-[#0e1e0f] text-[9px] font-bold">
                        BSTI Temperature Verified
                      </span>
                    </div>
                    <p className="text-[11px] text-[#593f44] dark:text-[#d6b4bd]">
                      Vehicle: Dhaka-Metro-Ha-3921 • Delivery window: Today, 3:30 PM - 5:00 PM
                    </p>
                  </div>
                </div>

                <a
                  href="tel:+8801700232889"
                  className="px-3.5 py-1.5 rounded-full bg-white dark:bg-[#1e0f15] border border-[#e2b7bf] dark:border-[#4a2834] text-xs font-bold text-[#9e3544] dark:text-[#f27284] hover:bg-[#fde5e9] transition-colors flex items-center gap-1.5 shadow-xs"
                >
                  <span className="material-symbols-outlined text-sm">call</span>
                  <span>Contact Dispatcher</span>
                </a>
              </div>
            </div>

            {/* Interactive Live Route Map Simulation */}
            <div className="bg-white dark:bg-[#1e0f15] p-6 rounded-3xl border border-[#e2b7bf]/60 dark:border-[#4a2834] shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-lg text-[#9e3544] dark:text-[#f27284]">
                    map
                  </span>
                  <h3 className="font-headline text-lg font-bold text-[#1e1315] dark:text-[#fdebed]">
                    Dhaka Metro Live Route Map
                  </h3>
                </div>
                <span className="text-xs text-[#4d644d] dark:text-[#83a083] font-bold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-[#4d644d] animate-ping"></span>
                  GPS Node Live
                </span>
              </div>

              {/* Styled SVG Dhaka Map Canvas */}
              <div className="relative w-full h-64 rounded-2xl overflow-hidden bg-[#fce5e9]/50 dark:bg-[#12090c] border border-[#e2b7bf]/30 dark:border-[#4a2834] p-4 flex flex-col justify-between">
                {/* SVG Route Grid */}
                <svg className="absolute inset-0 w-full h-full opacity-60 dark:opacity-30" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <pattern id="trackgrid" width="40" height="40" patternUnits="userSpaceOnUse">
                      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(158,53,68,0.15)" strokeWidth="1" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#trackgrid)" />
                  {/* Highway line */}
                  <path d="M 40 180 Q 200 120 380 90 T 700 60" fill="none" stroke="#9e3544" strokeWidth="4" strokeDasharray="6,4" />
                </svg>

                {/* Warehouse Node */}
                <div className="relative z-10 flex items-center gap-2 bg-white/90 dark:bg-[#1e0f15]/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-[#e2b7bf]/50 dark:border-[#4a2834] w-fit shadow-xs">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#9e3544]"></span>
                  <div className="text-[10px]">
                    <p className="font-bold text-[#1e1315] dark:text-[#fdebed]">Banani Central Vault</p>
                    <p className="text-[#8c6d73] dark:text-[#d6b4bd]">Origin Warehouse • Dispatched</p>
                  </div>
                </div>

                {/* Moving Courier Pin Marker */}
                <div className="relative z-10 self-center bg-[#9e3544] text-white px-3 py-1.5 rounded-full shadow-lg flex items-center gap-2 text-xs font-bold animate-pulse">
                  <span className="material-symbols-outlined text-sm">electric_moped</span>
                  <span>Mohakhali Flyover • 32 km/h</span>
                </div>

                {/* Destination Node */}
                <div className="relative z-10 self-end flex items-center gap-2 bg-white/90 dark:bg-[#1e0f15]/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-[#e2b7bf]/50 dark:border-[#4a2834] w-fit shadow-xs">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#4d644d]"></span>
                  <div className="text-[10px]">
                    <p className="font-bold text-[#1e1315] dark:text-[#fdebed]">{selectedOrder.customerName}</p>
                    <p className="text-[#8c6d73] dark:text-[#d6b4bd]">{selectedOrder.location} (Destination)</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Parcel Manifest & Delivery Details */}
          <div className="lg:col-span-4 space-y-6">
            {/* Parcel Contents */}
            <div className="bg-white dark:bg-[#1e0f15] p-6 rounded-3xl border border-[#e2b7bf]/60 dark:border-[#4a2834] shadow-sm space-y-4">
              <h3 className="font-headline text-lg font-bold text-[#1e1315] dark:text-[#fdebed] flex items-center justify-between">
                <span>Items in Consignment</span>
                <span className="text-xs font-sans text-[#9e3544] dark:text-[#f27284] font-semibold">
                  {selectedOrder.items.length} Formulations
                </span>
              </h3>

              <div className="space-y-3 divide-y divide-[#e2b7bf]/20 dark:divide-[#4a2834]">
                {selectedOrder.items.map((item) => (
                  <div key={item.id} className="pt-3 first:pt-0 flex items-center justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-[#1e1315] dark:text-[#fdebed] truncate">
                        {item.name}
                      </p>
                      <p className="text-[11px] text-[#593f44] dark:text-[#d6b4bd]">
                        Qty: {item.quantity} × ৳{item.price.toLocaleString()}
                      </p>
                    </div>
                    <span className="text-xs font-bold text-[#9e3544] dark:text-[#f27284] shrink-0">
                      ৳{(item.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              {/* Price summary */}
              <div className="pt-4 border-t border-[#e2b7bf]/30 dark:border-[#4a2834] space-y-1.5 text-xs">
                <div className="flex justify-between text-[#593f44] dark:text-[#d6b4bd]">
                  <span>Subtotal</span>
                  <span>৳{selectedOrder.subtotal.toLocaleString()}</span>
                </div>
                {selectedOrder.discount > 0 && (
                  <div className="flex justify-between text-[#4d644d] dark:text-[#83a083] font-semibold">
                    <span>Voucher Discount</span>
                    <span>-৳{selectedOrder.discount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-[#593f44] dark:text-[#d6b4bd]">
                  <span>Courier Delivery Fee</span>
                  <span>৳{selectedOrder.deliveryFee}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-[#1e1315] dark:text-[#fdebed] pt-2 border-t border-[#e2b7bf]/30 dark:border-[#4a2834]">
                  <span>Total Amount</span>
                  <span className="text-[#9e3544] dark:text-[#f27284]">
                    ৳{selectedOrder.total.toLocaleString()}
                  </span>
                </div>
                <div className="pt-1 flex items-center justify-between text-[11px]">
                  <span className="text-[#8c6d73] dark:text-[#d6b4bd]">Payment Method:</span>
                  <span className="font-semibold uppercase text-[#1e1315] dark:text-[#fdebed]">
                    {selectedOrder.paymentMethod} ({selectedOrder.paymentStatus})
                  </span>
                </div>
              </div>
            </div>

            {/* Delivery Destination Card */}
            <div className="bg-white dark:bg-[#1e0f15] p-6 rounded-3xl border border-[#e2b7bf]/60 dark:border-[#4a2834] shadow-sm space-y-3">
              <h4 className="font-headline text-base font-bold text-[#1e1315] dark:text-[#fdebed] flex items-center gap-2">
                <span className="material-symbols-outlined text-sm text-[#9e3544] dark:text-[#f27284]">
                  location_on
                </span>
                <span>Delivery Address</span>
              </h4>
              <div className="text-xs text-[#593f44] dark:text-[#d6b4bd] space-y-1">
                <p className="font-bold text-[#1e1315] dark:text-[#fdebed]">{selectedOrder.customerName}</p>
                <p>{selectedOrder.fullAddress}</p>
                <p className="text-[11px] text-[#8c6d73] dark:text-[#8a636e] pt-1">
                  Contact: {selectedOrder.customerPhone} • {selectedOrder.customerEmail}
                </p>
              </div>

              <div className="pt-3 border-t border-[#e2b7bf]/30 dark:border-[#4a2834]">
                <a
                  href="https://wa.me/8801700232889"
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-2.5 rounded-full bg-[#fff2f4] dark:bg-[#28141c] hover:bg-[#fde5e9] text-[#9e3544] dark:text-[#f27284] text-xs font-bold flex items-center justify-center gap-2 transition-colors border border-[#e2b7bf]/40 dark:border-[#4a2834]"
                >
                  <span className="material-symbols-outlined text-sm">chat</span>
                  <span>WhatsApp Concierge Hotline</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};
