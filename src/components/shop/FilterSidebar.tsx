import React from 'react';
import { X } from 'lucide-react';
import { useLanguageStore } from '../../store/languageStore';
import { translations } from '../../data/translations';
import { FilterState } from '../../types/product';

interface FilterSidebarProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  onReset: () => void;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  filters,
  onFilterChange,
  onReset,
  isOpenMobile,
  onCloseMobile,
}) => {
  const { language } = useLanguageStore();
  const t = translations[language].shop;
  const curr = translations[language].hero.pricePrefix;

  const categories = [
    'All',
    'Sportswear',
    'Sport Shoes',
    'Sneakers',
    'Accessories',
  ];
  const brands = ['NIKE', 'JORDAN', 'ADIDAS', 'PUMA', 'NEW BALANCE', 'UNDER ARMOUR', 'WILSON'];
  const genders = ['Men', 'Women', 'Unisex', 'Kids'];
  const sizes = [38, 39, 40, 41, 42, 43, 44, 45, 46, 'S', 'M', 'L', 'XL', 'XXL'];

  const categoryLabels: Record<string, { en: string; ar: string }> = {
    All: { en: 'All Categories', ar: 'جميع الأقسام' },
    Sportswear: { en: '👕 Sportswear (Apparel & Tracksuits)', ar: '👕 ملابس وترنجات رياضية' },
    'Sport Shoes': { en: '⚽ Sport Shoes (Football, Basket, Running)', ar: '⚽ أحذية رياضية (كورة وباسكت وجري)' },
    Sneakers: { en: '👟 Sneakers (Lifestyle & Classics)', ar: '👟 سنيكرز لايف ستايل' },
    Accessories: { en: '🎒 Accessories (Bags, Balls, Caps)', ar: '🎒 إكسسوارات ومعدات' },
  };

  const toggleBrand = (brand: string) => {
    const exists = filters.brand.includes(brand);
    const updated = exists
      ? filters.brand.filter((b) => b !== brand)
      : [...filters.brand, brand];
    onFilterChange({ ...filters, brand: updated });
  };

  const toggleGender = (gender: string) => {
    const exists = filters.gender.includes(gender);
    const updated = exists
      ? filters.gender.filter((g) => g !== gender)
      : [...filters.gender, gender];
    onFilterChange({ ...filters, gender: updated });
  };

  const toggleSize = (size: number | string) => {
    const exists = filters.sizes.includes(size);
    const updated = exists
      ? filters.sizes.filter((s) => s !== size)
      : [...filters.sizes, size];
    onFilterChange({ ...filters, sizes: updated });
  };

  const content = (
    <div className="space-y-8 text-xs select-none">
      {/* Top Header with Reset */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <h3 className="text-sm font-black tracking-wider uppercase text-ym-charcoal font-display">
          {t.filter}
        </h3>
        <button
          onClick={onReset}
          className="text-xs font-bold text-slate-500 hover:text-black underline cursor-pointer"
        >
          {t.clearAll}
        </button>
      </div>

      {/* Category List */}
      <div>
        <h4 className="text-xs font-black uppercase tracking-wider text-ym-charcoal mb-3">
          {t.categories}
        </h4>
        <div className="space-y-1.5">
          {categories.map((cat) => {
            const isSelected = filters.category === cat || (cat === 'All' && !filters.category);
            const label = categoryLabels[cat]
              ? categoryLabels[cat][language]
              : cat;
            return (
              <button
                key={cat}
                onClick={() => onFilterChange({ ...filters, category: cat === 'All' ? '' : cat })}
                className={`w-full text-left rtl:text-right py-2 px-3 rounded-xl font-bold transition-all cursor-pointer flex items-center justify-between ${
                  isSelected
                    ? 'bg-ym-charcoal text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-black'
                }`}
              >
                <span>{label}</span>
                {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-ym-lime" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Brand Filters */}
      <div>
        <h4 className="text-xs font-black uppercase tracking-wider text-ym-charcoal mb-3">
          {t.brands}
        </h4>
        <div className="space-y-2">
          {brands.map((brand) => {
            const isChecked = filters.brand.includes(brand);
            return (
              <label
                key={brand}
                className="flex items-center gap-2.5 cursor-pointer font-bold text-slate-700 hover:text-black"
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => toggleBrand(brand)}
                  className="rounded border-slate-300 text-black focus:ring-black accent-ym-charcoal cursor-pointer w-4 h-4"
                />
                <span>{brand}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Gender Filters */}
      <div>
        <h4 className="text-xs font-black uppercase tracking-wider text-ym-charcoal mb-3">
          {t.genders}
        </h4>
        <div className="space-y-2">
          {genders.map((gender) => {
            const isChecked = filters.gender.includes(gender);
            return (
              <label
                key={gender}
                className="flex items-center gap-2.5 cursor-pointer font-bold text-slate-700 hover:text-black"
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => toggleGender(gender)}
                  className="rounded border-slate-300 text-black focus:ring-black accent-ym-charcoal cursor-pointer w-4 h-4"
                />
                <span>{gender}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Max Price Slider */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-xs font-black uppercase tracking-wider text-ym-charcoal">
            {t.price}
          </h4>
          <span className="font-bold text-ym-charcoal">
            Up to {filters.priceRange[1].toLocaleString()} {curr}
          </span>
        </div>
        <input
          type="range"
          min="800"
          max="12000"
          step="200"
          value={filters.priceRange[1]}
          onChange={(e) =>
            onFilterChange({
              ...filters,
              priceRange: [filters.priceRange[0], Number(e.target.value)],
            })
          }
          className="w-full accent-ym-charcoal cursor-pointer"
        />
      </div>

      {/* Size Grid */}
      <div>
        <h4 className="text-xs font-black uppercase tracking-wider text-ym-charcoal mb-3">
          {t.sizes}
        </h4>
        <div className="grid grid-cols-4 gap-1.5">
          {sizes.map((size) => {
            const isSelected = filters.sizes.includes(size);
            return (
              <button
                key={size}
                onClick={() => toggleSize(size)}
                className={`py-2 rounded-lg font-black text-center transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-ym-charcoal text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {size}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 shrink-0 pr-8 rtl:pr-0 rtl:pl-8 border-r rtl:border-r-0 rtl:border-l border-slate-200">
        {content}
      </aside>

      {/* Mobile Drawer */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-[120] lg:hidden overflow-hidden">
          <div
            onClick={onCloseMobile}
            className="absolute inset-0 bg-black/60 backdrop-blur-xs cursor-pointer"
          />
          <div className="fixed inset-y-0 left-0 rtl:left-auto rtl:right-0 max-w-xs sm:max-w-sm w-full bg-white shadow-2xl p-6 overflow-y-auto flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
                <span className="text-sm font-black uppercase tracking-wider text-ym-charcoal font-display">
                  {t.filter}
                </span>
                <button
                  onClick={onCloseMobile}
                  className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer"
                  aria-label="Close filters"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              {content}
            </div>

            {/* Sticky Bottom Apply Button for Mobile */}
            <div className="sticky bottom-0 pt-4 pb-1 bg-gradient-to-t from-white via-white to-white/90 border-t border-slate-100 mt-6 -mx-6 px-6">
              <button
                onClick={onCloseMobile}
                className="w-full py-3.5 rounded-2xl bg-ym-charcoal hover:bg-black text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{language === 'ar' ? 'تطبيق الفلاتر وعرض النتائج' : 'Apply & View Results'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
