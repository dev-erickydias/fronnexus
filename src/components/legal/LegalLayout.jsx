'use client';
import Link from 'next/link';
import { useI18n } from '../../i18n/I18nContext';
import Reveal from '../Animation/Reveal';
import SplitWords from '../Animation/SplitWords';

// ────────────────────────────────────────────────────────────────
// LegalLayout — shared chrome for all /terms/* sub-pages.
// Each page passes its title + intro + array of {title, body}
// sections; this component handles the hero + revealed accordion-
// of-paragraphs + bottom contact strip.
// ────────────────────────────────────────────────────────────────

export default function LegalLayout({
  label,
  title,
  highlight,
  lastUpdate,
  intro,
  sections,
  footer,
  children,
  contactBlurb,
}) {
  return (
    <main>
      <section className="relative pt-32 pb-12">
        <div className="container-narrow">
          <Reveal>
            <Link
              href="/terms"
              className="inline-flex items-center gap-2 text-sm text-[var(--mist-400)] hover:text-[var(--teal-500)] transition-colors mb-6"
            >
              ← {`Termos & Privacidade`}
            </Link>
          </Reveal>

          <Reveal delay={80}>
            <span className="label-tag inline-block mb-6">◇ {label}</span>
          </Reveal>

          <h1 className="display-lg font-display mb-6 text-balance">
            <SplitWords text={title} />
            {highlight ? (
              <>
                {' '}
                <SplitWords
                  text={highlight}
                  splitClassName="text-bridge"
                  delay={120}
                />
              </>
            ) : null}
          </h1>

          <Reveal delay={240}>
            <p className="text-sm text-[var(--mist-400)] mb-6">
              {lastUpdate}
            </p>
          </Reveal>

          {intro && (
            <Reveal delay={320}>
              <p className="text-lg text-[var(--mist-200)] leading-relaxed text-pretty mb-4">
                {intro}
              </p>
            </Reveal>
          )}
        </div>
      </section>

      {/* Sections */}
      <section className="section-pad pt-8">
        <div className="container-narrow space-y-6">
          {Array.isArray(sections) &&
            sections.map((s, i) => (
              <Reveal key={s.title} kind="rise" delay={i * 40}>
                <article
                  className="glass p-7 sm:p-8"
                  style={{ background: 'var(--surface-card)' }}
                >
                  <h2 className="font-display text-lg sm:text-xl mb-3 text-[var(--teal-500)]">
                    {s.title}
                  </h2>
                  <p className="text-[var(--mist-200)] leading-relaxed text-pretty whitespace-pre-line">
                    {s.body}
                  </p>
                </article>
              </Reveal>
            ))}

          {children}

          {footer && (
            <Reveal>
              <p className="text-sm text-[var(--mist-400)] italic text-center mt-8">
                {footer}
              </p>
            </Reveal>
          )}

          {contactBlurb && (
            <Reveal>
              <div
                className="rounded-2xl p-6 text-center mt-10"
                style={{
                  background: 'var(--surface-card)',
                  border: '1px solid var(--border-soft)',
                }}
              >
                <p className="text-[var(--mist-300)]">{contactBlurb}</p>
              </div>
            </Reveal>
          )}
        </div>
      </section>
    </main>
  );
}
