import React, { useState, useEffect } from 'react';
import { X, Utensils, ShoppingBag, QrCode, Banknote, AlertCircle, CheckCircle } from 'lucide-react';
import { useCart } from '../context/CartContext.tsx';
import { useAuth } from '../context/AuthContext.tsx';
import { ServiceType, PaymentMethod, RestaurantTable } from '../types/index.ts';
import { formatRupiah } from '../utils/format.ts';

export const CheckoutModal: React.FC = () => {
  const {
    items,
    isCheckoutOpen,
    setIsCheckoutOpen,
    subtotal,
    discount,
    discountCode,
    total,
    clearCart,
    setActiveOrderReceipt,
  } = useCart();

  const { user, token } = useAuth();

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [serviceType, setServiceType] = useState<ServiceType>('dine_in');
  const [tableNumber, setTableNumber] = useState('Meja 01');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('qris');

  const [tables, setTables] = useState<RestaurantTable[]>([]);
  const [loadingTables, setLoadingTables] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Sync with logged in user info
  useEffect(() => {
    if (user) {
      setCustomerName(user.name || '');
      setCustomerPhone(user.phone || '');
    }
  }, [user]);

  // Fetch available restaurant tables for Dine-in
  useEffect(() => {
    if (isCheckoutOpen) {
      setLoadingTables(true);
      fetch('/api/tables')
        .then((res) => res.json())
        .then((data) => {
          if (data.tables && data.tables.length > 0) {
            setTables(data.tables);
            setTableNumber(data.tables[0].tableNumber);
          }
        })
        .catch(console.error)
        .finally(() => setLoadingTables(false));
    }
  }, [isCheckoutOpen]);

  if (!isCheckoutOpen) return null;

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!customerName.trim() || !customerPhone.trim()) {
      setErrorMessage('Nama dan nomor WhatsApp wajib diisi');
      return;
    }

    if (serviceType === 'dine_in' && !tableNumber) {
      setErrorMessage('Pilih nomor meja Anda untuk layanan Dine-in');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const orderPayload = {
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        serviceType,
        tableNumber: serviceType === 'dine_in' ? tableNumber : null,
        notes: notes.trim(),
        paymentMethod,
        discountCode,
        items: items.map((it) => ({
          productId: it.product.id,
          quantity: it.quantity,
          notes: it.notes,
        })),
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(orderPayload),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMessage(data.error || 'Gagal membuat pesanan');
        setIsSubmitting(false);
        return;
      }

      // Fetch the full order details for the receipt
      const orderDetailRes = await fetch(`/api/orders/${data.order.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const orderDetailData = await orderDetailRes.json();

      clearCart();
      setIsCheckoutOpen(false);
      setActiveOrderReceipt(orderDetailData.order || data.order);
    } catch (err) {
      setErrorMessage('Terjadi gangguan jaringan saat memproses pesanan.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#3B1209]/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div
        className="relative w-full max-w-xl bg-[#FFFDF9] rounded-2xl border border-[#E5D9CC] shadow-2xl overflow-hidden my-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 bg-[#5B1F11] text-[#FBF6EE] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#E7BA80]/20 flex items-center justify-center text-[#E7BA80]">
              <Utensils className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif text-xl font-bold">Konfirmasi Pemesanan</h2>
              <p className="text-xs text-[#E7BA80]">Rasanna Daeng · Warisan Rempah di Politeknik Negeri Manado</p>
            </div>
          </div>
          <button
            onClick={() => setIsCheckoutOpen(false)}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmitOrder} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Section 1: Customer Contact */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#786B63] mb-3">
              1. Identitas Pelanggan
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#3B1209] mb-1">Nama Lengkap</label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Contoh: Daeng Jarre"
                  className="w-full text-xs p-3 rounded-xl border border-[#E5D9CC] bg-[#FBF6EE] focus:outline-none focus:border-[#B36633]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#3B1209] mb-1">Nomor WhatsApp</label>
                <input
                  type="tel"
                  required
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="0812xxxxxxxx"
                  className="w-full text-xs p-3 rounded-xl border border-[#E5D9CC] bg-[#FBF6EE] focus:outline-none focus:border-[#B36633]"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Service Type */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#786B63] mb-3">
              2. Jenis Layanan
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setServiceType('dine_in')}
                className={`p-3.5 rounded-xl border text-left transition-all flex flex-col gap-1.5 ${
                  serviceType === 'dine_in'
                    ? 'border-[#5B1F11] bg-[#5B1F11]/5 ring-1 ring-[#5B1F11]'
                    : 'border-[#E5D9CC] bg-[#FFFDF9] hover:border-[#B36633]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#5B1F11]">Dine-in (Makan di Tempat)</span>
                  {serviceType === 'dine_in' && <CheckCircle className="w-4 h-4 text-[#5B1F11]" />}
                </div>
                <span className="text-[11px] text-[#786B63]">
                  Disajikan hangat di meja pilihan Anda
                </span>
              </button>

              <button
                type="button"
                onClick={() => setServiceType('takeaway')}
                className={`p-3.5 rounded-xl border text-left transition-all flex flex-col gap-1.5 ${
                  serviceType === 'takeaway'
                    ? 'border-[#5B1F11] bg-[#5B1F11]/5 ring-1 ring-[#5B1F11]'
                    : 'border-[#E5D9CC] bg-[#FFFDF9] hover:border-[#B36633]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#5B1F11]">Takeaway (Bawa Pulang)</span>
                  {serviceType === 'takeaway' && <CheckCircle className="w-4 h-4 text-[#5B1F11]" />}
                </div>
                <span className="text-[11px] text-[#786B63]">
                  Dikemas rapi, ambil di konter kasir
                </span>
              </button>
            </div>

            {/* Table Selector for Dine-in */}
            {serviceType === 'dine_in' && (
              <div className="mt-3 p-3.5 rounded-xl bg-[#FBF6EE] border border-[#E5D9CC]">
                <label className="block text-xs font-semibold text-[#3B1209] mb-1.5">
                  Pilih Nomor Meja
                </label>
                <select
                  value={tableNumber}
                  onChange={(e) => setTableNumber(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-[#E5D9CC] bg-white font-medium focus:outline-none focus:border-[#B36633]"
                >
                  {tables.map((t) => (
                    <option key={t.id} value={t.tableNumber}>
                      {t.tableNumber} (Kapasitas {t.capacity} orang)
                    </option>
                  ))}
                </select>
                <p className="text-[10px] text-[#786B63] mt-1">
                  Nomor meja tertera pada sudut meja restoran Anda.
                </p>
              </div>
            )}
          </div>

          {/* Section 3: Payment Method */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#786B63] mb-3">
              3. Metode Pembayaran
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setPaymentMethod('qris')}
                className={`p-3.5 rounded-xl border text-left transition-all flex flex-col gap-1.5 ${
                  paymentMethod === 'qris'
                    ? 'border-[#5B1F11] bg-[#5B1F11]/5 ring-1 ring-[#5B1F11]'
                    : 'border-[#E5D9CC] bg-[#FFFDF9] hover:border-[#B36633]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#5B1F11]">
                    <QrCode className="w-4 h-4 text-[#B36633]" />
                    <span>QRIS (Rekomendasi)</span>
                  </div>
                  {paymentMethod === 'qris' && <CheckCircle className="w-4 h-4 text-[#5B1F11]" />}
                </div>
                <span className="text-[11px] text-[#786B63]">
                  Scan instan lewat BCA, Mandiri, GoPay, OVO, Dana
                </span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('cash')}
                className={`p-3.5 rounded-xl border text-left transition-all flex flex-col gap-1.5 ${
                  paymentMethod === 'cash'
                    ? 'border-[#5B1F11] bg-[#5B1F11]/5 ring-1 ring-[#5B1F11]'
                    : 'border-[#E5D9CC] bg-[#FFFDF9] hover:border-[#B36633]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#5B1F11]">
                    <Banknote className="w-4 h-4 text-[#B36633]" />
                    <span>Cash / Tunai</span>
                  </div>
                  {paymentMethod === 'cash' && <CheckCircle className="w-4 h-4 text-[#5B1F11]" />}
                </div>
                <span className="text-[11px] text-[#786B63]">
                  Bayar langsung ke kasir saat pesanan diproses
                </span>
              </button>
            </div>
          </div>

          {/* Section 4: Order Notes */}
          <div>
            <label className="block text-xs font-semibold text-[#3B1209] mb-1">
              Catatan untuk Dapur (Opsional)
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Contoh: Jangan campur sambal, kuah coto panas..."
              className="w-full text-xs p-3 rounded-xl border border-[#E5D9CC] bg-[#FBF6EE] focus:outline-none focus:border-[#B36633]"
            />
          </div>

          {/* Order Summary Box */}
          <div className="p-4 rounded-xl bg-[#FBF6EE] border border-[#E5D9CC] space-y-2 text-xs">
            <h4 className="font-bold text-[#3B1209] text-xs">Ringkasan Pesanan ({items.length} item)</h4>
            <div className="max-h-28 overflow-y-auto space-y-1.5 pr-1">
              {items.map((it) => (
                <div key={it.product.id} className="flex justify-between text-[#786B63]">
                  <span>{it.quantity}x {it.product.name}</span>
                  <span className="tabular-nums font-medium">{formatRupiah(it.product.price * it.quantity)}</span>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-[#E5D9CC] space-y-1">
              <div className="flex justify-between text-[#786B63]">
                <span>Subtotal</span>
                <span className="tabular-nums">{formatRupiah(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-800 font-medium">
                  <span>Diskon Promo ({discountCode})</span>
                  <span className="tabular-nums">-{formatRupiah(discount)}</span>
                </div>
              )}
              <div className="flex justify-between items-baseline pt-1 border-t border-[#E5D9CC] text-sm font-bold text-[#5B1F11]">
                <span>Total Pembayaran</span>
                <span className="tabular-nums text-base">{formatRupiah(total)}</span>
              </div>
            </div>
          </div>

          {/* Submit Action */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 px-6 rounded-full bg-[#5B1F11] text-[#FBF6EE] font-bold text-sm hover:bg-[#3B1209] disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-md"
          >
            {isSubmitting ? (
              <span>Memproses Pesanan Anda...</span>
            ) : (
              <span>Konfirmasi & Buat Pesanan ({formatRupiah(total)})</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
