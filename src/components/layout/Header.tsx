'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingBag, Heart, Search, Menu, X, Globe, Phone, MapPin } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { cn } from '@/lib/utils';

export function Header() {
  const { language, toggleLanguage, t } = useLanguage();
  const { toggleCart, itemCount } = useCart();
  const { wishlist } = useWishlist();

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Announcement Bar */}
      <div className="bg-gradient-to-r from-brand-950 via-brand-800 to-brand-950 text-white text-[11px] font-mono py-2 px-4 text-center border-b border-brand-700/40 tracking-wider flex items-center justify-between">
        <div className="hidden md:flex items-center gap-4 text-gray-400">
          <span className="flex items-center gap-1">
            <MapPin className="w-3 h-3 text-brand-gold" />
            {t.location}
          </span>
          <span className="flex items-center gap-1">
            <Phone className="w-3 h-3 text-brand-gold" />
            {t.phone}
          </span>
        </div>
        <div className="mx-auto font-medium text-amber-200/90 tracking-widest flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
          {t.announcement}
        </div>
        <div className="hidden md:block">
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1 text-gray-300 hover:text-white transition-colors border border-white/10 rounded px-2 py-0.5"
          >
            <Globe className="w-3 h-3 text-brand-gold" />
            <span>{language === 'en' ? 'العربية' : 'English'}</span>
          </button>
        </div>
      </div>

      {/* Main Glassmorphism Sticky Navbar */}
      <header
        className={cn(
          'sticky top-0 z-40 w-full transition-all duration-300 backdrop-blur-xl border-b border-white/10',
          isScrolled ? 'bg-black/90 py-3 shadow-2xl' : 'bg-brand-950/80 py-4'
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Mobile menu toggle */}
          <div className="flex items-center gap-3 lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 text-gray-300 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
              aria-label="Open Mobile Menu"
            >
              <Menu className="w-6 h-6" />
            </button>
            <button
              onClick={() => setSearchOpen(true)}
              className="p-2 text-gray-300 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
            >
              <Search className="w-5 h-5" />
            </button>
          </div>

          {/* Desktop Navigation Left Links */}
          <nav className="hidden lg:flex items-center gap-8 text-xs tracking-widest font-semibold uppercase">
            <Link href="/" className="text-gray-300 hover:text-white transition-colors hover:scale-105 transform">
              {t.home}
            </Link>
            <Link href="/shop" className="text-gray-300 hover:text-white transition-colors hover:scale-105 transform">
              {t.shop}
            </Link>
            <Link href="/category/hoodies" className="text-gray-300 hover:text-white transition-colors hover:scale-105 transform">
              {t.hoodies}
            </Link>

            <Link href="/category/sneakers" className="text-gray-300 hover:text-white transition-colors hover:scale-105 transform">
              {t.sneakers}
            </Link>
          </nav>

          {/* Brand Logo (Center Identity) */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-11 h-11 sm:w-14 sm:h-14 overflow-hidden rounded-full border border-white/20 group-hover:border-brand-gold transition-all duration-300 shadow-[0_0_15px_rgba(255,255,255,0.1)]">
              <img
                src="/logo.png"
                alt="BLACK ISLAND Logo"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-display font-black tracking-[0.2em] text-lg sm:text-2xl text-white group-hover:text-amber-200 transition-colors">
                BLACK ISLAND
              </span>
              <span className="text-[9px] font-mono tracking-[0.3em] text-gray-400 uppercase -mt-1">
                DAMASCUS • EST. 2024
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Right Links & Actions */}
          <div className="flex items-center gap-4 sm:gap-6">
            {/* Search Trigger */}
            <button
              onClick={() => setSearchOpen(true)}
              className="hidden lg:flex items-center gap-2 text-xs text-gray-400 hover:text-white bg-brand-850 border border-brand-700/60 px-3 py-1.5 rounded-full transition-colors font-sans"
            >
              <Search className="w-4 h-4 text-gray-400" />
              <span>{(t?.searchPlaceholder || 'Search').slice(0, 18)}...</span>
            </button>

            {/* Language Switcher Mobile / Desktop Icon */}
            <button
              onClick={toggleLanguage}
              className="lg:hidden p-2 text-xs font-mono text-gray-300 hover:text-white border border-white/20 rounded-md"
            >
              {language === 'en' ? 'AR' : 'EN'}
            </button>

            {/* Wishlist */}
            <Link
              href="/wishlist"
              className="relative p-2 text-gray-300 hover:text-white hover:bg-white/5 rounded-full transition-colors"
            >
              <Heart className="w-5 h-5 sm:w-6 sm:h-6" />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-brand-gold text-black text-[10px] font-bold flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* Shopping Cart Drawer Trigger */}
            <button
              onClick={toggleCart}
              className="relative p-2.5 bg-white text-black hover:bg-gray-200 rounded-full transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.2)] flex items-center justify-center active:scale-95"
            >
              <ShoppingBag className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-600 text-white text-[11px] font-bold flex items-center justify-center border-2 border-black">
                  {itemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          <div className="relative w-4/5 max-w-sm bg-brand-950 h-full border-r border-brand-800 p-6 flex flex-col justify-between shadow-2xl z-10 animate-fade-in font-sans">
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-brand-800">
                <div className="flex items-center gap-3">
                  <img src="/logo.png" alt="BLACK ISLAND" className="w-10 h-10 rounded-full border border-white/20" />
                  <span className="font-display font-bold text-white tracking-widest text-lg">BLACK ISLAND</span>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 text-gray-400 hover:text-white"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <nav className="mt-8 flex flex-col gap-6 text-sm tracking-widest uppercase font-semibold">
                <Link
                  href="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-gray-200 hover:text-brand-gold transition-colors"
                >
                  {t.home}
                </Link>
                <Link
                  href="/shop"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-gray-200 hover:text-brand-gold transition-colors"
                >
                  {t.shop}
                </Link>
                <Link
                  href="/category/hoodies"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-gray-200 hover:text-brand-gold transition-colors"
                >
                  {t.hoodies}
                </Link>
                <Link
                  href="/category/tshirts"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-gray-200 hover:text-brand-gold transition-colors"
                >
                  {t.tshirts}
                </Link>
                <Link
                  href="/category/pants"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-gray-200 hover:text-brand-gold transition-colors"
                >
                  {t.pants}
                </Link>
                <Link
                  href="/category/sneakers"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-gray-200 hover:text-brand-gold transition-colors"
                >
                  {t.sneakers}
                </Link>
                <Link
                  href="/category/caps"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-gray-200 hover:text-brand-gold transition-colors"
                >
                  {t.caps}
                </Link>
                <Link
                  href="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-brand-gold hover:underline transition-colors pt-4 border-t border-brand-800"
                >
                  🔒 {t.adminPanel}
                </Link>
              </nav>
            </div>

            <div className="pt-6 border-t border-brand-800 space-y-4">
              <button
                onClick={() => {
                  toggleLanguage();
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2.5 bg-brand-850 border border-brand-700 rounded-lg text-xs font-mono text-white flex items-center justify-center gap-2"
              >
                <Globe className="w-4 h-4 text-brand-gold" />
                {language === 'en' ? 'التحويل إلى العربية (RTL)' : 'Switch to English (LTR)'}
              </button>

              <div className="text-center text-[10px] font-mono text-gray-500">
                Damascus, Syria – Qudsaya • {t.phone}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Global Search Modal */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex items-start justify-center pt-20 px-4 font-sans">
          <div className="w-full max-w-2xl bg-brand-900 border border-brand-700 rounded-2xl p-6 shadow-2xl relative animate-slide-down">
            <button
              onClick={() => setSearchOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white p-2"
            >
              <X className="w-6 h-6" />
            </button>

            <h3 className="text-xs font-mono text-brand-gold uppercase tracking-widest mb-4">SEARCH CATALOG</h3>

            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.searchPlaceholder}
                autoFocus
                className="w-full bg-brand-950 text-white pl-12 pr-4 py-4 rounded-xl border border-brand-700 focus:border-white focus:outline-none text-base font-sans"
              />
            </div>

            <div className="mt-6 flex items-center justify-between text-xs text-gray-400">
              <span>Popular searches: Oversized Hoodie, Sneakers, Cargo Pants</span>
              {searchQuery && (
                <Link
                  href={`/shop?search=${encodeURIComponent(searchQuery)}`}
                  onClick={() => setSearchOpen(false)}
                  className="text-white hover:text-brand-gold underline font-semibold"
                >
                  Search for "{searchQuery}" &rarr;
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
