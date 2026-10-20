import { Product } from '../types/product';

/**
 * YM BRANDS Official Sports & Streetwear Catalog
 * 
 * Curated authentic drops covering Basketball, Football, Running, Gym & Training,
 * Sneakers, Sportswear, and Essential Accessories.
 */
export const products: Product[] = [
  // ==========================================
  // BASKETBALL (كرة السلة / باسكيت)
  // ==========================================
  {
    id: 101,
    slug: 'air-jordan-4-retro-military-black',
    brand: 'JORDAN',
    name: {
      en: 'Air Jordan 4 Retro "Military Black"',
      ar: 'إير جوردان 4 ريترو "ميليتاري بلاك"',
    },
    category: 'Sneakers',
    sport: 'Lifestyle',
    subCategory: 'Basketball Heritage & Streetwear',
    gender: 'Unisex',
    price: 8900,
    originalPrice: 9600,
    image: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&auto=format&fit=crop&q=80',
    ],
    sizes: [40, 41, 42, 43, 44, 45, 46],
    colors: [
      { name: { en: 'White / Black / Neutral Grey', ar: 'أبيض / أسود / رمادي' }, hex: '#111111' },
    ],
    accent: '#111111',
    description: {
      en: 'The definitive hardwood and street icon. Features premium white leather with neutral grey suede overlays and contrasting black eyelets and heel tab with visible Air-Sole unit.',
      ar: 'أيقونة ملاعب كرة السلة والستريت وير الأبرز عالمياً. جلد طبيعي فاخر بدرجات الأبيض والرمادي ولمسات سوداء فخمة مع وحدة Air-Sole الماصة للصدمات.',
    },
    details: {
      en: [
        '100% Verified Authentic with OG box & verified barcode',
        'Visible Air-Sole unit in the heel for responsive impact absorption',
        'Herringbone traction pattern engineered for hardwood court grip',
      ],
      ar: [
        'أصلي 100% بالعلبة الأصلية مع كود التحقق والباركود',
        'وحدة Air-Sole ظاهرة بالكعب لامتصاص الصدمات وحماية المفاصل',
        'نعل خارجي بنمط متعرج مصمم لأعلى ثبات على أرضيات الملاعب والأسفلت',
      ],
    },
    isNew: true,
    isBestSeller: true,
    isFeatured: true,
    isByOrder: false,
    rating: 5.0,
    reviewCount: 38,
    inStock: true,
  },
  {
    id: 102,
    slug: 'nike-kobe-8-protro-halo-court',
    brand: 'NIKE',
    name: {
      en: 'Nike Kobe 8 Protro "Halo" Performance',
      ar: 'نايكي كوبه 8 بروترو "هالو" للمحترفين',
    },
    category: 'Sport Shoes',
    sport: 'Basketball',
    subCategory: 'Pro Basketball Shoes',
    gender: 'Men',
    price: 9400,
    originalPrice: 10200,
    image: 'https://images.unsplash.com/photo-1579338559194-a162d19bf842?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1579338559194-a162d19bf842?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&auto=format&fit=crop&q=80',
    ],
    sizes: [41, 42, 43, 44, 45],
    colors: [
      { name: { en: 'Triple White', ar: 'أبيض ناصع بالكامل' }, hex: '#f8fafc' },
    ],
    accent: '#ffffff',
    description: {
      en: 'Engineered for the Mamba Mentality. Ultra-low profile, engineered mesh upper with responsive Nike React foam drop-in midsole for lightning-fast court cuts and lockdown.',
      ar: 'حذاء أسطورة كرة السلة كوبه براينت. مصمم للسرعة الفائقة مع شبكة مسامية خفيفة ونعل أوسط بتقنية Nike React لسرعة الانطلاق والمناورة بدقة.',
    },
    details: {
      en: [
        'Engineered mesh upper conforms tightly to your foot for low-weight comfort',
        'Drop-in Nike React foam replaces Lunarlon for prolonged responsiveness',
        'Diamond-pattern diamond traction engineered for rapid directional shifts',
      ],
      ar: [
        'خامة شبكية مرنة ومسامية تحتضن القدم بأخف وزن ممكن للمناورات',
        'نعل داخلي بتقنية Nike React المبتكرة لاستجابة ارتدادية فائقة',
        'نقشة سفلية متطورة لتغيير الاتجاه والفرملة الفورية على الباركيه',
      ],
    },
    isNew: true,
    isBestSeller: true,
    isFeatured: true,
    isByOrder: false,
    rating: 4.9,
    reviewCount: 24,
    inStock: true,
  },
  {
    id: 103,
    slug: 'wilson-evolution-indoor-game-basketball',
    brand: 'WILSON',
    name: {
      en: 'Wilson Evolution Official Game Basketball Size 7',
      ar: 'كرة سلة ويلسون إيفولوشن الرسمية مقاس 7',
    },
    category: 'Accessories',
    sport: 'Basketball',
    subCategory: 'Official Game Balls',
    gender: 'Unisex',
    price: 2850,
    originalPrice: 3200,
    image: 'https://images.unsplash.com/photo-1519766304817-4f37bda74a29?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1519766304817-4f37bda74a29?w=800&auto=format&fit=crop&q=80',
    ],
    sizes: ['Size 7 (Official)'],
    colors: [
      { name: { en: 'Signature Amber / Black', ar: 'برتقالي كلاسيكي / أسود' }, hex: '#d97706' },
    ],
    accent: '#d97706',
    description: {
      en: 'The #1 indoor game basketball in the world. Microfiber composite cover offers unrivaled grip and moisture control with laid-in composite channels.',
      ar: 'الكرة الرسمية رقم 1 عالمياً لبطولات كرة السلة. ملمس ميكروفايبر مبطن لقبضة يد استثنائية وقنوات مدمجة تمنع الانزلاق وتمنحك تحكماً لا يضاهى.',
    },
    details: {
      en: [
        'Evo Microfiber Composite Cover with advanced moisture absorption',
        'Laid-in composite channels create a 100% composite surface',
        'Cushion Core Carcass for softer feel and consistent true bounce',
      ],
      ar: [
        'جلد مركب ميكروفايبر Evo مع خاصية طرد العرق للتحكم التام بالكرة',
        'قنوات مركبة عميقة ومدمجة لتوزيع قبضة الأصابع والرميات الثلاثية بدقة',
        'قلب داخلي مبطن Cushion Core لارتداد متزن ودوران مثالي بالهواء',
      ],
    },
    isNew: false,
    isBestSeller: true,
    isFeatured: false,
    isByOrder: false,
    rating: 5.0,
    reviewCount: 19,
    inStock: true,
  },
  {
    id: 104,
    slug: 'jordan-dri-fit-sport-statement-jersey',
    brand: 'JORDAN',
    name: {
      en: 'Jordan Dri-FIT Sport Statement Basketball Jersey',
      ar: 'تيشرت باسكيت جوردان دراي فيت الرسمي',
    },
    category: 'Sportswear',
    sport: 'Basketball',
    subCategory: 'Basketball Apparel & Kits',
    gender: 'Men',
    price: 2450,
    originalPrice: 2800,
    image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&auto=format&fit=crop&q=80',
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: { en: 'Gym Red / Black', ar: 'أحمر رياضي / أسود' }, hex: '#dc2626' },
    ],
    accent: '#dc2626',
    description: {
      en: 'Lightweight, breathable open-hole mesh powered by sweat-wicking Nike Dri-FIT technology. Emblazoned with Jumpman heritage graphics.',
      ar: 'تيشرت كرة سلة احترافي بخامة مش مسامية طاردة للعرق بتقنية Nike Dri-FIT ولمسات وشعار Jumpman الشهير لأناقة الملاعب والشارع.',
    },
    details: {
      en: [
        'Dri-FIT technology moves sweat away from your skin for quicker evaporation',
        'Breathable mesh fabric is lightweight and airy',
        'Standard relaxed fit for a comfortable, court-ready feel',
      ],
      ar: [
        'تقنية Dri-FIT تعمل على سحب العرق للخارج لسرعة التبخر والجفاف',
        'نسيج شبكي خفيف للغاية ومريح خلال التمارين والمباريات الحماسية',
        'قصة رياضية حرة تمنحك سهولة حركة الأكتاف أثناء التسديد',
      ],
    },
    isNew: true,
    isBestSeller: false,
    isFeatured: false,
    isByOrder: false,
    rating: 4.8,
    reviewCount: 11,
    inStock: true,
  },

  // ==========================================
  // FOOTBALL (كرة القدم / كورة)
  // ==========================================
  {
    id: 105,
    slug: 'nike-zoom-mercurial-superfly-9-elite-fg',
    brand: 'NIKE',
    name: {
      en: 'Nike Zoom Mercurial Superfly 9 Elite FG',
      ar: 'حذاء كرة قدم نايكي زووم ميركوريال سوبرفلاي 9 إيليت',
    },
    category: 'Sport Shoes',
    sport: 'Football',
    subCategory: 'Pro Football Boots',
    gender: 'Men',
    price: 7950,
    originalPrice: 8800,
    image: 'https://images.unsplash.com/photo-1511886929837-354d827aae26?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1511886929837-354d827aae26?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80',
    ],
    sizes: [40, 41, 42, 43, 44, 45],
    colors: [
      { name: { en: 'Metallic Silver / Volt Yellow', ar: 'فضي ميتاليك / أصفر نيون' }, hex: '#ccff00' },
    ],
    accent: '#ccff00',
    description: {
      en: 'Equipped with a 3/4 football-specific Zoom Air unit and grippy Vaporposite+ upper for exceptional ball touch and sprint speed when it matters most on firm ground pitches.',
      ar: 'بوت نجيلة طبيعية احترافي مزود بوحدة Zoom Air المخصصة لكرة القدم وخامة Vaporposite+ للتحكم الدقيق بالكرة وأقصى سرعة انطلاق في المباريات الكبرى.',
    },
    details: {
      en: [
        'Football-specific 3/4 Zoom Air unit in the plate gives an extra springy underfoot feel',
        'Vaporposite+ upper combines a grippy, grid mesh with a premium lining for optimal ball control at high speeds',
        'Tri-star studs provide multidirectional traction with every step',
      ],
      ar: [
        'وحدة Zoom Air سفلية بطول 3/4 مدمجة بالنعل تمنحك دفعة ارتدادية صاروخية بالركض',
        'طبقة Vaporposite+ الشبكية تمنحك احتكاكاً وتحكماً ناعماً بالكرة بسرعات عالية',
        'بروزات Tri-star ثلاثية الأضلاع تضمن ثباتاً خارقاً أثناء المراوغة وتغيير المسار',
      ],
    },
    isNew: true,
    isBestSeller: true,
    isFeatured: true,
    isByOrder: false,
    rating: 5.0,
    reviewCount: 42,
    inStock: true,
  },
  {
    id: 106,
    slug: 'adidas-predator-elite-fold-over-tongue-fg',
    brand: 'ADIDAS',
    name: {
      en: 'Adidas Predator Elite Fold-Over Tongue FG',
      ar: 'أديداس بريداتور إيليت باللسان الكلاسيكي المطوي',
    },
    category: 'Sport Shoes',
    sport: 'Football',
    subCategory: 'Pro Football Boots',
    gender: 'Men',
    price: 8400,
    originalPrice: 9100,
    image: 'https://images.unsplash.com/photo-1579338559194-a162d19bf842?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1579338559194-a162d19bf842?w=800&auto=format&fit=crop&q=80',
    ],
    sizes: [40, 41, 42, 43, 44, 45],
    colors: [
      { name: { en: 'Core Black / Lucid Red / Solar Yellow', ar: 'أسود كلاسيكي / أحمر لوسيد / أصفر' }, hex: '#ef4444' },
    ],
    accent: '#ef4444',
    description: {
      en: 'The legend returns. Featuring the iconic fold-over tongue with strap, HybridTouch 2.0 synthetic suede upper, and strategically placed rubber Strikeskin fins for pinpoint curl and precision.',
      ar: 'عودة أسطورة التسديدات الدقيقة بلسانها الكلاسيكي المطوي. مزودة بنعل HybridTouch 2.0 وخيوط وزعانف Strikeskin المطاطية لإنحناء الكرة وتسديدات قاتلة في الشباك.',
    },
    details: {
      en: [
        'Iconic fold-over tongue with elastic strap locks over the laces for clean strike zone',
        'Rubber Strikeskin elements strategically placed in strike zones for extreme spin control',
        'Controlframe 2.0 lightweight outsole engineered for firm ground explosive propulsion',
      ],
      ar: [
        'لسان مطوي كلاسيكي بحزام مرن يغطي الأربطة لمنطقة تسديد ناعمة وخالية من العوائق',
        'زعانف Strikeskin مطاطية بارزة تمنح تسديدتك دوران وقوة لولبية لا تصد',
        'نعل Controlframe 2.0 خفيف الوزن يوزع الثقل لدعم الانطلاق والانعطاف الحاد',
      ],
    },
    isNew: true,
    isBestSeller: true,
    isFeatured: true,
    isByOrder: false,
    rating: 4.9,
    reviewCount: 29,
    inStock: true,
  },
  {
    id: 107,
    slug: 'egypt-national-team-puma-authentic-jersey-2024',
    brand: 'PUMA',
    name: {
      en: 'Official Egypt National Team Home Jersey 2024/25',
      ar: 'تيشرت منتخب مصر الرسمي الأصلي 2024/2025 بوما',
    },
    category: 'Sportswear',
    sport: 'Football',
    subCategory: 'National Team Kits',
    gender: 'Unisex',
    price: 2650,
    originalPrice: 2950,
    image: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800&auto=format&fit=crop&q=80',
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: { en: 'Pharaohs Red / White / Black', ar: 'أحمر الفراعنة / أبيض / أسود' }, hex: '#b91c1c' },
    ],
    accent: '#b91c1c',
    description: {
      en: 'The official home kit of the Egyptian Pharaohs. Crafted with Puma ULTRAWEAVE ultra-lightweight performance fabric and authentic 7-stars Egyptian Football Association crest.',
      ar: 'التيشرت الرسمي لمنتخب الفراعنة الأول. نسيج التراويف ULTRAWEAVE فائق الخفة بتقنية dryCELL لطرد الرطوبة، مع شعار الاتحاد المصري المزين بالسبع نجوم الإفريقية.',
    },
    details: {
      en: [
        'ULTRAWEAVE ultra-light, 4-way stretch fabric engineered for weight reduction and frictionless movement',
        'dryCELL performance technology designed to wick moisture from the body',
        'Authentic 7-Stars EFA silicone crest on chest',
      ],
      ar: [
        'خامة ULTRAWEAVE خفيفة الوزن مرنة بأربعة اتجاهات لحرية حركة كاملة',
        'تقنية dryCELL لسحب الرطوبة والحفاظ على برودة الجسم طوال 90 دقيقة',
        'شعار الاتحاد المصري لكرة القدم بارز مع الـ 7 نجوم الرسمية على الصدر',
      ],
    },
    isNew: true,
    isBestSeller: true,
    isFeatured: true,
    isByOrder: false,
    rating: 5.0,
    reviewCount: 35,
    inStock: true,
  },
  {
    id: 108,
    slug: 'nike-flight-official-fifa-match-ball',
    brand: 'NIKE',
    name: {
      en: 'Nike Flight Official FIFA Quality Pro Match Ball',
      ar: 'كرة نايكي فلايت الرسمية المعتمدة من الفيفا',
    },
    category: 'Accessories',
    sport: 'Football',
    subCategory: 'Official Match Balls',
    gender: 'Unisex',
    price: 3400,
    originalPrice: 3800,
    image: 'https://images.unsplash.com/photo-1614632537423-1e6c2e7e0aab?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1614632537423-1e6c2e7e0aab?w=800&auto=format&fit=crop&q=80',
    ],
    sizes: ['Size 5 (Official Match)'],
    colors: [
      { name: { en: 'White / Hyper Crimson / Black', ar: 'أبيض / برتقالي كريمسون / أسود' }, hex: '#f97316' },
    ],
    accent: '#f97316',
    description: {
      en: 'Honed over 8 years and 1,700 hours of testing, the Nike Flight Ball is a revolution in consistent flight. Aerowsculpt technology uses molded grooves to disrupt airflow for 30% truer flight.',
      ar: 'ثورة الهندسة الهوائية بعد 8 سنوات من الاختبارات المعملية. قنوات Aerowsculpt المحفورة تعزز استقرار الكرة بالهواء بنسبة 30% وتمنحك دقة متناهية في التمرير والتسديد.',
    },
    details: {
      en: [
        'Nike Aerowsculpt technology uses molded grooves to disrupt airflow across the ball for more stable flight',
        '3D-printed ink overlay fine-tunes ball flight for exact targeting shot after shot',
        'All Conditions Control (ACC) technology adds a grippy texture in wet or dry conditions',
      ],
      ar: [
        'أخاديد Aerowsculpt المقولبة تمنع تذبذب الكرة وتضمن مساراً مستقيماً ثابتاً في الجو',
        'طباعة حبرية ثلاثية الأبعاد 3D على الغلاف الخارجي لثبات استلام وتمرير الكرة',
        'تقنية All Conditions Control (ACC) للتحكم بالكرة في الأجواء الممطرة والجافة',
      ],
    },
    isNew: false,
    isBestSeller: true,
    isFeatured: false,
    isByOrder: false,
    rating: 5.0,
    reviewCount: 16,
    inStock: true,
  },

  // ==========================================
  // RUNNING (الجري والماراثون)
  // ==========================================
  {
    id: 109,
    slug: 'nike-vaporfly-3-road-racing-shoes',
    brand: 'NIKE',
    name: {
      en: 'Nike Vaporfly 3 Carbon Road Racing Shoes',
      ar: 'نايكي فابورفلاي 3 لسباقات الجري والماراثون بكربون',
    },
    category: 'Sport Shoes',
    sport: 'Running',
    subCategory: 'Marathon & Speed Shoes',
    gender: 'Unisex',
    price: 8200,
    originalPrice: 9000,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?w=800&auto=format&fit=crop&q=80',
    ],
    sizes: [40, 41, 42, 43, 44, 45],
    colors: [
      { name: { en: 'Bright Crimson / Volt / Black', ar: 'قرمزي مشرق / فولت نيون / أسود' }, hex: '#ef4444' },
    ],
    accent: '#ef4444',
    description: {
      en: 'Catch ‘em if you can. Built for the chasers, the racers and the elevated pacers, the Nike Vaporfly 3 gives you race-day speed with a full-length carbon fiber Flyplate and ZoomX foam.',
      ar: 'كوتشي سباقات الماراثون والجري الأسرع في العالم. مزود بشريحة كربون Flyplate كاملة ونعل فوم ZoomX فائق الارتداد لتكسير أرقامك القياسية في الجري بأقل مجهود.',
    },
    details: {
      en: [
        'Full-length carbon fiber Flyplate provides a stiff and propulsive feel',
        'Nike ZoomX foam is the most resilient and responsive foam Nike makes',
        'Specifically selected Flyknit yarns and engineered zones bring a lightweight containment upper',
      ],
      ar: [
        'شريحة كربون فايبر Flyplate تمتد بطول الحذاء لمنحك قوة دفع أمامية مستمرة',
        'فوم Nike ZoomX فائق الخفة يوفر أعلى معدل استرداد طاقة ومقاومة للإجهاد',
        'خيوط Flyknit مسامية مصممة هندسياً لاحتواء القدم وتهويتها في درجات الحرارة العالية',
      ],
    },
    isNew: true,
    isBestSeller: true,
    isFeatured: true,
    isByOrder: false,
    rating: 5.0,
    reviewCount: 22,
    inStock: true,
  },
  {
    id: 110,
    slug: 'adidas-ultraboost-light-performance',
    brand: 'ADIDAS',
    name: {
      en: 'Adidas Ultraboost Light Running Shoes',
      ar: 'أديداس ألترا بوست لايت للجري اليومي والتمارين',
    },
    category: 'Sport Shoes',
    sport: 'Running',
    subCategory: 'Daily Road Running Shoes',
    gender: 'Unisex',
    price: 6700,
    originalPrice: 7400,
    image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&auto=format&fit=crop&q=80',
    ],
    sizes: [39, 40, 41, 42, 43, 44, 45],
    colors: [
      { name: { en: 'Cloud White / Core Black', ar: 'أبيض كلاود / أسود' }, hex: '#0f172a' },
    ],
    accent: '#38bdf8',
    description: {
      en: 'Experience epic energy return with the lightest Ultraboost ever made. Featuring Light BOOST material that is 30% lighter and Primeknit+ FORGED textile upper for a sock-like fit.',
      ar: 'قمة الراحة وامتصاص الصدمات للجري والمشي الطويل اليومي. مادة Light BOOST الأخف بنسبة 30% ونسيج Primeknit المرن الذي يحتضن القدم كالجورب ويخفف الضغط على الظهر والركب.',
    },
    details: {
      en: [
        'Light BOOST midsole is 30% lighter than standard BOOST foam with maximized bounce',
        'Primeknit+ FORGED textile upper provides targeted adaptive support',
        'Continental Better Rubber outsole provides superior grip on wet and dry surfaces',
      ],
      ar: [
        'نعل أوسط Light BOOST الأخف وزناً مع ارتداد ديناميكي يقلل إجهاد المفاصل',
        'وجه علوي نسيجي من Primeknit يحتضن القدم بنعومة مع تهوية مستمرة',
        'نعل سفلي من مطاط كونتيننتال Continental الألماني للثبات على كافة الأرضيات',
      ],
    },
    isNew: false,
    isBestSeller: true,
    isFeatured: false,
    isByOrder: false,
    rating: 4.9,
    reviewCount: 31,
    inStock: true,
  },

  // ==========================================
  // TRAINING & SPORTSWEAR (تمارين وجيم وترنجات)
  // ==========================================
  {
    id: 111,
    slug: 'nike-tech-fleece-windrunner-tracksuit',
    brand: 'NIKE',
    name: {
      en: 'Nike Tech Fleece Full-Zip Windrunner & Joggers Set',
      ar: 'طقم نايكي تك فليس كامل الأصلي (سويت شيرت وبنطلون)',
    },
    category: 'Sportswear',
    sport: 'Training',
    subCategory: 'Tracksuits & Outerwear',
    gender: 'Men',
    price: 6200,
    originalPrice: 6900,
    image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&auto=format&fit=crop&q=80',
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: { en: 'Dark Heather Grey / Black', ar: 'رمادي ميلانج / أسود' }, hex: '#64748b' },
      { name: { en: 'Triple Black', ar: 'أسود كامل' }, hex: '#111111' },
    ],
    accent: '#111111',
    description: {
      en: 'The definitive luxury athletic fleece. Smooth on both sides, this premium Tech Fleece feels warmer and softer than ever, while maintaining the iconic chevron styling and taped utility pockets.',
      ar: 'أشهر ترنج رياضي وستريت وير في العالم. خامة تك فليس فاخرة ناعمة من الجانبين توفر الدفء والأناقة بخفة وزن استثنائية مع سحابات حرارية مخفية وجيوب مصفحة.',
    },
    details: {
      en: [
        'Premium lightweight thermal Tech Fleece fabric with smooth finish inside and out',
        'Signature transparent taped chest pocket and bonded zip utility storage',
        'Tapered joggers with ribbed cuffs designed to show off your kicks',
      ],
      ar: [
        'خامة تك فليس حرارية فائقة الخفة بدون أي وزن زائد أو تكتل',
        'جيب صدري مصفح بشريط لاصق حراري وسحابات متينة لحفظ الهاتف والمحفظة',
        'بنطلون بقصة رياضية انسيابية مريحة وأساور مطاطية تبرز جمال الكوتشي',
      ],
    },
    isNew: true,
    isBestSeller: true,
    isFeatured: true,
    isByOrder: false,
    rating: 5.0,
    reviewCount: 47,
    inStock: true,
  },
  {
    id: 112,
    slug: 'under-armour-heatgear-compression-long-sleeve',
    brand: 'UNDER ARMOUR',
    name: {
      en: 'Under Armour HeatGear Pro Compression Long-Sleeve',
      ar: 'تيشرت أندر آرمور كومبرشن ضاغط طويل للجيم والتمارين',
    },
    category: 'Sportswear',
    sport: 'Training',
    subCategory: 'Gym & Compression Apparel',
    gender: 'Men',
    price: 1950,
    originalPrice: 2200,
    image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=80',
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: { en: 'Stealth Black', ar: 'أسود مطفي' }, hex: '#1e293b' },
    ],
    accent: '#1e293b',
    description: {
      en: 'Super-light HeatGear fabric delivers superior coverage without weighing you down. Strategic mesh underarm and back panels for ventilation and 4-way stretch construction.',
      ar: 'تيشرت ضاغط احترافي بتقنية HeatGear لدعم عضلات الصدر والذراعين خلال رفع الأثقال والتمارين العنيفة. شبكات تهوية تحت الإبط وخامة مرنة تطرد العرق فوراً.',
    },
    details: {
      en: [
        'Ultra-tight, second-skin compression fit increases muscle power and reduces recovery time',
        'Strategic mesh underarm and back panels for targeted cooling',
        'Anti-odor technology prevents the growth of odor-causing microbes',
      ],
      ar: [
        'قصة ضاغطة ومريحة تدعم تدفق الدورة الدموية وتقلل الشد العضلي',
        'فتحات تهوية شبكية استراتيجية لتبديد الحرارة بسرعة أثناء الجهد العالي',
        'معالجة متقدمة مضادة لتكون البكتيريا والروائح الناتجة عن التعرق',
      ],
    },
    isNew: false,
    isBestSeller: true,
    isFeatured: false,
    isByOrder: false,
    rating: 4.8,
    reviewCount: 18,
    inStock: true,
  },

  // ==========================================
  // SNEAKERS & STREETWEAR (سنيكرز)
  // ==========================================
  {
    id: 113,
    slug: 'nike-dunk-low-retro-panda',
    brand: 'NIKE',
    name: {
      en: 'Nike Dunk Low Retro "Panda"',
      ar: 'نايكي دانك لو ريترو "باندا" أسود وأبيض',
    },
    category: 'Sneakers',
    sport: 'Lifestyle',
    subCategory: 'Classic Low Sneakers',
    gender: 'Unisex',
    price: 5400,
    originalPrice: 6000,
    image: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&auto=format&fit=crop&q=80',
    ],
    sizes: [38, 39, 40, 41, 42, 43, 44, 45],
    colors: [
      { name: { en: 'White / Black', ar: 'أبيض / أسود' }, hex: '#111111' },
    ],
    accent: '#111111',
    description: {
      en: 'The most popular sneaker colorway in modern streetwear. Crisp leather upper with iconic black overlays, padded collar, and durable rubber cupsole.',
      ar: 'أشهر كولور واي سنيكرز في العالم حالياً. جلد ناعم أنيق باللونين الأبيض والأسود مع بطانة كاحل مريحة ونعل كب ستيش متين يناسب كل إطلالاتك اليومية.',
    },
    details: {
      en: [
        '100% Genuine leather upper with vintage color-blocking',
        'Foam midsole offers lightweight, responsive cushioning',
        'Padded, low-cut collar looks sleek and feels comfortable',
      ],
      ar: [
        'جلد طبيعي 100% مع الباركود وسيريال التحقق الأصلي بالكرتونة',
        'نعل فوم داخلي يمنحك راحة مشي طوال اليوم بدون إجهاد',
        'ياقة منخفضة مبطنة تعطي ستايلاً عصرياً مع البناطيل والجينز والشورت',
      ],
    },
    isNew: false,
    isBestSeller: true,
    isFeatured: true,
    isByOrder: false,
    rating: 5.0,
    reviewCount: 52,
    inStock: true,
  },
  {
    id: 114,
    slug: 'adidas-samba-og-cloud-white-core-black',
    brand: 'ADIDAS',
    name: {
      en: 'Adidas Samba OG "Cloud White / Core Black"',
      ar: 'أديداس سامبا أو جي الأصلي أبيض بشامواه',
    },
    category: 'Sneakers',
    sport: 'Lifestyle',
    subCategory: 'Heritage Casual Sneakers',
    gender: 'Unisex',
    price: 4900,
    originalPrice: 5500,
    image: 'https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?w=800&auto=format&fit=crop&q=80',
    ],
    sizes: [38, 39, 40, 41, 42, 43, 44, 45],
    colors: [
      { name: { en: 'Cloud White / Core Black / Gum', ar: 'أبيض / خطوط سوداء / نعل عسلي' }, hex: '#b45309' },
    ],
    accent: '#b45309',
    description: {
      en: 'Born on the pitch, timeless in the street. Featuring the classic T-toe suede overlay, full-grain leather, and gum rubber outsole that defined football training culture.',
      ar: 'ولد على ملاعب كرة القدم ليصبح أيقونة شوارع الموضة العالمية. جلد طبيعي فاخر مع مقدمة شمواه T-toe الشهيرة ونعل جام عسلي كلاسيكي مقاوم للتآكل.',
    },
    details: {
      en: [
        'Full grain leather upper with gritty suede details and gold foil branding',
        'Synthetic leather lining for long-wearing comfort',
        'Gum rubber midsole and outsole for retro traction and aesthetic',
      ],
      ar: [
        'جلد طبيعي بالكامل مع لمسات الشامواه الفاخرة وشعار سامبا الذهبي اللامع',
        'بطانة داخلية ناعمة مقاومة للرطوبة وتمنع الاحتكاك',
        'نعل خارجي عسلي Gum مطاطي ذو ثبات عالي ومظهر كلاسيكي فخم',
      ],
    },
    isNew: false,
    isBestSeller: true,
    isFeatured: true,
    isByOrder: false,
    rating: 4.9,
    reviewCount: 46,
    inStock: true,
  },

  // ==========================================
  // ACCESSORIES (إكسسوارات ومعدات)
  // ==========================================
  {
    id: 115,
    slug: 'nike-brasilia-9-5-training-duffel-bag-60l',
    brand: 'NIKE',
    name: {
      en: 'Nike Brasilia 9.5 Training Gym Duffel Bag (60L)',
      ar: 'شنطة جيم وتدريب نايكي برازيليا 9.5 سعة 60 لتر',
    },
    category: 'Accessories',
    sport: 'Training',
    subCategory: 'Bags & Duffels',
    gender: 'Unisex',
    price: 2200,
    originalPrice: 2600,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80',
    ],
    sizes: ['60 Liters (Medium)'],
    colors: [
      { name: { en: 'Midnight Black / White Swoosh', ar: 'أسود ليلي / شعار نايكي أبيض' }, hex: '#0f172a' },
    ],
    accent: '#0f172a',
    description: {
      en: 'Keep all your training gear close at hand. The spacious main compartment zips shut, while separate shoe storage keeps dirty footwear away from fresh clothing.',
      ar: 'شنطة تدريب وسفر متينة تتسع لكافة معداتك الرياضية. مزودة بمقصورة سفلية مخصصة لفصل الأحذية والملابس المستعملة عن الملابس النظيفة، ومقاومة للماء.',
    },
    details: {
      en: [
        'Coated bottom panel shields your gear from bumps, scrapes and wet locker room floors',
        'Zippered shoe compartment stores footwear or sweaty clothes separately',
        'Padded, adjustable shoulder strap and dual handles offer versatile carrying options',
      ],
      ar: [
        'قاعدة سفلية معالجة عازلة للماء والأوساخ لحماية معداتك بأرضيات الجيم',
        'جيب جانبي بسحاب مع فتحة تهوية مخصص للأحذية الرياضية',
        'حزام كتف مبطن قابل للتعديل ومقابض يد قوية لسهولة الحمل والتنقل',
      ],
    },
    isNew: false,
    isBestSeller: true,
    isFeatured: false,
    isByOrder: false,
    rating: 4.9,
    reviewCount: 28,
    inStock: true,
  },
];
