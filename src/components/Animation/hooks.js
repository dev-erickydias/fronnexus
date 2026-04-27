'use client';
import { useEffect, useRef, useState } from 'react';

// ────────────────────────────────────────────────────────────────
// Animation hooks shared across the site. All respect
// prefers-reduced-motion and clean up after themselves.
// ────────────────────────────────────────────────────────────────

/**
 * useInView — fires `setVisible(true)` once when the element enters the
 * viewport. By default unobserves after first reveal (one-shot).
 */
export function useInView(options = {}) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  const { threshold = 0.18, rootMargin = '0px 0px -10% 0px', once = true } = options;

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setVisible(true);
      return undefined;
    }
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          if (once) obs.unobserve(el);
        } else if (!once) {
          setVisible(false);
        }
      },
      { threshold, rootMargin },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold, rootMargin, once]);

  return [ref, visible];
}

/**
 * useMagnetic — tracks pointer position relative to an element and
 * returns `{ x, y }` displacement (px) clamped to a max distance.
 * Apply to a wrapper; use the returned values in `transform: translate3d`.
 */
export function useMagnetic(maxDistance = 14) {
  const ref = useRef(null);
  const [coords, setCoords] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    const reduceMotion =
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return undefined;

    function onMove(e) {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / (rect.width / 2);
      const dy = (e.clientY - cy) / (rect.height / 2);
      setCoords({
        x: Math.max(-1, Math.min(1, dx)) * maxDistance,
        y: Math.max(-1, Math.min(1, dy)) * maxDistance,
      });
    }
    function onLeave() {
      setCoords({ x: 0, y: 0 });
    }

    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);
    return () => {
      el.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseleave', onLeave);
    };
  }, [maxDistance]);

  return [ref, coords];
}

/**
 * useCountUp — tweens a number from 0 to `target` once visible.
 * Returns the current value as an integer.
 */
export function useCountUp(target, { duration = 1800, threshold = 0.4 } = {}) {
  const [value, setValue] = useState(0);
  const ref = useRef(null);
  const startedRef = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    const reduceMotion =
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) {
      setValue(target);
      return undefined;
    }

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !startedRef.current) {
          startedRef.current = true;
          const start = performance.now();
          function frame(now) {
            const t = Math.min(1, (now - start) / duration);
            // ease-out quart
            const eased = 1 - Math.pow(1 - t, 4);
            setValue(Math.round(eased * target));
            if (t < 1) requestAnimationFrame(frame);
          }
          requestAnimationFrame(frame);
        }
      },
      { threshold },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [target, duration, threshold]);

  return [ref, value];
}

/**
 * useSplitText — splits a node's text into per-word spans on mount.
 * Returns the ref and a `ready` flag. Use with CSS transitions.
 */
export function useSplitText(text) {
  const ref = useRef(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const words = text.split(/(\s+)/);
    el.textContent = '';
    words.forEach((w) => {
      if (/^\s+$/.test(w)) {
        el.appendChild(document.createTextNode(w));
        return;
      }
      const span = document.createElement('span');
      span.className = 'splitword';
      span.style.display = 'inline-block';
      span.style.opacity = '0';
      span.style.transform = 'translateY(0.6em)';
      span.style.transition =
        'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)';
      span.textContent = w;
      el.appendChild(span);
    });
    setReady(true);
  }, [text]);

  return [ref, ready];
}
