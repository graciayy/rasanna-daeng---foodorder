import React, { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, AlertCircle } from 'lucide-react';
import { Product, Category } from '../types/index.ts';
import { ProductCard } from '../components/ProductCard.tsx';

interface MenuPageProps {
  products: Product[];
  categories: Category[];
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  onOpenDetail: (product: Product) => void;
}

export const MenuPage: React.FC<MenuPageProps> = ({
  products,
  categories,
  selectedCategory,
  setSelectedCategory,
  onOpenDetail,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [onlyAvailable, setOnlyAvailable] = useState(false);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Category match
      if (selectedCategory !== 'all') {
        const cat = categories.find((c) => c.slug === selectedCategory);
        if (cat && p.categoryId !== cat.id) return false;
      }
      // Search match
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchName = p.name.toLowerCase().includes(q);
        const matchDesc = p.description.toLowerCase().includes(q);
        if (!matchName && !matchDesc) return false;
      }
      // Availability filter
      if (onlyAvailable && !p.isAvailable) {
        return false;
      }
      return true;
    });
  }, [products, categories, selectedCategory, searchQuery, onlyAvailable]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Title & Intro */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-xs font-semibold uppercase tracking-widest text-[#B36633]">
          Katalog Lengkap
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#5B1F11]">
          Menu Otentik Rasanna Daeng
        </h1>
        <p className="text-xs sm:text-sm text-[#786B63] leading-relaxed">
          Nikmati 20 sajian berempah nusantara di Politeknik Negeri Manado yang diracik segar dari 40 rempah pilihan dan bahan lokal berkualitas.
        </p>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          {/* Search Input */}
          <div className="relative w-full sm:max-w-md">
            <Search className="w-4 h-4 text-[#786B63] absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari Coto, Konro, Sarabba, Jalangkote..."
              className="w-full text-xs pl-10 pr-4 py-2.5 rounded-full border border-[#E5D9CC] bg-[#FFFDF9] focus:outline-none focus:border-[#B36633] shadow-2xs"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-2.5 text-xs text-[#786B63] hover:text-[#5B1F11]"
              >
                Reset
              </button>
            )}
          </div>

          {/* Quick Availability Toggle */}
          <label className="flex items-center gap-2 text-xs text-[#3F302A] cursor-pointer self-start sm:self-auto select-none">
            <input
              type="checkbox"
              checked={onlyAvailable}
              onChange={(e) => setOnlyAvailable(e.target.checked)}
              className="rounded text-[#5B1F11] focus:ring-[#B36633] w-4 h-4"
            />
            <span>Hanya tampilkan menu yang tersedia</span>
          </label>
        </div>

        {/* Category Tabs (Interactive Segmented Filter Buttons) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap shrink-0 transition-colors ${
              selectedCategory === 'all'
                ? 'bg-[#5B1F11] text-[#FBF6EE] shadow-xs'
                : 'bg-[#FFFDF9] border border-[#E5D9CC] text-[#3F302A] hover:border-[#B36633]'
            }`}
          >
            Semua Menu ({products.length})
          </button>

          {categories.map((cat) => {
            const count = products.filter((p) => p.categoryId === cat.id).length;
            const isSelected = selectedCategory === cat.slug;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.slug)}
                className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap shrink-0 transition-colors ${
                  isSelected
                    ? 'bg-[#5B1F11] text-[#FBF6EE] shadow-xs'
                    : 'bg-[#FFFDF9] border border-[#E5D9CC] text-[#3F302A] hover:border-[#B36633]'
                }`}
              >
                {cat.name} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Product Grid */}
      {filteredProducts.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-[#FFFDF9] border border-[#E5D9CC] space-y-3">
          <AlertCircle className="w-10 h-10 text-[#B36633] mx-auto opacity-40" />
          <h3 className="font-serif text-lg font-bold text-[#3B1209]">
            Menu Tidak Ditemukan
          </h3>
          <p className="text-xs text-[#786B63] max-w-sm mx-auto">
            Tidak ada sajian yang cocok dengan kata kunci "{searchQuery}". Silakan coba kata kunci lain atau pilih kategori lain.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
              setOnlyAvailable(false);
            }}
            className="px-4 py-2 rounded-full bg-[#5B1F11] text-[#FBF6EE] text-xs font-semibold hover:bg-[#3B1209]"
          >
            Tampilkan Semua Menu
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {filteredProducts.map((prod) => (
            <ProductCard key={prod.id} product={prod} onOpenDetail={onOpenDetail} />
          ))}
        </div>
      )}
    </div>
  );
};
