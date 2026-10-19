import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowLeft, Trophy } from 'lucide-react';
import { products } from '../../data/products';
import { ProductCard } from '../product/ProductCard';
import { useLanguageStore } from '../../store/languageStore';
import { translations } from '../../data/translations';

export const FootballSection: React.FC = () => {
  const { language, isRTL } = useLanguageStore();
  
  const t = translations[language].sections;
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  const footballProducts = products.filter((p) => p.category === 'Football').slice(0, 4);

  return (
    <section className="relative py-24 sm:py-32 bg-[#09090b] text-white overflow-hidden">
      {/* Stadium Floodlights Effect */}
      <div className="absolute top-0 left-1/4 -translate-x-1/2 w-[500px] h-[350px] rounded-full bg-emerald-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute top-0 right-1/4 translate-x-1/2 w-[500px] h-[350px] rounded-full bg-sky-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff08_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none opacity-40" />

      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 md:px-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 border-b border-white/10 pb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-ym-lime text-xs font-black tracking-widest uppercase mb-3">
              <Trophy className="w-3.5 h-3.5" />
              <span>{language === 'en' ? 'EGYPTIAN FOOTBALL CULTURE' : 'ثقافة كرة القدم المصرية'}</span>
            </div>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight text-white font-display">
              {t.footballTitle}
            </h2>
            <p className="text-sm sm:text-base text-slate-400 mt-2 max-w-xl font-medium">
              {t.footballSubtitle}
            </p>
          </div>

          <Link
            to="/shop?category=Football"
            className="inline-flex items-center gap-3 px-7 py-4 rounded-full bg-ym-lime hover:bg-ym-lime-hover text-black text-xs sm:text-sm font-black tracking-wider uppercase transition-all shadow-[0_10px_25px_rgba(204,255,0,0.3)] hover:scale-[1.02]"
          >
            <span>{t.footballCta}</span>
            <ArrowIcon className="w-4 h-4 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
          </Link>
        </div>

        {/* Football Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {footballProducts.map((product) => (
            <div key={product.id} className="text-ym-charcoal">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
