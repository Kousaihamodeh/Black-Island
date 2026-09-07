import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { productId, price, salePrice, variantId, variantStock } = body;

    if (!productId) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    if (variantId && variantStock !== undefined) {
      await prisma.productVariant.update({
        where: { id: variantId },
        data: { stock: parseInt(variantStock) },
      });
      return NextResponse.json({ success: true });
    }

    const dataToUpdate: any = {};
    if (price !== undefined) dataToUpdate.price = parseFloat(price);
    if (salePrice !== undefined) dataToUpdate.salePrice = salePrice ? parseFloat(salePrice) : null;

    const updated = await prisma.product.update({
      where: { id: productId },
      data: dataToUpdate,
      include: { variants: true, images: true },
    });

    return NextResponse.json({ success: true, product: updated });
  } catch (error) {
    console.error('Quick update error:', error);
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}
