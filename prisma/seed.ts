import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding rich BLACK ISLAND demo catalog...');

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

  // Create Admin
  await prisma.admin.create({
    data: {
      email: 'admin@blackisland.sy',
      passwordHash: 'admin123',
      name: 'Black Island Admin',
      role: 'ADMIN',
    },
  });

  // Categories
  const categories = [
    {
      slug: 'hoodies',
      nameEn: 'Hoodies & Sweatshirts',
      nameAr: 'الهوديات والسويت شيرت',
      descriptionEn: 'Heavyweight cotton oversized hoodies imported from Turkey.',
      descriptionAr: 'هوديات قطن ثقيل أوفرسايز صُنعت في تركيا.',
      image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=1000&auto=format&fit=crop',
      order: 1,
    },
    {
      slug: 'tshirts',
      nameEn: 'T-Shirts & Oversized',
      nameAr: 'التيشيرتات والأوفرسايز',
      descriptionEn: 'Drop-shoulder street tees with high-density graphics.',
      descriptionAr: 'تيشيرتات أكتاف منسدلة وطباعة عالية الدقة.',
      image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=1000&auto=format&fit=crop',
      order: 2,
    },
    {
      slug: 'pants',
      nameEn: 'Pants & Cargo',
      nameAr: 'البناطيل والكارغو',
      descriptionEn: 'Tactical cargo pants and relaxed streetwear trousers.',
      descriptionAr: 'بناطيل كارغو تكتيكية وقصات ستريت وير مريحة.',
      image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=1000&auto=format&fit=crop',
      order: 3,
    },
    {
      slug: 'sneakers',
      nameEn: 'Sneakers & Shoes',
      nameAr: 'الأحذية والسنيكرز',
      descriptionEn: 'Premium luxury sneakers and chunky street silhouettes.',
      descriptionAr: 'سنيكرز فاخرة وقصات متميزة للشارع.',
      image: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?q=80&w=1000&auto=format&fit=crop',
      order: 4,
    },
    {
      slug: 'caps',
      nameEn: 'Caps & Accessories',
      nameAr: 'القبعات والإكسسوارات',
      descriptionEn: 'Embroidered dad hats, beanies, and silver jewelry.',
      descriptionAr: 'قبعات مطرزة، طواقي، وإكسسوارات أنيقة.',
      image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?q=80&w=1000&auto=format&fit=crop',
      order: 5,
    },
  ];

  for (const cat of categories) {
    await prisma.category.create({ data: cat });
  }

  // 16 Detailed Streetwear Products with Dual Images for Hover Effects
  const products = [
    {
      slug: 'oversized-black-island-hoodie',
      nameEn: 'BLACK ISLAND Signature Heavy Hoodie',
      nameAr: 'هودي بلاك آيلاند قطن ثقيل أوفرسايز',
      descEn: 'Premium 500GSM 100% Turkish cotton fleece. Features dropped shoulders, double-layered hood, and minimal embroidered logo on the chest. Built for winter performance in Damascus.',
      descAr: 'مصنع من قطن تركي 100% بسمك 500 غرام. أكتاف منسدلة، طاقية مضاعفة، وتطريز بشعار بلاك آيلاند الفاخر على الصدر.',
      price: 380000,
      salePrice: 320000,
      sku: 'BI-HD-001',
      featured: true,
      isNew: true,
      isSale: true,
      categorySlug: 'hoodies',
      images: [
        { url: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=1000&auto=format&fit=crop', isMain: true, order: 0 },
        { url: 'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?q=80&w=1000&auto=format&fit=crop', isMain: false, order: 1 },
      ],
      variants: [
        { size: 'S', colorName: 'Obsidian Black', colorHex: '#000000', stock: 15 },
        { size: 'M', colorName: 'Obsidian Black', colorHex: '#000000', stock: 25 },
        { size: 'L', colorName: 'Obsidian Black', colorHex: '#000000', stock: 20 },
        { size: 'XL', colorName: 'Obsidian Black', colorHex: '#000000', stock: 10 },
        { size: 'XXL', colorName: 'Obsidian Black', colorHex: '#000000', stock: 5 },
        { size: 'M', colorName: 'Charcoal Gray', colorHex: '#262626', stock: 18 },
        { size: 'L', colorName: 'Charcoal Gray', colorHex: '#262626', stock: 14 },
      ],
    },
    {
      slug: 'matrix-graphic-oversized-tee',
      nameEn: 'Matrix Vintage Graphic Tee',
      nameAr: 'تيشيرت ماتركس اوفرسايز فينتاج',
      descEn: 'Acid-washed 240GSM cotton t-shirt with screenprinted back graphic. Made in Turkey for maximum comfort and durability.',
      descAr: 'قطن مغسول 240 غرام بطباعة شاشة حريرية غرافيك على الظهر. خامة تركية عالية التحمل.',
      price: 195000,
      salePrice: null,
      sku: 'BI-TS-002',
      featured: true,
      isNew: true,
      isSale: false,
      categorySlug: 'tshirts',
      images: [
        { url: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=1000&auto=format&fit=crop', isMain: true, order: 0 },
        { url: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?q=80&w=1000&auto=format&fit=crop', isMain: false, order: 1 },
      ],
      variants: [
        { size: 'S', colorName: 'Washed Black', colorHex: '#1a1a1a', stock: 12 },
        { size: 'M', colorName: 'Washed Black', colorHex: '#1a1a1a', stock: 30 },
        { size: 'L', colorName: 'Washed Black', colorHex: '#1a1a1a', stock: 25 },
        { size: 'XL', colorName: 'Washed Black', colorHex: '#1a1a1a', stock: 15 },
        { size: 'M', colorName: 'Bone White', colorHex: '#f0ede6', stock: 10 },
      ],
    },
    {
      slug: 'tactical-cargo-pants-v1',
      nameEn: 'Stealth Tactical Cargo Pants',
      nameAr: 'بنطال ستيلث كارغو تكتيكي',
      descEn: 'Heavyweight ripstop stretch cotton with 6 utility pockets, adjustable ankle straps, and custom metallic hardware.',
      descAr: 'قماش ريبستوب مقاوم للتآكل مع 6 جيوب تكتيكية وأربطة تضييق عند الكاحل.',
      price: 290000,
      salePrice: 245000,
      sku: 'BI-PT-003',
      featured: true,
      isNew: false,
      isSale: true,
      categorySlug: 'pants',
      images: [
        { url: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=1000&auto=format&fit=crop', isMain: true, order: 0 },
      ],
      variants: [
        { size: 'S', colorName: 'Stealth Black', colorHex: '#0f0f12', stock: 8 },
        { size: 'M', colorName: 'Stealth Black', colorHex: '#0f0f12', stock: 16 },
        { size: 'L', colorName: 'Stealth Black', colorHex: '#0f0f12', stock: 14 },
        { size: 'XL', colorName: 'Stealth Black', colorHex: '#0f0f12', stock: 6 },
      ],
    },
    {
      slug: 'black-island-hyper-sneaker-01',
      nameEn: 'BLACK ISLAND Hyper Sneaker - Triple Black',
      nameAr: 'حذاء سنيكرز هايبر - أسود كامل',
      descEn: 'Architectural streetwear sneaker crafted with genuine full-grain leather, chunky TPU sole, and gold engraved heel identity.',
      descAr: 'سنيكرز معماري مصنع من الجلد الطبيعي مع نعل TPU سميك وتطريز ذهبي فاخر عند الكعب.',
      price: 490000,
      salePrice: 420000,
      sku: 'BI-SNK-004',
      featured: true,
      isNew: true,
      isSale: true,
      categorySlug: 'sneakers',
      images: [
        { url: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?q=80&w=1000&auto=format&fit=crop', isMain: true, order: 0 },
        { url: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=1000&auto=format&fit=crop', isMain: false, order: 1 },
      ],
      variants: [
        { size: '40', colorName: 'Triple Black', colorHex: '#000000', stock: 6 },
        { size: '41', colorName: 'Triple Black', colorHex: '#000000', stock: 12 },
        { size: '42', colorName: 'Triple Black', colorHex: '#000000', stock: 15 },
        { size: '43', colorName: 'Triple Black', colorHex: '#000000', stock: 10 },
        { size: '44', colorName: 'Triple Black', colorHex: '#000000', stock: 8 },
        { size: '45', colorName: 'Triple Black', colorHex: '#000000', stock: 4 },
      ],
    },
    {
      slug: 'minimalist-embroidered-cap',
      nameEn: 'BLACK ISLAND 3D Embroidered Cap',
      nameAr: 'كاب بلاك آيلاند تطريز ثلاثي الأبعاد',
      descEn: 'Premium 6-panel twill cap with 3D puff embroidery logo. Metal buckle strap adjustment.',
      descAr: 'كاب 6 طبقات قطن تويل مع تطريز بارز لشعار بلاك آيلاند ومشتاك معدني خلفي.',
      price: 95000,
      salePrice: null,
      sku: 'BI-CAP-005',
      featured: false,
      isNew: true,
      isSale: false,
      categorySlug: 'caps',
      images: [
        { url: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?q=80&w=1000&auto=format&fit=crop', isMain: true, order: 0 },
      ],
      variants: [
        { size: 'One Size', colorName: 'Jet Black', colorHex: '#000000', stock: 35 },
        { size: 'One Size', colorName: 'Slate Gray', colorHex: '#475569', stock: 20 },
      ],
    },
    {
      slug: 'signature-sweatshirt-charcoal',
      nameEn: 'Minimalist Heavyweight Sweatshirt',
      nameAr: 'سويت شيرت أوفرسايز قطن ثقيل',
      descEn: 'Clean cut heavyweight sweatshirt with ribbed collar and cuffs. Ideal layering essential for Damascus evenings.',
      descAr: 'سويت شيرت بياقة وأسورة محبوكة. قطعة أساسية للأمسيات الباردة.',
      price: 310000,
      salePrice: 275000,
      sku: 'BI-SW-006',
      featured: false,
      isNew: false,
      isSale: true,
      categorySlug: 'hoodies',
      images: [
        { url: 'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?q=80&w=1000&auto=format&fit=crop', isMain: true, order: 0 },
      ],
      variants: [
        { size: 'M', colorName: 'Charcoal', colorHex: '#2d2d2d', stock: 14 },
        { size: 'L', colorName: 'Charcoal', colorHex: '#2d2d2d', stock: 18 },
        { size: 'XL', colorName: 'Charcoal', colorHex: '#2d2d2d', stock: 9 },
      ],
    },
    {
      slug: 'oversized-streetwear-women-crop-hoodie',
      nameEn: 'BLACK ISLAND Women Crop Heavy Hoodie',
      nameAr: 'هودي نسائي كروب أوفرسايز',
      descEn: 'Tailored oversized cropped hoodie designed with heavyweight Turkish fleece cotton.',
      descAr: 'هودي نسائي أوفرسايز بقصة كروب عصرية ومصنع من القطن التركي الفاخر.',
      price: 330000,
      salePrice: 285000,
      sku: 'BI-WHD-007',
      featured: true,
      isNew: true,
      isSale: true,
      categorySlug: 'hoodies',
      images: [
        { url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000&auto=format&fit=crop', isMain: true, order: 0 },
      ],
      variants: [
        { size: 'S', colorName: 'Matte Black', colorHex: '#000000', stock: 10 },
        { size: 'M', colorName: 'Matte Black', colorHex: '#000000', stock: 15 },
        { size: 'L', colorName: 'Matte Black', colorHex: '#000000', stock: 8 },
      ],
    },
    {
      slug: 'vintage-washed-denim-jeans',
      nameEn: 'Obsidian Wide-Leg Denim Jeans',
      nameAr: 'بنطال جينز واسع مغسول بالحمض',
      descEn: 'Heavy 14oz Turkish denim relaxed fit with raw distress details.',
      descAr: 'جينز 14 أونصة قطن ثقيل بقصة واسعة وتفاصيل معتقة عصرية.',
      price: 360000,
      salePrice: null,
      sku: 'BI-JN-008',
      featured: false,
      isNew: true,
      isSale: false,
      categorySlug: 'pants',
      images: [
        { url: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=1000&auto=format&fit=crop', isMain: true, order: 0 },
      ],
      variants: [
        { size: 'S', colorName: 'Dark Indigo', colorHex: '#1e293b', stock: 7 },
        { size: 'M', colorName: 'Dark Indigo', colorHex: '#1e293b', stock: 12 },
        { size: 'L', colorName: 'Dark Indigo', colorHex: '#1e293b', stock: 15 },
      ],
    },
  ];

  for (const prod of products) {
    const { images, variants, ...prodData } = prod;
    const createdProduct = await prisma.product.create({
      data: prodData,
    });

    for (const img of images) {
      await prisma.productImage.create({
        data: {
          productId: createdProduct.id,
          ...img,
        },
      });
    }

    for (const v of variants) {
      await prisma.productVariant.create({
        data: {
          productId: createdProduct.id,
          ...v,
        },
      });
    }
  }

  // Seed Banners
  await prisma.banner.create({
    data: {
      titleEn: 'THE TURKISH DROP • DAMASCUS EXCLUSIVE',
      titleAr: 'التشكيلة التركية الفاخرة • حصرياً في دمشق',
      subtitleEn: 'Heavyweight cottons & tailored streetwear silhouettes imported direct from Turkey.',
      subtitleAr: 'قطنيات ثقيلة وتصاميم ستريت وير مستوردة مباشرة من تركيا.',
      imageUrl: 'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?q=80&w=1600&auto=format&fit=crop',
      buttonTextEn: 'EXPLORE DROP',
      buttonTextAr: 'تسوق الآن',
      link: '/shop',
      order: 1,
    },
  });

  // Seed Coupons
  await prisma.coupon.create({
    data: {
      code: 'BLACKISLAND10',
      type: 'PERCENTAGE',
      value: 10,
      minOrder: 200000,
      isActive: true,
    },
  });

  await prisma.coupon.create({
    data: {
      code: 'QUDSAYA50',
      type: 'FIXED',
      value: 50000,
      minOrder: 400000,
      isActive: true,
    },
  });

  // Seed Store Settings
  const defaultSettings = [
    { key: 'storeName', value: 'BLACK ISLAND' },
    { key: 'phone', value: '0938098917' },
    { key: 'whatsapp', value: '0938098917' },
    { key: 'instagram', value: '@black_islandd_fashion' },
    { key: 'address', value: 'Damascus, Syria – Qudsaya' },
    { key: 'currency', value: 'SYP' },
    { key: 'exchangeRateUSD', value: '15000' },
    { key: 'feeDamascus', value: '15000' },
    { key: 'feeRuralDamascus', value: '15000' },
    { key: 'feeOtherGov', value: '25000' },
  ];

  for (const s of defaultSettings) {
    await prisma.storeSetting.create({ data: s });
  }

  // Seed 3D Showcases
  await prisma.showcase3D.create({
    data: {
      key: 'hero',
      titleEn: 'BLACK ISLAND Hero Emblem',
      titleAr: 'شعار بلاك آيلاند الثلاثي الأبعاد',
      modelUrl: null,
      imageUrl: '/logo.png',
      positionX: 0,
      positionY: 0,
      positionZ: 0,
      scale: 1.0,
      rotationSpeed: 0.005,
      autoRotate: true,
      mouseInteraction: true,
      floatingAnim: true,
      lightingPower: 1.5,
      cameraDistance: 5.0,
      isActive: true,
    },
  });

  await prisma.showcase3D.create({
    data: {
      key: 'sneaker',
      titleEn: 'BLACK ISLAND Hyper Sneaker 360',
      titleAr: 'سنيكرز بلاك آيلاند 360 درجة',
      modelUrl: null,
      imageUrl: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?q=80&w=1000',
      positionX: 0,
      positionY: 0,
      positionZ: 0,
      scale: 1.2,
      rotationSpeed: 0.008,
      autoRotate: true,
      mouseInteraction: true,
      floatingAnim: true,
      lightingPower: 2.0,
      cameraDistance: 4.5,
      isActive: true,
    },
  });

  console.log('Database seeded successfully with rich demo catalog!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
