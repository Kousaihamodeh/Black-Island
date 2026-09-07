'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, ShoppingBag, FolderKanban, Truck, Tag, Image as ImageIcon, Box, Settings, LogOut, ArrowLeft } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { t } = useLanguage();

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  const navItems = [
    { href: '/admin', label: t.adminDashboard, icon: LayoutDashboard },
    { href: '/admin/products', label: t.adminProducts, icon: ShoppingBag },
    { href: '/admin/categories', label: t.adminCategories, icon: FolderKanban },
    { href: '/admin/orders', label: t.adminOrders, icon: Truck },
    { href: '/admin/coupons', label: t.adminCoupons, icon: Tag },
    { href: '/admin/banners', label: t.adminBanners, icon: ImageIcon },
    { href: '/admin/3d-showcases', label: t.adminShowcases3D, icon: Box },
    { href: '/admin/settings', label: t.adminSettings, icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-black text-white flex flex-col md:flex-row font-sans">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-brand-950 border-r border-brand-850 p-6 flex flex-col justify-between shrink-0">
        <div className="space-y-8">
          <div className="flex items-center gap-3 border-b border-brand-850 pb-6">
            <img src="/logo.png" alt="BLACK ISLAND" className="w-10 h-10 rounded-full border border-brand-gold/60" />
            <div>
              <span className="font-display font-bold text-white tracking-widest text-sm block">BLACK ISLAND</span>
              <span className="text-[10px] font-mono text-brand-gold uppercase">ADMIN CONTROL</span>
            </div>
          </div>

          <nav className="space-y-1.5 font-mono text-xs">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3.5 py-3 rounded-xl transition-all ${
                    isActive
                      ? 'bg-brand-gold text-black font-bold shadow-lg'
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

        <div className="pt-6 border-t border-brand-850 space-y-3 font-mono text-xs">
          <Link href="/" className="flex items-center gap-2 text-gray-400 hover:text-white">
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Storefront</span>
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 sm:p-10 bg-black min-h-screen overflow-x-hidden">
        {children}
      </main>
    </div>
  );
}
