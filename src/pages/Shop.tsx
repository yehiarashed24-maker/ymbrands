import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams, useParams, Link } from 'react-router-dom';
import { SlidersHorizontal, ArrowUpDown, X, Search, Sparkles, MessageCircle } from 'lucide-react';
import { ProductCard } from '@/components/product/ProductCard';
import { FilterSidebar } from '@/components/shop/FilterSidebar';
import { FilterState } from '@/types/product';
import { useLanguageStore } from '@/store/languageStore';
import { translations } from '@/data/translations';
import { useProductStore } from '@/store/productStore';

const mapCategorySlug = (slug?: string): string => {
  if (!slug) return '';
  const lower = slug.toLowerCase();
  if (lower === 'sportswear') return 'Sportswear';
  if (lower === 'sport-shoes' || lower === 'sportshoes') return 'Football';
  if (lower === 'football' || lower === 'soccer' || lower === 'koora' || lower === 'kora') return 'Football';
  if (lower === 'basketball' || lower === 'basket') return 'Basketball';
  if (lower === 'running' || lower === 'runner' || lower === 'run') return 'Running';
  if (lower === 'training' || lower === 'gym' || lower === 'fitness') return 'Training';
  if (lower === 'sneakers') return 'Sneakers';
  if (lower === 'accessories') return 'Accessories';
  return slug;
};

const mapGenderSlug = (slug?: string): string => {
  if (!slug) return '';
  const lower = slug.toLowerCase();
  if (lower === 'men') return 'Men';
  if (lower === 'women') return 'Women';
  if (lower === 'kids') return 'Kids';
  return slug;
};

// Normalize Arabic letters (alif with hamza, taa marbuta, alif maqsura, tashkeel)
const normalizeArabic = (text: string): string =>
  text
    .replace(/[إأآا]/g, 'ا')
    .replace(/[ة]/g, 'ه')
    .replace(/[ى]/g, 'ي')
    .replace(/[ًٌٍَُِّْ]/g, '')
    .toLowerCase();

export const Shop: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { categorySlug, genderSlug } = useParams<{ categorySlug?: string; genderSlug?: string }>();
  const { language } = useLanguageStore();
  const products = useProductStore((state) => state.products);
  
  const t = translations[language].shop;

  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get('search') || searchParams.get('q') || ''
  );

  // Initialize filters from search params or route params
  const paramCategory = mapCategorySlug(categorySlug);
  const paramGender = mapGenderSlug(genderSlug);

  const initialCategory = paramCategory || searchParams.get('category') || '';
  const initialGender = paramGender
    ? [paramGender]
    : searchParams.get('gender')
    ? [searchParams.get('gender')!]
    : [];
  const initialFilter = searchParams.get('filter') || '';

  const [filters, setFilters] = useState<FilterState>({
    category: initialCategory,
    brand: [],
    gender: initialGender,
    sizes: [],
    priceRange: [0, 12000],
    color: [],
    sort: 'newest',
  });

  // Sync state if URL route params or searchParams change
  useEffect(() => {
    const cat = mapCategorySlug(categorySlug) || searchParams.get('category') || '';
    const gen = mapGenderSlug(genderSlug) || searchParams.get('gender');
    const queryParam = searchParams.get('search') || searchParams.get('q') || '';
    
    if (cat) {
      setFilters((prev) => ({ ...prev, category: cat }));
    }
    if (gen) {
      setFilters((prev) => ({ ...prev, gender: [gen] }));
    }
    if (queryParam !== searchQuery) {
      setSearchQuery(queryParam);
    }
  }, [categorySlug, genderSlug, searchParams]);

  const handleReset = () => {
    setFilters({
      category: '',
      brand: [],
      gender: [],
      sizes: [],
      priceRange: [0, 12000],
      color: [],
      sort: 'newest',
    });
    setSearchQuery('');
    setSearchParams({});
  };

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Search by Product Name (English & Arabic), Brand, Subcategory, Slug
        if (searchQuery.trim()) {
          const cleanQ = searchQuery.toLowerCase().trim();
          const normQ = normalizeArabic(cleanQ);

          const nameEn = (p.name?.en || '').toLowerCase();
          const nameAr = normalizeArabic(p.name?.ar || '');
          const brand = (p.brand || '').toLowerCase();
          const category = (p.category || '').toLowerCase();
          const subCat = (p.subCategory || '').toLowerCase();
          const slug = (p.slug || '').toLowerCase();

          const matches =
            nameEn.includes(cleanQ) ||
            nameAr.includes(normQ) ||
            brand.includes(cleanQ) ||
            category.includes(cleanQ) ||
            subCat.includes(cleanQ) ||
            slug.includes(cleanQ);

          if (!matches) return false;
        }

        // Category
        if (filters.category && filters.category !== 'All') {
          if (p.category !== filters.category) return false;
        }
        // Special 'new' filter
        if (initialFilter === 'new' && !p.isNew) {
          return false;
        }
        // Brand
        if (filters.brand.length > 0) {
          if (!filters.brand.includes(p.brand)) return false;
        }
        // Gender
        if (filters.gender.length > 0) {
          if (!filters.gender.includes(p.gender) && p.gender !== 'Unisex') return false;
        }
        // Sizes
        if (filters.sizes.length > 0) {
          const hasSize = p.sizes.some((s) => filters.sizes.includes(s));
          if (!hasSize) return false;
        }
        // Price
        if (p.price > filters.priceRange[1]) {
          return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (filters.sort === 'price-asc') return a.price - b.price;
        if (filters.sort === 'price-desc') return b.price - a.price;
        if (filters.sort === 'bestseller') return (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0);
        return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
      });
  }, [products, filters, initialFilter, searchQuery]);

  return (
    <div className="pt-28 sm:pt-32 pb-24 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 md:px-12">
        {/* Breadcrumb / Title Bar */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5 sm:gap-6 pb-6 sm:pb-8 border-b border-slate-100 mb-6 sm:mb-8">
          <div>
            <span className="text-[10px] sm:text-xs font-black tracking-widest text-slate-400 uppercase">
              YM EGYPT • CATALOG
            </span>
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-ym-charcoal uppercase tracking-tight font-display mt-0.5 sm:mt-1">
              {filters.category ? filters.category : t.title}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
              {t.showing} {filteredProducts.length} {t.of} {products.length} {t.products}
            </p>
          </div>

          {/* Controls: In-Page Live Search Bar, Filter Drawer Toggle & Sort Dropdown */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3 w-full lg:w-auto">
            {/* Live Search Input Bar (Full width on mobile, sleek on desktop) */}
            <div className="relative w-full sm:w-64 md:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 rtl:left-auto rtl:right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  const val = e.target.value;
                  setSearchQuery(val);
                  setSearchParams((prev) => {
                    const next = new URLSearchParams(prev);
                    if (val.trim()) {
                      next.set('search', val);
                    } else {
                      next.delete('search');
                      next.delete('q');
                    }
                    return next;
                  });
                }}
                placeholder={language === 'ar' ? 'ابحث باسم المنتج أو الماركة...' : 'Search by product name...'}
                className="w-full pl-10 pr-9 rtl:pl-9 rtl:pr-10 py-3 sm:py-2.5 rounded-xl border border-slate-200 bg-white font-medium text-sm sm:text-xs text-ym-charcoal placeholder:text-slate-400 outline-none focus:border-black transition-colors shadow-xs"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setSearchParams((prev) => {
                      const next = new URLSearchParams(prev);
                      next.delete('search');
                      next.delete('q');
                      return next;
                    });
                  }}
                  className="absolute right-3 rtl:right-auto rtl:left-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-black cursor-pointer"
                  aria-label="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Mobile Sub-Row: Filter Button & Sort Dropdown side by side */}
            <div className="flex items-center gap-2.5 w-full sm:w-auto">
              {/* Mobile Filter Button */}
              <button
                onClick={() => setMobileFilterOpen(true)}
                className="lg:hidden flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-3 sm:py-2.5 rounded-xl border border-slate-200 bg-white font-bold text-xs uppercase tracking-wider text-ym-charcoal shadow-xs cursor-pointer active:bg-slate-50 transition-colors"
              >
                <SlidersHorizontal className="w-4 h-4 text-slate-500" />
                <span>{t.filter}</span>
                {/* Active Filter Count Badge */}
                {(filters.category || filters.brand.length > 0 || filters.gender.length > 0 || filters.sizes.length > 0) && (
                  <span className="w-5 h-5 rounded-full bg-ym-charcoal text-white text-[10px] font-black flex items-center justify-center">
                    {(filters.category ? 1 : 0) + filters.brand.length + filters.gender.length + filters.sizes.length}
                  </span>
                )}
              </button>

              {/* Sort Dropdown */}
              <div className="relative flex-1 sm:flex-none inline-flex items-center">
                <ArrowUpDown className="w-4 h-4 text-slate-400 absolute left-3 rtl:left-auto rtl:right-3 pointer-events-none" />
                <select
                  value={filters.sort}
                  onChange={(e) =>
                    setFilters({ ...filters, sort: e.target.value as FilterState['sort'] })
                  }
                  className="w-full sm:w-auto pl-9 pr-8 rtl:pl-8 rtl:pr-9 py-3 sm:py-2.5 rounded-xl border border-slate-200 bg-white font-bold text-xs uppercase tracking-wider text-ym-charcoal appearance-none outline-none focus:border-black cursor-pointer shadow-xs text-center sm:text-start"
                >
                  <option value="newest">{t.newest}</option>
                  <option value="price-asc">{t.priceAsc}</option>
                  <option value="price-desc">{t.priceDesc}</option>
                  <option value="bestseller">{t.bestseller}</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Sports & Collections Quick Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
          {[
            { id: '', label: { en: 'All Drops', ar: 'جميع الأقسام' }, icon: '⚡' },
            { id: 'Basketball', label: { en: 'Basketball', ar: 'كرة السلة (باسكيت)' }, icon: '🏀' },
            { id: 'Football', label: { en: 'Football', ar: 'كرة القدم (كورة)' }, icon: '⚽' },
            { id: 'Running', label: { en: 'Running', ar: 'الجري والماراثون' }, icon: '🏃' },
            { id: 'Training', label: { en: 'Training & Gym', ar: 'تمارين وجيم' }, icon: '🏋️' },
            { id: 'Sneakers', label: { en: 'Sneakers', ar: 'سنيكرز' }, icon: '👟' },
            { id: 'Sportswear', label: { en: 'Sportswear', ar: 'ملابس وترنجات' }, icon: '👕' },
            { id: 'Accessories', label: { en: 'Accessories', ar: 'إكسسوارات' }, icon: '🎒' },
          ].map((sport) => {
            const isSelected = filters.category === sport.id || (!filters.category && sport.id === '');
            return (
              <button
                key={sport.id}
                onClick={() => setFilters((prev) => ({ ...prev, category: sport.id }))}
                className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
                  isSelected
                    ? 'bg-ym-charcoal text-white shadow-sm ring-2 ring-ym-charcoal'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                <span>{sport.icon}</span>
                <span>{sport.label[language]}</span>
              </button>
            );
          })}
        </div>

        {/* Active Filter Chips */}
        {(Boolean(searchQuery.trim()) ||
          filters.category ||
          filters.brand.length > 0 ||
          filters.gender.length > 0 ||
          filters.sizes.length > 0) && (
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-6 sm:mb-8">
            <span className="text-[11px] sm:text-xs font-bold text-slate-400 uppercase mr-1">
              {language === 'ar' ? 'الفلاتر:' : 'Active:'}
            </span>

            {/* Search Query Chip */}
            {searchQuery.trim() && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-ym-charcoal text-white text-xs font-bold shadow-xs">
                <Search className="w-3 h-3 text-ym-lime" />
                <span className="truncate max-w-[130px] sm:max-w-none">&ldquo;{searchQuery.trim()}&rdquo;</span>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSearchParams((prev) => {
                      const next = new URLSearchParams(prev);
                      next.delete('search');
                      next.delete('q');
                      return next;
                    });
                  }}
                  className="hover:text-red-400 cursor-pointer ml-1 rtl:ml-0 rtl:mr-1 p-0.5"
                  aria-label="Remove search filter"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            )}

            {filters.category && filters.category !== 'All' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-xs font-bold text-ym-charcoal">
                {filters.category}
                <button
                  onClick={() => setFilters({ ...filters, category: '' })}
                  className="hover:text-red-500 cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {filters.brand.map((b) => (
              <span
                key={b}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-xs font-bold text-ym-charcoal"
              >
                {b}
                <button
                  onClick={() =>
                    setFilters({ ...filters, brand: filters.brand.filter((item) => item !== b) })
                  }
                  className="hover:text-red-500 cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}

            {filters.gender.map((g) => (
              <span
                key={g}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-xs font-bold text-ym-charcoal"
              >
                {g}
                <button
                  onClick={() =>
                    setFilters({ ...filters, gender: filters.gender.filter((item) => item !== g) })
                  }
                  className="hover:text-red-500 cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}

            <button
              onClick={handleReset}
              className="text-xs font-bold text-slate-500 hover:text-black underline ml-2 cursor-pointer"
            >
              {t.clearAll}
            </button>
          </div>
        )}

        {/* Content Layout: Sidebar + Product Grid */}
        <div className="flex gap-8 items-start">
          <FilterSidebar
            filters={filters}
            onFilterChange={setFilters}
            onReset={handleReset}
            isOpenMobile={mobileFilterOpen}
            onCloseMobile={() => setMobileFilterOpen(false)}
          />

          {/* Product Grid Area */}
          <div className="flex-1 min-w-0">
            {products.length === 0 ? (
              <div className="py-20 px-6 sm:px-12 rounded-3xl bg-slate-50 border border-slate-200/80 text-center max-w-2xl mx-auto shadow-sm">
                <div className="w-16 h-16 rounded-2xl bg-ym-charcoal text-ym-lime flex items-center justify-center mx-auto mb-5 shadow-lg">
                  <Sparkles className="w-8 h-8" />
                </div>
                <span className="px-3 py-1 rounded-full bg-ym-lime/20 text-ym-charcoal font-black text-[10px] uppercase tracking-widest inline-block mb-3">
                  {language === 'ar' ? 'كولكشن جديد قريباً' : 'NEXT DROP INCOMING'}
                </span>
                <h3 className="text-2xl sm:text-3xl font-black uppercase text-ym-charcoal font-display mb-3">
                  {language === 'ar' ? 'جاري تجهيز الكولكشن الجديد' : 'FRESH GEAR PREPARING'}
                </h3>
                <p className="text-sm text-slate-500 font-medium leading-relaxed mb-8 max-w-lg mx-auto">
                  {language === 'ar'
                    ? 'تم مسح المنتجات السابقة ونقوم حالياً برفع تشكيلة جديدة ومميزة من الكوتشيات والملابس الأصلية 100%. تبحث عن موديل معين حالياً؟ اطلبه باللينك عبر خدمة الطلب الخاص!'
                    : 'Previous items have been cleared. We are loading our brand new collection of 100% authentic sneakers and sportswear. Looking for a specific pair right now? Request it directly!'}
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <Link
                    to="/sourcing"
                    className="px-6 py-3.5 rounded-full bg-ym-charcoal text-white font-bold text-xs uppercase tracking-wider hover:bg-black transition-all shadow-md"
                  >
                    {language === 'ar' ? 'طلب كوتشي باللينك (Sourcing)' : 'Request By Link (Sourcing)'}
                  </Link>
                  <a
                    href="https://wa.me/201060076900?text=Hello%20YM%20Team!%20Inquiring%20about%20new%20drop"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3.5 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 shadow-md"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>{language === 'ar' ? 'واتساب الإدارة' : 'WhatsApp Us'}</span>
                  </a>
                </div>
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8">
                {filteredProducts.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            ) : (
              <div className="py-20 px-6 sm:px-12 rounded-3xl bg-slate-50 border border-slate-200/80 text-center max-w-lg mx-auto shadow-sm">
                <div className="w-14 h-14 rounded-2xl bg-white border border-slate-200 text-ym-charcoal flex items-center justify-center mx-auto mb-4 shadow-xs">
                  <Search className="w-6 h-6 text-slate-400" />
                </div>
                <h3 className="text-xl sm:text-2xl font-black uppercase text-ym-charcoal mb-2 font-display">
                  {language === 'ar' ? 'لا توجد نتائج مطابقة' : 'NO MATCHING PRODUCTS'}
                </h3>
                <p className="text-sm text-slate-500 mb-6 font-medium leading-relaxed">
                  {searchQuery.trim()
                    ? language === 'ar'
                      ? `لم نجد أي منتج يطابق البحث عن "${searchQuery.trim()}". تأكد من كتابة الاسم بشكل صحيح أو جرب كلمة بحث أخرى.`
                      : `No products found matching "${searchQuery.trim()}". Check spelling or try a different keyword.`
                    : language === 'ar'
                    ? 'جرب تعديل خيارات الفلتر أو النطاق السعري لإظهار المزيد من المنتجات.'
                    : 'Try adjusting your filter options or price range.'}
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3">
                  {searchQuery.trim() && (
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setSearchParams((prev) => {
                          const next = new URLSearchParams(prev);
                          next.delete('search');
                          next.delete('q');
                          return next;
                        });
                      }}
                      className="px-5 py-2.5 rounded-full bg-ym-charcoal text-white font-bold text-xs uppercase tracking-wider hover:bg-black transition-all cursor-pointer shadow-sm"
                    >
                      {language === 'ar' ? 'إلغاء البحث' : 'Clear Search'}
                    </button>
                  )}
                  <button
                    onClick={handleReset}
                    className="px-5 py-2.5 rounded-full border border-slate-300 hover:border-black text-slate-700 hover:text-black font-bold text-xs uppercase tracking-wider transition-all cursor-pointer"
                  >
                    {t.clearAll}
                  </button>
                  <Link
                    to="/sourcing"
                    className="px-5 py-2.5 rounded-full bg-ym-lime text-black font-bold text-xs uppercase tracking-wider hover:bg-black hover:text-white transition-all shadow-sm"
                  >
                    {language === 'ar' ? 'طلب خاص باللينك' : 'Request by Link'}
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
