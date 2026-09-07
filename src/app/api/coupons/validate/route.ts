import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const subtotal = parseFloat(searchParams.get('subtotal') || '0');

  if (!code) {
    return NextResponse.json({ error: 'Code is required' }, { status: 400 });
  }

  try {
    const coupon = await prisma.coupon.findUnique({
      where: { code: code.toUpperCase() },
    });

    if (!coupon || !coupon.isActive) {
      return NextResponse.json({ error: 'Invalid or inactive promo code' }, { status: 404 });
    }

    if (coupon.minOrder && subtotal < coupon.minOrder) {
      return NextResponse.json(
        { error: `Minimum order of $${coupon.minOrder.toLocaleString()} required for this coupon` },
        { status: 400 }
      );
    }

    const discount =
      coupon.type === 'PERCENTAGE'
        ? Math.round((subtotal * coupon.value) / 100)
        : Math.min(coupon.value, subtotal);

    return NextResponse.json({ success: true, coupon, discount });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to validate coupon' }, { status: 500 });
  }
}
