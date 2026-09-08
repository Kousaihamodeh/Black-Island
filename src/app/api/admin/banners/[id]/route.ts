import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { setBannerOverride, markBannerDeleted, syncFromCloud, bannerOverrides } from '@/lib/runtimeStore';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await syncFromCloud();
    const { id } = await params;
    const body = await request.json();
    const { titleEn, titleAr, subtitleEn, subtitleAr, imageUrl, buttonTextEn, buttonTextAr, link, order, isActive } = body;

    let existing: any = bannerOverrides.get(id);
    if (!existing) {
      try {
        existing = await prisma.banner.findUnique({ where: { id } });
      } catch (e) {}
    }

    const updatedBanner = {
      ...(existing || {}),
      id,
      titleEn,
      titleAr,
      subtitleEn: subtitleEn || '',
      subtitleAr: subtitleAr || '',
      imageUrl,
      buttonTextEn: buttonTextEn || 'SHOP NOW',
      buttonTextAr: buttonTextAr || 'تسوق الآن',
      link: link || '/shop',
      order: parseInt(order || '0'),
      isActive: !!isActive,
      updatedAt: new Date().toISOString(),
    };

    await setBannerOverride(updatedBanner);

    try {
      await prisma.banner.update({
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
          order: parseInt(order || '0'),
          isActive: !!isActive,
        },
      });
    } catch (e) {}

    return NextResponse.json({ success: true, banner: updatedBanner });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Failed to update banner' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await syncFromCloud();
    const { id } = await params;
    await markBannerDeleted(id);

    try {
      await prisma.banner.delete({ where: { id } });
    } catch (e) {}

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete banner' }, { status: 500 });
  }
}
