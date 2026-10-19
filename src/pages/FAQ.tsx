import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  HelpCircle, 
  ChevronDown, 
  ShieldCheck, 
  Truck, 
  CreditCard, 
  RefreshCcw, 
  MessageCircle, 
  Search,
  Sparkles 
} from 'lucide-react';
import { useLanguageStore } from '../store/languageStore';

interface FAQItem {
  id: string;
  category: 'authenticity' | 'shipping' | 'payment' | 'sourcing';
  question: {
    en: string;
    ar: string;
  };
  answer: {
    en: string;
    ar: string;
  };
}

const faqData: FAQItem[] = [
  {
    id: 'f1',
    category: 'authenticity',
    question: {
      en: 'Are all products 100% authentic original?',
      ar: 'هل جميع المنتجات أصلية 100٪ ومضمونة؟'
    },
    answer: {
      en: 'Yes, 100% guaranteed. Every sneaker and apparel piece sold at YM is authentic with factory tags, verifiable serial numbers, and barcode checks. We never sell replicas or unauthorized grades.',
      ar: 'نعم، أصلية 100٪ وبضمان كامل. كل حذاء أو قطعة ملابس معروضة على YM أصلية بالكامل بالباركود والكود التسلسلي المعتمد. لا نتعامل إطلاقاً مع التقليد أو الفيرست كوبي.'
    }
  },
  {
    id: 'f2',
    category: 'shipping',
    question: {
      en: 'How long does shipping take inside Egypt?',
      ar: 'الشحن والتوصيل بيستغرق كام يوم؟'
    },
    answer: {
      en: 'In-stock (instant) items take 2 to 3 days to arrive across Egypt. By-Order (Sourcing) items take from 30 to 35 days for international arrival.',
      ar: 'المنتجات الفوري بتاخد من يومين إلى 3 أيام للتوصيل داخل مصر. أما منتجات الباي أوردر (By-Order) بتاخد من 30 يوم إلى 35 يوم لوصولها من الخارج.'
    }
  },
  {
    id: 'f3',
    category: 'payment',
    question: {
      en: 'What payment methods do you support?',
      ar: 'ما هي طرق الدفع المتاحة في المتجر؟'
    },
    answer: {
      en: 'We accept Cash on Delivery (COD) across Egypt, and InstaPay transfers directly to 01060076900. For By-Order items, a 50% deposit is paid via InstaPay with the remaining balance due upon delivery.',
      ar: 'نوفر الدفع عند الاستلام (كاش) في جميع محافظات مصر، والدفع والتحويل عبر إنستاباي (InstaPay) على الرقم 01060076900. لمنتجات الباي أوردر يتم تحويل عربون 50% عبر إنستاباي والباقي عند الاستلام.'
    }
  },
  {
    id: 'f4',
    category: 'authenticity',
    question: {
      en: 'Can By-Order items be returned or exchanged?',
      ar: 'هل منتجات الباي أوردر (By-Order) قابلة للاسترجاع أو الاستبدال؟'
    },
    answer: {
      en: 'No, By-Order items are strictly non-refundable and non-exchangeable under any condition, as they are specifically imported and purchased from abroad upon your request and selected size.',
      ar: 'لا، منتجات الباي أوردر (By-Order) مش بترجع ولا بتستبدل نهائياً، لأنها بتطلب وتستورد مخصوص بالطلب وبالمقاس المحدد بناءً على اختيار العميل.'
    }
  },
  {
    id: 'f5',
    category: 'authenticity',
    question: {
      en: 'What is the return policy for in-stock (instant) items?',
      ar: 'هل يمكن إرجاع أو استبدال المنتجات الفوري بعد الاستلام؟'
    },
    answer: {
      en: 'For in-stock items, inspection is done with the courier at the time of delivery only. Once the courier leaves and the order is accepted, items cannot be returned or exchanged.',
      ar: 'المنتجات الفوري: المعاينة بتكون مع المندوب وقت الاستلام والتسليم فقط، وبمجرد استلام الأوردر ومغادرة المندوب المنتجات مش بترجع ولا بتستبدل.'
    }
  },
  {
    id: 'f6',
    category: 'sourcing',
    question: {
      en: 'How does the Sourcing (By-Order) service work?',
      ar: 'إزاي بتشتغل خدمة توفير القطع بالطلب (By-Order)؟'
    },
    answer: {
      en: 'If there is a rare sneaker or model not listed on our site, visit our Sourcing page or message us directly on WhatsApp (01060076900). We import it authentic for you within 30 to 35 days.',
      ar: 'لو بتدور على كوتشي نادر أو موديل مش معروض في الموقع، ادخل على صفحة Sourcing أو كلمنا مباشرة على الواتساب (01060076900)، بنوفره ونستورده لك أصلي خلال 30 إلى 35 يوم.'
    }
  }
];

export const FAQ: React.FC = () => {
  const { language } = useLanguageStore();
  const [openId, setOpenId] = useState<string | null>('f1');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'authenticity' | 'shipping' | 'payment' | 'sourcing'>('all');

  const toggleAccordion = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  const filteredFaqs = faqData.filter(item => {
    const matchesTab = activeTab === 'all' || item.category === activeTab;
    const textToSearch = `${item.question[language]} ${item.answer[language]}`.toLowerCase();
    const matchesSearch = textToSearch.includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50/50 py-12 md:py-20">
      <div className="max-w-4xl mx-auto px-5 sm:px-8">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-ym-charcoal/5 border border-ym-charcoal/10 text-xs font-black uppercase tracking-widest text-ym-charcoal mb-4">
            <HelpCircle className="w-3.5 h-3.5 text-ym-blue" />
            <span>{language === 'en' ? 'Help Center & FAQ' : 'مركز المساعدة والأسئلة الشائعة'}</span>
          </div>
          
          <h1 className="text-3xl sm:text-5xl font-black text-ym-charcoal tracking-tight font-display">
            {language === 'en' ? 'FREQUENTLY ASKED QUESTIONS' : 'الأسئلة الأكثر شيوعاً'}
          </h1>
          <p className="text-sm sm:text-base text-slate-500 font-medium mt-3 max-w-xl mx-auto">
            {language === 'en'
              ? 'Everything you need to know about authenticity, delivery across Egypt, payment, and special orders.'
              : 'كل ما تحتاج معرفته عن الأصالة، الشحن داخل محافظات مصر، طرق الدفع، وخدمة توفير الطلبات الخاصة.'}
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative mb-8 max-w-xl mx-auto">
          <Search className="w-4 h-4 text-slate-400 absolute start-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={language === 'en' ? 'Search questions (e.g. shipping, original, instapay)...' : 'ابحث في الأسئلة (مثال: الشحن، الأصالة، إنستاباي)...'}
            className="w-full ps-11 pe-4 py-3.5 bg-white border border-slate-200 focus:border-ym-charcoal rounded-2xl text-xs sm:text-sm font-medium outline-none transition-all shadow-sm"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center justify-center gap-2 flex-wrap mb-10">
          {[
            { id: 'all', label: language === 'en' ? 'All' : 'الكل' },
            { id: 'authenticity', label: language === 'en' ? 'Authenticity' : 'الأصالة والجودة' },
            { id: 'shipping', label: language === 'en' ? 'Shipping & Delivery' : 'الشحن والتوصيل' },
            { id: 'payment', label: language === 'en' ? 'Payments' : 'طرق الدفع' },
            { id: 'sourcing', label: language === 'en' ? 'Sourcing' : 'الطلب الخاص' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-ym-charcoal text-white shadow-md'
                  : 'bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-3.5 mb-14">
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq) => {
              const isOpen = openId === faq.id;
              return (
                <div
                  key={faq.id}
                  className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden transition-all duration-200 hover:border-slate-300 shadow-sm"
                >
                  <button
                    onClick={() => toggleAccordion(faq.id)}
                    className="w-full px-6 py-5 flex items-center justify-between text-start gap-4 cursor-pointer"
                  >
                    <span className="text-sm sm:text-base font-bold text-ym-charcoal font-display">
                      {faq.question[language]}
                    </span>
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center bg-slate-100 text-slate-500 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180 bg-ym-charcoal text-white' : ''}`}>
                      <ChevronDown className="w-4 h-4" />
                    </span>
                  </button>

                  {isOpen && (
                    <div className="px-6 pb-6 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 font-medium">
                      {faq.answer[language]}
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-slate-200">
              <p className="text-sm text-slate-400 font-medium">
                {language === 'en' ? 'No matching questions found.' : 'لم يتم العثور على نتائج مطابقة لبحثك.'}
              </p>
            </div>
          )}
        </div>

        {/* Need More Help Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-ym-charcoal text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-1 text-center sm:text-start">
            <h3 className="text-lg sm:text-xl font-black font-display">
              {language === 'en' ? 'Still have a question?' : 'لديك استفسار آخر لم تجد إجابته؟'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300">
              {language === 'en'
                ? 'Chat directly with our team on WhatsApp or check out our contact page.'
                : 'تحدث معنا فوراً على الواتساب أو تواصل عبر صفحة التواصل.'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="https://wa.me/201060076900"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold transition-all shadow-md cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" />
              <span>{language === 'en' ? 'WhatsApp Support' : 'تواصل عبر واتساب'}</span>
            </a>

            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all cursor-pointer"
            >
              <span>{language === 'en' ? 'Contact Us' : 'صفحة التواصل'}</span>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};
