'use client';

import React from 'react';
import { ShieldCheck, MapPin, Award } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export function BrandStory() {
  const { t } = useLanguage();

  return (
    <section className="py-24 bg-black text-white border-t border-brand-850 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs font-mono text-brand-gold uppercase tracking-[0.2em]">OUR PHILOSOPHY</span>
            <h2 className="text-3xl sm:text-5xl font-display font-black uppercase text-white tracking-tight leading-tight">
              {t.brandStoryTitle}
            </h2>
            <p className="text-sm sm:text-base text-gray-300 font-sans leading-relaxed">
              {t.brandStoryText}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
              <div className="p-4 bg-brand-900/60 rounded-xl border border-brand-800">
                <ShieldCheck className="w-6 h-6 text-brand-gold mb-2" />
                <h4 className="text-xs font-bold uppercase text-white">TURKISH CRAFTSMANSHIP</h4>
                <p className="text-[11px] text-gray-400 mt-1">High-density 500GSM cottons & tailored streetwear silhouettes.</p>
              </div>

              <div className="p-4 bg-brand-900/60 rounded-xl border border-brand-800">
                <MapPin className="w-6 h-6 text-brand-gold mb-2" />
                <h4 className="text-xs font-bold uppercase text-white">DAMASCUS HEADQUARTERS</h4>
                <p className="text-[11px] text-gray-400 mt-1">Based in Qudsaya with fast express delivery across all Syrian governorates.</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 relative">
            <div className="relative rounded-3xl overflow-hidden border border-brand-700 shadow-2xl aspect-[4/3]">
              <img
                src="https://images.unsplash.com/photo-1509967419530-da38b4704bc6?q=80&w=1200&auto=format&fit=crop"
                alt="BLACK ISLAND Editorial"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />

              <div className="absolute bottom-6 left-6 right-6 p-6 bg-black/80 backdrop-blur-md rounded-2xl border border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img src="/logo.png" alt="Logo" className="w-12 h-12 rounded-full border border-white/20" />
                  <div>
                    <span className="font-display font-bold text-white tracking-widest text-sm">BLACK ISLAND</span>
                    <p className="text-[10px] font-mono text-brand-gold">DAMASCUS • QUDSAYA</p>
                  </div>
                </div>
                <span className="text-xs font-mono bg-white text-black font-bold px-3 py-1 rounded-full">
                  EST. 2024
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
