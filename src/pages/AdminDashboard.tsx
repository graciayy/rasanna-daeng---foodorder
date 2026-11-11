import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  ShoppingBag,
  CreditCard,
  Utensils,
  FolderTree,
  Users,
  TicketPercent,
  FileBarChart,
  Settings,
  Plus,
  Edit,
  Trash2,
  CheckCircle2,
  XCircle,
  Eye,
  Download,
  Upload,
  RefreshCw,
  Clock,
  ArrowUpRight,
  TrendingUp,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';
import {
  Product,
  Category,
  Order,
  DashboardStats,
  OrderStatus,
  PaymentStatus,
  RestaurantSettings as RestaurantSettingsType,
} from '../types/index.ts';
import { formatRupiah, formatDate, getOrderStatusBadge, getPaymentStatusBadge } from '../utils/format.ts';

interface AdminDashboardProps {
  setCurrentView: (view: string) => void;
  onRefreshData?: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ setCurrentView, onRefreshData }) => {
  const { token, user } = useAuth();
  const [activeTab, setActiveTab] = useState<
    'overview' | 'orders' | 'payments' | 'products' | 'categories' | 'customers' | 'promotions' | 'reports' | 'settings'
  >('overview');

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [promotions, setPromotions] = useState<any[]>([]);
  const [settings, setSettings] = useState<RestaurantSettingsType | null>(null);
  const [loading, setLoading] = useState(false);

  // Filters
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');
  const [orderSearch, setOrderSearch] = useState('');

  // Modals & Drawers
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [statusUpdateNote, setStatusUpdateNote] = useState('');
  const [rejectReason, setRejectReason] = useState('');

  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productForm, setProductForm] = useState({
    name: '',
    categoryId: '',
    description: '',
    price: '',
    imageUrl: '',
    tag: '',
    isAvailable: true,
    isFeatured: false,
    stock: '999',
  });
  const [uploadingProductImg, setUploadingProductImg] = useState(false);

  // New Category
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [catName, setCatName] = useState('');
  const [catSlug, setCatSlug] = useState('');

  // Fetch Dashboard Stats
  const loadDashboardData = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const [statsRes, ordersRes, prodsRes, catsRes, custsRes, promosRes, settingsRes] = await Promise.all([
        fetch('/api/admin/dashboard', { headers }),
        fetch('/api/orders', { headers }),
        fetch('/api/products'),
        fetch('/api/categories'),
        fetch('/api/admin/customers', { headers }),
        fetch('/api/promotions'),
        fetch('/api/settings'),
      ]);

      const [sData, oData, pData, cData, uData, prData, settsData] = await Promise.all([
        statsRes.json(),
        ordersRes.json(),
        prodsRes.json(),
        catsRes.json(),
        custsRes.json(),
        promosRes.json(),
        settingsRes.json(),
      ]);

      if (sData.stats) setStats(sData.stats);
      if (oData.orders) setOrders(oData.orders);
      if (pData.products) setProducts(pData.products);
      if (cData.categories) setCategories(cData.categories);
      if (uData.customers) setCustomers(uData.customers);
      if (prData.promotions) setPromotions(prData.promotions);
      if (settsData.settings) setSettings(settsData.settings);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, [token]);

  // Order Actions
  const handleUpdateOrderStatus = async (orderId: string, status: OrderStatus) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          status,
          note: statusUpdateNote,
          cancelReason: status === 'rejected' ? rejectReason : undefined,
        }),
      });
      if (res.ok) {
        setStatusUpdateNote('');
        setRejectReason('');
        loadDashboardData();
        if (selectedOrder) {
          const detailRes = await fetch(`/api/orders/${orderId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const detailData = await detailRes.json();
          setSelectedOrder(detailData.order);
        }
        onRefreshData?.();
      }
    } catch (err) {
      console.error('Failed to update order status:', err);
    }
  };

  const handleUpdatePaymentStatus = async (orderId: string, paymentStatus: PaymentStatus) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/payment`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ paymentStatus, note: 'Diverifikasi langsung oleh admin' }),
      });
      if (res.ok) {
        loadDashboardData();
        if (selectedOrder) {
          const detailRes = await fetch(`/api/orders/${orderId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const detailData = await detailRes.json();
          setSelectedOrder(detailData.order);
        }
        onRefreshData?.();
      }
    } catch (err) {
      console.error('Failed to update payment status:', err);
    }
  };

  // Product Toggle
  const handleToggleProductAvailability = async (productId: string, currentStatus: boolean) => {
    try {
      await fetch(`/api/products/${productId}/availability`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ isAvailable: !currentStatus }),
      });
      loadDashboardData();
      onRefreshData?.();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Yakin ingin menghapus produk ini dari katalog?')) return;
    try {
      await fetch(`/api/products/${productId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      loadDashboardData();
      onRefreshData?.();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        name: productForm.name,
        categoryId: productForm.categoryId || categories[0]?.id,
        description: productForm.description,
        price: parseInt(productForm.price, 10),
        imageUrl: productForm.imageUrl || '/src/assets/images/coto_makassar_bowl_1794359576133.jpg',
        tag: productForm.tag,
        isAvailable: productForm.isAvailable,
        isFeatured: productForm.isFeatured,
        stock: parseInt(productForm.stock, 10) || 999,
      };

      if (editingProduct) {
        await fetch(`/api/products/${editingProduct.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });
      } else {
        await fetch('/api/products', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });
      }
      setProductModalOpen(false);
      setEditingProduct(null);
      loadDashboardData();
      onRefreshData?.();
    } catch (err) {
      console.error('Failed to save product:', err);
    }
  };

  const handleUploadProductImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingProductImg(true);
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const res = await fetch('/api/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ dataUrl: reader.result }),
        });
        const data = await res.json();
        if (data.url) {
          setProductForm((prev) => ({ ...prev, imageUrl: data.url }));
        }
      } catch (err) {
        console.error('Upload failed:', err);
      } finally {
        setUploadingProductImg(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    try {
      await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(settings),
      });
      alert('Pengaturan restoran berhasil disimpan');
    } catch {
      alert('Gagal menyimpan pengaturan');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner / Breadcrumb */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-[#E5D9CC] gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#E7BA80] bg-[#5B1F11] px-2.5 py-0.5 rounded-md uppercase tracking-wider">
              Portal Admin Restoran
            </span>
            <span className="text-xs text-[#786B63]">· Rasanna Daeng</span>
          </div>
          <h1 className="font-serif text-3xl font-bold text-[#5B1F11] mt-1">
            Manajemen Operasional
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadDashboardData}
            disabled={loading}
            className="p-2.5 rounded-xl border border-[#E5D9CC] bg-[#FFFDF9] hover:bg-[#FBF6EE] text-[#5B1F11] transition-colors flex items-center gap-2 text-xs font-semibold"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Segarkan Data</span>
          </button>
          <button
            onClick={() => setCurrentView('home')}
            className="px-4 py-2.5 rounded-xl bg-[#5B1F11] text-[#FBF6EE] hover:bg-[#3B1209] transition-colors text-xs font-semibold"
          >
            Kembali ke Beranda
          </button>
        </div>
      </div>

      {/* Admin Horizontal Tab Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-[#E5D9CC]">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
            activeTab === 'overview'
              ? 'bg-[#5B1F11] text-[#FBF6EE]'
              : 'text-[#786B63] hover:text-[#5B1F11] hover:bg-[#FBF6EE]'
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>Dashboard Ringkasan</span>
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
            activeTab === 'orders'
              ? 'bg-[#5B1F11] text-[#FBF6EE]'
              : 'text-[#786B63] hover:text-[#5B1F11] hover:bg-[#FBF6EE]'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Kelola Pesanan</span>
          {stats?.pendingOrdersCount ? (
            <span className="bg-[#B36633] text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">
              {stats.pendingOrdersCount}
            </span>
          ) : null}
        </button>

        <button
          onClick={() => setActiveTab('payments')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
            activeTab === 'payments'
              ? 'bg-[#5B1F11] text-[#FBF6EE]'
              : 'text-[#786B63] hover:text-[#5B1F11] hover:bg-[#FBF6EE]'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span>Verifikasi QRIS & Pembayaran</span>
        </button>

        <button
          onClick={() => setActiveTab('products')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
            activeTab === 'products'
              ? 'bg-[#5B1F11] text-[#FBF6EE]'
              : 'text-[#786B63] hover:text-[#5B1F11] hover:bg-[#FBF6EE]'
          }`}
        >
          <Utensils className="w-4 h-4" />
          <span>Produk & Foto ({products.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('categories')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
            activeTab === 'categories'
              ? 'bg-[#5B1F11] text-[#FBF6EE]'
              : 'text-[#786B63] hover:text-[#5B1F11] hover:bg-[#FBF6EE]'
          }`}
        >
          <FolderTree className="w-4 h-4" />
          <span>Kategori ({categories.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('customers')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
            activeTab === 'customers'
              ? 'bg-[#5B1F11] text-[#FBF6EE]'
              : 'text-[#786B63] hover:text-[#5B1F11] hover:bg-[#FBF6EE]'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Pelanggan</span>
        </button>

        <button
          onClick={() => setActiveTab('promotions')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
            activeTab === 'promotions'
              ? 'bg-[#5B1F11] text-[#FBF6EE]'
              : 'text-[#786B63] hover:text-[#5B1F11] hover:bg-[#FBF6EE]'
          }`}
        >
          <TicketPercent className="w-4 h-4" />
          <span>Voucher Promo</span>
        </button>

        <button
          onClick={() => setActiveTab('reports')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
            activeTab === 'reports'
              ? 'bg-[#5B1F11] text-[#FBF6EE]'
              : 'text-[#786B63] hover:text-[#5B1F11] hover:bg-[#FBF6EE]'
          }`}
        >
          <FileBarChart className="w-4 h-4" />
          <span>Laporan Penjualan</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
            activeTab === 'settings'
              ? 'bg-[#5B1F11] text-[#FBF6EE]'
              : 'text-[#786B63] hover:text-[#5B1F11] hover:bg-[#FBF6EE]'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>Pengaturan Restoran</span>
        </button>
      </div>

      {/* ======================================================== */}
      {/* 1. OVERVIEW TAB                                          */}
      {/* ======================================================== */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* KPI Metrics Strip */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-[#FFFDF9] border border-[#E5D9CC] shadow-xs">
              <span className="text-[11px] font-semibold text-[#786B63] uppercase tracking-wider block">
                Total Pesanan
              </span>
              <p className="text-3xl font-bold text-[#5B1F11] mt-1 tabular-nums">
                {stats?.totalOrders || 0}
              </p>
              <span className="text-[11px] text-[#786B63] mt-1 block">Semua waktu tercatat</span>
            </div>

            <div className="p-5 rounded-2xl bg-[#FFFDF9] border border-[#E5D9CC] shadow-xs">
              <span className="text-[11px] font-semibold text-[#786B63] uppercase tracking-wider block">
                Pesanan Hari Ini
              </span>
              <p className="text-3xl font-bold text-[#B36633] mt-1 tabular-nums">
                {stats?.todayOrders || 0}
              </p>
              <span className="text-[11px] text-[#786B63] mt-1 block">Transaksi masuk hari ini</span>
            </div>

            <div className="p-5 rounded-2xl bg-[#FFFDF9] border border-[#E5D9CC] shadow-xs">
              <span className="text-[11px] font-semibold text-[#786B63] uppercase tracking-wider block">
                Pendapatan Lunas
              </span>
              <p className="text-2xl font-bold text-[#2F6B45] mt-1 tabular-nums">
                {formatRupiah(stats?.verifiedRevenue || 0)}
              </p>
              <span className="text-[10px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded font-medium mt-1 inline-block">
                Terkonfirmasi Kasir / QRIS
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-[#FFFDF9] border border-[#E5D9CC] shadow-xs">
              <span className="text-[11px] font-semibold text-[#786B63] uppercase tracking-wider block">
                Menunggu Konfirmasi
              </span>
              <p className="text-3xl font-bold text-amber-700 mt-1 tabular-nums">
                {stats?.pendingOrdersCount || 0}
              </p>
              <span className="text-[11px] text-[#786B63] mt-1 block">Perlu tindakan dapur</span>
            </div>
          </div>

          {/* Sales Trend Chart & Top Sellers Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Sales Chart (7 Days) */}
            <div className="lg:col-span-7 p-6 rounded-2xl bg-[#FFFDF9] border border-[#E5D9CC] space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#5B1F11]">
                    Tren Penjualan 7 Hari Terakhir
                  </h3>
                  <p className="text-xs text-[#786B63]">Pendapatan dari pesanan yang berstatus lunas</p>
                </div>
                <TrendingUp className="w-5 h-5 text-[#B36633]" />
              </div>

              {/* Responsive SVG Chart */}
              <div className="h-48 w-full flex items-end gap-3 pt-6 border-b border-[#E5D9CC]">
                {stats?.salesChart?.map((day, idx) => {
                  const maxRev = Math.max(...(stats?.salesChart.map((s) => s.revenue) || [100000]), 100000);
                  const heightPct = Math.max(12, Math.round((day.revenue / maxRev) * 100));
                  const shortDate = day.date.slice(5);

                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group relative">
                      {/* Tooltip */}
                      <div className="absolute -top-8 bg-[#3B1209] text-[#FBF6EE] text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10 font-mono">
                        {formatRupiah(day.revenue)} ({day.orderCount} order)
                      </div>

                      <div
                        className="w-full bg-[#5B1F11] hover:bg-[#B36633] rounded-t-lg transition-all"
                        style={{ height: `${heightPct}%` }}
                      />
                      <span className="text-[10px] text-[#786B63] font-mono">{shortDate}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Top Selling Products */}
            <div className="lg:col-span-5 p-6 rounded-2xl bg-[#FFFDF9] border border-[#E5D9CC] space-y-4">
              <h3 className="font-serif text-lg font-bold text-[#5B1F11]">
                Menu Paling Terlaris
              </h3>
              <div className="space-y-3">
                {stats?.topSellingProducts && stats.topSellingProducts.length > 0 ? (
                  stats.topSellingProducts.map((top, i) => (
                    <div key={i} className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-[#FBF6EE] border border-[#E5D9CC]/60">
                      <div className="flex items-center gap-2.5">
                        <span className="w-5 h-5 rounded-full bg-[#5B1F11] text-[#FBF6EE] font-bold text-[10px] flex items-center justify-center">
                          {i + 1}
                        </span>
                        <span className="font-semibold text-[#3B1209]">{top.productName}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-[#5B1F11] block tabular-nums">{top.quantity} porsi</span>
                        <span className="text-[10px] text-[#786B63]">{formatRupiah(top.revenue)}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-[#786B63]">Belum ada data penjualan tercatat.</p>
                )}
              </div>
            </div>
          </div>

          {/* Quick Recent Orders */}
          <div className="p-6 rounded-2xl bg-[#FFFDF9] border border-[#E5D9CC] space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-lg font-bold text-[#5B1F11]">
                Pesanan Masuk Terbaru
              </h3>
              <button
                onClick={() => setActiveTab('orders')}
                className="text-xs font-semibold text-[#B36633] hover:underline"
              >
                Lihat Semua Pesanan
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-[#FBF6EE] text-[#786B63] font-semibold border-b border-[#E5D9CC]">
                  <tr>
                    <th className="p-3">No. Pesanan</th>
                    <th className="p-3">Pelanggan</th>
                    <th className="p-3">Layanan</th>
                    <th className="p-3">Total</th>
                    <th className="p-3">Status Pesanan</th>
                    <th className="p-3">Pembayaran</th>
                    <th className="p-3 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5D9CC]/60">
                  {stats?.recentOrders?.map((ord: any) => {
                    const stBadge = getOrderStatusBadge(ord.status);
                    const payBadge = getPaymentStatusBadge(ord.paymentStatus);
                    return (
                      <tr key={ord.id} className="hover:bg-[#FBF6EE]/50 transition-colors">
                        <td className="p-3 font-mono font-bold text-[#5B1F11]">{ord.orderNumber}</td>
                        <td className="p-3">
                          <span className="font-semibold block">{ord.customerName}</span>
                          <span className="text-[10px] text-[#786B63]">{ord.customerPhone}</span>
                        </td>
                        <td className="p-3">
                          {ord.serviceType === 'dine_in' ? `Dine-in (${ord.tableNumber || '-'})` : 'Takeaway'}
                        </td>
                        <td className="p-3 font-bold tabular-nums">{formatRupiah(ord.total)}</td>
                        <td className="p-3">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${stBadge.bg} ${stBadge.text}`}>
                            {stBadge.label}
                          </span>
                        </td>
                        <td className="p-3">
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${payBadge.bg} ${payBadge.text}`}>
                            {payBadge.label}
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          <button
                            onClick={async () => {
                              const res = await fetch(`/api/orders/${ord.id}`, {
                                headers: { Authorization: `Bearer ${token}` },
                              });
                              const data = await res.json();
                              setSelectedOrder(data.order);
                            }}
                            className="p-1.5 rounded-lg border border-[#E5D9CC] hover:bg-[#5B1F11] hover:text-white transition-colors"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 2. ORDERS MANAGEMENT TAB                                 */}
      {/* ======================================================== */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between p-4 bg-[#FFFDF9] rounded-2xl border border-[#E5D9CC]">
            <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
              {['all', 'pending', 'confirmed', 'preparing', 'ready', 'completed', 'rejected'].map((st) => (
                <button
                  key={st}
                  onClick={() => setOrderStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                    orderStatusFilter === st
                      ? 'bg-[#5B1F11] text-[#FBF6EE]'
                      : 'bg-[#FBF6EE] border border-[#E5D9CC] text-[#786B63] hover:text-[#5B1F11]'
                  }`}
                >
                  {st === 'all' ? 'Semua' : st === 'pending' ? 'Menunggu' : st === 'confirmed' ? 'Dikonfirmasi' : st === 'preparing' ? 'Disiapkan' : st === 'ready' ? 'Siap' : st === 'completed' ? 'Selesai' : 'Ditolak'}
                </button>
              ))}
            </div>

            <div className="w-full sm:w-64">
              <input
                type="text"
                value={orderSearch}
                onChange={(e) => setOrderSearch(e.target.value)}
                placeholder="Cari nomor pesanan / nama..."
                className="w-full text-xs px-3 py-2 rounded-xl border border-[#E5D9CC] bg-[#FBF6EE] focus:outline-none focus:border-[#B36633]"
              />
            </div>
          </div>

          {/* Orders Table */}
          <div className="bg-[#FFFDF9] rounded-2xl border border-[#E5D9CC] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-[#FBF6EE] text-[#786B63] font-semibold border-b border-[#E5D9CC]">
                  <tr>
                    <th className="p-3.5">No. Pesanan</th>
                    <th className="p-3.5">Waktu</th>
                    <th className="p-3.5">Pelanggan</th>
                    <th className="p-3.5">Layanan</th>
                    <th className="p-3.5">Total</th>
                    <th className="p-3.5">Metode</th>
                    <th className="p-3.5">Status Pesanan</th>
                    <th className="p-3.5">Status Bayar</th>
                    <th className="p-3.5 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5D9CC]/60">
                  {orders
                    .filter((o) => (orderStatusFilter === 'all' ? true : o.status === orderStatusFilter))
                    .filter((o) =>
                      orderSearch
                        ? o.orderNumber.toLowerCase().includes(orderSearch.toLowerCase()) ||
                          o.customerName.toLowerCase().includes(orderSearch.toLowerCase())
                        : true
                    )
                    .map((ord) => {
                      const stBadge = getOrderStatusBadge(ord.status);
                      const payBadge = getPaymentStatusBadge(ord.paymentStatus);

                      return (
                        <tr key={ord.id} className="hover:bg-[#FBF6EE]/40 transition-colors">
                          <td className="p-3.5 font-mono font-bold text-[#5B1F11]">{ord.orderNumber}</td>
                          <td className="p-3.5 text-[#786B63]">{formatDate(ord.createdAt)}</td>
                          <td className="p-3.5">
                            <span className="font-semibold block">{ord.customerName}</span>
                            <span className="text-[10px] text-[#786B63]">{ord.customerPhone}</span>
                          </td>
                          <td className="p-3.5">
                            <span className="font-medium text-[#3B1209]">
                              {ord.serviceType === 'dine_in' ? `Dine-in (${ord.tableNumber || '-'})` : 'Takeaway'}
                            </span>
                          </td>
                          <td className="p-3.5 font-bold tabular-nums text-[#5B1F11]">{formatRupiah(ord.total)}</td>
                          <td className="p-3.5 uppercase text-[10px] font-semibold">{ord.paymentMethod}</td>
                          <td className="p-3.5">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${stBadge.bg} ${stBadge.text}`}>
                              {stBadge.label}
                            </span>
                          </td>
                          <td className="p-3.5">
                            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${payBadge.bg} ${payBadge.text}`}>
                              {payBadge.label}
                            </span>
                          </td>
                          <td className="p-3.5 text-right">
                            <button
                              onClick={async () => {
                                const res = await fetch(`/api/orders/${ord.id}`, {
                                  headers: { Authorization: `Bearer ${token}` },
                                });
                                const data = await res.json();
                                setSelectedOrder(data.order);
                              }}
                              className="px-3 py-1.5 rounded-lg bg-[#5B1F11] text-[#FBF6EE] hover:bg-[#3B1209] transition-colors font-medium text-[11px]"
                            >
                              Kelola
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 3. PAYMENTS & QRIS VERIFICATION TAB                      */}
      {/* ======================================================== */}
      {activeTab === 'payments' && (
        <div className="space-y-6">
          <div className="p-5 rounded-2xl bg-[#FFFDF9] border border-[#E5D9CC]">
            <h3 className="font-serif text-lg font-bold text-[#5B1F11] mb-1">
              Verifikasi Pembayaran QRIS & Cash
            </h3>
            <p className="text-xs text-[#786B63]">
              Pastikan pembayaran pelanggan telah masuk ke mutasi rekening / konter kasir sebelum mengubah status menjadi Lunas.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {orders
              .filter((o) => o.paymentStatus !== 'paid')
              .map((ord) => (
                <div key={ord.id} className="p-5 rounded-2xl bg-[#FFFDF9] border border-[#E5D9CC] space-y-4 shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-[#5B1F11]">{ord.orderNumber}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${getPaymentStatusBadge(ord.paymentStatus).bg} ${getPaymentStatusBadge(ord.paymentStatus).text}`}>
                      {getPaymentStatusBadge(ord.paymentStatus).label}
                    </span>
                  </div>

                  <div className="text-xs space-y-1">
                    <p><span className="text-[#786B63]">Pelanggan:</span> <strong className="text-[#3B1209]">{ord.customerName}</strong> ({ord.customerPhone})</p>
                    <p><span className="text-[#786B63]">Metode:</span> <strong className="uppercase">{ord.paymentMethod}</strong></p>
                    <p><span className="text-[#786B63]">Total Tagihan:</span> <strong className="text-[#5B1F11] tabular-nums">{formatRupiah(ord.total)}</strong></p>
                  </div>

                  {/* QRIS Transfer Proof Preview */}
                  {ord.paymentProofUrl ? (
                    <div className="space-y-1.5">
                      <span className="text-[10px] text-[#786B63] uppercase font-bold block">Bukti Transfer Pelanggan:</span>
                      <a href={ord.paymentProofUrl} target="_blank" rel="noreferrer" className="block relative aspect-video rounded-xl overflow-hidden border border-[#E5D9CC] bg-[#FBF6EE]">
                        <img src={ord.paymentProofUrl} alt="Bukti Transfer" className="w-full h-full object-cover" />
                        <span className="absolute bottom-1 right-1 bg-black/60 text-white text-[9px] px-1.5 py-0.5 rounded">Perbesar</span>
                      </a>
                    </div>
                  ) : (
                    <div className="p-3 bg-[#FBF6EE] rounded-xl text-center text-xs text-[#786B63] border border-[#E5D9CC]">
                      {ord.paymentMethod === 'cash' ? 'Pembayaran tunai di kasir' : 'Belum mengunggah bukti transfer'}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="pt-2 flex gap-2">
                    <button
                      onClick={() => handleUpdatePaymentStatus(ord.id, 'paid')}
                      className="flex-1 py-2 px-3 rounded-xl bg-[#2F6B45] text-white text-xs font-semibold hover:bg-[#2F6B45]/90 transition-colors flex items-center justify-center gap-1.5"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Verifikasi Lunas</span>
                    </button>
                    {ord.paymentProofUrl && (
                      <button
                        onClick={() => handleUpdatePaymentStatus(ord.id, 'rejected')}
                        className="py-2 px-3 rounded-xl bg-rose-50 text-rose-700 border border-rose-200 text-xs font-semibold hover:bg-rose-100 transition-colors"
                      >
                        Tolak
                      </button>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 4. PRODUCTS MANAGEMENT TAB                               */}
      {/* ======================================================== */}
      {activeTab === 'products' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-serif text-xl font-bold text-[#5B1F11]">Katalog Produk & Foto</h3>
              <p className="text-xs text-[#786B63]">Tambah hidangan baru, ubah harga, upload foto asli, atau atur ketersediaan menu</p>
            </div>
            <button
              onClick={() => {
                setEditingProduct(null);
                setProductForm({
                  name: '',
                  categoryId: categories[0]?.id || '',
                  description: '',
                  price: '',
                  imageUrl: '/src/assets/images/coto_makassar_bowl_1794359576133.jpg',
                  tag: '',
                  isAvailable: true,
                  isFeatured: false,
                  stock: '999',
                });
                setProductModalOpen(true);
              }}
              className="px-4 py-2.5 rounded-full bg-[#5B1F11] text-[#FBF6EE] text-xs font-semibold hover:bg-[#3B1209] flex items-center gap-1.5 shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Produk Baru</span>
            </button>
          </div>

          <div className="bg-[#FFFDF9] rounded-2xl border border-[#E5D9CC] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-[#FBF6EE] text-[#786B63] font-semibold border-b border-[#E5D9CC]">
                  <tr>
                    <th className="p-3.5">Foto</th>
                    <th className="p-3.5">Nama Menu</th>
                    <th className="p-3.5">Kategori</th>
                    <th className="p-3.5">Harga</th>
                    <th className="p-3.5">Label Tag</th>
                    <th className="p-3.5">Status Ketersediaan</th>
                    <th className="p-3.5 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5D9CC]/60">
                  {products.map((p) => (
                    <tr key={p.id} className="hover:bg-[#FBF6EE]/40 transition-colors">
                      <td className="p-3.5">
                        <img
                          src={p.imageUrl}
                          alt={p.name}
                          className="w-12 h-12 rounded-lg object-cover bg-white border border-[#E5D9CC]"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src = '/logo_rasanna_daeng.svg';
                          }}
                        />
                      </td>
                      <td className="p-3.5">
                        <strong className="text-[#3B1209] block text-xs">{p.name}</strong>
                        <span className="text-[10px] text-[#786B63] line-clamp-1 max-w-xs">{p.description}</span>
                      </td>
                      <td className="p-3.5 text-[#786B63]">{p.categoryName || 'Makanan'}</td>
                      <td className="p-3.5 font-bold text-[#5B1F11] tabular-nums">{formatRupiah(p.price)}</td>
                      <td className="p-3.5">
                        {p.tag ? (
                          <span className="px-2 py-0.5 rounded-full bg-[#E7BA80]/30 text-[#3B1209] text-[10px] font-semibold">
                            {p.tag}
                          </span>
                        ) : (
                          <span className="text-[#786B63]">-</span>
                        )}
                      </td>
                      <td className="p-3.5">
                        <button
                          onClick={() => handleToggleProductAvailability(p.id, p.isAvailable)}
                          className={`px-3 py-1 rounded-full text-[10px] font-bold transition-colors ${
                            p.isAvailable
                              ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                              : 'bg-rose-100 text-rose-800 hover:bg-rose-200'
                          }`}
                        >
                          {p.isAvailable ? 'Tersedia (Aktif)' : 'Habis (Nonaktif)'}
                        </button>
                      </td>
                      <td className="p-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => {
                              setEditingProduct(p);
                              setProductForm({
                                name: p.name,
                                categoryId: p.categoryId,
                                description: p.description,
                                price: String(p.price),
                                imageUrl: p.imageUrl,
                                tag: p.tag || '',
                                isAvailable: p.isAvailable,
                                isFeatured: p.isFeatured,
                                stock: String(p.stock || 999),
                              });
                              setProductModalOpen(true);
                            }}
                            className="p-1.5 rounded-lg border border-[#E5D9CC] hover:bg-[#FBF6EE] text-[#5B1F11]"
                            title="Edit Produk"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(p.id)}
                            className="p-1.5 rounded-lg border border-[#E5D9CC] hover:bg-rose-50 text-rose-600"
                            title="Hapus Produk"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 5. CATEGORIES TAB                                        */}
      {/* ======================================================== */}
      {activeTab === 'categories' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-xl font-bold text-[#5B1F11]">Kelola Kategori Menu</h3>
            <button
              onClick={() => setCategoryModalOpen(true)}
              className="px-4 py-2 rounded-full bg-[#5B1F11] text-[#FBF6EE] text-xs font-semibold hover:bg-[#3B1209] flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Kategori</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {categories.map((c) => (
              <div key={c.id} className="p-5 rounded-2xl bg-[#FFFDF9] border border-[#E5D9CC] space-y-2">
                <span className="text-[10px] uppercase font-bold text-[#B36633] block font-mono">
                  Slug: {c.slug}
                </span>
                <h4 className="font-serif text-base font-bold text-[#3B1209]">{c.name}</h4>
                <p className="text-xs text-[#786B63]">
                  {products.filter((p) => p.categoryId === c.id).length} produk terdaftar
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 6. CUSTOMERS TAB                                         */}
      {/* ======================================================== */}
      {activeTab === 'customers' && (
        <div className="space-y-6">
          <h3 className="font-serif text-xl font-bold text-[#5B1F11]">Daftar Pelanggan Terdaftar</h3>
          <div className="bg-[#FFFDF9] rounded-2xl border border-[#E5D9CC] overflow-hidden">
            <table className="w-full text-xs text-left">
              <thead className="bg-[#FBF6EE] text-[#786B63] font-semibold border-b border-[#E5D9CC]">
                <tr>
                  <th className="p-3.5">Nama Pelanggan</th>
                  <th className="p-3.5">Email</th>
                  <th className="p-3.5">Nomor WhatsApp</th>
                  <th className="p-3.5">Total Pesanan</th>
                  <th className="p-3.5">Total Belanja Lunas</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5D9CC]/60">
                {customers.map((cust) => (
                  <tr key={cust.id} className="hover:bg-[#FBF6EE]/40">
                    <td className="p-3.5 font-bold text-[#3B1209]">{cust.name}</td>
                    <td className="p-3.5 text-[#786B63]">{cust.email}</td>
                    <td className="p-3.5 font-mono text-[#5B1F11]">{cust.phone}</td>
                    <td className="p-3.5 tabular-nums font-semibold">{cust.totalOrders} kali</td>
                    <td className="p-3.5 tabular-nums font-bold text-[#2F6B45]">
                      {formatRupiah(cust.totalSpent || 0)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 7. PROMOTIONS TAB                                        */}
      {/* ======================================================== */}
      {activeTab === 'promotions' && (
        <div className="space-y-6">
          <h3 className="font-serif text-xl font-bold text-[#5B1F11]">Voucher & Promosi Aktif</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {promotions.map((pr) => (
              <div key={pr.id} className="p-5 rounded-2xl bg-[#FFFDF9] border border-[#E5D9CC] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-sm font-bold text-[#5B1F11] bg-[#E7BA80]/20 px-2.5 py-1 rounded-md">
                    {pr.code}
                  </span>
                  <span className="text-[10px] font-bold text-[#2F6B45] bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                    {pr.discount_type === 'percentage' ? `Diskon ${pr.discount_value}%` : `Potongan ${formatRupiah(pr.discount_value)}`}
                  </span>
                </div>
                <div className="text-xs text-[#786B63] space-y-1 pt-2">
                  <p>Min. Belanja: <strong>{formatRupiah(pr.min_spend)}</strong></p>
                  <p>Maks. Potongan: <strong>{pr.max_discount > 0 ? formatRupiah(pr.max_discount) : 'Tanpa batas'}</strong></p>
                  <p>Telah digunakan: <strong>{pr.used_count} kali</strong></p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 8. REPORTS TAB                                           */}
      {/* ======================================================== */}
      {activeTab === 'reports' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-[#FFFDF9] border border-[#E5D9CC] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-serif text-xl font-bold text-[#5B1F11]">Laporan Penjualan Transaksi</h3>
              <p className="text-xs text-[#786B63]">Ekspor seluruh riwayat pesanan ke format CSV untuk analisis spreadsheet</p>
            </div>
            <a
              href="/api/admin/reports?format=csv"
              className="px-5 py-2.5 rounded-full bg-[#5B1F11] text-[#FBF6EE] hover:bg-[#3B1209] transition-colors text-xs font-semibold flex items-center gap-2 shadow-xs"
            >
              <Download className="w-4 h-4" />
              <span>Ekspor Laporan CSV</span>
            </a>
          </div>

          <div className="bg-[#FFFDF9] rounded-2xl border border-[#E5D9CC] p-6 space-y-4">
            <h4 className="font-serif text-base font-bold text-[#3B1209]">Ringkasan Laporan</h4>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-4 rounded-xl bg-[#FBF6EE] border border-[#E5D9CC]">
                <span className="text-[10px] text-[#786B63] uppercase font-bold block">Total Transaksi</span>
                <span className="text-xl font-bold text-[#3B1209] tabular-nums">{orders.length}</span>
              </div>
              <div className="p-4 rounded-xl bg-[#FBF6EE] border border-[#E5D9CC]">
                <span className="text-[10px] text-[#786B63] uppercase font-bold block">Transaksi Lunas</span>
                <span className="text-xl font-bold text-[#2F6B45] tabular-nums">
                  {orders.filter((o) => o.paymentStatus === 'paid').length}
                </span>
              </div>
              <div className="p-4 rounded-xl bg-[#FBF6EE] border border-[#E5D9CC]">
                <span className="text-[10px] text-[#786B63] uppercase font-bold block">Omset Bersih</span>
                <span className="text-xl font-bold text-[#5B1F11] tabular-nums">
                  {formatRupiah(orders.filter((o) => o.paymentStatus === 'paid').reduce((s, o) => s + o.total, 0))}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 9. SETTINGS TAB                                          */}
      {/* ======================================================== */}
      {activeTab === 'settings' && settings && (
        <form onSubmit={handleSaveSettings} className="p-6 rounded-2xl bg-[#FFFDF9] border border-[#E5D9CC] space-y-4 max-w-2xl">
          <h3 className="font-serif text-xl font-bold text-[#5B1F11]">Pengaturan Identitas Restoran</h3>

          <div>
            <label className="block text-xs font-semibold text-[#3B1209] mb-1">Nama Restoran</label>
            <input
              type="text"
              value={settings.name}
              onChange={(e) => setSettings({ ...settings, name: e.target.value })}
              className="w-full text-xs p-2.5 rounded-xl border border-[#E5D9CC] bg-[#FBF6EE]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#3B1209] mb-1">Tagline</label>
            <input
              type="text"
              value={settings.tagline}
              onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
              className="w-full text-xs p-2.5 rounded-xl border border-[#E5D9CC] bg-[#FBF6EE]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#3B1209] mb-1">Alamat Lengkap</label>
            <input
              type="text"
              value={settings.address}
              onChange={(e) => setSettings({ ...settings, address: e.target.value })}
              className="w-full text-xs p-2.5 rounded-xl border border-[#E5D9CC] bg-[#FBF6EE]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#3B1209] mb-1">Nomor WhatsApp Operasional</label>
            <input
              type="text"
              value={settings.phoneWhatsapp}
              onChange={(e) => setSettings({ ...settings, phoneWhatsapp: e.target.value })}
              className="w-full text-xs p-2.5 rounded-xl border border-[#E5D9CC] bg-[#FBF6EE]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#3B1209] mb-1">Jam Operasional</label>
            <input
              type="text"
              value={settings.openingHours}
              onChange={(e) => setSettings({ ...settings, openingHours: e.target.value })}
              className="w-full text-xs p-2.5 rounded-xl border border-[#E5D9CC] bg-[#FBF6EE]"
            />
          </div>

          <button
            type="submit"
            className="px-6 py-2.5 rounded-full bg-[#5B1F11] text-[#FBF6EE] font-semibold text-xs hover:bg-[#3B1209]"
          >
            Simpan Perubahan
          </button>
        </form>
      )}

      {/* ======================================================== */}
      {/* ORDER DETAILS & ACTION MODAL                             */}
      {/* ======================================================== */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-[#3B1209]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FFFDF9] rounded-2xl border border-[#E5D9CC] w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#E5D9CC]">
              <div>
                <span className="font-mono text-sm font-bold text-[#5B1F11]">{selectedOrder.orderNumber}</span>
                <span className="text-xs text-[#786B63] block">{formatDate(selectedOrder.createdAt)}</span>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1 rounded-full text-[#786B63] hover:text-[#5B1F11]"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            {/* Customer Details */}
            <div className="text-xs bg-[#FBF6EE] p-3.5 rounded-xl border border-[#E5D9CC] space-y-1">
              <p><span className="text-[#786B63]">Pelanggan:</span> <strong>{selectedOrder.customerName}</strong> ({selectedOrder.customerPhone})</p>
              <p>
                <span className="text-[#786B63]">Layanan:</span>{' '}
                <strong className="text-[#5B1F11]">
                  {selectedOrder.serviceType === 'dine_in' ? `Dine-in · ${selectedOrder.tableNumber}` : 'Takeaway'}
                </strong>
              </p>
              {selectedOrder.notes && (
                <p><span className="text-[#786B63]">Catatan Pesanan:</span> <em>"{selectedOrder.notes}"</em></p>
              )}
            </div>

            {/* Items */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-[#3B1209]">Daftar Menu:</h4>
              <div className="divide-y divide-[#E5D9CC] text-xs">
                {selectedOrder.items?.map((it) => (
                  <div key={it.id} className="py-2 flex justify-between">
                    <div>
                      <p className="font-semibold text-[#3B1209]">{it.quantity}x {it.productName}</p>
                      {it.notes && <p className="text-[10px] text-[#786B63]">Catatan: {it.notes}</p>}
                    </div>
                    <span className="font-mono font-semibold tabular-nums">{formatRupiah(it.subtotal)}</span>
                  </div>
                ))}
              </div>
              <div className="pt-2 border-t border-[#E5D9CC] flex justify-between font-bold text-sm text-[#5B1F11]">
                <span>Total:</span>
                <span className="tabular-nums">{formatRupiah(selectedOrder.total)}</span>
              </div>
            </div>

            {/* Status updates */}
            <div className="space-y-2 pt-2 border-t border-[#E5D9CC]">
              <h4 className="text-xs font-bold text-[#3B1209]">Ubah Status Pesanan:</h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  onClick={() => handleUpdateOrderStatus(selectedOrder.id, 'confirmed')}
                  disabled={selectedOrder.status !== 'pending'}
                  className="py-1.5 px-2 rounded-lg bg-blue-50 text-blue-800 border border-blue-200 text-xs font-semibold hover:bg-blue-100 disabled:opacity-30"
                >
                  Konfirmasi
                </button>
                <button
                  onClick={() => handleUpdateOrderStatus(selectedOrder.id, 'preparing')}
                  disabled={selectedOrder.status !== 'confirmed'}
                  className="py-1.5 px-2 rounded-lg bg-orange-50 text-orange-800 border border-orange-200 text-xs font-semibold hover:bg-orange-100 disabled:opacity-30"
                >
                  Mulai Masak
                </button>
                <button
                  onClick={() => handleUpdateOrderStatus(selectedOrder.id, 'ready')}
                  disabled={selectedOrder.status !== 'preparing'}
                  className="py-1.5 px-2 rounded-lg bg-teal-50 text-teal-800 border border-teal-200 text-xs font-semibold hover:bg-teal-100 disabled:opacity-30"
                >
                  Siap Saji
                </button>
                <button
                  onClick={() => handleUpdateOrderStatus(selectedOrder.id, 'completed')}
                  disabled={selectedOrder.status !== 'ready'}
                  className="py-1.5 px-2 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold hover:bg-emerald-100 disabled:opacity-30"
                >
                  Selesai
                </button>
              </div>
            </div>

            {/* Payment action */}
            <div className="pt-2 border-t border-[#E5D9CC] flex items-center justify-between">
              <div>
                <span className="text-[10px] text-[#786B63] block">Status Pembayaran:</span>
                <span className="text-xs font-bold text-[#3B1209]">
                  {getPaymentStatusBadge(selectedOrder.paymentStatus).label} ({selectedOrder.paymentMethod.toUpperCase()})
                </span>
              </div>
              {selectedOrder.paymentStatus !== 'paid' && (
                <button
                  onClick={() => handleUpdatePaymentStatus(selectedOrder.id, 'paid')}
                  className="py-2 px-4 rounded-xl bg-[#2F6B45] text-white text-xs font-semibold hover:bg-[#2F6B45]/90"
                >
                  Tandai Lunas
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* PRODUCT ADD / EDIT MODAL                                 */}
      {/* ======================================================== */}
      {productModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#3B1209]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FFFDF9] rounded-2xl border border-[#E5D9CC] w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E5D9CC]">
              <h3 className="font-serif text-lg font-bold text-[#5B1F11]">
                {editingProduct ? 'Ubah Produk Makanan' : 'Tambah Menu Baru'}
              </h3>
              <button onClick={() => setProductModalOpen(false)}>
                <XCircle className="w-5 h-5 text-[#786B63]" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold mb-1">Nama Menu</label>
                <input
                  type="text"
                  required
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  placeholder="Contoh: Daeng Konro Bakar"
                  className="w-full p-2.5 rounded-xl border border-[#E5D9CC] bg-[#FBF6EE]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Kategori</label>
                  <select
                    value={productForm.categoryId}
                    onChange={(e) => setProductForm({ ...productForm, categoryId: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-[#E5D9CC] bg-[#FBF6EE]"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1">Harga (Rupiah)</label>
                  <input
                    type="number"
                    required
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                    placeholder="38000"
                    className="w-full p-2.5 rounded-xl border border-[#E5D9CC] bg-[#FBF6EE]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Deskripsi Hidangan</label>
                <textarea
                  rows={2}
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  placeholder="Jelaskan aroma rempah, kelembutan daging, atau bumbu otentik..."
                  className="w-full p-2.5 rounded-xl border border-[#E5D9CC] bg-[#FBF6EE]"
                />
              </div>

              {/* Photo Upload / URL */}
              <div>
                <label className="block font-semibold mb-1">Foto Hidangan</label>
                <div className="flex gap-3 items-center">
                  <div className="w-16 h-16 rounded-xl border border-[#E5D9CC] overflow-hidden bg-white shrink-0">
                    <img
                      src={productForm.imageUrl || '/logo_rasanna_daeng.svg'}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 space-y-1.5">
                    <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#B36633] text-[#B36633] font-semibold cursor-pointer hover:bg-[#B36633]/10">
                      <Upload className="w-3.5 h-3.5" />
                      <span>{uploadingProductImg ? 'Mengunggah...' : 'Upload Foto Baru'}</span>
                      <input type="file" accept="image/*" onChange={handleUploadProductImage} className="hidden" />
                    </label>
                    <input
                      type="text"
                      value={productForm.imageUrl}
                      onChange={(e) => setProductForm({ ...productForm, imageUrl: e.target.value })}
                      placeholder="Atau masukkan path / URL gambar"
                      className="w-full text-[11px] p-2 rounded-lg border border-[#E5D9CC] bg-[#FBF6EE]"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Tag / Label Khusus</label>
                  <input
                    type="text"
                    value={productForm.tag}
                    onChange={(e) => setProductForm({ ...productForm, tag: e.target.value })}
                    placeholder="Contoh: Favorit, Best Seller"
                    className="w-full p-2.5 rounded-xl border border-[#E5D9CC] bg-[#FBF6EE]"
                  />
                </div>
                <div className="flex flex-col justify-end gap-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={productForm.isAvailable}
                      onChange={(e) => setProductForm({ ...productForm, isAvailable: e.target.checked })}
                    />
                    <span>Tersedia untuk Dipesan</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={productForm.isFeatured}
                      onChange={(e) => setProductForm({ ...productForm, isFeatured: e.target.checked })}
                    />
                    <span>Tampilkan di Menu Unggulan</span>
                  </label>
                </div>
              </div>

              <div className="pt-3 border-t border-[#E5D9CC] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setProductModalOpen(false)}
                  className="px-4 py-2 rounded-full border border-[#E5D9CC] hover:bg-[#FBF6EE]"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full bg-[#5B1F11] text-[#FBF6EE] font-semibold hover:bg-[#3B1209]"
                >
                  Simpan Produk
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CATEGORY MODAL */}
      {categoryModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#3B1209]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FFFDF9] rounded-2xl border border-[#E5D9CC] w-full max-w-sm p-6 space-y-4">
            <h3 className="font-serif text-lg font-bold text-[#5B1F11]">Tambah Kategori</h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Nama Kategori</label>
                <input
                  type="text"
                  value={catName}
                  onChange={(e) => {
                    setCatName(e.target.value);
                    setCatSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'));
                  }}
                  placeholder="Contoh: Menu Spesial"
                  className="w-full p-2.5 rounded-xl border border-[#E5D9CC] bg-[#FBF6EE]"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Slug</label>
                <input
                  type="text"
                  value={catSlug}
                  onChange={(e) => setCatSlug(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#E5D9CC] bg-[#FBF6EE]"
                />
              </div>
            </div>
            <div className="pt-2 flex justify-end gap-2 text-xs">
              <button
                onClick={() => setCategoryModalOpen(false)}
                className="px-4 py-2 rounded-full border border-[#E5D9CC]"
              >
                Batal
              </button>
              <button
                onClick={async () => {
                  if (!catName.trim() || !catSlug.trim()) return;
                  await fetch('/api/categories', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                      Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ name: catName, slug: catSlug }),
                  });
                  setCategoryModalOpen(false);
                  setCatName('');
                  setCatSlug('');
                  loadDashboardData();
                  onRefreshData?.();
                }}
                className="px-5 py-2 rounded-full bg-[#5B1F11] text-[#FBF6EE] font-semibold"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
