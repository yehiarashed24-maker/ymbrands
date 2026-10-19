import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguageStore } from '../../store/languageStore';
import { ArrowRight, Search, Globe, ShieldCheck } from 'lucide-react';

export const SourcingSection: React.FC = () => {
  const { language } = useLanguageStore();

  const content = {
    en: {
      title: 'SPECIAL ORDER',
      subtitle: "CAN'T FIND YOUR DREAM SNEAKER?",
      desc: 'We source 100% authentic deadstock sneakers from around the globe. Tell us what you need, and we will bring it to Egypt.',
      btn: 'MAKE A REQUEST',
      features: ['Global Sourcing', '100% Authentic', 'Fast Delivery']
    },
    ar: {
      title: 'طلبات خاصة',
      subtitle: 'بتدور على سنيكرز معين ومش لاقيه؟',
      desc: 'بنجيبلك أي سنيكرز أصلي 100% من أي مكان في العالم لحد باب بيتك في مصر. قولنا بتدور على إيه وإحنا هنجيبه.',
      btn: 'اطلب دلوقتي',
      features: ['استيراد عالمي', 'أصلي 100%', 'توصيل سريع']
    }
  };

  const t = content[language];

  return (
    <section className="py-24 sm:py-32 bg-ym-charcoal text-white relative overflow-hidden">
      {/* Background Graphic */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden w-full">
        <div 
          className="text-[16vw] md:text-[14vw] font-black font-display tracking-tighter text-transparent leading-[0.85] rotate-[-5deg] select-none flex flex-col items-center" 
          style={{ WebkitTextStroke: '4px rgba(204, 255, 0, 0.9)' }}
        >
          <span>SPECIAL</span>
          <span>ORDER</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-5 sm:px-8 md:px-12 relative z-10 flex flex-col items-center text-center pt-48 sm:pt-64 md:pt-72">
        <h2 className="text-4xl md:text-5xl lg:text-7xl font-black font-display tracking-tighter uppercase mb-12 max-w-4xl">
          {t.subtitle}
        </h2>

        <Link
          to="/sourcing"
          className="group inline-flex items-center gap-3 bg-ym-lime text-black px-8 py-5 rounded-full font-black tracking-widest uppercase hover:bg-white transition-all hover:scale-105 active:scale-95 shadow-[0_0_40px_rgba(204,255,0,0.3)] mb-12"
        >
          {t.btn}
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </Link>

        <div className="flex flex-wrap justify-center gap-6 md:gap-10">
          {t.features.map((feat, i) => (
            <div key={i} className="flex items-center gap-2 text-sm md:text-base font-bold text-slate-400">
              {i === 0 && <Globe className="w-5 h-5 md:w-6 md:h-6 text-ym-lime" />}
              {i === 1 && <ShieldCheck className="w-5 h-5 md:w-6 md:h-6 text-ym-lime" />}
              {i === 2 && <Search className="w-5 h-5 md:w-6 md:h-6 text-ym-lime" />}
              {feat}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
