import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ArrowRight, Tag, AlertCircle } from 'lucide-react';
import { useCart } from '../context/CartContext.tsx';
import { useAuth } from '../context/AuthContext.tsx';
import { formatRupiah } from '../utils/format.ts';

export const CartDrawer: React.FC = () => {
  const {
    items,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    subtotal,
    discount,
    discountCode,
    total,
    applyVoucher,
    removeVoucher,
    setIsCheckoutOpen,
    setIsAuthModalOpen,
  } = useCart();

  const { isAuthenticated } = useAuth();
  const [voucherInput, setVoucherInput] = useState('');
  const [voucherError, setVoucherError] = useState<string | null>(null);
  const [isApplyingVoucher, setIsApplyingVoucher] = useState(false);

  if (!isCartOpen) return null;

  const handleApplyVoucher = async (codeToApply?: string) => {
    const code = codeToApply || voucherInput;
    if (!code) return;
    setIsApplyingVoucher(true);
    setVoucherError(null);
    const res = await applyVoucher(code);
    setIsApplyingVoucher(false);
    if (!res.success) {
      setVoucherError(res.message);
    } else {
      setVoucherInput('');
    }
  };

  const handleProceedCheckout = () => {
    if (!isAuthenticated) {
      setIsCartOpen(false);
      setIsAuthModalOpen(true);
      return;
    }
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-[#3B1209]/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="absolute inset-0" onClick={() => setIsCartOpen(false)} />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FFFDF9] border-l border-[#E5D9CC] shadow-2xl flex flex-col justify-between">
          {/* Header */}
          <div className="p-5 border-b border-[#E5D9CC] flex items-center justify-between bg-[#FBF6EE]">
            <div>
              <h2 className="font-serif text-xl font-bold text-[#5B1F11]">
                Pesanan Anda
              </h2>
              <p className="text-xs text-[#786B63] mt-0.5">
                {items.length === 0 ? 'Keranjang kosong' : `${items.length} macam hidangan dipilih`}
              </p>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 rounded-full text-[#786B63] hover:text-[#5B1F11] hover:bg-[#E5D9CC]/50 transition-colors"
              aria-label="Tutup keranjang"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12 text-[#786B63]">
                <div className="w-16 h-16 rounded-full bg-[#FBF6EE] border border-[#E5D9CC] flex items-center justify-center mb-4 text-[#B36633]">
                  <Tag className="w-8 h-8 opacity-40" />
                </div>
                <h3 className="font-serif text-lg font-bold text-[#3B1209]">
                  Keranjang Masih Kosong
                </h3>
                <p className="text-xs text-[#786B63] max-w-xs mt-1 mb-5">
                  Aroma sedap coto dan rempah khas Manado sedang menanti Anda di Politeknik Negeri Manado. Pilih menu favorit Anda sekarang!
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="px-5 py-2.5 rounded-full bg-[#5B1F11] text-[#FBF6EE] text-xs font-semibold hover:bg-[#3B1209] transition-colors"
                >
                  Jelajahi Menu
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.product.id}
                  className="p-3.5 bg-[#FBF6EE] rounded-xl border border-[#E5D9CC] flex gap-3.5 items-start"
                >
                  <img
                    src={item.product.imageUrl}
                    alt={item.product.name}
                    className="w-16 h-16 rounded-lg object-cover bg-white shrink-0 border border-[#E5D9CC]"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = '/logo_rasanna_daeng.svg';
                    }}
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-1">
                      <h4 className="text-sm font-bold text-[#3B1209] truncate">
                        {item.product.name}
                      </h4>
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="text-[#786B63] hover:text-rose-600 transition-colors p-1"
                        aria-label={`Hapus ${item.product.name}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <p className="text-xs font-semibold text-[#5B1F11] mt-0.5 tabular-nums">
                      {formatRupiah(item.product.price)}
                    </p>

                    {item.notes && (
                      <p className="text-[11px] text-[#786B63] italic mt-1 bg-white/70 px-2 py-0.5 rounded border border-[#E5D9CC]/50">
                        "{item.notes}"
                      </p>
                    )}

                    <div className="flex items-center justify-between mt-3 pt-2 border-t border-[#E5D9CC]/50">
                      <div className="flex items-center gap-2 border border-[#E5D9CC] rounded-full px-2 py-0.5 bg-white">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="w-5 h-5 rounded-full flex items-center justify-center text-[#5B1F11] hover:bg-[#FBF6EE]"
                          aria-label="Kurangi jumlah"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-bold text-[#3B1209] w-4 text-center tabular-nums">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="w-5 h-5 rounded-full flex items-center justify-center text-[#5B1F11] hover:bg-[#FBF6EE]"
                          aria-label="Tambah jumlah"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="text-xs font-bold text-[#3B1209] tabular-nums">
                        {formatRupiah(item.product.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout Action */}
          {items.length > 0 && (
            <div className="p-5 bg-[#FBF6EE] border-t border-[#E5D9CC] space-y-4">
              {/* Voucher section */}
              <div>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={voucherInput}
                      onChange={(e) => {
                        setVoucherInput(e.target.value.toUpperCase());
                        setVoucherError(null);
                      }}
                      placeholder="Kode Promo (cth: EWAKO10)"
                      className="w-full text-xs uppercase px-3 py-2 rounded-lg border border-[#E5D9CC] bg-white focus:outline-none focus:border-[#B36633]"
                    />
                  </div>
                  <button
                    onClick={() => handleApplyVoucher()}
                    disabled={isApplyingVoucher || !voucherInput.trim()}
                    className="px-4 py-2 rounded-lg bg-[#B36633] text-white text-xs font-semibold hover:bg-[#B36633]/90 disabled:opacity-40 transition-colors"
                  >
                    Pakai
                  </button>
                </div>

                {voucherError && (
                  <p className="text-[11px] text-rose-700 flex items-center gap-1 mt-1.5">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{voucherError}</span>
                  </p>
                )}

                {discountCode && (
                  <div className="mt-2 flex items-center justify-between text-xs bg-emerald-50 border border-emerald-200 text-emerald-800 px-3 py-1.5 rounded-lg">
                    <span className="font-semibold">Voucher Aktif: {discountCode}</span>
                    <button
                      onClick={removeVoucher}
                      className="text-xs text-rose-700 hover:underline font-medium"
                    >
                      Hapus
                    </button>
                  </div>
                )}

                {/* Quick chip suggestions */}
                <div className="flex gap-2 mt-2">
                  <button
                    type="button"
                    onClick={() => handleApplyVoucher('EWAKO10')}
                    className="text-[10px] bg-white border border-[#E5D9CC] px-2 py-0.5 rounded text-[#786B63] hover:border-[#B36633]"
                  >
                    + EWAKO10 (Diskon 10%)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleApplyVoucher('DAENGHEMAT')}
                    className="text-[10px] bg-white border border-[#E5D9CC] px-2 py-0.5 rounded text-[#786B63] hover:border-[#B36633]"
                  >
                    + DAENGHEMAT (-Rp10rb)
                  </button>
                </div>
              </div>

              {/* Subtotal & Total Breakdown */}
              <div className="space-y-1.5 pt-2 border-t border-[#E5D9CC]/60 text-xs text-[#3F302A]">
                <div className="flex justify-between">
                  <span className="text-[#786B63]">Subtotal Produk</span>
                  <span className="font-semibold tabular-nums">{formatRupiah(subtotal)}</span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-emerald-800">
                    <span>Diskon Voucher</span>
                    <span className="font-semibold tabular-nums">-{formatRupiah(discount)}</span>
                  </div>
                )}

                <div className="flex justify-between items-baseline pt-2 border-t border-[#E5D9CC] text-base">
                  <span className="font-bold text-[#3B1209]">Total Bayar</span>
                  <span className="font-bold text-lg text-[#5B1F11] tabular-nums">
                    {formatRupiah(total)}
                  </span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={handleProceedCheckout}
                className="w-full py-3.5 px-4 rounded-full bg-[#5B1F11] text-[#FBF6EE] font-semibold text-sm hover:bg-[#3B1209] transition-all flex items-center justify-center gap-2 shadow-sm"
              >
                <span>{isAuthenticated ? 'Lanjut ke Pembayaran' : 'Login & Lanjut Pesan'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
