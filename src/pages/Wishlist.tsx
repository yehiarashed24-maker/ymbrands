import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, Trash2, ShoppingBag, ArrowRight, ArrowLeft } from 'lucide-react';
import { useWishlistStore } from '@/store/wishlistStore';
import { useCartStore } from '@/store/cartStore';
import { useLanguageStore } from '@/store/languageStore';
import { translations } from '@/data/translations';

export const Wishlist: React.FC = () => {
  const navigate = useNavigate();
  const { language, isRTL } = useLanguageStore();
  const t = translations[language].wishlist;
  const curr = translations[language].hero.pricePrefix;

  const { items, removeItem, clearWishlist } = useWishlistStore();
  const { addItem } = useCartStore();

  const handleMoveToBag = (product: any) => {
    const defaultSize = product.sizes[0] || 'One Size';
    addItem(product, defaultSize);
    removeItem(product.id);
  };

  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  return (
    <div className="pt-28 sm:pt-32 pb-24 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 md:px-12">
        {/* Header */}
        <div className="flex items-end justify-between pb-8 border-b border-slate-100 mb-10">
          <div>
            <span className="text-xs font-black tracking-widest text-slate-400 uppercase">
              SAVED ITEMS
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-ym-charcoal uppercase tracking-tight font-display mt-1">
              {t.title} ({items.length})
            </h1>
          </div>

          {items.length > 0 && (
            <button
              onClick={clearWishlist}
              className="text-xs font-bold text-slate-400 hover:text-red-500 underline cursor-pointer"
            >
              Clear Wishlist
            </button>
          )}
        </div>

        {/* Wishlist Items Grid or Empty State */}
        {items.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {items.map((product) => (
              <div
                key={product.id}
                className="group relative flex flex-col bg-white rounded-2xl overflow-hidden border border-slate-100 hover:border-slate-300 shadow-sm transition-all"
              >
                {/* Image */}
                <div
                  onClick={() => navigate(`/product/${product.slug}`)}
                  className="relative aspect-square bg-slate-50 p-6 flex items-center justify-center cursor-pointer"
                >
                  <img
                    src={product.image}
                    alt={product.name[language]}
                    className="w-full h-full object-contain filter drop-shadow-md group-hover:scale-105 transition-transform duration-300"
                  />

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeItem(product.id);
                    }}
                    aria-label="Remove item"
                    className="absolute top-3 right-3 rtl:right-auto rtl:left-3 w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Details & Move To Bag CTA */}
                <div className="p-5 flex flex-col flex-1 justify-between gap-4">
                  <div>
                    <span className="text-[10px] font-black tracking-widest uppercase text-slate-400">
                      {product.brand}
                    </span>
                    <h3
                      onClick={() => navigate(`/product/${product.slug}`)}
                      className="text-sm sm:text-base font-extrabold text-ym-charcoal hover:text-sky-600 transition-colors truncate cursor-pointer mt-0.5"
                    >
                      {product.name[language]}
                    </h3>
                    <span className="text-base font-black text-ym-charcoal block mt-1 font-display">
                      {product.price.toLocaleString()} {curr}
                    </span>
                  </div>

                  <button
                    onClick={() => handleMoveToBag(product)}
                    className="w-full py-3 px-4 rounded-xl bg-ym-charcoal hover:bg-black text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
                  >
                    <ShoppingBag className="w-3.5 h-3.5 text-ym-lime" />
                    <span>{t.moveToBag}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-24 max-w-md mx-auto text-center flex flex-col items-center">
            <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mb-6">
              <Heart className="w-10 h-10 text-slate-300" />
            </div>
            <h2 className="text-2xl font-black uppercase tracking-tight text-ym-charcoal font-display mb-2">
              {t.emptyTitle}
            </h2>
            <p className="text-sm text-slate-500 mb-8 leading-relaxed">
              {t.emptySubtitle}
            </p>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-ym-charcoal hover:bg-black text-white font-black text-xs uppercase tracking-wider shadow-lg hover:scale-105 transition-all"
            >
              <span>{t.explore}</span>
              <ArrowIcon className="w-4 h-4 text-ym-lime" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
