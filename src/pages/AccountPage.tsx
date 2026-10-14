import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Order } from '../types';

export const AccountPage: React.FC = () => {
  const {
    user,
    orders,
    addresses,
    addAddress,
    setTrackingModalOrder,
    addToCart,
    products,
    showToast,
    navigateTo,
  } = useStore();

  const [activeTab, setActiveTab] = useState<'orders' | 'profile' | 'wishlist' | 'addresses' | 'loyalty'>(
    'orders'
  );
  const [showAddAddressModal, setShowAddAddressModal] = useState(false);
  const [newStreet, setNewStreet] = useState('');
  const [newThana, setNewThana] = useState('Uttara');

  // Active in-transit or out for delivery order
  const activeOrder = orders.find(
    (o) => o.status === 'Out for Delivery' || o.status === 'In-Transit' || o.status === 'Processing'
  ) || orders[0];

  const pastOrders = orders.filter((o) => o.id !== activeOrder?.id);

  const handleReorder = (order: Order) => {
    order.items.forEach((item) => {
      const match = products.find((p) => p.name.includes(item.name.split(' ')[0])) || products[0];
      addToCart(match, item.quantity);
    });
    showToast(`Items from Order #${order.id} reloaded into your bag`);
    navigateTo('cart-checkout');
  };

  const handleCreateAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStreet) return;
    addAddress({
      type: 'Home',
      isPrimary: false,
      fullName: user.name,
      phone: user.phone,
      division: 'Dhaka Division',
      district: 'Dhaka',
      thana: newThana,
      street: newStreet,
      postalCode: '1230',
    });
    setNewStreet('');
    setShowAddAddressModal(false);
  };

  return (
    <div className="w-full bg-[#fff8f8] min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 space-y-10">
        {/* User Identity & VIP Banner Card */}
        <div className="relative overflow-hidden bg-[#fbf1f3] rounded-2xl p-6 lg:p-10 shadow-sm border border-[#d6c2c0]/30">
          <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-[#c58882]/15 blur-3xl pointer-events-none"></div>
          <div className="absolute right-1/3 bottom-0 w-64 h-64 rounded-full bg-[#ffdcbd]/20 blur-2xl pointer-events-none"></div>

          <div className="relative z-10 flex flex-col xl:flex-row items-start xl:items-center justify-between gap-8">
            {/* Identity Info */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <div className="relative shrink-0">
                <img
                  alt="Tahmina Rahman Profile"
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover shadow-md ring-4 ring-white"
                  src={user.avatarUrl}
                />
                <span
                  className="absolute bottom-1 right-1 p-1.5 bg-[#84504c] text-white rounded-full shadow-sm flex items-center justify-center"
                  title="VIP Verified"
                >
                  <span className="material-symbols-outlined text-xs fill">workspace_premium</span>
                </span>
              </div>

              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="font-headline text-2xl sm:text-3xl font-bold text-[#1f1a1c]">
                    {user.name}
                  </h1>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ffdcbd] text-[#2c1600] text-xs font-bold uppercase tracking-wider">
                    <span className="material-symbols-outlined text-xs fill">stars</span>
                    {user.tier} ({user.points.toLocaleString()} Beauty Points)
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-y-1.5 gap-x-5 text-[#524342] text-xs sm:text-sm">
                  <span className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-base text-[#84504c]">mail</span>
                    {user.email}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-base text-[#7d562d]">phone_iphone</span>
                    {user.phone}
                  </span>
                  <span className="flex items-center gap-1.5 text-[#536251]">
                    <span className="material-symbols-outlined text-base">pin_drop</span>
                    {user.location}
                  </span>
                </div>

                <div className="pt-1 flex items-center gap-2">
                  <span className="text-[11px] text-[#524342]">
                    Tier Progress: {user.pointsToNextTier} pts to Platinum Sanctuary
                  </span>
                  <div className="w-32 h-1.5 bg-[#eae0e2] rounded-full overflow-hidden">
                    <div className="bg-[#84504c] h-full rounded-full" style={{ width: '72%' }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Metric Stats Micro-Grid */}
            <div className="w-full xl:w-auto grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-white p-4 rounded-xl shadow-xs border border-[#d6c2c0]/30 flex flex-col items-center justify-center text-center min-w-[120px]">
                <span className="text-[10px] uppercase tracking-wider text-[#524342] font-semibold">
                  Total Orders
                </span>
                <span className="font-headline text-2xl text-[#84504c] font-bold mt-1">
                  {orders.length}
                </span>
                <span className="text-[10px] text-[#536251] mt-0.5 font-medium">Lifetime</span>
              </div>

              <div className="bg-white p-4 rounded-xl shadow-xs border border-[#d6c2c0]/30 flex flex-col items-center justify-center text-center min-w-[120px]">
                <span className="text-[10px] uppercase tracking-wider text-[#7d562d] font-semibold">
                  In-Transit
                </span>
                <span className="font-headline text-2xl text-[#7d562d] font-bold mt-1">1</span>
                <span className="text-[9px] text-[#7a532a] bg-[#ffca98] px-2 py-0.5 rounded-full mt-0.5 font-bold">
                  Dhaka En Route
                </span>
              </div>

              <div className="bg-white p-4 rounded-xl shadow-xs border border-[#d6c2c0]/30 flex flex-col items-center justify-center text-center min-w-[120px]">
                <span className="text-[10px] uppercase tracking-wider text-[#524342] font-semibold">
                  Wishlist
                </span>
                <span className="font-headline text-2xl text-[#1f1a1c] font-bold mt-1">6</span>
                <span className="text-[10px] text-[#524342] mt-0.5 font-medium">Curated</span>
              </div>

              <div className="bg-white p-4 rounded-xl shadow-xs border border-[#d6c2c0]/30 flex flex-col items-center justify-center text-center min-w-[120px]">
                <span className="text-[10px] uppercase tracking-wider text-[#84504c] font-semibold">
                  Store Credits
                </span>
                <span className="font-headline text-2xl text-[#84504c] font-bold mt-1">
                  ৳{user.storeCredit}
                </span>
                <span className="text-[10px] text-[#536251] mt-0.5 font-medium">Auto-Applies</span>
              </div>
            </div>
          </div>
        </div>

        {/* 2-Column Portal Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Navigation Sidebar */}
          <aside className="lg:col-span-3 w-full bg-[#fbf1f3] rounded-2xl p-4 shadow-sm border border-[#d6c2c0]/30 space-y-1">
            <div className="px-3 py-2 text-[#524342] text-[10px] uppercase tracking-widest font-bold">
              Personal Sanctuary
            </div>

            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-semibold text-left transition-colors ${
                activeTab === 'profile'
                  ? 'bg-[#c58882] text-white shadow-sm'
                  : 'text-[#524342] hover:bg-white hover:text-[#1f1a1c]'
              }`}
            >
              <span className="flex items-center gap-3">
                <span className="material-symbols-outlined text-lg">space_dashboard</span>
                Overview &amp; Profile
              </span>
            </button>

            <button
              onClick={() => setActiveTab('orders')}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-semibold text-left transition-colors ${
                activeTab === 'orders'
                  ? 'bg-[#c58882] text-white shadow-sm'
                  : 'text-[#524342] hover:bg-white hover:text-[#1f1a1c]'
              }`}
            >
              <span className="flex items-center gap-3">
                <span className="material-symbols-outlined text-lg fill">local_shipping</span>
                My Orders &amp; Tracking
              </span>
              <span className="w-2 h-2 rounded-full bg-[#84504c] animate-pulse"></span>
            </button>

            <button
              onClick={() => navigateTo('shop-catalog')}
              className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-semibold text-[#524342] hover:bg-white hover:text-[#1f1a1c] transition-colors text-left"
            >
              <span className="flex items-center gap-3">
                <span className="material-symbols-outlined text-lg">favorite</span>
                Wishlist &amp; Saved Items
              </span>
              <span className="px-2 py-0.5 rounded-full bg-[#eae0e2] text-[10px]">6</span>
            </button>

            <button
              onClick={() => setActiveTab('addresses')}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-semibold text-left transition-colors ${
                activeTab === 'addresses'
                  ? 'bg-[#c58882] text-white shadow-sm'
                  : 'text-[#524342] hover:bg-white hover:text-[#1f1a1c]'
              }`}
            >
              <span className="flex items-center gap-3">
                <span className="material-symbols-outlined text-lg">pin_drop</span>
                Saved Delivery Addresses
              </span>
              <span className="px-2 py-0.5 rounded-full bg-[#eae0e2] text-[10px]">
                {addresses.length}
              </span>
            </button>

            <button
              onClick={() => showToast('Opening personalized skincare analysis routine...')}
              className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-semibold text-[#524342] hover:bg-white hover:text-[#1f1a1c] transition-colors text-left"
            >
              <span className="flex items-center gap-3">
                <span className="material-symbols-outlined text-lg">spa</span>
                Skin Profile &amp; Preferences
              </span>
              <span className="w-2 h-2 rounded-full bg-[#536251]"></span>
            </button>

            <button
              onClick={() => setActiveTab('loyalty')}
              className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-semibold text-[#524342] hover:bg-white hover:text-[#1f1a1c] transition-colors text-left"
            >
              <span className="flex items-center gap-3">
                <span className="material-symbols-outlined text-lg">loyalty</span>
                Loyalty Points &amp; Rewards
              </span>
            </button>

            {/* Lounge Concierge WhatsApp hotline */}
            <div className="pt-4 mt-2 border-t border-[#d6c2c0]/30">
              <div className="p-3 bg-white rounded-xl space-y-2 border border-[#d6c2c0]/20">
                <div className="flex items-center gap-2 text-[#84504c] text-xs font-bold">
                  <span className="material-symbols-outlined text-base">support_agent</span>
                  Lounge Concierge
                </div>
                <p className="text-[11px] text-[#524342] leading-tight">
                  Dedicated Gulshan representative online for Tahmina.
                </p>
                <a
                  href="https://wa.me/8801700232889"
                  target="_blank"
                  rel="noreferrer"
                  className="block w-full text-center py-1.5 rounded-full bg-[#84504c] text-white text-xs font-bold hover:bg-[#c58882] transition-colors"
                >
                  Chat on WhatsApp
                </a>
              </div>
            </div>

            {/* Staff / Admin Quick Access */}
            <div className="pt-3">
              <button
                onClick={() => navigateTo('admin-portal')}
                className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold text-[#84504c] bg-[#fbf1f3] hover:bg-[#f6ebee] border border-[#c58882]/20 transition-colors text-left cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-base">admin_panel_settings</span>
                  <span>Lounge OS Admin Portal</span>
                </span>
                <span className="material-symbols-outlined text-xs">arrow_forward</span>
              </button>
            </div>
          </aside>

          {/* Right Content Area */}
          <section className="lg:col-span-9 space-y-10">
            {/* Active Delivery Order */}
            {activeOrder && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="text-xs uppercase tracking-widest text-[#84504c] font-bold">
                      Real-time Fulfillment
                    </span>
                    <h2 className="font-headline text-2xl text-[#1f1a1c] font-bold">
                      Active Delivery Order
                    </h2>
                  </div>
                  <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ffdcbd] text-[#2c1600] text-xs font-bold self-start sm:self-auto">
                    <span className="w-2 h-2 rounded-full bg-[#7d562d] animate-ping"></span>
                    Dispatched via Steadfast Express
                  </span>
                </div>

                {/* Highlight Active Order Card */}
                <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-sm border border-[#d6c2c0]/30 space-y-8">
                  {/* Order Meta Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-[#d6c2c0]/30">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-headline text-lg text-[#1f1a1c] font-bold">
                          Order #{activeOrder.id}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full bg-[#f6ebee] text-xs text-[#524342] font-semibold">
                          {activeOrder.paymentStatus}
                        </span>
                      </div>
                      <p className="text-xs text-[#524342]">
                        Placed on {activeOrder.date} • Destination: {activeOrder.location}
                      </p>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <span className="text-[10px] uppercase text-[#524342] block font-semibold">
                          Total Payable
                        </span>
                        <span className="font-headline text-2xl text-[#84504c] font-bold">
                          ৳{activeOrder.total.toLocaleString()}
                        </span>
                      </div>
                      <div className="hidden sm:block h-8 w-px bg-[#d6c2c0]/40"></div>
                      <div className="text-right hidden sm:block">
                        <span className="text-[10px] uppercase text-[#524342] block font-semibold">
                          Payment Method
                        </span>
                        <span className="text-xs text-[#7d562d] font-bold">
                          {activeOrder.paymentMethod === 'cod'
                            ? 'Cash on Delivery (COD)'
                            : activeOrder.paymentMethod === 'bkash'
                            ? 'bKash Instant'
                            : 'Online Card'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* 4-Step Visual Tracker Flow */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-xs text-[#524342]">
                      <span className="text-[#536251] font-bold flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm fill">verified</span>
                        Verified &amp; Authenticated
                      </span>
                      <span className="text-[#7d562d] font-bold flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">timer</span>
                        Expected Arrival: {activeOrder.expectedDelivery}
                      </span>
                    </div>

                    {/* Step Diagram */}
                    <div className="relative pt-4 pb-2">
                      <div className="absolute top-8 left-6 right-6 h-1 bg-[#f0e6e8] rounded-full -translate-y-1/2 z-0">
                        <div className="bg-[#84504c] h-full rounded-full" style={{ width: '70%' }}></div>
                      </div>

                      <div className="relative z-10 grid grid-cols-4 gap-2 text-center">
                        {/* Step 1 */}
                        <div className="flex flex-col items-center space-y-2">
                          <div className="w-8 h-8 rounded-full bg-[#84504c] text-white flex items-center justify-center text-xs shadow-sm">
                            <span className="material-symbols-outlined text-base">check</span>
                          </div>
                          <div>
                            <p className="text-xs font-bold text-[#1f1a1c]">Order Confirmed</p>
                            <span className="text-[10px] text-[#847371] hidden md:block">
                              18 May, 11:35 AM
                            </span>
                          </div>
                        </div>

                        {/* Step 2 */}
                        <div className="flex flex-col items-center space-y-2">
                          <div className="w-8 h-8 rounded-full bg-[#84504c] text-white flex items-center justify-center text-xs shadow-sm">
                            <span className="material-symbols-outlined text-base">check</span>
                          </div>
                          <div>
                            <p className="text-xs font-bold text-[#1f1a1c]">Packed at Hub</p>
                            <span className="text-[10px] text-[#847371] hidden md:block">
                              Banani Central Luxury Vault
                            </span>
                          </div>
                        </div>

                        {/* Step 3 (Active) */}
                        <div className="flex flex-col items-center space-y-2">
                          <div className="w-8 h-8 rounded-full bg-[#7d562d] text-white flex items-center justify-center text-xs shadow-md ring-4 ring-[#ffdcbd]">
                            <span className="material-symbols-outlined text-base">moped</span>
                          </div>
                          <div>
                            <p className="text-xs font-bold text-[#7d562d]">Out for Delivery</p>
                            <span className="text-[10px] text-[#7d562d] hidden md:block">
                              Steadfast / Pathao Courier (Today)
                            </span>
                          </div>
                        </div>

                        {/* Step 4 */}
                        <div className="flex flex-col items-center space-y-2 opacity-60">
                          <div className="w-8 h-8 rounded-full bg-[#eae0e2] text-[#524342] flex items-center justify-center text-xs">
                            <span className="material-symbols-outlined text-base">home</span>
                          </div>
                          <div>
                            <p className="text-xs font-medium text-[#1f1a1c]">Delivered</p>
                            <span className="text-[10px] text-[#847371] hidden md:block">
                              House 42, Banani
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Courier Status Banner */}
                  <div className="bg-[#fbf1f3] rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-[#d6c2c0]/20">
                    <div className="flex items-center gap-3.5">
                      <div className="w-10 h-10 rounded-full bg-[#ffdcbd] flex items-center justify-center text-[#2c1600] shrink-0">
                        <span className="material-symbols-outlined text-xl">two_wheeler</span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-[#1f1a1c]">Courier Tracking ID:</span>
                          <span className="text-xs font-mono bg-white px-2 py-0.5 rounded text-[#84504c] font-bold">
                            {activeOrder.courierTrackingId}
                          </span>
                        </div>
                        <p className="text-xs text-[#7d562d] font-medium mt-0.5 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#7d562d] animate-pulse"></span>
                          Rider Rahim is en route in Banani area (approx. 18 mins away)
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
                      <button
                        onClick={() => setTrackingModalOrder(activeOrder)}
                        className="flex-1 md:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-full bg-[#84504c] text-white text-xs font-bold hover:bg-[#c58882] transition-colors shadow-sm"
                      >
                        <span className="material-symbols-outlined text-sm">map</span>
                        <span>Track Live on Map</span>
                      </button>
                      <button
                        onClick={() => showToast(`Downloading PDF invoice for #${activeOrder.id}...`)}
                        className="flex-1 md:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-full bg-[#eae0e2] text-[#1f1a1c] text-xs font-semibold hover:bg-[#d6c2c0] transition-colors"
                      >
                        <span className="material-symbols-outlined text-sm">receipt_long</span>
                        <span>Download Invoice (PDF)</span>
                      </button>
                      <button
                        onClick={() => showToast('Order cancellation window has closed. Parcel is with rider.')}
                        className="px-3 py-2 rounded-full text-[#ba1a1a] hover:bg-[#ffdad6]/40 text-xs font-semibold transition-colors"
                      >
                        Cancel Order
                      </button>
                    </div>
                  </div>

                  {/* Parcel Items in Shipment */}
                  <div className="pt-2">
                    <span className="text-xs uppercase tracking-wider text-[#524342] font-bold block mb-3">
                      Items in This Shipment ({activeOrder.items.length} Items)
                    </span>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {activeOrder.items.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center gap-3 p-3 rounded-xl bg-[#fff8f8] border border-[#d6c2c0]/30"
                        >
                          <div className="w-12 h-12 rounded-lg bg-[#f6ebee] flex items-center justify-center text-[#84504c] shrink-0">
                            <span className="material-symbols-outlined text-xl">sanitizer</span>
                          </div>
                          <div className="min-w-0 flex-1">
                            <h3 className="text-xs font-bold text-[#1f1a1c] truncate">{item.name}</h3>
                            <p className="text-[11px] text-[#524342]">
                              Qty: {item.quantity} • ৳{item.price.toLocaleString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Past Order History Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-headline text-xl text-[#1f1a1c] font-bold">Past Order History</h2>
                <span className="text-xs text-[#84504c] font-bold flex items-center gap-1">
                  View All 8 Orders
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </span>
              </div>

              <div className="bg-white rounded-2xl overflow-hidden shadow-xs border border-[#d6c2c0]/30">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-[#fbf1f3] text-[#524342] text-[10px] uppercase tracking-wider font-bold">
                      <tr>
                        <th className="py-3.5 px-6">Order Details</th>
                        <th className="py-3.5 px-6">Products Purchased</th>
                        <th className="py-3.5 px-6">Amount</th>
                        <th className="py-3.5 px-6">Status</th>
                        <th className="py-3.5 px-6 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#d6c2c0]/20 text-xs">
                      {pastOrders.map((pOrder) => (
                        <tr key={pOrder.id} className="hover:bg-[#fbf1f3]/50 transition-colors">
                          <td className="py-4 px-6 align-top">
                            <span className="font-bold text-[#1f1a1c] block">#{pOrder.id}</span>
                            <span className="text-[11px] text-[#524342]">{pOrder.date}</span>
                            <span className="text-[#536251] text-[10px] font-semibold flex items-center gap-1 mt-0.5">
                              <span className="material-symbols-outlined text-xs">payments</span>
                              {pOrder.paymentMethod === 'bkash' ? 'bKash Paid' : 'Card Paid'}
                            </span>
                          </td>
                          <td className="py-4 px-6 align-top">
                            <p className="font-semibold text-[#1f1a1c]">
                              {pOrder.items.map((i) => i.name).join(', ')}
                            </p>
                            <span className="text-[11px] text-[#524342]">
                              {pOrder.items.length} items • Batch verified authentic
                            </span>
                          </td>
                          <td className="py-4 px-6 align-top">
                            <span className="font-headline text-base text-[#1f1a1c] font-bold">
                              ৳{pOrder.total.toLocaleString()}
                            </span>
                          </td>
                          <td className="py-4 px-6 align-top">
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#d7e7d1] text-[#111f11] text-[10px] font-bold">
                              <span className="material-symbols-outlined text-xs fill">check_circle</span>
                              Delivered
                            </span>
                          </td>
                          <td className="py-4 px-6 align-top text-right space-x-2">
                            <button
                              onClick={() => handleReorder(pOrder)}
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#c58882] text-white text-[11px] font-semibold hover:bg-[#84504c] transition-colors"
                            >
                              <span className="material-symbols-outlined text-xs">repeat</span>
                              Reorder
                            </button>
                            <button
                              onClick={() => showToast(`Review submission form opened for #${pOrder.id}`)}
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#f6ebee] text-[11px] text-[#1f1a1c] font-medium hover:bg-[#eae0e2] transition-colors"
                            >
                              <span className="material-symbols-outlined text-xs">rate_review</span>
                              Write Review
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Bento: Saved Delivery Addresses & Skin Profile */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              {/* Saved Delivery Addresses (7 cols) */}
              <div className="md:col-span-7 bg-white rounded-2xl p-6 shadow-xs border border-[#d6c2c0]/30 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs uppercase tracking-widest text-[#84504c] font-bold">
                        Courier Ready
                      </span>
                      <h3 className="font-headline text-lg font-bold text-[#1f1a1c]">
                        Saved Delivery Addresses
                      </h3>
                    </div>
                    <button
                      onClick={() => setShowAddAddressModal(true)}
                      className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full bg-[#c58882] text-white text-xs font-semibold hover:bg-[#84504c] transition-all"
                    >
                      <span className="material-symbols-outlined text-sm">add</span>
                      <span>+ Add New Delivery Address</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    {addresses.map((addr) => (
                      <div
                        key={addr.id}
                        className={`p-4 rounded-xl relative flex flex-col justify-between gap-3 border ${
                          addr.isPrimary
                            ? 'bg-[#fbf1f3] border-[#c58882]/40'
                            : 'bg-white border-[#d6c2c0]/30'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-[#1f1a1c]">{addr.type}</span>
                              {addr.isPrimary && (
                                <span className="px-2 py-0.5 rounded-full bg-[#84504c] text-white text-[10px] font-bold">
                                  Primary
                                </span>
                              )}
                            </div>
                            <p className="text-xs font-bold text-[#1f1a1c]">{addr.street}</p>
                            <p className="text-[11px] text-[#524342]">
                              {addr.district}-{addr.postalCode}, Bangladesh
                            </p>
                            <p className="text-[10px] text-[#847371]">
                              Recipient: {addr.fullName} ({addr.phone})
                            </p>
                          </div>
                          <button
                            onClick={() => showToast(`Editing address for ${addr.street}`)}
                            className="p-1 hover:text-[#84504c] text-[#524342]"
                          >
                            <span className="material-symbols-outlined text-base">edit</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2 text-[#524342] text-xs pt-2">
                  <span className="material-symbols-outlined text-base text-[#7d562d]">verified_user</span>
                  <span>Pre-validated for instant 12-hour express dispatch in Gulshan &amp; Banani zones.</span>
                </div>
              </div>

              {/* Personalized Skin Profile (5 cols) */}
              <div className="md:col-span-5 bg-[#fbf1f3] rounded-2xl p-6 shadow-xs border border-[#d6c2c0]/30 flex flex-col justify-between space-y-6">
                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs uppercase tracking-widest text-[#84504c] font-bold">
                        Derm &amp; Routine Match
                      </span>
                      <h3 className="font-headline text-lg font-bold text-[#1f1a1c]">
                        Personalized Skin Profile
                      </h3>
                    </div>
                    <button
                      onClick={() => navigateTo('home')}
                      className="p-1.5 rounded-full bg-[#eae0e2] text-[#84504c] hover:bg-[#d6c2c0] transition-colors"
                      title="Retake Skin Quiz on Home"
                    >
                      <span className="material-symbols-outlined text-base">tune</span>
                    </button>
                  </div>

                  {/* Skin Type Block */}
                  <div className="space-y-1.5 p-3 rounded-xl bg-white border border-[#d6c2c0]/20">
                    <span className="text-[10px] uppercase tracking-wider text-[#847371] font-bold">
                      Identified Skin Type
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#536251]"></span>
                      <p className="text-xs font-bold text-[#1f1a1c]">{user.skinType}</p>
                    </div>
                    <p className="text-[11px] text-[#524342] leading-relaxed">
                      Prone to T-zone shine during Dhaka monsoon with sensitivity to heavy mineral fragrances.
                    </p>
                  </div>

                  {/* Primary Concerns */}
                  <div className="space-y-2">
                    <span className="text-[10px] uppercase tracking-wider text-[#847371] font-bold block">
                      Primary Skin Concerns
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {user.skinConcerns.map((c) => (
                        <span
                          key={c}
                          className="px-3 py-1 rounded-full bg-white text-[#1f1a1c] text-xs font-medium shadow-xs flex items-center gap-1 border border-[#d6c2c0]/30"
                        >
                          <span className="material-symbols-outlined text-xs text-[#84504c]">grain</span>
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Preferred Brands */}
                  <div className="space-y-2">
                    <span className="text-[10px] uppercase tracking-wider text-[#847371] font-bold block">
                      Curated Preferred Brands
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {user.preferredBrands.map((b) => (
                        <span
                          key={b}
                          className="px-3 py-1 rounded-full bg-[#ffdad6] text-[#34100d] text-xs font-semibold"
                        >
                          {b}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Seasonal Matches CTA */}
                <div className="p-3 bg-[#d7e7d1]/60 rounded-xl flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#536251] text-lg">auto_awesome</span>
                    <span className="text-[#111f11] font-medium">3 seasonal matches ready in your feed</span>
                  </div>
                  <button
                    onClick={() => navigateTo('shop-catalog')}
                    className="text-[#536251] font-bold hover:underline whitespace-nowrap"
                  >
                    View Matches
                  </button>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Add Address Modal Dialog */}
      {showAddAddressModal && (
        <div className="fixed inset-0 z-50 bg-[#342f31]/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-headline text-lg font-bold text-[#1f1a1c]">Add New Delivery Address</h3>
              <button
                onClick={() => setShowAddAddressModal(false)}
                className="p-1 rounded-full text-[#524342]"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <form onSubmit={handleCreateAddress} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-[#1f1a1c] mb-1">
                  Full Street Address (Holding, Road & Flat No.)
                </label>
                <textarea
                  required
                  value={newStreet}
                  onChange={(e) => setNewStreet(e.target.value)}
                  placeholder="e.g. House 14, Road 7, Sector 3, Uttara"
                  className="w-full bg-[#fbf1f3] px-3.5 py-2.5 rounded-xl text-xs text-[#1f1a1c] outline-none"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#1f1a1c] mb-1">Thana / Zone</label>
                <select
                  value={newThana}
                  onChange={(e) => setNewThana(e.target.value)}
                  className="w-full bg-[#fbf1f3] px-3.5 py-2.5 rounded-xl text-xs text-[#1f1a1c] outline-none"
                >
                  <option>Uttara</option>
                  <option>Banani</option>
                  <option>Gulshan 1</option>
                  <option>Gulshan 2</option>
                  <option>Dhanmondi</option>
                  <option>Mirpur</option>
                  <option>Mohakhali</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddAddressModal(false)}
                  className="px-4 py-2 text-xs text-[#524342]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full bg-[#84504c] text-white text-xs font-bold hover:bg-[#c58882]"
                >
                  Save Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
