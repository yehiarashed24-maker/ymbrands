import React from 'react';
import { Star, CheckCircle2 } from 'lucide-react';
import { testimonials } from '../../data/testimonials';
import { useLanguageStore } from '../../store/languageStore';
import { translations } from '../../data/translations';

export const Testimonials: React.FC = () => {
  const { language } = useLanguageStore();
  const t = translations[language].sections;

  return (
    <section className="py-20 sm:py-28 bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 md:px-12">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-ym-charcoal uppercase tracking-tight font-display">
            {t.testimonialsTitle}
          </h2>
          <p className="text-sm sm:text-base text-slate-500 font-medium mt-2">
            {t.testimonialsSubtitle}
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((review) => (
            <div
              key={review.id}
              className="p-6 rounded-3xl bg-slate-50 border border-slate-100 hover:border-slate-300 hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* 5 Stars */}
                <div className="flex items-center gap-1 mb-4 text-amber-400">
                  {Array.from({ length: review.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>

                {/* Quote */}
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium mb-6">
                  &ldquo;{review.quote[language]}&rdquo;
                </p>
              </div>

              {/* Author & Verification */}
              <div className="pt-4 border-t border-slate-200/60">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-black text-ym-charcoal">
                      {review.author[language]}
                    </h4>
                    <span className="text-[11px] text-slate-500 block">
                      {review.location[language]}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>{language === 'en' ? 'Verified' : 'مشتري موثق'}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
