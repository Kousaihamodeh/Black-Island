import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { titleEn, titleAr, subtitleEn, subtitleAr, imageUrl, buttonTextEn, buttonTextAr, link, order, isActive } = body;

    const banner = await prisma.banner.update({
      where: { id },
      data: {
        titleEn,
        titleAr,
        subtitleEn,
        subtitleAr,
        imageUrl,
        buttonTextEn,
        buttonTextAr,
        link,
        order: parseInt(order || 0),
        isActive: !!isActive,
      },
    });

    return NextResponse.json({ success: true, banner });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update banner' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.banner.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete banner' }, { status: 500 });
  }
}
