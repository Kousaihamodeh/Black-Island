import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { code, type, value, minOrder, usageLimit, expiresAt, isActive } = body;

    const coupon = await prisma.coupon.update({
      where: { id },
      data: {
        code: code.toUpperCase().trim(),
        type,
        value: parseFloat(value),
        minOrder: minOrder ? parseFloat(minOrder) : null,
        usageLimit: usageLimit ? parseInt(usageLimit) : null,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        isActive: !!isActive,
      },
    });

    return NextResponse.json({ success: true, coupon });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update coupon' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.coupon.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete coupon' }, { status: 500 });
  }
}
