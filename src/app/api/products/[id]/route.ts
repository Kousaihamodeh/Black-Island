import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { setProductOverride, markProductDeleted, syncFromCloud, productOverrides } from '@/lib/runtimeStore';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await syncFromCloud();
    const { id } = await params;

    // Check runtime overrides first
    if (productOverrides.has(id)) {
      return NextResponse.json({ product: productOverrides.get(id) });
    }

    let product: any = await prisma.product.findFirst({
      where: {
        OR: [{ id }, { slug: id }],
      },
      include: {
        images: { orderBy: { order: 'asc' } },
        variants: true,
        category: true,
      },
    });

    if (!product) {
      const { INITIAL_PRODUCTS } = await import('@/lib/autoSeed');
      product = INITIAL_PRODUCTS.find((p) => p.id === id || p.slug === id);
    }

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ product });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const {
      nameEn,
      nameAr,
      descEn,
      descAr,
      price,
      salePrice,
      sku,
      categorySlug,
      featured,
      isNew,
      isSale,
      isActive,
      images,
      variants,
    } = body;

    const formattedImages = (images || []).map((imgUrl: string, idx: number) => ({
      id: `img-${Date.now()}-${idx}`,
      productId: id,
      url: imgUrl,
      isMain: idx === 0,
      order: idx,
    }));

    const formattedVariants = (variants || []).map((v: any, idx: number) => ({
      id: `var-${Date.now()}-${idx}`,
      productId: id,
      size: v.size,
      colorName: v.colorName,
      colorHex: v.colorHex || '#000000',
      colorImage: v.colorImage || (Array.isArray(v.colorImages) ? v.colorImages[0] : null),
      colorImages: Array.isArray(v.colorImages) ? v.colorImages.join(',') : (v.colorImages || v.colorImage || ''),
      stock: parseInt(v.stock || 0),
    }));

    const updatedObject = {
      id,
      slug: (nameEn || 'product')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, ''),
      nameEn,
      nameAr,
      descEn: descEn || '',
      descAr: descAr || '',
      price: parseFloat(price),
      salePrice: salePrice ? parseFloat(salePrice) : null,
      sku,
      categorySlug,
      featured: !!featured,
      isNew: !!isNew,
      isSale: !!isSale,
      isActive: isActive !== undefined ? !!isActive : true,
      images: formattedImages,
      variants: formattedVariants,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const { INITIAL_PRODUCTS } = await import('@/lib/autoSeed');
    const initIdx = INITIAL_PRODUCTS.findIndex((p) => p.id === id);
    if (initIdx !== -1) {
      INITIAL_PRODUCTS[initIdx] = { ...INITIAL_PRODUCTS[initIdx], ...updatedObject };
    }
    await setProductOverride(updatedObject);

    // Attempt Prisma update (may throw if SQLite disk is read-only on Vercel Lambdas)
    try {
      await prisma.productImage.deleteMany({ where: { productId: id } });
      await prisma.productVariant.deleteMany({ where: { productId: id } });

      await prisma.product.update({
        where: { id },
        data: {
          nameEn,
          nameAr,
          descEn,
          descAr,
          price: parseFloat(price),
          salePrice: salePrice ? parseFloat(salePrice) : null,
          sku,
          categorySlug,
          featured: !!featured,
          isNew: !!isNew,
          isSale: !!isSale,
          isActive: isActive !== undefined ? !!isActive : true,
          images: {
            create: (images || []).map((imgUrl: string, idx: number) => ({
              url: imgUrl,
              isMain: idx === 0,
              order: idx,
            })),
          },
          variants: {
            create: (variants || []).map((v: any) => ({
              size: v.size,
              colorName: v.colorName,
              colorHex: v.colorHex || '#000000',
              colorImage: v.colorImage || (Array.isArray(v.colorImages) ? v.colorImages[0] : null),
              colorImages: Array.isArray(v.colorImages) ? v.colorImages.join(',') : (v.colorImages || v.colorImage || ''),
              stock: parseInt(v.stock || 0),
            })),
          },
        },
      });
    } catch (dbErr) {
      console.warn('Prisma DB write skipped or read-only (handled by runtime override):', dbErr);
    }

    try {
      revalidatePath('/');
      revalidatePath('/shop');
      revalidatePath(`/category/${categorySlug}`);
      revalidatePath(`/product/${updatedObject.slug}`);
    } catch (e) {}

    return NextResponse.json({ success: true, product: updatedObject });
  } catch (error: any) {
    console.error('Update product error:', error);
    return NextResponse.json({ error: error?.message || 'Failed to update product' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await markProductDeleted(id);

    try {
      await prisma.product.delete({ where: { id } });
    } catch (e) {}

    try {
      revalidatePath('/');
      revalidatePath('/shop');
    } catch (e) {}

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}

