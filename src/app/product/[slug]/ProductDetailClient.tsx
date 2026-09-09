'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { ShoppingBag, Heart, Send, Check, ShieldCheck, Truck, RotateCcw, Sparkles } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/Button';
import { formatPrice } from '@/lib/utils';
import { generateWhatsAppOrderMessage } from '@/lib/whatsapp';

interface ProductDetailClientProps {
  product: any;
  relatedProducts?: any[];
}

export function ProductDetailClient({ product: initialProduct }: ProductDetailClientProps) {
  const [product, setProduct] = useState(initialProduct);

  useEffect(() => {
    let isMounted = true;
    if (initialProduct?.id) {
      fetch(`/api/products/${initialProduct.id}?t=${Date.now()}`, { cache: 'no-store' })
        .then((res) => res.json())
        .then((data) => {
          if (isMounted && data && data.product) {
            setProduct(data.product);
          }
        })
        .catch(() => {});

      try {
        const storedOverrides = JSON.parse(localStorage.getItem('bi_product_overrides') || '{}');
        const storedCreated = JSON.parse(localStorage.getItem('bi_created_products') || '[]');
        if (storedOverrides[initialProduct.id]) {
          setProduct(storedOverrides[initialProduct.id]);
        } else {
          const created = storedCreated.find((p: any) => p && (p.id === initialProduct.id || p.slug === initialProduct.slug));
          if (created) setProduct(created);
        }
      } catch (e) {}
    }
    return () => {
      isMounted = false;
    };
  }, [initialProduct]);
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { language, t } = useLanguage();

  // Extract unique color options with their primary swatch image & array of all photos for that color
  const colorsMap = useMemo(() => {
    const map = new Map<string, { hex: string; primaryImage?: string; allImages: string[] }>();

    product?.variants?.forEach((v: any) => {
      if (v && v.colorName && !map.has(v.colorName)) {
        let imgs: string[] = [];
        if (v.colorImages && typeof v.colorImages === 'string') {
          imgs = v.colorImages.split(',').filter(Boolean);
        } else if (v.colorImage) {
          imgs = [v.colorImage];
        }

        map.set(v.colorName, {
          hex: v.colorHex || '#000000',
          primaryImage: v.colorImage || imgs[0],
          allImages: imgs,
        });
      }
    });

    return map;
  }, [product]);

  const availableColors = useMemo(() => {
    return Array.from(colorsMap.entries()).map(([name, data]) => ({
      name,
      hex: data.hex,
      image: data.primaryImage,
      allImages: data.allImages,
    }));
  }, [colorsMap]);

  const [selectedColor, setSelectedColor] = useState<string>(
    availableColors[0]?.name || ''
  );

  // Compute active photo gallery for selected color (includes cover photo + all items/photos for selected color)
  const activeColorPhotos = useMemo(() => {
    const photosSet = new Set<string>();

    // 1. Add cover image from product.images
    const coverImage = product?.images?.find((img: any) => img.isMain)?.url || product?.images?.[0]?.url;
    if (coverImage) photosSet.add(coverImage);

    // 2. Add all photos for the selected color
    const colorData = availableColors.find((c) => c.name === selectedColor);
    if (colorData && colorData.allImages.length > 0) {
      colorData.allImages.forEach((imgUrl) => photosSet.add(imgUrl));
    }

    // 3. Add all remaining product images
    product?.images?.forEach((img: any) => {
      if (img.url) photosSet.add(img.url);
    });

    const list = Array.from(photosSet);
    return list.length > 0 ? list : ['/logo.png'];
  }, [product, selectedColor, availableColors]);

  const [selectedImage, setSelectedImage] = useState<string>(activeColorPhotos[0]);

  // Filter sizes available for selected color
  const availableSizes = product?.variants
    ?.filter((v: any) => v.colorName === selectedColor)
    ?.map((v: any) => ({ size: v.size, stock: v.stock })) || [];

  const [selectedSize, setSelectedSize] = useState<string>(
    availableSizes[0]?.size || ''
  );

  const [quantity, setQuantity] = useState<number>(1);
  const [addedToast, setAddedToast] = useState(false);

  // When selectedColor changes, update selectedImage & sizes
  useEffect(() => {
    const colorData = availableColors.find((c) => c.name === selectedColor);
    if (colorData?.image) {
      setSelectedImage(colorData.image);
    } else if (activeColorPhotos[0]) {
      setSelectedImage(activeColorPhotos[0]);
    }

    const sizesForColor = product?.variants
      ?.filter((v: any) => v.colorName === selectedColor)
      ?.map((v: any) => v.size) || [];

    if (sizesForColor.length > 0 && !sizesForColor.includes(selectedSize)) {
      setSelectedSize(sizesForColor[0]);
    }
  }, [selectedColor]);

  const activeVariant = product?.variants?.find(
    (v: any) => v.colorName === selectedColor && v.size === selectedSize
  );

  const currentStock = activeVariant ? activeVariant.stock : 0;
  const isOutOfStock = currentStock <= 0;

  const activePrice = product?.salePrice && product?.salePrice > 0 ? product.salePrice : product?.price || 0;

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addToCart({
      productId: product.id,
      slug: product.slug,
      nameEn: product.nameEn,
      nameAr: product.nameAr,
      price: product.price,
      salePrice: product.salePrice,
      image: selectedImage,
      size: selectedSize,
      color: selectedColor,
      colorHex: availableColors.find((c) => c.name === selectedColor)?.hex,
      quantity,
      maxStock: currentStock,
    });
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 2500);
  };

  const handleDirectWhatsApp = () => {
    const whatsappUrl = generateWhatsAppOrderMessage({
      orderNumber: `QUICK-${Math.floor(1000 + Math.random() * 9000)}`,
      customerName: 'Customer',
      customerPhone: '0938098917',
      customerWhatsapp: '0938098917',
      governorate: 'Damascus / Qudsaya',
      cityArea: 'Damascus',
      address: 'Product Detail Page Quick Order',
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
      discount: 0,
      total: activePrice * quantity,
      paymentMethod: 'WHATSAPP',
    });
    window.open(whatsappUrl, '_blank');
  };

  if (!product) return null;

  return (
    <div className="py-12 bg-black text-white min-h-screen font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Gallery & Main Image View */}
          <div className="lg:col-span-7 space-y-4">
            {/* Main Preview Container */}
            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden bg-brand-950 border border-brand-800 shadow-2xl group">
              <img
                src={selectedImage}
                alt={product.nameEn}
                className="w-full h-full object-cover transition-all duration-500"
              />

              {product.isSale && (
                <span className="absolute top-4 left-4 bg-red-600 text-white font-mono font-bold text-xs px-3 py-1 rounded-full uppercase tracking-wider">
                  SALE
                </span>
              )}
            </div>

            {/* Persistent Thumbnail Gallery (Includes Cover Photo + All items/photos for selected color) */}
            {activeColorPhotos.length > 1 && (
              <div className="space-y-2">
                <span className="text-[11px] font-mono text-gray-400 uppercase block font-bold">
                  PHOTOS FOR {selectedColor ? selectedColor.toUpperCase() : 'PRODUCT'} ({activeColorPhotos.length})
                </span>
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-brand-800">
                  {activeColorPhotos.map((photoUrl: string, idx: number) => {
                    const isActive = selectedImage === photoUrl;
                    return (
                      <button
                        key={idx}
                        onClick={() => setSelectedImage(photoUrl)}
                        className={`w-20 h-24 rounded-2xl overflow-hidden border-2 transition-all shrink-0 bg-brand-900 relative ${
                          isActive
                            ? 'border-brand-gold scale-105 shadow-xl ring-2 ring-brand-gold/40'
                            : 'border-brand-800 opacity-60 hover:opacity-100 hover:border-gray-500'
                        }`}
                      >
                        <img src={photoUrl} alt="" className="w-full h-full object-cover" />
                        {idx === 0 && (
                          <span className="absolute bottom-1 left-1 right-1 bg-black/80 text-brand-gold text-[9px] font-mono font-bold py-0.5 rounded text-center">
                            COVER
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Right Product Details & Buy Matrix */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <span className="text-xs font-mono text-brand-gold uppercase tracking-widest block font-bold">
                {product.category?.nameEn || product.categorySlug}
              </span>
              <h1 className="text-2xl sm:text-4xl font-display font-bold uppercase text-white mt-1 leading-tight">
                {language === 'ar' ? product.nameAr : product.nameEn}
              </h1>
              <span className="text-xs font-mono text-gray-500 block mt-1">SKU: {product.sku}</span>
            </div>

            {/* Price Presentation */}
            <div className="flex items-baseline gap-4 font-mono">
              <span className="text-2xl sm:text-3xl font-extrabold text-white">
                {formatPrice(activePrice)}
              </span>
              {product.salePrice && product.salePrice > 0 && (
                <span className="text-base text-gray-500 line-through">
                  {formatPrice(product.price)}
                </span>
              )}
            </div>

            {/* Color Swatches */}
            {availableColors.length > 0 && (
              <div className="space-y-3 pt-2">
                <label className="block text-xs font-mono text-gray-300 uppercase">
                  {t.selectColor}: <strong className="text-white">{selectedColor}</strong>
                </label>
                <div className="flex flex-wrap gap-3">
                  {availableColors.map((col) => {
                    const isSelected = selectedColor === col.name;
                    return (
                      <button
                        key={col.name}
                        onClick={() => {
                          setSelectedColor(col.name);
                          if (col.image) setSelectedImage(col.image);
                        }}
                        className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border font-mono text-xs transition-all ${
                          isSelected
                            ? 'bg-brand-gold text-black border-brand-gold font-bold shadow-lg scale-105'
                            : 'bg-brand-900 text-gray-300 border-brand-800 hover:border-gray-500'
                        }`}
                      >
                        {col.image ? (
                          <img src={col.image} alt={col.name} className="w-5 h-6 object-cover rounded border border-black/20" />
                        ) : (
                          <span className="w-3.5 h-3.5 rounded-full border border-white/20" style={{ backgroundColor: col.hex }} />
                        )}
                        <span>{col.name}</span>
                        {col.allImages.length > 1 && (
                          <span className="text-[10px] opacity-70">({col.allImages.length})</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Independent Sizes for Selected Color */}
            <div className="space-y-3 pt-2">
              <div className="flex justify-between items-center text-xs font-mono">
                <label className="text-gray-300 uppercase">
                  {t.selectSize}: <strong className="text-white">{selectedSize}</strong>
                </label>
                {currentStock > 0 && currentStock <= 5 && (
                  <span className="text-amber-400 font-bold">Only {currentStock} left!</span>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                {availableSizes.map((item: any) => {
                  const isSelected = selectedSize === item.size;
                  const isOut = item.stock <= 0;
                  return (
                    <button
                      key={item.size}
                      disabled={isOut}
                      onClick={() => setSelectedSize(item.size)}
                      className={`px-4 py-2 text-xs font-mono rounded-xl border transition-all ${
                        isSelected
                          ? 'bg-white text-black border-white font-bold shadow-lg'
                          : isOut
                          ? 'bg-brand-950 text-gray-600 border-brand-850 line-through cursor-not-allowed'
                          : 'bg-brand-900 text-gray-200 border-brand-700 hover:border-gray-400'
                      }`}
                    >
                      {item.size}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quantity Controls & Action Buttons */}
            <div className="space-y-4 pt-4 border-t border-brand-850">
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-brand-700 bg-brand-900 rounded-xl px-3 py-2 font-mono text-xs">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="text-gray-400 hover:text-white px-2">-</button>
                  <span className="w-8 text-center text-white font-bold">{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} className="text-gray-400 hover:text-white px-2">+</button>
                </div>

                <Button
                  variant="gold"
                  disabled={isOutOfStock}
                  onClick={handleAddToCart}
                  className="flex-1 py-4 font-bold flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>{isOutOfStock ? t.outOfStock : t.addToCart}</span>
                </Button>

                <button
                  onClick={() => toggleWishlist(product.id)}
                  className={`p-4 rounded-xl border transition-colors ${
                    isInWishlist(product.id) ? 'bg-red-950 border-red-800 text-red-400' : 'bg-brand-900 border-brand-700 text-gray-400 hover:text-white'
                  }`}
                >
                  <Heart className="w-5 h-5" />
                </button>
              </div>

              <button
                onClick={handleDirectWhatsApp}
                className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all font-mono shadow-lg"
              >
                <Send className="w-4 h-4" />
                <span>{t.orderByWhatsapp}</span>
              </button>

              {addedToast && (
                <div className="p-3 bg-emerald-950 border border-emerald-700 text-emerald-300 text-xs font-mono rounded-xl text-center flex items-center justify-center gap-2">
                  <Check className="w-4 h-4" /> Added to your shopping bag!
                </div>
              )}
            </div>

            {/* Delivery Policy Note */}
            <div className="p-4 bg-brand-950 rounded-2xl border border-brand-850 text-xs text-amber-200/90 leading-relaxed font-sans">
              🚚 <strong className="text-white">{t.deliveryFee}:</strong> {t.deliveryToAgree}
            </div>

            {/* Description Accordion */}
            <div className="pt-4 border-t border-brand-850 space-y-2 text-xs">
              <h4 className="font-bold text-white uppercase font-mono">{t.description}</h4>
              <p className="text-gray-300 leading-relaxed font-sans">
                {language === 'ar' ? product.descAr || product.descEn : product.descEn}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
