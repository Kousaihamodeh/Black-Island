import { prisma } from '@/lib/prisma';
import { ShopClientPage } from './ShopClientPage';

export const revalidate = 0; // Dynamic real-time loading

export default async function ShopPage() {
  let products: any[] = [];
  let categories: any[] = [];

  try {
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

  return <ShopClientPage initialProducts={products} categories={categories} />;
}
