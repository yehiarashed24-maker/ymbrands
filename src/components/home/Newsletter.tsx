import React, { useState } from 'react';
import { Mail, CheckCircle2, ArrowRight, ArrowLeft } from 'lucide-react';
import { useLanguageStore } from '../../store/languageStore';
import { translations } from '../../data/translations';

export const Newsletter: React.FC = () => {
  const { language, isRTL } = useLanguageStore();
  const t = translations[language].sections;
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim() && email.includes('@')) {
      setIsSubscribed(true);
    }
  };

  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  return (
    <section className="py-20 sm:py-28 bg-slate-50 border-b border-slate-100">
      <div className="max-w-4xl mx-auto px-5 sm:px-8 text-center">
        <div className="w-12 h-12 rounded-2xl bg-black text-ym-lime mx-auto flex items-center justify-center mb-6 shadow-sm">
          <Mail className="w-6 h-6" />
        </div>

        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-ym-charcoal uppercase tracking-tight font-display">
          {t.newsletterTitle}
        </h2>

        <p className="text-sm sm:text-base text-slate-500 max-w-lg mx-auto mt-3 font-medium leading-relaxed">
          {t.newsletterSubtitle}
        </p>

        {isSubscribed ? (
          <div className="mt-8 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl max-w-md mx-auto flex items-center justify-center gap-3 text-emerald-800 text-xs sm:text-sm font-bold">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{t.newsletterSuccess}</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-8 max-w-md mx-auto flex flex-col sm:flex-row gap-2">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t.newsletterPlaceholder}
              className="flex-1 px-5 py-4 rounded-full bg-white border border-slate-200 text-sm font-medium text-ym-charcoal placeholder:text-slate-400 outline-none focus:border-black shadow-sm"
            />
            <button
              type="submit"
              className="px-8 py-4 bg-ym-charcoal hover:bg-black text-white text-xs font-black tracking-wider uppercase rounded-full transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{t.newsletterButton}</span>
              <ArrowIcon className="w-3.5 h-3.5 text-ym-lime" />
            </button>
          </form>
        )}
      </div>
    </section>
  );
};
