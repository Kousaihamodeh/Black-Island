'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Heart, Eye, ShoppingBag, Check } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';
import { Badge } from '@/components/ui/Badge';
import { formatPrice } from '@/lib/utils';
import { QuickViewModal } from './QuickViewModal';

export interface ProductCardProps {
  product: {
    id: string;
    slug: string;
    nameEn: string;
    nameAr: string;
    price: number;
    salePrice?: number | null;
    featured?: boolean;
    isNew?: boolean;
    isSale?: boolean;
    images: Array<{ url: string; isMain: boolean }>;
    variants: Array<{ size: string; colorName: string; colorHex: string; stock: number }>;
  };
}

export function ProductCard({ product }: ProductCardProps) {
  const { language, t } = useLanguage();
  const { wishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();

  const [isHovered, setIsHovered] = useState(false);
  const [quickViewOpen, setQuickViewOpen] = useState(false);
  const [addedAnimation, setAddedAnimation] = useState(false);

  const mainImage = product.images.find((img) => img.isMain)?.url || product.images[0]?.url || '/logo.png';
  const hoverImage = product.images[1]?.url || mainImage;

  const isWishlisted = wishlist.includes(product.id);
  const totalStock = product.variants.reduce((acc, v) => acc + v.stock, 0);

  const activePrice = product.salePrice && product.salePrice > 0 ? product.salePrice : product.price;
  const discountPercent = product.salePrice && product.salePrice < product.price
    ? Math.round(((product.price - product.salePrice) / product.price) * 100)
    : 0;

  // Unique color swatches
  const colorSwatches = Array.from(
    new Set(product.variants.map((v) => JSON.stringify({ name: v.colorName, hex: v.colorHex })))
  ).map((str) => JSON.parse(str));

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const firstVariant = product.variants.find((v) => v.stock > 0) || product.variants[0];
    if (!firstVariant) return;

    addToCart({
      productId: product.id,
      slug: product.slug,
      nameEn: product.nameEn,
      nameAr: product.nameAr,
      image: mainImage,
      price: product.price,
      salePrice: product.salePrice,
      size: firstVariant.size,
      color: firstVariant.colorName,
      colorHex: firstVariant.colorHex,
      quantity: 1,
      maxStock: firstVariant.stock,
    });

    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1500);
  };

  return (
    <>
      <div
        className="group relative bg-brand-900/40 rounded-2xl overflow-hidden border border-brand-800/80 hover:border-brand-700 transition-all duration-500 hover:shadow-[0_10px_30px_rgba(0,0,0,0.8)] flex flex-col justify-between"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Card Top Media Container */}
        <div className="relative aspect-[3/4] w-full overflow-hidden bg-brand-950">
          <Link href={`/product/${product.slug}`} className="block w-full h-full">
            <img
              src={isHovered ? hoverImage : mainImage}
              alt={language === 'ar' ? product.nameAr : product.nameEn}
              className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
            />
          </Link>

          {/* Badges Overlay */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10 pointer-events-none">
            {discountPercent > 0 && <Badge variant="sale">-{discountPercent}%</Badge>}
            {product.isNew && <Badge variant="new">NEW DROP</Badge>}
            {totalStock <= 5 && totalStock > 0 && (
              <Badge variant="gold">ONLY {totalStock} LEFT</Badge>
            )}
            {totalStock === 0 && <Badge variant="dark">OUT OF STOCK</Badge>}
          </div>

          {/* Wishlist Button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              toggleWishlist(product.id);
            }}
            className="absolute top-3 right-3 p-2.5 rounded-full bg-black/60 backdrop-blur-md text-white border border-white/10 hover:bg-white hover:text-black transition-all duration-300 z-10"
            aria-label="Wishlist"
          >
            <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
          </button>

          {/* Hover Actions Bar */}
          <div className="absolute bottom-3 left-3 right-3 flex gap-2 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 z-10">
            <button
              onClick={() => setQuickViewOpen(true)}
              className="flex-1 py-2.5 bg-brand-950/90 hover:bg-black text-white text-xs font-semibold uppercase tracking-wider rounded-xl backdrop-blur-md border border-white/20 flex items-center justify-center gap-1.5 transition-colors"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>{t.quickView}</span>
            </button>

            <button
              onClick={handleQuickAdd}
              disabled={totalStock === 0}
              className="p-2.5 bg-white text-black hover:bg-gray-200 rounded-xl transition-all duration-300 flex items-center justify-center shrink-0 disabled:opacity-50"
              title={t.addToCart}
            >
              {addedAnimation ? <Check className="w-4 h-4 text-emerald-600" /> : <ShoppingBag className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Card Details Footer */}
        <div className="p-4 flex flex-col justify-between flex-1">
          <div>
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <span className="text-[10px] font-mono tracking-widest text-brand-gold uppercase">
                MADE IN TURKEY 🇹🇷
              </span>

              {/* Color Swatches */}
              <div className="flex items-center gap-1">
                {colorSwatches.slice(0, 3).map((c: any, idx) => (
                  <span
                    key={idx}
                    className="w-2.5 h-2.5 rounded-full border border-white/20"
                    style={{ backgroundColor: c.hex }}
                    title={c.name}
                  />
                ))}
                {colorSwatches.length > 3 && (
                  <span className="text-[9px] font-mono text-gray-500">+{colorSwatches.length - 3}</span>
                )}
              </div>
            </div>

            <Link href={`/product/${product.slug}`} className="group-hover:text-amber-200 transition-colors">
              <h3 className="text-xs sm:text-sm font-semibold text-white line-clamp-1">
                {language === 'ar' ? product.nameAr : product.nameEn}
              </h3>
            </Link>
          </div>

          <div className="mt-3 flex items-center justify-between pt-2 border-t border-brand-800/60">
            <div className="flex items-baseline gap-2">
              <span className="text-sm sm:text-base font-bold text-white font-mono">
                {formatPrice(activePrice)}
              </span>
              {product.salePrice && product.salePrice < product.price && (
                <span className="text-xs text-gray-500 line-through font-mono">
                  {formatPrice(product.price)}
                </span>
              )}
            </div>

            <span className="text-[10px] font-mono text-gray-400 uppercase">
              {product.variants[0]?.size || 'S-XXL'}
            </span>
          </div>
        </div>
      </div>

      {/* Quick View Modal */}
      {quickViewOpen && (
        <QuickViewModal product={product} onClose={() => setQuickViewOpen(false)} />
      )}
    </>
  );
}
