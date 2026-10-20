import React from 'react';
import { useLanguageStore } from '../../store/languageStore';
import { translations } from '../../data/translations';

interface HeroTypographyProps {
  mouseOffset?: { x: number; y: number };
  layer: 'watermark' | 'text';
}

export const HeroTypography: React.FC<HeroTypographyProps> = ({ mouseOffset = { x: 0, y: 0 }, layer }) => {
  const { language, isRTL } = useLanguageStore();
  const t = translations[language].hero;

  // Parallax shift for background typography (very subtle depth)
  return (
    <div
      className="absolute inset-0 pointer-events-none select-none will-change-transform"
      style={{
        transform: 'translate3d(var(--text-x, 0px), var(--text-y, 0px), 0)',
      }}
    >
      {layer === 'watermark' && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-[28vw] md:text-[32vw] font-black tracking-[-0.08em] leading-none text-white/35 mix-blend-overlay block select-none pointer-events-none font-display">
            YM
          </span>
        </div>
      )}

      {layer === 'text' && (
        <div className="absolute top-[10%] sm:top-[12%] md:top-[14%] left-0 right-0 w-full px-4 text-center flex flex-col items-center">
          {/* Brand Tag Pill */}
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/25 backdrop-blur-md border border-white/35 text-white text-[10px] sm:text-xs font-black tracking-widest uppercase mb-2 shadow-sm drop-shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-ym-lime animate-pulse" />
            {isRTL ? 'أصلي 100٪ • إصدار حصري' : '100% AUTHENTIC • EXCLUSIVE DROP'}
          </span>

          {isRTL ? (
            <div className="text-center font-arabic w-full flex flex-col items-center max-w-full">
              <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white leading-tight tracking-tight drop-shadow-[0_15px_35px_rgba(0,0,0,0.25)]">
                فوق السحاب
              </h1>
              <p className="text-white/90 text-xs sm:text-sm md:text-base font-bold tracking-wide mt-1.5 drop-shadow-md max-w-xs sm:max-w-md">
                أحذية وستريت وير أصلية مع توصيل لجميع المحافظات
              </p>
            </div>
          ) : (
            <div className="text-center font-display w-full flex flex-col items-center max-w-full">
              <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white leading-tight tracking-normal sm:tracking-tight drop-shadow-[0_20px_45px_rgba(0,0,0,0.25)]">
                IN THE CLOUDS
              </h1>
              <p className="text-white/90 text-xs sm:text-sm md:text-base font-bold tracking-wider uppercase mt-1.5 drop-shadow-md max-w-xs sm:max-w-md">
                Original Streetwear & Sneakers In Egypt
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
