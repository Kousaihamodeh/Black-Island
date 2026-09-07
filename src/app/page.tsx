import { prisma } from '@/lib/prisma';
import { ensureSeeded, INITIAL_PRODUCTS } from '@/lib/autoSeed';
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
  let featuredProducts: any[] = [];
  try {
    await ensureSeeded(prisma);
    featuredProducts = await prisma.product.findMany({
      where: { featured: true, isActive: true },
      include: {
        images: true,
        variants: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 8,
    });

    if (featuredProducts.length < 8) {
      const existingIds = featuredProducts.map((p) => p.id);
      const extraProducts = await prisma.product.findMany({
        where: {
          isActive: true,
          id: { notIn: existingIds },
        },
        include: {
          images: true,
          variants: true,
        },
        orderBy: { createdAt: 'desc' },
        take: 8 - featuredProducts.length,
      });

      featuredProducts = [...featuredProducts, ...extraProducts];
    }
  } catch (error) {
    console.error('Failed to load homepage products', error);
  }

  // Guaranteed catalog fallback with merged INITIAL_PRODUCTS for Vercel
  const dbProdIds = new Set((featuredProducts || []).map((p) => p.id));
  const extraProducts = INITIAL_PRODUCTS.filter((p) => !dbProdIds.has(p.id));
  const finalFeatured = [...(featuredProducts || []), ...extraProducts].slice(0, 8);

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
