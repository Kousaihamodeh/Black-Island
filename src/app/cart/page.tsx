'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ShoppingBag, Trash2, ArrowRight, Tag, Send } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/Button';
import { formatPrice } from '@/lib/utils';
import { generateWhatsAppOrderMessage } from '@/lib/whatsapp';

export default function CartPage() {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    subtotal,
    discount,
    coupon,
    applyCoupon,
    removeCoupon,
  } = useCart();
  const { language, t } = useLanguage();

  const [couponInput, setCouponInput] = useState('');
  const [couponMsg, setCouponMsg] = useState<{ success: boolean; text: string } | null>(null);

  const cartItems = Array.isArray(cart) ? cart.filter(Boolean) : [];
  const total = Math.max(0, subtotal - discount);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput) return;
    const res = await applyCoupon(couponInput);
    setCouponMsg({ success: res.success, text: res.message });
  };

  const handleDirectWhatsApp = () => {
    if (cartItems.length === 0) return;
    const whatsappUrl = generateWhatsAppOrderMessage({
      orderNumber: `CART-${Math.floor(1000 + Math.random() * 9000)}`,
      customerName: 'Customer',
      customerPhone: '0938098917',
      customerWhatsapp: '0938098917',
      governorate: 'Damascus / Qudsaya',
      cityArea: 'Damascus',
      address: 'Full Cart Page Quick Order',
      items: cartItems.map((i) => ({
        productName: language === 'ar' ? i.nameAr : i.nameEn,
        size: i.size,
        color: i.color,
        quantity: i.quantity,
        price: i.salePrice && i.salePrice > 0 ? i.salePrice : i.price,
      })),
      subtotal,
      discount,
      total,
      paymentMethod: 'WHATSAPP',
    });
    window.open(whatsappUrl, '_blank');
  };

  if (cartItems.length === 0) {
    return (
      <div className="py-24 bg-black text-white min-h-[70vh] flex flex-col items-center justify-center text-center px-4 font-sans">
        <div className="w-20 h-20 bg-brand-900 border border-brand-800 rounded-full flex items-center justify-center mb-6 text-gray-500">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-display font-bold uppercase mb-2">{t.cartTitle}</h1>
        <p className="text-sm text-gray-400 max-w-md mb-8">{t.cartEmpty}</p>
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
          {t.cartTitle}
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Cart Items List */}
          <div className="lg:col-span-8 space-y-4">
            {cart.map((item) => {
              const activePrice = item.salePrice && item.salePrice > 0 ? item.salePrice : item.price;
              return (
                <div
                  key={item.id}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 sm:p-6 bg-brand-900/50 rounded-2xl border border-brand-800 gap-4"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={item.image}
                      alt={item.nameEn}
                      className="w-20 h-24 object-cover rounded-xl border border-brand-800 bg-brand-950"
                    />
                    <div>
                      <h3 className="text-sm sm:text-base font-bold text-white">
                        {language === 'ar' ? item.nameAr : item.nameEn}
                      </h3>
                      <div className="flex items-center gap-2 text-xs font-mono text-gray-400 mt-1">
                        <span>Size: <strong className="text-white">{item.size}</strong></span>
                        <span>•</span>
                        <span>Color: <strong className="text-white">{item.color}</strong></span>
                      </div>
                      <span className="text-xs font-mono text-brand-gold mt-2 block font-bold">
                        {formatPrice(activePrice)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-6 pt-2 sm:pt-0 border-t sm:border-t-0 border-brand-800">
                    <div className="flex items-center border border-brand-700 bg-brand-950 rounded-lg px-3 py-1">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="text-gray-400 hover:text-white px-2">-</button>
                      <span className="text-xs font-mono text-white px-2 font-bold">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="text-gray-400 hover:text-white px-2">+</button>
                    </div>

                    <span className="text-sm font-bold font-mono text-white">
                      {formatPrice(activePrice * item.quantity)}
                    </span>

                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-gray-500 hover:text-red-400 p-2"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Cart Summary Side */}
          <div className="lg:col-span-4 bg-brand-950 p-6 rounded-2xl border border-brand-800 h-fit space-y-6">
            <h3 className="text-xs font-mono text-brand-gold uppercase tracking-widest font-bold">ORDER SUMMARY</h3>

            <form onSubmit={handleApplyCoupon} className="flex gap-2">
              <input
                type="text"
                value={couponInput}
                onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                placeholder={t.couponCode}
                className="flex-1 bg-brand-900 text-white text-xs px-3 py-2.5 rounded-lg border border-brand-700 uppercase font-mono"
              />
              <Button type="submit" variant="secondary" size="sm">{t.applyCoupon}</Button>
            </form>

            {coupon && (
              <div className="flex items-center justify-between bg-emerald-950/40 border border-emerald-800/60 p-2 rounded-lg text-xs text-emerald-400 font-mono">
                <span>Code {coupon.code} (-${discount.toLocaleString()})</span>
                <button onClick={removeCoupon} className="underline text-red-400">Remove</button>
              </div>
            )}

            <div className="p-3 bg-brand-900/60 rounded-xl border border-brand-850 text-xs text-amber-200/90 leading-relaxed font-sans">
              🚚 <strong className="text-white">{t.deliveryFee}:</strong> {t.deliveryToAgree}
            </div>

            <div className="space-y-3 text-xs font-mono text-gray-400 border-t border-brand-850 pt-4">
              <div className="flex justify-between">
                <span>{t.subtotal}</span>
                <span className="text-white">{formatPrice(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>{t.discount}</span>
                  <span>-{formatPrice(discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-bold text-white pt-3 border-t border-brand-850">
                <span>{t.total}</span>
                <span className="text-brand-gold font-mono">{formatPrice(total)}</span>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <Link href="/checkout" className="block">
                <Button variant="primary" className="w-full py-4 text-sm flex items-center justify-center gap-2 font-bold">
                  <span>{t.checkout}</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>

              <button
                onClick={handleDirectWhatsApp}
                className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-md text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg font-mono"
              >
                <Send className="w-4 h-4" />
                <span>{t.orderByWhatsapp}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
