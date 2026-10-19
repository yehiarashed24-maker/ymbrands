import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, Heart, Globe, ChevronDown, ArrowRight, ArrowLeft } from 'lucide-react';
import { useLanguageStore } from '../../store/languageStore';
import { translations } from '../../data/translations';
import { CategoryNavConfig } from './GenderMegaMenu';
import ymBrandsLogo from '../../assets/ym-brands-logo.png';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  categories: CategoryNavConfig[];
  onOpenSearch: () => void;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({
  isOpen,
  onClose,
  categories,
  onOpenSearch,
}) => {
  const navigate = useNavigate();
  const { language, toggleLanguage, isRTL } = useLanguageStore();
  const t = translations[language].nav;
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  const [expandedCategoryId, setExpandedCategoryId] = useState<string | null>(null);

  // Prevent background scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const genderOptions = [
    { id: 'men', slug: 'men', label: { en: 'Men', ar: 'رجالي' } },
    { id: 'women', slug: 'women', label: { en: 'Women', ar: 'حريمي' } },
    { id: 'kids', slug: 'kids', label: { en: 'Kids', ar: 'أطفال' } },
  ];

  const toggleAccordion = (catId: string) => {
    setExpandedCategoryId((prev) => (prev === catId ? null : catId));
  };

  const handleSelectGender = (categorySlug: string, genderSlug: string) => {
    onClose();
    navigate(`/${categorySlug}/${genderSlug}`);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-white flex flex-col justify-between p-6 sm:p-8 overflow-y-auto pointer-events-auto"
        >
          {/* Top Bar */}
          <div className="flex items-center justify-between pb-5 border-b border-black/5">
            <Link
              to="/"
              onClick={onClose}
              className="flex items-center select-none"
              aria-label="YM BRANDS Home"
            >
              <img
                src={ymBrandsLogo}
                alt="YM BRANDS"
                className="h-10 sm:h-12 w-auto object-contain drop-shadow-[0_2px_8px_rgba(0,0,0,0.1)]"
              />
            </Link>

            <button
              onClick={onClose}
              aria-label="Close menu"
              className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-ym-charcoal hover:bg-slate-200 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Search Bar in Mobile Menu */}
          <div className="pt-4 pb-1">
            <button
              onClick={() => {
                onClose();
                onOpenSearch();
              }}
              className="w-full flex items-center justify-between px-4 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 transition-colors text-slate-400 text-xs font-bold uppercase tracking-wider cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <Search className="w-4 h-4 text-slate-500" />
                <span>{language === 'ar' ? 'ابحث باسم المنتج أو الماركة...' : 'Search product or brand...'}</span>
              </div>
              <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-white text-ym-charcoal shadow-2xs">
                {language === 'ar' ? 'بحث' : 'SEARCH'}
              </span>
            </button>
          </div>

          {/* Categories with Gender Accordion */}
          <div className="flex flex-col py-4 divide-y divide-slate-100">
            {categories.map((cat) => {
              const isExpanded = expandedCategoryId === cat.id;

              return (
                <div key={cat.id} className="py-3">
                  {/* Category Header Button */}
                  <button
                    onClick={() => toggleAccordion(cat.id)}
                    className="w-full flex items-center justify-between py-2 text-xl font-black text-ym-charcoal hover:text-sky-600 transition-colors uppercase font-display cursor-pointer"
                  >
                    <span>{cat.label[language]}</span>
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center transition-transform duration-200 ${isExpanded ? 'bg-ym-charcoal text-white rotate-180' : 'bg-slate-100 text-slate-600'
                        }`}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </button>

                  {/* Gender Accordion Body */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: 'easeInOut' }}
                        className="overflow-hidden"
                      >
                        <div className="pt-2 pb-3 ps-4 flex flex-col gap-2 border-s-2 border-ym-lime my-1">
                          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                            {language === 'en' ? 'SHOP FOR:' : 'تسوق حسب:'}
                          </span>

                          {genderOptions.map((gender) => (
                            <button
                              key={gender.id}
                              onClick={() => handleSelectGender(cat.slug, gender.slug)}
                              className="flex items-center justify-between py-2 text-base font-bold text-slate-700 hover:text-black uppercase text-start cursor-pointer group"
                            >
                              <span>{gender.label[language]}</span>
                              <ArrowIcon className="w-4 h-4 text-ym-lime opacity-0 group-hover:opacity-100 transition-opacity" />
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

          {/* Quick Actions (Wishlist & Search) */}
          <div className="pt-4 border-t border-slate-100 space-y-3">
            <Link
              to="/wishlist"
              onClick={onClose}
              className="flex items-center gap-3 text-sm font-black text-slate-700 hover:text-black uppercase"
            >
              <Heart className="w-4 h-4 text-slate-500" />
              <span>{t.wishlist}</span>
            </Link>

            <button
              onClick={onOpenSearch}
              className="flex items-center gap-3 text-sm font-black text-slate-700 hover:text-black uppercase text-start cursor-pointer"
            >
              <Search className="w-4 h-4 text-slate-500" />
              <span>{t.search}</span>
            </button>
          </div>

          {/* Bottom Bar with Language Switcher */}
          <div className="pt-6 border-t border-black/5 flex items-center justify-between">
            <button
              onClick={toggleLanguage}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-black/15 bg-slate-50 font-bold text-xs tracking-wider uppercase text-ym-charcoal cursor-pointer"
            >
              <Globe className="w-4 h-4 text-slate-500" />
              <span>{language === 'en' ? 'العربية (AR)' : 'ENGLISH (EN)'}</span>
            </button>

            <span className="text-[11px] font-bold text-slate-400 tracking-wider uppercase">
              100% Original • Egypt
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
