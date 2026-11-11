import React from 'react';
import { Phone, MapPin, Clock, ShieldCheck, Heart } from 'lucide-react';

interface FooterProps {
  setCurrentView: (view: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ setCurrentView }) => {
  return (
    <footer className="bg-[#3B1209] text-[#FFFDF9] pt-16 pb-12 relative overflow-hidden border-t-4 border-[#B36633]">
      {/* Wave decor on top */}
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-[#323659] via-[#5474A1] to-[#E7BA80]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-white/10">
          {/* Col 1: Brand & Heritage */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-white/10 p-1 flex items-center justify-center border border-[#E7BA80]/30">
                <img src="/logo_rasanna_daeng.svg" alt="Rasanna Daeng" className="w-full h-full object-contain" />
              </div>
              <div>
                <span className="font-serif text-xl font-bold tracking-tight text-[#E7BA80] leading-none block">
                  RASANNA DAENG
                </span>
                <span className="text-[10px] text-[#E7BA80]/80 tracking-widest uppercase block mt-1">
                  Cita Rasa Otentik Anging Mammiri
                </span>
              </div>
            </div>
            <p className="text-xs text-[#E5D9CC]/80 leading-relaxed">
              Warisan kuliner nusantara dengan racikan 40 rempah alami leluhur. Menghadirkan kenikmatan Coto, Konro, Pallu Basa, dan hidangan pesisir otentik di setiap suapan di Politeknik Negeri Manado.
            </p>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className="font-serif text-sm font-bold text-[#E7BA80] uppercase tracking-wider mb-4">
              Navigasi Menu
            </h4>
            <ul className="space-y-2.5 text-xs text-[#E5D9CC]/80">
              <li>
                <button
                  onClick={() => {
                    setCurrentView('home');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-[#E7BA80] transition-colors"
                >
                  Beranda Restoran
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setCurrentView('menu');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-[#E7BA80] transition-colors"
                >
                  Katalog 20 Menu Pilihan
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setCurrentView('orders');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-[#E7BA80] transition-colors"
                >
                  Lacak Pesanan Anda
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setCurrentView('about');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-[#E7BA80] transition-colors"
                >
                  Filosofi & Kisah Rempah
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setCurrentView('admin');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-[#E7BA80] transition-colors flex items-center gap-1.5"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-[#E7BA80]" />
                  <span>Portal Pengelola (Admin)</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Layanan & Jam Operasional */}
          <div>
            <h4 className="font-serif text-sm font-bold text-[#E7BA80] uppercase tracking-wider mb-4">
              Layanan & Waktu
            </h4>
            <div className="space-y-3 text-xs text-[#E5D9CC]/80">
              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-[#B36633] shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-white">Jam Operasional</p>
                  <p>Senin - Minggu: 09:00 - 22:00 WITA</p>
                </div>
              </div>
              <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                <p className="font-semibold text-white mb-1">Dine-in & Takeaway</p>
                <p className="text-[11px] text-[#E5D9CC]/70">
                  Tersedia 12 meja nyaman di Politeknik Negeri Manado atau pesan bawa pulang tanpa antre.
                </p>
              </div>
            </div>
          </div>

          {/* Col 4: Lokasi & Kontak */}
          <div>
            <h4 className="font-serif text-sm font-bold text-[#E7BA80] uppercase tracking-wider mb-4">
              Lokasi & Reservasi
            </h4>
            <div className="space-y-3 text-xs text-[#E5D9CC]/80">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#B36633] shrink-0 mt-0.5" />
                <p>Jl. Raya Politeknik, Kampus Politeknik Negeri Manado, Buha, Kec. Mapanget, Kota Manado, Sulawesi Utara 95252</p>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#B36633] shrink-0" />
                <p>WhatsApp: 0812-4567-8910</p>
              </div>
              <div className="pt-2">
                <span className="inline-block px-3 py-1 rounded-full bg-[#2F6B45]/30 text-emerald-300 text-[11px] font-semibold border border-emerald-500/30">
                  100% Halal & Bahan Segar Lokal
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#E5D9CC]/60 gap-4">
          <p>© 2026 Rasanna Daeng. Hak Cipta Dilindungi Undang-Undang.</p>
          <p className="flex items-center gap-1.5">
            <span>Dibuat dengan cinta untuk kuliner Manado & Nusantara</span>
            <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
          </p>
        </div>
      </div>
    </footer>
  );
};
