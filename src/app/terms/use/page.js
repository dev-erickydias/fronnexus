'use client';
import { useI18n } from '../../../i18n/I18nContext';
import LegalLayout from '../../../components/legal/LegalLayout';

export default function TermsOfUsePage() {
  const { t } = useI18n();
  const sections = t('termsUse.sections') || [];

  return (
    <LegalLayout
      label={t('termsUse.label')}
      title={t('termsUse.title')}
      lastUpdate={t('termsUse.lastUpdate')}
      intro={t('termsUse.intro')}
      sections={Array.isArray(sections) ? sections : []}
      contactBlurb={t('termsUse.contactBlurb')}
    />
  );
}
