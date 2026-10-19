import React from 'react';
import { Instagram, ArrowUpRight } from 'lucide-react';
import { useLanguageStore } from '../../store/languageStore';
import { translations } from '../../data/translations';

export const InstagramGrid: React.FC = () => {
  const { language } = useLanguageStore();
  const t = translations[language].sections;

  const instaPosts = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&auto=format&fit=crop&q=80',
      handle: '@cairo_sneakerhead',
      caption: 'Air Max 270 on foot in Zamalek.',
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=600&auto=format&fit=crop&q=80',
      handle: '@omar_k',
      caption: 'French Terry YM hoodie fit check.',
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1508746829417-e6f548d8d6ed?w=600&auto=format&fit=crop&q=80',
      handle: '@alex_runner',
      caption: 'Samba OG along Alexandria Corniche.',
    },
    {
      id: 4,
      image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&auto=format&fit=crop&q=80',
      handle: '@mariam_fits',
      caption: 'New Balance 530 styling.',
    },
    {
      id: 5,
      image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop&q=80',
      handle: '@egypt_baller',
      caption: 'Mercurial boots match day prep.',
    },
  ];

  return (
    <section className="py-20 sm:py-28 bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 md:px-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <span className="text-xs font-black tracking-widest text-slate-400 uppercase">
              {t.instagramSubtitle}
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-ym-charcoal tracking-tight font-display mt-1">
              {t.instagramTitle}
            </h2>
          </div>

          <a
            href="https://instagram.com/ym_brands1"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 text-xs font-black tracking-wider uppercase text-ym-charcoal hover:text-sky-600 transition-colors"
          >
            <Instagram className="w-4 h-4" />
            <span>{language === 'en' ? 'FOLLOW @ym_brands1' : 'تابعنا @ym_brands1'}</span>
            <ArrowUpRight className="w-4 h-4" />
          </a>
        </div>

        {/* 5-photo Editorial Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {instaPosts.map((post) => (
            <a
              key={post.id}
              href="https://instagram.com/ym_brands1"
              target="_blank"
              rel="noreferrer"
              className="group relative aspect-square rounded-2xl overflow-hidden bg-slate-100 cursor-pointer block"
            >
              <img
                src={post.image}
                alt={post.caption}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
                loading="lazy"
              />

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-4 text-center text-white">
                <Instagram className="w-6 h-6 text-ym-lime mb-2" />
                <span className="text-xs font-black">{post.handle}</span>
                <p className="text-[10px] text-slate-300 mt-1 line-clamp-2">{post.caption}</p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};
