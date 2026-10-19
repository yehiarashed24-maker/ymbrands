import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, ArrowLeft } from 'lucide-react';
import { Product } from '../../types/product';
import { useLanguageStore } from '../../store/languageStore';
import { translations } from '../../data/translations';
import { useCartStore } from '../../store/cartStore';

interface HeroProductInfoProps {
  product: Product;
}

export const HeroProductInfo: React.FC<HeroProductInfoProps> = ({ product }) => {
  const navigate = useNavigate();
  const { language, isRTL } = useLanguageStore();
  const { addItem } = useCartStore();
  const t = translations[language].hero;

  const handleShopNow = () => {
    // If shoe has sizes, default to first popular size (e.g. 42) or navigate to product details
    const defaultSize = product.sizes[2] || product.sizes[0];
    addItem(product, defaultSize);
  };

  const handleExplore = () => {
    navigate('/shop');
  };

  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  return (
    <div className="relative z-[35] flex flex-col items-center md:items-start text-center md:text-left max-w-sm md:max-w-md w-full">
      {/* CTAs */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full">
        {/* Primary Electric Lime CTA */}
        <button
          onClick={handleShopNow}
          className="group relative w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 bg-ym-lime hover:bg-ym-lime-hover text-black font-extrabold text-xs sm:text-sm tracking-wider uppercase rounded-full shadow-[0_10px_25px_rgba(204,255,0,0.4)] hover:shadow-[0_15px_30px_rgba(204,255,0,0.6)] transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] cursor-pointer"
        >
          <span>{t.primaryCta}</span>
          <ArrowIcon className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
        </button>

        {/* Secondary Glass Transparent CTA */}
        <button
          onClick={() => navigate(`/product/${product.slug}`)}
          className="w-full sm:w-auto inline-flex items-center justify-center px-7 py-4 bg-white/70 hover:bg-white text-ym-charcoal font-bold text-xs sm:text-sm tracking-wider uppercase rounded-full border border-black/10 backdrop-blur-md hover:border-black/25 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
        >
          {t.secondaryCta}
        </button>
      </div>
    </div>
  );
};
