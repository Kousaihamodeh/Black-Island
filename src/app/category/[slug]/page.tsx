import { prisma } from '@/lib/prisma';
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
    const normalizedSlug = decodeURIComponent(slug).toLowerCase().trim();

    // Match category by slug or normalized slug
    currentCategory = await prisma.category.findFirst({
      where: {
        OR: [
          { slug: normalizedSlug },
          { slug: slug },
        ],
      },
    });

    if (!currentCategory) {
      notFound();
    }

    // Fetch all active products so full client filtering and sidebar switching work seamlessly
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

  return (
    <ShopClientPage
      initialProducts={allProducts}
      initialCategory={currentCategory ? currentCategory.slug : slug}
      categories={categories}
    />
  );
}
