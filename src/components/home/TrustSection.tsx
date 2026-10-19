import React from 'react';
import { ShieldCheck, Truck, RefreshCw, CreditCard } from 'lucide-react';
import { useLanguageStore } from '../../store/languageStore';

export const TrustSection: React.FC = () => {
  const { language } = useLanguageStore();

  const benefits = [
    {
      icon: ShieldCheck,
      title: { en: '100% Authentic', ar: 'أصلي 100٪' },
      description: {
        en: 'Directly sourced with factory barcodes & serial codes.',
        ar: 'مستورد مباشرة مع سيريال المصنع وباركود التحقق.',
      },
    },
    {
      icon: Truck,
      title: { en: 'Fast Delivery', ar: 'شحن سريع' },
      description: {
        en: 'In-stock in 2-3 days, By-Order in 30-35 days.',
        ar: 'الفوري خلال ٢-٣ أيام، والباي أوردر خلال ٣٠-٣٥ يوماً.',
      },
    },
    {
      icon: RefreshCw,
      title: { en: 'Doorstep Inspection', ar: 'معاينة مع المندوب' },
      description: {
        en: 'Inspect in-stock pairs with courier upon delivery.',
        ar: 'معاينة المنتجات الفوري مع المندوب وقت الاستلام مباشرة.',
      },
    },
    {
      icon: CreditCard,
      title: { en: 'InstaPay & COD', ar: 'إنستاباي والدفع كاش' },
      description: {
        en: 'Cash on delivery across Egypt or InstaPay transfer.',
        ar: 'الدفع عند الاستلام كاش في مصر أو تحويل إنستاباي.',
      },
    },
  ];

  return (
    <section className="py-14 sm:py-16 bg-slate-50 border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 md:px-12">
        {/* Compact Headline */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="inline-block text-[11px] font-black tracking-widest text-slate-500 uppercase mb-1.5 font-display">
            {language === 'en' ? 'YM AUTHENTICITY PROMISE' : 'ميثاق الأصالة من YM'}
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-ym-charcoal uppercase tracking-tight font-display leading-tight">
            {language === 'en' ? (
              <>
                100% ORIGINAL. <br className="hidden sm:inline" />
                NO COMPROMISE.
              </>
            ) : (
              <>
                أصلي 100٪. <br className="hidden sm:inline" />
                بلا أي تنازل.
              </>
            )}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-2">
            {language === 'en'
              ? 'Original sneakers and sportswear delivered across Egypt.'
              : 'أحذية رياضية وملابس أصلية 100٪ تصلك إلى باب بيتك في أي مكان بمصر.'}
          </p>
        </div>

        {/* 4 Compact Benefits */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {benefits.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-100 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col items-center sm:items-start text-center sm:text-left rtl:sm:text-right"
              >
                <div className="w-10 h-10 rounded-xl bg-ym-charcoal text-ym-lime flex items-center justify-center mb-4 shrink-0 shadow-xs">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-sm sm:text-base font-black text-ym-charcoal uppercase tracking-tight mb-1 font-display">
                  {item.title[language]}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">
                  {item.description[language]}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
