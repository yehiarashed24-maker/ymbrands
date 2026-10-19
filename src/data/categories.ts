import sportswearMenImg from '../assets/categories/sportswear_men_nike.jpg';
import sportswearWomenImg from '../assets/categories/sportswear_women_adidas.jpg';
import sportswearKidsImg from '../assets/categories/sportswear_kids_puma.jpg';
import sportswearMainImg from '../assets/categories/sportswear_main.jpg';

export interface CategoryItem {
  id: string;
  name: {
    en: string;
    ar: string;
  };
  description: {
    en: string;
    ar: string;
  };
  image: string;
  tag: string;
  featured?: boolean;
}

export const categories: CategoryItem[] = [
  {
    id: 'Football',
    name: {
      en: 'FOOTBALL',
      ar: 'كرة القدم',
    },
    description: {
      en: 'Pro boots (Mercurial, Predator), authentic club & national team jerseys, and match balls.',
      ar: 'أحذية الملاعب المحترفة (ميركوريال، بريداتور)، تيشرتات الأندية والمنتخبات الأصلية، وكور المباريات الرسمية.',
    },
    image: 'https://images.unsplash.com/photo-1511886929837-354d827aae26?w=800&auto=format&fit=crop&q=80',
    tag: 'PITCH READY',
    featured: true,
  },
  {
    id: 'Basketball',
    name: {
      en: 'BASKETBALL',
      ar: 'كرة السلة (باسكيت)',
    },
    description: {
      en: 'Signature performance kicks (Jordan, Kobe, LeBron), official NBA jerseys, and game balls.',
      ar: 'أحذية باسكيت أصلية للمحترفين (جوردن، كوبه، ليبرون)، قمصان الـ NBA، وكور السلة المعتمدة.',
    },
    image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&auto=format&fit=crop&q=80',
    tag: 'HOOP CULTURE',
    featured: true,
  },
  {
    id: 'Running',
    name: {
      en: 'RUNNING',
      ar: 'الجري والماراثون',
    },
    description: {
      en: 'Elite carbon-plated road racers, marathon footwear, and sweat-wicking lightweight gear.',
      ar: 'أحذية سباقات الجري والماراثون بألواح الكربون، كوتشيات التبطين الفائق وملابس الجري الخفيفة.',
    },
    image: 'https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?w=800&auto=format&fit=crop&q=80',
    tag: 'SPEED & COMFORT',
    featured: true,
  },
  {
    id: 'Training',
    name: {
      en: 'TRAINING & GYM',
      ar: 'تمارين وجيم',
    },
    description: {
      en: 'High-performance Puma and Nike sweat-wicking fabrics engineered for gym, lifting, and crossfit.',
      ar: 'أطقم بوما ونايكي الرياضية، أقمشة طاردة للعرق وخامات مرنة مصممة للجيم والحديد والكروس فيت.',
    },
    image: sportswearKidsImg,
    tag: 'PUMA & NIKE',
    featured: true,
  },
  {
    id: 'Sneakers',
    name: {
      en: 'SNEAKERS',
      ar: 'أحذية رياضية وسنيكرز',
    },
    description: {
      en: 'Iconic silhouettes, limited drops, Samba, Dunks, and daily lifestyle classics.',
      ar: 'أيقونات السنيكرز العالمية، سامبا، دانك، والإصدارات الحصرية للاستخدام اليومي العصري.',
    },
    image: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=800&auto=format&fit=crop&q=80',
    tag: 'ORIGINAL ICONS',
    featured: true,
  },
  {
    id: 'Sportswear',
    name: {
      en: 'SPORTSWEAR',
      ar: 'ملابس رياضية وترنجات',
    },
    description: {
      en: 'Nike Tech Fleece, Adidas Originals 3-stripes tracksuits, hoodies, and jackets.',
      ar: 'ترنجات نايكي تك فليس، أطقم أديداس الأصلية، هوديز وجواكت رياضية فاخرة.',
    },
    image: sportswearMainImg,
    tag: 'TECH FLEECE & SUITS',
  },
  {
    id: 'Accessories',
    name: {
      en: 'ACCESSORIES',
      ar: 'إكسسوارات ومعدات',
    },
    description: {
      en: 'Water-resistant gym duffles, basketball & football gear, cushioned socks, and caps.',
      ar: 'شنط تدريب مقاومة للماء، معدات كورة وسلة، شرابات رياضية مبطنة، وكابات عالية الجودة.',
    },
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80',
    tag: 'ESSENTIAL GEAR',
  },
];
