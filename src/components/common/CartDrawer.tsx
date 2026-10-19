import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, ArrowLeft, Truck, Tag } from 'lucide-react';
import { useCartStore, FREE_SHIPPING_THRESHOLD } from '../../store/cartStore';
import { useLanguageStore } from '../../store/languageStore';
import { translations } from '../../data/translations';

export const CartDrawer: React.FC = () => {
  const navigate = useNavigate();
  const { language, isRTL } = useLanguageStore();
  const t = translations[language].cart;
  const curr = translations[language].hero.pricePrefix;

  const {
    items,
    isOpen,
    closeCart,
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

  const [couponInput, setCouponInput] = useState('');
  const [couponStatus, setCouponStatus] = useState<{ message: string; isError: boolean } | null>(null);

  // Prevent background scroll when cart is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const subtotal = getSubtotal();
  const discount = getDiscountAmount();
  const shipping = getShippingFee();
  const finalTotal = getFinalTotal();

  const freeShippingProgress = Math.min(100, Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100));
  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const res = applyCoupon(couponInput);
    setCouponStatus({
      message: res.message[language],
      isError: !res.success,
    });
  };

  const handleCheckout = () => {
    closeCart();
    navigate('/checkout');
  };

  const handleViewCart = () => {
    closeCart();
    navigate('/cart');
  };

  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[110] overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity cursor-pointer"
          />

          {/* Slide-over Drawer Panel */}
          <div className={`fixed inset-y-0 ${isRTL ? 'left-0' : 'right-0'} max-w-full flex`}>
            <motion.div
              initial={{ x: isRTL ? '-100%' : '100%' }}
              animate={{ x: 0 }}
              exit={{ x: isRTL ? '-100%' : '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 260 }}
              className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between"
            >
              {/* Header */}
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <ShoppingBag className="w-5 h-5 text-ym-charcoal" />
                  <h3 className="text-base font-black tracking-wider uppercase text-ym-charcoal font-display">
                    {t.title} ({items.length})
                  </h3>
                </div>
                <button
                  onClick={closeCart}
                  aria-label="Close cart"
                  className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Free Shipping Progress Bar */}
              {items.length > 0 && (
                <div className="px-6 py-3.5 bg-slate-50 border-b border-slate-100">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-700 mb-2">
                    <Truck className="w-4 h-4 text-sky-600" />
                    <span>
                      {remainingForFreeShipping > 0
                        ? t.freeShippingThresholdText.replace('{amount}', remainingForFreeShipping.toLocaleString())
                        : t.freeShippingUnlocked}
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-ym-lime transition-all duration-500 rounded-full"
                      style={{ width: `${freeShippingProgress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Items List */}
              <div className="flex-1 overflow-y-auto p-6 divide-y divide-slate-100">
                {items.length > 0 ? (
                  items.map((item) => (
                    <div key={`${item.product.id}-${item.selectedSize}`} className="py-4 flex gap-4">
                      {/* Product Thumbnail */}
                      <div className="w-20 h-20 bg-slate-50 rounded-xl p-2 shrink-0 flex items-center justify-center border border-slate-100">
                        <img
                          src={item.product.image}
                          alt={item.product.name[language]}
                          className="w-full h-full object-contain"
                        />
                      </div>

                      {/* Info & Sizing */}
                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <span className="text-[10px] font-black tracking-wider uppercase text-slate-400 block">
                              {item.product.brand}
                            </span>
                            <h4 className="text-sm font-extrabold text-ym-charcoal truncate">
                              {item.product.name[language]}
                            </h4>
                            <span className="inline-block mt-0.5 text-xs font-semibold text-slate-500">
                              EU {item.selectedSize}
                            </span>
                          </div>

                          <button
                            onClick={() => removeItem(item.product.id, item.selectedSize)}
                            aria-label="Remove item"
                            className="text-slate-400 hover:text-red-500 transition-colors p-1 cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Quantity & Price */}
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
                            <button
                              onClick={() =>
                                updateQuantity(item.product.id, item.selectedSize, item.quantity - 1)
                              }
                              className="px-2 py-1 text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="px-3 text-xs font-black text-ym-charcoal">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateQuantity(item.product.id, item.selectedSize, item.quantity + 1)
                              }
                              className="px-2 py-1 text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <span className="text-sm font-black text-ym-charcoal">
                            {(item.product.price * item.quantity).toLocaleString()} {curr}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="h-full flex flex-col items-center justify-center py-16 text-center">
                    <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                      <ShoppingBag className="w-8 h-8 text-slate-400" />
                    </div>
                    <h4 className="text-base font-black tracking-tight text-ym-charcoal uppercase mb-1">
                      {t.emptyTitle}
                    </h4>
                    <p className="text-xs text-slate-500 mb-6 max-w-xs">{t.emptySubtitle}</p>
                    <button
                      onClick={() => {
                        closeCart();
                        navigate('/shop');
                      }}
                      className="px-6 py-3 bg-ym-charcoal text-white text-xs font-black tracking-wider uppercase rounded-full hover:bg-black transition-colors cursor-pointer"
                    >
                      {t.startShopping}
                    </button>
                  </div>
                )}
              </div>

              {/* Footer Calculations & CTAs */}
              {items.length > 0 && (
                <div className="p-6 border-t border-slate-100 bg-slate-50/50 space-y-4">
                  {/* Coupon Input */}
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 rtl:left-auto rtl:right-3" />
                      <input
                        type="text"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value)}
                        placeholder={t.couponPlaceholder}
                        className="w-full text-xs font-bold pl-8 pr-3 rtl:pl-3 rtl:pr-8 py-2 rounded-lg border border-slate-200 uppercase placeholder:normal-case outline-none focus:border-black"
                      />
                    </div>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-slate-800 hover:bg-black text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
                    >
                      {t.apply}
                    </button>
                  </form>

                  {/* Coupon feedback */}
                  {couponStatus && (
                    <p
                      className={`text-xs font-semibold ${
                        couponStatus.isError ? 'text-red-500' : 'text-emerald-600'
                      }`}
                    >
                      {couponStatus.message}
                    </p>
                  )}

                  {appliedCoupon && (
                    <div className="flex items-center justify-between text-xs bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-lg">
                      <span>{appliedCoupon}</span>
                      <button
                        onClick={removeCoupon}
                        className="font-bold underline cursor-pointer text-[11px]"
                      >
                        {t.remove}
                      </button>
                    </div>
                  )}

                  {/* Breakdown */}
                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between text-slate-600">
                      <span>{t.subtotal}</span>
                      <span className="font-bold text-ym-charcoal">
                        {subtotal.toLocaleString()} {curr}
                      </span>
                    </div>

                    {discount > 0 && (
                      <div className="flex justify-between text-emerald-600 font-bold">
                        <span>{t.discount}</span>
                        <span>
                          -{discount.toLocaleString()} {curr}
                        </span>
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

                    <div className="flex justify-between text-base font-black text-ym-charcoal pt-2 border-t border-slate-200">
                      <span>{t.total}</span>
                      <span className="font-display">
                        {finalTotal.toLocaleString()} {curr}
                      </span>
                    </div>
                  </div>

                  {/* CTAs */}
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <button
                      onClick={handleViewCart}
                      className="w-full py-3.5 rounded-xl border border-slate-300 hover:border-black font-extrabold text-xs tracking-wider uppercase text-ym-charcoal transition-all text-center cursor-pointer"
                    >
                      {t.viewCart}
                    </button>

                    <button
                      onClick={handleCheckout}
                      className="w-full py-3.5 rounded-xl bg-ym-lime hover:bg-ym-lime-hover text-black font-black text-xs tracking-wider uppercase flex items-center justify-center gap-2 shadow-[0_4px_15px_rgba(204,255,0,0.35)] transition-all cursor-pointer"
                    >
                      <span>{t.checkout}</span>
                      <ArrowIcon className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};
