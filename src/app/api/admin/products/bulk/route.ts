import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, productIds, payload } = body;

    if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
      return NextResponse.json({ error: 'No products selected' }, { status: 400 });
    }

    if (action === 'delete') {
      await prisma.product.deleteMany({
        where: { id: { in: productIds } },
      });
      return NextResponse.json({ success: true });
    }

    if (action === 'changeCategory' && payload?.categorySlug) {
      await prisma.product.updateMany({
        where: { id: { in: productIds } },
        data: { categorySlug: payload.categorySlug },
      });
      return NextResponse.json({ success: true });
    }

    if (action === 'markSale') {
      await prisma.product.updateMany({
        where: { id: { in: productIds } },
        data: { isSale: !!payload?.isSale },
      });
      return NextResponse.json({ success: true });
    }

    if (action === 'markNew') {
      await prisma.product.updateMany({
        where: { id: { in: productIds } },
        data: { isNew: !!payload?.isNew },
      });
      return NextResponse.json({ success: true });
    }

    if (action === 'adjustPrice' && payload?.percent) {
      const multiplier = 1 + parseFloat(payload.percent) / 100;
      const products = await prisma.product.findMany({
        where: { id: { in: productIds } },
      });

      for (const p of products) {
        const newPrice = Math.round(p.price * multiplier);
        const newSalePrice = p.salePrice ? Math.round(p.salePrice * multiplier) : null;
        await prisma.product.update({
          where: { id: p.id },
          data: { price: newPrice, salePrice: newSalePrice },
        });
      }
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Invalid bulk action' }, { status: 400 });
  } catch (error) {
    console.error('Bulk products error:', error);
    return NextResponse.json({ error: 'Failed to execute bulk action' }, { status: 500 });
  }
}
