import { create } from 'zustand';

export type Language = 'en' | 'ar';

interface LanguageState {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  isRTL: boolean;
}

const getInitialLanguage = (): Language => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('ym_language') as Language;
    if (saved === 'en' || saved === 'ar') return saved;
  }
  return 'en';
};

export const useLanguageStore = create<LanguageState>((set, get) => ({
  language: getInitialLanguage(),
  isRTL: getInitialLanguage() === 'ar',
  setLanguage: (lang: Language) => {
    localStorage.setItem('ym_language', lang);
    if (typeof document !== 'undefined') {
      document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
      document.documentElement.lang = lang;
      if (lang === 'ar') {
        document.body.classList.add('font-arabic');
      } else {
        document.body.classList.remove('font-arabic');
      }
    }
    set({ language: lang, isRTL: lang === 'ar' });
  },
  toggleLanguage: () => {
    const nextLang = get().language === 'en' ? 'ar' : 'en';
    get().setLanguage(nextLang);
  },
}));
