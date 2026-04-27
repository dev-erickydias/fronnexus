'use client';
import { useI18n } from '../../i18n/I18nContext';
import Reveal from '../Animation/Reveal';
import SplitWords from '../Animation/SplitWords';

// ────────────────────────────────────────────────────────────────
// ProcessSection — 4-step process timeline. Each step is a row
// with a numbered dot on the left connected by a vertical thread.
//
// Layout fixes from v1:
// - `list-style: none` on the <ol> so the browser default markers
//   don't ghost-overlap the custom numbered dots
// - Dot lives directly on the <li> (not inside Reveal) so the
//   absolute positioning is unambiguously scoped to the li
// - Dot vertical position: top: 0.4rem (~6px) lines it up with the
//   visual baseline of the first line of the title at text-2xl/3xl
// - 96px left padding (pl-24) gives a 28px breathing gap between
//   the dot's outer-shadow ring (54+12=66px) and the title content
// ────────────────────────────────────────────────────────────────

export default function ProcessSection() {
  const { t } = useI18n();
  const steps = t('process.steps') || [];

  return (
    <section
      id="process"
      className="relative section-pad"
      aria-label={t('process.label')}
    >
      <div className="container-narrow">
        <Reveal>
          <span className="label-tag inline-block mb-4">
            ◇ {t('process.label')}
          </span>
        </Reveal>

        <h2 className="display-lg font-display mb-6 text-balance">
          <SplitWords text={t('process.title')} />{' '}
          <SplitWords
            text={t('process.highlight')}
            splitClassName="text-bridge"
            delay={120}
          />
        </h2>

        <Reveal delay={250}>
          <p className="text-lg text-[var(--mist-300)] mb-16 text-pretty">
            {t('process.intro')}
          </p>
        </Reveal>

        <ol className="relative" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {/* Vertical thread — sits on the dot center line at x=27px
              (54px dot / 2 = 27 from the li's padding-left=0 edge) */}
          <span
            aria-hidden="true"
            className="absolute top-3 bottom-3 w-px"
            style={{
              left: '27px',
              background:
                'linear-gradient(to bottom, var(--teal-500), var(--bridge-400) 50%, var(--coral-500))',
              opacity: 0.4,
            }}
          />

          {Array.isArray(steps) &&
            steps.map((step, i) => (
              <li
                key={step.n}
                className="relative pl-24 pb-12 last:pb-0"
                style={{ minHeight: '66px' }}
              >
                {/* Numbered dot — positioned on the <li> directly so the
                    absolute scoping is the list row, not the inner Reveal */}
                <span
                  aria-hidden="true"
                  className="absolute w-[54px] h-[54px] rounded-full flex items-center justify-center font-mono text-sm font-bold"
                  style={{
                    left: 0,
                    top: '0.4rem',
                    background: 'var(--night-900)',
                    border: '1px solid var(--border-soft)',
                    color: 'var(--teal-500)',
                    boxShadow: '0 0 0 6px var(--background)',
                    zIndex: 1,
                  }}
                >
                  {step.n}
                </span>

                <Reveal kind="rise" delay={i * 80}>
                  <h3 className="font-display text-2xl sm:text-3xl mb-3 text-[var(--mist-50)]">
                    {step.title}
                  </h3>
                  <p className="text-[var(--mist-300)] leading-relaxed text-pretty">
                    {step.description}
                  </p>
                </Reveal>
              </li>
            ))}
        </ol>
      </div>
    </section>
  );
}
