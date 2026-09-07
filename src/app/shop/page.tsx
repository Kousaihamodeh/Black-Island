import { prisma } from '@/lib/prisma';
import { ensureSeeded, INITIAL_PRODUCTS, INITIAL_CATEGORIES } from '@/lib/autoSeed';
import { ShopClientPage } from './ShopClientPage';

export const revalidate = 0; // Dynamic real-time loading

export default async function ShopPage() {
  let products: any[] = [];
  let categories: any[] = [];

  try {
    await ensureSeeded(prisma);
    products = await prisma.product.findMany({
      where: { isActive: true },
      include: {
        images: true,
        variants: true,
        category: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    categories = await prisma.category.findMany({
      where: { isHidden: false },
      orderBy: { order: 'asc' },
    });
  } catch (err) {
    console.error('Error loading shop catalog', err);
  }

  // Combine DB products & categories with INITIAL_PRODUCTS (ensuring zero data loss on Vercel)
  const dbProdIds = new Set((products || []).map((p) => p.id));
  const extraProducts = INITIAL_PRODUCTS.filter((p) => !dbProdIds.has(p.id));
  const allProducts = [...(products || []), ...extraProducts];

  const dbCatIds = new Set((categories || []).map((c) => c.id));
  const extraCategories = INITIAL_CATEGORIES.filter((c) => !dbCatIds.has(c.id));
  const allCategories = [...(categories || []), ...extraCategories];

  return <ShopClientPage initialProducts={allProducts} categories={allCategories} />;
}
