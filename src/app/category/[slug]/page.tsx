import { prisma } from '@/lib/prisma';
import { ensureSeeded, INITIAL_PRODUCTS, INITIAL_CATEGORIES } from '@/lib/autoSeed';
import { notFound } from 'next/navigation';
import { ShopClientPage } from '@/app/shop/ShopClientPage';

export const revalidate = 0; // Dynamic real-time loading

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;

  let allProducts: any[] = INITIAL_PRODUCTS;
  let categories: any[] = INITIAL_CATEGORIES;
  let currentCategory = null;

  try {
    await ensureSeeded(prisma);
    const normalizedSlug = decodeURIComponent(slug).toLowerCase().trim();

    currentCategory = await prisma.category.findFirst({
      where: {
        OR: [
          { slug: normalizedSlug },
          { slug: slug },
        ],
      },
    });

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
      allProducts = dbProds;
    }

    const dbCats = await prisma.category.findMany({
      where: { isHidden: false },
      orderBy: { order: 'asc' },
    });
    if (dbCats && dbCats.length > INITIAL_CATEGORIES.length) {
      categories = dbCats;
    }
  } catch (err) {
    console.error('Error fetching category', err);
  }

  return (
    <ShopClientPage
      initialProducts={allProducts}
      initialCategory={currentCategory ? currentCategory.slug : slug}
      categories={categories}
    />
  );
}
