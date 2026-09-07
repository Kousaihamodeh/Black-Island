'use client';

import React from 'react';
import { Instagram, ExternalLink } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export function InstagramSection() {
  const { language, t } = useLanguage();

  return (
    <section className="py-16 bg-brand-950 text-white border-t border-brand-850">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 text-brand-gold text-xs font-mono tracking-widest uppercase bg-brand-900/80 px-4 py-1.5 rounded-full border border-brand-800">
            <Instagram className="w-4 h-4 text-brand-gold" />
            <span>{t.instagramHandle}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-display font-bold uppercase text-white tracking-wide">
            {t.instagramTitle}
          </h2>

          <p className="text-xs text-gray-400 font-mono max-w-md mx-auto leading-relaxed">
            {language === 'ar'
              ? 'تابعوا حسابنا الرسمى على إنستغرام لمشاهدة أحدث الإطلالات والتشكيلات الحصرية في قدسيا ودمشق.'
              : 'Follow our official Instagram page for the latest streetwear drops, outfit inspirations, and exclusive Damascus releases.'}
          </p>

          <div className="pt-4">
            <a
              href="https://instagram.com/black_islandd_fashion"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2.5 px-8 py-3.5 bg-brand-gold text-black hover:bg-amber-400 font-mono font-bold rounded-full text-xs tracking-widest transition-all shadow-xl hover:scale-105"
            >
              <Instagram className="w-4 h-4" />
              <span>{language === 'ar' ? 'متابعة الحساب الرسمي @black_islandd_fashion' : 'FOLLOW @black_islandd_fashion'}</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
