'use client';
import { use } from 'react';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useI18n } from '../../../i18n/I18nContext';
import { findCase } from '../../../data/cases';
import Reveal from '../../../components/Animation/Reveal';
import SplitWords from '../../../components/Animation/SplitWords';
import MagneticButton from '../../../components/Animation/MagneticButton';

const TONE = {
  teal: 'var(--teal-500)',
  coral: 'var(--coral-500)',
  bridge: 'var(--bridge-400)',
};

function pickLocale(field, lang) {
  if (typeof field === 'string') return field;
  if (!field) return '';
  return field[lang] || field.pt || field.en || '';
}

export default function CasePage({ params }) {
  // Next 16 returns params as a thenable Promise. `use()` unwraps
  // it on the client without making the parent component async.
  const { slug } = use(params);
  const { t, lang } = useI18n();
  const item = findCase(slug);
  if (!item) notFound();

  return (
    <main>
      {/* Hero with cover image */}
      <section
        className="relative min-h-[80dvh] flex items-end overflow-hidden pt-32 pb-20"
        aria-label={pickLocale(item.title, lang)}
      >
        <div className="absolute inset-0">
          <Image
            src={item.cover}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-25"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(180deg, rgba(10,14,20,0.55) 0%, rgba(10,14,20,0.85) 60%, var(--night-950) 100%)',
            }}
          />
        </div>

        <div className="container-wide relative">
          <Reveal>
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 text-sm text-[var(--mist-400)] hover:text-[var(--teal-500)] transition-colors mb-6"
            >
              {t('cases.back')}
            </Link>
          </Reveal>

          <Reveal delay={120}>
            <span className="label-tag inline-block mb-6">
              ◇ {t('cases.label')}
            </span>
          </Reveal>

          <h1 className="display-lg font-display mb-6 max-w-4xl text-balance">
            <SplitWords text={pickLocale(item.title, lang)} />
          </h1>

          <Reveal delay={300}>
            <p className="text-xl text-[var(--mist-200)] max-w-2xl text-pretty mb-8">
              {pickLocale(item.summary, lang)}
            </p>
          </Reveal>

          <Reveal delay={400}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl">
              <Meta label={t('cases.industry')} value={pickLocale(item.industry, lang)} />
              <Meta label={t('cases.location')} value={item.location} />
              <Meta label={t('cases.year')} value={item.year} />
              <Meta label="Client" value={item.client} />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Problem → Approach → Outcome */}
      <section className="section-pad">
        <div className="container-narrow space-y-16">
          <Reveal>
            <div>
              <span className="label-tag inline-block mb-4 text-coral">
                ◇ {t('cases.problem')}
              </span>
              <p className="text-lg text-[var(--mist-200)] leading-relaxed text-pretty">
                {pickLocale(item.problem, lang)}
              </p>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div>
              <span className="label-tag inline-block mb-4">
                ◇ {t('cases.approach')}
              </span>
              <p className="text-lg text-[var(--mist-200)] leading-relaxed text-pretty">
                {pickLocale(item.approach, lang)}
              </p>
            </div>
          </Reveal>

          {/* Outcome metrics */}
          <Reveal delay={240}>
            <div>
              <span className="label-tag inline-block mb-6 text-bridge-color">
                ◇ {t('cases.outcome')}
              </span>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {(item.outcome || []).map((o, i) => (
                  <div
                    key={i}
                    className="glass p-7 text-center"
                    style={{ background: 'var(--surface-card)' }}
                  >
                    <div
                      className="font-display text-4xl sm:text-5xl mb-3"
                      style={{ color: TONE[o.tone] || 'var(--teal-500)' }}
                    >
                      {o.metric}
                    </div>
                    <div className="text-sm text-[var(--mist-300)] leading-snug">
                      {pickLocale(o.label, lang)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          {/* Quote */}
          {item.quote && (
            <Reveal delay={300}>
              <blockquote
                className="rounded-2xl p-10 sm:p-12"
                style={{
                  background:
                    'linear-gradient(135deg, rgba(94,234,212,0.08), rgba(167,139,250,0.06))',
                  border: '1px solid var(--border-glow)',
                }}
              >
                <p
                  className="font-accent italic text-2xl sm:text-3xl leading-snug mb-4 text-[var(--mist-50)]"
                  style={{ fontFamily: 'var(--font-accent)' }}
                >
                  &ldquo;{pickLocale(item.quote, lang)}&rdquo;
                </p>
                <footer className="text-sm text-[var(--teal-500)] font-medium">
                  {item.quote.author}
                </footer>
              </blockquote>
            </Reveal>
          )}

          {/* Stack chips */}
          {item.stack?.length > 0 && (
            <Reveal delay={360}>
              <div>
                <span className="label-tag inline-block mb-4">
                  ◇ {t('cases.stack')}
                </span>
                <div className="flex flex-wrap gap-2">
                  {item.stack.map((s) => (
                    <span
                      key={s}
                      className="text-xs font-mono px-3 py-1.5 rounded-full"
                      style={{
                        background: 'rgba(20, 27, 45, 0.55)',
                        border: '1px solid var(--border-soft)',
                        color: 'var(--mist-200)',
                      }}
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
          )}

          {/* Live + Code links */}
          <Reveal delay={420}>
            <div className="flex flex-wrap gap-3">
              {item.homepage && (
                <MagneticButton href={item.homepage} variant="bridge">
                  {t('cases.viewLive')}
                  <span aria-hidden="true">↗</span>
                </MagneticButton>
              )}
              {item.repo && (
                <MagneticButton href={item.repo} variant="ghost">
                  {t('cases.viewCode')}
                  <span aria-hidden="true">{'</>'}</span>
                </MagneticButton>
              )}
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}

function Meta({ label, value }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-[0.22em] text-[var(--mist-400)] mb-1.5">
        {label}
      </div>
      <div className="text-sm text-[var(--mist-100)] font-medium">{value}</div>
    </div>
  );
}
