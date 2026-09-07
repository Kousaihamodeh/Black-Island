import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { productId } = body;

    if (!productId) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    const original = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        images: true,
        variants: true,
      },
    });

    if (!original) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const newSku = `${original.sku}-COPY-${randomSuffix}`;
    const newSlug = `${original.slug}-copy-${randomSuffix}`;

    const duplicated = await prisma.product.create({
      data: {
        slug: newSlug,
        nameEn: `${original.nameEn} (Copy)`,
        nameAr: `${original.nameAr} (نسخة)`,
        descEn: original.descEn,
        descAr: original.descAr,
        price: original.price,
        salePrice: original.salePrice,
        sku: newSku,
        categorySlug: original.categorySlug,
        featured: original.featured,
        isNew: true,
        isSale: original.isSale,
        images: {
          create: original.images.map((img) => ({
            url: img.url,
            isMain: img.isMain,
            order: img.order,
          })),
        },
        variants: {
          create: original.variants.map((v) => ({
            size: v.size,
            colorName: v.colorName,
            colorHex: v.colorHex,
            colorImage: v.colorImage,
            colorImages: v.colorImages,
            stock: v.stock,
          })),
        },
      },
      include: {
        images: true,
        variants: true,
      },
    });

    return NextResponse.json({ success: true, product: duplicated });
  } catch (error) {
    console.error('Duplicate product error:', error);
    return NextResponse.json({ error: 'Failed to duplicate product' }, { status: 500 });
  }
}
