import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';

export const BatchImportModal: React.FC = () => {
  const { isBatchImportOpen, setIsBatchImportOpen, showToast, products } = useStore();
  const [selectedProductId, setSelectedProductId] = useState(products[0]?.id || '');
  const [batchNo, setBatchNo] = useState('BD-IMP-2024-912');
  const [customsCert, setCustomsCert] = useState('CUSTOMS-CG-24-88412');
  const [quantity, setQuantity] = useState(50);
  const [destinationHub, setDestinationHub] = useState('Banani Central Warehouse');

  if (!isBatchImportOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const product = products.find((p) => p.id === selectedProductId);
    showToast(`Successfully logged import batch for ${product ? product.name : 'SKU'} (+${quantity} units)`);
    setIsBatchImportOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#342f31]/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white max-w-lg w-full rounded-2xl p-6 sm:p-8 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={() => setIsBatchImportOpen(false)}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-[#f6ebee] text-[#524342]"
        >
          <span className="material-symbols-outlined text-xl">close</span>
        </button>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#84504c]">inventory</span>
            <div>
              <h3 className="font-headline text-lg font-bold text-[#1f1a1c]">
                Quick Add / Import Consignment Batch
              </h3>
              <p className="text-xs text-[#524342]">
                Log verified customs clearance and restock warehouse
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-[#1f1a1c] mb-1">
                Select Product / SKU *
              </label>
              <select
                value={selectedProductId}
                onChange={(e) => setSelectedProductId(e.target.value)}
                className="w-full bg-[#fbf1f3] px-3.5 py-2.5 rounded-xl text-xs sm:text-sm text-[#1f1a1c] outline-none focus:ring-2 focus:ring-[#c58882]"
              >
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.volumeOrSize || 'Standard'}) - ৳{p.price}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#1f1a1c] mb-1">
                  Batch Clearance No.
                </label>
                <input
                  type="text"
                  value={batchNo}
                  onChange={(e) => setBatchNo(e.target.value)}
                  className="w-full bg-[#fbf1f3] px-3.5 py-2.5 rounded-xl text-xs text-[#1f1a1c] outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#1f1a1c] mb-1">
                  Customs Cert ID
                </label>
                <input
                  type="text"
                  value={customsCert}
                  onChange={(e) => setCustomsCert(e.target.value)}
                  className="w-full bg-[#fbf1f3] px-3.5 py-2.5 rounded-xl text-xs text-[#1f1a1c] outline-none"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#1f1a1c] mb-1">
                  Quantity (Units)
                </label>
                <input
                  type="number"
                  min="1"
                  max="1000"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="w-full bg-[#fbf1f3] px-3.5 py-2.5 rounded-xl text-xs text-[#1f1a1c] outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#1f1a1c] mb-1">
                  Destination Warehouse
                </label>
                <select
                  value={destinationHub}
                  onChange={(e) => setDestinationHub(e.target.value)}
                  className="w-full bg-[#fbf1f3] px-3.5 py-2.5 rounded-xl text-xs text-[#1f1a1c] outline-none"
                >
                  <option>Banani Central Warehouse</option>
                  <option>Uttara Fulfillment Depot</option>
                  <option>Chittagong Nasirabad Hub</option>
                  <option>Sylhet Zindabazar Hub</option>
                </select>
              </div>
            </div>

            <div className="p-3 bg-[#d7e7d1]/50 rounded-xl flex items-center gap-2 text-xs text-[#111f11]">
              <span className="material-symbols-outlined text-sm">verified_user</span>
              <span>Batch will be marked as BSTI & Customs Verified for Bangladeshi buyers.</span>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsBatchImportOpen(false)}
                className="px-4 py-2 rounded-full text-xs text-[#524342] hover:bg-[#f6ebee]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-full bg-[#84504c] text-white text-xs font-bold hover:bg-[#c58882] transition-colors"
              >
                Log Batch & Restock
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
