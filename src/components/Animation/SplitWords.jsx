'use client';
import { useEffect, useRef } from 'react';

// ────────────────────────────────────────────────────────────────
// SplitWords — renders text split into per-word spans that rise
// into view on scroll. Used for hero headlines and section titles.
//
// Why `splitClassName` exists:
//   When you wrap SplitWords with a gradient-text class like
//   `<span className="text-bridge"><SplitWords ... /></span>`, the
//   `background-clip: text` on the parent CANNOT clip across child
//   spans that have `display: inline-block` + `transform`.
//   Each child becomes its own paint layer and the gradient ends up
//   painted as a solid block, not as text-clipped fill.
//   Apply the gradient class directly per word via splitClassName
//   so each word independently owns the gradient.
// ────────────────────────────────────────────────────────────────

export default function SplitWords({
  text,
  as: Tag = 'span',
  className = '',
  splitClassName = '',
  delay = 0,
  stagger = 60,
  threshold = 0.25,
}) {
  const wrapRef = useRef(null);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return undefined;

    const reduceMotion =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const spans = el.querySelectorAll('.splitword');
    if (reduceMotion) {
      spans.forEach((s) => {
        s.style.opacity = '1';
        s.style.transform = 'translate3d(0, 0, 0)';
      });
      return undefined;
    }

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          spans.forEach((s, i) => {
            s.style.transitionDelay = `${delay + i * stagger}ms`;
            s.style.opacity = '1';
            s.style.transform = 'translate3d(0, 0, 0)';
          });
          obs.unobserve(el);
        }
      },
      { threshold },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [delay, stagger, threshold, text]);

  // Split text once on render.
  const tokens = String(text || '').split(/(\s+)/);

  return (
    <Tag ref={wrapRef} className={className}>
      {tokens.map((tok, i) => {
        if (/^\s+$/.test(tok)) return tok;
        return (
          <span
            key={i}
            className={`splitword ${splitClassName}`.trim()}
            style={{
              display: 'inline-block',
              opacity: 0,
              transform: 'translate3d(0, 0.6em, 0)',
              transition:
                'opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
              willChange: 'opacity, transform',
            }}
          >
            {tok}
          </span>
        );
      })}
    </Tag>
  );
}
