'use client';

import React from 'react';
import Link from 'next/link';
import { Heart } from 'lucide-react';
import { useWishlist } from '@/context/WishlistContext';
import { useLanguage } from '@/context/LanguageContext';
import { ProductCard } from '@/components/shop/ProductCard';
import { Button } from '@/components/ui/Button';

export default function WishlistPage() {
  const { wishlist } = useWishlist();
  const { t } = useLanguage();
  const items = Array.isArray(wishlist) ? wishlist : [];

  if (items.length === 0) {
    return (
      <div className="py-24 bg-black text-white min-h-[70vh] flex flex-col items-center justify-center text-center px-4 font-sans">
        <div className="w-20 h-20 bg-brand-900 border border-brand-800 rounded-full flex items-center justify-center mb-6 text-gray-500">
          <Heart className="w-10 h-10" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-display font-bold uppercase mb-2">{t.wishlistTitle}</h1>
        <p className="text-sm text-gray-400 max-w-md mb-8">{t.wishlistEmpty}</p>
        <Link href="/shop">
          <Button variant="gold" size="lg">{t.continueShopping}</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="py-16 bg-black text-white min-h-screen font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl sm:text-4xl font-display font-bold uppercase mb-8 border-b border-brand-850 pb-4">
          {t.wishlistTitle} ({items.length})
        </h1>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {items.map((item: any) => (
            <ProductCard key={typeof item === 'string' ? item : item.id} product={typeof item === 'string' ? { id: item, slug: item, nameEn: item, nameAr: item, price: 0, images: [{ url: '/logo.png', isMain: true, order: 0 }], variants: [] } : item} />
          ))}
        </div>
      </div>
    </div>
  );
}
