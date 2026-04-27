'use client';
import { useI18n } from '../../../i18n/I18nContext';
import Reveal from '../../../components/Animation/Reveal';

export default function TermsPage() {
  const { t } = useI18n();
  const sections = t('terms.sections') || [];

  return (
    <main>
      <section className="relative pt-32 pb-12 overflow-hidden" aria-label={t('terms.label')}>
        <div className="container-narrow">
          <Reveal>
            <span className="label-tag inline-block mb-6">
              ◇ {t('terms.label')}
            </span>
          </Reveal>

          <Reveal delay={120}>
            <h1 className="display-lg font-display mb-4 text-balance">
              {t('terms.title')}
            </h1>
          </Reveal>

          <Reveal delay={240}>
            <p className="text-sm text-[var(--mist-400)]">
              {t('terms.lastUpdate')}
            </p>
          </Reveal>
        </div>
      </section>

      <section className="section-pad pt-8">
        <div className="container-narrow space-y-10">
          {Array.isArray(sections) &&
            sections.map((s, i) => (
              <Reveal key={s.title} kind="rise" delay={i * 60}>
                <article
                  className="glass p-7 sm:p-9"
                  style={{ background: 'var(--surface-card)' }}
                >
                  <h2 className="font-display text-xl sm:text-2xl mb-3 text-[var(--mist-50)]">
                    {s.title}
                  </h2>
                  <p className="text-[var(--mist-300)] leading-relaxed text-pretty">
                    {s.body}
                  </p>
                </article>
              </Reveal>
            ))}
        </div>
      </section>
    </main>
  );
}
