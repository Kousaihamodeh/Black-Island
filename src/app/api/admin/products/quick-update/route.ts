import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { setProductOverride, syncFromCloud, productOverrides } from '@/lib/runtimeStore';
import { INITIAL_PRODUCTS } from '@/lib/autoSeed';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function PUT(request: Request) {
  try {
    await syncFromCloud();
    const body = await request.json();
    const { productId, price, salePrice, variantId, variantStock } = body;

    if (!productId) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    // Find existing product from overrides, DB, or initial catalog
    let existing: any = productOverrides.get(productId);
    if (!existing) {
      try {
        existing = await prisma.product.findUnique({
          where: { id: productId },
          include: { variants: true, images: true },
        });
      } catch (e) {}
    }
    if (!existing) {
      existing = INITIAL_PRODUCTS.find((p) => p.id === productId);
    }

    if (!existing) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const updatedProduct = JSON.parse(JSON.stringify(existing));

    if (variantId && variantStock !== undefined) {
      const stockNum = parseInt(variantStock);
      if (Array.isArray(updatedProduct.variants)) {
        updatedProduct.variants = updatedProduct.variants.map((v: any) =>
          v.id === variantId ? { ...v, stock: stockNum } : v
        );
      }
      try {
        await prisma.productVariant.update({
          where: { id: variantId },
          data: { stock: stockNum },
        });
      } catch (e) {}

      setProductOverride(updatedProduct);
      return NextResponse.json({ success: true, product: updatedProduct });
    }

    if (price !== undefined) {
      updatedProduct.price = parseFloat(price);
    }
    if (salePrice !== undefined) {
      updatedProduct.salePrice = salePrice ? parseFloat(salePrice) : null;
      updatedProduct.isSale = !!updatedProduct.salePrice;
    }

    setProductOverride(updatedProduct);

    try {
      const dataToUpdate: any = {};
      if (price !== undefined) dataToUpdate.price = parseFloat(price);
      if (salePrice !== undefined) dataToUpdate.salePrice = salePrice ? parseFloat(salePrice) : null;

      await prisma.product.update({
        where: { id: productId },
        data: dataToUpdate,
      });
    } catch (dbErr) {
      console.warn('DB write skipped in quick-update:', dbErr);
    }

    return NextResponse.json({ success: true, product: updatedProduct });
  } catch (error: any) {
    console.error('Quick update error:', error);
    return NextResponse.json({ error: error?.message || 'Failed to update product' }, { status: 500 });
  }
}
