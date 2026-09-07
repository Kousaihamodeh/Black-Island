'use client';

import React from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/Button';

// Dynamic import with ssr: false for Sneaker 3D Canvas
const SneakerShowcase3D = dynamic(() => import('@/components/3d/SneakerShowcase3D'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[400px] flex items-center justify-center bg-brand-900/40 rounded-2xl border border-brand-800">
      <img src="/logo.png" alt="BLACK ISLAND" className="w-24 h-24 object-contain animate-pulse" />
    </div>
  ),
});

export function SneakerSpotlightSection() {
  const { t } = useLanguage();

  return (
    <section className="py-20 bg-brand-950 border-t border-brand-850 text-white relative overflow-hidden font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* 3D Showcase */}
          <div className="lg:col-span-7">
            <SneakerShowcase3D />
          </div>

          {/* Details & CTA */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2 bg-brand-900 border border-brand-700 px-3 py-1 rounded-full text-xs font-mono text-brand-gold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>360° SNEAKER SPOTLIGHT</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-bold uppercase text-white tracking-tight">
              BLACK ISLAND <br />
              <span className="text-brand-gold">HYPER SNEAKER 01</span>
            </h2>

            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
              Architectural luxury footwear designed for durability and street aesthetics. Full-grain genuine leather upper, high-density impact outsole, and precision hand stitching.
            </p>

            <div className="grid grid-cols-2 gap-4 py-3 border-y border-brand-800 text-xs font-mono">
              <div>
                <span className="text-gray-500 uppercase block">SIZES AVAILABLE</span>
                <span className="text-white font-bold">40, 41, 42, 43, 44, 45</span>
              </div>
              <div>
                <span className="text-gray-500 uppercase block">ORIGIN</span>
                <span className="text-white font-bold">Made in Turkey 🇹🇷</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <Link href="/product/black-island-hyper-sneaker-01" className="w-full sm:w-auto">
                <Button variant="gold" className="w-full sm:w-auto flex items-center justify-center gap-2 py-3.5 px-6 text-xs font-bold">
                  <span>ORDER SNEAKER NOW</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
