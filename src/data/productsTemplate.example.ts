import { Product } from '../types/product';

/**
 * Example Template for Adding New Products to YM Site
 * 
 * You can copy this structure to add products directly in src/data/products.ts,
 * or add them seamlessly through the HQ Operations Center (Admin Dashboard) at /ym-hq-ops-909!
 */
export const exampleProductTemplate: Product = {
  id: 1,
  slug: 'example-sneaker-name',
  brand: 'NIKE', // NIKE, ADIDAS, PUMA, NEW BALANCE, etc.
  name: {
    en: 'Product Name in English',
    ar: 'اسم المنتج بالعربي',
  },
  category: 'Sneakers', // 'Sneakers' | 'Football' | 'Sportswear' | 'Accessories'
  subCategory: 'Streetwear & Lifestyle',
  gender: 'Unisex', // 'Men' | 'Women' | 'Unisex' | 'Kids'
  price: 5999,
  originalPrice: 6500,
  image: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=800&auto=format&fit=crop&q=80',
  images: [
    'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=800&auto=format&fit=crop&q=80',
  ],
  sizes: [40, 41, 42, 43, 44, 45],
  colors: [
    { name: { en: 'Black / White', ar: 'أسود / أبيض' }, hex: '#111111' },
  ],
  accent: '#111111',
  description: {
    en: '100% Authentic, brand new in original box.',
    ar: 'أصلي 100% جديد بالعلبة الأصلية.',
  },
  details: {
    en: [
      'Original materials with serial barcode verification',
      'Comfortable lightweight fit',
      'Secure delivery across Egypt',
    ],
    ar: [
      'خامات أصلية 100% مع الباركود وسيريال التحقق',
      'مقاس مريح وخفيف جداً',
      'توصيل سريع وآمن لجميع محافظات مصر',
    ],
  },
  isNew: true,
  isBestSeller: false,
  isFeatured: false,
  isByOrder: false, // Set to true if it requires 50% deposit and takes 30-35 days to import
  rating: 5.0,
  reviewCount: 1,
  inStock: true,
};
