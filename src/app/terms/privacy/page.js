'use client';
import { useI18n } from '../../../i18n/I18nContext';
import LegalLayout from '../../../components/legal/LegalLayout';

export default function PrivacyPolicyPage() {
  const { t } = useI18n();
  const sections = t('termsPrivacy.sections') || [];

  return (
    <LegalLayout
      label={t('termsPrivacy.label')}
      title={t('termsPrivacy.title')}
      lastUpdate={t('termsPrivacy.lastUpdate')}
      intro={t('termsPrivacy.intro')}
      sections={Array.isArray(sections) ? sections : []}
      footer={t('termsPrivacy.anpdNotice')}
      contactBlurb={t('termsPrivacy.contactBlurb')}
    />
  );
}
