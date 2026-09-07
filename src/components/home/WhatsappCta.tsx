'use client';

import React from 'react';
import { Send, Phone, MessageSquare } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export function WhatsappCta() {
  const { t } = useLanguage();

  return (
    <section className="py-16 bg-gradient-to-r from-brand-950 via-brand-900 to-brand-950 text-white border-t border-brand-850">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 bg-brand-900/80 border border-brand-700/80 rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-8">
        <div className="space-y-3 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-950/80 border border-emerald-700 text-emerald-400 text-xs font-mono rounded-full">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>DIRECT ORDER & STYLING ASSISTANCE</span>
          </div>

          <h3 className="text-2xl sm:text-3xl font-display font-bold uppercase text-white">
            {t.whatsappCtaTitle}
          </h3>

          <p className="text-xs sm:text-sm text-gray-300">
            {t.whatsappCtaSub} (Phone: <span className="text-brand-gold font-mono font-bold">0938098917</span>)
          </p>
        </div>

        <a
          href="https://wa.me/963938098917"
          target="_blank"
          rel="noreferrer"
          className="px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-2xl text-xs sm:text-sm uppercase tracking-wider flex items-center gap-3 transition-all duration-300 shadow-[0_0_25px_rgba(16,185,129,0.3)] shrink-0 active:scale-95"
        >
          <Send className="w-5 h-5" />
          <span>{t.whatsappCtaBtn}</span>
        </a>
      </div>
    </section>
  );
}
