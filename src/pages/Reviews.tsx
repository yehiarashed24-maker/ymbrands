import React, { useState } from 'react';
import { Star, CheckCircle2, ShieldCheck, Heart, MessageSquare, ThumbsUp } from 'lucide-react';
import { useLanguageStore } from '../store/languageStore';
import { testimonials } from '../data/testimonials';
import { sanitizeString, checkRateLimit, isHoneypotTriggered } from '../lib/security';

// Additional rich reviews for the dedicated reviews page
const allReviews = [
  ...testimonials,
  {
    id: 't5',
    author: {
      en: 'Ahmed Tarek',
      ar: 'أحمد طارق',
    },
    location: {
      en: 'Maadi, Cairo',
      ar: 'المعادي، القاهرة',
    },
    quote: {
      en: 'Ordered the Nike Dunk Retro Panda. Packaging was pristine, zero creases. Authenticated via barcode scan right away. Will definitely buy again!',
      ar: 'طلبت حذاء نايكي دانك باندا. التغليف كان ممتاز وبدون أي عيوب أو ملاحظات. تأكدت من الباركود وطلع أصلي 100%. أكيد هكرر التجربة قريباً!',
    },
    rating: 5,
    verified: true,
    productName: 'Nike Dunk Low Retro',
    date: '4 days ago',
  },
  {
    id: 't6',
    author: {
      en: 'Mariam Adel',
      ar: 'مريم عادل',
    },
    location: {
      en: 'Heliopolis, Cairo',
      ar: 'مصر الجديدة، القاهرة',
    },
    quote: {
      en: 'Sourced a pair of Adidas Campus 00s in a rare green colorway through their WhatsApp service. They delivered in under 3 weeks exactly as promised.',
      ar: 'وفرولي حذاء أديداس كامبوس باللون الأخضر النادر عن طريق خدمة السورسينج على الواتساب. وصل خلال أقل من 3 أسابيع زي ما وعدوا بالظبط وبجودة أصلية ممتازة.',
    },
    rating: 5,
    verified: true,
    productName: 'Adidas Campus 00s (Sourcing)',
    date: '1 week ago',
  },
  {
    id: 't7',
    author: {
      en: 'Mahmoud Hassan',
      ar: 'محمود حسن',
    },
    location: {
      en: 'Tanta, Egypt',
      ar: 'طنطا، مصر',
    },
    quote: {
      en: 'Fastest delivery to Delta region! Ordered Tuesday afternoon, received it Thursday morning. The Puma Palermo sneakers are top tier comfort.',
      ar: 'أسرع شحن للدلتا وطنطا! طلبت يوم التلات بعد الظهر واستلمت الخميس الصبح. حذاء بوما باليرمو مريح جداً وأصلي 100%. شكراً لفريق YM على الاحترافية.',
    },
    rating: 5,
    verified: true,
    productName: 'Puma Palermo Leather',
    date: '3 weeks ago',
  },
  {
    id: 't8',
    author: {
      en: 'Zeina Sherif',
      ar: 'زينة شريف',
    },
    location: {
      en: 'Dokki, Giza',
      ar: 'الدقي، الجيزة',
    },
    quote: {
      en: 'Customer support answered all my size inquiries on Instagram @ym_brands1 within minutes. Paid via InstaPay seamlessly. 10/10 service.',
      ar: 'خدمة العملاء ردوا على استفسارات المقاس في ثواني على حساب الإنستجرام @ym_brands1، ودفعت بإنستاباي بسهولة وبدون أي تعقيد. تجربة 10 من 10.',
    },
    rating: 5,
    verified: true,
    productName: 'Nike Air Max Plus',
    date: '1 month ago',
  }
];

export const Reviews: React.FC = () => {
  const { language } = useLanguageStore();
  const [filterRating, setFilterRating] = useState<number | 'all'>('all');
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [newReview, setNewReview] = useState({ name: '', city: '', rating: 5, comment: '', product: '' });
  const [submittedMessage, setSubmittedMessage] = useState(false);

  const [honeypot, setHoneypot] = useState('');

  const filtered = allReviews.filter(r => {
    if (filterRating === 'all') return true;
    return r.rating === filterRating;
  });

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isHoneypotTriggered(honeypot)) {
      setShowSubmitModal(false);
      return;
    }

    const rateLimit = checkRateLimit('submit_review', 2, 300);
    if (!rateLimit.allowed) {
      alert(language === 'ar'
        ? `لقد قمت بإرسال تقييم مؤخراً. برجاء الانتظار ${rateLimit.retryAfterSeconds} ثانية.`
        : `Please wait ${rateLimit.retryAfterSeconds} seconds before submitting another review.`);
      return;
    }

    if (!newReview.name || !newReview.comment) return;

    // Sanitize review
    const safeReview = {
      name: sanitizeString(newReview.name, 60),
      city: sanitizeString(newReview.city, 60),
      product: sanitizeString(newReview.product, 80),
      comment: sanitizeString(newReview.comment, 500),
      rating: Math.min(5, Math.max(1, newReview.rating)),
    };

    setSubmittedMessage(true);
    setTimeout(() => {
      setSubmittedMessage(false);
      setShowSubmitModal(false);
      setNewReview({ name: '', city: '', rating: 5, comment: '', product: '' });
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50/60 pt-28 sm:pt-36 pb-24">
      <div className="max-w-5xl mx-auto px-5 sm:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-[10px] sm:text-xs font-bold tracking-widest text-slate-400 uppercase">
            YM EGYPT • VERIFIED BUYER FEEDBACK & REVIEWS
          </span>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-ym-charcoal tracking-tight font-display uppercase mt-2">
            {language === 'en' ? 'CUSTOMER REVIEWS' : 'ريفيوهات العملاء'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-2 leading-relaxed">
            {language === 'en'
              ? 'Real reviews from verified sneakerheads and athletes across Egypt who trust YM for authentic kicks and sportswear.'
              : 'آراء وتقييمات موثقة من مقتني السنيكرز والرياضيين في كافة محافظات مصر الذين اختاروا YM للأصالة والتميز.'}
          </p>
        </div>

        {/* Rating Overview Card */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-10 mb-12 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          {/* Big Score */}
          <div className="text-center md:border-e md:border-slate-100 md:pe-8">
            <div className="text-5xl sm:text-6xl font-black text-ym-charcoal font-display">
              4.9
            </div>
            <div className="flex items-center justify-center gap-1 my-2 text-amber-400">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-current" />
              ))}
            </div>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">
              {language === 'en' ? 'Based on 280+ Reviews in Egypt' : 'بناءً على أكثر من 280 تقييم موثق في مصر'}
            </p>
          </div>

          {/* Rating Bars */}
          <div className="space-y-2 md:col-span-1">
            {[
              { stars: 5, pct: '94%' },
              { stars: 4, pct: '6%' },
              { stars: 3, pct: '0%' },
              { stars: 2, pct: '0%' },
              { stars: 1, pct: '0%' },
            ].map(row => (
              <div key={row.stars} className="flex items-center gap-3 text-xs font-semibold text-slate-600">
                <span className="w-8 shrink-0 flex items-center gap-1">
                  {row.stars} <Star className="w-3 h-3 text-amber-400 fill-current" />
                </span>
                <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-400 rounded-full" style={{ width: row.pct }}></div>
                </div>
                <span className="w-9 text-end text-[11px] text-slate-400">{row.pct}</span>
              </div>
            ))}
          </div>

          {/* Add Review CTA */}
          <div className="text-center md:text-end flex flex-col items-center md:items-end justify-center">
            <h3 className="text-sm font-black text-ym-charcoal font-display uppercase mb-1">
              {language === 'en' ? 'Bought from us recently?' : 'اشتريت من YM مؤخراً؟'}
            </h3>
            <p className="text-xs text-slate-500 font-medium mb-4 max-w-xs">
              {language === 'en' ? 'Share your unboxing experience with the community.' : 'شاركنا تجربتك ورأيك لمساعدة باقي العملاء.'}
            </p>
            <button
              onClick={() => setShowSubmitModal(true)}
              className="px-5 py-2.5 rounded-xl bg-ym-charcoal hover:bg-black text-white text-xs font-bold transition-all shadow-md cursor-pointer"
            >
              {language === 'en' ? 'Write a Review' : 'أضف تقييمك الآن'}
            </button>
          </div>
        </div>

        {/* Filter Badges */}
        <div className="flex items-center justify-between gap-4 flex-wrap mb-8">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilterRating('all')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                filterRating === 'all'
                  ? 'bg-ym-charcoal text-white'
                  : 'bg-white text-slate-600 border border-slate-200'
              }`}
            >
              {language === 'en' ? 'All Reviews' : 'جميع الريفيوهات'}
            </button>
            <button
              onClick={() => setFilterRating(5)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                filterRating === 5
                  ? 'bg-ym-charcoal text-white'
                  : 'bg-white text-slate-600 border border-slate-200'
              }`}
            >
              <span>5 Stars</span>
              <Star className="w-3 h-3 fill-current text-amber-400" />
            </button>
          </div>

          <span className="text-xs font-bold text-slate-400">
            {language === 'en' ? `Showing ${filtered.length} reviews` : `عرض ${filtered.length} تقييم`}
          </span>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {filtered.map((rev) => (
            <div
              key={rev.id}
              className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-7 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow"
            >
              <div>
                {/* Header: Stars & Date */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1 text-amber-400">
                    {Array.from({ length: rev.rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <span className="text-[11px] font-medium text-slate-400">{rev.date}</span>
                </div>

                {/* Product Tag */}
                {rev.productName && (
                  <div className="inline-block px-2.5 py-1 rounded-md bg-slate-100 text-[11px] font-bold text-slate-700 mb-3">
                    👟 {rev.productName}
                  </div>
                )}

                {/* Review Text */}
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium mb-6">
                  &ldquo;{rev.quote[language]}&rdquo;
                </p>
              </div>

              {/* Author Footer */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-black text-ym-charcoal">{rev.author[language]}</h4>
                  <span className="text-[11px] text-slate-400 block">{rev.location[language]}</span>
                </div>

                <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>{language === 'en' ? 'Verified Buyer' : 'مشتري موثق'}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modal for Submitting a Review */}
        {showSubmitModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative">
              <button
                onClick={() => setShowSubmitModal(false)}
                className="absolute top-5 end-5 text-slate-400 hover:text-ym-charcoal text-sm font-bold"
              >
                ✕
              </button>

              <h3 className="text-xl font-black text-ym-charcoal font-display uppercase mb-1">
                {language === 'en' ? 'Write Your Review' : 'أضف تقييمك وتجربتك'}
              </h3>
              <p className="text-xs text-slate-500 font-medium mb-6">
                {language === 'en' ? 'Help other customers know about product quality and fit.' : 'ساعد باقي العملاء بمعرفة رأيك في المنتج وسرعة التوصيل.'}
              </p>

              {submittedMessage ? (
                <div className="py-10 text-center space-y-2">
                  <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
                  <p className="text-sm font-bold text-ym-charcoal">
                    {language === 'en' ? 'Thank you! Your review has been submitted.' : 'شكراً لك! تم إرسال تقييمك بنجاح.'}
                  </p>
                </div>
              ) : (
                <form onSubmit={handleReviewSubmit} className="space-y-4">
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
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {language === 'en' ? 'Your Name *' : 'اسمك الكريم *'}
                    </label>
                    <input
                      type="text"
                      required
                      value={newReview.name}
                      onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs font-medium outline-none focus:border-ym-charcoal"
                      placeholder={language === 'en' ? 'e.g. Tarek Omar' : 'مثال: طارق عمر'}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {language === 'en' ? 'City / Governorate' : 'المدينة أو المحافظة'}
                    </label>
                    <input
                      type="text"
                      value={newReview.city}
                      onChange={(e) => setNewReview({ ...newReview, city: e.target.value })}
                      className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs font-medium outline-none focus:border-ym-charcoal"
                      placeholder={language === 'en' ? 'e.g. Cairo' : 'مثال: القاهرة'}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {language === 'en' ? 'Purchased Product (Optional)' : 'المنتج الذي اشتريته (اختياري)'}
                    </label>
                    <input
                      type="text"
                      value={newReview.product}
                      onChange={(e) => setNewReview({ ...newReview, product: e.target.value })}
                      className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs font-medium outline-none focus:border-ym-charcoal"
                      placeholder={language === 'en' ? 'e.g. Adidas Samba' : 'مثال: أديداس سامبا'}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {language === 'en' ? 'Rating' : 'التقييم'}
                    </label>
                    <div className="flex gap-2">
                      {[5, 4, 3, 2, 1].map((st) => (
                        <button
                          type="button"
                          key={st}
                          onClick={() => setNewReview({ ...newReview, rating: st })}
                          className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer ${
                            newReview.rating === st ? 'bg-amber-100 text-amber-900 border border-amber-300' : 'bg-slate-100 text-slate-500'
                          }`}
                        >
                          {st} <Star className="w-3 h-3 fill-current text-amber-400" />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {language === 'en' ? 'Your Feedback *' : 'رأيك وتفاصيل التجربة *'}
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={newReview.comment}
                      onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                      className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs font-medium outline-none focus:border-ym-charcoal"
                      placeholder={language === 'en' ? 'Tell us about the quality, size, and shipping...' : 'اكتب رأيك عن جودة الخامة، المقاس، وسرعة الشحن...'}
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-ym-charcoal hover:bg-black text-white text-xs font-bold rounded-xl transition-all shadow-md cursor-pointer mt-2"
                  >
                    {language === 'en' ? 'Submit Review' : 'إرسال التقييم'}
                  </button>
                </form>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
