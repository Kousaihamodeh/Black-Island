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

  // Combine DB products & categories with INITIAL_PRODUCTS
  const dbProdIds = new Set((allProducts || []).map((p) => p.id));
  const extraProducts = INITIAL_PRODUCTS.filter((p) => !dbProdIds.has(p.id));
  const combinedProducts = [...(allProducts || []), ...extraProducts];

  const dbCatIds = new Set((categories || []).map((c) => c.id));
  const extraCategories = INITIAL_CATEGORIES.filter((c) => !dbCatIds.has(c.id));
  const combinedCategories = [...(categories || []), ...extraCategories];

  return (
    <ShopClientPage
      initialProducts={combinedProducts}
      initialCategory={currentCategory ? currentCategory.slug : slug}
      categories={combinedCategories}
    />
  );
}
