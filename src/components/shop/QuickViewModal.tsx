'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { X, Check, ShoppingBag, Send, ShieldCheck } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/Button';
import { formatPrice } from '@/lib/utils';
import { generateWhatsAppOrderMessage } from '@/lib/whatsapp';

interface QuickViewModalProps {
  product: any;
  onClose: () => void;
}

export function QuickViewModal({ product, onClose }: QuickViewModalProps) {
  const { language, t } = useLanguage();
  const { addToCart } = useCart();

  const images = product.images.length > 0 ? product.images : [{ url: '/logo.png' }];
  const [selectedImage, setSelectedImage] = useState(images[0]?.url);

  // Available Sizes & Colors
  const sizes = Array.from(new Set(product.variants.map((v: any) => v.size))) as string[];
  const colors = Array.from(
    new Set(product.variants.map((v: any) => JSON.stringify({ name: v.colorName, hex: v.colorHex })))
  ).map((str) => JSON.parse(str as string));

  const [selectedSize, setSelectedSize] = useState<string>(sizes[0] || 'M');
  const [selectedColor, setSelectedColor] = useState<string>(colors[0]?.name || 'Default');
  const [quantity, setQuantity] = useState<number>(1);

  // Active Variant & Stock Check
  const activeVariant = product.variants.find(
    (v: any) => v.size === selectedSize && v.colorName === selectedColor
  );
  const stock = activeVariant ? activeVariant.stock : 0;

  const activePrice = product.salePrice && product.salePrice > 0 ? product.salePrice : product.price;

  const handleAddToCart = () => {
    if (stock <= 0) return;
    addToCart({
      productId: product.id,
      slug: product.slug,
      nameEn: product.nameEn,
      nameAr: product.nameAr,
      image: selectedImage || images[0].url,
      price: product.price,
      salePrice: product.salePrice,
      size: selectedSize,
      color: selectedColor,
      colorHex: colors.find((c: any) => c.name === selectedColor)?.hex,
      quantity,
      maxStock: stock,
    });
    onClose();
  };

  const handleWhatsApp = () => {
    const whatsappUrl = generateWhatsAppOrderMessage({
      orderNumber: `QUICK-${Math.floor(1000 + Math.random() * 9000)}`,
      customerName: 'Customer',
      customerPhone: '0938098917',
      customerWhatsapp: '0938098917',
      governorate: 'Damascus',
      cityArea: 'Qudsaya',
      address: 'Quick Product Order',
      items: [
        {
          productName: language === 'ar' ? product.nameAr : product.nameEn,
          size: selectedSize,
          color: selectedColor,
          quantity,
          price: activePrice,
        },
      ],
      subtotal: activePrice * quantity,
      deliveryFee: 15000,
      discount: 0,
      total: activePrice * quantity + 15000,
      paymentMethod: 'WHATSAPP',
    });
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-brand-950 border border-brand-800 rounded-3xl overflow-hidden shadow-2xl animate-fade-in my-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white bg-black/60 rounded-full z-10 border border-white/10"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Gallery Side */}
          <div className="p-6 bg-brand-900/50 flex flex-col items-center justify-between border-b md:border-b-0 md:border-r border-brand-800">
            <div className="w-full aspect-[3/4] rounded-2xl overflow-hidden bg-brand-950 border border-brand-800 relative">
              <img
                src={selectedImage}
                alt={product.nameEn}
                className="w-full h-full object-cover"
              />
            </div>

            {images.length > 1 && (
              <div className="flex gap-2 mt-4 overflow-x-auto pb-2 w-full">
                {images.map((img: any, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(img.url)}
                    className={`w-16 h-20 rounded-lg overflow-hidden border shrink-0 transition-all ${
                      selectedImage === img.url ? 'border-brand-gold ring-2 ring-brand-gold/40' : 'border-brand-800 opacity-60'
                    }`}
                  >
                    <img src={img.url} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details Side */}
          <div className="p-6 md:p-8 flex flex-col justify-between space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-mono text-brand-gold uppercase tracking-widest">
                  MADE IN TURKEY 🇹🇷
                </span>
                <span className="text-xs text-gray-500">•</span>
                <span className="text-xs font-mono text-gray-400 uppercase">{product.sku}</span>
              </div>

              <h2 className="text-xl sm:text-2xl font-bold text-white mb-3">
                {language === 'ar' ? product.nameAr : product.nameEn}
              </h2>

              <div className="flex items-baseline gap-3">
                <span className="text-2xl font-bold text-white font-mono">
                  {formatPrice(activePrice)}
                </span>
                {product.salePrice && product.salePrice < product.price && (
                  <span className="text-base text-gray-500 line-through font-mono">
                    {formatPrice(product.price)}
                  </span>
                )}
              </div>
            </div>

            {/* Size Selector */}
            <div>
              <div className="flex justify-between items-center mb-2 text-xs font-mono uppercase tracking-wider">
                <span className="text-gray-300 font-semibold">{t.selectSize}</span>
                <span className="text-gray-500 font-bold">{selectedSize}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedSize(s)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-mono transition-all border ${
                      selectedSize === s
                        ? 'bg-white text-black font-bold border-white shadow-md'
                        : 'bg-brand-900 text-gray-300 border-brand-700 hover:border-gray-500'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Selector */}
            <div>
              <div className="flex justify-between items-center mb-2 text-xs font-mono uppercase tracking-wider">
                <span className="text-gray-300 font-semibold">{t.selectColor}</span>
                <span className="text-gray-500 font-bold">{selectedColor}</span>
              </div>
              <div className="flex flex-wrap gap-3">
                {colors.map((c: any) => (
                  <button
                    key={c.name}
                    onClick={() => setSelectedColor(c.name)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs border transition-all ${
                      selectedColor === c.name
                        ? 'border-brand-gold bg-brand-gold/10 text-white font-semibold'
                        : 'border-brand-800 text-gray-400 hover:border-gray-600'
                    }`}
                  >
                    <span
                      className="w-3.5 h-3.5 rounded-full border border-white/20"
                      style={{ backgroundColor: c.hex }}
                    />
                    <span>{c.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Stock indicator */}
            <div className="text-xs font-mono">
              {stock > 0 ? (
                <span className="text-emerald-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  {t.inStock} ({stock} available for {selectedSize} / {selectedColor})
                </span>
              ) : (
                <span className="text-red-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-red-500" />
                  {t.outOfStock}
                </span>
              )}
            </div>

            {/* CTAs */}
            <div className="space-y-3 pt-2">
              <Button
                variant="primary"
                onClick={handleAddToCart}
                disabled={stock <= 0}
                className="w-full py-3.5 flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>{t.addToCart}</span>
              </Button>

              <button
                onClick={handleWhatsApp}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-md text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg"
              >
                <Send className="w-4 h-4" />
                <span>{t.orderByWhatsapp}</span>
              </button>

              <Link
                href={`/product/${product.slug}`}
                onClick={onClose}
                className="block text-center text-xs text-gray-400 hover:text-white underline pt-1 font-mono"
              >
                View Full Specifications & Details &rarr;
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
