'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { translations, Language, Translations } from '@/lib/translations';

interface LanguageContextType {
  language: Language;
  dir: 'rtl' | 'ltr';
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    const saved = localStorage.getItem('black_island_lang') as Language;
    if (saved === 'ar' || saved === 'en') {
      setLanguageState(saved);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('black_island_lang', lang);
  };

  const toggleLanguage = () => {
    const newLang = language === 'en' ? 'ar' : 'en';
    setLanguage(newLang);
  };

  const dir = language === 'ar' ? 'rtl' : 'ltr';
  const t = translations[language];

  useEffect(() => {
    document.documentElement.dir = dir;
    document.documentElement.lang = language;
    if (language === 'ar') {
      document.documentElement.classList.add('font-arabic');
      document.documentElement.classList.remove('font-sans');
    } else {
      document.documentElement.classList.add('font-sans');
      document.documentElement.classList.remove('font-arabic');
    }
  }, [language, dir]);

  return (
    <LanguageContext.Provider value={{ language, dir, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
