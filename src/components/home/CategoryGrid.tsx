import React from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { prisma } from '@/lib/prisma';

export const revalidate = 60;

export async function CategoryGrid() {
  let categories: any[] = [];
  try {
    categories = await prisma.category.findMany({
      where: { isHidden: false },
      orderBy: { order: 'asc' },
    });
  } catch (e) {
    console.error('Failed to load category grid', e);
  }

  if (categories.length === 0) return null;

  return (
    <section className="py-12 sm:py-20 bg-brand-950 text-white border-t border-brand-850 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-12">
          <div>
            <span className="text-xs font-mono text-brand-gold uppercase tracking-[0.2em]">CATEGORIES</span>
            <h2 className="text-2xl sm:text-4xl font-display font-bold uppercase text-white mt-1">
              EXPLORE COLLECTIONS
            </h2>
          </div>
          <Link
            href="/shop"
            className="text-xs font-mono text-gray-400 hover:text-white uppercase tracking-widest flex items-center gap-1 mt-3 md:mt-0 underline"
          >
            <span>VIEW ALL</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        {/* 2 columns on mobile, 3 columns on desktop */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/category/${cat.slug}`}
              className="group relative rounded-xl sm:rounded-2xl overflow-hidden border border-brand-800 hover:border-brand-gold transition-all duration-500 aspect-[4/3] bg-brand-900"
            >
              <img
                src={cat.image}
                alt={cat.nameEn}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

              <div className="absolute bottom-3 left-3 right-3 sm:bottom-6 sm:left-6 sm:right-6 flex items-end justify-between z-10">
                <div>
                  <h3 className="text-sm sm:text-2xl font-bold uppercase text-white group-hover:text-amber-200 transition-colors line-clamp-1">
                    {cat.nameEn}
                  </h3>
                  <span className="text-[10px] sm:text-xs font-mono text-brand-gold block">{cat.nameAr}</span>
                </div>
                <div className="w-7 h-7 sm:w-10 sm:h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white group-hover:bg-white group-hover:text-black transition-all shrink-0">
                  <ArrowUpRight className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
