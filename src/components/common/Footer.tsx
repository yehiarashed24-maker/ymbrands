import React from 'react';
import { Link } from 'react-router-dom';
import { Globe, Instagram } from 'lucide-react';
import { useLanguageStore } from '../../store/languageStore';

export const Footer: React.FC = () => {
  const { language, toggleLanguage } = useLanguageStore();

  return (
    <footer className="bg-ym-charcoal text-white pt-8 pb-6 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 md:px-12">
        {/* Main compact grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 pb-6 border-b border-white/10">
          {/* Col 1: Brand & Region */}
          <div className="col-span-2 md:col-span-1 space-y-2.5">
            <Link to="/" className="inline-block">
              <span className="text-2xl font-black tracking-tighter text-white font-display uppercase">
                YM
              </span>
            </Link>
            <p className="text-xs text-slate-400 font-medium leading-relaxed max-w-xs">
              {language === 'en'
                ? 'Original sportswear & sneakers delivered across Egypt.'
                : 'أحذية وملابس رياضية أصلية 100٪ في مصر.'}
            </p>

            <div className="flex items-center gap-2 pt-0.5">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] font-bold text-slate-300">
                🇪🇬 Egypt — EGP
              </span>

              <button
                onClick={toggleLanguage}
                type="button"
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-[11px] font-bold text-slate-300 transition-colors cursor-pointer"
              >
                <Globe className="w-3 h-3 text-slate-400" />
                <span>{language === 'en' ? 'العربية' : 'EN'}</span>
              </button>
            </div>
          </div>

          {/* Col 2: SHOP */}
          <div>
            <h4 className="text-[11px] font-black tracking-widest text-slate-300 uppercase mb-2.5 font-display">
              {language === 'en' ? 'SHOP' : 'تسوق'}
            </h4>
            <ul className="space-y-1.5 text-xs font-medium text-slate-400">
              <li>
                <Link to="/sportswear" className="hover:text-white transition-colors">
                  {language === 'en' ? 'Sportswear' : 'ملابس رياضية'}
                </Link>
              </li>
              <li>
                <Link to="/sport-shoes" className="hover:text-white transition-colors">
                  {language === 'en' ? 'Sport Shoes' : 'أحذية رياضية'}
                </Link>
              </li>
              <li>
                <Link to="/sneakers" className="hover:text-white transition-colors">
                  {language === 'en' ? 'Sneakers' : 'سنيكرز'}
                </Link>
              </li>
              <li>
                <Link to="/sourcing" className="hover:text-ym-lime transition-colors">
                  {language === 'en' ? 'Sourcing (By Order)' : 'طلب خاص (Sourcing)'}
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: HELP & SUPPORT */}
          <div>
            <h4 className="text-[11px] font-black tracking-widest text-slate-300 uppercase mb-2.5 font-display">
              {language === 'en' ? 'HELP & SUPPORT' : 'المساعدة والدعم'}
            </h4>
            <ul className="space-y-1.5 text-xs font-medium text-slate-400">
              <li>
                <Link to="/faq" className="hover:text-white transition-colors">
                  {language === 'en' ? 'FAQ (Q&A)' : 'أسئلة وأجوبة'}
                </Link>
              </li>
              <li>
                <Link to="/reviews" className="hover:text-white transition-colors">
                  {language === 'en' ? 'Customer Reviews' : 'ريفيوهات العملاء'}
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors">
                  {language === 'en' ? 'Contact Us' : 'تواصل معنا'}
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: SOCIAL - Instagram ONLY */}
          <div>
            <h4 className="text-[11px] font-black tracking-widest text-slate-300 uppercase mb-2.5 font-display">
              {language === 'en' ? 'SOCIAL' : 'تابعنا'}
            </h4>
            <a
              href="https://instagram.com/ym_brands1"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-pink-500/50 text-xs font-semibold text-slate-300 hover:text-white transition-all group"
            >
              <Instagram className="w-3.5 h-3.5 text-pink-400 group-hover:scale-110 transition-transform" />
              <span>@ym_brands1</span>
            </a>
            <p className="text-[10px] text-slate-500 mt-2">
              {language === 'en' ? 'Official Instagram Account' : 'حساب الإنستجرام الرسمي'}
            </p>
          </div>
        </div>

        {/* Compact bottom bar */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-500 font-medium">
          <p>© {new Date().getFullYear()} YM. {language === 'en' ? 'All rights reserved.' : 'جميع الحقوق محفوظة.'}</p>
          <p>{language === 'en' ? '100% Original Products Guaranteed' : 'منتجات أصلية 100٪ مضمونة'}</p>
        </div>
      </div>
    </footer>
  );
};
