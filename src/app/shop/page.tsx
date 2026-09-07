import { prisma } from '@/lib/prisma';
import { ensureSeeded, INITIAL_PRODUCTS, INITIAL_CATEGORIES } from '@/lib/autoSeed';
import { ShopClientPage } from './ShopClientPage';

export const revalidate = 0; // Dynamic real-time loading

export default async function ShopPage() {
  let dbProds: any[] = [];
  let dbCats: any[] = [];

  try {
    await ensureSeeded(prisma);
    dbProds = await prisma.product.findMany({
      where: { isActive: true },
      include: {
        images: true,
        variants: true,
        category: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    dbCats = await prisma.category.findMany({
      where: { isHidden: false },
      orderBy: { order: 'asc' },
    });
  } catch (err) {
    console.error('Error loading shop catalog', err);
  }

  const initialProdMap = new Map(INITIAL_PRODUCTS.map((p) => [p.id, p]));
  const dbProdMap = new Map((dbProds || []).map((p) => [p.id, p]));
  const products = Array.from(new Map([...initialProdMap, ...dbProdMap]).values());

  const initialCatMap = new Map(INITIAL_CATEGORIES.map((c) => [c.id, c]));
  const dbCatMap = new Map((dbCats || []).map((c) => [c.id, c]));
  const categories = Array.from(new Map([...initialCatMap, ...dbCatMap]).values());

  return <ShopClientPage initialProducts={products} categories={categories} />;
}
