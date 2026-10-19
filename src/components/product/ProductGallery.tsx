import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ZoomIn, ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguageStore } from '../../store/languageStore';

interface ProductGalleryProps {
  images: string[];
  productName: string;
}

export const ProductGallery: React.FC<ProductGalleryProps> = ({ images, productName }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const rectRef = useRef<DOMRect | null>(null);
  const { isRTL } = useLanguageStore();

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    rectRef.current = e.currentTarget.getBoundingClientRect();
    setIsZoomed(true);
  };

  const handleMouseLeave = () => {
    rectRef.current = null;
    setIsZoomed(false);
    if (imgRef.current) {
      imgRef.current.style.transformOrigin = 'center center';
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!rectRef.current || !imgRef.current) return;
    const rect = rectRef.current;
    const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
    const y = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));
    imgRef.current.style.transformOrigin = `${x.toFixed(1)}% ${y.toFixed(1)}%`;
  };

  const handlePrev = () => {
    setIsZoomed(false);
    setSelectedIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setIsZoomed(false);
    setSelectedIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="flex flex-col-reverse lg:flex-row gap-4 w-full select-none">
      {/* Thumbnails list */}
      <div className="flex lg:flex-col gap-3 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0 shrink-0">
        {images.map((img, idx) => (
          <button
            key={idx}
            onClick={() => setSelectedIndex(idx)}
            className={`w-18 h-18 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-slate-50 border-2 transition-all p-1.5 flex items-center justify-center shrink-0 cursor-pointer ${
              selectedIndex === idx
                ? 'border-black ring-1 ring-black shadow-sm'
                : 'border-slate-200 hover:border-slate-400 opacity-70 hover:opacity-100'
            }`}
          >
            <img
              src={img}
              alt={`${productName} view ${idx + 1}`}
              className="w-full h-full object-contain"
            />
          </button>
        ))}
      </div>

      {/* Main Showcase Image */}
      <div
        ref={containerRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseMove={handleMouseMove}
        className="relative flex-1 aspect-square sm:aspect-[4/3] lg:aspect-square bg-slate-50 rounded-3xl overflow-hidden border border-slate-100 flex items-center justify-center p-8 group cursor-crosshair transform-gpu"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedIndex}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            className="w-full h-full flex items-center justify-center"
          >
            <img
              ref={imgRef}
              src={images[selectedIndex]}
              alt={productName}
              className={`w-full h-full object-contain filter drop-shadow-md select-none will-change-transform transform-gpu transition-transform duration-200 ease-out ${
                isZoomed ? 'scale-150' : 'scale-100'
              }`}
              draggable={false}
            />
          </motion.div>
        </AnimatePresence>

        {/* Zoom Hint Pill */}
        <div className="absolute top-4 right-4 rtl:right-auto rtl:left-4 z-10 px-3 py-1.5 rounded-full bg-white/80 backdrop-blur-md border border-black/5 text-[11px] font-bold text-slate-600 flex items-center gap-1.5 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
          <ZoomIn className="w-3.5 h-3.5" />
          <span>Hover to Zoom</span>
        </div>

        {/* Mobile Navigation Arrows */}
        <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 flex items-center justify-between pointer-events-none lg:hidden">
          <button
            onClick={handlePrev}
            aria-label="Previous image"
            className="w-9 h-9 rounded-full bg-white/90 shadow-md flex items-center justify-center text-ym-charcoal pointer-events-auto cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5 rtl:rotate-180" />
          </button>
          <button
            onClick={handleNext}
            aria-label="Next image"
            className="w-9 h-9 rounded-full bg-white/90 shadow-md flex items-center justify-center text-ym-charcoal pointer-events-auto cursor-pointer"
          >
            <ChevronRight className="w-5 h-5 rtl:rotate-180" />
          </button>
        </div>
      </div>
    </div>
  );
};
