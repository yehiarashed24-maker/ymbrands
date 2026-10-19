import React from 'react';

export const BrandMarquee: React.FC = () => {
  // List of top global sports & streetwear brands
  const brands = [
    "NIKE", "ADIDAS", "NEW BALANCE", "PUMA", "ASICS", 
    "JORDAN", "CONVERSE", "VANS", "SALOMON", "HOKA", 
    "ON RUNNING", "REEBOK", "UNDER ARMOUR", "TIMBERLAND", 
    "THE NORTH FACE", "CARHARTT", "SUPREME", "OFF-WHITE"
  ];
  return (
    <section 
      className="w-full bg-ym-charcoal text-white py-4 sm:py-6 overflow-hidden border-y border-black/10 select-none pointer-events-none flex"
      dir="ltr"
    >
      <div className="flex shrink-0 animate-marquee min-w-full justify-around">
        {brands.map((brand, i) => (
          <div key={`a-${i}`} className="flex items-center justify-center shrink-0">
            <span className="text-xl sm:text-2xl md:text-3xl font-black font-display tracking-widest uppercase opacity-80 mx-8 md:mx-12">
              {brand}
            </span>
            <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-ym-lime opacity-80" />
          </div>
        ))}
      </div>
      <div className="flex shrink-0 animate-marquee min-w-full justify-around" aria-hidden="true">
        {brands.map((brand, i) => (
          <div key={`b-${i}`} className="flex items-center justify-center shrink-0">
            <span className="text-xl sm:text-2xl md:text-3xl font-black font-display tracking-widest uppercase opacity-80 mx-8 md:mx-12">
              {brand}
            </span>
            <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-ym-lime opacity-80" />
          </div>
        ))}
      </div>
    </section>
  );
};
