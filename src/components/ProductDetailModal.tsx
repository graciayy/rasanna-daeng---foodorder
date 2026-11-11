import React, { useState } from 'react';
import { X, Minus, Plus, ShoppingBag } from 'lucide-react';
import { Product } from '../types/index.ts';
import { formatRupiah } from '../utils/format.ts';
import { useCart } from '../context/CartContext.tsx';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ product, onClose }) => {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');

  if (!product) return null;

  const handleAdd = () => {
    addToCart(product, quantity, notes);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#3B1209]/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-lg bg-[#FFFDF9] rounded-2xl border border-[#E5D9CC] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-[#FFFDF9]/80 backdrop-blur-md text-[#3B1209] hover:bg-[#5B1F11] hover:text-white flex items-center justify-center transition-colors"
          aria-label="Tutup detail produk"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Scrollable Content */}
        <div className="overflow-y-auto">
          {/* Main Photo */}
          <div className="relative aspect-[16/10] w-full bg-[#FBF6EE]">
            <img
              src={product.imageUrl}
              alt={product.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = '/logo_rasanna_daeng.svg';
              }}
            />
            {product.tag && (
              <span className="absolute bottom-3 left-3 text-xs font-semibold px-3 py-1 rounded-full bg-[#5B1F11]/90 text-[#FBF6EE] backdrop-blur-xs shadow-sm">
                {product.tag}
              </span>
            )}
          </div>

          <div className="p-6 space-y-5">
            <div>
              <span className="text-xs font-semibold text-[#B36633] uppercase tracking-wider block mb-1">
                {product.categoryName || 'Kuliner Otentik'}
              </span>
              <h2 className="font-serif text-2xl font-bold text-[#3B1209] leading-tight">
                {product.name}
              </h2>
              <p className="text-xl font-bold text-[#5B1F11] mt-2 tabular-nums">
                {formatRupiah(product.price)}
              </p>
            </div>

            <div className="text-sm text-[#3F302A] leading-relaxed bg-[#FBF6EE] p-4 rounded-xl border border-[#E5D9CC]">
              <p>{product.description}</p>
            </div>

            {/* Special Instructions */}
            <div>
              <label className="block text-xs font-semibold text-[#3B1209] mb-1.5">
                Catatan Khusus (Opsional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Contoh: Kuah dipisah, jangan terlalu pedas, tambah jeruk nipis..."
                rows={2}
                className="w-full text-xs p-3 rounded-xl border border-[#E5D9CC] bg-[#FFFDF9] focus:outline-none focus:border-[#B36633] focus:ring-1 focus:ring-[#B36633]"
              />
            </div>

            {/* Quantity Stepper */}
            <div className="flex items-center justify-between pt-2">
              <span className="text-xs font-semibold text-[#3B1209]">Jumlah Porsi</span>
              <div className="flex items-center gap-3 border border-[#E5D9CC] rounded-full px-3 py-1.5 bg-[#FBF6EE]">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                  className="w-6 h-6 rounded-full flex items-center justify-center text-[#5B1F11] hover:bg-[#E5D9CC]/50 disabled:opacity-30"
                  aria-label="Kurangi porsi"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="text-sm font-bold text-[#3B1209] w-6 text-center tabular-nums">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-6 h-6 rounded-full flex items-center justify-center text-[#5B1F11] hover:bg-[#E5D9CC]/50"
                  aria-label="Tambah porsi"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Sticky Action Footer */}
        <div className="p-4 bg-[#FBF6EE] border-t border-[#E5D9CC] flex items-center justify-between gap-4">
          <div>
            <span className="text-[11px] text-[#786B63] block">Subtotal</span>
            <span className="text-lg font-bold text-[#5B1F11] tabular-nums">
              {formatRupiah(product.price * quantity)}
            </span>
          </div>

          <button
            onClick={handleAdd}
            disabled={!product.isAvailable}
            className="flex-1 max-w-xs py-3 px-5 rounded-full bg-[#5B1F11] text-[#FBF6EE] font-semibold text-sm hover:bg-[#3B1209] disabled:opacity-50 transition-colors flex items-center justify-center gap-2 shadow-xs"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Tambah ke Keranjang</span>
          </button>
        </div>
      </div>
    </div>
  );
};
