import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding full production BLACK ISLAND catalog...');

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
    "id": "995b46bc-6859-4092-83b0-2488092ac852",
    "email": "admin@blackisland.sy",
    "passwordHash": "admin123",
    "name": "Black Island Admin",
    "role": "ADMIN",
    "createdAt": "2026-09-07T15:50:30.062Z"
  }
];
  for (const item of adminsData) {
    await prisma.admin.create({ data: item });
  }

  // 2. Categories
  console.log('Seeding categories...');
  const categoriesData = [
  {
    "id": "9e635a86-affe-4f4a-9110-65ce699daa66",
    "slug": "hoodies",
    "nameEn": "Hoodies & Sweatshirts",
    "nameAr": "الهوديات والسويت شيرت",
    "descriptionEn": "Heavyweight cotton oversized hoodies imported from Turkey.",
    "descriptionAr": "هوديات قطن ثقيل أوفرسايز صُنعت في تركيا.",
    "image": "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=1000&auto=format&fit=crop",
    "order": 1,
    "isHidden": false,
    "createdAt": "2026-09-07T15:50:30.071Z"
  },
  {
    "id": "70101b99-8473-4d74-a38b-293219f14e7c",
    "slug": "tshirts",
    "nameEn": "T-Shirts & Oversized",
    "nameAr": "التيشيرتات والأوفرسايز",
    "descriptionEn": "Drop-shoulder street tees with high-density graphics.",
    "descriptionAr": "تيشيرتات أكتاف منسدلة وطباعة عالية الدقة.",
    "image": "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=1000&auto=format&fit=crop",
    "order": 2,
    "isHidden": false,
    "createdAt": "2026-09-07T15:50:30.076Z"
  },
  {
    "id": "a3cd6180-a0a1-46ad-ab4b-8f9323f47f12",
    "slug": "pants",
    "nameEn": "Pants & Cargo",
    "nameAr": "البناطيل والكارغو",
    "descriptionEn": "Tactical cargo pants and relaxed streetwear trousers.",
    "descriptionAr": "بناطيل كارغو تكتيكية وقصات ستريت وير مريحة.",
    "image": "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=1000&auto=format&fit=crop",
    "order": 3,
    "isHidden": false,
    "createdAt": "2026-09-07T15:50:30.080Z"
  },
  {
    "id": "b85a4604-56d7-41ee-b1e1-b0f0c14bc865",
    "slug": "sneakers",
    "nameEn": "Sneakers & Shoes",
    "nameAr": "الأحذية والسنيكرز",
    "descriptionEn": "Premium luxury sneakers and chunky street silhouettes.",
    "descriptionAr": "سنيكرز فاخرة وقصات متميزة للشارع.",
    "image": "https://images.unsplash.com/photo-1552346154-21d32810aba3?q=80&w=1000&auto=format&fit=crop",
    "order": 4,
    "isHidden": false,
    "createdAt": "2026-09-07T15:50:30.085Z"
  },
  {
    "id": "030d18f2-3701-42a0-9dd4-70131213d0b3",
    "slug": "caps",
    "nameEn": "Caps & Accessories",
    "nameAr": "القبعات والإكسسوارات",
    "descriptionEn": "Embroidered dad hats, beanies, and silver jewelry.",
    "descriptionAr": "قبعات مطرزة، طواقي، وإكسسوارات أنيقة.",
    "image": "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?q=80&w=1000&auto=format&fit=crop",
    "order": 5,
    "isHidden": false,
    "createdAt": "2026-09-07T15:50:30.090Z"
  }
];
  for (const item of categoriesData) {
    await prisma.category.create({ data: item });
  }

  // 3. Products with Images and Variants
  console.log('Seeding products, images, and variants...');
  const productsData = [
  {
    "id": "156ac7b7-8cbc-4d98-97c1-09a53614c24f",
    "slug": "oversized-black-island-hoodie",
    "nameEn": "BLACK ISLAND Signature Heavy Hoodie",
    "nameAr": "هودي بلاك آيلاند قطن ثقيل أوفرسايز",
    "descEn": "Premium 500GSM 100% Turkish cotton fleece. Features dropped shoulders, double-layered hood, and minimal embroidered logo on the chest. Built for winter performance in Damascus.",
    "descAr": "مصنع من قطن تركي 100% بسمك 500 غرام. أكتاف منسدلة، طاقية مضاعفة، وتطريز بشعار بلاك آيلاند الفاخر على الصدر.",
    "price": 380000,
    "salePrice": 320000,
    "sku": "BI-HD-001",
    "featured": true,
    "isNew": true,
    "isSale": true,
    "isActive": true,
    "categorySlug": "hoodies",
    "createdAt": "2026-09-07T15:50:30.096Z",
    "updatedAt": "2026-09-07T15:50:30.096Z",
    "images": [
      {
        "id": "3c0cdeaf-7245-4938-a300-b69025347f75",
        "productId": "156ac7b7-8cbc-4d98-97c1-09a53614c24f",
        "url": "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=1000&auto=format&fit=crop",
        "isMain": true,
        "order": 0
      },
      {
        "id": "4d46b4fc-d7f4-46e3-b75d-d4b10140f686",
        "productId": "156ac7b7-8cbc-4d98-97c1-09a53614c24f",
        "url": "https://images.unsplash.com/photo-1509967419530-da38b4704bc6?q=80&w=1000&auto=format&fit=crop",
        "isMain": false,
        "order": 1
      }
    ],
    "variants": [
      {
        "id": "d7b443d8-e58b-489e-82f2-32db4b43631d",
        "productId": "156ac7b7-8cbc-4d98-97c1-09a53614c24f",
        "size": "S",
        "colorName": "Obsidian Black",
        "colorHex": "#000000",
        "colorImage": null,
        "colorImages": null,
        "stock": 15
      },
      {
        "id": "18e47d8b-d023-4f99-aa57-23744a63dc56",
        "productId": "156ac7b7-8cbc-4d98-97c1-09a53614c24f",
        "size": "M",
        "colorName": "Obsidian Black",
        "colorHex": "#000000",
        "colorImage": null,
        "colorImages": null,
        "stock": 25
      },
      {
        "id": "66941417-2668-4bb2-9140-6af49779a314",
        "productId": "156ac7b7-8cbc-4d98-97c1-09a53614c24f",
        "size": "L",
        "colorName": "Obsidian Black",
        "colorHex": "#000000",
        "colorImage": null,
        "colorImages": null,
        "stock": 20
      },
      {
        "id": "a99ee9bd-92cb-4a08-a20f-5b2089b70358",
        "productId": "156ac7b7-8cbc-4d98-97c1-09a53614c24f",
        "size": "XL",
        "colorName": "Obsidian Black",
        "colorHex": "#000000",
        "colorImage": null,
        "colorImages": null,
        "stock": 10
      },
      {
        "id": "93fd0948-657a-4fc0-9bc1-33b73536f495",
        "productId": "156ac7b7-8cbc-4d98-97c1-09a53614c24f",
        "size": "XXL",
        "colorName": "Obsidian Black",
        "colorHex": "#000000",
        "colorImage": null,
        "colorImages": null,
        "stock": 5
      },
      {
        "id": "aa669488-ee7f-4683-bdcc-e5a65ae4fa17",
        "productId": "156ac7b7-8cbc-4d98-97c1-09a53614c24f",
        "size": "M",
        "colorName": "Charcoal Gray",
        "colorHex": "#262626",
        "colorImage": null,
        "colorImages": null,
        "stock": 18
      },
      {
        "id": "dc8aa275-9f99-4f36-940b-e4240a9b76bd",
        "productId": "156ac7b7-8cbc-4d98-97c1-09a53614c24f",
        "size": "L",
        "colorName": "Charcoal Gray",
        "colorHex": "#262626",
        "colorImage": null,
        "colorImages": null,
        "stock": 14
      }
    ]
  },
  {
    "id": "dc9d237d-898e-4a7e-88d6-e2684c8fdd77",
    "slug": "matrix-graphic-oversized-tee",
    "nameEn": "Matrix Vintage Graphic Tee",
    "nameAr": "تيشيرت ماتركس اوفرسايز فينتاج",
    "descEn": "Acid-washed 240GSM cotton t-shirt with screenprinted back graphic. Made in Turkey for maximum comfort and durability.",
    "descAr": "قطن مغسول 240 غرام بطباعة شاشة حريرية غرافيك على الظهر. خامة تركية عالية التحمل.",
    "price": 195000,
    "salePrice": null,
    "sku": "BI-TS-002",
    "featured": true,
    "isNew": true,
    "isSale": false,
    "isActive": true,
    "categorySlug": "tshirts",
    "createdAt": "2026-09-07T15:50:30.144Z",
    "updatedAt": "2026-09-07T15:50:30.144Z",
    "images": [
      {
        "id": "ab2a07a6-f281-4689-ba36-7112f2381587",
        "productId": "dc9d237d-898e-4a7e-88d6-e2684c8fdd77",
        "url": "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=1000&auto=format&fit=crop",
        "isMain": true,
        "order": 0
      },
      {
        "id": "1f466786-fec0-4506-a476-1ae26c5ea95c",
        "productId": "dc9d237d-898e-4a7e-88d6-e2684c8fdd77",
        "url": "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?q=80&w=1000&auto=format&fit=crop",
        "isMain": false,
        "order": 1
      }
    ],
    "variants": [
      {
        "id": "f1f97590-d7fc-410d-8030-54db37713f2b",
        "productId": "dc9d237d-898e-4a7e-88d6-e2684c8fdd77",
        "size": "S",
        "colorName": "Washed Black",
        "colorHex": "#1a1a1a",
        "colorImage": null,
        "colorImages": null,
        "stock": 12
      },
      {
        "id": "0bb4a06f-2532-46cd-a339-d568939e82df",
        "productId": "dc9d237d-898e-4a7e-88d6-e2684c8fdd77",
        "size": "M",
        "colorName": "Washed Black",
        "colorHex": "#1a1a1a",
        "colorImage": null,
        "colorImages": null,
        "stock": 30
      },
      {
        "id": "e0478086-33a3-4f46-950a-6fbf4831345d",
        "productId": "dc9d237d-898e-4a7e-88d6-e2684c8fdd77",
        "size": "L",
        "colorName": "Washed Black",
        "colorHex": "#1a1a1a",
        "colorImage": null,
        "colorImages": null,
        "stock": 25
      },
      {
        "id": "0ac51d31-c8cd-4804-8188-7dc534d31b8b",
        "productId": "dc9d237d-898e-4a7e-88d6-e2684c8fdd77",
        "size": "XL",
        "colorName": "Washed Black",
        "colorHex": "#1a1a1a",
        "colorImage": null,
        "colorImages": null,
        "stock": 15
      },
      {
        "id": "80d09619-6230-4289-8384-58dcb6f23f57",
        "productId": "dc9d237d-898e-4a7e-88d6-e2684c8fdd77",
        "size": "M",
        "colorName": "Bone White",
        "colorHex": "#f0ede6",
        "colorImage": null,
        "colorImages": null,
        "stock": 10
      }
    ]
  },
  {
    "id": "bf20d8d8-836c-4b44-bfe4-1da08f2b6602",
    "slug": "tactical-cargo-pants-v1",
    "nameEn": "Stealth Tactical Cargo Pants",
    "nameAr": "بنطال ستيلث كارغو تكتيكي",
    "descEn": "Heavyweight ripstop stretch cotton with 6 utility pockets, adjustable ankle straps, and custom metallic hardware.",
    "descAr": "قماش ريبستوب مقاوم للتآكل مع 6 جيوب تكتيكية وأربطة تضييق عند الكاحل.",
    "price": 290000,
    "salePrice": 245000,
    "sku": "BI-PT-003",
    "featured": true,
    "isNew": false,
    "isSale": true,
    "isActive": true,
    "categorySlug": "pants",
    "createdAt": "2026-09-07T15:50:30.179Z",
    "updatedAt": "2026-09-07T15:50:30.179Z",
    "images": [
      {
        "id": "3e3c5f0f-146e-45e2-8d04-22c495cd7564",
        "productId": "bf20d8d8-836c-4b44-bfe4-1da08f2b6602",
        "url": "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=1000&auto=format&fit=crop",
        "isMain": true,
        "order": 0
      }
    ],
    "variants": [
      {
        "id": "9b102ef6-38ce-4376-92d2-6e26564ffa80",
        "productId": "bf20d8d8-836c-4b44-bfe4-1da08f2b6602",
        "size": "S",
        "colorName": "Stealth Black",
        "colorHex": "#0f0f12",
        "colorImage": null,
        "colorImages": null,
        "stock": 8
      },
      {
        "id": "b4576083-ff34-418b-b995-88ff9b77427f",
        "productId": "bf20d8d8-836c-4b44-bfe4-1da08f2b6602",
        "size": "M",
        "colorName": "Stealth Black",
        "colorHex": "#0f0f12",
        "colorImage": null,
        "colorImages": null,
        "stock": 16
      },
      {
        "id": "5d96aecd-adc2-4fa9-a1d4-d7283d81c170",
        "productId": "bf20d8d8-836c-4b44-bfe4-1da08f2b6602",
        "size": "L",
        "colorName": "Stealth Black",
        "colorHex": "#0f0f12",
        "colorImage": null,
        "colorImages": null,
        "stock": 14
      },
      {
        "id": "45b06987-aea2-47b7-9381-8137d2903c85",
        "productId": "bf20d8d8-836c-4b44-bfe4-1da08f2b6602",
        "size": "XL",
        "colorName": "Stealth Black",
        "colorHex": "#0f0f12",
        "colorImage": null,
        "colorImages": null,
        "stock": 6
      }
    ]
  },
  {
    "id": "b4bf57d3-3c9b-4570-977b-e2a01658e354",
    "slug": "black-island-hyper-sneaker-01",
    "nameEn": "BLACK ISLAND Hyper Sneaker - Triple Black",
    "nameAr": "حذاء سنيكرز هايبر - أسود كامل",
    "descEn": "Architectural streetwear sneaker crafted with genuine full-grain leather, chunky TPU sole, and gold engraved heel identity.",
    "descAr": "سنيكرز معماري مصنع من الجلد الطبيعي مع نعل TPU سميك وتطريز ذهبي فاخر عند الكعب.",
    "price": 490000,
    "salePrice": 420000,
    "sku": "BI-SNK-004",
    "featured": true,
    "isNew": true,
    "isSale": true,
    "isActive": true,
    "categorySlug": "sneakers",
    "createdAt": "2026-09-07T15:50:30.204Z",
    "updatedAt": "2026-09-07T15:50:30.204Z",
    "images": [
      {
        "id": "0d810041-f866-45ad-9804-a8d68070584d",
        "productId": "b4bf57d3-3c9b-4570-977b-e2a01658e354",
        "url": "https://images.unsplash.com/photo-1552346154-21d32810aba3?q=80&w=1000&auto=format&fit=crop",
        "isMain": true,
        "order": 0
      },
      {
        "id": "426ddb76-c0db-46d6-82f5-351749c51f72",
        "productId": "b4bf57d3-3c9b-4570-977b-e2a01658e354",
        "url": "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=1000&auto=format&fit=crop",
        "isMain": false,
        "order": 1
      }
    ],
    "variants": [
      {
        "id": "4e5f2c5b-58c9-4931-ab0d-18f6e75ec4e4",
        "productId": "b4bf57d3-3c9b-4570-977b-e2a01658e354",
        "size": "40",
        "colorName": "Triple Black",
        "colorHex": "#000000",
        "colorImage": null,
        "colorImages": null,
        "stock": 6
      },
      {
        "id": "a59a2020-6eab-4e89-9fa0-48d28c8edfb1",
        "productId": "b4bf57d3-3c9b-4570-977b-e2a01658e354",
        "size": "41",
        "colorName": "Triple Black",
        "colorHex": "#000000",
        "colorImage": null,
        "colorImages": null,
        "stock": 12
      },
      {
        "id": "dad4d9fb-54a9-4fb6-a0e3-3a548e89c933",
        "productId": "b4bf57d3-3c9b-4570-977b-e2a01658e354",
        "size": "42",
        "colorName": "Triple Black",
        "colorHex": "#000000",
        "colorImage": null,
        "colorImages": null,
        "stock": 15
      },
      {
        "id": "fabf63b8-2c5d-4cdf-8bd5-1e0a6f4e8d98",
        "productId": "b4bf57d3-3c9b-4570-977b-e2a01658e354",
        "size": "43",
        "colorName": "Triple Black",
        "colorHex": "#000000",
        "colorImage": null,
        "colorImages": null,
        "stock": 10
      },
      {
        "id": "77fbb2e8-f19c-4bc9-9ce6-8cc6ff189f42",
        "productId": "b4bf57d3-3c9b-4570-977b-e2a01658e354",
        "size": "44",
        "colorName": "Triple Black",
        "colorHex": "#000000",
        "colorImage": null,
        "colorImages": null,
        "stock": 8
      },
      {
        "id": "51e4b7bb-3ddd-43d3-b483-6d0d5794f382",
        "productId": "b4bf57d3-3c9b-4570-977b-e2a01658e354",
        "size": "45",
        "colorName": "Triple Black",
        "colorHex": "#000000",
        "colorImage": null,
        "colorImages": null,
        "stock": 4
      }
    ]
  },
  {
    "id": "56f9360a-3729-442c-bf05-b5d0bb1f1fad",
    "slug": "minimalist-embroidered-cap",
    "nameEn": "BLACK ISLAND 3D Embroidered Cap",
    "nameAr": "كاب بلاك آيلاند تطريز ثلاثي الأبعاد",
    "descEn": "Premium 6-panel twill cap with 3D puff embroidery logo. Metal buckle strap adjustment.",
    "descAr": "كاب 6 طبقات قطن تويل مع تطريز بارز لشعار بلاك آيلاند ومشتاك معدني خلفي.",
    "price": 95000,
    "salePrice": null,
    "sku": "BI-CAP-005",
    "featured": false,
    "isNew": true,
    "isSale": false,
    "isActive": true,
    "categorySlug": "caps",
    "createdAt": "2026-09-07T15:50:30.246Z",
    "updatedAt": "2026-09-07T15:50:30.246Z",
    "images": [
      {
        "id": "2ded38ab-f27e-4b75-9fec-21cc7a9ed47f",
        "productId": "56f9360a-3729-442c-bf05-b5d0bb1f1fad",
        "url": "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?q=80&w=1000&auto=format&fit=crop",
        "isMain": true,
        "order": 0
      }
    ],
    "variants": [
      {
        "id": "70c0b6f9-39e7-4587-bf65-65c70dee9daf",
        "productId": "56f9360a-3729-442c-bf05-b5d0bb1f1fad",
        "size": "One Size",
        "colorName": "Jet Black",
        "colorHex": "#000000",
        "colorImage": null,
        "colorImages": null,
        "stock": 35
      },
      {
        "id": "94404d20-0985-4743-b3ad-37161e62efea",
        "productId": "56f9360a-3729-442c-bf05-b5d0bb1f1fad",
        "size": "One Size",
        "colorName": "Slate Gray",
        "colorHex": "#475569",
        "colorImage": null,
        "colorImages": null,
        "stock": 20
      }
    ]
  },
  {
    "id": "d1eee20b-ec69-4690-80cc-cb2662139154",
    "slug": "signature-sweatshirt-charcoal",
    "nameEn": "Minimalist Heavyweight Sweatshirt",
    "nameAr": "سويت شيرت أوفرسايز قطن ثقيل",
    "descEn": "Clean cut heavyweight sweatshirt with ribbed collar and cuffs. Ideal layering essential for Damascus evenings.",
    "descAr": "سويت شيرت بياقة وأسورة محبوكة. قطعة أساسية للأمسيات الباردة.",
    "price": 310000,
    "salePrice": 275000,
    "sku": "BI-SW-006",
    "featured": false,
    "isNew": false,
    "isSale": true,
    "isActive": true,
    "categorySlug": "hoodies",
    "createdAt": "2026-09-07T15:50:30.266Z",
    "updatedAt": "2026-09-07T15:50:30.266Z",
    "images": [
      {
        "id": "e65e8d02-4a2d-4758-bd05-3a0996ed1c7c",
        "productId": "d1eee20b-ec69-4690-80cc-cb2662139154",
        "url": "https://images.unsplash.com/photo-1509967419530-da38b4704bc6?q=80&w=1000&auto=format&fit=crop",
        "isMain": true,
        "order": 0
      }
    ],
    "variants": [
      {
        "id": "16ded4f4-acec-4c2a-a46d-243361f4e756",
        "productId": "d1eee20b-ec69-4690-80cc-cb2662139154",
        "size": "M",
        "colorName": "Charcoal",
        "colorHex": "#2d2d2d",
        "colorImage": null,
        "colorImages": null,
        "stock": 14
      },
      {
        "id": "9efefc71-2752-470e-8ce1-2784b7a50d0f",
        "productId": "d1eee20b-ec69-4690-80cc-cb2662139154",
        "size": "L",
        "colorName": "Charcoal",
        "colorHex": "#2d2d2d",
        "colorImage": null,
        "colorImages": null,
        "stock": 18
      },
      {
        "id": "22c1154e-bdb6-4a12-84d6-1abd071e11d9",
        "productId": "d1eee20b-ec69-4690-80cc-cb2662139154",
        "size": "XL",
        "colorName": "Charcoal",
        "colorHex": "#2d2d2d",
        "colorImage": null,
        "colorImages": null,
        "stock": 9
      }
    ]
  },
  {
    "id": "9cd2ff43-c11c-4eb6-8828-423eff8e5fd6",
    "slug": "oversized-streetwear-women-crop-hoodie",
    "nameEn": "BLACK ISLAND Women Crop Heavy Hoodie",
    "nameAr": "هودي نسائي كروب أوفرسايز",
    "descEn": "Tailored oversized cropped hoodie designed with heavyweight Turkish fleece cotton.",
    "descAr": "هودي نسائي أوفرسايز بقصة كروب عصرية ومصنع من القطن التركي الفاخر.",
    "price": 330000,
    "salePrice": 285000,
    "sku": "BI-WHD-007",
    "featured": true,
    "isNew": true,
    "isSale": true,
    "isActive": true,
    "categorySlug": "hoodies",
    "createdAt": "2026-09-07T15:50:30.287Z",
    "updatedAt": "2026-09-07T15:50:30.287Z",
    "images": [
      {
        "id": "ce2682dd-0bc9-428e-97b5-1f158d389646",
        "productId": "9cd2ff43-c11c-4eb6-8828-423eff8e5fd6",
        "url": "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000&auto=format&fit=crop",
        "isMain": true,
        "order": 0
      }
    ],
    "variants": [
      {
        "id": "f55434a8-e59c-4180-b595-4e44230bef55",
        "productId": "9cd2ff43-c11c-4eb6-8828-423eff8e5fd6",
        "size": "S",
        "colorName": "Matte Black",
        "colorHex": "#000000",
        "colorImage": null,
        "colorImages": null,
        "stock": 10
      },
      {
        "id": "d8ddbc5d-d922-4921-8232-d0cb371187f0",
        "productId": "9cd2ff43-c11c-4eb6-8828-423eff8e5fd6",
        "size": "M",
        "colorName": "Matte Black",
        "colorHex": "#000000",
        "colorImage": null,
        "colorImages": null,
        "stock": 15
      },
      {
        "id": "8504f6b3-9389-40cf-a100-7d6d3e8ecf33",
        "productId": "9cd2ff43-c11c-4eb6-8828-423eff8e5fd6",
        "size": "L",
        "colorName": "Matte Black",
        "colorHex": "#000000",
        "colorImage": null,
        "colorImages": null,
        "stock": 8
      }
    ]
  },
  {
    "id": "b3d054ce-b695-4344-ae88-5a8287a1cbf8",
    "slug": "vintage-washed-denim-jeans",
    "nameEn": "Obsidian Wide-Leg Denim Jeans",
    "nameAr": "بنطال جينز واسع مغسول بالحمض",
    "descEn": "Heavy 14oz Turkish denim relaxed fit with raw distress details.",
    "descAr": "جينز 14 أونصة قطن ثقيل بقصة واسعة وتفاصيل معتقة عصرية.",
    "price": 360000,
    "salePrice": null,
    "sku": "BI-JN-008",
    "featured": false,
    "isNew": true,
    "isSale": false,
    "isActive": true,
    "categorySlug": "pants",
    "createdAt": "2026-09-07T15:50:30.312Z",
    "updatedAt": "2026-09-07T15:50:30.312Z",
    "images": [
      {
        "id": "a7076cfd-1804-418d-b34a-230fec7bcefb",
        "productId": "b3d054ce-b695-4344-ae88-5a8287a1cbf8",
        "url": "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=1000&auto=format&fit=crop",
        "isMain": true,
        "order": 0
      }
    ],
    "variants": [
      {
        "id": "81503f64-1387-4833-a556-5b93e7eaff05",
        "productId": "b3d054ce-b695-4344-ae88-5a8287a1cbf8",
        "size": "S",
        "colorName": "Dark Indigo",
        "colorHex": "#1e293b",
        "colorImage": null,
        "colorImages": null,
        "stock": 7
      },
      {
        "id": "eabc7ebc-bdb1-4730-b3d0-0a2efaefdc19",
        "productId": "b3d054ce-b695-4344-ae88-5a8287a1cbf8",
        "size": "M",
        "colorName": "Dark Indigo",
        "colorHex": "#1e293b",
        "colorImage": null,
        "colorImages": null,
        "stock": 12
      },
      {
        "id": "98816635-aadc-498e-a651-a3faf995bad3",
        "productId": "b3d054ce-b695-4344-ae88-5a8287a1cbf8",
        "size": "L",
        "colorName": "Dark Indigo",
        "colorHex": "#1e293b",
        "colorImage": null,
        "colorImages": null,
        "stock": 15
      }
    ]
  }
];
  for (const p of productsData) {
    const { id, images, variants, createdAt, updatedAt, ...pData } = p;
    await prisma.product.create({
      data: {
        ...pData,
        id,
        images: {
          create: images.map(({ id: imgId, productId, ...img }) => img),
        },
        variants: {
          create: variants.map(({ id: varId, productId, ...v }) => v),
        },
      },
    });
  }

  // 4. Banners
  console.log('Seeding banners...');
  const bannersData = [
  {
    "id": "a2e027c6-4ce7-4689-96d7-01eb34112cfc",
    "titleEn": "THE TURKISH DROP • DAMASCUS EXCLUSIVE",
    "titleAr": "التشكيلة التركية الفاخرة • حصرياً في دمشق",
    "subtitleEn": "Heavyweight cottons & tailored streetwear silhouettes imported direct from Turkey.",
    "subtitleAr": "قطنيات ثقيلة وتصاميم ستريت وير مستوردة مباشرة من تركيا.",
    "imageUrl": "https://images.unsplash.com/photo-1509967419530-da38b4704bc6?q=80&w=1600&auto=format&fit=crop",
    "buttonTextEn": "EXPLORE DROP",
    "buttonTextAr": "تسوق الآن",
    "link": "/shop",
    "order": 1,
    "isActive": true,
    "createdAt": "2026-09-07T15:50:30.334Z"
  }
];
  for (const item of bannersData) {
    await prisma.banner.create({ data: item });
  }

  // 5. Coupons
  console.log('Seeding coupons...');
  const couponsData = [
  {
    "id": "ec11d378-bf5c-4d51-9754-0fba6f75f3b5",
    "code": "BLACKISLAND10",
    "type": "PERCENTAGE",
    "value": 10,
    "minOrder": 200000,
    "usageLimit": null,
    "usedCount": 0,
    "expiresAt": null,
    "isActive": true,
    "createdAt": "2026-09-07T15:50:30.339Z"
  },
  {
    "id": "e4bf3495-584a-4265-af4a-73d655300a9f",
    "code": "QUDSAYA50",
    "type": "FIXED",
    "value": 50000,
    "minOrder": 400000,
    "usageLimit": null,
    "usedCount": 0,
    "expiresAt": null,
    "isActive": true,
    "createdAt": "2026-09-07T15:50:30.345Z"
  }
];
  for (const item of couponsData) {
    await prisma.coupon.create({ data: item });
  }

  // 6. Showcase3D
  console.log('Seeding 3D showcases...');
  const showcase3DData = [
  {
    "id": "3d3a0fe4-1577-4c47-842e-8105983a0737",
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
    "createdAt": "2026-09-07T15:50:30.389Z",
    "updatedAt": "2026-09-07T15:50:30.389Z"
  },
  {
    "id": "adf8532a-95d5-44ee-950a-569fe11f4714",
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
    "createdAt": "2026-09-07T15:50:30.394Z",
    "updatedAt": "2026-09-07T15:50:30.394Z"
  }
];
  for (const item of showcase3DData) {
    await prisma.showcase3D.create({ data: item });
  }

  // 7. Store Settings
  console.log('Seeding store settings...');
  const storeSettingsData = [
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
  for (const item of storeSettingsData) {
    await prisma.storeSetting.create({ data: item });
  }

  console.log('Successfully seeded production catalog!');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
