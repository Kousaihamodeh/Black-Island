'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Tag, Send } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/Button';
import { formatPrice } from '@/lib/utils';
import { generateWhatsAppOrderMessage } from '@/lib/whatsapp';

export function CartDrawer() {
  const {
    cart,
    isOpen,
    closeCart,
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
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  if (!isOpen) return null;

  const total = Math.max(0, subtotal - discount);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput) return;
    setIsApplyingCoupon(true);
    setCouponMsg(null);
    const res = await applyCoupon(couponInput);
    setIsApplyingCoupon(false);
    setCouponMsg({ success: res.success, text: res.message });
  };

  const handleDirectWhatsApp = () => {
    if (cart.length === 0) return;
    const whatsappUrl = generateWhatsAppOrderMessage({
      orderNumber: `DRAFT-${Math.floor(1000 + Math.random() * 9000)}`,
      customerName: 'Customer',
      customerPhone: '0938098917',
      customerWhatsapp: '0938098917',
      governorate: 'Damascus / Qudsaya',
      cityArea: 'Damascus',
      address: 'Direct Quick Order',
      items: cart.map((i) => ({
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

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-sans">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity animate-fade-in"
        onClick={closeCart}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-brand-950 border-l border-brand-800 shadow-2xl flex flex-col justify-between z-10 animate-slide-up">
          {/* Drawer Header */}
          <div className="p-6 border-b border-brand-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ShoppingBag className="w-5 h-5 text-brand-gold" />
              <h2 className="font-display text-lg font-bold text-white uppercase tracking-wider">{t.cartTitle}</h2>
              <span className="text-xs font-mono bg-brand-800 text-gray-300 px-2 py-0.5 rounded-full">
                {cart.reduce((a, b) => a + b.quantity, 0)}
              </span>
            </div>
            <button
              onClick={closeCart}
              className="p-2 text-gray-400 hover:text-white rounded-full hover:bg-brand-850"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Drawer Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {cart.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <div className="w-16 h-16 bg-brand-900 border border-brand-800 rounded-full flex items-center justify-center mx-auto text-gray-500">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <p className="text-sm text-gray-400">{t.cartEmpty}</p>
                <Button variant="outline" size="sm" onClick={closeCart}>
                  {t.continueShopping}
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {cart.map((item) => {
                  const activePrice = item.salePrice && item.salePrice > 0 ? item.salePrice : item.price;
                  return (
                    <div
                      key={item.id}
                      className="flex gap-4 p-3 bg-brand-900/60 rounded-xl border border-brand-800/80 hover:border-brand-700 transition-colors"
                    >
                      <div className="w-20 h-24 rounded-lg overflow-hidden bg-brand-850 shrink-0 border border-brand-800">
                        <img
                          src={item.image}
                          alt={item.nameEn}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start">
                            <h3 className="text-xs font-semibold text-white line-clamp-1">
                              {language === 'ar' ? item.nameAr : item.nameEn}
                            </h3>
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="text-gray-500 hover:text-red-400 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          <div className="flex items-center gap-2 mt-1 text-[11px] font-mono text-gray-400">
                            <span className="bg-brand-800 px-1.5 py-0.5 rounded border border-brand-700">
                              {item.size}
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              {item.colorHex && (
                                <span
                                  className="w-2.5 h-2.5 rounded-full border border-white/20"
                                  style={{ backgroundColor: item.colorHex }}
                                />
                              )}
                              {item.color}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center gap-2 border border-brand-700 rounded-md bg-brand-950 px-2 py-0.5">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="text-gray-400 hover:text-white"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-xs font-mono text-white w-4 text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="text-gray-400 hover:text-white"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <span className="text-xs font-bold text-white font-mono">
                            {formatPrice(activePrice * item.quantity)}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Drawer Footer & Checkout */}
          {cart.length > 0 && (
            <div className="p-6 border-t border-brand-800 bg-brand-900/40 space-y-4">
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                    placeholder={t.couponCode}
                    className="w-full bg-brand-950 text-white text-xs pl-9 pr-3 py-2 rounded-lg border border-brand-700 focus:border-brand-gold focus:outline-none uppercase font-mono"
                  />
                </div>
                <Button type="submit" variant="secondary" size="sm" isLoading={isApplyingCoupon}>
                  {t.applyCoupon}
                </Button>
              </form>

              {coupon && (
                <div className="flex items-center justify-between bg-emerald-950/40 border border-emerald-800/60 p-2 rounded-lg text-xs text-emerald-400 font-mono">
                  <span>Code <strong>{coupon.code}</strong> (-${discount.toLocaleString()})</span>
                  <button onClick={removeCoupon} className="underline text-red-400">Remove</button>
                </div>
              )}

              {couponMsg && !coupon && (
                <p className={`text-xs ${couponMsg.success ? 'text-emerald-400' : 'text-red-400'}`}>
                  {couponMsg.text}
                </p>
              )}

              <div className="p-2.5 bg-brand-900/60 rounded-xl border border-brand-850 text-[11px] text-amber-200/90 leading-tight">
                🚚 <strong>{t.deliveryFee}:</strong> {t.deliveryToAgree}
              </div>

              {/* Totals */}
              <div className="space-y-1.5 text-xs text-gray-400 border-t border-brand-800 pt-3 font-mono">
                <div className="flex justify-between">
                  <span>{t.subtotal}</span>
                  <span className="text-white font-mono">{formatPrice(subtotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>{t.discount}</span>
                    <span className="font-mono">-{formatPrice(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-base font-bold text-white pt-2 border-t border-brand-800">
                  <span>{t.total}</span>
                  <span className="text-brand-gold font-mono">{formatPrice(total)}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2">
                <Link href="/checkout" onClick={closeCart} className="block">
                  <Button variant="primary" className="w-full py-3.5 flex items-center justify-center gap-2 font-bold">
                    <span>{t.checkout}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>

                <button
                  onClick={handleDirectWhatsApp}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-md text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg font-mono"
                >
                  <Send className="w-4 h-4" />
                  <span>{t.orderByWhatsapp}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
