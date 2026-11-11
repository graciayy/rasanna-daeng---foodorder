import React, { useState } from 'react';
import { X, Lock, Mail, User, Phone, AlertCircle, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';
import { useCart } from '../context/CartContext.tsx';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, setIsAuthModalOpen } = useCart();
  const { login, register, quickLoginAs } = useAuth();

  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (tab === 'login') {
      const res = await login(email, password);
      setLoading(false);
      if (!res.success) {
        setError(res.error || 'Login gagal');
      } else {
        setIsAuthModalOpen(false);
      }
    } else {
      if (!name || !email || !phone || !password) {
        setError('Semua data wajib diisi');
        setLoading(false);
        return;
      }
      const res = await register(name, email, phone, password);
      setLoading(false);
      if (!res.success) {
        setError(res.error || 'Registrasi gagal');
      } else {
        setIsAuthModalOpen(false);
      }
    }
  };

  const handleQuickDemo = async (role: 'admin' | 'customer') => {
    setLoading(true);
    await quickLoginAs(role);
    setLoading(false);
    setIsAuthModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#3B1209]/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-md bg-[#FFFDF9] rounded-2xl border border-[#E5D9CC] shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 bg-[#5B1F11] text-[#FBF6EE] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 p-1 flex items-center justify-center">
              <img src="/logo_rasanna_daeng.svg" alt="Rasanna Daeng" className="w-full h-full object-contain" />
            </div>
            <div>
              <h2 className="font-serif text-xl font-bold">
                {tab === 'login' ? 'Masuk ke Akun Anda' : 'Daftar Akun Baru'}
              </h2>
              <p className="text-xs text-[#E7BA80]">Rasanna Daeng · Pesan & Lacak Kuliner</p>
            </div>
          </div>
          <button
            onClick={() => setIsAuthModalOpen(false)}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex border-b border-[#E5D9CC] bg-[#FBF6EE]">
          <button
            type="button"
            onClick={() => {
              setTab('login');
              setError(null);
            }}
            className={`flex-1 py-3 text-xs font-semibold text-center transition-colors ${
              tab === 'login'
                ? 'text-[#5B1F11] border-b-2 border-[#5B1F11] bg-white'
                : 'text-[#786B63] hover:text-[#3B1209]'
            }`}
          >
            Masuk (Login)
          </button>
          <button
            type="button"
            onClick={() => {
              setTab('register');
              setError(null);
            }}
            className={`flex-1 py-3 text-xs font-semibold text-center transition-colors ${
              tab === 'register'
                ? 'text-[#5B1F11] border-b-2 border-[#5B1F11] bg-white'
                : 'text-[#786B63] hover:text-[#3B1209]'
            }`}
          >
            Daftar Akun
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {tab === 'register' && (
            <>
              <div>
                <label className="block text-xs font-semibold text-[#3B1209] mb-1">Nama Lengkap</label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#786B63] absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Nama Anda"
                    className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl border border-[#E5D9CC] bg-[#FBF6EE] focus:outline-none focus:border-[#B36633]"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#3B1209] mb-1">Nomor WhatsApp</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-[#786B63] absolute left-3 top-3" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="0812xxxxxxxx"
                    className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl border border-[#E5D9CC] bg-[#FBF6EE] focus:outline-none focus:border-[#B36633]"
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-semibold text-[#3B1209] mb-1">Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#786B63] absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@email.com"
                className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl border border-[#E5D9CC] bg-[#FBF6EE] focus:outline-none focus:border-[#B36633]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#3B1209] mb-1">Kata Sandi</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#786B63] absolute left-3 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimal 6 karakter"
                className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl border border-[#E5D9CC] bg-[#FBF6EE] focus:outline-none focus:border-[#B36633]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-full bg-[#5B1F11] text-[#FBF6EE] font-semibold text-xs hover:bg-[#3B1209] disabled:opacity-50 transition-colors shadow-xs"
          >
            {loading ? 'Memproses...' : tab === 'login' ? 'Masuk Sekarang' : 'Daftar Akun'}
          </button>

          {/* Quick Demo Credentials Switcher */}
          <div className="pt-4 border-t border-[#E5D9CC] space-y-2">
            <span className="text-[11px] font-semibold text-[#786B63] block text-center">
              Pilihan Masuk Cepat (Demo Pengujian):
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemo('customer')}
                className="p-2 rounded-xl border border-[#E5D9CC] bg-[#FBF6EE] text-[11px] text-[#3F302A] font-medium hover:border-[#B36633] transition-colors flex items-center justify-center gap-1.5"
              >
                <User className="w-3.5 h-3.5 text-[#B36633]" />
                <span>Pelanggan</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemo('admin')}
                className="p-2 rounded-xl border border-[#5B1F11]/30 bg-[#5B1F11]/5 text-[11px] text-[#5B1F11] font-bold hover:bg-[#5B1F11]/10 transition-colors flex items-center justify-center gap-1.5"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-[#5B1F11]" />
                <span>Admin Restoran</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
