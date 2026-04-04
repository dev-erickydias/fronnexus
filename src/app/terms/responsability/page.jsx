// app/terms/responsability/page.jsx
'use client';

import { useI18n } from '../../../i18n/I18nContext';

export default function TermsPage() {
  const { t } = useI18n();

  return (
    <main className="max-w-4xl mx-auto px-6 py-16 text-primary-70">
      {/* Title */}
      <header className="mb-10 text-center">
        <h1 className="text-4xl font-bold text-foreground mb-3">
          {t('terms.pageTitle')}
        </h1>
        <p className="text-sm text-primary-70">
          {t('terms.lastUpdated')} {new Date().toLocaleDateString('en-US')}
        </p>
      </header>

      {/* Section 1 */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold text-foreground mb-3">
          {t('terms.section1.title')}
        </h2>
        <p className="leading-relaxed">
          {t('terms.section1.content')}
        </p>
      </section>

      {/* Section 2 */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold text-foreground mb-3">
          {t('terms.section2.title')}
        </h2>
        <p className="leading-relaxed">
          {t('terms.section2.content')}
        </p>
      </section>

      {/* Section 3 */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold text-foreground mb-3">
          {t('terms.section3.title')}
        </h2>
        <p className="leading-relaxed">
          {t('terms.section3.content1')}
        </p>
        <p className="mt-2 leading-relaxed">
          {t('terms.section3.content2')}
        </p>
      </section>

      {/* Section 4 */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold text-foreground mb-3">
          {t('terms.section4.title')}
        </h2>
        <p className="leading-relaxed">
          {t('terms.section4.content')}
        </p>
      </section>

      {/* Section 5 */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold text-foreground mb-3">
          {t('terms.section5.title')}
        </h2>
        <p className="leading-relaxed">
          {t('terms.section5.content')}
        </p>
      </section>

      {/* Section 6 */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold text-foreground mb-3">
          {t('terms.section6.title')}
        </h2>
        <p className="leading-relaxed">
          {t('terms.section6.content')}
        </p>
      </section>

      {/* Section 7 */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold text-foreground mb-3">
          {t('terms.section7.title')}
        </h2>
        <p className="leading-relaxed">
          {t('terms.section7.content')}
        </p>
        <ul className="list-disc ml-6 mt-2">
          <li>{t('terms.section7.emailLabel')}</li>
          <li>{t('terms.section7.websiteLabel')}</li>
        </ul>
      </section>

      {/* Footer */}
      <footer className="text-center mt-16 text-sm text-primary-70 border-t border-white/10 pt-6">
        <p>&copy; {new Date().getFullYear()} {t('terms.footerCopyright')}</p>
      </footer>
    </main>
  );
}
