import { PrismaClient } from '@prisma/client';
import { INITIAL_CATEGORIES, INITIAL_PRODUCTS } from './initialCatalog';

export { INITIAL_CATEGORIES, INITIAL_PRODUCTS };

export async function ensureSeeded(prisma: PrismaClient) {
  try {
    try {
      const productCount = await prisma.product.count().catch(() => -1);
      if (productCount >= INITIAL_PRODUCTS.length) {
        return;
      }
    } catch (e) {
      // continue to create tables & seed
    }

  console.log('[AutoSeed] SQLite database empty or uninitialized. Initializing schema tables and seeding catalog...');

  const schemaStatements = [
    `CREATE TABLE IF NOT EXISTS "Admin" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "email" TEXT NOT NULL,
        "passwordHash" TEXT NOT NULL,
        "name" TEXT NOT NULL,
        "role" TEXT NOT NULL DEFAULT 'ADMIN',
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    );`,
    `CREATE UNIQUE INDEX IF NOT EXISTS "Admin_email_key" ON "Admin"("email");`,
    `CREATE TABLE IF NOT EXISTS "Category" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "slug" TEXT NOT NULL,
        "nameEn" TEXT NOT NULL,
        "nameAr" TEXT NOT NULL,
        "descriptionEn" TEXT,
        "descriptionAr" TEXT,
        "image" TEXT NOT NULL,
        "order" INTEGER NOT NULL DEFAULT 0,
        "isHidden" BOOLEAN NOT NULL DEFAULT 0,
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    );`,
    `CREATE UNIQUE INDEX IF NOT EXISTS "Category_slug_key" ON "Category"("slug");`,
    `CREATE TABLE IF NOT EXISTS "Product" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "slug" TEXT NOT NULL,
        "nameEn" TEXT NOT NULL,
        "nameAr" TEXT NOT NULL,
        "descEn" TEXT NOT NULL,
        "descAr" TEXT NOT NULL,
        "price" REAL NOT NULL,
        "salePrice" REAL,
        "sku" TEXT NOT NULL,
        "featured" BOOLEAN NOT NULL DEFAULT 0,
        "isNew" BOOLEAN NOT NULL DEFAULT 0,
        "isSale" BOOLEAN NOT NULL DEFAULT 0,
        "isActive" BOOLEAN NOT NULL DEFAULT 1,
        "categorySlug" TEXT NOT NULL,
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" DATETIME NOT NULL,
        FOREIGN KEY ("categorySlug") REFERENCES "Category" ("slug") ON DELETE CASCADE ON UPDATE CASCADE
    );`,
    `CREATE UNIQUE INDEX IF NOT EXISTS "Product_slug_key" ON "Product"("slug");`,
    `CREATE UNIQUE INDEX IF NOT EXISTS "Product_sku_key" ON "Product"("sku");`,
    `CREATE TABLE IF NOT EXISTS "ProductImage" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "productId" TEXT NOT NULL,
        "url" TEXT NOT NULL,
        "isMain" BOOLEAN NOT NULL DEFAULT 0,
        "order" INTEGER NOT NULL DEFAULT 0,
        FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE CASCADE ON UPDATE CASCADE
    );`,
    `CREATE TABLE IF NOT EXISTS "ProductVariant" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "productId" TEXT NOT NULL,
        "size" TEXT NOT NULL,
        "colorName" TEXT NOT NULL,
        "colorHex" TEXT NOT NULL,
        "colorImage" TEXT,
        "colorImages" TEXT,
        "stock" INTEGER NOT NULL DEFAULT 0,
        FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE CASCADE ON UPDATE CASCADE
    );`,
    `CREATE TABLE IF NOT EXISTS "Order" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "orderNumber" TEXT NOT NULL,
        "customerName" TEXT NOT NULL,
        "customerPhone" TEXT NOT NULL,
        "customerWhatsapp" TEXT NOT NULL,
        "governorate" TEXT NOT NULL,
        "cityArea" TEXT NOT NULL,
        "address" TEXT NOT NULL,
        "notes" TEXT,
        "subtotal" REAL NOT NULL,
        "deliveryFee" REAL NOT NULL DEFAULT 0,
        "discount" REAL NOT NULL DEFAULT 0,
        "total" REAL NOT NULL,
        "paymentMethod" TEXT NOT NULL DEFAULT 'COD',
        "status" TEXT NOT NULL DEFAULT 'PENDING',
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" DATETIME NOT NULL
    );`,
    `CREATE UNIQUE INDEX IF NOT EXISTS "Order_orderNumber_key" ON "Order"("orderNumber");`,
    `CREATE TABLE IF NOT EXISTS "OrderItem" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "orderId" TEXT NOT NULL,
        "productId" TEXT,
        "productName" TEXT NOT NULL,
        "size" TEXT NOT NULL,
        "color" TEXT NOT NULL,
        "price" REAL NOT NULL,
        "quantity" INTEGER NOT NULL,
        "total" REAL NOT NULL,
        FOREIGN KEY ("orderId") REFERENCES "Order" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
        FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE SET NULL ON UPDATE CASCADE
    );`,
    `CREATE TABLE IF NOT EXISTS "Coupon" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "code" TEXT NOT NULL,
        "type" TEXT NOT NULL DEFAULT 'PERCENTAGE',
        "value" REAL NOT NULL,
        "minOrder" REAL,
        "usageLimit" INTEGER,
        "usedCount" INTEGER NOT NULL DEFAULT 0,
        "expiresAt" DATETIME,
        "isActive" BOOLEAN NOT NULL DEFAULT 1,
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    );`,
    `CREATE UNIQUE INDEX IF NOT EXISTS "Coupon_code_key" ON "Coupon"("code");`,
    `CREATE TABLE IF NOT EXISTS "Banner" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "titleEn" TEXT NOT NULL,
        "titleAr" TEXT NOT NULL,
        "subtitleEn" TEXT,
        "subtitleAr" TEXT,
        "imageUrl" TEXT NOT NULL,
        "buttonTextEn" TEXT,
        "buttonTextAr" TEXT,
        "link" TEXT NOT NULL DEFAULT '/shop',
        "order" INTEGER NOT NULL DEFAULT 0,
        "isActive" BOOLEAN NOT NULL DEFAULT 1,
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    );`,
    `CREATE TABLE IF NOT EXISTS "Showcase3D" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "key" TEXT NOT NULL,
        "titleEn" TEXT NOT NULL,
        "titleAr" TEXT NOT NULL,
        "modelUrl" TEXT,
        "imageUrl" TEXT,
        "positionX" REAL NOT NULL DEFAULT 0,
        "positionY" REAL NOT NULL DEFAULT 0,
        "positionZ" REAL NOT NULL DEFAULT 0,
        "scale" REAL NOT NULL DEFAULT 1.0,
        "rotationSpeed" REAL NOT NULL DEFAULT 0.005,
        "autoRotate" BOOLEAN NOT NULL DEFAULT 1,
        "mouseInteraction" BOOLEAN NOT NULL DEFAULT 1,
        "floatingAnim" BOOLEAN NOT NULL DEFAULT 1,
        "lightingPower" REAL NOT NULL DEFAULT 1.5,
        "cameraDistance" REAL NOT NULL DEFAULT 5.0,
        "isActive" BOOLEAN NOT NULL DEFAULT 1,
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" DATETIME NOT NULL
    );`,
    `CREATE UNIQUE INDEX IF NOT EXISTS "Showcase3D_key_key" ON "Showcase3D"("key");`,
    `CREATE TABLE IF NOT EXISTS "StoreSetting" (
        "key" TEXT NOT NULL PRIMARY KEY,
        "value" TEXT NOT NULL
    );`,
  ];

  for (const sql of schemaStatements) {
    try {
      await prisma.$executeRawUnsafe(sql);
    } catch (err) {
      console.error('[AutoSeed] Error executing schema statement:', err);
    }
  }

  try {
    for (const item of INITIAL_CATEGORIES) {
      await prisma.category.create({ data: item }).catch(() => {});
    }
    for (const p of INITIAL_PRODUCTS) {
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
      }).catch(() => {});
    }
    console.log('[AutoSeed] Successfully auto-seeded catalog!');
  } catch (err) {
    console.error('[AutoSeed] Failed auto-seeding:', err);
  }
} catch (outerErr) {
  console.error('[AutoSeed] Top level error ignored:', outerErr);
}
}
