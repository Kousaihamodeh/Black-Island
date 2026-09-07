'use client';

import React from 'react';
import { MapPin, Navigation, ExternalLink, Compass } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export const GOOGLE_MAPS_STORE_URL = 'https://maps.app.goo.gl/GetFPYXM5SS88h8m9';

export function GoogleMapSection() {
  const { language } = useLanguage();

  return (
    <section className="py-20 bg-black text-white border-t border-brand-850 relative overflow-hidden">
      {/* Background Gold Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-brand-gold/10 rounded-full filter blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="bg-brand-950 rounded-3xl border border-brand-800 p-8 sm:p-12 shadow-2xl space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-brand-850 pb-8">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-900 border border-brand-700 rounded-full text-brand-gold text-xs font-mono tracking-widest uppercase">
                <MapPin className="w-3.5 h-3.5" />
                <span>{language === 'ar' ? 'موقع الفرع الرسمي على غوغل مابس' : 'OFFICIAL STORE GOOGLE MAPS'}</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-display font-bold uppercase text-white tracking-wide">
                {language === 'ar' ? 'موقع الفرع الرئيسي - دمشق قدسيا' : 'BLACK ISLAND HEADQUARTERS'}
              </h2>
              <p className="text-xs text-gray-400 font-mono max-w-lg">
                {language === 'ar'
                  ? 'زوروا فرعنا الرئيسي في دمشق - قدسيا لمشاهدة وتجربة أحدث تشكيلات الستريت وير الفاخرة.'
                  : 'Visit our flagship store in Damascus - Qudsaya to explore and inspect our latest luxury Turkish streetwear drops.'}
              </p>
            </div>

            <div>
              <a
                href={GOOGLE_MAPS_STORE_URL}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2.5 px-8 py-4 bg-brand-gold text-black hover:bg-amber-400 font-mono font-bold rounded-2xl text-xs tracking-widest transition-all shadow-2xl hover:scale-105"
              >
                <Navigation className="w-4 h-4 fill-black" />
                <span>{language === 'ar' ? 'فتح الموقع في تطبيق غوغل مابس' : 'OPEN IN GOOGLE MAPS APP'}</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Styled Google Maps Visual Card */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Visual Location Details */}
            <div className="lg:col-span-5 space-y-4 font-mono text-xs">
              <div className="p-4 bg-brand-900/60 rounded-2xl border border-brand-850 space-y-1.5">
                <span className="text-[10px] text-brand-gold uppercase font-bold">STORE ADDRESS</span>
                <p className="text-sm font-bold text-white">
                  {language === 'ar' ? 'دمشق، سورية – قدسيا' : 'Damascus, Syria – Qudsaya'}
                </p>
                <p className="text-gray-400 text-[11px]">
                  {language === 'ar' ? 'شحن سريع لكافة المحافظات السورية واستلام من الفرع' : 'Express Delivery Across Syrian Governorates & Store Pickup'}
                </p>
              </div>

              <div className="p-4 bg-brand-900/60 rounded-2xl border border-brand-850 space-y-1.5">
                <span className="text-[10px] text-brand-gold uppercase font-bold">CONTACT & ASSISTANCE</span>
                <p className="text-sm font-bold text-white">0938098917</p>
                <p className="text-gray-400 text-[11px]">WhatsApp & Phone Ordering Available 24/7</p>
              </div>

              <div className="p-4 bg-brand-900/60 rounded-2xl border border-brand-850 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Compass className="w-5 h-5 text-brand-gold" />
                  <div>
                    <span className="text-white font-bold block">DIRECT NAVIGATOR</span>
                    <span className="text-gray-400 text-[10px]">maps.app.goo.gl/GetFPYXM5SS88h8m9</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Embedded Dark Map Container / Preview Card */}
            <div className="lg:col-span-7">
              <a
                href={GOOGLE_MAPS_STORE_URL}
                target="_blank"
                rel="noreferrer"
                className="group relative block w-full h-72 sm:h-80 rounded-2xl overflow-hidden border-2 border-brand-800 hover:border-brand-gold transition-all duration-300 shadow-2xl"
              >
                {/* Styled Map Background Card */}
                <div className="absolute inset-0 bg-brand-900 flex flex-col items-center justify-center p-6 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-brand-gold/20 border border-brand-gold flex items-center justify-center text-brand-gold animate-bounce">
                    <MapPin className="w-8 h-8 fill-brand-gold text-black" />
                  </div>

                  <div className="space-y-1">
                    <h4 className="text-lg font-bold text-white uppercase font-display">BLACK ISLAND - GOOGLE MAPS</h4>
                    <p className="text-xs text-brand-gold font-mono">maps.app.goo.gl/GetFPYXM5SS88h8m9</p>
                  </div>

                  <span className="px-5 py-2.5 bg-brand-gold text-black font-bold rounded-xl text-xs font-mono group-hover:scale-110 transition-transform shadow-lg flex items-center gap-2">
                    <Navigation className="w-4 h-4" />
                    <span>{language === 'ar' ? 'اضغط للفتح المباشر على الخريطة' : 'Click to Open Live Location'}</span>
                  </span>
                </div>

                {/* Dark Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
