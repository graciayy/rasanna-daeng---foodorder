import React, { useState } from 'react';
import { ShoppingBag, Search, Menu as MenuIcon, X, Shield, Clock, MapPin, User as UserIcon, Phone, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext.tsx';
import { useAuth } from '../context/AuthContext.tsx';

interface HeaderProps {
  currentView: string;
  setCurrentView: (view: string) => void;
  onOpenSearch?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ currentView, setCurrentView }) => {
  const { cartCount, setIsCartOpen, setIsAuthModalOpen } = useCart();
  const { user, isAuthenticated, isAdmin, logout, quickLoginAs } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setCurrentView('menu');
      setSearchModalOpen(false);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#F9F4EB]/95 backdrop-blur-md border-b border-[#E5D9CC] transition-all">
        {/* Top bar container matching image.png exactly */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-2.5 sm:py-3.5">
          <div className="flex items-center justify-between">
            {/* Left: Hamburger Icon */}
            <div className="flex items-center">
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="p-2 -ml-2 rounded-xl text-[#3B1209] hover:bg-[#EFE8DC] transition-colors focus:outline-none cursor-pointer"
                aria-label="Buka Menu Navigasi"
              >
                <MenuIcon className="w-6 h-6 stroke-[2]" />
              </button>
            </div>

            {/* Center: Brand Lockup matching poster exactly */}
            <div
              onClick={() => {
                setCurrentView('home');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex flex-col items-center cursor-pointer select-none group text-center"
            >
              {/* Pinisi Boat Logo */}
              <img
                src="/logo_rasanna_daeng.svg"
                alt="Logo Pinisi Rasanna Daeng"
                className="w-10 h-10 sm:w-11 sm:h-11 object-contain drop-shadow-xs transition-transform group-hover:scale-105"
              />

              {/* Title & Subtitle */}
              <h1 className="font-serif text-lg sm:text-2xl font-black tracking-wider text-[#5B1F11] leading-tight mt-0.5">
                RASANNA DAENG
              </h1>
              <p className="font-serif italic text-[11px] sm:text-xs text-[#5B1F11]/90 tracking-wide">
                — Cita Rasa Otentik Anging Mammiri —
              </p>

              {/* Delicate Wave Flourish underneath */}
              <div className="mt-1 flex items-center justify-center">
                <svg
                  width="44"
                  height="8"
                  viewBox="0 0 44 8"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-[#B36633]"
                >
                  <path
                    d="M2 4C8 1 14 7 20 4C26 1 32 7 38 4C40 2.5 42 3.5 43 4"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </div>

            {/* Right: Search & Cart icons */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Search button */}
              <button
                onClick={() => setSearchModalOpen(true)}
                className="p-2 rounded-xl text-[#3B1209] hover:bg-[#EFE8DC] transition-colors focus:outline-none cursor-pointer"
                aria-label="Cari menu makanan"
              >
                <Search className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2]" />
              </button>

              {/* Cart button with red badge count */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 rounded-xl text-[#3B1209] hover:bg-[#EFE8DC] transition-colors focus:outline-none cursor-pointer"
                aria-label={`Keranjang belanja ${cartCount} pesanan`}
              >
                <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2]" />
                <span className="absolute top-0.5 -right-0.5 sm:top-1 sm:right-1 bg-[#A33227] text-white text-[10px] sm:text-xs font-bold rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center shadow-xs">
                  {cartCount > 0 ? cartCount : 3}
                </span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Quick Search Modal */}
      {searchModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-start justify-center pt-16 px-4 animate-in fade-in">
          <div className="bg-[#FFFDF9] w-full max-w-lg rounded-3xl p-5 border border-[#E5D9CC] shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#E5D9CC]">
              <div className="flex items-center gap-2">
                <Search className="w-5 h-5 text-[#B36633]" />
                <h3 className="font-serif text-base font-bold text-[#3B1209]">Cari Kuliner Rasanna Daeng</h3>
              </div>
              <button
                onClick={() => setSearchModalOpen(false)}
                className="p-1 rounded-full text-[#786B63] hover:text-[#3B1209] hover:bg-[#FBF6EE]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                autoFocus
                placeholder="Cari Coto, Konro, Pisang Ijo, Sarabba, Pallu Basa..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-4 pr-12 py-3 rounded-xl bg-[#FBF6EE] border border-[#E5D9CC] text-sm text-[#3F302A] placeholder:text-[#786B63] focus:outline-none focus:border-[#B36633]"
              />
              <button
                type="submit"
                className="absolute right-2 top-2 p-1.5 rounded-lg bg-[#5B1F11] text-white hover:bg-[#3B1209]"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="pt-1">
              <p className="text-[11px] text-[#786B63] mb-2 font-medium">Pencarian Populer:</p>
              <div className="flex flex-wrap gap-2">
                {['Ewako Coto', 'Daeng Konro', 'Mantap Pallu Basa', 'Es Pisang Ijo', 'Jalangkote', 'Kopi Daeng'].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => {
                      setSearchQuery(tag);
                      setCurrentView('menu');
                      setSearchModalOpen(false);
                    }}
                    className="text-xs px-3 py-1.5 rounded-full bg-[#FBF6EE] hover:bg-[#E7BA80]/30 border border-[#E5D9CC] text-[#3F302A] transition-colors"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Slide-out Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer content */}
          <div className="relative w-full max-w-xs bg-[#FFFDF9] h-full shadow-2xl flex flex-col z-10 border-r border-[#E5D9CC]">
            {/* Drawer Header */}
            <div className="p-5 border-b border-[#E5D9CC] bg-[#F9F4EB] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src="/logo_rasanna_daeng.svg"
                  alt="Logo Rasanna Daeng"
                  className="w-8 h-8 object-contain"
                />
                <div>
                  <h3 className="font-serif font-bold text-sm text-[#5B1F11]">Rasanna Daeng</h3>
                  <p className="text-[10px] text-[#786B63]">Politeknik Negeri Manado</p>
                </div>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 rounded-full text-[#786B63] hover:text-[#3B1209] hover:bg-[#EFE8DC]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation Links */}
            <div className="flex-1 overflow-y-auto p-4 space-y-1 text-sm font-medium">
              <button
                onClick={() => {
                  setCurrentView('home');
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-4 py-3 rounded-xl transition-colors flex items-center justify-between ${
                  currentView === 'home'
                    ? 'bg-[#5B1F11] text-white font-semibold'
                    : 'text-[#3F302A] hover:bg-[#FBF6EE]'
                }`}
              >
                <span>Beranda (Poster Menu)</span>
                <ArrowRight className="w-4 h-4 opacity-70" />
              </button>

              <button
                onClick={() => {
                  setCurrentView('menu');
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-4 py-3 rounded-xl transition-colors flex items-center justify-between ${
                  currentView === 'menu'
                    ? 'bg-[#5B1F11] text-white font-semibold'
                    : 'text-[#3F302A] hover:bg-[#FBF6EE]'
                }`}
              >
                <span>Katalog Menu Lengkap</span>
                <span className="text-xs bg-[#E7BA80]/40 text-[#3B1209] px-2 py-0.5 rounded-full font-bold">20 Menu</span>
              </button>

              <button
                onClick={() => {
                  if (!isAuthenticated) {
                    setIsAuthModalOpen(true);
                  } else {
                    setCurrentView('orders');
                  }
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-4 py-3 rounded-xl transition-colors flex items-center justify-between ${
                  currentView === 'orders'
                    ? 'bg-[#5B1F11] text-white font-semibold'
                    : 'text-[#3F302A] hover:bg-[#FBF6EE]'
                }`}
              >
                <span>Lacak & Riwayat Pesanan</span>
                <ArrowRight className="w-4 h-4 opacity-70" />
              </button>

              <button
                onClick={() => {
                  setCurrentView('about');
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-4 py-3 rounded-xl transition-colors flex items-center justify-between ${
                  currentView === 'about'
                    ? 'bg-[#5B1F11] text-white font-semibold'
                    : 'text-[#3F302A] hover:bg-[#FBF6EE]'
                }`}
              >
                <span>Kisah 40 Rempah Tanah Daeng</span>
                <ArrowRight className="w-4 h-4 opacity-70" />
              </button>

              {isAdmin && (
                <button
                  onClick={() => {
                    setCurrentView('admin');
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full text-left px-4 py-3 rounded-xl transition-colors flex items-center gap-2 mt-2 font-bold ${
                    currentView === 'admin'
                      ? 'bg-[#323659] text-white'
                      : 'bg-[#323659]/10 text-[#323659] hover:bg-[#323659]/20'
                  }`}
                >
                  <Shield className="w-4 h-4" />
                  <span>Panel Admin Restoran</span>
                </button>
              )}

              {/* User Account Section in Drawer */}
              <div className="pt-4 mt-4 border-t border-[#E5D9CC]">
                {isAuthenticated ? (
                  <div className="bg-[#FBF6EE] p-3 rounded-2xl border border-[#E5D9CC] space-y-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-[#5B1F11] text-[#E7BA80] flex items-center justify-center font-bold text-xs">
                        {user?.name.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-[#3B1209] truncate">{user?.name}</p>
                        <p className="text-[10px] text-[#786B63] truncate">{user?.phone || user?.email}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        logout();
                        setMobileMenuOpen(false);
                      }}
                      className="w-full py-1.5 text-xs text-rose-700 bg-white border border-rose-200 rounded-lg font-medium hover:bg-rose-50"
                    >
                      Keluar (Logout)
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setIsAuthModalOpen(true);
                      setMobileMenuOpen(false);
                    }}
                    className="w-full py-2.5 bg-[#5B1F11] text-white rounded-xl text-xs font-bold hover:bg-[#3B1209] transition-colors flex items-center justify-center gap-2 shadow-xs"
                  >
                    <UserIcon className="w-4 h-4" />
                    <span>Masuk / Daftar Akun</span>
                  </button>
                )}
              </div>

              {/* Demo Accounts Quick Switcher */}
              <div className="pt-3 text-[11px]">
                <p className="text-[#786B63] mb-1.5 font-medium">Akses Demo Cepat:</p>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={async () => {
                      await quickLoginAs('customer');
                      setMobileMenuOpen(false);
                    }}
                    className="py-1.5 px-2 text-center rounded-lg bg-[#FBF6EE] border border-[#E5D9CC] text-[#3F302A] font-semibold hover:border-[#B36633]"
                  >
                    Pelanggan
                  </button>
                  <button
                    onClick={async () => {
                      await quickLoginAs('admin');
                      setCurrentView('admin');
                      setMobileMenuOpen(false);
                    }}
                    className="py-1.5 px-2 text-center rounded-lg bg-[#5B1F11]/10 text-[#5B1F11] font-bold hover:bg-[#5B1F11]/20"
                  >
                    Admin Toko
                  </button>
                </div>
              </div>
            </div>

            {/* Drawer Footer Info */}
            <div className="p-4 bg-[#F9F4EB] border-t border-[#E5D9CC] text-[11px] text-[#786B63] space-y-1.5">
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-[#B36633] shrink-0" />
                <span>Buka: 09:00 - 22:00 WITA</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#B36633] shrink-0" />
                <span>Politeknik Negeri Manado, Kota Manado</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#B36633] shrink-0" />
                <span>WA: 0812-4567-8910</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
