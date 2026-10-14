import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { ASSETS } from '../data/mockData';
import { Order } from '../types';
import { AdminLoginPage } from './AdminLoginPage';

export const AdminPage: React.FC = () => {
  const {
    orders,
    updateOrderStatus,
    setIsBatchImportOpen,
    setTrackingModalOrder,
    navigateTo,
    showToast,
    isAdminAuthenticated,
    adminUser,
    logoutAdmin,
  } = useStore();

  if (!isAdminAuthenticated) {
    return <AdminLoginPage />;
  }

  const [activeStatusTab, setActiveStatusTab] = useState<string>('All');
  const [searchFilter, setSearchFilter] = useState('');

  const filteredOrders = orders.filter((o) => {
    if (activeStatusTab !== 'All') {
      if (activeStatusTab === 'New' && o.status !== 'New') return false;
      if (activeStatusTab === 'Processing' && o.status !== 'Processing') return false;
      if (activeStatusTab === 'Shipped' && o.status !== 'Out for Delivery' && o.status !== 'In-Transit') return false;
      if (activeStatusTab === 'Delivered' && o.status !== 'Delivered') return false;
    }
    if (searchFilter.trim()) {
      const q = searchFilter.toLowerCase();
      return (
        o.id.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        o.customerPhone.includes(q) ||
        o.courierTrackingId.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handlePackAndDispatch = (orderId: string) => {
    updateOrderStatus(orderId, 'Out for Delivery');
    showToast(`Order #${orderId} marked as Packed & Dispatched to Courier!`);
  };

  return (
    <div className="w-full bg-[#fff8f8] min-h-screen">
      <div className="flex flex-col lg:flex-row">
        {/* Admin Left Sidebar */}
        <aside className="w-full lg:w-64 bg-[#fbf1f3] border-r border-[#d6c2c0]/30 p-6 flex flex-col justify-between shrink-0">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <img
                alt="Beauty Lounge Logo"
                className="h-8 w-auto object-contain"
                src={ASSETS.logo}
              />
              <div className="flex flex-col">
                <span className="font-headline text-lg text-[#84504c] font-bold leading-tight">
                  LOUNGE OS
                </span>
                <span className="text-[9px] tracking-widest text-[#524342] uppercase font-bold">
                  Admin Portal
                </span>
              </div>
            </div>

            <nav className="space-y-1.5">
              <button
                className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-full text-xs font-semibold bg-[#c58882] text-white shadow-xs"
              >
                <span className="material-symbols-outlined text-base">dashboard</span>
                <span>Admin Overview</span>
              </button>
              <button
                onClick={() => setIsBatchImportOpen(true)}
                className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-full text-xs font-semibold text-[#524342] hover:bg-white transition-colors text-left"
              >
                <span className="material-symbols-outlined text-base">inventory_2</span>
                <span>Stock &amp; Batches</span>
              </button>
              <button
                onClick={() => showToast('Opening nationwide logistics map...')}
                className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-full text-xs font-semibold text-[#524342] hover:bg-white transition-colors text-left"
              >
                <span className="material-symbols-outlined text-base">local_shipping</span>
                <span>Districts Dispatch</span>
              </button>
              <button
                onClick={() => navigateTo('home')}
                className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-full text-xs font-semibold text-[#524342] hover:bg-white transition-colors text-left"
              >
                <span className="material-symbols-outlined text-base">storefront</span>
                <span>View Storefront</span>
              </button>
            </nav>
          </div>

          <div className="pt-6 border-t border-[#d6c2c0]/30 mt-8 space-y-3">
            <div className="p-3 bg-white rounded-xl shadow-xs border border-[#d6c2c0]/20 flex items-center gap-3">
              <img
                alt="Profile"
                className="w-10 h-10 rounded-full object-cover ring-2 ring-[#84504c]/30"
                src={adminUser?.avatarUrl || ASSETS.profileAvatar}
              />
              <div className="flex flex-col min-w-0 flex-1">
                <span className="text-xs font-bold text-[#1f1a1c] truncate">
                  {adminUser?.name || 'Operations Lead'}
                </span>
                <span className="text-[10px] text-[#524342] truncate">
                  {adminUser?.role || 'Banani HQ, Dhaka'}
                </span>
                <span className="text-[9px] text-[#536251] font-semibold flex items-center gap-1 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#536251]"></span>
                  <span>Session Active</span>
                </span>
              </div>
            </div>

            <button
              onClick={() => logoutAdmin()}
              className="w-full flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-full text-xs font-semibold bg-[#ffdad6] text-[#410002] hover:bg-[#ffb4ab] transition-colors cursor-pointer shadow-xs"
            >
              <span className="material-symbols-outlined text-base">logout</span>
              <span>Log Out (লগ আউট)</span>
            </button>
          </div>
        </aside>

        {/* Admin Main Body */}
        <div className="flex-1 min-w-0">
          {/* Top Operational Status Ribbon */}
          <div className="px-6 lg:px-10 py-3 bg-white border-b border-[#d6c2c0]/30 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-[#d7e7d1] text-[#111f11] text-[10px] font-bold">
                Bangladesh Live Node
              </span>
              <span className="text-xs text-[#524342]">bKash / Nagad Instant Webhooks Active</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => showToast('All 3 courier webhooks (Steadfast, Pathao, RedX) synced successfully')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#fbf1f3] text-[#524342] hover:text-[#1f1a1c] text-xs font-semibold transition-colors"
              >
                <span className="material-symbols-outlined text-base">notifications</span>
                <span>Alerts (3)</span>
              </button>

              <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-[#d6c2c0]/30">
                <img
                  alt="Profile"
                  className="w-7 h-7 rounded-full object-cover ring-2 ring-[#c58882]/30"
                  src={adminUser?.avatarUrl || ASSETS.profileAvatar}
                />
                <span className="text-xs font-medium text-[#1f1a1c] truncate max-w-[120px]">
                  {adminUser?.name?.split(' ')[0] || 'Admin'}
                </span>
              </div>

              <button
                onClick={() => logoutAdmin()}
                title="Log out of Lounge OS"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#ffdad6] text-[#410002] hover:bg-[#ffb4ab] text-xs font-bold transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">logout</span>
                <span className="hidden sm:inline">Log Out</span>
              </button>
            </div>
          </div>

          {/* Sub-header Banner & Actions */}
          <div className="px-6 lg:px-10 py-6 bg-[#fbf1f3] border-b border-[#d6c2c0]/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase tracking-widest text-[#84504c] font-bold">
                  Bangladeshi Operations Node
                </span>
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#536251]"></span>
                <span className="text-xs text-[#524342]">
                  Live Sync Enabled (Pathao, Steadfast &amp; RedX API)
                </span>
              </div>
              <h1 className="font-headline text-2xl lg:text-3xl font-bold text-[#1f1a1c] mt-1">
                Dhaka &amp; National Store Operations
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#524342] text-sm">
                  search
                </span>
                <input
                  type="text"
                  placeholder="Search order ID, phone or SKU..."
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  className="pl-8 pr-4 py-2 bg-white rounded-full text-xs text-[#1f1a1c] placeholder:text-[#524342]/60 shadow-xs border border-[#d6c2c0]/40 outline-none focus:ring-1 focus:ring-[#c58882]"
                />
              </div>
              <button
                onClick={() => setIsBatchImportOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-[#c58882] hover:bg-[#84504c] text-white text-xs font-bold rounded-full shadow-xs transition-all shrink-0 cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">add_circle</span>
                <span>Quick Add / Import Batch</span>
              </button>
            </div>
          </div>

          {/* Main Space */}
          <div className="p-6 lg:p-10 space-y-8">
            {/* Top 5 KPI Bento Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* KPI 1: Revenue */}
              <div className="p-5 rounded-2xl bg-[#fbf1f3] border border-[#d6c2c0]/30 shadow-xs flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#524342] font-semibold">Revenue (This Month)</span>
                  <span className="p-1.5 rounded-full bg-[#ffca98]/40 text-[#7d562d]">
                    <span className="material-symbols-outlined text-base">payments</span>
                  </span>
                </div>
                <div className="mt-3">
                  <div className="font-headline text-2xl text-[#1f1a1c] font-bold">৳1,842,500</div>
                  <div className="flex items-center gap-1 mt-1 text-[11px] text-[#536251] font-semibold">
                    <span className="material-symbols-outlined text-xs">trending_up</span>
                    <span>+18.4% vs last month</span>
                  </div>
                </div>
              </div>

              {/* KPI 2: Total Orders */}
              <div className="p-5 rounded-2xl bg-[#fbf1f3] border border-[#d6c2c0]/30 shadow-xs flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#524342] font-semibold">Total Orders</span>
                  <span className="p-1.5 rounded-full bg-[#eae0e2] text-[#1f1a1c]">
                    <span className="material-symbols-outlined text-base">local_mall</span>
                  </span>
                </div>
                <div className="mt-3">
                  <div className="font-headline text-2xl text-[#1f1a1c] font-bold">1,148</div>
                  <div className="flex items-center gap-2 mt-1 text-[10px] text-[#524342] font-bold">
                    <span className="px-1.5 py-0.5 rounded bg-[#ffdad6] text-[#34100d]">84 Pending</span>
                    <span className="px-1.5 py-0.5 rounded bg-[#ffdcbd] text-[#2c1600]">92 Transit</span>
                  </div>
                </div>
              </div>

              {/* KPI 3: AOV */}
              <div className="p-5 rounded-2xl bg-[#fbf1f3] border border-[#d6c2c0]/30 shadow-xs flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#524342] font-semibold">Average Order Value</span>
                  <span className="p-1.5 rounded-full bg-[#f6ebee] text-[#84504c]">
                    <span className="material-symbols-outlined text-base">receipt_long</span>
                  </span>
                </div>
                <div className="mt-3">
                  <div className="font-headline text-2xl text-[#1f1a1c] font-bold">
                    ৳2,840 <span className="text-xs text-[#524342] font-normal">BDT</span>
                  </div>
                  <div className="flex items-center gap-1 mt-1 text-[11px] text-[#536251] font-semibold">
                    <span className="material-symbols-outlined text-xs">insights</span>
                    <span>+৳310 luxury basket bump</span>
                  </div>
                </div>
              </div>

              {/* KPI 4: Low Stock */}
              <div className="p-5 rounded-2xl bg-[#fbf1f3] border border-[#d6c2c0]/30 shadow-xs flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#524342] font-semibold">Low Stock Notice</span>
                  <span className="p-1.5 rounded-full bg-[#ffdad6] text-[#ba1a1a]">
                    <span className="material-symbols-outlined text-base">warning</span>
                  </span>
                </div>
                <div className="mt-3">
                  <div className="flex items-baseline gap-2">
                    <span className="font-headline text-2xl text-[#ba1a1a] font-bold">6</span>
                    <span className="text-xs text-[#524342]">SKUs breached</span>
                  </div>
                  <div className="text-[10px] text-[#ba1a1a] font-bold mt-1">
                    Critical reorders required
                  </div>
                </div>
              </div>

              {/* KPI 5: Payment Ratio */}
              <div className="p-5 rounded-2xl bg-[#fbf1f3] border border-[#d6c2c0]/30 shadow-xs flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#524342] font-semibold">Payment Ratio</span>
                  <span className="text-[10px] text-[#524342] font-bold">Bangladesh</span>
                </div>
                <div className="mt-3 space-y-2">
                  <div className="flex h-2.5 w-full rounded-full overflow-hidden bg-[#eae0e2]">
                    <div className="bg-[#c58882]" style={{ width: '58%' }} title="COD 58%"></div>
                    <div className="bg-[#f0bd8b]" style={{ width: '32%' }} title="bKash 32%"></div>
                    <div className="bg-[#8c9c88]" style={{ width: '10%' }} title="Cards 10%"></div>
                  </div>
                  <div className="grid grid-cols-3 gap-1 text-[10px] text-center">
                    <div>
                      <span className="text-[#524342] block">COD</span>
                      <span className="font-bold text-[#1f1a1c]">58%</span>
                    </div>
                    <div>
                      <span className="text-[#524342] block">bKash</span>
                      <span className="font-bold text-[#1f1a1c]">32%</span>
                    </div>
                    <div>
                      <span className="text-[#524342] block">Cards</span>
                      <span className="font-bold text-[#1f1a1c]">10%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Operations Split */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left Column (8 cols): Orders Queue & Campaign */}
              <div className="lg:col-span-8 space-y-6">
                {/* Live Orders Box */}
                <div className="p-6 rounded-2xl bg-[#fbf1f3] border border-[#d6c2c0]/30 shadow-xs space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h2 className="font-headline text-lg sm:text-xl font-bold text-[#1f1a1c]">
                        Live Orders &amp; Fulfillment Dispatch
                      </h2>
                      <p className="text-xs text-[#524342]">
                        Cross-district Dhaka Hub, Pathao Express, and RedX logistics
                      </p>
                    </div>
                    <button
                      onClick={() => showToast('Batch waybills PDF generated for all active couriers')}
                      className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white text-[#524342] hover:text-[#1f1a1c] text-xs font-semibold shadow-xs transition-colors self-start sm:self-auto border border-[#d6c2c0]/30"
                    >
                      <span className="material-symbols-outlined text-sm">print</span>
                      <span>Batch Waybills</span>
                    </button>
                  </div>

                  {/* Status filter tabs */}
                  <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                    {['All Orders', 'New (14)', 'Processing (32)', 'Shipped (48)', 'Delivered (1,020)'].map(
                      (tab) => {
                        const cleanTab = tab.split(' ')[0];
                        const isActive =
                          (tab === 'All Orders' && activeStatusTab === 'All') ||
                          activeStatusTab === cleanTab;

                        return (
                          <button
                            key={tab}
                            onClick={() => setActiveStatusTab(tab === 'All Orders' ? 'All' : cleanTab)}
                            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                              isActive
                                ? 'bg-[#c58882] text-white shadow-xs'
                                : 'bg-white text-[#524342] hover:bg-[#f0e6e8]'
                            }`}
                          >
                            {tab}
                          </button>
                        );
                      }
                    )}
                  </div>

                  {/* Orders Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="bg-[#f6ebee] text-[#524342] text-[10px] uppercase tracking-wider font-bold">
                          <th className="py-3 px-3 rounded-l-lg">Order &amp; Customer</th>
                          <th className="py-3 px-3">Cart Details</th>
                          <th className="py-3 px-3">Total &amp; Payment</th>
                          <th className="py-3 px-3">Courier Logistics</th>
                          <th className="py-3 px-3">Status</th>
                          <th className="py-3 px-3 text-right rounded-r-lg">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#d6c2c0]/20">
                        {filteredOrders.map((ord) => (
                          <tr key={ord.id} className="bg-white hover:bg-[#fff8f8] transition-colors">
                            <td className="py-3 px-3 rounded-l-lg">
                              <span className="font-bold text-[#84504c] block">#{ord.id}</span>
                              <span className="font-semibold text-[#1f1a1c]">{ord.customerName}</span>
                              <span className="text-[10px] text-[#524342] block">{ord.location}</span>
                            </td>

                            <td className="py-3 px-3">
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#f6ebee] text-[#524342] font-semibold">
                                {ord.items.length} items
                              </span>
                              <p className="text-[11px] text-[#524342] mt-1 line-clamp-1">
                                {ord.items.map((i) => i.name).join(', ')}
                              </p>
                            </td>

                            <td className="py-3 px-3">
                              <div className="font-bold text-[#1f1a1c]">
                                ৳{ord.total.toLocaleString()}
                              </div>
                              <span
                                className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-bold ${
                                  ord.paymentMethod === 'cod'
                                    ? 'bg-[#f0e6e8] text-[#7a532a]'
                                    : 'bg-[#ffdcbd] text-[#2c1600]'
                                }`}
                              >
                                {ord.paymentMethod.toUpperCase()}
                              </span>
                            </td>

                            <td className="py-3 px-3">
                              <div className="flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-[#536251]"></span>
                                <span className="font-semibold text-[#1f1a1c]">{ord.courier}</span>
                              </div>
                              <span className="text-[10px] text-[#847371] font-mono">
                                {ord.courierTrackingId}
                              </span>
                            </td>

                            <td className="py-3 px-3">
                              <span
                                className={`px-2.5 py-1 rounded-full text-[10px] font-bold inline-block ${
                                  ord.status === 'Out for Delivery'
                                    ? 'bg-[#d7e7d1] text-[#111f11]'
                                    : ord.status === 'Processing'
                                    ? 'bg-[#ffca98] text-[#7a532a]'
                                    : 'bg-[#eae0e2] text-[#1f1a1c]'
                                }`}
                              >
                                {ord.status}
                              </span>
                            </td>

                            <td className="py-3 px-3 text-right rounded-r-lg space-x-1 whitespace-nowrap">
                              {ord.status === 'Processing' ? (
                                <button
                                  onClick={() => handlePackAndDispatch(ord.id)}
                                  className="px-3 py-1 rounded-full bg-[#c58882] text-white hover:bg-[#84504c] text-[10px] font-bold transition-colors shadow-xs"
                                >
                                  Pack &amp; Dispatch
                                </button>
                              ) : (
                                <>
                                  <button
                                    onClick={() =>
                                      showToast(`Printing Steadfast shipping label for #${ord.id}`)
                                    }
                                    className="p-1.5 rounded-full bg-[#fbf1f3] text-[#524342] hover:bg-[#c58882] hover:text-white transition-colors"
                                    title="Print Label"
                                  >
                                    <span className="material-symbols-outlined text-sm">print</span>
                                  </button>
                                  <button
                                    onClick={() => setTrackingModalOrder(ord)}
                                    className="p-1.5 rounded-full bg-[#fbf1f3] text-[#524342] hover:bg-[#c58882] hover:text-white transition-colors"
                                    title="View Order Live Location"
                                  >
                                    <span className="material-symbols-outlined text-sm">visibility</span>
                                  </button>
                                </>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Promotional & Campaign Manager */}
                <div className="p-6 rounded-2xl bg-[#fbf1f3] border border-[#d6c2c0]/30 shadow-xs flex flex-col md:flex-row gap-6">
                  {/* Active campaign */}
                  <div className="md:w-1/2 p-5 rounded-2xl bg-white border border-[#d6c2c0]/20 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="px-2 py-0.5 rounded-full bg-[#d7e7d1] text-[#111f11] text-[10px] font-bold uppercase">
                          Active Campaign
                        </span>
                        <span className="text-[10px] text-[#524342]">Expires in 6 days</span>
                      </div>
                      <div className="mt-3">
                        <span className="font-headline text-lg text-[#84504c] tracking-wide font-mono font-bold">
                          DHAKAGLOW
                        </span>
                        <p className="text-xs text-[#524342] mt-1">
                          10% OFF on all skincare orders above ৳2,500 across Bangladesh
                        </p>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-[#d6c2c0]/20 flex items-center justify-between mt-4">
                      <div>
                        <span className="text-[10px] text-[#524342] block font-semibold">Redemptions</span>
                        <span className="font-headline text-xl text-[#1f1a1c] font-bold">312</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-[#524342] block font-semibold">Gross Attributed</span>
                        <span className="font-headline text-xl text-[#536251] font-bold">৳890,000</span>
                      </div>
                    </div>
                  </div>

                  {/* Upcoming campaign */}
                  <div className="md:w-1/2 p-5 rounded-2xl bg-[#f6ebee] border border-[#d6c2c0]/20 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="px-2 py-0.5 rounded-full bg-[#ffdcbd] text-[#2c1600] text-[10px] font-bold uppercase">
                          Upcoming Slot
                        </span>
                        <span className="material-symbols-outlined text-sm text-[#7d562d]">event</span>
                      </div>
                      <h3 className="font-headline text-base font-bold text-[#1f1a1c] mt-2">
                        Eid-ul-Fitr Grand Glow
                      </h3>
                      <p className="text-xs text-[#524342] mt-1">
                        Tiered discount algorithm: 15% off orders &gt;৳5,000 + free Banani express dispatch packaging.
                      </p>
                    </div>

                    <div className="flex items-center gap-2 mt-4 pt-2">
                      <button
                        onClick={() => showToast('Eid Grand Glow rule configuration modal opened')}
                        className="px-4 py-2 bg-[#84504c] text-white text-xs font-bold rounded-full hover:bg-[#c58882] transition-colors shadow-xs"
                      >
                        Configure Rule
                      </button>
                      <button
                        onClick={() => showToast('Previewing responsive banners on mobile & desktop')}
                        className="px-3 py-2 text-[#84504c] text-xs font-semibold hover:underline"
                      >
                        Preview Banners
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column (4 cols): Stock & Regional Distribution */}
              <div className="lg:col-span-4 space-y-6">
                {/* Stock & Batches */}
                <div className="p-6 rounded-2xl bg-[#fbf1f3] border border-[#d6c2c0]/30 shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="font-headline text-lg font-bold text-[#1f1a1c]">Stock &amp; Batches</h2>
                      <span className="text-[10px] text-[#524342]">Banani Central Warehouse</span>
                    </div>
                    <button
                      onClick={() => setIsBatchImportOpen(true)}
                      className="p-1.5 rounded-full bg-white text-[#1f1a1c] hover:bg-[#f6ebee]"
                    >
                      <span className="material-symbols-outlined text-base">tune</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    {/* Item 1 */}
                    <div className="p-3.5 rounded-xl bg-white border border-[#d6c2c0]/20 flex items-center justify-between gap-3 shadow-xs">
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={ASSETS.categorySkincare}
                          alt="Niacinamide serum"
                          className="w-12 h-12 rounded-lg object-cover shrink-0"
                        />
                        <div className="min-w-0">
                          <h4 className="text-xs font-bold text-[#1f1a1c] truncate">
                            Aura Dew Niacinamide Serum 30ml
                          </h4>
                          <span className="text-[10px] text-[#524342]">Reorder point: 25</span>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="px-2 py-0.5 rounded-full bg-[#ffdcbd] text-[#2c1600] text-[10px] font-bold block mb-1">
                          18 units
                        </span>
                        <span className="text-[10px] text-[#ba1a1a] font-medium">Low Stock</span>
                      </div>
                    </div>

                    {/* Item 2 */}
                    <div className="p-3.5 rounded-xl bg-white border border-[#d6c2c0]/20 flex items-center justify-between gap-3 shadow-xs">
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={ASSETS.categoryMakeup}
                          alt="Velvet Lip tint"
                          className="w-12 h-12 rounded-lg object-cover shrink-0"
                        />
                        <div className="min-w-0">
                          <h4 className="text-xs font-bold text-[#1f1a1c] truncate">
                            Velvet Matte Lip Tint - Jamdani
                          </h4>
                          <span className="text-[10px] text-[#524342]">Reorder point: 30</span>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="px-2 py-0.5 rounded-full bg-[#ffdad6] text-[#93000a] text-[10px] font-bold block mb-1">
                          9 units
                        </span>
                        <span className="text-[10px] text-[#ba1a1a] font-bold uppercase tracking-wider">
                          Critical
                        </span>
                      </div>
                    </div>

                    {/* Item 3 */}
                    <div className="p-3.5 rounded-xl bg-white border border-[#d6c2c0]/20 flex items-center justify-between gap-3 shadow-xs">
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={ASSETS.categorySunscreen}
                          alt="Sun shield gel"
                          className="w-12 h-12 rounded-lg object-cover shrink-0"
                        />
                        <div className="min-w-0">
                          <h4 className="text-xs font-bold text-[#1f1a1c] truncate">
                            Invisible Sun Shield Gel SPF 50+
                          </h4>
                          <span className="text-[10px] text-[#524342]">Reorder point: 50</span>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="px-2 py-0.5 rounded-full bg-[#d7e7d1] text-[#111f11] text-[10px] font-bold block mb-1">
                          142 units
                        </span>
                        <span className="text-[10px] text-[#536251] font-semibold">Healthy</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setIsBatchImportOpen(true)}
                    className="w-full py-2.5 rounded-full bg-white text-[#84504c] text-xs font-bold hover:bg-[#f6ebee] transition-colors flex items-center justify-center gap-1.5 border border-[#d6c2c0]/30 shadow-xs cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-base">inventory</span>
                    <span>View Full Inventory Batch Log</span>
                  </button>
                </div>

                {/* Regional Distribution */}
                <div className="p-6 rounded-2xl bg-[#fbf1f3] border border-[#d6c2c0]/30 shadow-xs space-y-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-headline text-base font-bold text-[#1f1a1c]">
                        Regional Distribution
                      </h3>
                      <span className="text-[10px] text-[#524342]">City-by-City Sales Volume</span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold text-[#536251] block">1.8% Return Rate</span>
                      <span className="text-[10px] text-[#524342]">Industry Top 5%</span>
                    </div>
                  </div>

                  {/* City Bars */}
                  <div className="space-y-3 text-xs">
                    <div>
                      <div className="flex justify-between mb-1 text-[#1f1a1c]">
                        <span className="font-semibold">Dhaka Metropolitan</span>
                        <span className="font-bold">64%</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-[#eae0e2] overflow-hidden">
                        <div className="h-full bg-[#c58882] rounded-full" style={{ width: '64%' }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between mb-1 text-[#1f1a1c]">
                        <span className="font-semibold">Chittagong Hub</span>
                        <span className="font-bold">18%</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-[#eae0e2] overflow-hidden">
                        <div className="h-full bg-[#f0bd8b] rounded-full" style={{ width: '18%' }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between mb-1 text-[#1f1a1c]">
                        <span className="font-semibold">Sylhet Division</span>
                        <span className="font-bold">9%</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-[#eae0e2] overflow-hidden">
                        <div className="h-full bg-[#8c9c88] rounded-full" style={{ width: '9%' }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between mb-1 text-[#1f1a1c]">
                        <span className="font-semibold">Rajshahi &amp; Rest of BD</span>
                        <span className="font-bold">9%</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-[#eae0e2] overflow-hidden">
                        <div className="h-full bg-[#d6c2c0] rounded-full" style={{ width: '9%' }}></div>
                      </div>
                    </div>
                  </div>

                  {/* Courier Handover Badge */}
                  <div className="p-3.5 rounded-xl bg-white border border-[#d6c2c0]/20 flex items-center gap-3">
                    <span className="p-2 rounded-full bg-[#d7e7d1] text-[#111f11]">
                      <span className="material-symbols-outlined text-lg fill">verified</span>
                    </span>
                    <div className="text-[11px]">
                      <span className="font-bold text-[#1f1a1c] block">98.2% Successful Handover</span>
                      <span className="text-[#524342]">
                        Direct OTP validation on Cash on Delivery parcels minimizes refusal.
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
