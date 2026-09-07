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

  let allProducts: any[] = [];
  let categories: any[] = [];
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

    allProducts = await prisma.product.findMany({
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
    console.error('Error fetching category', err);
  }

  // Fallbacks
  if (!allProducts || allProducts.length === 0) {
    allProducts = INITIAL_PRODUCTS;
  }
  if (!categories || categories.length === 0) {
    categories = INITIAL_CATEGORIES;
  }

  return (
    <ShopClientPage
      initialProducts={allProducts}
      initialCategory={currentCategory ? currentCategory.slug : slug}
      categories={categories}
    />
  );
}
