import { prisma } from '@/lib/prisma';
import { ensureSeeded, INITIAL_PRODUCTS, INITIAL_CATEGORIES } from '@/lib/autoSeed';
import { ShopClientPage } from './ShopClientPage';

export const revalidate = 0; // Dynamic real-time loading

export default async function ShopPage() {
  let products: any[] = INITIAL_PRODUCTS;
  let categories: any[] = INITIAL_CATEGORIES;

  try {
    await ensureSeeded(prisma);
    const dbProds = await prisma.product.findMany({
      where: { isActive: true },
      include: {
        images: true,
        variants: true,
        category: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    if (dbProds && dbProds.length > INITIAL_PRODUCTS.length) {
      products = dbProds;
    }

    const dbCats = await prisma.category.findMany({
      where: { isHidden: false },
      orderBy: { order: 'asc' },
    });
    if (dbCats && dbCats.length > INITIAL_CATEGORIES.length) {
      categories = dbCats;
    }
  } catch (err) {
    console.error('Error loading shop catalog', err);
  }

  return <ShopClientPage initialProducts={products} categories={categories} />;
}
