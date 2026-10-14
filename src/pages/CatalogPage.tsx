import React, { useState, useMemo } from 'react';
import { useStore } from '../context/StoreContext';
import { Product } from '../types';

export const CatalogPage: React.FC = () => {
  const {
    products,
    addToCart,
    toggleWishlist,
    isInWishlist,
    setQuickViewProduct,
    searchQuery,
    setSearchQuery,
    activeCategory,
    setActiveCategory,
    navigateTo,
    showToast,
  } = useStore();

  // Sidebar filters
  const [selectedCategory, setSelectedCategory] = useState<string>(
    activeCategory === 'All' ? 'All' : activeCategory
  );
  const [priceMin, setPriceMin] = useState<number>(500);
  const [priceMax, setPriceMax] = useState<number>(2500);
  const [selectedSkinTypes, setSelectedSkinTypes] = useState<string[]>(['Oily / Acne-prone']);
  const [selectedActives, setSelectedActives] = useState<string[]>(['Niacinamide']);
  const [selectedFinish, setSelectedFinish] = useState<string | null>(null);
  const [inStockOnly, setInStockOnly] = useState<boolean>(true);
  const [codOnly, setCodOnly] = useState<boolean>(true);
  const [dhakaExpress, setDhakaExpress] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<string>('bestselling');
  const [currentPageNum, setCurrentPageNum] = useState<number>(1);

  // Active filter chip remove handler
  const handleRemoveChip = (type: string) => {
    if (type === 'category') setSelectedCategory('All');
    if (type === 'price') setPriceMax(5000);
    if (type === 'spf') setSelectedActives((prev) => prev.filter((a) => a !== 'SPF 50+'));
    if (type === 'cod') setCodOnly(false);
  };

  const handleResetFilters = () => {
    setSelectedCategory('All');
    setPriceMin(500);
    setPriceMax(5000);
    setSelectedSkinTypes([]);
    setSelectedActives([]);
    setSelectedFinish(null);
    setInStockOnly(false);
    setCodOnly(false);
    setDhakaExpress(false);
    setSearchQuery('');
    showToast('Filters reset to default view');
  };

  // Filter products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Category filter
      if (selectedCategory !== 'All' && selectedCategory !== 'Offers') {
        if (p.category !== selectedCategory) return false;
      }
      if (selectedCategory === 'Offers' && !p.originalPrice) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = p.name.toLowerCase().includes(query);
        const matchesCat = p.category.toLowerCase().includes(query);
        const matchesActives = p.actives.some((a) => a.toLowerCase().includes(query));
        if (!matchesName && !matchesCat && !matchesActives) return false;
      }

      // Price filter
      if (p.price < priceMin || p.price > priceMax) return false;

      // Skin type
      if (selectedSkinTypes.length > 0) {
        const hasMatch = selectedSkinTypes.some((st) => p.targetSkinTypes.includes(st));
        if (!hasMatch) return false;
      }

      // Actives
      if (selectedActives.length > 0) {
        const hasActive = selectedActives.some((act) =>
          p.actives.some((a) => a.toLowerCase().includes(act.toLowerCase()))
        );
        if (!hasActive) return false;
      }

      // Finish
      if (selectedFinish && p.finish !== selectedFinish) {
        return false;
      }

      // In stock
      if (inStockOnly && !p.inStock) return false;

      return true;
    });
  }, [
    products,
    selectedCategory,
    searchQuery,
    priceMin,
    priceMax,
    selectedSkinTypes,
    selectedActives,
    selectedFinish,
    inStockOnly,
  ]);

  // Sort products
  const sortedProducts = useMemo(() => {
    const list = [...filteredProducts];
    if (sortBy === 'price-low') {
      return list.sort((a, b) => a.price - b.price);
    }
    if (sortBy === 'price-high') {
      return list.sort((a, b) => b.price - a.price);
    }
    if (sortBy === 'rating') {
      return list.sort((a, b) => b.rating - a.rating);
    }
    // Default: bestselling
    return list;
  }, [filteredProducts, sortBy]);

  const toggleSkinType = (type: string) => {
    setSelectedSkinTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const toggleActive = (act: string) => {
    setSelectedActives((prev) =>
      prev.includes(act) ? prev.filter((a) => a !== act) : [...prev, act]
    );
  };

  return (
    <div className="w-full bg-[#fff8f8] min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 space-y-6">
        {/* Breadcrumb Header */}
        <div className="flex items-center gap-2 text-xs text-[#524342]">
          <button onClick={() => navigateTo('home')} className="hover:text-[#84504c] flex items-center gap-1">
            <span className="material-symbols-outlined text-sm">home</span>
            <span>Home</span>
          </button>
          <span>/</span>
          <span className="font-medium text-[#1f1a1c]">Shop Catalog</span>
          <span>/</span>
          <span className="text-[#84504c] font-semibold">Skincare &amp; Makeup</span>
        </div>

        {/* Title & Badges */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-[#f6ebee] text-[#84504c] text-xs font-bold uppercase tracking-wider">
              Curated Edit
            </span>
            <span className="px-3 py-1 rounded-full bg-[#d7e7d1] text-[#111f11] text-xs font-bold uppercase tracking-wider flex items-center gap-1">
              <span className="material-symbols-outlined text-xs fill">verified</span>
              Dhaka QC Tested
            </span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="font-headline text-3xl sm:text-4xl text-[#1f1a1c] font-bold tracking-tight">
                All Beauty Collections
              </h1>
              <p className="text-xs sm:text-sm text-[#524342] mt-1 max-w-2xl leading-relaxed">
                Showing{' '}
                <strong className="text-[#1f1a1c] font-bold">84 authentic luxury</strong>{' '}
                skincare, makeup, and hair care formulations tailored for the Bangladeshi climate in BDT (৳).
              </p>
            </div>

            {/* Sort selector */}
            <div className="flex items-center gap-2 self-start md:self-auto">
              <span className="text-xs text-[#524342] flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">tune</span>
                Sort By:
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-white border border-[#d6c2c0]/40 rounded-full px-4 py-1.5 text-xs font-semibold text-[#1f1a1c] shadow-xs outline-none focus:ring-2 focus:ring-[#c58882]"
              >
                <option value="bestselling">Best Selling in Dhaka</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Top Customer Rating</option>
              </select>
            </div>
          </div>
        </div>

        {/* Active Filters Bar */}
        <div className="flex flex-wrap items-center gap-2 pt-2 pb-1">
          <span className="text-xs uppercase tracking-wider text-[#524342] font-bold mr-1">
            Active Filters:
          </span>
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#f6ebee] text-xs font-medium text-[#1f1a1c]">
            <span>Skincare</span>
            <button onClick={() => handleRemoveChip('category')} className="hover:text-[#84504c]">
              <span className="material-symbols-outlined text-xs">close</span>
            </button>
          </span>
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#f6ebee] text-xs font-medium text-[#1f1a1c]">
            <span>Under ৳2,500</span>
            <button onClick={() => handleRemoveChip('price')} className="hover:text-[#84504c]">
              <span className="material-symbols-outlined text-xs">close</span>
            </button>
          </span>
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#f6ebee] text-xs font-medium text-[#1f1a1c]">
            <span>SPF 50+</span>
            <button onClick={() => handleRemoveChip('spf')} className="hover:text-[#84504c]">
              <span className="material-symbols-outlined text-xs">close</span>
            </button>
          </span>
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#d7e7d1] text-xs font-medium text-[#111f11]">
            <span>Cash on Delivery</span>
            <button onClick={() => handleRemoveChip('cod')} className="hover:text-[#84504c]">
              <span className="material-symbols-outlined text-xs">close</span>
            </button>
          </span>
          <button
            onClick={handleResetFilters}
            className="text-xs text-[#84504c] underline hover:text-[#c58882] font-semibold ml-2"
          >
            Clear All
          </button>
        </div>

        {/* 2-Column Grid: Sidebar + Catalog Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-2">
          {/* LEFT SIDEBAR: Refine Shelf */}
          <aside className="lg:col-span-3 space-y-6">
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#d6c2c0]/30 space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-[#d6c2c0]/20">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-base text-[#84504c]">tune</span>
                  <h3 className="font-headline text-base font-bold text-[#1f1a1c]">Refine Shelf</h3>
                </div>
                <button
                  onClick={handleResetFilters}
                  className="text-[10px] uppercase font-bold text-[#847371] hover:text-[#84504c]"
                >
                  RESET
                </button>
              </div>

              {/* Category Filter */}
              <div className="space-y-2.5">
                <span className="text-xs font-bold text-[#1f1a1c] uppercase tracking-wider block">
                  Categories
                </span>
                <div className="space-y-1.5 text-xs text-[#524342]">
                  {[
                    { name: 'All', count: 84 },
                    { name: 'Skincare', count: 38 },
                    { name: 'Makeup', count: 24 },
                    { name: 'Sun Protection', count: 14 },
                    { name: 'Haircare', count: 12 },
                    { name: 'Fragrance', count: 8 },
                  ].map((cat) => (
                    <button
                      key={cat.name}
                      onClick={() => setSelectedCategory(cat.name)}
                      className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg transition-colors ${
                        selectedCategory === cat.name
                          ? 'bg-[#f6ebee] text-[#84504c] font-bold'
                          : 'hover:bg-[#fbf1f3]'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            selectedCategory === cat.name ? 'bg-[#84504c]' : 'bg-[#d6c2c0]'
                          }`}
                        ></span>
                        <span>{cat.name}</span>
                      </span>
                      <span className="text-[11px] text-[#847371]">{cat.count}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range Slider */}
              <div className="space-y-3 pt-3 border-t border-[#d6c2c0]/20">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#1f1a1c] uppercase tracking-wider">
                    Price Range
                  </span>
                  <span className="text-[10px] text-[#7d562d] font-bold">BDT (৳)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-[#fbf1f3] px-3 py-1.5 rounded-lg text-xs flex items-center">
                    <span className="text-[#847371] mr-1">৳</span>
                    <input
                      type="number"
                      value={priceMin}
                      onChange={(e) => setPriceMin(Number(e.target.value))}
                      className="w-full bg-transparent outline-none font-semibold text-[#1f1a1c]"
                    />
                  </div>
                  <span className="text-xs text-[#847371]">to</span>
                  <div className="flex-1 bg-[#fbf1f3] px-3 py-1.5 rounded-lg text-xs flex items-center">
                    <span className="text-[#847371] mr-1">৳</span>
                    <input
                      type="number"
                      value={priceMax}
                      onChange={(e) => setPriceMax(Number(e.target.value))}
                      className="w-full bg-transparent outline-none font-semibold text-[#1f1a1c]"
                    />
                  </div>
                </div>
                <input
                  type="range"
                  min="500"
                  max="4500"
                  step="100"
                  value={priceMax}
                  onChange={(e) => setPriceMax(Number(e.target.value))}
                  className="w-full accent-[#84504c] cursor-pointer"
                />
              </div>

              {/* Target Skin Type */}
              <div className="space-y-2.5 pt-3 border-t border-[#d6c2c0]/20">
                <span className="text-xs font-bold text-[#1f1a1c] uppercase tracking-wider block">
                  Target Skin Type
                </span>
                <div className="space-y-2 text-xs text-[#524342]">
                  {[
                    { label: 'Oily / Acne-prone', count: 28 },
                    { label: 'Combination', count: 22 },
                    { label: 'Normal', count: 19 },
                    { label: 'Dry & Dehydrated', count: 15 },
                    { label: 'Sensitive', count: 12 },
                  ].map((st) => (
                    <label key={st.label} className="flex items-center justify-between cursor-pointer">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={selectedSkinTypes.includes(st.label)}
                          onChange={() => toggleSkinType(st.label)}
                          className="w-3.5 h-3.5 rounded accent-[#84504c] cursor-pointer"
                        />
                        <span>{st.label}</span>
                      </div>
                      <span className="text-[11px] text-[#847371]">{st.count}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Actives & Key Ingredients */}
              <div className="space-y-2.5 pt-3 border-t border-[#d6c2c0]/20">
                <span className="text-xs font-bold text-[#1f1a1c] uppercase tracking-wider block">
                  Actives &amp; Key Ingredients
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    'Niacinamide',
                    'Hyaluronic Acid',
                    'Centella Asiatica',
                    'Vitamin C',
                    'Salicylic Acid',
                    'Retinol 0.2%',
                  ].map((act) => {
                    const isSelected = selectedActives.includes(act);
                    return (
                      <button
                        key={act}
                        onClick={() => toggleActive(act)}
                        className={`px-2.5 py-1 rounded-full text-[11px] transition-colors ${
                          isSelected
                            ? 'bg-[#84504c] text-white font-semibold'
                            : 'bg-[#f6ebee] text-[#524342] hover:bg-[#eae0e2]'
                        }`}
                      >
                        {act}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Finish & Texture */}
              <div className="space-y-2.5 pt-3 border-t border-[#d6c2c0]/20">
                <span className="text-xs font-bold text-[#1f1a1c] uppercase tracking-wider block">
                  Finish &amp; Texture
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {['Dewy Glow', 'Matte Velvet', 'Semi-Matte', 'Sheer Tint', 'Full Flawless Coverage'].map(
                    (fin) => (
                      <button
                        key={fin}
                        onClick={() => setSelectedFinish(selectedFinish === fin ? null : fin)}
                        className={`px-2.5 py-1 rounded-full text-[11px] transition-colors ${
                          selectedFinish === fin
                            ? 'bg-[#7d562d] text-white font-semibold'
                            : 'bg-[#f6ebee] text-[#524342] hover:bg-[#eae0e2]'
                        }`}
                      >
                        {fin}
                      </button>
                    )
                  )}
                </div>
              </div>

              {/* Stock & Logistics */}
              <div className="space-y-2.5 pt-3 border-t border-[#d6c2c0]/20">
                <span className="text-xs font-bold text-[#1f1a1c] uppercase tracking-wider block">
                  Stock &amp; Logistics
                </span>
                <div className="space-y-2 text-xs text-[#524342]">
                  <label className="flex items-center justify-between cursor-pointer">
                    <span>In Stock (Dhaka Hub)</span>
                    <input
                      type="checkbox"
                      checked={inStockOnly}
                      onChange={(e) => setInStockOnly(e.target.checked)}
                      className="w-3.5 h-3.5 accent-[#84504c]"
                    />
                  </label>
                  <label className="flex items-center justify-between cursor-pointer">
                    <span>On Eid Sale Only</span>
                    <input
                      type="checkbox"
                      onChange={(e) => {
                        if (e.target.checked) setSelectedCategory('Offers');
                        else setSelectedCategory('All');
                      }}
                      className="w-3.5 h-3.5 accent-[#84504c]"
                    />
                  </label>
                  <label className="flex items-center justify-between cursor-pointer">
                    <div>
                      <span>Cash on Delivery</span>
                      <p className="text-[10px] text-[#847371]">Across 64 Districts</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={codOnly}
                      onChange={(e) => setCodOnly(e.target.checked)}
                      className="w-3.5 h-3.5 accent-[#84504c]"
                    />
                  </label>
                  <label className="flex items-center justify-between cursor-pointer">
                    <div>
                      <span>Dhaka 24h Express</span>
                      <p className="text-[10px] text-[#847371]">Banani, Gulshan, Dhanmondi</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={dhakaExpress}
                      onChange={(e) => setDhakaExpress(e.target.checked)}
                      className="w-3.5 h-3.5 accent-[#84504c]"
                    />
                  </label>
                </div>
              </div>

              {/* Need Skin Guidance Help Card */}
              <div className="p-4 rounded-xl bg-[#fbf1f3] space-y-2 text-xs border border-[#d6c2c0]/30">
                <div className="flex items-center gap-1.5 text-[#84504c] font-bold">
                  <span className="material-symbols-outlined text-sm">support_agent</span>
                  <span>Need Skin Guidance?</span>
                </div>
                <p className="text-[#524342] text-[11px] leading-relaxed">
                  Our Dhaka dermatological advisor is online to assess your regimen.
                </p>
                <a
                  href="https://wa.me/8801700232889"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#84504c] font-bold flex items-center gap-1 hover:underline text-[11px] pt-1"
                >
                  <span>WhatsApp Skin Concierge</span>
                  <span className="material-symbols-outlined text-xs">arrow_forward</span>
                </a>
              </div>
            </div>
          </aside>

          {/* RIGHT CATALOG: Products Grid */}
          <main className="lg:col-span-9 space-y-6">
            {/* Import Guarantee Ribbon */}
            <div className="p-4 rounded-2xl bg-white shadow-xs border border-[#d6c2c0]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#f6ebee] text-[#84504c] flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-base">verified</span>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#1f1a1c]">100% Authentic Import Guarantee</h4>
                  <p className="text-[11px] text-[#524342]">
                    Direct batch imports with verified customs clearing certificates for BD consumers.
                  </p>
                </div>
              </div>
              <button
                onClick={() => showToast('Customs certificate validated: BANGLADESH-IMP-2024-V9')}
                className="text-xs font-semibold text-[#84504c] hover:underline whitespace-nowrap self-start sm:self-auto"
              >
                View Seals
              </button>
            </div>

            {/* Products Grid: 8 Products matching Image 1 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
              {sortedProducts.map((product) => {
                const isLiked = isInWishlist(product.id);

                return (
                  <div
                    key={product.id}
                    className="group relative rounded-2xl bg-white p-3.5 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between border border-[#d6c2c0]/25"
                  >
                    <div>
                      {/* Media */}
                      <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-[#fbf1f3] mb-3">
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />

                        {/* Badges */}
                        <div className="absolute top-2 left-2 flex flex-col gap-1 items-start">
                          {product.badge && (
                            <span className="px-2 py-0.5 rounded-full bg-[#84504c] text-white text-[9px] font-bold uppercase tracking-wider">
                              {product.badge}
                            </span>
                          )}
                          {product.subBadge && (
                            <span className="px-2 py-0.5 rounded-full bg-[#d7e7d1] text-[#111f11] text-[9px]">
                              {product.subBadge}
                            </span>
                          )}
                        </div>

                        {/* Top Action Icons */}
                        <div className="absolute top-2 right-2 flex flex-col gap-1">
                          <button
                            onClick={() => toggleWishlist(product.id)}
                            className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm text-[#524342] hover:text-[#84504c] flex items-center justify-center transition-colors shadow-sm"
                            aria-label="Wishlist toggle"
                          >
                            <span className={`material-symbols-outlined text-base ${isLiked ? 'text-[#84504c] fill' : ''}`}>
                              favorite
                            </span>
                          </button>
                          <button
                            onClick={() => setQuickViewProduct(product)}
                            className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm text-[#524342] hover:text-[#84504c] flex items-center justify-center transition-colors shadow-sm"
                            aria-label="Quick view"
                          >
                            <span className="material-symbols-outlined text-sm">visibility</span>
                          </button>
                        </div>
                      </div>

                      {/* Meta */}
                      <div className="flex items-center justify-between text-[10px] text-[#524342] mb-1">
                        <span className="uppercase font-bold tracking-wider text-[#7d562d]">
                          {product.category}
                        </span>
                        <div className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-xs text-[#7d562d] fill">star</span>
                          <span className="font-bold text-[#1f1a1c]">{product.rating}</span>
                          <span className="text-[#847371]">({product.reviewCount})</span>
                        </div>
                      </div>

                      <h3 className="font-headline text-sm text-[#1f1a1c] font-semibold line-clamp-1 mb-1">
                        {product.name}
                      </h3>
                      <p className="text-[11px] text-[#524342] line-clamp-2 mb-2">
                        {product.subtitle || product.description}
                      </p>

                      {product.locationStock && (
                        <div className="flex items-center gap-1 text-[10px] text-[#536251] font-semibold mb-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#536251]"></span>
                          <span>{product.locationStock}</span>
                        </div>
                      )}
                    </div>

                    <div className="pt-2 border-t border-[#d6c2c0]/20 flex items-center justify-between mt-auto">
                      <div>
                        <div className="flex items-baseline gap-1.5">
                          <span className="font-headline text-base text-[#84504c] font-bold">
                            ৳{product.price.toLocaleString()}
                          </span>
                          {product.originalPrice && (
                            <span className="text-[11px] text-[#847371] line-through">
                              ৳{product.originalPrice.toLocaleString()}
                            </span>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={() => addToCart(product, 1)}
                        className="py-1.5 px-3 rounded-full bg-[#c58882] hover:bg-[#84504c] text-white text-xs font-semibold shadow-xs flex items-center gap-1 transition-all"
                      >
                        <span className="material-symbols-outlined text-sm">shopping_bag</span>
                        <span>Add to Cart</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bangladesh Climate Routine Guide Banner */}
            <div className="p-6 sm:p-8 rounded-2xl bg-[#fbf1f3] border border-[#d6c2c0]/30 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xs">
              <div className="space-y-2">
                <span className="text-xs uppercase tracking-wider text-[#84504c] font-bold block">
                  Bangladesh Climate Routine Guide
                </span>
                <h3 className="font-headline text-xl sm:text-2xl text-[#1f1a1c] font-bold">
                  Battling Monsoon Humidity &amp; Dust in Dhaka?
                </h3>
                <p className="text-xs sm:text-sm text-[#524342] max-w-xl leading-relaxed">
                  Explore our dermatologically curated 3-step lightweight balancing ritual designed specifically
                  for high humidity, UV index 11+, and urban particulate defense.
                </p>
                <div className="flex flex-wrap items-center gap-4 pt-1 text-xs text-[#536251] font-medium">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-xs fill">check_circle</span>
                    Non-Comedogenic
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-xs fill">check_circle</span>
                    Sweat-Tolerant
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-xs fill">check_circle</span>
                    Fragrance-Free
                  </span>
                </div>
              </div>

              <button
                onClick={() => {
                  setSelectedCategory('Skincare');
                  showToast('Filtered for Dhaka Monsoon Weather-Proof Formulations');
                }}
                className="px-6 py-3 rounded-full bg-[#84504c] text-white text-xs font-bold hover:bg-[#c58882] transition-colors shadow-sm shrink-0 whitespace-nowrap self-start md:self-auto"
              >
                View Weather-Proof Edit
              </button>
            </div>

            {/* Pagination */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-[#d6c2c0]/30">
              <span className="text-xs text-[#524342]">
                Showing <strong className="text-[#1f1a1c]">1–8</strong> of{' '}
                <strong className="text-[#1f1a1c]">84</strong> curated products (Page {currentPageNum} of 6)
              </span>

              <div className="flex items-center gap-1">
                <button
                  disabled={currentPageNum === 1}
                  onClick={() => setCurrentPageNum((p) => Math.max(1, p - 1))}
                  className="w-8 h-8 rounded-full border border-[#d6c2c0]/40 flex items-center justify-center text-xs text-[#524342] hover:bg-[#f6ebee] disabled:opacity-40"
                >
                  <span className="material-symbols-outlined text-sm">chevron_left</span>
                </button>
                {[1, 2, 3, 6].map((num, i) => (
                  <React.Fragment key={num}>
                    {i === 3 && <span className="px-1 text-xs text-[#847371]">...</span>}
                    <button
                      onClick={() => setCurrentPageNum(num)}
                      className={`w-8 h-8 rounded-full text-xs font-semibold transition-colors ${
                        currentPageNum === num
                          ? 'bg-[#84504c] text-white'
                          : 'text-[#524342] hover:bg-[#f6ebee]'
                      }`}
                    >
                      {num}
                    </button>
                  </React.Fragment>
                ))}
                <button
                  disabled={currentPageNum === 6}
                  onClick={() => setCurrentPageNum((p) => Math.min(6, p + 1))}
                  className="w-8 h-8 rounded-full border border-[#d6c2c0]/40 flex items-center justify-center text-xs text-[#524342] hover:bg-[#f6ebee] disabled:opacity-40"
                >
                  <span className="material-symbols-outlined text-sm">chevron_right</span>
                </button>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};
