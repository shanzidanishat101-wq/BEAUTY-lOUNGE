import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { Product } from '../types';
import { ASSETS } from '../data/mockData';

interface ProductManageModalProps {
  isOpen: boolean;
  onClose: () => void;
  productToEdit?: Product | null;
}

export const ProductManageModal: React.FC<ProductManageModalProps> = ({
  isOpen,
  onClose,
  productToEdit,
}) => {
  const { addProduct, updateProduct, showToast } = useStore();

  const [name, setName] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [category, setCategory] = useState<Product['category']>('Skincare');
  const [price, setPrice] = useState<number>(1850);
  const [originalPrice, setOriginalPrice] = useState<number>(2200);
  const [stockCount, setStockCount] = useState<number>(45);
  const [volumeOrSize, setVolumeOrSize] = useState('50ml');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [badge, setBadge] = useState('New Launch');
  const [activesStr, setActivesStr] = useState('Hyaluronic Acid, Vitamin C');
  const [inStock, setInStock] = useState(true);
  const [isMonsoonProof, setIsMonsoonProof] = useState(true);
  const [isEidExclusive, setIsEidExclusive] = useState(false);

  useEffect(() => {
    if (productToEdit) {
      setName(productToEdit.name);
      setSubtitle(productToEdit.subtitle || '');
      setCategory(productToEdit.category);
      setPrice(productToEdit.price);
      setOriginalPrice(productToEdit.originalPrice || Math.round(productToEdit.price * 1.2));
      setStockCount(productToEdit.stockCount);
      setVolumeOrSize(productToEdit.volumeOrSize || '30ml');
      setDescription(productToEdit.description);
      setImageUrl(productToEdit.imageUrl);
      setBadge(productToEdit.badge || '');
      setActivesStr((productToEdit.actives || []).join(', '));
      setInStock(productToEdit.inStock);
      setIsMonsoonProof(Boolean(productToEdit.isMonsoonProof));
      setIsEidExclusive(Boolean(productToEdit.isEidExclusive));
    } else {
      // Default initial form
      setName('');
      setSubtitle('');
      setCategory('Skincare');
      setPrice(1850);
      setOriginalPrice(2200);
      setStockCount(50);
      setVolumeOrSize('50ml');
      setDescription('Dermatologically tested authentic formulation crafted for Bangladeshi humid climate.');
      setImageUrl(ASSETS.categorySkincare);
      setBadge('Bestseller');
      setActivesStr('Niacinamide, Centella Asiatica, Zinc');
      setInStock(true);
      setIsMonsoonProof(true);
      setIsEidExclusive(false);
    }
  }, [productToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast('Please enter a product name');
      return;
    }

    const actives = activesStr
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const payload: Omit<Product, 'id'> = {
      name: name.trim(),
      subtitle: subtitle.trim() || undefined,
      category,
      price: Number(price),
      originalPrice: originalPrice ? Number(originalPrice) : undefined,
      stockCount: Number(stockCount),
      volumeOrSize: volumeOrSize.trim() || undefined,
      description: description.trim(),
      imageUrl: imageUrl.trim() || ASSETS.categorySkincare,
      badge: badge.trim() || undefined,
      actives: actives.length > 0 ? actives : ['Natural Botanical Extracts'],
      targetSkinTypes: ['All Skin Types', 'Sensitive', 'Humid-Resistant'],
      rating: productToEdit ? productToEdit.rating : 4.9,
      reviewCount: productToEdit ? productToEdit.reviewCount : 12,
      inStock: Boolean(inStock && Number(stockCount) > 0),
      isMonsoonProof: Boolean(isMonsoonProof),
      isEidExclusive: Boolean(isEidExclusive),
      isBestseller: badge === 'Bestseller',
      locationStock: 'Ready for 24h Dhaka Dispatch',
    };

    if (productToEdit) {
      updateProduct(productToEdit.id, payload);
    } else {
      addProduct(payload);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white dark:bg-[#1e0f15] rounded-3xl p-6 sm:p-8 border border-[#e2b7bf]/60 dark:border-[#4a2834] shadow-2xl my-8 text-[#1e1315] dark:text-[#fdebed]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#e2b7bf]/30 dark:border-[#4a2834]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#fde5e9] dark:bg-[#351a24] text-[#9e3544] dark:text-[#f27284] flex items-center justify-center font-bold">
              <span className="material-symbols-outlined text-xl">
                {productToEdit ? 'edit_note' : 'add_box'}
              </span>
            </div>
            <div>
              <h2 className="font-headline text-xl sm:text-2xl font-bold">
                {productToEdit ? 'Edit Product Specification' : 'Add New Cosmetic to Catalog'}
              </h2>
              <p className="text-xs text-[#593f44] dark:text-[#d6b4bd]">
                {productToEdit
                  ? `Editing SKU ID: ${productToEdit.id}`
                  : 'Enter verified formulation specs, batch pricing, and stock count.'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-[#fff2f4] dark:hover:bg-[#28141c] text-[#8c6d73] dark:text-[#d6b4bd] transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Product Name */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold mb-1">
                Product Title / পণ্যের নাম <span className="text-[#ba1a1a]">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Centella Calming Water Gel Moisturizer"
                className="w-full bg-[#fff2f4] dark:bg-[#28141c] border border-transparent focus:border-[#9e3544] dark:focus:border-[#f27284] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm outline-none transition-all"
              />
            </div>

            {/* Subtitle */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold mb-1">
                Subtitle / Formulated Benefits
              </label>
              <input
                type="text"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="e.g. Oil-free barrier repair for humid Dhaka summers"
                className="w-full bg-[#fff2f4] dark:bg-[#28141c] border border-transparent focus:border-[#9e3544] dark:focus:border-[#f27284] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm outline-none transition-all"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-xs font-bold mb-1">Category / ক্যাটাগরি</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as Product['category'])}
                className="w-full bg-[#fff2f4] dark:bg-[#28141c] border border-transparent focus:border-[#9e3544] dark:focus:border-[#f27284] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm outline-none transition-all"
              >
                <option value="Skincare">Skincare (স্কিনকেয়ার)</option>
                <option value="Makeup">Makeup (মেকআপ)</option>
                <option value="Sun Protection">Sun Protection (সানস্ক্রিন)</option>
                <option value="Haircare">Haircare (হেয়ারকেয়ার)</option>
                <option value="Fragrance">Fragrance (পারফিউম)</option>
                <option value="Accessories">Accessories (এক্সেসরিজ)</option>
              </select>
            </div>

            {/* Volume / Size */}
            <div>
              <label className="block text-xs font-bold mb-1">Volume / Size</label>
              <input
                type="text"
                value={volumeOrSize}
                onChange={(e) => setVolumeOrSize(e.target.value)}
                placeholder="e.g. 50ml or 100g"
                className="w-full bg-[#fff2f4] dark:bg-[#28141c] border border-transparent focus:border-[#9e3544] dark:focus:border-[#f27284] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm outline-none transition-all"
              />
            </div>

            {/* Price (BDT) */}
            <div>
              <label className="block text-xs font-bold mb-1">
                Sale Price (৳ BDT) <span className="text-[#ba1a1a]">*</span>
              </label>
              <input
                type="number"
                required
                min="0"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full bg-[#fff2f4] dark:bg-[#28141c] border border-transparent focus:border-[#9e3544] dark:focus:border-[#f27284] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm outline-none transition-all"
              />
            </div>

            {/* Original Price */}
            <div>
              <label className="block text-xs font-bold mb-1">Original Price (৳ MRP)</label>
              <input
                type="number"
                min="0"
                value={originalPrice}
                onChange={(e) => setOriginalPrice(Number(e.target.value))}
                className="w-full bg-[#fff2f4] dark:bg-[#28141c] border border-transparent focus:border-[#9e3544] dark:focus:border-[#f27284] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm outline-none transition-all"
              />
            </div>

            {/* Stock Count */}
            <div>
              <label className="block text-xs font-bold mb-1">
                Stock Quantity (মজুদ সংখ্যা)
              </label>
              <input
                type="number"
                min="0"
                value={stockCount}
                onChange={(e) => setStockCount(Number(e.target.value))}
                className="w-full bg-[#fff2f4] dark:bg-[#28141c] border border-transparent focus:border-[#9e3544] dark:focus:border-[#f27284] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm outline-none transition-all"
              />
            </div>

            {/* Badge */}
            <div>
              <label className="block text-xs font-bold mb-1">Badge Tag</label>
              <select
                value={badge}
                onChange={(e) => setBadge(e.target.value)}
                className="w-full bg-[#fff2f4] dark:bg-[#28141c] border border-transparent focus:border-[#9e3544] dark:focus:border-[#f27284] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm outline-none transition-all"
              >
                <option value="Bestseller">Bestseller (সেরা বিক্রয়)</option>
                <option value="New Launch">New Launch</option>
                <option value="BSTI Lab Tested">BSTI Lab Tested</option>
                <option value="Eid Exclusive">Eid Exclusive</option>
                <option value="Limited Batch">Limited Batch</option>
                <option value="">None</option>
              </select>
            </div>

            {/* Image URL */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold mb-1">Product Image URL</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://..."
                  className="flex-1 bg-[#fff2f4] dark:bg-[#28141c] border border-transparent focus:border-[#9e3544] dark:focus:border-[#f27284] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm outline-none transition-all font-mono"
                />
                <button
                  type="button"
                  onClick={() => setImageUrl(ASSETS.categorySkincare)}
                  className="px-3 py-2 rounded-xl bg-[#fde5e9] dark:bg-[#351a24] text-[11px] font-bold text-[#9e3544] dark:text-[#f27284] hover:bg-[#fad0d7] transition-colors shrink-0"
                >
                  Preset Image
                </button>
              </div>
            </div>

            {/* Actives */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold mb-1">
                Active Dermatological Ingredients (কমা দিয়ে লিখুন)
              </label>
              <input
                type="text"
                value={activesStr}
                onChange={(e) => setActivesStr(e.target.value)}
                placeholder="e.g. Niacinamide 10%, Zinc PCA, Hyaluronic Acid"
                className="w-full bg-[#fff2f4] dark:bg-[#28141c] border border-transparent focus:border-[#9e3544] dark:focus:border-[#f27284] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm outline-none transition-all"
              />
            </div>

            {/* Description */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold mb-1">Description / বিবরণ</label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-[#fff2f4] dark:bg-[#28141c] border border-transparent focus:border-[#9e3544] dark:focus:border-[#f27284] rounded-xl p-3 text-xs sm:text-sm outline-none transition-all"
              />
            </div>
          </div>

          {/* Checkboxes */}
          <div className="pt-2 flex flex-wrap items-center gap-5 text-xs">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={inStock}
                onChange={(e) => setInStock(e.target.checked)}
                className="rounded border-[#e2b7bf] text-[#9e3544] focus:ring-[#9e3544] h-4 w-4"
              />
              <span className="font-semibold">In Stock &amp; Active (মজুদ সক্রিয়)</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isMonsoonProof}
                onChange={(e) => setIsMonsoonProof(e.target.checked)}
                className="rounded border-[#e2b7bf] text-[#9e3544] focus:ring-[#9e3544] h-4 w-4"
              />
              <span className="font-semibold">Monsoon Humidity Proof (আর্দ্রতা-প্রতিরোধী)</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isEidExclusive}
                onChange={(e) => setIsEidExclusive(e.target.checked)}
                className="rounded border-[#e2b7bf] text-[#9e3544] focus:ring-[#9e3544] h-4 w-4"
              />
              <span className="font-semibold">Eid Exclusive (ঈদ স্পেশাল)</span>
            </label>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-[#e2b7bf]/30 dark:border-[#4a2834] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-full border border-[#e2b7bf] dark:border-[#4a2834] text-xs font-bold text-[#593f44] dark:text-[#d6b4bd] hover:bg-[#fff2f4] dark:hover:bg-[#28141c] transition-colors"
            >
              Cancel (বাতিল)
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-full bg-[#9e3544] hover:bg-[#852c38] text-white text-xs font-bold shadow-md flex items-center gap-2 transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">
                {productToEdit ? 'check' : 'add'}
              </span>
              <span>{productToEdit ? 'Save Changes' : 'Create Product'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
