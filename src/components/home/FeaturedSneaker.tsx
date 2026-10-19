import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Info, X, ShoppingBag } from 'lucide-react';
import { products } from '../../data/products';
import { ProductHotspot } from '../../types/product';
import { useLanguageStore } from '../../store/languageStore';
import { translations } from '../../data/translations';
import { useCartStore } from '../../store/cartStore';

export const FeaturedSneaker: React.FC = () => {
  const { language, isRTL } = useLanguageStore();
  
  const t = translations[language].sections;
  
  // Use Samba or fallback
  const featuredProduct = products.find(p => p.id === 3) || products[0]; // Hero shoe with hotspots
  const prod = featuredProduct;
  const { addItem } = useCartStore();

  const [activeHotspot, setActiveHotspot] = useState<ProductHotspot | null>(
    prod.hotspots ? prod.hotspots[0] : null
  );

  const handleAddFeatured = () => {
    addItem(prod, 42);
  };

  return (
    <section className="py-24 sm:py-32 bg-gradient-to-b from-white via-slate-50 to-white overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 md:px-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-black tracking-widest uppercase mb-3">
            <Sparkles className="w-3.5 h-3.5 text-ym-lime" />
            <span>{language === 'en' ? 'PRODUCT ANATOMY' : 'تشريح الابتكار الرياضي'}</span>
          </span>
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-black text-ym-charcoal uppercase tracking-tight font-display">
            {t.featuredTitle}
          </h2>
          <p className="text-sm sm:text-base text-slate-500 font-medium mt-3">
            {t.featuredSubtitle}
          </p>
        </div>

        {/* Interactive Showcase Canvas */}
        <div className="relative max-w-4xl mx-auto w-full aspect-[4/3] sm:aspect-[16/9] flex items-center justify-center p-4">
          {/* Subtle Ambient Rings */}
          <div className="absolute w-[80%] h-[80%] rounded-full border border-slate-200/80 animate-pulse-subtle pointer-events-none" />
          <div className="absolute w-[60%] h-[60%] rounded-full border border-dashed border-slate-200 pointer-events-none" />

          {/* Centered Sneaker */}
          <div className="relative z-10 w-full max-w-2xl flex items-center justify-center">
            <img
              src={prod.image}
              alt={prod.name[language]}
              className="w-full h-auto object-contain filter drop-shadow-[0_25px_40px_rgba(0,0,0,0.18)] select-none pointer-events-none"
            />

            {/* Clickable Hotspot Pins */}
            {prod.hotspots?.map((hotspot) => {
              const isSelected = activeHotspot?.id === hotspot.id;

              return (
                <div
                  key={hotspot.id}
                  style={{ top: `${hotspot.y}%`, left: `${hotspot.x}%` }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 z-30"
                >
                  <button
                    onClick={() => setActiveHotspot(isSelected ? null : hotspot)}
                    aria-label={hotspot.title[language]}
                    className="group relative flex items-center justify-center cursor-pointer"
                  >
                    {/* Pulsing beacon */}
                    <span
                      className={`absolute w-8 h-8 rounded-full transition-all duration-300 ${
                        isSelected
                          ? 'bg-ym-lime/80 scale-125 animate-ping'
                          : 'bg-black/20 group-hover:scale-110'
                      }`}
                    />
                    {/* Center Dot */}
                    <span
                      className={`relative w-6 h-6 rounded-full flex items-center justify-center text-xs font-black shadow-lg transition-all ${
                        isSelected
                          ? 'bg-ym-lime text-black scale-110'
                          : 'bg-ym-charcoal text-white group-hover:bg-black'
                      }`}
                    >
                      <Info className="w-3.5 h-3.5" />
                    </span>
                  </button>
                </div>
              );
            })}
          </div>

          {/* Active Hotspot Glassmorphic Card (Floating Overlay) */}
          <AnimatePresence>
            {activeHotspot && (
              <motion.div
                initial={{ opacity: 0, y: 15, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 15, scale: 0.95 }}
                transition={{ duration: 0.25 }}
                className="absolute bottom-4 left-4 right-4 sm:left-auto sm:right-8 sm:bottom-8 sm:max-w-xs z-40 bg-white/90 backdrop-blur-xl border border-white/80 shadow-2xl rounded-2xl p-5"
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="text-[10px] font-black uppercase tracking-widest text-sky-600">
                    FEATURE BREAKDOWN
                  </span>
                  <button
                    onClick={() => setActiveHotspot(null)}
                    className="text-slate-400 hover:text-black cursor-pointer p-0.5"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                <h4 className="text-base font-extrabold text-ym-charcoal mt-1 font-display">
                  {activeHotspot.title[language]}
                </h4>

                <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                  {activeHotspot.description[language]}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Bottom Fast Action Bar */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={handleAddFeatured}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-ym-charcoal hover:bg-black text-white text-xs sm:text-sm font-black tracking-wider uppercase transition-all shadow-lg hover:scale-[1.02] cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4 text-ym-lime" />
            <span>
              {language === 'en'
                ? `ADD TO BAG • ${prod.price.toLocaleString()} EGP`
                : `أضف إلى السلة • ${prod.price.toLocaleString()} ج.م`}
            </span>
          </button>
        </div>
      </div>
    </section>
  );
};
