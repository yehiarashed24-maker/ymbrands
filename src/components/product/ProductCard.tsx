import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, ShoppingBag, Eye, Check } from 'lucide-react';
import { Product } from '../../types/product';
import { useLanguageStore } from '../../store/languageStore';
import { translations } from '../../data/translations';
import { useWishlistStore } from '../../store/wishlistStore';
import { useCartStore } from '../../store/cartStore';

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onQuickView }) => {
  const navigate = useNavigate();
  const { language } = useLanguageStore();
  const t = translations[language].product;
  const curr = translations[language].hero.pricePrefix;

  const { toggleWishlist, isInWishlist } = useWishlistStore();
  const { addItem } = useCartStore();

  const isFavorited = isInWishlist(product.id);
  const [showSizePicker, setShowSizePicker] = useState(false);
  const [addedSuccess, setAddedSuccess] = useState(false);

  const handleCardClick = () => {
    navigate(`/product/${product.slug}`);
  };

  const handleSizeSelect = (size: number | string, e: React.MouseEvent) => {
    e.stopPropagation();
    addItem(product, size);
    setShowSizePicker(false);
    setAddedSuccess(true);
    setTimeout(() => setAddedSuccess(false), 1500);
  };

  const handleDirectAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (product.sizes.length === 1) {
      addItem(product, product.sizes[0]);
      setAddedSuccess(true);
      setTimeout(() => setAddedSuccess(false), 1500);
    } else {
      setShowSizePicker(!showSizePicker);
    }
  };

  return (
    <div className="group relative flex flex-col bg-white rounded-2xl overflow-hidden border border-slate-200/80 hover:border-slate-400 shadow-xs hover:shadow-xl transition-[box-shadow,border-color] duration-200 ease-out transform-gpu">
      {/* Product Image Container */}
      <div
        onClick={handleCardClick}
        className="relative w-full aspect-square bg-slate-50/80 overflow-hidden flex items-center justify-center p-6 cursor-pointer"
      >
        {/* Badges */}
        <div className="absolute top-3 left-3 rtl:left-auto rtl:right-3 z-10 flex flex-col gap-1.5">
          {product.isByOrder ? (
            <span className="px-2.5 py-1 rounded-full bg-amber-500 text-white text-[10px] font-black tracking-wider uppercase">
              BY ORDER
            </span>
          ) : (
            <span className="px-2.5 py-1 rounded-full bg-emerald-500 text-white text-[10px] font-black tracking-wider uppercase">
              IMMEDIATE
            </span>
          )}
          {product.isBestSeller && !product.isByOrder && (
            <span className="px-2.5 py-1 rounded-full bg-sky-500 text-white text-[10px] font-black tracking-wider uppercase">
              POPULAR
            </span>
          )}
        </div>

        {/* Wishlist Heart Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product);
          }}
          aria-label="Save to wishlist"
          className={`absolute top-3 right-3 rtl:right-auto rtl:left-3 z-10 w-9 h-9 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
            isFavorited
              ? 'bg-red-50 text-red-500'
              : 'bg-white/95 text-slate-500 hover:text-black hover:bg-white shadow-xs'
          }`}
        >
          <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current text-red-500' : ''}`} />
        </button>

        {/* Main Product Image (Ultra-smooth 60/120fps hardware-accelerated hover) */}
        <img
          src={product.image}
          alt={product.name[language]}
          className="w-full h-full object-contain filter drop-shadow-sm group-hover:scale-105 transition-transform duration-200 ease-out will-change-transform transform-gpu select-none"
          loading="lazy"
          draggable={false}
        />

        {/* Quick View Hover Button (Desktop) */}
        {onQuickView && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onQuickView(product);
            }}
            className="absolute bottom-3 inset-x-6 hidden sm:flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white text-ym-charcoal text-xs font-bold uppercase tracking-wider opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-[opacity,transform,background-color] duration-200 shadow-md hover:bg-black hover:text-white cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>{t.quickView}</span>
          </button>
        )}

        {/* Size Selection Overlay when user clicks Add */}
        {showSizePicker && (
          <div
            onClick={(e) => e.stopPropagation()}
            className="absolute inset-0 bg-white/95 backdrop-blur-sm p-4 z-20 flex flex-col justify-between"
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-[11px] font-black uppercase tracking-wider text-ym-charcoal">
                {t.selectSize}
              </span>
              <button
                onClick={() => setShowSizePicker(false)}
                className="text-xs text-slate-400 hover:text-black font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-4 gap-2 my-auto">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  onClick={(e) => handleSizeSelect(size, e)}
                  className="py-2 rounded-lg border border-slate-200 hover:border-black hover:bg-ym-lime text-xs font-black text-ym-charcoal transition-all cursor-pointer"
                >
                  {size}
                </button>
              ))}
            </div>

            <span className="text-[10px] text-center text-slate-400 font-medium">
              100% Authentic • Fast Egypt Delivery
            </span>
          </div>
        )}
      </div>

      {/* Product Details Panel */}
      <div className="p-5 flex flex-col flex-1 justify-between gap-3">
        <div>
          <div className="flex items-center justify-between text-[11px] font-black tracking-widest text-slate-400 uppercase">
            <span>{product.brand}</span>
            <span>{product.gender}</span>
          </div>

          <h3
            onClick={handleCardClick}
            className="text-sm sm:text-base font-extrabold text-ym-charcoal group-hover:text-sky-700 transition-colors mt-1 cursor-pointer line-clamp-1"
          >
            {product.name[language]}
          </h3>

          <p className="text-xs text-slate-500 font-medium mt-0.5 line-clamp-1">
            {product.subCategory || product.category}
          </p>
        </div>

        {/* Price & Add to Bag Trigger */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 mt-auto">
          <div>
            <span className="text-base sm:text-lg font-black text-ym-charcoal font-display">
              {product.price.toLocaleString()} <span className="text-xs font-bold text-slate-500">{curr}</span>
            </span>
            {product.originalPrice && (
              <span className="block text-[11px] text-slate-400 line-through">
                {product.originalPrice.toLocaleString()} {curr}
              </span>
            )}
          </div>

          <button
            onClick={handleDirectAdd}
            aria-label="Add to bag"
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer ${
              addedSuccess
                ? 'bg-emerald-600 text-white'
                : 'bg-ym-charcoal hover:bg-ym-lime text-white hover:text-black shadow-md'
            }`}
          >
            {addedSuccess ? <Check className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
};
