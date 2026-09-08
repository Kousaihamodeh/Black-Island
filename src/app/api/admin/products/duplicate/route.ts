import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { setProductOverride, syncFromCloud, productOverrides } from '@/lib/runtimeStore';
import { INITIAL_PRODUCTS } from '@/lib/autoSeed';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function POST(request: Request) {
  try {
    await syncFromCloud();
    const body = await request.json();
    const { productId } = body;

    if (!productId) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    let original: any = productOverrides.get(productId);
    if (!original) {
      try {
        original = await prisma.product.findUnique({
          where: { id: productId },
          include: { images: true, variants: true },
        });
      } catch (e) {}
    }
    if (!original) {
      original = INITIAL_PRODUCTS.find((p) => p.id === productId);
    }

    if (!original) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const newId = `prod-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const newSku = `${original.sku || 'SKU'}-COPY-${randomSuffix}`;
    const newSlug = `${original.slug || 'prod'}-copy-${randomSuffix}`;

    const duplicatedProduct = {
      ...JSON.parse(JSON.stringify(original)),
      id: newId,
      slug: newSlug,
      nameEn: `${original.nameEn || 'Product'} (Copy)`,
      nameAr: `${original.nameAr || 'منتج'} (نسخة)`,
      sku: newSku,
      isNew: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setProductOverride(duplicatedProduct);

    try {
      await prisma.product.create({
        data: {
          id: newId,
          slug: newSlug,
          nameEn: duplicatedProduct.nameEn,
          nameAr: duplicatedProduct.nameAr,
          descEn: original.descEn || '',
          descAr: original.descAr || '',
          price: original.price,
          salePrice: original.salePrice,
          sku: newSku,
          categorySlug: original.categorySlug,
          featured: original.featured || false,
          isNew: true,
          isSale: original.isSale || false,
          images: {
            create: (original.images || []).map((img: any, idx: number) => ({
              url: img.url,
              isMain: img.isMain ?? (idx === 0),
              order: img.order ?? idx,
            })),
          },
          variants: {
            create: (original.variants || []).map((v: any) => ({
              size: v.size,
              colorName: v.colorName,
              colorHex: v.colorHex || '#000000',
              colorImage: v.colorImage || null,
              colorImages: v.colorImages || '',
              stock: v.stock || 0,
            })),
          },
        },
      });
    } catch (e) {
      console.warn('Prisma duplicate skipped on read-only disk:', e);
    }

    return NextResponse.json({ success: true, product: duplicatedProduct });
  } catch (error) {
    console.error('Duplicate product error:', error);
    return NextResponse.json({ error: 'Failed to duplicate product' }, { status: 500 });
  }
}
