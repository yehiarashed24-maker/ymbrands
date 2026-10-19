import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { useLanguageStore } from '../../store/languageStore';

export const PromoBanner: React.FC = () => {
  const { language, isRTL } = useLanguageStore();
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  return (
    <section className="relative py-24 sm:py-36 bg-ym-charcoal text-white overflow-hidden select-none">
      {/* Dynamic Animated Gradient Aura */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-gradient-to-r from-sky-500/20 via-pink-500/20 to-ym-lime/20 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto px-5 sm:px-8 text-center">
        <span className="inline-block text-xs font-black tracking-widest text-ym-lime uppercase mb-4">
          {language === 'en' ? 'SPECIAL DELIVERY OFFER' : 'عرض الشحن المجاني في مصر'}
        </span>

        {/* Massive Screen-Filling Typography */}
        <h2 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black uppercase tracking-tight leading-[0.95] font-display">
          {language === 'en' ? (
            <>
              YOUR NEXT PAIR <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-sky-300 to-ym-lime">
                IS WAITING.
              </span>
            </>
          ) : (
            <>
              حذائك القادم <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-sky-300 to-ym-lime">
                في انتظارك الآن
              </span>
            </>
          )}
        </h2>

        <p className="text-base sm:text-lg text-slate-400 max-w-xl mx-auto mt-6 font-medium">
          {language === 'en'
            ? 'Free express delivery across Cairo, Alexandria & all governorates on orders above EGP 3,000.'
            : 'شحن مجاني وسريع للقاهرة والإسكندرية وجميع محافظات مصر للطلبات التي تتعدى 3,000 جنيه.'}
        </p>

        <div className="mt-10 flex justify-center">
          <Link
            to="/shop"
            className="group inline-flex items-center gap-3 px-9 py-4 rounded-full bg-ym-lime hover:bg-ym-lime-hover text-black text-xs sm:text-sm font-black tracking-wider uppercase transition-all shadow-[0_10px_25px_rgba(204,255,0,0.4)] hover:scale-105"
          >
            <span>{language === 'en' ? 'SHOP ALL PRODUCTS' : 'تسوق كل الموديلات'}</span>
            <ArrowIcon className="w-4 h-4 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
};
