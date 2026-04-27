'use client';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useI18n } from '../../i18n/I18nContext';
import Reveal from '../../components/Animation/Reveal';
import SplitWords from '../../components/Animation/SplitWords';

const ProcessSection = dynamic(
  () => import('../../components/process/ProcessSection'),
  { loading: () => null },
);
const CtaPrimary = dynamic(() => import('../../components/cta/CtaPrimary'), {
  loading: () => null,
});

// Unsplash backdrops chosen for the brand: warm light, abstract bridges,
// connection imagery. Configured in next.config.mjs remotePatterns.
const BACKDROP =
  'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1600&q=80';

export default function AboutPage() {
  const { t } = useI18n();
  const values = t('about.values.items') || [];

  return (
    <main>
      {/* ── Hero ─────────────────────────────────── */}
      <section
        className="relative min-h-[80dvh] flex items-end overflow-hidden pt-32 pb-20"
        aria-label={t('about.label')}
      >
        <div className="absolute inset-0">
          <Image
            src={BACKDROP}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-30"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(180deg, rgba(10,14,20,0.5) 0%, rgba(10,14,20,0.85) 60%, var(--night-950) 100%)',
            }}
          />
        </div>

        <div className="container-wide relative">
          <Reveal>
            <span className="label-tag inline-block mb-6">
              ◇ {t('about.label')}
            </span>
          </Reveal>

          <h1 className="display-xl font-display mb-6 max-w-4xl text-balance">
            <SplitWords text={t('about.title')} />{' '}
            <span className="text-bridge">
              <SplitWords text={t('about.highlight')} delay={120} />
            </span>
          </h1>

          <Reveal delay={300}>
            <p className="text-xl text-[var(--mist-200)] max-w-2xl text-pretty">
              {t('about.intro')}
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── Story (split-scroll narrative) ────────── */}
      <section className="section-pad" aria-label={t('about.story.title')}>
        <div className="container-wide">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-5">
              <div className="lg:sticky lg:top-32">
                <Reveal>
                  <span className="label-tag inline-block mb-4">
                    ◇ {t('about.story.title')}
                  </span>
                </Reveal>
                <Reveal delay={150}>
                  <h2 className="display-md font-display text-balance">
                    {t('about.story.title')}
                  </h2>
                </Reveal>
              </div>
            </div>
            <div className="lg:col-span-7 space-y-8">
              <Reveal>
                <p className="text-lg text-[var(--mist-200)] leading-relaxed text-pretty">
                  {t('about.story.p1')}
                </p>
              </Reveal>
              <Reveal delay={120}>
                <p className="text-lg text-[var(--mist-200)] leading-relaxed text-pretty">
                  {t('about.story.p2')}
                </p>
              </Reveal>
              <Reveal delay={240}>
                <p className="text-lg text-[var(--mist-200)] leading-relaxed text-pretty">
                  {t('about.story.p3')}
                </p>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ── Values ──────────────────────────────── */}
      <section className="section-pad pt-0" aria-label={t('about.values.title')}>
        <div className="container-wide">
          <Reveal>
            <h2 className="display-md font-display mb-12 text-balance">
              {t('about.values.title')}
            </h2>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Array.isArray(values) &&
              values.map((v, i) => (
                <Reveal key={v.title} kind="rise" delay={i * 80}>
                  <article
                    className="glass p-8 sm:p-10 h-full"
                    style={{
                      background:
                        i % 2 === 0
                          ? 'linear-gradient(135deg, rgba(94,234,212,0.06), rgba(20,27,45,0.55))'
                          : 'linear-gradient(135deg, rgba(255,107,107,0.06), rgba(20,27,45,0.55))',
                    }}
                  >
                    <span
                      className="label-tag block mb-4"
                      style={{
                        color:
                          i % 2 === 0 ? 'var(--teal-500)' : 'var(--coral-500)',
                      }}
                    >
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <h3 className="font-display text-2xl mb-3 text-[var(--mist-50)]">
                      {v.title}
                    </h3>
                    <p className="text-[var(--mist-300)] leading-relaxed text-pretty">
                      {v.description}
                    </p>
                  </article>
                </Reveal>
              ))}
          </div>
        </div>
      </section>

      {/* ── Process + CTA ───────────────────────── */}
      <ProcessSection />
      <CtaPrimary />
    </main>
  );
}
