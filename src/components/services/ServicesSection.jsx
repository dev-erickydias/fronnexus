'use client';
import { useRef } from 'react';
import { useI18n } from '../../i18n/I18nContext';
import Reveal from '../Animation/Reveal';
import SplitWords from '../Animation/SplitWords';

// ────────────────────────────────────────────────────────────────
// ServicesSection — Apple-style horizontal scroll on desktop,
// vertical stack on mobile via scroll-snap. No GSAP dependency:
// uses native scroll-snap + IntersectionObserver-driven reveals.
// ────────────────────────────────────────────────────────────────

const TONE_BG = {
  web: 'linear-gradient(135deg, rgba(94,234,212,0.12), rgba(94,234,212,0.02))',
  marketing:
    'linear-gradient(135deg, rgba(255,107,107,0.12), rgba(255,107,107,0.02))',
  consulting:
    'linear-gradient(135deg, rgba(167,139,250,0.14), rgba(167,139,250,0.02))',
  analysis:
    'linear-gradient(135deg, rgba(94,234,212,0.10), rgba(167,139,250,0.10))',
};

const TONE_ACCENT = {
  web: 'var(--teal-500)',
  marketing: 'var(--coral-500)',
  consulting: 'var(--bridge-400)',
  analysis: 'var(--teal-500)',
};

export default function ServicesSection() {
  const { t } = useI18n();
  const items = t('services.items') || [];
  const trackRef = useRef(null);

  return (
    <section
      id="services"
      className="relative section-pad"
      aria-label={t('services.label')}
    >
      <div className="container-wide">
        <Reveal>
          <span className="label-tag inline-block mb-4">
            ◇ {t('services.label')}
          </span>
        </Reveal>

        <h2 className="display-lg font-display mb-6 text-balance">
          <SplitWords text={t('services.title')} />{' '}
          <SplitWords
            text={t('services.highlight')}
            splitClassName="text-bridge"
            delay={120}
          />
          <SplitWords text={t('services.after')} delay={240} />
        </h2>

        <Reveal delay={300}>
          <p className="text-lg text-[var(--mist-300)] max-w-2xl mb-16 text-pretty">
            {t('services.intro')}
          </p>
        </Reveal>
      </div>

      {/* Scrollable track */}
      <div
        ref={trackRef}
        className="relative w-full overflow-x-auto overflow-y-hidden"
        style={{
          scrollSnapType: 'x mandatory',
          scrollBehavior: 'smooth',
          paddingInline: 'clamp(20px, 4vw, 56px)',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        <div
          className="flex gap-6 pb-6"
          style={{ width: 'max-content', minWidth: '100%' }}
        >
          {Array.isArray(items) &&
            items.map((item, i) => (
              <article
                key={item.id}
                className="glass relative flex-shrink-0 p-8 sm:p-10 flex flex-col"
                style={{
                  width: 'min(86vw, 480px)',
                  scrollSnapAlign: 'center',
                  background: TONE_BG[item.id] || 'var(--glass-bg)',
                  minHeight: '460px',
                }}
              >
                <Reveal delay={i * 80}>
                  <span
                    className="label-tag inline-block mb-6"
                    style={{ color: TONE_ACCENT[item.id] }}
                  >
                    {item.tag}
                  </span>
                </Reveal>

                <h3
                  className="display-sm font-display mb-3"
                  style={{ color: TONE_ACCENT[item.id] }}
                >
                  {item.title}
                </h3>

                <p className="text-[var(--mist-100)] text-base mb-4 font-medium">
                  {item.subtitle}
                </p>

                <p className="text-[var(--mist-300)] text-sm leading-relaxed mb-6 flex-grow">
                  {item.description}
                </p>

                <ul className="space-y-2 pt-6 border-t border-[var(--border-soft)]">
                  {(item.deliverables || []).map((d, j) => (
                    <li
                      key={j}
                      className="text-sm text-[var(--mist-200)] flex items-start gap-3"
                    >
                      <span
                        aria-hidden="true"
                        className="flex-shrink-0 w-1 h-1 mt-2 rounded-full"
                        style={{ background: TONE_ACCENT[item.id] }}
                      />
                      <span>{d}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
        </div>
      </div>

      <div
        className="hidden lg:flex container-wide justify-end mt-6 text-[10px] uppercase tracking-[0.32em] text-[var(--mist-400)]"
        aria-hidden="true"
      >
        <span>← scroll horizontal →</span>
      </div>
    </section>
  );
}
