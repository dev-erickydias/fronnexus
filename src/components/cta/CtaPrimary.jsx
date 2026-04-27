'use client';
import { useI18n } from '../../i18n/I18nContext';
import Reveal from '../Animation/Reveal';
import SplitWords from '../Animation/SplitWords';
import MagneticButton from '../Animation/MagneticButton';

// Hero-grade primary CTA — full-bleed bridge gradient backdrop with
// soft halo. Used on the home before the showcase grid.
export default function CtaPrimary() {
  const { t } = useI18n();

  return (
    <section className="relative section-pad" aria-labelledby="cta-primary-title">
      <div className="container-wide">
        <div
          className="relative overflow-hidden rounded-[28px] p-10 sm:p-16 lg:p-20"
          style={{
            background:
              'linear-gradient(135deg, rgba(94,234,212,0.10), rgba(167,139,250,0.10) 50%, rgba(255,107,107,0.08))',
            border: '1px solid var(--border-bridge)',
          }}
        >
          {/* Floating glow */}
          <div
            aria-hidden="true"
            className="absolute pointer-events-none anim-pulse"
            style={{
              top: '-30%',
              right: '-15%',
              width: '480px',
              height: '480px',
              background:
                'radial-gradient(circle, rgba(167,139,250,0.25), transparent 60%)',
              filter: 'blur(48px)',
            }}
          />

          <div className="relative max-w-2xl">
            <h2
              id="cta-primary-title"
              className="display-lg font-display mb-6 text-balance"
            >
              <SplitWords text={t('ctaPrimary.title')} />{' '}
              <SplitWords
                text={t('ctaPrimary.highlight')}
                splitClassName="text-bridge"
                delay={120}
              />
            </h2>

            <Reveal delay={300}>
              <p className="text-lg text-[var(--mist-200)] mb-10 text-pretty">
                {t('ctaPrimary.description')}
              </p>
            </Reveal>

            <Reveal delay={450}>
              <div className="flex flex-wrap gap-3">
                <MagneticButton href="/contact" variant="bridge">
                  {t('ctaPrimary.button')}
                  <span aria-hidden="true">→</span>
                </MagneticButton>
                <MagneticButton href="/projects" variant="ghost">
                  {t('ctaPrimary.secondary')}
                </MagneticButton>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
