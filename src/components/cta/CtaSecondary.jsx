'use client';
import { useI18n } from '../../i18n/I18nContext';
import Reveal from '../Animation/Reveal';
import MagneticButton from '../Animation/MagneticButton';

// Tighter, second CTA at the page bottom — diagnosis-focused.
export default function CtaSecondary() {
  const { t } = useI18n();

  return (
    <section className="relative section-pad pt-0" aria-labelledby="cta-secondary-title">
      <div className="container-narrow">
        <div
          className="relative overflow-hidden rounded-3xl p-10 sm:p-14 text-center"
          style={{
            background: 'var(--surface-card)',
            border: '1px solid var(--border-coral)',
            backdropFilter: 'blur(18px)',
          }}
        >
          <Reveal>
            <h2
              id="cta-secondary-title"
              className="display-md font-display mb-4 text-balance"
            >
              <span>{t('ctaSecondary.title')} </span>
              <span className="text-coral">{t('ctaSecondary.highlight')}</span>
            </h2>
          </Reveal>

          <Reveal delay={150}>
            <p className="text-lg text-[var(--mist-200)] max-w-xl mx-auto mb-8 text-pretty">
              {t('ctaSecondary.description')}
            </p>
          </Reveal>

          <Reveal delay={300}>
            <MagneticButton href="/contact" variant="bridge">
              {t('ctaSecondary.button')}
              <span aria-hidden="true">→</span>
            </MagneticButton>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
