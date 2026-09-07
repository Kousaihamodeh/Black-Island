import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { ensureSeeded, INITIAL_PRODUCTS } from '@/lib/autoSeed';

// Force rebuild 34 product catalog v2 - timestamp 2026-09-07
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: Request) {
  try {
    await ensureSeeded(prisma);
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const featured = searchParams.get('featured');
    const isNew = searchParams.get('isNew');
    const isSale = searchParams.get('isSale');
    const search = searchParams.get('search');
    const allStatus = searchParams.get('allStatus') === 'true';
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined;

    const where: any = {};

    if (!allStatus) {
      where.isActive = true;
    }

    if (category && category !== 'all') {
      where.categorySlug = category;
    }

    if (featured === 'true') {
      where.featured = true;
    }

    if (isNew === 'true') {
      where.isNew = true;
    }

    if (isSale === 'true') {
      where.isSale = true;
    }

    if (search) {
      where.OR = [
        { nameEn: { contains: search } },
        { nameAr: { contains: search } },
        { sku: { contains: search } },
      ];
    }

    let dbProducts: any[] = [];
    try {
      dbProducts = await prisma.product.findMany({
        where,
        include: {
          images: { orderBy: { order: 'asc' } },
          variants: true,
          category: true,
        },
        orderBy: { createdAt: 'desc' },
      });
    } catch (e) {}

    const initialMap = new Map(INITIAL_PRODUCTS.map((p) => [p.id, p]));
    const dbMap = new Map((dbProducts || []).map((p) => [p.id, p]));
    const mergedMap = new Map([...initialMap, ...dbMap]);
    let combined = Array.from(mergedMap.values());
    if (!allStatus) {
      combined = combined.filter((p) => p.isActive !== false);
    }
    if (category && category !== 'all') {
      combined = combined.filter((p) => p.categorySlug === category);
    }
    if (featured === 'true') {
      combined = combined.filter((p) => p.featured);
    }
    if (isNew === 'true') {
      combined = combined.filter((p) => p.isNew);
    }
    if (isSale === 'true') {
      combined = combined.filter((p) => p.isSale);
    }
    if (search) {
      const s = search.toLowerCase();
      combined = combined.filter(
        (p) =>
          (p.nameEn && p.nameEn.toLowerCase().includes(s)) ||
          (p.nameAr && p.nameAr.includes(s)) ||
          (p.sku && p.sku.toLowerCase().includes(s))
      );
    }

    const result = limit ? combined.slice(0, limit) : combined;
    return NextResponse.json({ products: result });
  } catch (error) {
    console.error('Fetch products error:', error);
    return NextResponse.json({ products: INITIAL_PRODUCTS });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      nameEn,
      nameAr,
      descEn,
      descAr,
      price,
      salePrice,
      sku,
      categorySlug,
      featured,
      isNew,
      isSale,
      isActive,
      images,
      variants,
    } = body;

    if (!nameEn || !nameAr || !price || !sku || !categorySlug) {
      return NextResponse.json({ error: 'Missing required product fields' }, { status: 400 });
    }

    const slug = nameEn
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    const product = await prisma.product.create({
      data: {
        slug: `${slug}-${Math.floor(100 + Math.random() * 900)}`,
        nameEn,
        nameAr,
        descEn: descEn || '',
        descAr: descAr || '',
        price: parseFloat(price),
        salePrice: salePrice ? parseFloat(salePrice) : null,
        sku,
        categorySlug,
        featured: !!featured,
        isNew: !!isNew,
        isSale: !!isSale,
        isActive: isActive !== undefined ? !!isActive : true,
        images: {
          create: (images || []).map((imgUrl: string, idx: number) => ({
            url: imgUrl,
            isMain: idx === 0,
            order: idx,
          })),
        },
        variants: {
          create: (variants || []).map((v: any) => ({
            size: v.size,
            colorName: v.colorName,
            colorHex: v.colorHex || '#000000',
            colorImage: v.colorImage || (Array.isArray(v.colorImages) ? v.colorImages[0] : null),
            colorImages: Array.isArray(v.colorImages) ? v.colorImages.join(',') : (v.colorImages || v.colorImage || ''),
            stock: parseInt(v.stock || 0),
          })),
        },
      },
      include: {
        images: true,
        variants: true,
        category: true,
      },
    });

    try {
      revalidatePath('/');
      revalidatePath('/shop');
      revalidatePath(`/category/${categorySlug}`);
    } catch (e) {}

    return NextResponse.json({ success: true, product });
  } catch (error) {
    console.error('Create product error:', error);
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}
