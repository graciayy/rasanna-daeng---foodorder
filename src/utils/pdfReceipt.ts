import jsPDF from 'jspdf';
import { Order } from '../types/index.ts';
import { formatRupiah, formatDate } from './format.ts';

export function generateReceiptPDF(order: Order, restaurantName = 'Rasanna Daeng'): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: [80, 200], // 80mm thermal receipt format standard
  });

  const pageWidth = 80;
  let y = 10;

  // Header
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(91, 31, 17); // Redwood
  doc.text(restaurantName.toUpperCase(), pageWidth / 2, y, { align: 'center' });
  y += 5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(120, 107, 99); // Muted Text
  doc.text('Cita Rasa Otentik Anging Mammiri', pageWidth / 2, y, { align: 'center' });
  y += 4;
  doc.text('Jl. Raya Politeknik, Kampus Politeknik Negeri Manado, Kota Manado', pageWidth / 2, y, { align: 'center' });
  y += 4;
  doc.text('Telp/WA: 0812-4567-8910', pageWidth / 2, y, { align: 'center' });
  y += 4;

  // Divider line
  doc.setDrawColor(229, 217, 204);
  doc.line(6, y, pageWidth - 6, y);
  y += 5;

  // Transaction Info
  doc.setFontSize(8);
  doc.setTextColor(63, 48, 42); // Body Text
  doc.setFont('helvetica', 'bold');
  doc.text(`No. Pesanan:`, 6, y);
  doc.text(order.orderNumber, pageWidth - 6, y, { align: 'right' });
  y += 4;

  doc.setFont('helvetica', 'normal');
  doc.text(`Waktu:`, 6, y);
  doc.text(formatDate(order.createdAt), pageWidth - 6, y, { align: 'right' });
  y += 4;

  doc.text(`Pelanggan:`, 6, y);
  doc.text(order.customerName, pageWidth - 6, y, { align: 'right' });
  y += 4;

  const serviceLabel = order.serviceType === 'dine_in'
    ? `Dine-in (${order.tableNumber || 'Meja Belum Dipilih'})`
    : 'Takeaway (Bungkus)';
  doc.text(`Layanan:`, 6, y);
  doc.text(serviceLabel, pageWidth - 6, y, { align: 'right' });
  y += 4;

  // Divider line
  doc.line(6, y, pageWidth - 6, y);
  y += 5;

  // Items Header
  doc.setFont('helvetica', 'bold');
  doc.text('MENU', 6, y);
  doc.text('TOTAL', pageWidth - 6, y, { align: 'right' });
  y += 4;

  doc.setFont('helvetica', 'normal');
  if (order.items && order.items.length > 0) {
    for (const item of order.items) {
      doc.setFont('helvetica', 'bold');
      doc.text(`${item.productName}`, 6, y);
      doc.text(formatRupiah(item.subtotal), pageWidth - 6, y, { align: 'right' });
      y += 3.5;

      doc.setFont('helvetica', 'normal');
      doc.setTextColor(120, 107, 99);
      doc.text(`${item.quantity}x @ ${formatRupiah(item.price)}`, 6, y);
      if (item.notes) {
        y += 3;
        doc.text(`Catatan: ${item.notes}`, 6, y);
      }
      y += 4;
      doc.setTextColor(63, 48, 42);
    }
  }

  // Divider line
  doc.line(6, y, pageWidth - 6, y);
  y += 5;

  // Pricing Totals
  doc.text('Subtotal:', 6, y);
  doc.text(formatRupiah(order.subtotal), pageWidth - 6, y, { align: 'right' });
  y += 4;

  if (order.discount > 0) {
    doc.setTextColor(47, 107, 69); // Success green
    doc.text(`Diskon (${order.discountCode || 'Promo'}):`, 6, y);
    doc.text(`-${formatRupiah(order.discount)}`, pageWidth - 6, y, { align: 'right' });
    y += 4;
    doc.setTextColor(63, 48, 42);
  }

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('TOTAL AKHIR:', 6, y);
  doc.text(formatRupiah(order.total), pageWidth - 6, y, { align: 'right' });
  y += 5;

  // Payment Details
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text('Metode Pembayaran:', 6, y);
  doc.text(order.paymentMethod === 'cash' ? 'Cash / Tunai' : 'QRIS', pageWidth - 6, y, { align: 'right' });
  y += 4;

  const paymentStatusText = order.paymentStatus === 'paid' ? 'LUNAS' : order.paymentStatus === 'pending_verification' ? 'MENUNGGU VERIFIKASI' : 'BELUM DIBAYAR';
  doc.text('Status Pembayaran:', 6, y);
  doc.setFont('helvetica', 'bold');
  doc.text(paymentStatusText, pageWidth - 6, y, { align: 'right' });
  y += 8;

  // Footer Note
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(120, 107, 99);
  doc.text('Kurru Sumanga! Terima kasih atas kunjungan Anda.', pageWidth / 2, y, { align: 'center' });
  y += 3.5;
  doc.text('Simpan struk ini sebagai bukti transaksi resmi.', pageWidth / 2, y, { align: 'center' });

  // Save PDF
  doc.save(`Struk-RasannaDaeng-${order.orderNumber}.pdf`);
}
