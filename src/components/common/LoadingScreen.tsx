import React, { useState, useEffect } from 'react';
import ymBrandsLogo from '../../assets/ym-brands-logo.png';

interface LoadingScreenProps {
  onComplete?: () => void;
  forceShow?: boolean;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete, forceShow = false }) => {
  // Instant bypass on mobile devices (< 768px or touch userAgent): 0s load, zero freeze
  const isMobile =
    typeof window !== 'undefined' &&
    (window.innerWidth < 768 ||
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));

  const [isVisible, setIsVisible] = useState(() => {
    if (forceShow) return true;
    if (isMobile) return false; // Never block mobile viewport
    try {
      const hasSeenSession = sessionStorage.getItem('ym_intro_seen');
      const hasSeenLocal = localStorage.getItem('ym_intro_seen');
      return !hasSeenSession && !hasSeenLocal;
    } catch {
      return false;
    }
  });

  const [isFading, setIsFading] = useState(false);
  const [progress, setProgress] = useState(0);

  const dismiss = () => {
    try {
      sessionStorage.setItem('ym_intro_seen', 'true');
      localStorage.setItem('ym_intro_seen', 'true');
    } catch {}
    setIsFading(true);
    setTimeout(() => {
      setIsVisible(false);
      if (onComplete) onComplete();
    }, 200);
  };

  useEffect(() => {
    if (!isVisible || isMobile) return;

    // Hard emergency safety timer: Force dismiss after max 750ms so user can NEVER get stuck
    const safetyTimer = setTimeout(() => {
      dismiss();
    }, 750);

    const startTime = performance.now();
    const duration = 600; // Snappy 600ms intro

    let frameId: number;
    const tick = (now: number) => {
      const elapsed = now - startTime;
      const pct = Math.min(100, Math.round((elapsed / duration) * 100));
      setProgress(pct);

      if (pct < 100) {
        frameId = requestAnimationFrame(tick);
      } else {
        setTimeout(dismiss, 50);
      }
    };

    frameId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frameId);
      clearTimeout(safetyTimer);
    };
  }, [isVisible, isMobile]);

  if (!isVisible || isMobile) return null;

  return (
    <div
      onClick={dismiss}
      style={{
        opacity: isFading ? 0 : 1,
        pointerEvents: isFading ? 'none' : 'auto',
        transition: 'opacity 200ms ease-out',
      }}
      className="fixed inset-0 z-[9999] bg-[#07080B] text-white flex flex-col items-center justify-center p-6 select-none overflow-hidden cursor-pointer"
    >
      {/* Subtle Ambient Background Neon Lighting */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden">
        <div className="w-[360px] sm:w-[480px] h-[360px] sm:h-[480px] rounded-full bg-ym-lime/10 blur-[130px] opacity-25" />
      </div>

      {/* Central Clean Showcase: Official Emblem Floating Purely */}
      <div className="relative flex flex-col items-center justify-center z-10 max-w-sm w-full">
        <div className="relative w-36 h-36 sm:w-44 sm:h-44 flex items-center justify-center">
          <img
            src={ymBrandsLogo}
            alt="YM BRANDS"
            className="w-full h-full object-contain pointer-events-none select-none drop-shadow-[0_0_30px_rgba(212,255,0,0.22)]"
          />
        </div>

        {/* Brand Title & Tagline */}
        <div className="mt-5 flex flex-col items-center text-center">
          <h2 className="text-sm sm:text-base font-black tracking-[0.35em] text-white uppercase font-display">
            YM BRANDS
          </h2>
          <p className="text-[10px] sm:text-xs font-bold tracking-[0.2em] text-slate-400 uppercase mt-1">
            Authentic Sportswear • Est 2018
          </p>
        </div>

        {/* Silky-Smooth Horizontal Hairline Progress Line */}
        <div className="w-48 sm:w-56 mt-6 flex flex-col items-center gap-2">
          <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden relative">
            <div
              className="h-full bg-gradient-to-r from-ym-lime to-emerald-400 rounded-full shadow-[0_0_10px_rgba(212,255,0,0.8)] will-change-[width] transition-all duration-75"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Clean Minimal Numeric Counter */}
          <div className="w-full flex items-center justify-between text-[11px] font-mono tracking-widest text-slate-400 mt-1">
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
              {progress < 45
                ? 'INITIALIZING'
                : progress < 90
                ? 'EXCLUSIVE DROP'
                : 'READY'}
            </span>
            <span className="font-black text-white">
              {progress}
              <span className="text-ym-lime ml-0.5">%</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
