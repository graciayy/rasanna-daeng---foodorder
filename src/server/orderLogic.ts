import { OrderStatus, PaymentStatus, Promotion } from '../types/index.ts';

export interface PricingItemInput {
  price: number;
  quantity: number;
}

export interface PricingResult {
  subtotal: number;
  discount: number;
  total: number;
  appliedCode?: string;
  discountError?: string;
}

/**
 * Calculates order subtotal, applies voucher promotion rules, and computes final total.
 * Enforces server-side authority: client cannot fabricate totals.
 */
export function calculateOrderPricing(
  items: PricingItemInput[],
  promotion?: Promotion | null
): PricingResult {
  const subtotal = items.reduce((sum, item) => {
    const qty = Math.max(1, Math.floor(item.quantity || 1));
    const price = Math.max(0, item.price || 0);
    return sum + price * qty;
  }, 0);

  let discount = 0;
  let appliedCode: string | undefined = undefined;
  let discountError: string | undefined = undefined;

  if (promotion) {
    if (!promotion.isActive) {
      discountError = 'Voucher promo sudah tidak aktif';
    } else if (promotion.quota > 0 && promotion.usedCount >= promotion.quota) {
      discountError = 'Kuota penggunaan voucher telah habis';
    } else if (subtotal < promotion.minSpend) {
      discountError = `Minimal belanja Rp${promotion.minSpend.toLocaleString('id-ID')} untuk menggunakan voucher ini`;
    } else {
      if (promotion.discountType === 'percentage') {
        const rawDiscount = Math.round((subtotal * promotion.discountValue) / 100);
        discount = promotion.maxDiscount > 0 ? Math.min(rawDiscount, promotion.maxDiscount) : rawDiscount;
      } else {
        discount = promotion.discountValue;
      }
      // Ensure discount doesn't exceed subtotal
      discount = Math.min(discount, subtotal);
      appliedCode = promotion.code;
    }
  }

  const total = Math.max(0, subtotal - discount);

  return {
    subtotal,
    discount,
    total,
    appliedCode,
    discountError,
  };
}

/**
 * Generates an authentic unique order number: RD-YYYYMMDD-XXXX
 */
export function generateOrderNumber(date: Date = new Date(), randomSuffix?: string): string {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  const suffix = randomSuffix || Math.random().toString(36).substring(2, 6).toUpperCase();
  return `RD-${yyyy}${mm}${dd}-${suffix}`;
}

/**
 * Validates allowable order status transitions.
 */
export function canTransitionOrderStatus(current: OrderStatus, next: OrderStatus): boolean {
  if (current === next) return true;

  const allowable: Record<OrderStatus, OrderStatus[]> = {
    pending: ['confirmed', 'rejected', 'cancelled'],
    confirmed: ['preparing', 'cancelled'],
    preparing: ['ready', 'cancelled'],
    ready: ['completed'],
    completed: [],
    rejected: [],
    cancelled: [],
  };

  return allowable[current]?.includes(next) ?? false;
}

/**
 * Validates allowable payment status transitions.
 */
export function canTransitionPaymentStatus(current: PaymentStatus, next: PaymentStatus): boolean {
  if (current === next) return true;

  const allowable: Record<PaymentStatus, PaymentStatus[]> = {
    unpaid: ['pending_verification', 'paid'],
    pending_verification: ['paid', 'rejected'],
    rejected: ['pending_verification', 'paid'],
    paid: [],
  };

  return allowable[current]?.includes(next) ?? false;
}
