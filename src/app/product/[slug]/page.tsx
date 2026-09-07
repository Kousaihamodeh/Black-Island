import { prisma } from '@/lib/prisma';
import { ensureSeeded } from '@/lib/autoSeed';
import { notFound } from 'next/navigation';
import { ProductDetailClient } from './ProductDetailClient';

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;

  let product = null;
  let relatedProducts: any[] = [];

  try {
    await ensureSeeded(prisma);
    product = await prisma.product.findUnique({
      where: { slug },
      include: {
        images: { orderBy: { order: 'asc' } },
        variants: true,
        category: true,
      },
    });

    if (!product) {
      notFound();
    }

    relatedProducts = await prisma.product.findMany({
      where: {
        categorySlug: product.categorySlug,
        id: { not: product.id },
      },
      include: {
        images: true,
        variants: true,
      },
      take: 4,
    });
  } catch (err) {
    console.error('Error loading product page', err);
  }

  return <ProductDetailClient product={product} relatedProducts={relatedProducts} />;
}
