'use client';
import { useEffect, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import { useI18n } from '../../i18n/I18nContext';
import Reveal from '../../components/Animation/Reveal';
import SplitWords from '../../components/Animation/SplitWords';

const CtaSecondary = dynamic(
  () => import('../../components/cta/CtaSecondary'),
  { loading: () => null },
);

const CATEGORY_TONE = {
  web: 'var(--teal-500)',
  marketing: 'var(--coral-500)',
  saas: 'var(--bridge-400)',
};

export default function ProjectsPage() {
  const { t } = useI18n();
  const [state, setState] = useState({ status: 'loading', items: [] });
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    let cancelled = false;
    fetch('/api/github', { cache: 'force-cache' })
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        setState({ status: 'ready', items: data.items || [] });
      })
      .catch(() => {
        if (cancelled) return;
        setState({ status: 'error', items: [] });
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(() => {
    if (filter === 'all') return state.items;
    return state.items.filter((r) => r.category === filter);
  }, [state.items, filter]);

  const filters = ['all', 'web', 'marketing', 'saas'];

  return (
    <main>
      {/* Hero */}
      <section className="relative pt-32 pb-12 overflow-hidden" aria-label={t('showcase.label')}>
        <div className="container-wide">
          <Reveal>
            <span className="label-tag inline-block mb-6">
              ◇ {t('showcase.label')}
            </span>
          </Reveal>

          <h1 className="display-xl font-display mb-6 max-w-4xl text-balance">
            <SplitWords text={t('showcase.title')} />{' '}
            <SplitWords
              text={t('showcase.highlight')}
              splitClassName="text-bridge"
              delay={120}
            />
            <SplitWords text={t('showcase.after')} delay={240} />
          </h1>

          <Reveal delay={300}>
            <p className="text-xl text-[var(--mist-200)] max-w-2xl text-pretty mb-10">
              {t('showcase.intro')}
            </p>
          </Reveal>

          {/* Filters */}
          <Reveal delay={400}>
            <div className="flex flex-wrap gap-2">
              {filters.map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFilter(f)}
                  className="text-xs uppercase tracking-[0.22em] px-4 py-2 rounded-full border transition-all duration-300"
                  style={{
                    color:
                      filter === f
                        ? 'var(--night-950)'
                        : 'var(--mist-300)',
                    borderColor:
                      filter === f
                        ? 'var(--teal-500)'
                        : 'var(--border-soft)',
                    background:
                      filter === f
                        ? 'var(--gradient-bridge)'
                        : 'rgba(20, 27, 45, 0.4)',
                    fontWeight: filter === f ? 600 : 500,
                  }}
                >
                  {t(`showcase.filters.${f}`)}
                </button>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Grid */}
      <section className="section-pad pt-12">
        <div className="container-wide">
          {state.status === 'loading' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="h-72 glass animate-pulse"
                  aria-hidden="true"
                />
              ))}
            </div>
          )}

          {state.status === 'error' && (
            <div className="glass p-10 text-center">
              <p className="text-[var(--coral-500)]">
                {t('showcase.errorTitle')}
              </p>
            </div>
          )}

          {state.status === 'ready' && filtered.length === 0 && (
            <div className="glass p-10 text-center text-[var(--mist-300)]">
              {t('showcase.empty')}
            </div>
          )}

          {state.status === 'ready' && filtered.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((repo, idx) => {
                const tone = CATEGORY_TONE[repo.category] || 'var(--teal-500)';
                return (
                  <Reveal key={repo.id} kind="rise" delay={idx * 50}>
                    <article
                      className="glass p-7 h-full flex flex-col transition-transform duration-500 hover:-translate-y-1"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <span
                          className="text-[10px] font-bold tracking-[0.22em] uppercase px-2.5 py-1 rounded-full"
                          style={{
                            color: tone,
                            border: `1px solid ${tone}`,
                            background: 'rgba(20, 27, 45, 0.4)',
                          }}
                        >
                          {repo.category || 'web'}
                        </span>
                        {repo.stars > 0 && (
                          <span className="text-[11px] font-mono text-[var(--mist-400)]">
                            ★ {repo.stars}
                          </span>
                        )}
                      </div>

                      <h2 className="font-display text-xl mb-3 text-[var(--mist-50)]">
                        {repo.name}
                      </h2>
                      {repo.description && (
                        <p className="text-sm text-[var(--mist-300)] leading-relaxed text-pretty mb-6 flex-grow">
                          {repo.description}
                        </p>
                      )}

                      <div className="flex items-center gap-2 pt-4 border-t border-[var(--border-soft)] flex-wrap">
                        {repo.language && (
                          <span className="text-[11px] font-mono text-[var(--mist-400)]">
                            {repo.language}
                          </span>
                        )}
                        <span className="ml-auto flex gap-3">
                          {repo.homepage && (
                            <a
                              href={repo.homepage}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs font-medium text-[var(--teal-500)] hover:text-[var(--mist-50)]"
                            >
                              {t('showcase.viewLive')} ↗
                            </a>
                          )}
                          {repo.url && (
                            <a
                              href={repo.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-[var(--mist-300)] hover:text-[var(--mist-50)]"
                            >
                              {t('showcase.viewCode')}
                            </a>
                          )}
                        </span>
                      </div>
                    </article>
                  </Reveal>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <CtaSecondary />
    </main>
  );
}
