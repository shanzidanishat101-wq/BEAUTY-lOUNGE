import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';

export const QuickViewModal: React.FC = () => {
  const {
    quickViewProduct,
    setQuickViewProduct,
    addToCart,
    cart,
    removeFromCart,
    isInWishlist,
    toggleWishlist,
    isAdminAuthenticated,
    deleteProduct,
    showToast,
  } = useStore();

  const [selectedShade, setSelectedShade] = useState<string | undefined>(
    quickViewProduct?.shades ? quickViewProduct.shades[0].name : undefined
  );
  const [quantity, setQuantity] = useState(1);

  if (!quickViewProduct) return null;

  const isLiked = isInWishlist(quickViewProduct.id);
  const isInBag = cart.some((item) => item.product.id === quickViewProduct.id);

  const handleAddToCart = () => {
    addToCart(quickViewProduct, quantity, selectedShade);
    setQuickViewProduct(null);
  };

  const handleRemoveFromCart = () => {
    removeFromCart(quickViewProduct.id);
    showToast(`Removed "${quickViewProduct.name}" from shopping bag.`);
  };

  const handleDeleteByAdmin = () => {
    if (window.confirm(`Admin: Delete "${quickViewProduct.name}" from store catalog permanently?`)) {
      deleteProduct(quickViewProduct.id);
      setQuickViewProduct(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-[#1e0f15] max-w-2xl w-full rounded-3xl p-6 sm:p-8 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200 my-8 text-[#1e1315] dark:text-[#fdebed] border border-[#e2b7bf]/50 dark:border-[#4a2834]">
        <button
          onClick={() => setQuickViewProduct(null)}
          aria-label="Close modal"
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-[#fff2f4] dark:hover:bg-[#28141c] text-[#593f44] dark:text-[#d6b4bd] transition-colors"
        >
          <span className="material-symbols-outlined text-xl">close</span>
        </button>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-start">
          {/* Media preview */}
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-[#fff2f4] dark:bg-[#28141c]">
            <img
              src={quickViewProduct.imageUrl}
              alt={quickViewProduct.name}
              className="w-full h-full object-cover"
            />
            {quickViewProduct.badge && (
              <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-[#9e3544] text-white text-[10px] font-bold uppercase tracking-wider shadow-sm">
                {quickViewProduct.badge}
              </span>
            )}
            <button
              onClick={() => toggleWishlist(quickViewProduct.id)}
              className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 dark:bg-[#1e0f15]/90 backdrop-blur-sm flex items-center justify-center text-[#593f44] dark:text-[#d6b4bd] hover:text-[#9e3544] dark:hover:text-[#f27284] shadow-sm transition-colors"
            >
              <span className={`material-symbols-outlined text-lg ${isLiked ? 'text-[#9e3544] dark:text-[#f27284] fill' : ''}`}>
                favorite
              </span>
            </button>

            {/* In stock tag */}
            <div className="absolute bottom-3 left-3">
              <span className="px-2.5 py-0.5 rounded-full bg-white/90 dark:bg-[#1e0f15]/90 backdrop-blur-md text-[10px] font-bold text-[#4d644d] dark:text-[#83a083] shadow-xs">
                {quickViewProduct.stockCount > 0 ? `In Stock (${quickViewProduct.stockCount} units)` : 'Out of Stock'}
              </span>
            </div>
          </div>

          {/* Details */}
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs uppercase tracking-wider text-[#8c5324] dark:text-[#fbc698] font-bold">
                  {quickViewProduct.category}
                </span>
                <span className="text-xs text-[#593f44]">·</span>
                <span className="text-xs text-[#4d644d] dark:text-[#83a083] font-semibold">100% Authentic BD</span>
              </div>
              <h2 className="font-headline text-xl font-bold leading-snug">
                {quickViewProduct.name}
              </h2>
              {quickViewProduct.subtitle && (
                <p className="text-xs text-[#593f44] dark:text-[#d6b4bd] mt-1 leading-relaxed">
                  {quickViewProduct.subtitle}
                </p>
              )}

              <div className="flex items-center gap-1.5 mt-2">
                <div className="flex text-[#8c5324] dark:text-[#fbc698] text-sm">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="material-symbols-outlined text-sm fill">
                      star
                    </span>
                  ))}
                </div>
                <span className="text-xs font-bold">{quickViewProduct.rating}</span>
                <span className="text-xs text-[#593f44] dark:text-[#d6b4bd]">
                  ({quickViewProduct.reviewCount} Bangladeshi reviews)
                </span>
              </div>
            </div>

            {/* Pricing */}
            <div className="flex items-baseline gap-2.5">
              <span className="font-headline text-2xl font-bold text-[#9e3544] dark:text-[#f27284]">
                ৳{quickViewProduct.price.toLocaleString()}
              </span>
              {quickViewProduct.originalPrice && (
                <span className="text-xs text-[#8c6d73] line-through">
                  ৳{quickViewProduct.originalPrice.toLocaleString()}
                </span>
              )}
              {quickViewProduct.volumeOrSize && (
                <span className="text-xs text-[#593f44] dark:text-[#d6b4bd] font-medium ml-1">
                  ({quickViewProduct.volumeOrSize})
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-xs text-[#593f44] dark:text-[#d6b4bd] leading-relaxed line-clamp-3">
              {quickViewProduct.description}
            </p>

            {/* Shades selector if available */}
            {quickViewProduct.shades && quickViewProduct.shades.length > 0 && (
              <div>
                <span className="text-[10px] uppercase font-bold text-[#593f44] dark:text-[#d6b4bd] block mb-1.5 tracking-wider">
                  Shade Selection
                </span>
                <div className="flex items-center gap-2">
                  {quickViewProduct.shades.map((shade) => (
                    <button
                      key={shade.name}
                      onClick={() => setSelectedShade(shade.name)}
                      className={`w-7 h-7 rounded-full border-2 transition-all cursor-pointer ${
                        selectedShade === shade.name
                          ? 'border-[#9e3544] scale-110'
                          : 'border-white dark:border-[#4a2834]'
                      }`}
                      style={{ backgroundColor: shade.hex }}
                      title={shade.name}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Key Actives */}
            <div>
              <span className="text-[10px] uppercase font-bold text-[#593f44] dark:text-[#d6b4bd] block mb-1.5 tracking-wider">
                Key Formulation Actives
              </span>
              <div className="flex flex-wrap gap-1.5">
                {quickViewProduct.actives.map((act) => (
                  <span
                    key={act}
                    className="px-2.5 py-0.5 rounded-full bg-[#fff2f4] dark:bg-[#28141c] text-[11px] text-[#593f44] dark:text-[#d6b4bd] font-medium"
                  >
                    {act}
                  </span>
                ))}
              </div>
            </div>

            {/* Quantity and Actions */}
            <div className="space-y-3 pt-3">
              <div className="flex items-center gap-3">
                <div className="flex items-center bg-[#fff2f4] dark:bg-[#28141c] rounded-full px-2 py-1 shadow-xs border border-[#e2b7bf]/30 dark:border-[#4a2834]">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-7 h-7 rounded-full flex items-center justify-center text-[#593f44] dark:text-[#d6b4bd] hover:bg-white dark:hover:bg-[#1e0f15] transition-colors"
                  >
                    <span className="material-symbols-outlined text-sm">remove</span>
                  </button>
                  <span className="px-3 text-sm font-semibold">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-7 h-7 rounded-full flex items-center justify-center text-[#593f44] dark:text-[#d6b4bd] hover:bg-white dark:hover:bg-[#1e0f15] transition-colors"
                  >
                    <span className="material-symbols-outlined text-sm">add</span>
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  className="flex-1 py-3 px-6 rounded-full bg-[#9e3544] hover:bg-[#852c38] text-white text-xs sm:text-sm font-bold shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-base">shopping_bag</span>
                  <span>Add to Bag • ৳{(quickViewProduct.price * quantity).toLocaleString()}</span>
                </button>
              </div>

              {/* In-cart remove option or Admin quick remove */}
              <div className="flex items-center justify-between pt-1 text-xs">
                {isInBag ? (
                  <button
                    onClick={handleRemoveFromCart}
                    className="text-[#ba1a1a] hover:underline flex items-center gap-1 font-semibold"
                  >
                    <span className="material-symbols-outlined text-sm">remove_shopping_cart</span>
                    <span>Remove from Shopping Bag</span>
                  </button>
                ) : (
                  <span className="text-[11px] text-[#593f44] dark:text-[#d6b4bd]">
                    Free nationwide shipping over ৳2,500
                  </span>
                )}

                {isAdminAuthenticated && (
                  <button
                    onClick={handleDeleteByAdmin}
                    className="text-[#ba1a1a] hover:underline font-bold flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-sm">delete_forever</span>
                    <span>Admin: Delete Product</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
