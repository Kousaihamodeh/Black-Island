import { prisma } from '@/lib/prisma';
import { ensureSeeded, INITIAL_PRODUCTS } from '@/lib/autoSeed';
import { notFound } from 'next/navigation';
import { ProductDetailClient } from './ProductDetailClient';

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;

  let product: any = null;
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

    if (product) {
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
    }
  } catch (err) {
    console.error('Error loading product page', err);
  }

  // Fallback for Vercel Serverless
  if (!product) {
    product = INITIAL_PRODUCTS.find((p) => p.slug === slug) || INITIAL_PRODUCTS[0];
    relatedProducts = INITIAL_PRODUCTS.filter((p) => p.id !== product?.id).slice(0, 4);
  }

  return <ProductDetailClient product={product} relatedProducts={relatedProducts} />;
}
