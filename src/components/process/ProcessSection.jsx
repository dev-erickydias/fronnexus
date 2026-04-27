'use client';
import { useI18n } from '../../i18n/I18nContext';
import Reveal from '../Animation/Reveal';
import SplitWords from '../Animation/SplitWords';

// ────────────────────────────────────────────────────────────────
// ProcessSection — 4-step process timeline. Each step is a sticky-
// dot row connected by a vertical thread, revealing as you scroll.
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
          <span className="text-bridge">
            <SplitWords text={t('process.highlight')} delay={120} />
          </span>
        </h2>

        <Reveal delay={250}>
          <p className="text-lg text-[var(--mist-300)] mb-16 text-pretty">
            {t('process.intro')}
          </p>
        </Reveal>

        <ol className="relative">
          {/* Vertical thread */}
          <span
            aria-hidden="true"
            className="absolute left-[26px] top-2 bottom-2 w-px"
            style={{
              background:
                'linear-gradient(to bottom, var(--teal-500), var(--bridge-400) 50%, var(--coral-500))',
              opacity: 0.4,
            }}
          />

          {Array.isArray(steps) &&
            steps.map((step, i) => (
              <li key={step.n} className="relative pl-20 pb-12 last:pb-0">
                <Reveal kind="rise" delay={i * 80}>
                  {/* Numbered dot */}
                  <span
                    aria-hidden="true"
                    className="absolute left-0 top-0 w-[54px] h-[54px] rounded-full flex items-center justify-center font-mono text-sm font-bold"
                    style={{
                      background: 'var(--night-900)',
                      border: '1px solid var(--border-soft)',
                      color: 'var(--teal-500)',
                      boxShadow: '0 0 0 6px var(--background)',
                    }}
                  >
                    {step.n}
                  </span>

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
