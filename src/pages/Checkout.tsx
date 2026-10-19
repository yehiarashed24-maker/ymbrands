import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ShieldCheck,
  CheckCircle2,
  CreditCard,
  Banknote,
  ArrowRight,
  ArrowLeft,
  Truck,
  Sparkles,
  Info,
  UploadCloud,
} from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { useLanguageStore } from '@/store/languageStore';
import { useOrderStore, Order } from '@/store/orderStore';
import { translations, egyptGovernorates } from '@/data/translations';
import { sendOrderConfirmationEmail } from '@/lib/email';
import {
  sanitizeString,
  sanitizePhone,
  isValidEmail,
  checkRateLimit,
  isHoneypotTriggered,
  validateImageUpload,
} from '@/lib/security';

export const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const { language, isRTL } = useLanguageStore();
  const t = translations[language].checkout;
  const curr = translations[language].hero.pricePrefix;

  const {
    items,
    getSubtotal,
    getDiscountAmount,
    getShippingFee,
    getFinalTotal,
    clearCart,
  } = useCartStore();

  const subtotal = getSubtotal();
  const discount = getDiscountAmount();
  const shipping = getShippingFee();
  const finalTotal = getFinalTotal();

  const hasByOrder = items.some(item => item.product.isByOrder);
  const depositAmount = hasByOrder ? Math.round(finalTotal * 0.5) : 0;
  const remainingBalance = hasByOrder ? finalTotal - depositAmount : 0;

  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    governorate: 'Cairo',
    city: '',
    street: '',
    building: '',
    floor: '',
    apartment: '',
    notes: '',
    paymentMethod: 'cod', // 'cod' | 'instapay'
  });

  const [receiptImageBase64, setReceiptImageBase64] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [honeypot, setHoneypot] = useState('');

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Security check: validate size and file type (blocks SVG and oversized files)
    const validation = validateImageUpload(file);
    if (!validation.valid) {
      alert(language === 'ar' ? (validation.error || 'ملف غير صالح') : (validation.error || 'Invalid file'));
      return;
    }

    setIsUploading(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      // Basic image compression and safe re-encoding using canvas
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 800;
        let width = img.width;
        let height = img.height;

        if (width > MAX_WIDTH) {
          height = Math.round((height * MAX_WIDTH) / width);
          width = MAX_WIDTH;
        }
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        
        // Compress to JPEG with 0.6 quality (strips any embedded metadata/scripts)
        const compressedBase64 = canvas.toDataURL('image/jpeg', 0.6);
        setReceiptImageBase64(compressedBase64);
        setIsUploading(false);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    if (hasByOrder && formData.paymentMethod !== 'instapay') {
      setFormData(prev => ({ ...prev, paymentMethod: 'instapay' }));
    }
  }, [hasByOrder, formData.paymentMethod]);

  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [orderId, setOrderId] = useState('');

  const { addOrder } = useOrderStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Anti-Bot Honeypot Defense
    if (isHoneypotTriggered(honeypot)) {
      setOrderId('YM-EG-000000');
      setOrderConfirmed(true);
      clearCart();
      return;
    }

    // 2. Anti-Flooding & Rate Limiting (max 3 orders per 5 minutes)
    const rateLimit = checkRateLimit('checkout_order', 3, 300);
    if (!rateLimit.allowed) {
      alert(language === 'ar' 
        ? `عفواً، لقد قمت بإرسال عدة طلبات مؤخراً. برجاء الانتظار ${rateLimit.retryAfterSeconds} ثانية قبل إعادة المحاولة.`
        : `Too many order attempts. Please wait ${rateLimit.retryAfterSeconds} seconds before trying again.`);
      return;
    }

    // 3. Validate Phone Number
    const cleanedPhone = sanitizePhone(formData.phone);
    if (cleanedPhone.length < 10) {
      alert(language === 'ar' ? 'برجاء إدخال رقم هاتف صحيح للتواصل وتأكيد الطلب.' : 'Please enter a valid phone number.');
      return;
    }

    // 4. Validate Email if provided
    if (formData.email.trim() && !isValidEmail(formData.email)) {
      alert(language === 'ar' ? 'صيغة البريد الإلكتروني غير صحيحة.' : 'Please enter a valid email address.');
      return;
    }

    if (formData.paymentMethod === 'instapay' && !receiptImageBase64) {
      alert(language === 'en' ? 'Please upload your InstaPay receipt to proceed.' : 'برجاء رفع صورة إيصال التحويل لإتمام الطلب.');
      return;
    }

    const generatedId = `YM-EG-${Math.floor(100000 + Math.random() * 900000)}`;
    
    // 5. Sanitize all customer inputs
    const safeCustomer = {
      name: sanitizeString(formData.fullName, 100),
      phone: cleanedPhone,
      address: `${sanitizeString(formData.building, 30)} ${sanitizeString(formData.street, 100)}, Floor ${sanitizeString(formData.floor, 10)}, Apt ${sanitizeString(formData.apartment, 10)}`,
      city: `${sanitizeString(formData.city, 50)}, ${sanitizeString(formData.governorate, 50)}`,
    };

    const newOrder: Order = {
      id: generatedId,
      type: 'standard',
      status: 'pending',
      date: new Date().toISOString(),
      total: finalTotal,
      depositAmount: depositAmount > 0 ? depositAmount : undefined,
      remainingBalance: remainingBalance > 0 ? remainingBalance : undefined,
      paymentMethod: formData.paymentMethod as 'cod' | 'instapay',
      receiptImageBase64: receiptImageBase64 || undefined,
      customer: safeCustomer,
      items: items.map(item => ({
        productId: item.product.id,
        name: item.product.name[language as 'en' | 'ar'] || item.product.name.en,
        price: item.product.price,
        quantity: item.quantity,
        size: item.selectedSize,
        image: item.product.image
      })),
    };

    // Save to order store (which syncs to Firebase)
    await addOrder(newOrder);

    // Send confirmation email
    if (formData.email.trim()) {
      await sendOrderConfirmationEmail(newOrder, formData.email.trim());
    }

    setOrderId(generatedId);
    setOrderConfirmed(true);
    clearCart();
  };

  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  if (items.length === 0 && !orderConfirmed) {
    return (
      <div className="pt-32 pb-24 min-h-screen bg-white flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          <h2 className="text-2xl font-black uppercase text-ym-charcoal mb-4">
            Your bag is empty
          </h2>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-ym-charcoal text-white font-bold text-xs uppercase"
          >
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-28 sm:pt-32 pb-24 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 md:px-12">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-ym-charcoal uppercase tracking-tight font-display mb-10 pb-4 border-b border-slate-100">
          {t.title}
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Form Area (7 cols) */}
          <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-8">
            {/* Anti-Bot Honeypot */}
            <div style={{ display: 'none', opacity: 0, position: 'absolute', pointerEvents: 'none' }} aria-hidden="true">
              <input
                type="text"
                name="_ym_hp_token"
                tabIndex={-1}
                autoComplete="off"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
              />
            </div>

            {/* Contact Information */}
            <div className="p-6 sm:p-8 rounded-3xl bg-slate-50 border border-slate-100 space-y-4">
              <h2 className="text-base font-black uppercase tracking-wider text-ym-charcoal">
                1. {t.contactInfo}
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">
                    {t.fullName} *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="e.g. Omar El-Shennawy"
                    className="w-full text-xs font-medium px-4 py-3 rounded-xl border border-slate-200 bg-white outline-none focus:border-black"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">
                    {t.phone} *
                  </label>
                  <input
                    type="tel"
                    required
                    pattern="^(010|011|012|015)[0-9]{8}$"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="01012345678"
                    className="w-full text-xs font-medium px-4 py-3 rounded-xl border border-slate-200 bg-white outline-none focus:border-black"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5">
                  {t.email} *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="omar@example.com"
                  className="w-full text-xs font-medium px-4 py-3 rounded-xl border border-slate-200 bg-white outline-none focus:border-black"
                />
              </div>
            </div>

            {/* Shipping Address in Egypt */}
            <div className="p-6 sm:p-8 rounded-3xl bg-slate-50 border border-slate-100 space-y-4">
              <h2 className="text-base font-black uppercase tracking-wider text-ym-charcoal">
                2. {t.shippingAddress}
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">
                    {t.governorate} *
                  </label>
                  <select
                    value={formData.governorate}
                    onChange={(e) => setFormData({ ...formData, governorate: e.target.value })}
                    className="w-full text-xs font-bold px-4 py-3 rounded-xl border border-slate-200 bg-white outline-none focus:border-black"
                  >
                    {egyptGovernorates.map((gov) => (
                      <option key={gov.en} value={gov.en}>
                        {gov[language]}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">
                    {t.city} *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="e.g. New Cairo / Tagamoa"
                    className="w-full text-xs font-medium px-4 py-3 rounded-xl border border-slate-200 bg-white outline-none focus:border-black"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5">
                  {t.street} *
                </label>
                <input
                  type="text"
                  required
                  value={formData.street}
                  onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                  placeholder="Street name, landmark or district"
                  className="w-full text-xs font-medium px-4 py-3 rounded-xl border border-slate-200 bg-white outline-none focus:border-black"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">
                    {t.building} *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.building}
                    onChange={(e) => setFormData({ ...formData, building: e.target.value })}
                    placeholder="e.g. 14"
                    className="w-full text-xs font-medium px-3 py-3 rounded-xl border border-slate-200 bg-white outline-none focus:border-black"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">
                    {t.floor}
                  </label>
                  <input
                    type="text"
                    value={formData.floor}
                    onChange={(e) => setFormData({ ...formData, floor: e.target.value })}
                    placeholder="e.g. 3rd"
                    className="w-full text-xs font-medium px-3 py-3 rounded-xl border border-slate-200 bg-white outline-none focus:border-black"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">
                    {t.apartment}
                  </label>
                  <input
                    type="text"
                    value={formData.apartment}
                    onChange={(e) => setFormData({ ...formData, apartment: e.target.value })}
                    placeholder="e.g. 302"
                    className="w-full text-xs font-medium px-3 py-3 rounded-xl border border-slate-200 bg-white outline-none focus:border-black"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5">
                  {t.notes}
                </label>
                <textarea
                  rows={2}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Any delivery instructions for the courier..."
                  className="w-full text-xs font-medium px-4 py-3 rounded-xl border border-slate-200 bg-white outline-none focus:border-black"
                />
              </div>
            </div>

            {/* Payment Method */}
            <div className="p-6 sm:p-8 rounded-3xl bg-slate-50 border border-slate-100 space-y-4">
              <h2 className="text-base font-black uppercase tracking-wider text-ym-charcoal">
                3. {t.paymentMethod}
              </h2>

              <div className="space-y-3">
                {/* Cash on Delivery */}
                {!hasByOrder && (
                  <label
                    className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                      formData.paymentMethod === 'cod'
                        ? 'border-black bg-white shadow-sm'
                        : 'border-slate-200 bg-slate-100/60'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="cod"
                        checked={formData.paymentMethod === 'cod'}
                        onChange={() => setFormData({ ...formData, paymentMethod: 'cod' })}
                        className="accent-black w-4 h-4"
                      />
                      <div>
                        <span className="text-xs font-black uppercase text-ym-charcoal block">
                          {t.cod}
                        </span>
                        <span className="text-[11px] text-slate-500 font-medium">
                          Pay cash directly at your doorstep after inspecting the order.
                        </span>
                      </div>
                    </div>
                    <Banknote className="w-5 h-5 text-emerald-600 shrink-0" />
                  </label>
                )}

                {/* InstaPay */}
                <div>
                  <label
                    className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                      formData.paymentMethod === 'instapay'
                        ? 'border-black bg-white shadow-sm'
                        : 'border-slate-200 bg-slate-100/60'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="instapay"
                        checked={formData.paymentMethod === 'instapay'}
                        onChange={() => setFormData({ ...formData, paymentMethod: 'instapay' })}
                        className="accent-black w-4 h-4"
                      />
                      <div>
                        <span className="text-xs font-black uppercase text-ym-charcoal block">
                          {hasByOrder 
                            ? (language === 'en' ? 'InstaPay & Cash on Delivery' : 'إنستاباي والدفع عند الاستلام') 
                            : 'InstaPay'}
                        </span>
                        <span className="text-[11px] text-slate-500 font-medium">
                          {hasByOrder
                            ? (language === 'en' 
                                ? 'Transfer 50% deposit via InstaPay to 01060076900 and upload receipt. Arrives in 30-35 days. Remaining on delivery.'
                                : 'حول 50% عربون عبر إنستاباي للرقم 01060076900 وارفع الإيصال. الأوردر بيوصل خلال 30 إلى 35 يوم والباقي عند الاستلام.')
                            : (language === 'en' 
                                ? 'Transfer total via InstaPay to 01060076900 and upload receipt.' 
                                : 'حول إجمالي المبلغ عبر إنستاباي للرقم 01060076900 وارفع صورة التحويل.')}
                        </span>
                      </div>
                    </div>
                    <Sparkles className="w-5 h-5 text-purple-600 shrink-0" />
                  </label>

                  {/* Upload UI shown only when InstaPay is selected */}
                  {formData.paymentMethod === 'instapay' && (
                    <div className="mt-3 p-4 bg-white border border-purple-100 rounded-xl space-y-3">
                      {/* Prominent InstaPay Account Box */}
                      <div className="flex items-center justify-between p-3 bg-purple-50/80 border border-purple-200 rounded-xl">
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-wider text-purple-700">
                            {language === 'en' ? 'InstaPay Transfer Number' : 'رقم التحويل عبر إنستاباي'}
                          </p>
                          <p className="text-base font-black font-mono text-purple-950 tracking-wider mt-0.5">
                            01060076900
                          </p>
                        </div>
                        <span className="px-2.5 py-1 rounded-full bg-purple-200/70 text-purple-900 text-[11px] font-bold">
                          InstaPay
                        </span>
                      </div>

                      <div>
                        <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                          {language === 'en' ? 'Upload Transfer Receipt *' : 'ارفع صورة التحويل *'}
                        </p>
                      
                      {!receiptImageBase64 ? (
                        <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-200 hover:border-purple-300 hover:bg-purple-50 transition-all rounded-xl cursor-pointer group">
                          <UploadCloud className="w-6 h-6 text-slate-400 group-hover:text-purple-500 mb-2 transition-colors" />
                          <span className="text-xs text-slate-500 group-hover:text-purple-600 font-medium">
                            {isUploading ? (language === 'en' ? 'Processing...' : 'جاري المعالجة...') : (language === 'en' ? 'Click to upload screenshot' : 'اضغط لرفع الصورة')}
                          </span>
                          <input 
                            type="file" 
                            accept="image/*" 
                            className="hidden" 
                            onChange={handleImageUpload}
                            disabled={isUploading}
                          />
                        </label>
                      ) : (
                        <div className="relative rounded-xl overflow-hidden border border-slate-200 aspect-[3/1] bg-slate-50 flex items-center justify-center">
                          <img 
                            src={receiptImageBase64} 
                            alt="Receipt" 
                            className="w-full h-full object-cover opacity-60" 
                          />
                          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 text-white backdrop-blur-[2px]">
                            <CheckCircle2 className="w-6 h-6 text-emerald-400 mb-1" />
                            <span className="text-xs font-bold">{language === 'en' ? 'Receipt Uploaded' : 'تم الرفع بنجاح'}</span>
                            <button 
                              type="button"
                              onClick={() => setReceiptImageBase64(null)}
                              className="text-[10px] underline hover:text-red-200 mt-2"
                            >
                              {language === 'en' ? 'Remove' : 'حذف'}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-5 rounded-full bg-ym-lime hover:bg-ym-lime-hover text-black font-black text-sm tracking-wider uppercase shadow-[0_10px_25px_rgba(204,255,0,0.4)] transition-all hover:scale-[1.01] cursor-pointer"
            >
              {hasByOrder 
                ? `${t.placeOrder} • Pay Deposit ${depositAmount.toLocaleString()} ${curr}` 
                : `${t.placeOrder} • ${finalTotal.toLocaleString()} ${curr}`}
            </button>
          </form>

          {/* Order Summary (5 cols) */}
          <div className="lg:col-span-5 p-8 rounded-3xl bg-slate-50 border border-slate-200/80 space-y-6 lg:sticky lg:top-28">
            <h3 className="text-base font-black uppercase tracking-wider text-ym-charcoal font-display">
              {t.orderSummary} ({items.length})
            </h3>

            {/* Item Mini Thumbnails */}
            <div className="divide-y divide-slate-200/70 max-h-72 overflow-y-auto">
              {items.map((item) => (
                <div
                  key={`${item.product.id}-${item.selectedSize}`}
                  className="py-3 flex items-center gap-4 text-xs"
                >
                  <div className="w-14 h-14 bg-white rounded-xl p-1.5 border border-slate-200 shrink-0 flex items-center justify-center">
                    <img
                      src={item.product.image}
                      alt={item.product.name[language]}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-extrabold text-ym-charcoal truncate">
                      {item.product.name[language]}
                    </h4>
                    <span className="text-slate-500 font-medium">
                      EU {item.selectedSize} × {item.quantity}
                    </span>
                  </div>
                  <span className="font-black text-ym-charcoal shrink-0 font-display">
                    {(item.product.price * item.quantity).toLocaleString()} {curr}
                  </span>
                </div>
              ))}
            </div>

            {/* Calculations */}
            <div className="space-y-2 text-xs pt-4 border-t border-slate-200">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span className="font-bold text-ym-charcoal">
                  {subtotal.toLocaleString()} {curr}
                </span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Discount</span>
                  <span>-{discount.toLocaleString()} {curr}</span>
                </div>
              )}

              <div className="flex justify-between text-slate-600">
                <span>Shipping ({formData.governorate})</span>
                <span className="font-bold text-ym-charcoal">
                  {shipping === 0 ? 'FREE' : `${shipping} ${curr}`}
                </span>
              </div>

              <div className="flex justify-between text-lg font-black text-ym-charcoal pt-3 border-t border-slate-200">
                <span>Total Amount</span>
                <span className="font-display">
                  {finalTotal.toLocaleString()} {curr}
                </span>
              </div>

              {hasByOrder && (
                <div className="pt-3 border-t border-slate-200 space-y-2">
                  <div className="flex justify-between text-amber-600 font-black">
                    <span>Deposit Required (50%)</span>
                    <span className="font-display">{depositAmount.toLocaleString()} {curr}</span>
                  </div>
                  <div className="flex justify-between text-slate-500 font-bold">
                    <span>Remaining on Delivery</span>
                    <span className="font-display">{remainingBalance.toLocaleString()} {curr}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Safety guarantee */}
            <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-200 text-xs text-slate-600 font-medium">
              <ShieldCheck className="w-4 h-4 text-ym-lime bg-black p-0.5 rounded" />
              <span>{language === 'en' ? '100% Authentic Products Guaranteed' : 'منتجات أصلية 100٪ مضمونة'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Order Confirmation Modal */}
      {orderConfirmed && (
        <div className="fixed inset-0 z-[140] bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 sm:p-12 max-w-lg w-full text-center shadow-2xl space-y-6 animate-scale-in">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <h2 className="text-2xl sm:text-3xl font-black uppercase text-ym-charcoal font-display">
                {t.orderSuccessTitle}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-2 font-medium">
                {t.orderSuccessSubtitle}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs font-bold text-slate-700 space-y-1">
              <div className="flex justify-between">
                <span>{t.orderNumber}:</span>
                <strong className="text-black font-black">{orderId}</strong>
              </div>
              <div className="flex justify-between">
                <span>Destination:</span>
                <span>{formData.city}, {formData.governorate}</span>
              </div>
              <div className="flex justify-between">
                <span>Payment:</span>
                <span className="uppercase">{formData.paymentMethod}</span>
              </div>
            </div>

            <button
              onClick={() => navigate('/')}
              className="w-full py-4 rounded-full bg-ym-charcoal text-white font-black text-xs uppercase tracking-wider hover:bg-black transition-colors cursor-pointer"
            >
              {t.backToHome}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
