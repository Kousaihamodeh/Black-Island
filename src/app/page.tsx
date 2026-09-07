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

  // Guaranteed catalog fallback if database is empty or uninitialized on Vercel
  if (!featuredProducts || featuredProducts.length < 8) {
    featuredProducts = INITIAL_PRODUCTS.slice(0, 8);
  }

  return (
    <div className="space-y-0">
      <HeroSection />
      <CategoryGrid />
      <FeaturedProducts products={featuredProducts} />
      <SneakerSpotlightSection />
      <BrandStory />
      <GoogleMapSection />
      <InstagramSection />
      <WhatsappCta />
    </div>
  );
}
