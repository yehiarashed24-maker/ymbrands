export type ProductCategory = 
  | 'Sportswear'
  | 'Sport Shoes'
  | 'Sneakers'
  | 'Accessories'
  | 'Football'
  | 'Basketball'
  | 'Running'
  | 'Training'
  | 'Men'
  | 'Women'
  | 'Streetwear';

export interface ProductHotspot {
  id: string;
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  title: {
    en: string;
    ar: string;
  };
  description: {
    en: string;
    ar: string;
  };
}

export interface Product {
  id: number;
  slug: string;
  brand: string;
  name: {
    en: string;
    ar: string;
  };
  category: ProductCategory;
  subCategory?: string;
  gender: 'Men' | 'Women' | 'Unisex' | 'Kids';
  price: number;
  originalPrice?: number;
  image: string; // main transparent or primary image
  images: string[];
  sizes: (number | string)[];
  colors: {
    name: {
      en: string;
      ar: string;
    };
    hex: string;
  }[];
  accent: string; // Hex color for hero/ambient glow
  description: {
    en: string;
    ar: string;
  };
  details: {
    en: string[];
    ar: string[];
  };
  isNew?: boolean;
  isBestSeller?: boolean;
  isFeatured?: boolean;
  isByOrder?: boolean;
  rating: number;
  reviewCount: number;
  hotspots?: ProductHotspot[];
  inStock: boolean;
}

export interface CartItem {
  product: Product;
  selectedSize: number | string;
  selectedColor?: string;
  quantity: number;
}

export interface Testimonial {
  id: string;
  author: {
    en: string;
    ar: string;
  };
  location: {
    en: string;
    ar: string;
  };
  quote: {
    en: string;
    ar: string;
  };
  rating: number;
  verified: boolean;
  productName: string;
  date: string;
}

export interface FilterState {
  category: string;
  brand: string[];
  gender: string[];
  sizes: (number | string)[];
  priceRange: [number, number];
  color: string[];
  sort: 'newest' | 'price-asc' | 'price-desc' | 'bestseller';
}
