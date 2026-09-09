import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding full production BLACK ISLAND catalog (34 products)...');

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
  const adminsData = [
  {
    "id": "ab797ac4-b29a-4edc-ae06-db9cdfeb2a10",
    "email": "admin@blackisland.sy",
    "passwordHash": "admin123",
    "name": "Black Island Admin",
    "role": "ADMIN",
    "createdAt": "2026-08-27T23:29:03.181Z"
  }
];
  for (const item of adminsData) {
    await prisma.admin.create({ data: item });
  }

  // 2. Categories
  console.log('Seeding categories...');
  const categoriesData = [
  {
    "id": "5db1d456-c716-41c2-841e-b0e2f3d4dd97",
    "slug": "hoodies-sweatshirts",
    "nameEn": "Hoodies & Sweatshirts",
    "nameAr": "الهوديات والسويت شيرت",
    "descriptionEn": "Heavyweight cotton oversized hoodies imported from Turkey.",
    "descriptionAr": "هوديات قطن ثقيل أوفرسايز صُنعت في تركيا.",
    "image": "/uploads/1788714716075-photo_2026-09-06_10-11-09.jpg",
    "order": 1,
    "isHidden": false,
    "createdAt": "2026-08-27T23:29:03.192Z"
  },
  {
    "id": "9836ec41-76d8-44f8-8abc-93e271d42b4d",
    "slug": "t-shirts-oversized",
    "nameEn": "T-Shirts & Oversized",
    "nameAr": "التيشيرتات والأوفرسايز",
    "descriptionEn": "Drop-shoulder street tees with high-density graphics.",
    "descriptionAr": "تيشيرتات أكتاف منسدلة وطباعة عالية الدقة.",
    "image": "/uploads/1788715207412-photo_2026-09-06_10-19-47.jpg",
    "order": 2,
    "isHidden": false,
    "createdAt": "2026-08-27T23:29:03.198Z"
  },
  {
    "id": "9b404cb4-9238-4973-a50b-48e3a3941540",
    "slug": "pants-cargo",
    "nameEn": "Pants & Cargo",
    "nameAr": "البناطيل والكارغو",
    "descriptionEn": "Tactical cargo pants and relaxed streetwear trousers.",
    "descriptionAr": "بناطيل كارغو تكتيكية وقصات ستريت وير مريحة.",
    "image": "/uploads/1788714995710-photo_2026-09-06_10-16-16.jpg",
    "order": 3,
    "isHidden": false,
    "createdAt": "2026-08-27T23:29:03.203Z"
  },
  {
    "id": "8318c01b-ae44-426f-a627-a962db2cbe74",
    "slug": "sneakers-shoes",
    "nameEn": "Sneakers & Shoes",
    "nameAr": "الأحذية والسنيكرز",
    "descriptionEn": "Premium luxury sneakers and chunky street silhouettes.",
    "descriptionAr": "سنيكرز فاخرة وقصات متميزة للشارع.",
    "image": "/uploads/1788714919977-photo_2026-09-06_10-14-27.jpg",
    "order": 4,
    "isHidden": false,
    "createdAt": "2026-08-27T23:29:03.209Z"
  },
  {
    "id": "df3c69fa-83a4-4d44-ad1e-0fbc94741251",
    "slug": "caps",
    "nameEn": "Caps & Accessories",
    "nameAr": "القبعات والإكسسوارات",
    "descriptionEn": "Embroidered dad hats, beanies, and silver jewelry.",
    "descriptionAr": "قبعات مطرزة، طواقي، وإكسسوارات أنيقة.",
    "image": "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?q=80&w=1000&auto=format&fit=crop",
    "order": 5,
    "isHidden": false,
    "createdAt": "2026-08-27T23:29:03.212Z"
  },
  {
    "id": "451c1e83-df4e-4eaf-a34c-c7cbb9fd8606",
    "slug": "shorts",
    "nameEn": "Shorts",
    "nameAr": "الشورتات",
    "descriptionEn": null,
    "descriptionAr": null,
    "image": "/uploads/1788714731177-photo_2026-09-06_10-07-51.jpg",
    "order": 6,
    "isHidden": false,
    "createdAt": "2026-09-06T16:50:58.868Z"
  }
];
  for (const item of categoriesData) {
    await prisma.category.create({ data: item });
  }

  // 3. Products with Images and Variants
  console.log('Seeding products, images, and variants...');
  const productsData = [
  {
    "id": "sneaker-nike-tn",
    "slug": "nike-tn",
    "nameEn": "Nike Tn",
    "nameAr": "Nike Tn",
    "descEn": "Iconic Nike Tn Air Max sneakers available in 4 distinct colorways.",
    "descAr": "حذاء سنيكرز نايكي تي إن الرياضي الفاخر بـ 4 ألوان مميزة.",
    "price": 45,
    "salePrice": null,
    "sku": "BI-NIKE-TN",
    "featured": true,
    "isNew": true,
    "isSale": false,
    "isActive": true,
    "categorySlug": "sneakers-shoes",
    "createdAt": "2026-09-09T15:48:22.379Z",
    "updatedAt": "2026-09-09T15:48:22.380Z",
    "images": [
      {
        "id": "img-niketn-1",
        "productId": "sneaker-nike-tn",
        "url": "/uploads/nike_tn_purple_pink_black_1788968784810.jpg",
        "isMain": true,
        "order": 0
      },
      {
        "id": "img-niketn-2",
        "productId": "sneaker-nike-tn",
        "url": "/uploads/nike_tn_blue_black_1788968784815.jpg",
        "isMain": false,
        "order": 1
      },
      {
        "id": "img-niketn-3",
        "productId": "sneaker-nike-tn",
        "url": "/uploads/nike_tn_black_offwhite_1788968784818.jpg",
        "isMain": false,
        "order": 2
      },
      {
        "id": "img-niketn-4",
        "productId": "sneaker-nike-tn",
        "url": "/uploads/nike_tn_cyan_black_1788968784819.jpg",
        "isMain": false,
        "order": 3
      }
    ],
    "variants": [
      {
        "id": "var-niketn-0-41",
        "productId": "sneaker-nike-tn",
        "size": "41",
        "colorName": "Purple / Pink / Black",
        "colorHex": "#8A2BE2",
        "colorImage": "/uploads/nike_tn_purple_pink_black_1788968784810.jpg",
        "colorImages": "/uploads/nike_tn_purple_pink_black_1788968784810.jpg",
        "stock": 15
      },
      {
        "id": "var-niketn-0-42",
        "productId": "sneaker-nike-tn",
        "size": "42",
        "colorName": "Purple / Pink / Black",
        "colorHex": "#8A2BE2",
        "colorImage": "/uploads/nike_tn_purple_pink_black_1788968784810.jpg",
        "colorImages": "/uploads/nike_tn_purple_pink_black_1788968784810.jpg",
        "stock": 15
      },
      {
        "id": "var-niketn-0-43",
        "productId": "sneaker-nike-tn",
        "size": "43",
        "colorName": "Purple / Pink / Black",
        "colorHex": "#8A2BE2",
        "colorImage": "/uploads/nike_tn_purple_pink_black_1788968784810.jpg",
        "colorImages": "/uploads/nike_tn_purple_pink_black_1788968784810.jpg",
        "stock": 15
      },
      {
        "id": "var-niketn-0-44",
        "productId": "sneaker-nike-tn",
        "size": "44",
        "colorName": "Purple / Pink / Black",
        "colorHex": "#8A2BE2",
        "colorImage": "/uploads/nike_tn_purple_pink_black_1788968784810.jpg",
        "colorImages": "/uploads/nike_tn_purple_pink_black_1788968784810.jpg",
        "stock": 15
      },
      {
        "id": "var-niketn-0-45",
        "productId": "sneaker-nike-tn",
        "size": "45",
        "colorName": "Purple / Pink / Black",
        "colorHex": "#8A2BE2",
        "colorImage": "/uploads/nike_tn_purple_pink_black_1788968784810.jpg",
        "colorImages": "/uploads/nike_tn_purple_pink_black_1788968784810.jpg",
        "stock": 15
      },
      {
        "id": "var-niketn-1-41",
        "productId": "sneaker-nike-tn",
        "size": "41",
        "colorName": "Blue / Black",
        "colorHex": "#1E90FF",
        "colorImage": "/uploads/nike_tn_blue_black_1788968784815.jpg",
        "colorImages": "/uploads/nike_tn_blue_black_1788968784815.jpg",
        "stock": 15
      },
      {
        "id": "var-niketn-1-42",
        "productId": "sneaker-nike-tn",
        "size": "42",
        "colorName": "Blue / Black",
        "colorHex": "#1E90FF",
        "colorImage": "/uploads/nike_tn_blue_black_1788968784815.jpg",
        "colorImages": "/uploads/nike_tn_blue_black_1788968784815.jpg",
        "stock": 15
      },
      {
        "id": "var-niketn-1-43",
        "productId": "sneaker-nike-tn",
        "size": "43",
        "colorName": "Blue / Black",
        "colorHex": "#1E90FF",
        "colorImage": "/uploads/nike_tn_blue_black_1788968784815.jpg",
        "colorImages": "/uploads/nike_tn_blue_black_1788968784815.jpg",
        "stock": 15
      },
      {
        "id": "var-niketn-1-44",
        "productId": "sneaker-nike-tn",
        "size": "44",
        "colorName": "Blue / Black",
        "colorHex": "#1E90FF",
        "colorImage": "/uploads/nike_tn_blue_black_1788968784815.jpg",
        "colorImages": "/uploads/nike_tn_blue_black_1788968784815.jpg",
        "stock": 15
      },
      {
        "id": "var-niketn-1-45",
        "productId": "sneaker-nike-tn",
        "size": "45",
        "colorName": "Blue / Black",
        "colorHex": "#1E90FF",
        "colorImage": "/uploads/nike_tn_blue_black_1788968784815.jpg",
        "colorImages": "/uploads/nike_tn_blue_black_1788968784815.jpg",
        "stock": 15
      },
      {
        "id": "var-niketn-2-41",
        "productId": "sneaker-nike-tn",
        "size": "41",
        "colorName": "Black / off-White",
        "colorHex": "#F5F5DC",
        "colorImage": "/uploads/nike_tn_black_offwhite_1788968784818.jpg",
        "colorImages": "/uploads/nike_tn_black_offwhite_1788968784818.jpg",
        "stock": 15
      },
      {
        "id": "var-niketn-2-42",
        "productId": "sneaker-nike-tn",
        "size": "42",
        "colorName": "Black / off-White",
        "colorHex": "#F5F5DC",
        "colorImage": "/uploads/nike_tn_black_offwhite_1788968784818.jpg",
        "colorImages": "/uploads/nike_tn_black_offwhite_1788968784818.jpg",
        "stock": 15
      },
      {
        "id": "var-niketn-2-43",
        "productId": "sneaker-nike-tn",
        "size": "43",
        "colorName": "Black / off-White",
        "colorHex": "#F5F5DC",
        "colorImage": "/uploads/nike_tn_black_offwhite_1788968784818.jpg",
        "colorImages": "/uploads/nike_tn_black_offwhite_1788968784818.jpg",
        "stock": 15
      },
      {
        "id": "var-niketn-2-44",
        "productId": "sneaker-nike-tn",
        "size": "44",
        "colorName": "Black / off-White",
        "colorHex": "#F5F5DC",
        "colorImage": "/uploads/nike_tn_black_offwhite_1788968784818.jpg",
        "colorImages": "/uploads/nike_tn_black_offwhite_1788968784818.jpg",
        "stock": 15
      },
      {
        "id": "var-niketn-2-45",
        "productId": "sneaker-nike-tn",
        "size": "45",
        "colorName": "Black / off-White",
        "colorHex": "#F5F5DC",
        "colorImage": "/uploads/nike_tn_black_offwhite_1788968784818.jpg",
        "colorImages": "/uploads/nike_tn_black_offwhite_1788968784818.jpg",
        "stock": 15
      },
      {
        "id": "var-niketn-3-41",
        "productId": "sneaker-nike-tn",
        "size": "41",
        "colorName": "Cyan / Black",
        "colorHex": "#00FFFF",
        "colorImage": "/uploads/nike_tn_cyan_black_1788968784819.jpg",
        "colorImages": "/uploads/nike_tn_cyan_black_1788968784819.jpg",
        "stock": 15
      },
      {
        "id": "var-niketn-3-42",
        "productId": "sneaker-nike-tn",
        "size": "42",
        "colorName": "Cyan / Black",
        "colorHex": "#00FFFF",
        "colorImage": "/uploads/nike_tn_cyan_black_1788968784819.jpg",
        "colorImages": "/uploads/nike_tn_cyan_black_1788968784819.jpg",
        "stock": 15
      },
      {
        "id": "var-niketn-3-43",
        "productId": "sneaker-nike-tn",
        "size": "43",
        "colorName": "Cyan / Black",
        "colorHex": "#00FFFF",
        "colorImage": "/uploads/nike_tn_cyan_black_1788968784819.jpg",
        "colorImages": "/uploads/nike_tn_cyan_black_1788968784819.jpg",
        "stock": 15
      },
      {
        "id": "var-niketn-3-44",
        "productId": "sneaker-nike-tn",
        "size": "44",
        "colorName": "Cyan / Black",
        "colorHex": "#00FFFF",
        "colorImage": "/uploads/nike_tn_cyan_black_1788968784819.jpg",
        "colorImages": "/uploads/nike_tn_cyan_black_1788968784819.jpg",
        "stock": 15
      },
      {
        "id": "var-niketn-3-45",
        "productId": "sneaker-nike-tn",
        "size": "45",
        "colorName": "Cyan / Black",
        "colorHex": "#00FFFF",
        "colorImage": "/uploads/nike_tn_cyan_black_1788968784819.jpg",
        "colorImages": "/uploads/nike_tn_cyan_black_1788968784819.jpg",
        "stock": 15
      }
    ]
  },
  {
    "id": "sneaker-jordan4-retro-high",
    "slug": "jordan-4-retro-high",
    "nameEn": "Jordan 4 Retro High",
    "nameAr": "Jordan 4 Retro High",
    "descEn": "Iconic Jordan 4 Retro High in premium White and Grey leather silhouette.",
    "descAr": "حذاء سنيكرز جوردان 4 ريترو هاي الفاخر باللون الأبيض والرمادي.",
    "price": 45,
    "salePrice": null,
    "sku": "BI-JDN4-RETRO",
    "featured": true,
    "isNew": true,
    "isSale": false,
    "isActive": true,
    "categorySlug": "sneakers-shoes",
    "createdAt": "2026-09-09T15:04:15.704Z",
    "updatedAt": "2026-09-09T15:04:15.705Z",
    "images": [
      {
        "id": "img-jdn4-1",
        "productId": "sneaker-jordan4-retro-high",
        "url": "/uploads/jordan4_retro_high_1_1788966151161.jpg",
        "isMain": true,
        "order": 0
      },
      {
        "id": "img-jdn4-2",
        "productId": "sneaker-jordan4-retro-high",
        "url": "/uploads/jordan4_retro_high_2_1788966151166.jpg",
        "isMain": false,
        "order": 1
      },
      {
        "id": "img-jdn4-3",
        "productId": "sneaker-jordan4-retro-high",
        "url": "/uploads/jordan4_retro_high_3_1788966151167.jpg",
        "isMain": false,
        "order": 2
      }
    ],
    "variants": [
      {
        "id": "var-jdn4-41",
        "productId": "sneaker-jordan4-retro-high",
        "size": "41",
        "colorName": "White and Grey",
        "colorHex": "#E5E5E5",
        "colorImage": "/uploads/jordan4_retro_high_1_1788966151161.jpg",
        "colorImages": "/uploads/jordan4_retro_high_1_1788966151161.jpg,/uploads/jordan4_retro_high_2_1788966151166.jpg,/uploads/jordan4_retro_high_3_1788966151167.jpg",
        "stock": 15
      },
      {
        "id": "var-jdn4-42",
        "productId": "sneaker-jordan4-retro-high",
        "size": "42",
        "colorName": "White and Grey",
        "colorHex": "#E5E5E5",
        "colorImage": "/uploads/jordan4_retro_high_1_1788966151161.jpg",
        "colorImages": "/uploads/jordan4_retro_high_1_1788966151161.jpg,/uploads/jordan4_retro_high_2_1788966151166.jpg,/uploads/jordan4_retro_high_3_1788966151167.jpg",
        "stock": 15
      },
      {
        "id": "var-jdn4-43",
        "productId": "sneaker-jordan4-retro-high",
        "size": "43",
        "colorName": "White and Grey",
        "colorHex": "#E5E5E5",
        "colorImage": "/uploads/jordan4_retro_high_1_1788966151161.jpg",
        "colorImages": "/uploads/jordan4_retro_high_1_1788966151161.jpg,/uploads/jordan4_retro_high_2_1788966151166.jpg,/uploads/jordan4_retro_high_3_1788966151167.jpg",
        "stock": 15
      },
      {
        "id": "var-jdn4-44",
        "productId": "sneaker-jordan4-retro-high",
        "size": "44",
        "colorName": "White and Grey",
        "colorHex": "#E5E5E5",
        "colorImage": "/uploads/jordan4_retro_high_1_1788966151161.jpg",
        "colorImages": "/uploads/jordan4_retro_high_1_1788966151161.jpg,/uploads/jordan4_retro_high_2_1788966151166.jpg,/uploads/jordan4_retro_high_3_1788966151167.jpg",
        "stock": 15
      },
      {
        "id": "var-jdn4-45",
        "productId": "sneaker-jordan4-retro-high",
        "size": "45",
        "colorName": "White and Grey",
        "colorHex": "#E5E5E5",
        "colorImage": "/uploads/jordan4_retro_high_1_1788966151161.jpg",
        "colorImages": "/uploads/jordan4_retro_high_1_1788966151161.jpg,/uploads/jordan4_retro_high_2_1788966151166.jpg,/uploads/jordan4_retro_high_3_1788966151167.jpg",
        "stock": 15
      }
    ]
  },
  {
    "id": "edcaa936-c0ae-4b3c-b6b5-737c2c82db5e",
    "slug": "stwd-shorts-628",
    "nameEn": "STWD Shorts",
    "nameAr": "STWD Shorts",
    "descEn": "",
    "descAr": "",
    "price": 14,
    "salePrice": null,
    "sku": "BI-DROP-3470",
    "featured": true,
    "isNew": true,
    "isSale": false,
    "isActive": true,
    "categorySlug": "shorts",
    "createdAt": "2026-09-06T16:57:40.741Z",
    "updatedAt": "2026-09-06T16:57:40.741Z",
    "images": [
      {
        "id": "80e3efcf-6098-4325-ad74-bde12db165b7",
        "productId": "edcaa936-c0ae-4b3c-b6b5-737c2c82db5e",
        "url": "/uploads/1788713832540-photo_2026-08-30_08-56-59.jpg",
        "isMain": true,
        "order": 0
      }
    ],
    "variants": [
      {
        "id": "ff21905b-4340-40c0-9e23-afe95d49a0e2",
        "productId": "edcaa936-c0ae-4b3c-b6b5-737c2c82db5e",
        "size": "S",
        "colorName": "Black and Grey",
        "colorHex": "#1a1a1a",
        "colorImage": "/uploads/1788713832540-photo_2026-08-30_08-56-59.jpg",
        "colorImages": "/uploads/1788713832540-photo_2026-08-30_08-56-59.jpg",
        "stock": 10
      },
      {
        "id": "446c4f7c-e006-4fd5-be2a-1c0c2dd8cfce",
        "productId": "edcaa936-c0ae-4b3c-b6b5-737c2c82db5e",
        "size": "M",
        "colorName": "Black and Grey",
        "colorHex": "#1a1a1a",
        "colorImage": "/uploads/1788713832540-photo_2026-08-30_08-56-59.jpg",
        "colorImages": "/uploads/1788713832540-photo_2026-08-30_08-56-59.jpg",
        "stock": 15
      },
      {
        "id": "7dc7c913-f87e-41d7-b993-ded9a0697121",
        "productId": "edcaa936-c0ae-4b3c-b6b5-737c2c82db5e",
        "size": "L",
        "colorName": "Black and Grey",
        "colorHex": "#1a1a1a",
        "colorImage": "/uploads/1788713832540-photo_2026-08-30_08-56-59.jpg",
        "colorImages": "/uploads/1788713832540-photo_2026-08-30_08-56-59.jpg",
        "stock": 20
      },
      {
        "id": "1195441a-6004-4bb9-aca5-cae19d077cc9",
        "productId": "edcaa936-c0ae-4b3c-b6b5-737c2c82db5e",
        "size": "XL",
        "colorName": "Black and Grey",
        "colorHex": "#1a1a1a",
        "colorImage": "/uploads/1788713832540-photo_2026-08-30_08-56-59.jpg",
        "colorImages": "/uploads/1788713832540-photo_2026-08-30_08-56-59.jpg",
        "stock": 15
      },
      {
        "id": "6d567039-a94d-4698-b880-05bd6c0e2161",
        "productId": "edcaa936-c0ae-4b3c-b6b5-737c2c82db5e",
        "size": "XXL",
        "colorName": "Black and Grey",
        "colorHex": "#1a1a1a",
        "colorImage": "/uploads/1788713832540-photo_2026-08-30_08-56-59.jpg",
        "colorImages": "/uploads/1788713832540-photo_2026-08-30_08-56-59.jpg",
        "stock": 15
      }
    ],
    "category": {
      "id": "451c1e83-df4e-4eaf-a34c-c7cbb9fd8606",
      "slug": "shorts",
      "nameEn": "Shorts",
      "nameAr": "الشورتات",
      "descriptionEn": null,
      "descriptionAr": null,
      "image": "/uploads/1788714731177-photo_2026-09-06_10-07-51.jpg",
      "order": 6,
      "isHidden": false,
      "createdAt": "2026-09-06T16:50:58.868Z"
    }
  },
  {
    "id": "1cf0ff53-1e21-46d0-95e3-2970dcdbbf53",
    "slug": "nike-shorts-900",
    "nameEn": "NIKE Shorts",
    "nameAr": "NIKE Shorts",
    "descEn": "",
    "descAr": "",
    "price": 14,
    "salePrice": null,
    "sku": "BI-DROP-9825",
    "featured": true,
    "isNew": true,
    "isSale": false,
    "isActive": true,
    "categorySlug": "shorts",
    "createdAt": "2026-09-06T16:56:43.826Z",
    "updatedAt": "2026-09-06T16:56:43.826Z",
    "images": [
      {
        "id": "e4204cfc-5940-4441-bfd8-0a691078c830",
        "productId": "1cf0ff53-1e21-46d0-95e3-2970dcdbbf53",
        "url": "/uploads/1788713766871-photo_2026-08-30_08-56-56.jpg",
        "isMain": true,
        "order": 0
      }
    ],
    "variants": [
      {
        "id": "43cfd9f1-56b6-45f7-86ec-2fcece6f0b81",
        "productId": "1cf0ff53-1e21-46d0-95e3-2970dcdbbf53",
        "size": "S",
        "colorName": "Grey",
        "colorHex": "#c4c4c4",
        "colorImage": "/uploads/1788713766871-photo_2026-08-30_08-56-56.jpg",
        "colorImages": "/uploads/1788713766871-photo_2026-08-30_08-56-56.jpg",
        "stock": 10
      },
      {
        "id": "6f0f7987-5e9c-419c-8f66-d06dc11c258d",
        "productId": "1cf0ff53-1e21-46d0-95e3-2970dcdbbf53",
        "size": "M",
        "colorName": "Grey",
        "colorHex": "#c4c4c4",
        "colorImage": "/uploads/1788713766871-photo_2026-08-30_08-56-56.jpg",
        "colorImages": "/uploads/1788713766871-photo_2026-08-30_08-56-56.jpg",
        "stock": 15
      },
      {
        "id": "ad3b17d3-9ad3-4165-87a9-42d1bd402fbb",
        "productId": "1cf0ff53-1e21-46d0-95e3-2970dcdbbf53",
        "size": "L",
        "colorName": "Grey",
        "colorHex": "#c4c4c4",
        "colorImage": "/uploads/1788713766871-photo_2026-08-30_08-56-56.jpg",
        "colorImages": "/uploads/1788713766871-photo_2026-08-30_08-56-56.jpg",
        "stock": 20
      },
      {
        "id": "cdb7c742-eafc-4741-99c2-1812298373cd",
        "productId": "1cf0ff53-1e21-46d0-95e3-2970dcdbbf53",
        "size": "XL",
        "colorName": "Grey",
        "colorHex": "#c4c4c4",
        "colorImage": "/uploads/1788713766871-photo_2026-08-30_08-56-56.jpg",
        "colorImages": "/uploads/1788713766871-photo_2026-08-30_08-56-56.jpg",
        "stock": 15
      },
      {
        "id": "863274e9-32a4-42e9-84e5-6863cf27e286",
        "productId": "1cf0ff53-1e21-46d0-95e3-2970dcdbbf53",
        "size": "XXL",
        "colorName": "Grey",
        "colorHex": "#c4c4c4",
        "colorImage": "/uploads/1788713766871-photo_2026-08-30_08-56-56.jpg",
        "colorImages": "/uploads/1788713766871-photo_2026-08-30_08-56-56.jpg",
        "stock": 15
      }
    ],
    "category": {
      "id": "451c1e83-df4e-4eaf-a34c-c7cbb9fd8606",
      "slug": "shorts",
      "nameEn": "Shorts",
      "nameAr": "الشورتات",
      "descriptionEn": null,
      "descriptionAr": null,
      "image": "/uploads/1788714731177-photo_2026-09-06_10-07-51.jpg",
      "order": 6,
      "isHidden": false,
      "createdAt": "2026-09-06T16:50:58.868Z"
    }
  },
  {
    "id": "ee9ae3ae-6e73-40a2-a762-2e7d997af0a9",
    "slug": "nike-shorts-347",
    "nameEn": "NIKE Shorts",
    "nameAr": "NIKE Shorts",
    "descEn": "",
    "descAr": "",
    "price": 14,
    "salePrice": null,
    "sku": "BI-DROP-4340",
    "featured": true,
    "isNew": true,
    "isSale": false,
    "isActive": true,
    "categorySlug": "shorts",
    "createdAt": "2026-09-06T16:55:31.437Z",
    "updatedAt": "2026-09-06T16:55:31.437Z",
    "images": [
      {
        "id": "c8cdf37f-8d40-4a7c-b80e-db0b7956d849",
        "productId": "ee9ae3ae-6e73-40a2-a762-2e7d997af0a9",
        "url": "/uploads/1788713708201-photo_2026-08-30_08-56-53.jpg",
        "isMain": true,
        "order": 0
      }
    ],
    "variants": [
      {
        "id": "5fb22150-8310-42b1-913f-8e5219b7e7e9",
        "productId": "ee9ae3ae-6e73-40a2-a762-2e7d997af0a9",
        "size": "S",
        "colorName": "Grey and Black",
        "colorHex": "#5c5c5c",
        "colorImage": "/uploads/1788713708201-photo_2026-08-30_08-56-53.jpg",
        "colorImages": "/uploads/1788713708201-photo_2026-08-30_08-56-53.jpg",
        "stock": 10
      },
      {
        "id": "b33b8d66-cfbd-49e9-ad1f-7f26ef708940",
        "productId": "ee9ae3ae-6e73-40a2-a762-2e7d997af0a9",
        "size": "M",
        "colorName": "Grey and Black",
        "colorHex": "#5c5c5c",
        "colorImage": "/uploads/1788713708201-photo_2026-08-30_08-56-53.jpg",
        "colorImages": "/uploads/1788713708201-photo_2026-08-30_08-56-53.jpg",
        "stock": 15
      },
      {
        "id": "88d36e80-d340-41d9-9268-7be7b5ec7bfc",
        "productId": "ee9ae3ae-6e73-40a2-a762-2e7d997af0a9",
        "size": "L",
        "colorName": "Grey and Black",
        "colorHex": "#5c5c5c",
        "colorImage": "/uploads/1788713708201-photo_2026-08-30_08-56-53.jpg",
        "colorImages": "/uploads/1788713708201-photo_2026-08-30_08-56-53.jpg",
        "stock": 20
      },
      {
        "id": "5e4c9423-5cc8-4e56-b6e1-4ddf327c1e9c",
        "productId": "ee9ae3ae-6e73-40a2-a762-2e7d997af0a9",
        "size": "XL",
        "colorName": "Grey and Black",
        "colorHex": "#5c5c5c",
        "colorImage": "/uploads/1788713708201-photo_2026-08-30_08-56-53.jpg",
        "colorImages": "/uploads/1788713708201-photo_2026-08-30_08-56-53.jpg",
        "stock": 15
      },
      {
        "id": "5088b59f-589a-42fb-8ec8-c4ef2fd80830",
        "productId": "ee9ae3ae-6e73-40a2-a762-2e7d997af0a9",
        "size": "XXL",
        "colorName": "Grey and Black",
        "colorHex": "#5c5c5c",
        "colorImage": "/uploads/1788713708201-photo_2026-08-30_08-56-53.jpg",
        "colorImages": "/uploads/1788713708201-photo_2026-08-30_08-56-53.jpg",
        "stock": 15
      }
    ],
    "category": {
      "id": "451c1e83-df4e-4eaf-a34c-c7cbb9fd8606",
      "slug": "shorts",
      "nameEn": "Shorts",
      "nameAr": "الشورتات",
      "descriptionEn": null,
      "descriptionAr": null,
      "image": "/uploads/1788714731177-photo_2026-09-06_10-07-51.jpg",
      "order": 6,
      "isHidden": false,
      "createdAt": "2026-09-06T16:50:58.868Z"
    }
  },
  {
    "id": "2fcd1e35-9eb8-466d-a014-3744c997759c",
    "slug": "jordan-shorts-607",
    "nameEn": "JORDAN Shorts",
    "nameAr": "JORDAN Shorts",
    "descEn": "",
    "descAr": "",
    "price": 14,
    "salePrice": null,
    "sku": "BI-DROP-1438",
    "featured": true,
    "isNew": true,
    "isSale": false,
    "isActive": true,
    "categorySlug": "shorts",
    "createdAt": "2026-09-06T16:53:23.666Z",
    "updatedAt": "2026-09-06T16:53:23.666Z",
    "images": [
      {
        "id": "c9b63527-6c1a-4cb9-a47d-79a98ac9778a",
        "productId": "2fcd1e35-9eb8-466d-a014-3744c997759c",
        "url": "/uploads/1788713495517-photo_2026-08-30_08-56-35.jpg",
        "isMain": true,
        "order": 0
      },
      {
        "id": "46f24ff7-66be-4c33-b4e5-63bbf0700687",
        "productId": "2fcd1e35-9eb8-466d-a014-3744c997759c",
        "url": "/uploads/1788713561173-photo_2026-08-30_08-56-38.jpg",
        "isMain": false,
        "order": 1
      }
    ],
    "variants": [
      {
        "id": "06fcfda3-0186-4327-a680-a4a13d30e14e",
        "productId": "2fcd1e35-9eb8-466d-a014-3744c997759c",
        "size": "S",
        "colorName": "Grey and White",
        "colorHex": "#bfbfbf",
        "colorImage": "/uploads/1788713495517-photo_2026-08-30_08-56-35.jpg",
        "colorImages": "/uploads/1788713495517-photo_2026-08-30_08-56-35.jpg",
        "stock": 15
      },
      {
        "id": "b7824515-6880-4156-ae34-8f7c5c5bd359",
        "productId": "2fcd1e35-9eb8-466d-a014-3744c997759c",
        "size": "M",
        "colorName": "Grey and White",
        "colorHex": "#bfbfbf",
        "colorImage": "/uploads/1788713495517-photo_2026-08-30_08-56-35.jpg",
        "colorImages": "/uploads/1788713495517-photo_2026-08-30_08-56-35.jpg",
        "stock": 15
      },
      {
        "id": "fe734b16-3e09-4bc1-9651-cd6c1c70300e",
        "productId": "2fcd1e35-9eb8-466d-a014-3744c997759c",
        "size": "L",
        "colorName": "Grey and White",
        "colorHex": "#bfbfbf",
        "colorImage": "/uploads/1788713495517-photo_2026-08-30_08-56-35.jpg",
        "colorImages": "/uploads/1788713495517-photo_2026-08-30_08-56-35.jpg",
        "stock": 15
      },
      {
        "id": "b1e972d7-b00c-42b5-baa1-6221fc572dbc",
        "productId": "2fcd1e35-9eb8-466d-a014-3744c997759c",
        "size": "XL",
        "colorName": "Grey and White",
        "colorHex": "#bfbfbf",
        "colorImage": "/uploads/1788713495517-photo_2026-08-30_08-56-35.jpg",
        "colorImages": "/uploads/1788713495517-photo_2026-08-30_08-56-35.jpg",
        "stock": 15
      },
      {
        "id": "72e5af3a-fd10-4efe-82ff-565a6f5832b5",
        "productId": "2fcd1e35-9eb8-466d-a014-3744c997759c",
        "size": "XXL",
        "colorName": "Grey and White",
        "colorHex": "#bfbfbf",
        "colorImage": "/uploads/1788713495517-photo_2026-08-30_08-56-35.jpg",
        "colorImages": "/uploads/1788713495517-photo_2026-08-30_08-56-35.jpg",
        "stock": 15
      },
      {
        "id": "777623a1-a359-4f18-bce1-15e05bbe19d4",
        "productId": "2fcd1e35-9eb8-466d-a014-3744c997759c",
        "size": "S",
        "colorName": "Black and White",
        "colorHex": "#ffffff",
        "colorImage": "/uploads/1788713561173-photo_2026-08-30_08-56-38.jpg",
        "colorImages": "/uploads/1788713561173-photo_2026-08-30_08-56-38.jpg",
        "stock": 10
      },
      {
        "id": "aaa9087c-c84e-4970-a3da-f50f35f2efb6",
        "productId": "2fcd1e35-9eb8-466d-a014-3744c997759c",
        "size": "M",
        "colorName": "Black and White",
        "colorHex": "#ffffff",
        "colorImage": "/uploads/1788713561173-photo_2026-08-30_08-56-38.jpg",
        "colorImages": "/uploads/1788713561173-photo_2026-08-30_08-56-38.jpg",
        "stock": 15
      },
      {
        "id": "a38d9b00-dcd6-4fe5-a6fc-d8404aba3ea0",
        "productId": "2fcd1e35-9eb8-466d-a014-3744c997759c",
        "size": "L",
        "colorName": "Black and White",
        "colorHex": "#ffffff",
        "colorImage": "/uploads/1788713561173-photo_2026-08-30_08-56-38.jpg",
        "colorImages": "/uploads/1788713561173-photo_2026-08-30_08-56-38.jpg",
        "stock": 20
      },
      {
        "id": "d6512223-ff64-4bec-9ae9-6d4a02875df1",
        "productId": "2fcd1e35-9eb8-466d-a014-3744c997759c",
        "size": "XL",
        "colorName": "Black and White",
        "colorHex": "#ffffff",
        "colorImage": "/uploads/1788713561173-photo_2026-08-30_08-56-38.jpg",
        "colorImages": "/uploads/1788713561173-photo_2026-08-30_08-56-38.jpg",
        "stock": 15
      },
      {
        "id": "371db9d8-dbca-438d-84f3-b74985333380",
        "productId": "2fcd1e35-9eb8-466d-a014-3744c997759c",
        "size": "XXL",
        "colorName": "Black and White",
        "colorHex": "#ffffff",
        "colorImage": "/uploads/1788713561173-photo_2026-08-30_08-56-38.jpg",
        "colorImages": "/uploads/1788713561173-photo_2026-08-30_08-56-38.jpg",
        "stock": 15
      }
    ],
    "category": {
      "id": "451c1e83-df4e-4eaf-a34c-c7cbb9fd8606",
      "slug": "shorts",
      "nameEn": "Shorts",
      "nameAr": "الشورتات",
      "descriptionEn": null,
      "descriptionAr": null,
      "image": "/uploads/1788714731177-photo_2026-09-06_10-07-51.jpg",
      "order": 6,
      "isHidden": false,
      "createdAt": "2026-09-06T16:50:58.868Z"
    }
  },
  {
    "id": "c90922a6-f7df-4b24-9a37-cf3526c8965b",
    "slug": "stwd-baggy-pants-707",
    "nameEn": "STWD Baggy Pants",
    "nameAr": "STWD Baggy Pants",
    "descEn": "",
    "descAr": "",
    "price": 20,
    "salePrice": null,
    "sku": "BI-DROP-6937",
    "featured": true,
    "isNew": true,
    "isSale": false,
    "isActive": true,
    "categorySlug": "pants-cargo",
    "createdAt": "2026-09-06T16:49:20.205Z",
    "updatedAt": "2026-09-06T16:49:20.205Z",
    "images": [
      {
        "id": "7e6630c5-33be-4e83-bdce-80659152cd49",
        "productId": "c90922a6-f7df-4b24-9a37-cf3526c8965b",
        "url": "/uploads/1788713330115-photo_2026-08-30_08-55-53.jpg",
        "isMain": true,
        "order": 0
      }
    ],
    "variants": [
      {
        "id": "d7ad37b3-cb20-4240-8bfe-9c91ff84aa1f",
        "productId": "c90922a6-f7df-4b24-9a37-cf3526c8965b",
        "size": "30",
        "colorName": "Black",
        "colorHex": "#000000",
        "colorImage": "/uploads/1788713330115-photo_2026-08-30_08-55-53.jpg",
        "colorImages": "/uploads/1788713330115-photo_2026-08-30_08-55-53.jpg",
        "stock": 15
      },
      {
        "id": "1d40ced6-91cc-4e2d-b5f5-5fcdcf2ebb85",
        "productId": "c90922a6-f7df-4b24-9a37-cf3526c8965b",
        "size": "31",
        "colorName": "Black",
        "colorHex": "#000000",
        "colorImage": "/uploads/1788713330115-photo_2026-08-30_08-55-53.jpg",
        "colorImages": "/uploads/1788713330115-photo_2026-08-30_08-55-53.jpg",
        "stock": 15
      },
      {
        "id": "6a3ab5a9-8ebf-4f78-900e-df586866553f",
        "productId": "c90922a6-f7df-4b24-9a37-cf3526c8965b",
        "size": "32",
        "colorName": "Black",
        "colorHex": "#000000",
        "colorImage": "/uploads/1788713330115-photo_2026-08-30_08-55-53.jpg",
        "colorImages": "/uploads/1788713330115-photo_2026-08-30_08-55-53.jpg",
        "stock": 15
      },
      {
        "id": "e437ffdf-00bf-4874-8efa-864aa4efac76",
        "productId": "c90922a6-f7df-4b24-9a37-cf3526c8965b",
        "size": "33",
        "colorName": "Black",
        "colorHex": "#000000",
        "colorImage": "/uploads/1788713330115-photo_2026-08-30_08-55-53.jpg",
        "colorImages": "/uploads/1788713330115-photo_2026-08-30_08-55-53.jpg",
        "stock": 15
      },
      {
        "id": "0b988ba1-2eb1-491d-9bcb-7320a280cc36",
        "productId": "c90922a6-f7df-4b24-9a37-cf3526c8965b",
        "size": "34",
        "colorName": "Black",
        "colorHex": "#000000",
        "colorImage": "/uploads/1788713330115-photo_2026-08-30_08-55-53.jpg",
        "colorImages": "/uploads/1788713330115-photo_2026-08-30_08-55-53.jpg",
        "stock": 15
      },
      {
        "id": "d6a72c14-f213-4497-abaa-507d6970485d",
        "productId": "c90922a6-f7df-4b24-9a37-cf3526c8965b",
        "size": "35",
        "colorName": "Black",
        "colorHex": "#000000",
        "colorImage": "/uploads/1788713330115-photo_2026-08-30_08-55-53.jpg",
        "colorImages": "/uploads/1788713330115-photo_2026-08-30_08-55-53.jpg",
        "stock": 15
      },
      {
        "id": "a08af00f-e193-4b7a-b120-d5182009953c",
        "productId": "c90922a6-f7df-4b24-9a37-cf3526c8965b",
        "size": "36",
        "colorName": "Black",
        "colorHex": "#000000",
        "colorImage": "/uploads/1788713330115-photo_2026-08-30_08-55-53.jpg",
        "colorImages": "/uploads/1788713330115-photo_2026-08-30_08-55-53.jpg",
        "stock": 15
      }
    ],
    "category": {
      "id": "9b404cb4-9238-4973-a50b-48e3a3941540",
      "slug": "pants-cargo",
      "nameEn": "Pants & Cargo",
      "nameAr": "البناطيل والكارغو",
      "descriptionEn": "Tactical cargo pants and relaxed streetwear trousers.",
      "descriptionAr": "بناطيل كارغو تكتيكية وقصات ستريت وير مريحة.",
      "image": "/uploads/1788714995710-photo_2026-09-06_10-16-16.jpg",
      "order": 3,
      "isHidden": false,
      "createdAt": "2026-08-27T23:29:03.203Z"
    }
  },
  {
    "id": "4886dc8b-d61e-4e27-ba24-f0852ffa955f",
    "slug": "stwd-baggy-pants-901",
    "nameEn": "STWD Baggy Pants",
    "nameAr": "STWD Baggy Pants",
    "descEn": "",
    "descAr": "",
    "price": 20,
    "salePrice": null,
    "sku": "BI-DROP-6867",
    "featured": true,
    "isNew": true,
    "isSale": false,
    "isActive": true,
    "categorySlug": "pants-cargo",
    "createdAt": "2026-09-06T16:45:07.173Z",
    "updatedAt": "2026-09-06T16:45:07.173Z",
    "images": [
      {
        "id": "0e60227e-4b87-4eb0-ac83-d5a9355952ba",
        "productId": "4886dc8b-d61e-4e27-ba24-f0852ffa955f",
        "url": "/uploads/1788712902327-photo_2026-08-30_08-56-13.jpg",
        "isMain": true,
        "order": 0
      },
      {
        "id": "ceedb5de-f570-498c-a7b4-1b518f3e35f8",
        "productId": "4886dc8b-d61e-4e27-ba24-f0852ffa955f",
        "url": "/uploads/1788713006592-photo_2026-08-30_08-56-16.jpg",
        "isMain": false,
        "order": 1
      },
      {
        "id": "5457ddb8-12df-4a93-ba29-81fe0d60c2ca",
        "productId": "4886dc8b-d61e-4e27-ba24-f0852ffa955f",
        "url": "/uploads/1788713070242-photo_2026-08-30_08-56-17.jpg",
        "isMain": false,
        "order": 2
      }
    ],
    "variants": [
      {
        "id": "ea705f9a-b7fe-43a5-a830-217b08fa697b",
        "productId": "4886dc8b-d61e-4e27-ba24-f0852ffa955f",
        "size": "30",
        "colorName": "Acid Wash Grey",
        "colorHex": "#8a8a8a",
        "colorImage": "/uploads/1788712902327-photo_2026-08-30_08-56-13.jpg",
        "colorImages": "/uploads/1788712902327-photo_2026-08-30_08-56-13.jpg",
        "stock": 15
      },
      {
        "id": "5493dc36-308f-476e-897e-21c2fb76bb96",
        "productId": "4886dc8b-d61e-4e27-ba24-f0852ffa955f",
        "size": "31",
        "colorName": "Acid Wash Grey",
        "colorHex": "#8a8a8a",
        "colorImage": "/uploads/1788712902327-photo_2026-08-30_08-56-13.jpg",
        "colorImages": "/uploads/1788712902327-photo_2026-08-30_08-56-13.jpg",
        "stock": 15
      },
      {
        "id": "02a5fe20-36f5-46ad-ab3a-6205829dd0a0",
        "productId": "4886dc8b-d61e-4e27-ba24-f0852ffa955f",
        "size": "32",
        "colorName": "Acid Wash Grey",
        "colorHex": "#8a8a8a",
        "colorImage": "/uploads/1788712902327-photo_2026-08-30_08-56-13.jpg",
        "colorImages": "/uploads/1788712902327-photo_2026-08-30_08-56-13.jpg",
        "stock": 15
      },
      {
        "id": "08f14639-435b-4832-bbca-d92e2c6edb87",
        "productId": "4886dc8b-d61e-4e27-ba24-f0852ffa955f",
        "size": "33",
        "colorName": "Acid Wash Grey",
        "colorHex": "#8a8a8a",
        "colorImage": "/uploads/1788712902327-photo_2026-08-30_08-56-13.jpg",
        "colorImages": "/uploads/1788712902327-photo_2026-08-30_08-56-13.jpg",
        "stock": 15
      },
      {
        "id": "ab2e2727-26a7-4a3c-a53e-3440e97b5ac1",
        "productId": "4886dc8b-d61e-4e27-ba24-f0852ffa955f",
        "size": "34",
        "colorName": "Acid Wash Grey",
        "colorHex": "#8a8a8a",
        "colorImage": "/uploads/1788712902327-photo_2026-08-30_08-56-13.jpg",
        "colorImages": "/uploads/1788712902327-photo_2026-08-30_08-56-13.jpg",
        "stock": 15
      },
      {
        "id": "0eeeb1d2-91c8-407e-b904-394ae2e34249",
        "productId": "4886dc8b-d61e-4e27-ba24-f0852ffa955f",
        "size": "35",
        "colorName": "Acid Wash Grey",
        "colorHex": "#8a8a8a",
        "colorImage": "/uploads/1788712902327-photo_2026-08-30_08-56-13.jpg",
        "colorImages": "/uploads/1788712902327-photo_2026-08-30_08-56-13.jpg",
        "stock": 15
      },
      {
        "id": "221576b4-01d5-47d1-84e8-b9a69f60c4d2",
        "productId": "4886dc8b-d61e-4e27-ba24-f0852ffa955f",
        "size": "36",
        "colorName": "Acid Wash Grey",
        "colorHex": "#8a8a8a",
        "colorImage": "/uploads/1788712902327-photo_2026-08-30_08-56-13.jpg",
        "colorImages": "/uploads/1788712902327-photo_2026-08-30_08-56-13.jpg",
        "stock": 15
      },
      {
        "id": "c0384bf6-92e9-4a2c-92c2-8c9e0d713436",
        "productId": "4886dc8b-d61e-4e27-ba24-f0852ffa955f",
        "size": "30",
        "colorName": "Acid Wash Black",
        "colorHex": "#000000",
        "colorImage": "/uploads/1788713006592-photo_2026-08-30_08-56-16.jpg",
        "colorImages": "/uploads/1788713006592-photo_2026-08-30_08-56-16.jpg",
        "stock": 15
      },
      {
        "id": "a5a25d6a-6292-4cac-a372-e74ea71d6526",
        "productId": "4886dc8b-d61e-4e27-ba24-f0852ffa955f",
        "size": "31",
        "colorName": "Acid Wash Black",
        "colorHex": "#000000",
        "colorImage": "/uploads/1788713006592-photo_2026-08-30_08-56-16.jpg",
        "colorImages": "/uploads/1788713006592-photo_2026-08-30_08-56-16.jpg",
        "stock": 15
      },
      {
        "id": "290a7b06-2195-4ff6-867e-49af552a281d",
        "productId": "4886dc8b-d61e-4e27-ba24-f0852ffa955f",
        "size": "32",
        "colorName": "Acid Wash Black",
        "colorHex": "#000000",
        "colorImage": "/uploads/1788713006592-photo_2026-08-30_08-56-16.jpg",
        "colorImages": "/uploads/1788713006592-photo_2026-08-30_08-56-16.jpg",
        "stock": 15
      },
      {
        "id": "d55a9f2f-53c3-4ed2-bf2e-8ebc92f2a894",
        "productId": "4886dc8b-d61e-4e27-ba24-f0852ffa955f",
        "size": "33",
        "colorName": "Acid Wash Black",
        "colorHex": "#000000",
        "colorImage": "/uploads/1788713006592-photo_2026-08-30_08-56-16.jpg",
        "colorImages": "/uploads/1788713006592-photo_2026-08-30_08-56-16.jpg",
        "stock": 15
      },
      {
        "id": "ae4e0042-25ea-49f8-9dad-d7c0d7ee0ad1",
        "productId": "4886dc8b-d61e-4e27-ba24-f0852ffa955f",
        "size": "34",
        "colorName": "Acid Wash Black",
        "colorHex": "#000000",
        "colorImage": "/uploads/1788713006592-photo_2026-08-30_08-56-16.jpg",
        "colorImages": "/uploads/1788713006592-photo_2026-08-30_08-56-16.jpg",
        "stock": 15
      },
      {
        "id": "7bfb721e-beb5-4388-838a-86b9155baa63",
        "productId": "4886dc8b-d61e-4e27-ba24-f0852ffa955f",
        "size": "35",
        "colorName": "Acid Wash Black",
        "colorHex": "#000000",
        "colorImage": "/uploads/1788713006592-photo_2026-08-30_08-56-16.jpg",
        "colorImages": "/uploads/1788713006592-photo_2026-08-30_08-56-16.jpg",
        "stock": 15
      },
      {
        "id": "e626d321-af0f-4fe7-a13f-f100069871ca",
        "productId": "4886dc8b-d61e-4e27-ba24-f0852ffa955f",
        "size": "36",
        "colorName": "Acid Wash Black",
        "colorHex": "#000000",
        "colorImage": "/uploads/1788713006592-photo_2026-08-30_08-56-16.jpg",
        "colorImages": "/uploads/1788713006592-photo_2026-08-30_08-56-16.jpg",
        "stock": 15
      },
      {
        "id": "a0183bbe-2da2-47b9-ada5-651071c4cdce",
        "productId": "4886dc8b-d61e-4e27-ba24-f0852ffa955f",
        "size": "30",
        "colorName": "Charcoal Acid Wash",
        "colorHex": "#545454",
        "colorImage": "/uploads/1788713070242-photo_2026-08-30_08-56-17.jpg",
        "colorImages": "/uploads/1788713070242-photo_2026-08-30_08-56-17.jpg",
        "stock": 15
      },
      {
        "id": "1cddb108-33a1-48ac-b270-084e6cfe39ef",
        "productId": "4886dc8b-d61e-4e27-ba24-f0852ffa955f",
        "size": "31",
        "colorName": "Charcoal Acid Wash",
        "colorHex": "#545454",
        "colorImage": "/uploads/1788713070242-photo_2026-08-30_08-56-17.jpg",
        "colorImages": "/uploads/1788713070242-photo_2026-08-30_08-56-17.jpg",
        "stock": 15
      },
      {
        "id": "53c8a190-7e06-4268-8fed-8f0badf26b22",
        "productId": "4886dc8b-d61e-4e27-ba24-f0852ffa955f",
        "size": "32",
        "colorName": "Charcoal Acid Wash",
        "colorHex": "#545454",
        "colorImage": "/uploads/1788713070242-photo_2026-08-30_08-56-17.jpg",
        "colorImages": "/uploads/1788713070242-photo_2026-08-30_08-56-17.jpg",
        "stock": 15
      },
      {
        "id": "b5203fd5-4d5b-4d2e-8e1e-b18ec45216c1",
        "productId": "4886dc8b-d61e-4e27-ba24-f0852ffa955f",
        "size": "33",
        "colorName": "Charcoal Acid Wash",
        "colorHex": "#545454",
        "colorImage": "/uploads/1788713070242-photo_2026-08-30_08-56-17.jpg",
        "colorImages": "/uploads/1788713070242-photo_2026-08-30_08-56-17.jpg",
        "stock": 15
      },
      {
        "id": "24ace575-e70b-4249-b062-8f3c0d27b3ca",
        "productId": "4886dc8b-d61e-4e27-ba24-f0852ffa955f",
        "size": "34",
        "colorName": "Charcoal Acid Wash",
        "colorHex": "#545454",
        "colorImage": "/uploads/1788713070242-photo_2026-08-30_08-56-17.jpg",
        "colorImages": "/uploads/1788713070242-photo_2026-08-30_08-56-17.jpg",
        "stock": 15
      },
      {
        "id": "16f271fa-9adb-4560-ad5e-c7fa4350667f",
        "productId": "4886dc8b-d61e-4e27-ba24-f0852ffa955f",
        "size": "35",
        "colorName": "Charcoal Acid Wash",
        "colorHex": "#545454",
        "colorImage": "/uploads/1788713070242-photo_2026-08-30_08-56-17.jpg",
        "colorImages": "/uploads/1788713070242-photo_2026-08-30_08-56-17.jpg",
        "stock": 15
      },
      {
        "id": "9ab7f390-bc56-4543-a48a-614e863585f3",
        "productId": "4886dc8b-d61e-4e27-ba24-f0852ffa955f",
        "size": "36",
        "colorName": "Charcoal Acid Wash",
        "colorHex": "#545454",
        "colorImage": "/uploads/1788713070242-photo_2026-08-30_08-56-17.jpg",
        "colorImages": "/uploads/1788713070242-photo_2026-08-30_08-56-17.jpg",
        "stock": 15
      }
    ],
    "category": {
      "id": "5db1d456-c716-41c2-841e-b0e2f3d4dd97",
      "slug": "hoodies-sweatshirts",
      "nameEn": "Hoodies & Sweatshirts",
      "nameAr": "الهوديات والسويت شيرت",
      "descriptionEn": "Heavyweight cotton oversized hoodies imported from Turkey.",
      "descriptionAr": "هوديات قطن ثقيل أوفرسايز صُنعت في تركيا.",
      "image": "/uploads/1788714716075-photo_2026-09-06_10-11-09.jpg",
      "order": 1,
      "isHidden": false,
      "createdAt": "2026-08-27T23:29:03.192Z"
    }
  },
  {
    "id": "b1eab540-313c-4ad8-86d2-b827c0e21182",
    "slug": "nike-baggy-pants-914",
    "nameEn": "Nike Baggy Pants",
    "nameAr": "Nike Baggy Pants",
    "descEn": "",
    "descAr": "",
    "price": 20,
    "salePrice": null,
    "sku": "BI-DROP-3697",
    "featured": true,
    "isNew": true,
    "isSale": false,
    "isActive": true,
    "categorySlug": "pants-cargo",
    "createdAt": "2026-09-06T16:38:45.413Z",
    "updatedAt": "2026-09-06T16:38:45.413Z",
    "images": [
      {
        "id": "5993a4dc-3b31-47ab-b613-39e5036f6856",
        "productId": "b1eab540-313c-4ad8-86d2-b827c0e21182",
        "url": "/uploads/1788712709185-photo_2026-08-30_08-55-34.jpg",
        "isMain": true,
        "order": 0
      }
    ],
    "variants": [
      {
        "id": "e418d906-6bdc-4df9-912e-15362bc3e1ba",
        "productId": "b1eab540-313c-4ad8-86d2-b827c0e21182",
        "size": "30",
        "colorName": "Black",
        "colorHex": "#000000",
        "colorImage": "/uploads/1788712709185-photo_2026-08-30_08-55-34.jpg",
        "colorImages": "/uploads/1788712709185-photo_2026-08-30_08-55-34.jpg",
        "stock": 15
      },
      {
        "id": "31de6e13-24cf-4436-8551-a56dbd532073",
        "productId": "b1eab540-313c-4ad8-86d2-b827c0e21182",
        "size": "31",
        "colorName": "Black",
        "colorHex": "#000000",
        "colorImage": "/uploads/1788712709185-photo_2026-08-30_08-55-34.jpg",
        "colorImages": "/uploads/1788712709185-photo_2026-08-30_08-55-34.jpg",
        "stock": 15
      },
      {
        "id": "a53f70b9-613b-46c5-9aac-8ff00e7aa4e0",
        "productId": "b1eab540-313c-4ad8-86d2-b827c0e21182",
        "size": "32",
        "colorName": "Black",
        "colorHex": "#000000",
        "colorImage": "/uploads/1788712709185-photo_2026-08-30_08-55-34.jpg",
        "colorImages": "/uploads/1788712709185-photo_2026-08-30_08-55-34.jpg",
        "stock": 15
      },
      {
        "id": "0bef0f69-8698-414c-8f2f-55d3f35c9bcd",
        "productId": "b1eab540-313c-4ad8-86d2-b827c0e21182",
        "size": "33",
        "colorName": "Black",
        "colorHex": "#000000",
        "colorImage": "/uploads/1788712709185-photo_2026-08-30_08-55-34.jpg",
        "colorImages": "/uploads/1788712709185-photo_2026-08-30_08-55-34.jpg",
        "stock": 15
      },
      {
        "id": "1c9746de-a34b-4f10-8b5d-480b6bf384a3",
        "productId": "b1eab540-313c-4ad8-86d2-b827c0e21182",
        "size": "34",
        "colorName": "Black",
        "colorHex": "#000000",
        "colorImage": "/uploads/1788712709185-photo_2026-08-30_08-55-34.jpg",
        "colorImages": "/uploads/1788712709185-photo_2026-08-30_08-55-34.jpg",
        "stock": 15
      },
      {
        "id": "fce33dbf-1d0f-425b-a9d0-a4a436a099dc",
        "productId": "b1eab540-313c-4ad8-86d2-b827c0e21182",
        "size": "35",
        "colorName": "Black",
        "colorHex": "#000000",
        "colorImage": "/uploads/1788712709185-photo_2026-08-30_08-55-34.jpg",
        "colorImages": "/uploads/1788712709185-photo_2026-08-30_08-55-34.jpg",
        "stock": 15
      },
      {
        "id": "17d99cd9-c28a-4a51-ab70-b082c95a35e8",
        "productId": "b1eab540-313c-4ad8-86d2-b827c0e21182",
        "size": "36",
        "colorName": "Black",
        "colorHex": "#000000",
        "colorImage": "/uploads/1788712709185-photo_2026-08-30_08-55-34.jpg",
        "colorImages": "/uploads/1788712709185-photo_2026-08-30_08-55-34.jpg",
        "stock": 15
      }
    ],
    "category": {
      "id": "9b404cb4-9238-4973-a50b-48e3a3941540",
      "slug": "pants-cargo",
      "nameEn": "Pants & Cargo",
      "nameAr": "البناطيل والكارغو",
      "descriptionEn": "Tactical cargo pants and relaxed streetwear trousers.",
      "descriptionAr": "بناطيل كارغو تكتيكية وقصات ستريت وير مريحة.",
      "image": "/uploads/1788714995710-photo_2026-09-06_10-16-16.jpg",
      "order": 3,
      "isHidden": false,
      "createdAt": "2026-08-27T23:29:03.203Z"
    }
  },
  {
    "id": "be120bd0-b0c6-454d-935c-46eaab2f3167",
    "slug": "bathing-ape-baggy-pants-554",
    "nameEn": "BATHING APE Baggy Pants",
    "nameAr": "BATHING APE Baggy Pants",
    "descEn": "",
    "descAr": "",
    "price": 20,
    "salePrice": null,
    "sku": "BI-DROP-7499",
    "featured": true,
    "isNew": true,
    "isSale": false,
    "isActive": true,
    "categorySlug": "pants-cargo",
    "createdAt": "2026-09-06T16:37:05.022Z",
    "updatedAt": "2026-09-06T16:37:05.022Z",
    "images": [
      {
        "id": "64b0eb17-3b09-4140-b642-3dbd923a3aa6",
        "productId": "be120bd0-b0c6-454d-935c-46eaab2f3167",
        "url": "/uploads/1788712561949-photo_2026-08-30_08-55-25.jpg",
        "isMain": true,
        "order": 0
      },
      {
        "id": "150f9e63-4b33-458d-88d4-54d6dd9193b3",
        "productId": "be120bd0-b0c6-454d-935c-46eaab2f3167",
        "url": "/uploads/1788712587768-photo_2026-08-30_08-55-27.jpg",
        "isMain": false,
        "order": 1
      }
    ],
    "variants": [
      {
        "id": "780f8e41-b942-43e6-8937-4038108ba77f",
        "productId": "be120bd0-b0c6-454d-935c-46eaab2f3167",
        "size": "30",
        "colorName": "Black",
        "colorHex": "#000000",
        "colorImage": "/uploads/1788712561949-photo_2026-08-30_08-55-25.jpg",
        "colorImages": "/uploads/1788712561949-photo_2026-08-30_08-55-25.jpg",
        "stock": 15
      },
      {
        "id": "14031daf-3d5a-4adc-a437-2439bc649373",
        "productId": "be120bd0-b0c6-454d-935c-46eaab2f3167",
        "size": "31",
        "colorName": "Black",
        "colorHex": "#000000",
        "colorImage": "/uploads/1788712561949-photo_2026-08-30_08-55-25.jpg",
        "colorImages": "/uploads/1788712561949-photo_2026-08-30_08-55-25.jpg",
        "stock": 15
      },
      {
        "id": "afa3367a-a7ec-4061-87a3-537dde049c07",
        "productId": "be120bd0-b0c6-454d-935c-46eaab2f3167",
        "size": "32",
        "colorName": "Black",
        "colorHex": "#000000",
        "colorImage": "/uploads/1788712561949-photo_2026-08-30_08-55-25.jpg",
        "colorImages": "/uploads/1788712561949-photo_2026-08-30_08-55-25.jpg",
        "stock": 15
      },
      {
        "id": "dc11a85a-fe95-46c8-824c-d06dfed4a56e",
        "productId": "be120bd0-b0c6-454d-935c-46eaab2f3167",
        "size": "33",
        "colorName": "Black",
        "colorHex": "#000000",
        "colorImage": "/uploads/1788712561949-photo_2026-08-30_08-55-25.jpg",
        "colorImages": "/uploads/1788712561949-photo_2026-08-30_08-55-25.jpg",
        "stock": 15
      },
      {
        "id": "c6c5d642-9bfb-4891-ae4e-209afae27659",
        "productId": "be120bd0-b0c6-454d-935c-46eaab2f3167",
        "size": "34",
        "colorName": "Black",
        "colorHex": "#000000",
        "colorImage": "/uploads/1788712561949-photo_2026-08-30_08-55-25.jpg",
        "colorImages": "/uploads/1788712561949-photo_2026-08-30_08-55-25.jpg",
        "stock": 15
      },
      {
        "id": "cd82e682-3b98-4e54-b198-c9b43f69e213",
        "productId": "be120bd0-b0c6-454d-935c-46eaab2f3167",
        "size": "35",
        "colorName": "Black",
        "colorHex": "#000000",
        "colorImage": "/uploads/1788712561949-photo_2026-08-30_08-55-25.jpg",
        "colorImages": "/uploads/1788712561949-photo_2026-08-30_08-55-25.jpg",
        "stock": 15
      },
      {
        "id": "6046e42f-bd30-4a6b-8999-b3339ac4273c",
        "productId": "be120bd0-b0c6-454d-935c-46eaab2f3167",
        "size": "36",
        "colorName": "Black",
        "colorHex": "#000000",
        "colorImage": "/uploads/1788712561949-photo_2026-08-30_08-55-25.jpg",
        "colorImages": "/uploads/1788712561949-photo_2026-08-30_08-55-25.jpg",
        "stock": 15
      },
      {
        "id": "1fada978-530e-4f36-aa08-f929ae5efb56",
        "productId": "be120bd0-b0c6-454d-935c-46eaab2f3167",
        "size": "30",
        "colorName": "Grey",
        "colorHex": "#a8a8a8",
        "colorImage": "/uploads/1788712587768-photo_2026-08-30_08-55-27.jpg",
        "colorImages": "/uploads/1788712587768-photo_2026-08-30_08-55-27.jpg",
        "stock": 15
      },
      {
        "id": "3e0c9fb8-b671-40e9-b053-cb91b1d72aed",
        "productId": "be120bd0-b0c6-454d-935c-46eaab2f3167",
        "size": "31",
        "colorName": "Grey",
        "colorHex": "#a8a8a8",
        "colorImage": "/uploads/1788712587768-photo_2026-08-30_08-55-27.jpg",
        "colorImages": "/uploads/1788712587768-photo_2026-08-30_08-55-27.jpg",
        "stock": 15
      },
      {
        "id": "b2382d79-9077-4d90-8b93-8c4bf643eb2f",
        "productId": "be120bd0-b0c6-454d-935c-46eaab2f3167",
        "size": "32",
        "colorName": "Grey",
        "colorHex": "#a8a8a8",
        "colorImage": "/uploads/1788712587768-photo_2026-08-30_08-55-27.jpg",
        "colorImages": "/uploads/1788712587768-photo_2026-08-30_08-55-27.jpg",
        "stock": 15
      },
      {
        "id": "2853d428-8717-4a7d-9189-0a3fbc0d119b",
        "productId": "be120bd0-b0c6-454d-935c-46eaab2f3167",
        "size": "33",
        "colorName": "Grey",
        "colorHex": "#a8a8a8",
        "colorImage": "/uploads/1788712587768-photo_2026-08-30_08-55-27.jpg",
        "colorImages": "/uploads/1788712587768-photo_2026-08-30_08-55-27.jpg",
        "stock": 15
      },
      {
        "id": "575aabe1-2ba9-4d09-a437-7162690ce913",
        "productId": "be120bd0-b0c6-454d-935c-46eaab2f3167",
        "size": "34",
        "colorName": "Grey",
        "colorHex": "#a8a8a8",
        "colorImage": "/uploads/1788712587768-photo_2026-08-30_08-55-27.jpg",
        "colorImages": "/uploads/1788712587768-photo_2026-08-30_08-55-27.jpg",
        "stock": 15
      },
      {
        "id": "2bb8e143-58e7-4add-afc4-0464582402b8",
        "productId": "be120bd0-b0c6-454d-935c-46eaab2f3167",
        "size": "35",
        "colorName": "Grey",
        "colorHex": "#a8a8a8",
        "colorImage": "/uploads/1788712587768-photo_2026-08-30_08-55-27.jpg",
        "colorImages": "/uploads/1788712587768-photo_2026-08-30_08-55-27.jpg",
        "stock": 15
      },
      {
        "id": "02ceff9f-475a-4983-88d0-1471ff458c4a",
        "productId": "be120bd0-b0c6-454d-935c-46eaab2f3167",
        "size": "36",
        "colorName": "Grey",
        "colorHex": "#a8a8a8",
        "colorImage": "/uploads/1788712587768-photo_2026-08-30_08-55-27.jpg",
        "colorImages": "/uploads/1788712587768-photo_2026-08-30_08-55-27.jpg",
        "stock": 15
      }
    ],
    "category": {
      "id": "9b404cb4-9238-4973-a50b-48e3a3941540",
      "slug": "pants-cargo",
      "nameEn": "Pants & Cargo",
      "nameAr": "البناطيل والكارغو",
      "descriptionEn": "Tactical cargo pants and relaxed streetwear trousers.",
      "descriptionAr": "بناطيل كارغو تكتيكية وقصات ستريت وير مريحة.",
      "image": "/uploads/1788714995710-photo_2026-09-06_10-16-16.jpg",
      "order": 3,
      "isHidden": false,
      "createdAt": "2026-08-27T23:29:03.203Z"
    }
  },
  {
    "id": "4a136b04-7ccc-4f39-89cc-72fa772eebc8",
    "slug": "stwd-baggy-pants-934",
    "nameEn": "STWD Baggy Pants",
    "nameAr": "STWD Baggy Pants",
    "descEn": "",
    "descAr": "",
    "price": 20,
    "salePrice": null,
    "sku": "BI-DROP-4279",
    "featured": true,
    "isNew": true,
    "isSale": false,
    "isActive": true,
    "categorySlug": "pants-cargo",
    "createdAt": "2026-09-06T16:34:59.481Z",
    "updatedAt": "2026-09-06T16:34:59.481Z",
    "images": [
      {
        "id": "ce494801-60fc-407d-a6f1-5478d3b11cad",
        "productId": "4a136b04-7ccc-4f39-89cc-72fa772eebc8",
        "url": "/uploads/1788712473453-photo_2026-08-30_08-55-19.jpg",
        "isMain": true,
        "order": 0
      },
      {
        "id": "0e25436a-f666-465d-8b92-da58158eb140",
        "productId": "4a136b04-7ccc-4f39-89cc-72fa772eebc8",
        "url": "/uploads/1788712496317-photo_2026-08-30_08-55-18.jpg",
        "isMain": false,
        "order": 1
      }
    ],
    "variants": [
      {
        "id": "7bda3699-72b9-4dad-8e1a-4090e63e5a03",
        "productId": "4a136b04-7ccc-4f39-89cc-72fa772eebc8",
        "size": "30",
        "colorName": "Black",
        "colorHex": "#000000",
        "colorImage": "/uploads/1788712473453-photo_2026-08-30_08-55-19.jpg",
        "colorImages": "/uploads/1788712473453-photo_2026-08-30_08-55-19.jpg,/uploads/1788712496317-photo_2026-08-30_08-55-18.jpg",
        "stock": 15
      },
      {
        "id": "c47cbda8-95d9-4d9c-83ab-c9676e442be5",
        "productId": "4a136b04-7ccc-4f39-89cc-72fa772eebc8",
        "size": "31",
        "colorName": "Black",
        "colorHex": "#000000",
        "colorImage": "/uploads/1788712473453-photo_2026-08-30_08-55-19.jpg",
        "colorImages": "/uploads/1788712473453-photo_2026-08-30_08-55-19.jpg,/uploads/1788712496317-photo_2026-08-30_08-55-18.jpg",
        "stock": 15
      },
      {
        "id": "79ed1c35-2dfd-476f-8c85-76617c153a36",
        "productId": "4a136b04-7ccc-4f39-89cc-72fa772eebc8",
        "size": "32",
        "colorName": "Black",
        "colorHex": "#000000",
        "colorImage": "/uploads/1788712473453-photo_2026-08-30_08-55-19.jpg",
        "colorImages": "/uploads/1788712473453-photo_2026-08-30_08-55-19.jpg,/uploads/1788712496317-photo_2026-08-30_08-55-18.jpg",
        "stock": 15
      },
      {
        "id": "788395bd-ae5c-4231-b9c9-dc65e8927baa",
        "productId": "4a136b04-7ccc-4f39-89cc-72fa772eebc8",
        "size": "33",
        "colorName": "Black",
        "colorHex": "#000000",
        "colorImage": "/uploads/1788712473453-photo_2026-08-30_08-55-19.jpg",
        "colorImages": "/uploads/1788712473453-photo_2026-08-30_08-55-19.jpg,/uploads/1788712496317-photo_2026-08-30_08-55-18.jpg",
        "stock": 15
      },
      {
        "id": "a1bd32ef-c4e2-4234-8f09-78c7c39f6a07",
        "productId": "4a136b04-7ccc-4f39-89cc-72fa772eebc8",
        "size": "34",
        "colorName": "Black",
        "colorHex": "#000000",
        "colorImage": "/uploads/1788712473453-photo_2026-08-30_08-55-19.jpg",
        "colorImages": "/uploads/1788712473453-photo_2026-08-30_08-55-19.jpg,/uploads/1788712496317-photo_2026-08-30_08-55-18.jpg",
        "stock": 15
      },
      {
        "id": "9515d496-5c7b-4eb5-b5b7-32d9f1fc0ccc",
        "productId": "4a136b04-7ccc-4f39-89cc-72fa772eebc8",
        "size": "35",
        "colorName": "Black",
        "colorHex": "#000000",
        "colorImage": "/uploads/1788712473453-photo_2026-08-30_08-55-19.jpg",
        "colorImages": "/uploads/1788712473453-photo_2026-08-30_08-55-19.jpg,/uploads/1788712496317-photo_2026-08-30_08-55-18.jpg",
        "stock": 15
      },
      {
        "id": "56f0a48d-0a48-4bd7-a203-0494c2677954",
        "productId": "4a136b04-7ccc-4f39-89cc-72fa772eebc8",
        "size": "36",
        "colorName": "Black",
        "colorHex": "#000000",
        "colorImage": "/uploads/1788712473453-photo_2026-08-30_08-55-19.jpg",
        "colorImages": "/uploads/1788712473453-photo_2026-08-30_08-55-19.jpg,/uploads/1788712496317-photo_2026-08-30_08-55-18.jpg",
        "stock": 15
      }
    ],
    "category": {
      "id": "9b404cb4-9238-4973-a50b-48e3a3941540",
      "slug": "pants-cargo",
      "nameEn": "Pants & Cargo",
      "nameAr": "البناطيل والكارغو",
      "descriptionEn": "Tactical cargo pants and relaxed streetwear trousers.",
      "descriptionAr": "بناطيل كارغو تكتيكية وقصات ستريت وير مريحة.",
      "image": "/uploads/1788714995710-photo_2026-09-06_10-16-16.jpg",
      "order": 3,
      "isHidden": false,
      "createdAt": "2026-08-27T23:29:03.203Z"
    }
  },
  {
    "id": "c41c4f8b-4569-43e8-a195-31e324795399",
    "slug": "silently-oversize-t-shirt-352",
    "nameEn": "Silently OverSize T-Shirt",
    "nameAr": "Silently OverSize T-Shirt",
    "descEn": "",
    "descAr": "",
    "price": 20,
    "salePrice": null,
    "sku": "BI-DROP-5303",
    "featured": true,
    "isNew": true,
    "isSale": false,
    "isActive": true,
    "categorySlug": "t-shirts-oversized",
    "createdAt": "2026-09-06T16:30:25.592Z",
    "updatedAt": "2026-09-06T16:30:25.592Z",
    "images": [
      {
        "id": "eacaa747-0ac0-436e-99db-b320f2dbab9c",
        "productId": "c41c4f8b-4569-43e8-a195-31e324795399",
        "url": "/uploads/1788712207227-photo_2026-08-30_08-54-48.jpg",
        "isMain": true,
        "order": 0
      },
      {
        "id": "937aa716-7e21-42bf-b941-db10593e5f00",
        "productId": "c41c4f8b-4569-43e8-a195-31e324795399",
        "url": "/uploads/1788712211797-photo_2026-08-30_08-54-50.jpg",
        "isMain": false,
        "order": 1
      }
    ],
    "variants": [
      {
        "id": "7af4ba95-5ec4-42f7-a8a9-5b65e516a840",
        "productId": "c41c4f8b-4569-43e8-a195-31e324795399",
        "size": "S",
        "colorName": "Black",
        "colorHex": "#000000",
        "colorImage": "/uploads/1788712207227-photo_2026-08-30_08-54-48.jpg",
        "colorImages": "/uploads/1788712207227-photo_2026-08-30_08-54-48.jpg,/uploads/1788712211797-photo_2026-08-30_08-54-50.jpg",
        "stock": 10
      },
      {
        "id": "cd4b6b6e-8cad-4550-819f-97f63fb3f80c",
        "productId": "c41c4f8b-4569-43e8-a195-31e324795399",
        "size": "M",
        "colorName": "Black",
        "colorHex": "#000000",
        "colorImage": "/uploads/1788712207227-photo_2026-08-30_08-54-48.jpg",
        "colorImages": "/uploads/1788712207227-photo_2026-08-30_08-54-48.jpg,/uploads/1788712211797-photo_2026-08-30_08-54-50.jpg",
        "stock": 15
      },
      {
        "id": "e2365414-a89b-41f2-8dc2-57906ae01980",
        "productId": "c41c4f8b-4569-43e8-a195-31e324795399",
        "size": "L",
        "colorName": "Black",
        "colorHex": "#000000",
        "colorImage": "/uploads/1788712207227-photo_2026-08-30_08-54-48.jpg",
        "colorImages": "/uploads/1788712207227-photo_2026-08-30_08-54-48.jpg,/uploads/1788712211797-photo_2026-08-30_08-54-50.jpg",
        "stock": 20
      },
      {
        "id": "be18850e-f2c3-4210-945e-bfefc9edb306",
        "productId": "c41c4f8b-4569-43e8-a195-31e324795399",
        "size": "XL",
        "colorName": "Black",
        "colorHex": "#000000",
        "colorImage": "/uploads/1788712207227-photo_2026-08-30_08-54-48.jpg",
        "colorImages": "/uploads/1788712207227-photo_2026-08-30_08-54-48.jpg,/uploads/1788712211797-photo_2026-08-30_08-54-50.jpg",
        "stock": 15
      }
    ],
    "category": {
      "id": "9836ec41-76d8-44f8-8abc-93e271d42b4d",
      "slug": "t-shirts-oversized",
      "nameEn": "T-Shirts & Oversized",
      "nameAr": "التيشيرتات والأوفرسايز",
      "descriptionEn": "Drop-shoulder street tees with high-density graphics.",
      "descriptionAr": "تيشيرتات أكتاف منسدلة وطباعة عالية الدقة.",
      "image": "/uploads/1788715207412-photo_2026-09-06_10-19-47.jpg",
      "order": 2,
      "isHidden": false,
      "createdAt": "2026-08-27T23:29:03.198Z"
    }
  },
  {
    "id": "f2f2e783-a75d-460b-a99a-c8409923d997",
    "slug": "saw-urbanity-oversize-t-shirt-445",
    "nameEn": "SAW URBANITY OverSize T-Shirt",
    "nameAr": "SAW URBANITY OverSize T-Shirt",
    "descEn": "",
    "descAr": "",
    "price": 20,
    "salePrice": null,
    "sku": "BI-DROP-9784",
    "featured": true,
    "isNew": true,
    "isSale": false,
    "isActive": true,
    "categorySlug": "t-shirts-oversized",
    "createdAt": "2026-09-06T16:29:20.909Z",
    "updatedAt": "2026-09-06T16:29:20.909Z",
    "images": [
      {
        "id": "85918b66-3a1f-4db6-a564-0af09d8927da",
        "productId": "f2f2e783-a75d-460b-a99a-c8409923d997",
        "url": "/uploads/1788712127050-photo_2026-08-30_08-54-43.jpg",
        "isMain": true,
        "order": 0
      },
      {
        "id": "6dfa9d4c-a947-4b69-9c07-35d603978419",
        "productId": "f2f2e783-a75d-460b-a99a-c8409923d997",
        "url": "/uploads/1788712132093-photo_2026-08-30_08-54-45.jpg",
        "isMain": false,
        "order": 1
      }
    ],
    "variants": [
      {
        "id": "5c89d5f5-3d04-4260-958c-288b26d5a814",
        "productId": "f2f2e783-a75d-460b-a99a-c8409923d997",
        "size": "S",
        "colorName": "Navy Blue",
        "colorHex": "#1d243a",
        "colorImage": "/uploads/1788712127050-photo_2026-08-30_08-54-43.jpg",
        "colorImages": "/uploads/1788712127050-photo_2026-08-30_08-54-43.jpg,/uploads/1788712132093-photo_2026-08-30_08-54-45.jpg",
        "stock": 10
      },
      {
        "id": "68f39746-4016-4af7-9de5-0d92603708ff",
        "productId": "f2f2e783-a75d-460b-a99a-c8409923d997",
        "size": "M",
        "colorName": "Navy Blue",
        "colorHex": "#1d243a",
        "colorImage": "/uploads/1788712127050-photo_2026-08-30_08-54-43.jpg",
        "colorImages": "/uploads/1788712127050-photo_2026-08-30_08-54-43.jpg,/uploads/1788712132093-photo_2026-08-30_08-54-45.jpg",
        "stock": 15
      },
      {
        "id": "66a0e017-05ed-4332-959b-ec6d6de66332",
        "productId": "f2f2e783-a75d-460b-a99a-c8409923d997",
        "size": "L",
        "colorName": "Navy Blue",
        "colorHex": "#1d243a",
        "colorImage": "/uploads/1788712127050-photo_2026-08-30_08-54-43.jpg",
        "colorImages": "/uploads/1788712127050-photo_2026-08-30_08-54-43.jpg,/uploads/1788712132093-photo_2026-08-30_08-54-45.jpg",
        "stock": 20
      },
      {
        "id": "a8dfc19d-fb1a-4d43-af5e-a722d3881b32",
        "productId": "f2f2e783-a75d-460b-a99a-c8409923d997",
        "size": "XL",
        "colorName": "Navy Blue",
        "colorHex": "#1d243a",
        "colorImage": "/uploads/1788712127050-photo_2026-08-30_08-54-43.jpg",
        "colorImages": "/uploads/1788712127050-photo_2026-08-30_08-54-43.jpg,/uploads/1788712132093-photo_2026-08-30_08-54-45.jpg",
        "stock": 15
      }
    ],
    "category": {
      "id": "9836ec41-76d8-44f8-8abc-93e271d42b4d",
      "slug": "t-shirts-oversized",
      "nameEn": "T-Shirts & Oversized",
      "nameAr": "التيشيرتات والأوفرسايز",
      "descriptionEn": "Drop-shoulder street tees with high-density graphics.",
      "descriptionAr": "تيشيرتات أكتاف منسدلة وطباعة عالية الدقة.",
      "image": "/uploads/1788715207412-photo_2026-09-06_10-19-47.jpg",
      "order": 2,
      "isHidden": false,
      "createdAt": "2026-08-27T23:29:03.198Z"
    }
  },
  {
    "id": "35e39825-b1a4-4c58-bda7-0e7c30c77249",
    "slug": "patience-oversize-t-shirt-492",
    "nameEn": "Patience OverSize T-Shirt",
    "nameAr": "Patience OverSize T-Shirt",
    "descEn": "",
    "descAr": "",
    "price": 20,
    "salePrice": null,
    "sku": "BI-DROP-4929",
    "featured": true,
    "isNew": true,
    "isSale": false,
    "isActive": true,
    "categorySlug": "t-shirts-oversized",
    "createdAt": "2026-09-06T16:26:57.785Z",
    "updatedAt": "2026-09-06T16:26:57.785Z",
    "images": [
      {
        "id": "334e7a38-eaf3-45a4-82fe-87949829618d",
        "productId": "35e39825-b1a4-4c58-bda7-0e7c30c77249",
        "url": "/uploads/1788711971467-photo_2026-08-30_08-54-35.jpg",
        "isMain": true,
        "order": 0
      },
      {
        "id": "0caa1f16-022e-49db-a647-f1dcd516b347",
        "productId": "35e39825-b1a4-4c58-bda7-0e7c30c77249",
        "url": "/uploads/1788711976521-photo_2026-08-30_08-54-36.jpg",
        "isMain": false,
        "order": 1
      }
    ],
    "variants": [
      {
        "id": "bcc9920a-e29c-4171-a895-043907c1c2f0",
        "productId": "35e39825-b1a4-4c58-bda7-0e7c30c77249",
        "size": "S",
        "colorName": "Dark Green",
        "colorHex": "#427050",
        "colorImage": "/uploads/1788711971467-photo_2026-08-30_08-54-35.jpg",
        "colorImages": "/uploads/1788711971467-photo_2026-08-30_08-54-35.jpg,/uploads/1788711976521-photo_2026-08-30_08-54-36.jpg",
        "stock": 10
      },
      {
        "id": "1bcd7520-0670-47e7-9aed-17c2a583c023",
        "productId": "35e39825-b1a4-4c58-bda7-0e7c30c77249",
        "size": "M",
        "colorName": "Dark Green",
        "colorHex": "#427050",
        "colorImage": "/uploads/1788711971467-photo_2026-08-30_08-54-35.jpg",
        "colorImages": "/uploads/1788711971467-photo_2026-08-30_08-54-35.jpg,/uploads/1788711976521-photo_2026-08-30_08-54-36.jpg",
        "stock": 15
      },
      {
        "id": "85a4ed4e-0c62-4a7e-b036-0305f84835a2",
        "productId": "35e39825-b1a4-4c58-bda7-0e7c30c77249",
        "size": "L",
        "colorName": "Dark Green",
        "colorHex": "#427050",
        "colorImage": "/uploads/1788711971467-photo_2026-08-30_08-54-35.jpg",
        "colorImages": "/uploads/1788711971467-photo_2026-08-30_08-54-35.jpg,/uploads/1788711976521-photo_2026-08-30_08-54-36.jpg",
        "stock": 20
      },
      {
        "id": "ba524056-7b65-4657-ab3c-143dfdb23410",
        "productId": "35e39825-b1a4-4c58-bda7-0e7c30c77249",
        "size": "XL",
        "colorName": "Dark Green",
        "colorHex": "#427050",
        "colorImage": "/uploads/1788711971467-photo_2026-08-30_08-54-35.jpg",
        "colorImages": "/uploads/1788711971467-photo_2026-08-30_08-54-35.jpg,/uploads/1788711976521-photo_2026-08-30_08-54-36.jpg",
        "stock": 15
      }
    ],
    "category": {
      "id": "9836ec41-76d8-44f8-8abc-93e271d42b4d",
      "slug": "t-shirts-oversized",
      "nameEn": "T-Shirts & Oversized",
      "nameAr": "التيشيرتات والأوفرسايز",
      "descriptionEn": "Drop-shoulder street tees with high-density graphics.",
      "descriptionAr": "تيشيرتات أكتاف منسدلة وطباعة عالية الدقة.",
      "image": "/uploads/1788715207412-photo_2026-09-06_10-19-47.jpg",
      "order": 2,
      "isHidden": false,
      "createdAt": "2026-08-27T23:29:03.198Z"
    }
  },
  {
    "id": "17a54d37-1b3d-4b9d-85be-3c22ea1112a9",
    "slug": "stitched-memory-oversize-t-shirt-997",
    "nameEn": "Stitched Memory OverSize T-Shirt",
    "nameAr": "Stitched Memory OverSize T-Shirt",
    "descEn": "",
    "descAr": "",
    "price": 20,
    "salePrice": null,
    "sku": "BI-DROP-5422",
    "featured": true,
    "isNew": true,
    "isSale": false,
    "isActive": true,
    "categorySlug": "t-shirts-oversized",
    "createdAt": "2026-09-06T16:22:42.387Z",
    "updatedAt": "2026-09-06T16:22:42.387Z",
    "images": [
      {
        "id": "3f56c098-1b89-47c7-970d-18141d952142",
        "productId": "17a54d37-1b3d-4b9d-85be-3c22ea1112a9",
        "url": "/uploads/1788711708131-photo_2026-08-30_08-54-20.jpg",
        "isMain": true,
        "order": 0
      },
      {
        "id": "16b49e2e-182b-4d31-8b06-d42be9785fbc",
        "productId": "17a54d37-1b3d-4b9d-85be-3c22ea1112a9",
        "url": "/uploads/1788711713877-photo_2026-08-30_08-54-22.jpg",
        "isMain": false,
        "order": 1
      },
      {
        "id": "b93678a7-01b5-4956-8f69-26a093292b73",
        "productId": "17a54d37-1b3d-4b9d-85be-3c22ea1112a9",
        "url": "/uploads/1788711738317-photo_2026-08-30_08-54-27.jpg",
        "isMain": false,
        "order": 2
      },
      {
        "id": "4ede820d-0695-4da0-abc9-879c5f9ac3bd",
        "productId": "17a54d37-1b3d-4b9d-85be-3c22ea1112a9",
        "url": "/uploads/1788711746257-photo_2026-08-30_08-54-29.jpg",
        "isMain": false,
        "order": 3
      }
    ],
    "variants": [
      {
        "id": "b5490b0b-3802-4e80-8566-f332c0c70907",
        "productId": "17a54d37-1b3d-4b9d-85be-3c22ea1112a9",
        "size": "S",
        "colorName": "White",
        "colorHex": "#ffffff",
        "colorImage": "/uploads/1788711708131-photo_2026-08-30_08-54-20.jpg",
        "colorImages": "/uploads/1788711708131-photo_2026-08-30_08-54-20.jpg,/uploads/1788711713877-photo_2026-08-30_08-54-22.jpg",
        "stock": 10
      },
      {
        "id": "8a116f41-dd88-46b3-9bba-e27361284b28",
        "productId": "17a54d37-1b3d-4b9d-85be-3c22ea1112a9",
        "size": "M",
        "colorName": "White",
        "colorHex": "#ffffff",
        "colorImage": "/uploads/1788711708131-photo_2026-08-30_08-54-20.jpg",
        "colorImages": "/uploads/1788711708131-photo_2026-08-30_08-54-20.jpg,/uploads/1788711713877-photo_2026-08-30_08-54-22.jpg",
        "stock": 15
      },
      {
        "id": "d2d418dc-13e1-441a-99f8-265d8612352b",
        "productId": "17a54d37-1b3d-4b9d-85be-3c22ea1112a9",
        "size": "L",
        "colorName": "White",
        "colorHex": "#ffffff",
        "colorImage": "/uploads/1788711708131-photo_2026-08-30_08-54-20.jpg",
        "colorImages": "/uploads/1788711708131-photo_2026-08-30_08-54-20.jpg,/uploads/1788711713877-photo_2026-08-30_08-54-22.jpg",
        "stock": 20
      },
      {
        "id": "b7a6e17e-2d08-4c5f-b47c-4d12e7408375",
        "productId": "17a54d37-1b3d-4b9d-85be-3c22ea1112a9",
        "size": "XL",
        "colorName": "White",
        "colorHex": "#ffffff",
        "colorImage": "/uploads/1788711708131-photo_2026-08-30_08-54-20.jpg",
        "colorImages": "/uploads/1788711708131-photo_2026-08-30_08-54-20.jpg,/uploads/1788711713877-photo_2026-08-30_08-54-22.jpg",
        "stock": 15
      },
      {
        "id": "04e3e2ab-dc28-4fd3-919c-8e6a75ddf3c8",
        "productId": "17a54d37-1b3d-4b9d-85be-3c22ea1112a9",
        "size": "S",
        "colorName": "Black",
        "colorHex": "#000000",
        "colorImage": "/uploads/1788711738317-photo_2026-08-30_08-54-27.jpg",
        "colorImages": "/uploads/1788711738317-photo_2026-08-30_08-54-27.jpg,/uploads/1788711746257-photo_2026-08-30_08-54-29.jpg",
        "stock": 10
      },
      {
        "id": "9f2d7033-ba45-4010-9901-dabf68e30fdc",
        "productId": "17a54d37-1b3d-4b9d-85be-3c22ea1112a9",
        "size": "M",
        "colorName": "Black",
        "colorHex": "#000000",
        "colorImage": "/uploads/1788711738317-photo_2026-08-30_08-54-27.jpg",
        "colorImages": "/uploads/1788711738317-photo_2026-08-30_08-54-27.jpg,/uploads/1788711746257-photo_2026-08-30_08-54-29.jpg",
        "stock": 15
      },
      {
        "id": "479598a3-af20-4987-9bf6-15edbf19a27f",
        "productId": "17a54d37-1b3d-4b9d-85be-3c22ea1112a9",
        "size": "L",
        "colorName": "Black",
        "colorHex": "#000000",
        "colorImage": "/uploads/1788711738317-photo_2026-08-30_08-54-27.jpg",
        "colorImages": "/uploads/1788711738317-photo_2026-08-30_08-54-27.jpg,/uploads/1788711746257-photo_2026-08-30_08-54-29.jpg",
        "stock": 20
      },
      {
        "id": "14a17df4-e0f3-42e3-a5cd-086fce01d140",
        "productId": "17a54d37-1b3d-4b9d-85be-3c22ea1112a9",
        "size": "XL",
        "colorName": "Black",
        "colorHex": "#000000",
        "colorImage": "/uploads/1788711738317-photo_2026-08-30_08-54-27.jpg",
        "colorImages": "/uploads/1788711738317-photo_2026-08-30_08-54-27.jpg,/uploads/1788711746257-photo_2026-08-30_08-54-29.jpg",
        "stock": 15
      }
    ],
    "category": {
      "id": "9836ec41-76d8-44f8-8abc-93e271d42b4d",
      "slug": "t-shirts-oversized",
      "nameEn": "T-Shirts & Oversized",
      "nameAr": "التيشيرتات والأوفرسايز",
      "descriptionEn": "Drop-shoulder street tees with high-density graphics.",
      "descriptionAr": "تيشيرتات أكتاف منسدلة وطباعة عالية الدقة.",
      "image": "/uploads/1788715207412-photo_2026-09-06_10-19-47.jpg",
      "order": 2,
      "isHidden": false,
      "createdAt": "2026-08-27T23:29:03.198Z"
    }
  },
  {
    "id": "592b5f55-f214-4256-9601-ddf609bff236",
    "slug": "x-time-baggy-boyfriend-jeans-769",
    "nameEn": "X TIME Baggy Boyfriend Jeans",
    "nameAr": "X TIME Baggy Boyfriend Jeans",
    "descEn": "",
    "descAr": "",
    "price": 25,
    "salePrice": null,
    "sku": "BI-DROP-7987",
    "featured": true,
    "isNew": true,
    "isSale": false,
    "isActive": true,
    "categorySlug": "pants-cargo",
    "createdAt": "2026-09-05T23:39:26.081Z",
    "updatedAt": "2026-09-06T15:48:30.470Z",
    "images": [
      {
        "id": "c2b90bb6-de8f-46a8-8126-f70c6ebbee83",
        "productId": "592b5f55-f214-4256-9601-ddf609bff236",
        "url": "/uploads/1788651550285-photo_2026-09-05_15-24-45.jpg",
        "isMain": true,
        "order": 0
      }
    ],
    "variants": [
      {
        "id": "897ed5ba-7eda-4320-bbab-0a25ec374d9d",
        "productId": "592b5f55-f214-4256-9601-ddf609bff236",
        "size": "30",
        "colorName": "Black",
        "colorHex": "#000000",
        "colorImage": "/uploads/1788651550285-photo_2026-09-05_15-24-45.jpg",
        "colorImages": "/uploads/1788651550285-photo_2026-09-05_15-24-45.jpg",
        "stock": 15
      },
      {
        "id": "ad6ce59f-96e0-48eb-9bf5-3911e9650b0f",
        "productId": "592b5f55-f214-4256-9601-ddf609bff236",
        "size": "31",
        "colorName": "Black",
        "colorHex": "#000000",
        "colorImage": "/uploads/1788651550285-photo_2026-09-05_15-24-45.jpg",
        "colorImages": "/uploads/1788651550285-photo_2026-09-05_15-24-45.jpg",
        "stock": 15
      },
      {
        "id": "e2ac32d6-5dbb-4f95-8b3a-9b0234afd638",
        "productId": "592b5f55-f214-4256-9601-ddf609bff236",
        "size": "32",
        "colorName": "Black",
        "colorHex": "#000000",
        "colorImage": "/uploads/1788651550285-photo_2026-09-05_15-24-45.jpg",
        "colorImages": "/uploads/1788651550285-photo_2026-09-05_15-24-45.jpg",
        "stock": 15
      },
      {
        "id": "40c97cc1-62e0-44dc-9b1a-468af3e0b562",
        "productId": "592b5f55-f214-4256-9601-ddf609bff236",
        "size": "33",
        "colorName": "Black",
        "colorHex": "#000000",
        "colorImage": "/uploads/1788651550285-photo_2026-09-05_15-24-45.jpg",
        "colorImages": "/uploads/1788651550285-photo_2026-09-05_15-24-45.jpg",
        "stock": 15
      },
      {
        "id": "2b4bdb67-931f-4f24-8cd3-4cf5558fa6bf",
        "productId": "592b5f55-f214-4256-9601-ddf609bff236",
        "size": "34",
        "colorName": "Black",
        "colorHex": "#000000",
        "colorImage": "/uploads/1788651550285-photo_2026-09-05_15-24-45.jpg",
        "colorImages": "/uploads/1788651550285-photo_2026-09-05_15-24-45.jpg",
        "stock": 15
      },
      {
        "id": "38b800fe-cc9e-4294-a19f-d9cc9f1fee32",
        "productId": "592b5f55-f214-4256-9601-ddf609bff236",
        "size": "35",
        "colorName": "Black",
        "colorHex": "#000000",
        "colorImage": "/uploads/1788651550285-photo_2026-09-05_15-24-45.jpg",
        "colorImages": "/uploads/1788651550285-photo_2026-09-05_15-24-45.jpg",
        "stock": 15
      },
      {
        "id": "f961dad7-4bd9-4607-92b1-a7b3c4041616",
        "productId": "592b5f55-f214-4256-9601-ddf609bff236",
        "size": "36",
        "colorName": "Black",
        "colorHex": "#000000",
        "colorImage": "/uploads/1788651550285-photo_2026-09-05_15-24-45.jpg",
        "colorImages": "/uploads/1788651550285-photo_2026-09-05_15-24-45.jpg",
        "stock": 15
      }
    ],
    "category": {
      "id": "9b404cb4-9238-4973-a50b-48e3a3941540",
      "slug": "pants-cargo",
      "nameEn": "Pants & Cargo",
      "nameAr": "البناطيل والكارغو",
      "descriptionEn": "Tactical cargo pants and relaxed streetwear trousers.",
      "descriptionAr": "بناطيل كارغو تكتيكية وقصات ستريت وير مريحة.",
      "image": "/uploads/1788714995710-photo_2026-09-06_10-16-16.jpg",
      "order": 3,
      "isHidden": false,
      "createdAt": "2026-08-27T23:29:03.203Z"
    }
  },
  {
    "id": "5da30cc1-0e02-4555-bdbe-b91a24a298ba",
    "slug": "x-time-baggy-boyfriend-jeans-221",
    "nameEn": "X TIME Baggy Boyfriend Jeans",
    "nameAr": "X TIME Baggy Boyfriend Jeans",
    "descEn": "",
    "descAr": "",
    "price": 25,
    "salePrice": null,
    "sku": "BI-DROP-2421",
    "featured": true,
    "isNew": true,
    "isSale": false,
    "isActive": true,
    "categorySlug": "pants-cargo",
    "createdAt": "2026-09-05T23:38:26.889Z",
    "updatedAt": "2026-09-05T23:38:26.889Z",
    "images": [
      {
        "id": "a1974d5b-d25d-46cf-8b02-32dfe4128591",
        "productId": "5da30cc1-0e02-4555-bdbe-b91a24a298ba",
        "url": "/uploads/1788651452696-photo_2026-09-05_15-24-40.jpg",
        "isMain": true,
        "order": 0
      }
    ],
    "variants": [
      {
        "id": "a2b89269-47e8-48c8-ba9c-2c66e599bbf9",
        "productId": "5da30cc1-0e02-4555-bdbe-b91a24a298ba",
        "size": "30",
        "colorName": "Light Ice Blue",
        "colorHex": "#C5D4E0",
        "colorImage": "/uploads/1788651452696-photo_2026-09-05_15-24-40.jpg",
        "colorImages": "/uploads/1788651452696-photo_2026-09-05_15-24-40.jpg",
        "stock": 15
      },
      {
        "id": "057462c9-4be6-4121-959f-af7eb238c8f1",
        "productId": "5da30cc1-0e02-4555-bdbe-b91a24a298ba",
        "size": "31",
        "colorName": "Light Ice Blue",
        "colorHex": "#C5D4E0",
        "colorImage": "/uploads/1788651452696-photo_2026-09-05_15-24-40.jpg",
        "colorImages": "/uploads/1788651452696-photo_2026-09-05_15-24-40.jpg",
        "stock": 15
      },
      {
        "id": "3eb756da-19fe-4cb9-a00b-10ca8451e698",
        "productId": "5da30cc1-0e02-4555-bdbe-b91a24a298ba",
        "size": "32",
        "colorName": "Light Ice Blue",
        "colorHex": "#C5D4E0",
        "colorImage": "/uploads/1788651452696-photo_2026-09-05_15-24-40.jpg",
        "colorImages": "/uploads/1788651452696-photo_2026-09-05_15-24-40.jpg",
        "stock": 15
      },
      {
        "id": "e43bb3a7-344d-42b9-8f6a-0ebf69ecbcab",
        "productId": "5da30cc1-0e02-4555-bdbe-b91a24a298ba",
        "size": "33",
        "colorName": "Light Ice Blue",
        "colorHex": "#C5D4E0",
        "colorImage": "/uploads/1788651452696-photo_2026-09-05_15-24-40.jpg",
        "colorImages": "/uploads/1788651452696-photo_2026-09-05_15-24-40.jpg",
        "stock": 15
      },
      {
        "id": "23c308ec-675b-4a29-943c-a89227a53dfa",
        "productId": "5da30cc1-0e02-4555-bdbe-b91a24a298ba",
        "size": "34",
        "colorName": "Light Ice Blue",
        "colorHex": "#C5D4E0",
        "colorImage": "/uploads/1788651452696-photo_2026-09-05_15-24-40.jpg",
        "colorImages": "/uploads/1788651452696-photo_2026-09-05_15-24-40.jpg",
        "stock": 15
      },
      {
        "id": "4c75f411-310c-44af-9fbe-4aa17837519e",
        "productId": "5da30cc1-0e02-4555-bdbe-b91a24a298ba",
        "size": "35",
        "colorName": "Light Ice Blue",
        "colorHex": "#C5D4E0",
        "colorImage": "/uploads/1788651452696-photo_2026-09-05_15-24-40.jpg",
        "colorImages": "/uploads/1788651452696-photo_2026-09-05_15-24-40.jpg",
        "stock": 15
      },
      {
        "id": "3c50837f-17dc-4e29-8239-58521a9dff75",
        "productId": "5da30cc1-0e02-4555-bdbe-b91a24a298ba",
        "size": "36",
        "colorName": "Light Ice Blue",
        "colorHex": "#C5D4E0",
        "colorImage": "/uploads/1788651452696-photo_2026-09-05_15-24-40.jpg",
        "colorImages": "/uploads/1788651452696-photo_2026-09-05_15-24-40.jpg",
        "stock": 15
      }
    ],
    "category": {
      "id": "9b404cb4-9238-4973-a50b-48e3a3941540",
      "slug": "pants-cargo",
      "nameEn": "Pants & Cargo",
      "nameAr": "البناطيل والكارغو",
      "descriptionEn": "Tactical cargo pants and relaxed streetwear trousers.",
      "descriptionAr": "بناطيل كارغو تكتيكية وقصات ستريت وير مريحة.",
      "image": "/uploads/1788714995710-photo_2026-09-06_10-16-16.jpg",
      "order": 3,
      "isHidden": false,
      "createdAt": "2026-08-27T23:29:03.203Z"
    }
  },
  {
    "id": "6780dbd1-16ee-4203-b6c6-d30ba7054e92",
    "slug": "kep-s-baggy-jeans-520",
    "nameEn": "KEP's Baggy Jeans",
    "nameAr": "KEP's Baggy Jeans",
    "descEn": "",
    "descAr": "",
    "price": 25,
    "salePrice": null,
    "sku": "BI-DROP-2377",
    "featured": true,
    "isNew": true,
    "isSale": false,
    "isActive": true,
    "categorySlug": "pants-cargo",
    "createdAt": "2026-09-05T23:36:23.040Z",
    "updatedAt": "2026-09-05T23:36:23.040Z",
    "images": [
      {
        "id": "84106195-0e63-4862-9f76-f42c39c296d0",
        "productId": "6780dbd1-16ee-4203-b6c6-d30ba7054e92",
        "url": "/uploads/1788651315573-photo_2026-09-05_15-24-29.jpg",
        "isMain": true,
        "order": 0
      },
      {
        "id": "f7c7e4f4-05fb-4e65-845b-6a04945550a0",
        "productId": "6780dbd1-16ee-4203-b6c6-d30ba7054e92",
        "url": "/uploads/1788651354032-photo_2026-09-05_15-24-35.jpg",
        "isMain": false,
        "order": 1
      }
    ],
    "variants": [
      {
        "id": "3640cf7f-f8cc-4d0a-8a7f-11de287c92b7",
        "productId": "6780dbd1-16ee-4203-b6c6-d30ba7054e92",
        "size": "30",
        "colorName": "Dark Washed Black",
        "colorHex": "#000000",
        "colorImage": "/uploads/1788651315573-photo_2026-09-05_15-24-29.jpg",
        "colorImages": "/uploads/1788651315573-photo_2026-09-05_15-24-29.jpg",
        "stock": 15
      },
      {
        "id": "9727a8bc-78d5-4fe9-89ab-15e225be7aba",
        "productId": "6780dbd1-16ee-4203-b6c6-d30ba7054e92",
        "size": "31",
        "colorName": "Dark Washed Black",
        "colorHex": "#000000",
        "colorImage": "/uploads/1788651315573-photo_2026-09-05_15-24-29.jpg",
        "colorImages": "/uploads/1788651315573-photo_2026-09-05_15-24-29.jpg",
        "stock": 15
      },
      {
        "id": "cef99866-1544-41e4-a202-2912254418b7",
        "productId": "6780dbd1-16ee-4203-b6c6-d30ba7054e92",
        "size": "32",
        "colorName": "Dark Washed Black",
        "colorHex": "#000000",
        "colorImage": "/uploads/1788651315573-photo_2026-09-05_15-24-29.jpg",
        "colorImages": "/uploads/1788651315573-photo_2026-09-05_15-24-29.jpg",
        "stock": 15
      },
      {
        "id": "8d6448ec-91b3-420d-b08f-3dddb9ea5613",
        "productId": "6780dbd1-16ee-4203-b6c6-d30ba7054e92",
        "size": "33",
        "colorName": "Dark Washed Black",
        "colorHex": "#000000",
        "colorImage": "/uploads/1788651315573-photo_2026-09-05_15-24-29.jpg",
        "colorImages": "/uploads/1788651315573-photo_2026-09-05_15-24-29.jpg",
        "stock": 15
      },
      {
        "id": "19c636e4-cad6-49f8-ad8c-1893ae5baa68",
        "productId": "6780dbd1-16ee-4203-b6c6-d30ba7054e92",
        "size": "34",
        "colorName": "Dark Washed Black",
        "colorHex": "#000000",
        "colorImage": "/uploads/1788651315573-photo_2026-09-05_15-24-29.jpg",
        "colorImages": "/uploads/1788651315573-photo_2026-09-05_15-24-29.jpg",
        "stock": 15
      },
      {
        "id": "c3daa9ca-fdf8-4943-bbec-21d57182482d",
        "productId": "6780dbd1-16ee-4203-b6c6-d30ba7054e92",
        "size": "35",
        "colorName": "Dark Washed Black",
        "colorHex": "#000000",
        "colorImage": "/uploads/1788651315573-photo_2026-09-05_15-24-29.jpg",
        "colorImages": "/uploads/1788651315573-photo_2026-09-05_15-24-29.jpg",
        "stock": 15
      },
      {
        "id": "37af3565-5d57-48fa-99d5-251f5a1164f2",
        "productId": "6780dbd1-16ee-4203-b6c6-d30ba7054e92",
        "size": "36",
        "colorName": "Dark Washed Black",
        "colorHex": "#000000",
        "colorImage": "/uploads/1788651315573-photo_2026-09-05_15-24-29.jpg",
        "colorImages": "/uploads/1788651315573-photo_2026-09-05_15-24-29.jpg",
        "stock": 15
      },
      {
        "id": "2c70b719-1c97-4b86-8247-cccba5b71f9a",
        "productId": "6780dbd1-16ee-4203-b6c6-d30ba7054e92",
        "size": "30",
        "colorName": "Washed Blue",
        "colorHex": "#2d629a",
        "colorImage": "/uploads/1788651354032-photo_2026-09-05_15-24-35.jpg",
        "colorImages": "/uploads/1788651354032-photo_2026-09-05_15-24-35.jpg",
        "stock": 15
      },
      {
        "id": "dbd094f6-e719-42c9-8567-e2960ca7ed8c",
        "productId": "6780dbd1-16ee-4203-b6c6-d30ba7054e92",
        "size": "31",
        "colorName": "Washed Blue",
        "colorHex": "#2d629a",
        "colorImage": "/uploads/1788651354032-photo_2026-09-05_15-24-35.jpg",
        "colorImages": "/uploads/1788651354032-photo_2026-09-05_15-24-35.jpg",
        "stock": 15
      },
      {
        "id": "d7c6357c-0887-4bf3-a2ec-5e36a48b9051",
        "productId": "6780dbd1-16ee-4203-b6c6-d30ba7054e92",
        "size": "32",
        "colorName": "Washed Blue",
        "colorHex": "#2d629a",
        "colorImage": "/uploads/1788651354032-photo_2026-09-05_15-24-35.jpg",
        "colorImages": "/uploads/1788651354032-photo_2026-09-05_15-24-35.jpg",
        "stock": 15
      },
      {
        "id": "2d42bb23-7d3a-4629-8d23-affdf5c9cfab",
        "productId": "6780dbd1-16ee-4203-b6c6-d30ba7054e92",
        "size": "33",
        "colorName": "Washed Blue",
        "colorHex": "#2d629a",
        "colorImage": "/uploads/1788651354032-photo_2026-09-05_15-24-35.jpg",
        "colorImages": "/uploads/1788651354032-photo_2026-09-05_15-24-35.jpg",
        "stock": 15
      },
      {
        "id": "fa5a6b8b-2cd8-4638-9a13-f72c62c4758a",
        "productId": "6780dbd1-16ee-4203-b6c6-d30ba7054e92",
        "size": "34",
        "colorName": "Washed Blue",
        "colorHex": "#2d629a",
        "colorImage": "/uploads/1788651354032-photo_2026-09-05_15-24-35.jpg",
        "colorImages": "/uploads/1788651354032-photo_2026-09-05_15-24-35.jpg",
        "stock": 15
      },
      {
        "id": "aa2aeaa4-6a4c-409f-b849-d51a921b37bd",
        "productId": "6780dbd1-16ee-4203-b6c6-d30ba7054e92",
        "size": "35",
        "colorName": "Washed Blue",
        "colorHex": "#2d629a",
        "colorImage": "/uploads/1788651354032-photo_2026-09-05_15-24-35.jpg",
        "colorImages": "/uploads/1788651354032-photo_2026-09-05_15-24-35.jpg",
        "stock": 15
      },
      {
        "id": "0a2d9060-da2d-478b-99f3-b06192bace70",
        "productId": "6780dbd1-16ee-4203-b6c6-d30ba7054e92",
        "size": "36",
        "colorName": "Washed Blue",
        "colorHex": "#2d629a",
        "colorImage": "/uploads/1788651354032-photo_2026-09-05_15-24-35.jpg",
        "colorImages": "/uploads/1788651354032-photo_2026-09-05_15-24-35.jpg",
        "stock": 15
      }
    ],
    "category": {
      "id": "9b404cb4-9238-4973-a50b-48e3a3941540",
      "slug": "pants-cargo",
      "nameEn": "Pants & Cargo",
      "nameAr": "البناطيل والكارغو",
      "descriptionEn": "Tactical cargo pants and relaxed streetwear trousers.",
      "descriptionAr": "بناطيل كارغو تكتيكية وقصات ستريت وير مريحة.",
      "image": "/uploads/1788714995710-photo_2026-09-06_10-16-16.jpg",
      "order": 3,
      "isHidden": false,
      "createdAt": "2026-08-27T23:29:03.203Z"
    }
  },
  {
    "id": "ebead403-0436-43cd-8bc8-c3d731961ac0",
    "slug": "grj-baggy-jeans-197",
    "nameEn": "GRJ Baggy Jeans",
    "nameAr": "GRJ Baggy Jeans",
    "descEn": "",
    "descAr": "",
    "price": 25,
    "salePrice": null,
    "sku": "BI-DROP-1474",
    "featured": true,
    "isNew": true,
    "isSale": false,
    "isActive": true,
    "categorySlug": "pants-cargo",
    "createdAt": "2026-09-05T23:34:18.884Z",
    "updatedAt": "2026-09-05T23:34:18.884Z",
    "images": [
      {
        "id": "1c7dfa3c-eb56-4d25-b36e-19fe9b77ec38",
        "productId": "ebead403-0436-43cd-8bc8-c3d731961ac0",
        "url": "/uploads/1788651209345-photo_2026-09-05_15-24-25.jpg",
        "isMain": true,
        "order": 0
      }
    ],
    "variants": [
      {
        "id": "7945f057-1e46-4c8f-8038-e73463ffa201",
        "productId": "ebead403-0436-43cd-8bc8-c3d731961ac0",
        "size": "30",
        "colorName": "Dark Washed Black",
        "colorHex": "#4A48A",
        "colorImage": "/uploads/1788651209345-photo_2026-09-05_15-24-25.jpg",
        "colorImages": "/uploads/1788651209345-photo_2026-09-05_15-24-25.jpg",
        "stock": 15
      },
      {
        "id": "29fbb9c0-119e-4e30-9e9d-08a1498f054b",
        "productId": "ebead403-0436-43cd-8bc8-c3d731961ac0",
        "size": "31",
        "colorName": "Dark Washed Black",
        "colorHex": "#4A48A",
        "colorImage": "/uploads/1788651209345-photo_2026-09-05_15-24-25.jpg",
        "colorImages": "/uploads/1788651209345-photo_2026-09-05_15-24-25.jpg",
        "stock": 15
      },
      {
        "id": "8b229a2f-0d57-4fa7-97de-d4a3b0ebb449",
        "productId": "ebead403-0436-43cd-8bc8-c3d731961ac0",
        "size": "32",
        "colorName": "Dark Washed Black",
        "colorHex": "#4A48A",
        "colorImage": "/uploads/1788651209345-photo_2026-09-05_15-24-25.jpg",
        "colorImages": "/uploads/1788651209345-photo_2026-09-05_15-24-25.jpg",
        "stock": 15
      },
      {
        "id": "bcabaa2f-52b3-496c-8a23-bb5b9bbeacba",
        "productId": "ebead403-0436-43cd-8bc8-c3d731961ac0",
        "size": "33",
        "colorName": "Dark Washed Black",
        "colorHex": "#4A48A",
        "colorImage": "/uploads/1788651209345-photo_2026-09-05_15-24-25.jpg",
        "colorImages": "/uploads/1788651209345-photo_2026-09-05_15-24-25.jpg",
        "stock": 15
      },
      {
        "id": "94005ded-97ad-49ff-801c-9f3b8349cba6",
        "productId": "ebead403-0436-43cd-8bc8-c3d731961ac0",
        "size": "34",
        "colorName": "Dark Washed Black",
        "colorHex": "#4A48A",
        "colorImage": "/uploads/1788651209345-photo_2026-09-05_15-24-25.jpg",
        "colorImages": "/uploads/1788651209345-photo_2026-09-05_15-24-25.jpg",
        "stock": 15
      },
      {
        "id": "e4d78003-3f75-41d4-8412-35ae4c610251",
        "productId": "ebead403-0436-43cd-8bc8-c3d731961ac0",
        "size": "35",
        "colorName": "Dark Washed Black",
        "colorHex": "#4A48A",
        "colorImage": "/uploads/1788651209345-photo_2026-09-05_15-24-25.jpg",
        "colorImages": "/uploads/1788651209345-photo_2026-09-05_15-24-25.jpg",
        "stock": 15
      },
      {
        "id": "b89a1c71-7ceb-463c-b3bd-9db1e00950cb",
        "productId": "ebead403-0436-43cd-8bc8-c3d731961ac0",
        "size": "36",
        "colorName": "Dark Washed Black",
        "colorHex": "#4A48A",
        "colorImage": "/uploads/1788651209345-photo_2026-09-05_15-24-25.jpg",
        "colorImages": "/uploads/1788651209345-photo_2026-09-05_15-24-25.jpg",
        "stock": 15
      }
    ],
    "category": {
      "id": "9b404cb4-9238-4973-a50b-48e3a3941540",
      "slug": "pants-cargo",
      "nameEn": "Pants & Cargo",
      "nameAr": "البناطيل والكارغو",
      "descriptionEn": "Tactical cargo pants and relaxed streetwear trousers.",
      "descriptionAr": "بناطيل كارغو تكتيكية وقصات ستريت وير مريحة.",
      "image": "/uploads/1788714995710-photo_2026-09-06_10-16-16.jpg",
      "order": 3,
      "isHidden": false,
      "createdAt": "2026-08-27T23:29:03.203Z"
    }
  },
  {
    "id": "b0114d13-09f9-47bf-8317-fd8d593bf056",
    "slug": "well-baggy-jeans-333",
    "nameEn": "WELL Baggy Jeans",
    "nameAr": "WELL Baggy Jeans",
    "descEn": "",
    "descAr": "",
    "price": 25,
    "salePrice": null,
    "sku": "BI-DROP-2819",
    "featured": true,
    "isNew": true,
    "isSale": false,
    "isActive": true,
    "categorySlug": "pants-cargo",
    "createdAt": "2026-09-05T23:32:01.872Z",
    "updatedAt": "2026-09-05T23:32:01.872Z",
    "images": [
      {
        "id": "f0049582-b1d7-430c-94f2-685a985cc9a8",
        "productId": "b0114d13-09f9-47bf-8317-fd8d593bf056",
        "url": "/uploads/1788651082617-photo_2026-09-05_15-24-22.jpg",
        "isMain": true,
        "order": 0
      }
    ],
    "variants": [
      {
        "id": "fb6a8fae-9fab-4a2d-b99a-44d709ae0e7a",
        "productId": "b0114d13-09f9-47bf-8317-fd8d593bf056",
        "size": "30",
        "colorName": "Light Ice Blue Washed",
        "colorHex": "#B8C9D4",
        "colorImage": "/uploads/1788651082617-photo_2026-09-05_15-24-22.jpg",
        "colorImages": "/uploads/1788651082617-photo_2026-09-05_15-24-22.jpg",
        "stock": 15
      },
      {
        "id": "8fbabb20-39b7-4dbb-89c8-4f1b7181675d",
        "productId": "b0114d13-09f9-47bf-8317-fd8d593bf056",
        "size": "31",
        "colorName": "Light Ice Blue Washed",
        "colorHex": "#B8C9D4",
        "colorImage": "/uploads/1788651082617-photo_2026-09-05_15-24-22.jpg",
        "colorImages": "/uploads/1788651082617-photo_2026-09-05_15-24-22.jpg",
        "stock": 15
      },
      {
        "id": "79bc3e14-1ba6-49b6-9d98-33ecbb9fa8c5",
        "productId": "b0114d13-09f9-47bf-8317-fd8d593bf056",
        "size": "32",
        "colorName": "Light Ice Blue Washed",
        "colorHex": "#B8C9D4",
        "colorImage": "/uploads/1788651082617-photo_2026-09-05_15-24-22.jpg",
        "colorImages": "/uploads/1788651082617-photo_2026-09-05_15-24-22.jpg",
        "stock": 15
      },
      {
        "id": "64f3419f-20b7-4b85-91f4-2591a2d5d6a2",
        "productId": "b0114d13-09f9-47bf-8317-fd8d593bf056",
        "size": "33",
        "colorName": "Light Ice Blue Washed",
        "colorHex": "#B8C9D4",
        "colorImage": "/uploads/1788651082617-photo_2026-09-05_15-24-22.jpg",
        "colorImages": "/uploads/1788651082617-photo_2026-09-05_15-24-22.jpg",
        "stock": 15
      },
      {
        "id": "4d1b5182-4130-49c1-b951-6716866273b5",
        "productId": "b0114d13-09f9-47bf-8317-fd8d593bf056",
        "size": "34",
        "colorName": "Light Ice Blue Washed",
        "colorHex": "#B8C9D4",
        "colorImage": "/uploads/1788651082617-photo_2026-09-05_15-24-22.jpg",
        "colorImages": "/uploads/1788651082617-photo_2026-09-05_15-24-22.jpg",
        "stock": 15
      },
      {
        "id": "9ce8bd39-9ce4-4bf5-9019-4dda556c466b",
        "productId": "b0114d13-09f9-47bf-8317-fd8d593bf056",
        "size": "35",
        "colorName": "Light Ice Blue Washed",
        "colorHex": "#B8C9D4",
        "colorImage": "/uploads/1788651082617-photo_2026-09-05_15-24-22.jpg",
        "colorImages": "/uploads/1788651082617-photo_2026-09-05_15-24-22.jpg",
        "stock": 15
      },
      {
        "id": "2f8ccc9e-1325-4384-a672-c2f73e3b08e6",
        "productId": "b0114d13-09f9-47bf-8317-fd8d593bf056",
        "size": "36",
        "colorName": "Light Ice Blue Washed",
        "colorHex": "#B8C9D4",
        "colorImage": "/uploads/1788651082617-photo_2026-09-05_15-24-22.jpg",
        "colorImages": "/uploads/1788651082617-photo_2026-09-05_15-24-22.jpg",
        "stock": 15
      }
    ],
    "category": {
      "id": "9b404cb4-9238-4973-a50b-48e3a3941540",
      "slug": "pants-cargo",
      "nameEn": "Pants & Cargo",
      "nameAr": "البناطيل والكارغو",
      "descriptionEn": "Tactical cargo pants and relaxed streetwear trousers.",
      "descriptionAr": "بناطيل كارغو تكتيكية وقصات ستريت وير مريحة.",
      "image": "/uploads/1788714995710-photo_2026-09-06_10-16-16.jpg",
      "order": 3,
      "isHidden": false,
      "createdAt": "2026-08-27T23:29:03.203Z"
    }
  },
  {
    "id": "690a5886-9026-4364-8b28-35d0e52b8f0e",
    "slug": "well-boyfriend-jeans-601",
    "nameEn": "WELL Boyfriend Jeans",
    "nameAr": "WELL Boyfriend Jeans",
    "descEn": "",
    "descAr": "",
    "price": 25,
    "salePrice": null,
    "sku": "BI-DROP-5509",
    "featured": true,
    "isNew": true,
    "isSale": false,
    "isActive": true,
    "categorySlug": "pants-cargo",
    "createdAt": "2026-09-05T23:30:15.916Z",
    "updatedAt": "2026-09-05T23:30:15.916Z",
    "images": [
      {
        "id": "36652e93-ef17-4b1b-9d00-407efc36b3db",
        "productId": "690a5886-9026-4364-8b28-35d0e52b8f0e",
        "url": "/uploads/1788650979994-photo_2026-09-05_15-24-15.jpg",
        "isMain": true,
        "order": 0
      }
    ],
    "variants": [
      {
        "id": "2449bfe7-dec4-4e59-be69-3cb324de4487",
        "productId": "690a5886-9026-4364-8b28-35d0e52b8f0e",
        "size": "30",
        "colorName": "Light Ice Blue Washed",
        "colorHex": "#B8C9D4",
        "colorImage": "/uploads/1788650979994-photo_2026-09-05_15-24-15.jpg",
        "colorImages": "/uploads/1788650979994-photo_2026-09-05_15-24-15.jpg",
        "stock": 15
      },
      {
        "id": "8ffec0a6-42f8-4285-9871-998d6b23e45e",
        "productId": "690a5886-9026-4364-8b28-35d0e52b8f0e",
        "size": "31",
        "colorName": "Light Ice Blue Washed",
        "colorHex": "#B8C9D4",
        "colorImage": "/uploads/1788650979994-photo_2026-09-05_15-24-15.jpg",
        "colorImages": "/uploads/1788650979994-photo_2026-09-05_15-24-15.jpg",
        "stock": 15
      },
      {
        "id": "56002491-9b3e-40b8-9520-4055bea8614f",
        "productId": "690a5886-9026-4364-8b28-35d0e52b8f0e",
        "size": "32",
        "colorName": "Light Ice Blue Washed",
        "colorHex": "#B8C9D4",
        "colorImage": "/uploads/1788650979994-photo_2026-09-05_15-24-15.jpg",
        "colorImages": "/uploads/1788650979994-photo_2026-09-05_15-24-15.jpg",
        "stock": 15
      },
      {
        "id": "ad7d42d3-0cd2-45cd-b0ae-f28688ae73d7",
        "productId": "690a5886-9026-4364-8b28-35d0e52b8f0e",
        "size": "33",
        "colorName": "Light Ice Blue Washed",
        "colorHex": "#B8C9D4",
        "colorImage": "/uploads/1788650979994-photo_2026-09-05_15-24-15.jpg",
        "colorImages": "/uploads/1788650979994-photo_2026-09-05_15-24-15.jpg",
        "stock": 15
      },
      {
        "id": "cf9ef318-8a52-4ebe-8529-83d7cbd59b52",
        "productId": "690a5886-9026-4364-8b28-35d0e52b8f0e",
        "size": "34",
        "colorName": "Light Ice Blue Washed",
        "colorHex": "#B8C9D4",
        "colorImage": "/uploads/1788650979994-photo_2026-09-05_15-24-15.jpg",
        "colorImages": "/uploads/1788650979994-photo_2026-09-05_15-24-15.jpg",
        "stock": 15
      },
      {
        "id": "3d8d1652-ebf2-4eb9-911a-0e75ed3e31bb",
        "productId": "690a5886-9026-4364-8b28-35d0e52b8f0e",
        "size": "35",
        "colorName": "Light Ice Blue Washed",
        "colorHex": "#B8C9D4",
        "colorImage": "/uploads/1788650979994-photo_2026-09-05_15-24-15.jpg",
        "colorImages": "/uploads/1788650979994-photo_2026-09-05_15-24-15.jpg",
        "stock": 15
      },
      {
        "id": "4524d18f-6fb3-4378-8322-06bcab198472",
        "productId": "690a5886-9026-4364-8b28-35d0e52b8f0e",
        "size": "36",
        "colorName": "Light Ice Blue Washed",
        "colorHex": "#B8C9D4",
        "colorImage": "/uploads/1788650979994-photo_2026-09-05_15-24-15.jpg",
        "colorImages": "/uploads/1788650979994-photo_2026-09-05_15-24-15.jpg",
        "stock": 15
      }
    ],
    "category": {
      "id": "9b404cb4-9238-4973-a50b-48e3a3941540",
      "slug": "pants-cargo",
      "nameEn": "Pants & Cargo",
      "nameAr": "البناطيل والكارغو",
      "descriptionEn": "Tactical cargo pants and relaxed streetwear trousers.",
      "descriptionAr": "بناطيل كارغو تكتيكية وقصات ستريت وير مريحة.",
      "image": "/uploads/1788714995710-photo_2026-09-06_10-16-16.jpg",
      "order": 3,
      "isHidden": false,
      "createdAt": "2026-08-27T23:29:03.203Z"
    }
  },
  {
    "id": "3f434c7e-810f-4f40-9468-851f1d72b0bb",
    "slug": "well-boyfriend-jeans-265",
    "nameEn": "WELL Baggy Jeans",
    "nameAr": "WELL Baggy Jeans",
    "descEn": "",
    "descAr": "",
    "price": 25,
    "salePrice": null,
    "sku": "BI-DROP-8238",
    "featured": true,
    "isNew": true,
    "isSale": false,
    "isActive": true,
    "categorySlug": "pants-cargo",
    "createdAt": "2026-09-05T23:25:42.931Z",
    "updatedAt": "2026-09-05T23:30:39.858Z",
    "images": [
      {
        "id": "df203035-203f-4197-83a4-1a20e3f39a1b",
        "productId": "3f434c7e-810f-4f40-9468-851f1d72b0bb",
        "url": "/uploads/1788650731702-photo_2026-09-05_15-24-12.jpg",
        "isMain": true,
        "order": 0
      }
    ],
    "variants": [
      {
        "id": "ec573cf1-a087-4be2-891c-ad7446b4fcf0",
        "productId": "3f434c7e-810f-4f40-9468-851f1d72b0bb",
        "size": "30",
        "colorName": "Light Washed Grey",
        "colorHex": "#B0B0B0",
        "colorImage": "/uploads/1788650731702-photo_2026-09-05_15-24-12.jpg",
        "colorImages": "/uploads/1788650731702-photo_2026-09-05_15-24-12.jpg",
        "stock": 15
      },
      {
        "id": "ff58595e-3e29-423a-a3fd-dfa99c38c893",
        "productId": "3f434c7e-810f-4f40-9468-851f1d72b0bb",
        "size": "31",
        "colorName": "Light Washed Grey",
        "colorHex": "#B0B0B0",
        "colorImage": "/uploads/1788650731702-photo_2026-09-05_15-24-12.jpg",
        "colorImages": "/uploads/1788650731702-photo_2026-09-05_15-24-12.jpg",
        "stock": 15
      },
      {
        "id": "3159a4ce-4881-4c1d-b5cb-55dee16189a0",
        "productId": "3f434c7e-810f-4f40-9468-851f1d72b0bb",
        "size": "32",
        "colorName": "Light Washed Grey",
        "colorHex": "#B0B0B0",
        "colorImage": "/uploads/1788650731702-photo_2026-09-05_15-24-12.jpg",
        "colorImages": "/uploads/1788650731702-photo_2026-09-05_15-24-12.jpg",
        "stock": 15
      },
      {
        "id": "ff1b1d94-c1dd-4055-9958-6399732647f2",
        "productId": "3f434c7e-810f-4f40-9468-851f1d72b0bb",
        "size": "33",
        "colorName": "Light Washed Grey",
        "colorHex": "#B0B0B0",
        "colorImage": "/uploads/1788650731702-photo_2026-09-05_15-24-12.jpg",
        "colorImages": "/uploads/1788650731702-photo_2026-09-05_15-24-12.jpg",
        "stock": 15
      },
      {
        "id": "165700c8-ee86-4790-9b61-407c4cf8019f",
        "productId": "3f434c7e-810f-4f40-9468-851f1d72b0bb",
        "size": "34",
        "colorName": "Light Washed Grey",
        "colorHex": "#B0B0B0",
        "colorImage": "/uploads/1788650731702-photo_2026-09-05_15-24-12.jpg",
        "colorImages": "/uploads/1788650731702-photo_2026-09-05_15-24-12.jpg",
        "stock": 15
      },
      {
        "id": "c80bb738-96a9-4e3a-a9c1-ba8c9dd6ec90",
        "productId": "3f434c7e-810f-4f40-9468-851f1d72b0bb",
        "size": "35",
        "colorName": "Light Washed Grey",
        "colorHex": "#B0B0B0",
        "colorImage": "/uploads/1788650731702-photo_2026-09-05_15-24-12.jpg",
        "colorImages": "/uploads/1788650731702-photo_2026-09-05_15-24-12.jpg",
        "stock": 15
      },
      {
        "id": "9eb9a34b-f745-44e3-9046-e5db24554174",
        "productId": "3f434c7e-810f-4f40-9468-851f1d72b0bb",
        "size": "36",
        "colorName": "Light Washed Grey",
        "colorHex": "#B0B0B0",
        "colorImage": "/uploads/1788650731702-photo_2026-09-05_15-24-12.jpg",
        "colorImages": "/uploads/1788650731702-photo_2026-09-05_15-24-12.jpg",
        "stock": 15
      }
    ],
    "category": {
      "id": "9b404cb4-9238-4973-a50b-48e3a3941540",
      "slug": "pants-cargo",
      "nameEn": "Pants & Cargo",
      "nameAr": "البناطيل والكارغو",
      "descriptionEn": "Tactical cargo pants and relaxed streetwear trousers.",
      "descriptionAr": "بناطيل كارغو تكتيكية وقصات ستريت وير مريحة.",
      "image": "/uploads/1788714995710-photo_2026-09-06_10-16-16.jpg",
      "order": 3,
      "isHidden": false,
      "createdAt": "2026-08-27T23:29:03.203Z"
    }
  },
  {
    "id": "ec9819f7-2cfc-4d30-a866-c1430223be19",
    "slug": "x-time-boyfriend-jeans-637",
    "nameEn": "X Time Boyfriend Jeans",
    "nameAr": "X Time Boyfriend Jeans",
    "descEn": "",
    "descAr": "",
    "price": 20,
    "salePrice": null,
    "sku": "BI-DROP-5065",
    "featured": true,
    "isNew": true,
    "isSale": false,
    "isActive": true,
    "categorySlug": "pants-cargo",
    "createdAt": "2026-09-05T22:51:36.593Z",
    "updatedAt": "2026-09-05T22:51:36.593Z",
    "images": [
      {
        "id": "d4655656-c14b-450e-97e1-946e030163a4",
        "productId": "ec9819f7-2cfc-4d30-a866-c1430223be19",
        "url": "/uploads/1788648473377-photo_2026-09-05_15-24-05.jpg",
        "isMain": true,
        "order": 0
      },
      {
        "id": "bf71e0b0-6cfc-4056-a19f-2f70480bd793",
        "productId": "ec9819f7-2cfc-4d30-a866-c1430223be19",
        "url": "/uploads/1788648572559-photo_2026-09-05_15-24-10.jpg",
        "isMain": false,
        "order": 1
      }
    ],
    "variants": [
      {
        "id": "01fe56de-c4e4-4d52-b382-2b546f101e8a",
        "productId": "ec9819f7-2cfc-4d30-a866-c1430223be19",
        "size": "30",
        "colorName": "Faded Ice Blue",
        "colorHex": "#A3B8CC",
        "colorImage": "/uploads/1788648473377-photo_2026-09-05_15-24-05.jpg",
        "colorImages": "/uploads/1788648473377-photo_2026-09-05_15-24-05.jpg",
        "stock": 15
      },
      {
        "id": "0c905d4b-3e95-403d-a337-fa42a7b91224",
        "productId": "ec9819f7-2cfc-4d30-a866-c1430223be19",
        "size": "31",
        "colorName": "Faded Ice Blue",
        "colorHex": "#A3B8CC",
        "colorImage": "/uploads/1788648473377-photo_2026-09-05_15-24-05.jpg",
        "colorImages": "/uploads/1788648473377-photo_2026-09-05_15-24-05.jpg",
        "stock": 15
      },
      {
        "id": "2fe7972d-36f9-45bc-8cd1-f101f954dd43",
        "productId": "ec9819f7-2cfc-4d30-a866-c1430223be19",
        "size": "32",
        "colorName": "Faded Ice Blue",
        "colorHex": "#A3B8CC",
        "colorImage": "/uploads/1788648473377-photo_2026-09-05_15-24-05.jpg",
        "colorImages": "/uploads/1788648473377-photo_2026-09-05_15-24-05.jpg",
        "stock": 15
      },
      {
        "id": "b346c7f5-d724-4844-a7fb-08c32c34061c",
        "productId": "ec9819f7-2cfc-4d30-a866-c1430223be19",
        "size": "33",
        "colorName": "Faded Ice Blue",
        "colorHex": "#A3B8CC",
        "colorImage": "/uploads/1788648473377-photo_2026-09-05_15-24-05.jpg",
        "colorImages": "/uploads/1788648473377-photo_2026-09-05_15-24-05.jpg",
        "stock": 15
      },
      {
        "id": "9bd8545a-402f-4519-acb0-4552cb44c882",
        "productId": "ec9819f7-2cfc-4d30-a866-c1430223be19",
        "size": "34",
        "colorName": "Faded Ice Blue",
        "colorHex": "#A3B8CC",
        "colorImage": "/uploads/1788648473377-photo_2026-09-05_15-24-05.jpg",
        "colorImages": "/uploads/1788648473377-photo_2026-09-05_15-24-05.jpg",
        "stock": 15
      },
      {
        "id": "5b479105-48fb-4a2d-a995-d5e1ac4c1557",
        "productId": "ec9819f7-2cfc-4d30-a866-c1430223be19",
        "size": "35",
        "colorName": "Faded Ice Blue",
        "colorHex": "#A3B8CC",
        "colorImage": "/uploads/1788648473377-photo_2026-09-05_15-24-05.jpg",
        "colorImages": "/uploads/1788648473377-photo_2026-09-05_15-24-05.jpg",
        "stock": 15
      },
      {
        "id": "782c15c8-3bd9-4211-b0e8-a36f41c03d9e",
        "productId": "ec9819f7-2cfc-4d30-a866-c1430223be19",
        "size": "36",
        "colorName": "Faded Ice Blue",
        "colorHex": "#A3B8CC",
        "colorImage": "/uploads/1788648473377-photo_2026-09-05_15-24-05.jpg",
        "colorImages": "/uploads/1788648473377-photo_2026-09-05_15-24-05.jpg",
        "stock": 15
      },
      {
        "id": "a8c7ebd5-388b-41d1-904a-adab5b383cb9",
        "productId": "ec9819f7-2cfc-4d30-a866-c1430223be19",
        "size": "30",
        "colorName": "Light Washed Blue",
        "colorHex": "#8CA5C1",
        "colorImage": "/uploads/1788648572559-photo_2026-09-05_15-24-10.jpg",
        "colorImages": "/uploads/1788648572559-photo_2026-09-05_15-24-10.jpg",
        "stock": 15
      },
      {
        "id": "b8ce7e9b-3212-4afc-9cfb-6419d3c6a0a5",
        "productId": "ec9819f7-2cfc-4d30-a866-c1430223be19",
        "size": "31",
        "colorName": "Light Washed Blue",
        "colorHex": "#8CA5C1",
        "colorImage": "/uploads/1788648572559-photo_2026-09-05_15-24-10.jpg",
        "colorImages": "/uploads/1788648572559-photo_2026-09-05_15-24-10.jpg",
        "stock": 15
      },
      {
        "id": "265e32c3-0ef8-47f5-a51c-7decff814dcc",
        "productId": "ec9819f7-2cfc-4d30-a866-c1430223be19",
        "size": "32",
        "colorName": "Light Washed Blue",
        "colorHex": "#8CA5C1",
        "colorImage": "/uploads/1788648572559-photo_2026-09-05_15-24-10.jpg",
        "colorImages": "/uploads/1788648572559-photo_2026-09-05_15-24-10.jpg",
        "stock": 15
      },
      {
        "id": "59da2c8a-9bd3-4978-9306-20550187e757",
        "productId": "ec9819f7-2cfc-4d30-a866-c1430223be19",
        "size": "33",
        "colorName": "Light Washed Blue",
        "colorHex": "#8CA5C1",
        "colorImage": "/uploads/1788648572559-photo_2026-09-05_15-24-10.jpg",
        "colorImages": "/uploads/1788648572559-photo_2026-09-05_15-24-10.jpg",
        "stock": 15
      },
      {
        "id": "ddca324f-50e1-4f02-8069-552ee519d015",
        "productId": "ec9819f7-2cfc-4d30-a866-c1430223be19",
        "size": "34",
        "colorName": "Light Washed Blue",
        "colorHex": "#8CA5C1",
        "colorImage": "/uploads/1788648572559-photo_2026-09-05_15-24-10.jpg",
        "colorImages": "/uploads/1788648572559-photo_2026-09-05_15-24-10.jpg",
        "stock": 15
      },
      {
        "id": "c04de312-2e58-48f1-be6f-45be78003fce",
        "productId": "ec9819f7-2cfc-4d30-a866-c1430223be19",
        "size": "35",
        "colorName": "Light Washed Blue",
        "colorHex": "#8CA5C1",
        "colorImage": "/uploads/1788648572559-photo_2026-09-05_15-24-10.jpg",
        "colorImages": "/uploads/1788648572559-photo_2026-09-05_15-24-10.jpg",
        "stock": 15
      },
      {
        "id": "2bdd100f-9bee-43f9-93a2-5d810a75e649",
        "productId": "ec9819f7-2cfc-4d30-a866-c1430223be19",
        "size": "36",
        "colorName": "Light Washed Blue",
        "colorHex": "#8CA5C1",
        "colorImage": "/uploads/1788648572559-photo_2026-09-05_15-24-10.jpg",
        "colorImages": "/uploads/1788648572559-photo_2026-09-05_15-24-10.jpg",
        "stock": 15
      }
    ],
    "category": {
      "id": "9b404cb4-9238-4973-a50b-48e3a3941540",
      "slug": "pants-cargo",
      "nameEn": "Pants & Cargo",
      "nameAr": "البناطيل والكارغو",
      "descriptionEn": "Tactical cargo pants and relaxed streetwear trousers.",
      "descriptionAr": "بناطيل كارغو تكتيكية وقصات ستريت وير مريحة.",
      "image": "/uploads/1788714995710-photo_2026-09-06_10-16-16.jpg",
      "order": 3,
      "isHidden": false,
      "createdAt": "2026-08-27T23:29:03.203Z"
    }
  },
  {
    "id": "0b4b0dde-2587-4ccd-8bb4-6bbf7d45f69e",
    "slug": "dnm-oscar-boyfriend-jeans-769",
    "nameEn": "DNM OSCAR Boyfriend Jeans",
    "nameAr": "DNM OSCAR Boyfriend Jeans",
    "descEn": "",
    "descAr": "",
    "price": 20,
    "salePrice": null,
    "sku": "BI-DROP-4309",
    "featured": true,
    "isNew": true,
    "isSale": false,
    "isActive": true,
    "categorySlug": "pants-cargo",
    "createdAt": "2026-09-05T22:43:32.301Z",
    "updatedAt": "2026-09-05T22:43:32.301Z",
    "images": [
      {
        "id": "b66d4621-ec56-427b-91db-0bdfa981186a",
        "productId": "0b4b0dde-2587-4ccd-8bb4-6bbf7d45f69e",
        "url": "/uploads/1788648162754-photo_2026-09-05_15-23-57.jpg",
        "isMain": true,
        "order": 0
      }
    ],
    "variants": [
      {
        "id": "e0d2330e-e866-4cbe-bf18-c579e5f773bc",
        "productId": "0b4b0dde-2587-4ccd-8bb4-6bbf7d45f69e",
        "size": "30",
        "colorName": "Blue",
        "colorHex": "#5a6f90",
        "colorImage": "/uploads/1788648162754-photo_2026-09-05_15-23-57.jpg",
        "colorImages": "/uploads/1788648162754-photo_2026-09-05_15-23-57.jpg",
        "stock": 15
      },
      {
        "id": "1685d312-6ed7-4b0f-af45-2aa9ef2a6f3c",
        "productId": "0b4b0dde-2587-4ccd-8bb4-6bbf7d45f69e",
        "size": "31",
        "colorName": "Blue",
        "colorHex": "#5a6f90",
        "colorImage": "/uploads/1788648162754-photo_2026-09-05_15-23-57.jpg",
        "colorImages": "/uploads/1788648162754-photo_2026-09-05_15-23-57.jpg",
        "stock": 15
      },
      {
        "id": "1cb8721b-b060-4a74-8ebe-47a25a8e9e55",
        "productId": "0b4b0dde-2587-4ccd-8bb4-6bbf7d45f69e",
        "size": "32",
        "colorName": "Blue",
        "colorHex": "#5a6f90",
        "colorImage": "/uploads/1788648162754-photo_2026-09-05_15-23-57.jpg",
        "colorImages": "/uploads/1788648162754-photo_2026-09-05_15-23-57.jpg",
        "stock": 15
      },
      {
        "id": "0d9bf335-bfe7-44e1-a321-bf49be54a157",
        "productId": "0b4b0dde-2587-4ccd-8bb4-6bbf7d45f69e",
        "size": "33",
        "colorName": "Blue",
        "colorHex": "#5a6f90",
        "colorImage": "/uploads/1788648162754-photo_2026-09-05_15-23-57.jpg",
        "colorImages": "/uploads/1788648162754-photo_2026-09-05_15-23-57.jpg",
        "stock": 15
      },
      {
        "id": "489ecf45-7d1c-4698-b2fc-41b9e1ad5eb8",
        "productId": "0b4b0dde-2587-4ccd-8bb4-6bbf7d45f69e",
        "size": "34",
        "colorName": "Blue",
        "colorHex": "#5a6f90",
        "colorImage": "/uploads/1788648162754-photo_2026-09-05_15-23-57.jpg",
        "colorImages": "/uploads/1788648162754-photo_2026-09-05_15-23-57.jpg",
        "stock": 15
      },
      {
        "id": "da068636-838b-4949-825e-b955939cf634",
        "productId": "0b4b0dde-2587-4ccd-8bb4-6bbf7d45f69e",
        "size": "35",
        "colorName": "Blue",
        "colorHex": "#5a6f90",
        "colorImage": "/uploads/1788648162754-photo_2026-09-05_15-23-57.jpg",
        "colorImages": "/uploads/1788648162754-photo_2026-09-05_15-23-57.jpg",
        "stock": 15
      },
      {
        "id": "11bf4f0e-105c-408f-a4ef-1868992b1a10",
        "productId": "0b4b0dde-2587-4ccd-8bb4-6bbf7d45f69e",
        "size": "36",
        "colorName": "Blue",
        "colorHex": "#5a6f90",
        "colorImage": "/uploads/1788648162754-photo_2026-09-05_15-23-57.jpg",
        "colorImages": "/uploads/1788648162754-photo_2026-09-05_15-23-57.jpg",
        "stock": 15
      }
    ],
    "category": {
      "id": "9b404cb4-9238-4973-a50b-48e3a3941540",
      "slug": "pants-cargo",
      "nameEn": "Pants & Cargo",
      "nameAr": "البناطيل والكارغو",
      "descriptionEn": "Tactical cargo pants and relaxed streetwear trousers.",
      "descriptionAr": "بناطيل كارغو تكتيكية وقصات ستريت وير مريحة.",
      "image": "/uploads/1788714995710-photo_2026-09-06_10-16-16.jpg",
      "order": 3,
      "isHidden": false,
      "createdAt": "2026-08-27T23:29:03.203Z"
    }
  },
  {
    "id": "b2cfc19b-8699-4ad5-9887-c19d8f8e1fe2",
    "slug": "catch-boyfriend-jeans-402",
    "nameEn": "Catch Boyfriend Jeans",
    "nameAr": "Catch Boyfriend Jeans",
    "descEn": "",
    "descAr": "",
    "price": 20,
    "salePrice": null,
    "sku": "BI-DROP-9131",
    "featured": true,
    "isNew": true,
    "isSale": false,
    "isActive": true,
    "categorySlug": "pants-cargo",
    "createdAt": "2026-09-05T22:39:52.433Z",
    "updatedAt": "2026-09-05T22:41:36.817Z",
    "images": [
      {
        "id": "17a2b306-ad88-4748-8827-f984a1d5a034",
        "productId": "b2cfc19b-8699-4ad5-9887-c19d8f8e1fe2",
        "url": "/uploads/1788647925772-photo_2026-09-05_15-23-46.jpg",
        "isMain": true,
        "order": 0
      }
    ],
    "variants": [
      {
        "id": "7724a7c3-3f70-4c36-8e96-5f91b36bb029",
        "productId": "b2cfc19b-8699-4ad5-9887-c19d8f8e1fe2",
        "size": "30",
        "colorName": "Navy",
        "colorHex": "#6b8d9e",
        "colorImage": "/uploads/1788647925772-photo_2026-09-05_15-23-46.jpg",
        "colorImages": "/uploads/1788647925772-photo_2026-09-05_15-23-46.jpg",
        "stock": 15
      },
      {
        "id": "83131bd3-32cb-4309-bf5e-5ad297fe0384",
        "productId": "b2cfc19b-8699-4ad5-9887-c19d8f8e1fe2",
        "size": "31",
        "colorName": "Navy",
        "colorHex": "#6b8d9e",
        "colorImage": "/uploads/1788647925772-photo_2026-09-05_15-23-46.jpg",
        "colorImages": "/uploads/1788647925772-photo_2026-09-05_15-23-46.jpg",
        "stock": 15
      },
      {
        "id": "3db1e43d-ab12-493c-bafa-cf21152b0a7e",
        "productId": "b2cfc19b-8699-4ad5-9887-c19d8f8e1fe2",
        "size": "32",
        "colorName": "Navy",
        "colorHex": "#6b8d9e",
        "colorImage": "/uploads/1788647925772-photo_2026-09-05_15-23-46.jpg",
        "colorImages": "/uploads/1788647925772-photo_2026-09-05_15-23-46.jpg",
        "stock": 15
      },
      {
        "id": "2cb2d1a1-5774-4130-a135-2bdf33a6da60",
        "productId": "b2cfc19b-8699-4ad5-9887-c19d8f8e1fe2",
        "size": "33",
        "colorName": "Navy",
        "colorHex": "#6b8d9e",
        "colorImage": "/uploads/1788647925772-photo_2026-09-05_15-23-46.jpg",
        "colorImages": "/uploads/1788647925772-photo_2026-09-05_15-23-46.jpg",
        "stock": 15
      },
      {
        "id": "7e8fd2a5-8e85-4cdd-89d9-5711584d424c",
        "productId": "b2cfc19b-8699-4ad5-9887-c19d8f8e1fe2",
        "size": "34",
        "colorName": "Navy",
        "colorHex": "#6b8d9e",
        "colorImage": "/uploads/1788647925772-photo_2026-09-05_15-23-46.jpg",
        "colorImages": "/uploads/1788647925772-photo_2026-09-05_15-23-46.jpg",
        "stock": 15
      },
      {
        "id": "cca043bf-9f33-4e65-a6dd-3a3ab2a327c3",
        "productId": "b2cfc19b-8699-4ad5-9887-c19d8f8e1fe2",
        "size": "35",
        "colorName": "Navy",
        "colorHex": "#6b8d9e",
        "colorImage": "/uploads/1788647925772-photo_2026-09-05_15-23-46.jpg",
        "colorImages": "/uploads/1788647925772-photo_2026-09-05_15-23-46.jpg",
        "stock": 15
      },
      {
        "id": "8763b6bd-2fde-470f-8aed-d4e5028115c2",
        "productId": "b2cfc19b-8699-4ad5-9887-c19d8f8e1fe2",
        "size": "36",
        "colorName": "Navy",
        "colorHex": "#6b8d9e",
        "colorImage": "/uploads/1788647925772-photo_2026-09-05_15-23-46.jpg",
        "colorImages": "/uploads/1788647925772-photo_2026-09-05_15-23-46.jpg",
        "stock": 15
      }
    ],
    "category": {
      "id": "9b404cb4-9238-4973-a50b-48e3a3941540",
      "slug": "pants-cargo",
      "nameEn": "Pants & Cargo",
      "nameAr": "البناطيل والكارغو",
      "descriptionEn": "Tactical cargo pants and relaxed streetwear trousers.",
      "descriptionAr": "بناطيل كارغو تكتيكية وقصات ستريت وير مريحة.",
      "image": "/uploads/1788714995710-photo_2026-09-06_10-16-16.jpg",
      "order": 3,
      "isHidden": false,
      "createdAt": "2026-08-27T23:29:03.203Z"
    }
  },
  {
    "id": "0c5c3ec1-0242-4386-893a-f66e34ef44ec",
    "slug": "catch-studios-oversize-t-shirt-496",
    "nameEn": "Catch Studios OverSize T-Shirt",
    "nameAr": "Catch Studios OverSize T-Shirt",
    "descEn": "",
    "descAr": "",
    "price": 15,
    "salePrice": null,
    "sku": "BI-DROP-5643",
    "featured": true,
    "isNew": true,
    "isSale": false,
    "isActive": true,
    "categorySlug": "t-shirts-oversized",
    "createdAt": "2026-08-31T22:10:34.656Z",
    "updatedAt": "2026-08-31T22:10:34.656Z",
    "images": [
      {
        "id": "92520bb3-552a-4827-a6e2-fb644b360c10",
        "productId": "0c5c3ec1-0242-4386-893a-f66e34ef44ec",
        "url": "/uploads/1788214212190-photo_2026-08-30_08-53-33.jpg",
        "isMain": true,
        "order": 0
      },
      {
        "id": "c2dcb9db-0846-41db-bdc4-a187d65f0d47",
        "productId": "0c5c3ec1-0242-4386-893a-f66e34ef44ec",
        "url": "/uploads/1788214216418-photo_2026-08-30_08-53-47.jpg",
        "isMain": false,
        "order": 1
      }
    ],
    "variants": [
      {
        "id": "3e4bbedc-67a9-40e3-8e4e-d3c4cacd3db6",
        "productId": "0c5c3ec1-0242-4386-893a-f66e34ef44ec",
        "size": "S",
        "colorName": "Grey",
        "colorHex": "#949494",
        "colorImage": "/uploads/1788214212190-photo_2026-08-30_08-53-33.jpg",
        "colorImages": "/uploads/1788214212190-photo_2026-08-30_08-53-33.jpg,/uploads/1788214216418-photo_2026-08-30_08-53-47.jpg",
        "stock": 10
      },
      {
        "id": "16f7569a-0987-4402-a6e8-01313369737e",
        "productId": "0c5c3ec1-0242-4386-893a-f66e34ef44ec",
        "size": "M",
        "colorName": "Grey",
        "colorHex": "#949494",
        "colorImage": "/uploads/1788214212190-photo_2026-08-30_08-53-33.jpg",
        "colorImages": "/uploads/1788214212190-photo_2026-08-30_08-53-33.jpg,/uploads/1788214216418-photo_2026-08-30_08-53-47.jpg",
        "stock": 15
      },
      {
        "id": "ff481115-f26c-43cc-b30d-fb2929fb44e5",
        "productId": "0c5c3ec1-0242-4386-893a-f66e34ef44ec",
        "size": "L",
        "colorName": "Grey",
        "colorHex": "#949494",
        "colorImage": "/uploads/1788214212190-photo_2026-08-30_08-53-33.jpg",
        "colorImages": "/uploads/1788214212190-photo_2026-08-30_08-53-33.jpg,/uploads/1788214216418-photo_2026-08-30_08-53-47.jpg",
        "stock": 20
      },
      {
        "id": "4b6abff4-8c79-42af-a5cb-59df47cab735",
        "productId": "0c5c3ec1-0242-4386-893a-f66e34ef44ec",
        "size": "XL",
        "colorName": "Grey",
        "colorHex": "#949494",
        "colorImage": "/uploads/1788214212190-photo_2026-08-30_08-53-33.jpg",
        "colorImages": "/uploads/1788214212190-photo_2026-08-30_08-53-33.jpg,/uploads/1788214216418-photo_2026-08-30_08-53-47.jpg",
        "stock": 15
      }
    ],
    "category": {
      "id": "9836ec41-76d8-44f8-8abc-93e271d42b4d",
      "slug": "t-shirts-oversized",
      "nameEn": "T-Shirts & Oversized",
      "nameAr": "التيشيرتات والأوفرسايز",
      "descriptionEn": "Drop-shoulder street tees with high-density graphics.",
      "descriptionAr": "تيشيرتات أكتاف منسدلة وطباعة عالية الدقة.",
      "image": "/uploads/1788715207412-photo_2026-09-06_10-19-47.jpg",
      "order": 2,
      "isHidden": false,
      "createdAt": "2026-08-27T23:29:03.198Z"
    }
  },
  {
    "id": "d20a9229-f5e6-4a0b-9717-f856558b3168",
    "slug": "made-in-hell-oversize-t-shirt-834",
    "nameEn": "Made In Hell OverSize T-Shirt",
    "nameAr": "Made In Hell OverSize T-Shirt",
    "descEn": "",
    "descAr": "",
    "price": 15,
    "salePrice": null,
    "sku": "BI-DROP-7894",
    "featured": true,
    "isNew": true,
    "isSale": false,
    "isActive": true,
    "categorySlug": "t-shirts-oversized",
    "createdAt": "2026-08-31T22:09:29.696Z",
    "updatedAt": "2026-08-31T23:25:24.138Z",
    "images": [
      {
        "id": "0ddab537-de5c-4d21-9848-9d56dcce55b3",
        "productId": "d20a9229-f5e6-4a0b-9717-f856558b3168",
        "url": "/uploads/1788214122099-photo_2026-08-30_08-53-03.jpg",
        "isMain": true,
        "order": 0
      },
      {
        "id": "862af0a1-d5da-4cab-9860-a994ed679845",
        "productId": "d20a9229-f5e6-4a0b-9717-f856558b3168",
        "url": "/uploads/1788214126252-photo_2026-08-30_08-53-05.jpg",
        "isMain": false,
        "order": 1
      }
    ],
    "variants": [
      {
        "id": "f064ce09-da7c-428a-916a-b6661230e851",
        "productId": "d20a9229-f5e6-4a0b-9717-f856558b3168",
        "size": "S",
        "colorName": "Dark Brown",
        "colorHex": "#5C544C",
        "colorImage": "/uploads/1788214122099-photo_2026-08-30_08-53-03.jpg",
        "colorImages": "/uploads/1788214122099-photo_2026-08-30_08-53-03.jpg,/uploads/1788214126252-photo_2026-08-30_08-53-05.jpg",
        "stock": 10
      },
      {
        "id": "cc5e1299-22be-4d1d-94e8-ac5e52d49747",
        "productId": "d20a9229-f5e6-4a0b-9717-f856558b3168",
        "size": "M",
        "colorName": "Dark Brown",
        "colorHex": "#5C544C",
        "colorImage": "/uploads/1788214122099-photo_2026-08-30_08-53-03.jpg",
        "colorImages": "/uploads/1788214122099-photo_2026-08-30_08-53-03.jpg,/uploads/1788214126252-photo_2026-08-30_08-53-05.jpg",
        "stock": 15
      },
      {
        "id": "fed156fb-eb96-468b-81a2-466636bb5e5a",
        "productId": "d20a9229-f5e6-4a0b-9717-f856558b3168",
        "size": "L",
        "colorName": "Dark Brown",
        "colorHex": "#5C544C",
        "colorImage": "/uploads/1788214122099-photo_2026-08-30_08-53-03.jpg",
        "colorImages": "/uploads/1788214122099-photo_2026-08-30_08-53-03.jpg,/uploads/1788214126252-photo_2026-08-30_08-53-05.jpg",
        "stock": 20
      },
      {
        "id": "65ef8612-0a44-4f27-890c-41b9f141bfa8",
        "productId": "d20a9229-f5e6-4a0b-9717-f856558b3168",
        "size": "XL",
        "colorName": "Dark Brown",
        "colorHex": "#5C544C",
        "colorImage": "/uploads/1788214122099-photo_2026-08-30_08-53-03.jpg",
        "colorImages": "/uploads/1788214122099-photo_2026-08-30_08-53-03.jpg,/uploads/1788214126252-photo_2026-08-30_08-53-05.jpg",
        "stock": 15
      }
    ],
    "category": {
      "id": "9836ec41-76d8-44f8-8abc-93e271d42b4d",
      "slug": "t-shirts-oversized",
      "nameEn": "T-Shirts & Oversized",
      "nameAr": "التيشيرتات والأوفرسايز",
      "descriptionEn": "Drop-shoulder street tees with high-density graphics.",
      "descriptionAr": "تيشيرتات أكتاف منسدلة وطباعة عالية الدقة.",
      "image": "/uploads/1788715207412-photo_2026-09-06_10-19-47.jpg",
      "order": 2,
      "isHidden": false,
      "createdAt": "2026-08-27T23:29:03.198Z"
    }
  },
  {
    "id": "9f5e2425-8bf2-469a-a0c3-415fb43f15fc",
    "slug": "always-rise-oversize-t-shirt-918",
    "nameEn": "Always Rise OverSize T-Shirt",
    "nameAr": "Always Rise OverSize T-Shirt",
    "descEn": "",
    "descAr": "",
    "price": 15,
    "salePrice": null,
    "sku": "BI-DROP-9470",
    "featured": true,
    "isNew": true,
    "isSale": false,
    "isActive": true,
    "categorySlug": "t-shirts-oversized",
    "createdAt": "2026-08-31T22:07:12.314Z",
    "updatedAt": "2026-08-31T23:25:46.701Z",
    "images": [
      {
        "id": "24b733d9-19a8-4c7e-af4a-447a8c9e90b5",
        "productId": "9f5e2425-8bf2-469a-a0c3-415fb43f15fc",
        "url": "/uploads/1788214022828-photo_2026-08-30_08-52-56.jpg",
        "isMain": true,
        "order": 0
      },
      {
        "id": "9509ee7c-15c5-4fd1-837a-0f7fc5716b67",
        "productId": "9f5e2425-8bf2-469a-a0c3-415fb43f15fc",
        "url": "/uploads/1788214027286-photo_2026-08-30_08-52-57.jpg",
        "isMain": false,
        "order": 1
      }
    ],
    "variants": [
      {
        "id": "851cdea4-aa48-4515-b263-1f080414919d",
        "productId": "9f5e2425-8bf2-469a-a0c3-415fb43f15fc",
        "size": "S",
        "colorName": "Black",
        "colorHex": "#000000",
        "colorImage": "/uploads/1788214022828-photo_2026-08-30_08-52-56.jpg",
        "colorImages": "/uploads/1788214022828-photo_2026-08-30_08-52-56.jpg,/uploads/1788214027286-photo_2026-08-30_08-52-57.jpg",
        "stock": 10
      },
      {
        "id": "c503f1ce-e18c-4f9b-9ee1-4a58a5b2bc9f",
        "productId": "9f5e2425-8bf2-469a-a0c3-415fb43f15fc",
        "size": "M",
        "colorName": "Black",
        "colorHex": "#000000",
        "colorImage": "/uploads/1788214022828-photo_2026-08-30_08-52-56.jpg",
        "colorImages": "/uploads/1788214022828-photo_2026-08-30_08-52-56.jpg,/uploads/1788214027286-photo_2026-08-30_08-52-57.jpg",
        "stock": 15
      },
      {
        "id": "c1ff9036-9ab2-409f-b5f0-8053584bb5f3",
        "productId": "9f5e2425-8bf2-469a-a0c3-415fb43f15fc",
        "size": "L",
        "colorName": "Black",
        "colorHex": "#000000",
        "colorImage": "/uploads/1788214022828-photo_2026-08-30_08-52-56.jpg",
        "colorImages": "/uploads/1788214022828-photo_2026-08-30_08-52-56.jpg,/uploads/1788214027286-photo_2026-08-30_08-52-57.jpg",
        "stock": 20
      },
      {
        "id": "e1d52ed0-86c1-4b0f-8378-d04db023de9e",
        "productId": "9f5e2425-8bf2-469a-a0c3-415fb43f15fc",
        "size": "XL",
        "colorName": "Black",
        "colorHex": "#000000",
        "colorImage": "/uploads/1788214022828-photo_2026-08-30_08-52-56.jpg",
        "colorImages": "/uploads/1788214022828-photo_2026-08-30_08-52-56.jpg,/uploads/1788214027286-photo_2026-08-30_08-52-57.jpg",
        "stock": 15
      }
    ],
    "category": {
      "id": "9836ec41-76d8-44f8-8abc-93e271d42b4d",
      "slug": "t-shirts-oversized",
      "nameEn": "T-Shirts & Oversized",
      "nameAr": "التيشيرتات والأوفرسايز",
      "descriptionEn": "Drop-shoulder street tees with high-density graphics.",
      "descriptionAr": "تيشيرتات أكتاف منسدلة وطباعة عالية الدقة.",
      "image": "/uploads/1788715207412-photo_2026-09-06_10-19-47.jpg",
      "order": 2,
      "isHidden": false,
      "createdAt": "2026-08-27T23:29:03.198Z"
    }
  },
  {
    "id": "300ab1d1-91fc-4737-b4b4-bfaae5b08103",
    "slug": "klidermafia-oversize-t-shirt-481",
    "nameEn": "KLIDERMAFIA OverSize T-Shirt",
    "nameAr": "KLIDERMAFIA OverSize T-Shirt",
    "descEn": "",
    "descAr": "",
    "price": 25,
    "salePrice": null,
    "sku": "BI-DROP-7915",
    "featured": true,
    "isNew": true,
    "isSale": false,
    "isActive": true,
    "categorySlug": "t-shirts-oversized",
    "createdAt": "2026-08-30T19:42:18.860Z",
    "updatedAt": "2026-09-05T23:40:41.502Z",
    "images": [
      {
        "id": "ea6271cb-cc4c-49fc-b442-c96b9ad26623",
        "productId": "300ab1d1-91fc-4737-b4b4-bfaae5b08103",
        "url": "/uploads/1788118881929-photo_2026-08-30_08-52-35.jpg",
        "isMain": true,
        "order": 0
      },
      {
        "id": "1ec69b2c-189c-4aca-8504-9f58fcfe0435",
        "productId": "300ab1d1-91fc-4737-b4b4-bfaae5b08103",
        "url": "/uploads/1788118906279-photo_2026-08-30_08-52-37.jpg",
        "isMain": false,
        "order": 1
      }
    ],
    "variants": [
      {
        "id": "8fcf0b32-c09a-4bfd-9906-1dff1d4e3ee5",
        "productId": "300ab1d1-91fc-4737-b4b4-bfaae5b08103",
        "size": "S",
        "colorName": "Black",
        "colorHex": "#000000",
        "colorImage": "/uploads/1788118881929-photo_2026-08-30_08-52-35.jpg",
        "colorImages": "/uploads/1788118881929-photo_2026-08-30_08-52-35.jpg,/uploads/1788118906279-photo_2026-08-30_08-52-37.jpg",
        "stock": 10
      },
      {
        "id": "feda81b6-0d42-4fc4-af1a-fd804e36ec35",
        "productId": "300ab1d1-91fc-4737-b4b4-bfaae5b08103",
        "size": "M",
        "colorName": "Black",
        "colorHex": "#000000",
        "colorImage": "/uploads/1788118881929-photo_2026-08-30_08-52-35.jpg",
        "colorImages": "/uploads/1788118881929-photo_2026-08-30_08-52-35.jpg,/uploads/1788118906279-photo_2026-08-30_08-52-37.jpg",
        "stock": 15
      },
      {
        "id": "8ecd89ba-b742-41ee-81b8-876432ea8d34",
        "productId": "300ab1d1-91fc-4737-b4b4-bfaae5b08103",
        "size": "L",
        "colorName": "Black",
        "colorHex": "#000000",
        "colorImage": "/uploads/1788118881929-photo_2026-08-30_08-52-35.jpg",
        "colorImages": "/uploads/1788118881929-photo_2026-08-30_08-52-35.jpg,/uploads/1788118906279-photo_2026-08-30_08-52-37.jpg",
        "stock": 20
      },
      {
        "id": "0107e54c-63ce-4f26-977a-8a45bece8850",
        "productId": "300ab1d1-91fc-4737-b4b4-bfaae5b08103",
        "size": "XL",
        "colorName": "Black",
        "colorHex": "#000000",
        "colorImage": "/uploads/1788118881929-photo_2026-08-30_08-52-35.jpg",
        "colorImages": "/uploads/1788118881929-photo_2026-08-30_08-52-35.jpg,/uploads/1788118906279-photo_2026-08-30_08-52-37.jpg",
        "stock": 15
      }
    ],
    "category": {
      "id": "9836ec41-76d8-44f8-8abc-93e271d42b4d",
      "slug": "t-shirts-oversized",
      "nameEn": "T-Shirts & Oversized",
      "nameAr": "التيشيرتات والأوفرسايز",
      "descriptionEn": "Drop-shoulder street tees with high-density graphics.",
      "descriptionAr": "تيشيرتات أكتاف منسدلة وطباعة عالية الدقة.",
      "image": "/uploads/1788715207412-photo_2026-09-06_10-19-47.jpg",
      "order": 2,
      "isHidden": false,
      "createdAt": "2026-08-27T23:29:03.198Z"
    }
  },
  {
    "id": "3f35f22e-efdf-47a0-9e2b-2319e88532ef",
    "slug": "nike-t-shirt-153",
    "nameEn": "Nike T-Shirt",
    "nameAr": "Nike T-Shirt",
    "descEn": "",
    "descAr": "",
    "price": 25,
    "salePrice": null,
    "sku": "BI-DROP-5116",
    "featured": true,
    "isNew": true,
    "isSale": false,
    "isActive": true,
    "categorySlug": "t-shirts-oversized",
    "createdAt": "2026-08-30T19:38:57.326Z",
    "updatedAt": "2026-09-05T23:40:28.387Z",
    "images": [
      {
        "id": "18d1bcae-9f95-4a24-a0e6-b3ede3cfbed2",
        "productId": "3f35f22e-efdf-47a0-9e2b-2319e88532ef",
        "url": "/uploads/1788118699869-photo_2026-08-30_08-52-26.jpg",
        "isMain": true,
        "order": 0
      },
      {
        "id": "ff08c1a3-c599-4150-a482-33e1e1ca5579",
        "productId": "3f35f22e-efdf-47a0-9e2b-2319e88532ef",
        "url": "/uploads/1788118706800-photo_2026-08-30_08-52-27.jpg",
        "isMain": false,
        "order": 1
      },
      {
        "id": "f431ad57-36de-443b-a785-864f955e1181",
        "productId": "3f35f22e-efdf-47a0-9e2b-2319e88532ef",
        "url": "/uploads/1788118716337-photo_2026-08-30_08-52-28.jpg",
        "isMain": false,
        "order": 2
      },
      {
        "id": "88d479bf-99ae-4d2c-b71e-14431a70ed8b",
        "productId": "3f35f22e-efdf-47a0-9e2b-2319e88532ef",
        "url": "/uploads/1788118722280-photo_2026-08-30_08-52-29.jpg",
        "isMain": false,
        "order": 3
      }
    ],
    "variants": [
      {
        "id": "6e61244b-a894-4520-bf59-8f87f88631c7",
        "productId": "3f35f22e-efdf-47a0-9e2b-2319e88532ef",
        "size": "S",
        "colorName": "Black",
        "colorHex": "#000000",
        "colorImage": "/uploads/1788118699869-photo_2026-08-30_08-52-26.jpg",
        "colorImages": "/uploads/1788118699869-photo_2026-08-30_08-52-26.jpg,/uploads/1788118706800-photo_2026-08-30_08-52-27.jpg",
        "stock": 10
      },
      {
        "id": "2188c15c-5c72-4bd0-abd9-520a2c2acda8",
        "productId": "3f35f22e-efdf-47a0-9e2b-2319e88532ef",
        "size": "M",
        "colorName": "Black",
        "colorHex": "#000000",
        "colorImage": "/uploads/1788118699869-photo_2026-08-30_08-52-26.jpg",
        "colorImages": "/uploads/1788118699869-photo_2026-08-30_08-52-26.jpg,/uploads/1788118706800-photo_2026-08-30_08-52-27.jpg",
        "stock": 15
      },
      {
        "id": "391fa17d-9cd6-4584-82ce-3c4a66052c8c",
        "productId": "3f35f22e-efdf-47a0-9e2b-2319e88532ef",
        "size": "L",
        "colorName": "Black",
        "colorHex": "#000000",
        "colorImage": "/uploads/1788118699869-photo_2026-08-30_08-52-26.jpg",
        "colorImages": "/uploads/1788118699869-photo_2026-08-30_08-52-26.jpg,/uploads/1788118706800-photo_2026-08-30_08-52-27.jpg",
        "stock": 20
      },
      {
        "id": "96453a81-4f05-4166-afb0-d48e1260d5c5",
        "productId": "3f35f22e-efdf-47a0-9e2b-2319e88532ef",
        "size": "XL",
        "colorName": "Black",
        "colorHex": "#000000",
        "colorImage": "/uploads/1788118699869-photo_2026-08-30_08-52-26.jpg",
        "colorImages": "/uploads/1788118699869-photo_2026-08-30_08-52-26.jpg,/uploads/1788118706800-photo_2026-08-30_08-52-27.jpg",
        "stock": 15
      },
      {
        "id": "09ea9a58-702a-46d8-9848-7b7b50194520",
        "productId": "3f35f22e-efdf-47a0-9e2b-2319e88532ef",
        "size": "S",
        "colorName": "White",
        "colorHex": "#ffffff",
        "colorImage": "/uploads/1788118716337-photo_2026-08-30_08-52-28.jpg",
        "colorImages": "/uploads/1788118716337-photo_2026-08-30_08-52-28.jpg,/uploads/1788118722280-photo_2026-08-30_08-52-29.jpg",
        "stock": 10
      },
      {
        "id": "ce01aa6c-c488-4dbc-8747-e497234ae591",
        "productId": "3f35f22e-efdf-47a0-9e2b-2319e88532ef",
        "size": "M",
        "colorName": "White",
        "colorHex": "#ffffff",
        "colorImage": "/uploads/1788118716337-photo_2026-08-30_08-52-28.jpg",
        "colorImages": "/uploads/1788118716337-photo_2026-08-30_08-52-28.jpg,/uploads/1788118722280-photo_2026-08-30_08-52-29.jpg",
        "stock": 15
      },
      {
        "id": "5761b807-8800-476a-8405-339f995b223b",
        "productId": "3f35f22e-efdf-47a0-9e2b-2319e88532ef",
        "size": "L",
        "colorName": "White",
        "colorHex": "#ffffff",
        "colorImage": "/uploads/1788118716337-photo_2026-08-30_08-52-28.jpg",
        "colorImages": "/uploads/1788118716337-photo_2026-08-30_08-52-28.jpg,/uploads/1788118722280-photo_2026-08-30_08-52-29.jpg",
        "stock": 20
      },
      {
        "id": "fbd0311d-8797-4c99-917d-b62b9e123f2b",
        "productId": "3f35f22e-efdf-47a0-9e2b-2319e88532ef",
        "size": "XL",
        "colorName": "White",
        "colorHex": "#ffffff",
        "colorImage": "/uploads/1788118716337-photo_2026-08-30_08-52-28.jpg",
        "colorImages": "/uploads/1788118716337-photo_2026-08-30_08-52-28.jpg,/uploads/1788118722280-photo_2026-08-30_08-52-29.jpg",
        "stock": 15
      }
    ],
    "category": {
      "id": "9836ec41-76d8-44f8-8abc-93e271d42b4d",
      "slug": "t-shirts-oversized",
      "nameEn": "T-Shirts & Oversized",
      "nameAr": "التيشيرتات والأوفرسايز",
      "descriptionEn": "Drop-shoulder street tees with high-density graphics.",
      "descriptionAr": "تيشيرتات أكتاف منسدلة وطباعة عالية الدقة.",
      "image": "/uploads/1788715207412-photo_2026-09-06_10-19-47.jpg",
      "order": 2,
      "isHidden": false,
      "createdAt": "2026-08-27T23:29:03.198Z"
    }
  },
  {
    "id": "7df0789e-0181-4857-87aa-30d2f957a77a",
    "slug": "nike-tee-t-shirt-248",
    "nameEn": "Nike Tee T-Shirt",
    "nameAr": "Nike Tee T-Shirt",
    "descEn": "",
    "descAr": "",
    "price": 20,
    "salePrice": null,
    "sku": "BI-DROP-6357",
    "featured": true,
    "isNew": true,
    "isSale": false,
    "isActive": true,
    "categorySlug": "t-shirts-oversized",
    "createdAt": "2026-08-30T19:34:34.422Z",
    "updatedAt": "2026-09-06T15:48:30.467Z",
    "images": [
      {
        "id": "402c3fd9-0c49-4bd9-ba42-93395f5198dc",
        "productId": "7df0789e-0181-4857-87aa-30d2f957a77a",
        "url": "/uploads/1788118403388-photo_2026-08-30_08-52-11.jpg",
        "isMain": true,
        "order": 0
      },
      {
        "id": "43764d53-5dda-4aae-b5a9-ef6b9c610b69",
        "productId": "7df0789e-0181-4857-87aa-30d2f957a77a",
        "url": "/uploads/1788118419177-photo_2026-08-30_08-52-13.jpg",
        "isMain": false,
        "order": 1
      },
      {
        "id": "89d60447-fe90-4215-92df-020adad248b7",
        "productId": "7df0789e-0181-4857-87aa-30d2f957a77a",
        "url": "/uploads/1788118426614-photo_2026-08-30_08-52-14.jpg",
        "isMain": false,
        "order": 2
      },
      {
        "id": "c5dd6229-da41-4192-a600-91a102bb645c",
        "productId": "7df0789e-0181-4857-87aa-30d2f957a77a",
        "url": "/uploads/1788118434119-photo_2026-08-30_08-52-15.jpg",
        "isMain": false,
        "order": 3
      }
    ],
    "variants": [
      {
        "id": "e3c15fe9-df8f-462d-91fc-347d322158ae",
        "productId": "7df0789e-0181-4857-87aa-30d2f957a77a",
        "size": "S",
        "colorName": "Black",
        "colorHex": "#000000",
        "colorImage": "/uploads/1788118403388-photo_2026-08-30_08-52-11.jpg",
        "colorImages": "/uploads/1788118403388-photo_2026-08-30_08-52-11.jpg,/uploads/1788118419177-photo_2026-08-30_08-52-13.jpg",
        "stock": 10
      },
      {
        "id": "f6a111b4-a5de-428a-aa95-e70d3a83eb49",
        "productId": "7df0789e-0181-4857-87aa-30d2f957a77a",
        "size": "M",
        "colorName": "Black",
        "colorHex": "#000000",
        "colorImage": "/uploads/1788118403388-photo_2026-08-30_08-52-11.jpg",
        "colorImages": "/uploads/1788118403388-photo_2026-08-30_08-52-11.jpg,/uploads/1788118419177-photo_2026-08-30_08-52-13.jpg",
        "stock": 15
      },
      {
        "id": "be4b862e-e7da-41bb-b383-015ec09b2e5b",
        "productId": "7df0789e-0181-4857-87aa-30d2f957a77a",
        "size": "L",
        "colorName": "Black",
        "colorHex": "#000000",
        "colorImage": "/uploads/1788118403388-photo_2026-08-30_08-52-11.jpg",
        "colorImages": "/uploads/1788118403388-photo_2026-08-30_08-52-11.jpg,/uploads/1788118419177-photo_2026-08-30_08-52-13.jpg",
        "stock": 20
      },
      {
        "id": "9efb501a-e0d5-4c9c-b682-93766a5f5f33",
        "productId": "7df0789e-0181-4857-87aa-30d2f957a77a",
        "size": "XL",
        "colorName": "Black",
        "colorHex": "#000000",
        "colorImage": "/uploads/1788118403388-photo_2026-08-30_08-52-11.jpg",
        "colorImages": "/uploads/1788118403388-photo_2026-08-30_08-52-11.jpg,/uploads/1788118419177-photo_2026-08-30_08-52-13.jpg",
        "stock": 15
      },
      {
        "id": "6b478bed-f1dd-4a16-a73e-bf750b9071b4",
        "productId": "7df0789e-0181-4857-87aa-30d2f957a77a",
        "size": "S",
        "colorName": "White",
        "colorHex": "#ffffff",
        "colorImage": "/uploads/1788118426614-photo_2026-08-30_08-52-14.jpg",
        "colorImages": "/uploads/1788118426614-photo_2026-08-30_08-52-14.jpg,/uploads/1788118434119-photo_2026-08-30_08-52-15.jpg",
        "stock": 10
      },
      {
        "id": "9d96866a-6474-42b5-abda-de070117d38e",
        "productId": "7df0789e-0181-4857-87aa-30d2f957a77a",
        "size": "M",
        "colorName": "White",
        "colorHex": "#ffffff",
        "colorImage": "/uploads/1788118426614-photo_2026-08-30_08-52-14.jpg",
        "colorImages": "/uploads/1788118426614-photo_2026-08-30_08-52-14.jpg,/uploads/1788118434119-photo_2026-08-30_08-52-15.jpg",
        "stock": 15
      },
      {
        "id": "7c11c7d3-c307-45ac-a97f-89cc31c021aa",
        "productId": "7df0789e-0181-4857-87aa-30d2f957a77a",
        "size": "L",
        "colorName": "White",
        "colorHex": "#ffffff",
        "colorImage": "/uploads/1788118426614-photo_2026-08-30_08-52-14.jpg",
        "colorImages": "/uploads/1788118426614-photo_2026-08-30_08-52-14.jpg,/uploads/1788118434119-photo_2026-08-30_08-52-15.jpg",
        "stock": 20
      },
      {
        "id": "edbfd5ae-7d18-4aec-8f43-0e4d6c7ce404",
        "productId": "7df0789e-0181-4857-87aa-30d2f957a77a",
        "size": "XL",
        "colorName": "White",
        "colorHex": "#ffffff",
        "colorImage": "/uploads/1788118426614-photo_2026-08-30_08-52-14.jpg",
        "colorImages": "/uploads/1788118426614-photo_2026-08-30_08-52-14.jpg,/uploads/1788118434119-photo_2026-08-30_08-52-15.jpg",
        "stock": 15
      }
    ],
    "category": {
      "id": "9836ec41-76d8-44f8-8abc-93e271d42b4d",
      "slug": "t-shirts-oversized",
      "nameEn": "T-Shirts & Oversized",
      "nameAr": "التيشيرتات والأوفرسايز",
      "descriptionEn": "Drop-shoulder street tees with high-density graphics.",
      "descriptionAr": "تيشيرتات أكتاف منسدلة وطباعة عالية الدقة.",
      "image": "/uploads/1788715207412-photo_2026-09-06_10-19-47.jpg",
      "order": 2,
      "isHidden": false,
      "createdAt": "2026-08-27T23:29:03.198Z"
    }
  },
  {
    "id": "52725655-3d06-473e-b615-8b2ca553f26d",
    "slug": "nike-t-shirt-996",
    "nameEn": "Nike T-Shirt",
    "nameAr": "Nike T-Shirt",
    "descEn": "",
    "descAr": "",
    "price": 20,
    "salePrice": null,
    "sku": "BI-DROP-8324",
    "featured": true,
    "isNew": true,
    "isSale": false,
    "isActive": true,
    "categorySlug": "t-shirts-oversized",
    "createdAt": "2026-08-30T19:02:10.343Z",
    "updatedAt": "2026-09-05T23:40:03.687Z",
    "images": [
      {
        "id": "0a13016a-1de0-47ac-aeb8-c169232d4deb",
        "productId": "52725655-3d06-473e-b615-8b2ca553f26d",
        "url": "/uploads/1788116477890-photo_2026-08-30_08-51-47__3_.jpg",
        "isMain": true,
        "order": 0
      },
      {
        "id": "a8a4a9a9-8f19-4a1b-8bd3-4f57033b1a6f",
        "productId": "52725655-3d06-473e-b615-8b2ca553f26d",
        "url": "/uploads/1788116485852-photo_2026-08-30_08-51-49.jpg",
        "isMain": false,
        "order": 1
      },
      {
        "id": "f35b12a6-f60c-437d-b631-9e433f842cea",
        "productId": "52725655-3d06-473e-b615-8b2ca553f26d",
        "url": "/uploads/1788116493415-photo_2026-08-30_08-51-52.jpg",
        "isMain": false,
        "order": 2
      },
      {
        "id": "8a650acd-c4f7-48b9-8f89-409333b1368e",
        "productId": "52725655-3d06-473e-b615-8b2ca553f26d",
        "url": "/uploads/1788116500210-photo_2026-08-30_08-51-54.jpg",
        "isMain": false,
        "order": 3
      }
    ],
    "variants": [
      {
        "id": "d9407acb-d032-4d1a-a0a7-1b3409b90777",
        "productId": "52725655-3d06-473e-b615-8b2ca553f26d",
        "size": "S",
        "colorName": "Black",
        "colorHex": "#000000",
        "colorImage": "/uploads/1788116477890-photo_2026-08-30_08-51-47__3_.jpg",
        "colorImages": "/uploads/1788116477890-photo_2026-08-30_08-51-47__3_.jpg,/uploads/1788116485852-photo_2026-08-30_08-51-49.jpg",
        "stock": 10
      },
      {
        "id": "0fb6ddc4-ae19-45cd-98a9-058e002882c4",
        "productId": "52725655-3d06-473e-b615-8b2ca553f26d",
        "size": "M",
        "colorName": "Black",
        "colorHex": "#000000",
        "colorImage": "/uploads/1788116477890-photo_2026-08-30_08-51-47__3_.jpg",
        "colorImages": "/uploads/1788116477890-photo_2026-08-30_08-51-47__3_.jpg,/uploads/1788116485852-photo_2026-08-30_08-51-49.jpg",
        "stock": 15
      },
      {
        "id": "a86dd919-8a87-4851-ba88-782610959fc1",
        "productId": "52725655-3d06-473e-b615-8b2ca553f26d",
        "size": "L",
        "colorName": "Black",
        "colorHex": "#000000",
        "colorImage": "/uploads/1788116477890-photo_2026-08-30_08-51-47__3_.jpg",
        "colorImages": "/uploads/1788116477890-photo_2026-08-30_08-51-47__3_.jpg,/uploads/1788116485852-photo_2026-08-30_08-51-49.jpg",
        "stock": 20
      },
      {
        "id": "8674b3c2-18c4-4dd7-abc5-d4c2412e3467",
        "productId": "52725655-3d06-473e-b615-8b2ca553f26d",
        "size": "XL",
        "colorName": "Black",
        "colorHex": "#000000",
        "colorImage": "/uploads/1788116477890-photo_2026-08-30_08-51-47__3_.jpg",
        "colorImages": "/uploads/1788116477890-photo_2026-08-30_08-51-47__3_.jpg,/uploads/1788116485852-photo_2026-08-30_08-51-49.jpg",
        "stock": 15
      },
      {
        "id": "3c5d9b39-11c4-421f-8a22-c0174de88dd2",
        "productId": "52725655-3d06-473e-b615-8b2ca553f26d",
        "size": "S",
        "colorName": "White",
        "colorHex": "#ffffff",
        "colorImage": "/uploads/1788116493415-photo_2026-08-30_08-51-52.jpg",
        "colorImages": "/uploads/1788116493415-photo_2026-08-30_08-51-52.jpg,/uploads/1788116500210-photo_2026-08-30_08-51-54.jpg",
        "stock": 10
      },
      {
        "id": "b582e81c-e5f5-4a78-abd7-5b8fb94a9134",
        "productId": "52725655-3d06-473e-b615-8b2ca553f26d",
        "size": "M",
        "colorName": "White",
        "colorHex": "#ffffff",
        "colorImage": "/uploads/1788116493415-photo_2026-08-30_08-51-52.jpg",
        "colorImages": "/uploads/1788116493415-photo_2026-08-30_08-51-52.jpg,/uploads/1788116500210-photo_2026-08-30_08-51-54.jpg",
        "stock": 15
      },
      {
        "id": "2b3b876c-baa6-43d1-aa81-357b7533ecc1",
        "productId": "52725655-3d06-473e-b615-8b2ca553f26d",
        "size": "L",
        "colorName": "White",
        "colorHex": "#ffffff",
        "colorImage": "/uploads/1788116493415-photo_2026-08-30_08-51-52.jpg",
        "colorImages": "/uploads/1788116493415-photo_2026-08-30_08-51-52.jpg,/uploads/1788116500210-photo_2026-08-30_08-51-54.jpg",
        "stock": 20
      },
      {
        "id": "25239a15-bd3f-46de-8799-74ea4f9eace6",
        "productId": "52725655-3d06-473e-b615-8b2ca553f26d",
        "size": "XL",
        "colorName": "White",
        "colorHex": "#ffffff",
        "colorImage": "/uploads/1788116493415-photo_2026-08-30_08-51-52.jpg",
        "colorImages": "/uploads/1788116493415-photo_2026-08-30_08-51-52.jpg,/uploads/1788116500210-photo_2026-08-30_08-51-54.jpg",
        "stock": 15
      }
    ],
    "category": {
      "id": "9836ec41-76d8-44f8-8abc-93e271d42b4d",
      "slug": "t-shirts-oversized",
      "nameEn": "T-Shirts & Oversized",
      "nameAr": "التيشيرتات والأوفرسايز",
      "descriptionEn": "Drop-shoulder street tees with high-density graphics.",
      "descriptionAr": "تيشيرتات أكتاف منسدلة وطباعة عالية الدقة.",
      "image": "/uploads/1788715207412-photo_2026-09-06_10-19-47.jpg",
      "order": 2,
      "isHidden": false,
      "createdAt": "2026-08-27T23:29:03.198Z"
    }
  },
  {
    "id": "aa2b0673-b758-4983-accd-4dcefb9bd602",
    "slug": "kleidermafia-oversize-t-shirt-610",
    "nameEn": "Kleidermafia OverSize t-shirt",
    "nameAr": "Kleidermafia OverSize t-shirt",
    "descEn": "",
    "descAr": "",
    "price": 25,
    "salePrice": null,
    "sku": "BI-DROP-7216",
    "featured": true,
    "isNew": true,
    "isSale": false,
    "isActive": true,
    "categorySlug": "t-shirts-oversized",
    "createdAt": "2026-08-30T18:56:42.313Z",
    "updatedAt": "2026-09-06T15:48:30.455Z",
    "images": [
      {
        "id": "4aee286c-4caa-4530-aa90-c3d3a96fc11a",
        "productId": "aa2b0673-b758-4983-accd-4dcefb9bd602",
        "url": "/uploads/1788116175154-photo_2026-08-30_08-51-47.jpg",
        "isMain": true,
        "order": 0
      },
      {
        "id": "daf2bb3f-0b22-4538-98c0-fa733691871f",
        "productId": "aa2b0673-b758-4983-accd-4dcefb9bd602",
        "url": "/uploads/1788116181102-photo_2026-08-30_08-51-47__2_.jpg",
        "isMain": false,
        "order": 1
      }
    ],
    "variants": [
      {
        "id": "4d2b1879-c5d6-4cfb-8f5b-c0407443f130",
        "productId": "aa2b0673-b758-4983-accd-4dcefb9bd602",
        "size": "S",
        "colorName": "Color Option 1",
        "colorHex": "#ffffff",
        "colorImage": "/uploads/1788116175154-photo_2026-08-30_08-51-47.jpg",
        "colorImages": "/uploads/1788116175154-photo_2026-08-30_08-51-47.jpg,/uploads/1788116181102-photo_2026-08-30_08-51-47__2_.jpg",
        "stock": 10
      },
      {
        "id": "667fa7c9-6671-4bfc-8229-0a0d63bef8cd",
        "productId": "aa2b0673-b758-4983-accd-4dcefb9bd602",
        "size": "M",
        "colorName": "Color Option 1",
        "colorHex": "#ffffff",
        "colorImage": "/uploads/1788116175154-photo_2026-08-30_08-51-47.jpg",
        "colorImages": "/uploads/1788116175154-photo_2026-08-30_08-51-47.jpg,/uploads/1788116181102-photo_2026-08-30_08-51-47__2_.jpg",
        "stock": 15
      },
      {
        "id": "f76bde71-44ce-4f30-b06c-4f7741ad39de",
        "productId": "aa2b0673-b758-4983-accd-4dcefb9bd602",
        "size": "L",
        "colorName": "Color Option 1",
        "colorHex": "#ffffff",
        "colorImage": "/uploads/1788116175154-photo_2026-08-30_08-51-47.jpg",
        "colorImages": "/uploads/1788116175154-photo_2026-08-30_08-51-47.jpg,/uploads/1788116181102-photo_2026-08-30_08-51-47__2_.jpg",
        "stock": 20
      },
      {
        "id": "1c89ce7b-0297-4882-8ad6-99cd86c81458",
        "productId": "aa2b0673-b758-4983-accd-4dcefb9bd602",
        "size": "XL",
        "colorName": "Color Option 1",
        "colorHex": "#ffffff",
        "colorImage": "/uploads/1788116175154-photo_2026-08-30_08-51-47.jpg",
        "colorImages": "/uploads/1788116175154-photo_2026-08-30_08-51-47.jpg,/uploads/1788116181102-photo_2026-08-30_08-51-47__2_.jpg",
        "stock": 15
      }
    ],
    "category": {
      "id": "9836ec41-76d8-44f8-8abc-93e271d42b4d",
      "slug": "t-shirts-oversized",
      "nameEn": "T-Shirts & Oversized",
      "nameAr": "التيشيرتات والأوفرسايز",
      "descriptionEn": "Drop-shoulder street tees with high-density graphics.",
      "descriptionAr": "تيشيرتات أكتاف منسدلة وطباعة عالية الدقة.",
      "image": "/uploads/1788715207412-photo_2026-09-06_10-19-47.jpg",
      "order": 2,
      "isHidden": false,
      "createdAt": "2026-08-27T23:29:03.198Z"
    }
  },
  {
    "id": "7efa2464-046c-4eea-8619-f5efc07fa37a",
    "slug": "catch-oversize-tank-top-386",
    "nameEn": "Catch OverSize Tank Top",
    "nameAr": "Catch OverSize Tank Top",
    "descEn": "",
    "descAr": "",
    "price": 15,
    "salePrice": null,
    "sku": "BI-DROP-2516",
    "featured": true,
    "isNew": true,
    "isSale": false,
    "isActive": true,
    "categorySlug": "t-shirts-oversized",
    "createdAt": "2026-08-30T18:10:03.262Z",
    "updatedAt": "2026-08-31T23:27:32.286Z",
    "images": [
      {
        "id": "ad7c7e45-1748-426f-afff-632e9d50189c",
        "productId": "7efa2464-046c-4eea-8619-f5efc07fa37a",
        "url": "/uploads/1788113373610-photo_2026-08-30_08-51-42.jpg",
        "isMain": true,
        "order": 0
      },
      {
        "id": "3220a673-74cf-4357-8806-174297d87379",
        "productId": "7efa2464-046c-4eea-8619-f5efc07fa37a",
        "url": "/uploads/1788113380710-photo_2026-08-30_08-51-33.jpg",
        "isMain": false,
        "order": 1
      }
    ],
    "variants": [
      {
        "id": "09a55c3e-9c13-4542-a1f0-09980abcbf16",
        "productId": "7efa2464-046c-4eea-8619-f5efc07fa37a",
        "size": "S",
        "colorName": "Black",
        "colorHex": "#000000",
        "colorImage": "/uploads/1788113373610-photo_2026-08-30_08-51-42.jpg",
        "colorImages": "/uploads/1788113373610-photo_2026-08-30_08-51-42.jpg",
        "stock": 10
      },
      {
        "id": "ccacf610-8510-4a56-be7b-851fb4e01afd",
        "productId": "7efa2464-046c-4eea-8619-f5efc07fa37a",
        "size": "M",
        "colorName": "Black",
        "colorHex": "#000000",
        "colorImage": "/uploads/1788113373610-photo_2026-08-30_08-51-42.jpg",
        "colorImages": "/uploads/1788113373610-photo_2026-08-30_08-51-42.jpg",
        "stock": 15
      },
      {
        "id": "4937e71e-58fe-4ebb-953b-c48b4e2dd1a8",
        "productId": "7efa2464-046c-4eea-8619-f5efc07fa37a",
        "size": "L",
        "colorName": "Black",
        "colorHex": "#000000",
        "colorImage": "/uploads/1788113373610-photo_2026-08-30_08-51-42.jpg",
        "colorImages": "/uploads/1788113373610-photo_2026-08-30_08-51-42.jpg",
        "stock": 20
      },
      {
        "id": "b554bf11-31fd-453f-af16-a5b041a05c46",
        "productId": "7efa2464-046c-4eea-8619-f5efc07fa37a",
        "size": "XL",
        "colorName": "Black",
        "colorHex": "#000000",
        "colorImage": "/uploads/1788113373610-photo_2026-08-30_08-51-42.jpg",
        "colorImages": "/uploads/1788113373610-photo_2026-08-30_08-51-42.jpg",
        "stock": 15
      },
      {
        "id": "8decaecd-994d-47a6-b6fe-5e83c813ba45",
        "productId": "7efa2464-046c-4eea-8619-f5efc07fa37a",
        "size": "S",
        "colorName": "Grey",
        "colorHex": "#9e9e9e",
        "colorImage": "/uploads/1788113380710-photo_2026-08-30_08-51-33.jpg",
        "colorImages": "/uploads/1788113380710-photo_2026-08-30_08-51-33.jpg",
        "stock": 10
      },
      {
        "id": "d4b5177d-c213-476f-93f9-7947c642801e",
        "productId": "7efa2464-046c-4eea-8619-f5efc07fa37a",
        "size": "M",
        "colorName": "Grey",
        "colorHex": "#9e9e9e",
        "colorImage": "/uploads/1788113380710-photo_2026-08-30_08-51-33.jpg",
        "colorImages": "/uploads/1788113380710-photo_2026-08-30_08-51-33.jpg",
        "stock": 15
      },
      {
        "id": "6323b080-b204-48b0-a0f2-cfc0111229a3",
        "productId": "7efa2464-046c-4eea-8619-f5efc07fa37a",
        "size": "L",
        "colorName": "Grey",
        "colorHex": "#9e9e9e",
        "colorImage": "/uploads/1788113380710-photo_2026-08-30_08-51-33.jpg",
        "colorImages": "/uploads/1788113380710-photo_2026-08-30_08-51-33.jpg",
        "stock": 20
      },
      {
        "id": "49864d23-e071-422a-9193-b6bab2bc3eaa",
        "productId": "7efa2464-046c-4eea-8619-f5efc07fa37a",
        "size": "XL",
        "colorName": "Grey",
        "colorHex": "#9e9e9e",
        "colorImage": "/uploads/1788113380710-photo_2026-08-30_08-51-33.jpg",
        "colorImages": "/uploads/1788113380710-photo_2026-08-30_08-51-33.jpg",
        "stock": 15
      }
    ],
    "category": {
      "id": "9836ec41-76d8-44f8-8abc-93e271d42b4d",
      "slug": "t-shirts-oversized",
      "nameEn": "T-Shirts & Oversized",
      "nameAr": "التيشيرتات والأوفرسايز",
      "descriptionEn": "Drop-shoulder street tees with high-density graphics.",
      "descriptionAr": "تيشيرتات أكتاف منسدلة وطباعة عالية الدقة.",
      "image": "/uploads/1788715207412-photo_2026-09-06_10-19-47.jpg",
      "order": 2,
      "isHidden": false,
      "createdAt": "2026-08-27T23:29:03.198Z"
    }
  },
  {
    "id": "9ff9f765-c45d-4c10-8d5c-cf4083bb76c3",
    "slug": "catch-tank-top-933",
    "nameEn": "Catch Tank Top",
    "nameAr": "Catch Tank Top",
    "descEn": "",
    "descAr": "",
    "price": 15,
    "salePrice": null,
    "sku": "BI-DROP-2630",
    "featured": true,
    "isNew": true,
    "isSale": false,
    "isActive": true,
    "categorySlug": "t-shirts-oversized",
    "createdAt": "2026-08-30T16:48:45.895Z",
    "updatedAt": "2026-08-30T16:50:00.288Z",
    "images": [
      {
        "id": "af01842d-91ea-40ad-8b88-a81af3b47a36",
        "productId": "9ff9f765-c45d-4c10-8d5c-cf4083bb76c3",
        "url": "/uploads/1788108285648-photo_2026-08-30_08-51-32.jpg",
        "isMain": true,
        "order": 0
      },
      {
        "id": "fe1b89ad-a6c3-48f7-9a09-273c2ca3e87f",
        "productId": "9ff9f765-c45d-4c10-8d5c-cf4083bb76c3",
        "url": "/uploads/1788108289720-photo_2026-08-30_08-51-30.jpg",
        "isMain": false,
        "order": 1
      },
      {
        "id": "c921de95-30dc-4fd3-9202-ec605087f465",
        "productId": "9ff9f765-c45d-4c10-8d5c-cf4083bb76c3",
        "url": "/uploads/1788108293985-photo_2026-08-30_08-51-27.jpg",
        "isMain": false,
        "order": 2
      }
    ],
    "variants": [
      {
        "id": "add1cb4b-e50d-436a-a2c8-ad7e12e176bf",
        "productId": "9ff9f765-c45d-4c10-8d5c-cf4083bb76c3",
        "size": "S",
        "colorName": "Color 1",
        "colorHex": "#000000",
        "colorImage": "/uploads/1788108289720-photo_2026-08-30_08-51-30.jpg",
        "colorImages": null,
        "stock": 5
      },
      {
        "id": "9a8f14f2-faaa-4f88-83f3-aaa5493aa082",
        "productId": "9ff9f765-c45d-4c10-8d5c-cf4083bb76c3",
        "size": "M",
        "colorName": "Color 1",
        "colorHex": "#000000",
        "colorImage": "/uploads/1788108289720-photo_2026-08-30_08-51-30.jpg",
        "colorImages": null,
        "stock": 5
      },
      {
        "id": "f546678d-2bc1-439b-8afe-f8abc583e660",
        "productId": "9ff9f765-c45d-4c10-8d5c-cf4083bb76c3",
        "size": "L",
        "colorName": "Color 1",
        "colorHex": "#000000",
        "colorImage": "/uploads/1788108289720-photo_2026-08-30_08-51-30.jpg",
        "colorImages": null,
        "stock": 5
      },
      {
        "id": "8e5e6b93-ccee-4cd9-b416-e5abd8de3e9f",
        "productId": "9ff9f765-c45d-4c10-8d5c-cf4083bb76c3",
        "size": "XL",
        "colorName": "Color 1",
        "colorHex": "#000000",
        "colorImage": "/uploads/1788108289720-photo_2026-08-30_08-51-30.jpg",
        "colorImages": null,
        "stock": 5
      },
      {
        "id": "6ffecb07-f5c7-4062-95eb-b912bfd834be",
        "productId": "9ff9f765-c45d-4c10-8d5c-cf4083bb76c3",
        "size": "S",
        "colorName": "Color 2",
        "colorHex": "#8f8f8f",
        "colorImage": "/uploads/1788108293985-photo_2026-08-30_08-51-27.jpg",
        "colorImages": null,
        "stock": 5
      },
      {
        "id": "106ac5b4-d056-4379-9b83-2299c0f3fe34",
        "productId": "9ff9f765-c45d-4c10-8d5c-cf4083bb76c3",
        "size": "M",
        "colorName": "Color 2",
        "colorHex": "#8f8f8f",
        "colorImage": "/uploads/1788108293985-photo_2026-08-30_08-51-27.jpg",
        "colorImages": null,
        "stock": 5
      },
      {
        "id": "2f002317-2719-45b6-ae3c-4f02aa7c1f1a",
        "productId": "9ff9f765-c45d-4c10-8d5c-cf4083bb76c3",
        "size": "L",
        "colorName": "Color 2",
        "colorHex": "#8f8f8f",
        "colorImage": "/uploads/1788108293985-photo_2026-08-30_08-51-27.jpg",
        "colorImages": null,
        "stock": 5
      },
      {
        "id": "261e0fe7-3340-41b1-8971-a2fc43be4727",
        "productId": "9ff9f765-c45d-4c10-8d5c-cf4083bb76c3",
        "size": "XL",
        "colorName": "Color 2",
        "colorHex": "#8f8f8f",
        "colorImage": "/uploads/1788108293985-photo_2026-08-30_08-51-27.jpg",
        "colorImages": null,
        "stock": 5
      }
    ],
    "category": {
      "id": "9836ec41-76d8-44f8-8abc-93e271d42b4d",
      "slug": "t-shirts-oversized",
      "nameEn": "T-Shirts & Oversized",
      "nameAr": "التيشيرتات والأوفرسايز",
      "descriptionEn": "Drop-shoulder street tees with high-density graphics.",
      "descriptionAr": "تيشيرتات أكتاف منسدلة وطباعة عالية الدقة.",
      "image": "/uploads/1788715207412-photo_2026-09-06_10-19-47.jpg",
      "order": 2,
      "isHidden": false,
      "createdAt": "2026-08-27T23:29:03.198Z"
    }
  }
];
  for (const p of productsData) {
    const { id, images, variants, category, createdAt, updatedAt, ...pData } = p;
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
  const bannersData = [
  {
    "id": "3a95ec37-f55d-46d1-b1bc-c7a1993849d1",
    "titleEn": "THE TURKISH DROP • DAMASCUS EXCLUSIVE",
    "titleAr": "التشكيلة التركية الفاخرة • حصرياً في دمشق",
    "subtitleEn": "Heavyweight cottons & tailored streetwear silhouettes imported direct from Turkey.",
    "subtitleAr": "قطنيات ثقيلة وتصاميم ستريت وير مستوردة مباشرة من تركيا.",
    "imageUrl": "/black_island_storefront.jpg",
    "buttonTextEn": "EXPLORE DROP",
    "buttonTextAr": "تسوق الآن",
    "link": "/shop",
    "order": 1,
    "isActive": true,
    "createdAt": "2026-08-27T23:29:03.468Z"
  }
];
  for (const item of bannersData) {
    await prisma.banner.create({ data: item });
  }

  // 5. Coupons
  console.log('Seeding coupons...');
  const couponsData = [
  {
    "id": "3dc9c2a4-b575-433c-a96d-05f870417449",
    "code": "BLACKISLAND10",
    "type": "PERCENTAGE",
    "value": 10,
    "minOrder": 200000,
    "usageLimit": null,
    "usedCount": 0,
    "expiresAt": null,
    "isActive": true,
    "createdAt": "2026-08-27T23:29:03.473Z"
  },
  {
    "id": "9ae68477-e121-4292-9ff7-248d5292897e",
    "code": "QUDSAYA50",
    "type": "FIXED",
    "value": 50000,
    "minOrder": 400000,
    "usageLimit": null,
    "usedCount": 0,
    "expiresAt": null,
    "isActive": true,
    "createdAt": "2026-08-27T23:29:03.478Z"
  }
];
  for (const item of couponsData) {
    await prisma.coupon.create({ data: item });
  }

  // 6. Showcase3D
  console.log('Seeding 3D showcases...');
  const showcase3DData = [
  {
    "id": "1b541f69-4977-4991-9edd-2913417abea2",
    "key": "hero",
    "titleEn": "BLACK ISLAND Hero Emblem",
    "titleAr": "شعار بلاك آيلاند الثلاثي الأبعاد",
    "modelUrl": null,
    "imageUrl": "/logo.png",
    "positionX": 0,
    "positionY": 0,
    "positionZ": 0,
    "scale": 1,
    "rotationSpeed": 0.005,
    "autoRotate": true,
    "mouseInteraction": true,
    "floatingAnim": true,
    "lightingPower": 1.5,
    "cameraDistance": 5,
    "isActive": true,
    "createdAt": "2026-08-27T23:29:03.528Z",
    "updatedAt": "2026-08-27T23:29:03.528Z"
  },
  {
    "id": "33eed568-5984-462b-9bf3-6554de5a857c",
    "key": "sneaker",
    "titleEn": "BLACK ISLAND Hyper Sneaker 360",
    "titleAr": "سنيكرز بلاك آيلاند 360 درجة",
    "modelUrl": null,
    "imageUrl": "https://images.unsplash.com/photo-1552346154-21d32810aba3?q=80&w=1000",
    "positionX": 0,
    "positionY": 0,
    "positionZ": 0,
    "scale": 1.2,
    "rotationSpeed": 0.008,
    "autoRotate": true,
    "mouseInteraction": true,
    "floatingAnim": true,
    "lightingPower": 2,
    "cameraDistance": 4.5,
    "isActive": true,
    "createdAt": "2026-08-27T23:29:03.531Z",
    "updatedAt": "2026-08-27T23:29:03.531Z"
  }
];
  for (const item of showcase3DData) {
    await prisma.showcase3D.create({ data: item });
  }

  // 7. Store Settings
  console.log('Seeding store settings...');
  const settingsData = [
  {
    "key": "storeName",
    "value": "BLACK ISLAND"
  },
  {
    "key": "phone",
    "value": "0938098917"
  },
  {
    "key": "whatsapp",
    "value": "0938098917"
  },
  {
    "key": "instagram",
    "value": "@black_islandd_fashion"
  },
  {
    "key": "address",
    "value": "Damascus, Syria – Qudsaya"
  },
  {
    "key": "currency",
    "value": "SYP"
  },
  {
    "key": "exchangeRateUSD",
    "value": "15000"
  },
  {
    "key": "feeDamascus",
    "value": "15000"
  },
  {
    "key": "feeRuralDamascus",
    "value": "15000"
  },
  {
    "key": "feeOtherGov",
    "value": "25000"
  }
];
  for (const item of settingsData) {
    await prisma.storeSetting.create({ data: item });
  }

  console.log('Successfully seeded full 34 product catalog!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
