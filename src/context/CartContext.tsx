import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem, Order } from '../types/index.ts';

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, quantity?: number, notes?: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  updateItemNotes: (productId: string, notes: string) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  cartCount: number;
  subtotal: number;
  discount: number;
  discountCode: string | null;
  total: number;
  applyVoucher: (code: string) => Promise<{ success: boolean; message: string; discount?: number }>;
  removeVoucher: () => void;
  
  // Modals & Drawers state
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  selectedProductDetail: Product | null;
  setSelectedProductDetail: (product: Product | null) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  activeOrderReceipt: Order | null;
  setActiveOrderReceipt: (order: Order | null) => void;
  quickToast: string | null;
  setQuickToast: (msg: string | null) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('rd_cart_items');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [discountCode, setDiscountCode] = useState<string | null>(null);
  const [discount, setDiscount] = useState<number>(0);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedProductDetail, setSelectedProductDetail] = useState<Product | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [activeOrderReceipt, setActiveOrderReceipt] = useState<Order | null>(null);
  const [quickToast, setQuickToast] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('rd_cart_items', JSON.stringify(items));
  }, [items]);

  const showToast = (message: string | null) => {
    setQuickToast(message);
    if (message) {
      setTimeout(() => {
        setQuickToast((curr) => (curr === message ? null : curr));
      }, 2800);
    }
  };

  const addToCart = (product: Product, quantity = 1, notes = '') => {
    setItems((prev) => {
      const existingIndex = prev.findIndex((item) => item.product.id === product.id);
      if (existingIndex > -1) {
        const updated = [...prev];
        const newQty = updated[existingIndex].quantity + quantity;
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: newQty,
          notes: notes ? notes : updated[existingIndex].notes,
        };
        return updated;
      } else {
        return [...prev, { product, quantity, notes }];
      }
    });
    showToast(`"${product.name}" ditambahkan ke keranjang`);
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setItems((prev) =>
      prev.map((item) => (item.product.id === productId ? { ...item, quantity } : item))
    );
  };

  const updateItemNotes = (productId: string, notes: string) => {
    setItems((prev) =>
      prev.map((item) => (item.product.id === productId ? { ...item, notes } : item))
    );
  };

  const removeFromCart = (productId: string) => {
    setItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const clearCart = () => {
    setItems([]);
    setDiscountCode(null);
    setDiscount(0);
    localStorage.removeItem('rd_cart_items');
  };

  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const total = Math.max(0, subtotal - discount);

  const applyVoucher = async (code: string) => {
    if (!code || !code.trim()) {
      return { success: false, message: 'Masukkan kode voucher' };
    }
    try {
      const res = await fetch('/api/promotions/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: code.trim(), subtotal }),
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, message: data.error || 'Voucher tidak valid' };
      }
      setDiscountCode(data.code);
      setDiscount(data.discount || 0);
      showToast(`Voucher ${data.code} berhasil digunakan!`);
      return { success: true, message: 'Voucher berhasil diterapkan', discount: data.discount };
    } catch {
      return { success: false, message: 'Gagal memverifikasi voucher' };
    }
  };

  const removeVoucher = () => {
    setDiscountCode(null);
    setDiscount(0);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        updateQuantity,
        updateItemNotes,
        removeFromCart,
        clearCart,
        cartCount,
        subtotal,
        discount,
        discountCode,
        total,
        applyVoucher,
        removeVoucher,
        isCartOpen,
        setIsCartOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        selectedProductDetail,
        setSelectedProductDetail,
        isAuthModalOpen,
        setIsAuthModalOpen,
        activeOrderReceipt,
        setActiveOrderReceipt,
        quickToast,
        setQuickToast: showToast,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
