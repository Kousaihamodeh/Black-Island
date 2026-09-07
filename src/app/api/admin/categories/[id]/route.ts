import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { nameEn, nameAr, descriptionEn, descriptionAr, image, order, isHidden } = body;

    const slug = nameEn.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    const category = await prisma.category.update({
      where: { id },
      data: {
        slug,
        nameEn,
        nameAr,
        descriptionEn,
        descriptionAr,
        image,
        order: parseInt(order || 0),
        isHidden: !!isHidden,
      },
    });

    return NextResponse.json({ success: true, category });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update category' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.category.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 });
  }
}
