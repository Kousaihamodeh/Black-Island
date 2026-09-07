import { prisma } from '@/lib/prisma';
import { ensureSeeded, INITIAL_PRODUCTS } from '@/lib/autoSeed';
import { notFound } from 'next/navigation';
import { ProductDetailClient } from './ProductDetailClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;

  let product: any = null;
  let relatedProducts: any[] = [];

  try {
    await ensureSeeded(prisma);
    const normalizedSlug = decodeURIComponent(slug).toLowerCase().trim();

    product = await prisma.product.findFirst({
      where: {
        OR: [
          { slug: normalizedSlug },
          { slug },
          { id: slug },
        ],
      },
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
          isActive: true,
        },
        include: {
          images: { orderBy: { order: 'asc' } },
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
    const normalizedSlug = decodeURIComponent(slug).toLowerCase().trim();
    product =
      INITIAL_PRODUCTS.find(
        (p) => p.slug.toLowerCase() === normalizedSlug || p.id === slug
      ) || INITIAL_PRODUCTS[0];
    relatedProducts = INITIAL_PRODUCTS.filter((p) => p.id !== product?.id).slice(0, 4);
  }

  return <ProductDetailClient product={product} relatedProducts={relatedProducts} />;
}

