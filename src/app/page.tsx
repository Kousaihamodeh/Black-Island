import { prisma } from '@/lib/prisma';
import { ensureSeeded, INITIAL_PRODUCTS } from '@/lib/autoSeed';
import { applyOverrides, applyBannerOverrides, getAllStoreSettings, syncFromCloud } from '@/lib/runtimeStore';
import { HeroSection } from '@/components/home/HeroSection';
import { CategoryGrid } from '@/components/home/CategoryGrid';
import { FeaturedProducts } from '@/components/home/FeaturedProducts';
import { SneakerSpotlightSection } from '@/components/home/SneakerSpotlightSection';
import { BrandStory } from '@/components/home/BrandStory';
import { GoogleMapSection } from '@/components/home/GoogleMapSection';
import { InstagramSection } from '@/components/home/InstagramSection';
import { WhatsappCta } from '@/components/home/WhatsappCta';

export const dynamic = 'force-dynamic';
export const revalidate = 0; // Dynamic real-time loading for new product updates

const DEFAULT_BANNERS = [
  {
    id: 'banner-default-1',
    titleEn: 'THE TURKISH DROP • EXCLUSIVE',
    titleAr: 'التشكيلة التركية الفاخرة',
    subtitleEn: 'Heavyweight cottons & tailored streetwear silhouettes.',
    subtitleAr: 'قطنيات ثقيلة وتصاميم ستريت وير فاخرة.',
    imageUrl: 'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?q=80&w=1600',
    buttonTextEn: 'EXPLORE CATALOG',
    buttonTextAr: 'استكشف التشكيلة',
    link: '/shop',
    order: 1,
    isActive: true,
    createdAt: new Date().toISOString(),
  },
];

export default async function HomePage() {
  let dbProds: any[] = [];
  let dbBanners: any[] = [];

  try {
    await syncFromCloud();
    await ensureSeeded(prisma);
    dbProds = await prisma.product.findMany({
      where: { isActive: true },
      include: {
        images: true,
        variants: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    dbBanners = await prisma.banner.findMany({
      orderBy: { order: 'asc' },
    }).catch(() => []);
  } catch (error) {
    console.error('Failed to load homepage products', error);
  }

  const initialProdMap = new Map(INITIAL_PRODUCTS.map((p) => [p.id, p]));
  const dbProdMap = new Map((dbProds || []).map((p) => [p.id, p]));
  const rawProducts = Array.from(new Map([...initialProdMap, ...dbProdMap]).values());
  const allProducts = applyOverrides(rawProducts).filter((p) => p.isActive !== false);

  let featured = allProducts.filter((p) => p.featured);
  if (featured.length < 8) {
    const featuredIds = new Set(featured.map((p) => p.id));
    const extra = allProducts.filter((p) => !featuredIds.has(p.id));
    featured = [...featured, ...extra];
  }
  const finalFeatured = featured.slice(0, 8);

  const initialBannerMap = new Map(DEFAULT_BANNERS.map((b) => [b.id, b]));
  const dbBannerMap = new Map((dbBanners || []).map((b) => [b.id, b]));
  const rawBanners = Array.from(new Map([...initialBannerMap, ...dbBannerMap]).values());
  const banners = applyBannerOverrides(rawBanners).filter((b) => b.isActive !== false);

  const settings = getAllStoreSettings();
  const brandIdentityImage = settings.brand_identity_image || undefined;

  return (
    <div className="space-y-0">
      <HeroSection initialBanners={banners} />
      <CategoryGrid />
      <FeaturedProducts products={finalFeatured} />
      <SneakerSpotlightSection />
      <BrandStory initialImage={brandIdentityImage} />
      <GoogleMapSection />
      <InstagramSection />
      <WhatsappCta />
    </div>
  );
}
