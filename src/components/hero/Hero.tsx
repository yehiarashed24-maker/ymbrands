import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown } from 'lucide-react';
import { FloatingSneaker } from './FloatingSneaker';
import { CloudLayer } from './CloudLayer';
import { HeroTypography } from './HeroTypography';
import { FlightTag } from './FlightTag';

import heroPinkImg from '../../assets/shoes/nike-air-max-plus-pink.png';
import heroBlueImg from '../../assets/shoes/adidas-ultraboost-blue.png';

const heroProducts = [
  { id: 'hero-pink', image: heroPinkImg, accent: '#F472B6', name: { en: 'Air Max Plus "Pink Rise"' } },
  { id: 'hero-blue', image: heroBlueImg, accent: '#0EA5E9', name: { en: 'Ultraboost Cloud' } }
];

export const Hero: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [isLoaded, setIsLoaded] = useState(false);

  // Pick randomly between 0 (Pink Nike) and 1 (Blue Adidas) on mount
  useEffect(() => {
    setActiveIndex(Math.random() > 0.5 ? 1 : 0);
    setIsLoaded(true);
  }, []);

  // Direct GPU Parallax via CSS custom properties on container - ZERO layout thrash!
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let rafId: number | null = null;
    let rect = container.getBoundingClientRect();

    const updateRect = () => {
      if (container) {
        rect = container.getBoundingClientRect();
      }
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(() => {
        const w = rect.width || window.innerWidth;
        const h = rect.height || window.innerHeight;
        const x = Math.max(-1, Math.min(1, ((e.clientX - rect.left) / w) * 2 - 1));
        const y = Math.max(-1, Math.min(1, ((e.clientY - rect.top) / h) * 2 - 1));

        container.style.setProperty('--shoe-x', `${(x * 12).toFixed(1)}px`);
        container.style.setProperty('--shoe-y', `${(y * 8).toFixed(1)}px`);
        container.style.setProperty('--text-x', `${(x * -5).toFixed(1)}px`);
        container.style.setProperty('--text-y', `${(y * -3).toFixed(1)}px`);
        rafId = null;
      });
    };

    const handlePointerLeave = () => {
      container.style.setProperty('--shoe-x', '0px');
      container.style.setProperty('--shoe-y', '0px');
      container.style.setProperty('--text-x', '0px');
      container.style.setProperty('--text-y', '0px');
    };

    container.addEventListener('pointerenter', updateRect, { passive: true });
    container.addEventListener('pointermove', handlePointerMove, { passive: true });
    container.addEventListener('pointerleave', handlePointerLeave, { passive: true });
    window.addEventListener('resize', updateRect, { passive: true });

    return () => {
      container.removeEventListener('pointerenter', updateRect);
      container.removeEventListener('pointermove', handlePointerMove);
      container.removeEventListener('pointerleave', handlePointerLeave);
      window.removeEventListener('resize', updateRect);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, [isLoaded]);

  const handleScrollDown = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: 'smooth'
    });
  };

  if (!isLoaded) return null;

  const activeProduct = heroProducts[activeIndex];
  const theme = activeIndex === 0 ? 'pink' : 'blue';

  return (
    <section
      ref={containerRef}
      id="hero-section"
      className="relative w-full h-[100dvh] overflow-hidden bg-white select-none"
    >
      {/* 1. Base Sky Gradient Background (Dynamic based on theme) */}
      <div
        className={`absolute inset-0 z-0 transition-colors duration-1000 bg-gradient-to-b ${
          theme === 'pink' 
            ? 'from-pink-300 via-pink-200 to-pink-50' 
            : 'from-sky-400 via-sky-300 to-sky-100'
        }`}
      />

      {/* 2. Far Background Typography (Watermark behind everything) */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        <HeroTypography layer="watermark" />
      </div>

      {/* 3. Deep Background Clouds (Behind sneaker, gentle baseline) */}
      <div className="absolute inset-0 z-20 pointer-events-none opacity-50">
        <CloudLayer depth="far" theme={theme} />
      </div>

      {/* 4. Midground Clouds (Behind sneaker, gentle baseline) */}
      <div className="absolute inset-0 z-30 pointer-events-none opacity-70">
        <CloudLayer depth="middle" theme={theme} />
      </div>

      {/* 5. The Hero Sneaker & FlightTag (Completely in front of all clouds: z-40) */}
      <div className="absolute inset-0 z-40 flex flex-col items-center justify-center pointer-events-none">
        <div className="relative w-full max-w-4xl flex justify-center items-center h-full">
          <FloatingSneaker
            product={activeProduct as any}
            direction={1}
            onSelect={handleScrollDown}
          />
          <FlightTag />
        </div>
      </div>

      {/* 6. Main Hero Text (In front: z-50) */}
      <div className="absolute inset-0 z-50 pointer-events-none mix-blend-normal">
        <HeroTypography layer="text" />
      </div>

      {/* Scroll Down Button */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[50] flex flex-col items-center animate-bounce">
        <button
          onClick={handleScrollDown}
          className="w-11 h-11 rounded-full flex items-center justify-center bg-white/20 backdrop-blur-md border border-white/40 hover:bg-white/40 hover:scale-110 transition-all duration-300 text-white shadow-lg cursor-pointer"
          aria-label="Scroll down"
        >
          <ChevronDown className="w-5 h-5 text-ym-charcoal" />
        </button>
      </div>
    </section>
  );
};
