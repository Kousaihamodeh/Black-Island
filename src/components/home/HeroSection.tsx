'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/Button';

// Dynamic import with ssr: false for Vanilla Three.js Hero Canvas
const HeroCanvas = dynamic(() => import('@/components/3d/HeroCanvas'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[450px] lg:h-[550px] flex items-center justify-center bg-brand-900/40 rounded-2xl border border-brand-800">
      <img src="/logo.png" alt="BLACK ISLAND" className="w-32 h-32 object-contain animate-pulse" />
    </div>
  ),
});

export function HeroSection() {
  const { t, language } = useLanguage();
  const [banners, setBanners] = useState<any[]>([]);
  const [activeBannerIndex, setActiveBannerIndex] = useState(0);

  useEffect(() => {
    fetch(`/api/admin/banners?t=${Date.now()}`, { cache: 'no-store' })
      .then((res) => res.json())
      .then((data) => {
        if (data.banners && Array.isArray(data.banners)) {
          const active = data.banners.filter((b: any) => b.isActive !== false);
          if (active.length > 0) setBanners(active);
        }
      })
      .catch((e) => console.error('Failed to load active hero banners:', e));
  }, []);

  const activeBanner = banners[activeBannerIndex] || null;

  const displayTitle = activeBanner
    ? (language === 'ar' ? activeBanner.titleAr : activeBanner.titleEn)
    : t.heroTitle;

  const displaySubtitle = activeBanner
    ? (language === 'ar' ? activeBanner.subtitleAr || activeBanner.subtitleEn : activeBanner.subtitleEn || activeBanner.subtitleAr)
    : t.heroSubtitle;

  const displayBtnText = activeBanner
    ? (language === 'ar' ? activeBanner.buttonTextAr || activeBanner.buttonTextEn : activeBanner.buttonTextEn || activeBanner.buttonTextAr)
    : t.shopMenBtn;

  const displayBtnLink = activeBanner?.link || '/shop';
  const bgImageUrl = activeBanner?.imageUrl || null;

  return (
    <section className="relative min-h-[90vh] bg-black text-white flex items-center overflow-hidden pt-6 pb-16 font-sans">
      {/* Background Banner Image or Gradient Blurs */}
      {bgImageUrl ? (
        <div className="absolute inset-0 z-0">
          <img src={bgImageUrl} alt="Hero Banner" className="w-full h-full object-cover opacity-25 filter blur-[2px]" />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" />
        </div>
      ) : (
        <>
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-gold/10 rounded-full filter blur-[120px] pointer-events-none" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-white/5 rounded-full filter blur-[120px] pointer-events-none" />
        </>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Text Presentation */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-brand-900/90 border border-brand-700/80 px-4 py-1.5 rounded-full text-xs font-mono text-amber-200 backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-brand-gold animate-spin" />
              <span className="uppercase tracking-widest">{t.madeInTurkey}</span>
              <span className="text-gray-500">•</span>
              <span className="text-gray-300">DAMASCUS DROPS</span>
            </div>

            <div className="space-y-3">
              <h1 className="text-3xl sm:text-6xl lg:text-7xl font-bold tracking-tight uppercase text-white font-display">
                <span className="block text-white leading-tight mb-1 sm:mb-2">
                  {displayTitle.split(' ')[0]}
                </span>
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-white via-amber-100 to-brand-gold leading-tight">
                  {displayTitle.split(' ').slice(1).join(' ')}
                </span>
              </h1>

              <p className="text-sm sm:text-base text-gray-300 max-w-xl leading-relaxed mx-auto lg:mx-0 font-sans">
                {displaySubtitle}
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
              <Link href={displayBtnLink} className="w-full sm:w-auto">
                <Button variant="gold" size="lg" className="w-full sm:w-auto flex items-center justify-center gap-3 py-4 px-8 text-base font-bold shadow-xl">
                  <span>{displayBtnText}</span>
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>

              <Link href="/shop" className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="w-full sm:w-auto py-4 px-8 text-base font-bold">
                  <span>{t.shopWomenBtn}</span>
                </Button>
              </Link>
            </div>

            {/* Micro Highlights & Multi-Banner Dots */}
            {banners.length > 1 && (
              <div className="flex items-center justify-center lg:justify-start gap-2 pt-2">
                {banners.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveBannerIndex(idx)}
                    className={`h-2 rounded-full transition-all ${
                      idx === activeBannerIndex ? 'w-8 bg-brand-gold' : 'w-2 bg-gray-600'
                    }`}
                  />
                ))}
              </div>
            )}

            <div className="pt-8 grid grid-cols-2 sm:grid-cols-3 gap-4 border-t border-brand-850/80 max-w-lg mx-auto lg:mx-0 text-left font-mono">
              <div>
                <span className="text-xs text-brand-gold font-bold uppercase block">ORIGIN</span>
                <span className="text-xs text-gray-400">Made in Turkey 🇹🇷</span>
              </div>
              <div>
                <span className="text-xs text-brand-gold font-bold uppercase block">SHIPPING</span>
                <span className="text-xs text-gray-400">Syria Express</span>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <span className="text-xs text-brand-gold font-bold uppercase block">LOCATION</span>
                <span className="text-xs text-gray-400">Damascus - Qudsaya</span>
              </div>
            </div>
          </div>

          {/* Right 3D Emblem / Banner Image Presentation */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            {bgImageUrl ? (
              <div className="w-full h-[400px] sm:h-[480px] rounded-3xl overflow-hidden border border-brand-700 shadow-2xl relative group">
                <img src={bgImageUrl} alt="Banner Feature" className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-6">
                  <div>
                    <span className="text-xs font-mono text-brand-gold uppercase tracking-widest block font-bold">BLACK ISLAND FEATURE</span>
                    <span className="text-lg font-display font-bold text-white uppercase">{displayTitle}</span>
                  </div>
                </div>
              </div>
            ) : (
              <HeroCanvas />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
