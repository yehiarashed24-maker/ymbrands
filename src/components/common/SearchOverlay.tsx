import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, TrendingUp, ArrowRight, ArrowLeft, ExternalLink } from 'lucide-react';
import { useProductStore } from '../../store/productStore';
import { useLanguageStore } from '../../store/languageStore';
import { translations } from '../../data/translations';

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

// Helper to normalize Arabic characters (alif, taa marbuta, etc.)
const normalizeArabic = (text: string) =>
  text
    .replace(/[إأآا]/g, 'ا')
    .replace(/[ة]/g, 'ه')
    .replace(/[ى]/g, 'ي')
    .replace(/[ًٌٍَُِّْ]/g, '')
    .toLowerCase();

export const SearchOverlay: React.FC<SearchOverlayProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { language, isRTL } = useLanguageStore();
  const products = useProductStore((state) => state.products);
  
  const t = translations[language].search;
  const inputRef = useRef<HTMLInputElement>(null);

  const [query, setQuery] = useState('');

  const trendingTags = [
    { en: 'Air Max 270', ar: 'إير ماكس 270' },
    { en: 'Adidas Samba', ar: 'أديداس سامبا' },
    { en: 'Dunk Low Panda', ar: 'دانك لو باندا' },
    { en: 'New Balance 530', ar: 'نيو بالانس 530' },
    { en: 'Nike Tech Fleece', ar: 'نايكي تك فليس' },
    { en: 'Puma Palermo', ar: 'بوما باليرمو' },
  ];

  // Prevent background scroll when search is open
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

  // Auto focus input on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Enhanced search filtering by Product Name (English & Arabic), Brand, Category, and Slug
  const filteredProducts = query.trim()
    ? products.filter((p) => {
        const cleanQ = query.toLowerCase().trim();
        const normQ = normalizeArabic(cleanQ);

        const nameEn = (p.name?.en || '').toLowerCase();
        const nameAr = normalizeArabic(p.name?.ar || '');
        const brand = (p.brand || '').toLowerCase();
        const category = (p.category || '').toLowerCase();
        const subCat = (p.subCategory || '').toLowerCase();
        const slug = (p.slug || '').toLowerCase();

        return (
          nameEn.includes(cleanQ) ||
          nameAr.includes(normQ) ||
          brand.includes(cleanQ) ||
          category.includes(cleanQ) ||
          subCat.includes(cleanQ) ||
          slug.includes(cleanQ)
        );
      })
    : [];

  const handleSelectProduct = (slug: string) => {
    onClose();
    navigate(`/product/${slug}`);
  };

  const handleTrendingClick = (term: string) => {
    setQuery(term);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    onClose();
    navigate(`/shop?search=${encodeURIComponent(query.trim())}`);
  };

  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[120] bg-white/95 backdrop-blur-xl flex flex-col justify-start p-4 sm:p-8 md:p-12 overflow-y-auto"
        >
          {/* Top Bar */}
          <div className="max-w-4xl mx-auto w-full flex items-center justify-between pb-5 sm:pb-8">
            <span className="text-xs sm:text-sm font-black tracking-widest text-slate-400 uppercase font-display">
              {language === 'ar' ? 'البحث عن المنتجات' : 'PRODUCT SEARCH'}
            </span>

            <button
              onClick={onClose}
              aria-label={t.close}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-slate-100 flex items-center justify-center text-ym-charcoal hover:bg-slate-200 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>

          {/* Search Input Bar (Form supporting Enter submit) */}
          <div className="max-w-4xl mx-auto w-full pb-6 sm:pb-10">
            <form onSubmit={handleSearchSubmit} className="relative flex items-center border-b-2 border-ym-charcoal pb-3 sm:pb-4">
              <Search className="w-5 h-5 sm:w-7 sm:h-7 text-slate-400 shrink-0 mr-3 rtl:mr-0 rtl:ml-3" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={language === 'ar' ? 'ابحث باسم المنتج أو الماركة (Dunk, Samba...)' : 'Search products, brands (Dunk, Samba...)'}
                className="w-full text-lg sm:text-2xl md:text-3xl font-extrabold text-ym-charcoal placeholder:text-slate-300 bg-transparent outline-none tracking-tight font-display"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  className="p-1 rounded-full text-slate-400 hover:text-black cursor-pointer mr-1.5 rtl:mr-0 rtl:ml-1.5"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
              {query && (
                <button
                  type="submit"
                  className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-ym-charcoal hover:bg-black text-white text-xs font-bold uppercase tracking-wider transition-all shrink-0 cursor-pointer shadow-md"
                >
                  {language === 'ar' ? 'بحث' : 'Search'}
                </button>
              )}
            </form>

            {/* Trending Suggestions */}
            {!query && (
              <div className="pt-6 sm:pt-8">
                <div className="flex items-center gap-2 text-xs font-black tracking-wider text-slate-400 uppercase mb-3 sm:mb-4">
                  <TrendingUp className="w-4 h-4 text-ym-lime" />
                  <span>{t.trending}</span>
                </div>
                <div className="flex flex-wrap gap-2 sm:gap-2.5">
                  {trendingTags.map((tag) => (
                    <button
                      key={tag.en}
                      onClick={() => handleTrendingClick(tag[language])}
                      className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-slate-100 hover:bg-ym-lime hover:text-black text-[11px] sm:text-xs font-bold tracking-wide text-slate-700 transition-colors cursor-pointer"
                    >
                      {tag[language]}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Results Grid */}
          {query && (
            <div className="max-w-4xl mx-auto w-full flex-1">
              <div className="flex items-center justify-between text-xs font-bold text-slate-400 tracking-wider uppercase mb-4 sm:mb-6 pb-2 border-b border-slate-100">
                <span>
                  {filteredProducts.length} {t.resultsCount} &ldquo;{query}&rdquo;
                </span>
                {filteredProducts.length > 0 && (
                  <button
                    onClick={handleSearchSubmit}
                    className="text-ym-charcoal hover:underline font-black flex items-center gap-1 cursor-pointer text-xs"
                  >
                    <span>{language === 'ar' ? 'عرض الكل' : 'View all'}</span>
                    <ArrowIcon className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-6">
                  {filteredProducts.map((p) => (
                    <div
                      key={p.id}
                      onClick={() => handleSelectProduct(p.slug)}
                      className="group p-3 sm:p-4 rounded-2xl bg-white border border-slate-100 hover:border-slate-300 shadow-xs hover:shadow-md transition-all cursor-pointer flex items-center gap-3 sm:gap-4"
                    >
                      <div className="w-14 h-14 sm:w-20 sm:h-20 bg-slate-50 rounded-xl overflow-hidden p-1.5 sm:p-2 flex items-center justify-center shrink-0">
                        <img
                          src={p.image}
                          alt={p.name[language]}
                          className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block truncate">
                          {p.brand}
                        </span>
                        <h4 className="text-xs sm:text-sm font-bold text-ym-charcoal truncate">
                          {p.name[language]}
                        </h4>
                        <span className="text-xs sm:text-sm font-black text-ym-charcoal block mt-0.5 sm:mt-1 font-display">
                          {p.price.toLocaleString()} {translations[language].hero.pricePrefix}
                        </span>
                      </div>
                      <ArrowIcon className="w-4 h-4 text-slate-300 group-hover:text-black group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-all shrink-0" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-12 sm:py-16 text-center text-slate-500 font-medium text-sm sm:text-base space-y-3">
                  <p>{t.noResults}</p>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    {language === 'ar'
                      ? 'تبحث عن موديل نادر غير موجود؟ يمكنك طلبه فوراً عبر خدمة الطلب الخاص (Sourcing)!'
                      : "Can't find what you're looking for? Request it via our Sourcing service!"}
                  </p>
                  <button
                    onClick={() => {
                      onClose();
                      navigate('/sourcing');
                    }}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-ym-charcoal text-white text-xs font-bold uppercase tracking-wider hover:bg-black transition-all cursor-pointer shadow-md"
                  >
                    <span>{language === 'ar' ? 'طلب كوتشي خاص باللينك' : 'Special Sourcing Request'}</span>
                    <ExternalLink className="w-3.5 h-3.5 text-ym-lime" />
                  </button>
                </div>
              )}
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
