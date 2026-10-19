import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Heart,
  ShoppingBag,
  ShieldCheck,
  Truck,
  RefreshCw,
  Star,
  ChevronDown,
  ArrowRight,
  ArrowLeft,
  CreditCard,
  Sparkles,
  Package,
} from 'lucide-react';
import { useProductStore } from '@/store/productStore';
import { ProductGallery } from '@/components/product/ProductGallery';
import { SizeSelector } from '@/components/product/SizeSelector';
import { ProductCard } from '@/components/product/ProductCard';
import { useLanguageStore } from '@/store/languageStore';
import { translations } from '@/data/translations';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';

export const ProductDetails: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { language, isRTL } = useLanguageStore();
  const t = translations[language].product;
  const curr = translations[language].hero.pricePrefix;

  const products = useProductStore((state) => state.products);
  const product = products.find((p) => p.slug === slug);

  const { addItem } = useCartStore();
  const { toggleWishlist, isInWishlist } = useWishlistStore();

  const [selectedSize, setSelectedSize] = useState<number | string | null>(null);
  const [selectedColorIdx, setSelectedColorIdx] = useState(0);
  const [showSizeError, setShowSizeError] = useState(false);
  const [quantity, setQuantity] = useState(1);

  // Accordion open states
  const [openAccordion, setOpenAccordion] = useState<string | null>('details');

  if (!product) {
    return (
      <div className="pt-36 pb-24 min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
        <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mb-4">
          <Package className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-black uppercase text-ym-charcoal font-display mb-2">
          {language === 'ar' ? 'المنتج غير متوفر' : 'Product Not Found'}
        </h2>
        <p className="text-slate-500 text-sm max-w-md mb-6 font-medium">
          {language === 'ar'
            ? 'تم حذف المنتجات السابقة أو هذا الموديل غير متوفر حالياً.'
            : 'This product is currently unavailable or has been cleared.'}
        </p>
        <Link
          to="/shop"
          className="px-6 py-3.5 rounded-full bg-ym-charcoal text-white font-bold text-xs uppercase tracking-wider hover:bg-black transition-all shadow-md"
        >
          {language === 'ar' ? 'العودة للمتجر' : 'Back to Shop'}
        </Link>
      </div>
    );
  }

  const isFavorited = isInWishlist(product.id);

  // Related products
  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const handleAddToBag = () => {
    if (!selectedSize) {
      setShowSizeError(true);
      return;
    }
    setShowSizeError(false);
    for (let i = 0; i < quantity; i++) {
      addItem(product, selectedSize, product.colors[selectedColorIdx]?.name[language]);
    }
  };

  const handleBuyNow = () => {
    if (!selectedSize) {
      setShowSizeError(true);
      return;
    }
    setShowSizeError(false);
    addItem(product, selectedSize, product.colors[selectedColorIdx]?.name[language]);
    navigate('/checkout');
  };

  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  return (
    <div className="pt-28 sm:pt-32 pb-24 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 md:px-12">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase mb-8">
          <Link to="/" className="hover:text-black">
            Home
          </Link>
          <span>/</span>
          <Link to={`/shop?category=${product.category}`} className="hover:text-black">
            {product.category}
          </Link>
          <span>/</span>
          <span className="text-ym-charcoal truncate max-w-[200px] sm:max-w-none">
            {product.name[language]}
          </span>
        </div>

        {/* Product Details Layout: 60% Gallery / 40% Info */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Sticky Gallery (7 cols = ~60%) */}
          <div className="lg:col-span-7 lg:sticky lg:top-28">
            <ProductGallery images={product.images} productName={product.name[language]} />
          </div>

          {/* Right Column: Product Actions & Specs (5 cols = ~40%) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Brand and Stock Status */}
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full bg-black text-ym-lime text-[11px] font-black tracking-widest uppercase">
                {product.brand}
              </span>

              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>{product.inStock ? t.inStock : t.outOfStock}</span>
              </div>
            </div>

            {/* Product Title */}
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-ym-charcoal uppercase tracking-tight font-display">
                {product.name[language]}
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 font-bold uppercase tracking-wider mt-1">
                {product.subCategory || product.category} • {product.gender}
              </p>
            </div>

            {/* Ratings Bar */}
            <div className="flex items-center gap-3">
              <div className="flex items-center text-amber-400">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <span className="text-xs font-bold text-slate-600">
                {product.rating} ({product.reviewCount} {t.reviews})
              </span>
            </div>

            {/* Price Display */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-baseline justify-between">
              <div>
                <span className="text-2xl sm:text-3xl font-black text-ym-charcoal font-display">
                  {product.price.toLocaleString()} <span className="text-base font-bold text-slate-600">{curr}</span>
                </span>
                {product.originalPrice && (
                  <span className="ml-3 rtl:ml-0 rtl:mr-3 text-sm text-slate-400 line-through font-bold">
                    {product.originalPrice.toLocaleString()} {curr}
                  </span>
                )}
              </div>

              <span className="text-[11px] font-bold text-slate-500 uppercase">
                Includes VAT in Egypt
              </span>
            </div>

            {/* Color Swatches */}
            {product.colors && product.colors.length > 0 && (
              <div>
                <label className="text-xs font-black uppercase tracking-wider text-ym-charcoal block mb-2.5">
                  {t.colors}: <span className="text-slate-500">{product.colors[selectedColorIdx]?.name[language]}</span>
                </label>
                <div className="flex items-center gap-2.5">
                  {product.colors.map((c, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedColorIdx(idx)}
                      className={`w-9 h-9 rounded-full border-2 transition-all p-0.5 cursor-pointer flex items-center justify-center ${
                        selectedColorIdx === idx ? 'border-black ring-2 ring-black' : 'border-slate-300'
                      }`}
                    >
                      <span
                        className="w-full h-full rounded-full"
                        style={{ backgroundColor: c.hex }}
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size Selector */}
            <SizeSelector
              sizes={product.sizes}
              selectedSize={selectedSize}
              onSelectSize={(size) => {
                setSelectedSize(size);
                setShowSizeError(false);
              }}
              showError={showSizeError}
            />

            {/* Action Buttons: Add to Bag, Buy Now, Wishlist */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3">
                {/* Add to Bag Button */}
                <button
                  onClick={handleAddToBag}
                  className="flex-1 py-4 px-6 rounded-full bg-ym-lime hover:bg-ym-lime-hover text-black font-black text-xs sm:text-sm tracking-wider uppercase flex items-center justify-center gap-2 shadow-[0_8px_20px_rgba(204,255,0,0.35)] transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>{t.addToBag}</span>
                </button>

                {/* Wishlist Button */}
                <button
                  onClick={() => toggleWishlist(product)}
                  aria-label="Wishlist"
                  className={`w-14 h-14 rounded-full border border-slate-200 flex items-center justify-center transition-all cursor-pointer ${
                    isFavorited
                      ? 'bg-red-50 text-red-500 border-red-200'
                      : 'bg-white hover:bg-slate-50 text-slate-600 hover:text-black'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${isFavorited ? 'fill-current text-red-500' : ''}`} />
                </button>
              </div>

              {/* Buy Now Direct Button */}
              <button
                onClick={handleBuyNow}
                className="w-full py-4 px-6 rounded-full bg-ym-charcoal hover:bg-black text-white font-black text-xs sm:text-sm tracking-wider uppercase transition-all shadow-md cursor-pointer"
              >
                {t.buyNow}
              </button>
            </div>

            {/* Quick Guarantees Pill */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 divide-y divide-slate-200/60 text-xs text-slate-600">
              <div className="flex items-center gap-3 py-2">
                <ShieldCheck className="w-4 h-4 text-ym-lime bg-black p-0.5 rounded" />
                <span className="font-bold text-ym-charcoal">100% Authentic with Serial Number</span>
              </div>
              <div className="flex items-center gap-3 py-2">
                <Truck className="w-4 h-4 text-sky-600" />
                <span>
                  {language === 'en' 
                    ? 'In-stock: 2-3 days • By-Order: 30-35 days' 
                    : 'فوري: 2-3 أيام • باي أوردر: 30-35 يوم'}
                </span>
              </div>
              <div className="flex items-center gap-3 py-2">
                <RefreshCw className="w-4 h-4 text-slate-600" />
                <span>
                  {language === 'en'
                    ? 'Inspection with courier • By-order non-returnable'
                    : 'المعاينة مع المندوب فقط • الباي أوردر لا يُسترجع'}
                </span>
              </div>
            </div>

            {/* Accordion Tabs */}
            <div className="divide-y divide-slate-200 border-y border-slate-200 pt-2">
              {/* Product Details */}
              <div className="py-3">
                <button
                  onClick={() =>
                    setOpenAccordion(openAccordion === 'details' ? null : 'details')
                  }
                  className="w-full flex items-center justify-between text-xs font-black uppercase tracking-wider text-ym-charcoal py-1 cursor-pointer"
                >
                  <span>{t.details}</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${
                      openAccordion === 'details' ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {openAccordion === 'details' && (
                  <div className="pt-3 pb-2 text-xs text-slate-600 space-y-2 leading-relaxed">
                    <p>{product.description[language]}</p>
                    <ul className="list-disc list-inside space-y-1 pt-2 font-medium">
                      {product.details[language]?.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Authenticity Guarantee */}
              <div className="py-3">
                <button
                  onClick={() =>
                    setOpenAccordion(openAccordion === 'auth' ? null : 'auth')
                  }
                  className="w-full flex items-center justify-between text-xs font-black uppercase tracking-wider text-ym-charcoal py-1 cursor-pointer"
                >
                  <span>{t.authenticity}</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${
                      openAccordion === 'auth' ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {openAccordion === 'auth' && (
                  <div className="pt-3 pb-2 text-xs text-slate-600 leading-relaxed font-medium">
                    {language === 'en'
                      ? 'Every sneaker and item in YM Egypt inventory is sourced directly through brand-authorized partners. Each pair undergoes thorough inspection including material quality, stitching gauge, barcode matching, and internal manufacture serials before delivery.'
                      : 'جميع المنتجات المتوفرة في YM مصر مستوردة من الموزعين المعتمدين رسمياً للعلامات التجارية العالمية. كل زوج يمر بفحص دقيق يشمل خامة التصنيع، كود الباركود، ورقم السيريال الداخلي قبل خروجه من مخازننا في القاهرة.'}
                  </div>
                )}
              </div>

              {/* Shipping & Returns */}
              <div className="py-3">
                <button
                  onClick={() =>
                    setOpenAccordion(openAccordion === 'shipping' ? null : 'shipping')
                  }
                  className="w-full flex items-center justify-between text-xs font-black uppercase tracking-wider text-ym-charcoal py-1 cursor-pointer"
                >
                  <span>{t.shippingReturns}</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${
                      openAccordion === 'shipping' ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {openAccordion === 'shipping' && (
                  <div className="pt-3 pb-2 text-xs text-slate-600 leading-relaxed font-medium space-y-1.5">
                    <p>• {language === 'en' ? 'In-stock items: Delivery in 2 - 3 business days across Egypt' : 'المنتجات الفوري: التوصيل خلال 2 إلى 3 أيام عمل داخل مصر'}</p>
                    <p>• {language === 'en' ? 'By-Order (Sourcing) items: Arrival in 30 - 35 days from abroad' : 'منتجات الباي أوردر: الوصول خلال 30 إلى 35 يوم من الخارج'}</p>
                    <p>• {language === 'en' ? 'By-Order items are strictly non-refundable and non-exchangeable' : 'منتجات الباي أوردر غير قابلة للاسترجاع أو الاستبدال نهائياً'}</p>
                    <p>• {language === 'en' ? 'In-stock inspection is with courier upon delivery; non-returnable once courier leaves' : 'المعاينة للمنتجات الفوري مع المندوب وقت الاستلام فقط ولا يُقبل الإرجاع بعد المغادرة'}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Related Products Carousel */}
        {relatedProducts.length > 0 && (
          <div className="mt-28 pt-16 border-t border-slate-100">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl sm:text-3xl font-black text-ym-charcoal uppercase tracking-tight font-display">
                {t.relatedTitle}
              </h3>
              <Link
                to={`/shop?category=${product.category}`}
                className="inline-flex items-center gap-2 text-xs font-black uppercase text-ym-charcoal hover:text-sky-600"
              >
                <span>Explore Category</span>
                <ArrowIcon className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((rel) => (
                <ProductCard key={rel.id} product={rel} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
