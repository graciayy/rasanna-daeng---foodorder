import React, { useState, useEffect } from 'react';
import { Package, Clock, ChevronRight, RefreshCw, AlertCircle, FileText } from 'lucide-react';
import { Order } from '../types/index.ts';
import { formatRupiah, formatDate, getOrderStatusBadge, getPaymentStatusBadge } from '../utils/format.ts';
import { useAuth } from '../context/AuthContext.tsx';
import { useCart } from '../context/CartContext.tsx';

interface OrdersHistoryPageProps {
  onSelectOrder: (order: Order) => void;
  setCurrentView: (view: string) => void;
}

export const OrdersHistoryPage: React.FC<OrdersHistoryPageProps> = ({ onSelectOrder, setCurrentView }) => {
  const { token, isAuthenticated } = useAuth();
  const { setIsAuthModalOpen } = useCart();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = () => {
    if (!token) return;
    setLoading(true);
    fetch('/api/orders', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.orders) {
          setOrders(data.orders);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchOrders();
    } else {
      setLoading(false);
    }
  }, [token, isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-[#FBF6EE] border border-[#E5D9CC] flex items-center justify-center mx-auto text-[#B36633]">
          <Package className="w-8 h-8 opacity-40" />
        </div>
        <h2 className="font-serif text-2xl font-bold text-[#5B1F11]">
          Masuk untuk Melihat Riwayat Pesanan
        </h2>
        <p className="text-xs text-[#786B63] max-w-sm mx-auto">
          Silakan masuk ke akun Anda untuk melacak proses memasak di dapur atau melihat struk digital transaksi sebelumnya.
        </p>
        <button
          onClick={() => setIsAuthModalOpen(true)}
          className="px-6 py-3 rounded-full bg-[#5B1F11] text-[#FBF6EE] text-xs font-semibold hover:bg-[#3B1209]"
        >
          Masuk ke Akun
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#5B1F11]">
            Pesanan Saya
          </h1>
          <p className="text-xs text-[#786B63] mt-0.5">
            Lacak status persiapan makanan dan unduh struk digital
          </p>
        </div>
        <button
          onClick={fetchOrders}
          className="p-2 rounded-full border border-[#E5D9CC] bg-[#FFFDF9] hover:bg-[#FBF6EE] text-[#5B1F11] transition-colors"
          title="Segarkan data pesanan"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {loading ? (
        <div className="py-16 text-center text-xs text-[#786B63]">
          <RefreshCw className="w-6 h-6 animate-spin mx-auto text-[#B36633] mb-2" />
          <span>Memuat data pesanan...</span>
        </div>
      ) : orders.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-[#FFFDF9] border border-[#E5D9CC] space-y-4">
          <Package className="w-12 h-12 text-[#B36633] mx-auto opacity-30" />
          <h3 className="font-serif text-xl font-bold text-[#3B1209]">
            Belum Ada Riwayat Pesanan
          </h3>
          <p className="text-xs text-[#786B63] max-w-sm mx-auto">
            Anda belum pernah membuat pesanan di Rasanna Daeng. Cobalah nikmati hidangan Coto Daeng atau Konro empuk kami hari ini di Politeknik Negeri Manado!
          </p>
          <button
            onClick={() => setCurrentView('menu')}
            className="px-6 py-2.5 rounded-full bg-[#5B1F11] text-[#FBF6EE] text-xs font-semibold hover:bg-[#3B1209]"
          >
            Lihat Menu Sekarang
          </button>
        </div>
      ) : (
        <div className="space-y-3.5">
          {orders.map((ord) => {
            const statusBadge = getOrderStatusBadge(ord.status);
            const paymentBadge = getPaymentStatusBadge(ord.paymentStatus);

            return (
              <div
                key={ord.id}
                onClick={async () => {
                  // Fetch fresh details with items
                  const res = await fetch(`/api/orders/${ord.id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                  });
                  const data = await res.json();
                  if (data.order) {
                    onSelectOrder(data.order);
                  }
                }}
                className="p-5 rounded-2xl bg-[#FFFDF9] border border-[#E5D9CC] hover:border-[#B36633] hover:shadow-md transition-all cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-bold text-[#5B1F11]">
                      {ord.orderNumber}
                    </span>
                    <span className="text-[10px] text-[#786B63]">·</span>
                    <span className="text-xs text-[#786B63]">{formatDate(ord.createdAt)}</span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="font-semibold text-[#3B1209]">
                      {ord.serviceType === 'dine_in'
                        ? `Dine-in (${ord.tableNumber || 'Meja Belum Dipilih'})`
                        : 'Takeaway (Bawa Pulang)'}
                    </span>
                    <span className="text-[#786B63]">·</span>
                    <span className="text-[#786B63]">{ord.itemCount || 1} macam hidangan</span>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-1">
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${statusBadge.bg} ${statusBadge.text}`}>
                      {statusBadge.label}
                    </span>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${paymentBadge.bg} ${paymentBadge.text}`}>
                      {paymentBadge.label}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4 pt-3 sm:pt-0 border-t sm:border-0 border-[#E5D9CC]/60">
                  <div className="sm:text-right">
                    <span className="text-[10px] text-[#786B63] uppercase block">Total Bayar</span>
                    <span className="text-base font-bold text-[#5B1F11] tabular-nums">
                      {formatRupiah(ord.total)}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs font-semibold text-[#B36633]">
                    <span className="hidden sm:inline">Lihat Struk</span>
                    <ChevronRight className="w-5 h-5" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
