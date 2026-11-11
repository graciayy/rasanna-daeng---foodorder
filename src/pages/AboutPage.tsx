import React from 'react';
import { Sparkles, Compass, ShieldCheck, Heart } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Hero Story */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-semibold uppercase tracking-widest text-[#B36633]">
          Kisah & Warisan Leluhur
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#5B1F11] leading-tight">
          Cita Rasa Otentik Anging Mammiri di Politeknik Negeri Manado
        </h1>
        <p className="text-sm sm:text-base text-[#786B63] leading-relaxed">
          Berakar dari keagungan peradaban maritim nusantara, Rasanna Daeng menghidupkan kembali rahasia dapur leluhur dengan racikan 40 rempah alami pilihan di Politeknik Negeri Manado.
        </p>
      </div>

      {/* Main Philosophy Card */}
      <div className="bg-[#FFFDF9] rounded-3xl border border-[#E5D9CC] p-8 sm:p-12 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="space-y-4 text-xs sm:text-sm text-[#3F302A] leading-relaxed">
          <h2 className="font-serif text-2xl font-bold text-[#5B1F11]">
            Makna Lambang Perahu Pinisi
          </h2>
          <p>
            Logo perahu layar Rasanna Daeng terinspirasi dari ketangguhan Pinisi, mahakarya para pelaut nusantara yang menjelajahi samudra dunia. Seperti kapal yang mengarungi lautan, kami membawa perjalanan warisan rempah Nusantara dari generasi ke generasi hingga hadir di Manado.
          </p>
          <p>
            Layar yang terkembang menangkap angin menggambarkan filosofi <em>Anging Mammiri</em> — membawa pesan kehangatan, keramahan, dan harumnya kuliner berempah nusantara kepada siapa pun yang bersantap di Kota Manado.
          </p>
        </div>

        <div className="relative aspect-square rounded-2xl bg-[#5B1F11] p-8 flex items-center justify-center border border-[#E5D9CC] shadow-inner">
          <div className="w-48 h-48 p-4 bg-white/10 rounded-2xl backdrop-blur-xs border border-white/20 flex items-center justify-center">
            <img src="/logo_rasanna_daeng.svg" alt="Pinisi Rasanna Daeng" className="w-full h-full object-contain" />
          </div>
        </div>
      </div>

      {/* The 40 Spices Breakdown */}
      <div className="space-y-6">
        <div className="text-center max-w-xl mx-auto">
          <h2 className="font-serif text-3xl font-bold text-[#5B1F11]">
            Rahasia 40 Rempah Alami
          </h2>
          <p className="text-xs text-[#786B63] mt-1">
            Setiap kuah Coto, kuah Konro, dan bumbu Palekko diracik tanpa penyedap sintetis, mengandalkan kekuatan rempah murni Sulawesi.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-[#FFFDF9] border border-[#E5D9CC] space-y-2">
            <h3 className="font-serif text-lg font-bold text-[#B36633]">Rempah Inti Hangat</h3>
            <p className="text-xs text-[#786B63] leading-relaxed">
              Pala Banda, cengkeh, kayu manis, ketumbar sangrai, jintan putih, kapulaga, dan adas manis yang memberikan aroma wangi khas yang menenangkan.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#FFFDF9] border border-[#E5D9CC] space-y-2">
            <h3 className="font-serif text-lg font-bold text-[#B36633]">Bumbu Segar Pesisir</h3>
            <p className="text-xs text-[#786B63] leading-relaxed">
              Lengkuas merah, jahe emprit, serai wangi, daun salam, bawang merah Parigi, dan bawang putih Brebes yang diulek halus secara tradisional.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#FFFDF9] border border-[#E5D9CC] space-y-2">
            <h3 className="font-serif text-lg font-bold text-[#B36633]">Kekayaan Gurih Alami</h3>
            <p className="text-xs text-[#786B63] leading-relaxed">
              Kacang tanah sangrai tumbuk untuk kekentalan coto, kluwek tua matang untuk sop konro, dan serundeng kelapa bakar untuk pallu basa.
            </p>
          </div>
        </div>
      </div>

      {/* Location & Hospitality */}
      <div className="bg-[#FBF6EE] rounded-3xl border border-[#E5D9CC] p-8 text-center space-y-3">
        <h3 className="font-serif text-2xl font-bold text-[#5B1F11]">
          Kunjungi Kami di Politeknik Negeri Manado
        </h3>
        <p className="text-xs text-[#786B63] max-w-lg mx-auto">
          Nikmati santap siang maupun malam berempah hangat di kawasan kampus Politeknik Negeri Manado, Kota Manado.
        </p>
        <p className="text-xs font-semibold text-[#3B1209]">
          Jl. Raya Politeknik, Kampus Politeknik Negeri Manado, Buha, Kec. Mapanget, Kota Manado, Sulawesi Utara 95252 · WhatsApp: 0812-4567-8910
        </p>
      </div>
    </div>
  );
};
