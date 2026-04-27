'use client';
import { useInView } from './hooks';

// ────────────────────────────────────────────────────────────────
// Reveal — declarative wrapper for scroll-into-view animation.
// Usage:
//   <Reveal>...</Reveal>                     // fade + rise
//   <Reveal kind="scale" delay={150}>...</Reveal>
//   <Reveal kind="left">...</Reveal>
// ────────────────────────────────────────────────────────────────

const KINDS = {
  rise: { from: 'translate3d(0, 32px, 0)', to: 'translate3d(0, 0, 0)' },
  scale: { from: 'scale(0.94)', to: 'scale(1)' },
  left: { from: 'translate3d(-32px, 0, 0)', to: 'translate3d(0, 0, 0)' },
  right: { from: 'translate3d(32px, 0, 0)', to: 'translate3d(0, 0, 0)' },
  fade: { from: 'translate3d(0, 0, 0)', to: 'translate3d(0, 0, 0)' },
};

export default function Reveal({
  children,
  kind = 'rise',
  delay = 0,
  className = '',
  as: Tag = 'div',
  ...rest
}) {
  const [ref, visible] = useInView();
  const variant = KINDS[kind] || KINDS.rise;

  const style = {
    opacity: visible ? 1 : 0,
    transform: visible ? variant.to : variant.from,
    transition:
      'opacity 0.9s cubic-bezier(0.16, 1, 0.3, 1), transform 0.9s cubic-bezier(0.16, 1, 0.3, 1)',
    transitionDelay: `${delay}ms`,
    willChange: 'opacity, transform',
  };

  return (
    <Tag ref={ref} style={style} className={className} {...rest}>
      {children}
    </Tag>
  );
}
