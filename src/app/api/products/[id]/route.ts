import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const product = await prisma.product.findFirst({
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

    // Delete existing images & variants then re-create
    await prisma.productImage.deleteMany({ where: { productId: id } });
    await prisma.productVariant.deleteMany({ where: { productId: id } });

    const updated = await prisma.product.update({
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
      include: {
        images: true,
        variants: true,
        category: true,
      },
    });

    try {
      revalidatePath('/');
      revalidatePath('/shop');
      revalidatePath(`/category/${categorySlug}`);
      revalidatePath(`/product/${updated.slug}`);
    } catch (e) {}

    return NextResponse.json({ success: true, product: updated });
  } catch (error) {
    console.error('Update product error:', error);
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const product = await prisma.product.delete({ where: { id } });

    try {
      revalidatePath('/');
      revalidatePath('/shop');
      revalidatePath(`/category/${product.categorySlug}`);
    } catch (e) {}

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}
