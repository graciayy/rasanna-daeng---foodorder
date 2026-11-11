import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext.tsx';
import { CartProvider, useCart } from './context/CartContext.tsx';
import { Header } from './components/Header.tsx';
import { Footer } from './components/Footer.tsx';
import { CartDrawer } from './components/CartDrawer.tsx';
import { CheckoutModal } from './components/CheckoutModal.tsx';
import { ProductDetailModal } from './components/ProductDetailModal.tsx';
import { OrderReceiptModal } from './components/OrderReceiptModal.tsx';
import { AuthModal } from './components/AuthModal.tsx';
import { HomePage } from './pages/HomePage.tsx';
import { MenuPage } from './pages/MenuPage.tsx';
import { OrdersHistoryPage } from './pages/OrdersHistoryPage.tsx';
import { AboutPage } from './pages/AboutPage.tsx';
import { AdminDashboard } from './pages/AdminDashboard.tsx';
import { Product, Category, Order } from './types/index.ts';
import { CheckCircle2 } from 'lucide-react';

function AppContent() {
  const [currentView, setCurrentView] = useState<string>('home');
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  const {
    selectedProductDetail,
    setSelectedProductDetail,
    activeOrderReceipt,
    setActiveOrderReceipt,
    quickToast,
  } = useCart();

  const { isAdmin } = useAuth();

  const loadData = () => {
    Promise.all([
      fetch('/api/products').then((res) => res.json()),
      fetch('/api/categories').then((res) => res.json()),
    ])
      .then(([prodsData, catsData]) => {
        if (prodsData.products) setProducts(prodsData.products);
        if (catsData.categories) setCategories(catsData.categories);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#FBF6EE] text-[#3F302A]">
      {/* Toast Notification */}
      {quickToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#3B1209] text-[#FBF6EE] px-4 py-2.5 rounded-2xl shadow-xl border border-[#E7BA80]/40 flex items-center gap-2.5 text-xs animate-in slide-in-from-bottom-2 fade-in">
          <CheckCircle2 className="w-4 h-4 text-[#E7BA80] shrink-0" />
          <span className="font-medium">{quickToast}</span>
        </div>
      )}

      {/* Main Header */}
      <Header currentView={currentView} setCurrentView={setCurrentView} />

      {/* Main Content Area */}
      <main className="flex-1">
        {loading ? (
          <div className="py-24 text-center">
            <div className="w-12 h-12 border-4 border-[#B36633] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="font-serif text-lg font-bold text-[#5B1F11]">Menyiapkan Dapur Rasanna Daeng...</p>
            <p className="text-xs text-[#786B63] mt-1">Menghangatkan 40 rempah leluhur di Politeknik Negeri Manado</p>
          </div>
        ) : (
          <>
            {currentView === 'home' && (
              <HomePage
                products={products}
                categories={categories}
                onOpenDetail={(p) => setSelectedProductDetail(p)}
                setCurrentView={setCurrentView}
                setSelectedCategory={setSelectedCategory}
              />
            )}

            {currentView === 'menu' && (
              <MenuPage
                products={products}
                categories={categories}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                onOpenDetail={(p) => setSelectedProductDetail(p)}
              />
            )}

            {currentView === 'orders' && (
              <OrdersHistoryPage
                onSelectOrder={(ord) => setActiveOrderReceipt(ord)}
                setCurrentView={setCurrentView}
              />
            )}

            {currentView === 'about' && <AboutPage />}

            {currentView === 'admin' && (
              <AdminDashboard
                setCurrentView={setCurrentView}
                onRefreshData={loadData}
              />
            )}
          </>
        )}
      </main>

      {/* Global Modals & Drawers */}
      <CartDrawer />
      <CheckoutModal />
      <ProductDetailModal
        product={selectedProductDetail}
        onClose={() => setSelectedProductDetail(null)}
      />
      <OrderReceiptModal
        order={activeOrderReceipt}
        onClose={() => setActiveOrderReceipt(null)}
        onRefresh={loadData}
      />
      <AuthModal />

      {/* Footer */}
      <Footer setCurrentView={setCurrentView} />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </AuthProvider>
  );
}
