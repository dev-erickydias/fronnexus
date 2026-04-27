'use client';
import dynamic from 'next/dynamic';
import { useI18n } from '../../i18n/I18nContext';
import Reveal from '../../components/Animation/Reveal';
import SplitWords from '../../components/Animation/SplitWords';
import MagneticButton from '../../components/Animation/MagneticButton';

const CtaSecondary = dynamic(
  () => import('../../components/cta/CtaSecondary'),
  { loading: () => null },
);

const TONE = {
  Web: 'var(--teal-500)',
  Marketing: 'var(--coral-500)',
  Consultoria: 'var(--bridge-400)',
  Consulting: 'var(--bridge-400)',
  Dados: 'var(--teal-500)',
  Data: 'var(--teal-500)',
};

function PricingCard({ tier, t }) {
  const tone = TONE[tier.tag] || 'var(--teal-500)';
  return (
    <article
      className="glass relative p-7 sm:p-8 h-full flex flex-col"
      style={{
        background: tier.highlighted
          ? 'linear-gradient(135deg, rgba(94,234,212,0.10), rgba(167,139,250,0.06))'
          : 'var(--surface-card)',
        border: tier.highlighted
          ? '1px solid var(--border-glow)'
          : '1px solid var(--border-soft)',
        boxShadow: tier.highlighted
          ? '0 24px 60px rgba(0,0,0,0.45), 0 0 60px rgba(94,234,212,0.10)'
          : 'none',
      }}
    >
      {tier.highlighted && (
        <span
          className="absolute -top-3 left-7 text-[9px] font-bold tracking-[0.32em] uppercase px-3 py-1 rounded-full"
          style={{
            background: 'var(--gradient-bridge)',
            color: 'var(--night-950)',
          }}
        >
          MAIS PEDIDO
        </span>
      )}

      <div className="flex items-center justify-between mb-3">
        <span
          className="text-[10px] font-bold tracking-[0.22em] uppercase"
          style={{ color: tone }}
        >
          {tier.tag}
        </span>
      </div>

      <h3 className="font-display text-2xl mb-2 text-[var(--mist-50)]">
        {tier.name}
      </h3>
      <p className="text-sm text-[var(--mist-300)] mb-5">{tier.summary}</p>

      <div className="mb-6 flex items-baseline gap-1.5">
        <span className="text-[11px] uppercase tracking-[0.2em] text-[var(--mist-400)] mr-1">
          {t('pricing.fromLabel')}
        </span>
        <span className="font-display text-3xl text-bridge font-semibold">
          {tier.price}
        </span>
        {tier.priceSuffix && (
          <span className="text-sm text-[var(--mist-400)]">
            {tier.priceSuffix}
          </span>
        )}
      </div>

      <ul className="space-y-2.5 mb-8 flex-grow">
        {(tier.features || []).map((f, i) => (
          <li key={i} className="text-sm text-[var(--mist-200)] flex items-start gap-3">
            <span
              aria-hidden="true"
              className="flex-shrink-0 mt-1.5 w-3 h-3 rounded-full flex items-center justify-center"
              style={{ background: 'rgba(94,234,212,0.15)' }}
            >
              <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                <path
                  d="M1 4l2 2 4-5"
                  stroke={tone}
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <span>{f}</span>
          </li>
        ))}
      </ul>

      <MagneticButton
        href={`/contact?from=${encodeURIComponent(tier.id)}`}
        variant={tier.highlighted ? 'bridge' : 'ghost'}
        className="w-full justify-center"
      >
        {t('hero.primaryCta')}
        <span aria-hidden="true">→</span>
      </MagneticButton>
    </article>
  );
}

export default function PricingPage() {
  const { t } = useI18n();
  const tiers = t('pricing.tiers') || [];
  const notes = t('pricing.notes') || [];

  return (
    <main>
      {/* Hero */}
      <section className="relative pt-32 pb-12" aria-label={t('pricing.label')}>
        <div className="container-wide">
          <Reveal>
            <span className="label-tag inline-block mb-6">
              ◇ {t('pricing.label')}
            </span>
          </Reveal>

          <h1 className="display-xl font-display mb-6 max-w-4xl text-balance">
            <SplitWords text={t('pricing.title')} />{' '}
            <SplitWords
              text={t('pricing.highlight')}
              splitClassName="text-bridge"
              delay={120}
            />
            <SplitWords text={t('pricing.after')} delay={240} />
          </h1>

          <Reveal delay={300}>
            <p className="text-xl text-[var(--mist-200)] max-w-2xl text-pretty">
              {t('pricing.intro')}
            </p>
          </Reveal>
        </div>
      </section>

      {/* Pricing grid */}
      <section className="section-pad pt-12">
        <div className="container-wide">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.isArray(tiers) &&
              tiers.map((tier, i) => (
                <Reveal key={tier.id} kind="rise" delay={i * 60}>
                  <PricingCard tier={tier} t={t} />
                </Reveal>
              ))}
          </div>
        </div>
      </section>

      {/* What's always included */}
      <section className="section-pad pt-0">
        <div className="container-narrow">
          <Reveal>
            <h2 className="display-md font-display mb-8 text-balance">
              {t('pricing.noteTitle')}
            </h2>
          </Reveal>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {Array.isArray(notes) &&
              notes.map((n, i) => (
                <Reveal key={i} kind="rise" delay={i * 60}>
                  <li
                    className="glass p-5 flex items-start gap-3"
                    style={{ background: 'var(--surface-card)' }}
                  >
                    <span
                      aria-hidden="true"
                      className="flex-shrink-0 mt-1 w-5 h-5 rounded-full flex items-center justify-center"
                      style={{
                        background: 'var(--gradient-bridge)',
                        color: 'var(--night-950)',
                      }}
                    >
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                        <path
                          d="M2 5l2 2 4-5"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                    <span className="text-[var(--mist-200)] leading-relaxed">{n}</span>
                  </li>
                </Reveal>
              ))}
          </ul>
        </div>
      </section>

      {/* "Doesn't fit?" CTA */}
      <section className="section-pad pt-0">
        <div className="container-narrow">
          <div
            className="rounded-3xl p-10 sm:p-14 text-center"
            style={{
              background: 'var(--surface-card)',
              border: '1px solid var(--border-coral)',
              backdropFilter: 'blur(18px)',
            }}
          >
            <Reveal>
              <h2 className="display-md font-display mb-4">
                <span className="text-coral">{t('pricing.ctaTitle')}</span>
              </h2>
            </Reveal>
            <Reveal delay={150}>
              <p className="text-lg text-[var(--mist-200)] max-w-xl mx-auto mb-8">
                {t('pricing.ctaSub')}
              </p>
            </Reveal>
            <Reveal delay={300}>
              <MagneticButton href="/contact" variant="bridge">
                {t('pricing.ctaButton')}
                <span aria-hidden="true">→</span>
              </MagneticButton>
            </Reveal>
          </div>
        </div>
      </section>

      <CtaSecondary />
    </main>
  );
}
