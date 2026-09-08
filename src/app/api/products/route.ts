import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { ensureSeeded, INITIAL_PRODUCTS } from '@/lib/autoSeed';
import { applyOverrides, setProductOverride, syncFromCloud } from '@/lib/runtimeStore';

// Force rebuild 34 product catalog v2 - timestamp 2026-09-07
export const dynamic = 'force-dynamic';
export const revalidate = 0;

function getCanonicalSlug(str: string | null | undefined): string {
  if (!str) return '';
  const norm = str.toLowerCase().trim().replace(/[^a-z0-9]/g, '');
  if (norm.includes('hoodie') || norm.includes('sweat')) return 'hoodies';
  if (norm.includes('tshirt') || norm.includes('tee') || norm.includes('oversized')) return 'tshirts';
  if (norm.includes('pant') || norm.includes('cargo') || norm.includes('jean') || norm.includes('trouser')) return 'pants';
  if (norm.includes('sneaker') || norm.includes('shoe') || norm.includes('footwear')) return 'sneakers';
  if (norm.includes('cap') || norm.includes('hat') || norm.includes('accessory')) return 'caps';
  if (norm.includes('short')) return 'shorts';
  return norm;
}

export async function GET(request: Request) {
  try {
    await syncFromCloud();
    await ensureSeeded(prisma);
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const featured = searchParams.get('featured');
    const isNew = searchParams.get('isNew');
    const isSale = searchParams.get('isSale');
    const search = searchParams.get('search');
    const allStatus = searchParams.get('allStatus') === 'true';
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined;

    let dbProducts: any[] = [];
    try {
      dbProducts = await prisma.product.findMany({
        include: {
          images: { orderBy: { order: 'asc' } },
          variants: true,
          category: true,
        },
        orderBy: { createdAt: 'desc' },
      });
    } catch (e) {}

    const initialMap = new Map<string, any>(INITIAL_PRODUCTS.map((p) => [p.id, p]));
    const dbMap = new Map<string, any>((dbProducts || []).map((p) => [p.id, p]));
    const mergedMap = new Map<string, any>([...initialMap, ...dbMap]);
    let combined = applyOverrides(Array.from(mergedMap.values()));

    if (!allStatus) {
      combined = combined.filter((p) => p.isActive !== false);
    }

    if (category && category !== 'all') {
      const targetCanonical = getCanonicalSlug(category);
      combined = combined.filter((p) => {
        const prodCatSlug = p.categorySlug || p.category?.slug;
        return getCanonicalSlug(prodCatSlug) === targetCanonical;
      });
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
    return NextResponse.json({ products: result, _debug: { initialCount: INITIAL_PRODUCTS.length, dbCount: dbProducts.length } });
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

    const newId = `prod-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const slug = nameEn
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    const formattedImages = (images || []).map((imgUrl: string, idx: number) => ({
      id: `img-${Date.now()}-${idx}`,
      productId: newId,
      url: imgUrl,
      isMain: idx === 0,
      order: idx,
    }));

    const formattedVariants = (variants || []).map((v: any, idx: number) => ({
      id: `var-${Date.now()}-${idx}`,
      productId: newId,
      size: v.size,
      colorName: v.colorName,
      colorHex: v.colorHex || '#000000',
      colorImage: v.colorImage || (Array.isArray(v.colorImages) ? v.colorImages[0] : null),
      colorImages: Array.isArray(v.colorImages) ? v.colorImages.join(',') : (v.colorImages || v.colorImage || ''),
      stock: parseInt(v.stock || 0),
    }));

    const createdProduct = {
      id: newId,
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
      images: formattedImages,
      variants: formattedVariants,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setProductOverride(createdProduct);

    try {
      await prisma.product.create({
        data: {
          id: newId,
          slug: createdProduct.slug,
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
      });
    } catch (dbErr) {
      console.warn('Prisma create skipped on read-only disk (handled by runtime override):', dbErr);
    }

    try {
      revalidatePath('/');
      revalidatePath('/shop');
      revalidatePath(`/category/${categorySlug}`);
    } catch (e) {}

    return NextResponse.json({ success: true, product: createdProduct });
  } catch (error: any) {
    console.error('Create product error:', error);
    return NextResponse.json({ error: error?.message || 'Failed to create product' }, { status: 500 });
  }
}
