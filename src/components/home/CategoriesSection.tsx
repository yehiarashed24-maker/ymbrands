import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, X, Sparkles } from 'lucide-react';
import { useLanguageStore } from '../../store/languageStore';

import sportswearMainImg from '../../assets/categories/sportswear_main.jpg';
import sportswearMenImg from '../../assets/categories/sportswear_men_nike.jpg';
import sportswearWomenImg from '../../assets/categories/sportswear_women_adidas.jpg';
import sportswearKidsImg from '../../assets/categories/sportswear_kids_puma.jpg';
import accessoriesMenImg from '../../assets/categories/accessories_men.jpg';
import accessoriesWomenImg from '../../assets/categories/accessories_women.jpg';
import accessoriesKidsImg from '../../assets/categories/accessories_kids.jpg';

interface CategoryCardItem {
  id: string;
  slug: string;
  name: { en: string; ar: string };
  tag: { en: string; ar: string };
  image: string;
}

export const CategoriesSection: React.FC = () => {
  const navigate = useNavigate();
  const { language, isRTL } = useLanguageStore();
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  const [selectedCategory, setSelectedCategory] = useState<CategoryCardItem | null>(null);

  // Prevent background scroll when category modal is open
  useEffect(() => {
    if (selectedCategory) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedCategory]);

  // Exactly 4 categories required
  const categoryCards: CategoryCardItem[] = [
    {
      id: 'sportswear',
      slug: 'sportswear',
      name: { en: 'SPORTSWEAR', ar: 'ملابس رياضية' },
      tag: { en: 'NIKE • ADIDAS • PUMA', ar: 'نايكي • أديداس • بوما' },
      image: sportswearMainImg,
    },
    {
      id: 'sport-shoes',
      slug: 'sport-shoes',
      name: { en: 'SPORT SHOES', ar: 'أحذية رياضية' },
      tag: { en: 'TURF & RUNNING', ar: 'جري وملاعب' },
      image: 'https://images.unsplash.com/photo-1511886929837-354d827aae26?w=800&auto=format&fit=crop&q=80',
    },
    {
      id: 'sneakers',
      slug: 'sneakers',
      name: { en: 'SNEAKERS', ar: 'سنيكرز' },
      tag: { en: 'ORIGINAL ICONS', ar: 'أيقونات أصلية' },
      image: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=800&auto=format&fit=crop&q=80',
    },
    {
      id: 'accessories',
      slug: 'accessories',
      name: { en: 'ACCESSORIES', ar: 'إكسسوارات' },
      tag: { en: 'BAGS & GEAR', ar: 'حقائب ومعدات' },
      image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80',
    },
  ];

  // Dynamically tailor gender options based on the active selected category
  const getGenderOptions = (categorySlug?: string) => {
    if (categorySlug === 'sportswear') {
      return [
        {
          id: 'men',
          slug: 'men',
          name: { en: 'MEN', ar: 'رجالي' },
          subtitle: { en: 'Nike Tech Fleece & Sportswear', ar: 'ملابس وترنجات نايكي الأصلية' },
          image: sportswearMenImg,
          brandBadge: 'NIKE',
        },
        {
          id: 'women',
          slug: 'women',
          name: { en: 'WOMEN', ar: 'حريمي' },
          subtitle: { en: 'Adidas 3-Stripes Tracksuits', ar: 'أطقم وجواكت أديداس الرياضية' },
          image: sportswearWomenImg,
          brandBadge: 'ADIDAS',
        },
        {
          id: 'kids',
          slug: 'kids',
          name: { en: 'KIDS', ar: 'أطفال' },
          subtitle: { en: 'Puma Youth Tracksuits & Sets', ar: 'ترنجات بوما الرياضية للأولاد' },
          image: sportswearKidsImg,
          brandBadge: 'PUMA',
        },
      ];
    }

    if (categorySlug === 'accessories') {
      return [
        {
          id: 'men',
          slug: 'men',
          name: { en: 'MEN', ar: 'رجالي' },
          subtitle: { en: 'Backpacks, caps & gym gear', ar: 'شنط، كابات، ومعدات تدريب' },
          image: accessoriesMenImg,
        },
        {
          id: 'women',
          slug: 'women',
          name: { en: 'WOMEN', ar: 'حريمي' },
          subtitle: { en: 'Totes, caps & essentials', ar: 'حقائب رياضية وإكسسوارات' },
          image: accessoriesWomenImg,
        },
        {
          id: 'kids',
          slug: 'kids',
          name: { en: 'KIDS', ar: 'أطفال' },
          subtitle: { en: 'Youth bags & school gear', ar: 'شنط واحتياجات الناشئين' },
          image: accessoriesKidsImg,
        },
      ];
    }

    if (categorySlug === 'sport-shoes') {
      return [
        {
          id: 'men',
          slug: 'men',
          name: { en: 'MEN', ar: 'رجالي' },
          subtitle: { en: 'Football boots & running shoes', ar: 'أحذية كرة قدم وملاعب' },
          image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80',
        },
        {
          id: 'women',
          slug: 'women',
          name: { en: 'WOMEN', ar: 'حريمي' },
          subtitle: { en: 'Performance trainers & turf', ar: 'أحذية تدريب وأداء عالي' },
          image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&auto=format&fit=crop&q=80',
        },
        {
          id: 'kids',
          slug: 'kids',
          name: { en: 'KIDS', ar: 'أطفال' },
          subtitle: { en: 'Junior boots & school sports', ar: 'أحذية رياضية للأطفال' },
          image: 'https://images.unsplash.com/photo-1514989940723-e8e51635b782?w=600&auto=format&fit=crop&q=80',
        },
      ];
    }

    // Default: Sneakers
    return [
      {
        id: 'men',
        slug: 'men',
        name: { en: 'MEN', ar: 'رجالي' },
        subtitle: { en: 'Lifestyle & iconic kicks', ar: 'سنيكرز رجالي كلاسيكي وعصري' },
        image: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600&auto=format&fit=crop&q=80',
      },
      {
        id: 'women',
        slug: 'women',
        name: { en: 'WOMEN', ar: 'حريمي' },
        subtitle: { en: 'Trending & stylish silhouettes', ar: 'سنيكرز حريمي مميز' },
        image: 'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=600&auto=format&fit=crop&q=80',
      },
      {
        id: 'kids',
        slug: 'kids',
        name: { en: 'KIDS', ar: 'أطفال' },
        subtitle: { en: 'Everyday comfort & durable kicks', ar: 'أحذية مريحة للناشئين' },
        image: 'https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?w=600&auto=format&fit=crop&q=80',
      },
    ];
  };

  const handleGenderSelect = (genderSlug: string) => {
    if (!selectedCategory) return;
    const catSlug = selectedCategory.slug;
    setSelectedCategory(null);
    navigate(`/${catSlug}/${genderSlug}`);
  };

  const activeGenderOptions = getGenderOptions(selectedCategory?.slug);

  return (
    <section className="py-16 sm:py-20 bg-slate-50 border-y border-slate-100">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 md:px-12">
        {/* Section Header */}
        <div className="text-center max-w-xl mx-auto mb-10 sm:mb-12">
          <span className="inline-block text-xs font-black tracking-widest text-slate-500 uppercase mb-2 font-display">
            {language === 'en' ? 'CURATED COLLECTIONS' : 'تشكيلات مختارة'}
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-ym-charcoal uppercase tracking-tight font-display">
            {language === 'en' ? 'SHOP BY CATEGORY' : 'تسوق حسب القسم'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
            {language === 'en'
              ? 'Select any category to choose Men, Women, or Kids'
              : 'اختر أي قسم لتحديد تشكيلة الرجال، النساء، أو الأطفال'}
          </p>

          {/* Quick Sports Disciplines Links (Basketball, Football, Running, Training) */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-6">
            {[
              { id: 'Basketball', label: { en: 'Basketball', ar: 'كرة السلة (باسكيت)' }, icon: '🏀' },
              { id: 'Football', label: { en: 'Football', ar: 'كرة القدم (كورة)' }, icon: '⚽' },
              { id: 'Running', label: { en: 'Running', ar: 'الجري والماراثون' }, icon: '🏃' },
              { id: 'Training', label: { en: 'Training & Gym', ar: 'تمارين وجيم' }, icon: '🏋️' },
            ].map((sport) => (
              <button
                key={sport.id}
                onClick={() => navigate(`/shop?category=${sport.id}`)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white hover:bg-ym-charcoal hover:text-white text-ym-charcoal text-xs font-black uppercase tracking-wider transition-all border border-slate-200/80 shadow-xs hover:scale-105 cursor-pointer"
              >
                <span>{sport.icon}</span>
                <span>{sport.label[language]}</span>
                <ArrowIcon className="w-3 h-3 text-slate-400 group-hover:text-ym-lime" />
              </button>
            ))}
          </div>
        </div>

        {/* 4 Category Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {categoryCards.map((cat) => (
            <div
              key={cat.id}
              onClick={() => setSelectedCategory(cat)}
              className="group relative h-80 sm:h-96 rounded-3xl overflow-hidden cursor-pointer select-none border border-black/5 hover:border-ym-lime transition-all duration-300 shadow-sm hover:shadow-xl bg-black"
            >
              {/* Background Image */}
              <img
                src={cat.image}
                alt={cat.name[language]}
                className="absolute inset-0 w-full h-full object-cover object-center filter brightness-[0.72] group-hover:brightness-[0.85] group-hover:scale-105 transition-all duration-500"
                loading="lazy"
              />

              {/* Gradient Scrim */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

              {/* Top Tag */}
              <div className="absolute top-5 left-5 right-5 flex justify-between items-start z-10">
                <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-[10px] font-black uppercase tracking-wider text-white border border-white/20">
                  {cat.tag[language]}
                </span>
                <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white group-hover:bg-ym-lime group-hover:text-black transition-colors">
                  <ArrowIcon className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* Bottom Content */}
              <div className="absolute bottom-6 left-6 right-6 z-10 text-left rtl:text-right space-y-1">
                <h3 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight font-display">
                  {cat.name[language]}
                </h3>
                <div className="flex items-center gap-2 text-xs font-black text-ym-lime uppercase tracking-wider">
                  <span>{language === 'en' ? 'CHOOSE GENDER' : 'اختر الفئة'}</span>
                  <ArrowIcon className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Gender Selection Modal */}
      <AnimatePresence>
        {selectedCategory && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl p-6 sm:p-8 overflow-hidden"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between pb-5 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-ym-lime ring-2 ring-ym-charcoal" />
                  <div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
                      <Sparkles className="w-3 h-3 text-ym-lime" />
                      <span>{language === 'en' ? 'STEP 2: SELECT GENDER' : 'الخطوة ٢: حدد الفئة'}</span>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-black text-ym-charcoal uppercase tracking-tight font-display">
                      {language === 'en'
                        ? `SHOP ${selectedCategory.name.en}`
                        : `تسوق ${selectedCategory.name.ar}`}
                    </h3>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedCategory(null)}
                  aria-label="Close"
                  className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* 3 Gender Cards with Category-Specific Authentic Images */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6">
                {activeGenderOptions.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => handleGenderSelect(opt.slug)}
                    className="group relative h-60 sm:h-72 rounded-2xl overflow-hidden flex flex-col justify-end p-5 bg-black text-left rtl:text-right cursor-pointer select-none border border-black/5 hover:border-ym-lime transition-all duration-300 shadow-sm hover:shadow-lg"
                  >
                    <img
                      src={opt.image}
                      alt={opt.name[language]}
                      className="absolute inset-0 w-full h-full object-cover object-center filter brightness-[0.7] group-hover:brightness-[0.85] group-hover:scale-105 transition-all duration-300"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

                    {/* Brand Badge if present */}
                    {'brandBadge' in opt && (
                      <div className="absolute top-4 left-4 rtl:left-auto rtl:right-4 z-10">
                        <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-[9px] font-black tracking-widest text-ym-lime border border-white/10 uppercase">
                          {(opt as any).brandBadge}
                        </span>
                      </div>
                    )}

                    <div className="relative z-10 space-y-1">
                      <h4 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight font-display">
                        {opt.name[language]}
                      </h4>
                      <p className="text-[11px] text-slate-300 font-medium line-clamp-1">
                        {opt.subtitle[language]}
                      </p>
                      <div className="pt-1.5 flex items-center gap-1.5 text-xs font-black text-ym-lime uppercase group-hover:underline">
                        <span>{language === 'en' ? 'EXPLORE' : 'استكشف'}</span>
                        <ArrowIcon className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
