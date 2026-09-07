'use client';

import React from 'react';
import Link from 'next/link';
import { CheckCircle2, Send, Phone, MapPin, PackageCheck, ShoppingBag } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/Button';
import { formatPrice } from '@/lib/utils';
import { generateWhatsAppOrderMessage } from '@/lib/whatsapp';

interface OrderConfirmationClientProps {
  order: any;
}

export function OrderConfirmationClient({ order }: OrderConfirmationClientProps) {
  const { language, t } = useLanguage();

  const whatsappUrl = generateWhatsAppOrderMessage({
    orderNumber: order.orderNumber,
    customerName: order.customerName,
    customerPhone: order.customerPhone,
    customerWhatsapp: order.customerWhatsapp,
    governorate: order.governorate,
    cityArea: order.cityArea,
    address: order.address,
    notes: order.notes,
    items: order.items.map((i: any) => ({
      productName: i.productName,
      size: i.size,
      color: i.color,
      quantity: i.quantity,
      price: i.price,
    })),
    subtotal: order.subtotal,
    discount: order.discount,
    total: order.total,
    paymentMethod: order.paymentMethod,
  });

  return (
    <div className="py-16 bg-black text-white min-h-screen font-sans">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-brand-950 border border-brand-800 rounded-3xl p-8 sm:p-12 text-center space-y-8 shadow-2xl relative overflow-hidden">
          {/* Top Icon */}
          <div className="w-20 h-20 bg-emerald-950/80 border border-emerald-700 rounded-full flex items-center justify-center mx-auto text-emerald-400">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-mono text-brand-gold uppercase tracking-[0.2em]">REGISTERED IN DAMASCUS</span>
            <h1 className="text-3xl sm:text-4xl font-display font-bold uppercase text-white">{t.orderConfirmed}</h1>
            <p className="text-xs text-gray-400 max-w-md mx-auto">{t.thankYouMessage}</p>
          </div>

          {/* Order ID Badge */}
          <div className="inline-block bg-brand-900 border border-brand-700 px-6 py-3 rounded-2xl">
            <span className="text-xs font-mono text-gray-400 uppercase block">{t.orderNumber}</span>
            <span className="text-2xl font-mono font-bold text-white tracking-widest">#{order.orderNumber}</span>
          </div>

          {/* Main WhatsApp Action CTA */}
          <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-950 p-6 rounded-2xl border border-emerald-700 text-left space-y-4">
            <div className="flex items-center gap-3">
              <Send className="w-6 h-6 text-emerald-400" />
              <div>
                <h3 className="text-sm font-bold text-white uppercase">{t.sendWhatsappConfirmation}</h3>
                <p className="text-xs text-emerald-200">Click below to send instant formatted order details directly to our Damascus team at 0938098917.</p>
              </div>
            </div>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="block w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold rounded-xl text-center text-xs uppercase tracking-wider transition-all shadow-[0_0_25px_rgba(16,185,129,0.4)] active:scale-[0.98]"
            >
              🚀 SEND TO WHATSAPP NOW (0938098917)
            </a>
          </div>

          {/* Visual Items Summary Table */}
          <div className="text-left bg-brand-900/50 p-6 rounded-2xl border border-brand-850 space-y-4">
            <h3 className="text-xs font-mono text-brand-gold uppercase tracking-widest font-bold">{t.orderDetails}</h3>

            <div className="divide-y divide-brand-800 text-xs">
              {order.items.map((item: any) => {
                const imgUrl =
                  item.product?.images?.find((i: any) => i.isMain)?.url ||
                  item.product?.images[0]?.url ||
                  '/logo.png';

                return (
                  <div key={item.id} className="py-3 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-14 rounded-lg bg-brand-950 border border-brand-800 overflow-hidden shrink-0">
                        <img src={imgUrl} alt={item.productName} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <span className="font-semibold text-white block">{item.productName}</span>
                        <span className="text-[11px] font-mono text-gray-400">{item.size} • {item.color} x {item.quantity}</span>
                      </div>
                    </div>
                    <span className="font-mono text-white font-bold">{formatPrice(item.total)}</span>
                  </div>
                );
              })}
            </div>

            <div className="pt-4 border-t border-brand-800 text-xs font-mono text-gray-400 space-y-1.5">
              <div className="flex justify-between">
                <span>{t.subtotal}</span>
                <span>{formatPrice(order.subtotal)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>{t.discount}</span>
                  <span>-{formatPrice(order.discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-amber-200">
                <span>{t.deliveryFee}</span>
                <span>{t.deliveryToAgree}</span>
              </div>
              <div className="flex justify-between text-base font-bold text-white pt-2 border-t border-brand-800">
                <span>{t.total}</span>
                <span className="text-brand-gold">{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>

          {/* Customer Delivery info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left text-xs font-mono bg-brand-900/30 p-4 rounded-xl border border-brand-850">
            <div>
              <span className="text-gray-500 uppercase block">CUSTOMER</span>
              <span className="text-white font-semibold">{order.customerName} ({order.customerPhone})</span>
            </div>
            <div>
              <span className="text-gray-500 uppercase block">DELIVERY ADDRESS</span>
              <span className="text-white font-semibold">{order.governorate}, {order.address}</span>
            </div>
          </div>

          <div>
            <Link href="/shop">
              <Button variant="outline" size="sm">{t.continueShopping}</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
