import React, { useState, useEffect } from 'react';
import {
  ArrowRight,
  Plus,
  CheckCircle2,
  MapPin,
  Clock,
  Phone,
  Sparkles,
  Utensils,
  Wifi,
  Smartphone,
  Laptop,
  Flame,
  Check,
  Copy,
} from 'lucide-react';
import { Product, Category } from '../types/index.ts';
import { useCart } from '../context/CartContext.tsx';

interface HomePageProps {
  products: Product[];
  categories: Category[];
  onOpenDetail: (product: Product) => void;
  setCurrentView: (view: string) => void;
  setSelectedCategory: (catSlug: string) => void;
}

interface NetworkInfo {
  port: number;
  localIps: string[];
  laptopUrl: string;
  phoneUrls: string[];
}

export const HomePage: React.FC<HomePageProps> = ({
  products,
  categories,
  onOpenDetail,
  setCurrentView,
  setSelectedCategory,
}) => {
  const { addToCart, setQuickToast } = useCart();
  const [networkInfo, setNetworkInfo] = useState<NetworkInfo | null>(null);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/network-info')
      .then((res) => res.json())
      .then((data) => setNetworkInfo(data))
      .catch(() => {});
  }, []);

  const copyToClipboard = (text: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedUrl(text);
    setQuickToast(`URL disalin: ${text}`);
    setTimeout(() => setCopiedUrl(null), 2500);
  };

  // Find featured products matching the poster & menu
  const cotoProduct = products.find((p) => p.name.toLowerCase().includes('coto')) || {
    id: 'prod-1',
    categoryId: 'cat-1',
    name: 'Ewako Coto',
    description: 'Coto rempah otentik dengan potongan daging sapi pilihan, disajikan dengan kuah kental kaya 40 rempah tradisional di Manado.',
    price: 38000,
    imageUrl: '/src/assets/images/coto_makassar_bowl_1794359576133.jpg',
    isAvailable: true,
    isFeatured: true,
    tag: 'Favorit',
    createdAt: new Date().toISOString(),
  };

  const konroProduct = products.find((p) => p.name.toLowerCase().includes('konro')) || {
    id: 'prod-2',
    categoryId: 'cat-1',
    name: 'Daeng Konro',
    description: 'Iga sapi empuk berdaging tebal disiram kuah rempah kluwek hitam pekat khas Manado yang gurih dan wangi.',
    price: 48000,
    imageUrl: '/src/assets/images/sop_konro_iga_1794359577471.jpg',
    isAvailable: true,
    isFeatured: true,
    tag: 'Best Seller',
    createdAt: new Date().toISOString(),
  };

  // Other highlighted signature culinary items with authentic dish photos
  const otherSignatures = products
    .filter(
      (p) =>
        p.id !== cotoProduct.id &&
        p.id !== konroProduct.id &&
        (p.isFeatured || p.tag)
    )
    .slice(0, 4);

  return (
    <div className="w-full max-w-4xl mx-auto px-3 sm:px-6 pt-2 pb-8 space-y-8 bg-[#F9F4EB]">
      {/* ============================================================ */}
      {/* 1. HERO BANNER: Poster Style Matching image.png             */}
      {/* ============================================================ */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#5A170C] via-[#481209] to-[#360B05] text-[#FFFDF9] shadow-xl">
        {/* Top Inverted Organic Wave Cutout */}
        <div className="absolute top-0 left-0 right-0 h-4 sm:h-6 overflow-hidden pointer-events-none z-10">
          <svg
            viewBox="0 0 1000 40"
            preserveAspectRatio="none"
            className="w-full h-full text-[#F9F4EB] fill-current"
          >
            <path d="M0,0 C300,35 700,35 1000,0 L1000,0 L0,0 Z" />
          </svg>
        </div>

        {/* Background Pinisi Sailing Ship Line-Art (Top Right) */}
        <div className="absolute top-3 right-2 sm:right-6 w-48 sm:w-72 h-44 sm:h-64 pointer-events-none opacity-40 sm:opacity-55 z-0">
          <svg
            viewBox="0 0 300 260"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full text-[#E7BA80]"
          >
            {/* Double masted Pinisi ship line-art */}
            <line x1="150" y1="20" x2="150" y2="200" stroke="currentColor" strokeWidth="2.5" />
            <line x1="210" y1="40" x2="210" y2="195" stroke="currentColor" strokeWidth="2.5" />
            <line x1="80" y1="90" x2="150" y2="40" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" />
            <line x1="80" y1="120" x2="150" y2="80" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" />
            <line x1="150" y1="30" x2="210" y2="50" stroke="currentColor" strokeWidth="1.5" />
            <line x1="150" y1="70" x2="210" y2="90" stroke="currentColor" strokeWidth="1.5" />
            <line x1="150" y1="20" x2="280" y2="190" stroke="currentColor" strokeWidth="1.5" />

            {/* Main Billowing Sails */}
            <path
              d="M150,25 C190,60 195,140 150,170 C140,110 142,60 150,25 Z"
              fill="currentColor"
              fillOpacity="0.2"
              stroke="currentColor"
              strokeWidth="2"
            />
            <path
              d="M150,45 C120,80 115,130 148,155 C142,110 144,70 150,45 Z"
              fill="currentColor"
              fillOpacity="0.15"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            {/* Aft Sails */}
            <path
              d="M210,45 C255,80 250,140 210,175 C200,125 202,75 210,45 Z"
              fill="currentColor"
              fillOpacity="0.2"
              stroke="currentColor"
              strokeWidth="2"
            />
            {/* Jib / Foresails */}
            <path
              d="M85,150 L148,45 L148,150 Z"
              fill="currentColor"
              fillOpacity="0.1"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            {/* Traditional Wooden Hull */}
            <path
              d="M40,195 C110,190 220,190 275,175 C265,210 180,225 65,215 C45,210 38,202 40,195 Z"
              fill="currentColor"
              fillOpacity="0.3"
              stroke="currentColor"
              strokeWidth="2.5"
            />
            <line x1="40" y1="195" x2="15" y2="175" stroke="currentColor" strokeWidth="2.5" />
            <line x1="275" y1="175" x2="288" y2="168" stroke="currentColor" strokeWidth="2" />
          </svg>
        </div>

        {/* Hero Content Container: Strict Side-by-Side on all screens via grid-cols-12 */}
        <div className="relative z-10 px-4 sm:px-8 pt-7 sm:pt-9 pb-12 sm:pb-16">
          <div className="grid grid-cols-12 items-center gap-2 relative min-h-[210px] sm:min-h-[270px]">
            {/* Left Side: col-span-7 (Headlines & Call-to-Action) */}
            <div className="col-span-7 space-y-2 sm:space-y-3 z-10 pr-1 sm:pr-4">
              {/* Category tag */}
              <p className="text-[10px] sm:text-xs font-semibold tracking-wider text-[#E7BA80] uppercase">
                Kuliner Khas Manado & Nusantara —
              </p>

              {/* Main Headline */}
              <h2 className="font-serif text-2xl sm:text-4xl lg:text-5xl font-bold text-[#FFFDF9] tracking-tight leading-[1.08]">
                Warisan Rasa <br />
                Tanah Daeng
              </h2>

              {/* Subheadline in italic serif */}
              <p className="font-serif italic text-[11px] sm:text-sm text-[#F5E8D3] leading-snug">
                Racikan 40 rempah, resep leluhur, 100% halal dan alami.
              </p>

              {/* Pill Button: Pesan Sekarang -> */}
              <div className="pt-2 flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setCurrentView('menu')}
                  className="rounded-full bg-[#FFFDF9] text-[#3B1209] hover:bg-[#F5E8D3] transition-all px-4 sm:px-6 py-2 sm:py-2.5 text-[11px] sm:text-sm font-bold shadow-md hover:shadow-xl inline-flex items-center gap-1.5 sm:gap-2 group cursor-pointer active:scale-95"
                >
                  <span>Pesan Sekarang</span>
                  <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#3B1209] group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={() => setCurrentView('about')}
                  className="hidden sm:inline-flex rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-[#FFFDF9] px-4 py-2 text-xs font-medium transition-all"
                >
                  Kisah 40 Rempah
                </button>
              </div>

              {/* Service tags */}
              <div className="flex items-center gap-3 pt-1 text-[10px] sm:text-xs text-[#E7BA80]">
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-[#E7BA80]" />
                  <span>Dine-in (Meja 01-12)</span>
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-[#E7BA80]" />
                  <span>Takeaway</span>
                </span>
              </div>
            </div>

            {/* Right Side: col-span-5 (Hero Coto Bowl & Ketupat) */}
            <div className="col-span-5 flex justify-end relative z-10">
              <div className="relative w-36 sm:w-56 aspect-square -mr-1 sm:mr-0 -mb-4 sm:-mb-8">
                {/* Steaming Bowl of Coto with ceramic dish border */}
                <div className="relative w-full h-full rounded-full p-1 sm:p-2 bg-[#E7BA80]/20 border-2 border-[#E7BA80]/40 shadow-2xl overflow-hidden group">
                  <img
                    src="/src/assets/images/coto_makassar_bowl_1794359576133.jpg"
                    alt="Ewako Coto Otentik Rasanna Daeng Manado"
                    className="w-full h-full object-cover scale-110 object-center rounded-full shadow-inner"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = '/logo_rasanna_daeng.svg';
                    }}
                  />

                  {/* Gentle rising steam curls */}
                  <div className="absolute top-1 left-1/2 -translate-x-1/2 pointer-events-none opacity-80">
                    <svg width="32" height="24" viewBox="0 0 32 24" fill="none">
                      <path
                        d="M8 20C8 14 13 12 13 6C13 3 10 1.5 10 0"
                        stroke="#FFFDF9"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        className="animate-pulse"
                      />
                      <path
                        d="M16 22C16 16 21 14 21 7C21 3.5 18 2 18 0"
                        stroke="#FFFDF9"
                        strokeWidth="1.75"
                        strokeLinecap="round"
                        className="animate-pulse"
                      />
                      <path
                        d="M24 20C24 15 28 13 28 8C28 4.5 25 3 25 0"
                        stroke="#FFFDF9"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        className="animate-pulse"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Organic Layered Waves Divider */}
        <div className="absolute bottom-0 left-0 right-0 h-10 sm:h-14 overflow-hidden pointer-events-none z-10">
          <svg viewBox="0 0 1000 80" preserveAspectRatio="none" className="w-full h-full">
            <path
              d="M0,45 C250,85 650,20 1000,55 L1000,80 L0,80 Z"
              fill="#B36633"
              fillOpacity="0.4"
            />
            <path d="M0,58 C300,90 700,35 1000,68 L1000,80 L0,80 Z" fill="#F9F4EB" />
          </svg>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 2. 4 VALUE PILLARS STRIP: Exact Match to Reference          */}
      {/* ============================================================ */}
      <section className="bg-[#F9F4EB] py-2 px-1">
        <div className="grid grid-cols-4 divide-x divide-[#E5D9CC] text-center">
          {/* Pillar 1: Racikan 40 Rempah */}
          <div className="flex flex-col items-center justify-center px-1 sm:px-3">
            <div className="mb-1.5 text-[#B36633]">
              <svg
                className="w-6 h-6 sm:w-7 sm:h-7"
                viewBox="0 0 32 32"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M6 14C6 21 10.5 25 16 25C21.5 25 26 21 26 14H6Z" />
                <path d="M4 14H28" />
                <path d="M11 25H21" />
                <path d="M21 5L14 14" strokeWidth="2.2" />
              </svg>
            </div>
            <p className="text-[11px] sm:text-xs text-[#3F302A] leading-tight">Racikan</p>
            <p className="text-[11px] sm:text-xs font-bold text-[#3B1209] leading-tight">40 Rempah</p>
          </div>

          {/* Pillar 2: 100% Halal Seal */}
          <div className="flex flex-col items-center justify-center px-1 sm:px-3">
            <div className="mb-1.5 text-[#B36633]">
              <svg
                className="w-6 h-6 sm:w-7 sm:h-7"
                viewBox="0 0 32 32"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="16" cy="16" r="12" />
                <path d="M12 11C12 14.5 13.5 17 16 17C18.5 17 20 14.5 20 11" />
                <path d="M16 11V19" />
                <path d="M13 21H19" strokeWidth="1.4" />
              </svg>
            </div>
            <p className="text-[11px] sm:text-xs text-[#3F302A] leading-tight">100%</p>
            <p className="text-[11px] sm:text-xs font-bold text-[#3B1209] leading-tight">Halal</p>
          </div>

          {/* Pillar 3: Bahan Segar Lokal */}
          <div className="flex flex-col items-center justify-center px-1 sm:px-3">
            <div className="mb-1.5 text-[#B36633]">
              <svg
                className="w-6 h-6 sm:w-7 sm:h-7"
                viewBox="0 0 32 32"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M6 22C6 22 7 13 15 11C19 10 22 7 23 5C23 9 21 13 18 16C15 19 10 21 6 22Z" />
                <path d="M14 16C14 16 15 22 21 24C24 25 26 24 27 23C27 20 25 18 23 16" />
              </svg>
            </div>
            <p className="text-[11px] sm:text-xs text-[#3F302A] leading-tight">Bahan Segar</p>
            <p className="text-[11px] sm:text-xs font-bold text-[#3B1209] leading-tight">Lokal</p>
          </div>

          {/* Pillar 4: Pelayanan Khas Sulawesi */}
          <div className="flex flex-col items-center justify-center px-1 sm:px-3">
            <div className="mb-1.5 text-[#B36633]">
              <svg
                className="w-6 h-6 sm:w-7 sm:h-7"
                viewBox="0 0 32 32"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="16" cy="10" r="3" />
                <path d="M11 23C11 19.7 13.2 17.5 16 17.5C18.8 17.5 21 19.7 21 23" />
                <circle cx="9" cy="12" r="2.2" />
                <path d="M5 23C5 20.8 6.8 19 9 19C9.8 19 10.6 19.3 11.2 19.8" />
                <circle cx="23" cy="12" r="2.2" />
                <path d="M27 23C27 20.8 25.2 19 23 19C22.2 19 21.4 19.3 20.8 19.8" />
              </svg>
            </div>
            <p className="text-[11px] sm:text-xs text-[#3F302A] leading-tight">Pelayanan</p>
            <p className="text-[11px] sm:text-xs font-bold text-[#3B1209] leading-tight">Khas Sulawesi</p>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 3. MENU UNGGULAN: 2 Featured Cards matching image.png        */}
      {/* ============================================================ */}
      <section className="space-y-4">
        {/* Section Header with Golden Flourish */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#3B1209]">
              Menu Unggulan
            </h3>
            <svg
              width="44"
              height="10"
              viewBox="0 0 44 10"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-[#B36633]"
            >
              <path
                d="M2 5C8 1 14 9 20 5C26 1 32 9 38 5C40 3 42 4 43 5"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
              />
            </svg>
          </div>

          <button
            onClick={() => {
              setSelectedCategory('all');
              setCurrentView('menu');
            }}
            className="text-xs font-bold text-[#B36633] hover:text-[#5B1F11] inline-flex items-center gap-1 group transition-colors cursor-pointer"
          >
            <span>Lihat Semua Menu</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        {/* 2 Horizontal Cards matching image.png */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {/* Card 1: Ewako Coto */}
          <div
            onClick={() => onOpenDetail(cotoProduct)}
            className="bg-[#FFFDF9] rounded-2xl border border-[#E5D9CC] p-3 shadow-xs hover:border-[#B36633] hover:shadow-md transition-all flex items-center gap-3 cursor-pointer group"
          >
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden shrink-0 bg-[#FBF6EE]">
              <img
                src={cotoProduct.imageUrl}
                alt={cotoProduct.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>

            <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
              <div>
                <span className="bg-[#B36633] text-white text-[10px] font-bold px-2 py-0.5 rounded-full inline-block">
                  Favorit
                </span>
                <h4 className="font-serif text-base sm:text-lg font-bold text-[#3B1209] mt-0.5 truncate">
                  {cotoProduct.name}
                </h4>
                <p className="text-[11px] sm:text-xs text-[#786B63] leading-snug line-clamp-2 mt-0.5">
                  {cotoProduct.description}
                </p>
              </div>

              <div className="flex items-center justify-between pt-1 mt-1">
                <span className="font-serif text-sm sm:text-base font-bold text-[#3B1209]">
                  Rp{cotoProduct.price.toLocaleString('id-ID')}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    addToCart(cotoProduct, 1);
                  }}
                  className="w-7 h-7 rounded-full bg-[#5B1F11] hover:bg-[#3B1209] text-white flex items-center justify-center transition-transform active:scale-90 shadow-xs cursor-pointer"
                  aria-label={`Tambah ${cotoProduct.name} ke keranjang`}
                >
                  <Plus className="w-4 h-4 stroke-[2.5]" />
                </button>
              </div>
            </div>
          </div>

          {/* Card 2: Daeng Konro */}
          <div
            onClick={() => onOpenDetail(konroProduct)}
            className="bg-[#FFFDF9] rounded-2xl border border-[#E5D9CC] p-3 shadow-xs hover:border-[#B36633] hover:shadow-md transition-all flex items-center gap-3 cursor-pointer group"
          >
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden shrink-0 bg-[#FBF6EE]">
              <img
                src={konroProduct.imageUrl}
                alt={konroProduct.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>

            <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
              <div>
                <span className="bg-[#B36633] text-white text-[10px] font-bold px-2 py-0.5 rounded-full inline-block">
                  Best Seller
                </span>
                <h4 className="font-serif text-base sm:text-lg font-bold text-[#3B1209] mt-0.5 truncate">
                  {konroProduct.name}
                </h4>
                <p className="text-[11px] sm:text-xs text-[#786B63] leading-snug line-clamp-2 mt-0.5">
                  {konroProduct.description}
                </p>
              </div>

              <div className="flex items-center justify-between pt-1 mt-1">
                <span className="font-serif text-sm sm:text-base font-bold text-[#3B1209]">
                  Rp{konroProduct.price.toLocaleString('id-ID')}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    addToCart(konroProduct, 1);
                  }}
                  className="w-7 h-7 rounded-full bg-[#5B1F11] hover:bg-[#3B1209] text-white flex items-center justify-center transition-transform active:scale-90 shadow-xs cursor-pointer"
                  aria-label={`Tambah ${konroProduct.name} ke keranjang`}
                >
                  <Plus className="w-4 h-4 stroke-[2.5]" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Signature Highlights with authentic dish photography */}
        {otherSignatures.length > 0 && (
          <div className="pt-2">
            <p className="text-xs font-semibold text-[#786B63] mb-3 uppercase tracking-wider">
              Pilihan Favorit Khas Lainnya:
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {otherSignatures.map((prod) => (
                <div
                  key={prod.id}
                  onClick={() => onOpenDetail(prod)}
                  className="bg-[#FFFDF9] rounded-xl border border-[#E5D9CC] p-2.5 hover:border-[#B36633] hover:shadow-sm transition-all cursor-pointer flex flex-col justify-between group"
                >
                  <div className="aspect-square rounded-lg overflow-hidden bg-[#FBF6EE] mb-2 relative">
                    <img
                      src={prod.imageUrl}
                      alt={prod.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    {prod.tag && (
                      <span className="absolute top-1 left-1 bg-[#5B1F11]/90 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                        {prod.tag}
                      </span>
                    )}
                  </div>
                  <div>
                    <h5 className="font-serif text-xs font-bold text-[#3B1209] truncate">
                      {prod.name}
                    </h5>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-[11px] font-bold text-[#5B1F11]">
                        Rp{prod.price.toLocaleString('id-ID')}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCart(prod, 1);
                        }}
                        className="w-5 h-5 rounded-full bg-[#5B1F11] text-white flex items-center justify-center text-[10px]"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* ============================================================ */}
      {/* 4. KATEGORI MENU: 4 Rounded Cards with Line-Art Copper Icons */}
      {/* ============================================================ */}
      <section className="space-y-4">
        {/* Section Header with Golden Flourish */}
        <div className="flex items-center gap-2">
          <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#3B1209]">
            Kategori Menu
          </h3>
          <svg
            width="44"
            height="10"
            viewBox="0 0 44 10"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-[#B36633]"
          >
            <path
              d="M2 5C8 1 14 9 20 5C26 1 32 9 38 5C40 3 42 4 43 5"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
            />
          </svg>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {/* Category 1: Makanan Utama */}
          <button
            onClick={() => {
              setSelectedCategory('makanan-utama');
              setCurrentView('menu');
            }}
            className="p-4 sm:p-5 rounded-2xl bg-[#FFFDF9]/90 border border-[#E5D9CC] hover:border-[#B36633] hover:shadow-sm transition-all text-center flex flex-col items-center justify-center group cursor-pointer"
          >
            <div className="mb-2 text-[#B36633] group-hover:scale-110 transition-transform">
              <svg
                className="w-8 h-8 sm:w-9 sm:h-9"
                viewBox="0 0 32 32"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M11 6C11 8 12 9 11 11" />
                <path d="M16 5C16 7 17 8 16 11" />
                <path d="M21 6C21 8 22 9 21 11" />
                <path d="M6 14C6 21 10.5 25 16 25C21.5 25 26 21 26 14H6Z" />
                <path d="M11 25H21" />
              </svg>
            </div>
            <p className="font-serif text-xs sm:text-sm font-bold text-[#3B1209] leading-tight">
              Makanan
            </p>
            <p className="font-serif text-xs sm:text-sm font-bold text-[#3B1209] leading-tight">
              Utama
            </p>
          </button>

          {/* Category 2: Camilan Tradisional */}
          <button
            onClick={() => {
              setSelectedCategory('camilan-tradisional');
              setCurrentView('menu');
            }}
            className="p-4 sm:p-5 rounded-2xl bg-[#FFFDF9]/90 border border-[#E5D9CC] hover:border-[#B36633] hover:shadow-sm transition-all text-center flex flex-col items-center justify-center group cursor-pointer"
          >
            <div className="mb-2 text-[#B36633] group-hover:scale-110 transition-transform">
              <svg
                className="w-8 h-8 sm:w-9 sm:h-9"
                viewBox="0 0 32 32"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M6 26L26 6" />
                <circle cx="10" cy="22" r="2.5" fill="#FFFDF9" />
                <circle cx="15" cy="17" r="2.5" fill="#FFFDF9" />
                <circle cx="20" cy="12" r="2.5" fill="#FFFDF9" />
                <circle cx="24" cy="8" r="1.5" fill="#FFFDF9" />
              </svg>
            </div>
            <p className="font-serif text-xs sm:text-sm font-bold text-[#3B1209] leading-tight">
              Camilan
            </p>
            <p className="font-serif text-xs sm:text-sm font-bold text-[#3B1209] leading-tight">
              Tradisional
            </p>
          </button>

          {/* Category 3: Dessert & Manisan */}
          <button
            onClick={() => {
              setSelectedCategory('dessert-manisan');
              setCurrentView('menu');
            }}
            className="p-4 sm:p-5 rounded-2xl bg-[#FFFDF9]/90 border border-[#E5D9CC] hover:border-[#B36633] hover:shadow-sm transition-all text-center flex flex-col items-center justify-center group cursor-pointer"
          >
            <div className="mb-2 text-[#B36633] group-hover:scale-110 transition-transform">
              <svg
                className="w-8 h-8 sm:w-9 sm:h-9"
                viewBox="0 0 32 32"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M8 18C8 23 12 25 16 25C20 25 24 23 24 18H8Z" />
                <path d="M16 25V28" />
                <path d="M12 28H20" />
                <circle cx="12.5" cy="14" r="3.5" fill="#FFFDF9" />
                <circle cx="19.5" cy="14" r="3.5" fill="#FFFDF9" />
                <circle cx="16" cy="10" r="3.5" fill="#FFFDF9" />
              </svg>
            </div>
            <p className="font-serif text-xs sm:text-sm font-bold text-[#3B1209] leading-tight">
              Dessert &
            </p>
            <p className="font-serif text-xs sm:text-sm font-bold text-[#3B1209] leading-tight">
              Manisan
            </p>
          </button>

          {/* Category 4: Minuman & Kopi Daeng */}
          <button
            onClick={() => {
              setSelectedCategory('minuman-kopi');
              setCurrentView('menu');
            }}
            className="p-4 sm:p-5 rounded-2xl bg-[#FFFDF9]/90 border border-[#E5D9CC] hover:border-[#B36633] hover:shadow-sm transition-all text-center flex flex-col items-center justify-center group cursor-pointer"
          >
            <div className="mb-2 text-[#B36633] group-hover:scale-110 transition-transform">
              <svg
                className="w-8 h-8 sm:w-9 sm:h-9"
                viewBox="0 0 32 32"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M7 14V20C7 22.2 8.8 24 11 24H19C21.2 24 23 22.2 23 20V14H7Z" />
                <path d="M23 16H25C26.1 16 27 16.9 27 18C27 19.1 26.1 20 25 20H23" />
                <path d="M5 26H25" />
                <path d="M11 6C11 8 12 9 11 11" />
                <path d="M15 5C15 7 16 8 15 11" />
                <path d="M19 6C19 8 20 9 19 11" />
              </svg>
            </div>
            <p className="font-serif text-xs sm:text-sm font-bold text-[#3B1209] leading-tight">
              Minuman &
            </p>
            <p className="font-serif text-xs sm:text-sm font-bold text-[#3B1209] leading-tight">
              Kopi Daeng
            </p>
          </button>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 5. DINE-IN & TAKEAWAY RESTAURANT SERVICE INFORMATION        */}
      {/* ============================================================ */}
      <section className="bg-[#FFFDF9] rounded-3xl border border-[#E5D9CC] p-5 sm:p-7 shadow-xs space-y-5">
        <div className="flex items-center gap-2">
          <Utensils className="w-5 h-5 text-[#B36633]" />
          <h3 className="font-serif text-lg sm:text-xl font-bold text-[#3B1209]">
            Layanan Dine-in & Takeaway Rasanna Daeng
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Dine-in Card */}
          <div className="p-4 bg-[#FBF6EE] rounded-2xl border border-[#E5D9CC] space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-serif font-bold text-sm text-[#5B1F11]">
                Dine-in (Makan di Tempat)
              </span>
              <span className="text-[10px] font-bold bg-[#E7BA80]/40 text-[#3B1209] px-2 py-0.5 rounded-full">
                12 Meja Nyaman
              </span>
            </div>
            <p className="text-xs text-[#786B63] leading-relaxed">
              Nikmati hangatnya hidangan berempah langsung di kawasan kampus Politeknik Negeri Manado dengan suasana sejuk dan nyaman. Cukup pilih nomor Meja 01 s/d 12 saat checkout dari HP Anda, hidangan diantar hangat ke meja.
            </p>
            <div className="flex items-center gap-1.5 text-[11px] font-medium text-[#B36633] pt-1">
              <Check className="w-3.5 h-3.5" />
              <span>Bebas antre kasir · Pelayan mengantar pesanan langsung</span>
            </div>
          </div>

          {/* Takeaway Card */}
          <div className="p-4 bg-[#FBF6EE] rounded-2xl border border-[#E5D9CC] space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-serif font-bold text-sm text-[#5B1F11]">
                Takeaway (Bawa Pulang)
              </span>
              <span className="text-[10px] font-bold bg-[#2F6B45]/20 text-[#2F6B45] px-2 py-0.5 rounded-full">
                Kemas Higienis
              </span>
            </div>
            <p className="text-xs text-[#786B63] leading-relaxed">
              Pesan dari HP di perjalanan atau kampus, kemasan mangkok anti-tumpah tahan panas menjaga kuah 40 rempah tetap mendidih wangi. Ambil di konter ekspres saat status "Siap".
            </p>
            <div className="flex items-center gap-1.5 text-[11px] font-medium text-[#2F6B45] pt-1">
              <Check className="w-3.5 h-3.5" />
              <span>Notifikasi status pesanan langsung di browser HP</span>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 6. LOCAL WI-FI NETWORK ACCESS REQUIREMENT HELPER            */}
      {/* ============================================================ */}
      <section className="bg-gradient-to-r from-[#323659]/10 via-[#5474A1]/10 to-[#FBF6EE] rounded-3xl border border-[#5474A1]/30 p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E5D9CC] pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#323659] text-white flex items-center justify-center shrink-0">
              <Wifi className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-sm sm:text-base text-[#323659]">
                Akses Jaringan Lokal (Laptop & HP / Wi-Fi)
              </h4>
              <p className="text-[11px] text-[#786B63]">
                Server berjalan di Host <code className="bg-[#E5D9CC]/60 px-1 py-0.5 rounded text-[#323659] font-mono">0.0.0.0:3000</code> siap diakses perangkat lain
              </p>
            </div>
          </div>

          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold self-start sm:self-auto">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Server Aktif & Siap Koneksi HP</span>
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {/* Laptop URL */}
          <div className="bg-[#FFFDF9] p-3.5 rounded-2xl border border-[#E5D9CC] space-y-2">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 font-bold text-[#3B1209]">
                <Laptop className="w-4 h-4 text-[#5B1F11]" />
                <span>Akses dari Laptop:</span>
              </span>
              <button
                onClick={() => copyToClipboard('http://localhost:3000')}
                className="text-[11px] text-[#B36633] hover:underline flex items-center gap-1"
              >
                {copiedUrl === 'http://localhost:3000' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                <span>Salin</span>
              </button>
            </div>
            <code className="block bg-[#FBF6EE] p-2 rounded-xl text-[#5B1F11] font-mono text-xs select-all break-all">
              http://localhost:3000
            </code>
          </div>

          {/* Phone / Mobile URL on Local Wi-Fi */}
          <div className="bg-[#FFFDF9] p-3.5 rounded-2xl border border-[#E5D9CC] space-y-2">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 font-bold text-[#3B1209]">
                <Smartphone className="w-4 h-4 text-[#323659]" />
                <span>Buka di Browser HP (Wi-Fi sama):</span>
              </span>
              {networkInfo?.localIps?.[0] && (
                <button
                  onClick={() => copyToClipboard(`http://${networkInfo.localIps[0]}:3000`)}
                  className="text-[11px] text-[#323659] hover:underline flex items-center gap-1 font-semibold"
                >
                  {copiedUrl?.includes(networkInfo.localIps[0]) ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  <span>Salin IP</span>
                </button>
              )}
            </div>
            <code className="block bg-[#FBF6EE] p-2 rounded-xl text-[#323659] font-mono text-xs select-all break-all font-semibold">
              {networkInfo?.localIps?.[0]
                ? `http://${networkInfo.localIps[0]}:3000`
                : 'http://<IP-Lokal-Laptop>:3000 (contoh: http://192.168.1.10:3000)'}
            </code>
          </div>
        </div>

        <div className="text-[11px] text-[#786B63] bg-[#FFFDF9]/80 p-3 rounded-xl border border-[#E5D9CC]/60 space-y-1">
          <p className="font-semibold text-[#3B1209]">Petunjuk Pengujian di Smartphone:</p>
          <ol className="list-decimal pl-4 space-y-0.5">
            <li>Hubungkan HP ke jaringan Wi-Fi yang sama dengan laptop.</li>
            <li>Buka browser di HP (Chrome / Safari) lalu ketik alamat IP lokal di atas.</li>
            <li>Seluruh API menggunakan relative URL (`/api/*`), sehingga otomatis terhubung ke backend tanpa error CORS.</li>
            <li>Database SQLite tersimpan lokal di laptop (<code className="font-mono text-[10px]">data/rasannadaeng.db</code>) sehingga pemesanan tetap berjalan lancar.</li>
          </ol>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 7. KISAH 40 REMPAH & BUDAYA                                  */}
      {/* ============================================================ */}
      <section className="bg-[#FFFDF9] rounded-3xl border border-[#E5D9CC] p-5 sm:p-7 shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-[#B36633]" />
          <h3 className="font-serif text-lg sm:text-xl font-bold text-[#3B1209]">
            Filosofi 40 Rempah & Kelezatan Nusantara di Manado
          </h3>
        </div>

        <p className="text-xs sm:text-sm text-[#786B63] leading-relaxed">
          Nama <strong>Rasanna Daeng</strong> menghadirkan kebanggaan rasa otentik kuliner berempah nusantara di Kota Manado. Kuah kaldu kami diramu dari 40 macam rempah nusantara pilihan—mulai dari ketumbar sangrai, jintan putih, pala, cengkeh, kayu manis, serai, lengkuas wangi, kacang tanah sangrai, hingga kluwek hitam pekat. Dipadukan dengan kehangatan persaudaraan dan keramahan khas Sulawesi.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-1">
          <div className="p-3 bg-[#FBF6EE] rounded-xl border border-[#E5D9CC] text-center">
            <span className="font-serif font-bold text-sm text-[#5B1F11] block">40 Rempah</span>
            <span className="text-[10px] text-[#786B63]">Racikan bumbu leluhur</span>
          </div>
          <div className="p-3 bg-[#FBF6EE] rounded-xl border border-[#E5D9CC] text-center">
            <span className="font-serif font-bold text-sm text-[#5B1F11] block">100% Halal</span>
            <span className="text-[10px] text-[#786B63]">Sapi lokal segar pilihan</span>
          </div>
          <div className="p-3 bg-[#FBF6EE] rounded-xl border border-[#E5D9CC] text-center col-span-2 sm:col-span-1">
            <span className="font-serif font-bold text-sm text-[#5B1F11] block">Politeknik Manado</span>
            <span className="text-[10px] text-[#786B63]">Pusat kuliner Manado</span>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 8. RESTAURANT HOURS & LOCATION QUICK INFO                   */}
      {/* ============================================================ */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        <div className="p-4 rounded-2xl bg-[#FFFDF9] border border-[#E5D9CC] flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#5B1F11]/10 flex items-center justify-center text-[#5B1F11] shrink-0">
            <MapPin className="w-4 h-4" />
          </div>
          <div>
            <h5 className="text-xs font-bold text-[#3B1209]">Lokasi Restoran</h5>
            <p className="text-[11px] text-[#786B63] mt-0.5">
              Jl. Raya Politeknik, Kampus Politeknik Negeri Manado, Kota Manado
            </p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#FFFDF9] border border-[#E5D9CC] flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#5B1F11]/10 flex items-center justify-center text-[#5B1F11] shrink-0">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <h5 className="text-xs font-bold text-[#3B1209]">Jam Operasional</h5>
            <p className="text-[11px] text-[#786B63] mt-0.5">
              Buka Setiap Hari: 09:00 - 22:00 WITA
            </p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#FFFDF9] border border-[#E5D9CC] flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#5B1F11]/10 flex items-center justify-center text-[#5B1F11] shrink-0">
            <Phone className="w-4 h-4" />
          </div>
          <div>
            <h5 className="text-xs font-bold text-[#3B1209]">WhatsApp Bantuan</h5>
            <p className="text-[11px] text-[#786B63] mt-0.5">
              0812-4567-8910 (Pesanan & Bantuan)
            </p>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 9. BOTTOM MARITIME OCEAN WAVES: Exact Match to Reference     */}
      {/* ============================================================ */}
      <section className="relative pt-4 pb-1 -mx-3 sm:-mx-6 overflow-hidden">
        <div className="relative w-full h-20 sm:h-28">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-full">
            {/* Layer 1: Kashmir Blue Maritime Wave */}
            <path
              d="M0,50 C150,15 350,85 550,45 C750,10 950,80 1200,40 L1200,120 L0,120 Z"
              fill="#5474A1"
            />
            {/* Layer 2: White Wave Foam Highlight */}
            <path
              d="M0,58 C180,25 360,92 560,52 C760,18 960,88 1200,48 L1200,60 C960,100 760,30 560,64 C360,104 180,35 0,68 Z"
              fill="#FFFDF9"
              fillOpacity="0.8"
            />
            {/* Layer 3: Martinique Deep Navy Ocean Wave */}
            <path
              d="M0,72 C160,40 340,105 540,65 C740,25 940,95 1200,55 L1200,120 L0,120 Z"
              fill="#323659"
            />
            {/* Layer 4: Deep Base */}
            <path
              d="M0,88 C200,60 400,110 600,75 C800,40 1000,100 1200,70 L1200,120 L0,120 Z"
              fill="#22253D"
            />
          </svg>
        </div>
      </section>
    </div>
  );
};
