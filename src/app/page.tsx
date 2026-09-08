import { prisma } from '@/lib/prisma';
import { ensureSeeded, INITIAL_PRODUCTS } from '@/lib/autoSeed';
import { applyOverrides, syncFromCloud } from '@/lib/runtimeStore';
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

export default async function HomePage() {
  let dbProds: any[] = [];
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

  return (
    <div className="space-y-0">
      <HeroSection />
      <CategoryGrid />
      <FeaturedProducts products={finalFeatured} />
      <SneakerSpotlightSection />
      <BrandStory />
      <GoogleMapSection />
      <InstagramSection />
      <WhatsappCta />
    </div>
  );
}
