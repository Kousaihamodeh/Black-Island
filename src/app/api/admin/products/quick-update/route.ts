import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { setProductOverride } from '@/lib/runtimeStore';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { productId, price, salePrice, variantId, variantStock } = body;

    if (!productId) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    if (variantId && variantStock !== undefined) {
      try {
        await prisma.productVariant.update({
          where: { id: variantId },
          data: { stock: parseInt(variantStock) },
        });
      } catch (e) {}
      return NextResponse.json({ success: true });
    }

    const dataToUpdate: any = {};
    if (price !== undefined) dataToUpdate.price = parseFloat(price);
    if (salePrice !== undefined) dataToUpdate.salePrice = salePrice ? parseFloat(salePrice) : null;

    let updated: any = null;
    try {
      updated = await prisma.product.update({
        where: { id: productId },
        data: dataToUpdate,
        include: { variants: true, images: true },
      });
    } catch (dbErr) {
      console.warn('DB write skipped in quick-update:', dbErr);
    }

    if (updated) {
      setProductOverride(updated);
    }

    return NextResponse.json({ success: true, product: updated });
  } catch (error: any) {
    console.error('Quick update error:', error);
    return NextResponse.json({ error: error?.message || 'Failed to update product' }, { status: 500 });
  }
}
