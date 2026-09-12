'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, KeyRound, ArrowLeft, ShieldAlert } from 'lucide-react';

export default function LockPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
      setError('يرجى إدخال كلمة المرور');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/lock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        router.push('/');
        router.refresh();
      } else {
        setError(data.error || 'كلمة المرور غير صحيحة');
      }
    } catch (err) {
      setError('حدث خطأ بالاتصال، يرجى المحاولة لاحقاً');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col justify-center items-center px-4 font-sans selection:bg-white selection:text-black">
      {/* Background Decorative Lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-zinc-800/30 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-md w-full bg-zinc-900/80 border border-zinc-800 p-8 rounded-2xl shadow-2xl backdrop-blur-xl text-center">
        {/* Logo / Brand Icon */}
        <div className="mx-auto w-16 h-16 bg-zinc-800 border border-zinc-700 rounded-full flex items-center justify-center mb-6 shadow-inner">
          <Lock className="w-8 h-8 text-amber-400" />
        </div>

        <h1 className="text-3xl font-extrabold tracking-widest uppercase text-white mb-2">
          BLACK ISLAND
        </h1>
        <p className="text-zinc-400 text-sm mb-6">
          الموقع مغلق حالياً — يرجى إدخال كلمة المرور للدخول إلى المتجر
        </p>

        {error && (
          <div className="mb-6 p-3 bg-red-950/60 border border-red-800 text-red-300 rounded-xl text-sm flex items-center justify-center gap-2 animate-shake">
            <ShieldAlert className="w-4 h-4 text-red-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4" dir="rtl">
          <div className="relative">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="أدخل كلمة المرور..."
              className="w-full bg-zinc-950 border border-zinc-700 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 text-white placeholder-zinc-500 rounded-xl px-4 py-3.5 pr-11 text-center font-medium transition-all outline-none"
              autoFocus
            />
            <KeyRound className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 w-5 h-5 pointer-events-none" />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white text-black hover:bg-zinc-200 font-bold py-3.5 px-6 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg active:scale-[0.99]"
          >
            {loading ? (
              <span className="inline-block w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>دخول للمتجر</span>
                <ArrowLeft className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-zinc-800 text-xs text-zinc-500">
          BLACK ISLAND © {new Date().getFullYear()} — جميع الحقوق محفوظة
        </div>
      </div>
    </div>
  );
}
