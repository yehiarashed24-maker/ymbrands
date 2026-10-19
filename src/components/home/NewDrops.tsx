import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowLeft, Sparkles } from 'lucide-react';
import { products } from '../../data/products';
import { ProductCard } from '../product/ProductCard';
import { useLanguageStore } from '../../store/languageStore';

export const NewDrops: React.FC = () => {
  const { language, isRTL } = useLanguageStore();
  
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  // Show exactly 4 concise, high-impact products
  const featuredList = products.filter((p) => p.isNew || p.isFeatured).slice(0, 4);

  return (
    <section id="featured-products" className="py-16 sm:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 md:px-12">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 sm:mb-12">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold tracking-widest uppercase mb-2 font-display">
              <Sparkles className="w-3.5 h-3.5 text-ym-lime fill-current" />
              <span>{language === 'en' ? 'JUST LANDED' : 'وصل حديثاً'}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-ym-charcoal uppercase tracking-tight font-display">
              {language === 'en' ? 'NEW & ORIGINAL' : 'جديد وأصلي'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
              {language === 'en'
                ? 'Handpicked original sneakers and authentic sportswear in Egypt'
                : 'أحدث السنيكرز الأصلية والملابس الرياضية المعتمدة في مصر'}
            </p>
          </div>

          <Link
            to="/shop?filter=new"
            className="group inline-flex items-center gap-2 text-xs sm:text-sm font-black text-ym-charcoal hover:text-sky-600 tracking-wider uppercase transition-colors"
          >
            <span>{language === 'en' ? 'EXPLORE ALL' : 'عرض الكل'}</span>
            <ArrowIcon className="w-4 h-4 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
          </Link>
        </div>

        {/* 4-column Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredList.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};
