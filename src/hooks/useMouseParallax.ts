import { useState, useEffect, RefObject, useRef } from 'react';

interface ParallaxCoordinates {
  x: number; // -1 to +1
  y: number; // -1 to +1
}

export function useMouseParallax(containerRef?: RefObject<HTMLElement | null>): ParallaxCoordinates {
  const [coords, setCoords] = useState<ParallaxCoordinates>({ x: 0, y: 0 });
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(hover: none)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (rafRef.current !== null) return;

      rafRef.current = requestAnimationFrame(() => {
        let width = window.innerWidth;
        let height = window.innerHeight;
        let clientX = e.clientX;
        let clientY = e.clientY;

        if (containerRef && containerRef.current) {
          const rect = containerRef.current.getBoundingClientRect();
          width = rect.width;
          height = rect.height;
          clientX = e.clientX - rect.left;
          clientY = e.clientY - rect.top;
        }

        const targetX = Math.max(-1, Math.min(1, (clientX / width) * 2 - 1));
        const targetY = Math.max(-1, Math.min(1, (clientY / height) * 2 - 1));

        setCoords({
          x: Math.round(targetX * 100) / 100,
          y: Math.round(targetY * 100) / 100,
        });

        rafRef.current = null;
      });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [containerRef]);

  return coords;
}
