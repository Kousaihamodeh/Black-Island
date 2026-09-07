'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  ShoppingBag,
  Grid,
  ClipboardList,
  Boxes,
  Ticket,
  Image as ImageIcon,
  Settings,
  LogOut,
  ArrowLeft,
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useLanguage();

  const navItems = [
    { href: '/admin', label: t.adminDashboard, icon: LayoutDashboard },
    { href: '/admin/products', label: t.adminProducts, icon: ShoppingBag },
    { href: '/admin/categories', label: t.adminCategories, icon: Grid },
    { href: '/admin/orders', label: t.adminOrders, icon: ClipboardList },
    { href: '/admin/inventory', label: t.adminInventory, icon: Boxes },
    { href: '/admin/coupons', label: t.adminCoupons, icon: Ticket },
    { href: '/admin/banners', label: t.adminBanners, icon: ImageIcon },
    { href: '/admin/settings', label: t.adminSettings, icon: Settings },
  ];

  const handleLogout = () => {
    document.cookie = 'black_island_admin_session=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    localStorage.removeItem('black_island_admin_auth');
    router.push('/admin/login');
  };

  return (
    <aside className="w-64 bg-brand-950 border-r border-brand-800 p-6 flex flex-col justify-between h-screen sticky top-0">
      <div className="space-y-8">
        <div className="flex items-center gap-3 pb-6 border-b border-brand-800">
          <img src="/logo.png" alt="BLACK ISLAND" className="w-10 h-10 rounded-full border border-brand-gold" />
          <div>
            <span className="font-display font-bold text-white tracking-widest text-sm block">BLACK ISLAND</span>
            <span className="text-[10px] font-mono text-brand-gold">ADMIN DASHBOARD</span>
          </div>
        </div>

        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-mono transition-all ${
                  isActive
                    ? 'bg-white text-black font-bold shadow-md'
                    : 'text-gray-400 hover:text-white hover:bg-brand-900'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="space-y-3 pt-6 border-t border-brand-800">
        <Link
          href="/"
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-mono text-gray-400 hover:text-white hover:bg-brand-900"
        >
          <ArrowLeft className="w-4 h-4 text-brand-gold" />
          <span>View Public Store</span>
        </Link>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-mono text-red-400 hover:bg-red-950/40 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>{t.adminLogout}</span>
        </button>
      </div>
    </aside>
  );
}
