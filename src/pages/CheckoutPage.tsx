import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { ASSETS } from '../data/mockData';

export const CheckoutPage: React.FC = () => {
  const {
    cart,
    updateQuantity,
    removeFromCart,
    cartSubtotal,
    cartTotal,
    deliveryFee,
    couponCode,
    discountAmount,
    applyCoupon,
    placeOrder,
    navigateTo,
    user,
  } = useStore();

  const [inputCoupon, setInputCoupon] = useState(couponCode || 'DHAKAGLOW');
  const [couponAlert, setCouponAlert] = useState<{ type: 'success' | 'error'; message: string }>({
    type: 'success',
    message: 'Promo applied! ৳250 luxury discount activated.',
  });

  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'bkash' | 'nagad' | 'card'>('cod');

  // Address inputs
  const [fullName, setFullName] = useState(user.name);
  const [mobile, setMobile] = useState('1712345678');
  const [altMobile, setAltMobile] = useState('');
  const [email, setEmail] = useState('tahmina.rahman@example.com');
  const [division, setDivision] = useState('Dhaka Division');
  const [district, setDistrict] = useState('Dhaka');
  const [thana, setThana] = useState('Banani / Gulshan');
  const [streetAddress, setStreetAddress] = useState(
    'House 42, Road 11, Block D, Banani, Dhaka - 1213'
  );
  const [instructions, setInstructions] = useState(
    'Leave with building reception if unavailable on call.'
  );

  // Order confirmation modal state
  const [confirmedOrder, setConfirmedOrder] = useState<any | null>(null);

  const handleApplyCoupon = () => {
    const res = applyCoupon(inputCoupon);
    if (res.success) {
      setCouponAlert({ type: 'success', message: res.message });
    } else {
      setCouponAlert({ type: 'error', message: res.message });
    }
  };

  const handleCompleteOrder = () => {
    const newOrder = placeOrder({
      customerName: fullName,
      customerPhone: `+880 ${mobile}`,
      customerEmail: email,
      location: `${thana}, ${district}`,
      fullAddress: streetAddress,
      paymentMethod,
      total: cartTotal,
      subtotal: cartSubtotal,
      discount: discountAmount,
    });
    setConfirmedOrder(newOrder);
  };

  const getPaymentMethodLabel = () => {
    switch (paymentMethod) {
      case 'cod':
        return 'Cash on Delivery (COD)';
      case 'bkash':
        return 'bKash Instant Checkout';
      case 'nagad':
        return 'Nagad Postal Wallet';
      case 'card':
        return 'SSLCommerz Card Gateway';
    }
  };

  return (
    <div className="w-full bg-[#fff8f8] min-h-screen">
      {/* Progress Breadcrumb */}
      <section className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-12 py-6">
        <div className="flex items-center justify-between flex-wrap gap-4 bg-[#fbf1f3]/70 rounded-full px-6 py-3.5 backdrop-blur-sm shadow-xs border border-[#d6c2c0]/20">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigateTo('shop-catalog')}
              className="flex items-center gap-1.5 text-[#524342] hover:text-[#84504c] transition-colors text-xs sm:text-sm font-medium"
            >
              <span className="material-symbols-outlined text-sm">arrow_back</span>
              <span>Continue Shopping</span>
            </button>
            <span className="text-[#d6c2c0]">/</span>
            <span className="text-xs sm:text-sm text-[#84504c] font-bold tracking-wide uppercase">
              Express Checkout
            </span>
          </div>

          <div className="flex items-center gap-4 sm:gap-6 text-xs sm:text-sm">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#84504c] text-white text-xs flex items-center justify-center font-bold">
                1
              </span>
              <span className="font-semibold text-[#1f1a1c]">Cart &amp; Delivery</span>
            </div>
            <div className="w-8 h-[2px] bg-[#84504c]/20 hidden sm:block"></div>
            <div className="flex items-center gap-2 opacity-70">
              <span className="w-6 h-6 rounded-full bg-[#eae0e2] text-[#524342] text-xs flex items-center justify-center font-bold">
                2
              </span>
              <span className="text-[#524342]">Payment</span>
            </div>
            <div className="w-8 h-[2px] bg-[#84504c]/20 hidden sm:block"></div>
            <div className="flex items-center gap-2 opacity-50">
              <span className="w-6 h-6 rounded-full bg-[#eae0e2] text-[#524342] text-xs flex items-center justify-center font-bold">
                3
              </span>
              <span className="text-[#524342]">Confirmed</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Checkout Workspace */}
      <section className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-12 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT COLUMN: Bag Items & Address Form (7 cols) */}
          <div className="lg:col-span-7 flex flex-col gap-8">
            {/* Bag Review */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-xs border border-[#d6c2c0]/30 space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-[#d6c2c0]/20">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-[#7d562d] font-bold block">
                    Review Basket
                  </span>
                  <h2 className="font-headline text-xl sm:text-2xl font-bold text-[#1f1a1c]">
                    Shopping Bag ({cart.length} items)
                  </h2>
                </div>
                <span className="px-3.5 py-1 rounded-full bg-[#d7e7d1] text-[#111f11] text-xs font-semibold flex items-center gap-1.5 shadow-xs">
                  <span className="material-symbols-outlined text-xs fill">verified</span>
                  100% Genuine Direct Import
                </span>
              </div>

              {/* Free Gift Banner */}
              <div className="bg-[#fbf1f3] rounded-xl p-4 flex items-center gap-3.5 border border-[#d6c2c0]/20">
                <div className="w-10 h-10 rounded-full bg-[#ffdcbd] text-[#2c1600] flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-xl">featured_seasonal_and_gifts</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#7d562d]">Free Luxury Gift Unlocked!</span>
                    <span className="bg-[#84504c]/10 text-[#84504c] text-[10px] font-bold px-2 py-0.5 rounded-full">
                      Orders &gt; ৳3,000
                    </span>
                  </div>
                  <p className="text-[11px] text-[#524342] mt-0.5">
                    Deluxe Sample Rose Cleansing Balm (15ml) has been added to your consignment at no charge.
                  </p>
                </div>
              </div>

              {/* Cart Items List */}
              <div className="divide-y divide-[#d6c2c0]/20">
                {cart.length === 0 ? (
                  <div className="py-8 text-center text-xs text-[#524342]">
                    Your bag is empty.{' '}
                    <button
                      onClick={() => navigateTo('shop-catalog')}
                      className="text-[#84504c] font-bold underline ml-1"
                    >
                      Browse Catalog
                    </button>
                  </div>
                ) : (
                  cart.map(({ product, quantity, selectedShade }) => (
                    <div
                      key={product.id}
                      className="py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-18 h-20 rounded-xl bg-[#fbf1f3] overflow-hidden shrink-0 shadow-xs border border-[#d6c2c0]/20">
                          <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="space-y-1">
                          <span className="text-[10px] uppercase tracking-wider text-[#536251] font-bold block">
                            {product.category}
                          </span>
                          <h3 className="font-headline text-sm font-bold text-[#1f1a1c] leading-snug">
                            {product.name}
                          </h3>
                          <p className="text-[11px] text-[#524342]">
                            {selectedShade ? `Shade: ${selectedShade} • ` : ''}
                            {product.volumeOrSize || 'Standard'} • Sensitive skin compatible
                          </p>
                          <div className="flex items-center gap-2 pt-0.5">
                            <span className="text-sm font-bold text-[#84504c]">
                              ৳{product.price.toLocaleString()}
                            </span>
                            {product.originalPrice && (
                              <span className="text-xs text-[#847371] line-through">
                                ৳{product.originalPrice.toLocaleString()}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Stepper & Delete */}
                      <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4">
                        <div className="flex items-center bg-[#fbf1f3] rounded-full px-2 py-1 shadow-xs border border-[#d6c2c0]/30">
                          <button
                            onClick={() => updateQuantity(product.id, -1)}
                            className="w-6 h-6 rounded-full flex items-center justify-center text-[#524342] hover:bg-white"
                          >
                            <span className="material-symbols-outlined text-xs">remove</span>
                          </button>
                          <span className="text-xs px-2.5 font-bold text-[#1f1a1c]">{quantity}</span>
                          <button
                            onClick={() => updateQuantity(product.id, 1)}
                            className="w-6 h-6 rounded-full flex items-center justify-center text-[#524342] hover:bg-white"
                          >
                            <span className="material-symbols-outlined text-xs">add</span>
                          </button>
                        </div>
                        <button
                          onClick={() => removeFromCart(product.id)}
                          className="p-1.5 rounded-full text-[#847371] hover:text-[#ba1a1a] transition-colors"
                        >
                          <span className="material-symbols-outlined text-lg">delete</span>
                        </button>
                      </div>
                    </div>
                  ))
                )}

                {/* Free Gift Row */}
                <div className="py-3 flex items-center justify-between gap-4 bg-[#fbf1f3]/50 rounded-xl px-4 mt-2">
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-lg bg-white overflow-hidden shrink-0 shadow-xs border border-[#d6c2c0]/20">
                      <img
                        src={ASSETS.freeGiftBalm}
                        alt="Rose cleansing balm"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <span className="text-[9px] uppercase font-bold text-[#84504c] bg-[#ffdad6] px-2 py-0.5 rounded-full">
                        Complimentary Gift
                      </span>
                      <h4 className="text-xs font-bold text-[#1f1a1c] mt-0.5">
                        Deluxe Sample Rose Cleansing Balm (15ml)
                      </h4>
                      <p className="text-[10px] text-[#524342]">Infused with Damascus Rose &amp; Jojoba</p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-xs text-[#847371] line-through mr-1">৳450</span>
                    <span className="text-xs font-bold text-[#536251]">FREE</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Courier Address Form */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-xs border border-[#d6c2c0]/30 space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-[#d6c2c0]/20">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-[#7d562d] font-bold block">
                    Step 2 of 2
                  </span>
                  <h2 className="font-headline text-xl sm:text-2xl font-bold text-[#1f1a1c]">
                    Delivery &amp; Courier Address
                  </h2>
                </div>
                <div className="flex items-center gap-1.5 text-[#536251] text-xs font-semibold">
                  <span className="material-symbols-outlined text-base">local_shipping</span>
                  <span>Steadfast &amp; Pathao Express</span>
                </div>
              </div>

              <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-semibold text-[#1f1a1c] mb-1">
                    Full Recipient Name *
                  </label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#524342] text-lg">
                      person
                    </span>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full bg-[#fbf1f3] pl-11 pr-4 py-2.5 rounded-full text-xs sm:text-sm text-[#1f1a1c] outline-none focus:ring-2 focus:ring-[#c58882]"
                    />
                  </div>
                </div>

                {/* Mobile Numbers */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#1f1a1c] mb-1">
                      Primary Mobile Number (bKash/COD OTP) *
                    </label>
                    <div className="relative flex items-center bg-[#fbf1f3] rounded-full px-4 py-2.5 focus-within:ring-2 focus-within:ring-[#c58882]">
                      <span className="text-xs font-bold text-[#84504c] mr-2">+880</span>
                      <input
                        type="tel"
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value)}
                        className="w-full bg-transparent border-none outline-none text-xs sm:text-sm text-[#1f1a1c]"
                      />
                      <span className="material-symbols-outlined text-[#536251] text-base fill">
                        check_circle
                      </span>
                    </div>
                    <span className="text-[10px] text-[#524342] mt-1 block">
                      Rider will call this number before delivery.
                    </span>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#1f1a1c] mb-1">
                      Alternate Phone <span className="text-[#847371] font-normal">(Optional)</span>
                    </label>
                    <div className="relative flex items-center bg-[#fbf1f3] rounded-full px-4 py-2.5 focus-within:ring-2 focus-within:ring-[#c58882]">
                      <span className="text-xs text-[#524342] mr-2">+880</span>
                      <input
                        type="tel"
                        placeholder="18XXXXXXXX"
                        value={altMobile}
                        onChange={(e) => setAltMobile(e.target.value)}
                        className="w-full bg-transparent border-none outline-none text-xs sm:text-sm text-[#1f1a1c]"
                      />
                    </div>
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs font-semibold text-[#1f1a1c] mb-1">
                    Email Address for Invoice &amp; Live Tracking *
                  </label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#524342] text-lg">
                      mail
                    </span>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-[#fbf1f3] pl-11 pr-4 py-2.5 rounded-full text-xs sm:text-sm text-[#1f1a1c] outline-none focus:ring-2 focus:ring-[#c58882]"
                    />
                  </div>
                </div>

                {/* Division, District, Thana */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#1f1a1c] mb-1">Division *</label>
                    <select
                      value={division}
                      onChange={(e) => setDivision(e.target.value)}
                      className="w-full bg-[#fbf1f3] px-3.5 py-2.5 rounded-full text-xs text-[#1f1a1c] outline-none"
                    >
                      <option>Dhaka Division</option>
                      <option>Chittagong</option>
                      <option>Sylhet</option>
                      <option>Rajshahi</option>
                      <option>Khulna</option>
                      <option>Barisal</option>
                      <option>Rangpur</option>
                      <option>Mymensingh</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#1f1a1c] mb-1">District *</label>
                    <select
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      className="w-full bg-[#fbf1f3] px-3.5 py-2.5 rounded-full text-xs text-[#1f1a1c] outline-none"
                    >
                      <option>Dhaka</option>
                      <option>Gazipur</option>
                      <option>Narayanganj</option>
                      <option>Narsingdi</option>
                      <option>Tangail</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#1f1a1c] mb-1">Thana / Area *</label>
                    <select
                      value={thana}
                      onChange={(e) => setThana(e.target.value)}
                      className="w-full bg-[#fbf1f3] px-3.5 py-2.5 rounded-full text-xs text-[#1f1a1c] outline-none"
                    >
                      <option>Banani / Gulshan</option>
                      <option>Dhanmondi</option>
                      <option>Uttara</option>
                      <option>Mirpur</option>
                      <option>Mohakhali</option>
                      <option>Bashundhara R/A</option>
                    </select>
                  </div>
                </div>

                {/* Full Address */}
                <div>
                  <label className="block text-xs font-semibold text-[#1f1a1c] mb-1">
                    Full Street Address (Holding, Road &amp; Flat No.) *
                  </label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3.5 top-3 text-[#524342] text-lg">
                      home_pin
                    </span>
                    <textarea
                      rows={2}
                      value={streetAddress}
                      onChange={(e) => setStreetAddress(e.target.value)}
                      className="w-full bg-[#fbf1f3] pl-11 pr-4 py-2.5 rounded-2xl text-xs sm:text-sm text-[#1f1a1c] outline-none focus:ring-2 focus:ring-[#c58882]"
                    />
                  </div>
                </div>

                {/* Delivery Instructions */}
                <div>
                  <label className="block text-xs font-semibold text-[#1f1a1c] mb-1">
                    Rider Delivery Instructions{' '}
                    <span className="text-[#847371] font-normal">(Optional)</span>
                  </label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#524342] text-lg">
                      near_me
                    </span>
                    <input
                      type="text"
                      value={instructions}
                      onChange={(e) => setInstructions(e.target.value)}
                      className="w-full bg-[#fbf1f3] pl-11 pr-4 py-2.5 rounded-full text-xs text-[#1f1a1c] outline-none"
                    />
                  </div>
                </div>

                {/* Save Address Checkbox */}
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="save-address-chk"
                    defaultChecked
                    className="w-4 h-4 accent-[#84504c] cursor-pointer"
                  />
                  <label
                    htmlFor="save-address-chk"
                    className="text-xs text-[#524342] cursor-pointer select-none"
                  >
                    Save this address in my Beauty Lounge profile for seamless future orders
                  </label>
                </div>
              </form>
            </div>

            {/* Same-day courier reassurance */}
            <div className="bg-[#f0e6e8]/60 rounded-2xl p-5 flex items-center gap-4 border border-[#d6c2c0]/30">
              <div className="w-12 h-12 rounded-full bg-[#c58882] text-white flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-2xl">electric_moped</span>
              </div>
              <div className="space-y-0.5">
                <h4 className="font-headline text-sm font-bold text-[#1f1a1c]">
                  Dhaka Metro Same-Day / Next-Day Delivery
                </h4>
                <p className="text-xs text-[#524342]">
                  Order confirmed before 2:00 PM is dispatched today via thermal temperature-controlled vanity boxes.
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Summary & Payment (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-6 lg:sticky lg:top-40">
            {/* Order Summary */}
            <div className="bg-white rounded-2xl p-6 sm:p-7 shadow-md border border-[#d6c2c0]/30 space-y-4">
              <h3 className="font-headline text-xl text-[#1f1a1c] font-bold pb-2 border-b border-[#d6c2c0]/20">
                Order Summary
              </h3>

              {/* Coupon input */}
              <div className="space-y-2">
                <label className="block text-[10px] uppercase tracking-wider text-[#524342] font-bold">
                  Promotional Coupon / Privilege Code
                </label>
                <div className="flex items-center bg-[#fbf1f3] rounded-full p-1.5 focus-within:ring-2 focus-within:ring-[#c58882] border border-[#d6c2c0]/30">
                  <span className="material-symbols-outlined text-[#524342] text-base ml-2.5 mr-1">
                    sell
                  </span>
                  <input
                    type="text"
                    value={inputCoupon}
                    onChange={(e) => setInputCoupon(e.target.value)}
                    className="w-full bg-transparent border-none outline-none text-xs font-bold text-[#1f1a1c] uppercase tracking-wider"
                  />
                  <button
                    type="button"
                    onClick={handleApplyCoupon}
                    className="px-4 py-2 rounded-full bg-[#84504c] text-white hover:bg-[#c58882] text-xs font-semibold transition-all shrink-0 shadow-xs"
                  >
                    {discountAmount > 0 ? 'Applied' : 'Apply'}
                  </button>
                </div>
                {couponAlert && (
                  <div
                    className={`flex items-center gap-1.5 text-xs ${
                      couponAlert.type === 'success' ? 'text-[#536251]' : 'text-[#ba1a1a]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-sm">
                      {couponAlert.type === 'success' ? 'check_circle' : 'error'}
                    </span>
                    <span>{couponAlert.message}</span>
                  </div>
                )}
              </div>

              {/* Calculation list */}
              <div className="space-y-3 pt-3 border-t border-[#d6c2c0]/20 text-xs sm:text-sm">
                <div className="flex items-center justify-between text-[#524342]">
                  <span>Subtotal ({cart.length} items)</span>
                  <span className="font-bold text-[#1f1a1c]">৳{cartSubtotal.toLocaleString()}</span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex items-center justify-between text-[#84504c] font-semibold">
                    <span className="flex items-center gap-1">
                      <span>Voucher Discount ({couponCode})</span>
                      <span className="material-symbols-outlined text-xs">loyalty</span>
                    </span>
                    <span>-৳{discountAmount.toLocaleString()}</span>
                  </div>
                )}

                <div className="flex items-center justify-between text-[#524342]">
                  <div className="flex items-center gap-1">
                    <span>Express Courier (Dhaka Metro)</span>
                    <span
                      className="material-symbols-outlined text-xs text-[#847371] cursor-help"
                      title="Flat rate ৳70 within Dhaka"
                    >
                      help_outline
                    </span>
                  </div>
                  <span className="font-bold text-[#1f1a1c]">৳{deliveryFee}</span>
                </div>

                <div className="flex items-center justify-between text-[#524342]">
                  <span>Estimated VAT &amp; SD (Govt. Reg)</span>
                  <span className="text-[10px] uppercase px-2 py-0.5 rounded-full bg-[#f6ebee] text-[#524342] font-bold">
                    Included
                  </span>
                </div>

                {/* Grand Total */}
                <div className="pt-3 border-t border-[#d6c2c0]/30 flex items-baseline justify-between">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-[#7d562d] font-bold block">
                      Total Payable
                    </span>
                    <span className="font-headline text-lg text-[#1f1a1c] font-extrabold">
                      Final Amount
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="font-headline text-2xl sm:text-3xl font-bold text-[#84504c] tracking-tight">
                      ৳{cartTotal.toLocaleString()}
                    </span>
                    <span className="block text-[10px] text-[#524342]">BDT (Bangladeshi Taka)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Select Payment Method */}
            <div className="bg-white rounded-2xl p-6 sm:p-7 shadow-md border border-[#d6c2c0]/30 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-[#d6c2c0]/20">
                <h3 className="font-headline text-lg font-bold text-[#1f1a1c]">
                  Select Payment Method
                </h3>
                <span className="text-xs text-[#536251] flex items-center gap-1 font-semibold">
                  <span className="material-symbols-outlined text-xs">lock</span>
                  100% Encrypted
                </span>
              </div>

              {/* Options */}
              <div className="space-y-3">
                {/* 1. Cash on Delivery */}
                <label
                  onClick={() => setPaymentMethod('cod')}
                  className={`relative flex items-start gap-3.5 p-3.5 rounded-xl cursor-pointer transition-all border ${
                    paymentMethod === 'cod'
                      ? 'bg-[#ffdad6]/25 border-[#84504c]'
                      : 'bg-[#fbf1f3] border-transparent hover:bg-[#f6ebee]'
                  }`}
                >
                  <input
                    type="radio"
                    name="pm"
                    checked={paymentMethod === 'cod'}
                    onChange={() => setPaymentMethod('cod')}
                    className="mt-1 accent-[#84504c]"
                  />
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs sm:text-sm font-bold text-[#1f1a1c]">
                        Cash on Delivery (COD)
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-[#ffdcbd] text-[#2c1600] text-[10px] font-bold">
                        Popular
                      </span>
                    </div>
                    <p className="text-[11px] text-[#524342] leading-relaxed">
                      Pay in cash directly upon physical delivery at your doorstep anywhere in Bangladesh.
                      Inspect the outer authenticity seal before paying.
                    </p>
                  </div>
                </label>

                {/* 2. bKash */}
                <label
                  onClick={() => setPaymentMethod('bkash')}
                  className={`relative flex items-start gap-3.5 p-3.5 rounded-xl cursor-pointer transition-all border ${
                    paymentMethod === 'bkash'
                      ? 'bg-[#ffdad6]/25 border-[#84504c]'
                      : 'bg-[#fbf1f3] border-transparent hover:bg-[#f6ebee]'
                  }`}
                >
                  <input
                    type="radio"
                    name="pm"
                    checked={paymentMethod === 'bkash'}
                    onChange={() => setPaymentMethod('bkash')}
                    className="mt-1 accent-[#84504c]"
                  />
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs sm:text-sm font-bold text-[#1f1a1c]">
                          bKash Online Payment
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-[#E2136E] text-white text-[10px] font-bold">
                          bKash
                        </span>
                      </div>
                      <span className="text-[10px] text-[#536251] font-bold">5% Instant Cashback</span>
                    </div>
                    <p className="text-[11px] text-[#524342] leading-relaxed">
                      Instant redirection to official bKash merchant gateway. Secured by instant OTP and PIN.
                    </p>
                  </div>
                </label>

                {/* 3. Nagad */}
                <label
                  onClick={() => setPaymentMethod('nagad')}
                  className={`relative flex items-start gap-3.5 p-3.5 rounded-xl cursor-pointer transition-all border ${
                    paymentMethod === 'nagad'
                      ? 'bg-[#ffdad6]/25 border-[#84504c]'
                      : 'bg-[#fbf1f3] border-transparent hover:bg-[#f6ebee]'
                  }`}
                >
                  <input
                    type="radio"
                    name="pm"
                    checked={paymentMethod === 'nagad'}
                    onChange={() => setPaymentMethod('nagad')}
                    className="mt-1 accent-[#84504c]"
                  />
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs sm:text-sm font-bold text-[#1f1a1c]">
                          Nagad Digital Payment
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-[#F7931E] text-white text-[10px] font-bold">
                          Nagad
                        </span>
                      </div>
                    </div>
                    <p className="text-[11px] text-[#524342] leading-relaxed">
                      Pay through Bangladesh Postal Department's instant digital wallet gateway.
                    </p>
                  </div>
                </label>

                {/* 4. Cards SSLCommerz */}
                <label
                  onClick={() => setPaymentMethod('card')}
                  className={`relative flex items-start gap-3.5 p-3.5 rounded-xl cursor-pointer transition-all border ${
                    paymentMethod === 'card'
                      ? 'bg-[#ffdad6]/25 border-[#84504c]'
                      : 'bg-[#fbf1f3] border-transparent hover:bg-[#f6ebee]'
                  }`}
                >
                  <input
                    type="radio"
                    name="pm"
                    checked={paymentMethod === 'card'}
                    onChange={() => setPaymentMethod('card')}
                    className="mt-1 accent-[#84504c]"
                  />
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs sm:text-sm font-bold text-[#1f1a1c]">
                        Cards &amp; Net Banking
                      </span>
                      <div className="flex items-center gap-1 text-[10px] text-[#524342] font-semibold">
                        <span>Visa</span> • <span>MC</span> • <span>Amex</span>
                      </div>
                    </div>
                    <p className="text-[11px] text-[#524342] leading-relaxed">
                      Encrypted checkout powered by SSLCommerz PCI-DSS compliant Bangladesh gateway.
                    </p>
                  </div>
                </label>
              </div>

              {/* Complete Order Button */}
              <div className="pt-2">
                <button
                  onClick={handleCompleteOrder}
                  className="w-full py-4 px-6 rounded-full bg-[#84504c] hover:bg-[#c58882] text-white font-bold text-sm sm:text-base shadow-lg shadow-[#84504c]/20 transition-all flex items-center justify-center gap-2 group cursor-pointer"
                >
                  <span>Complete Order (৳{cartTotal.toLocaleString()})</span>
                  <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">
                    arrow_forward
                  </span>
                </button>
                <p className="text-center text-[10px] text-[#524342] mt-2.5">
                  By placing your order, you agree to Beauty Lounge Bangladesh Terms &amp; Authenticity Policy.
                </p>
              </div>

              {/* Trust Badges */}
              <div className="pt-4 grid grid-cols-3 gap-2 text-center border-t border-[#d6c2c0]/20">
                <div className="p-2.5 rounded-xl bg-[#fbf1f3] flex flex-col items-center gap-1">
                  <span className="material-symbols-outlined text-[#84504c] text-xl">shield</span>
                  <span className="text-[10px] font-semibold text-[#1f1a1c] leading-tight">
                    256-bit SSL Protection
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-[#fbf1f3] flex flex-col items-center gap-1">
                  <span className="material-symbols-outlined text-[#7d562d] text-xl">package_2</span>
                  <span className="text-[10px] font-semibold text-[#1f1a1c] leading-tight">
                    Tamper Proof Sealed Box
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-[#fbf1f3] flex flex-col items-center gap-1">
                  <span className="material-symbols-outlined text-[#536251] text-xl">
                    published_with_changes
                  </span>
                  <span className="text-[10px] font-semibold text-[#1f1a1c] leading-tight">
                    7-Day Dhaka Replacement
                  </span>
                </div>
              </div>
            </div>

            {/* Concierge Hotline */}
            <div className="bg-[#fbf1f3] rounded-2xl p-4 flex items-center justify-between gap-3 text-[#524342] border border-[#d6c2c0]/30">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[#84504c] text-2xl">support_agent</span>
                <div>
                  <p className="text-xs font-bold text-[#1f1a1c]">Need help completing order?</p>
                  <p className="text-[11px]">Speak with our Banani Beauty Concierge</p>
                </div>
              </div>
              <a
                href="tel:+8801700232889"
                className="px-3.5 py-1.5 rounded-full bg-white text-[#84504c] text-xs font-bold hover:bg-[#84504c] hover:text-white transition-colors shadow-xs"
              >
                Call Now
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Confirmation Modal Dialog */}
      {confirmedOrder && (
        <div className="fixed inset-0 z-50 bg-[#342f31]/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white max-w-lg w-full rounded-2xl p-6 sm:p-8 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setConfirmedOrder(null)}
              className="absolute top-5 right-5 p-2 rounded-full hover:bg-[#f6ebee] text-[#524342]"
            >
              <span className="material-symbols-outlined text-xl">close</span>
            </button>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#d7e7d1] text-[#111f11] mx-auto flex items-center justify-center shadow-md">
                <span className="material-symbols-outlined text-3xl fill">done_all</span>
              </div>

              <div>
                <span className="text-[10px] uppercase tracking-widest text-[#536251] font-bold">
                  Order Received &amp; Dispatched
                </span>
                <h2 className="font-headline text-2xl font-bold text-[#1f1a1c]">
                  Shukriya, {fullName}!
                </h2>
                <p className="text-xs text-[#524342] mt-1">
                  Your luxury consignment has been logged under Order ID:{' '}
                  <strong className="text-[#1f1a1c]">#{confirmedOrder.id}</strong>
                </p>
              </div>

              {/* Receipt Snapshot */}
              <div className="bg-[#fbf1f3] rounded-xl p-4 text-left space-y-2 text-xs">
                <div className="flex justify-between items-center text-[#524342]">
                  <span>Payment Mode:</span>
                  <span className="font-semibold text-[#1f1a1c]">{getPaymentMethodLabel()}</span>
                </div>
                <div className="flex justify-between items-center text-[#524342]">
                  <span>Delivery Destination:</span>
                  <span className="font-semibold text-[#1f1a1c] text-right">{thana}, Dhaka</span>
                </div>
                <div className="flex justify-between items-center text-[#524342]">
                  <span>Total Payable:</span>
                  <span className="font-headline text-base text-[#84504c] font-bold">
                    ৳{confirmedOrder.total.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center text-[#524342]">
                  <span>Estimated Courier Handover:</span>
                  <span className="font-semibold text-[#536251]">Tomorrow by 4:00 PM</span>
                </div>
              </div>

              <div className="bg-[#f6ebee] p-3 rounded-xl flex items-center gap-3 text-left">
                <span className="material-symbols-outlined text-[#84504c] text-xl">sms</span>
                <p className="text-[11px] text-[#524342]">
                  SMS with real-time Steadfast tracking link sent to{' '}
                  <strong className="text-[#1f1a1c]">+880 {mobile}</strong>.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={() => {
                    setConfirmedOrder(null);
                    navigateTo('customer-account');
                  }}
                  className="flex-1 py-3 px-4 rounded-full bg-[#84504c] hover:bg-[#c58882] text-white text-xs font-bold text-center transition-colors shadow-sm"
                >
                  Track My Order
                </button>
                <button
                  onClick={() => {
                    setConfirmedOrder(null);
                    navigateTo('shop-catalog');
                  }}
                  className="flex-1 py-3 px-4 rounded-full bg-[#eae0e2] hover:bg-[#d6c2c0] text-[#1f1a1c] text-xs font-semibold transition-colors"
                >
                  Back to Catalog
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
