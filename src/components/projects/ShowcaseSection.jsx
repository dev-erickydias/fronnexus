'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useI18n } from '../../i18n/I18nContext';
import Reveal from '../Animation/Reveal';
import SplitWords from '../Animation/SplitWords';

// ────────────────────────────────────────────────────────────────
// ShowcaseSection — homepage section that pulls the curated GitHub
// list from /api/github (topic: fronnexus-showcase) and renders a
// Brittany-Chiang-style sticky-left list.
//
// Sticky title pinned on the left while the cards scroll on the right.
// On mobile it collapses into a clean vertical stack.
// ────────────────────────────────────────────────────────────────

const CATEGORY_PILL = {
  web: { label: 'Web', tone: 'var(--teal-500)' },
  marketing: { label: 'Marketing', tone: 'var(--coral-500)' },
  saas: { label: 'SaaS', tone: 'var(--bridge-400)' },
};

function ShowcaseCard({ repo, idx, t }) {
  return (
    <Reveal kind="rise" delay={idx * 60}>
      <article
        className="glass relative p-7 sm:p-8 transition-all duration-500"
        style={{ scrollMarginTop: '120px' }}
      >
        <div className="flex items-start justify-between gap-4 mb-3">
          <div className="flex items-center gap-3">
            {CATEGORY_PILL[repo.category] && (
              <span
                className="text-[10px] font-bold tracking-[0.22em] uppercase px-2.5 py-1 rounded-full"
                style={{
                  color: CATEGORY_PILL[repo.category].tone,
                  border: `1px solid ${CATEGORY_PILL[repo.category].tone}`,
                  background: 'rgba(20, 27, 45, 0.4)',
                }}
              >
                {CATEGORY_PILL[repo.category].label}
              </span>
            )}
            {repo.language && (
              <span className="text-[11px] font-mono text-[var(--mist-400)]">
                {repo.language}
              </span>
            )}
          </div>
          {repo.stars > 0 && (
            <span className="text-[11px] font-mono text-[var(--mist-400)]">
              ★ {repo.stars}
            </span>
          )}
        </div>

        <h3 className="font-display text-2xl sm:text-3xl mb-3 text-[var(--mist-50)]">
          {repo.name}
        </h3>

        {repo.description && (
          <p className="text-[var(--mist-300)] text-base leading-relaxed mb-6 text-pretty">
            {repo.description}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-[var(--border-soft)]">
          {repo.homepage && (
            <a
              href={repo.homepage}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-medium text-[var(--teal-500)] hover:text-[var(--mist-50)] transition-colors"
            >
              {t('showcase.viewLive')}
              <span aria-hidden="true">↗</span>
            </a>
          )}
          {repo.url && (
            <a
              href={repo.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-[var(--mist-300)] hover:text-[var(--mist-50)] transition-colors"
            >
              {t('showcase.viewCode')}
              <span aria-hidden="true">{'</>'}</span>
            </a>
          )}
        </div>
      </article>
    </Reveal>
  );
}

export default function ShowcaseSection() {
  const { t } = useI18n();
  const [state, setState] = useState({
    status: 'loading',
    items: [],
    error: null,
  });

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch('/api/github', { cache: 'force-cache' });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (cancelled) return;
        setState({
          status: 'ready',
          items: data.items || [],
          error: data.warning || null,
        });
      } catch (err) {
        if (cancelled) return;
        setState({ status: 'error', items: [], error: err.message });
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section
      id="showcase"
      className="relative section-pad"
      aria-label={t('showcase.label')}
    >
      <div className="container-wide">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Sticky left column */}
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-32">
              <Reveal>
                <span className="label-tag inline-block mb-4">
                  ◇ {t('showcase.label')}
                </span>
              </Reveal>

              <h2 className="display-lg font-display mb-6 text-balance">
                <SplitWords text={t('showcase.title')} />{' '}
                <SplitWords
                  text={t('showcase.highlight')}
                  splitClassName="text-bridge"
                  delay={120}
                />
                <SplitWords text={t('showcase.after')} delay={240} />
              </h2>

              <Reveal delay={300}>
                <p className="text-lg text-[var(--mist-300)] text-pretty mb-8">
                  {t('showcase.intro')}
                </p>
              </Reveal>

              <Reveal delay={400}>
                <Link
                  href="/projects"
                  className="btn-ghost inline-flex"
                >
                  {t('nav.projects')}
                  <span aria-hidden="true">→</span>
                </Link>
              </Reveal>
            </div>
          </div>

          {/* Cards on the right */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            {state.status === 'loading' && (
              <div className="glass p-8 text-center text-[var(--mist-400)]">
                {t('showcase.loading')}
              </div>
            )}

            {state.status === 'error' && (
              <div className="glass p-8 text-center">
                <p className="text-[var(--coral-500)] mb-3">
                  {t('showcase.errorTitle')}
                </p>
                <button
                  type="button"
                  onClick={() => setState({ ...state, status: 'loading' })}
                  className="btn-ghost"
                >
                  {t('showcase.errorRetry')}
                </button>
              </div>
            )}

            {state.status === 'ready' && state.items.length === 0 && (
              <div className="glass p-8 text-center text-[var(--mist-400)]">
                {t('showcase.empty')}
              </div>
            )}

            {state.status === 'ready' &&
              state.items.slice(0, 6).map((repo, idx) => (
                <ShowcaseCard key={repo.id} repo={repo} idx={idx} t={t} />
              ))}
          </div>
        </div>
      </div>
    </section>
  );
}
