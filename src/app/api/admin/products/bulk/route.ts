import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { setProductOverride, markProductDeleted, syncFromCloud, productOverrides } from '@/lib/runtimeStore';
import { INITIAL_PRODUCTS } from '@/lib/autoSeed';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function POST(request: Request) {
  try {
    await syncFromCloud();
    const body = await request.json();
    const { action, productIds, payload } = body;

    if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
      return NextResponse.json({ error: 'No products selected' }, { status: 400 });
    }

    if (action === 'delete') {
      for (const id of productIds) {
        markProductDeleted(id);
      }
      try {
        await prisma.product.deleteMany({
          where: { id: { in: productIds } },
        });
      } catch (e) {}
      return NextResponse.json({ success: true });
    }

    // Fetch existing product records from runtimeOverrides, DB, or Initial catalog
    const allProductsMap = new Map<string, any>();
    for (const p of INITIAL_PRODUCTS) allProductsMap.set(p.id, p);

    try {
      const dbProducts = await prisma.product.findMany({
        where: { id: { in: productIds } },
        include: { images: true, variants: true },
      });
      for (const p of dbProducts) allProductsMap.set(p.id, p);
    } catch (e) {}

    for (const [id, overrideP] of productOverrides.entries()) {
      allProductsMap.set(id, overrideP);
    }

    if (action === 'changeCategory' && payload?.categorySlug) {
      for (const id of productIds) {
        const prod = allProductsMap.get(id);
        if (prod) {
          const updated = { ...prod, categorySlug: payload.categorySlug };
          setProductOverride(updated);
        }
      }
      try {
        await prisma.product.updateMany({
          where: { id: { in: productIds } },
          data: { categorySlug: payload.categorySlug },
        });
      } catch (e) {}
      return NextResponse.json({ success: true });
    }

    if (action === 'markSale') {
      const isSale = !!payload?.isSale;
      for (const id of productIds) {
        const prod = allProductsMap.get(id);
        if (prod) {
          const updated = { ...prod, isSale };
          setProductOverride(updated);
        }
      }
      try {
        await prisma.product.updateMany({
          where: { id: { in: productIds } },
          data: { isSale },
        });
      } catch (e) {}
      return NextResponse.json({ success: true });
    }

    if (action === 'markNew') {
      const isNew = !!payload?.isNew;
      for (const id of productIds) {
        const prod = allProductsMap.get(id);
        if (prod) {
          const updated = { ...prod, isNew };
          setProductOverride(updated);
        }
      }
      try {
        await prisma.product.updateMany({
          where: { id: { in: productIds } },
          data: { isNew },
        });
      } catch (e) {}
      return NextResponse.json({ success: true });
    }

    if (action === 'adjustPrice' && payload?.percent) {
      const multiplier = 1 + parseFloat(payload.percent) / 100;
      for (const id of productIds) {
        const prod = allProductsMap.get(id);
        if (prod) {
          const newPrice = Math.round(prod.price * multiplier);
          const newSalePrice = prod.salePrice ? Math.round(prod.salePrice * multiplier) : null;
          const updated = { ...prod, price: newPrice, salePrice: newSalePrice };
          setProductOverride(updated);

          try {
            await prisma.product.update({
              where: { id },
              data: { price: newPrice, salePrice: newSalePrice },
            });
          } catch (e) {}
        }
      }
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Invalid bulk action' }, { status: 400 });
  } catch (error) {
    console.error('Bulk products error:', error);
    return NextResponse.json({ error: 'Failed to execute bulk action' }, { status: 500 });
  }
}
