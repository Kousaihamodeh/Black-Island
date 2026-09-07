import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      include: { products: true },
      orderBy: { order: 'asc' },
    });
    return NextResponse.json({ categories });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { nameEn, nameAr, descriptionEn, descriptionAr, image, order, isHidden } = body;

    if (!nameEn || !nameAr) {
      return NextResponse.json({ error: 'Category English and Arabic names are required' }, { status: 400 });
    }

    const slug = nameEn.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    const category = await prisma.category.create({
      data: {
        slug,
        nameEn,
        nameAr,
        descriptionEn: descriptionEn || null,
        descriptionAr: descriptionAr || null,
        image: image || 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=1000',
        order: parseInt(order || 0),
        isHidden: !!isHidden,
      },
    });

    return NextResponse.json({ success: true, category });
  } catch (error) {
    console.error('Create category error:', error);
    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 });
  }
}
