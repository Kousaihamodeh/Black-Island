export type Language = 'en' | 'ar';

export interface Translations {
  // Brand & General
  brandName: string;
  tagline: string;
  madeInTurkey: string;
  phone: string;
  whatsapp: string;
  instagram: string;
  location: string;
  currency: string;
  currencySymbol: string;

  // Header & Nav
  announcement: string;
  home: string;
  shop: string;
  men: string;
  women: string;
  newArrivals: string;
  sale: string;
  sneakers: string;
  hoodies: string;
  tshirts: string;
  pants: string;
  accessories: string;
  caps: string;
  aboutUs: string;
  adminPanel: string;
  searchPlaceholder: string;
  cart: string;
  wishlist: string;
  myAccount: string;

  // Hero & Homepage
  heroTitle: string;
  heroSubtitle: string;
  shopMenBtn: string;
  shopWomenBtn: string;
  exploreCollection: string;
  featuredProductsTitle: string;
  featuredProductsSub: string;
  newArrivalsTitle: string;
  newArrivalsSub: string;
  trendingNowTitle: string;
  trendingNowSub: string;
  brandStoryTitle: string;
  brandStoryText: string;
  instagramTitle: string;
  instagramHandle: string;
  whatsappCtaTitle: string;
  whatsappCtaSub: string;
  whatsappCtaBtn: string;
  viewAll: string;
  addToCart: string;
  quickView: string;

  // Shop & Filters
  allCategories: string;
  filterByPrice: string;
  filterBySize: string;
  filterByColor: string;
  sortBy: string;
  sortNewest: string;
  sortPriceLowHigh: string;
  sortPriceHighLow: string;
  showingProducts: string;
  noProductsFound: string;
  clearFilters: string;
  onSaleOnly: string;
  inStockOnly: string;

  // Product Page
  selectSize: string;
  selectColor: string;
  quantity: string;
  inStock: string;
  outOfStock: string;
  onlyLeftInStock: string;
  sku: string;
  category: string;
  buyNow: string;
  orderByWhatsapp: string;
  description: string;
  shippingReturns: string;
  shippingPolicy: string;
  relatedProducts: string;

  // Cart & Checkout
  cartTitle: string;
  cartEmpty: string;
  continueShopping: string;
  subtotal: string;
  deliveryFee: string;
  deliveryToAgree: string;
  discount: string;
  total: string;
  couponCode: string;
  applyCoupon: string;
  couponApplied: string;
  invalidCoupon: string;
  checkout: string;
  checkoutTitle: string;

  // Checkout Form
  fullName: string;
  phoneNumber: string;
  whatsappNumber: string;
  governorate: string;
  cityArea: string;
  detailedAddress: string;
  orderNotes: string;
  paymentMethod: string;
  cashOnDelivery: string;
  whatsappOrderPayment: string;
  placeOrder: string;
  submittingOrder: string;

  // Confirmation
  orderConfirmed: string;
  orderNumber: string;
  thankYouMessage: string;
  sendWhatsappConfirmation: string;
  orderDetails: string;

  // Syrian Governorates
  govDamascus: string;
  govRuralDamascus: string;
  govAleppo: string;
  govHoms: string;
  govHama: string;
  govLattakia: string;
  govTartous: string;
  govDeraa: string;
  govSweida: string;
  govHasakah: string;
  govDeirEzZor: string;
  govRaqqa: string;
  govIdlib: string;

  // Wishlist
  wishlistTitle: string;
  wishlistEmpty: string;

  // Admin Panel
  adminDashboard: string;
  adminProducts: string;
  adminCategories: string;
  adminOrders: string;
  adminInventory: string;
  adminCoupons: string;
  adminBanners: string;
  adminShowcases3D: string;
  adminSettings: string;
  adminLogout: string;
  totalSales: string;
  totalOrders: string;
  revenue: string;
  pendingOrders: string;
  completedOrders: string;
  lowStockAlerts: string;
  recentOrders: string;
  addProduct: string;
  editProduct: string;
  deleteProduct: string;
  uploadImages: string;
  saveChanges: string;
  orderStatus: string;
}

export const translations: Record<Language, Translations> = {
  en: {
    brandName: 'BLACK ISLAND',
    tagline: 'PREMIUM STREETWEAR | EST. 2024',
    madeInTurkey: 'Made in Turkey 🇹🇷',
    phone: '0938098917',
    whatsapp: '0938098917',
    instagram: '@black_islandd_fashion',
    location: 'Damascus, Syria – Qudsaya',
    currency: 'USD',
    currencySymbol: '$',

    announcement: 'MADE IN TURKEY 🇹🇷 • EXPRESS DELIVERY ACROSS ALL SYRIAN GOVERNORATES',
    home: 'Home',
    shop: 'Shop Catalog',
    men: "Men's Collection",
    women: "Women's Collection",
    newArrivals: 'New Arrivals',
    sale: 'Sale',
    sneakers: 'Sneakers & Shoes',
    hoodies: 'Hoodies & Sweatshirts',
    tshirts: 'T-Shirts & Oversized',
    pants: 'Pants & Cargo',
    accessories: 'Accessories',
    caps: 'Caps & Hats',
    aboutUs: 'Brand Story',
    adminPanel: 'Admin Control Center',
    searchPlaceholder: 'Search oversized hoodies, sneakers, cargo pants...',
    cart: 'Shopping Cart',
    wishlist: 'Wishlist',
    myAccount: 'My Account',

    heroTitle: 'DOMINATE THE STREETS',
    heroSubtitle: 'Luxury Streetwear Crafted in Turkey • Styled & Delivered in Damascus',
    shopMenBtn: 'SHOP MEN',
    shopWomenBtn: 'SHOP WOMEN',
    exploreCollection: 'EXPLORE CATALOG',
    featuredProductsTitle: 'FEATURED DROPS',
    featuredProductsSub: 'Exclusive oversized cuts and heavy-cotton essentials',
    newArrivalsTitle: 'NEW ARRIVALS',
    newArrivalsSub: 'Fresh Turkey imports for the current season',
    trendingNowTitle: 'TRENDING NOW',
    trendingNowSub: 'Most requested pieces in Qudsaya & Damascus',
    brandStoryTitle: 'THE BLACK ISLAND IDENTITY',
    brandStoryText: 'Rooted in bold dark fashion and international street culture, BLACK ISLAND brings high-caliber Turkish manufacturing directly to Damascus. Heavyweight fabrics, precise tailored fits, and uncompromised quality.',
    instagramTitle: 'FOLLOW OUR STYLE ON INSTAGRAM',
    instagramHandle: '@black_islandd_fashion',
    whatsappCtaTitle: 'DIRECT WHATSAPP ORDERING',
    whatsappCtaSub: 'Need instant styling advice or quick ordering? Connect with our Damascus team directly.',
    whatsappCtaBtn: 'ORDER VIA WHATSAPP (0938098917)',
    viewAll: 'VIEW ALL',
    addToCart: 'ADD TO CART',
    quickView: 'QUICK VIEW',

    allCategories: 'All Categories',
    filterByPrice: 'Filter by Price',
    filterBySize: 'Filter by Size',
    filterByColor: 'Filter by Color',
    sortBy: 'Sort By',
    sortNewest: 'Newest Drops',
    sortPriceLowHigh: 'Price: Low to High',
    sortPriceHighLow: 'Price: High to Low',
    showingProducts: 'Showing {count} products',
    noProductsFound: 'No products matched your criteria.',
    clearFilters: 'Clear Filters',
    onSaleOnly: 'On Sale Only',
    inStockOnly: 'In Stock Only',

    selectSize: 'SELECT SIZE',
    selectColor: 'SELECT COLOR',
    quantity: 'QUANTITY',
    inStock: 'IN STOCK',
    outOfStock: 'OUT OF STOCK',
    onlyLeftInStock: 'Only {count} left in stock!',
    sku: 'SKU',
    category: 'CATEGORY',
    buyNow: 'BUY NOW',
    orderByWhatsapp: 'ORDER ON WHATSAPP',
    description: 'PRODUCT DETAILS',
    shippingReturns: 'SHIPPING & GUARANTEE',
    shippingPolicy: 'Shipped from Qudsaya, Damascus. Delivery fee will be agreed with you after order confirmation.',
    relatedProducts: 'YOU MAY ALSO LIKE',

    cartTitle: 'YOUR BAG',
    cartEmpty: 'Your shopping cart is currently empty.',
    continueShopping: 'CONTINUE SHOPPING',
    subtotal: 'PRODUCTS SUBTOTAL',
    deliveryFee: 'DELIVERY',
    deliveryToAgree: 'To be agreed upon order confirmation',
    discount: 'DISCOUNT',
    total: 'PRODUCTS TOTAL',
    couponCode: 'PROMO CODE',
    applyCoupon: 'APPLY',
    couponApplied: 'Promo code applied successfully!',
    invalidCoupon: 'Invalid or expired promo code',
    checkout: 'PROCEED TO CHECKOUT',
    checkoutTitle: 'COMPLETE YOUR ORDER',

    fullName: 'Full Name',
    phoneNumber: 'Phone Number',
    whatsappNumber: 'WhatsApp Number',
    governorate: 'Governorate',
    cityArea: 'City / Area',
    detailedAddress: 'Detailed Street Address',
    orderNotes: 'Order Notes (Optional)',
    paymentMethod: 'Payment Method',
    cashOnDelivery: 'Cash on Delivery (COD)',
    whatsappOrderPayment: 'Order & Confirm via WhatsApp',
    placeOrder: 'CONFIRM & PLACE ORDER',
    submittingOrder: 'PROCESSING ORDER...',

    orderConfirmed: 'ORDER CONFIRMED!',
    orderNumber: 'Order ID',
    thankYouMessage: 'Thank you for shopping with BLACK ISLAND. Delivery fee will be agreed with you via WhatsApp or phone after order confirmation.',
    sendWhatsappConfirmation: 'SEND ORDER TO WHATSAPP NOW',
    orderDetails: 'ORDER DETAILS',

    govDamascus: 'Damascus (دمشق)',
    govRuralDamascus: 'Rural Damascus / Qudsaya (ريف دمشق / قدسيا)',
    govAleppo: 'Aleppo (حلب)',
    govHoms: 'Homs (حمص)',
    govHama: 'Hama (حماه)',
    govLattakia: 'Lattakia (اللاذقية)',
    govTartous: 'Tartous (طرتوس)',
    govDeraa: 'Deraa (درعا)',
    govSweida: 'Sweida (السويداء)',
    govHasakah: 'Hasakah (الحسكة)',
    govDeirEzZor: 'Deir ez-Zor (دير الزور)',
    govRaqqa: 'Raqqa (الرقة)',
    govIdlib: 'Idlib (إدلب)',

    wishlistTitle: 'YOUR WISHLIST',
    wishlistEmpty: 'No items saved in your wishlist yet.',

    adminDashboard: 'Dashboard Overview',
    adminProducts: 'Product Catalog',
    adminCategories: 'Categories Management',
    adminOrders: 'Customer Orders',
    adminInventory: 'Stock & Inventory',
    adminCoupons: 'Promo Coupons',
    adminBanners: 'Homepage Banners',
    adminShowcases3D: 'Configurable 3D Engine',
    adminSettings: 'Store Settings',
    adminLogout: 'Logout Admin',
    totalSales: 'Total Sales Revenue',
    totalOrders: 'Total Orders',
    revenue: 'Net Revenue',
    pendingOrders: 'Pending Orders',
    completedOrders: 'Completed Orders',
    lowStockAlerts: 'Low Stock Alerts',
    recentOrders: 'Recent Customer Orders',
    addProduct: '+ Add New Product',
    editProduct: 'Edit Product',
    deleteProduct: 'Delete Product',
    uploadImages: 'Upload Product Images (Saved to /uploads)',
    saveChanges: 'Save Changes',
    orderStatus: 'Order Status',
  },
  ar: {
    brandName: 'بلاك آيلاند | BLACK ISLAND',
    tagline: 'أزياء ستريت وير فاخرة | تأسست 2024',
    madeInTurkey: 'صنع في تركيا 🇹🇷',
    phone: '0938098917',
    whatsapp: '0938098917',
    instagram: '@black_islandd_fashion',
    location: 'دمشق، سورية – قدسيا',
    currency: '$',
    currencySymbol: '$',

    announcement: 'صنع في تركيا 🇹🇷 • شحن سريع لكافة المحافظات السورية من دمشق - قدسيا',
    home: 'الرئيسية',
    shop: 'متجر التشكيلات',
    men: 'تشكيلة الرجالي',
    women: 'تشكيلة النسائي',
    newArrivals: 'وصل حديثاً',
    sale: 'تخفيضات',
    sneakers: 'الأحذية والسنيكرز',
    hoodies: 'الهوديات والسويت شيرت',
    tshirts: 'التيشيرتات والأوفرسايز',
    pants: 'البناطيل والكارغو',
    accessories: 'الإكسسوارات',
    caps: 'القبعات والكوابس',
    aboutUs: 'قصة العلامة',
    adminPanel: 'مركز تحكم المتجر',
    searchPlaceholder: 'ابحث عن هودي أوفرسايز، سنيكرز، بنطال كارغو...',
    cart: 'حقيبة التسوق',
    wishlist: 'المفضلة',
    myAccount: 'حسابي',

    heroTitle: 'سيطر على الشارع',
    heroSubtitle: 'أزياء ستريت وير فاخرة صُنعت في تركيا • وتصلك أينما كنت في سورية',
    shopMenBtn: 'تسوق الرجالي',
    shopWomenBtn: 'تسوق النسائي',
    exploreCollection: 'استكشف التشكيلة',
    featuredProductsTitle: 'المنتجات المميزة',
    featuredProductsSub: 'قصات أوفرسايز الحصرية وقطن ثقيل فاخر',
    newArrivalsTitle: 'وصل حديثاً',
    newArrivalsSub: 'أحدث التشكيلات المستوردة من تركيا للموسم الحالي',
    trendingNowTitle: 'الأكثر طلباً',
    trendingNowSub: 'القطع الأكثر شعبية في دمشق وقدسيا',
    brandStoryTitle: 'هوية بلاك آيلاند | BLACK ISLAND',
    brandStoryText: 'تأسست بلاك آيلاند لتقديم أرقى تصاميم الستريت وير العالمية والمصنعة في تركيا مباشرة إلى عملائنا في سورية. نهتم بدقة التفاصيل، جودة الأقمشة القطنية الثقيلة، والقصات العصرية المتفردة.',
    instagramTitle: 'تابع إطلالاتنا على إنستغرام',
    instagramHandle: '@black_islandd_fashion',
    whatsappCtaTitle: 'طلب مباشر عبر واتساب',
    whatsappCtaSub: 'هل تحتاج استشارة في المقاسات أو ترغب بالطلب السريع؟ تواصل مع فريقنا في دمشق فوراً.',
    whatsappCtaBtn: 'الطلب عبر واتساب (0938098917)',
    viewAll: 'عرض الكل',
    addToCart: 'إضافة إلى السلة',
    quickView: 'نظرة سريعة',

    allCategories: 'جميع الأقسام',
    filterByPrice: 'تصفية حسب السعر',
    filterBySize: 'تصفية حسب المقاس',
    filterByColor: 'تصفية حسب اللون',
    sortBy: 'ترتيب حسب',
    sortNewest: 'الأحدث وصولاً',
    sortPriceLowHigh: 'السعر: من الأقل إلى الأعلى',
    sortPriceHighLow: 'السعر: من الأعلى إلى الأقل',
    showingProducts: 'عرض {count} منتج',
    noProductsFound: 'لم نجد منتجات تطابق خيارات البحث.',
    clearFilters: 'مسح التصفية',
    onSaleOnly: 'التخفيضات فقط',
    inStockOnly: 'المتوفر فقط',

    selectSize: 'اختر المقاس',
    selectColor: 'اختر اللون',
    quantity: 'الكمية',
    inStock: 'متوفر في المخزن',
    outOfStock: 'غير متوفر حالياً',
    onlyLeftInStock: 'متبقي {count} قطع فقط!',
    sku: 'رمز المنتج SKU',
    category: 'القسم',
    buyNow: 'شراء الآن',
    orderByWhatsapp: 'طلب عبر الواتساب',
    description: 'تفاصيل المنتج',
    shippingReturns: 'الشحن والتوصيل',
    shippingPolicy: 'يتم الشحن من قدسيا، دمشق. سيتم الاتفاق معك على أجور التوصيل بعد تأكيد الطلب.',
    relatedProducts: 'منتجات قد تعجبك أيضاً',

    cartTitle: 'حقيبة التسوق',
    cartEmpty: 'حقيبة التسوق فارغة حالياً.',
    continueShopping: 'متابعة التسوق',
    subtotal: 'مجموع المنتجات الفرعي',
    deliveryFee: 'التوصيل',
    deliveryToAgree: 'سيتم الاتفاق معك على أجور التوصيل بعد تأكيد الطلب',
    discount: 'الخصم',
    total: 'إجمالي المنتجات',
    couponCode: 'كود الخصم',
    applyCoupon: 'تطبيق',
    couponApplied: 'تم تطبيق كود الخصم بنجاح!',
    invalidCoupon: 'كود الخصم غير صالح أو منتهي',
    checkout: 'المتابعة لإتمام الطلب',
    checkoutTitle: 'إتمام الطلب',

    fullName: 'الاسم الكامل',
    phoneNumber: 'رقم الهاتف',
    whatsappNumber: 'رقم الواتساب',
    governorate: 'المحافظة',
    cityArea: 'المدينة / المنطقة',
    detailedAddress: 'العنوان التفصيلي',
    orderNotes: 'ملاحظات إضافية (اختياري)',
    paymentMethod: 'طريقة الدفع',
    cashOnDelivery: 'الدفع نقداً عند الاستلام (COD)',
    whatsappOrderPayment: 'إرسال وتأكيد الطلب عبر الواتساب',
    placeOrder: 'تأكيد وإرسال الطلب',
    submittingOrder: 'جاري إرسال الطلب...',

    orderConfirmed: 'تم تسجيل طلبك بنجاح!',
    orderNumber: 'رقم الطلب',
    thankYouMessage: 'شكراً لتسوقك من بلاك آيلاند. سيتم الاتفاق معك على أجور التوصيل عبر الواتساب أو الهاتف عند تأكيد الطلب.',
    sendWhatsappConfirmation: 'إرسال تفاصيل الطلب عبر الواتساب الآن',
    orderDetails: 'تفاصيل الطلب',

    govDamascus: 'دمشق',
    govRuralDamascus: 'ريف دمشق / قدسيا',
    govAleppo: 'حلب',
    govHoms: 'حمص',
    govHama: 'حماه',
    govLattakia: 'اللاذقية',
    govTartous: 'طرتوس',
    govDeraa: 'درعا',
    govSweida: 'السويداء',
    govHasakah: 'الحسكة',
    govDeirEzZor: 'دير الزور',
    govRaqqa: 'الرقة',
    govIdlib: 'إدلب',

    wishlistTitle: 'قائمة المحفوظات والمفضلة',
    wishlistEmpty: 'لم تقم بحفظ أي منتجات في المفضلة بعد.',

    adminDashboard: 'لوحة التحكم العامة',
    adminProducts: 'إدارة المنتجات',
    adminCategories: 'إدارة الأقسام',
    adminOrders: 'طلبات الزبائن',
    adminInventory: 'المخزون والكميات',
    adminCoupons: 'كوبونات الخصم',
    adminBanners: 'بنرات الواجهة',
    adminShowcases3D: 'المحرك الثلاثي الأبعاد 3D',
    adminSettings: 'إعدادات المتجر',
    adminLogout: 'تسجيل الخروج',
    totalSales: 'إجمالي المبيعات',
    totalOrders: 'عدد الطلبات',
    revenue: 'الأرباح الصافية',
    pendingOrders: 'طلبات قيد الانتظار',
    completedOrders: 'طلبات مكتملة',
    lowStockAlerts: 'تنبيهات نقص المخزون',
    recentOrders: 'أحدث طلبات الزبائن',
    addProduct: '+ إضافة منتج جديد',
    editProduct: 'تعديل المنتج',
    deleteProduct: 'حذف المنتج',
    uploadImages: 'رفع صور المنتج (تُحفظ في /uploads)',
    saveChanges: 'حفظ التغييرات',
    orderStatus: 'حالة الطلب',
  },
};
