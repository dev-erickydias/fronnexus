'use client';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useI18n } from '../../i18n/I18nContext';
import SplitWords from '../Animation/SplitWords';
import Reveal from '../Animation/Reveal';
import MagneticButton from '../Animation/MagneticButton';
import { useCountUp } from '../Animation/hooks';

// Three.js scene loaded only on the client — keeps SSR HTML small
// and skips the WebGL bundle on first paint.
const BridgeOrb = dynamic(() => import('./BridgeOrb'), {
  ssr: false,
  loading: () => null,
});

function Stat({ value, suffix = '', label }) {
  const [ref, current] = useCountUp(value, { duration: 1800 });
  return (
    <div ref={ref} className="flex flex-col items-start">
      <span className="font-display text-4xl sm:text-5xl tabular-nums leading-none text-bridge">
        {current}
        {suffix}
      </span>
      <span className="mt-2 text-xs uppercase tracking-[0.22em] text-[var(--mist-400)]">
        {label}
      </span>
    </div>
  );
}

export default function Hero() {
  const { t } = useI18n();

  return (
    <section
      className="relative min-h-[100dvh] flex items-center overflow-hidden"
      aria-label={t('hero.label')}
    >
      {/* 3D backdrop — absolutely positioned so text sits above */}
      <BridgeOrb />

      {/* Soft radial vignette to keep text readable over the orb */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at center, transparent 30%, rgba(10,14,20,0.6) 70%, rgba(10,14,20,0.92) 100%)',
          zIndex: 2,
        }}
      />

      <div
        className="container-wide relative w-full grid grid-cols-1 lg:grid-cols-12 gap-10 items-center pt-32 pb-24"
        style={{ zIndex: 3 }}
      >
        {/* Left — copy */}
        <div className="lg:col-span-7">
          <Reveal kind="rise" delay={0}>
            <span className="label-tag inline-block mb-6">
              ◇ {t('hero.label')}
            </span>
          </Reveal>

          <h1 className="display-xl font-display mb-6 text-balance">
            <SplitWords text={t('hero.title')} as="span" />
            <span className="block">
              <SplitWords
                text={t('hero.highlight')}
                as="span"
                splitClassName="text-bridge"
                delay={150}
              />
              <span className="text-[var(--mist-50)]">{t('hero.after')}</span>
            </span>
          </h1>

          <Reveal kind="rise" delay={500}>
            <p className="text-base sm:text-lg leading-relaxed text-[var(--mist-300)] max-w-xl mb-10 text-pretty">
              {t('hero.description')}
            </p>
          </Reveal>

          <Reveal kind="rise" delay={650}>
            <div className="flex flex-wrap gap-3">
              <MagneticButton href="/contact" variant="bridge">
                {t('hero.primaryCta')}
                <span aria-hidden="true">→</span>
              </MagneticButton>
              <MagneticButton href="/projects" variant="ghost">
                {t('hero.secondaryCta')}
              </MagneticButton>
            </div>
          </Reveal>

          {/* Stats row */}
          <Reveal kind="rise" delay={850}>
            <div className="mt-16 grid grid-cols-3 gap-6 max-w-md">
              <Stat value={20} suffix="+" label={t('hero.stats.projects')} />
              <Stat value={4} label={t('hero.stats.stack')} />
              <Stat value={100} suffix="%" label={t('hero.stats.satisfaction')} />
            </div>
          </Reveal>
        </div>

        {/* Right — empty on desktop because BridgeOrb fills it.
            On mobile the orb sits behind, so we keep flow clean. */}
        <div className="hidden lg:block lg:col-span-5" aria-hidden="true" />
      </div>

      {/* Scroll hint — bottom center */}
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 anim-pulse"
        style={{ zIndex: 4 }}
        aria-hidden="true"
      >
        <span className="text-[10px] uppercase tracking-[0.32em] text-[var(--mist-400)]">
          {t('hero.scrollHint')}
        </span>
        <span
          className="block w-px h-10"
          style={{
            background:
              'linear-gradient(to bottom, var(--teal-500), transparent)',
          }}
        />
      </div>
    </section>
  );
}
