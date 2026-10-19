import React, { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, Sparkles, X } from 'lucide-react';
import { useLanguageStore } from '../../store/languageStore';
import sportswearMenImg from '../../assets/categories/sportswear_men_nike.jpg';
import sportswearWomenImg from '../../assets/categories/sportswear_women_adidas.jpg';
import sportswearKidsImg from '../../assets/categories/sportswear_kids_puma.jpg';

export interface CategoryNavConfig {
  id: string;
  slug: string;
  label: {
    en: string;
    ar: string;
  };
}

interface GenderMegaMenuProps {
  activeCategory: CategoryNavConfig | null;
  onClose: () => void;
}

export const GenderMegaMenu: React.FC<GenderMegaMenuProps> = ({
  activeCategory,
  onClose,
}) => {
  const navigate = useNavigate();
  const { language, isRTL } = useLanguageStore();
  const menuRef = useRef<HTMLDivElement>(null);
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  // Close on Escape or click outside
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    if (activeCategory) {
      window.addEventListener('keydown', handleKeyDown);
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [activeCategory, onClose]);

  const categoryImages: Record<string, Record<string, string>> = {
    sportswear: {
      men: sportswearMenImg,
      women: sportswearWomenImg,
      kids: sportswearKidsImg,
    },
    'sport-shoes': {
      men: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80',
      women: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&auto=format&fit=crop&q=80',
      kids: 'https://images.unsplash.com/photo-1514989940723-e8e51635b782?w=600&auto=format&fit=crop&q=80',
    },
    sneakers: {
      men: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600&auto=format&fit=crop&q=80',
      women: 'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=600&auto=format&fit=crop&q=80',
      kids: 'https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?w=600&auto=format&fit=crop&q=80',
    },
    accessories: {
      men: new URL('../../assets/categories/accessories_men.jpg', import.meta.url).href,
      women: new URL('../../assets/categories/accessories_women.jpg', import.meta.url).href,
      kids: new URL('../../assets/categories/accessories_kids.jpg', import.meta.url).href,
    }
  };

  const genderOptions = [
    {
      id: 'men',
      slug: 'men',
      title: { en: 'MEN', ar: 'رجالي' },
      subtitle: activeCategory?.slug === 'sportswear'
        ? { en: 'Nike Tech Fleece & Tracksuits', ar: 'ملابس وترنجات نايكي الرياضية' }
        : { en: 'Athletic, training & lifestyle', ar: 'تمارين، ستريت وير، وأداء رياضي' },
    },
    {
      id: 'women',
      slug: 'women',
      title: { en: 'WOMEN', ar: 'حريمي' },
      subtitle: activeCategory?.slug === 'sportswear'
        ? { en: 'Adidas 3-Stripes Tracksuits', ar: 'أطقم وجواكت أديداس الأصلية' }
        : { en: 'Performance, studio & sleek cuts', ar: 'أناقة رياضية وقصات عصرية' },
    },
    {
      id: 'kids',
      slug: 'kids',
      title: { en: 'KIDS', ar: 'أطفال' },
      subtitle: activeCategory?.slug === 'sportswear'
        ? { en: 'Puma Youth Athletic Sets', ar: 'ترنجات بوما الرياضية للناشئين' }
        : { en: 'Youth performance & durable pairs', ar: 'خامات متينة وراحة للناشئين' },
    },
  ];

  const handleSelectGender = (genderSlug: string) => {
    if (!activeCategory) return;
    onClose();
    navigate(`/${activeCategory.slug}/${genderSlug}`);
  };

  return (
    <AnimatePresence>
      {activeCategory && (
        <motion.div
          ref={menuRef}
          initial={{ opacity: 0, y: -10, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8, scale: 0.98 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="absolute top-full inset-x-0 mt-3 z-[100] max-w-5xl mx-auto px-4"
        >
          <div className="bg-white/95 backdrop-blur-2xl rounded-3xl shadow-[0_25px_60px_rgba(0,0,0,0.18)] border border-black/10 overflow-hidden p-6 sm:p-8">
            {/* Header with Category Name & Close */}
            <div className="flex items-center justify-between pb-6 border-b border-black/5">
              <div className="flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-ym-lime ring-2 ring-ym-charcoal" />
                <div>
                  <div className="text-[11px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3 text-ym-lime" />
                    <span>{language === 'en' ? 'SHOP FOR' : 'تسوق حسب'}</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-ym-charcoal uppercase tracking-tight font-display">
                    {language === 'en' ? `SHOP ${activeCategory.label.en}` : `تسوق ${activeCategory.label.ar}`}
                  </h3>
                </div>
              </div>

              <button
                onClick={onClose}
                aria-label="Close"
                className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* 3 Visual Gender Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-6">
              {genderOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => handleSelectGender(option.slug)}
                  className="group relative flex flex-col justify-end text-left rtl:text-right h-64 sm:h-72 rounded-2xl overflow-hidden p-6 bg-slate-900 select-none cursor-pointer border border-black/5 hover:border-ym-lime/50 transition-all duration-300 shadow-sm hover:shadow-xl"
                >
                  {/* Background Image */}
                  <img
                    src={categoryImages[activeCategory.id]?.[option.id] || ''}
                    alt={option.title[language]}
                    className="absolute inset-0 w-full h-full object-cover object-center filter brightness-[0.65] group-hover:brightness-[0.8] group-hover:scale-105 transition-all duration-500 ease-out"
                    loading="lazy"
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

                  {/* Card Content */}
                  <div className="relative z-10 space-y-1.5">
                    <h4 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight font-display">
                      {option.title[language]}
                    </h4>

                    <p className="text-xs text-slate-300 line-clamp-1 font-medium">
                      {option.subtitle[language]}
                    </p>

                    <div className="pt-2 flex items-center gap-2 text-xs font-black tracking-wider text-ym-lime uppercase group-hover:underline">
                      <span>{language === 'en' ? 'EXPLORE' : 'استكشف'}</span>
                      <ArrowIcon className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Bottom Subtle Note */}
            <div className="pt-5 mt-5 border-t border-black/5 flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              <span>{language === 'en' ? '100% Original Products Guaranteed' : 'منتجات أصلية 100٪ معتمدة'}</span>
              <span>{language === 'en' ? 'Fast Doorstep Delivery in Egypt' : 'توصيل سريع لباب بيتك في مصر'}</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
