import React, { useState } from 'react';
import { useLanguageStore } from '../store/languageStore';
import { PackageSearch, Send, ShieldCheck, Globe, Plane, Link as LinkIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { useOrderStore } from '../store/orderStore';
import {
  sanitizeString,
  sanitizePhone,
  sanitizeUrl,
  checkRateLimit,
  isHoneypotTriggered,
} from '../lib/security';

export const Sourcing: React.FC = () => {
  const { language } = useLanguageStore();

  const [formData, setFormData] = useState({
    link: '',
    size: '',
    color: '',
    phone: '',
    name: '',
    notes: '',
  });

  const [honeypot, setHoneypot] = useState('');

  const { addOrder } = useOrderStore();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Anti-Bot Honeypot Defense
    if (isHoneypotTriggered(honeypot)) {
      setFormData({ link: '', size: '', color: '', phone: '', name: '', notes: '' });
      return;
    }

    // 2. Anti-Spam Rate Limiting (max 3 per 5 minutes)
    const rateLimit = checkRateLimit('sourcing_request', 3, 300);
    if (!rateLimit.allowed) {
      alert(language === 'ar'
        ? `عفواً، لقد قمت بإرسال عدة طلبات مؤخراً. برجاء الانتظار ${rateLimit.retryAfterSeconds} ثانية قبل إعادة المحاولة.`
        : `Too many requests. Please wait ${rateLimit.retryAfterSeconds} seconds before trying again.`);
      return;
    }

    // 3. Validate Phone Number
    const cleanedPhone = sanitizePhone(formData.phone);
    if (cleanedPhone.length < 10) {
      alert(language === 'ar' ? 'برجاء إدخال رقم هاتف صحيح للتواصل على واتساب.' : 'Please enter a valid phone number.');
      return;
    }

    // 4. Validate and Sanitize Link
    const cleanedLink = sanitizeUrl(formData.link);
    if (formData.link.trim() && !cleanedLink) {
      alert(language === 'ar' ? 'برجاء التأكد من صحة رابط المنتج (يجب أن يبدأ بـ https://).' : 'Please enter a valid URL (must begin with https://).');
      return;
    }

    const safeName = sanitizeString(formData.name || (language === 'en' ? 'Sourcing Customer' : 'عميل طلب خاص'), 100);
    const safeNotes = sanitizeString(formData.notes, 300);
    const safeSize = sanitizeString(formData.size, 20);
    const safeColor = sanitizeString(formData.color, 40);

    // 5. Save order to Admin Dashboard
    const orderId = `YM-REQ-${Math.floor(Math.random() * 100000).toString().padStart(5, '0')}`;
    addOrder({
      id: orderId,
      type: 'special',
      status: 'pending',
      date: new Date().toISOString(),
      customer: {
        name: safeName,
        phone: cleanedPhone,
      },
      items: [{
        name: safeNotes ? `Sourcing: ${safeNotes}` : (language === 'en' ? 'Special By-Order Request' : 'طلب استيراد خاص باللينك'),
        size: safeSize,
      }],
      specialRequestDetails: {
        link: cleanedLink || formData.link.trim(),
        size: safeSize,
        color: safeColor || undefined,
        phone: cleanedPhone,
        model: safeNotes || undefined,
      }
    });

    // 6. Build WhatsApp Message with customer phone, link, size, and color
    const text = encodeURIComponent(
      `Hello YM, I have a Special Order Request!\n\n` +
      `*Order Ref:* ${orderId}\n` +
      `*Customer Phone:* ${cleanedPhone}\n` +
      (safeName ? `*Customer Name:* ${safeName}\n` : '') +
      `*Product Link:* ${cleanedLink || formData.link}\n` +
      `*Size:* ${safeSize}\n` +
      (safeColor ? `*Color:* ${safeColor}\n` : '') +
      (safeNotes ? `*Notes:* ${safeNotes}\n` : '')
    );
    const whatsappUrl = `https://wa.me/201060076900?text=${text}`;
    window.open(whatsappUrl, '_blank');
    
    // Clear form
    setFormData({ link: '', size: '', color: '', phone: '', name: '', notes: '' });
  };

  const content = {
    en: {
      title: 'SPECIAL ORDER',
      subtitle: "CAN'T FIND YOUR DREAM SNEAKER?",
      desc: "We source 100% authentic sneakers and apparel from around the globe straight to your door in Egypt. Just paste the product link, select your size and color, and we'll reply to your WhatsApp right away.",
      features: [
        { icon: <Globe className="w-5 h-5" />, title: 'Global Sourcing', desc: 'Directly sourced from official global boutiques and authorized partners.' },
        { icon: <ShieldCheck className="w-5 h-5" />, title: '100% Authentic', desc: 'Rigorous inspection of materials and manufacture serials.' },
        { icon: <Plane className="w-5 h-5" />, title: 'Arrives in 30-35 Days', desc: 'Secured import shipping straight to your doorstep across Egypt.' },
      ],
      form: {
        link: 'Product Link (Required) *',
        linkPlaceholder: 'https://... (Nike, StockX, GOAT, etc.)',
        size: 'Size (EU / US) *',
        sizePlaceholder: 'e.g. 42 EU / US 9',
        color: 'Color / Colorway',
        colorPlaceholder: 'e.g. Triple White, Black...',
        phone: 'WhatsApp / Phone Number *',
        phonePlaceholder: '01xxxxxxxxx',
        name: 'Your Name (Optional)',
        namePlaceholder: 'e.g. Ahmed Omar',
        notes: 'Model Name / Extra Notes (Optional)',
        notesPlaceholder: 'e.g. Nike Dunk Low Retro',
        submit: 'REQUEST VIA WHATSAPP',
      }
    },
    ar: {
      title: 'طلب خاص (SOURCING)',
      subtitle: 'مش لاقي السنيكرز اللي بتحلم بيه في مصر؟',
      desc: 'بنوفرلك أي كوتشي أو قطعة ملابس أصلية 100% من أي مكان في العالم لحد باب بيتك في مصر. حط لينك الموديل ومقاسك ولونك ورقمك، وهنرد عليك فوراً على الواتساب بكل التفاصيل.',
      features: [
        { icon: <Globe className="w-5 h-5" />, title: 'استيراد عالمي', desc: 'بنوفر الموديل من المتاجر الرسمية والتوكيلات المعتمدة بالخارج.' },
        { icon: <ShieldCheck className="w-5 h-5" />, title: 'أصلي 100٪ مضمون', desc: 'كل قطعة بتخضع لفحص خامات وسيريال للتأكد من أصالتها.' },
        { icon: <Plane className="w-5 h-5" />, title: 'الوصول خلال 30-35 يوم', desc: 'شحن واستيراد مؤمن عليه حتى باب بيتك في مصر.' },
      ],
      form: {
        link: 'رابط المنتج المطلوب (إجباري) *',
        linkPlaceholder: 'https://... (رابط الحذاء من نايكي، ستوك إكس، أو أي موقع)',
        size: 'المقاس المطلوب *',
        sizePlaceholder: 'مثال: 42 EU أو US 9',
        color: 'اللون المطلوب',
        colorPlaceholder: 'مثال: أبيض كامل، أسود...',
        phone: 'رقم الواتساب / الهاتف للتواصل والرد *',
        phonePlaceholder: '01xxxxxxxxx',
        name: 'الاسم بالكامل (اختياري)',
        namePlaceholder: 'مثال: أحمد محمد',
        notes: 'اسم الموديل أو ملاحظات إضافية (اختياري)',
        notesPlaceholder: 'مثال: Nike Dunk Low Panda',
        submit: 'إرسال ومتابعة عبر واتساب',
      }
    }
  };

  const t = content[language];

  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden">
      {/* Premium Dark Hero Header */}
      <div className="relative bg-ym-charcoal pt-28 sm:pt-32 pb-14 sm:pb-16 text-center overflow-hidden border-b border-white/5">
        {/* Subtle Ambient Radial Lighting */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-ym-lime/10 rounded-full blur-[130px] pointer-events-none" />
        <div className="absolute top-10 right-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-[90px] pointer-events-none" />

        <div className="max-w-4xl mx-auto px-5 sm:px-8 relative z-10 flex flex-col items-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-ym-lime text-xs font-black uppercase tracking-wider mb-4 shadow-sm"
          >
            <PackageSearch className="w-4 h-4 text-ym-lime" />
            <span>{t.title}</span>
          </motion.div>

          {/* Main Hook Title */}
          <motion.h1 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-5xl md:text-6xl font-black font-display uppercase text-white tracking-tight leading-tight mb-4"
          >
            {t.subtitle}
          </motion.h1>

          {/* Description - Harmonious and properly spaced */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-sm sm:text-base md:text-lg text-slate-300 font-medium max-w-2xl mx-auto leading-relaxed"
          >
            {t.desc}
          </motion.p>
        </div>
      </div>

      {/* Main Content: Features & Form */}
      <div className="max-w-7xl mx-auto px-5 sm:px-8 md:px-12 py-12 sm:py-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          
          {/* Features Column */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-5 space-y-6"
          >
            {t.features.map((feature, idx) => (
              <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-start gap-4">
                <div className="w-12 h-12 bg-slate-50 flex items-center justify-center rounded-full shrink-0 text-ym-charcoal">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="text-lg font-black text-ym-charcoal mb-1">{feature.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{feature.desc}</p>
                </div>
              </div>
            ))}
          </motion.div>

          {/* Form Column */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="lg:col-span-7"
          >
            <div className="bg-white p-8 md:p-10 rounded-3xl shadow-xl shadow-black/5 border border-slate-100 relative overflow-hidden">
              {/* Form Accents */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-ym-lime/10 rounded-bl-full pointer-events-none" />
              
              <form onSubmit={handleSubmit} className="relative z-10 space-y-6">
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
                
                {/* 1. PRODUCT LINK (AT THE TOP & REQUIRED) */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider">
                    <LinkIcon className="w-3.5 h-3.5 text-ym-lime-hover" />
                    <span>{t.form.link}</span>
                  </label>
                  <input 
                    type="url" 
                    name="link"
                    required
                    value={formData.link}
                    onChange={handleChange}
                    placeholder={t.form.linkPlaceholder}
                    className="w-full bg-slate-50 border-2 border-slate-200 focus:border-ym-charcoal rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-ym-charcoal/10 transition-all font-medium text-ym-charcoal text-sm"
                  />
                </div>

                {/* 2. SIZE & COLOR (BELOW LINK) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      {t.form.size}
                    </label>
                    <input 
                      type="text" 
                      name="size"
                      required
                      value={formData.size}
                      onChange={handleChange}
                      placeholder={t.form.sizePlaceholder}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-ym-charcoal/10 focus:border-ym-charcoal transition-all font-medium text-ym-charcoal text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      {t.form.color}
                    </label>
                    <input 
                      type="text" 
                      name="color"
                      value={formData.color}
                      onChange={handleChange}
                      placeholder={t.form.colorPlaceholder}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-ym-charcoal/10 focus:border-ym-charcoal transition-all font-medium text-ym-charcoal text-sm"
                    />
                  </div>
                </div>

                {/* 3. PHONE & NAME (FOR WHATSAPP REPLY) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      {t.form.phone}
                    </label>
                    <input 
                      type="tel" 
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder={t.form.phonePlaceholder}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-ym-charcoal/10 focus:border-ym-charcoal transition-all font-medium text-ym-charcoal text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      {t.form.name}
                    </label>
                    <input 
                      type="text" 
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder={t.form.namePlaceholder}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-ym-charcoal/10 focus:border-ym-charcoal transition-all font-medium text-ym-charcoal text-sm"
                    />
                  </div>
                </div>

                {/* 4. OPTIONAL MODEL / NOTES */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    {t.form.notes}
                  </label>
                  <input 
                    type="text" 
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    placeholder={t.form.notesPlaceholder}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-ym-charcoal/10 focus:border-ym-charcoal transition-all font-medium text-ym-charcoal text-sm"
                  />
                </div>

                {/* SUBMIT BUTTON */}
                <button 
                  type="submit"
                  className="w-full bg-ym-charcoal text-white rounded-xl py-4 flex items-center justify-center gap-2 hover:bg-black transition-all group mt-4 shadow-lg shadow-black/10 cursor-pointer"
                >
                  <span className="font-black tracking-widest uppercase text-sm">{t.form.submit}</span>
                  <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
                <p className="text-center text-xs text-slate-400 mt-4">
                  {language === 'en' 
                    ? 'Your request details and phone number will open directly in WhatsApp.' 
                    : 'سيتم تحويل تفاصيل طلبك ورقمك مباشرة إلى محادثة واتساب للتواصل والرد.'}
                </p>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
