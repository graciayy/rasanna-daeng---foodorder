import { OrderStatus, PaymentStatus } from '../types/index.ts';

export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(dateString: string): string {
  try {
    const d = new Date(dateString);
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Asia/Manado',
    }).format(d) + ' WITA';
  } catch {
    return dateString;
  }
}

export function getOrderStatusBadge(status: OrderStatus): { label: string; bg: string; text: string } {
  switch (status) {
    case 'pending':
      return { label: 'Menunggu Konfirmasi', bg: 'bg-amber-100', text: 'text-amber-800' };
    case 'confirmed':
      return { label: 'Dikonfirmasi', bg: 'bg-blue-100', text: 'text-blue-800' };
    case 'preparing':
      return { label: 'Sedang Disiapkan', bg: 'bg-orange-100', text: 'text-orange-800' };
    case 'ready':
      return { label: 'Siap Disajikan / Diambil', bg: 'bg-teal-100', text: 'text-teal-800' };
    case 'completed':
      return { label: 'Selesai', bg: 'bg-emerald-100', text: 'text-emerald-800' };
    case 'rejected':
      return { label: 'Ditolak', bg: 'bg-rose-100', text: 'text-rose-800' };
    case 'cancelled':
      return { label: 'Dibatalkan', bg: 'bg-zinc-100', text: 'text-zinc-800' };
    default:
      return { label: status, bg: 'bg-zinc-100', text: 'text-zinc-800' };
  }
}

export function getPaymentStatusBadge(status: PaymentStatus): { label: string; bg: string; text: string } {
  switch (status) {
    case 'unpaid':
      return { label: 'Belum Dibayar', bg: 'bg-amber-50 border border-amber-200', text: 'text-amber-800' };
    case 'pending_verification':
      return { label: 'Menunggu Verifikasi', bg: 'bg-sky-50 border border-sky-200', text: 'text-sky-800' };
    case 'paid':
      return { label: 'Lunas', bg: 'bg-emerald-50 border border-emerald-200', text: 'text-emerald-800' };
    case 'rejected':
      return { label: 'Bukti Ditolak', bg: 'bg-rose-50 border border-rose-200', text: 'text-rose-800' };
    default:
      return { label: status, bg: 'bg-zinc-100', text: 'text-zinc-800' };
  }
}
