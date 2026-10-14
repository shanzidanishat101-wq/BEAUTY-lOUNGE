import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { ASSETS } from '../data/mockData';

export const HomePage: React.FC = () => {
  const {
    products,
    addToCart,
    toggleWishlist,
    isInWishlist,
    navigateTo,
    setActiveCategory,
    showToast,
    setQuickViewProduct,
  } = useStore();

  const [activeTab, setActiveTab] = useState<'trending' | 'monsoon' | 'eid'>('trending');

  // Countdown timer for Eid Campaign
  const [timeLeft, setTimeLeft] = useState({
    days: 4,
    hours: 16,
    minutes: 42,
    seconds: 30,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else if (prev.days > 0) {
          return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Bengali Skin Quiz state
  const [quizStep, setQuizStep] = useState(1);
  const [quizAnswers, setQuizAnswers] = useState<{ skinType?: string; concern?: string }>({});

  const handleQuizStep1 = (val: string) => {
    setQuizAnswers((prev) => ({ ...prev, skinType: val }));
    setQuizStep(2);
  };

  const handleQuizStep2 = (val: string) => {
    setQuizAnswers((prev) => ({ ...prev, concern: val }));
    setQuizStep(3);
  };

  const resetQuiz = () => {
    setQuizStep(1);
    setQuizAnswers({});
  };

  const handleAddBundleToCart = () => {
    // Add the 3 routine products to cart
    addToCart(products[0], 1);
    addToCart(products[2], 1);
    addToCart(products[5], 1);
    showToast('Complete 3-Step Dhaka Ritual Bundle added to bag!', 4400);
  };

  const copyCouponCode = () => {
    navigator.clipboard?.writeText('DHAKAGLOW');
    showToast('Promo code DHAKAGLOW copied to clipboard!');
  };

  // Filtered bestseller products
  const displayProducts = products.filter((p) => {
    if (activeTab === 'trending') return p.isBestseller;
    if (activeTab === 'monsoon') return p.isMonsoonProof;
    if (activeTab === 'eid') return p.isEidExclusive;
    return true;
  }).slice(0, 4);

  return (
    <div className="flex flex-col w-full">
      {/* Top Ambient Glow Decorator */}
      <div className="relative w-full overflow-hidden bg-gradient-to-b from-[#fbf1f3] via-[#fff8f8] to-[#fff8f8] pb-16">
        <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[850px] h-[450px] bg-[#ffdad6]/40 rounded-full blur-3xl opacity-70"></div>
        <div className="pointer-events-none absolute top-48 -right-24 w-96 h-96 bg-[#ffdcbd]/40 rounded-full blur-3xl opacity-50"></div>

        {/* HERO SECTION */}
        <section className="max-w-7xl mx-auto px-6 lg:px-12 pt-8 lg:pt-14 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Editorial Copy & CTA */}
            <div className="lg:col-span-7 space-y-8">
              <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#f6ebee] shadow-xs">
                <span className="w-2 h-2 rounded-full bg-[#84504c] animate-pulse"></span>
                <span className="text-xs text-[#84504c] uppercase tracking-wider font-bold">
                  Dhaka • Chattogram • Sylhet Express
                </span>
                <span className="material-symbols-outlined text-xs text-[#84504c] fill">
                  verified
                </span>
              </div>

              <div className="space-y-4">
                <h1 className="font-headline text-3xl sm:text-4xl lg:text-5xl text-[#1f1a1c] tracking-tight leading-tight">
                  Radiance Reimagined for{' '}
                  <span className="italic font-normal text-[#84504c]">Bangladeshi Skin</span> &amp; Climate
                </h1>
                <p className="text-base sm:text-lg text-[#524342] max-w-2xl leading-relaxed">
                  Curated 100% authentic dermatologically verified skincare, vibrant long-lasting makeup,
                  and luxury beauty formulated for high humidity and tropical glow.
                </p>
              </div>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={() => navigateTo('shop-catalog')}
                  className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full bg-[#84504c] text-white text-sm font-semibold shadow-md hover:bg-[#c58882] transition-all transform hover:-translate-y-0.5 active:translate-y-0"
                >
                  <span>Explore Collection</span>
                  <span className="material-symbols-outlined text-base">arrow_forward</span>
                </button>
                <a
                  href="#skin-quiz"
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#f6ebee] text-[#84504c] text-sm font-semibold hover:bg-[#f0e6e8] transition-all"
                >
                  <span className="material-symbols-outlined text-lg fill">spa</span>
                  <span>Take Skin Diagnostic Quiz</span>
                </a>
              </div>

              {/* Stats Strip */}
              <div className="pt-6 grid grid-cols-3 gap-6 max-w-xl border-t border-[#d6c2c0]/30">
                <div className="space-y-1">
                  <div className="font-headline text-2xl sm:text-3xl text-[#1f1a1c] font-bold tracking-tight">
                    50K<span className="text-[#84504c]">+</span>
                  </div>
                  <p className="text-[11px] sm:text-xs uppercase tracking-wider text-[#524342]">
                    Happy Customers in BD
                  </p>
                </div>
                <div className="space-y-1">
                  <div className="font-headline text-2xl sm:text-3xl text-[#1f1a1c] font-bold tracking-tight">
                    100<span className="text-[#84504c]">%</span>
                  </div>
                  <p className="text-[11px] sm:text-xs uppercase tracking-wider text-[#524342]">
                    Authentic Brands
                  </p>
                </div>
                <div className="space-y-1">
                  <div className="font-headline text-2xl sm:text-3xl text-[#1f1a1c] font-bold tracking-tight">
                    24-48<span className="text-[#84504c]">h</span>
                  </div>
                  <p className="text-[11px] sm:text-xs uppercase tracking-wider text-[#524342]">
                    Dhaka Delivery
                  </p>
                </div>
              </div>
            </div>

            {/* Right Hero Bento Visual Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-2xl overflow-hidden bg-white p-3 shadow-xl border border-[#d6c2c0]/20">
                <div className="relative h-[440px] sm:h-[480px] w-full rounded-xl overflow-hidden">
                  <img
                    className="w-full h-full object-cover"
                    src={ASSETS.heroModel}
                    alt="South Asian model with radiant dewy skin holding serum"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1f1a1c]/80 via-transparent to-black/10"></div>

                  {/* Top Floating Badge */}
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-full shadow-sm flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[#7d562d] text-sm fill">
                      auto_awesome
                    </span>
                    <span className="text-xs text-[#1f1a1c] font-bold uppercase tracking-wider">
                      Humid-Resistant Formula
                    </span>
                  </div>

                  {/* Bottom Glass Overlaid Card */}
                  <div className="absolute bottom-4 inset-x-4 p-4 rounded-xl bg-white/90 backdrop-blur-md shadow-lg flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase tracking-widest text-[#84504c] font-bold block">
                        Featured Iconic Drop
                      </span>
                      <p className="font-headline text-sm sm:text-base font-bold text-[#1f1a1c]">
                        Aura Dew Glaze &amp; Niacinamide
                      </p>
                      <p className="text-xs text-[#524342]">
                        BDT ৳1,650{' '}
                        <span className="line-through text-[#847371] font-normal">৳1,950</span>
                      </p>
                    </div>
                    <button
                      onClick={() => addToCart(products[0], 1)}
                      className="w-11 h-11 rounded-full bg-[#84504c] text-white flex items-center justify-center hover:bg-[#c58882] transition-colors shadow-sm shrink-0"
                      aria-label="Add featured product to bag"
                    >
                      <span className="material-symbols-outlined text-lg">shopping_bag</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Secondary Floating Micro-Badge */}
              <div className="hidden sm:flex absolute -bottom-5 -left-6 bg-white p-3.5 rounded-xl shadow-xl items-center gap-3 border border-[#d6c2c0]/30">
                <div className="w-10 h-10 rounded-full bg-[#d7e7d1] flex items-center justify-center text-[#111f11]">
                  <span className="material-symbols-outlined text-xl fill">check_circle</span>
                </div>
                <div>
                  <p className="text-xs font-bold text-[#1f1a1c]">BSTI Lab Tested</p>
                  <p className="text-[11px] text-[#524342]">Non-comedogenic • Cruelty-free</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* CATEGORY SHOWCASE BAR */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 py-12 w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs uppercase tracking-widest text-[#84504c] font-bold">
              Curated Rituals
            </span>
            <h2 className="font-headline text-2xl sm:text-3xl text-[#1f1a1c] tracking-tight mt-1 font-bold">
              Shop by Category
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[#524342] max-w-md">
            Formulations engineered for South Asian weather conditions: high humidity, intense UV index,
            and pollution protection.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
          {/* 1. Skincare */}
          <button
            onClick={() => {
              setActiveCategory('Skincare');
              navigateTo('shop-catalog');
            }}
            className="group flex flex-col items-center text-center p-4 rounded-xl bg-[#fbf1f3] hover:bg-[#f6ebee] transition-all hover:shadow-md cursor-pointer"
          >
            <div className="w-20 h-20 rounded-full overflow-hidden p-1 bg-[#eae0e2] shadow-inner group-hover:scale-105 transition-transform duration-300">
              <img
                className="w-full h-full object-cover rounded-full"
                src={ASSETS.categorySkincare}
                alt="Skincare serums and toners"
              />
            </div>
            <span className="font-headline text-base text-[#1f1a1c] mt-3 group-hover:text-[#84504c] transition-colors font-semibold">
              Skincare
            </span>
            <span className="text-[11px] text-[#524342] mt-0.5">Toners &amp; Serums</span>
          </button>

          {/* 2. Makeup */}
          <button
            onClick={() => {
              setActiveCategory('Makeup');
              navigateTo('shop-catalog');
            }}
            className="group flex flex-col items-center text-center p-4 rounded-xl bg-[#fbf1f3] hover:bg-[#f6ebee] transition-all hover:shadow-md cursor-pointer"
          >
            <div className="w-20 h-20 rounded-full overflow-hidden p-1 bg-[#eae0e2] shadow-inner group-hover:scale-105 transition-transform duration-300">
              <img
                className="w-full h-full object-cover rounded-full"
                src={ASSETS.categoryMakeup}
                alt="Makeup lips and complexion"
              />
            </div>
            <span className="font-headline text-base text-[#1f1a1c] mt-3 group-hover:text-[#84504c] transition-colors font-semibold">
              Makeup
            </span>
            <span className="text-[11px] text-[#524342] mt-0.5">Lips &amp; Complexion</span>
          </button>

          {/* 3. Sun Shield */}
          <button
            onClick={() => {
              setActiveCategory('Sun Protection');
              navigateTo('shop-catalog');
            }}
            className="group flex flex-col items-center text-center p-4 rounded-xl bg-[#fbf1f3] hover:bg-[#f6ebee] transition-all hover:shadow-md cursor-pointer"
          >
            <div className="w-20 h-20 rounded-full overflow-hidden p-1 bg-[#eae0e2] shadow-inner group-hover:scale-105 transition-transform duration-300">
              <img
                className="w-full h-full object-cover rounded-full"
                src={ASSETS.categorySunscreen}
                alt="Sun protection water gel"
              />
            </div>
            <span className="font-headline text-base text-[#1f1a1c] mt-3 group-hover:text-[#84504c] transition-colors font-semibold">
              Sun Shield
            </span>
            <span className="text-[11px] text-[#524342] mt-0.5">SPF 50+ No Cast</span>
          </button>

          {/* 4. Haircare */}
          <button
            onClick={() => {
              setActiveCategory('Haircare');
              navigateTo('shop-catalog');
            }}
            className="group flex flex-col items-center text-center p-4 rounded-xl bg-[#fbf1f3] hover:bg-[#f6ebee] transition-all hover:shadow-md cursor-pointer"
          >
            <div className="w-20 h-20 rounded-full overflow-hidden p-1 bg-[#eae0e2] shadow-inner group-hover:scale-105 transition-transform duration-300">
              <img
                className="w-full h-full object-cover rounded-full"
                src={ASSETS.categoryHaircare}
                alt="Haircare anti-frizz oils"
              />
            </div>
            <span className="font-headline text-base text-[#1f1a1c] mt-3 group-hover:text-[#84504c] transition-colors font-semibold">
              Haircare
            </span>
            <span className="text-[11px] text-[#524342] mt-0.5">Anti-Frizz &amp; Scalp</span>
          </button>

          {/* 5. Fragrance */}
          <button
            onClick={() => {
              setActiveCategory('Fragrance');
              navigateTo('shop-catalog');
            }}
            className="group flex flex-col items-center text-center p-4 rounded-xl bg-[#fbf1f3] hover:bg-[#f6ebee] transition-all hover:shadow-md cursor-pointer"
          >
            <div className="w-20 h-20 rounded-full overflow-hidden p-1 bg-[#eae0e2] shadow-inner group-hover:scale-105 transition-transform duration-300">
              <img
                className="w-full h-full object-cover rounded-full"
                src={ASSETS.categoryFragrance}
                alt="Oud and Jasmine perfumes"
              />
            </div>
            <span className="font-headline text-base text-[#1f1a1c] mt-3 group-hover:text-[#84504c] transition-colors font-semibold">
              Fragrance
            </span>
            <span className="text-[11px] text-[#524342] mt-0.5">Oud, Floral &amp; Musk</span>
          </button>

          {/* 6. Accessories */}
          <button
            onClick={() => {
              setActiveCategory('Accessories');
              navigateTo('shop-catalog');
            }}
            className="group flex flex-col items-center text-center p-4 rounded-xl bg-[#fbf1f3] hover:bg-[#f6ebee] transition-all hover:shadow-md cursor-pointer"
          >
            <div className="w-20 h-20 rounded-full overflow-hidden p-1 bg-[#eae0e2] shadow-inner group-hover:scale-105 transition-transform duration-300">
              <img
                className="w-full h-full object-cover rounded-full"
                src={ASSETS.categoryAccessories}
                alt="Silk and gua sha accessories"
              />
            </div>
            <span className="font-headline text-base text-[#1f1a1c] mt-3 group-hover:text-[#84504c] transition-colors font-semibold">
              Accessories
            </span>
            <span className="text-[11px] text-[#524342] mt-0.5">Silk &amp; Gua Sha</span>
          </button>
        </div>
      </section>

      {/* BESTSELLERS & TABS */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 py-12 w-full" id="featured-collection">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-[#ffdcbd] text-[#2c1600] text-xs font-bold uppercase tracking-wider">
                Dhaka Favorites
              </span>
              <span className="text-xs text-[#524342]">Updated today</span>
            </div>
            <h2 className="font-headline text-2xl sm:text-3xl text-[#1f1a1c] tracking-tight mt-2 font-bold">
              Bestselling Formulations
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('trending')}
              className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'trending'
                  ? 'bg-[#84504c] text-white shadow-sm'
                  : 'bg-[#f6ebee] text-[#524342] hover:text-[#1f1a1c]'
              }`}
            >
              Trending Now
            </button>
            <button
              onClick={() => setActiveTab('monsoon')}
              className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'monsoon'
                  ? 'bg-[#84504c] text-white shadow-sm'
                  : 'bg-[#f6ebee] text-[#524342] hover:text-[#1f1a1c]'
              }`}
            >
              Monsoon Proof
            </button>
            <button
              onClick={() => setActiveTab('eid')}
              className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'eid'
                  ? 'bg-[#84504c] text-white shadow-sm'
                  : 'bg-[#f6ebee] text-[#524342] hover:text-[#1f1a1c]'
              }`}
            >
              Eid Exclusives
            </button>
          </div>
        </div>

        {/* 4 Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayProducts.map((product) => {
            const isLiked = isInWishlist(product.id);

            return (
              <div
                key={product.id}
                className="group relative rounded-2xl bg-white p-4 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between border border-[#d6c2c0]/20"
              >
                <div>
                  {/* Media */}
                  <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-[#fbf1f3] mb-4">
                    <img
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      src={product.imageUrl}
                      alt={product.name}
                    />
                    {/* Badges */}
                    <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 items-start">
                      {product.badge && (
                        <span className="px-2.5 py-1 rounded-full bg-[#84504c] text-white text-[10px] font-bold uppercase tracking-wider">
                          {product.badge}
                        </span>
                      )}
                      {product.subBadge && (
                        <span className="px-2.5 py-0.5 rounded-full bg-[#d7e7d1] text-[#111f11] text-[10px]">
                          {product.subBadge}
                        </span>
                      )}
                    </div>

                    {/* Action buttons: Quick view & Wishlist */}
                    <div className="absolute top-2.5 right-2.5 flex flex-col gap-1">
                      <button
                        onClick={() => toggleWishlist(product.id)}
                        className="w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm text-[#524342] hover:text-[#84504c] flex items-center justify-center transition-colors shadow-sm"
                        aria-label="Toggle wishlist"
                      >
                        <span className={`material-symbols-outlined text-lg ${isLiked ? 'text-[#84504c] fill' : ''}`}>
                          favorite
                        </span>
                      </button>
                      <button
                        onClick={() => setQuickViewProduct(product)}
                        className="w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm text-[#524342] hover:text-[#84504c] flex items-center justify-center transition-colors shadow-sm"
                        aria-label="Quick preview"
                      >
                        <span className="material-symbols-outlined text-base">visibility</span>
                      </button>
                    </div>

                    {/* Quick Add overlay button */}
                    <div className="absolute inset-x-2 bottom-2 translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                      <button
                        onClick={() => addToCart(product, 1)}
                        className="w-full py-2.5 px-4 rounded-full bg-[#84504c] text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-md hover:bg-[#c58882] transition-colors"
                      >
                        <span className="material-symbols-outlined text-sm">shopping_bag</span>
                        <span>Quick Add • ৳{product.price.toLocaleString()}</span>
                      </button>
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <div className="flex text-[#7d562d] text-xs">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className="material-symbols-outlined text-xs fill">
                          star
                        </span>
                      ))}
                    </div>
                    <span className="text-xs text-[#1f1a1c] font-bold">{product.rating}</span>
                    <span className="text-xs text-[#524342]">({product.reviewCount})</span>
                  </div>

                  <h3 className="font-headline text-base text-[#1f1a1c] font-semibold line-clamp-1 mb-1">
                    {product.name}
                  </h3>
                  <p className="text-xs text-[#524342] line-clamp-2 mb-3">
                    {product.subtitle || product.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#d6c2c0]/20 flex items-center justify-between mt-auto">
                  <div>
                    <div className="flex items-baseline gap-2">
                      <span className="font-headline text-lg text-[#84504c] font-bold">
                        ৳{product.price.toLocaleString()}
                      </span>
                      {product.originalPrice && (
                        <span className="text-xs text-[#847371] line-through">
                          ৳{product.originalPrice.toLocaleString()}
                        </span>
                      )}
                    </div>
                    {product.originalPrice && (
                      <span className="text-[10px] text-[#7d562d] font-bold">
                        Save ৳{(product.originalPrice - product.price).toLocaleString()}
                      </span>
                    )}
                  </div>

                  {product.shades ? (
                    <div className="flex items-center gap-1">
                      {product.shades.map((s) => (
                        <span
                          key={s.name}
                          className="w-3.5 h-3.5 rounded-full border border-white shadow-xs"
                          style={{ backgroundColor: s.hex }}
                          title={s.name}
                        />
                      ))}
                    </div>
                  ) : product.volumeOrSize ? (
                    <span className="px-2 py-0.5 rounded-full bg-[#f6ebee] text-[10px] text-[#524342]">
                      {product.volumeOrSize}
                    </span>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* SPECIAL EID GLOW BANNER */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 py-8 w-full">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#4d2320] via-[#84504c] to-[#c58882] text-white p-8 sm:p-12 shadow-xl">
          <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-[#ffca98]/20 blur-2xl pointer-events-none"></div>
          <div className="absolute -left-10 -top-10 w-60 h-60 rounded-full bg-[#ffdad6]/20 blur-xl pointer-events-none"></div>

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Content */}
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/20 backdrop-blur-md">
                <span className="material-symbols-outlined text-sm text-[#ffdcbd]">hotel_class</span>
                <span className="text-xs uppercase tracking-widest text-[#ffdad6] font-bold">
                  Limited Festive Edit
                </span>
              </div>
              <h2 className="font-headline text-3xl sm:text-4xl lg:text-5xl tracking-tight leading-tight">
                The Eid Glow &amp; Radiance Sanctuary
              </h2>
              <p className="text-sm sm:text-base text-[#fbf1f3] max-w-2xl leading-relaxed">
                Receive a complimentary 3-piece K-Beauty travel glow kit + silk vanity pouch on all orders
                above ৳4,000. Apply code{' '}
                <button
                  onClick={copyCouponCode}
                  className="font-bold underline text-[#ffdcbd] hover:opacity-90 inline-flex items-center gap-1"
                >
                  DHAKAGLOW
                </button>{' '}
                at checkout.
              </p>

              {/* Countdown Timer */}
              <div className="pt-2 flex items-center gap-3 sm:gap-4">
                <div className="px-3.5 py-2 rounded-xl bg-white/10 backdrop-blur-md text-center min-w-[64px]">
                  <span className="font-headline text-xl sm:text-2xl font-bold block">
                    {String(timeLeft.days).padStart(2, '0')}
                  </span>
                  <span className="text-[10px] uppercase tracking-wider text-[#eae0e2]">Days</span>
                </div>
                <span className="text-xl font-bold opacity-60">:</span>
                <div className="px-3.5 py-2 rounded-xl bg-white/10 backdrop-blur-md text-center min-w-[64px]">
                  <span className="font-headline text-xl sm:text-2xl font-bold block">
                    {String(timeLeft.hours).padStart(2, '0')}
                  </span>
                  <span className="text-[10px] uppercase tracking-wider text-[#eae0e2]">Hours</span>
                </div>
                <span className="text-xl font-bold opacity-60">:</span>
                <div className="px-3.5 py-2 rounded-xl bg-white/10 backdrop-blur-md text-center min-w-[64px]">
                  <span className="font-headline text-xl sm:text-2xl font-bold block">
                    {String(timeLeft.minutes).padStart(2, '0')}
                  </span>
                  <span className="text-[10px] uppercase tracking-wider text-[#eae0e2]">Mins</span>
                </div>
                <span className="text-xl font-bold opacity-60">:</span>
                <div className="px-3.5 py-2 rounded-xl bg-white/10 backdrop-blur-md text-center min-w-[64px]">
                  <span className="font-headline text-xl sm:text-2xl font-bold block">
                    {String(timeLeft.seconds).padStart(2, '0')}
                  </span>
                  <span className="text-[10px] uppercase tracking-wider text-[#eae0e2]">Secs</span>
                </div>
              </div>
            </div>

            {/* Voucher Card */}
            <div className="lg:col-span-4 flex flex-col items-center lg:items-end justify-center">
              <div className="w-full max-w-xs bg-white text-[#1f1a1c] p-6 rounded-2xl shadow-lg space-y-4 text-center">
                <span className="text-xs uppercase tracking-widest text-[#524342] font-bold">
                  Exclusive Voucher
                </span>
                <button
                  onClick={copyCouponCode}
                  className="w-full py-2.5 px-4 rounded-full bg-[#fbf1f3] border-dashed border-2 border-[#84504c]/40 font-headline text-lg sm:text-xl text-[#84504c] font-bold tracking-wider select-all cursor-pointer hover:bg-[#f6ebee] transition-colors"
                >
                  DHAKAGLOW
                </button>
                <p className="text-xs text-[#524342]">Extra 10% Off + Free Silk Pouch</p>
                <button
                  onClick={() => navigateTo('shop-catalog')}
                  className="block w-full py-3 rounded-full bg-[#84504c] text-white text-xs font-bold hover:bg-[#c58882] transition-colors shadow-sm"
                >
                  Claim Festive Gift
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BENGALI WEATHER SKIN DIAGNOSTIC QUIZ */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 py-16 w-full" id="skin-quiz">
        <div className="rounded-2xl bg-[#fbf1f3] p-6 sm:p-12 shadow-sm border border-[#d6c2c0]/20">
          <div className="max-w-3xl mx-auto text-center space-y-3 mb-10">
            <span className="px-3.5 py-1 rounded-full bg-[#d7e7d1] text-[#111f11] text-xs uppercase tracking-wider font-bold">
              Bespoke Advisory
            </span>
            <h2 className="font-headline text-2xl sm:text-3xl lg:text-4xl text-[#1f1a1c] tracking-tight font-bold">
              Bengali Weather Skin Diagnostic
            </h2>
            <p className="text-sm text-[#524342]">
              Dhaka and coastal moisture require precise layering. Answer 2 quick questions to unlock
              your custom anti-pigmentation and sebum-control regimen.
            </p>
          </div>

          {/* Quiz Card Container */}
          <div className="max-w-2xl mx-auto bg-white p-6 sm:p-8 rounded-2xl shadow-md border border-[#d6c2c0]/30">
            {/* Step Indicator */}
            <div className="flex items-center justify-between mb-6">
              <span className="text-xs font-semibold text-[#84504c]">
                {quizStep === 3 ? 'Prescription Ready' : `Step ${quizStep} of 3`}
              </span>
              <div className="w-32 h-2 rounded-full bg-[#f6ebee] overflow-hidden">
                <div
                  className="h-full bg-[#84504c] transition-all duration-300 rounded-full"
                  style={{ width: `${(quizStep / 3) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Step 1 */}
            {quizStep === 1 && (
              <div className="space-y-4">
                <h3 className="font-headline text-lg sm:text-xl text-[#1f1a1c] font-semibold">
                  What describes your daytime skin feel in Dhaka climate?
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <button
                    onClick={() => handleQuizStep1('oily')}
                    className="p-4 rounded-xl bg-[#f6ebee] text-left hover:bg-[#eae0e2] transition-colors flex items-start gap-3"
                  >
                    <span className="material-symbols-outlined text-[#84504c] text-xl mt-0.5">
                      water_drop
                    </span>
                    <div>
                      <p className="text-xs font-bold text-[#1f1a1c]">Oily / Combination</p>
                      <p className="text-[11px] text-[#524342]">
                        Greasy T-zone within 2 hours of leaving home
                      </p>
                    </div>
                  </button>

                  <button
                    onClick={() => handleQuizStep1('sensitive')}
                    className="p-4 rounded-xl bg-[#f6ebee] text-left hover:bg-[#eae0e2] transition-colors flex items-start gap-3"
                  >
                    <span className="material-symbols-outlined text-[#84504c] text-xl mt-0.5">
                      flare
                    </span>
                    <div>
                      <p className="text-xs font-bold text-[#1f1a1c]">Sensitive &amp; Reactive</p>
                      <p className="text-[11px] text-[#524342]">
                        Easily reddens in heat, prone to breakouts
                      </p>
                    </div>
                  </button>

                  <button
                    onClick={() => handleQuizStep1('dry')}
                    className="p-4 rounded-xl bg-[#f6ebee] text-left hover:bg-[#eae0e2] transition-colors flex items-start gap-3"
                  >
                    <span className="material-symbols-outlined text-[#84504c] text-xl mt-0.5">
                      grain
                    </span>
                    <div>
                      <p className="text-xs font-bold text-[#1f1a1c]">Dehydrated &amp; Dry</p>
                      <p className="text-[11px] text-[#524342]">
                        Tight feeling, dullness under air conditioning
                      </p>
                    </div>
                  </button>

                  <button
                    onClick={() => handleQuizStep1('acne')}
                    className="p-4 rounded-xl bg-[#f6ebee] text-left hover:bg-[#eae0e2] transition-colors flex items-start gap-3"
                  >
                    <span className="material-symbols-outlined text-[#84504c] text-xl mt-0.5">
                      bubble_chart
                    </span>
                    <div>
                      <p className="text-xs font-bold text-[#1f1a1c]">Acne-Prone &amp; Clogged</p>
                      <p className="text-[11px] text-[#524342]">
                        Frequent stubborn whiteheads and monsoon pimples
                      </p>
                    </div>
                  </button>
                </div>
              </div>
            )}

            {/* Step 2 */}
            {quizStep === 2 && (
              <div className="space-y-4">
                <h3 className="font-headline text-lg sm:text-xl text-[#1f1a1c] font-semibold">
                  What is your primary skincare target right now?
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <button
                    onClick={() => handleQuizStep2('pigmentation')}
                    className="p-4 rounded-xl bg-[#f6ebee] text-left hover:bg-[#eae0e2] transition-colors flex items-start gap-3"
                  >
                    <span className="material-symbols-outlined text-[#7d562d] text-xl mt-0.5">
                      redeem
                    </span>
                    <div>
                      <p className="text-xs font-bold text-[#1f1a1c]">Sun Spots &amp; Melasma</p>
                      <p className="text-[11px] text-[#524342]">
                        Fading dark spots and post-acne pigmentation
                      </p>
                    </div>
                  </button>

                  <button
                    onClick={() => handleQuizStep2('glow')}
                    className="p-4 rounded-xl bg-[#f6ebee] text-left hover:bg-[#eae0e2] transition-colors flex items-start gap-3"
                  >
                    <span className="material-symbols-outlined text-[#7d562d] text-xl mt-0.5">
                      auto_awesome
                    </span>
                    <div>
                      <p className="text-xs font-bold text-[#1f1a1c]">Festive Radiance</p>
                      <p className="text-[11px] text-[#524342]">
                        Dewy glass skin glow for weddings and family events
                      </p>
                    </div>
                  </button>

                  <button
                    onClick={() => handleQuizStep2('antiaging')}
                    className="p-4 rounded-xl bg-[#f6ebee] text-left hover:bg-[#eae0e2] transition-colors flex items-start gap-3"
                  >
                    <span className="material-symbols-outlined text-[#7d562d] text-xl mt-0.5">
                      hourglass_empty
                    </span>
                    <div>
                      <p className="text-xs font-bold text-[#1f1a1c]">Firming &amp; Smooth Texture</p>
                      <p className="text-[11px] text-[#524342]">
                        Minimizing enlarged pores and fine lines
                      </p>
                    </div>
                  </button>

                  <button
                    onClick={() => handleQuizStep2('barrier')}
                    className="p-4 rounded-xl bg-[#f6ebee] text-left hover:bg-[#eae0e2] transition-colors flex items-start gap-3"
                  >
                    <span className="material-symbols-outlined text-[#7d562d] text-xl mt-0.5">
                      shield
                    </span>
                    <div>
                      <p className="text-xs font-bold text-[#1f1a1c]">Skin Barrier Repair</p>
                      <p className="text-[11px] text-[#524342]">
                        Soothing stinging caused by dust or over-exfoliation
                      </p>
                    </div>
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Prescribed Routine Result */}
            {quizStep === 3 && (
              <div className="space-y-6">
                <div className="p-4 rounded-xl bg-[#d7e7d1] text-[#111f11] flex items-center gap-3">
                  <span className="material-symbols-outlined text-2xl fill">recommend</span>
                  <div>
                    <p className="font-headline text-base font-bold">
                      Your Prescribed Dhaka Moisture Routine
                    </p>
                    <p className="text-xs opacity-90">
                      Clinically balanced for high humidity &amp; pollution defense.
                    </p>
                  </div>
                </div>

                <div className="space-y-2.5">
                  <div className="p-3 rounded-xl bg-[#f6ebee] flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="w-7 h-7 rounded-full bg-[#84504c] text-white font-bold text-xs flex items-center justify-center">
                        1
                      </span>
                      <div>
                        <p className="text-xs font-bold text-[#1f1a1c]">Centella Calming Gel Moisturizer</p>
                        <p className="text-[10px] text-[#524342]">Step 1: AM &amp; PM Purifying Hydration</p>
                      </div>
                    </div>
                    <span className="text-xs text-[#84504c] font-bold">৳1,750</span>
                  </div>

                  <div className="p-3 rounded-xl bg-[#f6ebee] flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="w-7 h-7 rounded-full bg-[#84504c] text-white font-bold text-xs flex items-center justify-center">
                        2
                      </span>
                      <div>
                        <p className="text-xs font-bold text-[#1f1a1c]">Aura Dew Niacinamide 10% + Zinc</p>
                        <p className="text-[10px] text-[#524342]">Step 2: Daytime Oil &amp; Spot Defense</p>
                      </div>
                    </div>
                    <span className="text-xs text-[#84504c] font-bold">৳1,650</span>
                  </div>

                  <div className="p-3 rounded-xl bg-[#f6ebee] flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="w-7 h-7 rounded-full bg-[#84504c] text-white font-bold text-xs flex items-center justify-center">
                        3
                      </span>
                      <div>
                        <p className="text-xs font-bold text-[#1f1a1c]">Invisible Sun Shield Water Gel SPF 50+</p>
                        <p className="text-[10px] text-[#524342]">Step 3: Non-comedogenic UV Layer</p>
                      </div>
                    </div>
                    <span className="text-xs text-[#84504c] font-bold">৳2,100</span>
                  </div>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[#d6c2c0]/30">
                  <div>
                    <span className="text-[11px] text-[#524342] uppercase tracking-wider">
                      Bundle Special Price
                    </span>
                    <div className="font-headline text-xl text-[#84504c] font-bold">
                      ৳4,400{' '}
                      <span className="text-xs font-normal text-[#847371] line-through">
                        ৳5,500
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2 w-full sm:w-auto">
                    <button
                      onClick={resetQuiz}
                      className="px-4 py-2.5 rounded-full bg-[#f6ebee] text-[#1f1a1c] text-xs font-semibold hover:bg-[#eae0e2] transition-colors"
                    >
                      Retake
                    </button>
                    <button
                      onClick={handleAddBundleToCart}
                      className="flex-1 sm:flex-initial px-6 py-2.5 rounded-full bg-[#84504c] text-white text-xs font-bold hover:bg-[#c58882] transition-colors shadow-md flex items-center justify-center gap-1.5"
                    >
                      <span className="material-symbols-outlined text-sm">shopping_bag</span>
                      <span>Add Complete Ritual to Bag</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* TRUST & LOGISTICS PILLARS */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 py-10 w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-2xl bg-[#fbf1f3] flex flex-col items-start gap-3 border border-[#d6c2c0]/20">
            <div className="w-12 h-12 rounded-full bg-[#ffdad6] flex items-center justify-center text-[#34100d]">
              <span className="material-symbols-outlined text-2xl">rocket_launch</span>
            </div>
            <div>
              <h4 className="font-headline text-base font-bold text-[#1f1a1c]">Dhaka Same-Day / 24h</h4>
              <p className="text-xs text-[#524342] mt-1 leading-relaxed">
                Gulshan, Banani, Dhanmondi, Uttara &amp; Mirpur express flat ৳70 delivery.
              </p>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-[#fbf1f3] flex flex-col items-start gap-3 border border-[#d6c2c0]/20">
            <div className="w-12 h-12 rounded-full bg-[#ffdcbd] flex items-center justify-center text-[#2c1600]">
              <span className="material-symbols-outlined text-2xl">local_shipping</span>
            </div>
            <div>
              <h4 className="font-headline text-base font-bold text-[#1f1a1c]">64 Districts (48-72h)</h4>
              <p className="text-xs text-[#524342] mt-1 leading-relaxed">
                Reliable courier delivery across Sylhet, Chittagong, Rajshahi at flat ৳120.
              </p>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-[#fbf1f3] flex flex-col items-start gap-3 border border-[#d6c2c0]/20">
            <div className="w-12 h-12 rounded-full bg-[#d7e7d1] flex items-center justify-center text-[#111f11]">
              <span className="material-symbols-outlined text-2xl fill">verified</span>
            </div>
            <div>
              <h4 className="font-headline text-base font-bold text-[#1f1a1c]">100% Authentic Guarantee</h4>
              <p className="text-xs text-[#524342] mt-1 leading-relaxed">
                Sourced directly from authorized Korean, European &amp; US brand labs.
              </p>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-[#fbf1f3] flex flex-col items-start gap-3 border border-[#d6c2c0]/20">
            <div className="w-12 h-12 rounded-full bg-[#eae0e2] flex items-center justify-center text-[#84504c]">
              <span className="material-symbols-outlined text-2xl">contactless</span>
            </div>
            <div>
              <h4 className="font-headline text-base font-bold text-[#1f1a1c]">Cash on Delivery &amp; MFS</h4>
              <p className="text-xs text-[#524342] mt-1 leading-relaxed">
                Instant payments via bKash, Nagad, Visa, Mastercard or pay cash upon receipt.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* VERIFIED BANGLADESHI REVIEWS */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 py-16 w-full">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs uppercase tracking-widest text-[#84504c] font-bold">
            Community Voices
          </span>
          <h2 className="font-headline text-2xl sm:text-3xl text-[#1f1a1c] tracking-tight mt-1 font-bold">
            Loved Across Bangladesh
          </h2>
          <p className="text-xs sm:text-sm text-[#524342] mt-2">
            Hear directly from verified beauty customers finding confidence in our verified formulations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Review 1 */}
          <div className="p-6 rounded-2xl bg-white shadow-sm flex flex-col justify-between border border-[#d6c2c0]/20">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex text-[#7d562d] text-sm">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="material-symbols-outlined text-sm fill">
                      star
                    </span>
                  ))}
                </div>
                <span className="px-2 py-0.5 rounded-full bg-[#d7e7d1] text-[#111f11] text-[10px] font-semibold">
                  Verified Buyer
                </span>
              </div>
              <p className="text-xs sm:text-sm text-[#1f1a1c] italic leading-relaxed">
                "Finally an authentic skincare destination in BD where I don't have to stress about duplicates. The Aura Dew serum reached my Banani flat in just 20 hours! My skin texture in this Dhaka humidity has never looked smoother."
              </p>
            </div>
            <div className="flex items-center gap-3 pt-6 mt-4 border-t border-[#d6c2c0]/20">
              <div className="w-10 h-10 rounded-full bg-[#ffdad6] text-[#34100d] font-headline text-base flex items-center justify-center font-bold">
                T
              </div>
              <div>
                <h5 className="text-xs font-bold text-[#1f1a1c]">Tasnim Rahman</h5>
                <p className="text-[11px] text-[#524342]">Banani, Dhaka</p>
              </div>
            </div>
          </div>

          {/* Review 2 */}
          <div className="p-6 rounded-2xl bg-white shadow-sm flex flex-col justify-between border border-[#d6c2c0]/20">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex text-[#7d562d] text-sm">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="material-symbols-outlined text-sm fill">
                      star
                    </span>
                  ))}
                </div>
                <span className="px-2 py-0.5 rounded-full bg-[#d7e7d1] text-[#111f11] text-[10px] font-semibold">
                  Verified Buyer
                </span>
              </div>
              <p className="text-xs sm:text-sm text-[#1f1a1c] italic leading-relaxed">
                "The Invisible Sun Shield Water Gel is pure magic for Chittagong weather. Zero greasiness, completely clear with no white patch on brown undertones. Cash on delivery was seamless."
              </p>
            </div>
            <div className="flex items-center gap-3 pt-6 mt-4 border-t border-[#d6c2c0]/20">
              <div className="w-10 h-10 rounded-full bg-[#ffdcbd] text-[#2c1600] font-headline text-base flex items-center justify-center font-bold">
                F
              </div>
              <div>
                <h5 className="text-xs font-bold text-[#1f1a1c]">Farhana Chowdhury</h5>
                <p className="text-[11px] text-[#524342]">Nasirabad, Chattogram</p>
              </div>
            </div>
          </div>

          {/* Review 3 */}
          <div className="p-6 rounded-2xl bg-white shadow-sm flex flex-col justify-between border border-[#d6c2c0]/20">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex text-[#7d562d] text-sm">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="material-symbols-outlined text-sm fill">
                      star
                    </span>
                  ))}
                </div>
                <span className="px-2 py-0.5 rounded-full bg-[#d7e7d1] text-[#111f11] text-[10px] font-semibold">
                  Verified Buyer
                </span>
              </div>
              <p className="text-xs sm:text-sm text-[#1f1a1c] italic leading-relaxed">
                "Ordered the Velvet Matte Lip Tint in Gulshan Rose for my sister's engagement program in Sylhet. Stayed intact after dinner and tea! Gorgeous packaging that matches high luxury."
              </p>
            </div>
            <div className="flex items-center gap-3 pt-6 mt-4 border-t border-[#d6c2c0]/20">
              <div className="w-10 h-10 rounded-full bg-[#d7e7d1] text-[#111f11] font-headline text-base flex items-center justify-center font-bold">
                S
              </div>
              <div>
                <h5 className="text-xs font-bold text-[#1f1a1c]">Sadia Kamal</h5>
                <p className="text-[11px] text-[#524342]">Zindabazar, Sylhet</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
