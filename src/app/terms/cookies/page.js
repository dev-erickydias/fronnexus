'use client';
import { useI18n } from '../../../i18n/I18nContext';
import LegalLayout from '../../../components/legal/LegalLayout';
import Reveal from '../../../components/Animation/Reveal';

export default function CookiePolicyPage() {
  const { t } = useI18n();
  const table = t('termsCookies.table') || [];

  return (
    <LegalLayout
      label={t('termsCookies.label')}
      title={t('termsCookies.title')}
      lastUpdate={t('termsCookies.lastUpdate')}
      intro={t('termsCookies.intro')}
      sections={[]}
      contactBlurb={t('termsCookies.contactBlurb')}
    >
      {/* Cookie inventory table */}
      <Reveal>
        <article
          className="glass p-7 sm:p-8"
          style={{ background: 'var(--surface-card)' }}
        >
          <h2 className="font-display text-lg sm:text-xl mb-5 text-[var(--teal-500)]">
            {t('termsCookies.tableTitle')}
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr
                  className="text-left text-[10px] uppercase tracking-[0.2em] text-[var(--mist-400)]"
                  style={{ borderBottom: '1px solid var(--border-soft)' }}
                >
                  <th className="py-3 pr-4 font-semibold">Nome</th>
                  <th className="py-3 pr-4 font-semibold">Tipo</th>
                  <th className="py-3 pr-4 font-semibold">Finalidade</th>
                  <th className="py-3 pr-4 font-semibold">Duração</th>
                  <th className="py-3 font-semibold">3rd-party</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(table) &&
                  table.map((row, i) => (
                    <tr
                      key={i}
                      style={{ borderBottom: '1px solid var(--border-soft)' }}
                    >
                      <td className="py-3 pr-4 font-mono text-[var(--mist-100)]">
                        {row.name}
                      </td>
                      <td className="py-3 pr-4 text-[var(--mist-200)]">
                        {row.type}
                      </td>
                      <td className="py-3 pr-4 text-[var(--mist-300)]">
                        {row.purpose}
                      </td>
                      <td className="py-3 pr-4 text-[var(--mist-300)]">
                        {row.duration}
                      </td>
                      <td className="py-3 text-[var(--mist-300)]">
                        {row.thirdParty}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </article>
      </Reveal>

      <Reveal>
        <article
          className="glass p-7 sm:p-8"
          style={{ background: 'var(--surface-card)' }}
        >
          <h2 className="font-display text-lg sm:text-xl mb-3 text-[var(--teal-500)]">
            {t('termsCookies.noticeTitle')}
          </h2>
          <p className="text-[var(--mist-200)] leading-relaxed text-pretty mb-3">
            {t('termsCookies.noticeBody')}
          </p>
          <p className="text-sm text-[var(--mist-400)]">
            {t('termsCookies.browserLinks')}
          </p>
        </article>
      </Reveal>
    </LegalLayout>
  );
}
