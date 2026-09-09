'use client';

import React, { useEffect, useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';

export function CinematicIntro() {
  const [isVisible, setIsVisible] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    try {
      if (typeof window === 'undefined') return;
      const prefersReducedMotion = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)')?.matches : false;
      let hasSeenIntro = null;
      try {
        hasSeenIntro = sessionStorage.getItem('black_island_intro_seen');
      } catch (e) {}

      if (!hasSeenIntro && !prefersReducedMotion) {
        setIsVisible(true);

        const timer1 = setTimeout(() => {
          setIsFadingOut(true);
        }, 2000);

        const timer2 = setTimeout(() => {
          setIsVisible(false);
          try { sessionStorage.setItem('black_island_intro_seen', 'true'); } catch (e) {}
        }, 2600);

        return () => {
          clearTimeout(timer1);
          clearTimeout(timer2);
        };
      }
    } catch (e) {}
  }, []);

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 z-50 bg-black flex flex-col items-center justify-center transition-all duration-700 pointer-events-none select-none ${
        isFadingOut ? 'opacity-0 scale-105 filter blur-sm' : 'opacity-100 scale-100'
      }`}
    >
      {/* Dynamic Background Aura */}
      <div className="absolute w-96 h-96 bg-brand-gold/15 rounded-full filter blur-[100px] animate-pulse" />

      <div className="relative z-10 flex flex-col items-center justify-center space-y-6 text-center">
        {/* Animated Official Logo Frame */}
        <div className="relative w-40 h-40 sm:w-56 sm:h-56 rounded-full overflow-hidden border-2 border-brand-gold/60 p-1 shadow-[0_0_50px_rgba(212,175,55,0.35)] animate-fade-in">
          <img
            src="/logo.png"
            alt="BLACK ISLAND Identity"
            className="w-full h-full object-cover rounded-full transform hover:scale-105 transition-transform duration-1000"
          />

          {/* Shimmer Light Pass Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
        </div>

        <div className="space-y-1.5 animate-slide-up">
          <h1 className="font-display font-black text-2xl sm:text-4xl tracking-[0.3em] text-white uppercase">
            BLACK ISLAND
          </h1>
          <p className="font-mono text-xs text-brand-gold tracking-[0.4em] uppercase">
            PREMIUM STREETWEAR • DAMASCUS
          </p>
        </div>
      </div>
    </div>
  );
}
