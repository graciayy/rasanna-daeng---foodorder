import React, { useState } from 'react';
import {
  X,
  Printer,
  Download,
  Share2,
  CheckCircle2,
  Clock,
  ChefHat,
  BellRing,
  Upload,
  AlertCircle,
  Copy,
  Check,
} from 'lucide-react';
import { Order, OrderStatus } from '../types/index.ts';
import { formatRupiah, formatDate, getOrderStatusBadge, getPaymentStatusBadge } from '../utils/format.ts';
import { generateReceiptPDF } from '../utils/pdfReceipt.ts';
import { useAuth } from '../context/AuthContext.tsx';

interface OrderReceiptModalProps {
  order: Order | null;
  onClose: () => void;
  onRefresh?: () => void;
}

export const OrderReceiptModal: React.FC<OrderReceiptModalProps> = ({ order, onClose, onRefresh }) => {
  const { token } = useAuth();
  const [uploadingProof, setUploadingProof] = useState(false);
  const [proofError, setProofError] = useState<string | null>(null);
  const [proofSuccess, setProofSuccess] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  if (!order) return null;

  const statusBadge = getOrderStatusBadge(order.status);
  const paymentBadge = getPaymentStatusBadge(order.paymentStatus);

  const steps: { status: OrderStatus; label: string; icon: React.ReactNode }[] = [
    { status: 'pending', label: 'Menunggu', icon: <Clock className="w-4 h-4" /> },
    { status: 'confirmed', label: 'Dikonfirmasi', icon: <CheckCircle2 className="w-4 h-4" /> },
    { status: 'preparing', label: 'Disiapkan', icon: <ChefHat className="w-4 h-4" /> },
    { status: 'ready', label: 'Siap', icon: <BellRing className="w-4 h-4" /> },
    { status: 'completed', label: 'Selesai', icon: <CheckCircle2 className="w-4 h-4" /> },
  ];

  const getStepIndex = (status: OrderStatus) => {
    switch (status) {
      case 'pending': return 0;
      case 'confirmed': return 1;
      case 'preparing': return 2;
      case 'ready': return 3;
      case 'completed': return 4;
      default: return 0;
    }
  };

  const currentStepIdx = getStepIndex(order.status);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    generateReceiptPDF(order);
  };

  const handleShare = async () => {
    const text = `Pesanan Rasanna Daeng #${order.orderNumber} (${order.serviceType === 'dine_in' ? 'Dine-in ' + order.tableNumber : 'Takeaway'}) - Total: ${formatRupiah(order.total)}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Struk Rasanna Daeng #${order.orderNumber}`,
          text,
          url: window.location.href,
        });
        return;
      } catch {
        // Fallback to copy
      }
    }
    navigator.clipboard.writeText(text);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setProofError('Hanya file gambar (JPG/PNG) yang diperbolehkan');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setProofError('Ukuran gambar maksimal 5MB');
      return;
    }

    setUploadingProof(true);
    setProofError(null);

    const reader = new FileReader();
    reader.onload = async () => {
      try {
        // 1. Upload file
        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ dataUrl: reader.result }),
        });
        const uploadData = await uploadRes.json();
        if (!uploadRes.ok) {
          throw new Error(uploadData.error || 'Gagal mengunggah foto bukti');
        }

        // 2. Attach to order
        const attachRes = await fetch(`/api/orders/${order.id}/payment-proof`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ proofUrl: uploadData.url }),
        });

        if (!attachRes.ok) {
          throw new Error('Gagal memperbarui status bukti pembayaran');
        }

        setProofSuccess(true);
        order.paymentStatus = 'pending_verification';
        order.paymentProofUrl = uploadData.url;
        onRefresh?.();
      } catch (err: any) {
        setProofError(err.message || 'Gagal mengunggah bukti pembayaran');
      } finally {
        setUploadingProof(false);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#3B1209]/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div
        className="relative w-full max-w-lg bg-[#FFFDF9] rounded-2xl border border-[#E5D9CC] shadow-2xl overflow-hidden my-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Bar */}
        <div className="p-4 bg-[#FBF6EE] border-b border-[#E5D9CC] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#5B1F11] tracking-wide uppercase">
              Struk & Lacak Pesanan
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="p-1.5 rounded-lg text-[#786B63] hover:text-[#5B1F11] hover:bg-white transition-colors"
              title="Cetak Struk"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={handleDownloadPDF}
              className="p-1.5 rounded-lg text-[#786B63] hover:text-[#5B1F11] hover:bg-white transition-colors"
              title="Unduh PDF"
            >
              <Download className="w-4 h-4" />
            </button>
            <button
              onClick={handleShare}
              className="p-1.5 rounded-lg text-[#786B63] hover:text-[#5B1F11] hover:bg-white transition-colors"
              title="Bagikan Struk"
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-[#786B63] hover:text-[#5B1F11] hover:bg-white transition-colors ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Receipt Body */}
        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto" id="printable-receipt">
          {/* Brand Heading */}
          <div className="text-center pb-4 border-b border-[#E5D9CC] border-dashed">
            <div className="w-14 h-14 mx-auto mb-2 p-1 rounded-xl bg-[#FBF6EE] border border-[#E5D9CC] flex items-center justify-center">
              <img src="/logo_rasanna_daeng.svg" alt="Rasanna Daeng" className="w-full h-full object-contain" />
            </div>
            <h3 className="font-serif text-2xl font-bold text-[#5B1F11] tracking-tight">
              RASANNA DAENG
            </h3>
            <p className="text-[11px] font-medium text-[#786B63] mt-0.5">
              Cita Rasa Otentik Anging Mammiri
            </p>
            <p className="text-[10px] text-[#786B63]">
              Jl. Raya Politeknik, Kampus Politeknik Negeri Manado, Kota Manado · WA: 0812-4567-8910
            </p>
          </div>

          {/* Tracking Timeline */}
          {order.status !== 'rejected' && order.status !== 'cancelled' ? (
            <div className="bg-[#FBF6EE] p-4 rounded-xl border border-[#E5D9CC]">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#786B63] block mb-3 text-center">
                Perkembangan Pesanan
              </span>
              <div className="relative flex items-center justify-between">
                {/* Connecting Track */}
                <div className="absolute top-1/2 left-3 right-3 h-0.5 bg-[#E5D9CC] -translate-y-1/2 z-0" />
                <div
                  className="absolute top-1/2 left-3 h-0.5 bg-[#5B1F11] -translate-y-1/2 z-0 transition-all duration-500"
                  style={{ width: `${(currentStepIdx / (steps.length - 1)) * 95}%` }}
                />

                {steps.map((st, idx) => {
                  const isPassed = idx <= currentStepIdx;
                  const isCurrent = idx === currentStepIdx;
                  return (
                    <div key={st.status} className="relative z-10 flex flex-col items-center">
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center text-xs transition-colors ${
                          isPassed
                            ? 'bg-[#5B1F11] text-[#FBF6EE]'
                            : 'bg-white border-2 border-[#E5D9CC] text-[#786B63]'
                        } ${isCurrent ? 'ring-4 ring-[#E7BA80]/40' : ''}`}
                      >
                        {st.icon}
                      </div>
                      <span
                        className={`text-[9px] mt-1.5 font-medium whitespace-nowrap ${
                          isPassed ? 'text-[#5B1F11] font-bold' : 'text-[#786B63]'
                        }`}
                      >
                        {st.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs text-center font-medium">
              Pesanan ini telah {order.status === 'rejected' ? 'Ditolak' : 'Dibatalkan'}: {order.cancelReason || 'Kebijakan operasional'}
            </div>
          )}

          {/* Key Transaction Information */}
          <div className="grid grid-cols-2 gap-2 text-xs border-b border-[#E5D9CC] border-dashed pb-4">
            <div>
              <span className="text-[#786B63] block text-[10px]">Nomor Pesanan</span>
              <span className="font-bold text-[#3B1209] font-mono text-sm">{order.orderNumber}</span>
            </div>
            <div className="text-right">
              <span className="text-[#786B63] block text-[10px]">Tanggal & Waktu</span>
              <span className="font-medium text-[#3B1209]">{formatDate(order.createdAt)}</span>
            </div>
            <div className="mt-2">
              <span className="text-[#786B63] block text-[10px]">Pelanggan</span>
              <span className="font-semibold text-[#3B1209]">{order.customerName}</span>
              <span className="text-[10px] text-[#786B63] block">{order.customerPhone}</span>
            </div>
            <div className="mt-2 text-right">
              <span className="text-[#786B63] block text-[10px]">Layanan</span>
              <span className="font-semibold text-[#5B1F11]">
                {order.serviceType === 'dine_in'
                  ? `Dine-in · ${order.tableNumber || 'Meja Dipilih'}`
                  : 'Takeaway (Bungkus)'}
              </span>
            </div>
          </div>

          {/* Payment Status & Action Card */}
          <div className="p-4 rounded-xl border border-[#E5D9CC] bg-[#FFFDF9] space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] text-[#786B63] uppercase block">Metode Pembayaran</span>
                <span className="text-xs font-bold text-[#3B1209]">
                  {order.paymentMethod === 'cash' ? 'Cash / Tunai' : 'QRIS (Gopay/BCA/OVO/Dana)'}
                </span>
              </div>
              <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${paymentBadge.bg} ${paymentBadge.text}`}>
                {paymentBadge.label}
              </span>
            </div>

            {/* QRIS Instructions and Proof Upload if QRIS and Unpaid / Pending */}
            {order.paymentMethod === 'qris' && order.paymentStatus !== 'paid' && (
              <div className="mt-3 pt-3 border-t border-[#E5D9CC] space-y-3">
                <div className="bg-[#FBF6EE] p-3 rounded-lg border border-[#E5D9CC] flex items-center gap-3">
                  <div className="w-20 h-20 bg-white p-1 rounded-md border border-[#E5D9CC] shrink-0 flex items-center justify-center">
                    <img
                      src="/logo_rasanna_daeng.svg"
                      alt="QRIS Rasanna Daeng"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="text-xs">
                    <p className="font-bold text-[#5B1F11]">QRIS Rasanna Daeng</p>
                    <p className="text-[10px] text-[#786B63]">NMID: ID1029384756182</p>
                    <p className="text-[11px] font-semibold text-[#3B1209] mt-1 tabular-nums">
                      Nominal: {formatRupiah(order.total)}
                    </p>
                  </div>
                </div>

                {/* Upload Transfer Receipt Button */}
                <div>
                  <label className="block text-xs font-semibold text-[#3B1209] mb-1">
                    Unggah Bukti Transfer QRIS:
                  </label>
                  <label className="flex items-center justify-center gap-2 w-full p-2.5 border-2 border-dashed border-[#B36633]/60 rounded-xl bg-[#FBF6EE] text-xs font-medium text-[#5B1F11] cursor-pointer hover:bg-[#FBF6EE]/80 transition-colors">
                    <Upload className="w-4 h-4 text-[#B36633]" />
                    <span>{uploadingProof ? 'Mengunggah...' : 'Pilih Foto Bukti Transfer'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      disabled={uploadingProof}
                      className="hidden"
                    />
                  </label>
                  {order.paymentProofUrl && (
                    <div className="mt-2 text-[11px] text-[#2F6B45] flex items-center gap-1 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Bukti transfer tersimpan. Menunggu verifikasi admin.</span>
                    </div>
                  )}
                  {proofError && (
                    <p className="text-xs text-rose-700 flex items-center gap-1 mt-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>{proofError}</span>
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Itemized Order Details */}
          <div className="space-y-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#786B63] block">
              Daftar Pesanan
            </span>
            <div className="divide-y divide-[#E5D9CC]/60 text-xs">
              {order.items?.map((it) => (
                <div key={it.id} className="py-2.5 flex justify-between gap-3">
                  <div className="flex-1">
                    <p className="font-bold text-[#3B1209]">{it.productName}</p>
                    <p className="text-[11px] text-[#786B63] mt-0.5">
                      {it.quantity}x @ {formatRupiah(it.price)}
                    </p>
                    {it.notes && (
                      <p className="text-[10px] text-[#786B63] italic mt-0.5">Catatan: {it.notes}</p>
                    )}
                  </div>
                  <span className="font-semibold text-[#3B1209] tabular-nums shrink-0">
                    {formatRupiah(it.subtotal)}
                  </span>
                </div>
              ))}
            </div>

            {/* Calculations Breakdown */}
            <div className="pt-3 border-t border-[#E5D9CC] space-y-1.5 text-xs text-[#3F302A]">
              <div className="flex justify-between text-[#786B63]">
                <span>Subtotal</span>
                <span className="tabular-nums">{formatRupiah(order.subtotal)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-emerald-800">
                  <span>Diskon ({order.discountCode || 'Promo'})</span>
                  <span className="tabular-nums">-{formatRupiah(order.discount)}</span>
                </div>
              )}
              <div className="flex justify-between items-baseline pt-2 border-t border-[#E5D9CC] text-base font-bold text-[#5B1F11]">
                <span>Total Pembayaran</span>
                <span className="tabular-nums text-lg">{formatRupiah(order.total)}</span>
              </div>
            </div>
          </div>

          {/* Receipt Footer Message */}
          <div className="text-center pt-4 border-t border-[#E5D9CC] border-dashed text-[11px] text-[#786B63]">
            <p className="font-semibold text-[#3B1209]">Kurru Sumanga!</p>
            <p>Terima kasih telah menikmati cita rasa otentik Rasanna Daeng.</p>
          </div>
        </div>

        {/* Modal Action Buttons */}
        <div className="p-4 bg-[#FBF6EE] border-t border-[#E5D9CC] flex items-center justify-between gap-3">
          <button
            onClick={handleDownloadPDF}
            className="flex-1 py-2.5 px-3 rounded-full bg-[#5B1F11] text-[#FBF6EE] text-xs font-semibold hover:bg-[#3B1209] transition-colors flex items-center justify-center gap-1.5 shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Unduh Struk PDF</span>
          </button>
          <button
            onClick={onClose}
            className="py-2.5 px-4 rounded-full border border-[#E5D9CC] bg-white text-[#3F302A] text-xs font-semibold hover:bg-[#FBF6EE] transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
