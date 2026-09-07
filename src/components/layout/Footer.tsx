'use client';

import React from 'react';
import Link from 'next/link';
import { Instagram, Phone, MapPin, ShieldCheck, Truck, RefreshCw, Send } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-black text-white border-t border-brand-800 pt-16 pb-12 relative overflow-hidden">
      {/* Background Subtle Monogram Blur */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand-gold/5 rounded-full filter blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Value Proposition Badges */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-16 border-b border-brand-800 text-center md:text-left">
          <div className="flex items-center gap-4 bg-brand-900/50 p-6 rounded-2xl border border-brand-800/80">
            <div className="p-3 bg-brand-800 text-brand-gold rounded-xl">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider text-white">SYRIA EXPRESS DELIVERY</h4>
              <p className="text-xs text-gray-400 mt-1">24-48 Hours delivery from Qudsaya to all governorates.</p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-brand-900/50 p-6 rounded-2xl border border-brand-800/80">
            <div className="p-3 bg-brand-800 text-brand-gold rounded-xl">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider text-white">MADE IN TURKEY 🇹🇷</h4>
              <p className="text-xs text-gray-400 mt-1">100% Premium cotton fabrics and international cuts.</p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-brand-900/50 p-6 rounded-2xl border border-brand-800/80">
            <div className="p-3 bg-brand-800 text-brand-gold rounded-xl">
              <RefreshCw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider text-white">INSPECT BEFORE PAYMENT</h4>
              <p className="text-xs text-gray-400 mt-1">Check sizes and quality upon delivery before paying COD.</p>
            </div>
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 py-16">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center gap-4">
              <img src="/logo.png" alt="BLACK ISLAND" className="w-14 h-14 rounded-full border border-brand-gold/40 shadow-xl" />
              <div>
                <span className="font-display font-black text-2xl tracking-[0.2em] text-white">BLACK ISLAND</span>
                <p className="text-xs font-mono text-brand-gold tracking-widest uppercase">PREMIUM STREETWEAR</p>
              </div>
            </div>

            <p className="text-xs text-gray-400 leading-relaxed max-w-sm">
              International luxury fashion identity engineered with Turkish craftsmanship. Styled and delivered across Damascus and Syria.
            </p>

            <div className="flex items-center gap-4 pt-2">
              <a
                href="https://instagram.com/black_islandd_fashion"
                target="_blank"
                rel="noreferrer"
                className="p-3 bg-brand-900 hover:bg-brand-gold hover:text-black text-white rounded-full transition-all duration-300 border border-brand-700"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://wa.me/963938098917"
                target="_blank"
                rel="noreferrer"
                className="p-3 bg-brand-900 hover:bg-emerald-500 hover:text-white text-white rounded-full transition-all duration-300 border border-brand-700"
                aria-label="WhatsApp"
              >
                <Send className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Catalog Col */}
          <div className="space-y-4">
            <h4 className="text-xs font-mono tracking-[0.2em] uppercase text-brand-gold font-bold">COLLECTIONS</h4>
            <ul className="space-y-2.5 text-xs text-gray-400 font-medium">
              <li><Link href="/category/hoodies" className="hover:text-white transition-colors">{t.hoodies}</Link></li>
              <li><Link href="/category/tshirts" className="hover:text-white transition-colors">{t.tshirts}</Link></li>
              <li><Link href="/category/pants" className="hover:text-white transition-colors">{t.pants}</Link></li>
              <li><Link href="/category/sneakers" className="hover:text-white transition-colors">{t.sneakers}</Link></li>
              <li><Link href="/category/caps" className="hover:text-white transition-colors">{t.caps}</Link></li>
            </ul>
          </div>

          {/* Customer Care Col */}
          <div className="space-y-4">
            <h4 className="text-xs font-mono tracking-[0.2em] uppercase text-brand-gold font-bold">CUSTOMER CARE</h4>
            <ul className="space-y-2.5 text-xs text-gray-400 font-medium">
              <li><Link href="/shop" className="hover:text-white transition-colors">Catalog & Search</Link></li>
              <li><Link href="/cart" className="hover:text-white transition-colors">Shopping Bag</Link></li>
              <li><Link href="/checkout" className="hover:text-white transition-colors">Checkout</Link></li>
              <li><a href="https://wa.me/963938098917" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">WhatsApp Assistance</a></li>
              <li><Link href="/admin" className="hover:text-white transition-colors text-gray-500">Admin Dashboard</Link></li>
            </ul>
          </div>

          {/* Contact Store Info */}
          <div className="space-y-4">
            <h4 className="text-xs font-mono tracking-[0.2em] uppercase text-brand-gold font-bold">STORE HEADQUARTERS</h4>
            <div className="space-y-3 text-xs text-gray-400">
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-brand-gold shrink-0 mt-0.5" />
                <span>{t.location}</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-brand-gold shrink-0" />
                <span>{t.phone}</span>
              </p>
              <p className="flex items-center gap-2">
                <Instagram className="w-4 h-4 text-brand-gold shrink-0" />
                <span>@black_islandd_fashion</span>
              </p>
              <a
                href="https://maps.app.goo.gl/GetFPYXM5SS88h8m9"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-3 py-1.5 bg-brand-900 border border-brand-700 hover:bg-brand-gold hover:text-black text-brand-gold rounded-xl text-[11px] font-mono font-bold transition-all shadow-md mt-1"
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>Google Maps Location 📍</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-brand-850 flex flex-col md:flex-row items-center justify-between text-xs text-gray-500 gap-4 font-mono">
          <p>© {new Date().getFullYear()} BLACK ISLAND STREETWEAR. ALL RIGHTS RESERVED.</p>
          <div className="flex items-center gap-6">
            <span>DAMASCUS • SYRIA</span>
            <span>MADE IN TURKEY 🇹🇷</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
