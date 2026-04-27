'use client';
import Link from 'next/link';
import { useI18n } from '../../i18n/I18nContext';
import Reveal from '../../components/Animation/Reveal';
import SplitWords from '../../components/Animation/SplitWords';

// /terms — landing page that links to all three legal documents.
export default function TermsIndexPage() {
  const { t } = useI18n();
  const cards = t('termsIndex.cards') || [];

  return (
    <main>
      <section className="relative pt-32 pb-12">
        <div className="container-narrow">
          <Reveal>
            <span className="label-tag inline-block mb-6">
              ◇ {t('termsIndex.label')}
            </span>
          </Reveal>

          <h1 className="display-lg font-display mb-6 text-balance">
            <SplitWords text={t('termsIndex.title')} />{' '}
            <SplitWords
              text={t('termsIndex.highlight')}
              splitClassName="text-bridge"
              delay={120}
            />
          </h1>

          <Reveal delay={240}>
            <p className="text-sm text-[var(--mist-400)] mb-6">
              {t('termsIndex.lastUpdate')}
            </p>
          </Reveal>

          <Reveal delay={320}>
            <p className="text-lg text-[var(--mist-200)] leading-relaxed text-pretty">
              {t('termsIndex.intro')}
            </p>
          </Reveal>
        </div>
      </section>

      <section className="section-pad pt-12">
        <div className="container-narrow grid grid-cols-1 md:grid-cols-3 gap-6">
          {Array.isArray(cards) &&
            cards.map((card, i) => (
              <Reveal key={card.id} kind="rise" delay={i * 80}>
                <Link
                  href={card.href}
                  className="glass p-7 sm:p-8 h-full flex flex-col group transition-transform duration-500 hover:-translate-y-1"
                  style={{ background: 'var(--surface-card)' }}
                >
                  <h2 className="font-display text-xl mb-3 text-[var(--mist-50)]">
                    {card.title}
                  </h2>
                  <p className="text-sm text-[var(--mist-300)] leading-relaxed text-pretty flex-grow mb-4">
                    {card.summary}
                  </p>
                  <span className="text-sm text-[var(--teal-500)] mt-auto inline-flex items-center gap-1">
                    Ler →
                  </span>
                </Link>
              </Reveal>
            ))}
        </div>
      </section>
    </main>
  );
}
