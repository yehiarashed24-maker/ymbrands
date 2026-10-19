import { Testimonial } from '../types/product';

export const testimonials: Testimonial[] = [
  {
    id: 't1',
    author: {
      en: 'Omar El-Shennawy',
      ar: 'عمر الشناوي',
    },
    location: {
      en: 'New Cairo, Egypt',
      ar: 'التجمع الخامس، القاهرة',
    },
    quote: {
      en: '100% original product, verified tags, and perfect packaging. Arrived in 48 hours to Tagamoa. Finally a trustworthy sneaker destination in Egypt.',
      ar: 'المنتج أصلي 100٪، التغليف سليم وممتاز والتسليم تم خلال 48 ساعة فقط في التجمع. أخيراً موقع سنيكرز موثوق في مصر بدون أي شك في الأصالة.',
    },
    rating: 5,
    verified: true,
    productName: 'Nike Air Max 270',
    date: '3 days ago',
  },
  {
    id: 't2',
    author: {
      en: 'Nouran Mostafa',
      ar: 'نوران مصطفى',
    },
    location: {
      en: 'Smouha, Alexandria',
      ar: 'سموحة، الإسكندرية',
    },
    quote: {
      en: 'The sizing was spot-on and the quality is exceptional. I paid Cash on Delivery after inspecting the pair at my doorstep. Highly recommended!',
      ar: 'المقاس مظبوط بالمللي والخامة ممتازة جداً. دفعت كاش عند الاستلام بعد ما عاينت الحذاء مع المندوب. تجربة تسوق راقية وبأنصح بيهم جداً.',
    },
    rating: 5,
    verified: true,
    productName: 'Adidas Samba OG',
    date: '1 week ago',
  },
  {
    id: 't3',
    author: {
      en: 'Karim Abdel-Rahman',
      ar: 'كريم عبد الرحمن',
    },
    location: {
      en: 'Sheikh Zayed, Giza',
      ar: 'الشيخ زايد، الجيزة',
    },
    quote: {
      en: 'Got the authentic Al Ahly kit and Mercurial boots before our league tournament. Premium stitching, original tags, and incredible customer support on WhatsApp.',
      ar: 'اشتريت تيشرت الأهلي الرسمي وحذاء ميركوريال قبل بداية دوري الأكاديمية. خامات أصلية بالكامل وتطريز ممتاز، وخدمة العملاء على الواتساب ردوا في ثواني.',
    },
    rating: 5,
    verified: true,
    productName: 'Nike Mercurial Superfly',
    date: '2 weeks ago',
  },
  {
    id: 't4',
    author: {
      en: 'Yasmine Fahmy',
      ar: 'ياسمين فهمي',
    },
    location: {
      en: 'Mansoura, Egypt',
      ar: 'المنصورة، مصر',
    },
    quote: {
      en: 'I ordered the French Terry oversized hoodie and NB 530s. The fabric weight feels truly luxurious. Free shipping was fast all the way to Mansoura.',
      ar: 'طلبت هودي الأوفرسايز وسنيكر نيو بالانس 530. خامة القطن الثقيلة فاخرة جداً والتوصيل كان مجاني وسريع لحد المنصورة.',
    },
    rating: 5,
    verified: true,
    productName: 'YM Heavyweight Hoodie',
    date: '2 weeks ago',
  },
];
