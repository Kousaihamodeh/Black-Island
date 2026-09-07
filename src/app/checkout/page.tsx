'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Truck, ShieldCheck, CreditCard, Send, CheckCircle } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/Button';
import { formatPrice } from '@/lib/utils';

export default function CheckoutPage() {
  const { cart, subtotal, discount, clearCart } = useCart();
  const { language, t } = useLanguage();
  const router = useRouter();

  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    whatsapp: '',
    governorate: 'Rural Damascus / Qudsaya (ريف دمشق / قدسيا)',
    cityArea: 'Qudsaya',
    address: '',
    notes: '',
    paymentMethod: 'COD',
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const governorates = [
    t.govRuralDamascus,
    t.govDamascus,
    t.govAleppo,
    t.govHoms,
    t.govHama,
    t.govLattakia,
    t.govTartous,
    t.govDeraa,
    t.govSweida,
    t.govHasakah,
    t.govDeirEzZor,
    t.govRaqqa,
    t.govIdlib,
  ];

  const total = Math.max(0, subtotal - discount);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.fullName.trim() || !form.phone.trim() || !form.address.trim()) {
      setErrorMsg('Please complete all required fields (Full Name, Phone, Address).');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: form.fullName,
          customerPhone: form.phone,
          customerWhatsapp: form.whatsapp || form.phone,
          governorate: form.governorate,
          cityArea: form.cityArea,
          address: form.address,
          notes: form.notes,
          subtotal,
          deliveryFee: 0,
          discount,
          total,
          paymentMethod: form.paymentMethod,
          items: cart.map((i) => ({
            productId: i.productId,
            productName: language === 'ar' ? i.nameAr : i.nameEn,
            size: i.size,
            color: i.color,
            price: i.salePrice && i.salePrice > 0 ? i.salePrice : i.price,
            quantity: i.quantity,
            total: (i.salePrice && i.salePrice > 0 ? i.salePrice : i.price) * i.quantity,
          })),
        }),
      });

      const data = await res.json();
      setLoading(false);

      if (data.success && data.order) {
        clearCart();
        router.push(`/order-confirmation/${data.order.id}`);
      } else {
        setErrorMsg(data.error || 'Failed to place order. Please try again.');
      }
    } catch (err) {
      setLoading(false);
      setErrorMsg('Network error. Please try again.');
    }
  };

  if (cart.length === 0) {
    return (
      <div className="py-24 bg-black text-white min-h-[70vh] flex flex-col items-center justify-center text-center px-4 font-sans">
        <h1 className="text-2xl font-bold uppercase mb-4">Your bag is empty</h1>
        <Button variant="gold" onClick={() => router.push('/shop')}>Return to Shop</Button>
      </div>
    );
  }

  return (
    <div className="py-12 bg-black text-white min-h-screen font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl sm:text-4xl font-display font-bold uppercase mb-8 border-b border-brand-850 pb-4">
          {t.checkoutTitle}
        </h1>

        {errorMsg && (
          <div className="mb-6 p-4 bg-red-950/80 border border-red-800 rounded-xl text-xs text-red-200 font-mono">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Form Side */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-brand-950 p-6 sm:p-8 rounded-2xl border border-brand-800 space-y-6">
              <h3 className="text-xs font-mono text-brand-gold uppercase tracking-widest font-bold">1. CUSTOMER INFORMATION</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-gray-300 mb-1.5">{t.fullName} *</label>
                  <input
                    type="text"
                    name="fullName"
                    required
                    value={form.fullName}
                    onChange={handleChange}
                    placeholder="e.g. Ahmad Al-Damashqi"
                    className="w-full bg-brand-900 border border-brand-700 text-white text-xs px-4 py-3 rounded-xl focus:border-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-gray-300 mb-1.5">{t.phoneNumber} *</label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="0938098917"
                    className="w-full bg-brand-900 border border-brand-700 text-white text-xs px-4 py-3 rounded-xl focus:border-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-gray-300 mb-1.5">{t.whatsappNumber}</label>
                <input
                  type="tel"
                  name="whatsapp"
                  value={form.whatsapp}
                  onChange={handleChange}
                  placeholder="0938098917"
                  className="w-full bg-brand-900 border border-brand-700 text-white text-xs px-4 py-3 rounded-xl focus:border-white focus:outline-none"
                />
              </div>
            </div>

            <div className="bg-brand-950 p-6 sm:p-8 rounded-2xl border border-brand-800 space-y-6">
              <h3 className="text-xs font-mono text-brand-gold uppercase tracking-widest font-bold">2. SYRIA DELIVERY ADDRESS</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-gray-300 mb-1.5">{t.governorate} *</label>
                  <select
                    name="governorate"
                    value={form.governorate}
                    onChange={handleChange}
                    className="w-full bg-brand-900 border border-brand-700 text-white text-xs px-4 py-3 rounded-xl focus:border-white focus:outline-none cursor-pointer"
                  >
                    {governorates.map((g) => (
                      <option key={g} value={g} className="bg-brand-950">{g}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono text-gray-300 mb-1.5">{t.cityArea} *</label>
                  <input
                    type="text"
                    name="cityArea"
                    required
                    value={form.cityArea}
                    onChange={handleChange}
                    placeholder="Qudsaya, Mezzeh..."
                    className="w-full bg-brand-900 border border-brand-700 text-white text-xs px-4 py-3 rounded-xl focus:border-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-gray-300 mb-1.5">{t.detailedAddress} *</label>
                <input
                  type="text"
                  name="address"
                  required
                  value={form.address}
                  onChange={handleChange}
                  placeholder="Street name, building number..."
                  className="w-full bg-brand-900 border border-brand-700 text-white text-xs px-4 py-3 rounded-xl focus:border-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-gray-300 mb-1.5">{t.orderNotes}</label>
                <textarea
                  name="notes"
                  rows={2}
                  value={form.notes}
                  onChange={handleChange}
                  placeholder="Preferred timing, specific requests..."
                  className="w-full bg-brand-900 border border-brand-700 text-white text-xs p-3 rounded-xl focus:border-white focus:outline-none"
                />
              </div>
            </div>

            <div className="bg-brand-950 p-6 sm:p-8 rounded-2xl border border-brand-800 space-y-4">
              <h3 className="text-xs font-mono text-brand-gold uppercase tracking-widest font-bold">3. PAYMENT METHOD</h3>

              <div className="space-y-3">
                <label
                  onClick={() => setForm({ ...form, paymentMethod: 'COD' })}
                  className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                    form.paymentMethod === 'COD'
                      ? 'border-brand-gold bg-brand-gold/10 text-white'
                      : 'border-brand-800 bg-brand-900 text-gray-400'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <CreditCard className="w-5 h-5 text-brand-gold" />
                    <div>
                      <span className="text-xs font-bold uppercase block text-white">{t.cashOnDelivery}</span>
                      <span className="text-[11px] text-gray-400">Pay in cash after inspecting your items upon delivery.</span>
                    </div>
                  </div>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="COD"
                    checked={form.paymentMethod === 'COD'}
                    onChange={() => {}}
                    className="accent-brand-gold"
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Order Summary Side */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-brand-950 p-6 sm:p-8 rounded-2xl border border-brand-800 space-y-6 sticky top-28">
              <h3 className="text-xs font-mono text-brand-gold uppercase tracking-widest font-bold">ORDER SUMMARY</h3>

              <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between items-center text-xs border-b border-brand-850 pb-2">
                    <div className="flex items-center gap-3">
                      <img src={item.image} alt="" className="w-10 h-12 object-cover rounded bg-brand-900" />
                      <div>
                        <span className="font-semibold text-white block">{language === 'ar' ? item.nameAr : item.nameEn}</span>
                        <span className="text-[10px] text-gray-400 font-mono">{item.size} • {item.color} x {item.quantity}</span>
                      </div>
                    </div>
                    <span className="font-mono text-white font-bold">{formatPrice((item.salePrice || item.price) * item.quantity)}</span>
                  </div>
                ))}
              </div>

              {/* Delivery Policy Callout */}
              <div className="p-3 bg-brand-900/60 rounded-xl border border-brand-800 text-xs text-amber-200/90 leading-relaxed font-sans">
                🚚 <strong className="text-white">{t.deliveryFee}:</strong> {t.deliveryToAgree}
              </div>

              <div className="space-y-2 text-xs font-mono text-gray-400 border-t border-brand-800 pt-4">
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
                <div className="flex justify-between text-base font-bold text-white pt-3 border-t border-brand-800">
                  <span>{t.total}</span>
                  <span className="text-brand-gold">{formatPrice(total)}</span>
                </div>
              </div>

              <Button
                type="submit"
                variant="gold"
                isLoading={loading}
                className="w-full py-4 text-sm font-bold tracking-wider"
              >
                {t.placeOrder}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
