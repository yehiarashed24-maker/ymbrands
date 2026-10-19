import React, { useState } from 'react';
import { 
  Phone, 
  MessageCircle, 
  Instagram, 
  MapPin, 
  Clock, 
  Send, 
  CheckCircle2, 
  Sparkles,
  CreditCard 
} from 'lucide-react';
import { useLanguageStore } from '../store/languageStore';
import { sanitizeString, sanitizePhone, checkRateLimit, isHoneypotTriggered } from '../lib/security';

export const Contact: React.FC = () => {
  const { language } = useLanguageStore();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    subject: 'general',
    message: ''
  });

  const [honeypot, setHoneypot] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isHoneypotTriggered(honeypot)) {
      setSubmitted(true);
      return;
    }

    const rateLimit = checkRateLimit('contact_form', 3, 300);
    if (!rateLimit.allowed) {
      alert(language === 'ar'
        ? `لقد قمت بإرسال عدة رسائل مؤخراً. برجاء الانتظار ${rateLimit.retryAfterSeconds} ثانية.`
        : `Please wait ${rateLimit.retryAfterSeconds} seconds before sending another message.`);
      return;
    }

    if (!formData.name.trim() || !formData.message.trim()) return;

    const safeName = sanitizeString(formData.name, 80);
    const safePhone = sanitizePhone(formData.phone);
    const safeMessage = sanitizeString(formData.message, 500);

    // Send formatted message via WhatsApp
    const whatsappMsg = `Hello YM Team!%0A%0A*Name:* ${encodeURIComponent(safeName)}%0A*Phone:* ${encodeURIComponent(safePhone || 'N/A')}%0A*Subject:* ${encodeURIComponent(formData.subject)}%0A*Message:* ${encodeURIComponent(safeMessage)}`;
    const whatsappUrl = `https://wa.me/201060076900?text=${whatsappMsg}`;
    
    window.open(whatsappUrl, '_blank');
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-slate-50/70 pt-28 sm:pt-36 pb-24">
      <div className="max-w-5xl mx-auto px-5 sm:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-[10px] sm:text-xs font-black tracking-widest text-slate-400 uppercase">
            YM EGYPT • GET IN TOUCH & DIRECT SUPPORT
          </span>

          <h1 className="text-3xl sm:text-5xl font-black text-ym-charcoal tracking-tight font-display uppercase mt-2">
            {language === 'en' ? 'CONTACT US' : 'خدمة العملاء والدعم'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-2.5">
            {language === 'en'
              ? 'Have an inquiry about sizing, orders, or custom sneaker sourcing? We are here to help you every day.'
              : 'هل لديك استفسار عن مقاس، حالة أوردر، أو تبحث عن موديل كوتشي معين؟ فريقنا جاهز لمساعدتك يومياً.'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-14">
          
          {/* Left Column: Direct Channels Cards (5 Cols) */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* WhatsApp Card */}
            <a
              href="https://wa.me/201060076900"
              target="_blank"
              rel="noreferrer"
              className="p-6 rounded-3xl bg-white border border-slate-200/80 hover:border-emerald-300 hover:shadow-lg transition-all block group cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                  <MessageCircle className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 block">
                    {language === 'en' ? 'Instant Chat' : 'شات فوري ومباشر'}
                  </span>
                  <h3 className="text-sm font-black text-ym-charcoal font-display">
                    WhatsApp: 01060076900
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {language === 'en' ? 'Click to open WhatsApp chat' : 'اضغط للتواصل الفوري على واتساب'}
                  </p>
                </div>
              </div>
            </a>

            {/* Instagram Card */}
            <a
              href="https://instagram.com/ym_brands1"
              target="_blank"
              rel="noreferrer"
              className="p-6 rounded-3xl bg-white border border-slate-200/80 hover:border-pink-300 hover:shadow-lg transition-all block group cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-pink-50 text-pink-500 flex items-center justify-center shrink-0 group-hover:bg-pink-500 group-hover:text-white transition-colors">
                  <Instagram className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-pink-600 block">
                    {language === 'en' ? 'Instagram DMs' : 'رسائل إنستجرام'}
                  </span>
                  <h3 className="text-sm font-black text-ym-charcoal font-display">
                    @ym_brands1
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {language === 'en' ? 'Follow & message us on IG' : 'تابعنا وتواصل معنا عبر الإنستجرام'}
                  </p>
                </div>
              </div>
            </a>

            {/* InstaPay Info Card */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                  <CreditCard className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600 block">
                    {language === 'en' ? 'InstaPay Payments' : 'تحويلات إنستاباي'}
                  </span>
                  <h3 className="text-sm font-black text-ym-charcoal font-display">
                    01060076900
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {language === 'en' ? 'Official InstaPay transfer number' : 'رقم التحويل الرسمي المعتمد'}
                  </p>
                </div>
              </div>
            </div>

            {/* Working Hours & Coverage Card */}
            <div className="p-6 rounded-3xl bg-slate-900 text-white space-y-4 shadow-sm">
              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-ym-lime shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-slate-200">
                    {language === 'en' ? 'Working Hours' : 'ساعات العمل والرد'}
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {language === 'en' ? 'Everyday: 10:00 AM – 11:00 PM' : 'يومياً: من 10 صباحاً حتى 11 مساءً'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 pt-3 border-t border-white/10">
                <MapPin className="w-4 h-4 text-ym-blue-light shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-slate-200">
                    {language === 'en' ? 'Coverage' : 'التوصيل والشحن'}
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {language === 'en' ? 'All Governorates across Egypt' : 'شحن سريع لجميع محافظات جمهورية مصر العربية'}
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Send Inquiry Form (7 Cols) */}
          <div className="lg:col-span-7 bg-white border border-slate-200/80 rounded-3xl p-7 sm:p-9 shadow-sm">
            <h2 className="text-xl sm:text-2xl font-black text-ym-charcoal font-display uppercase mb-2">
              {language === 'en' ? 'Send a Message' : 'أرسل لنا استفسارك'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mb-6">
              {language === 'en'
                ? 'Fill the form below and we will automatically open your WhatsApp message ready to send.'
                : 'املأ النموذج التالي وسيتم تحويل رسالتك إلى محادثة واتساب فورية جاهزة للإرسال.'}
            </p>

            {submitted && (
              <div className="p-4 mb-6 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center gap-3 text-emerald-800 text-xs font-bold">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>
                  {language === 'en' ? 'Message sent via WhatsApp!' : 'تم تحويل رسالتك للواتساب بنجاح!'}
                </span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
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
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  {language === 'en' ? 'Full Name *' : 'الاسم بالكامل *'}
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder={language === 'en' ? 'Enter your name' : 'اكتب اسمك'}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:border-ym-charcoal rounded-xl text-xs font-medium outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  {language === 'en' ? 'Phone Number / WhatsApp' : 'رقم الهاتف أو الواتساب'}
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="01xxxxxxxxx"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:border-ym-charcoal rounded-xl text-xs font-medium outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  {language === 'en' ? 'Subject *' : 'موضوع الاستفسار *'}
                </label>
                <select
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:border-ym-charcoal rounded-xl text-xs font-medium outline-none transition-colors cursor-pointer"
                >
                  <option value="General Inquiry">{language === 'en' ? 'General Inquiry' : 'استفسار عام'}</option>
                  <option value="Size Consultation">{language === 'en' ? 'Size Consultation' : 'استفسار عن المقاسات'}</option>
                  <option value="Track Existing Order">{language === 'en' ? 'Track Existing Order' : 'متابعة أوردر حالي'}</option>
                  <option value="Special Sourcing Request">{language === 'en' ? 'Special Sourcing Request' : 'طلب كوتشي نادر (Sourcing)'}</option>
                  <option value="Exchange or Return">{language === 'en' ? 'Exchange or Return' : 'طلب استبدال أو استرجاع'}</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  {language === 'en' ? 'Message *' : 'نص الرسالة *'}
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder={language === 'en' ? 'How can we help you today?' : 'اكتب استفسارك بالتفصيل وسنرد عليك فوراً...'}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:border-ym-charcoal rounded-xl text-xs font-medium outline-none transition-colors"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-ym-charcoal hover:bg-black text-white text-xs font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                <Send className="w-4 h-4" />
                <span>{language === 'en' ? 'Start WhatsApp Chat' : 'إرسال ومتابعة على الواتساب'}</span>
              </button>
            </form>
          </div>

        </div>

      </div>
    </div>
  );
};
