'use client';
import { useEffect } from 'react';
import Lenis from 'lenis';

// ────────────────────────────────────────────────────────────────
// LenisProvider — wraps the entire app in smooth scroll.
// Apple-style cinematic feel: 1.4s scroll duration, exponential ease.
// Respects prefers-reduced-motion automatically.
// ────────────────────────────────────────────────────────────────
export default function LenisProvider({ children }) {
  useEffect(() => {
    const reduceMotion =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduceMotion) return undefined;

    const lenis = new Lenis({
      duration: 1.35,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.6,
      infinite: false,
    });

    // Expose for any scroll-driven animation that needs raw progress.
    if (typeof window !== 'undefined') {
      window.__lenis = lenis;
    }

    let frameId;
    function raf(time) {
      lenis.raf(time);
      frameId = requestAnimationFrame(raf);
    }
    frameId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(frameId);
      lenis.destroy();
      if (typeof window !== 'undefined') {
        delete window.__lenis;
      }
    };
  }, []);

  return children;
}
