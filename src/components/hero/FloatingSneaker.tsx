import React from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { Product } from '../../types/product';

interface FloatingSneakerProps {
  product: Product;
  direction: number; // +1 for next, -1 for prev
  mouseOffset?: { x: number; y: number };
  onSelect?: () => void;
}

export const FloatingSneaker: React.FC<FloatingSneakerProps> = ({
  product,
  direction,
  mouseOffset = { x: 0, y: 0 },
  onSelect,
}) => {
  // Gentle, rock-steady mouse parallax coordinates (no jitter/shaking)
  const mouseX = mouseOffset.x * 14;
  const mouseY = mouseOffset.y * 10;

  // Variants for AnimatePresence product switching
  const variants: Variants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 180 : -180,
      opacity: 0,
      scale: 0.94,
      filter: 'blur(4px)',
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      filter: 'blur(0px)',
      transition: {
        x: { type: 'spring' as const, stiffness: 220, damping: 26 },
        opacity: { duration: 0.35 },
        scale: { duration: 0.4 },
        filter: { duration: 0.25 },
      },
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -180 : 180,
      opacity: 0,
      scale: 0.94,
      filter: 'blur(4px)',
      transition: {
        duration: 0.3,
        ease: [0.32, 0, 0.67, 0],
      },
    }),
  };

  return (
    <div className="relative z-[25] flex flex-col items-center justify-center pointer-events-none select-none w-full max-w-[92vw] sm:max-w-[75vw] md:max-w-[62vw] lg:max-w-[50vw]">
      {/* Ambient Color Halo */}
      <div
        className="absolute w-[70%] h-[70%] rounded-full blur-[50px] md:blur-[70px] pointer-events-none opacity-40 transition-colors duration-700 ease-out"
        style={{
          background: `radial-gradient(circle, ${product.accent} 0%, rgba(255,255,255,0) 70%)`,
        }}
      />

      {/* Smooth Parallax Wrapper (Direct GPU CSS Variables, zero lag) */}
      <div
        className="relative w-full flex items-center justify-center will-change-transform transform-gpu"
        style={{
          transform: 'translate3d(var(--shoe-x, 0px), var(--shoe-y, 0px), 0)',
        }}
      >
        {/* Continuous Smooth Weightless Float Animation */}
        <div className="relative w-full flex flex-col items-center justify-center animate-float-slow transform-gpu">
          <AnimatePresence custom={direction} mode="wait">
            <motion.div
              key={product.id}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              className="relative w-full flex items-center justify-center pointer-events-auto cursor-pointer transform-gpu"
              onClick={onSelect}
            >
              {/* Main Cutout Sneaker (Clean 100% transparent PNG, no square border) */}
              <img
                src={product.image}
                alt={product.name.en}
                className="w-full h-auto object-contain max-h-[46vh] sm:max-h-[52vh] md:max-h-[58vh] lg:max-h-[64vh] filter drop-shadow-xl select-none will-change-transform transform-gpu"
                loading="eager"
                draggable={false}
              />
            </motion.div>
          </AnimatePresence>

          {/* Smooth Dynamic Shadow Beneath Shoe */}
          <div className="w-[65%] h-6 sm:h-9 -mt-3 sm:-mt-6 rounded-[100%] bg-gradient-to-r from-transparent via-black/25 to-transparent blur-md animate-float-shadow pointer-events-none will-change-transform transform-gpu" />
        </div>
      </div>
    </div>
  );
};
