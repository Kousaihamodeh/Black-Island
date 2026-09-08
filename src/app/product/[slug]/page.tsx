import { prisma } from '@/lib/prisma';
import { ensureSeeded, INITIAL_PRODUCTS } from '@/lib/autoSeed';
import { applyOverrides, syncFromCloud, productOverrides } from '@/lib/runtimeStore';
import { ProductDetailClient } from './ProductDetailClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const normalizedSlug = decodeURIComponent(slug).toLowerCase().trim();

  let dbProds: any[] = [];
  try {
    await syncFromCloud();
    await ensureSeeded(prisma);
    dbProds = await prisma.product.findMany({
      include: {
        images: { orderBy: { order: 'asc' } },
        variants: true,
        category: true,
      },
    });
  } catch (err) {
    console.error('Error loading product page', err);
  }

  const initialProdMap = new Map(INITIAL_PRODUCTS.map((p) => [p.id, p]));
  const dbProdMap = new Map((dbProds || []).map((p) => [p.id, p]));
  const rawProducts = Array.from(new Map([...initialProdMap, ...dbProdMap]).values());
  const allProducts = applyOverrides(rawProducts);

  let product = allProducts.find(
    (p) => (p?.slug ? p.slug.toLowerCase() === normalizedSlug : false) || p?.id === slug
  );

  if (!product) {
    product = allProducts[0] || INITIAL_PRODUCTS[0];
  }

  const relatedProducts = allProducts
    .filter((p) => p.id !== product?.id && p.categorySlug === product?.categorySlug)
    .slice(0, 4);

  return <ProductDetailClient product={product} relatedProducts={relatedProducts} />;
}
