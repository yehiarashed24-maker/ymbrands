import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { products } from '../../data/products';
import { ProductCard } from '../product/ProductCard';
import { useLanguageStore } from '../../store/languageStore';
import { translations } from '../../data/translations';

export const BestSellers: React.FC = () => {
  const { language, isRTL } = useLanguageStore();
  
  const t = translations[language].sections;
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const bestSellers = products.filter((p) => p.isBestSeller);

  const handleScroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    const scrollAmount = 360;
    const modifier = direction === 'left' ? -1 : 1;
    const finalScroll = isRTL ? -modifier * scrollAmount : modifier * scrollAmount;

    scrollContainerRef.current.scrollBy({
      left: finalScroll,
      behavior: 'smooth',
    });
  };

  return (
    <section className="py-20 sm:py-28 bg-slate-50/70 border-b border-slate-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 md:px-12">
        {/* Header with Navigation Arrows */}
        <div className="flex items-end justify-between gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-black tracking-widest uppercase mb-3">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>{language === 'en' ? 'TRENDING NATIONWIDE' : 'الأكثر طلباً في مصر'}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-ym-charcoal uppercase tracking-tight font-display">
              {t.bestSellersTitle}
            </h2>
            <p className="text-sm sm:text-base text-slate-500 font-medium mt-1">
              {t.bestSellersSubtitle}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleScroll('left')}
              aria-label="Scroll left"
              className="w-11 h-11 rounded-full border border-slate-200 bg-white hover:bg-black hover:text-white flex items-center justify-center transition-all shadow-sm cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5 rtl:rotate-180" />
            </button>
            <button
              onClick={() => handleScroll('right')}
              aria-label="Scroll right"
              className="w-11 h-11 rounded-full border border-slate-200 bg-white hover:bg-black hover:text-white flex items-center justify-center transition-all shadow-sm cursor-pointer"
            >
              <ChevronRight className="w-5 h-5 rtl:rotate-180" />
            </button>
          </div>
        </div>

        {/* Scrollable Track */}
        <div
          ref={scrollContainerRef}
          className="flex gap-6 overflow-x-auto scrollbar-none pb-6 -mx-5 px-5 sm:-mx-8 sm:px-8 md:-mx-12 md:px-12 snap-x snap-mandatory"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {bestSellers.map((product) => (
            <div
              key={product.id}
              className="w-[280px] sm:w-[320px] md:w-[340px] shrink-0 snap-start"
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
