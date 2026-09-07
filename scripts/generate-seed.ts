import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient({ datasources: { db: { url: `file:${path.join(process.cwd(), 'prisma', 'dev_backup.db')}` } } });

async function generateSeed() {
  const admins = await prisma.admin.findMany();
  const categories = await prisma.category.findMany({ orderBy: { order: 'asc' } });
  const products = await prisma.product.findMany({
    include: {
      images: { orderBy: { order: 'asc' } },
      variants: true,
    },
    orderBy: { createdAt: 'desc' },
  });
  const banners = await prisma.banner.findMany();
  const coupons = await prisma.coupon.findMany();
  const showcases = await prisma.showcase3D.findMany();
  const settings = await prisma.storeSetting.findMany();

  const seedContent = `import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding full production BLACK ISLAND catalog (${products.length} products)...');

  // Clean existing data
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.coupon.deleteMany();
  await prisma.banner.deleteMany();
  await prisma.storeSetting.deleteMany();
  await prisma.showcase3D.deleteMany();
  await prisma.admin.deleteMany();

  // 1. Admins
  console.log('Seeding admins...');
  const adminsData = ${JSON.stringify(admins, null, 2)};
  for (const item of adminsData) {
    await prisma.admin.create({ data: item });
  }

  // 2. Categories
  console.log('Seeding categories...');
  const categoriesData = ${JSON.stringify(categories, null, 2)};
  for (const item of categoriesData) {
    await prisma.category.create({ data: item });
  }

  // 3. Products with Images and Variants
  console.log('Seeding products, images, and variants...');
  const productsData = ${JSON.stringify(products, null, 2)};
  for (const p of productsData) {
    const { id, images, variants, createdAt, updatedAt, ...pData } = p;
    await prisma.product.create({
      data: {
        ...pData,
        id,
        images: {
          create: images.map(({ id: imgId, productId, ...img }: any) => img),
        },
        variants: {
          create: variants.map(({ id: varId, productId, ...v }: any) => v),
        },
      },
    });
  }

  // 4. Banners
  console.log('Seeding banners...');
  const bannersData = ${JSON.stringify(banners, null, 2)};
  for (const item of bannersData) {
    await prisma.banner.create({ data: item });
  }

  // 5. Coupons
  console.log('Seeding coupons...');
  const couponsData = ${JSON.stringify(coupons, null, 2)};
  for (const item of couponsData) {
    await prisma.coupon.create({ data: item });
  }

  // 6. Showcase3D
  console.log('Seeding 3D showcases...');
  const showcase3DData = ${JSON.stringify(showcases, null, 2)};
  for (const item of showcase3DData) {
    await prisma.showcase3D.create({ data: item });
  }

  // 7. Store Settings
  console.log('Seeding store settings...');
  const settingsData = ${JSON.stringify(settings, null, 2)};
  for (const item of settingsData) {
    await prisma.storeSetting.create({ data: item });
  }

  console.log('Successfully seeded full ${products.length} product catalog!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
`;

  fs.writeFileSync(path.join(process.cwd(), 'prisma', 'seed.ts'), seedContent);
  console.log('Successfully generated prisma/seed.ts with all 34 products!');
}

generateSeed();
