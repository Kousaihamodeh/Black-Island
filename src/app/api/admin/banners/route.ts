import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const banners = await prisma.banner.findMany({
      orderBy: { order: 'asc' },
    });
    return NextResponse.json({ banners });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch banners' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { titleEn, titleAr, subtitleEn, subtitleAr, imageUrl, buttonTextEn, buttonTextAr, link, order, isActive } = body;

    if (!titleEn || !titleAr || !imageUrl) {
      return NextResponse.json({ error: 'Banner titles and image are required' }, { status: 400 });
    }

    const banner = await prisma.banner.create({
      data: {
        titleEn,
        titleAr,
        subtitleEn: subtitleEn || null,
        subtitleAr: subtitleAr || null,
        imageUrl,
        buttonTextEn: buttonTextEn || 'SHOP NOW',
        buttonTextAr: buttonTextAr || 'تسوق الآن',
        link: link || '/shop',
        order: parseInt(order || 0),
        isActive: isActive !== false,
      },
    });

    return NextResponse.json({ success: true, banner });
  } catch (error) {
    console.error('Create banner error:', error);
    return NextResponse.json({ error: 'Failed to create banner' }, { status: 500 });
  }
}
