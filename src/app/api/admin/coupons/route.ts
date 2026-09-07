import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const coupons = await prisma.coupon.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ coupons });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch coupons' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { code, type, value, minOrder, usageLimit, expiresAt, isActive } = body;

    if (!code || !value) {
      return NextResponse.json({ error: 'Coupon code and value are required' }, { status: 400 });
    }

    const coupon = await prisma.coupon.create({
      data: {
        code: code.toUpperCase().trim(),
        type: type || 'PERCENTAGE',
        value: parseFloat(value),
        minOrder: minOrder ? parseFloat(minOrder) : null,
        usageLimit: usageLimit ? parseInt(usageLimit) : null,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        isActive: isActive !== false,
      },
    });

    return NextResponse.json({ success: true, coupon });
  } catch (error) {
    console.error('Create coupon error:', error);
    return NextResponse.json({ error: 'Failed to create coupon' }, { status: 500 });
  }
}
