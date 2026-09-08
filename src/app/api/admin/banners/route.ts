import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { applyBannerOverrides, setBannerOverride, syncFromCloud } from '@/lib/runtimeStore';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const DEFAULT_BANNERS = [
  {
    id: 'banner-default-1',
    titleEn: 'THE TURKISH DROP • EXCLUSIVE',
    titleAr: 'التشكيلة التركية الفاخرة',
    subtitleEn: 'Heavyweight cottons & tailored streetwear silhouettes.',
    subtitleAr: 'قطنيات ثقيلة وتصاميم ستريت وير فاخرة.',
    imageUrl: '/black_island_storefront.jpg',
    buttonTextEn: 'EXPLORE CATALOG',
    buttonTextAr: 'استكشف التشكيلة',
    link: '/shop',
    order: 1,
    isActive: true,
    createdAt: new Date().toISOString(),
  },
];

export async function GET() {
  try {
    await syncFromCloud();
    let dbBanners: any[] = [];
    try {
      dbBanners = await prisma.banner.findMany({
        orderBy: { order: 'asc' },
      });
    } catch (e) {}

    const initialMap = new Map(DEFAULT_BANNERS.map((b) => [b.id, b]));
    const dbMap = new Map((dbBanners || []).map((b) => [b.id, b]));
    const rawBanners = Array.from(new Map([...initialMap, ...dbMap]).values());
    const banners = applyBannerOverrides(rawBanners);

    return NextResponse.json({ banners });
  } catch (error) {
    return NextResponse.json({ banners: DEFAULT_BANNERS });
  }
}

export async function POST(request: Request) {
  try {
    await syncFromCloud();
    const body = await request.json();
    const { titleEn, titleAr, subtitleEn, subtitleAr, imageUrl, buttonTextEn, buttonTextAr, link, order, isActive } = body;

    if (!titleEn || !titleAr || !imageUrl) {
      return NextResponse.json({ error: 'Banner titles and image are required' }, { status: 400 });
    }

    const newId = `banner-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const banner = {
      id: newId,
      titleEn,
      titleAr,
      subtitleEn: subtitleEn || '',
      subtitleAr: subtitleAr || '',
      imageUrl,
      buttonTextEn: buttonTextEn || 'SHOP NOW',
      buttonTextAr: buttonTextAr || 'تسوق الآن',
      link: link || '/shop',
      order: parseInt(order || '0'),
      isActive: isActive !== false,
      createdAt: new Date().toISOString(),
    };

    await setBannerOverride(banner);

    try {
      await prisma.banner.create({
        data: {
          id: newId,
          titleEn,
          titleAr,
          subtitleEn: subtitleEn || null,
          subtitleAr: subtitleAr || null,
          imageUrl,
          buttonTextEn: buttonTextEn || 'SHOP NOW',
          buttonTextAr: buttonTextAr || 'تسوق الآن',
          link: link || '/shop',
          order: parseInt(order || '0'),
          isActive: isActive !== false,
        },
      });
    } catch (e) {}

    return NextResponse.json({ success: true, banner });
  } catch (error: any) {
    console.error('Create banner error:', error);
    return NextResponse.json({ error: error?.message || 'Failed to create banner' }, { status: 500 });
  }
}
