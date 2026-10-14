import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';

export const QuickViewModal: React.FC = () => {
  const { quickViewProduct, setQuickViewProduct, addToCart, isInWishlist, toggleWishlist } = useStore();
  const [selectedShade, setSelectedShade] = useState<string | undefined>(
    quickViewProduct?.shades ? quickViewProduct.shades[0].name : undefined
  );
  const [quantity, setQuantity] = useState(1);

  if (!quickViewProduct) return null;

  const isLiked = isInWishlist(quickViewProduct.id);

  const handleAddToCart = () => {
    addToCart(quickViewProduct, quantity, selectedShade);
    setQuickViewProduct(null);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#342f31]/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white max-w-2xl w-full rounded-2xl p-6 sm:p-8 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
        <button
          onClick={() => setQuickViewProduct(null)}
          aria-label="Close modal"
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-[#f6ebee] text-[#524342] transition-colors"
        >
          <span className="material-symbols-outlined text-xl">close</span>
        </button>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-start">
          {/* Media preview */}
          <div className="relative aspect-square rounded-xl overflow-hidden bg-[#fbf1f3]">
            <img
              src={quickViewProduct.imageUrl}
              alt={quickViewProduct.name}
              className="w-full h-full object-cover"
            />
            {quickViewProduct.badge && (
              <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-[#84504c] text-white text-xs font-bold uppercase tracking-wider shadow-sm">
                {quickViewProduct.badge}
              </span>
            )}
            <button
              onClick={() => toggleWishlist(quickViewProduct.id)}
              className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-[#524342] hover:text-[#84504c] shadow-sm transition-colors"
            >
              <span className={`material-symbols-outlined text-lg ${isLiked ? 'text-[#84504c] fill' : ''}`}>
                favorite
              </span>
            </button>
          </div>

          {/* Details */}
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs uppercase tracking-wider text-[#7d562d] font-bold">
                  {quickViewProduct.category}
                </span>
                <span className="text-xs text-[#524342]">·</span>
                <span className="text-xs text-[#536251] font-semibold">100% Authentic BD</span>
              </div>
              <h2 className="font-headline text-xl text-[#1f1a1c] font-bold leading-snug">
                {quickViewProduct.name}
              </h2>
              <div className="flex items-center gap-1.5 mt-2">
                <div className="flex text-[#7d562d] text-sm">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="material-symbols-outlined text-sm fill">
                      star
                    </span>
                  ))}
                </div>
                <span className="text-xs font-bold text-[#1f1a1c]">{quickViewProduct.rating}</span>
                <span className="text-xs text-[#524342]">({quickViewProduct.reviewCount} reviews)</span>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-2 pt-1 border-t border-[#d6c2c0]/30">
              <span className="font-headline text-2xl text-[#84504c] font-bold">
                ৳{quickViewProduct.price.toLocaleString()}
              </span>
              {quickViewProduct.originalPrice && (
                <span className="text-sm text-[#847371] line-through">
                  ৳{quickViewProduct.originalPrice.toLocaleString()}
                </span>
              )}
              {quickViewProduct.volumeOrSize && (
                <span className="ml-auto text-xs px-2.5 py-0.5 rounded-full bg-[#fbf1f3] text-[#524342] font-medium">
                  {quickViewProduct.volumeOrSize}
                </span>
              )}
            </div>

            <p className="text-xs sm:text-sm text-[#524342] leading-relaxed">
              {quickViewProduct.description}
            </p>

            {/* Shades selector if available */}
            {quickViewProduct.shades && (
              <div className="space-y-2">
                <span className="text-xs text-[#524342] font-semibold block">
                  Select Shade: <span className="text-[#1f1a1c]">{selectedShade}</span>
                </span>
                <div className="flex items-center gap-2">
                  {quickViewProduct.shades.map((shade) => (
                    <button
                      key={shade.name}
                      onClick={() => setSelectedShade(shade.name)}
                      className={`w-6 h-6 rounded-full transition-all ${
                        selectedShade === shade.name
                          ? 'ring-2 ring-[#84504c] ring-offset-2 scale-110'
                          : 'opacity-80 hover:opacity-100'
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
              <span className="text-[10px] uppercase font-bold text-[#524342] block mb-1.5 tracking-wider">
                Key Actives
              </span>
              <div className="flex flex-wrap gap-1.5">
                {quickViewProduct.actives.map((act) => (
                  <span
                    key={act}
                    className="px-2.5 py-0.5 rounded-full bg-[#f6ebee] text-[11px] text-[#524342]"
                  >
                    {act}
                  </span>
                ))}
              </div>
            </div>

            {/* Quantity and Add to Bag */}
            <div className="flex items-center gap-3 pt-3">
              <div className="flex items-center bg-[#fbf1f3] rounded-full px-2 py-1 shadow-sm">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-7 h-7 rounded-full flex items-center justify-center text-[#524342] hover:bg-white transition-colors"
                >
                  <span className="material-symbols-outlined text-sm">remove</span>
                </button>
                <span className="px-3 text-sm font-semibold text-[#1f1a1c]">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-7 h-7 rounded-full flex items-center justify-center text-[#524342] hover:bg-white transition-colors"
                >
                  <span className="material-symbols-outlined text-sm">add</span>
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                className="flex-1 py-3 px-6 rounded-full bg-[#84504c] hover:bg-[#c58882] text-white text-sm font-bold shadow-md transition-all flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-base">shopping_bag</span>
                <span>Add to Bag • ৳{(quickViewProduct.price * quantity).toLocaleString()}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
