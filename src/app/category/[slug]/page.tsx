import { Suspense } from 'react';
import { prisma } from '@/lib/prisma';
import { ensureSeeded, INITIAL_PRODUCTS, INITIAL_CATEGORIES } from '@/lib/autoSeed';
import { ShopClientPage } from '@/app/shop/ShopClientPage';
import { applyOverrides, syncFromCloud } from '@/lib/runtimeStore';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

function getCanonicalSlug(str: string | null | undefined): string {
  if (!str) return '';
  const norm = str.toLowerCase().trim().replace(/[^a-z0-9]/g, '');
  if (norm.includes('hoodie') || norm.includes('sweat')) return 'hoodies';
  if (norm.includes('tshirt') || norm.includes('tee') || norm.includes('oversized')) return 'tshirts';
  if (norm.includes('pant') || norm.includes('cargo') || norm.includes('jean') || norm.includes('trouser')) return 'pants';
  if (norm.includes('sneaker') || norm.includes('shoe') || norm.includes('footwear')) return 'sneakers';
  if (norm.includes('cap') || norm.includes('hat') || norm.includes('accessory')) return 'caps';
  if (norm.includes('short')) return 'shorts';
  return norm;
}

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;

  let allProducts: any[] = [];
  let categories: any[] = [];
  let currentCategory = null;

  try {
    await syncFromCloud();
    await ensureSeeded(prisma);
    const normalizedSlug = decodeURIComponent(slug).toLowerCase().trim();

    currentCategory = await prisma.category.findFirst({
      where: {
        OR: [{ slug: normalizedSlug }, { slug }],
      },
    });

    const dbProds = await prisma.product.findMany({
      where: { isActive: true },
      include: {
        images: { orderBy: { order: 'asc' } },
        variants: true,
        category: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    const dbCats = await prisma.category.findMany({
      where: { isHidden: false },
      orderBy: { order: 'asc' },
    });

    const initialProdMap = new Map<string, any>(INITIAL_PRODUCTS.map((p: any) => [p.id, p]));
    const dbProdMap = new Map<string, any>((dbProds || []).map((p: any) => [p.id, p]));
    const rawProducts = Array.from(new Map<string, any>([...initialProdMap, ...dbProdMap]).values());
    allProducts = applyOverrides(rawProducts);

    const initialCatMap = new Map<string, any>(INITIAL_CATEGORIES.map((c: any) => [c.id, c]));
    const dbCatMap = new Map<string, any>((dbCats || []).map((c: any) => [c.id, c]));
    categories = Array.from(new Map<string, any>([...initialCatMap, ...dbCatMap]).values());

    const targetCanonical = getCanonicalSlug(normalizedSlug);
    const matchedCat = currentCategory || categories.find((c) => c && getCanonicalSlug(c.slug) === targetCanonical);
    const initialCatSlug = matchedCat ? matchedCat.slug : slug;

    return (
      <Suspense fallback={<div className="min-h-screen bg-black text-white p-8 text-center">Loading Category...</div>}>
        <ShopClientPage
          initialProducts={allProducts}
          initialCategory={initialCatSlug}
          categories={categories}
        />
      </Suspense>
    );
  } catch (err) {
    console.error('Error fetching category', err);
    allProducts = applyOverrides(INITIAL_PRODUCTS);
    categories = INITIAL_CATEGORIES;
    return (
      <Suspense fallback={<div className="min-h-screen bg-black text-white p-8 text-center">Loading Category...</div>}>
        <ShopClientPage
          initialProducts={allProducts}
          initialCategory={slug}
          categories={categories}
        />
      </Suspense>
    );
  }
}
