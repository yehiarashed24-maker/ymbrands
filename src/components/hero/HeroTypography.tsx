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
        <div className="absolute top-[12%] sm:top-[14%] md:top-[16%] left-0 right-0 w-full px-4 text-center flex flex-col items-center">
          {isRTL ? (
            <div className="text-center font-arabic w-full flex flex-col items-center max-w-full">
              <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white leading-tight tracking-tight drop-shadow-[0_15px_35px_rgba(0,0,0,0.25)]">
                فوق السحاب
              </h1>
            </div>
          ) : (
            <div className="text-center font-display w-full flex flex-col items-center max-w-full">
              <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white leading-tight tracking-tight drop-shadow-[0_20px_45px_rgba(0,0,0,0.25)]">
                IN THE CLOUDS
              </h1>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
