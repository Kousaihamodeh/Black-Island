'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Mail, ArrowRight, ShieldCheck } from 'lucide-react';
import { Button } from '@/ui/Button';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('admin@blackisland.sy');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Demo admin authentication check
    if (email === 'admin@blackisland.sy' && password === 'admin123') {
      document.cookie = 'black_island_admin_session=true; path=/; max-age=86400';
      localStorage.setItem('black_island_admin_auth', 'true');
      router.push('/admin');
    } else {
      setLoading(false);
      setError('Invalid admin credentials. Use admin@blackisland.sy / admin123');
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-brand-950 border border-brand-800 rounded-3xl p-8 shadow-2xl space-y-6">
        <div className="text-center space-y-3">
          <img src="/logo.png" alt="BLACK ISLAND" className="w-16 h-16 rounded-full border border-brand-gold mx-auto shadow-xl" />
          <h1 className="text-2xl font-display font-bold uppercase text-white tracking-wider">
            ADMINISTRATOR LOGIN
          </h1>
          <p className="text-xs text-gray-400 font-mono">BLACK ISLAND CONTROL PANEL • DAMASCUS</p>
        </div>

        {error && (
          <div className="p-3 bg-red-950/80 border border-red-800 text-red-300 text-xs rounded-xl font-mono">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-gray-300 mb-1.5 uppercase">Admin Email</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-brand-900 border border-brand-700 text-white text-xs pl-10 pr-4 py-3 rounded-xl focus:border-white focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-gray-300 mb-1.5 uppercase">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-brand-900 border border-brand-700 text-white text-xs pl-10 pr-4 py-3 rounded-xl focus:border-white focus:outline-none"
              />
            </div>
          </div>

          <Button type="submit" variant="gold" isLoading={loading} className="w-full py-3.5 font-bold">
            <span>ENTER DASHBOARD</span>
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </form>

        <div className="p-3 bg-brand-900/50 rounded-xl border border-brand-850 text-[11px] font-mono text-gray-400 text-center">
          Default Admin: <strong className="text-white">admin@blackisland.sy</strong> / <strong className="text-white">admin123</strong>
        </div>
      </div>
    </div>
  );
}
