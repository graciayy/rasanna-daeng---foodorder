export type UserRole = 'customer' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  displayOrder: number;
  icon?: string;
  isActive: boolean;
}

export interface Product {
  id: string;
  categoryId: string;
  categoryName?: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  isAvailable: boolean;
  isFeatured: boolean;
  tag?: string; // 'Favorit' | 'Best Seller' | 'Legendaris' | 'Segar Dingin'
  stock?: number;
  createdAt: string;
}

export type ServiceType = 'dine_in' | 'takeaway';

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'preparing'
  | 'ready'
  | 'completed'
  | 'rejected'
  | 'cancelled';

export type PaymentMethod = 'cash' | 'qris';

export type PaymentStatus =
  | 'unpaid'
  | 'pending_verification'
  | 'paid'
  | 'rejected';

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  notes?: string;
  subtotal: number;
  imageUrl?: string;
}

export interface OrderStatusHistory {
  id: string;
  orderId: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  actorName: string;
  actorRole: string;
  note?: string;
  createdAt: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  customerName: string;
  customerPhone: string;
  serviceType: ServiceType;
  tableNumber?: string | null;
  notes?: string;
  subtotal: number;
  discount: number;
  discountCode?: string | null;
  total: number;
  status: OrderStatus;
  cancelReason?: string | null;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  paymentProofUrl?: string | null;
  verifiedBy?: string | null;
  verifiedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  items?: OrderItem[];
  statusHistory?: OrderStatusHistory[];
  itemCount?: number;
}

export type AppView = 'home' | 'menu' | 'orders' | 'about' | 'admin';

export interface CartItem {
  product: Product;
  quantity: number;
  notes: string;
}

export interface RestaurantTable {
  id: string;
  tableNumber: string;
  capacity: number;
  isActive: boolean;
}

export interface Promotion {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minSpend: number;
  maxDiscount: number;
  quota: number;
  usedCount: number;
  isActive: boolean;
  validUntil?: string;
}

export interface RestaurantSettings {
  name: string;
  tagline: string;
  address: string;
  phoneWhatsapp: string;
  openingHours: string;
  qrisImageUrl: string;
  isRestaurantOpen: boolean;
  announcement?: string;
}

export interface DashboardStats {
  totalOrders: number;
  todayOrders: number;
  verifiedRevenue: number;
  pendingOrdersCount: number;
  activeProductsCount: number;
  salesChart: { date: string; revenue: number; orderCount: number }[];
  topSellingProducts: { productName: string; quantity: number; revenue: number }[];
  recentOrders: Order[];
}
