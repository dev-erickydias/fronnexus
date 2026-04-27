'use client';
import Link from 'next/link';
import { useMagnetic } from './hooks';

// ────────────────────────────────────────────────────────────────
// MagneticButton — wrapper that pulls toward the cursor.
// Auto-renders as <Link> when `href` is internal, <a> when external,
// or <button> when neither is provided. Pass `variant="bridge"` for
// the gradient gold; `variant="ghost"` for the outlined treatment.
// ────────────────────────────────────────────────────────────────

export default function MagneticButton({
  children,
  href,
  variant = 'bridge',
  className = '',
  onClick,
  type = 'button',
  ariaLabel,
  ...rest
}) {
  const [ref, { x, y }] = useMagnetic(10);
  const cls = `${variant === 'ghost' ? 'btn-ghost' : 'btn-bridge'} ${className}`;
  const inlineStyle = {
    transform: `translate3d(${x}px, ${y}px, 0)`,
    transition: 'transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
    display: 'inline-flex',
  };

  if (href) {
    const isExternal = /^https?:\/\//.test(href) || href.startsWith('mailto:');
    if (isExternal) {
      return (
        <span ref={ref} style={inlineStyle}>
          <a
            href={href}
            target={href.startsWith('mailto:') ? undefined : '_blank'}
            rel="noopener noreferrer"
            className={cls}
            aria-label={ariaLabel}
            {...rest}
          >
            {children}
          </a>
        </span>
      );
    }
    return (
      <span ref={ref} style={inlineStyle}>
        <Link href={href} className={cls} aria-label={ariaLabel} {...rest}>
          {children}
        </Link>
      </span>
    );
  }

  return (
    <span ref={ref} style={inlineStyle}>
      <button
        type={type}
        onClick={onClick}
        className={cls}
        aria-label={ariaLabel}
        {...rest}
      >
        {children}
      </button>
    </span>
  );
}
