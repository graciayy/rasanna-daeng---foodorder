import React from 'react';
import { Plus, Check } from 'lucide-react';
import { Product } from '../types/index.ts';
import { formatRupiah } from '../utils/format.ts';
import { useCart } from '../context/CartContext.tsx';

interface ProductCardProps {
  product: Product;
  onOpenDetail?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onOpenDetail }) => {
  const { addToCart, items } = useCart();
  const cartItem = items.find((it) => it.product.id === product.id);

  return (
    <div className="group relative bg-[#FFFDF9] rounded-[14px] border border-[#E5D9CC] overflow-hidden flex flex-col transition-all duration-200 hover:-translate-y-1 hover:shadow-md hover:border-[#B36633]/40">
      {/* Product Image Area */}
      <div
        onClick={() => onOpenDetail?.(product)}
        className="relative aspect-[4/3] w-full overflow-hidden bg-[#FBF6EE] cursor-pointer"
      >
        <img
          src={product.imageUrl}
          alt={product.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            // Elegant fallback to logo
            (e.currentTarget as HTMLImageElement).src = '/logo_rasanna_daeng.svg';
          }}
        />

        {/* Status Tag */}
        {product.tag && (
          <div className="absolute top-2.5 left-2.5">
            <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-[#5B1F11]/90 text-[#FBF6EE] backdrop-blur-xs tracking-wide shadow-xs">
              {product.tag}
            </span>
          </div>
        )}

        {!product.isAvailable && (
          <div className="absolute inset-0 bg-[#3B1209]/75 backdrop-blur-[1px] flex items-center justify-center">
            <span className="px-3 py-1 rounded-full bg-rose-600 text-white text-xs font-bold tracking-wider uppercase">
              Habis Terjual
            </span>
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div
          onClick={() => onOpenDetail?.(product)}
          className="cursor-pointer"
        >
          <div className="flex items-center justify-between gap-2 mb-1">
            <h3 className="font-serif text-lg font-bold text-[#3B1209] group-hover:text-[#B36633] transition-colors line-clamp-1">
              {product.name}
            </h3>
          </div>
          <p className="text-xs text-[#786B63] line-clamp-2 leading-relaxed mb-3">
            {product.description}
          </p>
        </div>

        {/* Price & Action Row */}
        <div className="pt-2 border-t border-[#E5D9CC]/60 flex items-center justify-between gap-2">
          <div>
            <span className="text-[10px] text-[#786B63] uppercase tracking-wider block">Harga</span>
            <span className="text-base font-bold text-[#5B1F11] tabular-nums">
              {formatRupiah(product.price)}
            </span>
          </div>

          {product.isAvailable ? (
            <button
              onClick={() => addToCart(product, 1)}
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                cartItem
                  ? 'bg-[#2F6B45] text-white hover:bg-[#2F6B45]/90'
                  : 'bg-[#5B1F11] text-[#FBF6EE] hover:bg-[#B36633]'
              }`}
              aria-label={`Tambah ${product.name} ke keranjang`}
            >
              {cartItem ? (
                <Check className="w-4 h-4 stroke-[2.5]" />
              ) : (
                <Plus className="w-4 h-4 stroke-[2.5]" />
              )}
            </button>
          ) : (
            <span className="text-[11px] font-medium text-rose-700 bg-rose-50 px-2.5 py-1 rounded-md">
              Stok Kosong
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
