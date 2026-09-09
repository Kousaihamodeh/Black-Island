'use client';

import React, { useState, useMemo, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Filter, SlidersHorizontal, Search, RotateCcw } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { ProductCard } from '@/components/shop/ProductCard';
import { Button } from '@/components/ui/Button';

interface ShopClientPageProps {
  products?: any[];
  initialProducts?: any[];
  categories: any[];
  initialCategory?: string;
  initialSearch?: string;
}

function normalizeSlug(str: string | null | undefined): string {
  if (!str) return '';
  return str.toLowerCase().trim().replace(/[^a-z0-9]/g, '');
}

const CATEGORY_CANONICAL_MAP: Record<string, string> = {
  hoodies: 'hoodies',
  sweatshirts: 'hoodies',
  hoodie: 'hoodies',
  sweatshirt: 'hoodies',
  'hoodies-sweatshirts': 'hoodies',
  'hoodiessweatshirts': 'hoodies',

  tshirts: 'tshirts',
  't-shirts': 'tshirts',
  tshirt: 'tshirts',
  't-shirt': 'tshirts',
  tees: 'tshirts',
  tee: 'tshirts',
  oversized: 'tshirts',
  'tshirts-oversized': 'tshirts',
  'tshirtsoversized': 'tshirts',

  pants: 'pants',
  cargo: 'pants',
  trousers: 'pants',
  jeans: 'pants',
  'pants-cargo': 'pants',
  'pantscargo': 'pants',

  sneakers: 'sneakers',
  shoes: 'sneakers',
  footwear: 'sneakers',
  'sneakers-shoes': 'sneakers',
  'sneakersshoes': 'sneakers',

  caps: 'caps',
  hats: 'caps',
  accessories: 'caps',
  'caps-accessories': 'caps',
  'capsaccessories': 'caps',
};

function getCanonicalSlug(input: string | null | undefined): string {
  const norm = normalizeSlug(input);
  return CATEGORY_CANONICAL_MAP[norm] || norm;
}

function SearchParamsSync({ onSync }: { onSync: (cat: string | null, search: string | null) => void }) {
  const searchParams = useSearchParams();
  useEffect(() => {
    const cat = searchParams.get('category');
    const search = searchParams.get('search');
    onSync(cat, search);
  }, [searchParams, onSync]);
  return null;
}

export function ShopClientPage({
  products,
  initialProducts,
  categories,
  initialCategory,
  initialSearch,
}: ShopClientPageProps) {
  const rawItemsList: any[] = products || initialProducts || [];
  const { language, t } = useLanguage();
  const [localOverrides, setLocalOverrides] = useState<Record<string, any>>({});

  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory || 'all');
  const [searchQuery, setSearchQuery] = useState<string>(initialSearch || '');

  const handleUrlParamSync = useCallback((cat: string | null, search: string | null) => {
    if (cat) setSelectedCategory(cat);
    if (search) setSearchQuery(search);
  }, []);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('bi_product_overrides') || '{}');
      setLocalOverrides(stored);
    } catch (e) {}
  }, []);

  const itemsList = useMemo(() => {
    const validRaw = (rawItemsList || []).filter((p) => p && p.id);
    if (!localOverrides || Object.keys(localOverrides).length === 0) {
      return validRaw;
    }
    const map = new Map<string, any>(validRaw.map((p) => [p.id, p]));
    Object.values(localOverrides).forEach((override: any) => {
      if (override && override.id) {
        map.set(override.id, override);
      }
    });
    return Array.from(map.values()).filter((p) => p && p.id);
  }, [rawItemsList, localOverrides]);

  const [selectedSize, setSelectedSize] = useState<string>('all');
  const [selectedColor, setSelectedColor] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('newest');
  const [onlySale, setOnlySale] = useState<boolean>(false);

  // Robust Normalized Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    return (itemsList || [])
      .filter((p: any) => {
        if (!p || !p.id) return false;
        // Category Filter with strict canonical slug comparison
        if (selectedCategory && selectedCategory !== 'all') {
          const selectedCanonical = getCanonicalSlug(selectedCategory);
          const prodCatSlugCanonical = getCanonicalSlug(p.categorySlug || p.category?.slug);

          let isMatch = selectedCanonical === prodCatSlugCanonical;

          if (!isMatch && p.category) {
            const catSlugCanonical = getCanonicalSlug(p.category.slug);
            const catNameEnCanonical = getCanonicalSlug(p.category.nameEn);
            isMatch =
              catSlugCanonical === selectedCanonical ||
              catNameEnCanonical === selectedCanonical;
          }

          if (!isMatch) return false;
        }

        // Sale Filter
        if (onlySale && !p.isSale) return false;

        // Search Query Filter
        if (searchQuery && searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchNameEn = p.nameEn ? p.nameEn.toLowerCase().includes(q) : false;
          const matchNameAr = p.nameAr ? p.nameAr.includes(q) : false;
          const matchSku = p.sku ? p.sku.toLowerCase().includes(q) : false;
          const matchCatEn = p.category?.nameEn ? p.category.nameEn.toLowerCase().includes(q) : false;
          const matchCatAr = p.category?.nameAr ? p.category.nameAr.includes(q) : false;

          if (!matchNameEn && !matchNameAr && !matchSku && !matchCatEn && !matchCatAr) {
            return false;
          }
        }

        // Size Filter
        if (selectedSize !== 'all') {
          const hasSize = Array.isArray(p.variants) && p.variants.some((v: any) => v && v.size === selectedSize);
          if (!hasSize) return false;
        }

        // Color Filter
        if (selectedColor !== 'all') {
          const hasColor = Array.isArray(p.variants) && p.variants.some(
            (v: any) => v && v.colorName && v.colorName.toLowerCase() === selectedColor.toLowerCase()
          );
          if (!hasColor) return false;
        }

        return true;
      })
      .sort((a: any, b: any) => {
        const priceA = a?.salePrice && a.salePrice > 0 ? a.salePrice : (a?.price || 0);
        const priceB = b?.salePrice && b.salePrice > 0 ? b.salePrice : (b?.price || 0);

        if (sortBy === 'price-low') return priceA - priceB;
        if (sortBy === 'price-high') return priceB - priceA;

        const timeA = a?.createdAt ? (new Date(a.createdAt).getTime() || 0) : 0;
        const timeB = b?.createdAt ? (new Date(b.createdAt).getTime() || 0) : 0;
        return timeB - timeA;
      });
  }, [itemsList, selectedCategory, searchQuery, selectedSize, selectedColor, sortBy, onlySale]);

  const sizesList = ['S', 'M', 'L', 'XL', 'XXL', '30', '31', '32', '33', '34', '35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45'];

  return (
    <div className="py-12 bg-black text-white min-h-screen font-sans">
      <Suspense fallback={null}>
        <SearchParamsSync onSync={handleUrlParamSync} />
      </Suspense>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header Title */}
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-brand-850 pb-6 gap-4">
          <div>
            <span className="text-xs font-mono text-brand-gold uppercase tracking-widest">BLACK ISLAND CATALOG</span>
            <h1 className="text-3xl sm:text-4xl font-display font-bold uppercase text-white mt-1">
              {selectedCategory === 'all'
                ? (t?.shop || 'Shop Catalog')
                : ((categories || []).find((c) => c && getCanonicalSlug(c.slug) === getCanonicalSlug(selectedCategory))?.[
                    language === 'ar' ? 'nameAr' : 'nameEn'
                  ] || selectedCategory)}
            </h1>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono text-gray-400">
            <span>{(t?.showingProducts || 'Showing {count} products').replace('{count}', String((filteredProducts || []).length))}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <div className="lg:col-span-1 space-y-6 bg-brand-950 p-6 rounded-2xl border border-brand-850 h-fit">
            <div className="flex items-center justify-between border-b border-brand-800 pb-4">
              <span className="font-display font-bold uppercase text-sm flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-brand-gold" /> Filter & Refine
              </span>

              {(selectedCategory !== 'all' ||
                searchQuery ||
                selectedSize !== 'all' ||
                selectedColor !== 'all' ||
                onlySale) && (
                <button
                  onClick={() => {
                    setSelectedCategory('all');
                    setSearchQuery('');
                    setSelectedSize('all');
                    setSelectedColor('all');
                    setOnlySale(false);
                  }}
                  className="text-[11px] font-mono text-brand-gold hover:underline flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" /> Reset
                </button>
              )}
            </div>

            {/* Search Input */}
            <div>
              <label className="block text-xs font-mono text-gray-400 mb-2">{language === 'ar' ? 'البحث' : 'Search'}</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t?.searchPlaceholder || 'Search...'}
                  className="w-full bg-brand-900 border border-brand-700 text-white text-xs pl-9 pr-3 py-2.5 rounded-xl focus:border-white focus:outline-none"
                />
              </div>
            </div>

            {/* Category Select */}
            <div>
              <label className="block text-xs font-mono text-gray-400 mb-2">{t?.allCategories || 'All Categories'}</label>
              <div className="space-y-1">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold uppercase transition-colors ${
                    selectedCategory === 'all' ? 'bg-brand-gold text-black font-bold' : 'text-gray-300 hover:bg-brand-900'
                  }`}
                >
                  {t?.allCategories || 'All Categories'} ({(itemsList || []).length})
                </button>

                {(categories || []).map((cat) => {
                  if (!cat || !cat.slug) return null;
                  const isMatch = getCanonicalSlug(selectedCategory) === getCanonicalSlug(cat.slug);
                  return (
                    <button
                      key={cat.slug}
                      onClick={() => setSelectedCategory(cat.slug)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs uppercase transition-colors flex justify-between items-center ${
                        isMatch
                          ? 'bg-brand-gold text-black font-bold'
                          : 'text-gray-300 hover:bg-brand-900'
                      }`}
                    >
                      <span>{language === 'ar' ? (cat.nameAr || cat.nameEn) : (cat.nameEn || cat.nameAr)}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Size Filter */}
            <div>
              <label className="block text-xs font-mono text-gray-400 mb-2">{language === 'ar' ? 'المقاس' : 'Size'}</label>
              <select
                value={selectedSize}
                onChange={(e) => setSelectedSize(e.target.value)}
                className="w-full bg-brand-900 border border-brand-700 text-white text-xs px-3 py-2.5 rounded-xl focus:outline-none"
              >
                <option value="all">All Sizes</option>
                {sizesList.map((sz) => (
                  <option key={sz} value={sz}>{sz}</option>
                ))}
              </select>
            </div>

            {/* Sort & Sale */}
            <div className="space-y-3 pt-4 border-t border-brand-800">
              <div>
                <label className="block text-xs font-mono text-gray-400 mb-2">{t?.sortBy || 'Sort By'}</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full bg-brand-900 border border-brand-700 text-white text-xs px-3 py-2.5 rounded-xl focus:outline-none"
                >
                  <option value="newest">{t?.sortNewest || 'Newest Arrival'}</option>
                  <option value="price-low">{t?.sortPriceLowHigh || 'Price: Low to High'}</option>
                  <option value="price-high">{t?.sortPriceHighLow || 'Price: High to Low'}</option>
                </select>
              </div>

              <label className="flex items-center gap-2 text-xs font-mono text-gray-300 cursor-pointer pt-2">
                <input
                  type="checkbox"
                  checked={onlySale}
                  onChange={(e) => setOnlySale(e.target.checked)}
                  className="accent-brand-gold w-4 h-4 rounded"
                />
                <span>{t?.onSaleOnly || 'On Sale Only'}</span>
              </label>
            </div>
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-16 bg-brand-950 border border-brand-850 rounded-2xl p-8 space-y-4">
                <Filter className="w-12 h-12 text-gray-600 mx-auto" />
                <h3 className="text-lg font-bold text-white uppercase">{t?.noProductsFound || 'No products found'}</h3>
                <p className="text-xs text-gray-400 max-w-sm mx-auto">{t?.noProductsFound || 'No items match your filter criteria.'}</p>
                <Button
                  variant="gold"
                  size="sm"
                  onClick={() => {
                    setSelectedCategory('all');
                    setSearchQuery('');
                    setSelectedSize('all');
                    setSelectedColor('all');
                    setOnlySale(false);
                  }}
                >
                  {t?.clearFilters || 'Clear Filters'}
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
