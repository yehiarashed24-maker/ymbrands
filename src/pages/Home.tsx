import React from 'react';
import { Hero } from '../components/hero/Hero';
import { BrandMarquee } from '../components/home/BrandMarquee';
import { CategoriesSection } from '../components/home/CategoriesSection';
import { SourcingSection } from '../components/home/SourcingSection';
import { TrackOrder } from '../components/home/TrackOrder';
import { TrustSection } from '../components/home/TrustSection';

export const Home: React.FC = () => {
  return (
    <div className="flex flex-col w-full">
      {/* 1. HERO (75vh-85vh, 50/50 Random Pink Nike or Blue Adidas, 2-4 Moving Colored Clouds) */}
      <Hero />

      {/* 1.5 INFINITE BRAND MARQUEE (Not clickable, shows all sports brands) */}
      <BrandMarquee />

      {/* 1.7 TRACK ORDER (Moved here for high visibility) */}
      <TrackOrder />

      {/* 2. SHOP BY CATEGORY (Exactly 4 Categories: SPORTSWEAR, SPORT SHOES, SNEAKERS, ACCESSORIES -> Gender Modal) */}
      <CategoriesSection />

      {/* 3. SOURCING / SPECIAL REQUESTS */}
      <SourcingSection />

      {/* 4. AUTHENTICITY / YM BENEFITS ("100% ORIGINAL. NO COMPROMISE.", 4 Benefits) */}
      <TrustSection />
    </div>
  );
};
