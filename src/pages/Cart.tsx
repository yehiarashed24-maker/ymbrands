import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, ArrowLeft, Truck, Tag } from 'lucide-react';
import { useCartStore, FREE_SHIPPING_THRESHOLD } from '@/store/cartStore';
import { useLanguageStore } from '@/store/languageStore';
import { translations } from '@/data/translations';

export const Cart: React.FC = () => {
  const navigate = useNavigate();
  const { language, isRTL } = useLanguageStore();
  const t = translations[language].cart;
  const curr = translations[language].hero.pricePrefix;

  const {
    items,
    removeItem,
    updateQuantity,
    getSubtotal,
    getDiscountAmount,
    getShippingFee,
    getFinalTotal,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
  } = useCartStore();

  const [couponCode, setCouponCode] = useState('');
  const [couponMsg, setCouponMsg] = useState<{ text: string; error: boolean } | null>(null);

  const subtotal = getSubtotal();
  const discount = getDiscountAmount();
  const shipping = getShippingFee();
  const finalTotal = getFinalTotal();

  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const freeShippingPct = Math.min(100, Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100));

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    const res = applyCoupon(couponCode);
    setCouponMsg({
      text: res.message[language],
      error: !res.success,
    });
  };

  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  if (items.length === 0) {
    return (
      <div className="pt-32 pb-24 min-h-screen bg-white flex items-center justify-center">
        <div className="max-w-md mx-auto px-6 text-center">
          <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="w-10 h-10 text-slate-300" />
          </div>
          <h1 className="text-3xl font-black uppercase text-ym-charcoal font-display mb-2">
            {t.emptyTitle}
          </h1>
          <p className="text-sm text-slate-500 mb-8">{t.emptySubtitle}</p>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-ym-charcoal text-white font-black text-xs uppercase tracking-wider hover:bg-black transition-all shadow-lg"
          >
            <span>{t.startShopping}</span>
            <ArrowIcon className="w-4 h-4 text-ym-lime" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-28 sm:pt-32 pb-24 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 md:px-12">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-ym-charcoal uppercase tracking-tight font-display mb-8 pb-4 border-b border-slate-100">
          {t.title} ({items.length})
        </h1>

        {/* Free Shipping Alert */}
        <div className="mb-8 p-4 bg-slate-50 border border-slate-200/80 rounded-2xl">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700 mb-2">
            <Truck className="w-4 h-4 text-sky-600" />
            <span>
              {remainingForFreeShipping > 0
                ? t.freeShippingThresholdText.replace('{amount}', remainingForFreeShipping.toLocaleString())
                : t.freeShippingUnlocked}
            </span>
          </div>
          <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-ym-lime transition-all duration-500"
              style={{ width: `${freeShippingPct}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Items Table / List (7 cols) */}
          <div className="lg:col-span-7 divide-y divide-slate-100">
            {items.map((item) => (
              <div
                key={`${item.product.id}-${item.selectedSize}`}
                className="py-6 flex gap-6 items-center"
              >
                <div className="w-24 h-24 sm:w-28 sm:h-28 bg-slate-50 rounded-2xl p-3 shrink-0 flex items-center justify-center border border-slate-100">
                  <img
                    src={item.product.image}
                    alt={item.product.name[language]}
                    className="w-full h-full object-contain"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    {item.product.brand}
                  </span>
                  <h3 className="text-base font-black text-ym-charcoal truncate">
                    {item.product.name[language]}
                  </h3>
                  <p className="text-xs font-semibold text-slate-500 mt-0.5">
                    Size: EU {item.selectedSize} {item.selectedColor ? `• ${item.selectedColor}` : ''}
                  </p>

                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
                      <button
                        onClick={() =>
                          updateQuantity(item.product.id, item.selectedSize, item.quantity - 1)
                        }
                        className="px-2.5 py-1.5 text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-3.5 text-xs font-black text-ym-charcoal">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.product.id, item.selectedSize, item.quantity + 1)
                        }
                        className="px-2.5 py-1.5 text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="text-base font-black text-ym-charcoal font-display">
                        {(item.product.price * item.quantity).toLocaleString()} {curr}
                      </span>

                      <button
                        onClick={() => removeItem(item.product.id, item.selectedSize)}
                        aria-label="Remove item"
                        className="text-slate-400 hover:text-red-500 transition-colors p-1 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary Card (5 cols) */}
          <div className="lg:col-span-5 p-8 rounded-3xl bg-slate-50 border border-slate-200/80 space-y-6">
            <h2 className="text-lg font-black uppercase tracking-wider text-ym-charcoal font-display">
              ORDER SUMMARY
            </h2>

            {/* Coupon Code Form */}
            <form onSubmit={handleApplyCoupon} className="flex gap-2">
              <div className="relative flex-1">
                <Tag className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 rtl:left-auto rtl:right-3" />
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder={t.couponPlaceholder}
                  className="w-full text-xs font-bold pl-9 pr-3 rtl:pl-3 rtl:pr-9 py-3 rounded-xl border border-slate-200 bg-white uppercase outline-none focus:border-black"
                />
              </div>
              <button
                type="submit"
                className="px-5 py-3 bg-ym-charcoal hover:bg-black text-white text-xs font-bold rounded-xl transition-colors cursor-pointer uppercase"
              >
                {t.apply}
              </button>
            </form>

            {couponMsg && (
              <p
                className={`text-xs font-semibold ${
                  couponMsg.error ? 'text-red-500' : 'text-emerald-600'
                }`}
              >
                {couponMsg.text}
              </p>
            )}

            {appliedCoupon && (
              <div className="flex items-center justify-between text-xs bg-emerald-50 text-emerald-700 px-3.5 py-2 rounded-xl">
                <span>Active coupon: <strong>{appliedCoupon}</strong></span>
                <button
                  onClick={removeCoupon}
                  className="font-bold underline cursor-pointer text-xs"
                >
                  {t.remove}
                </button>
              </div>
            )}

            {/* Price Calculations */}
            <div className="space-y-3 text-xs pt-4 border-t border-slate-200">
              <div className="flex justify-between text-slate-600">
                <span>{t.subtotal}</span>
                <span className="font-bold text-ym-charcoal">
                  {subtotal.toLocaleString()} {curr}
                </span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>{t.discount}</span>
                  <span>-{discount.toLocaleString()} {curr}</span>
                </div>
              )}

              <div className="flex justify-between text-slate-600">
                <span>{t.shipping}</span>
                <span className="font-bold text-ym-charcoal">
                  {shipping === 0 ? (
                    <span className="text-emerald-600">{t.freeShipping}</span>
                  ) : (
                    `${shipping} ${curr}`
                  )}
                </span>
              </div>

              <div className="flex justify-between text-lg font-black text-ym-charcoal pt-3 border-t border-slate-200">
                <span>{t.total}</span>
                <span className="font-display">
                  {finalTotal.toLocaleString()} {curr}
                </span>
              </div>
            </div>

            {/* Checkout Button */}
            <button
              onClick={() => navigate('/checkout')}
              className="w-full py-4 rounded-full bg-ym-lime hover:bg-ym-lime-hover text-black font-black text-xs sm:text-sm tracking-wider uppercase flex items-center justify-center gap-2 shadow-[0_8px_20px_rgba(204,255,0,0.35)] transition-all hover:scale-[1.02] cursor-pointer"
            >
              <span>{t.checkout}</span>
              <ArrowIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
