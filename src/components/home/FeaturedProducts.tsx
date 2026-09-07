'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { ProductCard } from '@/components/shop/ProductCard';

interface FeaturedProductsProps {
  products: any[];
}

export function FeaturedProducts({ products }: FeaturedProductsProps) {
  const { t } = useLanguage();

  return (
    <section className="py-12 sm:py-20 bg-black text-white border-t border-brand-850">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-12">
          <div>
            <span className="text-xs font-mono text-brand-gold uppercase tracking-[0.2em]">CURATED SELECTION</span>
            <h2 className="text-2xl sm:text-4xl font-display font-bold uppercase text-white mt-1">
              {t.featuredProductsTitle}
            </h2>
            <p className="text-xs text-gray-400 mt-1 sm:mt-2 max-w-md font-sans">{t.featuredProductsSub}</p>
          </div>
          <Link
            href="/shop"
            className="text-xs font-mono text-gray-400 hover:text-white uppercase tracking-widest flex items-center gap-1 mt-3 md:mt-0 underline"
          >
            <span>{t.viewAll}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Products Grid: 2 columns on mobile, 4 on desktop */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
