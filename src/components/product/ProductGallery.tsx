import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  X,
  ZoomIn,
  ZoomOut,
  RotateCcw,
} from 'lucide-react';
import { useLanguageStore } from '../../store/languageStore';

interface ProductGalleryProps {
  images?: string[];
  productName: string;
}

export const ProductGallery: React.FC<ProductGalleryProps> = ({
  images = [],
  productName,
}) => {
  const safeImages = images && images.length > 0
    ? images
    : ['https://images.unsplash.com/photo-1552346154-21d32810aba3?w=800&auto=format&fit=crop&q=80'];

  const [activeIndex, setActiveIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoomScale, setZoomScale] = useState(1);
  const [panPosition, setPanPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0 });

  const mobileScrollRef = useRef<HTMLDivElement>(null);
  const { isRTL, language } = useLanguageStore();

  // Reset zoom & pan when slide changes or modal closes
  const resetZoom = useCallback(() => {
    setZoomScale(1);
    setPanPosition({ x: 0, y: 0 });
  }, []);

  const handlePrev = useCallback(() => {
    resetZoom();
    setActiveIndex((prev) => (prev === 0 ? safeImages.length - 1 : prev - 1));
  }, [safeImages.length, resetZoom]);

  const handleNext = useCallback(() => {
    resetZoom();
    setActiveIndex((prev) => (prev === safeImages.length - 1 ? 0 : prev + 1));
  }, [safeImages.length, resetZoom]);

  // Sync mobile scroll position when activeIndex changes
  const scrollToMobileIndex = (index: number) => {
    setActiveIndex(index);
    resetZoom();
    if (mobileScrollRef.current) {
      const container = mobileScrollRef.current;
      const targetChild = container.children[index] as HTMLElement;
      if (targetChild) {
        container.scrollTo({
          left: targetChild.offsetLeft,
          behavior: 'smooth',
        });
      }
    }
  };

  // Track horizontal swipe on mobile
  const handleMobileScroll = () => {
    if (!mobileScrollRef.current) return;
    const container = mobileScrollRef.current;
    const scrollLeft = container.scrollLeft;
    const width = container.clientWidth;
    if (width > 0) {
      const newIndex = Math.round(scrollLeft / width);
      if (newIndex >= 0 && newIndex < safeImages.length && newIndex !== activeIndex) {
        setActiveIndex(newIndex);
      }
    }
  };

  // Keyboard controls for fullscreen mode (Esc to close, Arrows to navigate)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isFullscreen) return;
      if (e.key === 'Escape') {
        setIsFullscreen(false);
        resetZoom();
      } else if (e.key === 'ArrowLeft') {
        isRTL ? handleNext() : handlePrev();
      } else if (e.key === 'ArrowRight') {
        isRTL ? handlePrev() : handleNext();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen, isRTL, handlePrev, handleNext, resetZoom]);

  // Prevent background scroll when fullscreen modal is open
  useEffect(() => {
    if (isFullscreen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isFullscreen]);

  // Toggle zoom in fullscreen mode (Nike / Adidas style: 1x -> 2.5x -> 1x)
  const toggleZoom = () => {
    if (zoomScale > 1) {
      resetZoom();
    } else {
      setZoomScale(2.4);
    }
  };

  // Pan / Drag handlers in zoomed fullscreen mode
  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoomScale <= 1) return;
    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX - panPosition.x,
      y: e.clientY - panPosition.y,
    };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || zoomScale <= 1) return;
    setPanPosition({
      x: e.clientX - dragStartRef.current.x,
      y: e.clientY - dragStartRef.current.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch handlers for mobile pan when zoomed
  const handleTouchStart = (e: React.TouchEvent) => {
    if (zoomScale <= 1 || e.touches.length !== 1) return;
    setIsDragging(true);
    dragStartRef.current = {
      x: e.touches[0].clientX - panPosition.x,
      y: e.touches[0].clientY - panPosition.y,
    };
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || zoomScale <= 1 || e.touches.length !== 1) return;
    setPanPosition({
      x: e.touches[0].clientX - dragStartRef.current.x,
      y: e.touches[0].clientY - dragStartRef.current.y,
    });
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  return (
    <div className="w-full select-none">
      {/* ============================================================== */}
      {/* 1. MOBILE VIEW (< lg): Nike & Adidas Style Swipeable Gallery */}
      {/* ============================================================== */}
      <div className="block lg:hidden w-full relative">
        {/* Full-width Touch Carousel */}
        <div
          ref={mobileScrollRef}
          onScroll={handleMobileScroll}
          className="w-full flex overflow-x-auto snap-x snap-mandatory scrollbar-none rounded-3xl bg-slate-50 border border-slate-100/80 shadow-sm"
          style={{ scrollSnapType: 'x mandatory', WebkitOverflowScrolling: 'touch' }}
        >
          {safeImages.map((img, idx) => (
            <div
              key={idx}
              onClick={() => {
                setActiveIndex(idx);
                setIsFullscreen(true);
              }}
              className="w-full shrink-0 snap-center aspect-square flex items-center justify-center p-6 relative cursor-pointer"
            >
              <img
                src={img}
                alt={`${productName} view ${idx + 1}`}
                className="w-full h-full object-contain filter drop-shadow-md select-none pointer-events-none"
                loading={idx === 0 ? 'eager' : 'lazy'}
              />
            </div>
          ))}
        </div>

        {/* Floating Nike-style Counter & Zoom Trigger Badge */}
        <div className="absolute top-4 right-4 rtl:right-auto rtl:left-4 z-10 flex items-center gap-2">
          {/* Zoom Hint Badge */}
          <button
            onClick={() => setIsFullscreen(true)}
            className="px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-black/5 text-ym-charcoal text-[11px] font-bold shadow-sm flex items-center gap-1.5 cursor-pointer active:scale-95 transition-transform"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span>{language === 'ar' ? 'تكبير' : 'Zoom'}</span>
          </button>

          {/* Photo Counter (e.g. 1 / 4) */}
          {safeImages.length > 1 && (
            <span className="px-2.5 py-1 rounded-full bg-black/75 backdrop-blur-md text-white text-[11px] font-black tracking-wider">
              {activeIndex + 1}/{safeImages.length}
            </span>
          )}
        </div>

        {/* Sleek Pagination Dots */}
        {safeImages.length > 1 && (
          <div className="flex items-center justify-center gap-1.5 pt-3">
            {safeImages.map((_, idx) => (
              <button
                key={idx}
                onClick={() => scrollToMobileIndex(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`transition-all duration-300 rounded-full cursor-pointer ${
                  activeIndex === idx
                    ? 'w-6 h-2 bg-black'
                    : 'w-2 h-2 bg-slate-200 hover:bg-slate-400'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* ============================================================== */}
      {/* 2. DESKTOP VIEW (>= lg): Nike Heritage Showcase + Thumbnails */}
      {/* ============================================================== */}
      <div className="hidden lg:flex gap-4 w-full items-start">
        {/* Vertical Thumbnails List on Left */}
        {safeImages.length > 1 && (
          <div className="flex flex-col gap-3 shrink-0 max-h-[580px] overflow-y-auto pr-1 scrollbar-none">
            {safeImages.map((img, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setActiveIndex(idx);
                  resetZoom();
                }}
                className={`w-20 h-20 rounded-2xl overflow-hidden bg-slate-50 border-2 transition-all p-2 flex items-center justify-center cursor-pointer ${
                  activeIndex === idx
                    ? 'border-black ring-1 ring-black shadow-sm scale-102'
                    : 'border-slate-200/80 hover:border-slate-400 opacity-65 hover:opacity-100'
                }`}
              >
                <img
                  src={img}
                  alt={`${productName} thumbnail ${idx + 1}`}
                  className="w-full h-full object-contain"
                />
              </button>
            ))}
          </div>
        )}

        {/* Main Showcase Box */}
        <div
          onClick={() => setIsFullscreen(true)}
          className="relative flex-1 aspect-square bg-slate-50 rounded-3xl overflow-hidden border border-slate-100/90 flex items-center justify-center p-10 group cursor-zoom-in shadow-sm hover:border-slate-300 transition-colors"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.2 }}
              className="w-full h-full flex items-center justify-center"
            >
              <img
                src={safeImages[activeIndex]}
                alt={productName}
                className="w-full h-full object-contain filter drop-shadow-md select-none group-hover:scale-105 transition-transform duration-300"
                draggable={false}
              />
            </motion.div>
          </AnimatePresence>

          {/* Nike Zoom Hint Badge */}
          <div className="absolute top-4 right-4 rtl:right-auto rtl:left-4 z-10 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-black/5 text-[11px] font-bold text-ym-charcoal flex items-center gap-1.5 shadow-sm opacity-90 group-hover:opacity-100 transition-opacity">
            <Maximize2 className="w-3.5 h-3.5" />
            <span>{language === 'ar' ? 'انقر لتكبير اللقطة' : 'Click to expand'}</span>
          </div>

          {/* Navigation Arrows (if multiple images) */}
          {safeImages.length > 1 && (
            <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 flex items-center justify-between pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrev();
                }}
                aria-label="Previous image"
                className="w-10 h-10 rounded-full bg-white/95 shadow-md flex items-center justify-center text-ym-charcoal hover:bg-black hover:text-white transition-colors pointer-events-auto cursor-pointer"
              >
                <ChevronLeft className="w-5 h-5 rtl:rotate-180" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleNext();
                }}
                aria-label="Next image"
                className="w-10 h-10 rounded-full bg-white/95 shadow-md flex items-center justify-center text-ym-charcoal hover:bg-black hover:text-white transition-colors pointer-events-auto cursor-pointer"
              >
                <ChevronRight className="w-5 h-5 rtl:rotate-180" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ============================================================== */}
      {/* 3. NIKE & ADIDAS FULLSCREEN INTERACTIVE ZOOM MODAL (LIGHTBOX)  */}
      {/* ============================================================== */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[9999] bg-white/98 backdrop-blur-xl flex flex-col select-none"
          >
            {/* Top Toolbar */}
            <div className="h-16 px-6 border-b border-slate-100 flex items-center justify-between shrink-0">
              {/* Product Info & Slide Counter */}
              <div className="flex items-center gap-3">
                <span className="font-black text-sm uppercase text-ym-charcoal font-display truncate max-w-[200px] sm:max-w-md">
                  {productName}
                </span>
                {safeImages.length > 1 && (
                  <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-xs font-bold">
                    {activeIndex + 1} / {safeImages.length}
                  </span>
                )}
              </div>

              {/* Zoom Controls & Close Button */}
              <div className="flex items-center gap-2">
                {/* Zoom In / Out Buttons */}
                <div className="hidden sm:flex items-center gap-1 bg-slate-100 p-1 rounded-full border border-slate-200">
                  <button
                    onClick={() => setZoomScale((prev) => Math.min(3.5, prev + 0.5))}
                    className="p-1.5 rounded-full hover:bg-white text-slate-700 hover:text-black transition-colors cursor-pointer"
                    title="Zoom In"
                  >
                    <ZoomIn className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      if (zoomScale <= 1.5) {
                        resetZoom();
                      } else {
                        setZoomScale((prev) => Math.max(1, prev - 0.5));
                      }
                    }}
                    className="p-1.5 rounded-full hover:bg-white text-slate-700 hover:text-black transition-colors cursor-pointer"
                    title="Zoom Out"
                  >
                    <ZoomOut className="w-4 h-4" />
                  </button>
                  {zoomScale > 1 && (
                    <button
                      onClick={resetZoom}
                      className="p-1.5 rounded-full hover:bg-white text-slate-700 hover:text-black transition-colors cursor-pointer"
                      title="Reset Zoom"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Close Button */}
                <button
                  onClick={() => {
                    setIsFullscreen(false);
                    resetZoom();
                  }}
                  className="w-10 h-10 rounded-full bg-slate-100 hover:bg-black hover:text-white flex items-center justify-center text-ym-charcoal transition-colors cursor-pointer"
                  aria-label="Close fullscreen"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Main Stage with Interactive Pan & Zoom */}
            <div
              className={`flex-1 relative overflow-hidden flex items-center justify-center p-4 sm:p-10 ${
                zoomScale > 1
                  ? isDragging
                    ? 'cursor-grabbing'
                    : 'cursor-grab'
                  : 'cursor-zoom-in'
              }`}
              onDoubleClick={toggleZoom}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <div
                className="w-full h-full flex items-center justify-center transition-transform duration-150 ease-out will-change-transform"
                style={{
                  transform: `scale(${zoomScale}) translate(${panPosition.x / zoomScale}px, ${panPosition.y / zoomScale}px)`,
                }}
              >
                <img
                  src={safeImages[activeIndex]}
                  alt={`${productName} view ${activeIndex + 1}`}
                  className="max-w-full max-h-[82vh] object-contain drop-shadow-2xl select-none pointer-events-none"
                  draggable={false}
                />
              </div>

              {/* Prev / Next Arrows inside Modal */}
              {safeImages.length > 1 && zoomScale === 1 && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePrev();
                    }}
                    className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/90 hover:bg-black hover:text-white shadow-xl border border-slate-100 flex items-center justify-center text-ym-charcoal transition-all cursor-pointer z-20"
                    aria-label="Previous"
                  >
                    <ChevronLeft className="w-6 h-6 rtl:rotate-180" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNext();
                    }}
                    className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/90 hover:bg-black hover:text-white shadow-xl border border-slate-100 flex items-center justify-center text-ym-charcoal transition-all cursor-pointer z-20"
                    aria-label="Next"
                  >
                    <ChevronRight className="w-6 h-6 rtl:rotate-180" />
                  </button>
                </>
              )}

              {/* Subtle Double Tap / Click Hint */}
              <div className="absolute bottom-5 inset-x-0 flex justify-center pointer-events-none">
                <span className="px-4 py-1.5 rounded-full bg-black/80 backdrop-blur-md text-white text-[11px] font-bold shadow-lg">
                  {zoomScale > 1
                    ? language === 'ar'
                      ? 'اسحب للتجول • انقر مرتين لإلغاء التكبير'
                      : 'Drag to inspect • Double tap/click to reset'
                    : language === 'ar'
                    ? 'انقر مرتين للتكبير الدقيق'
                    : 'Double click/tap to zoom up to 2.5x'}
                </span>
              </div>
            </div>

            {/* Bottom Thumbnail Strip inside Modal */}
            {safeImages.length > 1 && (
              <div className="h-20 bg-slate-50 border-t border-slate-100 flex items-center justify-center gap-3 px-4 shrink-0 overflow-x-auto">
                {safeImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setActiveIndex(idx);
                      resetZoom();
                    }}
                    className={`h-14 w-14 rounded-xl overflow-hidden border-2 transition-all p-1 bg-white cursor-pointer shrink-0 ${
                      activeIndex === idx
                        ? 'border-black ring-2 ring-black scale-105'
                        : 'border-slate-200 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`Thumb ${idx + 1}`}
                      className="w-full h-full object-contain"
                    />
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
