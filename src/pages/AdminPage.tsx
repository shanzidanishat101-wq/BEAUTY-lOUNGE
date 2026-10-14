import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { ASSETS } from '../data/mockData';
import { Order, Product } from '../types';
import { AdminLoginPage } from './AdminLoginPage';
import { ProductManageModal } from '../components/ProductManageModal';

type AdminTab = 'overview' | 'products' | 'tracking' | 'telemetry';

export const AdminPage: React.FC = () => {
  const {
    orders,
    products,
    updateOrderStatus,
    deleteProduct,
    updateProduct,
    setIsBatchImportOpen,
    setTrackingModalOrder,
    navigateTo,
    showToast,
    isAdminAuthenticated,
    adminUser,
    logoutAdmin,
    isDarkMode,
    toggleDarkMode,
    setQuickViewProduct,
  } = useStore();

  if (!isAdminAuthenticated) {
    return <AdminLoginPage />;
  }

  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [activeStatusTab, setActiveStatusTab] = useState<string>('All');
  const [searchFilter, setSearchFilter] = useState('');

  // Product management state
  const [productSearch, setProductSearch] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState('All');
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [selectedProductToEdit, setSelectedProductToEdit] = useState<Product | null>(null);

  // Digital telemetry switches
  const [flashSaleActive, setFlashSaleActive] = useState(false);
  const [systemUptime] = useState('99.98%');
  const [activeShoppers] = useState(248);

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

  const filteredProducts = products.filter((p) => {
    if (productCategoryFilter !== 'All' && p.category !== productCategoryFilter) return false;
    if (productSearch.trim()) {
      const q = productSearch.toLowerCase();
      return (
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        (p.subtitle && p.subtitle.toLowerCase().includes(q)) ||
        p.actives.some((a) => a.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const handlePackAndDispatch = (orderId: string) => {
    updateOrderStatus(orderId, 'Out for Delivery');
    showToast(`Order #${orderId} marked as Packed & Dispatched to Courier!`);
  };

  const handleOpenAddProduct = () => {
    setSelectedProductToEdit(null);
    setIsProductModalOpen(true);
  };

  const handleOpenEditProduct = (prod: Product) => {
    setSelectedProductToEdit(prod);
    setIsProductModalOpen(true);
  };

  const handleDeleteProduct = (prod: Product) => {
    if (window.confirm(`Are you sure you want to remove "${prod.name}" from catalog?`)) {
      deleteProduct(prod.id);
    }
  };

  const handleAdjustStock = (prod: Product, delta: number) => {
    const newStock = Math.max(0, prod.stockCount + delta);
    updateProduct(prod.id, {
      stockCount: newStock,
      inStock: newStock > 0,
    });
  };

  const handleExportData = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify({ products, orders }, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `lounge_os_manifest_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Exported Lounge OS Catalog & Orders manifest JSON!');
  };

  return (
    <div className={`w-full min-h-screen ${isDarkMode ? 'dark bg-[#12090c] text-[#fdebed]' : 'bg-[#fff2f4] text-[#1e1315]'}`}>
      <div className="flex flex-col lg:flex-row">
        {/* Admin Left Sidebar */}
        <aside className="w-full lg:w-64 bg-white/70 dark:bg-[#1a0f14] border-r border-[#e2b7bf]/40 dark:border-[#4a2834] p-6 flex flex-col justify-between shrink-0">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <img
                alt="Beauty Lounge Logo"
                className="h-8 w-auto object-contain cursor-pointer"
                src={ASSETS.logo}
                onClick={() => navigateTo('home')}
              />
              <div className="flex flex-col">
                <span className="font-headline text-lg text-[#9e3544] dark:text-[#f27284] font-bold leading-tight">
                  LOUNGE OS
                </span>
                <span className="text-[9px] tracking-widest text-[#593f44] dark:text-[#d6b4bd] uppercase font-bold">
                  Admin Portal
                </span>
              </div>
            </div>

            {/* Navigation Tabs */}
            <nav className="space-y-1.5">
              <button
                onClick={() => setActiveTab('overview')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'overview'
                    ? 'bg-[#9e3544] text-white shadow-sm'
                    : 'text-[#593f44] dark:text-[#d6b4bd] hover:bg-[#fde5e9] dark:hover:bg-[#28141c]'
                }`}
              >
                <span className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-base">dashboard</span>
                  <span>Orders &amp; Dispatch</span>
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-black/10 dark:bg-white/10">
                  {orders.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('products')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'products'
                    ? 'bg-[#9e3544] text-white shadow-sm'
                    : 'text-[#593f44] dark:text-[#d6b4bd] hover:bg-[#fde5e9] dark:hover:bg-[#28141c]'
                }`}
              >
                <span className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-base">inventory_2</span>
                  <span>Product Management</span>
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-black/10 dark:bg-white/10 font-bold">
                  {products.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('tracking')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'tracking'
                    ? 'bg-[#9e3544] text-white shadow-sm'
                    : 'text-[#593f44] dark:text-[#d6b4bd] hover:bg-[#fde5e9] dark:hover:bg-[#28141c]'
                }`}
              >
                <span className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-base">local_shipping</span>
                  <span>Parcel Tracking</span>
                </span>
                <span className="w-2 h-2 rounded-full bg-[#4d644d] animate-pulse"></span>
              </button>

              <button
                onClick={() => setActiveTab('telemetry')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'telemetry'
                    ? 'bg-[#9e3544] text-white shadow-sm'
                    : 'text-[#593f44] dark:text-[#d6b4bd] hover:bg-[#fde5e9] dark:hover:bg-[#28141c]'
                }`}
              >
                <span className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-base">terminal</span>
                  <span>Digital Telemetry</span>
                </span>
                <span className="text-[9px] font-mono text-[#4d644d] dark:text-[#83a083]">LIVE</span>
              </button>

              <button
                onClick={() => setIsBatchImportOpen(true)}
                className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-full text-xs font-semibold text-[#593f44] dark:text-[#d6b4bd] hover:bg-[#fde5e9] dark:hover:bg-[#28141c] transition-colors text-left cursor-pointer"
              >
                <span className="material-symbols-outlined text-base">upload_file</span>
                <span>Batch Consignment</span>
              </button>

              <button
                onClick={() => navigateTo('home')}
                className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-full text-xs font-semibold text-[#593f44] dark:text-[#d6b4bd] hover:bg-[#fde5e9] dark:hover:bg-[#28141c] transition-colors text-left cursor-pointer"
              >
                <span className="material-symbols-outlined text-base">storefront</span>
                <span>View Storefront</span>
              </button>
            </nav>
          </div>

          {/* User Profile & Theme Controls */}
          <div className="pt-6 border-t border-[#e2b7bf]/40 dark:border-[#4a2834] mt-8 space-y-3">
            {/* Dark Mode Quick Switch */}
            <button
              onClick={toggleDarkMode}
              className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#fff2f4] dark:bg-[#28141c] text-[#593f44] dark:text-[#d6b4bd] hover:bg-[#fde5e9] transition-colors cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <span className="material-symbols-outlined text-base">
                  {isDarkMode ? 'light_mode' : 'dark_mode'}
                </span>
                <span>Theme: {isDarkMode ? 'Dark Mode' : 'Light Mode'}</span>
              </span>
              <span className="text-[10px] font-bold uppercase">{isDarkMode ? 'Dark' : 'Light'}</span>
            </button>

            {/* Profile Pill */}
            <div className="p-3 bg-white dark:bg-[#28141c] rounded-2xl shadow-xs border border-[#e2b7bf]/30 dark:border-[#4a2834] flex items-center gap-3">
              <img
                alt="Profile"
                className="w-10 h-10 rounded-full object-cover ring-2 ring-[#9e3544]/40"
                src={adminUser?.avatarUrl || ASSETS.profileAvatar}
              />
              <div className="flex flex-col min-w-0 flex-1">
                <span className="text-xs font-bold truncate">
                  {adminUser?.name || 'Nusrat Jahan'}
                </span>
                <span className="text-[10px] text-[#593f44] dark:text-[#d6b4bd] truncate">
                  {adminUser?.role || 'Operations Lead'}
                </span>
                <span className="text-[9px] text-[#4d644d] dark:text-[#83a083] font-semibold flex items-center gap-1 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#4d644d] animate-pulse"></span>
                  <span>Banani HQ Node</span>
                </span>
              </div>
            </div>

            {/* Logout Button */}
            <button
              onClick={() => logoutAdmin()}
              className="w-full flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-full text-xs font-semibold bg-[#ffd8dc] text-[#3d000c] hover:bg-[#fca8b4] transition-colors cursor-pointer shadow-xs"
            >
              <span className="material-symbols-outlined text-base">logout</span>
              <span>Log Out (লগ আউট)</span>
            </button>
          </div>
        </aside>

        {/* Admin Main Body */}
        <div className="flex-1 min-w-0">
          {/* Top Operational Status Ribbon */}
          <div className="px-6 lg:px-10 py-3 bg-white/80 dark:bg-[#1a0f14]/80 backdrop-blur-md border-b border-[#e2b7bf]/40 dark:border-[#4a2834] flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="px-2.5 py-0.5 rounded-full bg-[#d3e7d3] dark:bg-[#1b2f1c] text-[#0e1e0f] dark:text-[#b5ceb5] text-[10px] font-bold">
                Bangladesh Live Node
              </span>
              <span className="text-xs font-mono text-[#593f44] dark:text-[#d6b4bd]">
                Latency: 14ms | TPS: 38 tx/sec | bKash Webhooks: Active
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={toggleDarkMode}
                className="p-1.5 rounded-full hover:bg-[#fff2f4] dark:hover:bg-[#28141c] text-[#593f44] dark:text-[#d6b4bd] transition-colors"
                title="Toggle Theme"
              >
                <span className="material-symbols-outlined text-lg">
                  {isDarkMode ? 'light_mode' : 'dark_mode'}
                </span>
              </button>

              <button
                onClick={handleExportData}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#fde5e9] dark:bg-[#28141c] text-[#9e3544] dark:text-[#f27284] text-xs font-semibold hover:bg-[#fad0d7] transition-colors cursor-pointer"
                title="Export Data"
              >
                <span className="material-symbols-outlined text-sm">download</span>
                <span>Export Manifest</span>
              </button>

              <button
                onClick={() => showToast('Steadfast, Pathao & RedX 64-District APIs responding in 18ms.')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#fff2f4] dark:bg-[#28141c] text-[#593f44] dark:text-[#d6b4bd] text-xs font-semibold"
              >
                <span className="material-symbols-outlined text-base">notifications</span>
                <span>Alerts (3)</span>
              </button>

              <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-[#e2b7bf]/40 dark:border-[#4a2834]">
                <img
                  alt="Profile"
                  className="w-7 h-7 rounded-full object-cover ring-2 ring-[#9e3544]/40"
                  src={adminUser?.avatarUrl || ASSETS.profileAvatar}
                />
                <span className="text-xs font-medium truncate max-w-[120px]">
                  {adminUser?.name?.split(' ')[0] || 'Admin'}
                </span>
              </div>

              <button
                onClick={() => logoutAdmin()}
                title="Log out"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#ffd8dc] text-[#3d000c] hover:bg-[#fca8b4] text-xs font-bold transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">logout</span>
                <span className="hidden sm:inline">Log Out</span>
              </button>
            </div>
          </div>

          {/* Sub-header Banner */}
          <div className="px-6 lg:px-10 py-5 bg-[#fff2f4]/60 dark:bg-[#150b0f] border-b border-[#e2b7bf]/30 dark:border-[#4a2834] flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase tracking-widest text-[#9e3544] dark:text-[#f27284] font-bold">
                  {activeTab === 'products'
                    ? 'Catalog & Inventory Management'
                    : activeTab === 'tracking'
                    ? 'Parcel Logistics & Telemetry'
                    : activeTab === 'telemetry'
                    ? 'Digital Terminal & Server Health'
                    : 'Operational Orders Dispatch'}
                </span>
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#4d644d]"></span>
                <span className="text-xs text-[#593f44] dark:text-[#d6b4bd]">
                  Dhaka Banani Master Node
                </span>
              </div>
              <h1 className="font-headline text-2xl font-bold mt-1">
                {activeTab === 'products'
                  ? 'Product Management & Inventory Controls'
                  : activeTab === 'tracking'
                  ? 'Real-Time Parcel Telemetry & Couriers'
                  : activeTab === 'telemetry'
                  ? 'Lounge OS Cloud Terminal'
                  : 'Operational Waybills & Delivery Queue'}
              </h1>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              {activeTab === 'products' ? (
                <button
                  onClick={handleOpenAddProduct}
                  className="px-4 py-2.5 rounded-full bg-[#9e3544] hover:bg-[#852c38] text-white text-xs font-bold flex items-center gap-2 shadow-md transition-all cursor-pointer"
                >
                  <span className="material-symbols-outlined text-base">add_circle</span>
                  <span>Add New Product (পণ্য যোগ করুন)</span>
                </button>
              ) : (
                <>
                  <button
                    onClick={() => handleOpenAddProduct()}
                    className="px-3.5 py-2 rounded-full border border-[#e2b7bf] dark:border-[#4a2834] text-xs font-semibold hover:bg-white dark:hover:bg-[#28141c] transition-colors"
                  >
                    + Quick Add Product
                  </button>
                  <button
                    onClick={() => setIsBatchImportOpen(true)}
                    className="px-4 py-2 rounded-full bg-[#9e3544] hover:bg-[#852c38] text-white text-xs font-bold flex items-center gap-2 shadow-sm transition-all"
                  >
                    <span className="material-symbols-outlined text-base">inventory_2</span>
                    <span>Import Batch Consignment</span>
                  </button>
                </>
              )}
            </div>
          </div>

          {/* TAB 1: PRODUCT MANAGEMENT MASTER */}
          {activeTab === 'products' && (
            <div className="p-6 lg:p-10 space-y-6">
              {/* Product Search & Filter Bar */}
              <div className="bg-white dark:bg-[#1e0f15] p-4 sm:p-5 rounded-2xl border border-[#e2b7bf]/50 dark:border-[#4a2834] shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex-1 w-full flex items-center bg-[#fff2f4] dark:bg-[#28141c] px-3.5 py-2.5 rounded-xl border border-transparent focus-within:border-[#9e3544]">
                  <span className="material-symbols-outlined text-[#8c6d73] dark:text-[#d6b4bd] text-sm mr-2">
                    search
                  </span>
                  <input
                    type="text"
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    placeholder="Search by product name, active ingredient, or category..."
                    className="w-full bg-transparent border-none outline-none text-xs sm:text-sm text-[#1e1315] dark:text-[#fdebed] placeholder:text-[#8c6d73]/70"
                  />
                  {productSearch && (
                    <button onClick={() => setProductSearch('')} className="text-xs text-[#8c6d73]">
                      Clear
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto no-scrollbar">
                  {['All', 'Skincare', 'Makeup', 'Sun Protection', 'Haircare', 'Fragrance'].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setProductCategoryFilter(cat)}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                        productCategoryFilter === cat
                          ? 'bg-[#9e3544] text-white'
                          : 'bg-[#fff2f4] dark:bg-[#28141c] text-[#593f44] dark:text-[#d6b4bd] hover:bg-[#fde5e9]'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Product Inventory Table */}
              <div className="bg-white dark:bg-[#1e0f15] rounded-3xl border border-[#e2b7bf]/50 dark:border-[#4a2834] shadow-sm overflow-hidden">
                <div className="p-5 border-b border-[#e2b7bf]/30 dark:border-[#4a2834] flex items-center justify-between">
                  <div>
                    <h3 className="font-headline text-lg font-bold">Catalog SKU Master Directory</h3>
                    <p className="text-xs text-[#593f44] dark:text-[#d6b4bd]">
                      Showing {filteredProducts.length} verified authentic items. Full edit and delete controls.
                    </p>
                  </div>
                  <span className="text-xs px-3 py-1 rounded-full bg-[#fde5e9] dark:bg-[#351a24] text-[#9e3544] dark:text-[#f27284] font-bold">
                    {filteredProducts.length} Products Active
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-[#fff2f4]/60 dark:bg-[#28141c]/60 text-[11px] uppercase tracking-wider text-[#8c6d73] dark:text-[#d6b4bd] border-b border-[#e2b7bf]/30 dark:border-[#4a2834]">
                        <th className="py-3 px-4">Product Details</th>
                        <th className="py-3 px-4">Category</th>
                        <th className="py-3 px-4">Price (BDT)</th>
                        <th className="py-3 px-4">Stock Level</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#e2b7bf]/20 dark:divide-[#4a2834] text-xs">
                      {filteredProducts.map((prod) => (
                        <tr key={prod.id} className="hover:bg-[#fff2f4]/40 dark:hover:bg-[#28141c]/40 transition-colors">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <img
                                alt={prod.name}
                                src={prod.imageUrl}
                                className="w-12 h-12 rounded-xl object-cover border border-[#e2b7bf]/40 dark:border-[#4a2834] bg-white shrink-0"
                              />
                              <div className="min-w-0 max-w-xs">
                                <p className="font-bold text-xs truncate">{prod.name}</p>
                                <p className="text-[11px] text-[#593f44] dark:text-[#d6b4bd] truncate">
                                  {prod.subtitle || prod.volumeOrSize || 'Standard Pack'}
                                </p>
                                {prod.badge && (
                                  <span className="inline-block mt-0.5 px-2 py-0.2 rounded text-[9px] font-bold bg-[#fde5e9] dark:bg-[#351a24] text-[#9e3544] dark:text-[#f27284]">
                                    {prod.badge}
                                  </span>
                                )}
                              </div>
                            </div>
                          </td>

                          <td className="py-3 px-4">
                            <span className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-[#fff2f4] dark:bg-[#28141c]">
                              {prod.category}
                            </span>
                          </td>

                          <td className="py-3 px-4">
                            <p className="font-bold text-[#9e3544] dark:text-[#f27284]">
                              ৳{prod.price.toLocaleString()}
                            </p>
                            {prod.originalPrice && (
                              <p className="text-[10px] text-[#8c6d73] line-through">
                                ৳{prod.originalPrice.toLocaleString()}
                              </p>
                            )}
                          </td>

                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleAdjustStock(prod, -1)}
                                className="w-6 h-6 rounded-md bg-[#fff2f4] dark:bg-[#28141c] hover:bg-[#fde5e9] flex items-center justify-center text-xs font-bold"
                              >
                                -
                              </button>
                              <span className="font-bold font-mono min-w-[20px] text-center">
                                {prod.stockCount}
                              </span>
                              <button
                                onClick={() => handleAdjustStock(prod, 1)}
                                className="w-6 h-6 rounded-md bg-[#fff2f4] dark:bg-[#28141c] hover:bg-[#fde5e9] flex items-center justify-center text-xs font-bold"
                              >
                                +
                              </button>
                            </div>
                          </td>

                          <td className="py-3 px-4">
                            {prod.stockCount <= 0 ? (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#ffd8dc] text-[#3d000c]">
                                Out of Stock
                              </span>
                            ) : prod.stockCount < 10 ? (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#ffdcbe] text-[#2e1500]">
                                Low Stock ({prod.stockCount})
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#d3e7d3] text-[#0e1e0f]">
                                In Stock
                              </span>
                            )}
                          </td>

                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {/* Preview Details */}
                              <button
                                onClick={() => setQuickViewProduct(prod)}
                                title="Quick Preview Details"
                                className="p-1.5 rounded-lg hover:bg-[#fff2f4] dark:hover:bg-[#28141c] text-[#593f44] dark:text-[#d6b4bd] transition-colors"
                              >
                                <span className="material-symbols-outlined text-base">visibility</span>
                              </button>

                              {/* Edit Button */}
                              <button
                                onClick={() => handleOpenEditProduct(prod)}
                                title="Edit Product Specs"
                                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#fde5e9] dark:bg-[#351a24] text-[#9e3544] dark:text-[#f27284] text-xs font-semibold hover:bg-[#fad0d7] transition-colors"
                              >
                                <span className="material-symbols-outlined text-sm">edit</span>
                                <span>Edit</span>
                              </button>

                              {/* Delete Button */}
                              <button
                                onClick={() => handleDeleteProduct(prod)}
                                title="Delete Product"
                                className="p-1.5 rounded-lg hover:bg-[#ffd8dc] text-[#ba1a1a] transition-colors"
                              >
                                <span className="material-symbols-outlined text-base">delete</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: OVERVIEW & LIVE ORDERS QUEUE */}
          {activeTab === 'overview' && (
            <div className="p-6 lg:p-10 space-y-8">
              {/* Top Digital KPI Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-[#1e0f15] p-5 rounded-3xl border border-[#e2b7bf]/50 dark:border-[#4a2834] shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[#593f44] dark:text-[#d6b4bd] font-medium">Daily Gross Sales</span>
                    <span className="p-2 rounded-xl bg-[#d3e7d3] dark:bg-[#1b2f1c] text-[#0e1e0f] dark:text-[#b5ceb5] material-symbols-outlined text-base">
                      trending_up
                    </span>
                  </div>
                  <p className="font-headline text-2xl font-bold mt-2">৳1,84,350</p>
                  <p className="text-[10px] text-[#4d644d] dark:text-[#83a083] font-semibold mt-1">
                    +18.4% vs yesterday • bKash 68%
                  </p>
                </div>

                <div className="bg-white dark:bg-[#1e0f15] p-5 rounded-3xl border border-[#e2b7bf]/50 dark:border-[#4a2834] shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[#593f44] dark:text-[#d6b4bd] font-medium">Pending Dispatches</span>
                    <span className="p-2 rounded-xl bg-[#ffdcbe] dark:bg-[#382010] text-[#2e1500] dark:text-[#fbc698] material-symbols-outlined text-base">
                      local_shipping
                    </span>
                  </div>
                  <p className="font-headline text-2xl font-bold mt-2">
                    {orders.filter((o) => o.status !== 'Delivered').length} Parcels
                  </p>
                  <p className="text-[10px] text-[#8c5324] dark:text-[#fbc698] font-semibold mt-1">
                    Same-day cut off: 04:00 PM
                  </p>
                </div>

                <div className="bg-white dark:bg-[#1e0f15] p-5 rounded-3xl border border-[#e2b7bf]/50 dark:border-[#4a2834] shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[#593f44] dark:text-[#d6b4bd] font-medium">Live Shoppers</span>
                    <span className="p-2 rounded-xl bg-[#fde5e9] dark:bg-[#351a24] text-[#9e3544] dark:text-[#f27284] material-symbols-outlined text-base">
                      person
                    </span>
                  </div>
                  <p className="font-headline text-2xl font-bold mt-2">{activeShoppers} Online</p>
                  <p className="text-[10px] text-[#4d644d] dark:text-[#83a083] font-semibold mt-1">
                    Dhaka 71% • Chittagong 19%
                  </p>
                </div>

                <div className="bg-white dark:bg-[#1e0f15] p-5 rounded-3xl border border-[#e2b7bf]/50 dark:border-[#4a2834] shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[#593f44] dark:text-[#d6b4bd] font-medium">Active Inventory SKUs</span>
                    <span className="p-2 rounded-xl bg-[#fff2f4] dark:bg-[#28141c] text-[#9e3544] dark:text-[#f27284] material-symbols-outlined text-base">
                      inventory
                    </span>
                  </div>
                  <p className="font-headline text-2xl font-bold mt-2">{products.length} Items</p>
                  <p className="text-[10px] text-[#593f44] dark:text-[#d6b4bd] mt-1">
                    BSTI Certified • 100% Authentic
                  </p>
                </div>
              </div>

              {/* Order Status Tabs & Search */}
              <div className="bg-white dark:bg-[#1e0f15] p-5 rounded-3xl border border-[#e2b7bf]/50 dark:border-[#4a2834] shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
                    {['All', 'New', 'Processing', 'Shipped', 'Delivered'].map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveStatusTab(tab)}
                        className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                          activeStatusTab === tab
                            ? 'bg-[#9e3544] text-white'
                            : 'bg-[#fff2f4] dark:bg-[#28141c] text-[#593f44] dark:text-[#d6b4bd] hover:bg-[#fde5e9]'
                        }`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center bg-[#fff2f4] dark:bg-[#28141c] px-3.5 py-2 rounded-full w-full sm:w-72">
                    <span className="material-symbols-outlined text-[#8c6d73] dark:text-[#d6b4bd] text-sm mr-2">
                      search
                    </span>
                    <input
                      type="text"
                      value={searchFilter}
                      onChange={(e) => setSearchFilter(e.target.value)}
                      placeholder="Search Order ID, Phone or Rider..."
                      className="w-full bg-transparent border-none outline-none text-xs text-[#1e1315] dark:text-[#fdebed]"
                    />
                  </div>
                </div>

                {/* Orders List Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-[#fff2f4]/60 dark:bg-[#28141c]/60 text-[11px] uppercase tracking-wider text-[#8c6d73] dark:text-[#d6b4bd] border-b border-[#e2b7bf]/30 dark:border-[#4a2834]">
                        <th className="py-3 px-4">Order / Customer</th>
                        <th className="py-3 px-4">Items</th>
                        <th className="py-3 px-4">Payment</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4">Courier Waybill</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#e2b7bf]/20 dark:divide-[#4a2834] text-xs">
                      {filteredOrders.map((order) => (
                        <tr key={order.id} className="hover:bg-[#fff2f4]/40 dark:hover:bg-[#28141c]/40 transition-colors">
                          <td className="py-3 px-4">
                            <p className="font-bold">#{order.id}</p>
                            <p className="text-[11px] text-[#593f44] dark:text-[#d6b4bd]">{order.customerName}</p>
                            <p className="text-[10px] text-[#8c6d73]">{order.customerPhone} • {order.location}</p>
                          </td>

                          <td className="py-3 px-4">
                            <p className="font-semibold">{order.items.length} items</p>
                            <p className="text-[10px] text-[#593f44] dark:text-[#d6b4bd] truncate max-w-xs">
                              {order.items.map((i) => i.name).join(', ')}
                            </p>
                          </td>

                          <td className="py-3 px-4">
                            <p className="font-bold text-[#9e3544] dark:text-[#f27284]">৳{order.total.toLocaleString()}</p>
                            <span className="uppercase text-[10px] font-semibold text-[#8c6d73]">
                              {order.paymentMethod} ({order.paymentStatus})
                            </span>
                          </td>

                          <td className="py-3 px-4">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                              order.status === 'Delivered'
                                ? 'bg-[#d3e7d3] text-[#0e1e0f]'
                                : order.status === 'Out for Delivery'
                                ? 'bg-[#ffdcbe] text-[#2e1500]'
                                : 'bg-[#fff2f4] dark:bg-[#28141c] text-[#9e3544] dark:text-[#f27284]'
                            }`}>
                              {order.status}
                            </span>
                          </td>

                          <td className="py-3 px-4">
                            <p className="font-mono font-semibold text-xs">{order.courierTrackingId}</p>
                            <p className="text-[10px] text-[#593f44] dark:text-[#d6b4bd]">{order.courier}</p>
                          </td>

                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              {order.status === 'Processing' && (
                                <button
                                  onClick={() => handlePackAndDispatch(order.id)}
                                  className="px-2.5 py-1 rounded-full bg-[#9e3544] text-white text-xs font-semibold hover:bg-[#852c38] transition-colors cursor-pointer"
                                >
                                  Pack &amp; Dispatch
                                </button>
                              )}
                              <button
                                onClick={() => setTrackingModalOrder(order)}
                                className="p-1.5 rounded-lg hover:bg-[#fff2f4] dark:hover:bg-[#28141c] text-[#593f44] dark:text-[#d6b4bd]"
                                title="Live Route Map"
                              >
                                <span className="material-symbols-outlined text-base">map</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: PARCEL TRACKING CONSOLE */}
          {activeTab === 'tracking' && (
            <div className="p-6 lg:p-10 space-y-6">
              <div className="bg-white dark:bg-[#1e0f15] p-6 rounded-3xl border border-[#e2b7bf]/50 dark:border-[#4a2834] shadow-sm space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="font-headline text-lg font-bold">Courier Dispatch &amp; Fleet Telemetry</h3>
                    <p className="text-xs text-[#593f44] dark:text-[#d6b4bd]">
                      Live tracking across Dhaka Metro, Chittagong, Sylhet &amp; all 64 districts.
                    </p>
                  </div>
                  <button
                    onClick={() => navigateTo('tracking')}
                    className="px-4 py-2 rounded-full bg-[#9e3544] text-white text-xs font-bold flex items-center gap-1.5"
                  >
                    <span>Open Customer Tracking View</span>
                    <span className="material-symbols-outlined text-xs">arrow_forward</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-2xl bg-[#fff2f4] dark:bg-[#28141c] border border-[#e2b7bf]/40 dark:border-[#4a2834] space-y-1">
                    <p className="text-xs text-[#8c6d73] dark:text-[#d6b4bd]">Steadfast Express SLA</p>
                    <p className="font-headline text-xl font-bold text-[#4d644d] dark:text-[#83a083]">98.6%</p>
                    <p className="text-[10px] text-[#593f44] dark:text-[#d6b4bd]">42 active parcels in Dhaka</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#fff2f4] dark:bg-[#28141c] border border-[#e2b7bf]/40 dark:border-[#4a2834] space-y-1">
                    <p className="text-xs text-[#8c6d73] dark:text-[#d6b4bd]">Pathao Metro Fleet</p>
                    <p className="font-headline text-xl font-bold text-[#4d644d] dark:text-[#83a083]">97.8%</p>
                    <p className="text-[10px] text-[#593f44] dark:text-[#d6b4bd]">Avg delivery time: 3.2 hrs</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#fff2f4] dark:bg-[#28141c] border border-[#e2b7bf]/40 dark:border-[#4a2834] space-y-1">
                    <p className="text-xs text-[#8c6d73] dark:text-[#d6b4bd]">RedX 64-Districts Hub</p>
                    <p className="font-headline text-xl font-bold text-[#4d644d] dark:text-[#83a083]">96.4%</p>
                    <p className="text-[10px] text-[#593f44] dark:text-[#d6b4bd]">Zero transit temperature breaches</p>
                  </div>
                </div>

                {/* Orders tracking quick list */}
                <div className="space-y-3 pt-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#8c6d73] dark:text-[#d6b4bd]">
                    Live Dispatched Parcels En Route
                  </h4>
                  <div className="divide-y divide-[#e2b7bf]/20 dark:divide-[#4a2834]">
                    {orders.map((ord) => (
                      <div key={ord.id} className="py-3 flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <p className="font-bold text-xs">
                            Order #{ord.id} • {ord.customerName}
                          </p>
                          <p className="text-[11px] text-[#593f44] dark:text-[#d6b4bd]">
                            Tracking ID: <span className="font-mono text-[#9e3544] dark:text-[#f27284] font-semibold">{ord.courierTrackingId}</span> ({ord.courier})
                          </p>
                          <p className="text-[10px] text-[#8c6d73]">Destination: {ord.location}</p>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setTrackingModalOrder(ord)}
                            className="px-3 py-1 rounded-full bg-[#fde5e9] dark:bg-[#351a24] text-[#9e3544] dark:text-[#f27284] text-xs font-bold flex items-center gap-1 hover:bg-[#fad0d7] transition-colors"
                          >
                            <span className="material-symbols-outlined text-sm">map</span>
                            <span>Live Map</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: DIGITAL TELEMETRY & SYSTEM TERMINAL */}
          {activeTab === 'telemetry' && (
            <div className="p-6 lg:p-10 space-y-6">
              <div className="bg-white dark:bg-[#1e0f15] p-6 rounded-3xl border border-[#e2b7bf]/50 dark:border-[#4a2834] shadow-sm space-y-6">
                <div>
                  <h3 className="font-headline text-lg font-bold">Lounge OS Cloud Terminal &amp; Server Health</h3>
                  <p className="text-xs text-[#593f44] dark:text-[#d6b4bd]">
                    Direct operational telemetry from the Banani, Dhaka server node.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="p-4 rounded-2xl bg-[#12090c] text-white font-mono text-xs space-y-1">
                    <p className="text-[#8c6d73]">SERVER_NODE</p>
                    <p className="text-[#f27284] font-bold">DHAKA-GULSHAN-01</p>
                    <p className="text-[10px] text-[#d3e7d3]">ONLINE • 14ms</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#12090c] text-white font-mono text-xs space-y-1">
                    <p className="text-[#8c6d73]">UPTIME_SLA</p>
                    <p className="text-[#d3e7d3] font-bold">{systemUptime}</p>
                    <p className="text-[10px] text-[#8c6d73]">0 drops last 30d</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#12090c] text-white font-mono text-xs space-y-1">
                    <p className="text-[#8c6d73]">PAYMENT_WEBHOOKS</p>
                    <p className="text-[#fbc698] font-bold">bKash / Nagad 2.0</p>
                    <p className="text-[10px] text-[#d3e7d3]">Instant sync verified</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#12090c] text-white font-mono text-xs space-y-1">
                    <p className="text-[#8c6d73]">DATA_INTEGRITY</p>
                    <p className="text-[#f27284] font-bold">256-Bit SSL SHA</p>
                    <p className="text-[10px] text-[#d3e7d3]">BSTI Compliance Seal</p>
                  </div>
                </div>

                {/* Promotional Flash Switch */}
                <div className="p-4 rounded-2xl bg-[#fff2f4] dark:bg-[#28141c] border border-[#e2b7bf]/40 dark:border-[#4a2834] flex items-center justify-between gap-4">
                  <div>
                    <h4 className="text-xs font-bold">Automated Eid / Ramadan Flash Sale Engine</h4>
                    <p className="text-[11px] text-[#593f44] dark:text-[#d6b4bd]">
                      When activated, injects dynamic 15% discount code voucher across all customer checkouts.
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      setFlashSaleActive(!flashSaleActive);
                      showToast(flashSaleActive ? 'Flash Sale deactivated' : 'Flash Sale Activated: Voucher DHAKAGLOW boosted!');
                    }}
                    className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                      flashSaleActive
                        ? 'bg-[#4d644d] text-white shadow-sm'
                        : 'bg-[#9e3544] text-white'
                    }`}
                  >
                    {flashSaleActive ? 'Flash Sale [ON]' : 'Activate Flash Sale'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Product Add & Edit Modal */}
      <ProductManageModal
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        productToEdit={selectedProductToEdit}
      />
    </div>
  );
};
